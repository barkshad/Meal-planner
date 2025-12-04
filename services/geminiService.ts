
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
  generateFallbackRecipe
} from "./fallback/fallbackEngine";

// --- Schemas ---

const mealResponseSchema = {
  type: Type.OBJECT,
  properties: {
    meal_type: { type: Type.STRING },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          food: { type: Type.STRING },
          estimated_cost: { type: Type.NUMBER },
          reason: { type: Type.STRING }
        }
      }
    },
    total_meal_cost: { type: Type.NUMBER },
    within_budget: { type: Type.BOOLEAN },
    message: { type: Type.STRING }
  },
  required: ["meal_type", "suggestions", "total_meal_cost", "within_budget", "message"]
};

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

const recipeResponseSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.NUMBER },
          instruction: { type: Type.STRING },
        },
        required: ["step", "instruction"],
      },
    },
    estimated_cost_ksh: { type: Type.NUMBER },
    cook_time_minutes: { type: Type.NUMBER },
    category: { type: Type.STRING },
  },
  required: ["id", "title", "ingredients", "steps", "estimated_cost_ksh", "cook_time_minutes", "category"],
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
    const inventoryStr = (payload.inventory || []).map(i => `- ${i.name} (${i.cost} KES)`).join("\n");

    let prompt = "";
    let schema: any;

    // Prompt construction
    switch (action) {
      case 'suggest_meal':
        prompt = `
          ACTION: suggest_meal
          STRICT BUDGET RULE: Total meal cost MUST be <= KES ${payload.preferences.budget}.
          If you cannot find a meal strictly under ${payload.preferences.budget}, try to find the absolute cheapest edible meal possible but flag it as over budget.
          
          User Budget: KES ${payload.preferences.budget}
          Diet: ${payload.preferences.dietType}
          Current Inventory: 
          ${inventoryStr}
          
          Task: Suggest ONE Kenyan meal for ${payload.context?.mealType || 'any time'} that prioritizes the user's budget.
        `;
        schema = mealResponseSchema;
        break;

      case 'weekly_plan':
        prompt = `
          ACTION: weekly_plan
          STRICT BUDGET RULE: Total weekly cost MUST be <= KES ${payload.preferences.weeklyBudget}.
          Weekly Budget: KES ${payload.preferences.weeklyBudget}
          Diet: ${payload.preferences.dietType}
          Task: Create a 7-day Kenyan meal plan (Breakfast, Lunch, Dinner).
        `;
        schema = weeklyPlanSchema;
        break;

      case 'shopping_list':
        prompt = `
          ACTION: shopping_list
          Current Inventory:
          ${inventoryStr}
          Task: What essentials are missing for a standard Kenyan week?
        `;
        schema = shoppingListSchema;
        break;

      case 'analyze_inventory':
        prompt = `
          ACTION: analyze_inventory
          Inventory:
          ${inventoryStr}
          Task: Suggest cheap meals I can make NOW, how to extend these items, and what 3 cheap things I should add.
        `;
        schema = analysisSchema;
        break;
        
      case 'get_analytics':
        prompt = `
          ACTION: get_analytics
          Budget: ${payload.preferences.budget}
          Task: Generate simulated spending data and market alerts for Nairobi.
        `;
        schema = analyticsSchema;
        break;

      case 'generate_recipe':
        prompt = `
          ACTION: generate_recipe
          STRICT BUDGET RULE: Recipe cost MUST be <= KES ${payload.context.budget}.
          User Budget: KES ${payload.context.budget}
          Available Time: ${payload.context.time} minutes
          User has these ingredients: ${payload.context.ingredients}
          Task: Generate a simple, single Kenyan recipe that fits these constraints. ID must be unique string.
        `;
        schema = recipeResponseSchema;
        break;
    }
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are MealMind Kenya. Output STRICT JSON. Respect Budgets STRICTLY.",
        maxOutputTokens: 8000, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    // --- CRITICAL VALIDATION LAYER ---
    // If AI hallucinates a price that is too high, reject it and fallback to Guaranteed Engine.
    
    if (action === 'suggest_meal') {
      const budgetLimit = payload.preferences.budget;
      // Allow 5% margin of error for AI
      if (parsed.total_meal_cost > budgetLimit * 1.05) { 
        console.warn(`AI Violation: Suggestion (KES ${parsed.total_meal_cost}) exceeds budget (KES ${budgetLimit}). Fallback triggered.`);
        throw new Error("AI Budget Violation");
      }
    }
    
    if (action === 'generate_recipe') {
      const budgetLimit = payload.context.budget;
      if (parsed.estimated_cost_ksh > budgetLimit * 1.05) {
        console.warn(`AI Violation: Recipe (KES ${parsed.estimated_cost_ksh}) exceeds budget (KES ${budgetLimit}). Fallback triggered.`);
        throw new Error("AI Budget Violation");
      }
    }

    if (action === 'weekly_plan') {
       if (parsed.total_cost > payload.preferences.weeklyBudget * 1.1) {
          console.warn("AI Violation: Weekly plan exceeds budget. Fallback triggered.");
          throw new Error("AI Budget Violation");
       }
    }

    return parsed;

  } catch (error) {
    console.warn(`[MealMind Reliability] Layer 1 (Gemini) Failed or Budget Violated for action: ${action}. Reason:`, error);
    
    // GUARANTEED FALLBACK ROUTING
    // This ensures that even if AI fails, we return a valid, budget-conscious result from our expanded database.
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Small artificial delay for UX smoothness

    switch (action) {
      case 'suggest_meal':
        return generateFallbackMeal(
          payload.preferences, 
          payload.context?.mealType || MealType.LUNCH, 
          payload.inventory || []
        );
      
      case 'weekly_plan':
        return generateFallbackWeeklyPlan(payload.preferences);

      case 'shopping_list':
        return generateFallbackShoppingList(payload.inventory || []);

      case 'get_analytics':
        return generateFallbackAnalytics(payload.preferences);

      case 'analyze_inventory':
        return generateFallbackInventoryAnalysis();
      
      case 'generate_recipe':
        return generateFallbackRecipe(
          payload.context.budget,
          payload.context.time,
          (payload.context.ingredients || "").split(',').map((i: string) => i.trim())
        );

      default:
        throw new Error("Unknown action");
    }
  }
};
