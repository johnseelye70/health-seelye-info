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
  RotateCcw,
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
  const [selectedFoodDetail, setSelectedFoodDetail] = useState<FoodItem | null>(null);

  // Stackable Independent Dietary Filter Toggles
  const [filterHighProtein, setFilterHighProtein] = useState<boolean>(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState<boolean>(false);
  const [filterDairyFree, setFilterDairyFree] = useState<boolean>(false);

  const hasActiveDietaryFilters = filterHighProtein || filterGlutenFree || filterDairyFree;

  // Helper to check if a single food item matches the current stack of active filters
  const matchesDietary = (item: FoodItem) => {
    if (filterHighProtein && item.protein_per_100g < 15) return false;
    if (filterGlutenFree && !item.is_gluten_free) return false;
    if (filterDairyFree && !item.is_dairy_free) return false;
    return true;
  };

  // Total matching foods count in entire library under current stacked filters
  const totalMatchingFoods = useMemo(() => {
    return foods.filter(matchesDietary).length;
  }, [foods, filterHighProtein, filterGlutenFree, filterDairyFree]);

  // Count items per category (respecting active stacked dietary filters)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    foods.forEach((food) => {
      if (!matchesDietary(food)) return;
      const cat = normalizeFoodCategory(food.category);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [foods, filterHighProtein, filterGlutenFree, filterDairyFree]);

  // Count items per sub-category (respecting active stacked dietary filters)
  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    foods.forEach((food) => {
      if (!matchesDietary(food)) return;
      if (food.sub_category) {
        counts[food.sub_category] = (counts[food.sub_category] || 0) + 1;
      }
    });
    return counts;
  }, [foods, filterHighProtein, filterGlutenFree, filterDairyFree]);

  // Available sub-categories for selected parent category
  const currentSubCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return FOOD_SUB_CATEGORIES.filter((sub) => sub.parentId === selectedCategory);
  }, [selectedCategory]);

  // Filtered Foods List for Tier 3 display
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
        // 2. Hierarchical Category & Subcategory Filter
        if (selectedCategory && itemCat !== selectedCategory) return false;
        if (selectedSubCategory && selectedSubCategory !== 'all' && item.sub_category !== selectedSubCategory) return false;
      }

      // 3. Stacked Dietary Filter
      if (!matchesDietary(item)) return false;

      return true;
    });
  }, [foods, searchQuery, selectedCategory, selectedSubCategory, filterHighProtein, filterGlutenFree, filterDairyFree]);

  const activeCategoryMeta = FOOD_CATEGORIES.find((c) => c.id === selectedCategory);
  const activeSubCategoryMeta = FOOD_SUB_CATEGORIES.find((s) => s.id === selectedSubCategory);

  return (
    <div className="space-y-6">
      {/* Search Header Bar with Stackable Dietary Filters */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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

          {/* Stackable Multi-Select Dietary Filters */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              id="filter-btn-high-protein"
              onClick={() => setFilterHighProtein((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                filterHighProtein
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-glow border border-emerald-400'
                  : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300 hover:text-white'
              }`}
            >
              <span>🥩 High Protein (15g+)</span>
              {filterHighProtein && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </button>

            <button
              type="button"
              id="filter-btn-gluten-free"
              onClick={() => setFilterGlutenFree((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                filterGlutenFree
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-glow border border-amber-400'
                  : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300 hover:text-white'
              }`}
            >
              <span>🌾 Gluten-Free</span>
              {filterGlutenFree && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </button>

            <button
              type="button"
              id="filter-btn-dairy-free"
              onClick={() => setFilterDairyFree((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                filterDairyFree
                  ? 'bg-accent-cyan text-zinc-950 font-bold shadow-glow border border-cyan-300'
                  : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300 hover:text-white'
              }`}
            >
              <span>🥛 Dairy-Free</span>
              {filterDairyFree && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </button>

            {hasActiveDietaryFilters && (
              <button
                type="button"
                id="filter-btn-reset"
                onClick={() => {
                  setFilterHighProtein(false);
                  setFilterGlutenFree(false);
                  setFilterDairyFree(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-200 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                title="Clear all dietary filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
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
                // Clear category navigation when searching globally
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-white bg-surface-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          TIER 1: MASTER CATEGORIES GRID (Root Overview)
          - Preserved when filtering: Category card counts reduce in real-time!
          ========================================================================= */}
      {!selectedCategory && !selectedSubCategory && searchQuery.trim().length === 0 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 flex-wrap">
              <span>Main Categories</span>
              <span className="text-zinc-600">•</span>
              <span className="text-brand-400 font-mono">{FOOD_CATEGORIES.length} Groups</span>
              {hasActiveDietaryFilters && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {totalMatchingFoods} of {foods.length} items match active filters
                  </span>
                </>
              )}
            </h3>
            <span className="text-xs text-zinc-500">Click any group to explore sub-categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {FOOD_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isEmpty = count === 0;

              return (
                <div
                  key={cat.id}
                  id={`category-card-${cat.id}`}
                  onClick={() => {
                    if (!isEmpty) {
                      setSelectedCategory(cat.id);
                      setSelectedSubCategory(null);
                    }
                  }}
                  className={`group p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between shadow-lg ${
                    isEmpty
                      ? 'bg-surface-100/50 border-surface-border/50 opacity-60 cursor-not-allowed'
                      : 'bg-surface-100/90 hover:bg-surface-200/90 border-surface-border hover:border-brand-500/40 cursor-pointer hover:scale-[1.02]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-2xl bg-surface-200/80 border border-surface-border/60 group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </span>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-full font-semibold border ${
                          hasActiveDietaryFilters
                            ? isEmpty
                              ? 'bg-zinc-800 text-zinc-500 border-zinc-700'
                              : 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-glow'
                            : 'bg-surface-300/80 text-zinc-300 border-surface-border/60'
                        }`}
                      >
                        {count} {count === 1 ? 'food' : 'foods'}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold transition-colors ${isEmpty ? 'text-zinc-400' : 'text-zinc-100 group-hover:text-brand-400'}`}>
                      {cat.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs text-zinc-400 group-hover:text-brand-400 font-medium">
                    <span>{isEmpty ? '0 Matching Foods' : 'Explore Sub-Categories'}</span>
                    {!isEmpty && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIER 2: SUB-CATEGORIES GRID (When a Master Category is Chosen)
          - Subcategory card counts also reduce in real-time based on stacked filters!
          ========================================================================= */}
      {selectedCategory && !selectedSubCategory && searchQuery.trim().length === 0 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 rounded-2xl bg-surface-100 border border-surface-border gap-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
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
              {hasActiveDietaryFilters && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {categoryCounts[selectedCategory] || 0} matching items
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => setSelectedSubCategory('all')}
              className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>View All {categoryCounts[selectedCategory] || 0} Foods in Category</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {currentSubCategories.map((sub) => {
              const subCount = subCategoryCounts[sub.id] || 0;
              const isEmpty = subCount === 0;

              return (
                <div
                  key={sub.id}
                  id={`subcategory-card-${sub.id}`}
                  onClick={() => {
                    if (!isEmpty) {
                      setSelectedSubCategory(sub.id);
                    }
                  }}
                  className={`group p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between shadow-md ${
                    isEmpty
                      ? 'bg-surface-100/50 border-surface-border/50 opacity-60 cursor-not-allowed'
                      : 'bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border hover:border-brand-500/40 cursor-pointer hover:scale-[1.02]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl p-2 rounded-2xl bg-surface-200/80 border border-surface-border/60 group-hover:scale-110 transition-transform">
                        {sub.icon}
                      </span>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-full font-semibold border ${
                          hasActiveDietaryFilters
                            ? isEmpty
                              ? 'bg-zinc-800 text-zinc-500 border-zinc-700'
                              : 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-glow'
                            : 'bg-surface-300/80 text-zinc-300 border-surface-border/60'
                        }`}
                      >
                        {subCount} {subCount === 1 ? 'food' : 'foods'}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold transition-colors ${isEmpty ? 'text-zinc-400' : 'text-zinc-100 group-hover:text-brand-400'}`}>
                      {sub.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs text-zinc-400 group-hover:text-brand-400 font-medium">
                    <span>{isEmpty ? '0 Matching Foods' : 'View Foods'}</span>
                    {!isEmpty && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIER 3: FOOD ITEMS LIST (When Sub-Category is chosen OR Global Search is active)
          ========================================================================= */}
      {(selectedSubCategory !== null || searchQuery.trim().length > 0) && (
        <div className="space-y-4 animate-fadeIn">
          {/* Breadcrumb Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 rounded-2xl bg-surface-100 border border-surface-border gap-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setSearchQuery('');
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

              {selectedSubCategory === 'all' && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="font-bold text-brand-400">All Foods in Category</span>
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

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-surface-200 text-zinc-300 font-medium">
                {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Empty State */}
          {filteredFoods.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-surface-100/90 border border-surface-border space-y-3">
              <div className="text-4xl">🔍</div>
              <h4 className="text-base font-bold text-zinc-200">No foods found matching the active filters</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try unchecking one of the stacked dietary filters above to broaden your selection.
              </p>
              {hasActiveDietaryFilters && (
                <button
                  onClick={() => {
                    setFilterHighProtein(false);
                    setFilterGlutenFree(false);
                    setFilterDairyFree(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-500 text-zinc-950 font-bold text-xs cursor-pointer shadow-glow"
                >
                  Reset Dietary Filters
                </button>
              )}
            </div>
          )}

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredFoods.map((item) => (
              <div
                key={item.id}
                id={`food-card-${item.id}`}
                className="p-4 rounded-3xl bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border transition-all duration-200 flex flex-col justify-between shadow-md group cursor-pointer"
                onClick={() => setSelectedFoodDetail(item)}
              >
                <div>
                  {/* Title & Dietary Tags */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-300 transition-colors flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <Info className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                    Per 100{item.default_unit} • Tap for details
                  </span>

                  {onLogToMeal ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogToMeal(item, selectedMealIndex || 1);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log to Meal</span>
                    </button>
                  ) : onSelectFood ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFood(item);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 text-zinc-950 text-xs font-bold shadow-glow hover:bg-brand-400 transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select Food</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFoodDetail(item);
                      }}
                      className="flex items-center gap-1 text-xs text-brand-400 hover:underline font-semibold"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL WINDOW: COMPLETE FOOD NUTRITION & BIOAVAILABILITY BREAKDOWN
          ========================================================================= */}
      {selectedFoodDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="w-full max-w-lg rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-surface-border">
              <div>
                <span className="text-xs font-mono text-brand-400 uppercase tracking-wider font-semibold">
                  {selectedFoodDetail.category} / {selectedFoodDetail.sub_category || 'General'}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedFoodDetail.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                  Base Serving Size: {selectedFoodDetail.serving_size_g}g{' '}
                  {isImperial && `(~${(selectedFoodDetail.serving_size_g * 0.03527).toFixed(1)} oz)`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFoodDetail(null)}
                className="p-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dietary Verification Badges */}
            <div className="flex flex-wrap gap-2">
              {selectedFoodDetail.protein_per_100g >= 15 && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span>🥩 High Protein Density ({selectedFoodDetail.protein_per_100g}g/100g)</span>
                </span>
              )}
              {selectedFoodDetail.is_gluten_free && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span>🌾 100% Gluten-Free</span>
                </span>
              )}
              {selectedFoodDetail.is_dairy_free && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <span>🥛 100% Dairy-Free</span>
                </span>
              )}
            </div>

            {/* Macronutrient Ratios & Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
              <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border">
                <div className="text-[10px] text-zinc-400 uppercase font-sans">Calories</div>
                <div className="text-lg font-bold text-zinc-100 mt-0.5">{selectedFoodDetail.calories_per_100g}</div>
                <div className="text-[10px] text-zinc-500">per 100g</div>
              </div>
              <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border">
                <div className="text-[10px] text-brand-300 uppercase font-sans">Protein</div>
                <div className="text-lg font-bold text-brand-400 mt-0.5">{selectedFoodDetail.protein_per_100g}g</div>
                <div className="text-[10px] text-zinc-500">
                  {Math.round(((selectedFoodDetail.protein_per_100g * 4) / Math.max(1, selectedFoodDetail.calories_per_100g)) * 100)}% cal
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border">
                <div className="text-[10px] text-cyan-300 uppercase font-sans">Carbs</div>
                <div className="text-lg font-bold text-accent-cyan mt-0.5">{selectedFoodDetail.carbs_per_100g}g</div>
                <div className="text-[10px] text-zinc-500">
                  {Math.round(((selectedFoodDetail.carbs_per_100g * 4) / Math.max(1, selectedFoodDetail.calories_per_100g)) * 100)}% cal
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border">
                <div className="text-[10px] text-amber-300 uppercase font-sans">Fats</div>
                <div className="text-lg font-bold text-amber-400 mt-0.5">{selectedFoodDetail.fat_per_100g}g</div>
                <div className="text-[10px] text-zinc-500">
                  {Math.round(((selectedFoodDetail.fat_per_100g * 9) / Math.max(1, selectedFoodDetail.calories_per_100g)) * 100)}% cal
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border gap-3">
              <button
                type="button"
                onClick={() => setSelectedFoodDetail(null)}
                className="px-4 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              {onLogToMeal ? (
                <button
                  type="button"
                  onClick={() => {
                    onLogToMeal(selectedFoodDetail, selectedMealIndex || 1);
                    setSelectedFoodDetail(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal text-zinc-950 text-xs font-bold shadow-glow active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log to Meal #{selectedMealIndex || 1}</span>
                </button>
              ) : onSelectFood ? (
                <button
                  type="button"
                  onClick={() => {
                    onSelectFood(selectedFoodDetail);
                    setSelectedFoodDetail(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-zinc-950 text-xs font-bold shadow-glow active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Select Food</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
