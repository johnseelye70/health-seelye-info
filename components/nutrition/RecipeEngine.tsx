'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import { RecipeItem, RecipeCategory, RecipeIngredient, FoodItem } from '@/lib/types';
import { COMPREHENSIVE_RECIPE_DATABASE } from '@/lib/recipe-database';
import {
  UtensilsCrossed,
  Sparkles,
  Clock,
  Flame,
  Plus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  ShoppingCart,
  ChefHat,
  Layers,
  Zap,
  BookOpen,
  X,
  Check,
  Printer,
} from 'lucide-react';
import { RecipePrintModal } from './RecipePrintModal';

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
    foods,
  } = useHealth();

  const isSimple = experienceMode === 'simple';
  const isImperial = profile.unit_preference === 'imperial';

  // If used as modal and closed, return null
  if (isModal && !isOpen) return null;

  // State
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  
  // Athlete Mode: Batch Scaler Multiplier (1x, 2x, 4x, 6x)
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);

  // Success Feedback Toasts / State
  const [actionSuccessMsg, setActionSuccessMsg] = useState<{ id: string; text: string } | null>(null);
  const [recipeToPrint, setRecipeToPrint] = useState<RecipeItem | null>(null);

  // Custom Recipe Creator State (Athlete Mode)
  const [showCustomBuilder, setShowCustomBuilder] = useState<boolean>(false);
  const [customRecipes, setCustomRecipes] = useState<RecipeItem[]>([]);
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
    // Construct a synthetic food item representing the recipe
    const recipeFoodItem: FoodItem = {
      id: `recipe-food-${recipe.id}`,
      name: recipe.title,
      category: 'protein',
      calories_per_100g: recipe.calories_per_serving, // 100g = 1 full serving
      protein_per_100g: recipe.protein_g_per_serving,
      carbs_per_100g: recipe.carbs_g_per_serving,
      fat_per_100g: recipe.fat_g_per_serving,
      serving_size_g: 100,
      default_unit: 'serving',
      is_gluten_free: recipe.tags.includes('Gluten-Free'),
      is_dairy_free: recipe.tags.includes('Dairy-Free'),
      storage_type: 'fresh_weekly',
    };

    logFood({
      food: recipeFoodItem,
      food_name: recipe.title,
      grams_consumed: 100, // Represents 1 serving
      meal_index: mealIndex,
      user_id: profile.id,
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

  // Custom Recipe Creator: Add Ingredient
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

  // Custom Recipe Creator: Calculate Macros per serving
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

  // Save Custom Recipe
  const handleSaveCustomRecipe = (e: React.FormEvent) => {
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
      })),
      instructions: customInstructionsText.trim()
        ? customInstructionsText.split('\n').filter((l) => l.trim().length > 0)
        : ['Combine all prepared ingredients and cook to desired doneness.'],
    };

    setCustomRecipes((prev) => [newRecipe, ...prev]);
    setShowCustomBuilder(false);
    setCustomTitle('');
    setCustomIngredientsList([]);
    setCustomInstructionsText('');
    triggerSuccessFeedback(newRecipe.id, `Created custom recipe "${newRecipe.title}"! 🎉`);
  };

  const categories = [
    { id: 'all', label: 'All Recipes', emoji: '🍽️' },
    { id: 'dinner', label: isSimple ? '15-Min Dinners' : 'Dinner Protocols', emoji: '🐟' },
    { id: 'lunch', label: isSimple ? 'Fresh Lunches' : 'Midday Fuel', emoji: '🥗' },
    { id: 'breakfast', label: isSimple ? 'Quick Breakfasts' : 'Morning Primers', emoji: '🥣' },
    { id: 'bulk_meal_prep', label: isSimple ? 'Batch Meal Prep' : 'Bulk Batch Prep', emoji: '🍲' },
    { id: 'snack_dessert', label: isSimple ? 'Light Treats' : 'Anabolic Snacks', emoji: '🍓' },
  ] as const;

  const content = (
    <div className="space-y-6">
      {/* Header Shelf Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-200/60 border border-surface-border backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {isSimple ? 'WHOLESOME KITCHEN RECIPES' : 'MACRO-ENGINEERED FUEL & PREP STUDIO'}
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-brand-400 font-mono text-xs font-bold uppercase">
              {isImperial ? 'Traditional US Units (Cups/Tbsp/Oz)' : 'Metric Units (Grams/Ml)'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-brand-400" />
            <span>{isSimple ? 'Wholesome Home Recipes' : 'Macro-Engineered Recipe Matrix'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
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
              onClick={() => setShowCustomBuilder(!showCustomBuilder)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{showCustomBuilder ? 'Close Builder' : 'Create Custom Recipe'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Athlete Mode: Custom Recipe Builder (Inline Drawer) */}
      {!isSimple && showCustomBuilder && (
        <div className="p-6 md:p-8 rounded-3xl bg-surface-100 border border-brand-500/40 shadow-2xl backdrop-blur-xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Custom Recipe Builder</h3>
                <p className="text-xs text-zinc-400">Combine whole foods to calculate exact per-serving macro splits</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomBuilder(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-surface-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveCustomRecipe} className="space-y-6">
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

            {/* Servings and Time */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Portions / Servings Yield</label>
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
                <label className="text-xs font-bold text-zinc-300">Prep Time (min)</label>
                <input
                  type="number"
                  min={1}
                  value={customPrepMins}
                  onChange={(e) => setCustomPrepMins(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border font-mono text-sm text-zinc-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Cook Time (min)</label>
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
                    placeholder="Display (e.g. 6 oz or 1 cup)"
                    value={customMeasureInput}
                    onChange={(e) => setCustomMeasureInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-xs text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomIngredient}
                    disabled={!selectedFoodForCustom}
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-bold disabled:opacity-40 shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Added Ingredients Chips */}
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
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculated Macros Preview Pill */}
            {customIngredientsList.length > 0 && (
              <div className="p-4 rounded-2xl bg-surface-200 border border-brand-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-brand-300">Per Serving Macros ({customServings} Servings Yield):</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {customCalculatedMacros.calsPerServing} kcal • {customCalculatedMacros.proteinPerServing}g Protein • {customCalculatedMacros.carbsPerServing}g Carbs • {customCalculatedMacros.fatPerServing}g Fat
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 text-zinc-950 font-bold text-xs shadow-glow"
                >
                  Save Custom Recipe
                </button>
              </div>
            )}
          </form>
        </div>
      )}

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

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search recipes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Athlete Mode: Dynamic Batch Prep Scaler Bar */}
      {!isSimple && (
        <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
            <Layers className="w-4 h-4 text-brand-400" />
            <span>Batch Meal Prep Scaler:</span>
            <span className="text-zinc-400 font-normal">
              Dynamically scales all ingredient weights for bulk Sunday cooking
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-300 p-1 rounded-xl border border-surface-border">
            {[
              { mult: 1, label: '1x Solo' },
              { mult: 2, label: '2x Couple' },
              { mult: 4, label: '4x Containers' },
              { mult: 6, label: '6x Weekly Bulk' },
            ].map((b) => (
              <button
                key={b.mult}
                type="button"
                onClick={() => setBatchMultiplier(b.mult)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
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
      )}

      {/* Global Success Feedback Banner */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold">{actionSuccessMsg.text}</span>
        </div>
      )}

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-500 italic bg-surface-100/40 rounded-3xl border border-surface-border">
            No recipes found matching your filter. Try searching for a different ingredient or category!
          </div>
        ) : (
          filteredRecipes.map((recipe) => {
            const isExpanded = expandedRecipeId === recipe.id;

            return (
              <div
                key={recipe.id}
                className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-brand-500/30 transition-all group"
              >
                <div>
                  {/* Top Badges & Timers */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xl">{recipe.icon_emoji || '🍽️'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-brand-500/15 text-brand-300 border border-brand-500/30">
                        {recipe.category.replace('_', ' ')}
                      </span>
                      {recipe.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-surface-200 text-zinc-400 border border-surface-border font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{recipe.prep_time_minutes + recipe.cook_time_minutes}m</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-brand-300 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    {recipe.description}
                  </p>

                  {/* Macros Pill: Simple vs Athlete Layout */}
                  {isSimple ? (
                    <div className="mt-3 p-3 rounded-2xl bg-surface-200/70 border border-surface-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-brand-400 fill-brand-400/20" />
                        <span className="text-xs font-bold text-zinc-200">Energy Profile:</span>
                      </div>
                      <div className="text-xs font-mono font-bold text-brand-400">
                        +{recipe.calories_per_serving} kcal <span className="text-zinc-400 font-normal">/ serving</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 rounded-2xl bg-surface-200/80 border border-surface-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400">Per Serving Blueprint:</span>
                        <span className="font-bold text-brand-400">{recipe.calories_per_serving} kcal</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                        <div className="p-1 rounded-lg bg-surface-300">
                          <span className="text-brand-400 font-bold">{recipe.protein_g_per_serving}g</span>
                          <span className="text-zinc-400 block text-[9px]">Protein (35%)</span>
                        </div>
                        <div className="p-1 rounded-lg bg-surface-300">
                          <span className="text-cyan-400 font-bold">{recipe.carbs_g_per_serving}g</span>
                          <span className="text-zinc-400 block text-[9px]">Carbs (40%)</span>
                        </div>
                        <div className="p-1 rounded-lg bg-surface-300">
                          <span className="text-amber-400 font-bold">{recipe.fat_g_per_serving}g</span>
                          <span className="text-zinc-400 block text-[9px]">Fats (25%)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Traditional Ingredients List with Multiplier */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                      <span>Ingredients ({isImperial ? 'Standard Culinary Measures' : 'Metric Measures'}):</span>
                      {!isSimple && batchMultiplier > 1 && (
                        <span className="text-brand-400 font-mono text-[10px] bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                          {batchMultiplier}x Batch Prep Scaled
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {recipe.ingredients.map((ing, idx) => {
                        const rawMeasure = isImperial ? ing.amount_imperial : ing.amount_metric;
                        let displayMeasure = rawMeasure;

                        // Athlete mode scaled grams calculation
                        if (!isSimple && batchMultiplier > 1 && ing.raw_weight_grams_base) {
                          const totalGrams = ing.raw_weight_grams_base * batchMultiplier;
                          const totalOz = (totalGrams * 0.03527).toFixed(1);
                          displayMeasure = isImperial
                            ? `${totalOz} oz (${totalGrams}g) • scaled for ${batchMultiplier}x`
                            : `${totalGrams}g • scaled for ${batchMultiplier}x`;
                        }

                        return (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-surface-200/50 border border-surface-border/60 flex items-center justify-between"
                          >
                            <span className="text-zinc-200">{ing.name}</span>
                            <span className="font-mono font-bold text-brand-300 text-[11px] shrink-0">
                              {displayMeasure}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expandable Step-by-Step Instructions (Zero Popup) */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-surface-border space-y-3 animate-fadeIn">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                        <BookOpen className="w-4 h-4 text-brand-400" />
                        <span>Step-by-Step Preparation:</span>
                      </div>

                      <ol className="space-y-2 text-xs text-zinc-300 leading-relaxed pl-1">
                        {recipe.instructions.map((step, sIdx) => (
                          <li key={sIdx} className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-surface-300 text-brand-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="flex-1">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {recipe.chef_notes && (
                        <div className="p-3 rounded-2xl bg-surface-200/80 border border-brand-500/20 text-[11px] text-zinc-300 mt-2">
                          <strong className="text-brand-300 font-bold">Chef's Note: </strong>
                          {recipe.chef_notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-surface-border/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer self-start sm:self-auto py-1"
                  >
                    <span>{isExpanded ? 'Hide Steps' : 'View Prep Steps'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Print Recipe Button (4x6 Card or Letter) */}
                    <button
                      type="button"
                      onClick={() => setRecipeToPrint(recipe)}
                      className="px-3 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      title="Print 4x6 Index Card or Standard Letter Sheet"
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
                        <span>Cooked This!</span>
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
            );
          })
        )}
      </div>

      {/* Recipe Print Modal (Supports 4x6 Index Card and 8.5x11 Standard Letter) */}
      <RecipePrintModal
        recipe={recipeToPrint}
        onClose={() => setRecipeToPrint(null)}
        defaultUnitPreference={profile.unit_preference}
      />
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl my-auto p-5 sm:p-8 rounded-3xl bg-surface-100/95 border border-surface-border shadow-2xl backdrop-blur-xl text-zinc-100 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button top-right */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2.5 rounded-2xl text-zinc-400 hover:text-white bg-surface-200/80 hover:bg-surface-200 transition-colors z-20 cursor-pointer"
              title="Close Recipe Studio"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {content}
        </div>
      </div>
    );
  }

  return content;
};
