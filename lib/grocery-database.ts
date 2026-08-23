import {
  GroceryDepartment,
  GroceryStoreTag,
  GroceryItem,
  NamedGroceryList,
  FoodItem,
  FoodCategory,
  SmartGrocerySubstitute,
  CatalogGroceryItem,
} from './types';
import { FOOD_CATEGORIES } from './food-database';
import { buildMasterFoodDatabase } from './foods/catalog-generator';

export const GROCERY_DEPARTMENTS: {
  id: FoodCategory;
  label: string;
  icon: string;
  description: string;
}[] = FOOD_CATEGORIES.map((cat) => ({
  id: cat.id,
  label: cat.name,
  icon: cat.icon,
  description: cat.description,
}));

export const GROCERY_STORE_TAGS: { id: GroceryStoreTag; label: string; icon: string }[] = [
  { id: 'all', label: 'All Stores', icon: '🏬' },
  { id: 'sams_club', label: "Sam's Club", icon: '📦' },
  { id: 'aldi', label: 'Aldi', icon: '🛒' },
  { id: 'meijer', label: 'Meijer', icon: '🏷️' },
  { id: 'supermarket', label: 'Local Supermarket', icon: '🏪' },
  { id: 'farmers_market', label: 'Farmers Market', icon: '🌱' },
];

export const DEFAULT_NAMED_LISTS: NamedGroceryList[] = [
  { id: 'main', name: 'Weekly Essentials', description: 'Primary 7-day grocery run for home meal preparation', icon: '🛒' },
  { id: 'sams_club_bulk', name: "Sam's Club Bulk Run", description: 'Monthly bulk items (poultry, oats, eggs, rice, olive oil)', icon: '📦' },
  { id: 'aldi_run', name: 'Aldi Smart Run', description: 'Staples, organic produce, dairy, and weekly specials', icon: '🛒' },
  { id: 'meijer_run', name: 'Meijer Weekly Run', description: 'Fresh meats, pantry essentials, and produce selection', icon: '🏷️' },
  { id: 'prep_day', name: 'Sunday Meal Prep Requisition', description: 'Batch ingredients needed for 3-4 days of pre-cooked macros', icon: '🍱' },
];

/**
 * Assign appropriate store tags based on food category and storage type
 */
function assignStoreTags(food: FoodItem): GroceryStoreTag[] {
  const tags: GroceryStoreTag[] = [];
  if (food.storage_type === 'pantry_monthly' || food.category === 'poultry_meat' || food.category === 'grains_carbs') {
    tags.push('sams_club');
  }
  if (food.category === 'fruits' || food.category === 'vegetables' || food.category === 'dairy_eggs') {
    tags.push('aldi');
    tags.push('meijer');
  } else {
    tags.push('meijer');
  }
  if (food.category === 'fruits' || food.category === 'vegetables') {
    tags.push('farmers_market');
  }
  return tags.length > 0 ? tags : ['supermarket'];
}

/**
 * Build Master Grocery Catalog directly from the complete master food database (1000+ foods)
 */
const ALL_FOODS_DATA: FoodItem[] = buildMasterFoodDatabase();

export const MASTER_GROCERY_DATABASE: CatalogGroceryItem[] = ALL_FOODS_DATA.map((food) => {
  // Find up to 4 substitutes from the same category or swap_group
  const substitutes: SmartGrocerySubstitute[] = ALL_FOODS_DATA
    .filter((f) => f.id !== food.id && (f.swap_group === food.swap_group || f.category === food.category))
    .slice(0, 4)
    .map((sub) => {
      const ratio = food.protein_per_100g > 0 && sub.protein_per_100g > 0
        ? Number((food.protein_per_100g / sub.protein_per_100g).toFixed(2))
        : 1.0;
      return {
        name: sub.name,
        department: sub.category as any,
        default_unit: sub.default_unit || 'g',
        conversion_ratio: ratio,
        reason: sub.swap_group ? `Same swap group (${sub.swap_group})` : `Category alternative (${sub.category.replace('_', ' ')})`,
      };
    });

  const categoryMeta = FOOD_CATEGORIES.find((c) => c.id === food.category);

  return {
    id: `g_${food.id}`,
    name: food.name,
    department: food.category as any,
    shelf_life: food.storage_type || 'fresh_weekly',
    default_unit: food.default_unit || 'g',
    default_quantity: food.serving_size_g ? Math.round(food.serving_size_g * 2) : 200,
    store_tags: assignStoreTags(food),
    calories_per_serving: food.calories_per_100g,
    protein_g: food.protein_per_100g,
    carbs_g: food.carbs_per_100g,
    fat_g: food.fat_per_100g,
    common_substitutes: substitutes,
    icon_emoji: categoryMeta?.icon || '🛒',
  };
});

/**
 * Helper to get direct substitutes for any item name from the food database
 */
export function getSmartSubstitutesForItem(
  itemName: string,
  foodDatabase: FoodItem[] = ALL_FOODS_DATA
): SmartGrocerySubstitute[] {
  const match = foodDatabase.find(
    (f) =>
      f.name.toLowerCase().includes(itemName.toLowerCase()) ||
      itemName.toLowerCase().includes(f.name.toLowerCase())
  );

  if (match) {
    const peers = foodDatabase
      .filter((f) => f.id !== match.id && (f.swap_group === match.swap_group || f.category === match.category))
      .slice(0, 4);

    if (peers.length > 0) {
      return peers.map((p) => {
        const ratio = match.protein_per_100g > 0 && p.protein_per_100g > 0
          ? Number((match.protein_per_100g / p.protein_per_100g).toFixed(2))
          : 1.0;
        return {
          name: p.name,
          department: p.category as any,
          default_unit: p.default_unit || 'g',
          conversion_ratio: ratio,
          reason: `Macro match: ${p.protein_per_100g}g P / ${p.calories_per_100g} kcal per 100g`,
        };
      });
    }
  }

  // Fallback
  return [
    { name: 'Boneless Skinless Chicken Breast', department: 'poultry_meat' as any, default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Lean protein staple' },
    { name: 'Plain Greek Yogurt', department: 'dairy_eggs' as any, default_unit: 'tubs', conversion_ratio: 1.0, reason: 'Probiotic protein staple' },
    { name: 'Jasmine White Rice', department: 'grains_carbs' as any, default_unit: 'lbs', conversion_ratio: 1.0, reason: 'Complex carbohydrate staple' },
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
      department: 'poultry_meat' as any,
      quantity: 3 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'sams_club',
      notes: 'Lean poultry base for weekly meal prep',
    },
    {
      item_name: 'Wild Alaskan Salmon Fillets',
      category: 'fresh_weekly',
      department: 'fish_seafood' as any,
      quantity: 1.5 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'meijer',
      notes: 'Omega-3 fatty acids for heart and recovery',
    },
    {
      item_name: 'Pasture-Raised Organic Eggs',
      category: 'fresh_weekly',
      department: 'dairy_eggs' as any,
      quantity: 2 * multiplier,
      unit: 'cartons',
      is_checked: false,
      in_pantry: false,
      store_tag: 'aldi',
      notes: 'Whole bioavailable protein & choline',
    },
    {
      item_name: 'Plain Non-Fat Greek Yogurt',
      category: 'fresh_weekly',
      department: 'dairy_eggs' as any,
      quantity: 2 * multiplier,
      unit: 'tubs (32oz)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'aldi',
      notes: 'Probiotic digestion and casein protein',
    },
    {
      item_name: 'Organic Baby Spinach (Pre-Washed)',
      category: 'fresh_weekly',
      department: 'vegetables' as any,
      quantity: 1 * multiplier,
      unit: 'clamshells (16oz)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'meijer',
      notes: 'Micronutrients and minerals foundation',
    },
    {
      item_name: 'Organic Broccoli Crowns',
      category: 'fresh_weekly',
      department: 'vegetables' as any,
      quantity: 2 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'aldi',
      notes: 'Cruciferous vegetable for dinner sides',
    },
    {
      item_name: 'Hass Avocados (Ripe & Ready)',
      category: 'fresh_weekly',
      department: 'nuts_fats_oils' as any,
      quantity: 1 * multiplier,
      unit: 'bag (5ct)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'aldi',
      notes: 'Monounsaturated healthy fat source',
    },
    {
      item_name: 'Garnet Sweet Potatoes',
      category: 'fresh_weekly',
      department: 'grains_carbs' as any,
      quantity: 3 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'meijer',
      notes: 'Slow-burning complex carbohydrate',
    },
    {
      item_name: 'Organic Rolled Oats',
      category: 'pantry_monthly',
      department: 'grains_carbs' as any,
      quantity: 1 * multiplier,
      unit: 'bags (32oz)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'sams_club',
      notes: 'Soluble fiber breakfast staple',
    },
    {
      item_name: 'Thai Jasmine White Rice',
      category: 'pantry_monthly',
      department: 'grains_carbs' as any,
      quantity: 1 * multiplier,
      unit: 'bags (5lb)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'sams_club',
      notes: 'Clean post-workout glycogen fuel',
    },
    {
      item_name: 'Extra Virgin Olive Oil (Cold-Pressed)',
      category: 'pantry_monthly',
      department: 'nuts_fats_oils' as any,
      quantity: 1,
      unit: 'bottles (750ml)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'meijer',
      notes: 'High polyphenol finishing oil',
    },
    {
      item_name: 'Frozen Wild Organic Blueberries',
      category: 'pantry_monthly',
      department: 'fruits' as any,
      quantity: 1 * multiplier,
      unit: 'bags (3lb)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'sams_club',
      notes: 'Anthocyanin antioxidant powerhouse',
    },
  ];

  return defaultItems.map((item, idx) => ({
    ...item,
    id: `gi-init-${Date.now()}-${idx + 1}`,
  }));
}
