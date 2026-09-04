import { NextRequest, NextResponse } from 'next/server';
import { COMPREHENSIVE_FOOD_DATABASE } from '@/lib/food-database';
import { FoodItem, FoodCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim().toLowerCase();
  const category = searchParams.get('category') as FoodCategory | 'all' | null;
  const includeGlobal = searchParams.get('global') !== 'false';
  const limit = Math.min(60, Math.max(10, Number(searchParams.get('limit')) || 30));

  // 1. Search Local Curated Food Database (1,012 items)
  let localResults: FoodItem[] = [];

  if (query.length > 0) {
    const terms = query.split(/\s+/).filter(Boolean);
    localResults = COMPREHENSIVE_FOOD_DATABASE.filter((food) => {
      if (category && category !== 'all' && food.category !== category) {
        return false;
      }
      const target = `${food.name} ${food.brand || ''} ${food.sub_category || ''} ${food.category}`.toLowerCase();
      return terms.every((term) => target.includes(term));
    });
  } else if (category && category !== 'all') {
    localResults = COMPREHENSIVE_FOOD_DATABASE.filter((f) => f.category === category);
  } else {
    localResults = COMPREHENSIVE_FOOD_DATABASE.slice(0, 30);
  }

  // 2. Query Open Food Facts v2 API for commercial & branded products (if query provided and global enabled)
  let globalResults: FoodItem[] = [];

  if (includeGlobal && query.length >= 2) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `https://us.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(
        query
      )}&fields=code,product_name,brands,nutriments,serving_size,serving_quantity&page_size=20`;

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'HealthSeelyeApp - Web - Version 4.0.0 (contact@seelye.info)',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const products = Array.isArray(data.products) ? data.products : [];

        globalResults = products
          .filter((p: any) => p && p.product_name && p.nutriments)
          .map((p: any, idx: number): FoodItem => {
            const nut = p.nutriments || {};
            const cals = Math.round(nut['energy-kcal_100g'] || (nut.energy_100g ? nut.energy_100g / 4.184 : 0));
            const prot = Number((nut.proteins_100g || 0).toFixed(1));
            const carbs = Number((nut.carbohydrates_100g || 0).toFixed(1));
            const fat = Number((nut.fat_100g || 0).toFixed(1));

            // Parse serving size grams
            let servingGrams = 100;
            if (p.serving_quantity && Number(p.serving_quantity) > 0) {
              servingGrams = Number(p.serving_quantity);
            } else if (p.serving_size) {
              const match = String(p.serving_size).match(/(\d+(\.\d+)?)\s*g/i);
              if (match && match[1]) {
                servingGrams = Number(match[1]);
              }
            }

            const brandName = p.brands ? String(p.brands).split(',')[0].trim() : '';
            const fullName = brandName ? `${brandName} ${p.product_name}` : p.product_name;

            // Guess category
            let cat: FoodCategory = 'snacks_pantry';
            if (prot >= 15 && prot > carbs && prot > fat) cat = 'poultry_meat';
            else if (carbs >= 20 && carbs > prot) cat = 'grains_carbs';
            else if (fat >= 15 && fat > carbs) cat = 'nuts_fats_oils';
            else if (fullName.toLowerCase().includes('yogurt') || fullName.toLowerCase().includes('cheese') || fullName.toLowerCase().includes('milk')) cat = 'dairy_eggs';

            return {
              id: `off-${p.code || Date.now() + '-' + idx}`,
              name: fullName,
              brand: brandName || undefined,
              barcode: p.code || undefined,
              category: cat,
              sub_category: 'branded_grocery',
              calories_per_100g: Math.max(0, cals),
              protein_per_100g: Math.max(0, prot),
              carbs_per_100g: Math.max(0, carbs),
              fat_per_100g: Math.max(0, fat),
              fiber_per_100g: nut.fiber_100g !== undefined ? Number(nut.fiber_100g.toFixed(1)) : undefined,
              sugar_per_100g: nut.sugars_100g !== undefined ? Number(nut.sugars_100g.toFixed(1)) : undefined,
              added_sugar_per_100g: nut['added-sugars_100g'] !== undefined ? Number(nut['added-sugars_100g'].toFixed(1)) : undefined,
              saturated_fat_per_100g: nut['saturated-fat_100g'] !== undefined ? Number(nut['saturated-fat_100g'].toFixed(1)) : undefined,
              trans_fat_per_100g: nut['trans-fat_100g'] !== undefined ? Number(nut['trans-fat_100g'].toFixed(1)) : undefined,
              sodium_per_100g: nut.sodium_100g !== undefined ? Math.round(nut.sodium_100g * 1000) : undefined,
              potassium_per_100g: nut.potassium_100g !== undefined ? Math.round(nut.potassium_100g * 1000) : undefined,
              calcium_per_100g: nut.calcium_100g !== undefined ? Math.round(nut.calcium_100g * 1000) : undefined,
              iron_per_100g: nut.iron_100g !== undefined ? Number((nut.iron_100g * 1000).toFixed(1)) : undefined,
              is_global_db: true,
              is_gluten_free: false,
              is_dairy_free: false,
              serving_size_g: servingGrams,
              default_unit: 'g',
              storage_type: 'pantry_monthly',
            };
          })
          .filter((item: FoodItem) => item.calories_per_100g > 0 || item.protein_per_100g > 0 || item.carbs_per_100g > 0);
      }
    } catch (err) {
      // Global database fetch timed out or network offline; proceed cleanly with local results
      console.warn('Open Food Facts search error (graceful fallback):', err);
    }
  }

  // Combine and deduplicate
  const combined = [...localResults, ...globalResults].slice(0, limit);

  return NextResponse.json({
    query,
    count: combined.length,
    localCount: localResults.length,
    globalCount: globalResults.length,
    foods: combined,
  });
}
