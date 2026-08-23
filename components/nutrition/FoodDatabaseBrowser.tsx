'use client';

import React, { useState, useMemo } from 'react';
import { FoodItem, FoodCategory } from '@/lib/types';
import { FOOD_CATEGORIES, FoodCategoryMeta } from '@/lib/food-database';
import { useHealth } from '@/context/HealthContext';
import {
  Search,
  ArrowLeft,
  Plus,
  Flame,
  Check,
  Filter,
  Sparkles,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';

interface FoodDatabaseBrowserProps {
  onSelectFood?: (food: FoodItem) => void;
  selectedMealIndex?: number | null;
  onLogToMeal?: (food: FoodItem, mealIndex: number) => void;
}

export const FoodDatabaseBrowser: React.FC<FoodDatabaseBrowserProps> = ({
  onSelectFood,
  selectedMealIndex,
  onLogToMeal,
}) => {
  const { foods, profile, experienceMode } = useHealth();
  const isImperial = profile.unit_preference === 'imperial';
  const isSimple = experienceMode === 'simple';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'high_protein' | 'gluten_free' | 'dairy_free'>('all');

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    foods.forEach((food) => {
      counts[food.category] = (counts[food.category] || 0) + 1;
    });
    return counts;
  }, [foods]);

  // Global Search or Filtered List
  const filteredFoods = useMemo(() => {
    return foods.filter((item) => {
      // 1. Text Search (Matches anywhere in name or category)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCat) return false;
      } else if (selectedCategory) {
        // 2. Category Filter (When not searching globally)
        if (item.category !== selectedCategory) return false;
      }

      // 3. Dietary Filter
      if (dietaryFilter === 'gluten_free' && !item.is_gluten_free) return false;
      if (dietaryFilter === 'dairy_free' && !item.is_dairy_free) return false;
      if (dietaryFilter === 'high_protein' && item.protein_per_100g < 15) return false;

      return true;
    });
  }, [foods, searchQuery, selectedCategory, dietaryFilter]);

  const activeCategoryMeta = FOOD_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Search Header Bar (Clean, uncluttered, prominent) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🍏 Complete Food Database & Nutrition Library</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isSimple
                ? 'Explore fresh ingredients by category or search anything instantly by name.'
                : '120+ verified whole foods with precise macronutrient densities and bioavailable proteins.'}
            </p>
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'high_protein', label: '🥩 High Protein (15g+)' },
              { id: 'gluten_free', label: '🌾 Gluten-Free' },
              { id: 'dairy_free', label: '🥛 Dairy-Free' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDietaryFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  dietaryFilter === f.id
                    ? 'bg-brand-500 text-zinc-950 font-bold shadow-glow border border-brand-400'
                    : 'bg-surface-200 border border-surface-border text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            id="food-database-global-search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim().length > 0 && selectedCategory) {
                // Switch to global search view when typing
                setSelectedCategory(null);
              }
            }}
            placeholder="Type any food to search instantly (e.g. salmon, Greek yogurt, oats, steak, avocado)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-surface-200/90 border border-surface-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-white bg-surface-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          LAYER 1: CATEGORY BROWSER GRID (Shown when search is empty and no category chosen)
          ========================================================================= */}
      {!selectedCategory && searchQuery.trim().length === 0 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span>Browse by Category</span>
              <span className="text-zinc-600">•</span>
              <span className="text-brand-400 font-mono">{FOOD_CATEGORIES.length} Categories</span>
            </h3>
            <span className="text-xs text-zinc-500">Click any card to explore</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {FOOD_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              return (
                <div
                  key={cat.id}
                  id={`category-card-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="group p-5 rounded-3xl bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border hover:border-brand-500/40 cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-2xl bg-surface-200/80 border border-surface-border/60 group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-300/80 text-zinc-300 font-semibold border border-surface-border/60">
                        {count} foods
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs text-zinc-400 group-hover:text-brand-400 font-medium">
                    <span>View {cat.shortLabel}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          LAYER 2: CATEGORY DETAIL VIEW OR GLOBAL SEARCH RESULTS
          ========================================================================= */}
      {(selectedCategory || searchQuery.trim().length > 0) && (
        <div className="space-y-4 animate-fadeIn">
          {/* Breadcrumb & Navigation Bar */}
          <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-surface-100 border border-surface-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 hover:text-white transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-brand-400" />
                <span>All Categories</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-zinc-600">/</span>
                {selectedCategory && activeCategoryMeta ? (
                  <span className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>{activeCategoryMeta.icon}</span>
                    <span>{activeCategoryMeta.name}</span>
                  </span>
                ) : (
                  <span className="text-sm font-bold text-brand-400">
                    Search Results for &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-surface-200 text-zinc-300 font-medium">
              {filteredFoods.length} {filteredFoods.length === 1 ? 'food' : 'foods'} found
            </span>
          </div>

          {/* Empty State */}
          {filteredFoods.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-surface-100/90 border border-surface-border space-y-3">
              <div className="text-4xl">🔍</div>
              <h4 className="text-base font-bold text-zinc-200">No foods found matching your query</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try a different search keyword, reset the dietary filters, or browse by category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setDietaryFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-brand-500 text-zinc-950 font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredFoods.map((item) => (
              <div
                key={item.id}
                id={`food-card-${item.id}`}
                className="p-4 rounded-3xl bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border transition-all duration-200 flex flex-col justify-between shadow-md group"
              >
                <div>
                  {/* Title & Dietary Tags */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-300 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                        Serving: {item.serving_size_g}g{' '}
                        {isImperial && `(~${(item.serving_size_g * 0.03527).toFixed(1)} oz)`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {item.is_gluten_free && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          GF
                        </span>
                      )}
                      {item.is_dairy_free && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          DF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Macro Badges Grid (Per 100g) */}
                  <div className="grid grid-cols-4 gap-1.5 mt-3 text-center font-mono">
                    <div className="p-1.5 rounded-xl bg-surface-300/80">
                      <div className="text-[9px] text-zinc-400 uppercase">Calories</div>
                      <div className="text-xs font-bold text-zinc-100">{item.calories_per_100g}</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-surface-300/80">
                      <div className="text-[9px] text-zinc-400 uppercase">Protein</div>
                      <div className="text-xs font-bold text-brand-400">{item.protein_per_100g}g</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-surface-300/80">
                      <div className="text-[9px] text-zinc-400 uppercase">Carbs</div>
                      <div className="text-xs font-bold text-accent-cyan">{item.carbs_per_100g}g</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-surface-300/80">
                      <div className="text-[9px] text-zinc-400 uppercase">Fats</div>
                      <div className="text-xs font-bold text-amber-400">{item.fat_per_100g}g</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Per 100{item.default_unit}
                  </span>

                  {onLogToMeal ? (
                    <button
                      onClick={() => onLogToMeal(item, selectedMealIndex || 1)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 text-xs font-semibold transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log to Meal</span>
                    </button>
                  ) : onSelectFood ? (
                    <button
                      onClick={() => onSelectFood(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 text-zinc-950 text-xs font-bold shadow-glow hover:bg-brand-400 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select Food</span>
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
