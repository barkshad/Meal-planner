import { Recipe } from "../../types";

export const OFFLINE_RECIPES: Recipe[] = [
  // --- BREAKFAST ---
  {
    id: "bf_001",
    title: "Swahili Mahamri & Mbaazi",
    category: "Breakfast",
    region: "Coastal",
    moods: ["Happy", "Healthy"],
    isQuickMeal: false,
    estimated_cost_ksh: 80,
    cook_time_minutes: 60,
    ingredients: ["Flour", "Coconut Milk", "Cardamom", "Pigeon Peas", "Coconut Cream"],
    detailed_ingredients: [
      { item: "Wheat Flour", price_range_ksh: "20", estimated_cost: 20 },
      { item: "Coconut Milk", price_range_ksh: "30", estimated_cost: 30 },
      { item: "Pigeon Peas (Mbaazi)", price_range_ksh: "30", estimated_cost: 30 }
    ],
    steps: [
      { step: 1, instruction: "Mix flour, sugar, cardamom and coconut milk to make dough." },
      { step: 2, instruction: "Let dough rise, then fry into golden brown Mahamri." },
      { step: 3, instruction: "Boil mbaazi in coconut milk until thick." }
    ]
  },
  {
    id: "bf_002",
    title: "Kikuyu Arrowroots (Nduma) & Tea",
    category: "Breakfast",
    region: "Central",
    moods: ["Healthy", "Tired"],
    isQuickMeal: true,
    estimated_cost_ksh: 120,
    cook_time_minutes: 40,
    ingredients: ["Nduma", "Water", "Milk", "Tea Leaves"],
    detailed_ingredients: [
      { item: "Arrowroots", price_range_ksh: "80", estimated_cost: 80 },
      { item: "Milk", price_range_ksh: "30", estimated_cost: 30 },
      { item: "Tea Leaves", price_range_ksh: "10", estimated_cost: 10 }
    ],
    steps: [
      { step: 1, instruction: "Peel and boil Nduma until soft." },
      { step: 2, instruction: "Prepare Kenyan mixed tea." }
    ]
  },
  {
    id: "bf_003",
    title: "Street Smokie Pasua & Kachumbari",
    category: "Snack",
    region: "Nairobi",
    moods: ["Broke", "Tired"],
    isQuickMeal: true,
    estimated_cost_ksh: 35,
    cook_time_minutes: 2,
    ingredients: ["Smokie", "Tomato", "Onion", "Chili"],
    detailed_ingredients: [
      { item: "Smokie", price_range_ksh: "25", estimated_cost: 25 },
      { item: "Kachumbari", price_range_ksh: "10", estimated_cost: 10 }
    ],
    steps: [
      { step: 1, instruction: "Split smokie." },
      { step: 2, instruction: "Fill with fresh kachumbari." }
    ]
  },
  {
    id: "bf_004",
    title: "Wimbi Porridge (Uji)",
    category: "Drink",
    region: "Western",
    moods: ["Healthy", "Stressed"],
    isQuickMeal: true,
    estimated_cost_ksh: 30,
    cook_time_minutes: 15,
    ingredients: ["Millet Flour", "Water", "Sugar", "Lemon"],
    detailed_ingredients: [
      { item: "Millet Flour", price_range_ksh: "20", estimated_cost: 20 },
      { item: "Lemon", price_range_ksh: "10", estimated_cost: 10 }
    ],
    steps: [
      { step: 1, instruction: "Mix flour with cold water to paste." },
      { step: 2, instruction: "Pour into boiling water, stir continuously." },
      { step: 3, instruction: "Add lemon and sugar." }
    ]
  },
  {
    id: "bf_005",
    title: "Sweet Potato & Black Tea",
    category: "Breakfast",
    region: "Western",
    moods: ["Broke", "Healthy"],
    isQuickMeal: false,
    estimated_cost_ksh: 50,
    cook_time_minutes: 30,
    ingredients: ["Sweet Potato", "Water", "Tea Leaves"],
    detailed_ingredients: [
      { item: "Sweet Potato", price_range_ksh: "40", estimated_cost: 40 },
      { item: "Tea Leaves", price_range_ksh: "10", estimated_cost: 10 }
    ],
    steps: [
      { step: 1, instruction: "Boil or roast sweet potatoes." },
      { step: 2, instruction: "Serve with strong black tea (strungi)." }
    ]
  },

  // --- LUNCH ---
  {
    id: "ln_001",
    title: "Githeri Special (Avocado)",
    category: "Lunch",
    region: "Central",
    moods: ["Broke", "Healthy"],
    isQuickMeal: true,
    estimated_cost_ksh: 70,
    cook_time_minutes: 10,
    ingredients: ["Boiled Maize & Beans", "Avocado", "Salt"],
    detailed_ingredients: [
      { item: "Githeri (Boiled)", price_range_ksh: "40", estimated_cost: 40 },
      { item: "Avocado", price_range_ksh: "30", estimated_cost: 30 }
    ],
    steps: [
      { step: 1, instruction: "Buy or warm boiled githeri." },
      { step: 2, instruction: "Dice avocado and mix in with salt." }
    ]
  },
  {
    id: "ln_002",
    title: "Ugali & Omena Fry",
    category: "Lunch",
    region: "Nyanza",
    moods: ["Healthy", "Stressed"],
    isQuickMeal: false,
    estimated_cost_ksh: 110,
    cook_time_minutes: 40,
    ingredients: ["Maize Flour", "Omena", "Tomato", "Onion", "Milk"],
    detailed_ingredients: [
      { item: "Omena", price_range_ksh: "50", estimated_cost: 50 },
      { item: "Flour", price_range_ksh: "20", estimated_cost: 20 },
      { item: "Veggies", price_range_ksh: "40", estimated_cost: 40 }
    ],
    steps: [
      { step: 1, instruction: "Sort and wash omena in hot water." },
      { step: 2, instruction: "Fry onion and tomatoes, add omena." },
      { step: 3, instruction: "Add a splash of milk and simmer. Serve with Ugali." }
    ]
  },
  {
    id: "ln_003",
    title: "Chips Mwitu & Sausage",
    category: "Lunch",
    region: "Nairobi",
    moods: ["Happy", "Tired"],
    isQuickMeal: true,
    estimated_cost_ksh: 100,
    cook_time_minutes: 5,
    ingredients: ["Fries", "Sausage", "Tomato Sauce"],
    detailed_ingredients: [
      { item: "Chips", price_range_ksh: "70", estimated_cost: 70 },
      { item: "Sausage", price_range_ksh: "30", estimated_cost: 30 }
    ],
    steps: [
      { step: 1, instruction: "Buy portion of chips." },
      { step: 2, instruction: "Add sausage and plenty of sauce." }
    ]
  },
  {
    id: "ln_004",
    title: "Matoke with Peanut Sauce",
    category: "Lunch",
    region: "Western",
    moods: ["Healthy", "Happy"],
    isQuickMeal: false,
    estimated_cost_ksh: 140,
    cook_time_minutes: 45,
    ingredients: ["Green Bananas", "Peanut Powder", "Tomatoes"],
    detailed_ingredients: [
      { item: "Matoke", price_range_ksh: "80", estimated_cost: 80 },
      { item: "Peanuts", price_range_ksh: "40", estimated_cost: 40 },
      { item: "Veggies", price_range_ksh: "20", estimated_cost: 20 }
    ],
    steps: [
      { step: 1, instruction: "Peel and boil bananas." },
      { step: 2, instruction: "Make sauce with tomatoes and peanut powder." },
      { step: 3, instruction: "Mix and simmer." }
    ]
  },

  // --- DINNER ---
  {
    id: "dn_001",
    title: "Pilau Njeri (Budget)",
    category: "Dinner",
    region: "Coastal",
    moods: ["Happy", "Stressed"],
    isQuickMeal: false,
    estimated_cost_ksh: 180,
    cook_time_minutes: 50,
    ingredients: ["Rice", "Potatoes", "Pilau Masala", "Onions"],
    detailed_ingredients: [
      { item: "Rice", price_range_ksh: "60", estimated_cost: 60 },
      { item: "Potatoes", price_range_ksh: "50", estimated_cost: 50 },
      { item: "Spices", price_range_ksh: "20", estimated_cost: 20 },
       { item: "Oil/Onion", price_range_ksh: "50", estimated_cost: 50 }
    ],
    steps: [
      { step: 1, instruction: "Fry onions until dark brown." },
      { step: 2, instruction: "Add potatoes and spices." },
      { step: 3, instruction: "Add rice and water, cook until fluffy." }
    ]
  },
  {
    id: "dn_002",
    title: "Ugali & Managu (Traditional Greens)",
    category: "Dinner",
    region: "Rift Valley",
    moods: ["Healthy", "Tired"],
    isQuickMeal: true,
    estimated_cost_ksh: 90,
    cook_time_minutes: 30,
    ingredients: ["Maize Flour", "Managu", "Cream/Milk"],
    detailed_ingredients: [
      { item: "Managu", price_range_ksh: "40", estimated_cost: 40 },
      { item: "Flour", price_range_ksh: "20", estimated_cost: 20 },
      { item: "Cream", price_range_ksh: "30", estimated_cost: 30 }
    ],
    steps: [
      { step: 1, instruction: "Boil Managu briefly." },
      { step: 2, instruction: "Fry with onions, finish with cream." },
      { step: 3, instruction: "Serve with Ugali." }
    ]
  },
  {
    id: "dn_003",
    title: "Chapati & Ndengu (Green Grams)",
    category: "Dinner",
    region: "Nairobi",
    moods: ["Happy", "Healthy"],
    isQuickMeal: false,
    estimated_cost_ksh: 150,
    cook_time_minutes: 60,
    ingredients: ["Wheat Flour", "Green Grams", "Carrots", "Coriander"],
    detailed_ingredients: [
      { item: "Flour/Oil", price_range_ksh: "60", estimated_cost: 60 },
      { item: "Ndengu", price_range_ksh: "50", estimated_cost: 50 },
      { item: "Veggies", price_range_ksh: "40", estimated_cost: 40 }
    ],
    steps: [
      { step: 1, instruction: "Knead dough and cook soft chapatis." },
      { step: 2, instruction: "Fry boiled ndengu with carrots and coriander." }
    ]
  },
  {
    id: "dn_004",
    title: "Beef Wet Fry & Mukimo",
    category: "Dinner",
    region: "Central",
    moods: ["Happy", "Stressed"],
    isQuickMeal: false,
    estimated_cost_ksh: 300,
    cook_time_minutes: 70,
    ingredients: ["Beef", "Potatoes", "Pumpkin Leaves", "Maize"],
    detailed_ingredients: [
      { item: "Beef", price_range_ksh: "150", estimated_cost: 150 },
      { item: "Mukimo Ing.", price_range_ksh: "150", estimated_cost: 150 }
    ],
    steps: [
      { step: 1, instruction: "Boil potatoes, maize and greens, then mash." },
      { step: 2, instruction: "Fry beef with tomatoes and onions." }
    ]
  },
  {
    id: "dn_005",
    title: "Sukuma Wiki & Ugali (The Survivor)",
    category: "Dinner",
    region: "All",
    moods: ["Broke", "Healthy"],
    isQuickMeal: true,
    estimated_cost_ksh: 50,
    cook_time_minutes: 20,
    ingredients: ["Sukuma", "Maize Flour", "Onion"],
    detailed_ingredients: [
      { item: "Sukuma", price_range_ksh: "20", estimated_cost: 20 },
      { item: "Flour", price_range_ksh: "20", estimated_cost: 20 },
      { item: "Onion", price_range_ksh: "10", estimated_cost: 10 }
    ],
    steps: [
      { step: 1, instruction: "Fry sukuma quickly." },
      { step: 2, instruction: "Cook Ugali." }
    ]
  },
  
  // --- SNACKS / STREET FOOD ---
  {
    id: "sn_001",
    title: "Mutura & Supu",
    category: "Snack",
    region: "Central",
    moods: ["Happy", "Broke"],
    isQuickMeal: true,
    estimated_cost_ksh: 30,
    cook_time_minutes: 0,
    ingredients: ["Mutura piece", "Bone Soup"],
    detailed_ingredients: [
      { item: "Mutura", price_range_ksh: "20", estimated_cost: 20 },
      { item: "Soup", price_range_ksh: "10", estimated_cost: 10 }
    ],
    steps: [
      { step: 1, instruction: "Visit local butchery." },
      { step: 2, instruction: "Order 20 bob mutura and soup." }
    ]
  },
  {
    id: "sn_002",
    title: "Roasted Maize (Mahindi Choma)",
    category: "Snack",
    region: "All",
    moods: ["Tired", "Broke"],
    isQuickMeal: true,
    estimated_cost_ksh: 30,
    cook_time_minutes: 5,
    ingredients: ["Maize Cob", "Chili Lemon"],
    detailed_ingredients: [
      { item: "Maize", price_range_ksh: "30", estimated_cost: 30 }
    ],
    steps: [
      { step: 1, instruction: "Buy from roadside vendor." },
      { step: 2, instruction: "Apply chili and lemon." }
    ]
  },
  {
    id: "sn_003",
    title: "Viazi Karai & Ukwaju",
    category: "Snack",
    region: "Coastal",
    moods: ["Happy", "Stressed"],
    isQuickMeal: false,
    estimated_cost_ksh: 80,
    cook_time_minutes: 30,
    ingredients: ["Potatoes", "Gram Flour", "Tamarind"],
    detailed_ingredients: [
      { item: "Potatoes", price_range_ksh: "40", estimated_cost: 40 },
      { item: "Flour/Oil", price_range_ksh: "30", estimated_cost: 30 },
      { item: "Ukwaju", price_range_ksh: "10", estimated_cost: 10 }
    ],
    steps: [
      { step: 1, instruction: "Boil potatoes." },
      { step: 2, instruction: "Coat in colored batter and deep fry." },
      { step: 3, instruction: "Dip in tamarind sauce." }
    ]
  },
  
  // --- BUDGET SPECIFIC (< 50 KES) ---
  {
    id: "bg_001",
    title: "Bread & Blueband",
    category: "Snack",
    region: "All",
    moods: ["Broke", "Tired"],
    isQuickMeal: true,
    estimated_cost_ksh: 40,
    cook_time_minutes: 2,
    ingredients: ["Bread Slices", "Margarine"],
    detailed_ingredients: [
      { item: "Quarter Bread", price_range_ksh: "30", estimated_cost: 30 },
      { item: "Blueband", price_range_ksh: "10", estimated_cost: 10 }
    ],
    steps: [{ step: 1, instruction: "Spread blueband on bread." }]
  },
  
  // --- STUDENT MEALS ---
  {
    id: "st_001",
    title: "Indomie & Egg",
    category: "Dinner",
    region: "All",
    moods: ["Tired", "Stressed"],
    isQuickMeal: true,
    estimated_cost_ksh: 60,
    cook_time_minutes: 10,
    ingredients: ["Noodles", "Egg", "Onion"],
    detailed_ingredients: [
      { item: "Indomie", price_range_ksh: "40", estimated_cost: 40 },
      { item: "Egg", price_range_ksh: "15", estimated_cost: 15 },
      { item: "Onion", price_range_ksh: "5", estimated_cost: 5 }
    ],
    steps: [
      { step: 1, instruction: "Fry onion, add water." },
      { step: 2, instruction: "Add noodles and tastemaker." },
      { step: 3, instruction: "Crack egg on top and cover." }
    ]
  },
  {
    id: "st_002",
    title: "Spaghetti & Ketchup",
    category: "Dinner",
    region: "All",
    moods: ["Broke", "Tired"],
    isQuickMeal: true,
    estimated_cost_ksh: 80,
    cook_time_minutes: 15,
    ingredients: ["Spaghetti", "Ketchup", "Oil"],
    detailed_ingredients: [
      { item: "Pasta", price_range_ksh: "50", estimated_cost: 50 },
      { item: "Sauce", price_range_ksh: "20", estimated_cost: 20 }
    ],
    steps: [
      { step: 1, instruction: "Boil pasta." },
      { step: 2, instruction: "Toss with oil and ketchup." }
    ]
  },

  // --- DRINKS ---
  {
    id: "dr_001",
    title: "Dawa (Hot Lemon & Ginger)",
    category: "Drink",
    region: "All",
    moods: ["Healthy", "Stressed"],
    isQuickMeal: true,
    estimated_cost_ksh: 40,
    cook_time_minutes: 10,
    ingredients: ["Lemon", "Ginger", "Honey/Sugar"],
    detailed_ingredients: [
      { item: "Lemon", price_range_ksh: "10", estimated_cost: 10 },
      { item: "Ginger", price_range_ksh: "10", estimated_cost: 10 },
      { item: "Honey", price_range_ksh: "20", estimated_cost: 20 }
    ],
    steps: [
      { step: 1, instruction: "Boil crushed ginger." },
      { step: 2, instruction: "Squeeze lemon and add honey." }
    ]
  },
  {
    id: "dr_002",
    title: "Maziwa Mala & Ugali",
    category: "Lunch",
    region: "Rift Valley",
    moods: ["Tired", "Healthy"],
    isQuickMeal: true,
    estimated_cost_ksh: 85,
    cook_time_minutes: 20,
    ingredients: ["Ugali Flour", "Fermented Milk"],
    detailed_ingredients: [
      { item: "Mala", price_range_ksh: "60", estimated_cost: 60 },
      { item: "Flour", price_range_ksh: "25", estimated_cost: 25 }
    ],
    steps: [
      { step: 1, instruction: "Cook stiff Ugali." },
      { step: 2, instruction: "Serve with cold Mala." }
    ]
  }
];