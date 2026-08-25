'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import { RecipeItem, RecipeCategory, FoodItem } from '@/lib/types';
import { COMPREHENSIVE_RECIPE_DATABASE } from '@/lib/recipe-database';
import { CustomRecipeModal } from './CustomRecipeModal';
import {
  UtensilsCrossed,
  Clock,
  Flame,
  Plus,
  CheckCircle2,
  Search,
  ShoppingCart,
  ChefHat,
  Layers,
  BookOpen,
  X,
  Printer,
  ChevronRight,
  ArrowLeft,
  Check,
  Sparkles,
} from 'lucide-react';

interface RecipeEngineProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const RecipeEngine: React.FC<RecipeEngineProps> = ({
  isOpen = true,
  onClose,
  isModal = true,
}) => {
  const {
    profile,
    experienceMode,
    logFood,
    addGroceryItem,
  } = useHealth();

  const isSimple = experienceMode === 'simple';
  const isImperial = profile.unit_preference === 'imperial';

  // If used as modal and closed, return null
  if (isModal && !isOpen) return null;

  // State
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected recipe for 100% Inline Detail View
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<RecipeItem | null>(null);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customRecipes, setCustomRecipes] = useState<RecipeItem[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  // Athlete Mode: Batch Scaler Multiplier (1x, 2x, 4x, 6x)
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);

  // Success Feedback Toasts / State
  const [actionSuccessMsg, setActionSuccessMsg] = useState<{ id: string; text: string } | null>(null);

  // All combined recipes
  const allRecipes = useMemo(() => {
    return [...customRecipes, ...COMPREHENSIVE_RECIPE_DATABASE];
  }, [customRecipes]);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      const matchesCat =
        selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesQuery;
    });
  }, [allRecipes, selectedCategory, searchQuery]);

  // Trigger feedback banner
  const triggerSuccessFeedback = (recipeId: string, text: string) => {
    setActionSuccessMsg({ id: recipeId, text });
    setTimeout(() => {
      setActionSuccessMsg((prev) => (prev?.id === recipeId ? null : prev));
    }, 3500);
  };

  // 1-Tap Log Meal
  const handleLogRecipe = (recipe: RecipeItem, mealIndex: number = 1) => {
    const recipeFoodItem: FoodItem = {
      id: `recipe-food-${recipe.id}`,
      name: recipe.title,
      category: 'protein',
      calories_per_100g: recipe.calories_per_serving,
      protein_per_100g: recipe.protein_g_per_serving,
      carbs_per_100g: recipe.carbs_g_per_serving,
      fat_per_100g: recipe.fat_g_per_serving,
      is_gluten_free: recipe.tags.includes('Gluten-Free'),
      is_dairy_free: recipe.tags.includes('Dairy-Free'),
      serving_size_g: 100,
      default_unit: 'serving',
      storage_type: 'fresh_weekly',
    };

    logFood({
      user_id: profile.id,
      food: recipeFoodItem,
      food_name: recipe.title,
      grams_consumed: 100,
      meal_index: mealIndex,
      logged_at: new Date().toISOString().split('T')[0],
    });

    triggerSuccessFeedback(
      recipe.id,
      isSimple
        ? `Logged "${recipe.title}" (+${recipe.calories_per_serving} kcal) to today's meals! 🍽️`
        : `Logged 1 serving of "${recipe.title}" to Meal ${mealIndex} (${recipe.protein_g_per_serving}g P / ${recipe.carbs_g_per_serving}g C / ${recipe.fat_g_per_serving}g F) ⚡`
    );
  };

  // 1-Tap Sync Ingredients to Grocery List
  const handleSyncGrocery = (recipe: RecipeItem, multiplier: number = 1) => {
    let countAdded = 0;
    recipe.ingredients.forEach((ing) => {
      const baseMeasure = isImperial ? ing.amount_imperial : ing.amount_metric;
      const scaledMeasure =
        multiplier > 1 ? `${multiplier}x (${baseMeasure})` : baseMeasure;

      addGroceryItem({
        item_name: ing.name,
        category: 'fresh_weekly',
        quantity: multiplier,
        unit: baseMeasure,
        department: ing.department || 'produce',
        is_checked: false,
        in_pantry: false,
        notes: `For ${recipe.title} (${scaledMeasure})`,
      });
      countAdded++;
    });

    triggerSuccessFeedback(
      recipe.id,
      `Added ${countAdded} ingredients from "${recipe.title}" ${multiplier > 1 ? `(${multiplier}x batch)` : ''} to your Shopping List! 🛒`
    );
  };

  const categories = [
    { id: 'all', label: 'All Recipes', emoji: '🍽️' },
    { id: 'dinner', label: isSimple ? '15-Min Dinners' : 'Dinner Protocols', emoji: '🐟' },
    { id: 'lunch', label: isSimple ? 'Fresh Lunches' : 'Midday Fuel', emoji: '🥗' },
    { id: 'breakfast', label: isSimple ? 'Quick Breakfasts' : 'Morning Primers', emoji: '🥣' },
    { id: 'bulk_meal_prep', label: isSimple ? 'Batch Meal Prep' : 'Bulk Batch Prep', emoji: '🍲' },
    { id: 'snack_dessert', label: isSimple ? 'Light Treats' : 'Anabolic Snacks', emoji: '🍓' },
  ] as const;

  // View: 100% INLINE Recipe Detail View
  const renderInlineRecipeDetail = (detailRecipe: RecipeItem) => {
    const detailCalories = detailRecipe.calories_per_serving * batchMultiplier;

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Navigation Back Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-surface-border">
          <button
            type="button"
            onClick={() => setSelectedRecipeDetail(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-300 hover:text-foreground cursor-pointer transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Recipes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-foreground cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4 text-brand-400" />
              <span>Print Recipe</span>
            </button>

            <button
              type="button"
              onClick={() => handleSyncGrocery(detailRecipe, batchMultiplier)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-foreground cursor-pointer shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 text-accent-cyan" />
              <span>+ Shopping List</span>
            </button>
          </div>
        </div>

        {/* Recipe Hero Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-surface-200/80 border border-surface-border space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xl">{detailRecipe.icon_emoji || '🍽️'}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/15 text-brand-300 border border-brand-500/30">
              {detailRecipe.category.replace('_', ' ')}
            </span>
            {detailRecipe.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-xs bg-surface-300 text-zinc-400 border border-surface-border font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {detailRecipe.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {detailRecipe.description}
          </p>

          {/* Metrics Row */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-zinc-400 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300 border border-surface-border">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Prep: {detailRecipe.prep_time_minutes}m • Cook: {detailRecipe.cook_time_minutes}m</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300 border border-surface-border text-brand-400 font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{detailRecipe.calories_per_serving} kcal / serving</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300 border border-surface-border">
              <ChefHat className="w-3.5 h-3.5 text-brand-300" />
              <span className="capitalize">{detailRecipe.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Batch Meal Prep Scaler & Macros */}
        <div className="p-4 sm:p-6 rounded-2xl bg-surface-200/70 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              <span>Batch Meal Prep Scaler</span>
            </span>
            <div className="text-xs text-zinc-400">
              Yield: <strong className="text-foreground">{detailRecipe.servings_yield * batchMultiplier} portion{detailRecipe.servings_yield * batchMultiplier > 1 ? 's' : ''}</strong> ({detailCalories} total kcal)
            </div>
          </div>

          <div className="flex items-center gap-1 bg-surface-300 p-1 rounded-xl border border-surface-border self-start sm:self-auto">
            {[
              { mult: 1, label: '1x' },
              { mult: 2, label: '2x' },
              { mult: 4, label: '4x' },
              { mult: 6, label: '6x' },
            ].map((b) => (
              <button
                key={b.mult}
                type="button"
                onClick={() => setBatchMultiplier(b.mult)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  batchMultiplier === b.mult
                    ? 'bg-brand-500 text-zinc-950 shadow-glow'
                    : 'text-zinc-400 hover:text-foreground'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Macronutrient Profile */}
        <div className="p-4 sm:p-6 rounded-2xl bg-surface-200/50 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Macronutrient Breakdown (Per Serving):</span>
            <span className="font-bold text-brand-400">{detailRecipe.calories_per_serving} kcal</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
              <span className="text-brand-400 font-black text-sm">{detailRecipe.protein_g_per_serving}g</span>
              <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Protein</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
              <span className="text-cyan-400 font-black text-sm">{detailRecipe.carbs_g_per_serving}g</span>
              <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Carbohydrates</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
              <span className="text-amber-400 font-black text-sm">{detailRecipe.fat_g_per_serving}g</span>
              <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Healthy Fats</span>
            </div>
          </div>
        </div>

        {/* Ingredients Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-brand-400" />
              <span>Ingredients ({isImperial ? 'Standard Culinary Measures' : 'Metric Measures'})</span>
            </h3>
            {batchMultiplier > 1 && (
              <span className="text-[11px] font-mono text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                {batchMultiplier}x Batch Scaled
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {detailRecipe.ingredients.map((ing, idx) => {
              const rawMeasure = isImperial ? ing.amount_imperial : ing.amount_metric;
              let displayMeasure = rawMeasure;

              if (batchMultiplier > 1 && ing.raw_weight_grams_base) {
                const totalGrams = ing.raw_weight_grams_base * batchMultiplier;
                const totalOz = (totalGrams * 0.03527).toFixed(1);
                displayMeasure = isImperial
                  ? `${totalOz} oz (${totalGrams}g)`
                  : `${totalGrams}g`;
              } else if (batchMultiplier > 1) {
                displayMeasure = `${batchMultiplier}x (${rawMeasure})`;
              }

              const isChecked = checkedIngredients[idx];

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCheckedIngredients((prev) => ({
                      ...prev,
                      [idx]: !prev[idx],
                    }));
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-brand-500/10 border-brand-500/30 text-zinc-400 line-through'
                      : 'bg-surface-200/70 border-surface-border text-foreground hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-brand-500 border-brand-500 text-zinc-950'
                          : 'border-zinc-600 bg-surface-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="font-medium truncate">{ing.name}</span>
                  </div>

                  <span className="font-mono text-xs font-bold text-brand-400 shrink-0">
                    {displayMeasure}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cooking Directions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-cyan" />
            <span>Step-by-Step Cooking Directions</span>
          </h3>

          <ol className="space-y-2.5 text-xs">
            {detailRecipe.instructions.map((step, sIdx) => (
              <li
                key={sIdx}
                className="p-3.5 rounded-2xl bg-surface-200/60 border border-surface-border/70 flex gap-3"
              >
                <span className="w-6 h-6 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {sIdx + 1}
                </span>
                <span className="flex-1 text-foreground leading-relaxed text-xs sm:text-[13px]">{step}</span>
              </li>
            ))}
          </ol>

          {detailRecipe.chef_notes && (
            <div className="p-4 rounded-2xl bg-surface-200/90 border border-brand-500/30 text-xs text-foreground space-y-1">
              <strong className="text-brand-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chef's Technique & Advice:</span>
              </strong>
              <p className="leading-relaxed text-zinc-300 pl-5">{detailRecipe.chef_notes}</p>
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 sm:p-5 rounded-2xl border border-surface-border bg-surface-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedRecipeDetail(null)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-surface-300 hover:bg-surface-100 border border-surface-border text-xs font-bold text-zinc-300 hover:text-foreground flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Recipes</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-surface-300 hover:bg-surface-100 border border-surface-border text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-brand-400" />
              <span>Print</span>
            </button>

            {isSimple ? (
              <button
                type="button"
                onClick={() => handleLogRecipe(detailRecipe, 1)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
                <span>Cooked This!</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-surface-300 p-1 rounded-2xl border border-surface-border">
                {[1, 2, 3].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleLogRecipe(detailRecipe, slot)}
                    className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-brand-500 hover:text-zinc-950 text-brand-300 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
                    title={`Log 1 serving to Meal ${slot}`}
                  >
                    + M{slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dedicated Printable Area for window.print() */}
        <div className="hidden print:block printable-area print-letter">
          <div className="p-4 bg-white text-black font-sans">
            <div className="border-b-2 border-black pb-2 mb-2 flex items-start justify-between">
              <div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-zinc-700">
                  SEELYE FAMILY HEALTH • WHOLESOME RECIPES
                </div>
                <h1 className="text-lg font-black text-black leading-tight">
                  {detailRecipe.title}
                </h1>
                <p className="text-[10px] text-zinc-700 italic">
                  {detailRecipe.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black text-black">
                  {detailRecipe.calories_per_serving * batchMultiplier} kcal
                </div>
                <div className="text-[9px] text-zinc-700 font-mono">
                  {detailRecipe.prep_time_minutes + detailRecipe.cook_time_minutes} min • {detailRecipe.servings_yield * batchMultiplier} serving{detailRecipe.servings_yield * batchMultiplier > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 text-[10.5px]">
              <div className="col-span-2">
                <div className="font-bold uppercase text-[10px] border-b border-black pb-0.5 mb-1.5">
                  Ingredients {batchMultiplier > 1 ? `(${batchMultiplier}x)` : ''}
                </div>
                <ul className="space-y-1">
                  {detailRecipe.ingredients.map((ing, idx) => {
                    const rawMeasure = isImperial ? ing.amount_imperial : ing.amount_metric;
                    let displayMeasure = rawMeasure;

                    if (batchMultiplier > 1 && ing.raw_weight_grams_base) {
                      const totalGrams = ing.raw_weight_grams_base * batchMultiplier;
                      const totalOz = (totalGrams * 0.03527).toFixed(1);
                      displayMeasure = isImperial
                        ? `${totalOz} oz (${totalGrams}g)`
                        : `${totalGrams}g`;
                    } else if (batchMultiplier > 1) {
                      displayMeasure = `${batchMultiplier}x (${rawMeasure})`;
                    }

                    return (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="inline-block w-2.5 h-2.5 border border-black rounded-none mt-0.5 shrink-0"></span>
                        <span>
                          <strong>{displayMeasure}</strong> {ing.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-2 p-1.5 border border-black text-[9.5px] font-mono">
                  <strong>Macros:</strong> {detailRecipe.protein_g_per_serving}g Protein • {detailRecipe.carbs_g_per_serving}g Carbs • {detailRecipe.fat_g_per_serving}g Fat
                </div>
              </div>

              <div className="col-span-3">
                <div className="font-bold uppercase text-[10px] border-b border-black pb-0.5 mb-1.5">
                  Preparation & Directions
                </div>
                <ol className="space-y-1.5 text-[10.5px] leading-snug">
                  {detailRecipe.instructions.map((step, sIdx) => (
                    <li key={sIdx} className="flex gap-1.5">
                      <span className="font-bold font-mono shrink-0">{sIdx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                {detailRecipe.chef_notes && (
                  <div className="mt-2 pt-1 border-t border-zinc-400 text-[9.5px] italic">
                    <strong>Tip:</strong> {detailRecipe.chef_notes}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-1 border-t border-zinc-400 text-[8px] font-mono text-zinc-600 flex justify-between">
              <span>health.seelye.info</span>
              <span>Recipe Print Sheet</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // View: Recipe Collection List & Filter Grid
  const renderRecipeCollection = () => (
    <div className="space-y-6">
      {/* Header Shelf Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-200/80 border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {isSimple ? 'WHOLESOME KITCHEN RECIPES' : 'MACRO-ENGINEERED FUEL & PREP STUDIO'}
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-brand-400 font-mono text-xs font-bold uppercase">
              {isImperial ? 'Traditional US Units (Cups/Tbsp/Oz)' : 'Metric Units (Grams/Ml)'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-brand-400" />
            <span>{isSimple ? 'Wholesome Home Recipes' : 'Macro-Engineered Recipe Matrix'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            {isSimple
              ? 'Delicious, balanced meals crafted with real ingredients. Use standard kitchen measurements (cups, tablespoons, ounces) and log with 1 click.'
              : 'Precision macro recipes with batch meal prep scaling (1x, 2x, 4x, 6x), per-serving MPS breakdowns, and custom recipe builder.'}
          </p>
        </div>

        {/* Athlete Mode: Action Buttons */}
        {!isSimple && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Custom Recipe</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Controls: Category Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                    : 'bg-surface-200 text-zinc-400 hover:text-zinc-200 hover:bg-surface-300'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients, title..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-200/80 border border-surface-border text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-brand-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Action Toast Feedback Banner */}
      {actionSuccessMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg.text}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-400 hover:text-emerald-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-3xl bg-surface-200/30 border border-surface-border">
            <UtensilsCrossed className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-zinc-300">No recipes matched your search</div>
            <p className="text-xs text-zinc-500 mt-1">Try clearing filters or search query.</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="rounded-3xl bg-surface-100/90 border border-surface-border p-5 flex flex-col justify-between hover:border-brand-500/40 transition-all group"
            >
              <div>
                {/* Card Top Row: Emoji, Category, Times */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-2 rounded-2xl bg-surface-200 border border-surface-border">
                      {recipe.icon_emoji || '🍽️'}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                        {recipe.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono mt-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{recipe.prep_time_minutes + recipe.cook_time_minutes} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-brand-400">
                      {recipe.calories_per_serving} kcal
                    </div>
                    <span className="text-[10px] text-zinc-400">per serving</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3
                  onClick={() => setSelectedRecipeDetail(recipe)}
                  className="text-base font-bold text-white group-hover:text-brand-300 transition-colors leading-snug line-clamp-1 cursor-pointer"
                  title="Click to view recipe details"
                >
                  {recipe.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Macro Badges for Athlete Mode */}
                {!isSimple && (
                  <div className="mt-3 p-2 rounded-xl bg-surface-200/60 border border-surface-border/60">
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                      <div className="p-1 rounded-lg bg-surface-300">
                        <span className="text-brand-400 font-bold">{recipe.protein_g_per_serving}g</span>
                        <span className="text-zinc-400 block text-[9px]">Protein</span>
                      </div>
                      <div className="p-1 rounded-lg bg-surface-300">
                        <span className="text-cyan-400 font-bold">{recipe.carbs_g_per_serving}g</span>
                        <span className="text-zinc-400 block text-[9px]">Carbs</span>
                      </div>
                      <div className="p-1 rounded-lg bg-surface-300">
                        <span className="text-amber-400 font-bold">{recipe.fat_g_per_serving}g</span>
                        <span className="text-zinc-400 block text-[9px]">Fats</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Traditional Ingredients Preview */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                    <span>Key Ingredients:</span>
                    <span className="text-[10px] text-brand-400 font-normal">
                      {recipe.ingredients.length} items
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    {recipe.ingredients.slice(0, 3).map((ing, idx) => {
                      const rawMeasure = isImperial ? ing.amount_imperial : ing.amount_metric;
                      return (
                        <div
                          key={idx}
                          className="p-1.5 px-2.5 rounded-xl bg-surface-200/50 border border-surface-border/60 flex items-center justify-between"
                        >
                          <span className="text-zinc-300 truncate">{ing.name}</span>
                          <span className="font-mono font-bold text-brand-300 text-[11px] shrink-0">
                            {rawMeasure}
                          </span>
                        </div>
                      );
                    })}
                    {recipe.ingredients.length > 3 && (
                      <div
                        onClick={() => setSelectedRecipeDetail(recipe)}
                        className="text-[11px] text-brand-400 hover:underline cursor-pointer pt-0.5 text-center font-medium"
                      >
                        + {recipe.ingredients.length - 3} more ingredients (View Recipe)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Bottom Actions */}
              <div className="pt-3 border-t border-surface-border/80 flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
                {/* View Recipe Button (100% Inline Detail Transition) */}
                <button
                  type="button"
                  onClick={() => setSelectedRecipeDetail(recipe)}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto py-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Recipe</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Print Recipe Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecipeDetail(recipe);
                      setTimeout(() => window.print(), 150);
                    }}
                    className="px-3 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    title="Print Recipe Sheet"
                  >
                    <Printer className="w-3.5 h-3.5 text-brand-400" />
                    <span>Print</span>
                  </button>

                  {/* Add to Shopping List Button */}
                  <button
                    type="button"
                    onClick={() => handleSyncGrocery(recipe, !isSimple ? batchMultiplier : 1)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-200 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    title="Add all ingredients to shopping list"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>+ Grocery List</span>
                  </button>

                  {/* Simple Mode: 1-Tap Cooked This Meal */}
                  {isSimple ? (
                    <button
                      type="button"
                      onClick={() => handleLogRecipe(recipe, 1)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Cooked!</span>
                    </button>
                  ) : (
                    /* Athlete Mode: Log to Meal Slot Selection */
                    <div className="flex items-center gap-1 bg-surface-200 p-1 rounded-xl border border-surface-border">
                      {[1, 2, 3].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleLogRecipe(recipe, slot)}
                          className="px-2.5 py-1 rounded-lg bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-brand-300 text-[11px] font-mono font-bold transition-all active:scale-95 cursor-pointer"
                          title={`Log 1 serving to Meal ${slot}`}
                        >
                          + M{slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Recipe Modal Popup Window (Athlete Mode) */}
      <CustomRecipeModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSaveRecipe={(newR) => {
          setCustomRecipes((prev) => [newR, ...prev]);
          triggerSuccessFeedback(newR.id, `Created custom recipe "${newR.title}"! 🎉`);
        }}
      />
    </div>
  );

  const mainContent = selectedRecipeDetail
    ? renderInlineRecipeDetail(selectedRecipeDetail)
    : renderRecipeCollection();

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none pt-8 sm:pt-14 pb-16"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl rounded-3xl bg-surface-100 border border-surface-border shadow-2xl text-foreground overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dedicated Header Bar with Pinned Close Controls */}
          {onClose && (
            <div className="p-4 sm:p-5 border-b border-surface-border bg-surface-100 flex items-center justify-between gap-4 sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <span className="text-xl">👨‍🍳</span>
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-400">
                  {selectedRecipeDetail
                    ? `Recipe: ${selectedRecipeDetail.title}`
                    : isSimple
                    ? 'Wholesome Kitchen Recipes & Meal Ideas'
                    : 'Macro-Engineered Recipe Matrix'}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-300 hover:text-foreground cursor-pointer shadow-sm active:scale-95 transition-all"
                title="Close Recipe Studio"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          )}

          <div className="p-5 sm:p-8">
            {mainContent}
          </div>
        </div>
      </div>
    );
  }

  return mainContent;
};
