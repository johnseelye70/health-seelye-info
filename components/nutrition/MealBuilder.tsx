'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  FoodItem,
  MealIngredient,
  MealMeasurementUnit,
  BuiltCustomMeal,
  FoodCategory,
} from '@/lib/types';
import {
  createMealIngredient,
  calculateMealDetailedNutrition,
  convertUnitToGrams,
} from '@/lib/nutrition-calculator';
import { searchFoodDatabase, searchLocalFoods } from '@/lib/food-search-service';
import { FOOD_CATEGORIES, normalizeFoodCategory } from '@/lib/food-database';
import {
  ChefHat,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Calendar,
  Flame,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  Globe,
  Loader2,
  BookmarkPlus,
  BookmarkCheck,
  Utensils,
  Zap,
  Info,
  ChevronRight,
  RotateCcw,
  Sliders,
  Percent,
  Pencil,
} from 'lucide-react';

interface MealBuilderProps {
  initialMealIndex?: number;
  onNavigateToDiary?: () => void;
}

export const MealBuilder: React.FC<MealBuilderProps> = ({
  initialMealIndex = 1,
  onNavigateToDiary,
}) => {
  const {
    profile,
    selectedDate,
    todayDate,
    customMeals,
    saveCustomMeal,
    deleteCustomMeal,
    logBuiltMealToDiary,
    updateBuiltMealInDiary,
    editingMealLog,
    setEditingMealLog,
  } = useHealth();

  const isImperial = profile.unit_preference === 'imperial';

  // Meal Header Settings
  const [mealName, setMealName] = useState<string>('');
  const [mealCategory, setMealCategory] = useState<BuiltCustomMeal['category']>('lunch');
  const [servingsYield, setServingsYield] = useState<number>(1);
  const [mealDescription, setMealDescription] = useState<string>('');

  // Active Ingredients in Current Meal
  const [ingredients, setIngredients] = useState<MealIngredient[]>([]);

  // Search & Selector State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<FoodCategory | 'all'>('all');
  const [enableGlobalSearch, setEnableGlobalSearch] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchSourceInfo, setSearchSourceInfo] = useState<{ local: number; global: number }>({
    local: 0,
    global: 0,
  });

  // Selected food item pending addition
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(100);
  const [selectedUnit, setSelectedUnit] = useState<MealMeasurementUnit>('g');

  // Nutrition Display View Mode: Per Serving vs Entire Batch
  const [nutritionViewMode, setNutritionViewMode] = useState<'serving' | 'batch'>('serving');

  // Logging Configuration
  const [logTargetDate, setLogTargetDate] = useState<string>(selectedDate || todayDate);
  const [logMealIndex, setLogMealIndex] = useState<number>(initialMealIndex);
  const [logServingsCount, setLogServingsCount] = useState<number>(1);
  const [logAsSingleItem, setLogAsSingleItem] = useState<boolean>(true);

  // User Feedback Toast
  const [feedbackToast, setFeedbackToast] = useState<{
    text: string;
    actionLabel?: string;
    action?: () => void;
  } | null>(null);

  // Synchronize initial meal index if prop updates
  useEffect(() => {
    if (initialMealIndex >= 1 && initialMealIndex <= 4) {
      setLogMealIndex(initialMealIndex);
    }
  }, [initialMealIndex]);

  // Synchronize meal if an existing logged meal was selected for editing
  useEffect(() => {
    if (editingMealLog) {
      setMealName(editingMealLog.meal.name);
      setMealDescription(editingMealLog.meal.description || '');
      setMealCategory(editingMealLog.meal.category);
      setServingsYield(editingMealLog.meal.servings_yield);
      setIngredients(editingMealLog.meal.ingredients);
      setLogMealIndex(editingMealLog.mealIndex);
      setLogTargetDate(editingMealLog.dateStr);
      setLogServingsCount(editingMealLog.servings);
    }
  }, [editingMealLog]);

  // Execute Debounced Food Search
  useEffect(() => {
    let isCancelled = false;

    // Fast local results immediately
    const instantLocal = searchLocalFoods(searchQuery, categoryFilter, 30);
    setSearchResults(instantLocal);
    setSearchSourceInfo({ local: instantLocal.length, global: 0 });

    if (!selectedFood && instantLocal.length > 0 && searchQuery.trim().length > 0) {
      setSelectedFood(instantLocal[0]);
    }

    if (enableGlobalSearch && searchQuery.trim().length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const res = await searchFoodDatabase(searchQuery, categoryFilter, true);
          if (!isCancelled) {
            setSearchResults(res.foods);
            setSearchSourceInfo({ local: res.localCount, global: res.globalCount });
            if (!selectedFood && res.foods.length > 0) {
              setSelectedFood(res.foods[0]);
            }
          }
        } catch (err) {
          console.warn('Search service error:', err);
        } finally {
          if (!isCancelled) setIsSearching(false);
        }
      }, 350);

      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    } else {
      setIsSearching(false);
    }
  }, [searchQuery, categoryFilter, enableGlobalSearch]);

  // Compute calculated nutrition for current meal
  const calculatedNutrition = useMemo(() => {
    return calculateMealDetailedNutrition(ingredients, servingsYield);
  }, [ingredients, servingsYield]);

  // Live preview for ingredient pending addition
  const pendingIngredientPreview = useMemo(() => {
    if (!selectedFood) return null;
    const grams = convertUnitToGrams(selectedQuantity, selectedUnit, selectedFood);
    const mult = grams / 100;
    return {
      grams,
      calories: Math.round(selectedFood.calories_per_100g * mult),
      protein: Number((selectedFood.protein_per_100g * mult).toFixed(1)),
      carbs: Number((selectedFood.carbs_per_100g * mult).toFixed(1)),
      fat: Number((selectedFood.fat_per_100g * mult).toFixed(1)),
    };
  }, [selectedFood, selectedQuantity, selectedUnit]);

  // Handle adding ingredient
  const handleAddIngredient = () => {
    if (!selectedFood || selectedQuantity <= 0) return;
    const newIng = createMealIngredient(selectedFood, selectedQuantity, selectedUnit);
    setIngredients((prev) => [...prev, newIng]);

    // If meal has no title yet, auto-suggest based on first ingredient
    if (!mealName.trim()) {
      setMealName(`${selectedFood.name} Custom Bowl`);
    }

    setFeedbackToast({
      text: `Added ${newIng.quantity}${newIng.unit} ${newIng.name}`,
    });
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Handle removing ingredient
  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Handle updating ingredient quantity
  const handleUpdateIngredientQuantity = (id: string, deltaQuantity: number) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== id) return ing;
        const newQty = Math.max(0.1, Number((ing.quantity + deltaQuantity).toFixed(1)));
        if (!ing.raw_food) return { ...ing, quantity: newQty };
        return createMealIngredient(ing.raw_food, newQty, ing.unit);
      })
    );
  };

  // Save current meal to reusable library
  const handleSaveMeal = () => {
    if (ingredients.length === 0) {
      setFeedbackToast({ text: 'Please add at least 1 ingredient before saving.' });
      setTimeout(() => setFeedbackToast(null), 3000);
      return;
    }

    const title = mealName.trim() || 'Custom Athletic Meal';
    const builtMeal: BuiltCustomMeal = {
      id: `meal-${Date.now()}`,
      name: title,
      description: mealDescription.trim() || `Crafted with ${ingredients.length} whole food ingredients.`,
      category: mealCategory,
      servings_yield: Math.max(1, servingsYield),
      ingredients,
      total_nutrition: calculatedNutrition.total,
      per_serving_nutrition: calculatedNutrition.perServing,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveCustomMeal(builtMeal);
    setFeedbackToast({
      text: `Saved "${title}" to your Saved Meals Library!`,
    });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Load a saved meal into builder
  const handleLoadSavedMeal = (meal: BuiltCustomMeal) => {
    setMealName(meal.name);
    setMealCategory(meal.category);
    setServingsYield(meal.servings_yield);
    setMealDescription(meal.description || '');
    setIngredients(meal.ingredients);
    setFeedbackToast({
      text: `Loaded "${meal.name}" into Builder!`,
    });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Log active meal directly to food diary
  const handleLogToDiary = () => {
    if (ingredients.length === 0) {
      setFeedbackToast({ text: 'Please add at least 1 ingredient before logging.' });
      setTimeout(() => setFeedbackToast(null), 3000);
      return;
    }

    const title = mealName.trim() || 'Custom Built Meal';
    const mealToLog: BuiltCustomMeal = {
      id: `meal-${Date.now()}`,
      name: title,
      description: mealDescription.trim(),
      category: mealCategory,
      servings_yield: Math.max(1, servingsYield),
      ingredients,
      total_nutrition: calculatedNutrition.total,
      per_serving_nutrition: calculatedNutrition.perServing,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    logBuiltMealToDiary(mealToLog, {
      servings: logServingsCount,
      mealIndex: logMealIndex,
      dateStr: logTargetDate,
      logAsSingleItem,
    });

    const mealLabel =
      logMealIndex === 1
        ? 'Breakfast'
        : logMealIndex === 2
        ? 'Lunch'
        : logMealIndex === 3
        ? 'Dinner'
        : 'Snacks';

    setFeedbackToast({
      text: `Logged "${title}" (${logServingsCount} ${
        logServingsCount === 1 ? 'serving' : 'servings'
      }) to ${mealLabel} on ${logTargetDate === todayDate ? 'Today' : logTargetDate}!`,
      actionLabel: 'View Diary',
      action: onNavigateToDiary,
    });
  };

  // Update an existing logged meal in the food diary
  const handleUpdateLoggedMeal = () => {
    if (!editingMealLog) return;
    if (ingredients.length === 0) {
      setFeedbackToast({ text: 'Please add at least 1 ingredient before updating.' });
      setTimeout(() => setFeedbackToast(null), 3000);
      return;
    }

    const title = mealName.trim() || editingMealLog.meal.name || 'Custom Built Meal';
    const updatedMeal: BuiltCustomMeal = {
      ...editingMealLog.meal,
      name: title,
      description: mealDescription.trim(),
      category: mealCategory,
      servings_yield: Math.max(1, servingsYield),
      ingredients,
      total_nutrition: calculatedNutrition.total,
      per_serving_nutrition: calculatedNutrition.perServing,
      updated_at: new Date().toISOString(),
    };

    updateBuiltMealInDiary(editingMealLog.logId, updatedMeal, {
      servings: logServingsCount,
      mealIndex: logMealIndex,
      dateStr: logTargetDate,
    });

    const mealLabel =
      logMealIndex === 1
        ? 'Breakfast'
        : logMealIndex === 2
        ? 'Lunch'
        : logMealIndex === 3
        ? 'Dinner'
        : 'Snacks';

    setFeedbackToast({
      text: `Updated "${title}" in your Food Diary for ${mealLabel} on ${
        logTargetDate === todayDate ? 'Today' : logTargetDate
      }!`,
      actionLabel: 'View Diary',
      action: onNavigateToDiary,
    });

    setEditingMealLog(null);
    if (onNavigateToDiary) {
      setTimeout(() => onNavigateToDiary(), 600);
    }
  };

  const activeDisplayNutrition =
    nutritionViewMode === 'serving'
      ? calculatedNutrition.perServing
      : calculatedNutrition.total;

  return (
    <div className="space-y-8 animate-fadeIn pb-16 w-full max-w-full">
      {/* Header Banner */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-brand-400" />
                <span>Customize</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-surface-200 text-zinc-300 border border-surface-border flex items-center gap-1">
                <Globe className="w-3 h-3 text-accent-cyan" />
                <span>1,000+ Local & 3.5M+ Global Foods</span>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Custom Meal Builder
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Create custom meals and recipes by adding ingredients from our food database. Track calories, macros, and full nutrition facts, then log directly to your daily food diary.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setIngredients([]);
                setMealName('');
                setMealDescription('');
                setServingsYield(1);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Clear All</span>
            </button>
            <button
              type="button"
              onClick={handleSaveMeal}
              disabled={ingredients.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-brand-300 hover:border-brand-500/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookmarkPlus className="w-4 h-4 text-brand-400" />
              <span>Save Meal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Edit Logged Meal Banner */}
      {editingMealLog && (
        <div className="p-4 md:p-5 rounded-3xl bg-amber-500/15 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg backdrop-blur-xl animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-100 flex flex-wrap items-center gap-2">
                <span>Editing Logged Meal: <strong>"{editingMealLog.meal.name}"</strong></span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold">
                  {editingMealLog.dateStr === todayDate ? 'Today' : editingMealLog.dateStr} • Meal {editingMealLog.mealIndex}
                </span>
              </div>
              <p className="text-xs text-amber-300/80 mt-1">
                Make adjustments to ingredients or servings below. Updating will modify this entry directly in your Food Diary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="cancel-edit-logged-meal-btn"
              onClick={() => {
                setEditingMealLog(null);
                if (onNavigateToDiary) onNavigateToDiary();
              }}
              className="px-3.5 py-2 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Cancel Edit
            </button>
            <button
              type="button"
              id="save-edit-logged-meal-btn"
              onClick={handleUpdateLoggedMeal}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-glow transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Meal in Diary</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Toast */}
      {feedbackToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{feedbackToast.text}</span>
          </div>
          {feedbackToast.action && (
            <button
              type="button"
              onClick={feedbackToast.action}
              className="px-2.5 py-1 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-black hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              {feedbackToast.actionLabel || 'View'}
            </button>
          )}
        </div>
      )}

      {/* Main Builder Grid: Left (Builder Controls & Search) | Right (Active Meal & Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* ================= LEFT COLUMN: MEAL SETUP & INGREDIENT SEARCH (7 COLS) ================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Meal Details Card */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-5 md:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Step 1: Meal Details</span>
              </span>
              <span className="text-[11px] text-zinc-400">Yields: {servingsYield} {servingsYield === 1 ? 'serving' : 'servings'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Meal Title</label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g. Post-Workout Mega Bowl"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-200 border border-surface-border text-foreground text-sm font-semibold focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Meal Category</label>
                <select
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-200 border border-surface-border text-foreground text-xs font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="breakfast">🍳 Breakfast</option>
                  <option value="lunch">🥗 Lunch</option>
                  <option value="dinner">🥩 Dinner</option>
                  <option value="snack">🍎 Snack</option>
                  <option value="pre_workout">⚡ Pre-Workout Fuel</option>
                  <option value="post_workout">💪 Post-Workout Recovery</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-surface-border/50">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-zinc-300">Total Servings in Batch:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setServingsYield(num)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        servingsYield === num
                          ? 'bg-brand-500 text-zinc-950 shadow-glow'
                          : 'bg-surface-200 text-zinc-300 hover:bg-surface-300'
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 font-mono">
                {ingredients.length} {ingredients.length === 1 ? 'ingredient' : 'ingredients'} added
              </div>
            </div>
          </div>

          {/* Step 2: Food Database Search & Ingredient Selector */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-5 md:p-6 backdrop-blur-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Step 2: Search & Add Ingredients</span>
              </span>

              <div className="flex items-center gap-2">
                <label className="text-[11px] text-zinc-400 flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableGlobalSearch}
                    onChange={(e) => setEnableGlobalSearch(e.target.checked)}
                    className="rounded text-brand-500 focus:ring-brand-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Include Global Database (3.5M+ foods)</span>
                </label>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chicken breast, jasmine rice, olive oil, Dave's bread, Chobani..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-surface-200 border border-surface-border text-foreground text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              {isSearching ? (
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin absolute right-3.5 top-3.5" />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-500 hover:text-zinc-300 absolute right-3.5 top-3.5 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              ) : null}
            </div>

            {/* Quick Category Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold'
                    : 'bg-surface-200 text-zinc-400 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {FOOD_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 flex items-center gap-1 transition-colors cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold'
                      : 'bg-surface-200 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* Search Results List (Max 6 visible with clear scroll) */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {searchResults.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">
                  No matching foods found. Try adjusting your query or toggle Global Database search.
                </div>
              ) : (
                searchResults.slice(0, 20).map((food) => {
                  const isSelected = selectedFood?.id === food.id;
                  return (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => {
                        setSelectedFood(food);
                        if (food.default_unit === 'oz' && selectedUnit === 'g') {
                          setSelectedUnit('oz');
                          setSelectedQuantity(4);
                        } else if (food.default_unit === 'cup' && selectedUnit === 'g') {
                          setSelectedUnit('cup');
                          setSelectedQuantity(1);
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-500/15 border-brand-500/50 shadow-glow'
                          : 'bg-surface-200/60 border-surface-border hover:bg-surface-200 hover:border-zinc-700'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{food.name}</span>
                          {food.brand && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-accent-teal/15 text-accent-teal border border-accent-teal/30 shrink-0">
                              {food.brand}
                            </span>
                          )}
                          {food.is_global_db && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono text-zinc-400 bg-surface-300 shrink-0">
                              Global DB
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span className="text-brand-400 font-mono font-bold">
                            {food.calories_per_100g} kcal/100g
                          </span>
                          <span>•</span>
                          <span>P: {food.protein_per_100g}g</span>
                          <span>C: {food.carbs_per_100g}g</span>
                          <span>F: {food.fat_per_100g}g</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-brand-500 text-zinc-950 flex items-center justify-center text-xs font-black">
                            ✓
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500 hover:text-brand-400">Select</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Selected Ingredient Amount & Unit Adder */}
            {selectedFood && (
              <div className="p-4 rounded-2xl bg-surface-200/90 border border-brand-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Configure Amount for:</span>
                    <span className="text-xs font-extrabold text-brand-400 truncate max-w-xs">
                      {selectedFood.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Base: {selectedFood.calories_per_100g} kcal / 100g
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Quantity Input */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step={selectedUnit === 'cup' || selectedUnit === 'serving' ? 0.25 : 5}
                      min={0.1}
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-foreground font-mono font-bold text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Unit Selector */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Unit
                    </label>
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value as MealMeasurementUnit)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-foreground text-xs font-bold focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="g">Grams (g)</option>
                      <option value="oz">Ounces (oz)</option>
                      <option value="cup">Cups (cup)</option>
                      <option value="tbsp">Tablespoons (tbsp)</option>
                      <option value="tsp">Teaspoons (tsp)</option>
                      <option value="serving">Serving / Piece</option>
                    </select>
                  </div>

                  {/* Add Button */}
                  <div className="sm:col-span-4 pt-4 sm:pt-0">
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 font-black text-xs shadow-glow transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Add to Meal</span>
                    </button>
                  </div>
                </div>

                {/* Live Preview Pill */}
                {pendingIngredientPreview && (
                  <div className="p-2.5 rounded-xl bg-surface-300/60 border border-surface-border flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="text-zinc-300 font-mono">
                      Yields: <strong className="text-white">{pendingIngredientPreview.grams}g</strong>
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-brand-400 font-bold">
                        {pendingIngredientPreview.calories} kcal
                      </span>
                      <span className="text-zinc-400">P: {pendingIngredientPreview.protein}g</span>
                      <span className="text-zinc-400">C: {pendingIngredientPreview.carbs}g</span>
                      <span className="text-zinc-400">F: {pendingIngredientPreview.fat}g</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: MEAL INGREDIENTS & NUTRITION BREAKDOWN (5 COLS) ================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Ingredients List */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-5 md:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-emerald font-mono flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                <span>Meal Ingredients ({ingredients.length})</span>
              </span>
              {ingredients.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIngredients([])}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {ingredients.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-surface-200/40 border border-dashed border-surface-border text-xs text-zinc-400 space-y-2">
                <ChefHat className="w-8 h-8 text-zinc-500 mx-auto stroke-1" />
                <p className="font-semibold text-zinc-300">No ingredients added yet</p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Search and add ingredients from the left panel to calculate macros and build your meal.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{ing.name}</span>
                        {ing.brand && (
                          <span className="text-[9px] px-1 rounded bg-surface-300 text-zinc-400 shrink-0">
                            {ing.brand}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5 flex items-center gap-2">
                        <span className="text-brand-400 font-bold">{ing.calories} kcal</span>
                        <span>•</span>
                        <span>{ing.quantity} {ing.unit} ({ing.grams}g)</span>
                        <span>•</span>
                        <span>P: {ing.protein_g}g</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateIngredientQuantity(ing.id, -10)}
                        className="w-6 h-6 rounded-lg bg-surface-300 hover:bg-surface-400 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Decrease amount"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateIngredientQuantity(ing.id, 10)}
                        className="w-6 h-6 rounded-lg bg-surface-300 hover:bg-surface-400 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Increase amount"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ing.id)}
                        className="w-6 h-6 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer ml-1"
                        title="Remove ingredient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nutrition Breakdown Card */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-5 md:p-6 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Nutrition Breakdown</span>
              </span>

              {/* View Switcher: Per Serving vs Entire Meal */}
              <div className="flex items-center rounded-xl bg-surface-200 p-0.5 border border-surface-border">
                <button
                  type="button"
                  onClick={() => setNutritionViewMode('serving')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    nutritionViewMode === 'serving'
                      ? 'bg-brand-500 text-zinc-950 shadow-glow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Per Serving
                </button>
                <button
                  type="button"
                  onClick={() => setNutritionViewMode('batch')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    nutritionViewMode === 'batch'
                      ? 'bg-brand-500 text-zinc-950 shadow-glow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Full Batch
                </button>
              </div>
            </div>

            {/* Headline Big Metric Cards */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Calories</span>
                <span className="text-lg md:text-xl font-black text-brand-400 font-mono">
                  {activeDisplayNutrition.calories}
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono">kcal</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Protein</span>
                <span className="text-lg md:text-xl font-black text-accent-cyan font-mono">
                  {activeDisplayNutrition.protein_g}
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono">{activeDisplayNutrition.protein_pct}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Carbs</span>
                <span className="text-lg md:text-xl font-black text-amber-400 font-mono">
                  {activeDisplayNutrition.carbs_g}
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono">{activeDisplayNutrition.carbs_pct}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Fat</span>
                <span className="text-lg md:text-xl font-black text-emerald-400 font-mono">
                  {activeDisplayNutrition.fat_g}
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono">{activeDisplayNutrition.fat_pct}%</span>
              </div>
            </div>

            {/* Macro Distribution Ratio Bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                <span>Macro Ratio</span>
                <span>
                  {activeDisplayNutrition.protein_pct}% P / {activeDisplayNutrition.carbs_pct}% C / {activeDisplayNutrition.fat_pct}% F
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex bg-surface-300">
                <div
                  style={{ width: `${activeDisplayNutrition.protein_pct}%` }}
                  className="bg-accent-cyan transition-all duration-300"
                  title={`Protein: ${activeDisplayNutrition.protein_pct}%`}
                />
                <div
                  style={{ width: `${activeDisplayNutrition.carbs_pct}%` }}
                  className="bg-amber-400 transition-all duration-300"
                  title={`Carbohydrates: ${activeDisplayNutrition.carbs_pct}%`}
                />
                <div
                  style={{ width: `${activeDisplayNutrition.fat_pct}%` }}
                  className="bg-emerald-400 transition-all duration-300"
                  title={`Fats: ${activeDisplayNutrition.fat_pct}%`}
                />
              </div>
            </div>

            {/* Nutrition Facts Label (FDA / MyFitnessPal style) */}
            <div className="p-4 rounded-2xl bg-surface-200/90 border border-surface-border text-xs space-y-3 font-mono">
              <div className="border-b-2 border-white pb-1 flex items-center justify-between">
                <span className="text-sm font-black tracking-tight text-white uppercase font-sans">
                  Nutrition Facts
                </span>
                <span className="text-[10px] text-zinc-400">
                  {nutritionViewMode === 'serving' ? 'Per 1 Serving' : `Batch Total (${servingsYield} Servings)`}
                </span>
              </div>

              {/* Weight & Density */}
              <div className="flex items-center justify-between text-[11px] text-zinc-300 border-b border-surface-border pb-1">
                <span>Total Food Weight</span>
                <span className="font-bold text-white">
                  {activeDisplayNutrition.total_weight_g}g ({Number((activeDisplayNutrition.total_weight_g / 28.3495).toFixed(1))} oz)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-300 border-b border-surface-border pb-1">
                <span>Calorie Density</span>
                <span className="font-bold text-brand-400">
                  {activeDisplayNutrition.calorie_density_per_100g} kcal / 100g
                </span>
              </div>

              {/* Fats breakdown */}
              <div className="space-y-1 border-b border-surface-border pb-1 text-[11px]">
                <div className="flex justify-between font-bold text-white">
                  <span>Total Fat</span>
                  <span>{activeDisplayNutrition.fat_g}g</span>
                </div>
                <div className="flex justify-between pl-3 text-zinc-400">
                  <span>Saturated Fat</span>
                  <span>{activeDisplayNutrition.saturated_fat_g}g</span>
                </div>
                <div className="flex justify-between pl-3 text-zinc-400">
                  <span>Monounsaturated Fat</span>
                  <span>{activeDisplayNutrition.monounsaturated_fat_g}g</span>
                </div>
                <div className="flex justify-between pl-3 text-zinc-400">
                  <span>Polyunsaturated Fat</span>
                  <span>{activeDisplayNutrition.polyunsaturated_fat_g}g</span>
                </div>
                <div className="flex justify-between pl-3 text-zinc-400">
                  <span>Trans Fat</span>
                  <span>{activeDisplayNutrition.trans_fat_g}g</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-300">
                  <span>Cholesterol</span>
                  <span>{activeDisplayNutrition.cholesterol_mg}mg</span>
                </div>
              </div>

              {/* Carbohydrates breakdown */}
              <div className="space-y-1 border-b border-surface-border pb-1 text-[11px]">
                <div className="flex justify-between font-bold text-white">
                  <span>Total Carbohydrate</span>
                  <span>{activeDisplayNutrition.carbs_g}g</span>
                </div>
                <div className="flex justify-between pl-3 text-accent-emerald font-semibold">
                  <span>Dietary Fiber</span>
                  <span>{activeDisplayNutrition.fiber_g}g</span>
                </div>
                <div className="flex justify-between pl-3 text-accent-cyan font-bold">
                  <span>Net Impact Carbs</span>
                  <span>{activeDisplayNutrition.net_carbs_g}g</span>
                </div>
                <div className="flex justify-between pl-3 text-zinc-400">
                  <span>Total Sugars</span>
                  <span>{activeDisplayNutrition.sugar_g}g</span>
                </div>
                {activeDisplayNutrition.added_sugar_g > 0 && (
                  <div className="flex justify-between pl-6 text-zinc-500">
                    <span>Includes Added Sugars</span>
                    <span>{activeDisplayNutrition.added_sugar_g}g</span>
                  </div>
                )}
              </div>

              {/* Protein */}
              <div className="flex justify-between font-bold text-white text-[11px] border-b border-surface-border pb-1">
                <span>Protein</span>
                <span className="text-accent-cyan">{activeDisplayNutrition.protein_g}g</span>
              </div>

              {/* Electrolytes & Minerals */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-zinc-400 border-b border-surface-border pb-1">
                <div className="flex justify-between">
                  <span>Sodium:</span>
                  <span className="font-bold text-zinc-200">{activeDisplayNutrition.sodium_mg}mg</span>
                </div>
                <div className="flex justify-between">
                  <span>Potassium:</span>
                  <span className="font-bold text-zinc-200">{activeDisplayNutrition.potassium_mg}mg</span>
                </div>
                <div className="flex justify-between">
                  <span>Calcium:</span>
                  <span className="font-bold text-zinc-200">{activeDisplayNutrition.calcium_mg}mg</span>
                </div>
                <div className="flex justify-between">
                  <span>Iron:</span>
                  <span className="font-bold text-zinc-200">{activeDisplayNutrition.iron_mg}mg</span>
                </div>
                <div className="flex justify-between">
                  <span>Magnesium:</span>
                  <span className="font-bold text-zinc-200">{activeDisplayNutrition.magnesium_mg}mg</span>
                </div>
                <div className="flex justify-between">
                  <span>Zinc:</span>
                  <span className="font-bold text-zinc-200">{activeDisplayNutrition.zinc_mg}mg</span>
                </div>
              </div>

              {/* Key Vitamins */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-400 pt-0.5">
                <div className="text-center p-1 rounded bg-surface-300/50">
                  <span className="block text-zinc-500">Vit A</span>
                  <strong className="text-zinc-200">{activeDisplayNutrition.vitamin_a_mcg}mcg</strong>
                </div>
                <div className="text-center p-1 rounded bg-surface-300/50">
                  <span className="block text-zinc-500">Vit C</span>
                  <strong className="text-zinc-200">{activeDisplayNutrition.vitamin_c_mg}mg</strong>
                </div>
                <div className="text-center p-1 rounded bg-surface-300/50">
                  <span className="block text-zinc-500">Vit D</span>
                  <strong className="text-zinc-200">{activeDisplayNutrition.vitamin_d_iu}IU</strong>
                </div>
              </div>
            </div>

            {/* Step 3: Direct Integration into Daily Food Plan / Intake */}
            <div className="p-4 rounded-2xl bg-surface-200/90 border border-surface-border space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Integrate into Daily Intake Plan</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold mb-1">Target Date</label>
                  <input
                    type="date"
                    value={logTargetDate}
                    onChange={(e) => e.target.value && setLogTargetDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-surface-300 border border-surface-border text-foreground font-mono text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold mb-1">Meal Slot</label>
                  <select
                    value={logMealIndex}
                    onChange={(e) => setLogMealIndex(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-surface-300 border border-surface-border text-foreground text-xs focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value={1}>Meal 1 (Breakfast)</option>
                    <option value={2}>Meal 2 (Lunch)</option>
                    <option value={3}>Meal 3 (Dinner)</option>
                    <option value={4}>Meal 4 (Snacks/Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold mb-1">Servings to Log</label>
                  <select
                    value={logServingsCount}
                    onChange={(e) => setLogServingsCount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-surface-300 border border-surface-border text-foreground text-xs font-bold focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value={0.5}>0.5 Serving</option>
                    <option value={1}>1.0 Serving</option>
                    <option value={1.5}>1.5 Servings</option>
                    <option value={2}>2.0 Servings</option>
                    <option value={3}>3.0 Servings</option>
                    <option value={servingsYield}>Entire Batch ({servingsYield}x)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-[11px] text-zinc-400 flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={logAsSingleItem}
                    onChange={(e) => setLogAsSingleItem(e.target.checked)}
                    className="rounded text-brand-500 focus:ring-brand-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Log as 1 consolidated meal (Clean Diary view)</span>
                </label>
              </div>

              <button
                type="button"
                id="submit-meal-builder-btn"
                onClick={editingMealLog ? handleUpdateLoggedMeal : handleLogToDiary}
                disabled={ingredients.length === 0}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 font-black text-sm shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {editingMealLog ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Update Logged Meal in Food Diary</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 stroke-[3]" />
                    <span>Log Meal to Daily Food Diary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= INLINE LIBRARY: MY SAVED CUSTOM MEALS ================= */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-4">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-brand-400" />
              <span>My Saved Meals Library ({customMeals.length})</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Reusable athletic meals and custom recipes saved to your private library. Re-log in 1 click anytime.
            </p>
          </div>

          <span className="text-[11px] font-mono text-zinc-400">
            {customMeals.length === 0 ? 'No custom meals saved yet' : `${customMeals.length} recipes saved`}
          </span>
        </div>

        {customMeals.length === 0 ? (
          <div className="text-center py-10 px-4 text-xs text-zinc-400 space-y-2">
            <Utensils className="w-8 h-8 text-zinc-500 mx-auto stroke-1" />
            <p className="font-semibold text-zinc-300">No saved custom meals yet</p>
            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
              Build your favorite meals above and click "Save Meal" to build your personal library of quick-log meal preps.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customMeals.map((saved) => (
              <div
                key={saved.id}
                className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white truncate">{saved.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
                      {saved.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {saved.description || `${saved.ingredients.length} whole food ingredients`}
                  </p>

                  <div className="grid grid-cols-4 gap-1 text-center font-mono my-2.5 p-2 rounded-xl bg-surface-300/60 border border-surface-border/50 text-[10px]">
                    <div>
                      <span className="text-zinc-400 block">Cals</span>
                      <strong className="text-brand-400 text-xs">
                        {saved.per_serving_nutrition.calories}
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block">Protein</span>
                      <strong className="text-accent-cyan text-xs">
                        {saved.per_serving_nutrition.protein_g}g
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block">Carbs</span>
                      <strong className="text-amber-400 text-xs">
                        {saved.per_serving_nutrition.carbs_g}g
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block">Fat</span>
                      <strong className="text-emerald-400 text-xs">
                        {saved.per_serving_nutrition.fat_g}g
                      </strong>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                    <span>Yield: {saved.servings_yield} servings</span>
                    <span>{saved.ingredients.length} items</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-surface-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      logBuiltMealToDiary(saved, {
                        servings: 1,
                        mealIndex: 1,
                        dateStr: selectedDate || todayDate,
                        logAsSingleItem: true,
                      });
                      setFeedbackToast({
                        text: `Logged 1 serving of "${saved.name}" to your Food Diary!`,
                        actionLabel: 'View Diary',
                        action: onNavigateToDiary,
                      });
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 text-xs font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Quick Log</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoadSavedMeal(saved)}
                    className="px-2.5 py-1.5 rounded-xl bg-surface-300 hover:bg-surface-400 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                    title="Load into builder to edit"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCustomMeal(saved.id)}
                    className="p-1.5 rounded-xl hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
