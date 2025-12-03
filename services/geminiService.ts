
import { GoogleGenAI, Type } from "@google/genai";
import { 
  FoodItem, 
  UserPreferences,
} from "../types";
import { 
  generateFallbackMeal, 
  generateFallbackWeeklyPlan, 
  generateFallbackShoppingList, 
  generateFallbackAnalytics,
  generateFallbackInventoryAnalysis
} from "./fallback/fallbackEngine";

const apiKey = "AIzaSyAVTl2ip-3Ed4vcjdDcAZm-Pty8YixmtG0";

// --- Schemas (Kept for Type consistency in AI calls) ---
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
          reason: { type: Type.STRING },
        },
        required: ["food", "estimated_cost", "reason"],
      },
    },
    total_meal_cost: { type: Type.NUMBER },
    within_budget: { type: Type.BOOLEAN },
    message: { type: Type.STRING },
  },
  required: ["meal_type", "suggestions", "total_meal_cost", "within_budget"],
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
                cost: { type: Type.NUMBER },
              },
              required: ["meal_type", "name", "cost"],
            }
          },
          day_total: { type: Type.NUMBER }
        },
        required: ["day", "meals"],
      }
    },
    total_cost: { type: Type.NUMBER },
    within_budget: { type: Type.BOOLEAN }
  },
  required: ["weekly_plan", "total_cost", "within_budget"],
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
        },
        required: ["item", "quantity", "reason"],
      }
    },
    estimated_total_cost: { type: Type.NUMBER }
  },
  required: ["shopping_list", "estimated_total_cost"],
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    cheap_meal_options: { type: Type.ARRAY, items: { type: Type.STRING } },
    ways_to_extend_inventory: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommended_additions: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["cheap_meal_options", "ways_to_extend_inventory", "recommended_additions"],
};

const analyticsSchema = {
  type: Type.OBJECT,
  properties: {
    weekly_spending_trend: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { day: { type: Type.STRING }, amount: { type: Type.NUMBER } }
      }
    },
    category_breakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { category: { type: Type.STRING }, percentage: { type: Type.NUMBER } }
      }
    },
    projected_savings: { type: Type.NUMBER },
    price_alerts: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["weekly_spending_trend", "category_breakdown", "projected_savings", "price_alerts"]
};

// --- Orchestrator ---

type Action = 'suggest_meal' | 'weekly_plan' | 'shopping_list' | 'analyze_inventory' | 'get_analytics';

// Layer 2: Placeholder for Backup AI Model
async function callBackupAI(action: Action, payload: any): Promise<any> {
    // In a production environment, this would call OpenRouter, Groq, or another API.
    // For now, we simulate a failure here to drop through to the robust local fallback.
    throw new Error("Backup AI service not configured");
}

export const runAIAction = async (
  action: Action,
  payload: {
    preferences: UserPreferences,
    inventory: FoodItem[],
    context?: any
  }
): Promise<any> => {
  
  // LAYER 1: ATTEMPT GEMINI AI
  try {
    if (!apiKey) throw new Error("API Key is missing.");

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-1.5-flash"; 
    const inventoryStr = payload.inventory.map(i => `- ${i.name} (${i.cost} KES)`).join("\n");

    let prompt = "";
    let schema: any;

    // Prompt construction
    switch (action) {
      case 'suggest_meal':
        prompt = `
          ACTION: suggest_meal
          Budget: KES ${payload.preferences.budget}
          Diet: ${payload.preferences.dietType}
          Time: ${payload.context.currentTime}
          Type: ${payload.context.mealType}
          Inventory: ${inventoryStr}
          Task: Suggest ONE meal for a Kenyan user. Focus on affordability.
        `;
        schema = mealResponseSchema;
        break;

      case 'weekly_plan':
        prompt = `
          ACTION: weekly_plan
          Weekly Budget: KES ${payload.preferences.weeklyBudget}
          Meals/Day: ${payload.preferences.mealsPerDay}
          Diet: ${payload.preferences.dietType}
          Inventory: ${inventoryStr}
          Task: Generate a 7-day meal plan (Mon-Sun).
        `;
        schema = weeklyPlanSchema;
        break;

      case 'shopping_list':
        const plan = payload.context.weeklyPlan || [];
        const planSummary = JSON.stringify(plan).substring(0, 1000); // Truncate to save tokens
        prompt = `
          ACTION: shopping_list
          Plan Summary: ${planSummary}
          Inventory: ${inventoryStr}
          Task: Create a shopping list.
        `;
        schema = shoppingListSchema;
        break;

      case 'analyze_inventory':
        prompt = `ACTION: analyze_inventory Inventory: ${inventoryStr}`;
        schema = analysisSchema;
        break;
        
      case 'get_analytics':
        prompt = `ACTION: get_analytics Budget: KES ${payload.preferences.weeklyBudget}`;
        schema = analyticsSchema;
        break;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are MealMind Kenya. Output STRICT JSON.",
        maxOutputTokens: 8000, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.warn(`[MealMind Reliability] Layer 1 (Gemini) Failed for action: ${action}. Reason:`, error);

    // LAYER 2: ATTEMPT BACKUP AI (Placeholder)
    try {
        return await callBackupAI(action, payload);
    } catch (backupError) {
        console.warn(`[MealMind Reliability] Layer 2 (Backup AI) Failed. Switching to Local Fallback Engine.`);
    }

    // LAYER 3 & 4: LOCAL FALLBACK ENGINE
    // We catch ANY error (API limit, Network, Parsing) and return local rule-based results.
    // This ensures the user NEVER sees an error screen.
    
    // Simulate network delay for realism (optional)
    await new Promise(resolve => setTimeout(resolve, 600));

    switch (action) {
      case 'suggest_meal':
        return generateFallbackMeal(
          payload.preferences, 
          payload.context?.mealType || 'Auto', 
          payload.inventory
        );
      
      case 'weekly_plan':
        return generateFallbackWeeklyPlan(payload.preferences);

      case 'shopping_list':
        return generateFallbackShoppingList(payload.inventory);

      case 'get_analytics':
        return generateFallbackAnalytics(payload.preferences);

      case 'analyze_inventory':
        return generateFallbackInventoryAnalysis();
      
      default:
        throw new Error("Unknown action");
    }
  }
};
