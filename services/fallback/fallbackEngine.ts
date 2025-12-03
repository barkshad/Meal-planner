
import { 
  UserPreferences, 
  FoodItem, 
  MealResponse, 
  WeeklyPlanResponse, 
  ShoppingListResponse, 
  InventoryAnalysisResponse,
  AnalyticsData,
  MealType
} from "../../types";
import { KENYAN_MEAL_DATABASE, SHOPPING_DEFAULTS, ANALYTICS_DEFAULTS } from "./fallbackData";

// LAYER 4: RULE-BASED LOGIC ENGINE
// This generates dynamic-looking responses without AI.

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// 1. MEAL SUGGESTION FALLBACK
export const generateFallbackMeal = (
  prefs: UserPreferences, 
  mealType: string, 
  inventory: FoodItem[]
): MealResponse => {
  
  // Filter meals by budget and roughly by type
  let candidates = KENYAN_MEAL_DATABASE.filter(m => m.cost <= prefs.budget);
  
  // Strict filtering by meal type if specified (and not Auto)
  if (mealType && mealType !== MealType.AUTO) {
    const typeCandidates = candidates.filter(m => 
      m.type.toLowerCase().includes(mealType.toLowerCase()) || 
      (mealType === MealType.LUNCH && m.type === MealType.DINNER) // Lunch/Dinner interchangeable
    );
    if (typeCandidates.length > 0) candidates = typeCandidates;
  }

  // Use inventory to boost score (simple logic)
  // In a real app, this would be more complex weighting
  const inventoryNames = inventory.map(i => i.name.toLowerCase());
  
  const selectedMeal = candidates.length > 0 
    ? getRandomItem(candidates) 
    : KENYAN_MEAL_DATABASE[0]; // Absolute fallback

  // Find reasons based on inventory
  const overlappingIngredients = selectedMeal.ingredients.filter(ing => 
    inventoryNames.some(inv => inv.includes(ing.toLowerCase()))
  );

  const reason = overlappingIngredients.length > 0
    ? `Great choice! You already have ${overlappingIngredients.join(', ')}.`
    : `A classic Kenyan favorite that fits your budget of KES ${prefs.budget}.`;

  return {
    meal_type: mealType === MealType.AUTO ? selectedMeal.type : mealType,
    suggestions: [{
      food: selectedMeal.name,
      estimated_cost: selectedMeal.cost,
      reason: reason
    }],
    total_meal_cost: selectedMeal.cost,
    within_budget: selectedMeal.cost <= prefs.budget,
    message: "AI connection limited. Showing top local recommendation."
  };
};

// 2. WEEKLY PLAN FALLBACK
export const generateFallbackWeeklyPlan = (prefs: UserPreferences): WeeklyPlanResponse => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeklyPlan = [];
  let totalCost = 0;

  for (const day of days) {
    const meals = [];
    let dayCost = 0;

    // Breakfast
    const bfast = getRandomItem(KENYAN_MEAL_DATABASE.filter(m => m.type === MealType.BREAKFAST));
    meals.push({ meal_type: "Breakfast", name: bfast.name, cost: bfast.cost });
    dayCost += bfast.cost;

    // Lunch
    const lunch = getRandomItem(KENYAN_MEAL_DATABASE.filter(m => m.type === MealType.LUNCH || m.type === MealType.DINNER));
    meals.push({ meal_type: "Lunch", name: lunch.name, cost: lunch.cost });
    dayCost += lunch.cost;

    // Dinner (if meals per day > 2)
    if (prefs.mealsPerDay > 2) {
      const dinner = getRandomItem(KENYAN_MEAL_DATABASE.filter(m => m.type === MealType.DINNER));
      meals.push({ meal_type: "Dinner", name: dinner.name, cost: dinner.cost });
      dayCost += dinner.cost;
    }

    weeklyPlan.push({
      day,
      meals,
      day_total: dayCost
    });
    totalCost += dayCost;
  }

  return {
    weekly_plan: weeklyPlan,
    total_cost: totalCost,
    within_budget: totalCost <= prefs.weeklyBudget
  };
};

// 3. SHOPPING LIST FALLBACK
export const generateFallbackShoppingList = (inventory: FoodItem[]): ShoppingListResponse => {
  // Logic: Suggest items from defaults that aren't in inventory
  const inventoryNames = inventory.map(i => i.name.toLowerCase());
  
  const needed = SHOPPING_DEFAULTS.filter(def => 
    !inventoryNames.some(inv => inv.includes(def.item.toLowerCase()))
  );

  return {
    shopping_list: needed.length > 0 ? needed : SHOPPING_DEFAULTS.slice(0, 3),
    estimated_total_cost: needed.length * 150 // Rough estimate
  };
};

// 4. ANALYTICS FALLBACK
export const generateFallbackAnalytics = (prefs: UserPreferences): AnalyticsData => {
  return {
    weekly_spending_trend: ANALYTICS_DEFAULTS.trends,
    category_breakdown: ANALYTICS_DEFAULTS.categories,
    projected_savings: Math.floor(prefs.weeklyBudget * 0.15), // Assume 15% savings
    price_alerts: ANALYTICS_DEFAULTS.alerts
  };
};

// 5. INVENTORY ANALYSIS FALLBACK
export const generateFallbackInventoryAnalysis = (): InventoryAnalysisResponse => {
  return {
    cheap_meal_options: ["Ugali Skuma", "Rice & Beans", "Githeri"],
    ways_to_extend_inventory: ["Add water to stews", "Use leftovers for breakfast", "Buy in bulk"],
    recommended_additions: ["Avocado", "Bananas", "Curry Powder"]
  };
};
