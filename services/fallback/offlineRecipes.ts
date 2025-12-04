
import { Recipe } from "../../types";

export const OFFLINE_RECIPES: Recipe[] = [
  // --- UNDER 30 KSH (SURVIVAL / SNACK) ---
  {
    id: "surv_001",
    title: "Strong Tea (Sturungi) & Mandazi",
    ingredients: ["Water", "Tea Leaves", "Sugar", "Mandazi (Street bought)"],
    steps: [
      { step: 1, instruction: "Boil water with tea leaves." },
      { step: 2, instruction: "Add sugar to taste." },
      { step: 3, instruction: "Serve hot with a mandazi." }
    ],
    estimated_cost_ksh: 25,
    cook_time_minutes: 10,
    category: "Breakfast",
  },
  {
    id: "surv_002",
    title: "Uji wa Wimbi (Millet Porridge)",
    ingredients: ["Millet Flour", "Water", "Sugar"],
    steps: [
      { step: 1, instruction: "Mix flour with cold water to make a paste." },
      { step: 2, instruction: "Boil water and stir in the paste." },
      { step: 3, instruction: "Cook for 10 mins stirring constantly. Add sugar." }
    ],
    estimated_cost_ksh: 20,
    cook_time_minutes: 15,
    category: "Breakfast",
  },
  {
    id: "surv_003",
    title: "Boiled Maize (Mahindi Chemsha)",
    ingredients: ["Green Maize Cob", "Salt", "Water"],
    steps: [
      { step: 1, instruction: "Boil maize cob in salted water until soft." }
    ],
    estimated_cost_ksh: 30,
    cook_time_minutes: 45,
    category: "Snack",
  },
  {
    id: "surv_004",
    title: "Roasted Sweet Potato",
    ingredients: ["Sweet Potato", "Charcoal/Fire"],
    steps: [
      { step: 1, instruction: "Wash potato and roast over open fire or charcoal jiko." }
    ],
    estimated_cost_ksh: 25,
    cook_time_minutes: 20,
    category: "Snack",
  },

  // --- UNDER 50 KSH (ULTRA BUDGET) ---
  {
    id: "bud_001",
    title: "Ugali & Sukuma (Basic)",
    ingredients: ["Maize Flour (Small)", "Sukuma Wiki", "Salt", "Onion"],
    steps: [
      { step: 1, instruction: "Make a small stiff Ugali." },
      { step: 2, instruction: "Fry onion, add chopped sukuma, steam for 3 mins." }
    ],
    estimated_cost_ksh: 45,
    cook_time_minutes: 20,
    category: "Ugali Dishes",
  },
  {
    id: "bud_002",
    title: "Githeri (Plain)",
    ingredients: ["Boiled Maize & Beans Mixture", "Salt"],
    steps: [
      { step: 1, instruction: "Buy boiled githeri from mama mboga." },
      { step: 2, instruction: "Warm it up with a pinch of salt." }
    ],
    estimated_cost_ksh: 40,
    cook_time_minutes: 5,
    category: "Budget Meals",
  },
  {
    id: "bud_003",
    title: "Fried Egg & Bread Slices",
    ingredients: ["Egg", "Bread (2 slices)", "Oil", "Salt"],
    steps: [
      { step: 1, instruction: "Fry the egg." },
      { step: 2, instruction: "Serve between bread slices." }
    ],
    estimated_cost_ksh: 50,
    cook_time_minutes: 10,
    category: "Breakfast",
  },
  {
    id: "bud_004",
    title: "Avocado & Bread",
    ingredients: ["Avocado (Half)", "Bread (Quarter loaf)", "Salt"],
    steps: [
      { step: 1, instruction: "Slice avocado onto bread." },
      { step: 2, instruction: "Sprinkle salt and eat." }
    ],
    estimated_cost_ksh: 50,
    cook_time_minutes: 2,
    category: "Lunch",
  },
  {
    id: "bud_005",
    title: "Kachumbari & Smokies",
    ingredients: ["Smokies (2)", "Tomato", "Onion", "Dania"],
    steps: [
      { step: 1, instruction: "Chop veggies for kachumbari." },
      { step: 2, instruction: "Eat with ready smokies." }
    ],
    estimated_cost_ksh: 50,
    cook_time_minutes: 5,
    category: "Snack",
  },

  // --- UNDER 80 KSH (ECONOMY) ---
  {
    id: "econ_001",
    title: "Ugali & Omena (Small)",
    ingredients: ["Maize Flour", "Omena (Handful)", "Tomato", "Oil"],
    steps: [
      { step: 1, instruction: "Wash omena in hot water." },
      { step: 2, instruction: "Fry with tomato and oil." },
      { step: 3, instruction: "Serve with small ugali." }
    ],
    estimated_cost_ksh: 75,
    cook_time_minutes: 30,
    category: "Ugali Dishes",
  },
  {
    id: "econ_002",
    title: "Chapati & Beans (Kibandaski Style)",
    ingredients: ["Chapati (1)", "Beans Stew (Cup)"],
    steps: [
      { step: 1, instruction: "Make or buy one chapati." },
      { step: 2, instruction: "Serve with simple bean stew." }
    ],
    estimated_cost_ksh: 70,
    cook_time_minutes: 10,
    category: "Chapati Dishes",
  },
  {
    id: "econ_003",
    title: "Rice & Cabbage",
    ingredients: ["Rice", "Cabbage", "Onion", "Carrot"],
    steps: [
      { step: 1, instruction: "Boil rice." },
      { step: 2, instruction: "Steam cabbage with onions and carrots." }
    ],
    estimated_cost_ksh: 80,
    cook_time_minutes: 25,
    category: "Rice Dishes",
  },
  {
    id: "econ_004",
    title: "Mayai Curry & Ugali",
    ingredients: ["Eggs (2)", "Tomato", "Onion", "Maize Flour"],
    steps: [
      { step: 1, instruction: "Boil eggs, shell them." },
      { step: 2, instruction: "Make a thick tomato gravy, add eggs." },
      { step: 3, instruction: "Serve with Ugali." }
    ],
    estimated_cost_ksh: 80,
    cook_time_minutes: 25,
    category: "Ugali Dishes",
  },
  {
    id: "econ_005",
    title: "Soya Chunks & Rice",
    ingredients: ["Soya Chunks", "Rice", "Tomato", "Royco"],
    steps: [
      { step: 1, instruction: "Soak soya chunks." },
      { step: 2, instruction: "Fry with tomatoes and spices." },
      { step: 3, instruction: "Serve with white rice." }
    ],
    estimated_cost_ksh: 75,
    cook_time_minutes: 30,
    category: "Rice Dishes",
  },

  // --- UNDER 100 KSH (STANDARD) ---
  {
    id: "std_001",
    title: "Ugali, Sukuma & Avocado",
    ingredients: ["Maize Flour", "Sukuma Wiki", "Avocado", "Tomato", "Onion"],
    steps: [
      { step: 1, instruction: "Prepare Ugali." },
      { step: 2, instruction: "Fry Sukuma with onions and tomatoes." },
      { step: 3, instruction: "Serve with a side of avocado slices." }
    ],
    estimated_cost_ksh: 95,
    cook_time_minutes: 30,
    category: "Ugali Dishes",
  },
  {
    id: "std_002",
    title: "Githeri Special",
    ingredients: ["Maize", "Beans", "Potatoes", "Carrots", "Beef Cube (Knorr)"],
    steps: [
      { step: 1, instruction: "Fry boiled maize and beans." },
      { step: 2, instruction: "Add diced potatoes and carrots." },
      { step: 3, instruction: "Simmer with beef cube until potatoes are soft." }
    ],
    estimated_cost_ksh: 100,
    cook_time_minutes: 35,
    category: "Budget Meals",
  },
  {
    id: "std_003",
    title: "Indomie (2 packs) & Egg",
    ingredients: ["Indomie Noodles", "Egg", "Onion"],
    steps: [
      { step: 1, instruction: "Fry onion, add water and noodles." },
      { step: 2, instruction: "Break an egg into the boiling noodles." },
      { step: 3, instruction: "Cook until water reduces." }
    ],
    estimated_cost_ksh: 90,
    cook_time_minutes: 10,
    category: "Fast Food",
  },
  {
    id: "std_004",
    title: "French Toast & Tea",
    ingredients: ["Bread", "Eggs", "Milk", "Tea Leaves", "Sugar"],
    steps: [
      { step: 1, instruction: "Dip bread in beaten egg and fry." },
      { step: 2, instruction: "Serve with hot milk tea." }
    ],
    estimated_cost_ksh: 95,
    cook_time_minutes: 15,
    category: "Breakfast",
  },
  
  // --- UNDER 150 KSH (FILLING) ---
  {
    id: "fill_001",
    title: "Ugali & Matumbo (Tripe)",
    ingredients: ["Maize Flour", "Matumbo (Quarter kg)", "Onion", "Dania"],
    steps: [
      { step: 1, instruction: "Thoroughly clean and boil matumbo." },
      { step: 2, instruction: "Fry with plenty of onions and dania." },
      { step: 3, instruction: "Serve with Ugali." }
    ],
    estimated_cost_ksh: 140,
    cook_time_minutes: 60,
    category: "Ugali Dishes",
  },
  {
    id: "fill_002",
    title: "Chapati & Ndengu Stew",
    ingredients: ["Wheat Flour", "Green Grams (Ndengu)", "Carrots", "Onion", "Coriander"],
    steps: [
      { step: 1, instruction: "Make soft chapatis." },
      { step: 2, instruction: "Fry boiled ndengu with carrots and coriander." },
      { step: 3, instruction: "Serve hot." }
    ],
    estimated_cost_ksh: 130,
    cook_time_minutes: 60,
    category: "Chapati Dishes",
  },
  {
    id: "fill_003",
    title: "Rice & Minced Meat (Small)",
    ingredients: ["Rice", "Minced Meat (150g)", "Peas", "Onion"],
    steps: [
      { step: 1, instruction: "Fry minced meat with peas." },
      { step: 2, instruction: "Serve with steamed rice." }
    ],
    estimated_cost_ksh: 150,
    cook_time_minutes: 40,
    category: "Rice Dishes",
  },
  {
    id: "fill_004",
    title: "Vegetable Fried Rice",
    ingredients: ["Rice", "Mixed Veggies (Corn, Peas, Carrot)", "Egg", "Soy Sauce"],
    steps: [
      { step: 1, instruction: "Boil rice and let cool." },
      { step: 2, instruction: "Stir fry veggies and scrambled egg." },
      { step: 3, instruction: "Toss rice in pan with soy sauce." }
    ],
    estimated_cost_ksh: 120,
    cook_time_minutes: 30,
    category: "Rice Dishes",
  },

  // --- UNDER 200 KSH (COMFORT) ---
  {
    id: "comf_001",
    title: "Ugali & Beef Stew",
    ingredients: ["Maize Flour", "Beef (Quarter)", "Tomatoes", "Onion", "Royco"],
    steps: [
      { step: 1, instruction: "Boil beef until tender." },
      { step: 2, instruction: "Fry with tomatoes and onion to make thick stew." },
      { step: 3, instruction: "Serve with Ugali." }
    ],
    estimated_cost_ksh: 190,
    cook_time_minutes: 50,
    category: "Ugali Dishes",
  },
  {
    id: "comf_002",
    title: "Chips Masala",
    ingredients: ["Potatoes", "Oil", "Tomato Paste", "Chili", "Dania"],
    steps: [
      { step: 1, instruction: "Deep fry potato chips." },
      { step: 2, instruction: "Toss in spicy tomato masala sauce." },
      { step: 3, instruction: "Garnish with dania." }
    ],
    estimated_cost_ksh: 180,
    cook_time_minutes: 40,
    category: "Fast Food",
  },
  {
    id: "comf_003",
    title: "Matoke with Groundnuts",
    ingredients: ["Green Bananas", "Peanut Powder", "Tomatoes", "Onions"],
    steps: [
      { step: 1, instruction: "Peel and boil matoke with onions." },
      { step: 2, instruction: "Stir in peanut powder to create thick sauce." }
    ],
    estimated_cost_ksh: 160,
    cook_time_minutes: 35,
    category: "Traditional",
  },

  // --- UNDER 250 KSH (PREMIUM) ---
  {
    id: "prem_001",
    title: "Pilau Njeri",
    ingredients: ["Rice", "Beef", "Potatoes", "Pilau Masala", "Kachumbari"],
    steps: [
      { step: 1, instruction: "Fry beef and potatoes with masala." },
      { step: 2, instruction: "Add rice and water, cook until dry." },
      { step: 3, instruction: "Serve with kachumbari." }
    ],
    estimated_cost_ksh: 240,
    cook_time_minutes: 55,
    category: "Rice Dishes",
  },
  {
    id: "prem_002",
    title: "Fish (Tilapia Piece) & Ugali",
    ingredients: ["Fish Piece", "Ugali Flour", "Sukuma Wiki"],
    steps: [
      { step: 1, instruction: "Deep fry fish piece." },
      { step: 2, instruction: "Make stew with onions and tomatoes." },
      { step: 3, instruction: "Serve with Ugali and greens." }
    ],
    estimated_cost_ksh: 250,
    cook_time_minutes: 45,
    category: "Ugali Dishes",
  },
  {
    id: "prem_003",
    title: "Chicken Stew (Kienyeji Style) & Chapati",
    ingredients: ["Chicken (Quarter)", "Wheat Flour", "Onion", "Tomato", "Coriander"],
    steps: [
      { step: 1, instruction: "Slow cook chicken until soft." },
      { step: 2, instruction: "Make chapatis." },
      { step: 3, instruction: "Serve stew with chapati." }
    ],
    estimated_cost_ksh: 250,
    cook_time_minutes: 90,
    category: "Chapati Dishes",
  },

  // --- UNDER 300 KSH (FEAST) ---
  {
    id: "feast_001",
    title: "Wet Fry Beef & Mukimo",
    ingredients: ["Beef", "Potatoes", "Pumpkin Leaves", "Maize", "Onions"],
    steps: [
      { step: 1, instruction: "Mash boiled potatoes, pumpkin leaves and maize for Mukimo." },
      { step: 2, instruction: "Wet fry beef with plenty of tomatoes." }
    ],
    estimated_cost_ksh: 290,
    cook_time_minutes: 60,
    category: "Traditional",
  },
  {
    id: "feast_002",
    title: "Bhajia & Sausage Feast",
    ingredients: ["Potatoes", "Gram Flour", "Sausages (2)", "Ukewaju Sauce"],
    steps: [
      { step: 1, instruction: "Coat sliced potatoes in colored gram flour batter." },
      { step: 2, instruction: "Deep fry until crispy." },
      { step: 3, instruction: "Serve with fried sausages and tamarind sauce." }
    ],
    estimated_cost_ksh: 280,
    cook_time_minutes: 45,
    category: "Fast Food",
  }
];
