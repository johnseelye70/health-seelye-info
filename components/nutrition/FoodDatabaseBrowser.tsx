'use client';

import React, { useState, useMemo } from 'react';
import { FoodItem, FoodCategory } from '@/lib/types';
import {
  FOOD_CATEGORIES,
  FOOD_SUB_CATEGORIES,
  FoodCategoryMeta,
  normalizeFoodCategory,
} from '@/lib/food-database';
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
  Layers,
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
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'high_protein' | 'gluten_free' | 'dairy_free'>('all');

  // Dietary Total Counts across whole library
  const dietaryCounts = useMemo(() => {
    return {
      all: foods.length,
      high_protein: foods.filter((f) => f.protein_per_100g >= 15).length,
      gluten_free: foods.filter((f) => f.is_gluten_free).length,
      dairy_free: foods.filter((f) => f.is_dairy_free).length,
    };
  }, [foods]);

  // Count items per category (respecting active dietary filter)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    foods.forEach((food) => {
      if (dietaryFilter === 'gluten_free' && !food.is_gluten_free) return;
      if (dietaryFilter === 'dairy_free' && !food.is_dairy_free) return;
      if (dietaryFilter === 'high_protein' && food.protein_per_100g < 15) return;
      const cat = normalizeFoodCategory(food.category);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [foods, dietaryFilter]);

  // Count items per sub-category (respecting active dietary filter)
  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    foods.forEach((food) => {
      if (dietaryFilter === 'gluten_free' && !food.is_gluten_free) return;
      if (dietaryFilter === 'dairy_free' && !food.is_dairy_free) return;
      if (dietaryFilter === 'high_protein' && food.protein_per_100g < 15) return;
      if (food.sub_category) {
        counts[food.sub_category] = (counts[food.sub_category] || 0) + 1;
      }
    });
    return counts;
  }, [foods, dietaryFilter]);

  // Available sub-categories for selected parent category
  const currentSubCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return FOOD_SUB_CATEGORIES.filter((sub) => sub.parentId === selectedCategory);
  }, [selectedCategory]);

  // Filtered Foods List
  const filteredFoods = useMemo(() => {
    return foods.filter((item) => {
      const itemCat = normalizeFoodCategory(item.category);

      // 1. Text Search (Matches globally across food name, category, or sub-category)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat = itemCat.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        const matchesSub = item.sub_category ? item.sub_category.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesCat && !matchesSub) return false;
      } else {
        // 2. Hierarchical Category Filter (applied if category is selected)
        if (selectedCategory && itemCat !== selectedCategory) return false;
        if (selectedSubCategory && selectedSubCategory !== 'all' && item.sub_category !== selectedSubCategory) return false;
      }

      // 3. Dietary Filter
      if (dietaryFilter === 'gluten_free' && !item.is_gluten_free) return false;
      if (dietaryFilter === 'dairy_free' && !item.is_dairy_free) return false;
      if (dietaryFilter === 'high_protein' && item.protein_per_100g < 15) return false;

      return true;
    });
  }, [foods, searchQuery, selectedCategory, selectedSubCategory, dietaryFilter]);

  const activeCategoryMeta = FOOD_CATEGORIES.find((c) => c.id === selectedCategory);
  const activeSubCategoryMeta = FOOD_SUB_CATEGORIES.find((s) => s.id === selectedSubCategory);
  const shouldShowFoodList = dietaryFilter !== 'all' || searchQuery.trim().length > 0 || selectedSubCategory !== null;

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
                ? 'Explore fresh ingredients by category, sub-category, or search anything instantly by name.'
                : 'Expansive verified nutrition library with tiered sub-categories and bioavailable macro profiles.'}
            </p>
          </div>

          {/* Quick Dietary Filters with Live Counts */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            {[
              { id: 'all', label: `All Items (${dietaryCounts.all})` },
              { id: 'high_protein', label: `🥩 High Protein (${dietaryCounts.high_protein})` },
              { id: 'gluten_free', label: `🌾 Gluten-Free (${dietaryCounts.gluten_free})` },
              { id: 'dairy_free', label: `🥛 Dairy-Free (${dietaryCounts.dairy_free})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDietaryFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  dietaryFilter === f.id
                    ? 'bg-brand-500 text-zinc-950 font-bold shadow-glow border border-brand-400'
                    : 'bg-surface-200 border border-surface-border text-zinc-400 hover:text-zinc-100 hover:bg-surface-300'
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
              if (e.target.value.trim().length > 0) {
                // Keep view clear for search results
                setSelectedCategory(null);
                setSelectedSubCategory(null);
              }
            }}
            placeholder="Search any food globally (e.g. chicken breast, sirloin, salmon, oats, avocado)..."
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
          TIER 1: MASTER CATEGORIES GRID (When no dietary filter, no search, no category)
          ========================================================================= */}
      {!shouldShowFoodList && !selectedCategory && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span>Main Categories</span>
              <span className="text-zinc-600">•</span>
              <span className="text-brand-400 font-mono">{FOOD_CATEGORIES.length} Groups</span>
            </h3>
            <span className="text-xs text-zinc-500">Click any group to explore</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {FOOD_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              return (
                <div
                  key={cat.id}
                  id={`category-card-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubCategory(null);
                  }}
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
                    <span>Explore Sub-Categories</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIER 2: SUB-CATEGORIES GRID (When a Master Category is chosen, without direct subcategory or dietary filter)
          ========================================================================= */}
      {!shouldShowFoodList && selectedCategory && !selectedSubCategory && (
        <div className="space-y-4 animate-fadeIn">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-surface-100 border border-surface-border">
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border font-semibold text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-brand-400" />
                <span>All Categories</span>
              </button>
              <span className="text-zinc-600">/</span>
              <span className="font-bold text-zinc-100 flex items-center gap-1">
                <span>{activeCategoryMeta?.icon}</span>
                <span>{activeCategoryMeta?.name}</span>
              </span>
            </div>

            <button
              onClick={() => setSelectedSubCategory('all')}
              className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All {categoryCounts[selectedCategory] || 0} Foods in Category</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {currentSubCategories.map((sub) => {
              const subCount = subCategoryCounts[sub.id] || 0;
              return (
                <div
                  key={sub.id}
                  id={`subcategory-card-${sub.id}`}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className="group p-5 rounded-3xl bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border hover:border-brand-500/40 cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl p-2 rounded-2xl bg-surface-200/80 border border-surface-border/60 group-hover:scale-110 transition-transform">
                        {sub.icon}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-300/80 text-zinc-300 font-semibold border border-surface-border/60">
                        {subCount} foods
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">
                      {sub.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs text-zinc-400 group-hover:text-brand-400 font-medium">
                    <span>View Foods</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIER 3: FOOD ITEMS LIST (When Dietary Filter active, Sub-Category active, OR Global Search)
          ========================================================================= */}
      {shouldShowFoodList && (
        <div className="space-y-4 animate-fadeIn">
          {/* Breadcrumb Bar */}
          <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-surface-100 border border-surface-border flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setSearchQuery('');
                  setDietaryFilter('all');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border font-semibold text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-brand-400" />
                <span>All Categories</span>
              </button>

              {selectedCategory && activeCategoryMeta && (
                <>
                  <span className="text-zinc-600">/</span>
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className="font-semibold text-zinc-300 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{activeCategoryMeta.icon}</span>
                    <span>{activeCategoryMeta.name}</span>
                  </button>
                </>
              )}

              {selectedSubCategory && selectedSubCategory !== 'all' && activeSubCategoryMeta && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="font-bold text-brand-400 flex items-center gap-1">
                    <span>{activeSubCategoryMeta.icon}</span>
                    <span>{activeSubCategoryMeta.name}</span>
                  </span>
                </>
              )}

              {dietaryFilter !== 'all' && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="font-bold text-brand-300 px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center gap-1">
                    {dietaryFilter === 'high_protein' && '🥩 High Protein (15g+)'}
                    {dietaryFilter === 'gluten_free' && '🌾 Gluten-Free'}
                    {dietaryFilter === 'dairy_free' && '🥛 Dairy-Free'}
                  </span>
                </>
              )}

              {searchQuery.trim().length > 0 && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="font-bold text-brand-400">
                    Results for &ldquo;{searchQuery}&rdquo;
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {dietaryFilter !== 'all' && (
                <button
                  onClick={() => setDietaryFilter('all')}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filter</span>
                </button>
              )}
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-surface-200 text-zinc-300 font-medium">
                {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Empty State */}
          {filteredFoods.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-surface-100/90 border border-surface-border space-y-3">
              <div className="text-4xl">🔍</div>
              <h4 className="text-base font-bold text-zinc-200">No foods found matching your filter</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try resetting your dietary filter or searching for a different food.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setDietaryFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-brand-500 text-zinc-950 font-bold text-xs cursor-pointer shadow-glow"
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

                    <div className="flex items-center gap-1 flex-wrap justify-end flex-shrink-0">
                      {item.protein_per_100g >= 15 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                          PRO
                        </span>
                      )}
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
