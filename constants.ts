
import { FoodItem, DietType } from './types';

// Estimates based on Nairobi Market Prices (2024/2025)
export const INITIAL_FOODS: FoodItem[] = [
  { id: '1', name: 'Eggs (Trays)', cost: 450, unit: 'tray' },
  { id: '2', name: 'Unga wa Ugali', cost: 210, unit: '2kg pkt' },
  { id: '3', name: 'Sukuma Wiki', cost: 50, unit: 'bunch' },
  { id: '4', name: 'Milk (Maziwa)', cost: 65, unit: '500ml pkt' },
  { id: '5', name: 'Rice (Pishori)', cost: 180, unit: 'kg' },
  { id: '6', name: 'Beans (Njahi/Rosecoco)', cost: 140, unit: 'kg' },
  { id: '7', name: 'Bread (Supaloaf)', cost: 65, unit: 'loaf' },
  { id: '8', name: 'Tomatoes', cost: 10, unit: 'pc' },
  { id: '9', name: 'Onions', cost: 15, unit: 'pc' },
  { id: '10', name: 'Cooking Oil', cost: 350, unit: 'liter' },
];

export const APP_COLORS = {
  primary: 'emerald-600',
  primaryHover: 'emerald-700',
  secondary: 'orange-500',
  bg: 'slate-50',
};

export const DIET_TYPES: { value: DietType; label: string }[] = [
  { value: 'regular', label: 'Regular (Kenyan Standard)' },
  { value: 'healthy', label: 'Healthy / Balanced' },
  { value: 'energy', label: 'High Energy (Wajenzi)' },
  { value: 'light', label: 'Light / Weight Loss' },
  { value: 'vegetarian', label: 'Vegetarian' },
];

export const DEFAULT_PREFERENCES = {
  budget: 500, // KES Daily
  weeklyBudget: 3500, // KES Weekly
  mealsPerDay: 3,
  dietType: 'regular' as DietType,
};
