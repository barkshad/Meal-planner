
import { Recipe } from "../../types";

export const OFFLINE_RECIPES: Recipe[] = [
  // --- Ugali Based ---
  {
    id: "ugali_001",
    title: "Classic Ugali with Sukuma Wiki",
    ingredients: ["Maize Flour (Unga)", "Water", "Salt", "Sukuma Wiki (Kale)", "Onion", "Tomatoes", "Cooking Oil"],
    steps: [
      { step: 1, instruction: "Boil water with a pinch of salt." },
      { step: 2, instruction: "Gradually add maize flour while stirring continuously to avoid lumps, forming a thick paste." },
      { step: 3, instruction: "Cook for 10-15 minutes on low heat, turning it to cook evenly." },
      { step: 4, instruction: "In a separate pan, fry onions and tomatoes in oil." },
      { step: 5, instruction: "Add chopped sukuma wiki and cook until tender." },
      { step: 6, instruction: "Serve hot ugali with the cooked sukuma wiki." },
    ],
    estimated_cost_ksh: 90,
    cook_time_minutes: 25,
    category: "Ugali Dishes",
  },
  {
    id: "ugali_002",
    title: "Ugali and Fried Eggs",
    ingredients: ["Maize Flour", "Water", "Eggs", "Onion", "Tomatoes", "Cooking Oil"],
    steps: [
      { step: 1, instruction: "Prepare Ugali as per the classic method." },
      { step: 2, instruction: "Chop onions and tomatoes." },
      { step: 3, instruction: "In a pan, fry the onions and tomatoes until soft." },
      { step: 4, instruction: "Whisk eggs and pour them into the pan, scrambling until cooked." },
      { step: 5, instruction: "Serve the hot ugali with the scrambled eggs." },
    ],
    estimated_cost_ksh: 120,
    cook_time_minutes: 20,
    category: "Ugali Dishes",
  },
    {
    id: "ugali_003",
    title: "Ugali with Beef Stew",
    ingredients: ["Maize Flour", "Water", "Beef", "Onions", "Tomatoes", "Carrots", "Potatoes", "Spices (e.g., Royco)"],
    steps: [
        { step: 1, instruction: "Prepare Ugali." },
        { step: 2, instruction: "Cut beef into cubes. Boil until tender." },
        { step: 3, instruction: "Fry onions, add tomatoes, and cook into a paste." },
        { step: 4, instruction: "Add the boiled beef, chopped carrots, potatoes, and spices. Add some water/broth and simmer until the stew thickens." },
        { step: 5, instruction: "Serve ugali with the rich beef stew." },
    ],
    estimated_cost_ksh: 350,
    cook_time_minutes: 60,
    category: "Ugali Dishes",
  },

  // --- Rice Based ---
  {
    id: "rice_001",
    title: "Rice with Bean Stew (Madondo)",
    ingredients: ["Rice", "Pre-boiled Beans", "Onion", "Tomatoes", "Carrots", "Coconut Milk (optional)"],
    steps: [
      { step: 1, instruction: "Wash and boil rice until fluffy." },
      { step: 2, instruction: "In a separate pot, fry onions, carrots, and tomatoes." },
      { step: 3, instruction: "Add the pre-boiled beans and coconut milk. Simmer for 15-20 minutes." },
      { step: 4, instruction: "Season to taste and serve with the hot rice." },
    ],
    estimated_cost_ksh: 180,
    cook_time_minutes: 40,
    category: "Rice Dishes",
  },
  {
    id: "rice_002",
    title: "Kenyan Pilau",
    ingredients: ["Rice", "Beef or Chicken", "Onions", "Garlic", "Ginger", "Pilau Masala Spice Mix"],
    steps: [
        { step: 1, instruction: "Fry onions until dark brown. Add garlic, ginger, and pilau masala." },
        { step: 2, instruction: "Add beef/chicken and brown it." },
        { step: 3, instruction: "Add water or broth and bring to a boil." },
        { step: 4, instruction: "Add washed rice, reduce heat, cover, and simmer until all water is absorbed and rice is cooked." },
        { step: 5, instruction: "Fluff with a fork and serve with Kachumbari." },
    ],
    estimated_cost_ksh: 400,
    cook_time_minutes: 50,
    category: "Rice Dishes",
  },

  // --- Chapati Based ---
  {
    id: "chapati_001",
    title: "Chapati with Ndengu (Green Grams)",
    ingredients: ["All-purpose Flour", "Water", "Salt", "Cooking Oil", "Ndengu (Green Grams)", "Onion", "Tomatoes", "Coconut Milk"],
    steps: [
      { step: 1, instruction: "Knead flour, water, salt, and a little oil into a soft dough. Let it rest." },
      { step: 2, instruction: "Roll out the dough into thin circles and cook on a hot pan, applying oil, until golden brown." },
      { step: 3, instruction: "In a pot, boil ndengu until soft." },
      { step: 4, instruction: "Fry onions and tomatoes, add the boiled ndengu and coconut milk. Simmer until the stew is thick." },
      { step: 5, instruction: "Serve the soft chapatis with the ndengu stew." },
    ],
    estimated_cost_ksh: 200,
    cook_time_minutes: 60,
    category: "Chapati Dishes",
  },
  {
    id: "chapati_002",
    title: "Chapati Rolls (Rolex)",
    ingredients: ["Chapati", "Eggs", "Cabbage", "Onion", "Tomatoes"],
    steps: [
        { step: 1, instruction: "Cook chapatis or use leftovers." },
        { step: 2, instruction: "Whisk eggs with finely chopped onions and tomatoes." },
        { step: 3, instruction: "Pour the egg mixture into a hot, oiled pan to make a thin omelette." },
        { step: 4, instruction: "Place a chapati on top of the cooking omelette. Once the egg is set, flip it over." },
        { step: 5, instruction: "Add shredded cabbage, roll it up, and serve immediately." },
    ],
    estimated_cost_ksh: 150,
    cook_time_minutes: 15,
    category: "Chapati Dishes",
  },

  // --- Quick Meals & Snacks ---
  {
    id: "quick_001",
    title: "Githeri",
    ingredients: ["Maize", "Beans", "Onion", "A little cooking oil"],
    steps: [
      { step: 1, instruction: "Boil maize and beans together until soft. (Using a pressure cooker saves time)." },
      { step: 2, instruction: "Once soft, drain excess water." },
      { step: 3, instruction: "Lightly fry with onions for added flavor, or serve as is." },
      { step: 4, instruction: "Optionally, mash it up (muthokoi) or add potatoes and vegetables for a richer meal." },
    ],
    estimated_cost_ksh: 100,
    cook_time_minutes: 90,
    category: "Budget Meals",
  },
  {
    id: "quick_002",
    title: "Kachumbari Salad",
    ingredients: ["Tomatoes", "Onions", "Coriander (Dania)", "Chili (optional)", "Lemon Juice"],
    steps: [
      { step: 1, instruction: "Finely chop tomatoes, onions, and coriander." },
      { step: 2, instruction: "Mix them in a bowl." },
      { step: 3, instruction: "Add a squeeze of lemon juice, a pinch of salt, and chopped chili if desired." },
      { step: 4, instruction: "Serve as a side for grilled meat (Nyama Choma) or Pilau." },
    ],
    estimated_cost_ksh: 50,
    cook_time_minutes: 10,
    category: "Snacks & Sides",
  },
  {
    id: "quick_003",
    title: "Matoke with Peanut Sauce",
    ingredients: ["Green Bananas (Matoke)", "Onions", "Tomatoes", "Peanut Butter", "Water"],
    steps: [
      { step: 1, instruction: "Peel and chop the matoke. Boil in water until tender." },
      { step: 2, instruction: "In a separate pan, fry onions and tomatoes." },
      { step: 3, instruction: "Mix a few tablespoons of peanut butter with a little water to make a smooth paste." },
      { step: 4, instruction: "Add the peanut paste to the onions and tomatoes, then add the boiled matoke. Simmer for 10 minutes." },
    ],
    estimated_cost_ksh: 220,
    cook_time_minutes: 30,
    category: "Vegetarian",
  }
  // ... Add 190+ more diverse recipes here to reach the 200+ goal
];
