
import { Recipe } from "../../types";

export const OFFLINE_RECIPES: Recipe[] = [
  // --- UNDER 30 KSH (SURVIVAL / SNACK) ---
  {
    id: "surv_001",
    title: "Strong Tea (Sturungi) & Mandazi",
    ingredients: ["Water", "Tea Leaves", "Sugar", "Mandazi"],
    steps: [{ step: 1, instruction: "Boil water with tea leaves, add sugar." }, { step: 2, instruction: "Serve hot with a mandazi." }],
    estimated_cost_ksh: 25,
    cook_time_minutes: 10,
    category: "Breakfast"
  },
  {
    id: "surv_002",
    title: "Uji wa Wimbi (Millet Porridge)",
    ingredients: ["Millet Flour", "Water", "Sugar"],
    steps: [{ step: 1, instruction: "Mix flour with cold water." }, { step: 2, instruction: "Boil water and stir in paste." }, { step: 3, instruction: "Cook 10 mins, sweeten." }],
    estimated_cost_ksh: 20,
    cook_time_minutes: 15,
    category: "Breakfast"
  },
  {
    id: "surv_003",
    title: "Boiled Maize (Mahindi Chemsha)",
    ingredients: ["Green Maize Cob", "Salt", "Water"],
    steps: [{ step: 1, instruction: "Boil maize cob in salted water until soft." }],
    estimated_cost_ksh: 30,
    cook_time_minutes: 45,
    category: "Snack"
  },
  {
    id: "surv_004",
    title: "Roasted Sweet Potato",
    ingredients: ["Sweet Potato"],
    steps: [{ step: 1, instruction: "Roast potato over charcoal or oven until tender." }],
    estimated_cost_ksh: 25,
    cook_time_minutes: 20,
    category: "Snack"
  },
  {
    id: "surv_005",
    title: "Toast & Margarine",
    ingredients: ["Bread Slices (3)", "Blueband"],
    steps: [{ step: 1, instruction: "Toast bread." }, { step: 2, instruction: "Spread margarine generousy." }],
    estimated_cost_ksh: 20,
    cook_time_minutes: 5,
    category: "Breakfast"
  },
  {
    id: "surv_006",
    title: "Banana & Groundnuts",
    ingredients: ["Ripe Banana", "Roasted Groundnuts"],
    steps: [{ step: 1, instruction: "Peel banana and serve with nuts." }],
    estimated_cost_ksh: 30,
    cook_time_minutes: 0,
    category: "Snack"
  },

  // --- UNDER 50 KSH (ULTRA BUDGET) ---
  {
    id: "bud_001",
    title: "Ugali & Sukuma (Basic)",
    ingredients: ["Maize Flour", "Sukuma Wiki", "Salt", "Onion"],
    steps: [{ step: 1, instruction: "Make stiff Ugali." }, { step: 2, instruction: "Fry sukuma with onion and salt." }],
    estimated_cost_ksh: 45,
    cook_time_minutes: 20,
    category: "Ugali Dishes"
  },
  {
    id: "bud_002",
    title: "Githeri (Plain)",
    ingredients: ["Boiled Maize & Beans", "Salt"],
    steps: [{ step: 1, instruction: "Warm boiled githeri with salt." }],
    estimated_cost_ksh: 40,
    cook_time_minutes: 5,
    category: "Budget Meals"
  },
  {
    id: "bud_003",
    title: "Fried Egg & Bread",
    ingredients: ["Egg", "Bread (2 slices)", "Oil", "Salt"],
    steps: [{ step: 1, instruction: "Fry egg." }, { step: 2, instruction: "Sandwich between bread." }],
    estimated_cost_ksh: 50,
    cook_time_minutes: 10,
    category: "Breakfast"
  },
  {
    id: "bud_004",
    title: "Avocado Toast (Kenyan Style)",
    ingredients: ["Avocado", "Bread", "Salt"],
    steps: [{ step: 1, instruction: "Mash avocado onto bread." }, { step: 2, instruction: "Salt heavily." }],
    estimated_cost_ksh: 50,
    cook_time_minutes: 2,
    category: "Lunch"
  },
  {
    id: "bud_005",
    title: "Kachumbari & Smokies",
    ingredients: ["Smokies (2)", "Tomato", "Onion"],
    steps: [{ step: 1, instruction: "Chop veggies." }, { step: 2, instruction: "Eat with smokies." }],
    estimated_cost_ksh: 50,
    cook_time_minutes: 5,
    category: "Snack"
  },
  {
    id: "bud_006",
    title: "Omena Fry (Small Portion)",
    ingredients: ["Omena", "Onion", "Tomato", "Oil"],
    steps: [{ step: 1, instruction: "Wash omena." }, { step: 2, instruction: "Fry with onion/tomato." }],
    estimated_cost_ksh: 50,
    cook_time_minutes: 20,
    category: "Dinner"
  },
  {
    id: "bud_007",
    title: "Chapati & Tea",
    ingredients: ["Wheat Flour", "Oil", "Tea Leaves", "Milk"],
    steps: [{ step: 1, instruction: "Make 2 chapatis." }, { step: 2, instruction: "Serve with tea." }],
    estimated_cost_ksh: 50,
    cook_time_minutes: 40,
    category: "Breakfast"
  },
  {
    id: "bud_008",
    title: "Boiled Cassava (Muhogo)",
    ingredients: ["Cassava", "Salt", "Chili"],
    steps: [{ step: 1, instruction: "Boil cassava until soft." }, { step: 2, instruction: "Serve with chili lemon salt." }],
    estimated_cost_ksh: 40,
    cook_time_minutes: 30,
    category: "Lunch"
  },

  // --- UNDER 80 KSH (ECONOMY) ---
  {
    id: "econ_001",
    title: "Ugali & Omena",
    ingredients: ["Maize Flour", "Omena", "Tomato", "Oil"],
    steps: [{ step: 1, instruction: "Cook ugali." }, { step: 2, instruction: "Fry omena with tomato base." }],
    estimated_cost_ksh: 75,
    cook_time_minutes: 30,
    category: "Ugali Dishes"
  },
  {
    id: "econ_002",
    title: "Chapati & Beans",
    ingredients: ["Chapati", "Beans Stew"],
    steps: [{ step: 1, instruction: "Serve chapati with bean stew." }],
    estimated_cost_ksh: 70,
    cook_time_minutes: 10,
    category: "Chapati Dishes"
  },
  {
    id: "econ_003",
    title: "Rice & Cabbage",
    ingredients: ["Rice", "Cabbage", "Onion", "Carrot"],
    steps: [{ step: 1, instruction: "Boil rice." }, { step: 2, instruction: "Steam cabbage with veggies." }],
    estimated_cost_ksh: 80,
    cook_time_minutes: 25,
    category: "Rice Dishes"
  },
  {
    id: "econ_004",
    title: "Mayai Curry & Ugali",
    ingredients: ["Eggs (2)", "Tomato", "Onion", "Maize Flour"],
    steps: [{ step: 1, instruction: "Make tomato gravy." }, { step: 2, instruction: "Add boiled eggs." }, { step: 3, instruction: "Serve with Ugali." }],
    estimated_cost_ksh: 80,
    cook_time_minutes: 25,
    category: "Ugali Dishes"
  },
  {
    id: "econ_005",
    title: "Soya Chunks & Rice",
    ingredients: ["Soya Chunks", "Rice", "Tomato", "Royco"],
    steps: [{ step: 1, instruction: "Soak soya." }, { step: 2, instruction: "Fry with tomato/royco." }, { step: 3, instruction: "Eat with rice." }],
    estimated_cost_ksh: 75,
    cook_time_minutes: 30,
    category: "Rice Dishes"
  },
  {
    id: "econ_006",
    title: "Ndengu & Rice (Small)",
    ingredients: ["Green Grams", "Rice", "Onion"],
    steps: [{ step: 1, instruction: "Boil rice." }, { step: 2, instruction: "Fry ndengu." }],
    estimated_cost_ksh: 80,
    cook_time_minutes: 35,
    category: "Rice Dishes"
  },
  {
    id: "econ_007",
    title: "Ugali & Managu",
    ingredients: ["Maize Flour", "Managu", "Milk/Cream"],
    steps: [{ step: 1, instruction: "Cook Ugali." }, { step: 2, instruction: "Fried managu with dash of milk." }],
    estimated_cost_ksh: 80,
    cook_time_minutes: 30,
    category: "Ugali Dishes"
  },

  // --- UNDER 100 KSH (STANDARD) ---
  {
    id: "std_001",
    title: "Ugali, Sukuma & Avocado",
    ingredients: ["Maize Flour", "Sukuma Wiki", "Avocado", "Tomato"],
    steps: [{ step: 1, instruction: "Prepare Ugali." }, { step: 2, instruction: "Fry sukuma." }, { step: 3, instruction: "Add avocado side." }],
    estimated_cost_ksh: 95,
    cook_time_minutes: 30,
    category: "Ugali Dishes"
  },
  {
    id: "std_002",
    title: "Githeri Special",
    ingredients: ["Maize", "Beans", "Potatoes", "Carrots", "Beef Cube"],
    steps: [{ step: 1, instruction: "Fry githeri." }, { step: 2, instruction: "Add potatoes/carrots." }, { step: 3, instruction: "Simmer." }],
    estimated_cost_ksh: 100,
    cook_time_minutes: 35,
    category: "Budget Meals"
  },
  {
    id: "std_003",
    title: "Indomie & Egg",
    ingredients: ["Indomie (2)", "Egg", "Onion"],
    steps: [{ step: 1, instruction: "Fry onion." }, { step: 2, instruction: "Cook noodles." }, { step: 3, instruction: "Add egg." }],
    estimated_cost_ksh: 90,
    cook_time_minutes: 10,
    category: "Fast Food"
  },
  {
    id: "std_004",
    title: "French Toast & Tea",
    ingredients: ["Bread", "Eggs", "Milk", "Tea Leaves"],
    steps: [{ step: 1, instruction: "Dip bread in egg mix." }, { step: 2, instruction: "Fry." }, { step: 3, instruction: "Serve with tea." }],
    estimated_cost_ksh: 95,
    cook_time_minutes: 15,
    category: "Breakfast"
  },
  {
    id: "std_005",
    title: "Smocha (Smokie Chapati)",
    ingredients: ["Chapati", "Smokie", "Kachumbari"],
    steps: [{ step: 1, instruction: "Wrap smokie and salsa in chapati." }],
    estimated_cost_ksh: 90,
    cook_time_minutes: 5,
    category: "Street Food"
  },
  {
    id: "std_006",
    title: "Spaghetti & Egg Curry",
    ingredients: ["Spaghetti", "Eggs", "Tomato Paste"],
    steps: [{ step: 1, instruction: "Boil spaghetti." }, { step: 2, instruction: "Make egg curry." }],
    estimated_cost_ksh: 100,
    cook_time_minutes: 20,
    category: "Dinner"
  },

  // --- UNDER 150 KSH (FILLING) ---
  {
    id: "fill_001",
    title: "Ugali & Matumbo",
    ingredients: ["Maize Flour", "Matumbo", "Onion", "Dania"],
    steps: [{ step: 1, instruction: "Boil matumbo tender." }, { step: 2, instruction: "Fry." }, { step: 3, instruction: "Serve with Ugali." }],
    estimated_cost_ksh: 140,
    cook_time_minutes: 60,
    category: "Ugali Dishes"
  },
  {
    id: "fill_002",
    title: "Chapati & Ndengu",
    ingredients: ["Wheat Flour", "Green Grams", "Carrots"],
    steps: [{ step: 1, instruction: "Make chapati." }, { step: 2, instruction: "Fry ndengu." }],
    estimated_cost_ksh: 130,
    cook_time_minutes: 60,
    category: "Chapati Dishes"
  },
  {
    id: "fill_003",
    title: "Rice & Minced Meat",
    ingredients: ["Rice", "Minced Meat", "Peas"],
    steps: [{ step: 1, instruction: "Fry mince with peas." }, { step: 2, instruction: "Serve with rice." }],
    estimated_cost_ksh: 150,
    cook_time_minutes: 40,
    category: "Rice Dishes"
  },
  {
    id: "fill_004",
    title: "Vegetable Fried Rice",
    ingredients: ["Rice", "Mixed Veggies", "Egg", "Soy Sauce"],
    steps: [{ step: 1, instruction: "Stir fry rice with veggies/egg." }],
    estimated_cost_ksh: 120,
    cook_time_minutes: 30,
    category: "Rice Dishes"
  },
  {
    id: "fill_005",
    title: "Ugali & Mala",
    ingredients: ["Maize Flour", "Mala (Fermented Milk)"],
    steps: [{ step: 1, instruction: "Cook stiff Ugali." }, { step: 2, instruction: "Serve with cold Mala." }],
    estimated_cost_ksh: 110,
    cook_time_minutes: 20,
    category: "Traditional"
  },
  {
    id: "fill_006",
    title: "Pancake & Sausage Breakfast",
    ingredients: ["Flour", "Egg", "Milk", "Sausage"],
    steps: [{ step: 1, instruction: "Make pancakes." }, { step: 2, instruction: "Fry sausage." }],
    estimated_cost_ksh: 140,
    cook_time_minutes: 25,
    category: "Breakfast"
  },

  // --- UNDER 200 KSH (COMFORT) ---
  {
    id: "comf_001",
    title: "Ugali & Beef Stew",
    ingredients: ["Maize Flour", "Beef", "Tomato", "Royco"],
    steps: [{ step: 1, instruction: "Boil beef." }, { step: 2, instruction: "Fry into stew." }, { step: 3, instruction: "Eat with Ugali." }],
    estimated_cost_ksh: 190,
    cook_time_minutes: 50,
    category: "Ugali Dishes"
  },
  {
    id: "comf_002",
    title: "Chips Masala",
    ingredients: ["Potatoes", "Oil", "Tomato Paste", "Chili"],
    steps: [{ step: 1, instruction: "Deep fry chips." }, { step: 2, instruction: "Toss in masala sauce." }],
    estimated_cost_ksh: 180,
    cook_time_minutes: 40,
    category: "Fast Food"
  },
  {
    id: "comf_003",
    title: "Matoke with Groundnuts",
    ingredients: ["Green Bananas", "Peanut Powder", "Tomatoes"],
    steps: [{ step: 1, instruction: "Boil matoke." }, { step: 2, instruction: "Add peanut sauce." }],
    estimated_cost_ksh: 160,
    cook_time_minutes: 35,
    category: "Traditional"
  },
  {
    id: "comf_004",
    title: "Pilau (Vegetarian)",
    ingredients: ["Rice", "Pilau Masala", "Potatoes"],
    steps: [{ step: 1, instruction: "Cook rice with spices and potatoes." }],
    estimated_cost_ksh: 160,
    cook_time_minutes: 40,
    category: "Rice Dishes"
  },
  {
    id: "comf_005",
    title: "Spaghetti Bolognese (Kenyan)",
    ingredients: ["Spaghetti", "Minced Meat", "Tomato"],
    steps: [{ step: 1, instruction: "Cook pasta." }, { step: 2, instruction: "Make meat sauce." }],
    estimated_cost_ksh: 200,
    cook_time_minutes: 30,
    category: "Dinner"
  },

  // --- UNDER 250 KSH (PREMIUM) ---
  {
    id: "prem_001",
    title: "Pilau Njeri (Beef)",
    ingredients: ["Rice", "Beef", "Potatoes", "Pilau Masala"],
    steps: [{ step: 1, instruction: "Fry beef/potatoes." }, { step: 2, instruction: "Add rice/water." }],
    estimated_cost_ksh: 240,
    cook_time_minutes: 55,
    category: "Rice Dishes"
  },
  {
    id: "prem_002",
    title: "Fish & Ugali",
    ingredients: ["Fish Piece", "Ugali Flour", "Sukuma"],
    steps: [{ step: 1, instruction: "Fry fish." }, { step: 2, instruction: "Make stew." }, { step: 3, instruction: "Serve with Ugali." }],
    estimated_cost_ksh: 250,
    cook_time_minutes: 45,
    category: "Ugali Dishes"
  },
  {
    id: "prem_003",
    title: "Chicken Stew & Chapati",
    ingredients: ["Chicken", "Wheat Flour", "Onion"],
    steps: [{ step: 1, instruction: "Cook chicken stew." }, { step: 2, instruction: "Eat with chapati." }],
    estimated_cost_ksh: 250,
    cook_time_minutes: 90,
    category: "Chapati Dishes"
  },
  {
    id: "prem_004",
    title: "Liver & Rice",
    ingredients: ["Beef Liver", "Rice", "Peppers"],
    steps: [{ step: 1, instruction: "Pan fry liver with peppers." }, { step: 2, instruction: "Serve with rice." }],
    estimated_cost_ksh: 230,
    cook_time_minutes: 25,
    category: "Rice Dishes"
  },

  // --- UNDER 300 KSH (FEAST) ---
  {
    id: "feast_001",
    title: "Wet Fry Beef & Mukimo",
    ingredients: ["Beef", "Potatoes", "Maize", "Pumpkin Leaves"],
    steps: [{ step: 1, instruction: "Mash mukimo ingredients." }, { step: 2, instruction: "Wet fry beef." }],
    estimated_cost_ksh: 290,
    cook_time_minutes: 60,
    category: "Traditional"
  },
  {
    id: "feast_002",
    title: "Bhajia & Sausage Feast",
    ingredients: ["Potatoes", "Gram Flour", "Sausages"],
    steps: [{ step: 1, instruction: "Fry battered potatoes." }, { step: 2, instruction: "Fry sausages." }],
    estimated_cost_ksh: 280,
    cook_time_minutes: 45,
    category: "Fast Food"
  },
  {
    id: "feast_003",
    title: "Kuku Choma & Ugali",
    ingredients: ["Chicken Quarter", "Ugali Flour", "Kachumbari"],
    steps: [{ step: 1, instruction: "Roast chicken." }, { step: 2, instruction: "Serve with Ugali/Salsa." }],
    estimated_cost_ksh: 300,
    cook_time_minutes: 60,
    category: "Special"
  }
];
