'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  WholesomeMeal,
  getDailyWholesomeMeals,
  getSmartWholesomeSuggestion,
  createFoodItemFromWholesomeMeal,
} from '@/lib/wholesome-meals';
import {
  RecipeItem,
  RecipeIngredient,
  RecipeIngredientSwapOption,
  GroceryStoreTag,
} from '@/lib/types';
import { getSmartSwapsForIngredient } from '@/lib/recipe-swap-engine';
import {
  UtensilsCrossed,
  Sparkles,
  Shuffle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  RotateCcw,
  ShoppingCart,
  Sliders,
  BookOpen,
} from 'lucide-react';

interface WholesomeMealsSectionProps {
  onBrowseRecipes?: () => void;
  onOpenRecipe?: (recipe: RecipeItem) => void;
  title?: string;
  subtitle?: string;
}

const STORE_OPTIONS: { id: GroceryStoreTag; label: string }[] = [
  { id: 'all', label: 'All Stores' },
  { id: 'aldi', label: 'Aldi' },
  { id: 'meijer', label: 'Meijer' },
  { id: 'sams_club', label: "Sam's Club" },
  { id: 'costco', label: 'Costco Wholesale' },
  { id: 'walmart', label: 'Walmart' },
];

export const WholesomeMealsSection: React.FC<WholesomeMealsSectionProps> = ({
  onBrowseRecipes,
  onOpenRecipe,
  title = '1-Tap Wholesome Meals',
  subtitle = 'Rotates daily • View, modify ingredients, or log with 1 tap',
}) => {
  const {
    profile,
    todayRemaining,
    fastingStatus,
    logFood,
    addGroceryItem,
    selectedDate,
    todayDate,
    setActiveTab,
  } = useHealth();

  const isImperial = profile.unit_preference === 'imperial';

  // Rotation & Recommendation State
  const [shuffleOffset, setShuffleOffset] = useState<number>(0);
  const [showSuggestion, setShowSuggestion] = useState<boolean>(true);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const [recentlyLoggedId, setRecentlyLoggedId] = useState<string | null>(null);
  const [recentlyLoggedName, setRecentlyLoggedName] = useState<string | null>(null);

  // 100% Inline Recipe & Ingredient Customizer State
  const [activeCustomizingMeal, setActiveCustomizingMeal] = useState<WholesomeMeal | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [ingredientMultipliers, setIngredientMultipliers] = useState<Record<number, number>>({});
  const [activeSwaps, setActiveSwaps] = useState<Record<number, RecipeIngredientSwapOption>>({});
  const [openSwapIndex, setOpenSwapIndex] = useState<number | null>(null);
  const [selectedTargetStore, setSelectedTargetStore] = useState<GroceryStoreTag>('all');
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'log' | 'grocery' | 'reset';
    message: string;
  } | null>(null);

  const targetDate = selectedDate || todayDate || new Date().toISOString().split('T')[0];

  // Deterministic 4-meal daily rotation (changes every day, cycles on shuffle)
  const dailyMeals = useMemo(() => {
    return getDailyWholesomeMeals(targetDate, shuffleOffset);
  }, [targetDate, shuffleOffset]);

  // Intelligent context-aware meal recommendation
  const smartSuggestion = useMemo(() => {
    return getSmartWholesomeSuggestion({
      remainingCalories: todayRemaining.calories,
      isFasting: fastingStatus.isFasting,
      currentHour: new Date().getHours(),
      suggestionIndex,
    });
  }, [todayRemaining.calories, fastingStatus.isFasting, suggestionIndex]);

  // 1-Tap Log Handler for Base Meals
  const handleLogWholesomeMeal = (meal: WholesomeMeal) => {
    const foodItem = createFoodItemFromWholesomeMeal(meal);
    logFood({
      user_id: profile.id,
      food: foodItem,
      food_name: meal.foodName,
      grams_consumed: meal.grams,
      meal_index: meal.mealIndex,
      logged_at: targetDate,
    });

    setRecentlyLoggedId(meal.id);
    setRecentlyLoggedName(meal.shortName);

    setTimeout(() => {
      setRecentlyLoggedId((prev) => (prev === meal.id ? null : prev));
    }, 3500);
  };

  const handleShuffle = () => {
    setShuffleOffset((prev) => prev + 1);
  };

  const handleCycleSuggestion = () => {
    setSuggestionIndex((prev) => prev + 1);
  };

  // Open Inline Recipe & Ingredient Customizer
  const handleOpenCustomizer = (meal: WholesomeMeal) => {
    setActiveCustomizingMeal(meal);
    setPortionMultiplier(1);
    setIngredientMultipliers({});
    setActiveSwaps({});
    setOpenSwapIndex(null);
    setActionFeedback(null);
  };

  // Close Customizer and Return to 4-Meal Grid
  const handleCloseCustomizer = () => {
    setActiveCustomizingMeal(null);
    setOpenSwapIndex(null);
    setActionFeedback(null);
  };

  // Reset Customizations for Active Meal
  const handleResetCustomizations = () => {
    setPortionMultiplier(1);
    setIngredientMultipliers({});
    setActiveSwaps({});
    setOpenSwapIndex(null);
    setActionFeedback({
      type: 'reset',
      message: 'Reset recipe to original base ingredients and proportions.',
    });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Step an individual ingredient multiplier (+/- 0.25x, min 0, max 3)
  const handleStepIngredientMultiplier = (idx: number, delta: number) => {
    setIngredientMultipliers((prev) => {
      const current = prev[idx] ?? 1.0;
      const next = Math.max(0, Math.min(3.0, Math.round((current + delta) * 100) / 100));
      return { ...prev, [idx]: next };
    });
  };

  // Apply or Remove Smart Swap
  const handleApplySwap = (idx: number, swap: RecipeIngredientSwapOption) => {
    setActiveSwaps((prev) => ({ ...prev, [idx]: swap }));
    setOpenSwapIndex(null);
  };

  const handleUndoSwap = (idx: number) => {
    setActiveSwaps((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  // Compute live recalculated macros for active customizing meal
  const currentCustomMacros = useMemo(() => {
    if (!activeCustomizingMeal) return null;

    let totalCals = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalGrams = 0;

    const baseIngredients = activeCustomizingMeal.recipe.ingredients;

    baseIngredients.forEach((ing, idx) => {
      const mult = ingredientMultipliers[idx] ?? 1.0;
      if (mult <= 0) return; // Omitted ingredient

      const effectiveScale = portionMultiplier * mult;
      const swap = activeSwaps[idx];

      const calsBase = swap
        ? swap.calories
        : (ing.calories_base ?? Math.round(activeCustomizingMeal.cals / baseIngredients.length));
      const protBase = swap
        ? swap.protein_g
        : (ing.protein_g_base ?? Math.round(activeCustomizingMeal.protein_g / baseIngredients.length));
      const carbsBase = swap
        ? swap.carbs_g
        : (ing.carbs_g_base ?? Math.round(activeCustomizingMeal.carbs_g / baseIngredients.length));
      const fatBase = swap
        ? swap.fat_g
        : (ing.fat_g_base ?? Math.round(activeCustomizingMeal.fat_g / baseIngredients.length));
      const gramsBase = (swap ? swap.raw_weight_grams_base : ing.raw_weight_grams_base) || 50;

      totalCals += calsBase * effectiveScale;
      totalProt += protBase * effectiveScale;
      totalCarbs += carbsBase * effectiveScale;
      totalFat += fatBase * effectiveScale;
      totalGrams += gramsBase * effectiveScale;
    });

    return {
      cals: Math.max(20, Math.round(totalCals)),
      protein_g: Math.max(0, Math.round(totalProt * 10) / 10),
      carbs_g: Math.max(0, Math.round(totalCarbs * 10) / 10),
      fat_g: Math.max(0, Math.round(totalFat * 10) / 10),
      grams: Math.max(20, Math.round(totalGrams)),
    };
  }, [activeCustomizingMeal, portionMultiplier, ingredientMultipliers, activeSwaps]);

  // Log customized meal with exact live recalculated macros
  const handleLogCustomizedMeal = () => {
    if (!activeCustomizingMeal || !currentCustomMacros) return;

    const isModified =
      portionMultiplier !== 1 ||
      Object.values(ingredientMultipliers).some((m) => m !== 1) ||
      Object.keys(activeSwaps).length > 0;

    const customizedName = isModified
      ? `${activeCustomizingMeal.foodName} (Customized)`
      : activeCustomizingMeal.foodName;

    const foodItem = createFoodItemFromWholesomeMeal(activeCustomizingMeal, {
      calories: currentCustomMacros.cals,
      protein_g: currentCustomMacros.protein_g,
      carbs_g: currentCustomMacros.carbs_g,
      fat_g: currentCustomMacros.fat_g,
      name: customizedName,
    });

    logFood({
      user_id: profile.id,
      food: foodItem,
      food_name: customizedName,
      grams_consumed: currentCustomMacros.grams,
      meal_index: activeCustomizingMeal.mealIndex,
      logged_at: targetDate,
    });

    setRecentlyLoggedId(activeCustomizingMeal.id);
    setRecentlyLoggedName(customizedName);

    setActionFeedback({
      type: 'log',
      message: `✓ Logged ${customizedName} (${currentCustomMacros.cals} kcal, ${currentCustomMacros.protein_g}g P) to today's diary!`,
    });

    setTimeout(() => {
      setRecentlyLoggedId((prev) => (prev === activeCustomizingMeal.id ? null : prev));
    }, 4000);
  };

  // Sync scaled ingredients to grocery list with store routing
  const handleSyncGrocery = () => {
    if (!activeCustomizingMeal) return;

    const listMap: Record<string, string> = {
      aldi: 'aldi_run',
      meijer: 'meijer_run',
      sams_club: 'sams_club_bulk',
      costco: 'costco_bulk',
      walmart: 'walmart_run',
      all: 'main',
    };
    const targetListId = listMap[selectedTargetStore] || 'main';

    let count = 0;
    activeCustomizingMeal.recipe.ingredients.forEach((ing, idx) => {
      const mult = ingredientMultipliers[idx] ?? 1.0;
      if (mult <= 0) return; // Skip omitted

      const effectiveMult = portionMultiplier * mult;
      const swap = activeSwaps[idx];
      const itemIng = swap || ing;

      const baseMeasure = isImperial ? itemIng.amount_imperial : itemIng.amount_metric;
      const scaledMeasure =
        effectiveMult !== 1
          ? `${effectiveMult.toFixed(effectiveMult % 1 === 0 ? 0 : 2)}x (${baseMeasure})`
          : baseMeasure;

      addGroceryItem({
        item_name: itemIng.name,
        category: 'fresh_weekly',
        quantity: Math.max(1, Math.round(effectiveMult)),
        unit: baseMeasure,
        department: (itemIng as RecipeIngredient).department || 'produce',
        is_checked: false,
        in_pantry: false,
        store_tag: selectedTargetStore !== 'all' ? selectedTargetStore : undefined,
        list_id: targetListId,
        notes: `For ${activeCustomizingMeal.name} (${scaledMeasure})${swap ? ' [Swapped]' : ''}`,
      });
      count++;
    });

    const storeLabel =
      STORE_OPTIONS.find((s) => s.id === selectedTargetStore)?.label || 'Grocery';

    setActionFeedback({
      type: 'grocery',
      message: `🛒 Added ${count} ingredients from "${activeCustomizingMeal.name}" to your ${storeLabel} list!`,
    });

    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Helper to format scaled ingredient measurements
  const formatScaledMeasure = (
    ing: RecipeIngredient,
    swap: RecipeIngredientSwapOption | undefined,
    effectiveMult: number
  ) => {
    const target = swap || ing;
    const baseGrams = target.raw_weight_grams_base || 50;
    const scaledGrams = Math.round(baseGrams * effectiveMult);

    if (effectiveMult === 1) {
      return isImperial ? target.amount_imperial : target.amount_metric;
    }

    if (isImperial) {
      const oz = (scaledGrams * 0.035274).toFixed(1);
      return `${target.amount_imperial} • ${effectiveMult.toFixed(effectiveMult % 1 === 0 ? 0 : 2)}x (${oz} oz / ${scaledGrams}g)`;
    }
    return `${target.amount_metric} • ${scaledGrams}g (${effectiveMult.toFixed(effectiveMult % 1 === 0 ? 0 : 2)}x)`;
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-5">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-100">{title}</h2>
              {shuffleOffset > 0 && !activeCustomizingMeal && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-mono font-bold">
                  Shuffle #{shuffleOffset}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">{subtitle}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {!activeCustomizingMeal ? (
            <>
              <button
                type="button"
                id="wholesome-shuffle-btn"
                onClick={handleShuffle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200/80 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                title="Randomize a new set of 4 wholesome meals for today"
              >
                <Shuffle className="w-3.5 h-3.5 text-brand-400" />
                <span>Shuffle Daily</span>
              </button>

              <button
                type="button"
                id="wholesome-toggle-suggestion-btn"
                onClick={() => setShowSuggestion((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                  showSuggestion
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-surface-200/80 border-surface-border text-zinc-300 hover:text-white hover:bg-surface-300'
                }`}
                title="Toggle Chef's Smart Recommendation"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showSuggestion ? 'Hide Idea' : 'Chef Idea'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              id="wholesome-back-to-meals-btn"
              onClick={handleCloseCustomizer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200/90 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-brand-400" />
              <span>← Back to Daily Plates</span>
            </button>
          )}

          {onBrowseRecipes && (
            <button
              type="button"
              id="wholesome-browse-recipes-btn"
              onClick={onBrowseRecipes}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>Recipe Studio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Global Feedback Banner */}
      {recentlyLoggedName && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              Logged <strong>{recentlyLoggedName}</strong> to today's diary! Calories & macros updated.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('nutrition')}
            className="text-xs font-bold text-emerald-300 hover:text-white underline shrink-0 cursor-pointer"
          >
            View in Diary →
          </button>
        </div>
      )}

      {/* Action Feedback Banner (Inside Customizer) */}
      {actionFeedback && (
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs animate-fadeIn ${
            actionFeedback.type === 'log'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
              : actionFeedback.type === 'grocery'
              ? 'bg-brand-500/15 border-brand-500/30 text-brand-200'
              : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{actionFeedback.message}</span>
          </div>
          {actionFeedback.type === 'grocery' && (
            <button
              type="button"
              onClick={() => setActiveTab('grocery')}
              className="text-xs font-bold text-brand-300 hover:text-white underline shrink-0 cursor-pointer"
            >
              Open Grocery List →
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 100% INLINE RECIPE & INGREDIENT CUSTOMIZER (When a meal is selected) */}
      {/* Zero Modals: Renders completely inline directly in the document stream */}
      {/* ========================================================================= */}
      {activeCustomizingMeal && currentCustomMacros ? (
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-200/90 border border-brand-500/30 space-y-6 animate-fadeIn">
          {/* Recipe Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-surface-border/80 pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-mono font-bold tracking-wide uppercase">
                  {activeCustomizingMeal.categoryLabel}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-300 text-zinc-300 font-mono">
                  {activeCustomizingMeal.recipe.difficulty || 'Easy'}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-300 text-zinc-300 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  Prep: {activeCustomizingMeal.recipe.prep_time_minutes}m • Cook: {activeCustomizingMeal.recipe.cook_time_minutes}m
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                {activeCustomizingMeal.name}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {activeCustomizingMeal.desc}
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
              <button
                type="button"
                id="customizer-reset-btn"
                onClick={handleResetCustomizations}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300/80 hover:bg-surface-300 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Reset all portion and ingredient modifications"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reset</span>
              </button>

              {onOpenRecipe && (
                <button
                  type="button"
                  id="customizer-open-studio-btn"
                  onClick={() => onOpenRecipe(activeCustomizingMeal.recipe)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300/80 hover:bg-surface-300 text-xs font-semibold text-brand-300 hover:text-white transition-all cursor-pointer active:scale-95"
                  title="Open full card in Recipe Studio (print, cards, and tags)"
                >
                  <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                  <span>Recipe Studio</span>
                </button>
              )}
            </div>
          </div>

          {/* Portion Scaler Selector */}
          <div className="p-4 rounded-2xl bg-surface-100/90 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-zinc-200">Scale Portion Yield</div>
              <div className="text-[11px] text-zinc-400">
                Adjust serving size for your personal caloric or training target
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[0.5, 1.0, 1.5, 2.0].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setPortionMultiplier(scale)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 ${
                    portionMultiplier === scale
                      ? 'bg-brand-500 text-zinc-950 shadow-md font-black'
                      : 'bg-surface-200 hover:bg-surface-300 text-zinc-300'
                  }`}
                >
                  {scale === 0.5 ? '0.5x' : scale === 1.0 ? '1.0x (Base)' : `${scale}x`}
                </button>
              ))}

              <div className="flex items-center ml-1 bg-surface-200 rounded-xl border border-surface-border p-0.5">
                <button
                  type="button"
                  onClick={() => setPortionMultiplier((prev) => Math.max(0.25, Math.round((prev - 0.25) * 100) / 100))}
                  className="p-1.5 rounded-lg hover:bg-surface-300 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Decrease portion"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 text-xs font-mono font-bold text-zinc-200">
                  {portionMultiplier}x
                </span>
                <button
                  type="button"
                  onClick={() => setPortionMultiplier((prev) => Math.min(4.0, Math.round((prev + 0.25) * 100) / 100))}
                  className="p-1.5 rounded-lg hover:bg-surface-300 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Increase portion"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Macro Recalculation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-surface-100/90 border border-brand-500/20 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Calories
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-brand-400 mt-0.5">
                {currentCustomMacros.cals}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                {currentCustomMacros.cals !== activeCustomizingMeal.cals ? (
                  <span
                    className={
                      currentCustomMacros.cals > activeCustomizingMeal.cals
                        ? 'text-amber-400 font-bold'
                        : 'text-emerald-400 font-bold'
                    }
                  >
                    {currentCustomMacros.cals > activeCustomizingMeal.cals ? '+' : ''}
                    {currentCustomMacros.cals - activeCustomizingMeal.cals} kcal
                  </span>
                ) : (
                  'Base target'
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-100/90 border border-surface-border text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Protein
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {currentCustomMacros.protein_g}g
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                {currentCustomMacros.protein_g !== activeCustomizingMeal.protein_g ? (
                  <span className="text-emerald-400 font-bold">
                    {currentCustomMacros.protein_g > activeCustomizingMeal.protein_g ? '+' : ''}
                    {(currentCustomMacros.protein_g - activeCustomizingMeal.protein_g).toFixed(1)}g
                  </span>
                ) : (
                  'Lean muscle'
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-100/90 border border-surface-border text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Carbs
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-0.5">
                {currentCustomMacros.carbs_g}g
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                {currentCustomMacros.carbs_g !== activeCustomizingMeal.carbs_g ? (
                  <span className="text-amber-400 font-bold">
                    {currentCustomMacros.carbs_g > activeCustomizingMeal.carbs_g ? '+' : ''}
                    {(currentCustomMacros.carbs_g - activeCustomizingMeal.carbs_g).toFixed(1)}g
                  </span>
                ) : (
                  'Energy fuel'
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-100/90 border border-surface-border text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Healthy Fat
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-purple-400 mt-0.5">
                {currentCustomMacros.fat_g}g
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                {currentCustomMacros.fat_g !== activeCustomizingMeal.fat_g ? (
                  <span className="text-purple-400 font-bold">
                    {currentCustomMacros.fat_g > activeCustomizingMeal.fat_g ? '+' : ''}
                    {(currentCustomMacros.fat_g - activeCustomizingMeal.fat_g).toFixed(1)}g
                  </span>
                ) : (
                  'Cellular health'
                )}
              </div>
            </div>
          </div>

          {/* Interactive Ingredients List & Customizer Controls */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-400" />
                  <span>Recipe Ingredients & Culinary Customizations</span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Use [+] and [-] to tailor amounts, or tap 🔁 Swap for chef-tested culinary alternatives
                </p>
              </div>

              <div className="text-[11px] font-mono text-zinc-400">
                {activeCustomizingMeal.recipe.ingredients.length} base ingredients
              </div>
            </div>

            <div className="space-y-2.5">
              {activeCustomizingMeal.recipe.ingredients.map((ing, idx) => {
                const swap = activeSwaps[idx];
                const activeItem = swap || ing;
                const multiplier = ingredientMultipliers[idx] ?? 1.0;
                const effectiveMult = portionMultiplier * multiplier;
                const isOmitted = multiplier <= 0;
                const isSwapped = !!swap;
                const isSwapOpen = openSwapIndex === idx;

                const availableSwaps = getSmartSwapsForIngredient(ing);
                const hasSwaps = availableSwaps.length > 0;

                const baseCals = swap
                  ? swap.calories
                  : (ing.calories_base ?? Math.round(activeCustomizingMeal.cals / activeCustomizingMeal.recipe.ingredients.length));
                const itemCals = Math.round(baseCals * effectiveMult);

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOmitted
                        ? 'bg-surface-100/40 border-surface-border/50 opacity-60'
                        : isSwapped
                        ? 'bg-brand-500/10 border-brand-500/40'
                        : 'bg-surface-100/90 border-surface-border'
                    }`}
                  >
                    {/* Ingredient Primary Row */}
                    <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-surface-300 text-zinc-400 font-bold">
                            {ing.department || 'produce'}
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              isOmitted
                                ? 'line-through text-zinc-500'
                                : isSwapped
                                ? 'text-brand-300'
                                : 'text-zinc-100'
                            }`}
                          >
                            {activeItem.name}
                          </span>
                          {isSwapped && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center gap-1">
                              <span>Swapped</span>
                              <button
                                type="button"
                                onClick={() => handleUndoSwap(idx)}
                                className="underline hover:text-white cursor-pointer ml-0.5"
                                title="Undo swap and restore original ingredient"
                              >
                                (Undo)
                              </button>
                            </span>
                          )}
                          {isOmitted && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                              Omitted
                            </span>
                          )}
                        </div>

                        {/* Measurements & Calories */}
                        {!isOmitted ? (
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                            <span>{formatScaledMeasure(ing, swap, effectiveMult)}</span>
                            <span>•</span>
                            <span className="text-brand-400 font-bold">+{itemCals} kcal</span>
                            {ing.notes && (
                              <>
                                <span>•</span>
                                <span className="text-zinc-500 italic">{ing.notes}</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="text-[11px] text-zinc-500">
                            Ingredient omitted from this meal log and grocery list
                          </div>
                        )}
                      </div>

                      {/* Right Steppers & Swap Button */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {/* Stepper Controls */}
                        <div className="flex items-center bg-surface-200 rounded-xl border border-surface-border p-0.5">
                          <button
                            type="button"
                            id={`ing-minus-${idx}`}
                            onClick={() => handleStepIngredientMultiplier(idx, -0.25)}
                            className="p-1.5 rounded-lg hover:bg-surface-300 text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
                            title="Decrease amount"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-12 text-center text-xs font-mono font-bold text-zinc-200">
                            {multiplier === 0 ? '0x' : `${multiplier.toFixed(multiplier % 1 === 0 ? 0 : 2)}x`}
                          </span>

                          <button
                            type="button"
                            id={`ing-plus-${idx}`}
                            onClick={() => handleStepIngredientMultiplier(idx, 0.25)}
                            className="p-1.5 rounded-lg hover:bg-surface-300 text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
                            title="Increase amount"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Swap Drawer Toggle */}
                        {hasSwaps && !isOmitted && (
                          <button
                            type="button"
                            id={`ing-swap-btn-${idx}`}
                            onClick={() => setOpenSwapIndex(isSwapOpen ? null : idx)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                              isSwapOpen
                                ? 'bg-brand-500 text-zinc-950 font-bold'
                                : 'bg-surface-200 hover:bg-surface-300 text-zinc-300 hover:text-white'
                            }`}
                            title="View healthy culinary substitutes for this ingredient"
                          >
                            <span>🔁 Swap</span>
                            {isSwapOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Smart Swaps Drawer */}
                    {isSwapOpen && (
                      <div className="p-3.5 sm:p-4 bg-surface-200/90 border-t border-surface-border/80 space-y-2.5 animate-fadeIn">
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                          <span>Culinary Alternatives for {ing.name}:</span>
                          <span className="text-[11px] font-mono text-brand-400">
                            {availableSwaps.length} available
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {availableSwaps.map((opt, sIdx) => {
                            const isCurrentSwap = swap?.name === opt.name;
                            const calDiff = opt.calories - (ing.calories_base || 0);
                            const protDiff = opt.protein_g - (ing.protein_g_base || 0);

                            return (
                              <div
                                key={sIdx}
                                className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                                  isCurrentSwap
                                    ? 'bg-brand-500/15 border-brand-500 text-brand-100'
                                    : 'bg-surface-100/90 border-surface-border hover:border-brand-500/40 text-zinc-300'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold text-white">
                                      {opt.name}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-300 font-mono text-zinc-300">
                                      {opt.tag}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-400 leading-tight">
                                    {opt.reason}
                                  </p>
                                  <div className="text-[10px] font-mono text-zinc-400">
                                    {isImperial ? opt.amount_imperial : opt.amount_metric} •{' '}
                                    <span className={calDiff > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                                      {calDiff > 0 ? `+${calDiff}` : calDiff} kcal
                                    </span>{' '}
                                    •{' '}
                                    <span className={protDiff > 0 ? 'text-emerald-400 font-bold' : ''}>
                                      {protDiff > 0 ? `+${protDiff}g` : `${protDiff}g`} P
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleApplySwap(idx, opt)}
                                  className={`w-full py-1 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                                    isCurrentSwap
                                      ? 'bg-brand-500 text-zinc-950'
                                      : 'bg-surface-200 hover:bg-brand-500 hover:text-zinc-950 text-zinc-200'
                                  }`}
                                >
                                  {isCurrentSwap ? '✓ Active Swap' : 'Choose This Swap'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking Instructions & Chef's Notes */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-100/90 border border-surface-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
              <ChefHat className="w-4 h-4 text-brand-400" />
              <span>Chef's Step-by-Step Instructions</span>
            </div>

            <ol className="space-y-2 text-xs sm:text-sm text-zinc-200 list-decimal list-inside leading-relaxed">
              {activeCustomizingMeal.recipe.instructions.map((step, sIdx) => (
                <li key={sIdx} className="pl-1">
                  <span className="text-zinc-300">{step}</span>
                </li>
              ))}
            </ol>

            {activeCustomizingMeal.recipe.chef_notes && (
              <div className="pt-2 border-t border-surface-border/60 text-xs text-amber-300/90 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Chef's Pro Tip:</strong> {activeCustomizingMeal.recipe.chef_notes}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Action Command Bar (100% Inline) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-surface-100/90 via-surface-200/90 to-surface-100/90 border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Grocery Store Selector & Sync */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400 font-semibold">Destination Store:</span>
              <select
                value={selectedTargetStore}
                onChange={(e) => setSelectedTargetStore(e.target.value as GroceryStoreTag)}
                className="px-2.5 py-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-zinc-200 font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                {STORE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                id="customizer-sync-grocery-btn"
                onClick={handleSyncGrocery}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-300 hover:bg-surface-400 text-xs font-bold text-zinc-200 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Add Ingredients to List</span>
              </button>
            </div>

            {/* Prominent Customized Log Action */}
            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                type="button"
                id="customizer-log-meal-btn"
                onClick={handleLogCustomizedMeal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log Customized Plate ({currentCustomMacros.cals} kcal)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STANDARD 4-MEAL ROTATION & SMART SUGGESTION VIEW */
        /* ========================================================================= */
        <>
          {/* Chef's Smart Suggestion Spotlight (Inline) */}
          {showSuggestion && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-surface-200/60 to-surface-200/90 border border-amber-500/30 relative overflow-hidden space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <ChefHat className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>CHEF'S SUGGESTION • {smartSuggestion.periodLabel}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 hidden md:inline">
                    {smartSuggestion.timingHint}
                  </span>
                  <button
                    type="button"
                    id="wholesome-cycle-suggestion-btn"
                    onClick={handleCycleSuggestion}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-300/80 hover:bg-surface-300 text-[11px] font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer active:scale-95"
                    title="Get another tailored suggestion"
                  >
                    <Shuffle className="w-3 h-3 text-amber-400" />
                    <span>Next Idea</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-white">
                      {smartSuggestion.meal.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-300 text-zinc-300 font-mono font-semibold">
                      {smartSuggestion.meal.categoryLabel}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {smartSuggestion.meal.desc}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-200/90">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{smartSuggestion.reason}</span>
                  </div>
                </div>

                {/* Macros & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-surface-border/40 flex-wrap sm:flex-nowrap">
                  <div className="text-right">
                    <div className="text-sm font-black font-mono text-brand-400">
                      +{smartSuggestion.meal.cals} kcal
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      {smartSuggestion.meal.protein_g}g P • {smartSuggestion.meal.carbs_g}g C • {smartSuggestion.meal.fat_g}g F
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="wholesome-suggestion-modify-btn"
                      onClick={() => handleOpenCustomizer(smartSuggestion.meal)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-surface-300/80 hover:bg-surface-300 text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer"
                      title="View full recipe, scale portions, or modify ingredients"
                    >
                      <span>✏️ View & Modify</span>
                    </button>

                    <button
                      type="button"
                      id="wholesome-suggestion-log-btn"
                      onClick={() => handleLogWholesomeMeal(smartSuggestion.meal)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
                        recentlyLoggedId === smartSuggestion.meal.id
                          ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/30'
                          : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/30'
                      }`}
                    >
                      {recentlyLoggedId === smartSuggestion.meal.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✓ Logged!</span>
                        </>
                      ) : (
                        <>
                          <span>+ 1-Tap Log</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4 Daily Wholesome Meals Grid (Breakfast, Lunch, Dinner, Snack) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">Today's Daily Balanced Rotation</span>
              <span>4 balanced plates for today • Tap to customize or log</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dailyMeals.map((meal) => {
                const isJustLogged = recentlyLoggedId === meal.id;
                return (
                  <div
                    key={meal.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isJustLogged
                        ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30'
                        : 'bg-surface-200/80 border-surface-border hover:border-brand-500/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-brand-400">
                          {meal.categoryLabel}
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-400">
                          +{meal.cals} kcal
                        </span>
                      </div>
                      <div
                        onClick={() => handleOpenCustomizer(meal)}
                        className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-1 hover:text-brand-300 cursor-pointer transition-colors"
                        title="Click to view and customize recipe"
                      >
                        {meal.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 line-clamp-2">
                        {meal.desc}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                      <div className="text-[10px] font-mono text-zinc-400">
                        {meal.protein_g}g P • {meal.carbs_g}g C • {meal.fat_g}g F
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          id={`wholesome-modify-${meal.id}`}
                          onClick={() => handleOpenCustomizer(meal)}
                          className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-surface-300/80 hover:bg-surface-300 text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
                          title="View and modify ingredients or amounts"
                        >
                          ✏️ Modify
                        </button>

                        <button
                          type="button"
                          id={`wholesome-log-${meal.id}`}
                          onClick={() => handleLogWholesomeMeal(meal)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                            isJustLogged
                              ? 'bg-emerald-500 text-zinc-950 font-bold'
                              : 'bg-brand-500/15 hover:bg-brand-500 text-brand-300 hover:text-zinc-950'
                          }`}
                        >
                          {isJustLogged ? '✓ Logged' : '+ 1-Tap Log'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
