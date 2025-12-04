
import { 
  UserPreferences, 
  FoodItem, 
  MealResponse, 
  WeeklyPlanResponse, 
  ShoppingListResponse, 
  InventoryAnalysisResponse,
  AnalyticsData,
  MealType,
  Recipe,
  RegionType,
  MoodType,
  Challenge
} from "../../types";
import { SHOPPING_DEFAULTS, ANALYTICS_DEFAULTS } from "./fallbackData";
import { OFFLINE_RECIPES } from "./offlineRecipes";

// --- SMART MARKET PRICE ENGINE ---
// Simulates daily market fluctuations in Kenya
const getSmartPrice = (basePrice: number): number => {
  const day = new Date().getDay();
  // Markets are cheaper on market days (often Tue/Fri in many towns)
  const isMarketDay = day === 2 || day === 5; 
  const fluctuation = isMarketDay ? 0.9 : 1.05; // 10% cheaper or 5% markup
  
  // Random daily variance +/- 5 KES
  const variance = Math.floor(Math.random() * 11) - 5;
  
  return Math.ceil((basePrice * fluctuation) + variance);
};

// --- DATABASE SELECTOR ---

export const selectMealsFromDatabase = (
  budget: number, 
  mealType?: string, 
  diet?: string,
  region?: RegionType,
  mood?: MoodType,
  strictMode: boolean = true
): Recipe[] => {
  
  let candidates = OFFLINE_RECIPES.map(r => ({
    ...r,
    estimated_cost_ksh: getSmartPrice(r.estimated_cost_ksh) // Apply smart pricing
  }));

  // 1. Budget Filter
  if (strictMode) {
    candidates = candidates.filter(r => r.estimated_cost_ksh <= budget);
  } else {
    // Soft limit for auto-adjust
    candidates = candidates.filter(r => r.estimated_cost_ksh <= budget + 50);
  }

  // 2. Meal Type
  if (mealType && mealType !== MealType.AUTO) {
    candidates = candidates.filter(r => 
      r.category.toLowerCase().includes(mealType.toLowerCase()) || 
      (mealType === 'Lunch' && r.category === 'Dinner') || // Lunch/Dinner swap
      (mealType === 'Dinner' && r.category === 'Lunch')
    );
  }

  // 3. Region Filter
  if (region && region !== 'All') {
    candidates = candidates.filter(r => r.region === region || r.region === 'All');
  }

  // 4. Mood Filter
  if (mood && mood !== 'Neutral') {
    candidates = candidates.filter(r => r.moods.includes(mood));
  }

  // 5. Diet Filter
  if (diet && diet !== 'regular') {
     const dietLower = diet.toLowerCase();
     candidates = candidates.filter(r => {
        const ings = r.ingredients.join(' ').toLowerCase();
        const isMeat = ings.includes('beef') || ings.includes('chicken') || ings.includes('meat') || ings.includes('fish') || ings.includes('omena') || ings.includes('smokie') || ings.includes('sausage') || ings.includes('matumbo') || ings.includes('mutura');
        if (dietLower === 'vegetarian') return !isMeat;
        if (dietLower === 'healthy') return r.moods.includes('Healthy');
        return true;
     });
  }

  return candidates;
};

// --- GUARANTEED FALLBACK ---

export const generateFallbackMeal = (
  prefs: UserPreferences, 
  mealType: string, 
  inventory: FoodItem[]
): MealResponse => {
  
  const candidates = selectMealsFromDatabase(
    prefs.budget, 
    mealType, 
    prefs.dietType, 
    prefs.region, 
    prefs.mood, 
    prefs.strictMode
  );
  
  let selectedMeal: Recipe;
  let adjusted = false;
  let message = "Perfect Match";

  if (candidates.length > 0) {
    selectedMeal = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    // If no match found (e.g. very low budget), find CHEAPEST valid meal
    const allMeals = OFFLINE_RECIPES.map(r => ({...r, estimated_cost_ksh: getSmartPrice(r.estimated_cost_ksh)}));
    const sorted = allMeals.sort((a,b) => a.estimated_cost_ksh - b.estimated_cost_ksh);
    selectedMeal = sorted[0];
    adjusted = true;
    message = "Budget too low for preferences. Showing cheapest option.";
  }

  const inventoryNames = (inventory || []).map(i => i.name.toLowerCase());
  const overlappingIngredients = selectedMeal.ingredients.filter(ing => 
    inventoryNames.some(inv => inv.includes(ing.toLowerCase()))
  );

  let reason = overlappingIngredients.length > 0
    ? `Uses your ${overlappingIngredients[0]}.`
    : `Fit for ${prefs.mood || 'you'}.`;

  if (adjusted) reason = "Best low-cost option available.";

  return {
    meal_type: selectedMeal.category,
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

// --- CHALLENGES SYSTEM ---

export const getWeeklyChallenges = (): Challenge[] => [
  {
    id: "ch_01",
    title: "The 200 Bob Survivor",
    description: "Eat all meals for under KES 200 per day for 3 days.",
    target_days: 3,
    current_day: 0,
    completed: false,
    reward_badge: "🛡️ Survivor"
  },
  {
    id: "ch_02",
    title: "Greens Week",
    description: "Include Sukuma, Managu, or Spinach in 5 meals.",
    target_days: 5,
    current_day: 2,
    completed: false,
    reward_badge: "🥬 Green Giant"
  },
  {
    id: "ch_03",
    title: "Zero Waste Hero",
    description: "Clear your inventory list completely.",
    target_days: 1,
    current_day: 0,
    completed: false,
    reward_badge: "♻️ Eco Warrior"
  }
];

// --- STANDARD GENERATORS ---

export const generateFallbackRecipe = (
  budget: number,
  time: number,
  ingredients: string[]
): Recipe => {
  const result = selectMealsFromDatabase(budget, undefined, undefined, undefined, undefined, false);
  return result[0] || OFFLINE_RECIPES[0];
};

export const generateFallbackWeeklyPlan = (prefs: UserPreferences): WeeklyPlanResponse => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeklyPlan = [];
  let totalCost = 0;
  
  const dailyBudget = Math.floor(prefs.weeklyBudget / 7);

  for (const day of days) {
    let dayCost = 0;
    const meals = [];

    // Breakfast
    const bf = selectMealsFromDatabase(100, 'Breakfast', prefs.dietType)[0] || OFFLINE_RECIPES[0];
    meals.push({ meal_type: "Breakfast", name: bf.title, cost: bf.estimated_cost_ksh });
    dayCost += bf.estimated_cost_ksh;

    // Dinner
    const dn = selectMealsFromDatabase(dailyBudget - 100, 'Dinner', prefs.dietType)[0] || OFFLINE_RECIPES[5];
    meals.push({ meal_type: "Dinner", name: dn.title, cost: dn.estimated_cost_ksh });
    dayCost += dn.estimated_cost_ksh;

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
  return {
    shopping_list: SHOPPING_DEFAULTS.slice(0, 5),
    estimated_total_cost: 650
  };
};

export const generateFallbackAnalytics = (prefs: UserPreferences): AnalyticsData => {
  return {
    weekly_spending_trend: ANALYTICS_DEFAULTS.trends,
    category_breakdown: ANALYTICS_DEFAULTS.categories,
    projected_savings: Math.floor(prefs.weeklyBudget * 0.12),
    price_alerts: ANALYTICS_DEFAULTS.alerts
  };
};

export const generateFallbackInventoryAnalysis = (): InventoryAnalysisResponse => {
  return {
    cheap_meal_options: ["Ugali Skuma", "Rice & Beans"],
    ways_to_extend_inventory: ["Add water to stews", "Buy in bulk"],
    recommended_additions: ["Avocado", "Royco"]
  };
};
