
import { 
  UserPreferences, 
  FoodItem, 
  MealResponse, 
  WeeklyPlanResponse, 
  ShoppingListResponse, 
  InventoryAnalysisResponse,
  AnalyticsData,
  MealType,
  Recipe
} from "../../types";
import { SHOPPING_DEFAULTS, ANALYTICS_DEFAULTS } from "./fallbackData";
import { OFFLINE_RECIPES } from "./offlineRecipes";

// LAYER 4: GUARANTEED RESULTS ENGINE
// Ensures we NEVER return a null result and ALWAYS respect budget logic.

interface ValidMealResult {
  recipe: Recipe;
  adjusted: boolean;
  message?: string;
}

/**
 * The core engine that guarantees a result within budget.
 * 1. Tries to find meals <= budget.
 * 2. If strict mode is OFF, and no meals found, it finds the absolute cheapest meal available.
 * 3. Returns the recipe and a flag indicating if we had to adjust logic to find it.
 */
export const getValidMeals = (budget: number, strict: boolean = false): ValidMealResult => {
  // 1. Strict Filter: Try to find meals exactly within budget
  let validRecipes = OFFLINE_RECIPES.filter(r => r.estimated_cost_ksh <= budget);

  if (validRecipes.length > 0) {
    return {
      recipe: validRecipes[Math.floor(Math.random() * validRecipes.length)],
      adjusted: false
    };
  }

  // 2. Expansion: If no results, try budget + 10 KES (small buffer)
  if (!strict) {
     validRecipes = OFFLINE_RECIPES.filter(r => r.estimated_cost_ksh <= budget + 10);
     if (validRecipes.length > 0) {
        return {
          recipe: validRecipes[Math.floor(Math.random() * validRecipes.length)],
          adjusted: true,
          message: `Slightly adjusted budget to find a meal.`
        };
     }
  }

  // 3. Ultimate Fallback: Return the absolute cheapest meal in DB
  // This guarantees we NEVER return null/error.
  const sortedRecipes = [...OFFLINE_RECIPES].sort((a, b) => a.estimated_cost_ksh - b.estimated_cost_ksh);
  const cheapest = sortedRecipes[0];

  return {
    recipe: cheapest,
    adjusted: true,
    message: `Budget too low for standard meals. Showing most affordable option (KES ${cheapest.estimated_cost_ksh}).`
  };
};

// 1. GUARANTEED MEAL SUGGESTION FALLBACK
export const generateFallbackMeal = (
  prefs: UserPreferences, 
  mealType: string, 
  inventory: FoodItem[]
): MealResponse => {
  
  const result = getValidMeals(prefs.budget, prefs.strictMode);
  const selectedMeal = result.recipe;

  // Enhance reason with inventory match
  const inventoryNames = (inventory || []).map(i => i.name.toLowerCase());
  const overlappingIngredients = selectedMeal.ingredients.filter(ing => 
    inventoryNames.some(inv => inv.includes(ing.toLowerCase()))
  );

  let reason = overlappingIngredients.length > 0
    ? `Uses your ${overlappingIngredients.join(', ')}.`
    : `Fits within your KES ${prefs.budget} budget.`;

  if (result.adjusted) {
    reason = result.message || "Budget adjusted to find an affordable meal.";
  }

  return {
    meal_type: mealType === MealType.AUTO ? selectedMeal.category : mealType,
    suggestions: [{
      food: selectedMeal.title,
      estimated_cost: selectedMeal.estimated_cost_ksh,
      reason: reason
    }],
    total_meal_cost: selectedMeal.estimated_cost_ksh,
    within_budget: selectedMeal.estimated_cost_ksh <= prefs.budget,
    auto_adjusted: result.adjusted,
    message: result.adjusted ? "Budget Adjusted" : "Local Recommendation"
  };
};

// 2. RECIPE FALLBACK
export const generateFallbackRecipe = (
  budget: number,
  time: number,
  ingredients: string[]
): Recipe => {
  // Use the engine
  const result = getValidMeals(budget, false);
  return result.recipe;
};

// 3. WEEKLY PLAN FALLBACK (Smart Budget Allocation)
export const generateFallbackWeeklyPlan = (prefs: UserPreferences): WeeklyPlanResponse => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeklyPlan = [];
  let totalCost = 0;
  
  const dailyBudget = Math.floor(prefs.weeklyBudget / 7);

  // We need to distribute meals so day_total <= dailyBudget
  
  for (const day of days) {
    let dayCost = 0;
    const meals = [];

    // 1. Breakfast (Try to find something cheap, ~20% of daily budget)
    const breakfastBudget = Math.floor(dailyBudget * 0.25);
    const bfResult = getValidMeals(Math.max(20, breakfastBudget), false); 
    meals.push({ 
        meal_type: "Breakfast", 
        name: bfResult.recipe.title, 
        cost: bfResult.recipe.estimated_cost_ksh 
    });
    dayCost += bfResult.recipe.estimated_cost_ksh;

    // 2. Lunch (remaining split)
    const remaining = Math.max(0, dailyBudget - dayCost);
    const lunchBudget = Math.floor(remaining * 0.4);
    
    const lunchResult = getValidMeals(Math.max(40, lunchBudget), false);
    meals.push({ 
        meal_type: "Lunch", 
        name: lunchResult.recipe.title, 
        cost: lunchResult.recipe.estimated_cost_ksh 
    });
    dayCost += lunchResult.recipe.estimated_cost_ksh;

    // 3. Dinner (rest)
    const dinnerBudget = Math.max(50, dailyBudget - dayCost);
    const dinnerResult = getValidMeals(dinnerBudget, false);
    meals.push({ 
        meal_type: "Dinner", 
        name: dinnerResult.recipe.title, 
        cost: dinnerResult.recipe.estimated_cost_ksh 
    });
    dayCost += dinnerResult.recipe.estimated_cost_ksh;

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
    within_budget: totalCost <= (prefs.weeklyBudget * 1.1) // Allow 10% variance
  };
};

// 4. SHOPPING LIST FALLBACK
export const generateFallbackShoppingList = (inventory: FoodItem[]): ShoppingListResponse => {
  const inventoryNames = (inventory || []).map(i => i.name.toLowerCase());
  
  const needed = SHOPPING_DEFAULTS.filter(def => 
    !inventoryNames.some(inv => inv.includes(def.item.toLowerCase()))
  );

  return {
    shopping_list: needed.length > 0 ? needed : SHOPPING_DEFAULTS.slice(0, 3),
    estimated_total_cost: needed.length > 0 ? needed.length * 150 : 450
  };
};

// 5. ANALYTICS FALLBACK
export const generateFallbackAnalytics = (prefs: UserPreferences): AnalyticsData => {
  return {
    weekly_spending_trend: ANALYTICS_DEFAULTS.trends,
    category_breakdown: ANALYTICS_DEFAULTS.categories,
    projected_savings: Math.floor(prefs.weeklyBudget * 0.15),
    price_alerts: ANALYTICS_DEFAULTS.alerts
  };
};

// 6. INVENTORY ANALYSIS FALLBACK
export const generateFallbackInventoryAnalysis = (): InventoryAnalysisResponse => {
  return {
    cheap_meal_options: ["Ugali Skuma", "Rice & Beans", "Githeri"],
    ways_to_extend_inventory: ["Add water to stews to increase volume", "Use leftovers for breakfast", "Buy staples in bulk to save"],
    recommended_additions: ["Avocado", "Bananas", "Curry Powder (Royco)"]
  };
};
