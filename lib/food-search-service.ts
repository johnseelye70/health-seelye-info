import { FoodItem, FoodCategory } from './types';
import { COMPREHENSIVE_FOOD_DATABASE } from './food-database';

export interface FoodSearchResponse {
  foods: FoodItem[];
  localCount: number;
  globalCount: number;
  isOnline: boolean;
}

/**
 * Instant local search with token matching
 */
export function searchLocalFoods(
  query: string,
  category: FoodCategory | 'all' = 'all',
  limit = 40
): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    if (category === 'all') return COMPREHENSIVE_FOOD_DATABASE.slice(0, limit);
    return COMPREHENSIVE_FOOD_DATABASE.filter((f) => f.category === category).slice(0, limit);
  }

  const terms = q.split(/\s+/).filter(Boolean);
  return COMPREHENSIVE_FOOD_DATABASE.filter((food) => {
    if (category !== 'all' && food.category !== category) return false;
    const target = `${food.name} ${food.brand || ''} ${food.sub_category || ''} ${food.category} ${food.swap_group || ''}`.toLowerCase();
    return terms.every((term) => {
      if (target.includes(term)) return true;
      if (term.endsWith('s') && term.length > 3 && target.includes(term.slice(0, -1))) return true;
      if (term.endsWith('es') && term.length > 4 && target.includes(term.slice(0, -2))) return true;
      return false;
    });
  }).slice(0, limit);
}

/**
 * Searches both local database and the global Open Food Facts database
 */
export async function searchFoodDatabase(
  query: string,
  category: FoodCategory | 'all' = 'all',
  includeGlobal = true
): Promise<FoodSearchResponse> {
  const local = searchLocalFoods(query, category, 40);

  if (!includeGlobal || query.trim().length < 2) {
    return {
      foods: local,
      localCount: local.length,
      globalCount: 0,
      isOnline: false,
    };
  }

  try {
    const url = `/api/food/search?q=${encodeURIComponent(query)}&category=${category}&global=true&limit=50`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return {
        foods: Array.isArray(data.foods) && data.foods.length > 0 ? data.foods : local,
        localCount: data.localCount ?? local.length,
        globalCount: data.globalCount ?? 0,
        isOnline: true,
      };
    }
  } catch (err) {
    console.warn('Network search unavailable; using offline catalog:', err);
  }

  return {
    foods: local,
    localCount: local.length,
    globalCount: 0,
    isOnline: false,
  };
}

export const searchExhaustiveFoodDatabase = searchFoodDatabase;
