'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  RecipeItem,
  RecipeCategory,
  RecipeSubCategory,
  RecipeIngredient,
  RecipeIngredientSwapOption,
  GroceryStoreTag,
  FoodItem,
  UnitPreference,
} from '@/lib/types';
import { COMPREHENSIVE_RECIPE_DATABASE, RECIPE_SUB_CATEGORIES } from '@/lib/recipe-database';
import {
  getSmartSwapsForIngredient,
  calculateCustomizedRecipe,
} from '@/lib/recipe-swap-engine';
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
  CreditCard,
  FileText,
  Filter,
  RefreshCw,
  Repeat,
  SlidersHorizontal,
  Info,
  RotateCcw,
  Store,
} from 'lucide-react';

interface RecipeEngineProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export type PrintFormat = 'index_card_4x6' | 'standard_letter';

export const RecipeEngine: React.FC<RecipeEngineProps> = ({
  isOpen = true,
  onClose,
  isModal = true,
}) => {
  const { profile, experienceMode, logFood, addGroceryItem, setActiveTab } = useHealth();

  const isSimple = experienceMode === 'simple';
  const isImperial = profile.unit_preference === 'imperial';

  // If used as modal and closed, return null
  if (isModal && !isOpen) return null;

  // Category & Subcategory State
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<RecipeSubCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Target Store for Grocery Routing (Aldi, Meijer, Sam's Club, Costco, Walmart, All)
  const [selectedTargetStore, setSelectedTargetStore] = useState<GroceryStoreTag>('all');

  // Selected recipe for 100% Inline Detail View
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<RecipeItem | null>(null);

  // Dynamic Ingredient Swaps State (keyed by ingredient index in selected recipe)
  const [activeSwaps, setActiveSwaps] = useState<Record<number, RecipeIngredientSwapOption>>({});
  const [openSwapIndex, setOpenSwapIndex] = useState<number | null>(null);

  // Selected recipe for Dedicated Print Preview Studio
  const [recipeForPrintPreview, setRecipeForPrintPreview] = useState<RecipeItem | null>(null);
  const [printFormat, setPrintFormat] = useState<PrintFormat>('index_card_4x6');
  const [printUnits, setPrintUnits] = useState<UnitPreference>(profile.unit_preference || 'imperial');
  const [printMultiplier, setPrintMultiplier] = useState<number>(1);

  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customRecipes, setCustomRecipes] = useState<RecipeItem[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  // Athlete Mode: Batch Scaler Multiplier (1x, 2x, 4x, 6x)
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);

  // Success Feedback Toasts / State
  const [actionSuccessMsg, setActionSuccessMsg] = useState<{ id: string; text: string; showGroceryLink?: boolean } | null>(null);

  // All combined recipes
  const allRecipes = useMemo(() => {
    return [...customRecipes, ...COMPREHENSIVE_RECIPE_DATABASE];
  }, [customRecipes]);

  // Available subcategories based on active category
  const availableSubCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return RECIPE_SUB_CATEGORIES;
    }
    return RECIPE_SUB_CATEGORIES.filter((sub) => sub.category === selectedCategory);
  }, [selectedCategory]);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      const matchesCat = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesSubCat = selectedSubCategory === 'all' || recipe.sub_category === selectedSubCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (recipe.sub_category && recipe.sub_category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSubCat && matchesQuery;
    });
  }, [allRecipes, selectedCategory, selectedSubCategory, searchQuery]);

  // Count recipes in each category
  const getCategoryCount = (catId: RecipeCategory) => {
    if (catId === 'all') return allRecipes.length;
    return allRecipes.filter((r) => r.category === catId).length;
  };

  // Count recipes in each subcategory
  const getSubCategoryCount = (subId: RecipeSubCategory | 'all') => {
    if (subId === 'all') {
      if (selectedCategory === 'all') return allRecipes.length;
      return allRecipes.filter((r) => r.category === selectedCategory).length;
    }
    return allRecipes.filter((r) => r.sub_category === subId).length;
  };

  // Trigger feedback banner
  const triggerSuccessFeedback = (recipeId: string, text: string, showGroceryLink: boolean = false) => {
    setActionSuccessMsg({ id: recipeId, text, showGroceryLink });
    setTimeout(() => {
      setActionSuccessMsg((prev) => (prev?.id === recipeId ? null : prev));
    }, 6000);
  };

  // Compute live customized recipe with all ingredient swaps and batch multiplier applied
  const customizedDetailRecipe = useMemo(() => {
    if (!selectedRecipeDetail) return null;
    return calculateCustomizedRecipe(selectedRecipeDetail, activeSwaps, batchMultiplier);
  }, [selectedRecipeDetail, activeSwaps, batchMultiplier]);

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

  // 1-Tap Sync Ingredients to Grocery List with Store Routing (Aldi, Meijer, Sam's Club, Costco, Walmart, All)
  const handleSyncGrocery = (
    recipe: RecipeItem,
    multiplier: number = 1,
    targetStore?: GroceryStoreTag
  ) => {
    const effectiveStore = targetStore || selectedTargetStore;
    const listMap: Record<string, string> = {
      aldi: 'aldi_run',
      meijer: 'meijer_run',
      sams_club: 'sams_club_bulk',
      costco: 'costco_bulk',
      walmart: 'walmart_run',
      all: 'main',
    };
    const targetListId = listMap[effectiveStore] || 'main';

    const storeNames: Record<string, string> = {
      all: 'Weekly Shopping',
      aldi: 'Aldi',
      meijer: 'Meijer',
      sams_club: "Sam's Club",
      costco: 'Costco Wholesale',
      walmart: 'Walmart',
    };
    const storeLabel = storeNames[effectiveStore] || 'Shopping';

    let countAdded = 0;
    recipe.ingredients.forEach((ing) => {
      const baseMeasure = isImperial ? ing.amount_imperial : ing.amount_metric;
      const scaledMeasure = multiplier > 1 ? `${multiplier}x (${baseMeasure})` : baseMeasure;

      addGroceryItem({
        item_name: ing.name,
        category: 'fresh_weekly',
        quantity: multiplier,
        unit: baseMeasure,
        department: ing.department || 'produce',
        is_checked: false,
        in_pantry: false,
        store_tag: effectiveStore !== 'all' ? effectiveStore : undefined,
        list_id: targetListId,
        notes: `For ${recipe.title} (${scaledMeasure})${ing.notes ? ` - ${ing.notes}` : ''}`,
      });
      countAdded++;
    });

    triggerSuccessFeedback(
      recipe.id,
      `Added ${countAdded} ingredients from "${recipe.title}" ${multiplier > 1 ? `(${multiplier}x batch)` : ''} to your ${storeLabel} List! 🛒`,
      true
    );
  };

  const handleOpenPrintPreview = (recipe: RecipeItem, multiplier: number = 1) => {
    setRecipeForPrintPreview(recipe);
    setPrintMultiplier(multiplier);
    setPrintUnits(profile.unit_preference || 'imperial');
  };

  const categories = [
    { id: 'all', label: 'All Recipes', emoji: '🍽️' },
    { id: 'breakfast', label: isSimple ? 'Breakfasts' : 'Morning Primers', emoji: '🍳' },
    { id: 'lunch', label: isSimple ? 'Lunches & Bowls' : 'Midday Power', emoji: '🥗' },
    { id: 'dinner', label: isSimple ? 'Dinners & Steaks' : 'Dinner Protocols', emoji: '🥩' },
    { id: 'bulk_meal_prep', label: isSimple ? 'Batch Meal Prep' : 'Bulk Batch Prep', emoji: '🍲' },
    { id: 'snack_dessert', label: isSimple ? 'Snacks & Treats' : 'Anabolic Snacks', emoji: '🍓' },
  ] as const;

  const storeOptions: { id: GroceryStoreTag; label: string; icon: string }[] = [
    { id: 'all', label: 'All Stores', icon: '🏢' },
    { id: 'aldi', label: 'Aldi', icon: '🛒' },
    { id: 'meijer', label: 'Meijer', icon: '🏷️' },
    { id: 'sams_club', label: "Sam's Club", icon: '📦' },
    { id: 'costco', label: 'Costco', icon: '🏬' },
    { id: 'walmart', label: 'Walmart', icon: '🏪' },
  ];

  // View: 100% INLINE Print Preview & Customization Studio
  const renderPrintPreviewStudio = (printRecipe: RecipeItem) => {
    const isPrintImperial = printUnits === 'imperial';
    const totalCals = printRecipe.calories_per_serving * printMultiplier;
    const is4x6 = printFormat === 'index_card_4x6';

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Navigation & Action Header */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-200/90 border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setRecipeForPrintPreview(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-300 hover:bg-surface-100 border border-surface-border text-xs font-bold text-zinc-300 hover:text-foreground cursor-pointer transition-all shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Recipe</span>
            </button>

            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Printer className="w-4 h-4 text-brand-400" />
                <span>Recipe Print Preview Studio</span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Preview exact output with your active ingredient swaps and custom macro totals
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print {is4x6 ? '4" x 6" Card' : 'Letter Sheet'}</span>
          </button>
        </div>

        {/* Print Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-100 border border-surface-border">
          {/* Format Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Print Format
            </label>
            <div className="flex bg-surface-200 p-1 rounded-xl border border-surface-border">
              <button
                type="button"
                onClick={() => setPrintFormat('index_card_4x6')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  is4x6
                    ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                    : 'text-zinc-400 hover:text-foreground'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>4" x 6" Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('standard_letter')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !is4x6
                    ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                    : 'text-zinc-400 hover:text-foreground'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>8.5" x 11" Letter</span>
              </button>
            </div>
          </div>

          {/* Units Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Measurement Units
            </label>
            <div className="flex bg-surface-200 p-1 rounded-xl border border-surface-border">
              <button
                type="button"
                onClick={() => setPrintUnits('imperial')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isPrintImperial
                    ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                    : 'text-zinc-400 hover:text-foreground'
                }`}
              >
                US (Cups/Oz)
              </button>
              <button
                type="button"
                onClick={() => setPrintUnits('metric')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isPrintImperial
                    ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                    : 'text-zinc-400 hover:text-foreground'
                }`}
              >
                Metric (Grams/Ml)
              </button>
            </div>
          </div>

          {/* Batch Scaler Multiplier */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Yield Scaler
            </label>
            <div className="flex bg-surface-200 p-1 rounded-xl border border-surface-border">
              {[1, 2, 4, 6].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPrintMultiplier(m)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    printMultiplier === m
                      ? 'bg-brand-500 text-zinc-950 shadow-glow'
                      : 'text-zinc-400 hover:text-foreground'
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live On-Screen Visual Paper Preview & Print Canvas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400 px-1 no-print">
            <span>Visual Preview ({is4x6 ? '4" x 6" Kitchen Index Card' : '8.5" x 11" Standard Sheet'}):</span>
            <span className="text-brand-400 font-mono">100% Ink-Friendly Paper Layout</span>
          </div>

          <div className="p-4 sm:p-8 bg-zinc-900/90 rounded-3xl border border-surface-border flex justify-center overflow-x-auto">
            {/* Single Unified Target for Screen Preview and Physical Print */}
            <div
              id="recipe-print-canvas"
              className={`bg-white text-black font-sans shadow-2xl transition-all ${
                is4x6
                  ? 'w-full max-w-[600px] p-5 border-2 border-black rounded-lg text-[11px] print-canvas-4x6'
                  : 'w-full max-w-[760px] p-8 border border-zinc-300 rounded-lg text-xs print-canvas-letter'
              }`}
            >
              {/* Header */}
              <div className="border-b-2 border-black pb-2 mb-3 flex items-start justify-between gap-3 print-avoid-break">
                <div>
                  <div className="text-[9px] uppercase font-bold tracking-widest text-zinc-600">
                    SEELYE FAMILY HEALTH • WHOLESOME RECIPES
                  </div>
                  <h3 className={`${is4x6 ? 'text-base' : 'text-xl'} font-black text-black leading-tight mt-0.5`}>
                    {printRecipe.title}
                  </h3>
                  <p className="text-[10px] text-zinc-700 italic mt-0.5 max-w-xl">
                    {printRecipe.description}
                  </p>
                </div>
                <div className="text-right shrink-0 border-l border-black pl-3">
                  <div className={`${is4x6 ? 'text-sm' : 'text-base'} font-black text-black`}>
                    {totalCals} kcal
                  </div>
                  <div className="text-[9px] text-zinc-600 font-mono">
                    Prep: {printRecipe.prep_time_minutes}m • Cook: {printRecipe.cook_time_minutes}m
                  </div>
                  <div className="text-[9px] font-bold text-black">
                    Yield: {printRecipe.servings_yield * printMultiplier} portion{printRecipe.servings_yield * printMultiplier > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* 4x6 Compact Layout */}
              {is4x6 ? (
                <div className="grid grid-cols-5 gap-4 text-[10.5px]">
                  {/* Left Column: Ingredients & Macros */}
                  <div className="col-span-2 space-y-2 print-avoid-break">
                    <div className="font-bold uppercase text-[10px] border-b border-black pb-0.5">
                      Ingredients {printMultiplier > 1 ? `(${printMultiplier}x)` : ''}
                    </div>
                    <ul className="space-y-1">
                      {printRecipe.ingredients.map((ing, idx) => {
                        const rawMeasure = isPrintImperial ? ing.amount_imperial : ing.amount_metric;
                        let displayMeasure = rawMeasure;

                        if (printMultiplier > 1 && ing.raw_weight_grams_base) {
                          const totalGrams = ing.raw_weight_grams_base * printMultiplier;
                          const totalOz = (totalGrams * 0.03527).toFixed(1);
                          displayMeasure = isPrintImperial
                            ? `${totalOz} oz (${totalGrams}g)`
                            : `${totalGrams}g`;
                        } else if (printMultiplier > 1) {
                          displayMeasure = `${printMultiplier}x (${rawMeasure})`;
                        }

                        return (
                          <li key={idx} className="flex items-start gap-1.5 leading-tight">
                            <span className="inline-block w-2.5 h-2.5 border border-black rounded-none mt-0.5 shrink-0"></span>
                            <span>
                              <strong>{displayMeasure}</strong> {ing.name}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="p-1.5 border border-black text-[9px] font-mono mt-2 bg-zinc-50">
                      <strong>Macros:</strong> {printRecipe.protein_g_per_serving}g P • {printRecipe.carbs_g_per_serving}g C • {printRecipe.fat_g_per_serving}g F
                    </div>
                  </div>

                  {/* Right Column: Directions */}
                  <div className="col-span-3 space-y-2 print-avoid-break">
                    <div className="font-bold uppercase text-[10px] border-b border-black pb-0.5">
                      Preparation & Directions
                    </div>
                    <ol className="space-y-1.5 text-[10px] leading-snug">
                      {printRecipe.instructions.map((step, sIdx) => (
                        <li key={sIdx} className="flex gap-1.5">
                          <span className="font-bold font-mono shrink-0">{sIdx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>

                    {printRecipe.chef_notes && (
                      <div className="mt-2 pt-1 border-t border-zinc-400 text-[9px] italic text-zinc-800">
                        <strong>Tip:</strong> {printRecipe.chef_notes}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Letter Full Sheet Layout */
                <div className="space-y-4 text-xs">
                  {/* Macro Summary */}
                  <div className="p-2 border border-black flex justify-around text-xs font-mono print-avoid-break">
                    <div><strong>Protein:</strong> {printRecipe.protein_g_per_serving}g</div>
                    <div><strong>Carbohydrates:</strong> {printRecipe.carbs_g_per_serving}g</div>
                    <div><strong>Fats:</strong> {printRecipe.fat_g_per_serving}g</div>
                  </div>

                  {/* Ingredients Section */}
                  <div className="space-y-1.5 print-avoid-break">
                    <div className="font-bold uppercase text-xs border-b border-black pb-0.5">
                      Ingredients {printMultiplier > 1 ? `(${printMultiplier}x Batch)` : ''}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                      {printRecipe.ingredients.map((ing, idx) => {
                        const rawMeasure = isPrintImperial ? ing.amount_imperial : ing.amount_metric;
                        let displayMeasure = rawMeasure;

                        if (printMultiplier > 1 && ing.raw_weight_grams_base) {
                          const totalGrams = ing.raw_weight_grams_base * printMultiplier;
                          const totalOz = (totalGrams * 0.03527).toFixed(1);
                          displayMeasure = isPrintImperial
                            ? `${totalOz} oz (${totalGrams}g)`
                            : `${totalGrams}g`;
                        } else if (printMultiplier > 1) {
                          displayMeasure = `${printMultiplier}x (${rawMeasure})`;
                        }

                        return (
                          <div key={idx} className="flex items-start gap-2 py-0.5">
                            <span className="inline-block w-3 h-3 border border-black rounded-none mt-0.5 shrink-0"></span>
                            <span className="leading-snug">
                              <strong>{displayMeasure}</strong> {ing.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Directions Section */}
                  <div className="space-y-1.5">
                    <div className="font-bold uppercase text-xs border-b border-black pb-0.5 print-avoid-break">
                      Preparation & Directions
                    </div>
                    <ol className="space-y-2 pt-1">
                      {printRecipe.instructions.map((step, sIdx) => (
                        <li key={sIdx} className="flex gap-2 text-xs leading-relaxed print-avoid-break">
                          <span className="font-bold font-mono shrink-0">{sIdx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>

                    {printRecipe.chef_notes && (
                      <div className="mt-3 p-2.5 border border-black text-xs italic print-avoid-break">
                        <strong>Chef's Technique & Advice:</strong> {printRecipe.chef_notes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div className="mt-4 pt-1.5 border-t border-zinc-400 text-[8px] font-mono text-zinc-600 flex justify-between print-avoid-break">
                <span>health.seelye.info</span>
                <span>{is4x6 ? '4x6 Kitchen Index Card Format' : '8.5x11 Standard Letter Format'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // View: 100% INLINE Recipe Detail View with Live Ingredient Swapping & Macro Recalculation
  const renderInlineRecipeDetail = (baseRecipe: RecipeItem) => {
    if (!customizedDetailRecipe) return null;
    const detailRecipe = customizedDetailRecipe;
    const detailCalories = detailRecipe.calories_per_serving * batchMultiplier;

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Navigation Back Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-surface-border">
          <button
            type="button"
            onClick={() => {
              setSelectedRecipeDetail(null);
              setActiveSwaps({});
              setOpenSwapIndex(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-300 hover:text-foreground cursor-pointer transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Recipes</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {detailRecipe.hasSwaps && (
              <button
                type="button"
                onClick={() => {
                  setActiveSwaps({});
                  setOpenSwapIndex(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold cursor-pointer transition-all active:scale-95"
                title="Reset all ingredients to original recipe"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Swaps</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleOpenPrintPreview(detailRecipe, batchMultiplier)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-foreground cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4 text-brand-400" />
              <span>Print Preview & Card</span>
            </button>

            {/* Store Destination Routing & Sync Button */}
            <div className="flex items-center gap-1 bg-surface-200 p-1 rounded-2xl border border-surface-border">
              <select
                value={selectedTargetStore}
                onChange={(e) => setSelectedTargetStore(e.target.value as any)}
                className="bg-surface-300 text-foreground text-xs font-bold px-2.5 py-1.5 rounded-xl border-none focus:outline-none cursor-pointer"
                title="Choose destination store list"
              >
                {storeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleSyncGrocery(detailRecipe, batchMultiplier)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-bold cursor-pointer shadow-glow active:scale-95 transition-all"
                title={`Add all ingredients to ${storeOptions.find(s => s.id === selectedTargetStore)?.label || 'Shopping'} list`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>+ Grocery</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('grocery');
                  onClose?.();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-surface-300 hover:bg-surface-100 text-zinc-300 hover:text-foreground text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Go to Shopping List"
              >
                <span className="hidden sm:inline">View</span> List
              </button>
            </div>
          </div>
        </div>

        {/* Recipe Hero Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-surface-200/80 border border-surface-border space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xl">{detailRecipe.icon_emoji || '🍽️'}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/15 text-brand-300 border border-brand-500/30">
              {detailRecipe.category.replace('_', ' ')}
            </span>
            {detailRecipe.sub_category && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-300 text-brand-400 border border-surface-border">
                {detailRecipe.sub_category.replace(/_/g, ' ')}
              </span>
            )}
            {detailRecipe.hasSwaps && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>{detailRecipe.swapCount} Custom Swap{detailRecipe.swapCount > 1 ? 's' : ''} Active</span>
              </span>
            )}
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
              {detailRecipe.hasSwaps && detailRecipe.macroDeltas.calories !== 0 && (
                <span className={`text-[10px] ml-1 ${detailRecipe.macroDeltas.calories < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  ({detailRecipe.macroDeltas.calories > 0 ? '+' : ''}{detailRecipe.macroDeltas.calories} kcal)
                </span>
              )}
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

        {/* Macronutrient Profile with Live Swapped Deltas */}
        <div className="p-4 sm:p-6 rounded-2xl bg-surface-200/50 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Live Macronutrient Breakdown (Per Serving):</span>
            <span className="font-bold text-brand-400">{detailRecipe.calories_per_serving} kcal</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
              <span className="text-brand-400 font-black text-sm">{detailRecipe.protein_g_per_serving}g</span>
              <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Protein</span>
              {detailRecipe.hasSwaps && detailRecipe.macroDeltas.protein !== 0 && (
                <span className={`text-[10px] ${detailRecipe.macroDeltas.protein > 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                  {detailRecipe.macroDeltas.protein > 0 ? '+' : ''}{detailRecipe.macroDeltas.protein}g
                </span>
              )}
            </div>
            <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
              <span className="text-cyan-400 font-black text-sm">{detailRecipe.carbs_g_per_serving}g</span>
              <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Carbohydrates</span>
              {detailRecipe.hasSwaps && detailRecipe.macroDeltas.carbs !== 0 && (
                <span className={`text-[10px] ${detailRecipe.macroDeltas.carbs < 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                  {detailRecipe.macroDeltas.carbs > 0 ? '+' : ''}{detailRecipe.macroDeltas.carbs}g
                </span>
              )}
            </div>
            <div className="p-2.5 rounded-xl bg-surface-300/80 border border-surface-border/50">
              <span className="text-amber-400 font-black text-sm">{detailRecipe.fat_g_per_serving}g</span>
              <span className="text-zinc-400 block text-[10px] uppercase font-sans mt-0.5">Healthy Fats</span>
              {detailRecipe.hasSwaps && detailRecipe.macroDeltas.fat !== 0 && (
                <span className={`text-[10px] ${detailRecipe.macroDeltas.fat < 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                  {detailRecipe.macroDeltas.fat > 0 ? '+' : ''}{detailRecipe.macroDeltas.fat}g
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Ingredients Checklist with Interactive Swap Studio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-brand-400" />
              <span>Ingredients & Smart Swaps ({isImperial ? 'Standard Culinary Measures' : 'Metric Measures'})</span>
            </h3>
            {batchMultiplier > 1 && (
              <span className="text-[11px] font-mono text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                {batchMultiplier}x Batch Scaled
              </span>
            )}
          </div>

          <p className="text-[11px] text-zinc-400">
            Click <strong>🔁 Swap</strong> on any ingredient to customize dairy, proteins, or vegetables with automatic live macro recalculation!
          </p>

          <div className="space-y-3">
            {baseRecipe.ingredients.map((originalIng, idx) => {
              const currentIng = detailRecipe.ingredients[idx];
              const isSwapped = !!activeSwaps[idx];
              const isDrawerOpen = openSwapIndex === idx;

              const rawMeasure = isImperial ? currentIng.amount_imperial : currentIng.amount_metric;
              let displayMeasure = rawMeasure;

              if (batchMultiplier > 1 && currentIng.raw_weight_grams_base) {
                const totalGrams = currentIng.raw_weight_grams_base * batchMultiplier;
                const totalOz = (totalGrams * 0.03527).toFixed(1);
                displayMeasure = isImperial ? `${totalOz} oz (${totalGrams}g)` : `${totalGrams}g`;
              } else if (batchMultiplier > 1) {
                displayMeasure = `${batchMultiplier}x (${rawMeasure})`;
              }

              const isChecked = checkedIngredients[idx];
              const smartSwaps = getSmartSwapsForIngredient(originalIng);
              const hasSwapsAvailable = smartSwaps.length > 0;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isSwapped
                      ? 'border-brand-500/60 bg-brand-500/5 shadow-sm'
                      : 'bg-surface-200/70 border-surface-border'
                  }`}
                >
                  {/* Ingredient Row */}
                  <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div
                      onClick={() => {
                        setCheckedIngredients((prev) => ({
                          ...prev,
                          [idx]: !prev[idx],
                        }));
                      }}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-brand-500 border-brand-500 text-zinc-950'
                            : 'border-zinc-600 bg-surface-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-xs sm:text-sm text-foreground ${isChecked ? 'line-through text-zinc-500' : ''}`}>
                            {currentIng.name}
                          </span>
                          {isSwapped && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/40">
                              Swapped from {originalIng.name}
                            </span>
                          )}
                        </div>
                        {currentIng.notes && (
                          <p className="text-[11px] text-zinc-400 italic">{currentIng.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Quantity & Swap Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="font-mono text-xs font-bold text-brand-400">
                        {displayMeasure}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isSwapped && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSwaps((prev) => {
                                const copy = { ...prev };
                                delete copy[idx];
                                return copy;
                              });
                            }}
                            className="p-1.5 rounded-xl bg-surface-300 hover:bg-surface-100 text-zinc-400 hover:text-foreground text-xs transition-all cursor-pointer"
                            title={`Revert to ${originalIng.name}`}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {hasSwapsAvailable && (
                          <button
                            type="button"
                            onClick={() => setOpenSwapIndex(isDrawerOpen ? null : idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isDrawerOpen
                                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                                : isSwapped
                                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 hover:bg-brand-500/30'
                                : 'bg-surface-300 hover:bg-surface-100 text-zinc-300 hover:text-foreground border border-surface-border'
                            }`}
                          >
                            <Repeat className="w-3.5 h-3.5" />
                            <span>{isSwapped ? 'Change Swap' : 'Swap'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inline Swap Studio Accordion */}
                  {isDrawerOpen && (
                    <div className="p-4 bg-surface-100/95 border-t border-surface-border/80 space-y-4 animate-fadeIn">
                      {/* Section 1: Recommended Direct Swaps */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                            <span>Authentic Culinary Options for {originalIng.name}:</span>
                          </span>
                          <span className="text-[11px] text-zinc-400">1-Tap to apply</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {smartSwaps.map((opt, sIdx) => {
                            const isCurrentSwap = activeSwaps[idx]?.name === opt.name;
                            const isOriginalMatch = originalIng.name.toLowerCase() === opt.name.toLowerCase();

                            return (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => {
                                  if (isOriginalMatch) {
                                    setActiveSwaps((prev) => {
                                      const copy = { ...prev };
                                      delete copy[idx];
                                      return copy;
                                    });
                                  } else {
                                    setActiveSwaps((prev) => ({
                                      ...prev,
                                      [idx]: opt,
                                    }));
                                  }
                                  setOpenSwapIndex(null);
                                }}
                                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                                  isCurrentSwap || (isOriginalMatch && !isSwapped)
                                    ? 'border-brand-500 bg-brand-500/15 shadow-sm'
                                    : 'border-surface-border bg-surface-200/80 hover:bg-surface-300 hover:border-zinc-600'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-xs text-foreground truncate">
                                    {opt.name}
                                  </span>
                                  {opt.tag && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 whitespace-nowrap">
                                      {opt.tag}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                                  <span>{isImperial ? opt.amount_imperial : opt.amount_metric}</span>
                                  <span className="text-brand-400 font-bold">
                                    {opt.calories} kcal • {opt.protein_g}g P • {opt.carbs_g}g C • {opt.fat_g}g F
                                  </span>
                                </div>

                                {opt.reason && (
                                  <div className="text-[10px] text-zinc-500 italic mt-0.5 line-clamp-1">
                                    {opt.reason}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cooking Directions with Dynamic Culinary Adaptation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent-cyan" />
              <span>Step-by-Step Cooking Directions</span>
            </h3>
            {detailRecipe.hasSwaps && detailRecipe.adaptedStepsIndices && detailRecipe.adaptedStepsIndices.length > 0 && (
              <span className="text-[10px] font-bold font-mono text-brand-300 bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Directions Adapted for Active Swaps</span>
              </span>
            )}
          </div>

          <ol className="space-y-2.5 text-xs">
            {detailRecipe.instructions.map((step, sIdx) => {
              const isStepAdapted = detailRecipe.adaptedStepsIndices && detailRecipe.adaptedStepsIndices.includes(sIdx);

              return (
                <li
                  key={sIdx}
                  className={`p-3.5 rounded-2xl border flex gap-3 transition-all ${
                    isStepAdapted
                      ? 'bg-brand-500/10 border-brand-500/40 shadow-sm'
                      : 'bg-surface-200/60 border-surface-border/70'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-xl border font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      isStepAdapted
                        ? 'bg-brand-500 text-zinc-950 border-brand-500 shadow-glow'
                        : 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                    }`}
                  >
                    {sIdx + 1}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="text-foreground leading-relaxed text-xs sm:text-[13px]">{step}</p>
                    {isStepAdapted && (
                      <span className="inline-block text-[10px] font-bold text-brand-300 bg-brand-500/20 px-2 py-0.2 rounded-md">
                        ✨ Customized culinary step
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
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
            onClick={() => {
              setSelectedRecipeDetail(null);
              setActiveSwaps({});
              setOpenSwapIndex(null);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-surface-300 hover:bg-surface-100 border border-surface-border text-xs font-bold text-zinc-300 hover:text-foreground flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Recipes</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={() => handleOpenPrintPreview(detailRecipe, batchMultiplier)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-surface-300 hover:bg-surface-100 border border-surface-border text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-brand-400" />
              <span>Print Preview & Card</span>
            </button>

            {/* Store Destination Routing for Bottom Bar */}
            <div className="flex items-center gap-1 bg-surface-300 p-1 rounded-2xl border border-surface-border">
              <select
                value={selectedTargetStore}
                onChange={(e) => setSelectedTargetStore(e.target.value as any)}
                className="bg-surface-200 text-foreground text-xs font-bold px-2 py-1.5 rounded-xl border-none focus:outline-none cursor-pointer"
                title="Choose destination store list"
              >
                {storeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleSyncGrocery(detailRecipe, batchMultiplier)}
                className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-brand-500 hover:text-zinc-950 text-foreground text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Add to selected store list"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-accent-cyan" />
                <span>+ List</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('grocery');
                  onClose?.();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-100 text-zinc-300 hover:text-foreground text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Go to Shopping List"
              >
                <span>View List</span>
              </button>
            </div>

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
              ? 'Distinct, chef-crafted meals with instant ingredient swapping (e.g. 2% vs Whole milk, asparagus vs green beans) with live updated nutritional stats and direct store shopping list integration!'
              : 'Precision macro recipes with batch meal prep scaling (1x, 2x, 4x, 6x), per-serving MPS breakdowns, live ingredient swapping, custom recipe builder, and multi-store list routing.'}
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

      {/* Interactive Store Routing Shelf & Controls */}
      <div className="p-4 rounded-2xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Store Destination Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <Store className="w-3.5 h-3.5 text-brand-400" />
            <span>Store List Destination:</span>
          </span>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
            {storeOptions.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedTargetStore(st.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedTargetStore === st.id
                    ? 'bg-brand-500 text-zinc-950 font-bold shadow-glow'
                    : 'bg-surface-200/80 text-zinc-400 hover:text-zinc-200 hover:bg-surface-300'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients, recipes..."
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

      {/* Category Tabs */}
      <div className="p-3 rounded-2xl bg-surface-200/50 border border-surface-border flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id as any);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setSelectedSubCategory('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                  : 'bg-surface-300 text-zinc-400 hover:text-zinc-200 hover:bg-surface-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-surface-200 text-zinc-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-Category Filter Shelf */}
      {availableSubCategories.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-surface-200/50 border border-surface-border/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 shrink-0 pl-1">
            <Filter className="w-3 h-3 text-brand-400" />
            <span>Sub-Categories:</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedSubCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              selectedSubCategory === 'all'
                ? 'bg-brand-500 text-zinc-950 font-bold shadow-sm'
                : 'bg-surface-300/80 text-zinc-400 hover:text-foreground hover:bg-surface-300'
            }`}
          >
            All {selectedCategory !== 'all' ? selectedCategory.replace(/_/g, ' ') : ''} ({getSubCategoryCount('all')})
          </button>

          {availableSubCategories.map((sub) => {
            const isSubSelected = selectedSubCategory === sub.id;
            const subCount = getSubCategoryCount(sub.id);
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubCategory(sub.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSubSelected
                    ? 'bg-brand-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-surface-300/80 text-zinc-400 hover:text-foreground hover:bg-surface-300'
                }`}
                title={sub.description}
              >
                <span>{sub.emoji}</span>
                <span>{sub.name}</span>
                <span
                  className={`text-[10px] px-1 rounded-full font-mono ${
                    isSubSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-surface-200 text-zinc-500'
                  }`}
                >
                  {subCount}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Action Toast Feedback Banner */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg.text}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {actionSuccessMsg.showGroceryLink && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('grocery');
                  onClose?.();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Open Shopping List ➔</span>
              </button>
            )}
            <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
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
          filteredRecipes.map((recipe) => {
            const subMeta = RECIPE_SUB_CATEGORIES.find((s) => s.id === recipe.sub_category);
            const activeStoreLabel = storeOptions.find((s) => s.id === selectedTargetStore)?.label || 'Store';

            return (
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                            {recipe.category.replace('_', ' ')}
                          </span>
                          {subMeta && (
                            <span className="text-[10px] font-medium text-zinc-400 bg-surface-200 px-1.5 py-0.5 rounded-full border border-surface-border">
                              {subMeta.emoji} {subMeta.name}
                            </span>
                          )}
                        </div>
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
                    onClick={() => {
                      setSelectedRecipeDetail(recipe);
                      setActiveSwaps({});
                      setOpenSwapIndex(null);
                    }}
                    className="text-base font-bold text-white group-hover:text-brand-300 transition-colors leading-snug line-clamp-1 cursor-pointer"
                    title="Click to view recipe details and customize ingredient swaps"
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
                        {recipe.ingredients.length} items (Swappable)
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
                          onClick={() => {
                            setSelectedRecipeDetail(recipe);
                            setActiveSwaps({});
                            setOpenSwapIndex(null);
                          }}
                          className="text-[11px] text-brand-400 hover:underline cursor-pointer pt-0.5 text-center font-medium"
                        >
                          + {recipe.ingredients.length - 3} more items • Click to Customize Swaps
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
                    onClick={() => {
                      setSelectedRecipeDetail(recipe);
                      setActiveSwaps({});
                      setOpenSwapIndex(null);
                    }}
                    className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto py-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View & Customize</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Print Recipe Button (Opens Print Preview Studio) */}
                    <button
                      type="button"
                      onClick={() => handleOpenPrintPreview(recipe, 1)}
                      className="px-3 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      title="Print 4x6 Index Card or Standard Letter Sheet"
                    >
                      <Printer className="w-3.5 h-3.5 text-brand-400" />
                      <span>Print Card</span>
                    </button>

                    {/* Add to Shopping List Button (Store Tagged) */}
                    <button
                      type="button"
                      onClick={() => handleSyncGrocery(recipe, !isSimple ? batchMultiplier : 1)}
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-200 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      title={`Add all ingredients to ${activeStoreLabel} list`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>+ {selectedTargetStore !== 'all' ? activeStoreLabel : 'Grocery'}</span>
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
            );
          })
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

  const mainContent = recipeForPrintPreview
    ? renderPrintPreviewStudio(recipeForPrintPreview)
    : selectedRecipeDetail
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
                  {recipeForPrintPreview
                    ? `Print Studio: ${recipeForPrintPreview.title}`
                    : selectedRecipeDetail
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

          <div className="p-5 sm:p-8">{mainContent}</div>
        </div>
      </div>
    );
  }

  return mainContent;
};
