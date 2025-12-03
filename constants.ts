
import { FoodItem, DietType } from './types';

export const INITIAL_FOODS: FoodItem[] = [
  { id: '1', name: 'Eggs (2)', cost: 0.50, unit: 'serving' },
  { id: '2', name: 'Rice', cost: 0.20, unit: 'cup' },
  { id: '3', name: 'Bread', cost: 0.15, unit: 'slice' },
  { id: '4', name: 'Chicken Breast', cost: 2.50, unit: 'piece' },
  { id: '5', name: 'Beans (Canned)', cost: 0.80, unit: 'can' },
  { id: '6', name: 'Pasta', cost: 0.40, unit: 'serving' },
  { id: '7', name: 'Mixed Veggies (Frozen)', cost: 0.75, unit: 'cup' },
  { id: '8', name: 'Oatmeal', cost: 0.30, unit: 'bowl' },
  { id: '9', name: 'Apple', cost: 0.60, unit: 'fruit' },
  { id: '10', name: 'Milk', cost: 0.40, unit: 'cup' },
];

export const APP_COLORS = {
  primary: 'emerald-600',
  primaryHover: 'emerald-700',
  secondary: 'orange-500',
  bg: 'slate-50',
};

export const DIET_TYPES: { value: DietType; label: string }[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'energy', label: 'High Energy' },
  { value: 'light', label: 'Light' },
  { value: 'vegetarian', label: 'Vegetarian' },
];
