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
import {
  SAMS_CLUB_PRODUCTS,
  ALDI_PRODUCTS,
  MEIJER_PRODUCTS,
  COSTCO_PRODUCTS,
  WALMART_PRODUCTS,
  StoreBrandProduct,
} from './store-products-database';

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

export const GROCERY_STORE_TAGS: { id: GroceryStoreTag; label: string; icon: string; brandSummary: string }[] = [
  { id: 'all', label: 'All Stores & Aisles', icon: '🏢', brandSummary: 'All whole foods and retail items' },
  { id: 'aldi', label: 'Aldi', icon: '🛒', brandSummary: 'Simply Nature, Friendly Farms & Specially Selected' },
  { id: 'meijer', label: 'Meijer', icon: '🏷️', brandSummary: "True Goodness & Frederik's by Meijer" },
  { id: 'sams_club', label: "Sam's Club", icon: '📦', brandSummary: "Member's Mark Wholesale & Bulk Packs" },
  { id: 'costco', label: 'Costco Wholesale', icon: '🏬', brandSummary: 'Kirkland Signature Wholesale Bulk' },
  { id: 'walmart', label: 'Walmart', icon: '🏪', brandSummary: 'Great Value & Marketside Groceries' },
  { id: 'supermarket', label: 'Local Supermarket', icon: '🏪', brandSummary: 'Standard grocery staples' },
  { id: 'farmers_market', label: 'Farmers Market', icon: '🌱', brandSummary: 'Fresh local organic produce' },
];

export const DEFAULT_NAMED_LISTS: NamedGroceryList[] = [
  { id: 'main', name: 'Weekly Essentials', description: 'Primary 7-day grocery run for home meal preparation', icon: '🛒' },
  { id: 'aldi_run', name: 'Aldi Smart Run', description: 'Simply Nature organic grass-fed beef, Greek yogurt, spinach & staples', icon: '🛒' },
  { id: 'meijer_run', name: 'Meijer Weekly Run', description: "True Goodness organics, fresh counter seafood & Frederik's artisan goods", icon: '🏷️' },
  { id: 'sams_club_bulk', name: "Sam's Club Bulk Run", description: "Member's Mark bulk chicken, beef, oats, eggs, rice, olive oil", icon: '📦' },
  { id: 'costco_bulk', name: 'Costco Wholesale Run', description: 'Kirkland Signature bulk chicken, wild salmon, Greek yogurt & olive oil', icon: '🏬' },
  { id: 'walmart_run', name: 'Walmart Value Run', description: 'Great Value & Marketside produce, dairy, meats, and pantry items', icon: '🏪' },
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
 * Build Master Grocery Catalog: Combines Authentic Store Brand Items (Sam's Club, Aldi, Meijer)
 * and the complete master food database (1,000+ foods).
 */
const ALL_FOODS_DATA: FoodItem[] = buildMasterFoodDatabase();

const GENERIC_FOOD_CATALOG: CatalogGroceryItem[] = ALL_FOODS_DATA.map((food) => {
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
    brand: undefined,
    package_size: undefined,
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

// Primary Master Database: Store products first, followed by whole foods
export const MASTER_GROCERY_DATABASE: CatalogGroceryItem[] = [
  ...SAMS_CLUB_PRODUCTS,
  ...ALDI_PRODUCTS,
  ...MEIJER_PRODUCTS,
  ...COSTCO_PRODUCTS,
  ...WALMART_PRODUCTS,
  ...GENERIC_FOOD_CATALOG,
];

/**
 * Helper to get direct substitutes for any item name from the food database
 */
export function getSmartSubstitutesForItem(
  itemName: string,
  foodDatabase: FoodItem[] = ALL_FOODS_DATA
): SmartGrocerySubstitute[] {
  // Check store brand products first
  const storeMatch = [
    ...SAMS_CLUB_PRODUCTS,
    ...ALDI_PRODUCTS,
    ...MEIJER_PRODUCTS,
    ...COSTCO_PRODUCTS,
    ...WALMART_PRODUCTS,
  ].find(
    (p) => p.name.toLowerCase().includes(itemName.toLowerCase()) || itemName.toLowerCase().includes(p.name.toLowerCase())
  );
  if (storeMatch && storeMatch.common_substitutes && storeMatch.common_substitutes.length > 0) {
    return storeMatch.common_substitutes;
  }

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
    { name: "Member's Mark Boneless Skinless Chicken Breasts", department: 'poultry_meat' as any, default_unit: 'pack', conversion_ratio: 1.0, reason: "Sam's Club bulk lean protein" },
    { name: 'Kirkland Signature Wild Alaskan Sockeye Salmon', department: 'fish_seafood' as any, default_unit: 'bag', conversion_ratio: 1.0, reason: 'Costco wild fish' },
    { name: 'Friendly Farms Plain Greek Yogurt', department: 'dairy_eggs' as any, default_unit: 'tub', conversion_ratio: 1.0, reason: 'Aldi probiotic protein' },
    { name: 'True Goodness Organic Rolled Oats', department: 'grains_carbs' as any, default_unit: 'canister', conversion_ratio: 1.0, reason: 'Meijer whole grain carbs' },
    { name: 'Great Value Thai Jasmine Rice', department: 'grains_carbs' as any, default_unit: 'bag', conversion_ratio: 1.0, reason: 'Walmart clean carb staple' },
  ];
}

/**
 * Generate a complete store-specific requisition list based on Sam's Club, Aldi, Meijer, Costco, or Walmart products
 */
export function generateStoreSpecificRequisition(
  store: 'sams_club' | 'aldi' | 'meijer' | 'costco' | 'walmart',
  multiplier: number = 1
): GroceryItem[] {
  let products: StoreBrandProduct[] = [];
  let listId = 'main';

  if (store === 'sams_club') {
    products = SAMS_CLUB_PRODUCTS;
    listId = 'sams_club_bulk';
  } else if (store === 'aldi') {
    products = ALDI_PRODUCTS;
    listId = 'aldi_run';
  } else if (store === 'meijer') {
    products = MEIJER_PRODUCTS;
    listId = 'meijer_run';
  } else if (store === 'costco') {
    products = COSTCO_PRODUCTS;
    listId = 'costco_bulk';
  } else {
    products = WALMART_PRODUCTS;
    listId = 'walmart_run';
  }

  return products.map((prod, idx) => ({
    id: `gi-${store}-${Date.now()}-${idx + 1}`,
    item_name: prod.name,
    brand: prod.brand,
    package_size: prod.package_size,
    category: prod.shelf_life,
    department: prod.department,
    quantity: prod.default_quantity * multiplier,
    unit: prod.default_unit,
    is_checked: false,
    in_pantry: false,
    store_tag: store,
    list_id: listId,
    notes: `${prod.brand} • ${prod.package_size}`,
  }));
}

/**
 * Generate standard requisition list
 */
export function generateSmartGroceryRequisition(
  multiplier: number = 1
): GroceryItem[] {
  const defaultItems: Omit<GroceryItem, 'id'>[] = [
    {
      item_name: "Member's Mark Boneless Skinless Chicken Breasts",
      brand: "Member's Mark (Sam's Club)",
      package_size: '6.5 lb Vacuum Pack',
      category: 'fresh_weekly',
      department: 'poultry_meat' as any,
      quantity: 1 * multiplier,
      unit: 'pack (6.5 lbs)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'sams_club',
      notes: "Sam's Club bulk lean poultry for weekly meal prep",
    },
    {
      item_name: "Frederik's by Meijer Fresh Atlantic Salmon Fillet",
      brand: "Frederik's by Meijer",
      package_size: 'Fresh Seafood Counter',
      category: 'fresh_weekly',
      department: 'fish_seafood' as any,
      quantity: 1.5 * multiplier,
      unit: 'lbs',
      is_checked: false,
      in_pantry: false,
      store_tag: 'meijer',
      notes: 'Fresh salmon rich in EPA/DHA essential fatty acids',
    },
    {
      item_name: 'Simply Nature Organic Pasture-Raised Grade A Large Eggs',
      brand: 'Simply Nature (Aldi)',
      package_size: '12 count Carton',
      category: 'fresh_weekly',
      department: 'dairy_eggs' as any,
      quantity: 2 * multiplier,
      unit: 'dozen',
      is_checked: false,
      in_pantry: false,
      store_tag: 'aldi',
      notes: 'Aldi organic pasture-raised bioavailable protein',
    },
    {
      item_name: 'Friendly Farms Nonfat Plain Greek Yogurt (0% Fat)',
      brand: 'Friendly Farms (Aldi)',
      package_size: '32 oz Tub',
      category: 'fresh_weekly',
      department: 'dairy_eggs' as any,
      quantity: 2 * multiplier,
      unit: 'tub (32 oz)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'aldi',
      notes: 'Aldi high-protein probiotic snack base',
    },
    {
      item_name: 'True Goodness Organic Baby Spinach (Triple Washed)',
      brand: 'True Goodness by Meijer',
      package_size: '16 oz (1 lb) Clamshell',
      category: 'fresh_weekly',
      department: 'vegetables' as any,
      quantity: 1 * multiplier,
      unit: 'clamshell (16 oz)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'meijer',
      notes: 'Meijer organic micronutrient foundation',
    },
    {
      item_name: "Member's Mark Fresh Cut Broccoli Florets",
      brand: "Member's Mark (Sam's Club)",
      package_size: '3 lb Bag (48 oz)',
      category: 'fresh_weekly',
      department: 'vegetables' as any,
      quantity: 1 * multiplier,
      unit: 'bag (3 lbs)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'sams_club',
      notes: "Sam's Club bulk cruciferous vegetable florets",
    },
    {
      item_name: 'Aldi Fresh Hass Avocados Bag',
      brand: 'Aldi Fresh Produce',
      package_size: '4 Count Bag',
      category: 'fresh_weekly',
      department: 'fruits' as any,
      quantity: 1 * multiplier,
      unit: 'bag (4 count)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'aldi',
      notes: 'Aldi heart-healthy monounsaturated fats',
    },
    {
      item_name: 'True Goodness Organic Rolled Oats (100% Whole Grain)',
      brand: 'True Goodness by Meijer',
      package_size: '42 oz Canister',
      category: 'pantry_monthly',
      department: 'grains_carbs' as any,
      quantity: 1 * multiplier,
      unit: 'canister (42 oz)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'meijer',
      notes: 'Meijer organic whole grain breakfast carb',
    },
    {
      item_name: "Member's Mark Thai Hom Mali Jasmine White Rice",
      brand: "Member's Mark (Sam's Club)",
      package_size: '25 lb Heavy Duty Sack',
      category: 'pantry_monthly',
      department: 'grains_carbs' as any,
      quantity: 1,
      unit: 'bag (25 lbs)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'sams_club',
      notes: "Sam's Club bulk clean post-workout glycogen fuel",
    },
    {
      item_name: 'Simply Nature 100% Organic Extra Virgin Olive Oil',
      brand: 'Simply Nature (Aldi)',
      package_size: '16.9 fl oz Glass Bottle',
      category: 'pantry_monthly',
      department: 'nuts_fats_oils' as any,
      quantity: 1,
      unit: 'bottle (16.9 oz)',
      is_checked: false,
      in_pantry: true,
      store_tag: 'aldi',
      notes: 'Aldi high polyphenol finishing oil',
    },
    {
      item_name: "Member's Mark Organic Frozen Wild Blueberries",
      brand: "Member's Mark (Sam's Club)",
      package_size: '3 lb Bag (48 oz)',
      category: 'freezer_monthly',
      department: 'fruits' as any,
      quantity: 1 * multiplier,
      unit: 'bag (3 lbs)',
      is_checked: false,
      in_pantry: false,
      store_tag: 'sams_club',
      notes: "Sam's Club bulk anthocyanin antioxidant blueberries",
    },
  ];

  return defaultItems.map((item, idx) => ({
    ...item,
    id: `gi-init-${Date.now()}-${idx + 1}`,
  }));
}
