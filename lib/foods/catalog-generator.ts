import { FoodItem } from '../types';
import { POULTRY_MEATS_DATABASE } from './poultry-meats';
import { FISH_SEAFOOD_DATABASE } from './fish-seafood';
import { DAIRY_EGGS_DATABASE } from './dairy-eggs';
import { PLANT_PROTEIN_DATABASE } from './plant-protein';
import { GRAINS_CARBS_DATABASE } from './grains-carbs';
import { FRUITS_BERRIES_DATABASE } from './fruits-berries';
import { VEGETABLES_GREENS_DATABASE } from './vegetables-greens';
import { NUTS_FATS_OILS_DATABASE } from './nuts-fats-oils';
import { BEVERAGES_HYDRATION_DATABASE } from './beverages-hydration';
import { PANTRY_SNACKS_DATABASE } from './pantry-snacks';

/**
 * Builds the Master Food Database containing 1,000+ authentic, unique whole foods and grocery staples
 * across 10 complete nutritional domains with zero artificial cooking variations or duplicate suffixes.
 */
export function buildMasterFoodDatabase(): FoodItem[] {
  return [
    ...POULTRY_MEATS_DATABASE,
    ...FISH_SEAFOOD_DATABASE,
    ...DAIRY_EGGS_DATABASE,
    ...PLANT_PROTEIN_DATABASE,
    ...GRAINS_CARBS_DATABASE,
    ...FRUITS_BERRIES_DATABASE,
    ...VEGETABLES_GREENS_DATABASE,
    ...NUTS_FATS_OILS_DATABASE,
    ...BEVERAGES_HYDRATION_DATABASE,
    ...PANTRY_SNACKS_DATABASE,
  ];
}

