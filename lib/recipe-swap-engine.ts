import {
  RecipeItem,
  RecipeIngredient,
  RecipeIngredientSwapOption,
  FoodCategory,
  FoodItem,
} from './types';
import { COMPREHENSIVE_FOOD_DATABASE } from './food-database';

// -------------------------------------------------------------
// Curated Direct Swaps Catalog with Accurate Macro Portions
// -------------------------------------------------------------
const SWAP_FAMILIES: {
  matchKeywords: string[];
  department: 'dairy_eggs' | 'meat_seafood' | 'produce' | 'grains_bakery' | 'healthy_fats' | 'pantry_spices' | 'supplements';
  foodCategory: FoodCategory;
  swaps: RecipeIngredientSwapOption[];
}[] = [
  // 1. Milks & Liquid Dairy Alternatives
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
      },
    ],
  },

  // 2. Yogurts & Soft Cheeses
  {
    matchKeywords: ['greek yogurt', 'cottage cheese', 'yogurt', 'skyr'],
    department: 'dairy_eggs',
    foodCategory: 'dairy_eggs',
    swaps: [
      {
        name: 'Low-Fat 2% Plain Greek Yogurt',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '227g',
        raw_weight_grams_base: 227,
        calories: 150,
        protein_g: 20,
        carbs_g: 8,
        fat_g: 4,
        tag: 'Standard High-Protein',
        reason: 'Thick, creamy probiotic base',
      },
      {
        name: 'Non-Fat 0% Greek Yogurt',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '227g',
        raw_weight_grams_base: 227,
        calories: 120,
        protein_g: 23,
        carbs_g: 7,
        fat_g: 0,
        tag: 'Zero-Fat Lean Protein',
        reason: 'Maximum protein with 0g fat',
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
        reason: 'High casein protein for sustained satiety',
      },
      {
        name: 'Icelandic Skyr (Plain)',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '227g',
        raw_weight_grams_base: 227,
        calories: 130,
        protein_g: 24,
        carbs_g: 6,
        fat_g: 0.5,
        tag: 'Ultra-Dense Protein',
        reason: 'Traditional concentrated cultured dairy',
      },
      {
        name: 'Dairy-Free Coconut Milk Yogurt',
        amount_imperial: '1 cup (8 oz)',
        amount_metric: '227g',
        raw_weight_grams_base: 227,
        calories: 160,
        protein_g: 2,
        carbs_g: 14,
        fat_g: 11,
        tag: '100% Dairy-Free / Vegan',
        reason: 'Plant-based cultured coconut alternative',
      },
    ],
  },

  // 3. Cheeses
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
      },
    ],
  },

  // 4. Poultry, Meats & Plant Proteins
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
        reason: 'Almost pure protein with virtually 0g fat',
      },
      {
        name: 'Wild Pacific Cod / Halibut Filet',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 150,
        protein_g: 34,
        carbs_g: 0,
        fat_g: 1,
        tag: 'Mild White Fish',
        reason: 'Delicate flaky white fish with low calories',
      },
      {
        name: 'Organic Extra Firm Tofu (Pressed)',
        amount_imperial: '6 oz',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 150,
        protein_g: 18,
        carbs_g: 4,
        fat_g: 9,
        tag: '100% Plant-Based',
        reason: 'Absorbs marinades and crisps easily',
      },
    ],
  },

  // 5. Crisp Green Vegetables & Cruciferous
  {
    matchKeywords: ['asparagus', 'green beans', 'broccoli', 'zucchini', 'spinach', 'kale', 'peppers', 'cauliflower', 'mushrooms', 'squash'],
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
        reason: 'Rich in glutathione and folate',
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
        reason: 'Crisp snap with high dietary fiber',
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
        reason: 'Sulforaphane antioxidant powerhouse',
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
        reason: 'Quick cooking with high potassium',
      },
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
        reason: 'Wilts in seconds and adds smooth texture',
      },
      {
        name: 'Rainbow Bell Peppers & Red Onion',
        amount_imperial: '1.5 cups (5.5 oz)',
        amount_metric: '150g',
        raw_weight_grams_base: 150,
        calories: 45,
        protein_g: 2,
        carbs_g: 10,
        fat_g: 0,
        tag: 'Vitamin C Boost',
        reason: 'Sweet caramelized roasted flavor',
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
        reason: 'Rich savory depth and texture',
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
      },
    ],
  },

  // 6. Grains, Starches & Complex Carbs
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
        reason: '+2x protein and +4x fiber of wheat pasta',
      },
      {
        name: 'Riced Cauliflower (Steamed)',
        amount_imperial: '1.5 cups (6 oz)',
        amount_metric: '170g',
        raw_weight_grams_base: 170,
        calories: 35,
        protein_g: 3,
        carbs_g: 6,
        fat_g: 0,
        tag: 'Keto / Low-Carb Swap',
        reason: 'Cuts over 120 calories and 30g carbs',
      },
    ],
  },

  // 7. Cooking Fats & Oils
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

  // 2. Find matching family
  for (const family of SWAP_FAMILIES) {
    const isMatch = family.matchKeywords.some((kw) => ingNameLower.includes(kw));
    if (isMatch) {
      // Filter out the exact same item
      return family.swaps.filter((s) => s.name.toLowerCase() !== ingNameLower);
    }
  }

  // 3. Fallback: Search from COMPREHENSIVE_FOOD_DATABASE based on department / category
  return getCategoryFoodAlternatives(ingredient.food_category || 'vegetables', ingredient.name);
}

/**
 * Dynamically queries matching alternatives from the master food database for broad category swaps
 */
export function getCategoryFoodAlternatives(
  foodCategory: FoodCategory,
  currentName: string
): RecipeIngredientSwapOption[] {
  const currentLower = currentName.toLowerCase();

  // Find foods in the database matching this category
  const matchingFoods = COMPREHENSIVE_FOOD_DATABASE.filter(
    (f) => f.category === foodCategory && !f.name.toLowerCase().includes(currentLower)
  ).slice(0, 8);

  return matchingFoods.map((f) => {
    const servingG = f.serving_size_g || 100;
    const ratio = servingG / 100;

    return {
      name: f.name,
      amount_imperial: `${(servingG * 0.03527).toFixed(1)} oz (${f.default_unit || 'portion'})`,
      amount_metric: `${servingG}g`,
      raw_weight_grams_base: servingG,
      calories: Math.round(f.calories_per_100g * ratio),
      protein_g: Math.round(f.protein_per_100g * ratio),
      carbs_g: Math.round(f.carbs_per_100g * ratio),
      fat_g: Math.round(f.fat_per_100g * ratio),
      department: f.storage_type === 'fresh_weekly' ? 'produce' : 'grains_bakery',
      food_category: foodCategory,
      tag: `Category Match (${f.category.replace('_', ' ')})`,
      reason: `Whole-food swap from ${f.category.replace('_', ' ')}`,
    };
  });
}

/**
 * Calculates customized recipe data and exact recalculated macros based on active user swaps
 */
export function calculateCustomizedRecipe(
  recipe: RecipeItem,
  activeSwaps: Record<number, RecipeIngredientSwapOption>,
  batchMultiplier: number = 1
): RecipeItem & {
  hasSwaps: boolean;
  swapCount: number;
  macroDeltas: { calories: number; protein: number; carbs: number; fat: number };
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

  return {
    ...recipe,
    calories_per_serving: finalCaloriesPerServing,
    protein_g_per_serving: finalProteinPerServing,
    carbs_g_per_serving: finalCarbsPerServing,
    fat_g_per_serving: finalFatPerServing,
    ingredients: customizedIngredients,
    hasSwaps: swapCount > 0,
    swapCount,
    macroDeltas: {
      calories: Math.round(deltaCals),
      protein: Math.round(deltaProt),
      carbs: Math.round(deltaCarbs),
      fat: Math.round(deltaFat),
    },
  };
}
