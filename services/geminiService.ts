import { GoogleGenAI, Type, Schema } from "@google/genai";
import { 
  FoodItem, 
  MealResponse, 
  WeeklyPlanResponse, 
  ShoppingListResponse, 
  InventoryAnalysisResponse,
  UserPreferences,
  DailyPlan
} from "../types";

const apiKey = process.env.API_KEY;

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

// --- Helper to run AI ---

type Action = 'suggest_meal' | 'weekly_plan' | 'shopping_list' | 'analyze_inventory';

const getSystemInstruction = () => `
You are the backend intelligence for a web app called MealMind.

MealMind helps users choose:
- What to eat,
- At the right time,
- Within their budget,
- Based on foods they already have,
- Based on diet type and preferences.

You ALWAYS return structured JSON. NEVER include text outside JSON.

GENERAL RULES:
- Always return valid JSON.
- Never include explanations outside JSON.
- If information is missing, make reasonable assumptions.
- Meals must be realistic and affordable.
- Keep answers concise and easy for the web frontend to display.

Your purpose: Make meal decisions simple, affordable, and clear.
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
  const modelId = "gemini-2.5-flash"; // Using flash for speed/cost effectiveness for simple JSON tasks

  let prompt = "";
  let schema: Schema | undefined;
  
  const inventoryStr = payload.inventory.map(i => `- ${i.name} ($${i.cost}/${i.unit})`).join("\n");

  switch (action) {
    case 'suggest_meal':
      prompt = `
        ACTION: suggest_meal
        User Profile:
        - Daily Budget: $${payload.preferences.budget}
        - Meals/Day: ${payload.preferences.mealsPerDay}
        - Diet Type: ${payload.preferences.dietType}
        - Current Time: ${payload.context.currentTime}
        - Requested Meal Type: ${payload.context.mealType}
        
        Inventory:
        ${inventoryStr}

        Task: Suggest a single meal.
        Rules:
        - Auto-select meal type if "Auto".
        - Prefer inventory items.
        - Respect daily budget.
      `;
      schema = mealResponseSchema;
      break;

    case 'weekly_plan':
      prompt = `
        ACTION: weekly_plan
        User Profile:
        - Weekly Budget: $${payload.preferences.weeklyBudget}
        - Meals/Day: ${payload.preferences.mealsPerDay}
        - Diet Type: ${payload.preferences.dietType}

        Inventory:
        ${inventoryStr}

        Task: Generate a 7-day meal plan.
        Rules:
        - Total must fit weekly budget ($${payload.preferences.weeklyBudget}).
        - Avoid repeating same meal more than 2 days.
        - Prefer inventory items.
      `;
      schema = weeklyPlanSchema;
      break;

    case 'shopping_list':
      const plan = payload.context.weeklyPlan as DailyPlan[];
      const planStr = JSON.stringify(plan);
      prompt = `
        ACTION: shopping_list
        Weekly Plan: ${planStr.substring(0, 10000)}... (truncated if too long)
        
        Inventory:
        ${inventoryStr}

        Task: Create a shopping list.
        Rules:
        - Include foods required by the plan but missing from inventory.
        - Suggest cheaper alternatives when possible.
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
        - Suggest cheap meal options using ONLY inventory.
        - Suggest ways to extend current food.
        - Recommend 3-5 cheap additions to make more meals.
      `;
      schema = analysisSchema;
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
