import { FoodItem } from './types';

export interface WholesomeMeal {
  id: string;
  name: string;
  shortName: string;
  desc: string;
  cals: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  mealIndex: 1 | 2 | 3 | 4; // 1: Breakfast, 2: Lunch, 3: Dinner, 4: Snack
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  categoryLabel: string;
  foodName: string;
  grams: number;
  emoji: string;
  tags: string[];
  is_gluten_free: boolean;
  is_dairy_free: boolean;
}

export const WHOLESOME_MEAL_CATALOG: WholesomeMeal[] = [
  // ================= BREAKFAST (Meal 1) =================
  {
    id: 'oatmeal-berries',
    name: '🥣 Warm Berry & Almond Butter Oatmeal',
    shortName: 'Berry & Almond Oatmeal',
    desc: 'Slow-simmered rolled oats, fresh wild blueberries, and a dollop of raw almond butter',
    cals: 350,
    protein_g: 14,
    carbs_g: 54,
    fat_g: 10,
    mealIndex: 1,
    category: 'breakfast',
    categoryLabel: 'Breakfast • Meal 1',
    foodName: 'Rolled Oats with Wild Blueberries & Raw Almond Butter',
    grams: 220,
    emoji: '🥣',
    tags: ['High-Fiber', 'Whole Grain', 'Heart-Healthy'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'mediterranean-shakshuka',
    name: '🍳 Mediterranean Shakshuka Skillet',
    shortName: 'Mediterranean Shakshuka',
    desc: '3 gently poached eggs in rich spiced tomato & bell pepper sauce with whole wheat pita',
    cals: 380,
    protein_g: 24,
    carbs_g: 22,
    fat_g: 22,
    mealIndex: 1,
    category: 'breakfast',
    categoryLabel: 'Breakfast • Meal 1',
    foodName: 'Mediterranean Shakshuka with Poached Eggs & Whole Wheat Pita',
    grams: 260,
    emoji: '🍳',
    tags: ['High-Protein', 'Low-Glycemic', 'Antioxidants'],
    is_gluten_free: false,
    is_dairy_free: false,
  },
  {
    id: 'greek-yogurt-parfait',
    name: '🍓 Greek Yogurt & Strawberry Honey Parfait',
    shortName: 'Greek Yogurt Parfait',
    desc: 'Creamy non-fat Greek yogurt, fresh strawberries, chia seeds, and raw clover honey',
    cals: 220,
    protein_g: 22,
    carbs_g: 26,
    fat_g: 2,
    mealIndex: 1,
    category: 'breakfast',
    categoryLabel: 'Breakfast • Meal 1',
    foodName: 'Nonfat Greek Yogurt Parfait with Strawberries & Honey',
    grams: 200,
    emoji: '🍓',
    tags: ['High-Protein', 'Gut Health', 'Probiotics'],
    is_gluten_free: true,
    is_dairy_free: false,
  },
  {
    id: 'protein-oat-pancakes',
    name: '🥞 Golden High-Protein Oat Pancakes',
    shortName: 'Protein Oat Pancakes',
    desc: 'Ground whole oat & egg white flapjacks served with warm cinnamon apple slices',
    cals: 390,
    protein_g: 32,
    carbs_g: 44,
    fat_g: 8,
    mealIndex: 1,
    category: 'breakfast',
    categoryLabel: 'Breakfast • Meal 1',
    foodName: 'High-Protein Oat Pancakes with Warm Cinnamon Apples',
    grams: 240,
    emoji: '🥞',
    tags: ['High-Protein', 'Complex Carbs', 'Clean Fuel'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'avocado-egg-toast',
    name: '🥑 Smashed Avocado & Sunny Egg Toast',
    shortName: 'Avocado & Egg Toast',
    desc: 'Artisan sourdough slice, fresh crushed Hass avocado, and two pasture-raised sunny eggs',
    cals: 360,
    protein_g: 18,
    carbs_g: 32,
    fat_g: 18,
    mealIndex: 1,
    category: 'breakfast',
    categoryLabel: 'Breakfast • Meal 1',
    foodName: 'Sourdough Toast with Smashed Avocado & Pasture Eggs',
    grams: 190,
    emoji: '🥑',
    tags: ['Healthy Fats', 'Whole Food', 'Balanced'],
    is_gluten_free: false,
    is_dairy_free: true,
  },
  {
    id: 'green-superfood-smoothie',
    name: '🥤 Green Spinach & Protein Super Shake',
    shortName: 'Green Superfood Shake',
    desc: 'Baby spinach, ripe banana, vanilla whey isolate, and cold filtered almond milk',
    cals: 280,
    protein_g: 28,
    carbs_g: 30,
    fat_g: 4,
    mealIndex: 1,
    category: 'breakfast',
    categoryLabel: 'Breakfast • Meal 1',
    foodName: 'Spinach Banana Protein Super Shake',
    grams: 350,
    emoji: '🥤',
    tags: ['Fast Digestion', 'Micronutrients', 'High-Protein'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'veggie-egg-scramble',
    name: '🍳 Spinach, Mushroom & Feta Scramble',
    shortName: 'Spinach & Feta Scramble',
    desc: 'Fluffy whole eggs scrambled with tender baby spinach, cremini mushrooms, and crumbly feta',
    cals: 320,
    protein_g: 26,
    carbs_g: 10,
    fat_g: 20,
    mealIndex: 1,
    category: 'breakfast',
    categoryLabel: 'Breakfast • Meal 1',
    foodName: 'Farm Fresh Egg Scramble with Spinach, Mushrooms & Feta',
    grams: 230,
    emoji: '🍳',
    tags: ['Low-Carb', 'Keto-Friendly', 'High-Protein'],
    is_gluten_free: true,
    is_dairy_free: false,
  },

  // ================= LUNCH (Meal 2) =================
  {
    id: 'grilled-chicken-power-bowl',
    name: '🥗 Grilled Chicken & Jasmine Rice Power Bowl',
    shortName: 'Chicken Jasmine Power Bowl',
    desc: 'Charred chicken breast, fragrant jasmine rice, steamed broccoli florets & sesame seeds',
    cals: 520,
    protein_g: 44,
    carbs_g: 56,
    fat_g: 12,
    mealIndex: 2,
    category: 'lunch',
    categoryLabel: 'Lunch • Meal 2',
    foodName: 'Grilled Chicken Breast with Jasmine Rice & Steamed Broccoli',
    grams: 320,
    emoji: '🥗',
    tags: ['Athlete Macro Gold', 'Lean Protein', 'Clean Carbs'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'turkey-avocado-sourdough',
    name: '🥪 Roasted Turkey & Avocado Sourdough',
    shortName: 'Turkey & Avocado Sourdough',
    desc: 'Deli-style roasted turkey breast, ripe avocado, crisp arugula & stoneground mustard',
    cals: 420,
    protein_g: 34,
    carbs_g: 38,
    fat_g: 14,
    mealIndex: 2,
    category: 'lunch',
    categoryLabel: 'Lunch • Meal 2',
    foodName: 'Roasted Turkey Breast & Avocado Sourdough Sandwich',
    grams: 240,
    emoji: '🥪',
    tags: ['Quick Prep', 'High-Protein', 'Comforting'],
    is_gluten_free: false,
    is_dairy_free: true,
  },
  {
    id: 'southwest-fajita-bowl',
    name: '🌯 Southwest Chicken & Black Bean Bowl',
    shortName: 'Southwest Fajita Bowl',
    desc: 'Grilled spiced chicken, black beans, sweet corn, charred bell peppers & fire-roasted salsa',
    cals: 480,
    protein_g: 40,
    carbs_g: 52,
    fat_g: 13,
    mealIndex: 2,
    category: 'lunch',
    categoryLabel: 'Lunch • Meal 2',
    foodName: 'Southwest Spiced Chicken & Black Bean Bowl',
    grams: 330,
    emoji: '🌯',
    tags: ['High-Fiber', 'Flavor Packed', 'Lean Protein'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'lemon-herb-chicken-salad',
    name: '🥙 Crisp Mediterranean Lemon Chicken Salad',
    shortName: 'Mediterranean Chicken Salad',
    desc: 'Chopped romaine, grilled lemon-herb chicken, cucumbers, cherry tomatoes & vinaigrette',
    cals: 410,
    protein_g: 42,
    carbs_g: 16,
    fat_g: 20,
    mealIndex: 2,
    category: 'lunch',
    categoryLabel: 'Lunch • Meal 2',
    foodName: 'Crisp Mediterranean Lemon Herb Chicken Salad',
    grams: 290,
    emoji: '🥙',
    tags: ['Low-Carb', 'Heart-Healthy Olive Oil', 'Hydrating'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'hearty-turkey-chili',
    name: '🍲 Slow-Simmered Turkey & Sweet Potato Chili',
    shortName: 'Turkey Sweet Potato Chili',
    desc: '93% lean ground turkey, cubed roasted sweet potato, kidney beans & rich cumin chili broth',
    cals: 440,
    protein_g: 38,
    carbs_g: 46,
    fat_g: 12,
    mealIndex: 2,
    category: 'lunch',
    categoryLabel: 'Lunch • Meal 2',
    foodName: 'Slow-Simmered Lean Turkey & Sweet Potato Chili',
    grams: 340,
    emoji: '🍲',
    tags: ['Comfort Food', 'Meal Prep Classic', 'High-Protein'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'teriyaki-salmon-rice-bowl',
    name: '🍚 Teriyaki Salmon & Steamed Edamame Bowl',
    shortName: 'Teriyaki Salmon Rice Bowl',
    desc: 'Glazed wild salmon, brown rice, shelled edamame, shredded carrots & toasted nori',
    cals: 540,
    protein_g: 38,
    carbs_g: 58,
    fat_g: 18,
    mealIndex: 2,
    category: 'lunch',
    categoryLabel: 'Lunch • Meal 2',
    foodName: 'Teriyaki Wild Salmon Brown Rice Bowl with Edamame',
    grams: 320,
    emoji: '🍚',
    tags: ['Omega-3', 'Brain Fuel', 'Satiating'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'quinoa-chickpea-tahini-bowl',
    name: '🥗 Warm Quinoa, Chickpeas & Herb Tahini Bowl',
    shortName: 'Quinoa & Chickpea Tahini',
    desc: 'Tri-color quinoa, roasted spiced chickpeas, sautéed kale & lemon garlic tahini drizzle',
    cals: 460,
    protein_g: 18,
    carbs_g: 64,
    fat_g: 16,
    mealIndex: 2,
    category: 'lunch',
    categoryLabel: 'Lunch • Meal 2',
    foodName: 'Warm Quinoa, Chickpea & Herb Tahini Grain Bowl',
    grams: 310,
    emoji: '🥗',
    tags: ['Plant Power', 'High-Fiber', 'Micronutrient Dense'],
    is_gluten_free: true,
    is_dairy_free: true,
  },

  // ================= DINNER (Meal 3) =================
  {
    id: 'salmon-sweet-potato',
    name: '🐟 Wild Alaskan Salmon & Roasted Sweet Potato',
    shortName: 'Wild Salmon & Sweet Potato',
    desc: 'Oven-baked wild salmon fillet, roasted rosemary sweet potato wedges & grilled asparagus',
    cals: 580,
    protein_g: 44,
    carbs_g: 46,
    fat_g: 22,
    mealIndex: 3,
    category: 'dinner',
    categoryLabel: 'Dinner • Meal 3',
    foodName: 'Wild Alaskan Salmon with Roasted Sweet Potato & Grilled Asparagus',
    grams: 340,
    emoji: '🐟',
    tags: ['Omega-3 Rich', 'Anti-Inflammatory', 'Athletic Gold'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'sirloin-garlic-asparagus',
    name: '🥩 Seared Grass-Fed Sirloin & Baby Potatoes',
    shortName: 'Sirloin & Baby Potatoes',
    desc: '6oz cast-iron seared top sirloin steak, crushed roasted gold potatoes & garlic asparagus',
    cals: 530,
    protein_g: 48,
    carbs_g: 28,
    fat_g: 22,
    mealIndex: 3,
    category: 'dinner',
    categoryLabel: 'Dinner • Meal 3',
    foodName: 'Grass-Fed Sirloin Steak with Roasted Baby Potatoes & Asparagus',
    grams: 310,
    emoji: '🥩',
    tags: ['Iron & Zinc', 'Muscle Recovery', 'Satiating'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'crispy-chicken-cutlet-quinoa',
    name: '🍗 Herb Panko Chicken Breast & Tri-Color Quinoa',
    shortName: 'Crisp Herb Chicken & Quinoa',
    desc: 'Air-fried crisp herb chicken breast served with fluffy quinoa and steamed green beans',
    cals: 490,
    protein_g: 48,
    carbs_g: 42,
    fat_g: 14,
    mealIndex: 3,
    category: 'dinner',
    categoryLabel: 'Dinner • Meal 3',
    foodName: 'Herb Panko Crusted Chicken Breast with Tri-Color Quinoa',
    grams: 320,
    emoji: '🍗',
    tags: ['Ultra High Protein', 'Lean Fuel', 'Crispy & Clean'],
    is_gluten_free: false,
    is_dairy_free: true,
  },
  {
    id: 'garlic-shrimp-zoodles',
    name: '🍤 Sunkissed Garlic Shrimp & Zucchini Noodles',
    shortName: 'Garlic Shrimp & Zoodles',
    desc: 'Tender jumbo shrimp sautéed in cold-pressed olive oil, fresh garlic, basil & zoodles',
    cals: 360,
    protein_g: 38,
    carbs_g: 14,
    fat_g: 16,
    mealIndex: 3,
    category: 'dinner',
    categoryLabel: 'Dinner • Meal 3',
    foodName: 'Sunkissed Garlic Butter Shrimp with Fresh Zucchini Noodles',
    grams: 290,
    emoji: '🍤',
    tags: ['Light Dinner', 'Low-Carb', 'Fast Digesting'],
    is_gluten_free: true,
    is_dairy_free: false,
  },
  {
    id: 'tuscan-roasted-chicken',
    name: '🥘 1-Pan Tuscan Herb Chicken & Roasted Veggies',
    shortName: 'Tuscan Herb Chicken',
    desc: 'Oven roasted chicken breast with red potatoes, zucchini, and blistered cherry tomatoes',
    cals: 520,
    protein_g: 46,
    carbs_g: 36,
    fat_g: 20,
    mealIndex: 3,
    category: 'dinner',
    categoryLabel: 'Dinner • Meal 3',
    foodName: '1-Pan Tuscan Herb Roasted Chicken with Red Potatoes & Veggies',
    grams: 330,
    emoji: '🥘',
    tags: ['Simple Sheet Pan', 'Antioxidants', 'Balanced'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'turkey-bolognese-penne',
    name: '🍝 Lean Turkey Bolognese with Durum Penne',
    shortName: 'Turkey Bolognese Penne',
    desc: '93% lean ground turkey simmered in rich garlic herb marinara over al dente durum penne',
    cals: 510,
    protein_g: 42,
    carbs_g: 58,
    fat_g: 13,
    mealIndex: 3,
    category: 'dinner',
    categoryLabel: 'Dinner • Meal 3',
    foodName: 'Lean Ground Turkey Bolognese over Durum Wheat Penne',
    grams: 340,
    emoji: '🍝',
    tags: ['Post-Workout Fuel', 'Comfort Food', 'High Protein'],
    is_gluten_free: false,
    is_dairy_free: true,
  },
  {
    id: 'baked-cod-lemon-potatoes',
    name: '🐟 Lemon Herb Baked Atlantic Cod & Potatoes',
    shortName: 'Baked Cod & Herb Potatoes',
    desc: 'Flaky wild Atlantic cod fillet with roasted baby yellow potatoes and steamed lemon broccoli',
    cals: 430,
    protein_g: 40,
    carbs_g: 38,
    fat_g: 12,
    mealIndex: 3,
    category: 'dinner',
    categoryLabel: 'Dinner • Meal 3',
    foodName: 'Lemon Herb Baked Wild Cod with Roasted Potatoes & Broccoli',
    grams: 300,
    emoji: '🐟',
    tags: ['Lean White Fish', 'Easy Digestion', 'Clean Nutrition'],
    is_gluten_free: true,
    is_dairy_free: true,
  },

  // ================= SNACKS & FUEL (Meal 4) =================
  {
    id: 'cottage-cheese-berries',
    name: '🫐 Cottage Cheese & Wild Blueberries',
    shortName: 'Cottage Cheese & Berries',
    desc: 'Slow-digesting low-fat cottage cheese topped with fresh wild blueberries & cinnamon',
    cals: 190,
    protein_g: 24,
    carbs_g: 18,
    fat_g: 2,
    mealIndex: 4,
    category: 'snack',
    categoryLabel: 'Snack • Meal 4',
    foodName: 'Low-Fat Cottage Cheese with Fresh Blueberries & Cinnamon',
    grams: 200,
    emoji: '🫐',
    tags: ['Casein Protein', 'Nighttime Fuel', 'Low-Fat'],
    is_gluten_free: true,
    is_dairy_free: false,
  },
  {
    id: 'apple-almond-butter',
    name: '🍎 Crisp Honeycrisp Apple & Raw Almond Butter',
    shortName: 'Apple & Almond Butter',
    desc: 'Sweet, chilled Honeycrisp apple slices paired with 2 tbsp of stoneground raw almond butter',
    cals: 210,
    protein_g: 5,
    carbs_g: 28,
    fat_g: 11,
    mealIndex: 4,
    category: 'snack',
    categoryLabel: 'Snack • Meal 4',
    foodName: 'Crisp Apple Slices with Pure Raw Almond Butter',
    grams: 180,
    emoji: '🍎',
    tags: ['Whole Fruit', 'Satisfying Crunch', 'Healthy Fats'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'dark-chocolate-energy-bites',
    name: '🍫 Dark Chocolate & Oat Energy Bites',
    shortName: 'Dark Chocolate Energy Bites',
    desc: 'No-bake energy rounds made with rolled oats, dates, crushed almonds & 70% dark chocolate',
    cals: 190,
    protein_g: 8,
    carbs_g: 24,
    fat_g: 8,
    mealIndex: 4,
    category: 'snack',
    categoryLabel: 'Snack • Meal 4',
    foodName: 'No-Bake Rolled Oat & Dark Chocolate Energy Bites',
    grams: 60,
    emoji: '🍫',
    tags: ['Natural Energy', 'Pre-Workout', 'Wholesome Sweet'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'steamed-edamame-pods',
    name: '🫛 Steamed Himalayan Pink Salt Edamame',
    shortName: 'Steamed Edamame Pods',
    desc: 'Warm tender young soybean pods sprinkled with coarse mineral-rich pink salt',
    cals: 160,
    protein_g: 14,
    carbs_g: 12,
    fat_g: 6,
    mealIndex: 4,
    category: 'snack',
    categoryLabel: 'Snack • Meal 4',
    foodName: 'Steamed Edamame Pods with Himalayan Pink Salt',
    grams: 150,
    emoji: '🫛',
    tags: ['Plant Protein', 'High-Fiber', 'Mineral-Rich'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'cucumber-feta-dip',
    name: '🥒 Chilled Cucumbers & Greek Whipped Feta Dip',
    shortName: 'Cucumbers & Whipped Feta',
    desc: 'Crisp Persian cucumber wheels with lemon garlic whipped feta & Greek yogurt dip',
    cals: 150,
    protein_g: 8,
    carbs_g: 10,
    fat_g: 9,
    mealIndex: 4,
    category: 'snack',
    categoryLabel: 'Snack • Meal 4',
    foodName: 'Chilled Persian Cucumbers with Whipped Feta & Greek Yogurt',
    grams: 170,
    emoji: '🥒',
    tags: ['Hydrating', 'Low-Calorie', 'Savory Crunch'],
    is_gluten_free: true,
    is_dairy_free: false,
  },
  {
    id: 'banana-whey-shake',
    name: '🍌 Banana Whey Protein Recovery Shake',
    shortName: 'Banana Whey Shake',
    desc: 'Cold blended whey protein isolate, half banana, and unsweetened vanilla almond milk',
    cals: 260,
    protein_g: 30,
    carbs_g: 30,
    fat_g: 2,
    mealIndex: 4,
    category: 'snack',
    categoryLabel: 'Snack • Meal 4',
    foodName: 'Banana Whey Protein Recovery Shake',
    grams: 320,
    emoji: '🍌',
    tags: ['Post-Workout', 'Rapid Recovery', 'High Protein'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
  {
    id: 'mixed-raw-nuts-cranberries',
    name: '🥜 Artisan Raw Almond, Walnut & Cranberry Mix',
    shortName: 'Almonds, Walnuts & Cranberries',
    desc: 'Dry-roasted California almonds, English walnuts, and tart ruby cranberries',
    cals: 220,
    protein_g: 6,
    carbs_g: 16,
    fat_g: 16,
    mealIndex: 4,
    category: 'snack',
    categoryLabel: 'Snack • Meal 4',
    foodName: 'Raw Almonds, Walnuts & Dried Cranberries Trail Mix',
    grams: 45,
    emoji: '🥜',
    tags: ['Brain Healthy Fats', 'Antioxidants', 'Portable Fuel'],
    is_gluten_free: true,
    is_dairy_free: true,
  },
];

// Partition by category
export const BREAKFAST_MEALS = WHOLESOME_MEAL_CATALOG.filter((m) => m.category === 'breakfast');
export const LUNCH_MEALS = WHOLESOME_MEAL_CATALOG.filter((m) => m.category === 'lunch');
export const DINNER_MEALS = WHOLESOME_MEAL_CATALOG.filter((m) => m.category === 'dinner');
export const SNACK_MEALS = WHOLESOME_MEAL_CATALOG.filter((m) => m.category === 'snack');

/**
 * Deterministically retrieves 4 balanced wholesome meals for a specific date (Breakfast, Lunch, Dinner, Snack).
 * Automatically changes each calendar day. Supports manual shuffle offset to cycle combinations.
 */
export function getDailyWholesomeMeals(
  dateStr: string = new Date().toISOString().split('T')[0],
  shuffleOffset: number = 0
): WholesomeMeal[] {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const baseSeed = Math.abs(hash) + shuffleOffset;

  const bIndex = (baseSeed + 0) % BREAKFAST_MEALS.length;
  const lIndex = (baseSeed + 2) % LUNCH_MEALS.length;
  const dIndex = (baseSeed + 4) % DINNER_MEALS.length;
  const sIndex = (baseSeed + 6) % SNACK_MEALS.length;

  return [
    BREAKFAST_MEALS[bIndex],
    LUNCH_MEALS[lIndex],
    DINNER_MEALS[dIndex],
    SNACK_MEALS[sIndex],
  ];
}

export interface SmartMealSuggestion {
  meal: WholesomeMeal;
  reason: string;
  periodLabel: string;
  timingHint: string;
}

/**
 * Intelligent suggestion engine that recommends a wholesome meal tailored to:
 * 1. Current time of day (Breakfast, Lunch, Dinner, Snack)
 * 2. Remaining calorie budget
 * 3. Fasting status (e.g. gentle break-fast vs recovery fuel)
 * Supports cycling through alternative candidates via suggestionIndex.
 */
export function getSmartWholesomeSuggestion(options?: {
  remainingCalories?: number;
  isFasting?: boolean;
  currentHour?: number;
  suggestionIndex?: number;
}): SmartMealSuggestion {
  const currentHour = options?.currentHour ?? new Date().getHours();
  const remainingCals = options?.remainingCalories ?? 1800;
  const isFasting = options?.isFasting ?? false;
  const index = Math.abs(options?.suggestionIndex ?? 0);

  let targetPool: WholesomeMeal[];
  let periodLabel: string;
  let timingHint: string;
  let reason: string;

  if (isFasting) {
    targetPool = [...BREAKFAST_MEALS, ...SNACK_MEALS];
    periodLabel = 'Gentle Fast-Breaker';
    timingHint = 'Ideal for opening your eating window with clean whole food';
    reason = 'Gentle on digestion, nutrient-dense, and curbs cravings after fasting.';
  } else if (currentHour < 11) {
    targetPool = BREAKFAST_MEALS;
    periodLabel = 'Morning Fuel • Breakfast';
    timingHint = 'High protein & complex carbs to start your day strong';
    const cand = targetPool[index % targetPool.length];
    reason = `Kickstarts your metabolism with ${cand.protein_g}g protein and clean morning energy.`;
  } else if (currentHour >= 11 && currentHour < 16) {
    targetPool = LUNCH_MEALS;
    periodLabel = 'Midday Energy • Power Lunch';
    timingHint = 'Sustained energy to power through the afternoon without a crash';
    const cand = targetPool[index % targetPool.length];
    reason = `Macro-balanced power plate with clean carbs and ${cand.protein_g}g lean protein.`;
  } else if (currentHour >= 16 && currentHour < 21) {
    if (remainingCals < 450) {
      targetPool = [...DINNER_MEALS.filter((d) => d.cals <= 460), ...LUNCH_MEALS.filter((l) => l.cals <= 450)];
      periodLabel = 'Light Evening Plate • Dinner';
      timingHint = 'High protein, lower calories to stay within your daily goal';
      reason = `Calorie-conscious dinner perfectly fitting your remaining ~${remainingCals} kcal budget.`;
    } else {
      targetPool = DINNER_MEALS;
      periodLabel = 'Evening Nourishment • Dinner';
      timingHint = 'Nourishes deep muscle recovery and restores glycogen stores';
      const cand = targetPool[index % targetPool.length];
      reason = `Satisfying evening plate delivering ${cand.protein_g}g protein for overnight recovery.`;
    }
  } else {
    targetPool = SNACK_MEALS;
    periodLabel = 'Late Evening • Recovery Fuel';
    timingHint = 'Light, slow-digesting protein to support overnight rest';
    const cand = targetPool[index % targetPool.length];
    reason = `A light, wholesome bite under ${cand.cals} kcal to satisfy cravings without feeling heavy.`;
  }

  const selectedMeal = targetPool[index % targetPool.length];

  return {
    meal: selectedMeal,
    reason,
    periodLabel,
    timingHint,
  };
}

/**
 * Converts a WholesomeMeal into a valid FoodItem object for the logging engine.
 */
export function createFoodItemFromWholesomeMeal(meal: WholesomeMeal): FoodItem {
  return {
    id: `wholesome-${meal.id}`,
    name: meal.foodName,
    category: 'protein',
    sub_category: meal.category,
    calories_per_100g: Math.round((meal.cals / meal.grams) * 100),
    protein_per_100g: Number(((meal.protein_g / meal.grams) * 100).toFixed(1)),
    carbs_per_100g: Number(((meal.carbs_g / meal.grams) * 100).toFixed(1)),
    fat_per_100g: Number(((meal.fat_g / meal.grams) * 100).toFixed(1)),
    is_gluten_free: meal.is_gluten_free,
    is_dairy_free: meal.is_dairy_free,
    serving_size_g: meal.grams,
    default_unit: 'g',
    storage_type: 'fresh_weekly',
  };
}
