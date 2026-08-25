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
  },
  {
    "id": "greek-spinach-feta-egg-white-scramble",
    "title": "Greek Spinach & Feta Scramble with Kalamata Olives & Sourdough",
    "description": "Fluffy egg whites and whole eggs scrambled with tender baby spinach, sun-ripened cherry tomatoes, tangy Greek feta, and pitted Kalamata olives, served alongside toasted artisan sourdough.",
    "category": "breakfast",
    "sub_category": "high_protein_eggs",
    "prep_time_minutes": 8,
    "cook_time_minutes": 7,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Mediterranean",
      "Vegetarian",
      "Quick & Easy"
    ],
    "calories_per_serving": 380,
    "protein_g_per_serving": 32,
    "carbs_g_per_serving": 28,
    "fat_g_per_serving": 14,
    "icon_emoji": "🍳",
    "ingredients": [
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "2 whole",
        "amount_metric": "100g",
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
        "amount_imperial": "1/2 cup (4 fl oz)",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 65,
        "protein_g_base": 13,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Baby Spinach",
        "amount_imperial": "2 cups packed",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 15,
        "protein_g_base": 2,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Halved Cherry Tomatoes",
        "amount_imperial": "1/2 cup",
        "amount_metric": "75g",
        "raw_weight_grams_base": 75,
        "calories_base": 15,
        "protein_g_base": 1,
        "carbs_g_base": 3,
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
        "name": "Artisan Sourdough Bread",
        "amount_imperial": "1 slice (1.5 oz)",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 70,
        "protein_g_base": 3,
        "carbs_g_base": 14,
        "fat_g_base": 1,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      }
    ],
    "instructions": [
      "Whisk whole eggs and liquid egg whites in a small bowl with a pinch of sea salt, black pepper, and dried oregano.",
      "Heat a non-stick skillet over medium heat with cooking spray or light olive oil; add cherry tomatoes and baby spinach, sautéing for 90 seconds until greens wilt.",
      "Pour whisked eggs into skillet and gently push curd layers toward the center with a spatula until soft and creamy (about 2 to 3 minutes).",
      "Remove from heat, fold in crumbled Greek feta cheese, and serve hot with a warm toasted slice of sourdough bread."
    ]
  },
  {
    "id": "tex-mex-migas-chorizo-skillet",
    "title": "Tex-Mex Turkey Chorizo Migas Skillet with Warm Corn Tortillas",
    "description": "Crumbled lean turkey chorizo, charred jalapeños, and diced bell peppers tossed with crispy baked corn tortilla strips and soft-scrambled farm eggs, finished with cotija cheese and salsa.",
    "category": "breakfast",
    "sub_category": "high_protein_eggs",
    "prep_time_minutes": 10,
    "cook_time_minutes": 10,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Tex-Mex",
      "Gluten-Free",
      "Energizing"
    ],
    "calories_per_serving": 440,
    "protein_g_per_serving": 36,
    "carbs_g_per_serving": 30,
    "fat_g_per_serving": 18,
    "icon_emoji": "🍳",
    "ingredients": [
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "2 whole",
        "amount_metric": "100g",
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
        "amount_imperial": "1/3 cup",
        "amount_metric": "80g",
        "raw_weight_grams_base": 80,
        "calories_base": 45,
        "protein_g_base": 9,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Lean Ground Turkey Chorizo",
        "amount_imperial": "3 oz",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 130,
        "protein_g_base": 15,
        "carbs_g_base": 1,
        "fat_g_base": 7,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Corn Tortillas (Strips)",
        "amount_imperial": "2 small (6-inch)",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 90,
        "protein_g_base": 2,
        "carbs_g_base": 18,
        "fat_g_base": 1,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Diced Bell Pepper & Red Onion",
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
        "name": "Crumbled Cotija Cheese",
        "amount_imperial": "1 tbsp",
        "amount_metric": "14g",
        "raw_weight_grams_base": 14,
        "calories_base": 40,
        "protein_g_base": 2,
        "carbs_g_base": 0,
        "fat_g_base": 3,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Cut corn tortillas into thin strips; lightly toast in a dry skillet over medium-high heat until golden and crispy (about 3 minutes), then set aside.",
      "In the same skillet, brown turkey chorizo with diced onions and peppers over medium heat for 4 to 5 minutes until cooked through.",
      "Whisk whole eggs and egg whites together; reduce skillet heat to medium-low and pour in egg mixture.",
      "Fold eggs gently until soft scrambled; toss in toasted tortilla strips in the last 30 seconds of cooking.",
      "Plate immediately topped with crumbled cotija cheese and fresh cilantro."
    ]
  },
  {
    "id": "wild-mushroom-gruyere-herb-omelet",
    "title": "Wild Sautéed Mushroom & Gruyère Herb Omelet with Chives",
    "description": "Earthy cremini and shiitake mushrooms pan-seared with fresh thyme and garlic, folded into a French-style velvety egg omelet with melted aged Gruyère cheese.",
    "category": "breakfast",
    "sub_category": "high_protein_eggs",
    "prep_time_minutes": 8,
    "cook_time_minutes": 8,
    "servings_yield": 1,
    "difficulty": "moderate",
    "tags": [
      "High-Protein",
      "Gourmet",
      "Vegetarian",
      "Keto-Friendly"
    ],
    "calories_per_serving": 360,
    "protein_g_per_serving": 27,
    "carbs_g_per_serving": 6,
    "fat_g_per_serving": 24,
    "icon_emoji": "🍄",
    "ingredients": [
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "3 whole",
        "amount_metric": "150g",
        "raw_weight_grams_base": 150,
        "calories_base": 210,
        "protein_g_base": 18,
        "carbs_g_base": 1,
        "fat_g_base": 15,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Sliced Cremini & Shiitake Mushrooms",
        "amount_imperial": "1 cup sliced",
        "amount_metric": "90g",
        "raw_weight_grams_base": 90,
        "calories_base": 25,
        "protein_g_base": 2,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Shredded Gruyère Cheese",
        "amount_imperial": "2 tbsp (1 oz)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 28,
        "calories_base": 110,
        "protein_g_base": 7,
        "carbs_g_base": 0,
        "fat_g_base": 9,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Chives & Thyme (Minced)",
        "amount_imperial": "1 tbsp minced",
        "amount_metric": "5g",
        "raw_weight_grams_base": 5,
        "calories_base": 5,
        "protein_g_base": 0,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Sauté sliced mushrooms in a non-stick skillet over medium-high heat with a drop of olive oil and fresh thyme for 4 minutes until deeply browned and caramelized; transfer to a plate.",
      "Vigorously whisk eggs with a pinch of sea salt and black pepper until completely homogenous.",
      "Lower skillet heat to medium; pour in beaten eggs. As eggs set on bottom, tilt pan and lift edges with a spatula to let uncooked eggs run underneath.",
      "When top is creamy and just set, spread warm sautéed mushrooms and shredded Gruyère over one half.",
      "Gently fold omelet over filling, slide onto a warm plate, and garnish with freshly snipped chives."
    ]
  },
  {
    "id": "lemon-ricotta-blueberry-protein-waffles",
    "title": "Lemon Ricotta & Wild Blueberry Protein Waffles with Pure Maple",
    "description": "Crispy Belgian-style protein waffles infused with fresh lemon zest, creamy part-skim ricotta cheese, and folded with wild blueberries, finished with real grade A maple syrup.",
    "category": "breakfast",
    "sub_category": "oats_pancakes",
    "prep_time_minutes": 8,
    "cook_time_minutes": 7,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Whole Food",
      "Post-Workout",
      "Breakfast Favorite"
    ],
    "calories_per_serving": 420,
    "protein_g_per_serving": 35,
    "carbs_g_per_serving": 48,
    "fat_g_per_serving": 8,
    "icon_emoji": "🧇",
    "ingredients": [
      {
        "name": "Rolled Old-Fashioned Oats (Blended to Flour)",
        "amount_imperial": "1/2 cup (1.5 oz)",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 170,
        "protein_g_base": 6,
        "carbs_g_base": 30,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Vanilla Whey Protein Isolate",
        "amount_imperial": "1 scoop (1 oz)",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 110,
        "protein_g_base": 24,
        "carbs_g_base": 2,
        "fat_g_base": 1,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Part-Skim Ricotta Cheese",
        "amount_imperial": "1/4 cup (2 oz)",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 80,
        "protein_g_base": 5,
        "carbs_g_base": 2,
        "fat_g_base": 4,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Liquid Egg Whites",
        "amount_imperial": "1/3 cup",
        "amount_metric": "80g",
        "raw_weight_grams_base": 80,
        "calories_base": 45,
        "protein_g_base": 9,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Wild Blueberries",
        "amount_imperial": "1/2 cup",
        "amount_metric": "75g",
        "raw_weight_grams_base": 75,
        "calories_base": 40,
        "protein_g_base": 1,
        "carbs_g_base": 9,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Pure Grade A Maple Syrup",
        "amount_imperial": "1 tbsp",
        "amount_metric": "15ml",
        "raw_weight_grams_base": 20,
        "calories_base": 50,
        "protein_g_base": 0,
        "carbs_g_base": 13,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Preheat waffle iron on high heat and lightly mist with avocado oil spray.",
      "In a blender, combine oat flour, vanilla whey, part-skim ricotta, egg whites, 1/2 tsp baking powder, and 1 tsp fresh lemon zest; blend until a smooth batter forms.",
      "Gently fold whole fresh blueberries into batter with a spatula.",
      "Pour batter into preheated waffle iron and cook for 4 to 5 minutes until steam stops and exterior is golden and crisp.",
      "Serve warm drizzled with 1 tbsp pure maple syrup."
    ]
  },
  {
    "id": "chocolate-peanut-butter-chia-overnight-oats",
    "title": "Dark Chocolate Peanut Butter Chia Overnight Oats with Hemp Seeds",
    "description": "Rolled oats steeped overnight in unsweetened almond milk, dark cocoa powder, chocolate protein isolate, creamy peanut butter, and chia seeds for slow-digesting morning energy.",
    "category": "breakfast",
    "sub_category": "oats_pancakes",
    "prep_time_minutes": 5,
    "cook_time_minutes": 0,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Meal-Prep",
      "No-Cook",
      "Vegan Friendly"
    ],
    "calories_per_serving": 450,
    "protein_g_per_serving": 36,
    "carbs_g_per_serving": 46,
    "fat_g_per_serving": 14,
    "icon_emoji": "🍫",
    "ingredients": [
      {
        "name": "Rolled Old-Fashioned Oats",
        "amount_imperial": "1/2 cup (1.5 oz)",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 170,
        "protein_g_base": 6,
        "carbs_g_base": 30,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Chocolate Whey Protein Powder",
        "amount_imperial": "1 scoop (1 oz)",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 120,
        "protein_g_base": 24,
        "carbs_g_base": 3,
        "fat_g_base": 1,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Natural Creamy Peanut Butter",
        "amount_imperial": "1 tbsp",
        "amount_metric": "16g",
        "raw_weight_grams_base": 16,
        "calories_base": 95,
        "protein_g_base": 4,
        "carbs_g_base": 3,
        "fat_g_base": 8,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Black Chia Seeds",
        "amount_imperial": "1 tbsp",
        "amount_metric": "12g",
        "raw_weight_grams_base": 12,
        "calories_base": 55,
        "protein_g_base": 2,
        "carbs_g_base": 5,
        "fat_g_base": 3,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Unsweetened Almond Milk",
        "amount_imperial": "3/4 cup (6 fl oz)",
        "amount_metric": "180ml",
        "raw_weight_grams_base": 180,
        "calories_base": 25,
        "protein_g_base": 1,
        "carbs_g_base": 1,
        "fat_g_base": 2,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "In a 16 oz mason jar or airtight meal-prep container, combine rolled oats, chocolate whey protein powder, chia seeds, and 1 tsp unsweetened dark cocoa powder.",
      "Pour in unsweetened almond milk and stir vigorously with a fork until protein is completely dissolved.",
      "Swirl in natural creamy peanut butter.",
      "Seal lid tightly and refrigerate for at least 4 hours (or overnight) to allow oats and chia seeds to expand into a rich pudding consistency.",
      "Enjoy chilled straight from the jar or topped with sliced bananas."
    ]
  },
  {
    "id": "strawberries-cream-baked-steel-cut-oatmeal",
    "title": "Strawberries & Cream Baked Steel-Cut Oatmeal with Crushed Almonds",
    "description": "Hearty steel-cut oats baked with fresh sliced strawberries, creamy Greek yogurt, cinnamon, and vanilla, topped with toasted sliced almonds for delightful crunch.",
    "category": "breakfast",
    "sub_category": "oats_pancakes",
    "prep_time_minutes": 10,
    "cook_time_minutes": 25,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Fiber",
      "Meal-Prep",
      "Wholesome",
      "Comfort Food"
    ],
    "calories_per_serving": 360,
    "protein_g_per_serving": 22,
    "carbs_g_per_serving": 48,
    "fat_g_per_serving": 9,
    "icon_emoji": "🍓",
    "ingredients": [
      {
        "name": "Steel-Cut Oats",
        "amount_imperial": "3/4 cup raw",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 440,
        "protein_g_base": 16,
        "carbs_g_base": 82,
        "fat_g_base": 8,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Plain Non-Fat Greek Yogurt",
        "amount_imperial": "1/2 cup (4 oz)",
        "amount_metric": "115g",
        "raw_weight_grams_base": 115,
        "calories_base": 70,
        "protein_g_base": 13,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Vanilla Whey Protein",
        "amount_imperial": "1 scoop",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 110,
        "protein_g_base": 24,
        "carbs_g_base": 2,
        "fat_g_base": 1,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Fresh Strawberries (Sliced)",
        "amount_imperial": "1.5 cups sliced",
        "amount_metric": "225g",
        "raw_weight_grams_base": 225,
        "calories_base": 70,
        "protein_g_base": 1,
        "carbs_g_base": 16,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Sliced Raw Almonds",
        "amount_imperial": "2 tbsp (0.5 oz)",
        "amount_metric": "14g",
        "raw_weight_grams_base": 14,
        "calories_base": 80,
        "protein_g_base": 3,
        "carbs_g_base": 3,
        "fat_g_base": 7,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "Preheat oven to 375°F (190°C) and lightly grease an 8x8-inch baking dish.",
      "In a medium mixing bowl, whisk steel-cut oats, vanilla whey protein, 1 tsp cinnamon, 1/2 tsp baking powder, Greek yogurt, and 1.5 cups warm water.",
      "Stir in two-thirds of the fresh sliced strawberries; spread evenly into the baking dish.",
      "Arrange remaining strawberries on top and sprinkle evenly with sliced almonds.",
      "Bake for 25 to 28 minutes until oats are set and edges are golden and bubbly; divide into 2 generous servings."
    ]
  },
  {
    "id": "tropical-green-spirulina-cleanse-smoothie",
    "title": "Tropical Mango Spinach Green Cleanse Smoothie with Vanilla Whey",
    "description": "Sweet frozen mango chunks, crisp baby spinach, organic spirulina, and vanilla whey protein blended silky smooth with cold coconut water for antioxidant recovery.",
    "category": "breakfast",
    "sub_category": "smoothies_bowls",
    "prep_time_minutes": 5,
    "cook_time_minutes": 0,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Detox & Immunity",
      "Clean-Eating",
      "Post-Workout"
    ],
    "calories_per_serving": 310,
    "protein_g_per_serving": 30,
    "carbs_g_per_serving": 42,
    "fat_g_per_serving": 3,
    "icon_emoji": "🥭",
    "ingredients": [
      {
        "name": "Frozen Mango Chunks",
        "amount_imperial": "1 cup (5 oz)",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 90,
        "protein_g_base": 1,
        "carbs_g_base": 24,
        "fat_g_base": 0,
        "department": "frozen",
        "food_category": "carbohydrate"
      },
      {
        "name": "Fresh Baby Spinach",
        "amount_imperial": "2 cups packed",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 15,
        "protein_g_base": 2,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Vanilla Whey Protein Isolate",
        "amount_imperial": "1 scoop (1 oz)",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 110,
        "protein_g_base": 24,
        "carbs_g_base": 2,
        "fat_g_base": 1,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Pure Coconut Water",
        "amount_imperial": "1 cup (8 fl oz)",
        "amount_metric": "240ml",
        "raw_weight_grams_base": 240,
        "calories_base": 45,
        "protein_g_base": 1,
        "carbs_g_base": 11,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "pantry_staple"
      },
      {
        "name": "Organic Ground Flaxseed",
        "amount_imperial": "1 tbsp",
        "amount_metric": "10g",
        "raw_weight_grams_base": 10,
        "calories_base": 50,
        "protein_g_base": 2,
        "carbs_g_base": 3,
        "fat_g_base": 4,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "Add coconut water, baby spinach, and ground flaxseed to high-speed blender first.",
      "Add vanilla whey protein isolate and frozen mango chunks on top.",
      "Blend on high for 60 seconds until completely emulsified and vibrant emerald green.",
      "Pour into a chilled tumbler and enjoy immediately."
    ]
  },
  {
    "id": "creamy-wild-acai-dragonfruit-power-bowl",
    "title": "Creamy Wild Açaí & Dragonfruit Power Bowl with Toasted Coconut",
    "description": "Thick, spoonable smoothie bowl made with pure unsweetened açaí purée, red pitaya dragonfruit, vanilla Greek yogurt, and topped with hemp hearts and toasted coconut flakes.",
    "category": "breakfast",
    "sub_category": "smoothies_bowls",
    "prep_time_minutes": 7,
    "cook_time_minutes": 0,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Antioxidant",
      "High-Protein",
      "Superfood",
      "Energy Bowl"
    ],
    "calories_per_serving": 370,
    "protein_g_per_serving": 26,
    "carbs_g_per_serving": 44,
    "fat_g_per_serving": 10,
    "icon_emoji": "🥣",
    "ingredients": [
      {
        "name": "Unsweetened Pure Açaí Purée Packet",
        "amount_imperial": "1 packet (3.5 oz)",
        "amount_metric": "100g",
        "raw_weight_grams_base": 100,
        "calories_base": 70,
        "protein_g_base": 1,
        "carbs_g_base": 4,
        "fat_g_base": 5,
        "department": "frozen",
        "food_category": "healthy_fat"
      },
      {
        "name": "Plain Non-Fat Greek Yogurt",
        "amount_imperial": "3/4 cup (6 oz)",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 100,
        "protein_g_base": 18,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Frozen Red Dragonfruit / Pitaya Cubes",
        "amount_imperial": "1/2 cup (3 oz)",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 50,
        "protein_g_base": 1,
        "carbs_g_base": 11,
        "fat_g_base": 0,
        "department": "frozen",
        "food_category": "carbohydrate"
      },
      {
        "name": "Raw Hemp Hearts",
        "amount_imperial": "1 tbsp",
        "amount_metric": "10g",
        "raw_weight_grams_base": 10,
        "calories_base": 60,
        "protein_g_base": 3,
        "carbs_g_base": 1,
        "fat_g_base": 5,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Unsweetened Toasted Coconut Flakes",
        "amount_imperial": "1 tbsp",
        "amount_metric": "8g",
        "raw_weight_grams_base": 8,
        "calories_base": 50,
        "protein_g_base": 1,
        "carbs_g_base": 2,
        "fat_g_base": 4,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Vanilla Whey Protein Isolate",
        "amount_imperial": "1/2 scoop (0.5 oz)",
        "amount_metric": "15g",
        "raw_weight_grams_base": 15,
        "calories_base": 55,
        "protein_g_base": 12,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "supplements",
        "food_category": "protein"
      }
    ],
    "instructions": [
      "Break açaí packet into blender with Greek yogurt, dragonfruit cubes, and vanilla protein powder.",
      "Blend using tamper on low-to-medium speed until ultra-thick and velvety like soft-serve ice cream.",
      "Scoop into a wide chilled breakfast bowl.",
      "Garnish neatly with hemp hearts, toasted coconut flakes, and fresh berries."
    ]
  },
  {
    "id": "spinach-sun-dried-tomato-egg-bites",
    "title": "Spinach & Sun-Dried Tomato Egg Bites with Parmesan (Sous-Vide Style)",
    "description": "Silky, melt-in-your-mouth egg bites whipped with cottage cheese, sautéed baby spinach, tangy sun-dried tomatoes, and sharp shredded Parmesan cheese.",
    "category": "breakfast",
    "sub_category": "quick_grab_go",
    "prep_time_minutes": 10,
    "cook_time_minutes": 20,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "Meal-Prep",
      "High-Protein",
      "Keto-Friendly",
      "Grab & Go"
    ],
    "calories_per_serving": 260,
    "protein_g_per_serving": 24,
    "carbs_g_per_serving": 6,
    "fat_g_per_serving": 15,
    "icon_emoji": "🧁",
    "ingredients": [
      {
        "name": "Large Whole Eggs",
        "amount_imperial": "4 whole",
        "amount_metric": "200g",
        "raw_weight_grams_base": 200,
        "calories_base": 280,
        "protein_g_base": 24,
        "carbs_g_base": 2,
        "fat_g_base": 20,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Low-Fat Cottage Cheese (2%)",
        "amount_imperial": "1/2 cup (4 oz)",
        "amount_metric": "115g",
        "raw_weight_grams_base": 115,
        "calories_base": 90,
        "protein_g_base": 13,
        "carbs_g_base": 4,
        "fat_g_base": 2,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Sun-Dried Tomatoes (Drained & Chopped)",
        "amount_imperial": "2 tbsp chopped",
        "amount_metric": "20g",
        "raw_weight_grams_base": 20,
        "calories_base": 45,
        "protein_g_base": 2,
        "carbs_g_base": 7,
        "fat_g_base": 1,
        "department": "pantry_spices",
        "food_category": "vegetables"
      },
      {
        "name": "Baby Spinach (Finely Chopped)",
        "amount_imperial": "1 cup chopped",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 10,
        "protein_g_base": 1,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Grated Parmesan Cheese",
        "amount_imperial": "2 tbsp (0.7 oz)",
        "amount_metric": "20g",
        "raw_weight_grams_base": 20,
        "calories_base": 80,
        "protein_g_base": 7,
        "carbs_g_base": 0,
        "fat_g_base": 6,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Preheat oven to 325°F (165°C); place a baking dish filled with 1 inch of boiling water on bottom oven rack to create steam.",
      "In a blender, combine eggs, cottage cheese, Parmesan cheese, 1/4 tsp salt, and black pepper; blend on high for 30 seconds until completely smooth and frothy.",
      "Divide chopped spinach and sun-dried tomatoes evenly among 6 silicone muffin cups.",
      "Pour whipped egg batter over fillings; bake for 20 to 22 minutes until eggs are just set and custard-like.",
      "Cool 5 minutes before popping out of silicone cups. Store in fridge for up to 5 days."
    ]
  },
  {
    "id": "smoked-turkey-egg-white-breakfast-wrap",
    "title": "Smoked Turkey & Egg White Protein Wrap with Whipped Chive Cream",
    "description": "Lean deli smoked turkey breast, fluffy scrambled egg whites, roasted red peppers, and whipped light chive cream cheese wrapped tightly in a high-fiber whole wheat tortilla.",
    "category": "breakfast",
    "sub_category": "quick_grab_go",
    "prep_time_minutes": 5,
    "cook_time_minutes": 5,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "High-Fiber",
      "Quick Prep",
      "Macro-Friendly"
    ],
    "calories_per_serving": 340,
    "protein_g_per_serving": 35,
    "carbs_g_per_serving": 26,
    "fat_g_per_serving": 9,
    "icon_emoji": "🌯",
    "ingredients": [
      {
        "name": "Liquid Egg Whites",
        "amount_imperial": "3/4 cup (6 fl oz)",
        "amount_metric": "180g",
        "raw_weight_grams_base": 180,
        "calories_base": 95,
        "protein_g_base": 20,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Sliced Smoked Turkey Breast",
        "amount_imperial": "3 oz (3 slices)",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 90,
        "protein_g_base": 16,
        "carbs_g_base": 1,
        "fat_g_base": 2,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "High-Fiber Whole Wheat Tortilla",
        "amount_imperial": "1 large (8-inch)",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 70,
        "protein_g_base": 5,
        "carbs_g_base": 18,
        "fat_g_base": 2,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Whipped Light Chive Cream Cheese",
        "amount_imperial": "1.5 tbsp",
        "amount_metric": "22g",
        "raw_weight_grams_base": 22,
        "calories_base": 50,
        "protein_g_base": 2,
        "carbs_g_base": 2,
        "fat_g_base": 4,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Roasted Red Peppers (Jarred)",
        "amount_imperial": "1/4 cup strips",
        "amount_metric": "40g",
        "raw_weight_grams_base": 40,
        "calories_base": 15,
        "protein_g_base": 0,
        "carbs_g_base": 3,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Scramble egg whites in a non-stick skillet over medium heat with black pepper until fluffy (about 2 minutes).",
      "Spread whipped chive cream cheese across center of warm whole wheat tortilla.",
      "Layer slices of smoked turkey breast, scrambled egg whites, and roasted red pepper strips over cream cheese.",
      "Fold in tortilla sides and roll tightly into a burrito wrap; sear seam-down in skillet for 1 minute for a toasted crispy seal."
    ]
  },
  {
    "id": "korean-beef-bulgogi-cauliflower-bowl",
    "title": "Korean Beef Bulgogi & Cauliflower Rice Fuel Bowl with Kimchi",
    "description": "Tender shaved lean flank steak marinated in soy, sesame, garlic, and ginger, seared sizzling hot over fluffy steamed cauliflower rice, topped with spicy fermented kimchi and a soft poached egg.",
    "category": "lunch",
    "sub_category": "power_bowls",
    "prep_time_minutes": 10,
    "cook_time_minutes": 10,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Low-Carb",
      "Asian Cuisine",
      "Metabolic"
    ],
    "calories_per_serving": 420,
    "protein_g_per_serving": 44,
    "carbs_g_per_serving": 16,
    "fat_g_per_serving": 20,
    "icon_emoji": "🥩",
    "ingredients": [
      {
        "name": "Lean Beef Flank Steak (Shaved Thin)",
        "amount_imperial": "6 oz raw",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 260,
        "protein_g_base": 36,
        "carbs_g_base": 0,
        "fat_g_base": 12,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Riced Cauliflower (Steamed)",
        "amount_imperial": "2 cups",
        "amount_metric": "200g",
        "raw_weight_grams_base": 200,
        "calories_base": 50,
        "protein_g_base": 4,
        "carbs_g_base": 8,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Fermented Korean Kimchi",
        "amount_imperial": "1/3 cup",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 15,
        "protein_g_base": 1,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Large Whole Egg (Poached or Sunny-Side)",
        "amount_imperial": "1 whole",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 70,
        "protein_g_base": 6,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Low-Sodium Soy Sauce & Toasted Sesame Oil",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "15ml",
        "raw_weight_grams_base": 15,
        "calories_base": 45,
        "protein_g_base": 1,
        "carbs_g_base": 1,
        "fat_g_base": 4,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Toss shaved flank steak with soy sauce, minced garlic, ginger, and sesame oil in a small bowl.",
      "Heat a cast-iron skillet or wok over high heat; sear beef slices for 2 to 3 minutes until caramelized and tender.",
      "Microwave or steam riced cauliflower in a bowl for 3 minutes until tender and fluffy.",
      "Build bowl with riced cauliflower base; arrange seared bulgogi beef, fermented kimchi, and sliced scallions on top.",
      "Crown with a warm sunny-side up egg and sprinkle with toasted sesame seeds."
    ]
  },
  {
    "id": "mediterranean-crispy-falafel-hummus-bowl",
    "title": "Crispy Baked Falafel & Spiced Hummus Grain Bowl with Tzatziki",
    "description": "Herb-packed baked chickpea falafel patties nestled over nutty quinoa, crisp Persian cucumbers, kalamata olives, cherry tomatoes, and creamy garlic hummus with fresh dill tzatziki.",
    "category": "lunch",
    "sub_category": "power_bowls",
    "prep_time_minutes": 12,
    "cook_time_minutes": 15,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Fiber",
      "Plant-Based",
      "Mediterranean",
      "Heart-Healthy"
    ],
    "calories_per_serving": 460,
    "protein_g_per_serving": 24,
    "carbs_g_per_serving": 62,
    "fat_g_per_serving": 15,
    "icon_emoji": "🧆",
    "ingredients": [
      {
        "name": "Baked Chickpea Falafel (4 Patties)",
        "amount_imperial": "4 patties (4 oz)",
        "amount_metric": "115g",
        "raw_weight_grams_base": 115,
        "calories_base": 220,
        "protein_g_base": 10,
        "carbs_g_base": 30,
        "fat_g_base": 7,
        "department": "frozen",
        "food_category": "protein"
      },
      {
        "name": "Cooked Organic Tri-Color Quinoa",
        "amount_imperial": "1/2 cup cooked",
        "amount_metric": "90g",
        "raw_weight_grams_base": 90,
        "calories_base": 110,
        "protein_g_base": 4,
        "carbs_g_base": 20,
        "fat_g_base": 2,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Traditional Garlic Hummus",
        "amount_imperial": "2 tbsp (1 oz)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 28,
        "calories_base": 70,
        "protein_g_base": 2,
        "carbs_g_base": 4,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "healthy_fat"
      },
      {
        "name": "Greek Yogurt Cucumber Tzatziki",
        "amount_imperial": "2 tbsp (1 oz)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 28,
        "calories_base": 30,
        "protein_g_base": 2,
        "carbs_g_base": 2,
        "fat_g_base": 1,
        "department": "dairy_eggs",
        "food_category": "pantry_staple"
      },
      {
        "name": "Diced Persian Cucumbers & Cherry Tomatoes",
        "amount_imperial": "1 cup mix",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 30,
        "protein_g_base": 1,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Bake or air-fry falafel patties at 390°F (200°C) for 10 minutes until crispy and golden on the outside.",
      "Place warm cooked quinoa in bottom of bowl.",
      "Arrange diced cucumbers, halved cherry tomatoes, and crispy falafel patties over quinoa.",
      "Add generous dollops of garlic hummus and cool Greek yogurt tzatziki on opposite sides.",
      "Garnish with chopped fresh parsley, a squeeze of fresh lemon juice, and a pinch of ground sumac."
    ]
  },
  {
    "id": "miso-ginger-grilled-salmon-quinoa-bowl",
    "title": "Miso Ginger Grilled Salmon & Edamame Quinoa Power Bowl",
    "description": "Omega-3 rich wild salmon fillet glazed with white miso and ginger, served over fluffy quinoa with shelled edamame, steamed broccoli florets, and sliced avocado.",
    "category": "lunch",
    "sub_category": "power_bowls",
    "prep_time_minutes": 10,
    "cook_time_minutes": 12,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Omega-3",
      "Clean-Eating",
      "Gluten-Free"
    ],
    "calories_per_serving": 490,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 38,
    "fat_g_per_serving": 19,
    "icon_emoji": "🐟",
    "ingredients": [
      {
        "name": "Wild Alaskan Salmon Fillet",
        "amount_imperial": "5 oz raw",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 200,
        "protein_g_base": 28,
        "carbs_g_base": 0,
        "fat_g_base": 9,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Cooked White Quinoa",
        "amount_imperial": "1/2 cup cooked",
        "amount_metric": "90g",
        "raw_weight_grams_base": 90,
        "calories_base": 110,
        "protein_g_base": 4,
        "carbs_g_base": 20,
        "fat_g_base": 2,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Shelled Green Edamame (Steamed)",
        "amount_imperial": "1/2 cup",
        "amount_metric": "75g",
        "raw_weight_grams_base": 75,
        "calories_base": 95,
        "protein_g_base": 9,
        "carbs_g_base": 7,
        "fat_g_base": 4,
        "department": "frozen",
        "food_category": "protein"
      },
      {
        "name": "Steamed Fresh Broccoli Florets",
        "amount_imperial": "1 cup",
        "amount_metric": "90g",
        "raw_weight_grams_base": 90,
        "calories_base": 30,
        "protein_g_base": 2,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "White Miso Paste & Fresh Ginger Glaze",
        "amount_imperial": "1 tbsp glaze",
        "amount_metric": "15ml",
        "raw_weight_grams_base": 15,
        "calories_base": 35,
        "protein_g_base": 1,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Brush salmon fillet with white miso paste mixed with grated fresh ginger and 1 tsp rice vinegar.",
      "Pan-sear salmon in a hot skillet skin-side down for 4 minutes, then flip and sear for 3 minutes until flaky.",
      "Steam broccoli florets and shelled edamame in microwave or steam basket for 3 minutes.",
      "Layer cooked quinoa in bowl; top with steamed vegetables and the glazed salmon fillet.",
      "Drizzle with any remaining pan glaze and sprinkle with toasted sesame seeds."
    ]
  },
  {
    "id": "grilled-chicken-tzatziki-flatbread-wrap",
    "title": "Greek Grilled Chicken Tzatziki Wrap with Crisp Romaine & Tomatoes",
    "description": "Marinated grilled lemon-oregano chicken breast tenders wrapped in warm pita flatbread with crunchy shredded romaine, vine-ripened tomatoes, red onions, and cool cucumber tzatziki.",
    "category": "lunch",
    "sub_category": "wraps_sandwiches",
    "prep_time_minutes": 8,
    "cook_time_minutes": 8,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Greek Cuisine",
      "Lunch Classic",
      "Clean-Eating"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 34,
    "fat_g_per_serving": 10,
    "icon_emoji": "🥙",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breast",
        "amount_imperial": "5 oz raw",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 150,
        "protein_g_base": 32,
        "carbs_g_base": 0,
        "fat_g_base": 3,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Greek Pita Flatbread (Low-Fat)",
        "amount_imperial": "1 round (2 oz)",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 140,
        "protein_g_base": 5,
        "carbs_g_base": 26,
        "fat_g_base": 2,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Greek Yogurt Tzatziki Dip",
        "amount_imperial": "3 tbsp (1.5 oz)",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 45,
        "protein_g_base": 3,
        "carbs_g_base": 3,
        "fat_g_base": 2,
        "department": "dairy_eggs",
        "food_category": "pantry_staple"
      },
      {
        "name": "Shredded Romaine Lettuce & Sliced Tomato",
        "amount_imperial": "1 cup mix",
        "amount_metric": "80g",
        "raw_weight_grams_base": 80,
        "calories_base": 20,
        "protein_g_base": 1,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Crumbled Greek Feta Cheese",
        "amount_imperial": "1 tbsp",
        "amount_metric": "14g",
        "raw_weight_grams_base": 14,
        "calories_base": 35,
        "protein_g_base": 2,
        "carbs_g_base": 1,
        "fat_g_base": 3,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Season chicken breast tenders with lemon juice, dried oregano, garlic powder, salt, and black pepper.",
      "Grill or pan-sear chicken over medium-high heat for 3 to 4 minutes per side until charred and thoroughly cooked (165°F / 74°C).",
      "Warm Greek pita flatbread in a dry skillet for 30 seconds until pliable.",
      "Spread Greek yogurt tzatziki down center of warm pita.",
      "Layer sliced grilled chicken, crisp shredded romaine, sliced ripe tomatoes, thin red onion rings, and crumbled feta cheese; fold and enjoy."
    ]
  },
  {
    "id": "lean-roast-beef-provolone-panini",
    "title": "Lean Shaved Roast Beef & Aged Provolone Panini with Horseradish Dijon",
    "description": "Thinly shaved deli top round roast beef, melted aged provolone cheese, and baby arugula pressed between crusty sourdough bread with a zesty horseradish Dijon spread.",
    "category": "lunch",
    "sub_category": "wraps_sandwiches",
    "prep_time_minutes": 5,
    "cook_time_minutes": 6,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Hot Sandwich",
      "Bistro Style",
      "Satisfying"
    ],
    "calories_per_serving": 420,
    "protein_g_per_serving": 38,
    "carbs_g_per_serving": 32,
    "fat_g_per_serving": 15,
    "icon_emoji": "🥪",
    "ingredients": [
      {
        "name": "Lean Deli Roast Beef (Top Round)",
        "amount_imperial": "4.5 oz sliced",
        "amount_metric": "128g",
        "raw_weight_grams_base": 128,
        "calories_base": 150,
        "protein_g_base": 28,
        "carbs_g_base": 1,
        "fat_g_base": 4,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Artisan Sourdough Bread",
        "amount_imperial": "2 slices (3 oz)",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 140,
        "protein_g_base": 5,
        "carbs_g_base": 28,
        "fat_g_base": 1,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Sliced Aged Provolone Cheese",
        "amount_imperial": "1 slice (1 oz)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 28,
        "calories_base": 100,
        "protein_g_base": 7,
        "carbs_g_base": 0,
        "fat_g_base": 8,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Dijon Mustard & Prepared Horseradish",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "15g",
        "raw_weight_grams_base": 15,
        "calories_base": 15,
        "protein_g_base": 1,
        "carbs_g_base": 1,
        "fat_g_base": 1,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Fresh Baby Arugula",
        "amount_imperial": "1/2 cup packed",
        "amount_metric": "15g",
        "raw_weight_grams_base": 15,
        "calories_base": 5,
        "protein_g_base": 0,
        "carbs_g_base": 1,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Mix Dijon mustard and prepared horseradish in a small ramekin; spread evenly on both slices of sourdough bread.",
      "Layer thinly shaved roast beef, sliced provolone cheese, and fresh baby arugula between bread slices.",
      "Place sandwich in a preheated panini press or non-stick skillet weighed down with a heavy saucepan.",
      "Grill for 3 minutes per side until bread is golden-brown and provolone cheese is completely melted.",
      "Slice diagonally and serve with crisp dill pickles."
    ]
  },
  {
    "id": "turkey-bacon-avocado-ranch-pinwheels",
    "title": "Turkey Bacon & Avocado Club Pinwheels with Whipped Cream Cheese",
    "description": "Lean oven-roasted turkey breast, crispy uncured turkey bacon, ripe avocado slices, and light whipped ranch cream cheese rolled in whole wheat lavash flatbread and sliced into pinwheel bites.",
    "category": "lunch",
    "sub_category": "wraps_sandwiches",
    "prep_time_minutes": 10,
    "cook_time_minutes": 0,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Meal-Prep",
      "No-Cook",
      "Finger Food"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 36,
    "carbs_g_per_serving": 28,
    "fat_g_per_serving": 16,
    "icon_emoji": "🌯",
    "ingredients": [
      {
        "name": "Sliced Oven-Roasted Turkey Breast",
        "amount_imperial": "4 oz (4 slices)",
        "amount_metric": "115g",
        "raw_weight_grams_base": 115,
        "calories_base": 120,
        "protein_g_base": 24,
        "carbs_g_base": 1,
        "fat_g_base": 2,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Crispy Cooked Turkey Bacon",
        "amount_imperial": "2 strips",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 70,
        "protein_g_base": 6,
        "carbs_g_base": 1,
        "fat_g_base": 5,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "High-Fiber Whole Wheat Flatbread / Lavash",
        "amount_imperial": "1 flatbread (2 oz)",
        "amount_metric": "56g",
        "raw_weight_grams_base": 56,
        "calories_base": 90,
        "protein_g_base": 5,
        "carbs_g_base": 20,
        "fat_g_base": 2,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Whipped Light Cream Cheese (Ranch Seasoned)",
        "amount_imperial": "2 tbsp",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 60,
        "protein_g_base": 2,
        "carbs_g_base": 2,
        "fat_g_base": 5,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Hass Avocado (Sliced)",
        "amount_imperial": "1/4 medium avocado",
        "amount_metric": "35g",
        "raw_weight_grams_base": 35,
        "calories_base": 55,
        "protein_g_base": 1,
        "carbs_g_base": 3,
        "fat_g_base": 5,
        "department": "produce",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "Spread light whipped cream cheese evenly over entire surface of flatbread.",
      "Lay sliced turkey breast in an even single layer, followed by crispy turkey bacon strips and thin avocado slices.",
      "Roll flatbread tightly into a cylinder from bottom to top.",
      "Using a serrated knife, slice cylinder into 6 to 8 even round pinwheels.",
      "Pack into meal-prep containers with carrot sticks or cherry tomatoes."
    ]
  },
  {
    "id": "grilled-peach-prosciutto-burrata-salad",
    "title": "Grilled Peach & Prosciutto Arugula Salad with Aged Balsamic",
    "description": "Caramelized grilled peach wedges, paper-thin Italian prosciutto, creamy torn burrata cheese, and toasted pine nuts tossed in baby arugula with aged Modena balsamic glaze.",
    "category": "lunch",
    "sub_category": "fresh_salads",
    "prep_time_minutes": 10,
    "cook_time_minutes": 5,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "Gourmet",
      "High-Protein",
      "Summer Salad",
      "Antioxidants"
    ],
    "calories_per_serving": 380,
    "protein_g_per_serving": 24,
    "carbs_g_per_serving": 26,
    "fat_g_per_serving": 20,
    "icon_emoji": "🍑",
    "ingredients": [
      {
        "name": "Italian Prosciutto di Parma (Lean)",
        "amount_imperial": "2 oz (3-4 slices)",
        "amount_metric": "56g",
        "raw_weight_grams_base": 56,
        "calories_base": 120,
        "protein_g_base": 14,
        "carbs_g_base": 0,
        "fat_g_base": 7,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Fresh Burrata Cheese (Torn)",
        "amount_imperial": "2 oz (half ball)",
        "amount_metric": "56g",
        "raw_weight_grams_base": 56,
        "calories_base": 140,
        "protein_g_base": 8,
        "carbs_g_base": 1,
        "fat_g_base": 12,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Yellow Peach (Cut in Wedges)",
        "amount_imperial": "1 medium peach",
        "amount_metric": "150g",
        "raw_weight_grams_base": 150,
        "calories_base": 60,
        "protein_g_base": 1,
        "carbs_g_base": 15,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Fresh Baby Arugula",
        "amount_imperial": "3 cups packed",
        "amount_metric": "90g",
        "raw_weight_grams_base": 90,
        "calories_base": 25,
        "protein_g_base": 2,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Aged Balsamic Glaze & Olive Oil",
        "amount_imperial": "1 tbsp drizzle",
        "amount_metric": "15ml",
        "raw_weight_grams_base": 15,
        "calories_base": 40,
        "protein_g_base": 0,
        "carbs_g_base": 6,
        "fat_g_base": 2,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Preheat grill pan over medium-high heat; grill peach wedges for 2 minutes per side until charred grill marks appear.",
      "Arrange baby arugula on a large shallow serving plate.",
      "Tuck ribbons of prosciutto and warm grilled peach wedges among the arugula greens.",
      "Tear fresh burrata cheese gently in the center so creamy stracciatella spills over the greens.",
      "Finish with a drizzle of aged balsamic glaze, coarse flaky sea salt, and freshly cracked black pepper."
    ]
  },
  {
    "id": "sesame-ginger-crispy-chicken-chopped-salad",
    "title": "Asian Sesame Ginger Chopped Chicken Salad with Wonton Crisps",
    "description": "Shredded grilled chicken breast, crunchy napa cabbage, julienned carrots, edamame, and scallions tossed with toasted sliced almonds, crispy wonton crisps, and sesame ginger dressing.",
    "category": "lunch",
    "sub_category": "fresh_salads",
    "prep_time_minutes": 12,
    "cook_time_minutes": 0,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "High-Fiber",
      "Meal-Prep Friendly",
      "Crisp & Crunchy"
    ],
    "calories_per_serving": 410,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 28,
    "fat_g_per_serving": 14,
    "icon_emoji": "🥗",
    "ingredients": [
      {
        "name": "Cooked Shredded Chicken Breast",
        "amount_imperial": "5 oz cooked",
        "amount_metric": "140g",
        "raw_weight_grams_base": 140,
        "calories_base": 200,
        "protein_g_base": 36,
        "carbs_g_base": 0,
        "fat_g_base": 4,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Chopped Napa Cabbage & Romaine Mix",
        "amount_imperial": "3 cups mix",
        "amount_metric": "150g",
        "raw_weight_grams_base": 150,
        "calories_base": 30,
        "protein_g_base": 2,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Shelled Green Edamame (Cooked)",
        "amount_imperial": "1/3 cup",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 60,
        "protein_g_base": 6,
        "carbs_g_base": 5,
        "fat_g_base": 2,
        "department": "frozen",
        "food_category": "protein"
      },
      {
        "name": "Toasted Sliced Almonds & Wonton Strips",
        "amount_imperial": "2 tbsp mix",
        "amount_metric": "15g",
        "raw_weight_grams_base": 15,
        "calories_base": 70,
        "protein_g_base": 2,
        "carbs_g_base": 6,
        "fat_g_base": 5,
        "department": "grains_bakery",
        "food_category": "healthy_fat"
      },
      {
        "name": "Light Sesame Ginger Vinaigrette",
        "amount_imperial": "2 tbsp",
        "amount_metric": "30ml",
        "raw_weight_grams_base": 30,
        "calories_base": 50,
        "protein_g_base": 0,
        "carbs_g_base": 5,
        "fat_g_base": 3,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "In a large salad mixing bowl, combine chopped napa cabbage, romaine, julienned carrots, and sliced scallions.",
      "Toss with shredded grilled chicken breast and shelled edamame.",
      "Drizzle with light sesame ginger vinaigrette and toss vigorously with tongs until evenly coated.",
      "Transfer to a chilled bowl and top with toasted sliced almonds and crispy wonton strips right before eating for maximum crunch."
    ]
  },
  {
    "id": "creamy-tuscan-white-bean-chicken-soup",
    "title": "Creamy Tuscan White Bean & Shredded Chicken Soup with Baby Kale",
    "description": "Hearty cannellini beans, tender shredded chicken breast, and tender baby kale simmered in a rich garlic-parmesan chicken broth with rosemary and crushed red pepper.",
    "category": "lunch",
    "sub_category": "soups_chilis",
    "prep_time_minutes": 10,
    "cook_time_minutes": 20,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Comfort Food",
      "Meal-Prep",
      "Italian Classic"
    ],
    "calories_per_serving": 370,
    "protein_g_per_serving": 38,
    "carbs_g_per_serving": 32,
    "fat_g_per_serving": 9,
    "icon_emoji": "🍲",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breast (Poached & Shredded)",
        "amount_imperial": "8 oz raw",
        "amount_metric": "225g",
        "raw_weight_grams_base": 225,
        "calories_base": 250,
        "protein_g_base": 52,
        "carbs_g_base": 0,
        "fat_g_base": 5,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Canned Cannellini White Beans (Rinsed)",
        "amount_imperial": "1 can (15 oz / 1.5 cups)",
        "amount_metric": "250g",
        "raw_weight_grams_base": 250,
        "calories_base": 220,
        "protein_g_base": 14,
        "carbs_g_base": 40,
        "fat_g_base": 1,
        "department": "pantry_spices",
        "food_category": "carbohydrate"
      },
      {
        "name": "Low-Sodium Chicken Bone Broth",
        "amount_imperial": "3 cups (24 fl oz)",
        "amount_metric": "720ml",
        "raw_weight_grams_base": 720,
        "calories_base": 90,
        "protein_g_base": 18,
        "carbs_g_base": 2,
        "fat_g_base": 1,
        "department": "pantry_spices",
        "food_category": "protein"
      },
      {
        "name": "Fresh Baby Kale / Spinach",
        "amount_imperial": "2 cups packed",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 25,
        "protein_g_base": 2,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Grated Parmesan Cheese & Olive Oil",
        "amount_imperial": "2 tbsp mix",
        "amount_metric": "25g",
        "raw_weight_grams_base": 25,
        "calories_base": 110,
        "protein_g_base": 6,
        "carbs_g_base": 1,
        "fat_g_base": 9,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "In a Dutch oven or soup pot, sauté diced garlic and onions in 1 tsp olive oil over medium heat with fresh rosemary for 3 minutes.",
      "Pour in chicken bone broth and rinsed cannellini beans; bring to a boil, then reduce heat to simmer.",
      "Take a potato masher and lightly smash half the beans in the pot to create natural creamy richness without heavy cream.",
      "Stir in shredded chicken breast and chopped baby kale; simmer for 5 minutes until greens wilt.",
      "Ladle into bowls and stir in freshly grated Parmesan cheese and cracked black pepper."
    ]
  },
  {
    "id": "roasted-butternut-squash-crispy-sage-bisque",
    "title": "Roasted Butternut Squash & Apple Bisque with Crispy Sage & Pepitas",
    "description": "Caramelized oven-roasted butternut squash, Honeycrisp apples, and sweet yellow onions blended with warm nutmeg, vegetable broth, and Greek yogurt, topped with crispy sage and toasted pepitas.",
    "category": "lunch",
    "sub_category": "soups_chilis",
    "prep_time_minutes": 15,
    "cook_time_minutes": 25,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Fiber",
      "Antioxidants",
      "Autumn Comfort",
      "Vegetarian"
    ],
    "calories_per_serving": 280,
    "protein_g_per_serving": 14,
    "carbs_g_per_serving": 46,
    "fat_g_per_serving": 7,
    "icon_emoji": "🥣",
    "ingredients": [
      {
        "name": "Fresh Butternut Squash (Cubed)",
        "amount_imperial": "4 cups raw cubes",
        "amount_metric": "450g",
        "raw_weight_grams_base": 450,
        "calories_base": 200,
        "protein_g_base": 4,
        "carbs_g_base": 52,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Honeycrisp Apple (Cored & Diced)",
        "amount_imperial": "1 medium apple",
        "amount_metric": "150g",
        "raw_weight_grams_base": 150,
        "calories_base": 80,
        "protein_g_base": 0,
        "carbs_g_base": 20,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Plain Non-Fat Greek Yogurt",
        "amount_imperial": "1/2 cup (4 oz)",
        "amount_metric": "115g",
        "raw_weight_grams_base": 115,
        "calories_base": 70,
        "protein_g_base": 13,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Vegetable Broth (Low-Sodium)",
        "amount_imperial": "2 cups (16 fl oz)",
        "amount_metric": "480ml",
        "raw_weight_grams_base": 480,
        "calories_base": 30,
        "protein_g_base": 2,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Raw Pepitas / Pumpkin Seeds",
        "amount_imperial": "2 tbsp (0.7 oz)",
        "amount_metric": "20g",
        "raw_weight_grams_base": 20,
        "calories_base": 110,
        "protein_g_base": 5,
        "carbs_g_base": 3,
        "fat_g_base": 9,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "Toss cubed butternut squash and diced apple with 1 tsp olive oil, ground nutmeg, cinnamon, salt, and pepper on a baking sheet.",
      "Roast at 400°F (205°C) for 22 to 25 minutes until caramelized and fork-tender.",
      "Transfer roasted squash and apples to a blender; pour in warm vegetable broth and blend on high until velvety smooth.",
      "Pour back into pot on low heat and whisk in Greek yogurt until fully integrated and creamy.",
      "Pan-fry whole fresh sage leaves in a drop of oil until crisp; serve soup garnished with crispy sage leaves and toasted pepitas."
    ]
  },
  {
    "id": "crispy-rosemary-garlic-chicken-thighs",
    "title": "Crispy Pan-Seared Rosemary Garlic Chicken Thighs with Roasted Carrots",
    "description": "Boneless skinless chicken thighs seasoned with crushed fresh rosemary, garlic, and Dijon mustard, seared golden-crisp in cast iron and served with tender maple-glazed baby carrots.",
    "category": "dinner",
    "sub_category": "poultry_dishes",
    "prep_time_minutes": 10,
    "cook_time_minutes": 16,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Cast Iron",
      "Keto-Friendly",
      "Family Favorite"
    ],
    "calories_per_serving": 460,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 22,
    "fat_g_per_serving": 22,
    "icon_emoji": "🍗",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Thighs",
        "amount_imperial": "6 oz raw",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 240,
        "protein_g_base": 36,
        "carbs_g_base": 0,
        "fat_g_base": 14,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Fresh Baby Carrots (Halved)",
        "amount_imperial": "1.5 cups (7 oz)",
        "amount_metric": "200g",
        "raw_weight_grams_base": 200,
        "calories_base": 70,
        "protein_g_base": 2,
        "carbs_g_base": 16,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Extra Virgin Olive Oil & Dijon Mustard",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "15ml",
        "raw_weight_grams_base": 15,
        "calories_base": 95,
        "protein_g_base": 1,
        "carbs_g_base": 1,
        "fat_g_base": 10,
        "department": "healthy_fats",
        "food_category": "healthy_fat"
      },
      {
        "name": "Fresh Rosemary & Minced Garlic",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "10g",
        "raw_weight_grams_base": 10,
        "calories_base": 10,
        "protein_g_base": 0,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Pat chicken thighs dry with paper towels; rub with minced garlic, fresh chopped rosemary, Dijon mustard, salt, and black pepper.",
      "Heat olive oil in a heavy cast-iron skillet over medium-high heat.",
      "Add chicken thighs and sear undisturbed for 6 minutes until deeply golden-brown; flip and cook for another 5 to 6 minutes until internal temperature hits 175°F (79°C).",
      "Toss baby carrots with remaining pan drippings and roast until caramelized and tender.",
      "Rest chicken thighs for 3 minutes before serving with pan juices spooned over the top."
    ]
  },
  {
    "id": "turkey-meatballs-san-marzano-marinara",
    "title": "Italian Turkey & Herb Meatballs in Rich San Marzano Tomato Marinara",
    "description": "Tender, juicy baked lean ground turkey meatballs seasoned with Italian herbs, garlic, and parmesan, slow-simmered in sweet crushed San Marzano tomato sauce over spaghetti squash.",
    "category": "dinner",
    "sub_category": "poultry_dishes",
    "prep_time_minutes": 15,
    "cook_time_minutes": 20,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Low-Carb",
      "Meal-Prep",
      "Italian Comfort"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 44,
    "carbs_g_per_serving": 24,
    "fat_g_per_serving": 14,
    "icon_emoji": "🍝",
    "ingredients": [
      {
        "name": "Lean Ground Turkey (93/7)",
        "amount_imperial": "12 oz raw",
        "amount_metric": "340g",
        "raw_weight_grams_base": 340,
        "calories_base": 510,
        "protein_g_base": 68,
        "carbs_g_base": 0,
        "fat_g_base": 26,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "San Marzano Crushed Tomatoes",
        "amount_imperial": "2 cups (16 oz)",
        "amount_metric": "480g",
        "raw_weight_grams_base": 480,
        "calories_base": 100,
        "protein_g_base": 4,
        "carbs_g_base": 20,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "vegetables"
      },
      {
        "name": "Grated Parmesan Cheese",
        "amount_imperial": "1/4 cup (1 oz)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 28,
        "calories_base": 110,
        "protein_g_base": 9,
        "carbs_g_base": 1,
        "fat_g_base": 8,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Spaghetti Squash (Cooked Strands)",
        "amount_imperial": "3 cups cooked",
        "amount_metric": "300g",
        "raw_weight_grams_base": 300,
        "calories_base": 90,
        "protein_g_base": 2,
        "carbs_g_base": 20,
        "fat_g_base": 1,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "In a large bowl, gently combine ground turkey, grated parmesan, 1 beaten egg white, minced garlic, Italian seasoning, sea salt, and black pepper.",
      "Roll into 10 evenly sized meatballs; place on a parchment-lined baking sheet and bake at 400°F (205°C) for 15 minutes until golden.",
      "Pour crushed San Marzano tomatoes into a deep skillet with garlic and fresh basil; bring to a low simmer.",
      "Transfer baked meatballs into the simmering marinara sauce and let braise for 8 minutes to absorb flavors.",
      "Serve hot over warm strands of roasted spaghetti squash topped with fresh basil."
    ]
  },
  {
    "id": "creamy-chicken-tikka-masala-basmati",
    "title": "Lightened-Up Chicken Tikka Masala with Fragrant Basmati Rice",
    "description": "Tender chicken breast chunks marinated in Greek yogurt and garam masala, simmered in an aromatic spiced ginger-tomato sauce with light coconut cream over fragrant basmati rice.",
    "category": "dinner",
    "sub_category": "poultry_dishes",
    "prep_time_minutes": 15,
    "cook_time_minutes": 15,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Indian Cuisine",
      "Aromatic",
      "Meal-Prep"
    ],
    "calories_per_serving": 470,
    "protein_g_per_serving": 46,
    "carbs_g_per_serving": 48,
    "fat_g_per_serving": 12,
    "icon_emoji": "🍛",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breast",
        "amount_imperial": "6 oz raw",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 180,
        "protein_g_base": 38,
        "carbs_g_base": 0,
        "fat_g_base": 3,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Cooked Fragrant Basmati Rice",
        "amount_imperial": "3/4 cup cooked",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 150,
        "protein_g_base": 3,
        "carbs_g_base": 34,
        "fat_g_base": 0,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Tomato Purée / Crushed Tomatoes",
        "amount_imperial": "1/2 cup (4 oz)",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 35,
        "protein_g_base": 1,
        "carbs_g_base": 7,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "vegetables"
      },
      {
        "name": "Light Coconut Milk",
        "amount_imperial": "1/4 cup (2 fl oz)",
        "amount_metric": "60ml",
        "raw_weight_grams_base": 60,
        "calories_base": 45,
        "protein_g_base": 0,
        "carbs_g_base": 1,
        "fat_g_base": 4,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Plain Non-Fat Greek Yogurt",
        "amount_imperial": "3 tbsp (1.5 oz)",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 30,
        "protein_g_base": 5,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Dice chicken breast into bite-sized chunks; toss with Greek yogurt, 1 tsp garam masala, 1/2 tsp cumin, smoked paprika, and minced garlic.",
      "Sear chicken in a hot skillet over medium-high heat for 5 minutes until browned.",
      "Stir in tomato purée, grated fresh ginger, turmeric, and light coconut milk; reduce heat to low and simmer for 8 minutes until sauce thickens.",
      "Ladle the rich tikka masala over warm basmati rice and garnish with fresh cilantro leaves."
    ]
  },
  {
    "id": "cast-iron-filet-mignon-garlic-herb-butter",
    "title": "Cast-Iron Filet Mignon Medallions with Garlic Thyme Compound Butter",
    "description": "Fork-tender center-cut beef tenderloin filet pan-seared in screaming hot cast iron with a golden crust, basted in grass-fed garlic herb compound butter alongside roasted asparagus.",
    "category": "dinner",
    "sub_category": "beef_steaks",
    "prep_time_minutes": 5,
    "cook_time_minutes": 8,
    "servings_yield": 1,
    "difficulty": "moderate",
    "tags": [
      "High-Protein",
      "Steakhouse Classic",
      "Keto-Friendly",
      "Gourmet"
    ],
    "calories_per_serving": 430,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 6,
    "fat_g_per_serving": 26,
    "icon_emoji": "🥩",
    "ingredients": [
      {
        "name": "Center-Cut Beef Tenderloin Filet Mignon",
        "amount_imperial": "6 oz raw",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 270,
        "protein_g_base": 38,
        "carbs_g_base": 0,
        "fat_g_base": 13,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Grass-Fed Butter (Garlic & Thyme Infused)",
        "amount_imperial": "1 tbsp (0.5 oz)",
        "amount_metric": "14g",
        "raw_weight_grams_base": 14,
        "calories_base": 100,
        "protein_g_base": 0,
        "carbs_g_base": 0,
        "fat_g_base": 11,
        "department": "dairy_eggs",
        "food_category": "healthy_fat"
      },
      {
        "name": "Fresh Asparagus Spears (Trimmed)",
        "amount_imperial": "1 bundle (6 oz)",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 35,
        "protein_g_base": 4,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Bring filet mignon to room temperature 20 minutes before cooking; season aggressively with coarse sea salt and cracked black pepper.",
      "Heat a cast-iron skillet over high heat until smoking.",
      "Sear steak for 3 minutes without moving to develop a deep mahogany crust.",
      "Flip steak; immediately add grass-fed butter, crushed garlic cloves, and fresh thyme sprigs to the pan.",
      "Tilt pan and spoon foaming garlic-herb butter continuously over the steak for 3 to 4 minutes until internal temperature reaches 130°F (54°C) for medium-rare.",
      "Transfer to a warm board and rest for 5 minutes before serving with seared asparagus spears."
    ]
  },
  {
    "id": "grass-fed-beef-smash-burger-brioche",
    "title": "Grass-Fed Lean Beef Smash Burgers with Sharp Cheddar on Brioche",
    "description": "Crispy-edged seared 93% lean ground beef smash patties topped with melted sharp cheddar cheese, dill pickles, crisp lettuce, and special burger sauce on a toasted artisan brioche bun.",
    "category": "dinner",
    "sub_category": "beef_steaks",
    "prep_time_minutes": 8,
    "cook_time_minutes": 6,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "American Classic",
      "Family Favorite",
      "Post-Workout"
    ],
    "calories_per_serving": 480,
    "protein_g_per_serving": 44,
    "carbs_g_per_serving": 32,
    "fat_g_per_serving": 20,
    "icon_emoji": "🍔",
    "ingredients": [
      {
        "name": "Lean Ground Beef (93/7 Grass-Fed)",
        "amount_imperial": "6 oz raw",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 260,
        "protein_g_base": 36,
        "carbs_g_base": 0,
        "fat_g_base": 12,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Artisan Brioche Burger Bun",
        "amount_imperial": "1 bun (2 oz)",
        "amount_metric": "56g",
        "raw_weight_grams_base": 56,
        "calories_base": 140,
        "protein_g_base": 4,
        "carbs_g_base": 26,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Sharp Yellow Cheddar Cheese",
        "amount_imperial": "1 slice (0.8 oz)",
        "amount_metric": "22g",
        "raw_weight_grams_base": 22,
        "calories_base": 80,
        "protein_g_base": 5,
        "carbs_g_base": 0,
        "fat_g_base": 7,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Dill Pickle Chips, Lettuce & Tomato",
        "amount_imperial": "1/2 cup mix",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 15,
        "protein_g_base": 0,
        "carbs_g_base": 3,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Divide lean ground beef into two loose 3-oz balls.",
      "Heat a cast-iron skillet or flat-top griddle over smoking high heat.",
      "Place beef balls on hot surface and smash down firmly with a heavy metal spatula into thin patties; season with salt and pepper.",
      "Cook for 2 minutes until edges are crispy and browned; flip, top with cheddar cheese, and cover with a lid for 1 minute to melt cheese.",
      "Lightly toast brioche bun; assemble burgers with crisp lettuce, sliced tomato, pickles, and enjoy."
    ]
  },
  {
    "id": "sesame-ginger-beef-snap-pea-stir-fry",
    "title": "Ginger Beef & Sugar Snap Pea Stir-Fry over Jasmine Rice",
    "description": "Tender lean beef sirloin strips flash-fried in a hot wok with sweet sugar snap peas, red bell peppers, ginger, and garlic in a savory low-sugar tamari glaze over steamed jasmine rice.",
    "category": "dinner",
    "sub_category": "beef_steaks",
    "prep_time_minutes": 10,
    "cook_time_minutes": 8,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Quick Dinner",
      "Stir-Fry",
      "Clean-Eating"
    ],
    "calories_per_serving": 440,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 44,
    "fat_g_per_serving": 12,
    "icon_emoji": "🥢",
    "ingredients": [
      {
        "name": "Top Sirloin Beef Steak (Sliced Thin)",
        "amount_imperial": "5.5 oz raw",
        "amount_metric": "155g",
        "raw_weight_grams_base": 155,
        "calories_base": 210,
        "protein_g_base": 35,
        "carbs_g_base": 0,
        "fat_g_base": 7,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Fresh Sugar Snap Peas & Red Bell Pepper",
        "amount_imperial": "1.5 cups mix",
        "amount_metric": "150g",
        "raw_weight_grams_base": 150,
        "calories_base": 45,
        "protein_g_base": 3,
        "carbs_g_base": 9,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Cooked Steamed Jasmine Rice",
        "amount_imperial": "3/4 cup cooked",
        "amount_metric": "120g",
        "raw_weight_grams_base": 120,
        "calories_base": 150,
        "protein_g_base": 3,
        "carbs_g_base": 34,
        "fat_g_base": 0,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Tamari Soy Sauce & Toasted Sesame Oil",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "15ml",
        "raw_weight_grams_base": 15,
        "calories_base": 40,
        "protein_g_base": 1,
        "carbs_g_base": 2,
        "fat_g_base": 3,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Slice sirloin steak thinly against the grain; toss with 1 tsp cornstarch and 1 tsp low-sodium soy sauce.",
      "Heat wok or heavy skillet over high heat with sesame oil.",
      "Add beef strips in a single layer and sear for 2 minutes without stirring, then toss for 1 more minute and transfer to a plate.",
      "Add snap peas, bell peppers, minced ginger, and garlic to wok; stir-fry for 3 minutes until crisp-tender.",
      "Return beef and juices to wok with remaining tamari glaze; toss for 30 seconds and serve over steamed jasmine rice."
    ]
  },
  {
    "id": "blackened-mahi-mahi-mango-avocado-salsa",
    "title": "Blackened Wild Mahi Mahi with Fresh Mango Avocado Salsa",
    "description": "Meaty wild mahi mahi fillets coated in Cajun blackened spice, cast-iron seared until flaky, and crowned with a vibrant salsa of diced sweet mango, creamy avocado, jalapeño, and lime.",
    "category": "dinner",
    "sub_category": "seafood_fish",
    "prep_time_minutes": 10,
    "cook_time_minutes": 8,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Seafood",
      "Gluten-Free",
      "Tropical & Fresh"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 38,
    "carbs_g_per_serving": 26,
    "fat_g_per_serving": 14,
    "icon_emoji": "🐟",
    "ingredients": [
      {
        "name": "Wild Mahi Mahi Fillet",
        "amount_imperial": "6 oz raw",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 160,
        "protein_g_base": 34,
        "carbs_g_base": 0,
        "fat_g_base": 2,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Fresh Diced Mango",
        "amount_imperial": "1/2 cup diced",
        "amount_metric": "80g",
        "raw_weight_grams_base": 80,
        "calories_base": 50,
        "protein_g_base": 1,
        "carbs_g_base": 13,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Fresh Hass Avocado (Diced)",
        "amount_imperial": "1/4 medium avocado",
        "amount_metric": "35g",
        "raw_weight_grams_base": 35,
        "calories_base": 55,
        "protein_g_base": 1,
        "carbs_g_base": 3,
        "fat_g_base": 5,
        "department": "produce",
        "food_category": "healthy_fat"
      },
      {
        "name": "Cajun Blackening Spice Blend & Olive Oil",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "15g",
        "raw_weight_grams_base": 15,
        "calories_base": 50,
        "protein_g_base": 1,
        "carbs_g_base": 2,
        "fat_g_base": 4,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Steamed Asparagus or Greens",
        "amount_imperial": "1 cup",
        "amount_metric": "90g",
        "raw_weight_grams_base": 90,
        "calories_base": 25,
        "protein_g_base": 2,
        "carbs_g_base": 5,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "In a small bowl, combine diced mango, avocado, minced jalapeño, red onion, cilantro, and fresh lime juice; set salsa aside.",
      "Rub mahi mahi fillet thoroughly with Cajun blackening seasoning.",
      "Heat a cast-iron skillet over medium-high heat with a drop of avocado oil.",
      "Sear mahi mahi for 4 minutes per side until blackened crust forms and fish flakes easily with a fork.",
      "Top with generous spoonfuls of fresh mango avocado salsa and serve with tender steamed greens."
    ]
  },
  {
    "id": "garlic-butter-jumbo-shrimp-asparagus-skillet",
    "title": "Garlic Lemon Butter Jumbo Shrimp with Tender Asparagus Spears",
    "description": "Succulent jumbo shrimp sautéed in white wine, fresh garlic, lemon zest, and grass-fed butter, tossed with tender crisp asparagus spears and crushed red pepper flakes.",
    "category": "dinner",
    "sub_category": "seafood_fish",
    "prep_time_minutes": 8,
    "cook_time_minutes": 6,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Low-Carb",
      "10-Minute Meal",
      "Keto-Friendly"
    ],
    "calories_per_serving": 320,
    "protein_g_per_serving": 38,
    "carbs_g_per_serving": 8,
    "fat_g_per_serving": 14,
    "icon_emoji": "🦐",
    "ingredients": [
      {
        "name": "Jumbo Raw Shrimp (Peeled & Deveined)",
        "amount_imperial": "7 oz raw",
        "amount_metric": "200g",
        "raw_weight_grams_base": 200,
        "calories_base": 170,
        "protein_g_base": 36,
        "carbs_g_base": 1,
        "fat_g_base": 2,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Fresh Asparagus (Cut in 2-inch Pieces)",
        "amount_imperial": "1.5 cups pieces",
        "amount_metric": "150g",
        "raw_weight_grams_base": 150,
        "calories_base": 30,
        "protein_g_base": 3,
        "carbs_g_base": 5,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Grass-Fed Butter",
        "amount_imperial": "1 tbsp (0.5 oz)",
        "amount_metric": "14g",
        "raw_weight_grams_base": 14,
        "calories_base": 100,
        "protein_g_base": 0,
        "carbs_g_base": 0,
        "fat_g_base": 11,
        "department": "dairy_eggs",
        "food_category": "healthy_fat"
      },
      {
        "name": "Fresh Lemon Juice & Minced Garlic",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "15ml",
        "raw_weight_grams_base": 15,
        "calories_base": 15,
        "protein_g_base": 0,
        "carbs_g_base": 3,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Melt grass-fed butter in a large skillet over medium-high heat with minced garlic and red pepper flakes.",
      "Add asparagus pieces and sauté for 3 minutes until vibrant green and slightly tender.",
      "Add jumbo shrimp in a single layer; cook for 90 seconds per side until pink and opaque.",
      "Deglaze pan with fresh lemon juice and chopped Italian flat-leaf parsley.",
      "Serve immediately with pan juices spooned over the shrimp."
    ]
  },
  {
    "id": "pan-seared-chilean-sea-bass-lemon-caper",
    "title": "Pan-Seared Chilean Sea Bass with White Wine Lemon Caper Sauce",
    "description": "Buttery, flaky thick-cut Chilean sea bass seared with a golden crust, spooned with a delicate white wine, lemon, and caper pan sauce alongside blistered cherry tomatoes.",
    "category": "dinner",
    "sub_category": "seafood_fish",
    "prep_time_minutes": 8,
    "cook_time_minutes": 10,
    "servings_yield": 1,
    "difficulty": "moderate",
    "tags": [
      "High-Protein",
      "Gourmet Seafood",
      "Restaurant Quality",
      "Keto-Friendly"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 36,
    "carbs_g_per_serving": 6,
    "fat_g_per_serving": 22,
    "icon_emoji": "🐟",
    "ingredients": [
      {
        "name": "Chilean Sea Bass Fillet (Thick Cut)",
        "amount_imperial": "6 oz raw",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 220,
        "protein_g_base": 32,
        "carbs_g_base": 0,
        "fat_g_base": 10,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Blistered Cherry Tomatoes",
        "amount_imperial": "1 cup",
        "amount_metric": "150g",
        "raw_weight_grams_base": 150,
        "calories_base": 30,
        "protein_g_base": 1,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Extra Virgin Olive Oil & Butter",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "15ml",
        "raw_weight_grams_base": 15,
        "calories_base": 110,
        "protein_g_base": 0,
        "carbs_g_base": 0,
        "fat_g_base": 12,
        "department": "healthy_fats",
        "food_category": "healthy_fat"
      },
      {
        "name": "Brined Capers & Fresh Lemon Juice",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "15g",
        "raw_weight_grams_base": 15,
        "calories_base": 15,
        "protein_g_base": 1,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Pat sea bass dry; season both sides with sea salt and white pepper.",
      "Heat olive oil in a stainless-steel or cast-iron skillet over medium-high heat until shimmering.",
      "Place sea bass in pan; sear for 4 minutes until golden crust develops, then flip.",
      "Add cherry tomatoes, capers, butter, and lemon juice around the fish; cook for 4 more minutes basting fish with pan juices.",
      "Transfer sea bass to a warm plate and top with bursting blistered tomatoes and lemon caper sauce."
    ]
  },
  {
    "id": "high-protein-turkey-bolognese-penne",
    "title": "High-Protein Slow-Simmered Turkey Bolognese with Chickpea Penne",
    "description": "Lean ground turkey slow-simmered with crushed plum tomatoes, garlic, oregano, and finely grated carrots, tossed with high-protein chickpea penne pasta and pecorino romano.",
    "category": "dinner",
    "sub_category": "pasta_comfort",
    "prep_time_minutes": 10,
    "cook_time_minutes": 20,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "High-Fiber",
      "Italian Pasta",
      "Meal-Prep"
    ],
    "calories_per_serving": 440,
    "protein_g_per_serving": 45,
    "carbs_g_per_serving": 44,
    "fat_g_per_serving": 11,
    "icon_emoji": "🍝",
    "ingredients": [
      {
        "name": "Lean Ground Turkey (93/7)",
        "amount_imperial": "10 oz raw",
        "amount_metric": "285g",
        "raw_weight_grams_base": 285,
        "calories_base": 420,
        "protein_g_base": 58,
        "carbs_g_base": 0,
        "fat_g_base": 21,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Chickpea Penne Pasta (Dry)",
        "amount_imperial": "4 oz dry (about 2 cups cooked)",
        "amount_metric": "115g",
        "raw_weight_grams_base": 115,
        "calories_base": 380,
        "protein_g_base": 26,
        "carbs_g_base": 64,
        "fat_g_base": 6,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Crushed Italian Plum Tomatoes",
        "amount_imperial": "1.5 cups (12 oz)",
        "amount_metric": "360g",
        "raw_weight_grams_base": 360,
        "calories_base": 80,
        "protein_g_base": 3,
        "carbs_g_base": 16,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "vegetables"
      },
      {
        "name": "Finely Grated Pecorino Romano Cheese",
        "amount_imperial": "2 tbsp (0.7 oz)",
        "amount_metric": "20g",
        "raw_weight_grams_base": 20,
        "calories_base": 80,
        "protein_g_base": 6,
        "carbs_g_base": 1,
        "fat_g_base": 6,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Boil chickpea penne pasta in salted boiling water for 7 minutes until al dente; drain and reserve 1/4 cup pasta water.",
      "Brown ground turkey in a deep skillet over medium heat with diced onions and garlic until no pink remains.",
      "Add crushed plum tomatoes, oregano, salt, pepper, and a splash of reserved pasta water; simmer on low for 12 minutes.",
      "Toss warm chickpea penne directly into the simmering bolognese sauce for 1 minute.",
      "Divide between bowls and top with freshly grated Pecorino Romano cheese."
    ]
  },
  {
    "id": "sheet-pan-greek-lemon-herb-chicken-veggies",
    "title": "Sheet-Pan Greek Lemon Herb Chicken with Bell Peppers & Zucchini",
    "description": "Juicy chicken breast cutlets roasted on a single sheet pan with colorful tri-color bell peppers, zucchini coins, red onions, kalamata olives, and crumbled feta cheese.",
    "category": "bulk_meal_prep",
    "sub_category": "sheet_pan_meals",
    "prep_time_minutes": 15,
    "cook_time_minutes": 25,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "Bulk Prep",
      "1-Pan Meal",
      "High-Protein",
      "Gluten-Free"
    ],
    "calories_per_serving": 360,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 14,
    "fat_g_per_serving": 14,
    "icon_emoji": "🥘",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breasts (Cutlets)",
        "amount_imperial": "24 oz raw (1.5 lbs)",
        "amount_metric": "680g",
        "raw_weight_grams_base": 680,
        "calories_base": 720,
        "protein_g_base": 150,
        "carbs_g_base": 0,
        "fat_g_base": 12,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Tri-Color Bell Peppers & Zucchini",
        "amount_imperial": "5 cups sliced",
        "amount_metric": "600g",
        "raw_weight_grams_base": 600,
        "calories_base": 150,
        "protein_g_base": 6,
        "carbs_g_base": 30,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Extra Virgin Olive Oil & Lemon Juice",
        "amount_imperial": "3 tbsp mix",
        "amount_metric": "45ml",
        "raw_weight_grams_base": 45,
        "calories_base": 360,
        "protein_g_base": 0,
        "carbs_g_base": 3,
        "fat_g_base": 40,
        "department": "healthy_fats",
        "food_category": "healthy_fat"
      },
      {
        "name": "Crumbled Greek Feta Cheese",
        "amount_imperial": "1/2 cup (2 oz)",
        "amount_metric": "56g",
        "raw_weight_grams_base": 56,
        "calories_base": 150,
        "protein_g_base": 8,
        "carbs_g_base": 2,
        "fat_g_base": 12,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Preheat oven to 400°F (205°C) and line an extra-large rimmed sheet pan with parchment paper.",
      "Toss chicken cutlets, sliced bell peppers, zucchini coins, and red onion wedges with olive oil, lemon juice, dried oregano, garlic, salt, and pepper.",
      "Spread evenly across the sheet pan in a single layer.",
      "Roast for 22 to 25 minutes until chicken is cooked through (165°F / 74°C) and vegetables have caramelized edges.",
      "Sprinkle crumbled feta cheese over the hot sheet pan and divide into 4 meal-prep containers."
    ]
  },
  {
    "id": "sheet-pan-honey-dijon-pork-tenderloin",
    "title": "Sheet-Pan Honey Dijon Pork Tenderloin with Roasted Brussels Sprouts",
    "description": "Lean, juicy pork tenderloin medallions glazed in tangy whole grain Dijon mustard and raw honey, roasted on a sheet pan with caramelized crispy halved Brussels sprouts and sweet potato cubes.",
    "category": "bulk_meal_prep",
    "sub_category": "sheet_pan_meals",
    "prep_time_minutes": 15,
    "cook_time_minutes": 25,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Sheet-Pan",
      "Meal-Prep",
      "Wholesome"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 38,
    "carbs_g_per_serving": 32,
    "fat_g_per_serving": 12,
    "icon_emoji": "🥩",
    "ingredients": [
      {
        "name": "Lean Pork Tenderloin (Medallions)",
        "amount_imperial": "24 oz raw (1.5 lbs)",
        "amount_metric": "680g",
        "raw_weight_grams_base": 680,
        "calories_base": 800,
        "protein_g_base": 144,
        "carbs_g_base": 0,
        "fat_g_base": 24,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Fresh Brussels Sprouts (Halved)",
        "amount_imperial": "4 cups halved (1 lb)",
        "amount_metric": "450g",
        "raw_weight_grams_base": 450,
        "calories_base": 180,
        "protein_g_base": 14,
        "carbs_g_base": 36,
        "fat_g_base": 2,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Sweet Potatoes (Diced into 1/2-inch Cubes)",
        "amount_imperial": "2 medium (12 oz)",
        "amount_metric": "340g",
        "raw_weight_grams_base": 340,
        "calories_base": 300,
        "protein_g_base": 6,
        "carbs_g_base": 70,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Whole Grain Dijon Mustard & Raw Honey Glaze",
        "amount_imperial": "3 tbsp mix",
        "amount_metric": "45ml",
        "raw_weight_grams_base": 45,
        "calories_base": 150,
        "protein_g_base": 1,
        "carbs_g_base": 24,
        "fat_g_base": 2,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Preheat oven to 400°F (205°C) and line sheet pan with parchment.",
      "Toss diced sweet potatoes and halved Brussels sprouts with 1 tbsp olive oil, salt, and pepper; spread on two-thirds of the sheet pan.",
      "Brush pork tenderloin medallions generously with the honey Dijon glaze; arrange on remaining portion of sheet pan.",
      "Roast for 22 to 25 minutes until pork reaches internal temperature of 145°F (63°C) and Brussels sprouts are crispy.",
      "Rest pork 5 minutes before slicing and distributing across 4 meal-prep containers."
    ]
  },
  {
    "id": "sheet-pan-fajita-steak-tri-color-peppers",
    "title": "Sheet-Pan Sizzling Steak Fajitas with Charred Tri-Color Bell Peppers",
    "description": "Strips of lean flank steak seasoned with chipotle, cumin, and lime, roasted on high heat alongside charred sweet bell peppers and red onions for quick weeknight fajita bowls.",
    "category": "bulk_meal_prep",
    "sub_category": "sheet_pan_meals",
    "prep_time_minutes": 15,
    "cook_time_minutes": 15,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Tex-Mex",
      "Meal-Prep",
      "1-Pan"
    ],
    "calories_per_serving": 370,
    "protein_g_per_serving": 36,
    "carbs_g_per_serving": 18,
    "fat_g_per_serving": 16,
    "icon_emoji": "🌮",
    "ingredients": [
      {
        "name": "Lean Beef Flank Steak (Sliced in Strips)",
        "amount_imperial": "24 oz raw (1.5 lbs)",
        "amount_metric": "680g",
        "raw_weight_grams_base": 680,
        "calories_base": 980,
        "protein_g_base": 136,
        "carbs_g_base": 0,
        "fat_g_base": 48,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Tri-Color Bell Peppers & Red Onions",
        "amount_imperial": "5 cups sliced",
        "amount_metric": "600g",
        "raw_weight_grams_base": 600,
        "calories_base": 180,
        "protein_g_base": 6,
        "carbs_g_base": 38,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Chipotle Fajita Seasoning & Avocado Oil",
        "amount_imperial": "2 tbsp mix",
        "amount_metric": "30ml",
        "raw_weight_grams_base": 30,
        "calories_base": 240,
        "protein_g_base": 1,
        "carbs_g_base": 4,
        "fat_g_base": 26,
        "department": "healthy_fats",
        "food_category": "healthy_fat"
      },
      {
        "name": "Fresh Limes & Cilantro",
        "amount_imperial": "2 whole limes",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 20,
        "protein_g_base": 0,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Preheat oven on broil setting (high 450°F / 230°C).",
      "Toss sliced bell peppers, onions, and beef flank steak strips with avocado oil, chipotle powder, ground cumin, garlic, and sea salt.",
      "Spread in an even layer across an extra-large heavy sheet pan.",
      "Broil on upper oven rack for 12 to 14 minutes until peppers are charred at the edges and steak is tender.",
      "Squeeze fresh lime juice over pan; portion into 4 meal-prep containers."
    ]
  },
  {
    "id": "slow-cooker-chipotle-beef-barbacoa",
    "title": "Slow-Cooker Chipotle Beef Barbacoa Shreds with Fresh Cilantro Lime",
    "description": "Lean beef chuck roast slow-braised for 8 hours in adobo chipotles, Mexican oregano, cumin, garlic, and lime juice until melt-in-your-mouth tender and effortlessly shreddable.",
    "category": "bulk_meal_prep",
    "sub_category": "slow_cooker_instant_pot",
    "prep_time_minutes": 15,
    "cook_time_minutes": 480,
    "servings_yield": 6,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Slow Cooker",
      "Bulk Prep",
      "Keto-Friendly"
    ],
    "calories_per_serving": 380,
    "protein_g_per_serving": 46,
    "carbs_g_per_serving": 4,
    "fat_g_per_serving": 18,
    "icon_emoji": "🍲",
    "ingredients": [
      {
        "name": "Lean Beef Chuck Roast (Trimmed)",
        "amount_imperial": "2.5 lbs (40 oz)",
        "amount_metric": "1130g",
        "raw_weight_grams_base": 1130,
        "calories_base": 1950,
        "protein_g_base": 260,
        "carbs_g_base": 0,
        "fat_g_base": 95,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Chipotles in Adobo Sauce",
        "amount_imperial": "3 chipotles + 2 tbsp sauce",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 60,
        "protein_g_base": 2,
        "carbs_g_base": 10,
        "fat_g_base": 2,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Fresh Garlic, Lime Juice & Beef Bone Broth",
        "amount_imperial": "1 cup mix",
        "amount_metric": "240ml",
        "raw_weight_grams_base": 240,
        "calories_base": 80,
        "protein_g_base": 8,
        "carbs_g_base": 8,
        "fat_g_base": 1,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "In a blender, blend chipotles in adobo, garlic cloves, lime juice, apple cider vinegar, ground cumin, Mexican oregano, cloves, and beef broth until smooth.",
      "Place trimmed beef chuck roast in the slow cooker bowl; pour chipotle marinade over the top.",
      "Cover and cook on LOW for 8 hours (or HIGH for 4.5 hours) until meat falls apart at the touch of a fork.",
      "Shred beef directly in the slow cooker with two forks, tossing in the rich braising juices.",
      "Divide into 6 meal-prep containers for tacos, burrito bowls, or high-protein salads."
    ]
  },
  {
    "id": "slow-cooker-thai-coconut-green-curry-chicken",
    "title": "Slow-Cooker Thai Coconut Green Curry Chicken with Bamboo Shoots",
    "description": "Chicken breast pieces slow-simmered with Thai green curry paste, light coconut milk, bamboo shoots, red bell peppers, and fresh Thai basil for fragrant, comforting meal-prep.",
    "category": "bulk_meal_prep",
    "sub_category": "slow_cooker_instant_pot",
    "prep_time_minutes": 15,
    "cook_time_minutes": 240,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Thai Cuisine",
      "Meal-Prep",
      "Dairy-Free"
    ],
    "calories_per_serving": 360,
    "protein_g_per_serving": 40,
    "carbs_g_per_serving": 14,
    "fat_g_per_serving": 14,
    "icon_emoji": "🍛",
    "ingredients": [
      {
        "name": "Boneless Skinless Chicken Breast",
        "amount_imperial": "24 oz raw (1.5 lbs)",
        "amount_metric": "680g",
        "raw_weight_grams_base": 680,
        "calories_base": 720,
        "protein_g_base": 150,
        "carbs_g_base": 0,
        "fat_g_base": 12,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Light Coconut Milk",
        "amount_imperial": "1 can (13.5 fl oz)",
        "amount_metric": "400ml",
        "raw_weight_grams_base": 400,
        "calories_base": 280,
        "protein_g_base": 4,
        "carbs_g_base": 10,
        "fat_g_base": 24,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Thai Green Curry Paste & Fish Sauce",
        "amount_imperial": "3 tbsp mix",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 60,
        "protein_g_base": 2,
        "carbs_g_base": 8,
        "fat_g_base": 2,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Sliced Bamboo Shoots & Red Peppers",
        "amount_imperial": "3 cups mix",
        "amount_metric": "300g",
        "raw_weight_grams_base": 300,
        "calories_base": 120,
        "protein_g_base": 6,
        "carbs_g_base": 20,
        "fat_g_base": 1,
        "department": "produce",
        "food_category": "vegetables"
      }
    ],
    "instructions": [
      "Whisk green curry paste, light coconut milk, fish sauce, and lime juice in bottom of slow cooker.",
      "Add diced chicken breast, sliced red bell peppers, and drained bamboo shoots.",
      "Cover and cook on LOW for 4 hours until chicken is tender and flavors meld.",
      "Stir in fresh Thai basil leaves in the last 10 minutes of cooking.",
      "Divide into 4 meal-prep containers and serve alongside cauliflower rice or jasmine rice."
    ]
  },
  {
    "id": "instant-pot-crispy-carnitas-pork-shoulder",
    "title": "Instant Pot Citrus Garlic Crispy Carnitas with Warm Corn Tortillas",
    "description": "Lean pork shoulder pressure-cooked in fresh orange juice, lime, and garlic, then shredded and broiled under the oven broiler for authentic crispy caramelized carnitas edges.",
    "category": "bulk_meal_prep",
    "sub_category": "slow_cooker_instant_pot",
    "prep_time_minutes": 15,
    "cook_time_minutes": 45,
    "servings_yield": 6,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Instant Pot",
      "Mexican",
      "Meal-Prep Legend"
    ],
    "calories_per_serving": 390,
    "protein_g_per_serving": 44,
    "carbs_g_per_serving": 8,
    "fat_g_per_serving": 18,
    "icon_emoji": "🌮",
    "ingredients": [
      {
        "name": "Lean Pork Shoulder (Trimmed of Excess Fat)",
        "amount_imperial": "2.5 lbs (40 oz)",
        "amount_metric": "1130g",
        "raw_weight_grams_base": 1130,
        "calories_base": 1950,
        "protein_g_base": 250,
        "carbs_g_base": 0,
        "fat_g_base": 100,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Fresh Orange Juice & Lime Juice",
        "amount_imperial": "3/4 cup mix",
        "amount_metric": "180ml",
        "raw_weight_grams_base": 180,
        "calories_base": 80,
        "protein_g_base": 1,
        "carbs_g_base": 18,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "pantry_staple"
      },
      {
        "name": "Mexican Oregano, Cumin, Garlic & Bay Leaves",
        "amount_imperial": "2 tbsp spice mix",
        "amount_metric": "20g",
        "raw_weight_grams_base": 20,
        "calories_base": 30,
        "protein_g_base": 1,
        "carbs_g_base": 5,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Cut pork shoulder into 2-inch chunks; season with salt, pepper, cumin, and Mexican oregano.",
      "Add pork, fresh orange juice, lime juice, 6 crushed garlic cloves, and bay leaves to Instant Pot inner pot.",
      "Lock lid and pressure cook on HIGH for 40 minutes, followed by 15-minute natural pressure release.",
      "Transfer cooked pork chunks to a large baking sheet, shred with forks, and spoon 1/2 cup of cooking juices over top.",
      "Broil on HIGH for 4 to 5 minutes until carnitas edges are wonderfully crispy and caramelized; portion across 6 meals."
    ]
  },
  {
    "id": "buffalo-chicken-spaghetti-squash-casserole",
    "title": "Buffalo Chicken & Creamy Ranch Spaghetti Squash Bake with Cheddar",
    "description": "Tender roasted spaghetti squash strands tossed with shredded chicken breast, tangy Frank's RedHot buffalo sauce, light Greek yogurt ranch, and melted sharp cheddar.",
    "category": "bulk_meal_prep",
    "sub_category": "casseroles_bakes",
    "prep_time_minutes": 15,
    "cook_time_minutes": 30,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Low-Carb",
      "Casserole",
      "Meal-Prep Favorite"
    ],
    "calories_per_serving": 360,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 16,
    "fat_g_per_serving": 13,
    "icon_emoji": "🥧",
    "ingredients": [
      {
        "name": "Shredded Cooked Chicken Breast",
        "amount_imperial": "20 oz cooked (1.25 lbs)",
        "amount_metric": "560g",
        "raw_weight_grams_base": 560,
        "calories_base": 800,
        "protein_g_base": 144,
        "carbs_g_base": 0,
        "fat_g_base": 16,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Roasted Spaghetti Squash (Strands)",
        "amount_imperial": "6 cups cooked",
        "amount_metric": "600g",
        "raw_weight_grams_base": 600,
        "calories_base": 180,
        "protein_g_base": 4,
        "carbs_g_base": 40,
        "fat_g_base": 2,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Frank's RedHot Buffalo Wing Sauce",
        "amount_imperial": "1/2 cup (4 fl oz)",
        "amount_metric": "120ml",
        "raw_weight_grams_base": 120,
        "calories_base": 40,
        "protein_g_base": 0,
        "carbs_g_base": 2,
        "fat_g_base": 3,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Plain Non-Fat Greek Yogurt (Ranch Seasoned)",
        "amount_imperial": "3/4 cup (6 oz)",
        "amount_metric": "170g",
        "raw_weight_grams_base": 170,
        "calories_base": 100,
        "protein_g_base": 18,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Shredded Sharp Cheddar Cheese",
        "amount_imperial": "3/4 cup (3 oz)",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 300,
        "protein_g_base": 21,
        "carbs_g_base": 2,
        "fat_g_base": 24,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Preheat oven to 375°F (190°C) and lightly grease a 9x13-inch baking dish.",
      "In a large mixing bowl, whisk Greek yogurt, buffalo sauce, garlic powder, onion powder, and dried dill.",
      "Fold in roasted spaghetti squash strands, shredded chicken breast, and half the shredded cheddar cheese.",
      "Spread mixture into baking dish and top evenly with remaining cheddar cheese.",
      "Bake for 25 minutes until bubbling and golden on top; divide into 4 meal-prep containers."
    ]
  },
  {
    "id": "cheesy-broccoli-chicken-brown-rice-bake",
    "title": "Cheesy Roasted Broccoli & Chicken Brown Rice Casserole",
    "description": "Hearty cooked brown rice, diced grilled chicken breast, and tender roasted broccoli florets folded in a creamy Greek yogurt & sharp cheddar sauce, baked to bubbling perfection.",
    "category": "bulk_meal_prep",
    "sub_category": "casseroles_bakes",
    "prep_time_minutes": 15,
    "cook_time_minutes": 25,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Comfort Food",
      "Meal-Prep Classic",
      "Wholesome"
    ],
    "calories_per_serving": 420,
    "protein_g_per_serving": 44,
    "carbs_g_per_serving": 36,
    "fat_g_per_serving": 12,
    "icon_emoji": "🥦",
    "ingredients": [
      {
        "name": "Diced Cooked Chicken Breast",
        "amount_imperial": "20 oz cooked",
        "amount_metric": "560g",
        "raw_weight_grams_base": 560,
        "calories_base": 800,
        "protein_g_base": 144,
        "carbs_g_base": 0,
        "fat_g_base": 16,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Cooked Long-Grain Brown Rice",
        "amount_imperial": "3 cups cooked",
        "amount_metric": "450g",
        "raw_weight_grams_base": 450,
        "calories_base": 480,
        "protein_g_base": 10,
        "carbs_g_base": 102,
        "fat_g_base": 4,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Fresh Steamed Broccoli Florets",
        "amount_imperial": "4 cups florets",
        "amount_metric": "360g",
        "raw_weight_grams_base": 360,
        "calories_base": 120,
        "protein_g_base": 10,
        "carbs_g_base": 22,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Low-Fat Cottage Cheese (Blended)",
        "amount_imperial": "1 cup (8 oz)",
        "amount_metric": "225g",
        "raw_weight_grams_base": 225,
        "calories_base": 180,
        "protein_g_base": 26,
        "carbs_g_base": 8,
        "fat_g_base": 4,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Shredded Sharp Cheddar Cheese",
        "amount_imperial": "1/2 cup (2 oz)",
        "amount_metric": "56g",
        "raw_weight_grams_base": 56,
        "calories_base": 200,
        "protein_g_base": 14,
        "carbs_g_base": 1,
        "fat_g_base": 16,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "Blend cottage cheese with 1/4 cup chicken broth, garlic powder, onion powder, and Dijon mustard until silky smooth.",
      "In a large bowl, combine cooked brown rice, diced chicken breast, steamed broccoli florets, and blended cheese sauce.",
      "Transfer to a 9x13-inch baking casserole and top with shredded cheddar cheese.",
      "Bake at 375°F (190°C) for 22 to 25 minutes until golden and bubbling at edges.",
      "Divide into 4 meal-prep containers."
    ]
  },
  {
    "id": "southwest-black-bean-quinoa-enchilada-bake",
    "title": "Southwest Black Bean & Roasted Corn Enchilada Quinoa Bake",
    "description": "Fluffy quinoa tossed with black beans, roasted sweet corn, diced green chiles, red enchilada sauce, and melted Monterey Jack cheese for high-fiber plant-powered fuel.",
    "category": "bulk_meal_prep",
    "sub_category": "casseroles_bakes",
    "prep_time_minutes": 15,
    "cook_time_minutes": 25,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Fiber",
      "Plant-Based",
      "Vegetarian",
      "Meal-Prep"
    ],
    "calories_per_serving": 380,
    "protein_g_per_serving": 18,
    "carbs_g_per_serving": 58,
    "fat_g_per_serving": 10,
    "icon_emoji": "🥘",
    "ingredients": [
      {
        "name": "Organic Tri-Color Quinoa (Cooked)",
        "amount_imperial": "3 cups cooked",
        "amount_metric": "540g",
        "raw_weight_grams_base": 540,
        "calories_base": 660,
        "protein_g_base": 24,
        "carbs_g_base": 120,
        "fat_g_base": 10,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Canned Black Beans (Rinsed & Drained)",
        "amount_imperial": "1 can (15 oz / 1.5 cups)",
        "amount_metric": "250g",
        "raw_weight_grams_base": 250,
        "calories_base": 220,
        "protein_g_base": 14,
        "carbs_g_base": 40,
        "fat_g_base": 1,
        "department": "pantry_spices",
        "food_category": "protein"
      },
      {
        "name": "Roasted Sweet Corn & Diced Green Chiles",
        "amount_imperial": "1.5 cups mix",
        "amount_metric": "200g",
        "raw_weight_grams_base": 200,
        "calories_base": 160,
        "protein_g_base": 4,
        "carbs_g_base": 36,
        "fat_g_base": 2,
        "department": "frozen",
        "food_category": "carbohydrate"
      },
      {
        "name": "Red Enchilada Sauce (No-Sugar)",
        "amount_imperial": "1.5 cups (12 oz)",
        "amount_metric": "360g",
        "raw_weight_grams_base": 360,
        "calories_base": 120,
        "protein_g_base": 3,
        "carbs_g_base": 18,
        "fat_g_base": 3,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Shredded Monterey Jack Cheese",
        "amount_imperial": "3/4 cup (3 oz)",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 300,
        "protein_g_base": 21,
        "carbs_g_base": 1,
        "fat_g_base": 24,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      }
    ],
    "instructions": [
      "In a large bowl, mix cooked quinoa, rinsed black beans, roasted corn, diced green chiles, and red enchilada sauce.",
      "Transfer to an oven-safe 9x13-inch baking dish and smooth top with a spatula.",
      "Sprinkle shredded Monterey Jack cheese evenly across the casserole.",
      "Bake at 375°F (190°C) for 22 to 25 minutes until cheese is melted and bubbling.",
      "Garnish with chopped fresh cilantro and lime wedges; divide into 4 meal-prep containers."
    ]
  },
  {
    "id": "bulk-prep-herb-grilled-flank-steak",
    "title": "Bulk Meal-Prep Herb-Marinated Grilled Flank Steak with Sweet Potatoes",
    "description": "Lean flank steak marinated in garlic, rosemary, and balsamic vinegar, grilled to medium-rare, sliced against the grain, and paired with roasted cinnamon sweet potato wedges.",
    "category": "bulk_meal_prep",
    "sub_category": "prepped_proteins_sides",
    "prep_time_minutes": 15,
    "cook_time_minutes": 25,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Clean-Eating",
      "Macro-Prep",
      "Athlete Fuel"
    ],
    "calories_per_serving": 420,
    "protein_g_per_serving": 42,
    "carbs_g_per_serving": 30,
    "fat_g_per_serving": 14,
    "icon_emoji": "🍚",
    "ingredients": [
      {
        "name": "Lean Beef Flank Steak (Trimmed)",
        "amount_imperial": "24 oz raw (1.5 lbs)",
        "amount_metric": "680g",
        "raw_weight_grams_base": 680,
        "calories_base": 980,
        "protein_g_base": 136,
        "carbs_g_base": 0,
        "fat_g_base": 48,
        "department": "meat_seafood",
        "food_category": "protein"
      },
      {
        "name": "Sweet Potatoes (Cut into Wedges)",
        "amount_imperial": "3 medium (18 oz)",
        "amount_metric": "500g",
        "raw_weight_grams_base": 500,
        "calories_base": 450,
        "protein_g_base": 8,
        "carbs_g_base": 105,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Fresh Steamed Green Beans",
        "amount_imperial": "4 cups (1 lb)",
        "amount_metric": "450g",
        "raw_weight_grams_base": 450,
        "calories_base": 140,
        "protein_g_base": 8,
        "carbs_g_base": 30,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Balsamic Rosemary Marinade",
        "amount_imperial": "3 tbsp",
        "amount_metric": "45ml",
        "raw_weight_grams_base": 45,
        "calories_base": 110,
        "protein_g_base": 0,
        "carbs_g_base": 6,
        "fat_g_base": 9,
        "department": "healthy_fats",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "Marinate flank steak in balsamic vinegar, minced rosemary, garlic, and 1 tbsp olive oil for at least 30 minutes.",
      "Roast sweet potato wedges on a baking sheet at 400°F (205°C) for 25 minutes until tender and browned.",
      "Grill flank steak over high heat for 4 to 5 minutes per side until internal temperature reaches 130°F (54°C) for medium-rare.",
      "Rest steak on a cutting board for 10 minutes before slicing thinly against the grain.",
      "Distribute sliced steak, sweet potato wedges, and steamed green beans across 4 meal-prep containers."
    ]
  },
  {
    "id": "dark-chocolate-sea-salt-almond-protein-bars",
    "title": "Dark Chocolate Sea Salt Almond Butter Homemade Protein Bars",
    "description": "No-bake, chewy artisan protein bars crafted with raw almond butter, chocolate whey isolate, rolled oats, and organic honey, drizzled with 85% dark chocolate and coarse flaky sea salt.",
    "category": "snack_dessert",
    "sub_category": "protein_bites_bars",
    "prep_time_minutes": 10,
    "cook_time_minutes": 0,
    "servings_yield": 6,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "No-Bake",
      "Snack Prep",
      "Clean Energy"
    ],
    "calories_per_serving": 230,
    "protein_g_per_serving": 16,
    "carbs_g_per_serving": 20,
    "fat_g_per_serving": 10,
    "icon_emoji": "🍫",
    "ingredients": [
      {
        "name": "Creamy Raw Almond Butter",
        "amount_imperial": "1/2 cup (4.5 oz)",
        "amount_metric": "128g",
        "raw_weight_grams_base": 128,
        "calories_base": 780,
        "protein_g_base": 28,
        "carbs_g_base": 24,
        "fat_g_base": 70,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Chocolate Whey Protein Isolate",
        "amount_imperial": "2 scoops (2 oz)",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 240,
        "protein_g_base": 48,
        "carbs_g_base": 4,
        "fat_g_base": 2,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Rolled Old-Fashioned Oats",
        "amount_imperial": "1 cup (3 oz)",
        "amount_metric": "90g",
        "raw_weight_grams_base": 90,
        "calories_base": 340,
        "protein_g_base": 12,
        "carbs_g_base": 60,
        "fat_g_base": 6,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Raw Honey",
        "amount_imperial": "2 tbsp",
        "amount_metric": "40g",
        "raw_weight_grams_base": 40,
        "calories_base": 120,
        "protein_g_base": 0,
        "carbs_g_base": 34,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "carbohydrate"
      },
      {
        "name": "85% Dark Chocolate (Melted Drizzle)",
        "amount_imperial": "1 oz (2 squares)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 28,
        "calories_base": 160,
        "protein_g_base": 3,
        "carbs_g_base": 12,
        "fat_g_base": 13,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "In a large bowl, mix almond butter, honey, chocolate whey protein, and rolled oats until a thick dough forms.",
      "Press mixture firmly into an 8x8-inch parchment-lined pan in an even compact layer.",
      "Melt 85% dark chocolate in microwave for 45 seconds; drizzle over bars and finish with a sprinkle of flaky Maldon sea salt.",
      "Freeze for 20 minutes to set, then slice into 6 rectangular bars.",
      "Store refrigerated in an airtight container for up to 2 weeks."
    ]
  },
  {
    "id": "lemon-coconut-poppyseed-energy-bites",
    "title": "Lemon Coconut & Poppyseed Cashew Energy Bites",
    "description": "Refreshing, naturally sweet energy bites made with raw creamy cashew butter, Medjool dates, fresh lemon zest, organic poppyseeds, and vanilla protein, rolled in shredded coconut.",
    "category": "snack_dessert",
    "sub_category": "protein_bites_bars",
    "prep_time_minutes": 10,
    "cook_time_minutes": 0,
    "servings_yield": 6,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "No-Bake",
      "Pre-Workout Snack",
      "Plant-Powered"
    ],
    "calories_per_serving": 190,
    "protein_g_per_serving": 12,
    "carbs_g_per_serving": 20,
    "fat_g_per_serving": 8,
    "icon_emoji": "🍋",
    "ingredients": [
      {
        "name": "Raw Creamy Cashew Butter",
        "amount_imperial": "1/3 cup (3 oz)",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 480,
        "protein_g_base": 15,
        "carbs_g_base": 24,
        "fat_g_base": 38,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Vanilla Whey / Plant Protein Powder",
        "amount_imperial": "2 scoops (2 oz)",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 220,
        "protein_g_base": 48,
        "carbs_g_base": 4,
        "fat_g_base": 2,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Pitted Medjool Dates",
        "amount_imperial": "4 large dates",
        "amount_metric": "95g",
        "raw_weight_grams_base": 95,
        "calories_base": 260,
        "protein_g_base": 2,
        "carbs_g_base": 70,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Unsweetened Shredded Coconut & Poppyseeds",
        "amount_imperial": "3 tbsp mix",
        "amount_metric": "25g",
        "raw_weight_grams_base": 25,
        "calories_base": 140,
        "protein_g_base": 3,
        "carbs_g_base": 5,
        "fat_g_base": 12,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "In a food processor, pulse pitted dates, cashew butter, vanilla protein powder, 1 tbsp fresh lemon juice, and 2 tsp lemon zest until dough clumps together.",
      "Pulse in poppyseeds until evenly distributed.",
      "Roll dough into 12 even balls (2 balls per serving).",
      "Roll balls in unsweetened shredded coconut flakes to coat exterior.",
      "Refrigerate for 15 minutes to firm up."
    ]
  },
  {
    "id": "matcha-green-tea-vanilla-collagen-bites",
    "title": "Matcha Green Tea & Vanilla Collagen Energy Bites with Pistachios",
    "description": "Vibrant antioxidant-rich ceremonial matcha green tea and pasture-raised collagen peptides blended with raw almond flour, coconut nectar, and crushed roasted pistachios.",
    "category": "snack_dessert",
    "sub_category": "protein_bites_bars",
    "prep_time_minutes": 10,
    "cook_time_minutes": 0,
    "servings_yield": 4,
    "difficulty": "easy",
    "tags": [
      "High-Collagen",
      "Antioxidants",
      "No-Bake",
      "Clean Energy"
    ],
    "calories_per_serving": 180,
    "protein_g_per_serving": 15,
    "carbs_g_per_serving": 12,
    "fat_g_per_serving": 9,
    "icon_emoji": "🍵",
    "ingredients": [
      {
        "name": "Unflavored / Vanilla Collagen Peptides",
        "amount_imperial": "2 scoops (1.5 oz)",
        "amount_metric": "40g",
        "raw_weight_grams_base": 40,
        "calories_base": 140,
        "protein_g_base": 36,
        "carbs_g_base": 0,
        "fat_g_base": 0,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Blanched Almond Flour",
        "amount_imperial": "1/2 cup (2 oz)",
        "amount_metric": "56g",
        "raw_weight_grams_base": 56,
        "calories_base": 320,
        "protein_g_base": 12,
        "carbs_g_base": 10,
        "fat_g_base": 28,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Ceremonial Japanese Matcha Powder",
        "amount_imperial": "1 tbsp",
        "amount_metric": "6g",
        "raw_weight_grams_base": 6,
        "calories_base": 20,
        "protein_g_base": 1,
        "carbs_g_base": 3,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Pure Maple Syrup & Crushed Pistachios",
        "amount_imperial": "3 tbsp mix",
        "amount_metric": "35g",
        "raw_weight_grams_base": 35,
        "calories_base": 180,
        "protein_g_base": 3,
        "carbs_g_base": 24,
        "fat_g_base": 7,
        "department": "pantry_spices",
        "food_category": "carbohydrate"
      }
    ],
    "instructions": [
      "In a medium bowl, whisk almond flour, collagen peptides, and ceremonial matcha powder.",
      "Stir in maple syrup and 1 tbsp warm water to form a soft green dough.",
      "Roll dough into 8 balls (2 balls per serving).",
      "Roll each bite in finely crushed roasted pistachios.",
      "Chill in refrigerator for 20 minutes before serving."
    ]
  },
  {
    "id": "salted-caramel-pecan-protein-fudge",
    "title": "Salted Caramel & Roasted Pecan Whey Protein Fudge Squares",
    "description": "Decadent, melt-in-your-mouth salted caramel protein fudge made with creamy sunflower seed butter, vanilla whey isolate, sugar-free maple syrup, and chopped toasted pecans.",
    "category": "snack_dessert",
    "sub_category": "protein_bites_bars",
    "prep_time_minutes": 10,
    "cook_time_minutes": 0,
    "servings_yield": 6,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Keto-Friendly",
      "Guilt-Free Dessert",
      "Nut-Free Option"
    ],
    "calories_per_serving": 190,
    "protein_g_per_serving": 14,
    "carbs_g_per_serving": 6,
    "fat_g_per_serving": 13,
    "icon_emoji": "🍬",
    "ingredients": [
      {
        "name": "Sunflower Seed Butter or Almond Butter",
        "amount_imperial": "1/2 cup (4.5 oz)",
        "amount_metric": "128g",
        "raw_weight_grams_base": 128,
        "calories_base": 760,
        "protein_g_base": 24,
        "carbs_g_base": 24,
        "fat_g_base": 64,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Salted Caramel / Vanilla Whey Protein",
        "amount_imperial": "2 scoops (2 oz)",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 240,
        "protein_g_base": 48,
        "carbs_g_base": 4,
        "fat_g_base": 2,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Sugar-Free Maple Syrup or Monkfruit",
        "amount_imperial": "1/4 cup (2 fl oz)",
        "amount_metric": "60ml",
        "raw_weight_grams_base": 60,
        "calories_base": 20,
        "protein_g_base": 0,
        "carbs_g_base": 6,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Roasted Chopped Pecans",
        "amount_imperial": "1/4 cup (1 oz)",
        "amount_metric": "28g",
        "raw_weight_grams_base": 28,
        "calories_base": 190,
        "protein_g_base": 3,
        "carbs_g_base": 4,
        "fat_g_base": 20,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "Warm sunflower seed butter and syrup in microwave for 25 seconds until runny.",
      "Stir in protein powder vigorously until a thick fudge paste forms.",
      "Fold in chopped pecans.",
      "Press into a loaf pan lined with wax paper.",
      "Freeze for 30 minutes, slice into 6 fudge squares, and store in freezer."
    ]
  },
  {
    "id": "molten-chocolate-protein-lava-mug-cake",
    "title": "90-Second Molten Chocolate Protein Lava Mug Cake",
    "description": "Warm, fluffy single-serve dark chocolate protein sponge cake with an oozing liquid chocolate center, whipped up in just 90 seconds in the microwave.",
    "category": "snack_dessert",
    "sub_category": "sweet_treats",
    "prep_time_minutes": 3,
    "cook_time_minutes": 2,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Craving Crusher",
      "Late Night Treat",
      "Single-Serve"
    ],
    "calories_per_serving": 240,
    "protein_g_per_serving": 28,
    "carbs_g_per_serving": 18,
    "fat_g_per_serving": 6,
    "icon_emoji": "🧁",
    "ingredients": [
      {
        "name": "Chocolate Whey Protein Isolate",
        "amount_imperial": "1 scoop (1 oz)",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 120,
        "protein_g_base": 24,
        "carbs_g_base": 2,
        "fat_g_base": 1,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Oat Flour (Blended Rolled Oats)",
        "amount_imperial": "2 tbsp (0.5 oz)",
        "amount_metric": "15g",
        "raw_weight_grams_base": 15,
        "calories_base": 60,
        "protein_g_base": 2,
        "carbs_g_base": 10,
        "fat_g_base": 1,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Unsweetened Cocoa Powder & Baking Powder",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "8g",
        "raw_weight_grams_base": 8,
        "calories_base": 20,
        "protein_g_base": 1,
        "carbs_g_base": 3,
        "fat_g_base": 1,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Unsweetened Almond Milk",
        "amount_imperial": "1/4 cup (2 fl oz)",
        "amount_metric": "60ml",
        "raw_weight_grams_base": 60,
        "calories_base": 10,
        "protein_g_base": 0,
        "carbs_g_base": 0,
        "fat_g_base": 1,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Dark Chocolate Square (85%)",
        "amount_imperial": "1 square (0.4 oz)",
        "amount_metric": "12g",
        "raw_weight_grams_base": 12,
        "calories_base": 65,
        "protein_g_base": 1,
        "carbs_g_base": 4,
        "fat_g_base": 5,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "In an 8-oz microwave-safe coffee mug, whisk chocolate protein powder, oat flour, cocoa powder, 1/4 tsp baking powder, and a pinch of salt.",
      "Stir in almond milk and 1 tbsp water until a smooth cake batter forms.",
      "Press dark chocolate square right into the center of the batter.",
      "Microwave on high for 60 to 75 seconds until cake rises and top is just set.",
      "Enjoy warm with a spoon while the center is molten and gooey."
    ]
  },
  {
    "id": "whipped-cottage-cheese-dark-chocolate-mousse",
    "title": "High-Protein Whipped Cottage Cheese Dark Chocolate Silk Mousse",
    "description": "Silky-smooth, decadent chocolate mousse whipped in seconds with low-fat cottage cheese, rich dark cocoa, pure maple, and vanilla, topped with fresh raspberries.",
    "category": "snack_dessert",
    "sub_category": "sweet_treats",
    "prep_time_minutes": 5,
    "cook_time_minutes": 0,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "No-Cook",
      "Viral Recipe",
      "Creamy Dessert"
    ],
    "calories_per_serving": 210,
    "protein_g_per_serving": 22,
    "carbs_g_per_serving": 20,
    "fat_g_per_serving": 4,
    "icon_emoji": "🍨",
    "ingredients": [
      {
        "name": "Low-Fat Cottage Cheese (2%)",
        "amount_imperial": "1.5 cups (12 oz)",
        "amount_metric": "340g",
        "raw_weight_grams_base": 340,
        "calories_base": 270,
        "protein_g_base": 39,
        "carbs_g_base": 12,
        "fat_g_base": 6,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Dark Dutch-Processed Cocoa Powder",
        "amount_imperial": "3 tbsp (0.8 oz)",
        "amount_metric": "22g",
        "raw_weight_grams_base": 22,
        "calories_base": 60,
        "protein_g_base": 4,
        "carbs_g_base": 10,
        "fat_g_base": 3,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      },
      {
        "name": "Pure Maple Syrup & Vanilla Extract",
        "amount_imperial": "2 tbsp mix",
        "amount_metric": "30ml",
        "raw_weight_grams_base": 30,
        "calories_base": 80,
        "protein_g_base": 0,
        "carbs_g_base": 20,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "carbohydrate"
      },
      {
        "name": "Fresh Raspberries",
        "amount_imperial": "1/2 cup",
        "amount_metric": "60g",
        "raw_weight_grams_base": 60,
        "calories_base": 30,
        "protein_g_base": 1,
        "carbs_g_base": 7,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      }
    ],
    "instructions": [
      "Add cottage cheese, dark cocoa powder, maple syrup, and vanilla extract to food processor or high-powered blender.",
      "Blend on high speed for 60 to 90 seconds, scraping down sides once, until texture is ultra-glossy and completely silky with zero curds remaining.",
      "Spoon into two serving dessert glasses.",
      "Chill for 15 minutes in the freezer or 1 hour in fridge for a set mousse texture.",
      "Top with fresh tart raspberries and dark chocolate shavings before enjoying."
    ]
  },
  {
    "id": "raspberry-vanilla-chia-seed-parfait",
    "title": "Raspberry & Madagascar Vanilla Chia Seed Greek Yogurt Parfait",
    "description": "Layers of thick non-fat vanilla Greek yogurt, crushed fresh raspberry chia coulis, toasted hemp seeds, and sliced almonds for a nutrient-dense afternoon recharge.",
    "category": "snack_dessert",
    "sub_category": "sweet_treats",
    "prep_time_minutes": 5,
    "cook_time_minutes": 0,
    "servings_yield": 1,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "High-Fiber",
      "Antioxidants",
      "Pre-Workout"
    ],
    "calories_per_serving": 290,
    "protein_g_per_serving": 28,
    "carbs_g_per_serving": 26,
    "fat_g_per_serving": 9,
    "icon_emoji": "🍓",
    "ingredients": [
      {
        "name": "Plain Non-Fat Greek Yogurt",
        "amount_imperial": "1 cup (8 oz)",
        "amount_metric": "225g",
        "raw_weight_grams_base": 225,
        "calories_base": 130,
        "protein_g_base": 24,
        "carbs_g_base": 8,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Red Raspberries (Muddled)",
        "amount_imperial": "3/4 cup",
        "amount_metric": "90g",
        "raw_weight_grams_base": 90,
        "calories_base": 50,
        "protein_g_base": 1,
        "carbs_g_base": 11,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Black Chia Seeds",
        "amount_imperial": "1 tbsp",
        "amount_metric": "12g",
        "raw_weight_grams_base": 12,
        "calories_base": 55,
        "protein_g_base": 2,
        "carbs_g_base": 5,
        "fat_g_base": 3,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      },
      {
        "name": "Sliced Almonds (Toasted)",
        "amount_imperial": "1 tbsp",
        "amount_metric": "8g",
        "raw_weight_grams_base": 8,
        "calories_base": 50,
        "protein_g_base": 2,
        "carbs_g_base": 2,
        "fat_g_base": 4,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "In a small bowl, muddle fresh raspberries with chia seeds and 1 tsp lemon juice; let sit 3 minutes to thicken.",
      "In a tall glass or jar, spoon half of the Greek yogurt.",
      "Layer with raspberry chia coulis.",
      "Add remaining Greek yogurt and top with toasted sliced almonds."
    ]
  },
  {
    "id": "caramel-apple-protein-crisp-skillet",
    "title": "Warm Caramel Apple Cinnamon Protein Crisp with Toasted Oats",
    "description": "Tender warm cinnamon-spiced Honeycrisp apple slices baked under a golden crisp crumble of rolled oats, vanilla whey protein, cinnamon, and chopped walnuts.",
    "category": "snack_dessert",
    "sub_category": "sweet_treats",
    "prep_time_minutes": 10,
    "cook_time_minutes": 15,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Comfort Dessert",
      "Whole Food",
      "Autumn Flavors"
    ],
    "calories_per_serving": 270,
    "protein_g_per_serving": 18,
    "carbs_g_per_serving": 36,
    "fat_g_per_serving": 7,
    "icon_emoji": "🍏",
    "ingredients": [
      {
        "name": "Honeycrisp Apples (Thinly Sliced)",
        "amount_imperial": "2 medium apples",
        "amount_metric": "300g",
        "raw_weight_grams_base": 300,
        "calories_base": 160,
        "protein_g_base": 1,
        "carbs_g_base": 42,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "carbohydrate"
      },
      {
        "name": "Rolled Old-Fashioned Oats",
        "amount_imperial": "1/2 cup (1.5 oz)",
        "amount_metric": "45g",
        "raw_weight_grams_base": 45,
        "calories_base": 170,
        "protein_g_base": 6,
        "carbs_g_base": 30,
        "fat_g_base": 3,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      },
      {
        "name": "Vanilla Whey Protein Powder",
        "amount_imperial": "1 scoop (1 oz)",
        "amount_metric": "30g",
        "raw_weight_grams_base": 30,
        "calories_base": 110,
        "protein_g_base": 24,
        "carbs_g_base": 2,
        "fat_g_base": 1,
        "department": "supplements",
        "food_category": "protein"
      },
      {
        "name": "Chopped Raw Walnuts & Cinnamon",
        "amount_imperial": "2 tbsp mix",
        "amount_metric": "18g",
        "raw_weight_grams_base": 18,
        "calories_base": 110,
        "protein_g_base": 2,
        "carbs_g_base": 3,
        "fat_g_base": 10,
        "department": "pantry_spices",
        "food_category": "healthy_fat"
      }
    ],
    "instructions": [
      "Toss sliced apples with 1 tsp cinnamon, 1 tbsp water, and 1 tsp lemon juice in a small baking dish or cast-iron skillet.",
      "In a small bowl, combine rolled oats, vanilla whey protein, chopped walnuts, and 1 tbsp melted coconut oil or water until crumbly.",
      "Scatter oat protein crumble evenly over the apples.",
      "Bake at 375°F (190°C) for 15 to 18 minutes until apples are bubbly and oat topping is fragrant and golden.",
      "Serve warm straight from the skillet."
    ]
  },
  {
    "id": "smoked-paprika-garlic-roasted-edamame",
    "title": "Smoked Paprika & Roasted Garlic Crispy Edamame Pods",
    "description": "Whole green edamame pods tossed in avocado oil, smoked Spanish paprika, garlic powder, and coarse sea salt, air-fried until blistered and crispy for a satisfying high-protein crunch.",
    "category": "snack_dessert",
    "sub_category": "savory_crunch",
    "prep_time_minutes": 5,
    "cook_time_minutes": 10,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "High-Fiber",
      "Air-Fryer",
      "Plant-Based"
    ],
    "calories_per_serving": 160,
    "protein_g_per_serving": 14,
    "carbs_g_per_serving": 12,
    "fat_g_per_serving": 6,
    "icon_emoji": "🫛",
    "ingredients": [
      {
        "name": "Frozen Whole Green Edamame in Pods",
        "amount_imperial": "3 cups in pod (12 oz)",
        "amount_metric": "340g",
        "raw_weight_grams_base": 340,
        "calories_base": 240,
        "protein_g_base": 24,
        "carbs_g_base": 20,
        "fat_g_base": 8,
        "department": "frozen",
        "food_category": "protein"
      },
      {
        "name": "Avocado Oil Spray & Smoked Paprika",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "10ml",
        "raw_weight_grams_base": 10,
        "calories_base": 70,
        "protein_g_base": 0,
        "carbs_g_base": 2,
        "fat_g_base": 7,
        "department": "healthy_fats",
        "food_category": "healthy_fat"
      },
      {
        "name": "Garlic Powder & Coarse Flaky Sea Salt",
        "amount_imperial": "1 tsp mix",
        "amount_metric": "5g",
        "raw_weight_grams_base": 5,
        "calories_base": 10,
        "protein_g_base": 0,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "pantry_spices",
        "food_category": "pantry_staple"
      }
    ],
    "instructions": [
      "Thaw edamame pods and pat completely dry with paper towels.",
      "Toss pods with avocado oil, smoked paprika, garlic powder, and sea salt.",
      "Air fry at 400°F (205°C) for 9 to 11 minutes, shaking basket halfway through, until skins are blistered and crunchy.",
      "Transfer to a snack bowl and enjoy warm."
    ]
  },
  {
    "id": "whipped-feta-herb-crudite-dip-pita",
    "title": "Whipped Greek Feta & Fresh Dill Crudité Dip with Warm Pita Triangles",
    "description": "Tangy Greek feta cheese whipped fluffy with non-fat Greek yogurt, fresh dill, lemon zest, and roasted garlic, served with crisp cucumber spears, sweet baby bell peppers, and warm pita.",
    "category": "snack_dessert",
    "sub_category": "savory_crunch",
    "prep_time_minutes": 8,
    "cook_time_minutes": 0,
    "servings_yield": 2,
    "difficulty": "easy",
    "tags": [
      "High-Protein",
      "Mediterranean",
      "Vegetarian",
      "Dip & Crunch"
    ],
    "calories_per_serving": 230,
    "protein_g_per_serving": 16,
    "carbs_g_per_serving": 22,
    "fat_g_per_serving": 9,
    "icon_emoji": "🧆",
    "ingredients": [
      {
        "name": "Block Greek Feta Cheese",
        "amount_imperial": "3 oz (about 1/2 cup crumbled)",
        "amount_metric": "85g",
        "raw_weight_grams_base": 85,
        "calories_base": 220,
        "protein_g_base": 12,
        "carbs_g_base": 3,
        "fat_g_base": 18,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Plain Non-Fat Greek Yogurt",
        "amount_imperial": "1/2 cup (4 oz)",
        "amount_metric": "115g",
        "raw_weight_grams_base": 115,
        "calories_base": 70,
        "protein_g_base": 13,
        "carbs_g_base": 4,
        "fat_g_base": 0,
        "department": "dairy_eggs",
        "food_category": "dairy_eggs"
      },
      {
        "name": "Fresh Dill, Garlic & Lemon Zest",
        "amount_imperial": "1 tbsp mix",
        "amount_metric": "10g",
        "raw_weight_grams_base": 10,
        "calories_base": 10,
        "protein_g_base": 0,
        "carbs_g_base": 2,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "pantry_staple"
      },
      {
        "name": "Fresh Cucumber Spears & Mini Peppers",
        "amount_imperial": "2 cups mix",
        "amount_metric": "200g",
        "raw_weight_grams_base": 200,
        "calories_base": 50,
        "protein_g_base": 2,
        "carbs_g_base": 10,
        "fat_g_base": 0,
        "department": "produce",
        "food_category": "vegetables"
      },
      {
        "name": "Whole Wheat Pita (Toasted Triangles)",
        "amount_imperial": "1 pita round",
        "amount_metric": "50g",
        "raw_weight_grams_base": 50,
        "calories_base": 110,
        "protein_g_base": 5,
        "carbs_g_base": 23,
        "fat_g_base": 1,
        "department": "grains_bakery",
        "food_category": "carbohydrate"
      }
    ],
    "instructions": [
      "In a food processor, blend Greek feta, Greek yogurt, fresh dill, minced garlic, lemon juice, and 1 tsp olive oil until velvety and aerated.",
      "Spoon whipped feta dip into a shallow bowl; create a swirl on top with the back of a spoon and drizzle with olive oil.",
      "Toast whole wheat pita and cut into triangles.",
      "Serve dip surrounded by crunchy cucumber spears, sweet mini bell pepper halves, and warm pita triangles."
    ]
  }
];
