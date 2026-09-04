import { FoodItem, MealIngredient, MealMeasurementUnit, DetailedNutrition } from './types';
import { normalizeFoodCategory } from './food-database';

/**
 * Standard unit to gram conversions based on measurement type and food properties
 */
export function convertUnitToGrams(
  quantity: number,
  unit: MealMeasurementUnit,
  food?: FoodItem
): number {
  if (quantity <= 0) return 0;

  switch (unit) {
    case 'g':
      return Number(quantity.toFixed(1));
    case 'oz':
      return Number((quantity * 28.3495).toFixed(1));
    case 'tbsp': {
      // Liquid oils / nut butters ~14-16g, powdery ~10g
      const cat = food ? normalizeFoodCategory(food.category) : '';
      const density = cat === 'nuts_fats_oils' ? 14 : 15;
      return Number((quantity * density).toFixed(1));
    }
    case 'tsp':
      return Number((quantity * 5).toFixed(1));
    case 'cup': {
      // Density adjustments for common whole foods
      if (food) {
        const cat = normalizeFoodCategory(food.category);
        if (cat === 'beverages_hydration' || cat === 'dairy_eggs') return Number((quantity * 240).toFixed(1));
        if (cat === 'grains_carbs') return Number((quantity * 165).toFixed(1));
        if (cat === 'vegetables') return Number((quantity * 90).toFixed(1));
        if (cat === 'fruits') return Number((quantity * 140).toFixed(1));
        if (cat === 'nuts_fats_oils') return Number((quantity * 130).toFixed(1));
      }
      return Number((quantity * 150).toFixed(1));
    }
    case 'piece':
    case 'serving':
      return Number((quantity * (food?.serving_size_g || 100)).toFixed(1));
    default:
      return Number(quantity.toFixed(1));
  }
}

/**
 * USDA Standard Reference realistic baseline estimators for whole foods
 * when specific micronutrients are not explicitly populated in basic catalogs.
 */
function estimateMicronutrients(food: FoodItem) {
  const cat = normalizeFoodCategory(food.category);
  const isMeat = cat === 'poultry_meat';
  const isFish = cat === 'fish_seafood';
  const isDairy = cat === 'dairy_eggs';
  const isGrain = cat === 'grains_carbs';
  const isFruit = cat === 'fruits';
  const isVeg = cat === 'vegetables';
  const isNut = cat === 'nuts_fats_oils';

  // Saturated Fat (g / 100g)
  let satFat = food.saturated_fat_per_100g ?? 0;
  if (food.saturated_fat_per_100g === undefined) {
    if (isMeat) satFat = Number((food.fat_per_100g * 0.35).toFixed(1));
    else if (isFish) satFat = Number((food.fat_per_100g * 0.2).toFixed(1));
    else if (isDairy) satFat = Number((food.fat_per_100g * 0.6).toFixed(1));
    else if (isNut) satFat = Number((food.fat_per_100g * 0.12).toFixed(1));
  }

  // Mono & Poly Fats
  const remainingFat = Math.max(0, food.fat_per_100g - satFat);
  const monoFat = food.monounsaturated_fat_per_100g ?? Number((remainingFat * 0.6).toFixed(1));
  const polyFat = food.polyunsaturated_fat_per_100g ?? Number((remainingFat * 0.4).toFixed(1));

  // Cholesterol (mg / 100g)
  let chol = food.cholesterol_per_100g ?? 0;
  if (food.cholesterol_per_100g === undefined) {
    if (isMeat) chol = Math.round(food.protein_per_100g * 3.4); // ~70-85mg per 100g lean meat
    else if (isFish) chol = Math.round(food.protein_per_100g * 2.8); // ~55-70mg
    else if (isDairy && food.fat_per_100g > 1) chol = Math.round(food.fat_per_100g * 3.5);
  }

  // Sodium (mg / 100g)
  let sodium = food.sodium_per_100g ?? 0;
  if (food.sodium_per_100g === undefined) {
    if (isMeat) sodium = 65;
    else if (isFish) sodium = 75;
    else if (isDairy) sodium = 110;
    else if (isVeg) sodium = 25;
    else if (isGrain) sodium = 5;
    else if (isFruit) sodium = 2;
    else if (isNut) sodium = 4;
  }

  // Potassium (mg / 100g)
  let potassium = food.potassium_per_100g ?? 0;
  if (food.potassium_per_100g === undefined) {
    if (isMeat) potassium = 330;
    else if (isFish) potassium = 380;
    else if (isVeg) potassium = 280;
    else if (isFruit) potassium = 220;
    else if (isDairy) potassium = 160;
    else if (isGrain) potassium = 140;
    else if (isNut) potassium = 450;
  }

  // Fiber (g / 100g)
  let fiber = food.fiber_per_100g ?? 0;
  if (food.fiber_per_100g === undefined) {
    if (isVeg) fiber = Number((food.carbs_per_100g * 0.45).toFixed(1));
    else if (isFruit) fiber = Number((food.carbs_per_100g * 0.18).toFixed(1));
    else if (isGrain) fiber = Number((food.carbs_per_100g * 0.12).toFixed(1));
    else if (isNut) fiber = Number((food.carbs_per_100g * 0.4).toFixed(1));
  }

  // Sugars (g / 100g)
  let sugar = food.sugar_per_100g ?? 0;
  if (food.sugar_per_100g === undefined) {
    if (isFruit) sugar = Number((food.carbs_per_100g * 0.75).toFixed(1));
    else if (isDairy) sugar = Number((food.carbs_per_100g * 0.85).toFixed(1));
    else if (isVeg) sugar = Number((food.carbs_per_100g * 0.35).toFixed(1));
    else if (isGrain) sugar = Number((food.carbs_per_100g * 0.04).toFixed(1));
  }

  // Calcium (mg / 100g)
  let calcium = food.calcium_per_100g ?? 0;
  if (food.calcium_per_100g === undefined) {
    if (isDairy) calcium = 120;
    else if (isVeg) calcium = 45;
    else if (isNut) calcium = 65;
    else if (isMeat || isFish) calcium = 15;
  }

  // Iron (mg / 100g)
  let iron = food.iron_per_100g ?? 0;
  if (food.iron_per_100g === undefined) {
    if (isMeat) iron = 1.6;
    else if (isGrain) iron = 1.8;
    else if (isVeg) iron = 1.1;
    else if (isNut) iron = 2.4;
    else if (isFish) iron = 0.8;
  }

  // Magnesium (mg / 100g)
  let magnesium = food.magnesium_per_100g ?? 0;
  if (food.magnesium_per_100g === undefined) {
    if (isNut) magnesium = 180;
    else if (isGrain) magnesium = 60;
    else if (isVeg) magnesium = 30;
    else if (isMeat || isFish) magnesium = 25;
  }

  // Zinc (mg / 100g)
  let zinc = food.zinc_per_100g ?? 0;
  if (food.zinc_per_100g === undefined) {
    if (isMeat) zinc = 3.2;
    else if (isNut) zinc = 2.5;
    else if (isGrain) zinc = 1.5;
    else if (isFish) zinc = 1.0;
  }

  // Vitamin A (mcg / 100g)
  let vitA = food.vitamin_a_per_100g ?? 0;
  if (food.vitamin_a_per_100g === undefined) {
    if (isVeg) vitA = 120;
    else if (isDairy) vitA = 40;
    else if (isFruit) vitA = 35;
  }

  // Vitamin C (mg / 100g)
  let vitC = food.vitamin_c_per_100g ?? 0;
  if (food.vitamin_c_per_100g === undefined) {
    if (isVeg) vitC = 25;
    else if (isFruit) vitC = 30;
  }

  // Vitamin D (IU / 100g)
  let vitD = food.vitamin_d_per_100g ?? 0;
  if (food.vitamin_d_per_100g === undefined) {
    if (isFish) vitD = 350;
    else if (isDairy) vitD = 40;
  }

  return {
    satFat,
    monoFat,
    polyFat,
    transFat: food.trans_fat_per_100g ?? 0,
    chol,
    sodium,
    potassium,
    fiber,
    sugar,
    addedSugar: food.added_sugar_per_100g ?? 0,
    calcium,
    iron,
    magnesium,
    zinc,
    vitA,
    vitC,
    vitD,
  };
}

/**
 * Creates a MealIngredient from a FoodItem, quantity, and unit
 */
export function createMealIngredient(
  food: FoodItem,
  quantity: number,
  unit: MealMeasurementUnit
): MealIngredient {
  const grams = convertUnitToGrams(quantity, unit, food);
  const mult = grams / 100;
  const micros = estimateMicronutrients(food);

  const calories = Math.round(food.calories_per_100g * mult);
  const protein_g = Number((food.protein_per_100g * mult).toFixed(1));
  const carbs_g = Number((food.carbs_per_100g * mult).toFixed(1));
  const fat_g = Number((food.fat_per_100g * mult).toFixed(1));
  const fiber_g = Number((micros.fiber * mult).toFixed(1));
  const sugar_g = Number((micros.sugar * mult).toFixed(1));
  const saturated_fat_g = Number((micros.satFat * mult).toFixed(1));
  const sodium_mg = Math.round(micros.sodium * mult);
  const potassium_mg = Math.round(micros.potassium * mult);
  const calcium_mg = Math.round(micros.calcium * mult);
  const iron_mg = Number((micros.iron * mult).toFixed(1));

  return {
    id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    food_id: food.id,
    name: food.name,
    brand: food.brand,
    category: food.category,
    grams,
    unit,
    quantity,
    calories,
    protein_g,
    carbs_g,
    fat_g,
    fiber_g,
    sugar_g,
    saturated_fat_g,
    sodium_mg,
    potassium_mg,
    calcium_mg,
    iron_mg,
    raw_food: food,
  };
}

/**
 * Calculates complete, world-class detailed nutrition facts for an entire meal
 * as well as per individual serving.
 */
export function calculateMealDetailedNutrition(
  ingredients: MealIngredient[],
  servingsYield: number
): { total: DetailedNutrition; perServing: DetailedNutrition } {
  const s = Math.max(1, servingsYield || 1);

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSugar = 0;
  let totalAddedSugar = 0;
  let totalSatFat = 0;
  let totalMonoFat = 0;
  let totalPolyFat = 0;
  let totalTransFat = 0;
  let totalCholesterol = 0;
  let totalSodium = 0;
  let totalPotassium = 0;
  let totalCalcium = 0;
  let totalIron = 0;
  let totalMagnesium = 0;
  let totalZinc = 0;
  let totalVitA = 0;
  let totalVitC = 0;
  let totalVitD = 0;
  let totalWeightG = 0;

  for (const ing of ingredients) {
    const g = ing.grams || 0;
    totalWeightG += g;
    const mult = g / 100;

    totalCalories += ing.calories || 0;
    totalProtein += ing.protein_g || 0;
    totalCarbs += ing.carbs_g || 0;
    totalFat += ing.fat_g || 0;

    const raw = ing.raw_food;
    const micros = raw ? estimateMicronutrients(raw) : {
      satFat: (ing.saturated_fat_g || 0) / (mult || 1),
      monoFat: (ing.fat_g * 0.4) / (mult || 1),
      polyFat: (ing.fat_g * 0.2) / (mult || 1),
      transFat: 0,
      chol: 0,
      sodium: (ing.sodium_mg || 0) / (mult || 1),
      potassium: (ing.potassium_mg || 0) / (mult || 1),
      fiber: (ing.fiber_g || 0) / (mult || 1),
      sugar: (ing.sugar_g || 0) / (mult || 1),
      addedSugar: 0,
      calcium: (ing.calcium_mg || 0) / (mult || 1),
      iron: (ing.iron_mg || 0) / (mult || 1),
      magnesium: 20,
      zinc: 1.5,
      vitA: 30,
      vitC: 10,
      vitD: 0,
    };

    totalFiber += ing.fiber_g ?? Number((micros.fiber * mult).toFixed(1));
    totalSugar += ing.sugar_g ?? Number((micros.sugar * mult).toFixed(1));
    totalAddedSugar += Number((micros.addedSugar * mult).toFixed(1));
    totalSatFat += ing.saturated_fat_g ?? Number((micros.satFat * mult).toFixed(1));
    totalMonoFat += Number((micros.monoFat * mult).toFixed(1));
    totalPolyFat += Number((micros.polyFat * mult).toFixed(1));
    totalTransFat += Number((micros.transFat * mult).toFixed(1));
    totalCholesterol += Math.round(micros.chol * mult);
    totalSodium += ing.sodium_mg ?? Math.round(micros.sodium * mult);
    totalPotassium += ing.potassium_mg ?? Math.round(micros.potassium * mult);
    totalCalcium += ing.calcium_mg ?? Math.round(micros.calcium * mult);
    totalIron += ing.iron_mg ?? Number((micros.iron * mult).toFixed(1));
    totalMagnesium += Math.round(micros.magnesium * mult);
    totalZinc += Number((micros.zinc * mult).toFixed(1));
    totalVitA += Math.round(micros.vitA * mult);
    totalVitC += Number((micros.vitC * mult).toFixed(1));
    totalVitD += Math.round(micros.vitD * mult);
  }

  // Macro Calorie Distribution
  const protCals = totalProtein * 4;
  const carbCals = totalCarbs * 4;
  const fatCals = totalFat * 9;
  const macroCalsSum = protCals + carbCals + fatCals;

  const protein_pct = macroCalsSum > 0 ? Math.round((protCals / macroCalsSum) * 100) : 0;
  const carbs_pct = macroCalsSum > 0 ? Math.round((carbCals / macroCalsSum) * 100) : 0;
  const fat_pct = macroCalsSum > 0 ? Math.round((fatCals / macroCalsSum) * 100) : 0;

  const net_carbs_g = Number(Math.max(0, totalCarbs - totalFiber).toFixed(1));
  const calorie_density_per_100g = totalWeightG > 0 ? Number(((totalCalories / totalWeightG) * 100).toFixed(1)) : 0;
  const energy_kj = Math.round(totalCalories * 4.184);

  const total: DetailedNutrition = {
    calories: Math.round(totalCalories),
    energy_kj,
    protein_g: Number(totalProtein.toFixed(1)),
    carbs_g: Number(totalCarbs.toFixed(1)),
    fat_g: Number(totalFat.toFixed(1)),
    net_carbs_g,
    saturated_fat_g: Number(totalSatFat.toFixed(1)),
    monounsaturated_fat_g: Number(totalMonoFat.toFixed(1)),
    polyunsaturated_fat_g: Number(totalPolyFat.toFixed(1)),
    trans_fat_g: Number(totalTransFat.toFixed(1)),
    cholesterol_mg: Math.round(totalCholesterol),
    fiber_g: Number(totalFiber.toFixed(1)),
    sugar_g: Number(totalSugar.toFixed(1)),
    added_sugar_g: Number(totalAddedSugar.toFixed(1)),
    sodium_mg: Math.round(totalSodium),
    potassium_mg: Math.round(totalPotassium),
    calcium_mg: Math.round(totalCalcium),
    iron_mg: Number(totalIron.toFixed(1)),
    magnesium_mg: Math.round(totalMagnesium),
    zinc_mg: Number(totalZinc.toFixed(1)),
    vitamin_a_mcg: Math.round(totalVitA),
    vitamin_c_mg: Number(totalVitC.toFixed(1)),
    vitamin_d_iu: Math.round(totalVitD),
    protein_pct,
    carbs_pct,
    fat_pct,
    total_weight_g: Math.round(totalWeightG),
    calorie_density_per_100g,
  };

  const perServing: DetailedNutrition = {
    calories: Math.round(totalCalories / s),
    energy_kj: Math.round(energy_kj / s),
    protein_g: Number((totalProtein / s).toFixed(1)),
    carbs_g: Number((totalCarbs / s).toFixed(1)),
    fat_g: Number((totalFat / s).toFixed(1)),
    net_carbs_g: Number((net_carbs_g / s).toFixed(1)),
    saturated_fat_g: Number((totalSatFat / s).toFixed(1)),
    monounsaturated_fat_g: Number((totalMonoFat / s).toFixed(1)),
    polyunsaturated_fat_g: Number((totalPolyFat / s).toFixed(1)),
    trans_fat_g: Number((totalTransFat / s).toFixed(1)),
    cholesterol_mg: Math.round(totalCholesterol / s),
    fiber_g: Number((totalFiber / s).toFixed(1)),
    sugar_g: Number((totalSugar / s).toFixed(1)),
    added_sugar_g: Number((totalAddedSugar / s).toFixed(1)),
    sodium_mg: Math.round(totalSodium / s),
    potassium_mg: Math.round(totalPotassium / s),
    calcium_mg: Math.round(totalCalcium / s),
    iron_mg: Number((totalIron / s).toFixed(1)),
    magnesium_mg: Math.round(totalMagnesium / s),
    zinc_mg: Number((totalZinc / s).toFixed(1)),
    vitamin_a_mcg: Math.round(totalVitA / s),
    vitamin_c_mg: Number((totalVitC / s).toFixed(1)),
    vitamin_d_iu: Math.round(totalVitD / s),
    protein_pct,
    carbs_pct,
    fat_pct,
    total_weight_g: Math.round(totalWeightG / s),
    calorie_density_per_100g,
  };

  return { total, perServing };
}
