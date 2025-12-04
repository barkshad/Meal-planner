
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
  auto_adjusted?: boolean; // New flag for Guaranteed Results
  message?: string;
}

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  SNACK = 'Snack',
  DRINK = 'Drink',
  AUTO = 'Surprise Me (Auto)'
}

export type DietType = 'regular' | 'healthy' | 'energy' | 'light' | 'vegetarian';
export type RegionType = 'All' | 'Coastal' | 'Western' | 'Central' | 'Rift Valley' | 'Nyanza' | 'Nairobi';
export type MoodType = 'Neutral' | 'Stressed' | 'Happy' | 'Tired' | 'Broke' | 'Healthy';

export interface UserPreferences {
  budget: number;
  mealsPerDay: number;
  dietType: DietType;
  weeklyBudget: number;
  strictMode?: boolean;
  region?: RegionType;
  mood?: MoodType;
}

// --- RECIPE SYSTEM TYPES ---
export interface Ingredient {
  item: string;
  price_range_ksh: string; // e.g., "20-50"
  estimated_cost: number;
}

export interface RecipeStep {
  step: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[]; // Legacy support
  detailed_ingredients?: Ingredient[]; // New detailed format
  steps: RecipeStep[];
  estimated_cost_ksh: number;
  cook_time_minutes: number;
  category: string;
  region: RegionType;
  moods: MoodType[];
  isQuickMeal: boolean;
  image_url?: string;
}
// --- END RECIPE SYSTEM TYPES ---

// Gamification
export interface Challenge {
  id: string;
  title: string;
  description: string;
  target_days: number;
  current_day: number;
  completed: boolean;
  reward_badge: string;
}

// User & Auth
export interface UserProfile {
  name: string;
  email: string;
  preferences: UserPreferences;
  savedPlans: WeeklyPlanResponse[];
  savedRecipes: Recipe[];
  challenges: Challenge[];
  partnerName?: string;
  isCoupleMode?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
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

// Analytics
export interface AnalyticsData {
  weekly_spending_trend: { day: string; amount: number }[];
  category_breakdown: { category: string; percentage: number }[];
  projected_savings: number;
  price_alerts: string[];
}

// Maps & Restaurants
export interface Restaurant {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number; // 0-4
  vicinity: string; // address
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    open_now: boolean;
  };
  distanceText?: string;
  durationText?: string;
  cuisine?: string;
}
