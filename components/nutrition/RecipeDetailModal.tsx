'use client';

import React, { useState } from 'react';
import { RecipeItem } from '@/lib/types';
import { useHealth } from '@/context/HealthContext';
import {
  X,
  Clock,
  Flame,
  ChefHat,
  Printer,
  ShoppingCart,
  UtensilsCrossed,
  Layers,
  Sparkles,
  Check,
  BookOpen,
} from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: RecipeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint: (recipe: RecipeItem) => void;
  onLog: (recipe: RecipeItem, mealIndex?: number) => void;
  onSyncGrocery: (recipe: RecipeItem, multiplier: number) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onPrint,
  onLog,
  onSyncGrocery,
}) => {
  const { profile, experienceMode } = useHealth();
  const isSimple = experienceMode === 'simple';
  const isImperial = profile.unit_preference === 'imperial';

  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  if (!isOpen || !recipe) return null;

  const toggleCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const totalCalories = recipe.calories_per_serving * batchMultiplier;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-surface-100/95 border border-surface-border shadow-2xl backdrop-blur-xl text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header */}
        <div className="p-5 sm:p-6 border-b border-surface-border shrink-0 flex items-start justify-between gap-4 bg-surface-100">
          <div className="space-y-1.5 min-w-0 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl">{recipe.icon_emoji || '🍽️'}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/15 text-brand-300 border border-brand-500/30">
                {recipe.category.replace('_', ' ')}
              </span>
              {recipe.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-xs bg-surface-200 text-zinc-400 border border-surface-border font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
              {recipe.title}
            </h2>
            <p className="text-xs text-zinc-400 line-clamp-2">
              {recipe.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-zinc-400 hover:text-white bg-surface-200/80 hover:bg-surface-200 transition-colors shrink-0 cursor-pointer"
            title="Close recipe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Single Scrolling Body (No nested scrollbars anywhere) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200/80 border border-surface-border">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Prep: {recipe.prep_time_minutes}m • Cook: {recipe.cook_time_minutes}m</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200/80 border border-surface-border text-brand-400 font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{recipe.calories_per_serving} kcal / serving</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200/80 border border-surface-border">
              <ChefHat className="w-3.5 h-3.5 text-brand-300" />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          </div>

          {/* Scaler & Macro Overview */}
          <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span>Batch Meal Prep Scaler</span>
              </span>
              <div className="text-xs text-zinc-400">
                Yield: <strong className="text-zinc-200">{recipe.servings_yield * batchMultiplier} portion{recipe.servings_yield * batchMultiplier > 1 ? 's' : ''}</strong> ({totalCalories} total kcal)
              </div>
            </div>

            {/* Scaler Pills */}
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
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nutritional Blueprint */}
          <div className="p-4 rounded-2xl bg-surface-200/50 border border-surface-border space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Macronutrient Profile (Per Serving):</span>
              <span className="font-bold text-brand-400">{recipe.calories_per_serving} kcal</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
                <span className="text-brand-400 font-black text-sm">{recipe.protein_g_per_serving}g</span>
                <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Protein</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
                <span className="text-cyan-400 font-black text-sm">{recipe.carbs_g_per_serving}g</span>
                <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Carbohydrates</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
                <span className="text-amber-400 font-black text-sm">{recipe.fat_g_per_serving}g</span>
                <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Healthy Fats</span>
              </div>
            </div>
          </div>

          {/* Traditional Ingredients Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
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
              {recipe.ingredients.map((ing, idx) => {
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

                const isChecked = !!checkedIngredients[idx];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-surface-200/40 border-surface-border text-zinc-500 line-through'
                        : 'bg-surface-200/80 border-surface-border hover:border-brand-500/40 text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-brand-500 border-brand-500 text-zinc-950'
                            : 'border-zinc-500'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span className="font-medium truncate">{ing.name}</span>
                    </div>

                    <span className="font-mono font-bold text-brand-300 text-[11px] shrink-0">
                      {displayMeasure}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Cooking Directions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" />
              <span>Step-by-Step Directions</span>
            </h3>

            <ol className="space-y-3 text-xs text-zinc-200 leading-relaxed pl-1">
              {recipe.instructions.map((step, sIdx) => (
                <li
                  key={sIdx}
                  className="p-3 rounded-2xl bg-surface-200/50 border border-surface-border/70 flex gap-3"
                >
                  <span className="w-6 h-6 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {sIdx + 1}
                  </span>
                  <span className="flex-1 text-zinc-200 leading-relaxed text-xs sm:text-[13px]">{step}</span>
                </li>
              ))}
            </ol>

            {recipe.chef_notes && (
              <div className="p-4 rounded-2xl bg-surface-200/90 border border-brand-500/30 text-xs text-zinc-300 space-y-1">
                <strong className="text-brand-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chef's Technique & Advice:</span>
                </strong>
                <p className="leading-relaxed text-zinc-300 pl-5">{recipe.chef_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Action Footer */}
        <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 bg-surface-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Print Button */}
          <button
            type="button"
            onClick={() => onPrint(recipe)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-brand-400" />
            <span>Print Recipe</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Add to Grocery List */}
            <button
              type="button"
              onClick={() => onSyncGrocery(recipe, batchMultiplier)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-accent-cyan" />
              <span>+ Shopping List</span>
            </button>

            {/* Simple Mode Cooked Button vs Athlete Meal Slot Button */}
            {isSimple ? (
              <button
                type="button"
                onClick={() => {
                  onLog(recipe, 1);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
                <span>Cooked This!</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-surface-200 p-1 rounded-2xl border border-surface-border">
                {[1, 2, 3].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      onLog(recipe, slot);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-brand-300 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
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
    </div>
  );
};
