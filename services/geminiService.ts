
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
You are the backend intelligence for MealMind Kenya, an app helping Kenyans eat well within budget.

Your core data is based on CURRENT KENYAN MARKET PRICES (KES).
Currency: KES (Kenyan Shilling).
Context: Nairobi / Urban Kenya.

Common Foods & Prices (Approx for Context):
- Ugali (Maize Meal): 200 KES / 2kg
- Sukuma Wiki: 20-50 KES / bunch
- Eggs: 15-20 KES / each
- Milk: 60-70 KES / 500ml
- Beef: 550-700 KES / kg
- Chapati: 20-30 KES / street price, cheaper to cook
- Omena, Githeri, Pilau, Matoke are common dishes.

ALWAYS return structured JSON.
Make suggestions realistic for a Kenyan household.
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
  
  const inventoryStr = payload.inventory.map(i => `- ${i.name} (KES ${i.cost}/${i.unit})`).join("\n");

  switch (action) {
    case 'suggest_meal':
      prompt = `
        ACTION: suggest_meal
        User Profile:
        - Daily Budget: KES ${payload.preferences.budget}
        - Meals/Day: ${payload.preferences.mealsPerDay}
        - Diet Type: ${payload.preferences.dietType}
        - Current Time: ${payload.context.currentTime}
        - Requested Meal Type: ${payload.context.mealType}
        
        Inventory:
        ${inventoryStr}

        Task: Suggest a single meal suitable for a Kenyan context.
        Rules:
        - Suggest local dishes (e.g., Ugali & Sukuma, Githeri, Chai & Mandazi) where appropriate.
        - Prefer inventory items.
        - Respect daily budget in KES.
      `;
      schema = mealResponseSchema;
      break;

    case 'weekly_plan':
      prompt = `
        ACTION: weekly_plan
        User Profile:
        - Weekly Budget: KES ${payload.preferences.weeklyBudget}
        - Meals/Day: ${payload.preferences.mealsPerDay}
        - Diet Type: ${payload.preferences.dietType}

        Inventory:
        ${inventoryStr}

        Task: Generate a 7-day meal plan for a Kenyan user.
        Rules:
        - Total must fit weekly budget (KES ${payload.preferences.weeklyBudget}).
        - Avoid repeating same meal more than 2 days.
        - Use local market prices for estimation.
      `;
      schema = weeklyPlanSchema;
      break;

    case 'shopping_list':
      const plan = payload.context.weeklyPlan as DailyPlan[];
      const planStr = JSON.stringify(plan);
      prompt = `
        ACTION: shopping_list
        Weekly Plan: ${planStr.substring(0, 10000)}...
        
        Inventory:
        ${inventoryStr}

        Task: Create a shopping list for a Kenyan supermarket/soko.
        Rules:
        - Include foods required by the plan but missing from inventory.
        - Suggest cheaper alternatives (e.g., Loose maize vs Packet maize) if budget is tight.
      `;
      schema = shoppingListSchema;
      break;

    case 'analyze_inventory':
      prompt = `
        ACTION: analyze_inventory
        Inventory:
        ${inventoryStr}

        Task: Analyze the inventory.
        Rules:
        - Suggest cheap Kenyan meal options using ONLY inventory.
        - Suggest ways to extend current food (e.g., adding water to soup, using leftovers for fry).
        - Recommend 3-5 cheap additions (e.g., Avocados, Bananas).
      `;
      schema = analysisSchema;
      break;
      
    case 'get_analytics':
      prompt = `
        ACTION: get_analytics
        Weekly Budget: KES ${payload.preferences.weeklyBudget}
        Inventory Value: KES ${payload.inventory.reduce((acc, item) => acc + item.cost, 0)}

        Task: Generate dummy analytic data for the dashboard.
        Rules:
        - Create a realistic spending trend for the last 7 days.
        - Breakdown categories (Grains, Veggies, Protein, etc.).
        - Predict savings based on efficient cooking.
        - Give 2-3 price alerts for Kenyan market (e.g., "Tomato prices rising in Nairobi").
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
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error(`Gemini API Error [${action}]:`, error);
    throw error;
  }
};
