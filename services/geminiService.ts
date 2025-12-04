import { GoogleGenAI, Type } from "@google/genai";
import { 
  FoodItem, 
  UserPreferences,
  MealType
} from "../types";
import { 
  generateFallbackMeal, 
  generateFallbackWeeklyPlan, 
  generateFallbackShoppingList, 
  generateFallbackAnalytics,
  generateFallbackInventoryAnalysis,
  generateFallbackRecipe,
  selectMealsFromDatabase,
  getValidMeals
} from "./fallback/fallbackEngine";
import { OFFLINE_RECIPES } from "./fallback/offlineRecipes";

// --- Schemas ---

const mealSelectionSchema = {
  type: Type.OBJECT,
  properties: {
    selected_recipe_id: { type: Type.STRING },
    reason_for_selection: { type: Type.STRING },
    price_verification: { type: Type.NUMBER }
  },
  required: ["selected_recipe_id", "reason_for_selection", "price_verification"]
};

// Reuse other schemas...
const weeklyPlanSchema = {
  type: Type.OBJECT,
  properties: {
    weekly_plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                meal_type: { type: Type.STRING },
                name: { type: Type.STRING },
                cost: { type: Type.NUMBER }
              }
            }
          },
          day_total: { type: Type.NUMBER }
        }
      }
    },
    total_cost: { type: Type.NUMBER },
    within_budget: { type: Type.BOOLEAN }
  }
};

const shoppingListSchema = {
  type: Type.OBJECT,
  properties: {
    shopping_list: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          quantity: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    },
    estimated_total_cost: { type: Type.NUMBER }
  }
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    cheap_meal_options: { type: Type.ARRAY, items: { type: Type.STRING } },
    ways_to_extend_inventory: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommended_additions: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

const analyticsSchema = {
  type: Type.OBJECT,
  properties: {
    weekly_spending_trend: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          amount: { type: Type.NUMBER }
        }
      }
    },
    category_breakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          percentage: { type: Type.NUMBER }
        }
      }
    },
    projected_savings: { type: Type.NUMBER },
    price_alerts: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

// --- Orchestrator ---

type Action = 'suggest_meal' | 'weekly_plan' | 'shopping_list' | 'analyze_inventory' | 'get_analytics' | 'generate_recipe';

export const runAIAction = async (
  action: Action,
  payload: {
    preferences: UserPreferences,
    inventory: FoodItem[],
    context?: any
  }
): Promise<any> => {
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = "gemini-2.5-flash"; 
    const inventoryStr = (payload.inventory || []).map(i => `- ${i.name}`).join("\n");

    // --- PRE-SELECTION LOGIC ---
    // Instead of asking AI to generate, we filter the DB first.
    
    if (action === 'suggest_meal') {
      // 1. Get Candidates
      let candidates = selectMealsFromDatabase(
        payload.preferences.budget, 
        payload.context?.mealType, 
        payload.preferences.dietType
      );

      // 2. If no strict matches, use the Guaranteed Fallback logic locally first
      // This prevents sending empty lists to Gemini
      if (candidates.length === 0) {
        console.warn("No strict matches found in DB. Triggering local guarantee engine.");
        return generateFallbackMeal(payload.preferences, payload.context?.mealType || MealType.AUTO, payload.inventory);
      }

      // 3. Prepare Prompt with LIMITED Candidates (Random Shuffle + Slice to avoid context overflow)
      // We send simplified data to save tokens.
      const shuffled = candidates.sort(() => 0.5 - Math.random()).slice(0, 20);
      const candidateListJSON = JSON.stringify(shuffled.map(r => ({
        id: r.id,
        title: r.title,
        cost: r.estimated_cost_ksh,
        ingredients: r.ingredients
      })));

      const prompt = `
        ACTION: SELECT_MEAL_FROM_LIST
        
        INSTRUCTIONS:
        1. You are a meal selector. You do NOT create recipes.
        2. You MUST select ONE recipe from the "Available Candidates" list below.
        3. Choose the best match based on the User's Inventory and Preferences.
        4. Your choice MUST have a cost <= ${payload.preferences.budget}.
        
        USER INVENTORY:
        ${inventoryStr}
        
        USER PREFERENCES:
        - Budget: KES ${payload.preferences.budget}
        - Diet: ${payload.preferences.dietType}
        - Desired Type: ${payload.context?.mealType || 'Any'}
        
        AVAILABLE CANDIDATES (JSON):
        ${candidateListJSON}
        
        TASK: Return the 'selected_recipe_id' of the best match and a 'reason_for_selection'.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: mealSelectionSchema,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      
      // 4. Hydrate Result
      const selectedId = parsed.selected_recipe_id;
      const fullRecipe = OFFLINE_RECIPES.find(r => r.id === selectedId);

      if (!fullRecipe) {
        throw new Error("AI selected an ID that does not exist in the DB.");
      }

      return {
        meal_type: payload.context?.mealType || fullRecipe.category,
        suggestions: [{
          food: fullRecipe.title,
          estimated_cost: fullRecipe.estimated_cost_ksh,
          reason: parsed.reason_for_selection
        }],
        total_meal_cost: fullRecipe.estimated_cost_ksh,
        within_budget: fullRecipe.estimated_cost_ksh <= payload.preferences.budget,
        auto_adjusted: false,
        message: "AI Selected from Database"
      };
    }

    if (action === 'generate_recipe') {
      // 1. Find best match in DB for these specific ingredients
      // We re-use suggest logic but constrained by specific ingredients context
      const budget = payload.context.budget;
      const candidates = selectMealsFromDatabase(budget); // loose type
      const shuffled = candidates.slice(0, 30);
      
      const prompt = `
        ACTION: FIND_MATCHING_RECIPE
        
        INSTRUCTIONS:
        1. Select the recipe that best uses these user ingredients: ${payload.context.ingredients}
        2. MUST be from the provided list.
        3. Max Budget: ${budget}
        
        AVAILABLE RECIPES:
        ${JSON.stringify(shuffled.map(r => ({id: r.id, title: r.title, ingredients: r.ingredients, cost: r.estimated_cost_ksh})))}
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: mealSelectionSchema,
        },
      });
      
      const parsed = JSON.parse(response.text || "{}");
      const fullRecipe = OFFLINE_RECIPES.find(r => r.id === parsed.selected_recipe_id);
      
      if (!fullRecipe) throw new Error("Recipe not found");
      return fullRecipe;
    }

    // --- OTHER ACTIONS (Use Standard Generation or Fallback if simple) ---
    
    let prompt = "";
    let schema: any;

    switch (action) {
      case 'weekly_plan':
        prompt = `
          ACTION: weekly_plan
          STRICT BUDGET RULE: Total weekly cost MUST be <= KES ${payload.preferences.weeklyBudget}.
          Weekly Budget: KES ${payload.preferences.weeklyBudget}
          Diet: ${payload.preferences.dietType}
          Task: Create a 7-day Kenyan meal plan. Use standard Kenyan meals (Ugali, Skuma, Rice, Beans, Chapati).
        `;
        schema = weeklyPlanSchema;
        break;

      case 'shopping_list':
        prompt = `
          ACTION: shopping_list
          Inventory: ${inventoryStr}
          Task: Essentials missing for a Kenyan week?
        `;
        schema = shoppingListSchema;
        break;

      case 'analyze_inventory':
        prompt = `
          ACTION: analyze_inventory
          Inventory: ${inventoryStr}
          Task: Cheap meal ideas from this?
        `;
        schema = analysisSchema;
        break;
        
      case 'get_analytics':
        prompt = `ACTION: get_analytics`;
        schema = analyticsSchema;
        break;
    }
    
    if (prompt) {
       const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      const text = response.text;
      if (!text) throw new Error("No response");
      return JSON.parse(text);
    }

  } catch (error) {
    console.warn(`[MealMind] Fallback Triggered for ${action}`, error);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (action) {
      case 'suggest_meal':
        return generateFallbackMeal(
          payload.preferences, 
          payload.context?.mealType || MealType.LUNCH, 
          payload.inventory || []
        );
      case 'generate_recipe':
        return generateFallbackRecipe(payload.context.budget, payload.context.time, []);
      case 'weekly_plan':
        return generateFallbackWeeklyPlan(payload.preferences);
      case 'shopping_list':
        return generateFallbackShoppingList(payload.inventory || []);
      case 'get_analytics':
        return generateFallbackAnalytics(payload.preferences);
      case 'analyze_inventory':
        return generateFallbackInventoryAnalysis();
      default:
        throw new Error("Unknown action");
    }
  }
};
