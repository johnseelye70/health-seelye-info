import {
  RecipeItem,
  RecipeIngredient,
  RecipeIngredientSwapOption,
  FoodCategory,
  FoodItem,
} from './types';
import { COMPREHENSIVE_FOOD_DATABASE } from './food-database';

// -------------------------------------------------------------
// Curated Authentic Culinary Swaps Catalog
// Every ingredient swap here is culinarily sound and functional!
// -------------------------------------------------------------
const SWAP_FAMILIES: {
  matchKeywords: string[];
  department: 'dairy_eggs' | 'meat_seafood' | 'produce' | 'grains_bakery' | 'healthy_fats' | 'pantry_spices' | 'supplements';
  foodCategory: FoodCategory;
  swaps: RecipeIngredientSwapOption[];
}[] = [
  // 1. Tomato & Sauce Bases (Authentic Culinary Substitutes Only)
  {
    matchKeywords: ['tomato', 'tomatoes', 'crushed tomatoes', 'salsa', 'marinara', 'sauce', 'puree', 'salsa verde'],
    department: 'pantry_spices',
    foodCategory: 'vegetables',
    swaps: [
      {
        name: 'San Marzano Whole Peeled Plum Tomatoes (Hand-Crushed)',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '240g',
        raw_weight_grams_base: 240,
        calories: 50,
        protein_g: 2,
        carbs_g: 10,
        fat_g: 0,
        tag: 'Sweet Italian Classic',
        reason: 'Low acid, naturally sweet Italian volcanic plum tomatoes',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Fire-Roasted Diced Tomatoes with Juices',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '240g',
        raw_weight_grams_base: 240,
        calories: 55,
        protein_g: 2,
        carbs_g: 11,
        fat_g: 0,
        tag: 'Smoky & Chunky',
        reason: 'Charred over open flame for deep wood-smoked flavor',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Roasted Tomatillo Salsa Verde',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '240g',
        raw_weight_grams_base: 240,
        calories: 60,
        protein_g: 1,
        carbs_g: 12,
        fat_g: 0.5,
        tag: 'Tangy Green Mexican Base',
        reason: 'Roasted Mexican green tomatillos with lime and cilantro',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Roasted Red Bell Pepper Purée (Nightshade-Light)',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '240g',
        raw_weight_grams_base: 240,
        calories: 65,
        protein_g: 2,
        carbs_g: 14,
        fat_g: 0.5,
        tag: 'Sweet & Acid-Free',
        reason: 'Silky purée of charred sweet peppers; great for low-acid diets',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'No-Sugar-Added Herb Marinara Sauce',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '240g',
        raw_weight_grams_base: 240,
        calories: 70,
        protein_g: 3,
        carbs_g: 12,
        fat_g: 1.5,
        tag: 'Herb & Garlic Simmered',
        reason: 'Slow-simmered with sweet basil, oregano, and extra virgin olive oil',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Fresh Vine-Ripened Campari Tomatoes (Diced)',
        amount_imperial: '1.5 cups diced',
        amount_metric: '220g',
        raw_weight_grams_base: 220,
        calories: 40,
        protein_g: 2,
        carbs_g: 8,
        fat_g: 0,
        tag: 'Fresh Burst Tomatoes',
        reason: 'Fresh sweet whole tomatoes that collapse into a light rustic sauce',
        culinary_action: 'stir_in_dairy',
      },
    ],
  },

  // 2. Alliums & Aromatics (Onions, Garlic, Shallots, Scallions)
  {
    matchKeywords: ['onion', 'onions', 'garlic', 'shallot', 'scallion', 'leek'],
    department: 'produce',
    foodCategory: 'vegetables',
    swaps: [
      {
        name: 'Diced Sweet Vidalia Onion',
        amount_imperial: '1/2 cup diced',
        amount_metric: '80g',
        raw_weight_grams_base: 80,
        calories: 30,
        protein_g: 1,
        carbs_g: 7,
        fat_g: 0,
        tag: 'Sweet & Mild',
        reason: 'Caramelizes gently without pungent sharpness',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Diced Red Onion',
        amount_imperial: '1/2 cup diced',
        amount_metric: '80g',
        raw_weight_grams_base: 80,
        calories: 32,
        protein_g: 1,
        carbs_g: 7,
        fat_g: 0,
        tag: 'Sharp & Vibrant',
        reason: 'Crisp, peppery bite with deep magenta color',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Minced French Shallots',
        amount_imperial: '1/3 cup minced',
        amount_metric: '50g',
        raw_weight_grams_base: 50,
        calories: 35,
        protein_g: 1,
        carbs_g: 8,
        fat_g: 0,
        tag: 'Gourmet French Allium',
        reason: 'Refined cross of mild onion and delicate garlic sweetness',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Sliced Green Scallions / Green Onions',
        amount_imperial: '1/2 cup sliced',
        amount_metric: '50g',
        raw_weight_grams_base: 50,
        calories: 16,
        protein_g: 1,
        carbs_g: 3.5,
        fat_g: 0,
        tag: 'Fresh & Crisp',
        reason: 'Fast cooking with light aromatic freshness',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Thinly Sliced Leeks (White & Light Green)',
        amount_imperial: '3/4 cup sliced',
        amount_metric: '75g',
        raw_weight_grams_base: 75,
        calories: 45,
        protein_g: 1,
        carbs_g: 11,
        fat_g: 0,
        tag: 'Buttery & Delicate',
        reason: 'Melts into velvety sweetness when braised in skillet',
        culinary_action: 'steam_veg',
      },
    ],
  },

  // 3. Milks & Liquid Dairy Alternatives
  {
    matchKeywords: ['milk', 'almond milk', 'oat milk', 'soy milk', 'fairlife', 'dairy milk'],
    department: 'dairy_eggs',
    foodCategory: 'dairy_eggs',
    swaps: [
      {
        name: 'Whole Milk (Vitamin D)',
        amount_imperial: '1 cup (8 fl oz)',
        amount_metric: '240 ml',
        raw_weight_grams_base: 244,
        calories: 150,
        protein_g: 8,
        carbs_g: 12,
        fat_g: 8,
        tag: 'Rich & Creamy',
        reason: 'Classic rich taste with natural dairy fats',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: '2% Reduced-Fat Milk',
        amount_imperial: '1 cup (8 fl oz)',
        amount_metric: '240 ml',
        raw_weight_grams_base: 244,
        calories: 120,
        protein_g: 8,
        carbs_g: 12,
        fat_g: 5,
        tag: 'Balanced Classic',
        reason: 'Standard balanced dairy milk',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Fairlife 2% Ultra-Filtered Milk',
        amount_imperial: '1 cup (8 fl oz)',
        amount_metric: '240 ml',
        raw_weight_grams_base: 240,
        calories: 120,
        protein_g: 13,
        carbs_g: 6,
        fat_g: 4.5,
        tag: 'High Protein / Low Sugar',
        reason: '+62% more protein with half the natural sugar',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Fairlife Fat-Free Skim Milk',
        amount_imperial: '1 cup (8 fl oz)',
        amount_metric: '240 ml',
        raw_weight_grams_base: 240,
        calories: 80,
        protein_g: 13,
        carbs_g: 6,
        fat_g: 0,
        tag: 'Max Protein / Zero Fat',
        reason: '13g protein with zero dietary fat',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Unsweetened Almond Milk',
        amount_imperial: '1 cup (8 fl oz)',
        amount_metric: '240 ml',
        raw_weight_grams_base: 240,
        calories: 30,
        protein_g: 1,
        carbs_g: 1,
        fat_g: 2.5,
        tag: 'Ultra-Low Calorie / Dairy-Free',
        reason: 'Lowest calorie plant milk option',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Unsweetened Oat Milk',
        amount_imperial: '1 cup (8 fl oz)',
        amount_metric: '240 ml',
        raw_weight_grams_base: 240,
        calories: 90,
        protein_g: 3,
        carbs_g: 16,
        fat_g: 1.5,
        tag: 'Creamy Plant-Based',
        reason: 'Naturally smooth and slightly sweet texture',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Unsweetened Organic Soy Milk',
        amount_imperial: '1 cup (8 fl oz)',
        amount_metric: '240 ml',
        raw_weight_grams_base: 240,
        calories: 80,
        protein_g: 7,
        carbs_g: 4,
        fat_g: 4,
        tag: 'Plant Protein Rich',
        reason: 'Complete plant protein profile',
        culinary_action: 'stir_in_dairy',
      },
    ],
  },

  // 4. Eggs & Cultured Dairy Swaps (Raw Eggs vs Yogurt vs Hard-Boiled vs Whites vs Tofu)
  {
    matchKeywords: ['egg', 'eggs', 'egg whites', 'liquid egg whites', 'greek yogurt', 'cottage cheese'],
    department: 'dairy_eggs',
    foodCategory: 'dairy_eggs',
    swaps: [
      {
        name: 'Large Whole Farm Eggs (Raw)',
        amount_imperial: '3 whole',
        amount_metric: '3 whole',
        raw_weight_grams_base: 150,
        calories: 210,
        protein_g: 18,
        carbs_g: 1,
        fat_g: 15,
        tag: 'Whole Farm Eggs',
        reason: 'Rich lutein, choline, and natural egg yolk fats',
        culinary_action: 'crack_and_whisk',
      },
      {
        name: 'Hard-Boiled Large Eggs (Sliced)',
        amount_imperial: '3 whole (cooked)',
        amount_metric: '3 whole',
        raw_weight_grams_base: 150,
        calories: 210,
        protein_g: 18,
        carbs_g: 1,
        fat_g: 15,
        tag: 'Pre-Cooked / Sliced',
        reason: 'Convenient chilled protein; slice and place directly on top',
        culinary_action: 'slice_hardboiled',
        cook_time_delta_minutes: -6,
      },
      {
        name: 'Low-Fat 2% Plain Greek Yogurt',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '227g',
        raw_weight_grams_base: 227,
        calories: 150,
        protein_g: 20,
        carbs_g: 8,
        fat_g: 4,
        tag: 'Creamy Probiotic Base',
        reason: 'Thick cultured dairy with 20g protein; fold in chilled or dollop on top',
        culinary_action: 'fold_in_chilled',
        cook_time_delta_minutes: -8,
      },
      {
        name: 'Low-Fat 2% Cottage Cheese',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '226g',
        raw_weight_grams_base: 226,
        calories: 180,
        protein_g: 26,
        carbs_g: 8,
        fat_g: 5,
        tag: 'Slow-Digesting Casein',
        reason: 'High casein protein for sustained fullness; fold in chilled or warm gently',
        culinary_action: 'fold_in_chilled',
        cook_time_delta_minutes: -6,
      },
      {
        name: 'Pure Liquid Egg Whites',
        amount_imperial: '3/4 cup (6 oz)',
        amount_metric: '180 ml',
        raw_weight_grams_base: 180,
        calories: 90,
        protein_g: 20,
        carbs_g: 1,
        fat_g: 0,
        tag: 'Zero-Fat Pure Protein',
        reason: '20g protein with 0g fat; whisk and scramble in pan',
        culinary_action: 'crack_and_whisk',
      },
      {
        name: 'Organic Firm Tofu Scramble',
        amount_imperial: '6 oz crumbled',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 150,
        protein_g: 18,
        carbs_g: 4,
        fat_g: 9,
        tag: '100% Plant-Based Scramble',
        reason: 'Crumble and scramble in skillet with turmeric and garlic',
        culinary_action: 'sear_tofu',
      },
    ],
  },

  // 5. Cheeses
  {
    matchKeywords: ['feta', 'goat cheese', 'cheddar', 'mozzarella', 'parmesan', 'cheese', 'provolone'],
    department: 'dairy_eggs',
    foodCategory: 'dairy_eggs',
    swaps: [
      {
        name: 'Crumbled Greek Feta Cheese',
        amount_imperial: '1 oz (2 tbsp)',
        amount_metric: '28g',
        raw_weight_grams_base: 28,
        calories: 75,
        protein_g: 4,
        carbs_g: 1,
        fat_g: 6,
        tag: 'Tangy Mediterranean',
        reason: 'Bold, salty Mediterranean tang',
        culinary_action: 'fold_in_chilled',
      },
      {
        name: 'Crumbled Fresh Goat Cheese (Chèvre)',
        amount_imperial: '1 oz (2 tbsp)',
        amount_metric: '28g',
        raw_weight_grams_base: 28,
        calories: 75,
        protein_g: 5,
        carbs_g: 0,
        fat_g: 6,
        tag: 'Creamy & Mild',
        reason: 'Easier to digest A2 goat milk protein',
        culinary_action: 'fold_in_chilled',
      },
      {
        name: 'Part-Skim Low-Moisture Mozzarella',
        amount_imperial: '1 oz (1/4 cup shredded)',
        amount_metric: '28g',
        raw_weight_grams_base: 28,
        calories: 70,
        protein_g: 7,
        carbs_g: 1,
        fat_g: 5,
        tag: 'Higher Protein / Melty',
        reason: 'Classic melting cheese with lower fat',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Reduced-Fat Sharp Cheddar',
        amount_imperial: '1 oz (1/4 cup shredded)',
        amount_metric: '28g',
        raw_weight_grams_base: 28,
        calories: 90,
        protein_g: 9,
        carbs_g: 1,
        fat_g: 6,
        tag: 'Sharp & Savory',
        reason: 'Punchy sharp cheddar flavor',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Grated Aged Parmigiano-Reggiano',
        amount_imperial: '2 tbsp (0.5 oz)',
        amount_metric: '15g',
        raw_weight_grams_base: 15,
        calories: 55,
        protein_g: 5,
        carbs_g: 0,
        fat_g: 4,
        tag: 'Intense Umami',
        reason: 'Low lactose, intense savory depth',
        culinary_action: 'stir_in_dairy',
      },
    ],
  },

  // 6. Poultry, Meats & Plant Proteins
  {
    matchKeywords: [
      'chicken breast',
      'chicken thigh',
      'turkey',
      'steak',
      'beef',
      'sirloin',
      'flank',
      'bison',
      'pork',
      'tofu',
      'tempeh',
      'salmon',
      'shrimp',
      'cod',
      'tuna',
      'mahi',
    ],
    department: 'meat_seafood',
    foodCategory: 'poultry_meat',
    swaps: [
      {
        name: 'Boneless Skinless Chicken Breast',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 220,
        protein_g: 46,
        carbs_g: 0,
        fat_g: 4,
        tag: 'Leanest Poultry',
        reason: 'Peak protein-to-calorie efficiency',
        culinary_action: 'sear_protein',
      },
      {
        name: 'Boneless Skinless Chicken Thighs',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 260,
        protein_g: 40,
        carbs_g: 0,
        fat_g: 11,
        tag: 'Juicier & More Flavor',
        reason: 'Higher moisture and succulent dark meat',
        culinary_action: 'sear_protein',
      },
      {
        name: 'Lean Ground Turkey Breast (93/7)',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 240,
        protein_g: 42,
        carbs_g: 0,
        fat_g: 8,
        tag: 'Lean Poultry Grind',
        reason: 'Versatile lean poultry',
        culinary_action: 'sear_protein',
      },
      {
        name: 'Lean Beef Flank Steak (Trimmed)',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 280,
        protein_g: 44,
        carbs_g: 0,
        fat_g: 12,
        tag: 'Iron & Zinc Rich',
        reason: 'High heme iron and creatine content',
        culinary_action: 'sear_protein',
      },
      {
        name: 'Top Sirloin Center-Cut Steak',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 290,
        protein_g: 46,
        carbs_g: 0,
        fat_g: 12,
        tag: 'Tender Lean Beef',
        reason: 'Naturally tender prime lean cut',
        culinary_action: 'sear_protein',
      },
      {
        name: 'Lean Ground Bison (90/10)',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 260,
        protein_g: 44,
        carbs_g: 0,
        fat_g: 9,
        tag: 'Grass-Fed Game Meat',
        reason: 'Naturally nutrient-dense and lean',
        culinary_action: 'sear_protein',
      },
      {
        name: 'Wild Atlantic Salmon Filet',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 280,
        protein_g: 40,
        carbs_g: 0,
        fat_g: 14,
        tag: 'Omega-3 Superfood',
        reason: 'Over 2,000mg of anti-inflammatory EPA/DHA',
        culinary_action: 'sear_protein',
      },
      {
        name: 'Jumbo Gulf Shrimp (Peeled)',
        amount_imperial: '6 oz (8-10 count)',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 170,
        protein_g: 38,
        carbs_g: 1,
        fat_g: 2,
        tag: 'Ultra-Lean Seafood',
        reason: 'Almost pure protein with virtually 0g fat; cooks in 4 min',
        culinary_action: 'sear_protein',
        cook_time_delta_minutes: -4,
      },
      {
        name: 'Organic Extra Firm Tofu (Pressed)',
        amount_imperial: '6 oz cubed',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 150,
        protein_g: 18,
        carbs_g: 4,
        fat_g: 9,
        tag: '100% Plant-Based',
        reason: 'Press dry, cube, and sear crispy in skillet',
        culinary_action: 'sear_tofu',
      },
      {
        name: 'Organic Black Beans / Chickpeas (Canned)',
        amount_imperial: '1 cup (8 oz rinsed)',
        amount_metric: '220g',
        raw_weight_grams_base: 220,
        calories: 220,
        protein_g: 14,
        carbs_g: 38,
        fat_g: 1,
        tag: 'Plant Legumes',
        reason: 'Rinse, drain, and warm in pan for 3 minutes',
        culinary_action: 'warm_beans',
        cook_time_delta_minutes: -6,
      },
    ],
  },

  // 7. Crisp Green Stalks & Cruciferous Side Vegetables
  {
    matchKeywords: ['asparagus', 'green beans', 'broccoli', 'zucchini', 'squash', 'cauliflower', 'mushrooms', 'snap peas', 'haricots'],
    department: 'produce',
    foodCategory: 'vegetables',
    swaps: [
      {
        name: 'Fresh Asparagus Spears',
        amount_imperial: '1.5 cups (6 oz)',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 35,
        protein_g: 4,
        carbs_g: 7,
        fat_g: 0,
        tag: 'Natural Diuretic & Crisp',
        reason: 'Rich in glutathione and folate; char in skillet for 4 min',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Fresh Haricots Verts / Green Beans',
        amount_imperial: '1.5 cups (5.5 oz)',
        amount_metric: '150g',
        raw_weight_grams_base: 150,
        calories: 45,
        protein_g: 3,
        carbs_g: 10,
        fat_g: 0,
        tag: 'Tender & Sweet',
        reason: 'Crisp snap with high dietary fiber; steam/sauté 4 min',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Fresh Broccoli Florets',
        amount_imperial: '1.5 cups (5 oz)',
        amount_metric: '140g',
        raw_weight_grams_base: 140,
        calories: 45,
        protein_g: 4,
        carbs_g: 9,
        fat_g: 0,
        tag: 'Cruciferous Antioxidant',
        reason: 'Sulforaphane antioxidant powerhouse; steam or roast 4-5 min',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Zucchini & Yellow Summer Squash',
        amount_imperial: '1.5 cups (6.5 oz)',
        amount_metric: '180g',
        raw_weight_grams_base: 180,
        calories: 30,
        protein_g: 2,
        carbs_g: 6,
        fat_g: 0,
        tag: 'Ultra-Hydrating / Low-Carb',
        reason: 'Quick cooking with high potassium; sauté 3 min',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Sliced Cremini / Baby Bella Mushrooms',
        amount_imperial: '1.5 cups (4.5 oz)',
        amount_metric: '130g',
        raw_weight_grams_base: 130,
        calories: 30,
        protein_g: 4,
        carbs_g: 4,
        fat_g: 0,
        tag: 'Savory Umami',
        reason: 'Sauté until deeply golden and caramelized',
        culinary_action: 'steam_veg',
      },
      {
        name: 'Cauliflower Florets',
        amount_imperial: '1.5 cups (5 oz)',
        amount_metric: '140g',
        raw_weight_grams_base: 140,
        calories: 35,
        protein_g: 3,
        carbs_g: 7,
        fat_g: 0,
        tag: 'Low-Carb Cruciferous',
        reason: 'Roasts crispy with nutty flavor',
        culinary_action: 'steam_veg',
      },
    ],
  },

  // 8. Leafy Salad & Wilted Greens
  {
    matchKeywords: ['spinach', 'kale', 'arugula', 'romaine', 'lettuce', 'greens', 'chard'],
    department: 'produce',
    foodCategory: 'vegetables',
    swaps: [
      {
        name: 'Baby Leaf Spinach',
        amount_imperial: '2 cups (3 oz)',
        amount_metric: '85g',
        raw_weight_grams_base: 85,
        calories: 20,
        protein_g: 3,
        carbs_g: 3,
        fat_g: 0,
        tag: 'Iron & Nitrate Boost',
        reason: 'Wilts into warm skillet in just 60 seconds',
        culinary_action: 'wilt_greens',
        cook_time_delta_minutes: -3,
      },
      {
        name: 'Wild Baby Arugula',
        amount_imperial: '2 cups (3 oz)',
        amount_metric: '85g',
        raw_weight_grams_base: 85,
        calories: 22,
        protein_g: 2.5,
        carbs_g: 3,
        fat_g: 0,
        tag: 'Peppery Gourmet Green',
        reason: 'Crisp peppery bite; great fresh or tossed at the end',
        culinary_action: 'wilt_greens',
      },
      {
        name: 'Crisp Romaine Hearts',
        amount_imperial: '2.5 cups chopped',
        amount_metric: '100g',
        raw_weight_grams_base: 100,
        calories: 20,
        protein_g: 2,
        carbs_g: 3.5,
        fat_g: 0,
        tag: 'Crunchy Salad Base',
        reason: 'High water content and satisfying crunch',
        culinary_action: 'wilt_greens',
      },
      {
        name: 'Tuscan Lacinato Kale (Chopped)',
        amount_imperial: '2 cups chopped',
        amount_metric: '90g',
        raw_weight_grams_base: 90,
        calories: 35,
        protein_g: 3,
        carbs_g: 6,
        fat_g: 0,
        tag: 'Hearty Super-Green',
        reason: 'Robust texture; massage with olive oil or sauté 3 min',
        culinary_action: 'wilt_greens',
      },
    ],
  },

  // 9. Grains, Starches & Complex Carbs
  {
    matchKeywords: ['rice', 'quinoa', 'sweet potato', 'potato', 'pasta', 'penne', 'oats', 'tortilla', 'bread'],
    department: 'grains_bakery',
    foodCategory: 'grains_carbs',
    swaps: [
      {
        name: 'Steamed Fragrant Jasmine Rice',
        amount_imperial: '3/4 cup cooked (4.5 oz)',
        amount_metric: '130g',
        raw_weight_grams_base: 130,
        calories: 160,
        protein_g: 3,
        carbs_g: 36,
        fat_g: 0,
        tag: 'Fast-Digesting Clean Fuel',
        reason: 'Effortless digestion around workouts',
        culinary_action: 'saute_riced_veg',
      },
      {
        name: 'Long-Grain Brown Rice',
        amount_imperial: '3/4 cup cooked (5 oz)',
        amount_metric: '140g',
        raw_weight_grams_base: 140,
        calories: 155,
        protein_g: 4,
        carbs_g: 33,
        fat_g: 1,
        tag: 'High-Fiber Whole Grain',
        reason: 'Sustained energy and intact bran layer',
        culinary_action: 'saute_riced_veg',
      },
      {
        name: 'Fluffy Cooked Tri-Color Quinoa',
        amount_imperial: '3/4 cup cooked (5 oz)',
        amount_metric: '140g',
        raw_weight_grams_base: 140,
        calories: 170,
        protein_g: 6,
        carbs_g: 30,
        fat_g: 3,
        tag: 'Complete Plant Protein',
        reason: 'All 9 essential amino acids with fiber',
        culinary_action: 'saute_riced_veg',
      },
      {
        name: 'Roasted Sweet Potato Cubes',
        amount_imperial: '1 cup (5 oz)',
        amount_metric: '140g',
        raw_weight_grams_base: 140,
        calories: 130,
        protein_g: 2,
        carbs_g: 30,
        fat_g: 0,
        tag: 'Vitamin A & Potassium',
        reason: 'Natural sweetness and low glycemic index',
        culinary_action: 'roast_potatoes',
      },
      {
        name: 'Crispy Baby Red Potatoes',
        amount_imperial: '1 cup (5 oz)',
        amount_metric: '140g',
        raw_weight_grams_base: 140,
        calories: 140,
        protein_g: 3,
        carbs_g: 32,
        fat_g: 0,
        tag: 'Electrolyte & Satiety Leader',
        reason: 'Highest ranked food on the Satiety Index',
        culinary_action: 'roast_potatoes',
      },
      {
        name: 'Banza Chickpea Protein Penne',
        amount_imperial: '2 oz dry (1 cup cooked)',
        amount_metric: '56g',
        raw_weight_grams_base: 56,
        calories: 190,
        protein_g: 14,
        carbs_g: 32,
        fat_g: 3,
        tag: 'High-Protein / Gluten-Free',
        reason: '+2x protein and +4x fiber of wheat pasta; boil 8 min',
        culinary_action: 'saute_riced_veg',
      },
      {
        name: 'Riced Cauliflower (Sautéed)',
        amount_imperial: '1.5 cups (6 oz)',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 35,
        protein_g: 3,
        carbs_g: 6,
        fat_g: 0,
        tag: 'Keto / Low-Carb Swap',
        reason: 'Sauté in skillet for 3 min (saves 12 min cook time)',
        culinary_action: 'saute_riced_veg',
        cook_time_delta_minutes: -10,
      },
    ],
  },

  // 10. Cooking Fats & Oils
  {
    matchKeywords: ['olive oil', 'avocado oil', 'butter', 'ghee', 'oil spray', 'oil'],
    department: 'healthy_fats',
    foodCategory: 'nuts_fats_oils',
    swaps: [
      {
        name: 'Extra Virgin Olive Oil (Cold-Pressed)',
        amount_imperial: '1 tablespoon',
        amount_metric: '15 ml',
        raw_weight_grams_base: 14,
        calories: 120,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 14,
        tag: 'Polyphenol Rich',
        reason: 'Heart-healthy oleic acid antioxidant profile',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Pure Avocado Oil (High-Heat)',
        amount_imperial: '1 tablespoon',
        amount_metric: '15 ml',
        raw_weight_grams_base: 14,
        calories: 120,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 14,
        tag: 'High Smoke Point (500°F)',
        reason: 'Ideal for searing, roasting, and air-frying',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Pure Grass-Fed Ghee (Clarified Butter)',
        amount_imperial: '1 tablespoon',
        amount_metric: '15 ml',
        raw_weight_grams_base: 14,
        calories: 120,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 14,
        tag: 'Lactose-Free Rich Flavor',
        reason: 'Rich nutty butter flavor with zero lactose/casein',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Grass-Fed Sweet Cream Butter',
        amount_imperial: '1 tablespoon',
        amount_metric: '14g',
        raw_weight_grams_base: 14,
        calories: 100,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 11,
        tag: 'Classic Creamy Finish',
        reason: 'Classic rich culinary sauce binder',
        culinary_action: 'stir_in_dairy',
      },
      {
        name: 'Olive Oil Cooking Spray (3-Sec Spritz)',
        amount_imperial: '3 short sprays',
        amount_metric: '1g',
        raw_weight_grams_base: 1,
        calories: 8,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 1,
        tag: 'Zero-Calorie Saver',
        reason: 'Saves 110+ calories per meal',
        culinary_action: 'stir_in_dairy',
      },
    ],
  },
];

// -------------------------------------------------------------
// Engine Functions
// -------------------------------------------------------------

/**
 * Returns smart curated swaps for a specific ingredient, matching keywords.
 */
export function getSmartSwapsForIngredient(ingredient: RecipeIngredient): RecipeIngredientSwapOption[] {
  const ingNameLower = ingredient.name.toLowerCase();

  // 1. If the ingredient has explicit recommended swaps, return them
  if (ingredient.recommended_swaps && ingredient.recommended_swaps.length > 0) {
    return ingredient.recommended_swaps;
  }

  // 2. Find matching culinary family
  for (const family of SWAP_FAMILIES) {
    const isMatch = family.matchKeywords.some((kw) => ingNameLower.includes(kw));
    if (isMatch) {
      // Filter out the exact same item
      return family.swaps.filter((s) => s.name.toLowerCase() !== ingNameLower);
    }
  }

  // 3. Fallback: Search from COMPREHENSIVE_FOOD_DATABASE based on department / category
  return [];
}

/**
 * Context-Aware Culinary Step Synthesizer
 * Dynamically rewrites recipe instructions, verbs, cooking techniques, and timings
 * based on active ingredient swaps!
 */
export function adaptRecipeInstructionsAndTimings(
  recipe: RecipeItem,
  activeSwaps: Record<number, RecipeIngredientSwapOption>
): {
  adaptedInstructions: string[];
  adjustedPrepMinutes: number;
  adjustedCookMinutes: number;
  adaptedChefNotes: string;
  adaptedStepsIndices: number[];
} {
  let adjustedCookMinutes = recipe.cook_time_minutes;
  let adjustedPrepMinutes = recipe.prep_time_minutes;
  const adaptedStepsIndices: number[] = [];
  const swapTips: string[] = [];

  const instructions = [...recipe.instructions];

  // Process each swapped ingredient
  recipe.ingredients.forEach((origIng, idx) => {
    const swap = activeSwaps[idx];
    if (!swap) return;

    if (swap.cook_time_delta_minutes) {
      adjustedCookMinutes = Math.max(2, adjustedCookMinutes + swap.cook_time_delta_minutes);
    }

    const origNameLower = origIng.name.toLowerCase();
    const swapNameLower = swap.name.toLowerCase();

    // 1. Egg Swaps (Raw Eggs -> Greek Yogurt / Cottage Cheese / Hard-Boiled / Tofu)
    if (origNameLower.includes('egg') || origNameLower.includes('whites')) {
      if (swapNameLower.includes('yogurt') || swapNameLower.includes('cottage cheese')) {
        swapTips.push(`Since you swapped for ${swap.name}, no stove egg-scrambling is required; fold or dollop chilled yogurt directly on top or whisk in as a creamy sauce.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('crack') || stepLower.includes('scramble') || stepLower.includes('poach') || stepLower.includes('wells in the sauce')) {
            instructions[sIdx] = `Instead of cracking eggs, gently fold in ${swap.name} (or dollop chilled ${swap.name} on top) as a rich, creamy protein base.`;
            adaptedStepsIndices.push(sIdx);
          } else if (stepLower.includes('blend') && stepLower.includes('eggs')) {
            instructions[sIdx] = step.replace(/eggs/gi, swap.name);
            adaptedStepsIndices.push(sIdx);
          }
        });
      } else if (swapNameLower.includes('hard-boiled') || swapNameLower.includes('boiled egg')) {
        swapTips.push(`Since you swapped for sliced hard-boiled eggs, simply arrange the sliced rounds across the dish right before serving.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('crack') || stepLower.includes('scramble') || stepLower.includes('poach') || stepLower.includes('wells in the sauce')) {
            instructions[sIdx] = `Peel and slice the hard-boiled eggs into rounds, then gently arrange on top of the warm dish right before serving.`;
            adaptedStepsIndices.push(sIdx);
          }
        });
      } else if (swapNameLower.includes('tofu')) {
        swapTips.push(`For tofu scramble, crumble the firm tofu with a pinch of turmeric and garlic powder to mimic scrambled eggs.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('crack') || stepLower.includes('scramble') || stepLower.includes('whisk whole egg')) {
            instructions[sIdx] = `Crumble the pressed firm tofu into the skillet and sauté over medium heat with spices for 4-5 minutes until warm and fragrant.`;
            adaptedStepsIndices.push(sIdx);
          }
        });
      }
    }

    // 2. Poultry & Meat Swaps (Chicken/Steak -> Tofu / Beans / Shrimp / Salmon)
    if (origNameLower.includes('chicken') || origNameLower.includes('steak') || origNameLower.includes('beef') || origNameLower.includes('turkey')) {
      if (swapNameLower.includes('tofu')) {
        swapTips.push(`Press tofu dry with paper towels and cube into 1/2-inch bites before searing to achieve crispy edges.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('sear') || stepLower.includes('brown') || stepLower.includes('165°f') || stepLower.includes('internal temp')) {
            instructions[sIdx] = `Press extra-firm tofu dry, cube into 1/2-inch pieces, and pan-sear in olive oil for 5-6 minutes until golden brown and crispy on all sides.`;
            adaptedStepsIndices.push(sIdx);
          }
        });
      } else if (swapNameLower.includes('beans') || swapNameLower.includes('chickpea') || swapNameLower.includes('lentil')) {
        swapTips.push(`Canned legumes are pre-cooked; simply rinse, drain, and warm through in the skillet for 2-3 minutes.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('sear') || stepLower.includes('brown') || stepLower.includes('165°f') || stepLower.includes('internal temp')) {
            instructions[sIdx] = `Rinse and drain the ${swap.name}, then add to the warm skillet and simmer with spices for 2-3 minutes until heated through.`;
            adaptedStepsIndices.push(sIdx);
          }
        });
      } else if (swapNameLower.includes('shrimp')) {
        swapTips.push(`Jumbo shrimp cook fast—sear for just 2-3 minutes per side until pink and curled.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('chicken') || stepLower.includes('steak') || stepLower.includes('turkey')) {
            instructions[sIdx] = step.replace(/chicken|steak|beef|turkey/gi, 'shrimp')
              .replace(/6-8 minutes per side|8-10 minutes/gi, '2-3 minutes per side')
              .replace(/165°F/gi, 'opaque and curled');
            adaptedStepsIndices.push(sIdx);
          }
        });
      } else if (swapNameLower.includes('salmon')) {
        swapTips.push(`Wild salmon cooks best skin-side down for 4 minutes to crisp the skin, then flipped for 3 minutes.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('chicken') || stepLower.includes('steak') || stepLower.includes('turkey')) {
            instructions[sIdx] = step.replace(/chicken|steak|beef|turkey/gi, 'salmon filet')
              .replace(/165°F/gi, '125°F (medium/flaky)');
            adaptedStepsIndices.push(sIdx);
          }
        });
      } else {
        // Direct meat-to-meat name replacement
        instructions.forEach((step, sIdx) => {
          const regex = new RegExp(origIng.name.split(' ')[0], 'gi');
          if (regex.test(step)) {
            instructions[sIdx] = step.replace(regex, swap.name.split(' ')[0]);
            adaptedStepsIndices.push(sIdx);
          }
        });
      }
    }

    // 3. Grains & Starches (Rice -> Riced Cauliflower / Quinoa / Sweet Potatoes / Penne)
    if (origNameLower.includes('rice') || origNameLower.includes('quinoa') || origNameLower.includes('pasta') || origNameLower.includes('potato')) {
      if (swapNameLower.includes('cauliflower')) {
        swapTips.push(`Riced cauliflower cooks in only 3 minutes in a hot skillet—do not boil.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('steam') && stepLower.includes('rice') || stepLower.includes('boil') && stepLower.includes('rice') || stepLower.includes('jasmine rice') || stepLower.includes('brown rice')) {
            instructions[sIdx] = `Sauté riced cauliflower in the skillet with olive oil spray for 3-4 minutes until tender-crisp.`;
            adaptedStepsIndices.push(sIdx);
          }
        });
      } else if (swapNameLower.includes('potato') && !origNameLower.includes('potato')) {
        swapTips.push(`Roast or air-fry cubed potatoes at 400°F for 18 minutes (or microwave for 4 minutes) until tender.`);
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('rice') || stepLower.includes('quinoa')) {
            instructions[sIdx] = `Roast or air-fry cubed ${swap.name} at 400°F for 18 minutes until fork-tender and golden.`;
            adaptedStepsIndices.push(sIdx);
          }
        });
      } else if (swapNameLower.includes('penne') || swapNameLower.includes('pasta')) {
        instructions.forEach((step, sIdx) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes('rice') || stepLower.includes('quinoa')) {
            instructions[sIdx] = `Boil chickpea protein penne in salted water for 7-8 minutes until al dente; drain and serve at base.`;
            adaptedStepsIndices.push(sIdx);
          }
        });
      }
    }

    // 4. Vegetable Swaps (Asparagus ↔ Green Beans ↔ Broccoli ↔ Zucchini ↔ Mushrooms)
    if (
      origNameLower.includes('asparagus') ||
      origNameLower.includes('green beans') ||
      origNameLower.includes('broccoli') ||
      origNameLower.includes('zucchini') ||
      origNameLower.includes('spinach') ||
      origNameLower.includes('peppers')
    ) {
      instructions.forEach((step, sIdx) => {
        const stepLower = step.toLowerCase();
        // Replace vegetable keyword in step
        ['asparagus', 'green beans', 'broccoli', 'zucchini', 'spinach', 'peppers', 'squash'].forEach((vegWord) => {
          if (origNameLower.includes(vegWord) && stepLower.includes(vegWord)) {
            const shortSwapName = swap.name.replace(/Fresh |Steamed |Charred |Sautéed |Baby Leaf /gi, '');
            if (swapNameLower.includes('spinach')) {
              instructions[sIdx] = step.replace(new RegExp(vegWord, 'gi'), `${shortSwapName} (fold in at the end to wilt in 60 seconds)`);
            } else {
              instructions[sIdx] = step.replace(new RegExp(vegWord, 'gi'), shortSwapName);
            }
            adaptedStepsIndices.push(sIdx);
          }
        });
      });
    }

    // 5. Tomato & Sauce Base Swaps
    if (origNameLower.includes('tomato') || origNameLower.includes('salsa') || origNameLower.includes('marinara')) {
      instructions.forEach((step, sIdx) => {
        const stepLower = step.toLowerCase();
        if (stepLower.includes('tomato') || stepLower.includes('salsa') || stepLower.includes('marinara') || stepLower.includes('sauce')) {
          const shortSwap = swap.name.replace(/Hand-Crushed|with Juices/gi, '').trim();
          instructions[sIdx] = step.replace(/crushed tomatoes|canned tomatoes|tomato sauce|salsa verde|salsa/gi, shortSwap);
          adaptedStepsIndices.push(sIdx);
        }
      });
    }

    // 6. Milk & Liquid Dairy Swaps
    if (origNameLower.includes('milk')) {
      instructions.forEach((step, sIdx) => {
        if (step.toLowerCase().includes('milk')) {
          instructions[sIdx] = step.replace(/milk/gi, swap.name);
          adaptedStepsIndices.push(sIdx);
        }
      });
    }
  });

  // Dynamic Chef Notes
  let adaptedChefNotes = recipe.chef_notes || '';
  if (swapTips.length > 0) {
    adaptedChefNotes = `✨ Culinary Customization Tip: ${swapTips.join(' • ')} ${recipe.chef_notes ? `(${recipe.chef_notes})` : ''}`;
  }

  return {
    adaptedInstructions: instructions,
    adjustedPrepMinutes,
    adjustedCookMinutes,
    adaptedChefNotes,
    adaptedStepsIndices: Array.from(new Set(adaptedStepsIndices)),
  };
}

/**
 * Calculates customized recipe data, exact recalculated macros, and dynamically adapted cooking instructions
 */
export function calculateCustomizedRecipe(
  recipe: RecipeItem,
  activeSwaps: Record<number, RecipeIngredientSwapOption>,
  batchMultiplier: number = 1
): RecipeItem & {
  hasSwaps: boolean;
  swapCount: number;
  macroDeltas: { calories: number; protein: number; carbs: number; fat: number };
  adaptedStepsIndices: number[];
} {
  let deltaCals = 0;
  let deltaProt = 0;
  let deltaCarbs = 0;
  let deltaFat = 0;
  let swapCount = 0;

  const customizedIngredients: RecipeIngredient[] = recipe.ingredients.map((ing, idx) => {
    const swap = activeSwaps[idx];
    if (swap) {
      swapCount++;
      // Base macros of the original ingredient (estimate if base not provided)
      const origCals = ing.calories_base ?? (recipe.calories_per_serving / Math.max(1, recipe.ingredients.length));
      const origProt = ing.protein_g_base ?? (recipe.protein_g_per_serving / Math.max(1, recipe.ingredients.length));
      const origCarbs = ing.carbs_g_base ?? (recipe.carbs_g_per_serving / Math.max(1, recipe.ingredients.length));
      const origFat = ing.fat_g_base ?? (recipe.fat_g_per_serving / Math.max(1, recipe.ingredients.length));

      deltaCals += (swap.calories - origCals);
      deltaProt += (swap.protein_g - origProt);
      deltaCarbs += (swap.carbs_g - origCarbs);
      deltaFat += (swap.fat_g - origFat);

      return {
        ...ing,
        name: swap.name,
        amount_imperial: swap.amount_imperial,
        amount_metric: swap.amount_metric,
        raw_weight_grams_base: swap.raw_weight_grams_base,
        calories_base: swap.calories,
        protein_g_base: swap.protein_g,
        carbs_g_base: swap.carbs_g,
        fat_g_base: swap.fat_g,
        department: swap.department || ing.department,
        notes: `Swapped from original (${ing.name})`,
      };
    }
    return ing;
  });

  const finalCaloriesPerServing = Math.max(20, Math.round(recipe.calories_per_serving + deltaCals));
  const finalProteinPerServing = Math.max(0, Math.round(recipe.protein_g_per_serving + deltaProt));
  const finalCarbsPerServing = Math.max(0, Math.round(recipe.carbs_g_per_serving + deltaCarbs));
  const finalFatPerServing = Math.max(0, Math.round(recipe.fat_g_per_serving + deltaFat));

  // Synthesize dynamically adapted cooking instructions, timings, and chef tips
  const {
    adaptedInstructions,
    adjustedPrepMinutes,
    adjustedCookMinutes,
    adaptedChefNotes,
    adaptedStepsIndices,
  } = adaptRecipeInstructionsAndTimings(recipe, activeSwaps);

  return {
    ...recipe,
    calories_per_serving: finalCaloriesPerServing,
    protein_g_per_serving: finalProteinPerServing,
    carbs_g_per_serving: finalCarbsPerServing,
    fat_g_per_serving: finalFatPerServing,
    prep_time_minutes: adjustedPrepMinutes,
    cook_time_minutes: adjustedCookMinutes,
    instructions: adaptedInstructions,
    chef_notes: adaptedChefNotes,
    ingredients: customizedIngredients,
    hasSwaps: swapCount > 0,
    swapCount,
    macroDeltas: {
      calories: Math.round(deltaCals),
      protein: Math.round(deltaProt),
      carbs: Math.round(deltaCarbs),
      fat: Math.round(deltaFat),
    },
    adaptedStepsIndices,
  };
}
