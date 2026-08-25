'use client';

import React, { useState, useMemo } from 'react';
import { RecipeItem, FoodItem } from '@/lib/types';
import { useHealth } from '@/context/HealthContext';
import {
  X,
  ChefHat,
  Plus,
  Trash2,
} from 'lucide-react';

interface CustomRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe: (recipe: RecipeItem) => void;
}

export const CustomRecipeModal: React.FC<CustomRecipeModalProps> = ({
  isOpen,
  onClose,
  onSaveRecipe,
}) => {
  const { foods } = useHealth();

  const [customTitle, setCustomTitle] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<RecipeItem['category']>('dinner');
  const [customServings, setCustomServings] = useState<number>(2);
  const [customPrepMins, setCustomPrepMins] = useState<number>(10);
  const [customCookMins, setCustomCookMins] = useState<number>(15);
  const [customIngredientsList, setCustomIngredientsList] = useState<
    Array<{ food: FoodItem; grams: number; customMeasure: string }>
  >([]);
  const [selectedFoodForCustom, setSelectedFoodForCustom] = useState<FoodItem | null>(null);
  const [customGramsInput, setCustomGramsInput] = useState<number>(150);
  const [customMeasureInput, setCustomMeasureInput] = useState<string>('1 cup');
  const [customInstructionsText, setCustomInstructionsText] = useState<string>('');

  if (!isOpen) return null;

  const handleAddCustomIngredient = () => {
    if (!selectedFoodForCustom) return;
    setCustomIngredientsList((prev) => [
      ...prev,
      {
        food: selectedFoodForCustom,
        grams: customGramsInput,
        customMeasure: customMeasureInput || `${customGramsInput}g`,
      },
    ]);
    setSelectedFoodForCustom(null);
    setCustomMeasureInput('1 cup');
  };

  const customCalculatedMacros = useMemo(() => {
    const totalCals = customIngredientsList.reduce((sum, item) => {
      return sum + (item.food.calories_per_100g * item.grams) / 100;
    }, 0);
    const totalProtein = customIngredientsList.reduce((sum, item) => {
      return sum + (item.food.protein_per_100g * item.grams) / 100;
    }, 0);
    const totalCarbs = customIngredientsList.reduce((sum, item) => {
      return sum + (item.food.carbs_per_100g * item.grams) / 100;
    }, 0);
    const totalFat = customIngredientsList.reduce((sum, item) => {
      return sum + (item.food.fat_per_100g * item.grams) / 100;
    }, 0);

    const s = Math.max(1, customServings);
    return {
      totalCals: Math.round(totalCals),
      calsPerServing: Math.round(totalCals / s),
      proteinPerServing: Number((totalProtein / s).toFixed(1)),
      carbsPerServing: Number((totalCarbs / s).toFixed(1)),
      fatPerServing: Number((totalFat / s).toFixed(1)),
    };
  }, [customIngredientsList, customServings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || customIngredientsList.length === 0) return;

    const newRecipe: RecipeItem = {
      id: `custom-recipe-${Date.now()}`,
      title: customTitle.trim(),
      description: `Custom athletic meal prep recipe crafted with ${customIngredientsList.length} whole food ingredients.`,
      category: customCategory,
      prep_time_minutes: customPrepMins,
      cook_time_minutes: customCookMins,
      servings_yield: customServings,
      difficulty: 'easy',
      tags: ['Custom Recipe', 'Athlete Prep', `${customCalculatedMacros.proteinPerServing}g Protein`],
      calories_per_serving: customCalculatedMacros.calsPerServing,
      protein_g_per_serving: customCalculatedMacros.proteinPerServing,
      carbs_g_per_serving: customCalculatedMacros.carbsPerServing,
      fat_g_per_serving: customCalculatedMacros.fatPerServing,
      icon_emoji: '👨‍🍳',
      is_custom: true,
      ingredients: customIngredientsList.map((item) => ({
        food_id: item.food.id,
        name: item.food.name,
        amount_imperial: item.customMeasure,
        amount_metric: `${item.grams}g`,
        raw_weight_grams_base: item.grams / customServings,
        department: 'produce',
      })),
      instructions: customInstructionsText.trim()
        ? customInstructionsText.split('\n').filter((l) => l.trim().length > 0)
        : ['Combine all prepared ingredients and cook to desired doneness.'],
    };

    onSaveRecipe(newRecipe);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-surface-100/95 border border-surface-border shadow-2xl backdrop-blur-xl text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header */}
        <div className="p-5 sm:p-6 border-b border-surface-border shrink-0 flex items-center justify-between gap-4 bg-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Custom Recipe</h3>
              <p className="text-xs text-zinc-400">Combine whole foods to calculate exact per-serving macro splits</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-zinc-400 hover:text-white bg-surface-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Single Scrolling Body Form */}
        <form onSubmit={handleSubmit} id="custom-recipe-form" className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-zinc-300">Recipe Title</label>
              <input
                type="text"
                required
                placeholder="e.g. High-Protein Bison Sweet Potato Chili"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-sm text-zinc-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-sm text-zinc-100 focus:outline-none focus:border-brand-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="bulk_meal_prep">Batch Prep</option>
                <option value="snack_dessert">Snack / Dessert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Portions / Yield</label>
              <input
                type="number"
                min={1}
                max={12}
                value={customServings}
                onChange={(e) => setCustomServings(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border font-mono text-sm text-zinc-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Prep (min)</label>
              <input
                type="number"
                min={1}
                value={customPrepMins}
                onChange={(e) => setCustomPrepMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border font-mono text-sm text-zinc-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Cook (min)</label>
              <input
                type="number"
                min={0}
                value={customCookMins}
                onChange={(e) => setCustomCookMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border font-mono text-sm text-zinc-100"
              />
            </div>
          </div>

          {/* Ingredient Adder */}
          <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Add Ingredients</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <select
                  value={selectedFoodForCustom?.id || ''}
                  onChange={(e) => {
                    const found = foods.find((f) => f.id === e.target.value);
                    if (found) {
                      setSelectedFoodForCustom(found);
                      setCustomGramsInput(found.serving_size_g);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-xs text-zinc-100"
                >
                  <option value="">-- Choose Food --</option>
                  {foods.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name} ({food.calories_per_100g} kcal / 100g)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Weight (grams)"
                  value={customGramsInput}
                  onChange={(e) => setCustomGramsInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-xs text-zinc-100 font-mono"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Display (e.g. 6 oz)"
                  value={customMeasureInput}
                  onChange={(e) => setCustomMeasureInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-xs text-zinc-100"
                />
                <button
                  type="button"
                  onClick={handleAddCustomIngredient}
                  disabled={!selectedFoodForCustom}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-bold disabled:opacity-40 shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {customIngredientsList.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {customIngredientsList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-surface-100 border border-surface-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-zinc-200">{item.food.name}</span>
                      <span className="text-zinc-400 font-mono ml-2">({item.customMeasure} • {item.grams}g)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomIngredientsList((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300">Instructions (one step per line)</label>
            <textarea
              rows={3}
              placeholder="1. Season ingredients...&#10;2. Roast at 400°F for 15 minutes..."
              value={customInstructionsText}
              onChange={(e) => setCustomInstructionsText(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-200 border border-surface-border text-xs text-zinc-100 focus:outline-none focus:border-brand-500"
            />
          </div>
        </form>

        {/* Pinned Action Footer */}
        <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 bg-surface-100 flex items-center justify-between gap-3">
          <div>
            {customIngredientsList.length > 0 && (
              <div className="text-xs font-mono text-zinc-400">
                <strong className="text-brand-300">{customCalculatedMacros.calsPerServing} kcal</strong> ({customCalculatedMacros.proteinPerServing}g P / {customCalculatedMacros.carbsPerServing}g C / {customCalculatedMacros.fatPerServing}g F)
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="custom-recipe-form"
              disabled={!customTitle.trim() || customIngredientsList.length === 0}
              className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs shadow-glow disabled:opacity-40 cursor-pointer"
            >
              Save Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
