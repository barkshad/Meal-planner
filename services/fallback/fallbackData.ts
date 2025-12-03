
import { MealType } from "../../types";

// LAYER 3: STATIC LOCAL DATA (The "JSON File")
// This contains pre-validated Kenyan meals and ingredients.

export const KENYAN_MEAL_DATABASE = [
  // --- BREAKFAST ---
  {
    name: "Strong Tea & Mandazi",
    type: MealType.BREAKFAST,
    cost: 50,
    ingredients: ["Milk", "Tea Leaves", "Wheat Flour", "Sugar"],
    diet: ["regular", "vegetarian"]
  },
  {
    name: "Uji (Porridge) & Sweet Potato",
    type: MealType.BREAKFAST,
    cost: 40,
    ingredients: ["Millet Flour", "Sweet Potatoes", "Sugar"],
    diet: ["regular", "healthy", "energy", "vegetarian"]
  },
  {
    name: "Mayai Pasua (Boiled Eggs) & Smokies",
    type: MealType.BREAKFAST,
    cost: 70,
    ingredients: ["Eggs", "Smokies", "Kachumbari"],
    diet: ["regular", "energy"]
  },
  {
    name: "Bread & Blueband with Cocoa",
    type: MealType.BREAKFAST,
    cost: 60,
    ingredients: ["Bread", "Margarine", "Cocoa"],
    diet: ["regular"]
  },

  // --- LUNCH / DINNER ---
  {
    name: "Ugali & Sukuma Wiki",
    type: MealType.LUNCH,
    cost: 80,
    ingredients: ["Maize Flour", "Kale", "Onion", "Tomato"],
    diet: ["regular", "healthy", "vegetarian", "light"]
  },
  {
    name: "Githeri (Maize & Beans)",
    type: MealType.LUNCH,
    cost: 60,
    ingredients: ["Maize", "Beans", "Potatoes"],
    diet: ["regular", "healthy", "energy", "vegetarian"]
  },
  {
    name: "Rice & Ndengu (Green Grams)",
    type: MealType.DINNER,
    cost: 120,
    ingredients: ["Rice", "Green Grams", "Onion", "Carrots"],
    diet: ["regular", "healthy", "vegetarian"]
  },
  {
    name: "Chapati & Beans",
    type: MealType.DINNER,
    cost: 150,
    ingredients: ["Wheat Flour", "Beans", "Oil", "Onion"],
    diet: ["regular", "energy", "vegetarian"]
  },
  {
    name: "Omena & Ugali",
    type: MealType.DINNER,
    cost: 130,
    ingredients: ["Omena", "Maize Flour", "Tomato"],
    diet: ["regular", "healthy", "energy"]
  },
  {
    name: "Beef Fry & Rice",
    type: MealType.DINNER,
    cost: 250,
    ingredients: ["Beef", "Rice", "Onion", "Tomato", "Coriander"],
    diet: ["regular", "energy"]
  }
];

export const SHOPPING_DEFAULTS = [
  { item: "Maize Flour", quantity: "2kg", reason: "Staple for Ugali" },
  { item: "Cooking Oil", quantity: "1 Liter", reason: "General cooking" },
  { item: "Onions", quantity: "5 pcs", reason: "Flavor base" },
  { item: "Tomatoes", quantity: "5 pcs", reason: "Stew base" },
  { item: "Salt", quantity: "1 pkt", reason: "Seasoning" }
];

export const ANALYTICS_DEFAULTS = {
  trends: [
    { day: "Mon", amount: 450 },
    { day: "Tue", amount: 300 },
    { day: "Wed", amount: 500 },
    { day: "Thu", amount: 250 },
    { day: "Fri", amount: 600 },
    { day: "Sat", amount: 800 },
    { day: "Sun", amount: 1200 }
  ],
  categories: [
    { category: "Staples (Unga/Rice)", percentage: 40 },
    { category: "Vegetables", percentage: 25 },
    { category: "Proteins", percentage: 20 },
    { category: "Snacks/Oil", percentage: 15 }
  ],
  alerts: [
    "Tomato prices have dropped by 10% in Nairobi markets.",
    "Onion prices are high due to rain seasons.",
    "Sugar prices remain stable."
  ]
};
