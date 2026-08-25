import { RecipeItem, RecipeSubCategoryMeta } from './types';

export const RECIPE_SUB_CATEGORIES: RecipeSubCategoryMeta[] = [
  // Breakfast
  { id: 'high_protein_eggs', category: 'breakfast', name: 'Eggs & Scrambles', emoji: '🍳', description: 'High-protein omelets, scrambles, and breakfast skillets' },
  { id: 'oats_pancakes', category: 'breakfast', name: 'Oats & Pancakes', emoji: '🥞', description: 'Protein-packed pancakes, overnight oats, and baked porridge' },
  { id: 'smoothies_bowls', category: 'breakfast', name: 'Smoothies & Bowls', emoji: '🥤', description: 'Quick superfood shakes, protein fluffs, and yogurt bowls' },
  { id: 'quick_grab_go', category: 'breakfast', name: 'Grab & Go', emoji: '🧁', description: 'Prep-ahead egg muffins, breakfast wraps, and sandwiches' },

  // Lunch
  { id: 'power_bowls', category: 'lunch', name: 'Power Bowls', emoji: '🥗', description: 'Macro-balanced grain, protein, and vegetable fuel bowls' },
  { id: 'wraps_sandwiches', category: 'lunch', name: 'Wraps & Pockets', emoji: '🌯', description: 'Crisp wraps, loaded pita pockets, and panini sandwiches' },
  { id: 'fresh_salads', category: 'lunch', name: 'Crisp Salads', emoji: '🥗', description: 'Hearty protein salads with homemade light vinaigrettes' },
  { id: 'soups_chilis', category: 'lunch', name: 'Soups & Chilis', emoji: '🍲', description: 'Comforting, high-protein stews and hearty chilis' },

  // Dinner
  { id: 'poultry_dishes', category: 'dinner', name: 'Poultry & Chicken', emoji: '🍗', description: 'Air-fried cutlets, skillet chicken, and turkey entrees' },
  { id: 'beef_steaks', category: 'dinner', name: 'Steaks & Sirloin', emoji: '🥩', description: 'Cast-iron seared steaks, lean beef roasts, and smash burgers' },
  { id: 'seafood_fish', category: 'dinner', name: 'Seafood & Fish', emoji: '🐟', description: 'Omega-3 wild salmon, blackened mahi, shrimp, and cod' },
  { id: 'pasta_comfort', category: 'dinner', name: 'Pastas & Bakes', emoji: '🍝', description: 'High-protein bolognese, cottage cheese alfredo, and lasagnas' },

  // Bulk Meal Prep
  { id: 'sheet_pan_meals', category: 'bulk_meal_prep', name: 'Sheet-Pan Preps', emoji: '🥘', description: '1-pan oven roasted proteins and vegetables for the week' },
  { id: 'slow_cooker_instant_pot', category: 'bulk_meal_prep', name: 'Slow Cooker & Pot', emoji: '🍲', description: 'Set-and-forget shredded meats, curries, and carnitas' },
  { id: 'casseroles_bakes', category: 'bulk_meal_prep', name: 'Casserole Bakes', emoji: '🥧', description: 'Hearty baked casseroles, shepherd pies, and enchilada bakes' },
  { id: 'prepped_proteins_sides', category: 'bulk_meal_prep', name: 'Proteins & Grains', emoji: '🍚', description: 'Bulk batch grilled chicken, sweet potatoes, and brown rice' },

  // Snacks & Desserts
  { id: 'protein_bites_bars', category: 'snack_dessert', name: 'Bars & Bites', emoji: '🍫', description: 'No-bake protein balls, homemade bars, and energy bites' },
  { id: 'sweet_treats', category: 'snack_dessert', name: 'Sweet Treats', emoji: '🍨', description: 'Anabolic protein fluff, yogurt bark, and mug cakes' },
  { id: 'savory_crunch', category: 'snack_dessert', name: 'Savory Crunches', emoji: '🧆', description: 'Crispy chickpeas, edamame, and whipped cottage cheese dips' },
];

export const COMPREHENSIVE_RECIPE_DATABASE: RecipeItem[] = [
  {
    "id": "shakshuka-mediterranean",
    "title": "Mediterranean Shakshuka with Poached Eggs & Whole Wheat Pita",
    "description": "Whole eggs gently poached in a rich, spiced tomato, bell pepper, and cumin sauce, topped with tangy Greek feta and served with warm whole wheat pita.",
    "category": "breakfast",
    "sub_category": "high_protein_eggs",
    "prep_time_minutes": 10,
    "cook_time_minutes": 15,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Mediterranean",
      "Vegetarian",
      "Whole Food"
    ],
    "calories_per_serving": 420,
    "protein_g_per_serving": 28,
    "carbs_g_per_serving": 38,
    "fat_g_per_serving": 18,
    "icon_emoji": "🍳",
    "ingredients": [
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "3 whole",
        "amount_metric": "3 whole",
        "raw_weight_grams_base": 150,
        "calories_base": 210,
        "protein_g_base": 18,
        "carbs_g_base": 1,
        "fat_g_base": 15,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Canned Crushed Tomatoes",
        "amount_imperial": "1 cup (8 oz)",
        "amount_metric": "240g",
        "raw_weight_grams_base": 240,
        "calories_base": 50,
        "protein_g_base": 2,
        "carbs_g_base": 10,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "vegetables"
      },
      {
        "name": "Diced Bell Pepper & Red Onions",
        "amount_imperial": "1/2 cup mix",
        "amount_metric": "75g",
        "raw_weight_grams_base": 75,
        "calories_base": 25,
        "protein_g_base": 1,
        "carbs_g_base": 5,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Crumbled Greek Feta Cheese",
        "amount_imperial": "2 tbsp (1 oz)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 28,
        "calories_base": 75,
        "protein_g_base": 4,
        "carbs_g_base": 1,
        "fat_g_base": 6,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Whole Wheat Pita Pocket",
        "amount_imperial": "1 whole",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 130,
        "protein_g_base": 5,
        "carbs_g_base": 26,
        "fat_g_base": 1,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      }
    ],
    "instructions": [
      "Sauté diced peppers and onions in a skillet with olive oil spray until softened (3 min).",
      "Stir in crushed tomatoes, ground cumin, smoked paprika, garlic powder, salt, and black pepper; simmer for 5 minutes.",
      "Use a spoon to create 3 wells in the sauce and crack the eggs directly into each well.",
      "Cover with a lid and simmer on medium-low heat for 6-8 minutes until whites are set and yolks remain runny.",
      "Garnish with crumbled feta and fresh cilantro. Serve immediately with warm whole wheat pita."
    ],
    "chef_notes": "Dipping warm pita into the runny yolk and spiced tomato sauce creates an unforgettable Mediterranean breakfast experience."
  },
  {
    "id": "southwestern-breakfast-burrito",
    "title": "Southwestern Turkey Sausage Breakfast Burrito",
    "description": "Whole wheat low-carb tortilla packed with lean turkey sausage crumbles, scrambled egg whites, black beans, cheddar, and salsa fresca.",
    "category": "breakfast",
    "sub_category": "high_protein_eggs",
    "prep_time_minutes": 10,
    "cook_time_minutes": 10,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Meal Prep Ready",
      "High-Fiber",
      "On-the-Go"
    ],
    "calories_per_serving": 440,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 36,
    "fat_g_per_serving": 14,
    "icon_emoji": "🌯",
    "ingredients": [
      {
        "name": "Lean Ground Turkey Breast (93/7)",
        "amount_imperial": "4 oz",
        "amount_metric": "115g",
        "raw_weight_grams_base": 115,
        "calories_base": 160,
        "protein_g_base": 28,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Liquid Egg Whites",
        "amount_imperial": "1/2 cup (4 oz)",
        "amount_metric": "120 ml",
        "raw_weight_grams_base": 120,
        "calories_base": 60,
        "protein_g_base": 13,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "1 whole",
        "amount_metric": "1 whole",
        "raw_weight_grams_base": 50,
        "calories_base": 70,
        "protein_g_base": 6,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Black Beans (Rinsed)",
        "amount_imperial": "1/4 cup",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 55,
        "protein_g_base": 3,
        "carbs_g_base": 10,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "plant_protein"
      },
      {
        "name": "Reduced-Fat Sharp Cheddar",
        "amount_imperial": "2 tbsp (0.75 oz)",
        "amount_metric": "21g",
        "raw_weight_grams_base": 21,
        "calories_base": 65,
        "protein_g_base": 6,
        "carbs_g_base": 1,
        "fat_g_base": 4,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Whole Wheat Low-Carb Wrap",
        "amount_imperial": "1 large (2.2 oz)",
        "amount_metric": "62g",
        "raw_weight_grams_base": 62,
        "calories_base": 110,
        "protein_g_base": 8,
        "carbs_g_base": 18,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      }
    ],
    "instructions": [
      "Brown turkey sausage in a skillet over medium heat with cumin and chili powder for 5 minutes. Set aside.",
      "Whisk whole egg and liquid egg whites; scramble gently in the pan until fluffy.",
      "Warm the tortilla for 15 seconds. Layer scrambled eggs, cooked turkey sausage, black beans, cheddar, and fresh salsa in the center.",
      "Tightly fold in the sides and roll into a burrito. Place seam-side down in the skillet for 1-2 minutes to crisp the seal."
    ],
    "chef_notes": "Roll a batch in parchment and foil for an instant grab-and-go freezer breakfast you can microwave in 90 seconds."
  },
  {
    "id": "cottage-cheese-veggie-frittata",
    "title": "Loaded Cottage Cheese & Garden Veggie Frittata",
    "description": "Golden oven-baked frittata enriched with blended cottage cheese for an ultra-creamy, high-protein crustless quiche.",
    "category": "breakfast",
    "sub_category": "high_protein_eggs",
    "prep_time_minutes": 10,
    "cook_time_minutes": 25,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Low-Carb",
      "Batch Friendly",
      "Keto-Friendly"
    ],
    "calories_per_serving": 310,
    "protein_g_per_serving": 32,
    "carbs_g_per_serving": 9,
    "fat_g_per_serving": 16,
    "icon_emoji": "🥧",
    "ingredients": [
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "4 whole",
        "amount_metric": "4 whole",
        "raw_weight_grams_base": 200,
        "calories_base": 140,
        "protein_g_base": 12,
        "carbs_g_base": 1,
        "fat_g_base": 10,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Low-Fat 2% Cottage Cheese",
        "amount_imperial": "1 cup (8 oz)",
        "amount_metric": "226g",
        "raw_weight_grams_base": 226,
        "calories_base": 90,
        "protein_g_base": 13,
        "carbs_g_base": 4,
        "fat_g_base": 2.5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Broccoli Florets",
        "amount_imperial": "1 cup",
        "amount_metric": "70g",
        "raw_weight_grams_base": 70,
        "calories_base": 25,
        "protein_g_base": 2,
        "carbs_g_base": 5,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Diced Bell Pepper & Red Onions",
        "amount_imperial": "1/2 cup",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 20,
        "protein_g_base": 1,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Grated Aged Parmigiano-Reggiano",
        "amount_imperial": "2 tbsp",
        "amount_metric": "15g",
        "raw_weight_grams_base": 15,
        "calories_base": 35,
        "protein_g_base": 4,
        "carbs_g_base": 0,
        "fat_g_base": 2.5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Preheat oven to 375°F (190°C) and grease an 8-inch oven-safe skillet or baking dish.",
      "In a blender, blend eggs, cottage cheese, salt, black pepper, and garlic powder until silky smooth.",
      "Sauté bell pepper and chopped broccoli florets in the skillet for 3 minutes until vibrant.",
      "Pour egg and cottage cheese mixture evenly over the vegetables. Top with grated parmesan.",
      "Bake for 25-28 minutes until center is set and edges are lightly golden. Let rest for 5 minutes before slicing."
    ],
    "chef_notes": "Blending cottage cheese with eggs yields a custardy, velvety quiche texture with 32g of pure protein."
  },
  {
    "id": "avocado-smoked-salmon-toast",
    "title": "Avocado & Wild Smoked Salmon Sourdough Toast",
    "description": "Thick toasted artisanal sourdough topped with mashed ripe avocado, fluffy scrambled egg whites, and wild smoked salmon.",
    "category": "breakfast",
    "sub_category": "high_protein_eggs",
    "prep_time_minutes": 5,
    "cook_time_minutes": 5,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Omega-3s",
      "Clean Fats",
      "Gourmet"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 34,
    "carbs_g_per_serving": 32,
    "fat_g_per_serving": 14,
    "icon_emoji": "🥑",
    "ingredients": [
      {
        "name": "Wild Atlantic Salmon Filet (Smoked / Lox)",
        "amount_imperial": "3.5 oz",
        "amount_metric": "100g",
        "raw_weight_grams_base": 100,
        "calories_base": 120,
        "protein_g_base": 20,
        "carbs_g_base": 0,
        "fat_g_base": 4,
        "department": "meat_seafood",
        "food_category": "fish_seafood"
      },
      {
        "name": "Liquid Egg Whites",
        "amount_imperial": "1/2 cup",
        "amount_metric": "120 ml",
        "raw_weight_grams_base": 120,
        "calories_base": 60,
        "protein_g_base": 13,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Artisanal Sourdough Bread",
        "amount_imperial": "1 thick slice (1.8 oz)",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 140,
        "protein_g_base": 5,
        "carbs_g_base": 28,
        "fat_g_base": 1,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "Ripe Hass Avocado",
        "amount_imperial": "1/4 medium",
        "amount_metric": "35g",
        "raw_weight_grams_base": 35,
        "calories_base": 60,
        "protein_g_base": 1,
        "carbs_g_base": 3,
        "fat_g_base": 6,
        "department": "produce",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Toast sourdough slice until golden brown and crispy.",
      "Scramble egg whites in a non-stick pan with a pinch of sea salt and black pepper.",
      "Mash avocado with fresh lemon juice and spread across the toasted sourdough.",
      "Layer warm scrambled egg whites and smoked salmon slices on top.",
      "Finish with everything bagel seasoning and fresh dill."
    ],
    "chef_notes": "Pairs anti-inflammatory marine omega-3s with whole grain sourdough for long-lasting morning energy."
  },
  {
    "id": "denver-western-ham-omelet",
    "title": "Denver Western Omelet with Lean Diced Ham & Sharp Cheddar",
    "description": "Classic diner-style folded omelet filled with lean smoked ham, green bell peppers, sweet yellow onions, and melted sharp cheddar.",
    "category": "breakfast",
    "sub_category": "high_protein_eggs",
    "prep_time_minutes": 8,
    "cook_time_minutes": 7,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Low-Carb",
      "Classic Diner",
      "Keto-Friendly"
    ],
    "calories_per_serving": 380,
    "protein_g_per_serving": 38,
    "carbs_g_per_serving": 6,
    "fat_g_per_serving": 22,
    "icon_emoji": "🍳",
    "ingredients": [
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "2 whole",
        "amount_metric": "2 whole",
        "raw_weight_grams_base": 100,
        "calories_base": 140,
        "protein_g_base": 12,
        "carbs_g_base": 1,
        "fat_g_base": 10,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Liquid Egg Whites",
        "amount_imperial": "1/2 cup",
        "amount_metric": "120 ml",
        "raw_weight_grams_base": 120,
        "calories_base": 60,
        "protein_g_base": 13,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Lean Ground Turkey Breast (93/7) / Diced Lean Ham",
        "amount_imperial": "3 oz diced",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 95,
        "protein_g_base": 16,
        "carbs_g_base": 1,
        "fat_g_base": 2.5,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Diced Bell Pepper & Red Onions",
        "amount_imperial": "1/3 cup mix",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 20,
        "protein_g_base": 1,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Reduced-Fat Sharp Cheddar",
        "amount_imperial": "2 tbsp (0.75 oz)",
        "amount_metric": "21g",
        "raw_weight_grams_base": 21,
        "calories_base": 65,
        "protein_g_base": 6,
        "carbs_g_base": 1,
        "fat_g_base": 4,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Sauté diced ham, bell pepper, and onions in a non-stick skillet for 3 minutes until fragrant.",
      "Whisk whole eggs and egg whites; pour evenly into the skillet.",
      "Cook over medium-low heat. Lift the edges to allow uncooked egg to flow underneath.",
      "Sprinkle sharp cheddar over half the omelet, fold over, and slide onto plate."
    ],
    "chef_notes": "Extra liquid egg whites keep the total calories low while delivering 38g of bioavailable protein."
  },
  {
    "id": "apple-cinnamon-baked-oatmeal",
    "title": "Apple Cinnamon Baked Protein Oatmeal Squares",
    "description": "Warm spiced baked rolled oats made with whey protein isolate, diced Honeycrisp apples, cinnamon, and 2% milk.",
    "category": "breakfast",
    "sub_category": "oats_pancakes",
    "prep_time_minutes": 10,
    "cook_time_minutes": 30,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Fiber",
      "High-Protein",
      "Meal Prep Ready",
      "Complex Carbs"
    ],
    "calories_per_serving": 320,
    "protein_g_per_serving": 24,
    "carbs_g_per_serving": 42,
    "fat_g_per_serving": 6,
    "icon_emoji": "🥞",
    "ingredients": [
      {
        "name": "Old-Fashioned Rolled Oats",
        "amount_imperial": "2 cups dry",
        "amount_metric": "180g",
        "raw_weight_grams_base": 45,
        "calories_base": 150,
        "protein_g_base": 5,
        "carbs_g_base": 27,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "100% Vanilla Whey Protein Isolate",
        "amount_imperial": "2 scoops (2.3 oz)",
        "amount_metric": "64g",
        "raw_weight_grams_base": 16,
        "calories_base": 60,
        "protein_g_base": 12,
        "carbs_g_base": 1,
        "fat_g_base": 0.5,
        "department": "supplements",
        "food_category": "snacks_pantry"
      },
      {
        "name": "2% Reduced-Fat Milk",
        "amount_imperial": "1.5 cups",
        "amount_metric": "360 ml",
        "raw_weight_grams_base": 90,
        "calories_base": 45,
        "protein_g_base": 3,
        "carbs_g_base": 4.5,
        "fat_g_base": 2,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Diced Honeycrisp Apples",
        "amount_imperial": "1 large apple",
        "amount_metric": "180g",
        "raw_weight_grams_base": 45,
        "calories_base": 25,
        "protein_g_base": 0,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "fruits"
      },
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "2 whole",
        "amount_metric": "2 whole",
        "raw_weight_grams_base": 25,
        "calories_base": 35,
        "protein_g_base": 3,
        "carbs_g_base": 0,
        "fat_g_base": 2.5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Preheat oven to 350°F (175°C) and grease an 8x8-inch baking dish.",
      "In a large bowl, mix oats, vanilla protein isolate, cinnamon, nutmeg, baking powder, and a pinch of salt.",
      "Whisk milk and eggs together, then pour into the dry oat mixture.",
      "Fold in diced apples. Pour into baking dish and bake for 30 minutes until golden.",
      "Slice into 4 hearty squares. Serve warm or refrigerate for the week."
    ],
    "chef_notes": "Reheats wonderfully in the microwave or toaster oven with a splash of milk or a scoop of Greek yogurt."
  },
  {
    "id": "banana-protein-pancakes",
    "title": "Golden Banana Protein Pancakes with Maple Drizzle",
    "description": "Fluffy whole-food pancakes whipped with ripe bananas, rolled oats, whey protein, and eggs, griddled golden brown.",
    "category": "breakfast",
    "sub_category": "oats_pancakes",
    "prep_time_minutes": 5,
    "cook_time_minutes": 10,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Gluten-Free",
      "Quick Breakfast",
      "Clean Fuel"
    ],
    "calories_per_serving": 380,
    "protein_g_per_serving": 36,
    "carbs_g_per_serving": 44,
    "fat_g_per_serving": 7,
    "icon_emoji": "🥞",
    "ingredients": [
      {
        "name": "Ripe Yellow Banana",
        "amount_imperial": "1 medium",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 105,
        "protein_g_base": 1,
        "carbs_g_base": 27,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "fruits"
      },
      {
        "name": "Old-Fashioned Rolled Oats",
        "amount_imperial": "1/2 cup (1.6 oz)",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 150,
        "protein_g_base": 5,
        "carbs_g_base": 27,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "100% Vanilla Whey Protein Isolate",
        "amount_imperial": "1 scoop (1.1 oz)",
        "amount_metric": "32g",
        "raw_weight_grams_base": 32,
        "calories_base": 120,
        "protein_g_base": 25,
        "carbs_g_base": 2,
        "fat_g_base": 1,
        "department": "supplements",
        "food_category": "snacks_pantry"
      },
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "1 whole",
        "amount_metric": "1 whole",
        "raw_weight_grams_base": 50,
        "calories_base": 70,
        "protein_g_base": 6,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Add banana, oats, whey protein, egg, 1/4 cup water or milk, and 1/2 tsp baking powder into a blender. Blend for 30 seconds until a smooth batter forms.",
      "Heat a non-stick griddle over medium heat with olive oil cooking spray.",
      "Pour batter into 3 medium pancakes. Cook for 2-3 minutes until bubbles form on top, flip, and cook 1-2 minutes until golden.",
      "Serve stacked with fresh sliced fruit and pure maple syrup."
    ],
    "chef_notes": "Blending the oats creates fine oat flour without needing refined processed flours."
  },
  {
    "id": "peanut-butter-power-shake",
    "title": "Peanut Butter Banana Muscle Fuel Power Shake",
    "description": "High-protein recovery shake blended with whey isolate, creamy peanut butter, frozen bananas, and milk.",
    "category": "breakfast",
    "sub_category": "smoothies_bowls",
    "prep_time_minutes": 3,
    "cook_time_minutes": 0,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Pre/Post Workout",
      "3-Minute",
      "Ultra Creamy"
    ],
    "calories_per_serving": 420,
    "protein_g_per_serving": 44,
    "carbs_g_per_serving": 38,
    "fat_g_per_serving": 12,
    "icon_emoji": "🥤",
    "ingredients": [
      {
        "name": "100% Whey Protein Isolate (Chocolate or Vanilla)",
        "amount_imperial": "1.5 scoops (1.7 oz)",
        "amount_metric": "48g",
        "raw_weight_grams_base": 48,
        "calories_base": 180,
        "protein_g_base": 38,
        "carbs_g_base": 3,
        "fat_g_base": 1.5,
        "department": "supplements",
        "food_category": "snacks_pantry"
      },
      {
        "name": "2% Reduced-Fat Milk",
        "amount_imperial": "1 cup (8 oz)",
        "amount_metric": "240 ml",
        "raw_weight_grams_base": 240,
        "calories_base": 120,
        "protein_g_base": 8,
        "carbs_g_base": 12,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Natural Creamy Peanut Butter",
        "amount_imperial": "1 tablespoon",
        "amount_metric": "16g",
        "raw_weight_grams_base": 16,
        "calories_base": 95,
        "protein_g_base": 4,
        "carbs_g_base": 3,
        "fat_g_base": 8,
        "department": "healthy_fats",
        "food_category": "nuts_fats_oils"
      },
      {
        "name": "Frozen Banana Slices",
        "amount_imperial": "1 medium",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 105,
        "protein_g_base": 1,
        "carbs_g_base": 27,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "fruits"
      }
    ],
    "instructions": [
      "Add milk, protein isolate, frozen banana, peanut butter, and a cup of ice into high-speed blender.",
      "Blend on high for 45-60 seconds until thick, frosty, and creamy.",
      "Pour into chilled tumbler and enjoy immediately."
    ],
    "chef_notes": "Frozen banana gives this shake a milkshake consistency without heavy cream or refined sugars."
  },
  {
    "id": "blueberry-greek-yogurt-superbowl",
    "title": "Vanilla Blueberry Superfood Greek Yogurt Bowl",
    "description": "Thick cultured Greek yogurt layered with wild blueberries, sliced raw almonds, chia seeds, and raw honey drizzle.",
    "category": "breakfast",
    "sub_category": "smoothies_bowls",
    "prep_time_minutes": 3,
    "cook_time_minutes": 0,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Probiotic",
      "Antioxidant Superfood",
      "No Cook"
    ],
    "calories_per_serving": 310,
    "protein_g_per_serving": 28,
    "carbs_g_per_serving": 32,
    "fat_g_per_serving": 8,
    "icon_emoji": "🫐",
    "ingredients": [
      {
        "name": "Low-Fat 2% Plain Greek Yogurt",
        "amount_imperial": "1.25 cups (10 oz)",
        "amount_metric": "280g",
        "raw_weight_grams_base": 280,
        "calories_base": 180,
        "protein_g_base": 24,
        "carbs_g_base": 10,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Blueberries",
        "amount_imperial": "3/4 cup",
        "amount_metric": "110g",
        "raw_weight_grams_base": 110,
        "calories_base": 60,
        "protein_g_base": 1,
        "carbs_g_base": 15,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "fruits"
      },
      {
        "name": "Sliced Raw Almonds & Chia Seeds",
        "amount_imperial": "1 tbsp each",
        "amount_metric": "20g",
        "raw_weight_grams_base": 20,
        "calories_base": 60,
        "protein_g_base": 3,
        "carbs_g_base": 3,
        "fat_g_base": 5,
        "department": "healthy_fats",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Spoon Greek yogurt into a chilled breakfast bowl.",
      "Top with fresh blueberries, sliced almonds, and chia seeds.",
      "Drizzle with raw wildflower honey and dust with Ceylon cinnamon."
    ],
    "chef_notes": "Provides 24g of slow-digesting protein and live probiotic cultures for digestive and immune health."
  },
  {
    "id": "bacon-egg-cheddar-muffins",
    "title": "Bacon, Egg White & Sharp Cheddar Prep Muffins",
    "description": "Savory baked egg white cups loaded with crispy nitrate-free bacon crumbles, green onions, and sharp cheddar.",
    "category": "breakfast",
    "sub_category": "quick_grab_go",
    "prep_time_minutes": 10,
    "cook_time_minutes": 20,
    "servings_yield": 3,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Low-Carb",
      "Batch Prep",
      "Grab & Go"
    ],
    "calories_per_serving": 260,
    "protein_g_per_serving": 30,
    "carbs_g_per_serving": 2,
    "fat_g_per_serving": 14,
    "icon_emoji": "🧁",
    "ingredients": [
      {
        "name": "Liquid Egg Whites",
        "amount_imperial": "1.5 cups",
        "amount_metric": "360 ml",
        "raw_weight_grams_base": 120,
        "calories_base": 60,
        "protein_g_base": 13,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "3 whole",
        "amount_metric": "3 whole",
        "raw_weight_grams_base": 50,
        "calories_base": 70,
        "protein_g_base": 6,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Reduced-Fat Sharp Cheddar",
        "amount_imperial": "1/2 cup shredded",
        "amount_metric": "56g",
        "raw_weight_grams_base": 18.6,
        "calories_base": 60,
        "protein_g_base": 6,
        "carbs_g_base": 1,
        "fat_g_base": 4,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Nitrate-Free Turkey / Center-Cut Bacon",
        "amount_imperial": "4 strips cooked",
        "amount_metric": "60g",
        "raw_weight_grams_base": 20,
        "calories_base": 70,
        "protein_g_base": 5,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      }
    ],
    "instructions": [
      "Preheat oven to 375°F (190°C) and grease a 6-cup muffin tin with olive oil spray.",
      "Divide crumbled bacon, sliced scallions, and cheddar evenly among the 6 muffin wells.",
      "Whisk eggs, egg whites, salt, pepper, and garlic powder; pour evenly into the wells.",
      "Bake for 18-20 minutes until puffed and golden. Store 2 muffins per serving in the fridge."
    ],
    "chef_notes": "Grab 2 muffins and microwave for 30 seconds for an effortless 30g protein morning commute fuel."
  },
  {
    "id": "teriyaki-chicken-power-bowl",
    "title": "Teriyaki Glazed Chicken & Steamed Jasmine Rice Bowl",
    "description": "Tender pan-seared chicken breast tossed in low-sodium ginger teriyaki glaze over steamed jasmine rice and fresh broccoli florets.",
    "category": "lunch",
    "sub_category": "power_bowls",
    "prep_time_minutes": 10,
    "cook_time_minutes": 15,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Clean Fuel",
      "Athlete Favorite",
      "Macro-Balanced"
    ],
    "calories_per_serving": 470,
    "protein_g_per_serving": 52,
    "carbs_g_per_serving": 50,
    "fat_g_per_serving": 8,
    "icon_emoji": "🥗",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breast",
        "amount_imperial": "7 oz",
        "amount_metric": "200g",
        "raw_weight_grams_base": 200,
        "calories_base": 250,
        "protein_g_base": 52,
        "carbs_g_base": 0,
        "fat_g_base": 4,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Steamed Fragrant Jasmine Rice",
        "amount_imperial": "3/4 cup cooked",
        "amount_metric": "130g",
        "raw_weight_grams_base": 130,
        "calories_base": 160,
        "protein_g_base": 3,
        "carbs_g_base": 36,
        "fat_g_base": 0,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "Fresh Broccoli Florets",
        "amount_imperial": "1.5 cups",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 45,
        "protein_g_base": 4,
        "carbs_g_base": 9,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Low-Sodium Teriyaki Glaze",
        "amount_imperial": "2 tablespoons",
        "amount_metric": "30 ml",
        "raw_weight_grams_base": 30,
        "calories_base": 35,
        "protein_g_base": 1,
        "carbs_g_base": 8,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "snacks_pantry"
      }
    ],
    "instructions": [
      "Dice chicken breast into bite-sized cubes and season with garlic powder and black pepper.",
      "Sear chicken in a hot skillet with olive oil spray for 6-8 minutes until golden and internal temp hits 165°F.",
      "Steam broccoli florets in a microwave steamer or pot for 4 minutes until bright green and tender-crisp.",
      "Toss cooked chicken in teriyaki glaze in the pan for 1 minute to coat.",
      "Assemble bowl: layer warm jasmine rice at the bottom, arrange glazed chicken and steamed broccoli on top, and garnish with sesame seeds."
    ],
    "chef_notes": "Jasmine rice provides fast-absorbing glycogen replenishment, making this an ideal training lunch."
  },
  {
    "id": "chipotle-flank-steak-quinoa-bowl",
    "title": "Chipotle Lime Flank Steak & Quinoa Harvest Bowl",
    "description": "Seared lean flank steak strips over fluffy tri-color quinoa, black beans, charred corn, avocado, and lime cilantro crema.",
    "category": "lunch",
    "sub_category": "power_bowls",
    "prep_time_minutes": 10,
    "cook_time_minutes": 12,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Iron-Rich",
      "Southwestern",
      "High-Fiber"
    ],
    "calories_per_serving": 520,
    "protein_g_per_serving": 50,
    "carbs_g_per_serving": 46,
    "fat_g_per_serving": 16,
    "icon_emoji": "🥑",
    "ingredients": [
      {
        "name": "Lean Beef Flank Steak (Trimmed)",
        "amount_imperial": "6 oz",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 280,
        "protein_g_base": 44,
        "carbs_g_base": 0,
        "fat_g_base": 12,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Fluffy Cooked Tri-Color Quinoa",
        "amount_imperial": "3/4 cup cooked",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 170,
        "protein_g_base": 6,
        "carbs_g_base": 30,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "Rainbow Bell Peppers & Red Onion",
        "amount_imperial": "1 cup",
        "amount_metric": "100g",
        "raw_weight_grams_base": 100,
        "calories_base": 30,
        "protein_g_base": 1,
        "carbs_g_base": 7,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Ripe Hass Avocado",
        "amount_imperial": "1/4 medium",
        "amount_metric": "35g",
        "raw_weight_grams_base": 35,
        "calories_base": 60,
        "protein_g_base": 1,
        "carbs_g_base": 3,
        "fat_g_base": 6,
        "department": "produce",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Rub flank steak with chipotle powder, cumin, lime juice, and sea salt.",
      "Sear in a smoking hot cast-iron skillet for 4-5 minutes per side for medium-rare (135°F). Let rest 5 minutes, then slice thinly against the grain.",
      "Sauté bell peppers and onions in the pan for 3 minutes until slightly charred.",
      "Layer warm quinoa, charred peppers, sliced steak, and avocado slices in a bowl. Drizzle with fresh lime juice."
    ],
    "chef_notes": "Slicing flank steak thinly across the grain guarantees melt-in-your-mouth tenderness."
  },
  {
    "id": "buffalo-chicken-pita-pocket",
    "title": "Spicy Buffalo Chicken Pita Pocket with Greek Yogurt Ranch",
    "description": "Warm whole wheat pita stuffed with juicy shredded buffalo chicken, crisp romaine, diced celery, and high-protein Greek yogurt ranch.",
    "category": "lunch",
    "sub_category": "wraps_sandwiches",
    "prep_time_minutes": 8,
    "cook_time_minutes": 8,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Spicy",
      "Quick Prep",
      "Comfort Food"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 46,
    "carbs_g_per_serving": 32,
    "fat_g_per_serving": 8,
    "icon_emoji": "🌯",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breast",
        "amount_imperial": "6 oz cooked shredded",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 220,
        "protein_g_base": 46,
        "carbs_g_base": 0,
        "fat_g_base": 4,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Whole Wheat Pita Pocket",
        "amount_imperial": "1 whole",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 130,
        "protein_g_base": 5,
        "carbs_g_base": 26,
        "fat_g_base": 1,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "Non-Fat 0% Greek Yogurt (Ranch Base)",
        "amount_imperial": "3 tbsp (1.5 oz)",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 25,
        "protein_g_base": 5,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Frank's RedHot Buffalo Sauce",
        "amount_imperial": "2 tbsp",
        "amount_metric": "30 ml",
        "raw_weight_grams_base": 30,
        "calories_base": 5,
        "protein_g_base": 0,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "snacks_pantry"
      }
    ],
    "instructions": [
      "Toss warm shredded chicken breast with Frank’s RedHot sauce in a bowl.",
      "In a small cup, stir Greek yogurt with ranch seasoning, garlic powder, and a dash of lemon juice.",
      "Warm pita for 15 seconds and gently cut open the pocket.",
      "Stuff with crisp romaine lettuce, diced celery, spicy buffalo chicken, and drizzle ranch on top."
    ],
    "chef_notes": "Greek yogurt makes a rich, thick ranch dressing with 0g of mayonnaise fats and 5g of extra protein."
  },
  {
    "id": "blackened-shrimp-cobb-salad",
    "title": "Blackened Gulf Shrimp & Avocado Cobb Salad",
    "description": "Jumbo spicy blackened shrimp over crisp romaine, hard-boiled egg, cherry tomatoes, diced cucumbers, avocado, and light vinaigrette.",
    "category": "lunch",
    "sub_category": "fresh_salads",
    "prep_time_minutes": 10,
    "cook_time_minutes": 6,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Keto-Friendly",
      "Low-Carb",
      "Omega-3s"
    ],
    "calories_per_serving": 370,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 12,
    "fat_g_per_serving": 16,
    "icon_emoji": "🥗",
    "ingredients": [
      {
        "name": "Jumbo Gulf Shrimp (Peeled)",
        "amount_imperial": "6 oz (8-10 shrimp)",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 170,
        "protein_g_base": 38,
        "carbs_g_base": 1,
        "fat_g_base": 2,
        "department": "meat_seafood",
        "food_category": "fish_seafood"
      },
      {
        "name": "Large Whole Eggs (Hard-Boiled)",
        "amount_imperial": "1 whole",
        "amount_metric": "1 whole",
        "raw_weight_grams_base": 50,
        "calories_base": 70,
        "protein_g_base": 6,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Crisp Romaine Lettuce & Spinach",
        "amount_imperial": "3 cups mix",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 25,
        "protein_g_base": 2,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Ripe Hass Avocado",
        "amount_imperial": "1/4 medium",
        "amount_metric": "35g",
        "raw_weight_grams_base": 35,
        "calories_base": 60,
        "protein_g_base": 1,
        "carbs_g_base": 3,
        "fat_g_base": 6,
        "department": "produce",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Toss shrimp with Cajun seasoning, smoked paprika, garlic, and sea salt.",
      "Sear shrimp in a hot skillet with olive oil spray for 2-3 minutes per side until pink and opaque.",
      "Chop crisp romaine and arrange in a large salad bowl.",
      "Top with hard-boiled egg slices, diced avocado, cucumber, cherry tomatoes, and warm blackened shrimp.",
      "Drizzle with olive oil and red wine vinegar."
    ],
    "chef_notes": "Shrimp cooks in just 5 minutes, delivering over 38g of bioavailable protein with minimal calories."
  },
  {
    "id": "lean-turkey-black-bean-chili",
    "title": "Hearty Lean Turkey & Black Bean Power Chili",
    "description": "Thick, comforting chili packed with lean ground turkey, black beans, crushed San Marzano tomatoes, peppers, and chili spices.",
    "category": "lunch",
    "sub_category": "soups_chilis",
    "prep_time_minutes": 10,
    "cook_time_minutes": 25,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "High-Fiber",
      "Meal Prep Ready",
      "Comfort Food"
    ],
    "calories_per_serving": 360,
    "protein_g_per_serving": 38,
    "carbs_g_per_serving": 34,
    "fat_g_per_serving": 7,
    "icon_emoji": "🍲",
    "ingredients": [
      {
        "name": "Lean Ground Turkey Breast (93/7)",
        "amount_imperial": "1.25 lbs (20 oz)",
        "amount_metric": "567g",
        "raw_weight_grams_base": 142,
        "calories_base": 200,
        "protein_g_base": 32,
        "carbs_g_base": 0,
        "fat_g_base": 6,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Black Beans (Rinsed)",
        "amount_imperial": "1 can (15 oz)",
        "amount_metric": "425g",
        "raw_weight_grams_base": 106,
        "calories_base": 100,
        "protein_g_base": 7,
        "carbs_g_base": 18,
        "fat_g_base": 0.5,
        "department": "pantry_spices",
        "food_category": "plant_protein"
      },
      {
        "name": "Canned Crushed Tomatoes",
        "amount_imperial": "1 can (28 oz)",
        "amount_metric": "794g",
        "raw_weight_grams_base": 198,
        "calories_base": 40,
        "protein_g_base": 2,
        "carbs_g_base": 9,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "vegetables"
      },
      {
        "name": "Rainbow Bell Peppers & Red Onion",
        "amount_imperial": "1 large pepper + 1 onion",
        "amount_metric": "250g",
        "raw_weight_grams_base": 62,
        "calories_base": 20,
        "protein_g_base": 1,
        "carbs_g_base": 5,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Brown lean turkey in a soup pot with diced onions and bell peppers for 6 minutes.",
      "Stir in chili powder, ground cumin, oregano, smoked paprika, salt, and minced garlic.",
      "Add crushed tomatoes and rinsed black beans. Bring to a boil, then reduce to medium-low.",
      "Simmer uncovered for 20 minutes until thick and aromatic.",
      "Serve hot in bowls topped with cilantro and a dollop of Greek yogurt."
    ],
    "chef_notes": "Tastes even richer the next day as the cumin, chili, and garlic deepen into the turkey."
  },
  {
    "id": "lemon-garlic-chicken-asparagus",
    "title": "Crispy Lemon Garlic Air-Fryer Chicken Thighs with Asparagus",
    "description": "Juicy, seasoned boneless skinless chicken thighs air-fried golden crisp with charred garlic asparagus and roasted red potatoes.",
    "category": "dinner",
    "sub_category": "poultry_dishes",
    "prep_time_minutes": 10,
    "cook_time_minutes": 16,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Air-Fryer",
      "Gluten-Free",
      "Quick Dinner"
    ],
    "calories_per_serving": 460,
    "protein_g_per_serving": 46,
    "carbs_g_per_serving": 36,
    "fat_g_per_serving": 14,
    "icon_emoji": "🍗",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Thighs",
        "amount_imperial": "6.5 oz",
        "amount_metric": "185g",
        "raw_weight_grams_base": 185,
        "calories_base": 280,
        "protein_g_base": 42,
        "carbs_g_base": 0,
        "fat_g_base": 12,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Fresh Asparagus Spears",
        "amount_imperial": "1.5 cups (6 oz)",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 35,
        "protein_g_base": 4,
        "carbs_g_base": 7,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Crispy Baby Red Potatoes",
        "amount_imperial": "1 cup (5 oz)",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 140,
        "protein_g_base": 3,
        "carbs_g_base": 32,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "grains_carbs"
      },
      {
        "name": "Extra Virgin Olive Oil (Cold-Pressed)",
        "amount_imperial": "1 teaspoon",
        "amount_metric": "5 ml",
        "raw_weight_grams_base": 5,
        "calories_base": 40,
        "protein_g_base": 0,
        "carbs_g_base": 0,
        "fat_g_base": 4.5,
        "department": "healthy_fats",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Preheat air fryer to 390°F (200°C).",
      "Season chicken thighs with lemon juice, minced garlic, oregano, paprika, sea salt, and black pepper.",
      "Air-fry chicken thighs for 14-16 minutes, flipping halfway until internal temperature reaches 170°F and edges are crispy.",
      "Toss asparagus and diced potatoes in 1 tsp olive oil and air fry at 390°F for 8-10 minutes until tender and charred.",
      "Plate chicken alongside roasted potatoes and asparagus spears. Squeeze fresh lemon juice over everything."
    ],
    "chef_notes": "Chicken thighs stay incredibly juicy in the air fryer with crispy caramelized edges."
  },
  {
    "id": "flank-steak-chimichurri-feast",
    "title": "Cast-Iron Seared New York Strip with Chimichurri Sauce",
    "description": "Center-cut lean steak seared with a garlic herb crust, served with vibrant fresh chimichurri and roasted sweet potato wedges.",
    "category": "dinner",
    "sub_category": "beef_steaks",
    "prep_time_minutes": 10,
    "cook_time_minutes": 10,
    "servings_yield": 1,
    "difficulty": "moderate",
    "tags": [
      "High-Protein",
      "Iron-Rich",
      "Steakhouse Quality",
      "Whole Food"
    ],
    "calories_per_serving": 510,
    "protein_g_per_serving": 48,
    "carbs_g_per_serving": 32,
    "fat_g_per_serving": 20,
    "icon_emoji": "🥩",
    "ingredients": [
      {
        "name": "Top Sirloin Center-Cut Steak",
        "amount_imperial": "6.5 oz",
        "amount_metric": "185g",
        "raw_weight_grams_base": 185,
        "calories_base": 300,
        "protein_g_base": 46,
        "carbs_g_base": 0,
        "fat_g_base": 12,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Roasted Sweet Potato Cubes",
        "amount_imperial": "1 cup (5 oz)",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 130,
        "protein_g_base": 2,
        "carbs_g_base": 30,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "grains_carbs"
      },
      {
        "name": "Fresh Haricots Verts / Green Beans",
        "amount_imperial": "1.5 cups",
        "amount_metric": "150g",
        "raw_weight_grams_base": 150,
        "calories_base": 45,
        "protein_g_base": 3,
        "carbs_g_base": 10,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Homemade Herb Chimichurri",
        "amount_imperial": "1.5 tablespoons",
        "amount_metric": "22 ml",
        "raw_weight_grams_base": 22,
        "calories_base": 60,
        "protein_g_base": 0,
        "carbs_g_base": 1,
        "fat_g_base": 6,
        "department": "healthy_fats",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Pat steak dry and season generously with coarse kosher salt and freshly cracked black pepper.",
      "Heat cast-iron skillet on high until smoking. Sear steak for 3-4 minutes per side for medium-rare (135°F).",
      "Remove steak and let rest on a cutting board for 5 minutes.",
      "Sauté green beans in the pan drippings for 3 minutes.",
      "Slice steak against the grain, spoon chimichurri across meat, and serve with sweet potato wedges and green beans."
    ],
    "chef_notes": "Fresh parsley, garlic, and red wine vinegar in the chimichurri cut through the rich steak with zesty brightness."
  },
  {
    "id": "pan-seared-salmon-dill",
    "title": "Pan-Seared Wild Salmon Filet with Lemon Dill Dijon Glaze",
    "description": "Crispy skin wild Atlantic salmon with a tangy lemon-dill Dijon reduction, fluffy tri-color quinoa, and steamed broccoli florets.",
    "category": "dinner",
    "sub_category": "seafood_fish",
    "prep_time_minutes": 8,
    "cook_time_minutes": 10,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Omega-3 Superfood",
      "Clean Eating",
      "Heart-Healthy"
    ],
    "calories_per_serving": 490,
    "protein_g_per_serving": 46,
    "carbs_g_per_serving": 36,
    "fat_g_per_serving": 17,
    "icon_emoji": "🐟",
    "ingredients": [
      {
        "name": "Wild Atlantic Salmon Filet",
        "amount_imperial": "6.5 oz",
        "amount_metric": "185g",
        "raw_weight_grams_base": 185,
        "calories_base": 300,
        "protein_g_base": 42,
        "carbs_g_base": 0,
        "fat_g_base": 15,
        "department": "meat_seafood",
        "food_category": "fish_seafood"
      },
      {
        "name": "Fluffy Cooked Tri-Color Quinoa",
        "amount_imperial": "3/4 cup cooked",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 170,
        "protein_g_base": 6,
        "carbs_g_base": 30,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "Fresh Broccoli Florets",
        "amount_imperial": "1.5 cups",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 45,
        "protein_g_base": 4,
        "carbs_g_base": 9,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Season salmon with Dijon mustard, fresh dill, lemon zest, salt, and black pepper.",
      "Heat non-stick skillet over medium-high with olive oil spray. Place salmon skin-side down and press gently for 4 minutes until skin is crisp.",
      "Flip and sear flesh side for 3-4 minutes until cooked to medium (125°F internal).",
      "Serve salmon over warm tri-color quinoa and steamed broccoli florets with lemon wedges."
    ],
    "chef_notes": "Wild salmon delivers pure anti-inflammatory EPA and DHA omega-3 fatty acids for recovery and cardiovascular longevity."
  },
  {
    "id": "cottage-cheese-chicken-alfredo",
    "title": "Creamy Garlic Cottage Cheese Alfredo & Chicken Penne",
    "description": "High-protein Italian comfort pasta made with a blended cottage cheese and garlic parmesan sauce, sliced chicken breast, and Banza chickpea penne.",
    "category": "dinner",
    "sub_category": "pasta_comfort",
    "prep_time_minutes": 10,
    "cook_time_minutes": 15,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Italian Comfort",
      "Gluten-Free",
      "Indulgent Healthy"
    ],
    "calories_per_serving": 490,
    "protein_g_per_serving": 58,
    "carbs_g_per_serving": 40,
    "fat_g_per_serving": 11,
    "icon_emoji": "🍝",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breast",
        "amount_imperial": "10 oz (2 filets)",
        "amount_metric": "284g",
        "raw_weight_grams_base": 142,
        "calories_base": 180,
        "protein_g_base": 37,
        "carbs_g_base": 0,
        "fat_g_base": 3,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Low-Fat 2% Cottage Cheese",
        "amount_imperial": "1 cup (8 oz)",
        "amount_metric": "226g",
        "raw_weight_grams_base": 113,
        "calories_base": 90,
        "protein_g_base": 13,
        "carbs_g_base": 4,
        "fat_g_base": 2.5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Banza Chickpea Protein Penne",
        "amount_imperial": "4 oz dry",
        "amount_metric": "112g",
        "raw_weight_grams_base": 56,
        "calories_base": 190,
        "protein_g_base": 14,
        "carbs_g_base": 32,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "Grated Aged Parmigiano-Reggiano",
        "amount_imperial": "3 tbsp (1 oz)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 14,
        "calories_base": 50,
        "protein_g_base": 5,
        "carbs_g_base": 0,
        "fat_g_base": 3.5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Boil chickpea penne in salted water for 8 minutes; drain and reserve 1/4 cup pasta water.",
      "In a blender, blend cottage cheese, parmesan, minced garlic, black pepper, and pasta water until velvety smooth.",
      "Pan-sear chicken breast in a skillet with Italian seasoning until golden (6-7 min per side, 165°F), then slice into strips.",
      "Pour blended cottage cheese alfredo sauce into the warm pan over low heat (do not boil) and fold in cooked penne pasta.",
      "Top pasta with sliced seared chicken and fresh parsley."
    ],
    "chef_notes": "Blended cottage cheese creates a rich alfredo that matches heavy cream with 58g of muscle-building protein."
  },
  {
    "id": "sheet-pan-sausage-peppers-potatoes",
    "title": "Sheet-Pan Turkey Sausage, Bell Peppers & Baby Gold Potatoes",
    "description": "Sliced lean turkey sausage roasted on a single sheet pan with baby gold potatoes, rainbow bell peppers, red onions, and Italian herbs.",
    "category": "bulk_meal_prep",
    "sub_category": "sheet_pan_meals",
    "prep_time_minutes": 10,
    "cook_time_minutes": 30,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "Sheet-Pan",
      "Meal Prep Ready",
      "1-Pan Clean Up",
      "High-Protein"
    ],
    "calories_per_serving": 410,
    "protein_g_per_serving": 36,
    "carbs_g_per_serving": 38,
    "fat_g_per_serving": 12,
    "icon_emoji": "🥘",
    "ingredients": [
      {
        "name": "Lean Ground Turkey Breast (93/7)",
        "amount_imperial": "1.25 lbs (20 oz sliced sausage)",
        "amount_metric": "567g",
        "raw_weight_grams_base": 142,
        "calories_base": 220,
        "protein_g_base": 32,
        "carbs_g_base": 2,
        "fat_g_base": 9,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Crispy Baby Red Potatoes",
        "amount_imperial": "1.25 lbs halved",
        "amount_metric": "567g",
        "raw_weight_grams_base": 142,
        "calories_base": 130,
        "protein_g_base": 3,
        "carbs_g_base": 29,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "grains_carbs"
      },
      {
        "name": "Rainbow Bell Peppers & Red Onion",
        "amount_imperial": "3 large peppers + 1 onion",
        "amount_metric": "450g",
        "raw_weight_grams_base": 112,
        "calories_base": 35,
        "protein_g_base": 1,
        "carbs_g_base": 8,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Extra Virgin Olive Oil (Cold-Pressed)",
        "amount_imperial": "1.5 tablespoons",
        "amount_metric": "22 ml",
        "raw_weight_grams_base": 5.5,
        "calories_base": 45,
        "protein_g_base": 0,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "healthy_fats",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Preheat oven to 400°F (205°C) and line an extra-large rimmed baking sheet with foil or parchment.",
      "Slice turkey sausage into 1/2-inch coins; chop baby potatoes into halves; slice peppers and onions into 1-inch chunks.",
      "Toss all ingredients on the baking sheet with olive oil, Italian seasoning, garlic powder, sea salt, and black pepper.",
      "Spread into a single flat layer and roast for 30 minutes, stirring once halfway, until potatoes are tender and sausage is caramelized.",
      "Portion into 4 glass meal prep containers for weekday lunches."
    ],
    "chef_notes": "Effortless 1-pan meal prep that stores well in the fridge for up to 5 days without getting soggy."
  },
  {
    "id": "slow-cooker-salsa-verde-chicken",
    "title": "Slow Cooker 4-Ingredient Salsa Verde Shredded Chicken",
    "description": "Set-and-forget tender chicken breast slow-cooked in tangy roasted tomatillo salsa verde, cumin, and fresh lime juice.",
    "category": "bulk_meal_prep",
    "sub_category": "slow_cooker_instant_pot",
    "prep_time_minutes": 5,
    "cook_time_minutes": 240,
    "servings_yield": 5,
    "difficulty": "easy",
    "tags": [
      "Slow Cooker",
      "Set & Forget",
      "Ultra Lean",
      "Multi-Use"
    ],
    "calories_per_serving": 260,
    "protein_g_per_serving": 46,
    "carbs_g_per_serving": 6,
    "fat_g_per_serving": 4,
    "icon_emoji": "🍲",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breast",
        "amount_imperial": "2 lbs (32 oz)",
        "amount_metric": "907g",
        "raw_weight_grams_base": 181,
        "calories_base": 230,
        "protein_g_base": 46,
        "carbs_g_base": 0,
        "fat_g_base": 4,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Roasted Tomatillo Salsa Verde",
        "amount_imperial": "1 jar (16 oz)",
        "amount_metric": "454g",
        "raw_weight_grams_base": 90,
        "calories_base": 30,
        "protein_g_base": 0,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "snacks_pantry"
      }
    ],
    "instructions": [
      "Place raw chicken breasts in the bottom of your slow cooker.",
      "Sprinkle with cumin, garlic powder, sea salt, and pour the entire jar of salsa verde over the top.",
      "Cover and cook on LOW for 4-5 hours (or HIGH for 2.5-3 hours) until chicken reaches 165°F and shreds easily with two forks.",
      "Shred chicken directly in the tangy juices and stir to coat.",
      "Use throughout the week for tacos, rice bowls, salads, and wraps."
    ],
    "chef_notes": "The ultimate versatile meal prep protein staple: works seamlessly across bowls, salads, and wraps."
  },
  {
    "id": "turkey-sweet-potato-shepherds-pie",
    "title": "High-Protein Turkey & Sweet Potato Shepherd's Pie",
    "description": "Comforting savory casserole layered with seasoned lean ground turkey, garden peas, carrots, and crowned with mashed sweet potatoes.",
    "category": "bulk_meal_prep",
    "sub_category": "casseroles_bakes",
    "prep_time_minutes": 15,
    "cook_time_minutes": 35,
    "servings_yield": 4,
    "difficulty": "moderate",
    "tags": [
      "Casserole",
      "Comfort Food",
      "High-Protein",
      "Vitamin A Rich"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 38,
    "carbs_g_per_serving": 36,
    "fat_g_per_serving": 9,
    "icon_emoji": "🥧",
    "ingredients": [
      {
        "name": "Lean Ground Turkey Breast (93/7)",
        "amount_imperial": "1.25 lbs (20 oz)",
        "amount_metric": "567g",
        "raw_weight_grams_base": 142,
        "calories_base": 200,
        "protein_g_base": 32,
        "carbs_g_base": 0,
        "fat_g_base": 6,
        "department": "meat_seafood",
        "food_category": "poultry_meat"
      },
      {
        "name": "Roasted Sweet Potato Cubes (Mashed)",
        "amount_imperial": "1.5 lbs sweet potatoes",
        "amount_metric": "680g",
        "raw_weight_grams_base": 170,
        "calories_base": 150,
        "protein_g_base": 3,
        "carbs_g_base": 34,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "grains_carbs"
      },
      {
        "name": "Frozen Peas & Carrots",
        "amount_imperial": "1.5 cups",
        "amount_metric": "200g",
        "raw_weight_grams_base": 50,
        "calories_base": 40,
        "protein_g_base": 3,
        "carbs_g_base": 7,
        "fat_g_base": 0,
        "department": "frozen",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Boil peeled cubed sweet potatoes for 15 minutes until fork-tender; mash with a splash of milk, cinnamon, salt, and pepper.",
      "In a skillet, brown lean ground turkey with diced onions, minced garlic, thyme, and rosemary (6 minutes).",
      "Stir in tomato paste, Worcestershire sauce, 1/2 cup low-sodium chicken broth, and frozen peas & carrots. Simmer 5 minutes.",
      "Transfer turkey filling into an 8x8-inch baking dish. Spread mashed sweet potatoes evenly over top; use a fork to score peaks.",
      "Bake at 375°F (190°C) for 25 minutes until bubbling and sweet potato peaks are golden."
    ],
    "chef_notes": "Sweet potatoes replace heavy butter-laden white potatoes, providing rich beta-carotene and smooth flavor."
  },
  {
    "id": "peanut-butter-protein-bites",
    "title": "Peanut Butter & Dark Chocolate Chip Protein Energy Bites",
    "description": "No-bake energy balls made with rolled oats, vanilla whey protein, natural peanut butter, raw honey, and dark chocolate chips.",
    "category": "snack_dessert",
    "sub_category": "protein_bites_bars",
    "prep_time_minutes": 10,
    "cook_time_minutes": 0,
    "servings_yield": 6,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "No-Bake",
      "Pre-Workout Fuel",
      "Satisfying"
    ],
    "calories_per_serving": 210,
    "protein_g_per_serving": 14,
    "carbs_g_per_serving": 20,
    "fat_g_per_serving": 9,
    "icon_emoji": "🍫",
    "ingredients": [
      {
        "name": "Old-Fashioned Rolled Oats",
        "amount_imperial": "1.5 cups dry",
        "amount_metric": "135g",
        "raw_weight_grams_base": 22.5,
        "calories_base": 80,
        "protein_g_base": 3,
        "carbs_g_base": 14,
        "fat_g_base": 1.5,
        "department": "grains_bakery",
        "food_category": "grains_carbs"
      },
      {
        "name": "100% Vanilla Whey Protein Isolate",
        "amount_imperial": "2 scoops",
        "amount_metric": "64g",
        "raw_weight_grams_base": 10.6,
        "calories_base": 40,
        "protein_g_base": 8,
        "carbs_g_base": 1,
        "fat_g_base": 0.5,
        "department": "supplements",
        "food_category": "snacks_pantry"
      },
      {
        "name": "Natural Creamy Peanut Butter",
        "amount_imperial": "1/3 cup (3 oz)",
        "amount_metric": "85g",
        "raw_weight_grams_base": 14.1,
        "calories_base": 80,
        "protein_g_base": 3,
        "carbs_g_base": 3,
        "fat_g_base": 7,
        "department": "healthy_fats",
        "food_category": "nuts_fats_oils"
      },
      {
        "name": "Raw Organic Wildflower Honey",
        "amount_imperial": "2 tablespoons",
        "amount_metric": "30 ml",
        "raw_weight_grams_base": 5,
        "calories_base": 20,
        "protein_g_base": 0,
        "carbs_g_base": 5,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "snacks_pantry"
      }
    ],
    "instructions": [
      "In a medium mixing bowl, combine rolled oats, whey protein, peanut butter, honey, chia seeds, and dark chocolate chips.",
      "Mix thoroughly until a thick dough forms. (If too crumbly, add 1-2 tsp of water or almond milk).",
      "Roll dough between palms into 12 uniform bite-sized balls (2 balls per serving).",
      "Chill in the refrigerator for 20 minutes to set. Store in an airtight container for up to 10 days."
    ],
    "chef_notes": "Grab 2 bites 30 minutes before training for quick, sustained muscular glycogen and clean fats."
  },
  {
    "id": "frozen-greek-yogurt-bark",
    "title": "High-Protein Frozen Greek Yogurt Berry Bark",
    "description": "Refreshing frozen snack made with vanilla Greek yogurt, fresh blueberries, crushed strawberries, sliced almonds, and honey drizzle.",
    "category": "snack_dessert",
    "sub_category": "sweet_treats",
    "prep_time_minutes": 5,
    "cook_time_minutes": 0,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Frozen Treat",
      "Antioxidant Rich",
      "Low-Calorie"
    ],
    "calories_per_serving": 140,
    "protein_g_per_serving": 15,
    "carbs_g_per_serving": 14,
    "fat_g_per_serving": 3,
    "icon_emoji": "🍨",
    "ingredients": [
      {
        "name": "Non-Fat 0% Greek Yogurt",
        "amount_imperial": "2 cups (16 oz)",
        "amount_metric": "454g",
        "raw_weight_grams_base": 113.5,
        "calories_base": 70,
        "protein_g_base": 13,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "100% Vanilla Whey Protein Isolate",
        "amount_imperial": "1 scoop",
        "amount_metric": "32g",
        "raw_weight_grams_base": 8,
        "calories_base": 30,
        "protein_g_base": 6,
        "carbs_g_base": 1,
        "fat_g_base": 0.5,
        "department": "supplements",
        "food_category": "snacks_pantry"
      },
      {
        "name": "Fresh Blueberries & Strawberries",
        "amount_imperial": "1 cup mixed",
        "amount_metric": "150g",
        "raw_weight_grams_base": 37.5,
        "calories_base": 25,
        "protein_g_base": 0.5,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "fruits"
      },
      {
        "name": "Sliced Raw Almonds",
        "amount_imperial": "2 tbsp",
        "amount_metric": "15g",
        "raw_weight_grams_base": 3.75,
        "calories_base": 20,
        "protein_g_base": 1,
        "carbs_g_base": 1,
        "fat_g_base": 1.8,
        "department": "healthy_fats",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Line a baking sheet with parchment paper.",
      "Whisk Greek yogurt, vanilla protein powder, and 1 tbsp honey in a bowl until silky.",
      "Spread mixture evenly across parchment paper to about 1/4-inch thickness.",
      "Scatter fresh berries and sliced almonds over the top. Press gently into the yogurt.",
      "Freeze for 2.5 hours until solid. Snap or slice into bark pieces. Store in freezer bag."
    ],
    "chef_notes": "Satisfies ice cream cravings with probiotic cultures, real fruit antioxidants, and 15g protein per portion."
  },
  {
    "id": "crispy-air-fried-chickpeas",
    "title": "Crispy Sea Salt & Smoked Paprika Air-Fried Chickpeas",
    "description": "Ultra-crisp roasted chickpeas seasoned with smoked paprika, garlic powder, sea salt, and cumin for high-fiber crunch.",
    "category": "snack_dessert",
    "sub_category": "savory_crunch",
    "prep_time_minutes": 5,
    "cook_time_minutes": 15,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "Plant-Based",
      "High-Fiber",
      "Crunchy Snack",
      "Nut-Free"
    ],
    "calories_per_serving": 190,
    "protein_g_per_serving": 10,
    "carbs_g_per_serving": 28,
    "fat_g_per_serving": 4.5,
    "icon_emoji": "🧆",
    "ingredients": [
      {
        "name": "Organic Chickpeas / Garbanzo Beans",
        "amount_imperial": "1 can (15 oz rinsed & dried)",
        "amount_metric": "250g",
        "raw_weight_grams_base": 125,
        "calories_base": 160,
        "protein_g_base": 9,
        "carbs_g_base": 26,
        "fat_g_base": 2.5,
        "department": "pantry_spices",
        "food_category": "plant_protein"
      },
      {
        "name": "Extra Virgin Olive Oil (Cold-Pressed)",
        "amount_imperial": "1 teaspoon",
        "amount_metric": "5 ml",
        "raw_weight_grams_base": 2.5,
        "calories_base": 20,
        "protein_g_base": 0,
        "carbs_g_base": 0,
        "fat_g_base": 2.3,
        "department": "healthy_fats",
        "food_category": "nuts_fats_oils"
      }
    ],
    "instructions": [
      "Rinse chickpeas and pat thoroughly dry with a paper towel. (Drier chickpeas = crispier crunch!).",
      "Toss chickpeas with olive oil, smoked paprika, garlic powder, cumin, cayenne, and sea salt.",
      "Pour into air fryer basket at 390°F (200°C) and cook for 14-16 minutes, shaking basket every 4 minutes until golden and crunchy.",
      "Let cool for 5 minutes (they crisp up more as they cool)."
    ],
    "chef_notes": "A wholesome, crunchy chip substitute with high dietary fiber to satisfy savory afternoon snack cravings."
  }
];
