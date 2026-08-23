import {
  CatalogGroceryItem,
  GroceryDepartment,
  GroceryStoreTag,
  GroceryItem,
  NamedGroceryList,
  FoodItem,
  SmartGrocerySubstitute,
} from './types';

export const GROCERY_DEPARTMENTS: { id: GroceryDepartment; label: string; icon: string; description: string }[] = [
  { id: 'produce', label: 'Produce & Fresh Greens', icon: '🥦', description: 'Fresh vegetables, organic greens, herbs & fresh fruits' },
  { id: 'meat_seafood', label: 'Meat, Poultry & Seafood', icon: '🥩', description: 'Lean poultry, wild seafood, grass-fed meats & plant proteins' },
  { id: 'dairy_eggs', label: 'Dairy, Eggs & Milks', icon: '🥛', description: 'Pasture-raised eggs, Greek yogurt, Skyr, kefir & plant-based milks' },
  { id: 'grains_bakery', label: 'Complex Carbs & Bakery', icon: '🍚', description: 'Rolled oats, jasmine rice, quinoa, sweet potatoes & sourdough' },
  { id: 'healthy_fats', label: 'Healthy Fats, Nuts & Oils', icon: '🥑', description: 'Extra virgin olive oil, avocado oil, raw almonds, walnuts & nut butters' },
  { id: 'pantry_spices', label: 'Pantry Staples & Seasonings', icon: '🧂', description: 'Sea salt, raw honey, organic bone broth, balsamic & spice blends' },
  { id: 'frozen', label: 'Frozen Nutrition & Berries', icon: '🧊', description: 'Wild blueberries, frozen edamame, spinach bricks & açai packets' },
  { id: 'supplements', label: 'Supplements & Performance', icon: '💊', description: 'Whey protein isolate, creatine monohydrate, electrolytes & greens' },
];

export const GROCERY_STORE_TAGS: { id: GroceryStoreTag; label: string; icon: string }[] = [
  { id: 'all', label: 'All Stores', icon: '🏬' },
  { id: 'costco', label: 'Costco / Wholesale', icon: '📦' },
  { id: 'trader_joes', label: "Trader Joe's", icon: '🌺' },
  { id: 'supermarket', label: 'Local Supermarket', icon: '🛒' },
  { id: 'farmers_market', label: 'Farmers Market', icon: '🌱' },
];

export const DEFAULT_NAMED_LISTS: NamedGroceryList[] = [
  { id: 'main', name: 'Weekly Essentials', description: 'Primary 7-day grocery run for home meal preparation', icon: '🛒' },
  { id: 'costco_bulk', name: 'Costco Wholesale Run', description: 'Monthly bulk items (chicken breasts, oats, olive oil, eggs)', icon: '📦' },
  { id: 'trader_joes_run', name: "Trader Joe's Favorites", description: 'Specialty snacks, Skyr, organic produce, and frozen essentials', icon: '🌺' },
  { id: 'prep_day', name: 'Sunday Meal Prep Requisition', description: 'Batch ingredients needed for 3-4 days of pre-cooked macros', icon: '🍱' },
];

export const MASTER_GROCERY_DATABASE: CatalogGroceryItem[] = [
  // =========================================================================
  // 1. MEAT, POULTRY & SEAFOOD
  // =========================================================================
  {
    id: 'g_boneless_chicken_breast',
    name: 'Boneless Skinless Chicken Breast',
    department: 'meat_seafood',
    shelf_life: 'fresh_weekly',
    default_unit: 'lbs',
    default_quantity: 3,
    store_tags: ['costco', 'supermarket', 'trader_joes'],
    icon_emoji: '🍗',
    common_substitutes: [
      { name: 'Lean Ground Turkey 93/7', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Identical lean protein profile with versatile cooking' },
      { name: 'Wild Alaskan Salmon Fillets', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Adds high omega-3 fatty acids and heart-healthy fats' },
      { name: 'Extra-Firm Organic Tofu', department: 'meat_seafood', default_unit: 'blocks', conversion_ratio: 1.2, reason: 'Plant-based lean protein equivalent' },
      { name: 'Grass-Fed Top Sirloin Steak', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 0.9, reason: 'Rich in bioavailable iron, zinc, and creatine' },
    ],
  },
  {
    id: 'g_ground_turkey_93',
    name: 'Lean Ground Turkey (93/7)',
    department: 'meat_seafood',
    shelf_life: 'fresh_weekly',
    default_unit: 'lbs',
    default_quantity: 2,
    store_tags: ['costco', 'supermarket', 'trader_joes'],
    icon_emoji: '🦃',
    common_substitutes: [
      { name: 'Extra Lean Ground Beef 96/4', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'High-protein beef alternative with minimal fat' },
      { name: 'Boneless Skinless Chicken Breast', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Ultra-lean whole poultry cut' },
      { name: 'Organic Tempeh', department: 'meat_seafood', default_unit: 'pkgs', conversion_ratio: 1.0, reason: 'Fermented whole-soy plant protein' },
    ],
  },
  {
    id: 'g_wild_salmon',
    name: 'Wild Alaskan Salmon Fillets',
    department: 'meat_seafood',
    shelf_life: 'fresh_weekly',
    default_unit: 'lbs',
    default_quantity: 1.5,
    store_tags: ['costco', 'supermarket', 'farmers_market'],
    icon_emoji: '🐟',
    common_substitutes: [
      { name: 'Wild Cod or Halibut Fillets', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Lower-fat white fish alternative' },
      { name: 'Rainbow Trout Fillets', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Similar delicate texture and healthy fat content' },
      { name: 'Wild Albacore Tuna Steaks', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 0.9, reason: 'Denser, steak-like texture with high protein' },
    ],
  },
  {
    id: 'g_grass_fed_beef',
    name: 'Grass-Fed Ground Beef (85/15 or 90/10)',
    department: 'meat_seafood',
    shelf_life: 'fresh_weekly',
    default_unit: 'lbs',
    default_quantity: 2,
    store_tags: ['costco', 'supermarket', 'trader_joes', 'farmers_market'],
    icon_emoji: '🥩',
    common_substitutes: [
      { name: 'Ground Bison / Buffalo', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Leaner red meat with rich flavor profile' },
      { name: 'Lean Ground Turkey 93/7', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Lower calorie poultry alternative' },
    ],
  },
  {
    id: 'g_wild_shrimp',
    name: 'Wild Gulf Raw Shrimp (Peeled & Deveined)',
    department: 'meat_seafood',
    shelf_life: 'fresh_weekly',
    default_unit: 'lbs',
    default_quantity: 1.5,
    store_tags: ['costco', 'supermarket'],
    icon_emoji: '🦐',
    common_substitutes: [
      { name: 'Wild Sea Scallops', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Sweet, buttery lean shellfish' },
      { name: 'Wild Cod Fillets', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Flaky white fish alternative' },
    ],
  },
  {
    id: 'g_extra_firm_tofu',
    name: 'Organic High-Protein Extra-Firm Tofu',
    department: 'meat_seafood',
    shelf_life: 'fresh_weekly',
    default_unit: 'blocks',
    default_quantity: 2,
    store_tags: ['trader_joes', 'supermarket', 'costco'],
    icon_emoji: '🧈',
    common_substitutes: [
      { name: 'Organic Tempeh', department: 'meat_seafood', default_unit: 'pkgs', conversion_ratio: 0.8, reason: 'Higher protein density and firmer nutty bite' },
      { name: 'Edamame (Shelled)', department: 'frozen', default_unit: 'bags', conversion_ratio: 1.0, reason: 'Whole whole-soy green pods' },
    ],
  },
  {
    id: 'g_canned_wild_sardines',
    name: 'Wild Sardines in Extra Virgin Olive Oil / Water',
    department: 'pantry_spices',
    shelf_life: 'pantry_monthly',
    default_unit: 'tins',
    default_quantity: 4,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🥫',
    common_substitutes: [
      { name: 'Wild Albacore Tuna in Olive Oil', department: 'pantry_spices', default_unit: 'cans', conversion_ratio: 1.0, reason: 'Mild flavor pantry seafood' },
      { name: 'Wild Mackerel Fillets', department: 'pantry_spices', default_unit: 'tins', conversion_ratio: 1.0, reason: 'Rich in EPA/DHA omega-3s' },
    ],
  },

  // =========================================================================
  // 2. DAIRY, EGGS & PLANT MILKS
  // =========================================================================
  {
    id: 'g_pasture_eggs',
    name: 'Pasture-Raised Organic Eggs',
    department: 'dairy_eggs',
    shelf_life: 'fresh_weekly',
    default_unit: 'cartons (12ct)',
    default_quantity: 2,
    store_tags: ['costco', 'trader_joes', 'supermarket', 'farmers_market'],
    icon_emoji: '🥚',
    common_substitutes: [
      { name: 'Liquid Egg Whites (100% Pure)', department: 'dairy_eggs', default_unit: 'cartons (32oz)', conversion_ratio: 1.0, reason: 'Zero-fat, pure albumin protein source' },
      { name: 'Organic Liquid Whole Eggs', department: 'dairy_eggs', default_unit: 'cartons', conversion_ratio: 1.0, reason: 'Convenient scramble ready mix' },
    ],
  },
  {
    id: 'g_liquid_egg_whites',
    name: '100% Pure Liquid Egg Whites',
    department: 'dairy_eggs',
    shelf_life: 'fresh_weekly',
    default_unit: 'cartons (32oz)',
    default_quantity: 2,
    store_tags: ['costco', 'supermarket', 'trader_joes'],
    icon_emoji: '🥛',
    common_substitutes: [
      { name: 'Pasture-Raised Organic Eggs', department: 'dairy_eggs', default_unit: 'cartons', conversion_ratio: 0.8, reason: 'Whole eggs with rich choline in yolks' },
    ],
  },
  {
    id: 'g_greek_yogurt_plain',
    name: 'Plain Non-Fat / Low-Fat Greek Yogurt',
    department: 'dairy_eggs',
    shelf_life: 'fresh_weekly',
    default_unit: 'tubs (32oz)',
    default_quantity: 2,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🥣',
    common_substitutes: [
      { name: 'Icelandic Skyr (Unsweetened)', department: 'dairy_eggs', default_unit: 'tubs (24oz)', conversion_ratio: 1.0, reason: 'Thicker, even higher protein density per serving' },
      { name: 'Good Culture Low-Fat Cottage Cheese (2%)', department: 'dairy_eggs', default_unit: 'tubs (16oz)', conversion_ratio: 1.0, reason: 'Slow-digesting casein protein staple' },
      { name: 'Plant-Based Coconut Greek Style Yogurt', department: 'dairy_eggs', default_unit: 'tubs', conversion_ratio: 1.0, reason: '100% dairy-free plant probiotic yogurt' },
    ],
  },
  {
    id: 'g_cottage_cheese',
    name: 'Good Culture Low-Fat Cottage Cheese (2%)',
    department: 'dairy_eggs',
    shelf_life: 'fresh_weekly',
    default_unit: 'tubs (16oz)',
    default_quantity: 2,
    store_tags: ['supermarket', 'trader_joes', 'costco'],
    icon_emoji: '🧀',
    common_substitutes: [
      { name: 'Plain Non-Fat / Low-Fat Greek Yogurt', department: 'dairy_eggs', default_unit: 'tubs', conversion_ratio: 1.0, reason: 'Smooth probiotic dairy alternative' },
      { name: 'Part-Skim Ricotta Cheese', department: 'dairy_eggs', default_unit: 'tubs', conversion_ratio: 1.0, reason: 'Creamy high-whey Italian cheese' },
    ],
  },
  {
    id: 'g_almond_milk_unsweetened',
    name: 'Unsweetened Vanilla Almond Milk',
    department: 'dairy_eggs',
    shelf_life: 'fresh_weekly',
    default_unit: 'cartons (64oz)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🥛',
    common_substitutes: [
      { name: 'Unsweetened Oat Milk', department: 'dairy_eggs', default_unit: 'cartons', conversion_ratio: 1.0, reason: 'Creamier texture for shakes and coffee' },
      { name: 'Fairlife Ultra-Filtered Skim Milk', department: 'dairy_eggs', default_unit: 'bottles (52oz)', conversion_ratio: 1.0, reason: 'High natural protein (13g/cup) with zero lactose' },
      { name: 'Unsweetened Organic Soy Milk', department: 'dairy_eggs', default_unit: 'cartons', conversion_ratio: 1.0, reason: 'Complete plant protein (8g/cup)' },
    ],
  },

  // =========================================================================
  // 3. PRODUCE & FRESH GREENS
  // =========================================================================
  {
    id: 'g_baby_spinach_organic',
    name: 'Organic Baby Spinach (Pre-Washed)',
    department: 'produce',
    shelf_life: 'fresh_weekly',
    default_unit: 'clamshells (16oz)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🍃',
    common_substitutes: [
      { name: 'Baby Arugula', department: 'produce', default_unit: 'clamshells', conversion_ratio: 1.0, reason: 'Peppery salad green packed with nitrates' },
      { name: 'Organic Tuscan Kale (Lacinato)', department: 'produce', default_unit: 'bunches', conversion_ratio: 1.0, reason: 'Heartier braising green rich in vitamins A & C' },
      { name: 'Supergreens / Spring Mix', department: 'produce', default_unit: 'clamshells', conversion_ratio: 1.0, reason: 'Diverse blend of tender nutrient-dense leaves' },
    ],
  },
  {
    id: 'g_broccoli_crowns',
    name: 'Organic Broccoli Crowns',
    department: 'produce',
    shelf_life: 'fresh_weekly',
    default_unit: 'lbs',
    default_quantity: 2,
    store_tags: ['costco', 'trader_joes', 'supermarket', 'farmers_market'],
    icon_emoji: '🥦',
    common_substitutes: [
      { name: 'Broccolini (Baby Broccoli)', department: 'produce', default_unit: 'bunches', conversion_ratio: 1.0, reason: 'Tender stalks with quick cooking time' },
      { name: 'Fresh Cauliflower Head', department: 'produce', default_unit: 'heads', conversion_ratio: 1.0, reason: 'Mild cruciferous veggie ideal for roasting or ricing' },
      { name: 'Brussels Sprouts', department: 'produce', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Dense, nutty cruciferous sprouts' },
    ],
  },
  {
    id: 'g_avocados_hass',
    name: 'Hass Avocados (Ripe & Ready)',
    department: 'produce',
    shelf_life: 'fresh_weekly',
    default_unit: 'bag (4-6ct)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🥑',
    common_substitutes: [
      { name: 'Extra Virgin Olive Oil (Cold-Pressed Single Origin)', department: 'healthy_fats', default_unit: 'bottles', conversion_ratio: 0.3, reason: 'Liquid heart-healthy monounsaturated fat' },
      { name: 'Raw Organic Almonds & Walnuts', department: 'healthy_fats', default_unit: 'bags', conversion_ratio: 0.4, reason: 'Whole-food healthy fat crunch' },
    ],
  },
  {
    id: 'g_sweet_potatoes_garnet',
    name: 'Organic Garnet / Jewel Sweet Potatoes',
    department: 'produce',
    shelf_life: 'pantry_monthly',
    default_unit: 'lbs',
    default_quantity: 3,
    store_tags: ['costco', 'trader_joes', 'supermarket', 'farmers_market'],
    icon_emoji: '🍠',
    common_substitutes: [
      { name: 'Japanese Sweet Potatoes (Murasaki)', department: 'produce', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Creamy white flesh with sweet chestnut flavor' },
      { name: 'Yukon Gold Baby Potatoes', department: 'produce', default_unit: 'bags (3lb)', conversion_ratio: 1.0, reason: 'Naturally buttery yellow potatoes rich in potassium' },
      { name: 'Butternut Squash Cubes', department: 'produce', default_unit: 'lbs', conversion_ratio: 1.2, reason: 'Lower-carb sweet squash alternative' },
    ],
  },
  {
    id: 'g_bell_peppers_trio',
    name: 'Tri-Color Bell Peppers (Red, Yellow, Orange)',
    department: 'produce',
    shelf_life: 'fresh_weekly',
    default_unit: 'bags (3ct)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🫑',
    common_substitutes: [
      { name: 'Poblano Peppers', department: 'produce', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Mild, smoky pepper for fajitas and stir-fries' },
      { name: 'Zucchini & Yellow Summer Squash', department: 'produce', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Tender hydrating vegetable medley' },
    ],
  },
  {
    id: 'g_berries_organic_strawberries',
    name: 'Organic Fresh Strawberries & Blueberries',
    department: 'produce',
    shelf_life: 'fresh_weekly',
    default_unit: 'containers',
    default_quantity: 2,
    store_tags: ['costco', 'trader_joes', 'supermarket', 'farmers_market'],
    icon_emoji: '🍓',
    common_substitutes: [
      { name: 'Frozen Wild Organic Blueberries', department: 'frozen', default_unit: 'bags', conversion_ratio: 1.0, reason: '2x the anthocyanin antioxidant density' },
      { name: 'Fresh Organic Blackberries / Raspberries', department: 'produce', default_unit: 'containers', conversion_ratio: 1.0, reason: 'High-fiber lower-sugar berry alternative' },
    ],
  },

  // =========================================================================
  // 4. COMPLEX CARBS & GRAINS
  // =========================================================================
  {
    id: 'g_organic_rolled_oats',
    name: 'Organic Rolled / Sprouted Oats (Gluten-Free)',
    department: 'grains_bakery',
    shelf_life: 'pantry_monthly',
    default_unit: 'bags (32oz)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🥣',
    common_substitutes: [
      { name: 'Steel-Cut Oats', department: 'grains_bakery', default_unit: 'bags', conversion_ratio: 1.0, reason: 'Nutty, whole oat groats with lowest glycemic index' },
      { name: 'Cream of Rice Cereal', department: 'grains_bakery', default_unit: 'boxes', conversion_ratio: 1.0, reason: 'Fast-digesting, ultra-gentle pre-workout carb' },
      { name: 'Organic Quinoa (Tri-Color)', department: 'grains_bakery', default_unit: 'bags', conversion_ratio: 1.0, reason: 'Complete amino acid grain-like seed' },
    ],
  },
  {
    id: 'g_jasmine_rice',
    name: 'Thai Jasmine White Rice / Basmati',
    department: 'grains_bakery',
    shelf_life: 'pantry_monthly',
    default_unit: 'bags (5lb)',
    default_quantity: 1,
    store_tags: ['costco', 'supermarket', 'trader_joes'],
    icon_emoji: '🍚',
    common_substitutes: [
      { name: 'Organic Brown Jasmine Rice', department: 'grains_bakery', default_unit: 'bags', conversion_ratio: 1.0, reason: 'Higher micronutrient and fiber whole grain' },
      { name: 'Organic Quinoa (Tri-Color)', department: 'grains_bakery', default_unit: 'bags', conversion_ratio: 1.0, reason: 'Higher protein, mineral-dense alternative' },
      { name: 'Organic Garnet / Jewel Sweet Potatoes', department: 'produce', default_unit: 'lbs', conversion_ratio: 2.5, reason: 'Whole-food root vegetable carb' },
    ],
  },
  {
    id: 'g_sourdough_bread',
    name: 'Artisan Wild-Fermented Sourdough Bread',
    department: 'grains_bakery',
    shelf_life: 'fresh_weekly',
    default_unit: 'loaves',
    default_quantity: 1,
    store_tags: ['farmers_market', 'supermarket', 'trader_joes'],
    icon_emoji: '🍞',
    common_substitutes: [
      { name: 'Ezekiel 4:9 Sprouted Grain Bread', department: 'grains_bakery', default_unit: 'loaves', conversion_ratio: 1.0, reason: 'Zero flour, complete sprouted plant protein' },
      { name: 'Gluten-Free Seed Bread', department: 'grains_bakery', default_unit: 'loaves', conversion_ratio: 1.0, reason: '100% gluten-free allergen-friendly' },
    ],
  },

  // =========================================================================
  // 5. HEALTHY FATS, NUTS & OILS
  // =========================================================================
  {
    id: 'g_evoo_single_origin',
    name: 'Extra Virgin Olive Oil (Cold-Pressed Single Origin)',
    department: 'healthy_fats',
    shelf_life: 'pantry_monthly',
    default_unit: 'bottles (750ml)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🫒',
    common_substitutes: [
      { name: 'Pure Avocado Oil (Chosen Foods)', department: 'healthy_fats', default_unit: 'bottles', conversion_ratio: 1.0, reason: 'High smoke-point (500°F) for searing and roasting' },
      { name: 'Grass-Fed Ghee (Clarified Butter)', department: 'healthy_fats', default_unit: 'jars', conversion_ratio: 0.9, reason: 'Lactose-free rich cooking fat with butyrate' },
    ],
  },
  {
    id: 'g_raw_almonds_walnuts',
    name: 'Raw Organic Almonds & Walnuts',
    department: 'healthy_fats',
    shelf_life: 'pantry_monthly',
    default_unit: 'bags (16oz)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🥜',
    common_substitutes: [
      { name: 'Raw Pumpkin Seeds (Pepitas)', department: 'healthy_fats', default_unit: 'bags', conversion_ratio: 1.0, reason: 'Zinc and magnesium powerhouse, nut-allergy safe' },
      { name: 'Organic Chia & Flaxseeds', department: 'healthy_fats', default_unit: 'bags', conversion_ratio: 0.8, reason: 'Omega-3 ALA and soluble fiber powerhouse' },
    ],
  },
  {
    id: 'g_natural_peanut_butter',
    name: 'All-Natural Peanut Butter (Ingredients: Peanuts, Salt)',
    department: 'healthy_fats',
    shelf_life: 'pantry_monthly',
    default_unit: 'jars (16oz)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🍯',
    common_substitutes: [
      { name: 'Raw Creamy Almond Butter', department: 'healthy_fats', default_unit: 'jars', conversion_ratio: 1.0, reason: 'Rich in vitamin E and monounsaturated fats' },
      { name: 'Sunflower Seed Butter (SunButter)', department: 'healthy_fats', default_unit: 'jars', conversion_ratio: 1.0, reason: '100% peanut and tree nut allergy safe' },
    ],
  },

  // =========================================================================
  // 6. PANTRY STAPLES & SEASONINGS
  // =========================================================================
  {
    id: 'g_organic_bone_broth',
    name: 'Organic Grass-Fed Beef or Chicken Bone Broth',
    department: 'pantry_spices',
    shelf_life: 'pantry_monthly',
    default_unit: 'cartons (32oz)',
    default_quantity: 2,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🥣',
    common_substitutes: [
      { name: 'Low-Sodium Organic Vegetable Broth', department: 'pantry_spices', default_unit: 'cartons', conversion_ratio: 1.0, reason: 'Plant-based savory cooking stock' },
    ],
  },
  {
    id: 'g_redmonds_real_salt',
    name: "Redmond Real Salt / Himalayan Pink Sea Salt",
    department: 'pantry_spices',
    shelf_life: 'pantry_monthly',
    default_unit: 'pouch (26oz)',
    default_quantity: 1,
    store_tags: ['supermarket', 'costco'],
    icon_emoji: '🧂',
    common_substitutes: [
      { name: 'Flaky Maldon Sea Salt', department: 'pantry_spices', default_unit: 'boxes', conversion_ratio: 1.0, reason: 'Crisp finishing salt crystals' },
    ],
  },
  {
    id: 'g_raw_unfiltered_honey',
    name: 'Raw Unfiltered Local Honey',
    department: 'pantry_spices',
    shelf_life: 'pantry_monthly',
    default_unit: 'jars (16oz)',
    default_quantity: 1,
    store_tags: ['farmers_market', 'supermarket', 'costco'],
    icon_emoji: '🍯',
    common_substitutes: [
      { name: 'Pure Grade A Vermont Maple Syrup', department: 'pantry_spices', default_unit: 'bottles', conversion_ratio: 1.0, reason: 'Low-fructose pure tree nectar sweetener' },
    ],
  },

  // =========================================================================
  // 7. FROZEN NUTRITION
  // =========================================================================
  {
    id: 'g_frozen_wild_blueberries',
    name: 'Frozen Wild Organic Blueberries',
    department: 'frozen',
    shelf_life: 'pantry_monthly',
    default_unit: 'bags (3lb)',
    default_quantity: 1,
    store_tags: ['costco', 'trader_joes', 'supermarket'],
    icon_emoji: '🫐',
    common_substitutes: [
      { name: 'Frozen Organic Triple Berry Medley', department: 'frozen', default_unit: 'bags', conversion_ratio: 1.0, reason: 'Raspberries, blackberries and blueberries mix' },
      { name: 'Organic Fresh Strawberries & Blueberries', department: 'produce', default_unit: 'containers', conversion_ratio: 1.0, reason: 'Fresh seasonal berries' },
    ],
  },
  {
    id: 'g_frozen_shelled_edamame',
    name: 'Frozen Organic Shelled Edamame',
    department: 'frozen',
    shelf_life: 'pantry_monthly',
    default_unit: 'bags (16oz)',
    default_quantity: 2,
    store_tags: ['trader_joes', 'costco', 'supermarket'],
    icon_emoji: '🫛',
    common_substitutes: [
      { name: 'Organic High-Protein Extra-Firm Tofu', department: 'meat_seafood', default_unit: 'blocks', conversion_ratio: 1.0, reason: 'High-protein soy staple' },
    ],
  },

  // =========================================================================
  // 8. SUPPLEMENTS & PERFORMANCE
  // =========================================================================
  {
    id: 'g_whey_isolate_vanilla',
    name: '100% Grass-Fed Whey Protein Isolate (Vanilla / Unflavored)',
    department: 'supplements',
    shelf_life: 'pantry_monthly',
    default_unit: 'tubs (2lb)',
    default_quantity: 1,
    store_tags: ['costco', 'supermarket'],
    icon_emoji: '🥤',
    common_substitutes: [
      { name: 'Plant-Based Pea & Brown Rice Protein Powder', department: 'supplements', default_unit: 'tubs', conversion_ratio: 1.0, reason: '100% vegan dairy-free complete protein' },
      { name: 'Hydrolyzed Collagen Peptides', department: 'supplements', default_unit: 'tubs', conversion_ratio: 1.0, reason: 'Joint, ligament and tendon support protein' },
    ],
  },
  {
    id: 'g_creatine_monohydrate',
    name: 'Pure Micronized Creatine Monohydrate (Creapure®)',
    department: 'supplements',
    shelf_life: 'pantry_monthly',
    default_unit: 'tubs (500g)',
    default_quantity: 1,
    store_tags: ['supermarket', 'costco'],
    icon_emoji: '⚡',
    common_substitutes: [
      { name: 'Grass-Fed Ground Beef (85/15 or 90/10)', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 2.0, reason: 'Natural whole-food source of dietary creatine' },
    ],
  },
  {
    id: 'g_electrolytes_packet',
    name: 'LMNT / Raw Unflavored Electrolyte Drink Mix (Sodium, Potassium, Magnesium)',
    department: 'supplements',
    shelf_life: 'pantry_monthly',
    default_unit: 'boxes (30ct)',
    default_quantity: 1,
    store_tags: ['supermarket'],
    icon_emoji: '💧',
    common_substitutes: [
      { name: 'Unsweetened Vanilla Almond Milk', department: 'dairy_eggs', default_unit: 'cartons', conversion_ratio: 1.0, reason: 'Fortified mineral drink base' },
    ],
  },
];

/**
 * Helper to get direct substitutes for any item name or catalog item
 */
export function getSmartSubstitutesForItem(
  itemName: string
): SmartGrocerySubstitute[] {
  const match = MASTER_GROCERY_DATABASE.find(
    (c) =>
      c.name.toLowerCase().includes(itemName.toLowerCase()) ||
      itemName.toLowerCase().includes(c.name.toLowerCase())
  );

  if (match && match.common_substitutes && match.common_substitutes.length > 0) {
    return match.common_substitutes;
  }

  // Fallback: department-level suggestions
  return [
    { name: 'Boneless Skinless Chicken Breast', department: 'meat_seafood', default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Lean protein baseline staple' },
    { name: 'Plain Non-Fat / Low-Fat Greek Yogurt', department: 'dairy_eggs', default_unit: 'tubs', conversion_ratio: 1.0, reason: 'Probiotic protein staple' },
    { name: 'Thai Jasmine White Rice / Basmati', department: 'grains_bakery', default_unit: 'bags', conversion_ratio: 1.0, reason: 'Clean complex carbohydrate' },
  ];
}

/**
 * Generate a complete requisition list based on current active food database or daily targets
 */
export function generateSmartGroceryRequisition(
  multiplier: number = 1
): GroceryItem[] {
  const defaultItems: Omit<GroceryItem, 'id'>[] = [
    {
      item_name: 'Boneless Skinless Chicken Breast',
      category: 'fresh_weekly',
      department: 'meat_seafood',
      quantity: 3 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'costco',
      notes: 'Lean protein base for weekly meal prep',
    },
    {
      item_name: 'Wild Alaskan Salmon Fillets',
      category: 'fresh_weekly',
      department: 'meat_seafood',
      quantity: 1.5 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'supermarket',
      notes: 'Omega-3 fatty acids for heart and brain recovery',
    },
    {
      item_name: 'Pasture-Raised Organic Eggs',
      category: 'fresh_weekly',
      department: 'dairy_eggs',
      quantity: 2 * multiplier,
      unit: 'cartons',
      is_checked: false,
      in_pantry: false,
      store_tag: 'costco',
      notes: 'Choline, lutein and whole bioavailable protein',
    },
    {
      item_name: 'Plain Non-Fat / Low-Fat Greek Yogurt',
      category: 'fresh_weekly',
      department: 'dairy_eggs',
      quantity: 2 * multiplier,
      unit: 'tubs (32oz)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'trader_joes',
      notes: 'Probiotic digestion and slow-release casein',
    },
    {
      item_name: 'Organic Baby Spinach (Pre-Washed)',
      category: 'fresh_weekly',
      department: 'produce',
      quantity: 1 * multiplier,
      unit: 'clamshells (16oz)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'supermarket',
      notes: 'Magnesium and micronutrient foundation',
    },
    {
      item_name: 'Organic Broccoli Crowns',
      category: 'fresh_weekly',
      department: 'produce',
      quantity: 2 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'costco',
      notes: 'Sulforaphane cruciferous vegetable',
    },
    {
      item_name: 'Hass Avocados (Ripe & Ready)',
      category: 'fresh_weekly',
      department: 'produce',
      quantity: 1 * multiplier,
      unit: 'bag (5ct)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'costco',
      notes: 'Monounsaturated oleic acid',
    },
    {
      item_name: 'Organic Garnet / Jewel Sweet Potatoes',
      category: 'fresh_weekly',
      department: 'produce',
      quantity: 3 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'supermarket',
      notes: 'Slow-burning beta-carotene carbs',
    },
    {
      item_name: 'Organic Rolled / Sprouted Oats (Gluten-Free)',
      category: 'pantry_monthly',
      department: 'grains_bakery',
      quantity: 1 * multiplier,
      unit: 'bags (32oz)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'costco',
      notes: 'Beta-glucan soluble fiber',
    },
    {
      item_name: 'Thai Jasmine White Rice / Basmati',
      category: 'pantry_monthly',
      department: 'grains_bakery',
      quantity: 1 * multiplier,
      unit: 'bags (5lb)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'costco',
      notes: 'Clean glycogen replenishment',
    },
    {
      item_name: 'Extra Virgin Olive Oil (Cold-Pressed Single Origin)',
      category: 'pantry_monthly',
      department: 'healthy_fats',
      quantity: 1,
      unit: 'bottles (750ml)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'trader_joes',
      notes: 'High polyphenol daily finishing oil',
    },
    {
      item_name: 'Frozen Wild Organic Blueberries',
      category: 'pantry_monthly',
      department: 'frozen',
      quantity: 1 * multiplier,
      unit: 'bags (3lb)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'costco',
      notes: 'Anthocyanin antioxidant powerhouse for shakes',
    },
  ];

  return defaultItems.map((item, idx) => ({
    ...item,
    id: `gi-init-${Date.now()}-${idx + 1}`,
  }));
}
