
export interface FoodItem {
  id: string;
  name: string;
  cost: number;
  unit: string;
}

export interface MealSuggestionItem {
  food: string;
  estimated_cost: number;
  reason: string;
}

export interface MealResponse {
  meal_type: string;
  suggestions: MealSuggestionItem[];
  total_meal_cost: number;
  within_budget: boolean;
  message?: string;
}

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  SNACK = 'Snack',
  AUTO = 'Surprise Me (Auto)'
}

export type DietType = 'regular' | 'healthy' | 'energy' | 'light' | 'vegetarian';

export interface UserPreferences {
  budget: number;
  mealsPerDay: number;
  dietType: DietType;
  weeklyBudget: number;
}

// New Types for Extended Actions

export interface WeeklyMeal {
  meal_type: string;
  name: string;
  cost: number;
}

export interface DailyPlan {
  day: string;
  meals: WeeklyMeal[];
  day_total: number;
}

export interface WeeklyPlanResponse {
  weekly_plan: DailyPlan[];
  total_cost: number;
  within_budget: boolean;
}

export interface ShoppingItem {
  item: string;
  quantity: string;
  reason: string;
}

export interface ShoppingListResponse {
  shopping_list: ShoppingItem[];
  estimated_total_cost: number;
}

export interface InventoryAnalysisResponse {
  cheap_meal_options: string[];
  ways_to_extend_inventory: string[];
  recommended_additions: string[];
}
