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

// LAYER 4: GUARANTEED RESULTS ENGINE & DATABASE SELECTOR

interface ValidMealResult {
  recipe: Recipe;
  adjusted: boolean;
  message?: string;
}

/**
 * CORE LOGIC: Selects meals directly from the offline database.
 * Filters by budget, meal type, and basic diet heuristics.
 * NEVER invents data.
 */
export const selectMealsFromDatabase = (
  budget: number, 
  mealType?: string, 
  diet?: string
): Recipe[] => {
  // 1. Filter by Budget (Strict)
  let candidates = OFFLINE_RECIPES.filter(r => r.estimated_cost_ksh <= budget);

  // 2. Filter by Meal Type (Loose matching)
  if (mealType && mealType !== MealType.AUTO) {
    const typeLower = mealType.toLowerCase();
    candidates = candidates.filter(r => {
      const cat = r.category.toLowerCase();
      const title = r.title.toLowerCase();
      
      if (typeLower === 'breakfast') return cat.includes('breakfast') || title.includes('tea') || title.includes('mandazi') || title.includes('toast') || title.includes('egg');
      if (typeLower === 'snack') return cat.includes('snack') || cat.includes('bite') || cat.includes('street');
      // Lunch/Dinner are often interchangeable in Kenya
      if (typeLower === 'lunch' || typeLower === 'dinner') {
        return !cat.includes('breakfast') && !cat.includes('snack');
      }
      return true;
    });
  }

  // 3. Filter by Diet (Heuristics since tags might be missing in raw JSON)
  if (diet && diet !== 'regular') {
    const dietLower = diet.toLowerCase();
    candidates = candidates.filter(r => {
      const title = r.title.toLowerCase();
      const ings = r.ingredients.join(' ').toLowerCase();
      const isMeat = ings.includes('beef') || ings.includes('chicken') || ings.includes('meat') || ings.includes('fish') || ings.includes('omena') || ings.includes('smokie') || ings.includes('sausage') || ings.includes('matumbo');
      
      if (dietLower === 'vegetarian') return !isMeat;
      // Add more heuristics if needed
      return true;
    });
  }

  return candidates;
};

/**
 * Fallback / Guaranteed Picker
 * Used when AI fails or when we just need a quick valid result.
 */
export const getValidMeals = (budget: number, strict: boolean = false): ValidMealResult => {
  // Try strictly within budget
  let validRecipes = OFFLINE_RECIPES.filter(r => r.estimated_cost_ksh <= budget);

  if (validRecipes.length > 0) {
    return {
      recipe: validRecipes[Math.floor(Math.random() * validRecipes.length)],
      adjusted: false
    };
  }

  // Expansion: Budget + 20 KES buffer
  if (!strict) {
     validRecipes = OFFLINE_RECIPES.filter(r => r.estimated_cost_ksh <= budget + 20);
     if (validRecipes.length > 0) {
        return {
          recipe: validRecipes[Math.floor(Math.random() * validRecipes.length)],
          adjusted: true,
          message: `Budget slightly adjusted (+20 KES) to find a meal.`
        };
     }
  }

  // Ultimate Fallback: Cheapest meal in DB
  const sortedRecipes = [...OFFLINE_RECIPES].sort((a, b) => a.estimated_cost_ksh - b.estimated_cost_ksh);
  const cheapest = sortedRecipes[0];

  return {
    recipe: cheapest,
    adjusted: true,
    message: `Budget too low. Showing cheapest option (KES ${cheapest.estimated_cost_ksh}).`
  };
};

// 1. GUARANTEED MEAL SUGGESTION FALLBACK
export const generateFallbackMeal = (
  prefs: UserPreferences, 
  mealType: string, 
  inventory: FoodItem[]
): MealResponse => {
  
  // Use the selector logic first
  const candidates = selectMealsFromDatabase(prefs.budget, mealType, prefs.dietType);
  
  let selectedMeal: Recipe;
  let adjusted = false;
  let message = "Local Recommendation";

  if (candidates.length > 0) {
    // Pick random from valid candidates
    selectedMeal = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    // Fallback to Guaranteed Engine if specific filtering found nothing
    const result = getValidMeals(prefs.budget, prefs.strictMode);
    selectedMeal = result.recipe;
    adjusted = result.adjusted;
    message = result.message || "Best available option";
  }

  // Enhance reason with inventory match
  const inventoryNames = (inventory || []).map(i => i.name.toLowerCase());
  const overlappingIngredients = selectedMeal.ingredients.filter(ing => 
    inventoryNames.some(inv => inv.includes(ing.toLowerCase()))
  );

  let reason = overlappingIngredients.length > 0
    ? `Matches your ${overlappingIngredients.join(', ')}.`
    : `Fits your KES ${prefs.budget} budget.`;

  if (adjusted) reason += " (Budget adjusted)";

  return {
    meal_type: mealType === MealType.AUTO ? selectedMeal.category : mealType,
    suggestions: [{
      food: selectedMeal.title,
      estimated_cost: selectedMeal.estimated_cost_ksh,
      reason: reason
    }],
    total_meal_cost: selectedMeal.estimated_cost_ksh,
    within_budget: selectedMeal.estimated_cost_ksh <= prefs.budget,
    auto_adjusted: adjusted,
    message: message
  };
};

// 2. RECIPE FALLBACK
export const generateFallbackRecipe = (
  budget: number,
  time: number,
  ingredients: string[]
): Recipe => {
  const result = getValidMeals(budget, false);
  return result.recipe;
};

// 3. WEEKLY PLAN FALLBACK
export const generateFallbackWeeklyPlan = (prefs: UserPreferences): WeeklyPlanResponse => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeklyPlan = [];
  let totalCost = 0;
  
  const dailyBudget = Math.floor(prefs.weeklyBudget / 7);

  for (const day of days) {
    let dayCost = 0;
    const meals = [];

    // Breakfast
    const bfBudget = Math.floor(dailyBudget * 0.25);
    const bfRecipes = selectMealsFromDatabase(Math.max(30, bfBudget), 'Breakfast', prefs.dietType);
    const bf = bfRecipes.length > 0 ? bfRecipes[Math.floor(Math.random() * bfRecipes.length)] : getValidMeals(50).recipe;
    
    meals.push({ meal_type: "Breakfast", name: bf.title, cost: bf.estimated_cost_ksh });
    dayCost += bf.estimated_cost_ksh;

    // Lunch
    const lunchBudget = Math.floor((dailyBudget - dayCost) * 0.5);
    const lunchRecipes = selectMealsFromDatabase(Math.max(50, lunchBudget), 'Lunch', prefs.dietType);
    const lunch = lunchRecipes.length > 0 ? lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)] : getValidMeals(80).recipe;

    meals.push({ meal_type: "Lunch", name: lunch.title, cost: lunch.estimated_cost_ksh });
    dayCost += lunch.estimated_cost_ksh;

    // Dinner
    const dinnerBudget = Math.max(50, dailyBudget - dayCost);
    const dinnerRecipes = selectMealsFromDatabase(dinnerBudget, 'Dinner', prefs.dietType);
    const dinner = dinnerRecipes.length > 0 ? dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)] : getValidMeals(100).recipe;

    meals.push({ meal_type: "Dinner", name: dinner.title, cost: dinner.estimated_cost_ksh });
    dayCost += dinner.estimated_cost_ksh;

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
    within_budget: totalCost <= (prefs.weeklyBudget * 1.1)
  };
};

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

export const generateFallbackAnalytics = (prefs: UserPreferences): AnalyticsData => {
  return {
    weekly_spending_trend: ANALYTICS_DEFAULTS.trends,
    category_breakdown: ANALYTICS_DEFAULTS.categories,
    projected_savings: Math.floor(prefs.weeklyBudget * 0.15),
    price_alerts: ANALYTICS_DEFAULTS.alerts
  };
};

export const generateFallbackInventoryAnalysis = (): InventoryAnalysisResponse => {
  return {
    cheap_meal_options: ["Ugali Skuma", "Rice & Beans", "Githeri"],
    ways_to_extend_inventory: ["Add water to stews to increase volume", "Use leftovers for breakfast", "Buy staples in bulk to save"],
    recommended_additions: ["Avocado", "Bananas", "Curry Powder (Royco)"]
  };
};
