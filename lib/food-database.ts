import { FoodCategory, FoodSubCategoryMeta, FoodItem } from './types';
import { buildMasterFoodDatabase } from './foods/catalog-generator';

export interface FoodCategoryMeta {
  id: FoodCategory;
  name: string;
  shortLabel: string;
  icon: string;
  description: string;
  accentColor: string;
}

export function normalizeFoodCategory(category: string): FoodCategory {
  switch (category) {
    case 'protein':
      return 'poultry_meat';
    case 'carbohydrate':
      return 'grains_carbs';
    case 'fruit':
      return 'fruits';
    case 'vegetable':
      return 'vegetables';
    case 'healthy_fat':
      return 'nuts_fats_oils';
    case 'dairy_alternative':
      return 'dairy_eggs';
    case 'beverage':
      return 'beverages_hydration';
    case 'pantry_staple':
      return 'snacks_pantry';
    default:
      return (category as FoodCategory) || 'snacks_pantry';
  }
}

export const FOOD_CATEGORIES: FoodCategoryMeta[] = [
  {
    id: 'poultry_meat',
    name: 'Poultry & Lean Meats',
    shortLabel: 'Poultry & Meat',
    icon: '🍗',
    description: 'Chicken, turkey, beef steaks, lean ground meats, pork tenderloin & game',
    accentColor: '#f97316',
  },
  {
    id: 'fish_seafood',
    name: 'Fish & Seafood',
    shortLabel: 'Fish & Seafood',
    icon: '🐟',
    description: 'Wild salmon, cod, tuna, shrimp, halibut, tilapia, scallops & crab',
    accentColor: '#06b6d4',
  },
  {
    id: 'dairy_eggs',
    name: 'Eggs, Dairy & Plant Milks',
    shortLabel: 'Eggs & Dairy',
    icon: '🥚',
    description: 'Whole eggs, egg whites, Greek yogurt, cottage cheese, milk, cheese, sour cream & cream',
    accentColor: '#3b82f6',
  },
  {
    id: 'plant_protein',
    name: 'Plant Protein & Legumes',
    shortLabel: 'Plant Protein',
    icon: '🌱',
    description: 'Tofu, tempeh, edamame, black beans, chickpeas, lentils & seitan',
    accentColor: '#10b981',
  },
  {
    id: 'grains_carbs',
    name: 'Grains, Bread & Potatoes',
    shortLabel: 'Grains & Carbs',
    icon: '🍚',
    description: 'Rolled oats, jasmine rice, sweet potatoes, quinoa, whole grain bread & pasta',
    accentColor: '#eab308',
  },
  {
    id: 'fruits',
    name: 'Fruits & Berries',
    shortLabel: 'Fruits & Berries',
    icon: '🍓',
    description: 'Blueberries, strawberries, apples, bananas, watermelon & citrus',
    accentColor: '#ec4899',
  },
  {
    id: 'vegetables',
    name: 'Vegetables & Leafy Greens',
    shortLabel: 'Vegetables & Greens',
    icon: '🥦',
    description: 'Broccoli, spinach, asparagus, kale, bell peppers, carrots & zucchini',
    accentColor: '#22c55e',
  },
  {
    id: 'nuts_fats_oils',
    name: 'Healthy Fats, Nuts & Seeds',
    shortLabel: 'Nuts & Healthy Fats',
    icon: '🥑',
    description: 'Avocado, olive oil, almonds, walnuts, pecans, pistachios, cashews, pine nuts & seeds',
    accentColor: '#84cc16',
  },
  {
    id: 'beverages_hydration',
    name: 'Hydration & Beverages',
    shortLabel: 'Beverages',
    icon: '☕',
    description: 'Protein drinks, black coffee, green tea, sparkling water, coconut water & electrolytes',
    accentColor: '#6366f1',
  },
  {
    id: 'snacks_pantry',
    name: 'Pantry Staples & Snacks',
    shortLabel: 'Pantry & Snacks',
    icon: '🍯',
    description: 'Protein bars, whey powders, rice cakes, honey, hummus, salsa, mustard & spices',
    accentColor: '#a855f7',
  },
];

export const FOOD_SUB_CATEGORIES: FoodSubCategoryMeta[] = [
  // 1. Poultry & Meats
  { id: 'chicken', parentId: 'poultry_meat', name: 'Chicken Cuts & Preps', icon: '🐔', description: 'Breasts, thighs, tenders, rotisserie & lean cuts' },
  { id: 'turkey', parentId: 'poultry_meat', name: 'Turkey & Ground Turkey', icon: '🦃', description: 'Lean ground turkey, cutlets & roast breast' },
  { id: 'beef', parentId: 'poultry_meat', name: 'Beef Steaks & Lean Roasts', icon: '🥩', description: 'Sirloin, tenderloin, flank & top round steaks' },
  { id: 'ground_meats', parentId: 'poultry_meat', name: 'Lean Ground Meats', icon: '🍔', description: '96/4, 90/10 beef, ground bison & pork' },
  { id: 'pork', parentId: 'poultry_meat', name: 'Lean Pork Cuts', icon: '🐖', description: 'Pork tenderloin, loin chops & Canadian bacon' },
  { id: 'game_lamb', parentId: 'poultry_meat', name: 'Bison, Lamb & Game', icon: '🦬', description: 'Bison sirloin, venison, lamb loin & elk' },
  { id: 'deli_meats', parentId: 'poultry_meat', name: 'Deli & Prepared Meats', icon: '🥓', description: 'Oven-roasted deli turkey, roast beef & ham' },

  // 2. Fish & Seafood
  { id: 'salmon_trout', parentId: 'fish_seafood', name: 'Salmon & Fatty Fish', icon: '🐟', description: 'Wild Atlantic, sockeye, king salmon & trout' },
  { id: 'white_fish', parentId: 'fish_seafood', name: 'Lean White Fish', icon: '🐟', description: 'Cod, halibut, tilapia, haddock & mahi mahi' },
  { id: 'tuna_swordfish', parentId: 'fish_seafood', name: 'Tuna & Fresh Steaks', icon: '🐟', description: 'Yellowfin ahi tuna, albacore & swordfish' },
  { id: 'shrimp_shellfish', parentId: 'fish_seafood', name: 'Shrimp & Prawns', icon: '🦐', description: 'Jumbo white shrimp, tiger prawns & pink shrimp' },
  { id: 'scallops_crab_lobster', parentId: 'fish_seafood', name: 'Scallops, Crab & Lobster', icon: '🦪', description: 'Sea scallops, king crab, lobster tail & clams' },
  { id: 'canned_seafood', parentId: 'fish_seafood', name: 'Canned & Preserved Fish', icon: '🥫', description: 'Canned tuna in water, wild sardines & mackerel' },

  // 3. Dairy, Eggs & Plant Milks
  { id: 'eggs', parentId: 'dairy_eggs', name: 'Whole Eggs & Egg Whites', icon: '🥚', description: 'Pasture eggs, liquid egg whites & boiled eggs' },
  { id: 'greek_yogurt', parentId: 'dairy_eggs', name: 'Greek Yogurt & Skyr', icon: '🥣', description: '0% Nonfat, 2% Low-fat Greek yogurt & Icelandic skyr' },
  { id: 'cottage_cheese', parentId: 'dairy_eggs', name: 'Cottage Cheese', icon: '🥣', description: 'Low-fat 2%, 4% whole milk & nonfat cottage cheese' },
  { id: 'cheeses', parentId: 'dairy_eggs', name: 'Cheeses & Hard Cheeses', icon: '🧀', description: 'Cheddar, mozzarella, Swiss, provolone, cream cheese, feta & parmesan' },
  { id: 'dairy_milks', parentId: 'dairy_eggs', name: 'Dairy & Filtered Milks', icon: '🥛', description: 'Whole, 2%, skim, Fairlife, sour cream, heavy whipping cream & buttermilk' },
  { id: 'plant_milks', parentId: 'dairy_eggs', name: 'Plant-Based Milks', icon: '🥛', description: 'Unsweetened almond milk, oat milk & soy milk' },

  // 4. Plant Protein & Legumes
  { id: 'tofu_tempeh', parentId: 'plant_protein', name: 'Tofu, Tempeh & Edamame', icon: '🥢', description: 'Extra firm tofu, soy tempeh & steamed edamame' },
  { id: 'beans', parentId: 'plant_protein', name: 'Black Beans & Legumes', icon: '🫘', description: 'Cooked black beans, pinto, kidney & cannellini' },
  { id: 'chickpeas_lentils', parentId: 'plant_protein', name: 'Chickpeas & Lentils', icon: '🥣', description: 'Garbanzo chickpeas, red, brown & green lentils' },
  { id: 'seitan_wheat', parentId: 'plant_protein', name: 'Seitan & Wheat Protein', icon: '🌾', description: 'Organic seitan strips, wheat gluten & grounds' },
  { id: 'super_plant_proteins', parentId: 'plant_protein', name: 'Super Seeds & Yeast', icon: '🌿', description: 'Nutritional yeast flakes, hemp hearts & spirulina' },

  // 5. Grains, Bread & Starchy Carbs
  { id: 'oats_cereals', parentId: 'grains_carbs', name: 'Oats & Hot Cereals', icon: '🥣', description: 'Rolled oats, steel-cut oats, cream of rice & oat bran' },
  { id: 'rice_grains', parentId: 'grains_carbs', name: 'Rice, Quinoa & Grains', icon: '🍚', description: 'Jasmine rice, brown basmati, quinoa & farro' },
  { id: 'potatoes_yams', parentId: 'grains_carbs', name: 'Potatoes & Sweet Yams', icon: '🥔', description: 'Sweet potatoes, russet, red bliss & butternut squash' },
  { id: 'breads_toast', parentId: 'grains_carbs', name: 'Artisan & Sourdough Breads', icon: '🍞', description: 'Sourdough, Ezekiel sprouted bread & bagel thins' },
  { id: 'pastas_noodles', parentId: 'grains_carbs', name: 'Pastas & Healthy Noodles', icon: '🍝', description: 'Whole wheat pasta, chickpea pasta & soba noodles' },
  { id: 'tortillas_wraps', parentId: 'grains_carbs', name: 'Tortillas & Flatbreads', icon: '🌮', description: 'Yellow corn tortillas, whole wheat wraps & pitas' },

  // 6. Fruits & Berries
  { id: 'berries', parentId: 'fruits', name: 'Berries & Super Berries', icon: '🫐', description: 'Blueberries, strawberries, raspberries & blackberries' },
  { id: 'orchard_fruits', parentId: 'fruits', name: 'Apples, Pears & Stone Fruit', icon: '🍎', description: 'Honeycrisp apples, pears, peaches & sweet cherries' },
  { id: 'tropical_fruits', parentId: 'fruits', name: 'Tropical Fruits & Bananas', icon: '🍌', description: 'Bananas, pineapple, mango, papaya & kiwi' },
  { id: 'melons', parentId: 'fruits', name: 'Melons & High-Water Fruit', icon: '🍉', description: 'Watermelon, cantaloupe & honeydew melon' },
  { id: 'citrus_fruits', parentId: 'fruits', name: 'Citrus Fruits', icon: '🍊', description: 'Navel oranges, clementines, grapefruit & lemons' },
  { id: 'grapes_figs', parentId: 'fruits', name: 'Grapes & Figs', icon: '🍇', description: 'Red seedless grapes, black mission figs & dates' },

  // 7. Vegetables & Leafy Greens
  { id: 'cruciferous_veg', parentId: 'vegetables', name: 'Cruciferous Vegetables', icon: '🥦', description: 'Broccoli, cauliflower, Brussels sprouts & cabbage' },
  { id: 'leafy_greens', parentId: 'vegetables', name: 'Leafy Salad Greens & Spinach', icon: '🥬', description: 'Baby spinach, kale, arugula, romaine & chard' },
  { id: 'root_veg', parentId: 'vegetables', name: 'Root Vegetables & Carrots', icon: '🥕', description: 'Carrots, red beets, radishes & parsnips' },
  { id: 'nightshades', parentId: 'vegetables', name: 'Peppers & Tomatoes', icon: '🫑', description: 'Bell peppers, cherry tomatoes & jalapeños' },
  { id: 'crisp_veg', parentId: 'vegetables', name: 'Crisp Vegetables & Asparagus', icon: '🥒', description: 'Cucumbers, asparagus, celery, zucchini & green beans' },
  { id: 'mushrooms_alliums', parentId: 'vegetables', name: 'Mushrooms & Alliums', icon: '🍄', description: 'Cremini mushrooms, white button, onions & garlic' },

  // 8. Healthy Fats, Nuts & Seeds
  { id: 'avocados_olives', parentId: 'nuts_fats_oils', name: 'Avocados & Olives', icon: '🥑', description: 'Hass avocados, Kalamata olives & fresh guacamole' },
  { id: 'whole_nuts', parentId: 'nuts_fats_oils', name: 'Whole Tree Nuts & Peanuts', icon: '🥜', description: 'Almonds, walnuts, cashews, pistachios, pecans, peanuts & pine nuts' },
  { id: 'nut_butters', parentId: 'nuts_fats_oils', name: 'Natural Nut & Seed Butters', icon: '🥜', description: 'Peanut butter, almond butter & tahini' },
  { id: 'super_seeds', parentId: 'nuts_fats_oils', name: 'Super Seeds', icon: '🌻', description: 'Chia seeds, flaxseed meal, pumpkin & hemp seeds' },
  { id: 'healthy_oils', parentId: 'nuts_fats_oils', name: 'Cold-Pressed Oils & Ghee', icon: '🫒', description: 'Extra virgin olive oil, avocado oil & coconut oil' },

  // 9. Hydration & Beverages
  { id: 'coffee_espresso', parentId: 'beverages_hydration', name: 'Coffee & Espresso', icon: '☕', description: 'Black drip coffee, cold brew & double espresso' },
  { id: 'teas_infusions', parentId: 'beverages_hydration', name: 'Teas & Herbal Infusions', icon: '🍵', description: 'Green tea, matcha, black tea & chamomile' },
  { id: 'waters_sparkling', parentId: 'beverages_hydration', name: 'Sparkling & Mineral Waters', icon: '💧', description: 'Sparkling water, seltzer & San Pellegrino' },
  { id: 'functional_hydration', parentId: 'beverages_hydration', name: 'Electrolytes & Coconut Water', icon: '🥥', description: 'Pure coconut water & zero-sugar electrolyte hydrators' },
  { id: 'protein_drinks', parentId: 'beverages_hydration', name: 'Ready-to-Drink Protein Shakes', icon: '🥤', description: 'Core Power, Premier Protein, Atkins, Muscle Milk & OWYN shakes' },

  // 10. Pantry Staples & Snacks
  { id: 'protein_powders', parentId: 'snacks_pantry', name: 'Protein Powders & Supplements', icon: '🥤', description: '100% Whey isolate, casein & plant protein' },
  { id: 'protein_bars', parentId: 'snacks_pantry', name: 'Protein Bars & Snacks', icon: '🍫', description: 'FitCrunch, Atkins, Quest, Barebells, ONE, Built & Pure Protein bars' },
  { id: 'rice_cakes_snacks', parentId: 'snacks_pantry', name: 'Rice Cakes & Crispbreads', icon: '🍘', description: 'Organic plain rice cakes & whole grain crackers' },
  { id: 'condiments_sauces', parentId: 'snacks_pantry', name: 'Sauces, Salsas & Mustards', icon: '🌶️', description: 'Fresh salsa, Dijon mustard, hot sauce & balsamic' },
  { id: 'natural_sweeteners', parentId: 'snacks_pantry', name: 'Natural Honey & Maple Syrup', icon: '🍯', description: 'Raw wildflower honey, pure maple syrup & stevia' },
  { id: 'spices_seasonings', parentId: 'snacks_pantry', name: 'Spices & Pure Cocoa', icon: '🌿', description: 'Ceylon cinnamon, turmeric, cocoa powder & dark chocolate' },
];

export const COMPREHENSIVE_FOOD_DATABASE: FoodItem[] = buildMasterFoodDatabase();
