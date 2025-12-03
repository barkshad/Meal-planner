
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { 
  FoodItem, 
  MealResponse, 
  WeeklyPlanResponse, 
  ShoppingListResponse, 
  InventoryAnalysisResponse,
  UserPreferences,
  DailyPlan,
  AnalyticsData
} from "../types";

// Using the provided API key directly
const apiKey = "AIzaSyAVTl2ip-3Ed4vcjdDcAZm-Pty8YixmtG0";

// --- Schemas ---

const mealResponseSchema: Schema = {
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

const weeklyPlanSchema: Schema = {
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
        required: ["day", "meals", "day_total"],
      }
    },
    total_cost: { type: Type.NUMBER },
    within_budget: { type: Type.BOOLEAN }
  },
  required: ["weekly_plan", "total_cost", "within_budget"],
};

const shoppingListSchema: Schema = {
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

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cheap_meal_options: { type: Type.ARRAY, items: { type: Type.STRING } },
    ways_to_extend_inventory: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommended_additions: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["cheap_meal_options", "ways_to_extend_inventory", "recommended_additions"],
};

const analyticsSchema: Schema = {
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
}

// --- Helper to run AI ---

type Action = 'suggest_meal' | 'weekly_plan' | 'shopping_list' | 'analyze_inventory' | 'get_analytics';

const getSystemInstruction = () => `
You are the backend intelligence for MealMind Kenya.
Currency: KES (Kenyan Shilling).
Context: Nairobi / Urban Kenya.
Prices: Use realistic current Nairobi market prices (e.g., Ugali ~200KES/2kg, Eggs ~15-20KES, Skuma ~20-50KES).
Output: STRICT JSON. Do not include markdown code blocks.
`;

export const runAIAction = async (
  action: Action,
  payload: {
    preferences: UserPreferences,
    inventory: FoodItem[],
    context?: any
  }
): Promise<any> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-2.5-flash"; 

  let prompt = "";
  let schema: Schema | undefined;
  
  // Create a simplified inventory string to save tokens
  const inventoryStr = payload.inventory.map(i => `- ${i.name} (${i.cost} KES)`).join("\n");

  switch (action) {
    case 'suggest_meal':
      prompt = `
        ACTION: suggest_meal
        Budget: KES ${payload.preferences.budget}
        Diet: ${payload.preferences.dietType}
        Time: ${payload.context.currentTime}
        Type: ${payload.context.mealType}
        Inventory: ${inventoryStr}
        
        Task: Suggest ONE meal for a Kenyan user. 
        Focus on affordability and using inventory.
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

        Task: Generate a 7-day meal plan.
        Rules:
        1. Keep meals simple and realistic for Kenya.
        2. ESTIMATE costs. Total cost doesn't need to be exact to the shilling, just a close estimate.
        3. Do not fail if budget is tight; suggest cheaper portions (e.g. "Ugali & Skuma" or "Rice & Beans").
        4. Day names: Mon, Tue, Wed, Thu, Fri, Sat, Sun.
      `;
      schema = weeklyPlanSchema;
      break;

    case 'shopping_list':
      const plan = payload.context.weeklyPlan as DailyPlan[];
      // Limit plan size in prompt to prevent token overflow
      const planSummary = plan.map(d => `${d.day}: ${d.meals.map(m => m.name).join(', ')}`).join('; ');
      
      prompt = `
        ACTION: shopping_list
        Plan Summary: ${planSummary}
        Inventory: ${inventoryStr}

        Task: Create a shopping list.
        Rules: List items needed for the plan that are NOT in inventory.
      `;
      schema = shoppingListSchema;
      break;

    case 'analyze_inventory':
      prompt = `
        ACTION: analyze_inventory
        Inventory: ${inventoryStr}
        Task: Analyze inventory for cheap meal ideas and extensions.
      `;
      schema = analysisSchema;
      break;
      
    case 'get_analytics':
      prompt = `
        ACTION: get_analytics
        Budget: KES ${payload.preferences.weeklyBudget}
        Inventory Value: KES ${payload.inventory.reduce((acc, item) => acc + item.cost, 0)}
        Task: Generate dummy analytics data for spending trends and price alerts in Kenya.
      `;
      schema = analyticsSchema;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: getSystemInstruction(),
        // Increased token limit for large JSON responses like Weekly Plan
        maxOutputTokens: 4000, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean up potential markdown code blocks if the model adds them despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error(`Gemini API Error [${action}]:`, error);
    throw error;
  }
};
