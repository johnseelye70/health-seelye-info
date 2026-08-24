'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { MacroProgressRing } from './MacroProgressRing';
import { FoodItem } from '@/lib/types';
import { calculateSwapEquivalentGrams } from '@/lib/macro-calculator';
import { FoodDatabaseBrowser } from './FoodDatabaseBrowser';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  ArrowRightLeft,
  Filter,
  CheckCircle2,
  Flame,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';

export const MealPlanner: React.FC = () => {
  const {
    profile,
    updateProfile,
    todayMacros,
    todayRemaining,
    mealSplitTargets,
    currentDayFoodLogs,
    foods,
    logFood,
    deleteFoodLog,
    addCustomFood,
    experienceMode,
  } = useHealth();

  const isSimple = experienceMode === 'simple';
  const isImperial = profile.unit_preference === 'imperial';

  // 1-Click Wholesome Meal Presets for Simple Mode
  const WHOLESOME_PRESETS = [
    {
      id: 'oats_berries',
      name: '🥣 Oatmeal & Fresh Blueberries Bowl',
      desc: 'Rolled oats cooked with pure water, wild blueberries, and a spoon of raw almond butter',
      cals: 360,
      mealIndex: 1,
      foodName: 'Rolled Oats with Blueberries & Almond Butter',
      grams: 160,
    },
    {
      id: 'chicken_rice_bowl',
      name: '🥗 Grilled Chicken & Jasmine Rice Power Bowl',
      desc: 'Tender chicken breast, steamed jasmine rice, and steamed broccoli florets',
      cals: 520,
      mealIndex: 2,
      foodName: 'Grilled Chicken Breast with Rice & Broccoli',
      grams: 280,
    },
    {
      id: 'yogurt_parfait',
      name: '🍓 Greek Yogurt & Strawberry Parfait',
      desc: 'High-protein nonfat plain Greek yogurt with fresh cut strawberries',
      cals: 190,
      mealIndex: 3,
      foodName: 'Nonfat Greek Yogurt with Strawberries',
      grams: 200,
    },
    {
      id: 'salmon_sweet_potato',
      name: '🐟 Wild Salmon with Roasted Sweet Potato',
      desc: 'Oven-baked wild salmon fillet, roasted sweet potato cubes, and grilled asparagus',
      cals: 560,
      mealIndex: 3,
      foodName: 'Wild Alaskan Salmon with Sweet Potato & Asparagus',
      grams: 320,
    },
    {
      id: 'turkey_toast',
      name: '🥪 Lean Turkey & Avocado Sourdough',
      desc: 'Artisan sourdough slice, lean roasted turkey breast, and mashed fresh avocado',
      cals: 410,
      mealIndex: 2,
      foodName: 'Roasted Turkey Breast & Avocado Sourdough Toast',
      grams: 220,
    },
  ];

  const handleLogWholesomePreset = (preset: typeof WHOLESOME_PRESETS[0]) => {
    logFood({
      user_id: profile.id,
      food: {
        id: `preset-${preset.id}`,
        name: preset.foodName,
        category: 'protein',
        calories_per_100g: Math.round((preset.cals / preset.grams) * 100),
        protein_per_100g: 15,
        carbs_per_100g: 20,
        fat_per_100g: 5,
        is_gluten_free: true,
        is_dairy_free: true,
        serving_size_g: preset.grams,
        default_unit: 'g',
        storage_type: 'fresh_weekly',
      },
      food_name: preset.foodName,
      grams_consumed: preset.grams,
      meal_index: preset.mealIndex,
      logged_at: new Date().toISOString().split('T')[0],
    });
  };

  // Search & Logging Modal State
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedFoodForLog, setSelectedFoodForLog] = useState<FoodItem | null>(null);
  const [gramsToLog, setGramsToLog] = useState<number>(150);

  // Custom Food Form State
  const [showCustomFoodModal, setShowCustomFoodModal] = useState<boolean>(false);
  const [customFoodForm, setCustomFoodForm] = useState({
    name: '',
    category: 'protein' as FoodItem['category'],
    calories_per_100g: 150,
    protein_per_100g: 20,
    carbs_per_100g: 0,
    fat_per_100g: 5,
    is_gluten_free: true,
    is_dairy_free: true,
    serving_size_g: 100,
    default_unit: 'g',
    storage_type: 'fresh_weekly' as FoodItem['storage_type'],
  });

  // Real-time Macro Food Swap State
  const [showSwapModal, setShowSwapModal] = useState<boolean>(false);
  const [swapSourceFood, setSwapSourceFood] = useState<FoodItem>(foods[0]);
  const [swapSourceGrams, setSwapSourceGrams] = useState<number>(180);
  const [swapTargetFood, setSwapTargetFood] = useState<FoodItem>(foods[1] || foods[0]);
  const [swapPriority, setSwapPriority] = useState<'protein' | 'carbs' | 'calories'>('protein');

  // Filtered Food Database items
  const filteredFoods = foods.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    return matchesQuery && matchesCat;
  });

  const handleMealCountChange = (count: number) => {
    updateProfile({ meal_count: count });
  };

  const handleOpenLogModal = (mealIdx: number) => {
    setSelectedMealIndex(mealIdx);
    setSelectedFoodForLog(filteredFoods[0] || null);
    setGramsToLog(filteredFoods[0]?.serving_size_g || 150);
  };

  const handleConfirmLog = () => {
    if (!selectedFoodForLog || selectedMealIndex === null) return;
    logFood({
      user_id: profile.id,
      food: selectedFoodForLog,
      food_name: selectedFoodForLog.name,
      grams_consumed: Number(gramsToLog),
      meal_index: selectedMealIndex,
      logged_at: new Date().toISOString().split('T')[0],
    });
    setSelectedMealIndex(null);
    setSelectedFoodForLog(null);
  };

  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodForm.name) return;
    addCustomFood(customFoodForm);
    setShowCustomFoodModal(false);
    setCustomFoodForm({
      name: '',
      category: 'protein',
      calories_per_100g: 150,
      protein_per_100g: 20,
      carbs_per_100g: 0,
      fat_per_100g: 5,
      is_gluten_free: true,
      is_dairy_free: true,
      serving_size_g: 100,
      default_unit: 'g',
      storage_type: 'fresh_weekly',
    });
  };

  // Compute live equivalent swap grams
  const calculatedSwapGrams = calculateSwapEquivalentGrams(
    swapSourceFood,
    swapSourceGrams,
    swapTargetFood,
    swapPriority
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
                {isSimple ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>WHOLESOME NOURISHMENT</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 text-brand-400" />
                    <span>PRECISION MACRONUTRIENT ENGINE</span>
                  </>
                )}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {isSimple ? 'Daily Wholesome Meals' : 'Daily Meal Plan & Food Database'}
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              {isSimple
                ? 'Enjoy nourishing balanced meals, choose from delicious 1-click wholesome plates, and stay energized all day.'
                : 'Track macro splits, dynamically re-divide targets across 2, 3, or 4 meals, and swap equivalent protein/carb sources in real-time.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isSimple && (
              <button
                onClick={() => setShowSwapModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all hover:border-zinc-700"
              >
                <ArrowRightLeft className="w-4 h-4 text-accent-cyan" />
                <span>Real-Time Food Swap</span>
              </button>
            )}
            {!isSimple && (
              <button
                onClick={() => setShowCustomFoodModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Custom Food</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Target Progress: Simple vs Athlete Layout */}
      {isSimple ? (
        /* SIMPLE MODE: Calorie Balance Bar + 1-Click Wholesome Meal Presets */
        <div className="space-y-6">
          {/* Calorie Balance Card */}
          <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Today's Calorie Balance</div>
              <div className="text-3xl font-black font-mono text-brand-400">
                {todayRemaining.calories}{' '}
                <span className="text-sm font-normal text-zinc-400">kcal remaining</span>
              </div>
              <p className="text-xs text-zinc-400">
                You've consumed <strong className="text-zinc-200">{todayMacros.calories} kcal</strong> of your <strong className="text-zinc-200">{profile.daily_calorie_target} kcal</strong> daily target.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>{Math.round((todayMacros.calories / (profile.daily_calorie_target || 2000)) * 100)}% Consumed</span>
                <span className="text-brand-400 font-bold">{todayRemaining.calories} left</span>
              </div>
              <div className="w-full h-3 bg-surface-300 rounded-full overflow-hidden border border-surface-border">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-teal rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((todayMacros.calories / profile.daily_calorie_target) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* 1-Click Wholesome Meal Presets Bar */}
          <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h2 className="text-base font-bold text-zinc-100">1-Click Wholesome Meal Ideas</h2>
            </div>
            <p className="text-xs text-zinc-400">
              Tap any balanced meal to instantly add it to your daily food log with verified natural ingredients.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {WHOLESOME_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-zinc-100 group-hover:text-brand-300 transition-colors">
                      {preset.name}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {preset.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-surface-border/60">
                    <span className="text-xs font-mono font-bold text-brand-400">
                      +{preset.cals} kcal
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLogWholesomePreset(preset)}
                      className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-black shadow-glow transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Log Meal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ATHLETE MODE: 4 FULL MACRO RINGS */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroProgressRing
            label="Calories"
            current={todayMacros.calories}
            target={profile.daily_calorie_target}
            unit="kcal"
            color="#10b981"
          />
          <MacroProgressRing
            label="Protein"
            current={todayMacros.protein}
            target={profile.protein_target_g}
            unit="g"
            color="#14b8a6"
          />
          <MacroProgressRing
            label="Carbohydrates"
            current={todayMacros.carbs}
            target={profile.carb_target_g}
            unit="g"
            color="#06b6d4"
          />
          <MacroProgressRing
            label="Healthy Fats"
            current={todayMacros.fat}
            target={profile.fat_target_g}
            unit="g"
            color="#f59e0b"
          />
        </div>
      )}

      {/* Dynamic Meal Splitter Selector */}
      <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border/80">
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Dynamic Meal Splitter Engine</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Choose your meal cadence. Targets automatically recalculate across your feeding window.
            </p>
          </div>

          {/* Meal Count Switcher Buttons */}
          <div className="flex items-center gap-2 bg-surface-200/90 p-1.5 rounded-2xl border border-surface-border">
            {[2, 3, 4].map((count) => {
              const isSelected = profile.meal_count === count;
              return (
                <button
                  key={count}
                  id={`btn-meal-count-${count}`}
                  onClick={() => handleMealCountChange(count)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-500 to-accent-teal text-zinc-950 shadow-glow font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {count} Meals / Day
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Meal Allocation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {mealSplitTargets.map((target) => {
            const logs = currentDayFoodLogs.filter((log) => log.meal_index === target.mealIndex);
            const totalCals = logs.reduce((sum, item) => sum + item.calories, 0);
            const totalProtein = logs.reduce((sum, item) => sum + item.protein_g, 0);
            const totalCarbs = logs.reduce((sum, item) => sum + item.carbs_g, 0);
            const totalFat = logs.reduce((sum, item) => sum + item.fat_g, 0);

            return (
              <div
                key={target.mealIndex}
                className="rounded-2xl bg-surface-200/70 border border-surface-border p-4 flex flex-col justify-between hover:border-zinc-700 transition-all"
              >
                <div>
                  {/* Meal Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-mono font-bold text-xs">
                        {target.mealIndex}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-zinc-100">{target.title}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Suggested: ~{target.suggestedTime}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-300 text-zinc-400 font-mono">
                      {target.percentOfTotal}% Split
                    </span>
                  </div>

                  {/* Target Macros Pill */}
                  <div className="p-2.5 rounded-xl bg-surface-300/60 border border-surface-border/60 text-[11px] font-mono text-zinc-300 flex justify-between items-center mb-3">
                    <span>Target: <strong>{target.calories} kcal</strong></span>
                    <span className="text-zinc-400">
                      {target.protein_g}P / {target.carbs_g}C / {target.fat_g}F
                    </span>
                  </div>

                  {/* Logged Items List */}
                  <div className="space-y-2 min-h-[70px]">
                    {logs.length === 0 ? (
                      <div className="text-[11px] text-zinc-500 italic text-center py-4">
                        No food logged yet
                      </div>
                    ) : (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-surface-100/80 border border-surface-border text-xs"
                        >
                          <div className="truncate mr-2">
                            <div className="font-semibold text-zinc-200 truncate">{log.food_name}</div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              {log.grams_consumed}g • {log.calories} kcal ({log.protein_g}g P)
                            </div>
                          </div>
                          <button
                            onClick={() => deleteFoodLog(log.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Card Footer: Summary & Log Button */}
                <div className="pt-3 border-t border-surface-border/80 mt-3 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-400">
                    Logged: <strong className="text-zinc-100">{totalCals}</strong> / {target.calories} kcal
                  </div>
                  <button
                    onClick={() => handleOpenLogModal(target.mealIndex)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-xs font-semibold text-brand-400 transition-all hover:border-brand-500/40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Item</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Layered & Searchable Complete Food Database Section */}
      <FoodDatabaseBrowser
        onLogToMeal={(item, mealIdx) => {
          setSelectedFoodForLog(item);
          setGramsToLog(item.serving_size_g);
          setSelectedMealIndex(mealIdx || 1);
        }}
      />

      {/* Modal: Quick Food Logger */}
      {selectedMealIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Log Food to Meal {selectedMealIndex}</h3>
                <p className="text-xs text-zinc-400">Select portion grams to add to your daily macros</p>
              </div>
              <button
                onClick={() => setSelectedMealIndex(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Food Selector Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Food Item</label>
              <select
                value={selectedFoodForLog?.id || ''}
                onChange={(e) => {
                  const found = foods.find((f) => f.id === e.target.value);
                  if (found) {
                    setSelectedFoodForLog(found);
                    setGramsToLog(found.serving_size_g);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-sm text-zinc-100 focus:outline-none focus:border-brand-500"
              >
                {foods.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name} ({food.calories_per_100g} kcal / 100g)
                  </option>
                ))}
              </select>
            </div>

            {/* Grams Input & Quick Presets with NumberStepper */}
            <div className="space-y-2">
              <NumberStepper
                label={`Portion Size (${gramsToLog}g ${isImperial ? `~${(gramsToLog * 0.03527).toFixed(1)} oz` : ''})`}
                value={gramsToLog}
                onChange={(val) => setGramsToLog(val)}
                min={10}
                max={1000}
                step={25}
                unit="g"
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: 'Snack (75g)', grams: 75 },
                  { label: 'Standard (150g)', grams: 150 },
                  { label: 'Generous (225g)', grams: 225 },
                  { label: 'Feast (300g)', grams: 300 },
                ].map((preset) => (
                  <button
                    key={preset.grams}
                    type="button"
                    onClick={() => setGramsToLog(preset.grams)}
                    className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-medium transition-all ${
                      gramsToLog === preset.grams
                        ? 'bg-brand-500 text-zinc-950 font-bold border-brand-400 shadow-glow'
                        : 'bg-surface-300 border-surface-border text-zinc-300 hover:bg-surface-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Preview: Simple Mode (Calorie focus) vs Athlete Mode (Full Macros) */}
            {selectedFoodForLog && (
              isSimple ? (
                <div className="p-4 rounded-2xl bg-surface-200 border border-surface-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-zinc-200">{selectedFoodForLog.name}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Portion: {gramsToLog}g {isImperial ? `(~${(gramsToLog * 0.03527).toFixed(1)} oz)` : ''}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-lg font-black text-brand-400">
                      +{Math.round((selectedFoodForLog.calories_per_100g * gramsToLog) / 100)} kcal
                    </div>
                    <div className="text-[10px] text-emerald-400 font-sans font-semibold">Wholesome Fuel ✨</div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-surface-200 border border-surface-border">
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 font-semibold">
                    Macros for {gramsToLog}g Portion
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2 rounded-xl bg-surface-300">
                      <div className="text-[10px] text-zinc-400">Calories</div>
                      <div className="text-sm font-bold text-zinc-100">
                        {Math.round((selectedFoodForLog.calories_per_100g * gramsToLog) / 100)}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-300">
                      <div className="text-[10px] text-zinc-400">Protein</div>
                      <div className="text-sm font-bold text-brand-400">
                        {((selectedFoodForLog.protein_per_100g * gramsToLog) / 100).toFixed(1)}g
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-300">
                      <div className="text-[10px] text-zinc-400">Carbs</div>
                      <div className="text-sm font-bold text-accent-cyan">
                        {((selectedFoodForLog.carbs_per_100g * gramsToLog) / 100).toFixed(1)}g
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-300">
                      <div className="text-[10px] text-zinc-400">Fats</div>
                      <div className="text-sm font-bold text-amber-400">
                        {((selectedFoodForLog.fat_per_100g * gramsToLog) / 100).toFixed(1)}g
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedMealIndex(null)}
                className="flex-1 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLog}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 font-bold text-xs shadow-glow"
              >
                Confirm Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Real-time Macro Food Swap Tool */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-accent-cyan" />
                  <span>Real-Time Macro Food Swap Matrix</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Swap protein or carb staples while keeping exact calculated macro parity.
                </p>
              </div>
              <button onClick={() => setShowSwapModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Priority Toggle */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs">
              <span className="text-zinc-400 font-semibold px-2">Match Macro By:</span>
              {(['protein', 'carbs', 'calories'] as const).map((pri) => (
                <button
                  key={pri}
                  onClick={() => setSwapPriority(pri)}
                  className={`flex-1 py-1.5 rounded-lg font-bold capitalize transition-all ${
                    swapPriority === pri
                      ? 'bg-brand-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>

            {/* Source & Target Food Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Food */}
              <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border space-y-3">
                <span className="text-[11px] uppercase font-bold text-zinc-400">Current Food In Plan</span>
                <select
                  value={swapSourceFood.id}
                  onChange={(e) => {
                    const found = foods.find((f) => f.id === e.target.value);
                    if (found) setSwapSourceFood(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-xs text-zinc-100"
                >
                  {foods.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name}
                    </option>
                  ))}
                </select>

                <div>
                  <NumberStepper
                    label="Current Grams"
                    value={swapSourceGrams}
                    onChange={(val) => setSwapSourceGrams(val)}
                    min={10}
                    max={1000}
                    step={10}
                    unit="g"
                    size="sm"
                  />
                </div>

                <div className="text-[11px] text-zinc-400 font-mono">
                  Delivers: <strong className="text-brand-400">{((swapSourceFood.protein_per_100g * swapSourceGrams) / 100).toFixed(1)}g Protein</strong> / {Math.round((swapSourceFood.calories_per_100g * swapSourceGrams) / 100)} kcal
                </div>
              </div>

              {/* Target Swap Food */}
              <div className="p-4 rounded-2xl bg-surface-200/80 border border-brand-500/40 space-y-3">
                <span className="text-[11px] uppercase font-bold text-brand-400">Swap Equivalent</span>
                <select
                  value={swapTargetFood.id}
                  onChange={(e) => {
                    const found = foods.find((f) => f.id === e.target.value);
                    if (found) setSwapTargetFood(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-xs text-zinc-100"
                >
                  {foods.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name}
                    </option>
                  ))}
                </select>

                <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-center">
                  <div className="text-[11px] text-zinc-300">Required Portion Grams:</div>
                  <div className="text-2xl font-black font-mono text-brand-400 mt-0.5">
                    {calculatedSwapGrams} grams
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1">
                    Delivers: {((swapTargetFood.protein_per_100g * calculatedSwapGrams) / 100).toFixed(1)}g P / {Math.round((swapTargetFood.calories_per_100g * calculatedSwapGrams) / 100)} kcal
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSwapModal(false)}
              className="w-full py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200"
            >
              Close Swap Engine
            </button>
          </div>
        </div>
      )}

      {/* Modal: Custom Food Creator */}
      {showCustomFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleCreateCustomFood} className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create Custom Food Item</h3>
              <button type="button" onClick={() => setShowCustomFoodModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-300">Food Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Hemp Seeds"
                  value={customFoodForm.name}
                  onChange={(e) => setCustomFoodForm({ ...customFoodForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300">Category</label>
                  <select
                    value={customFoodForm.category}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  >
                    <option value="protein">Protein</option>
                    <option value="carbohydrate">Carbohydrate</option>
                    <option value="healthy_fat">Healthy Fat</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="fruit">Fruit</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-300">Storage Group</label>
                  <select
                    value={customFoodForm.storage_type}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, storage_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  >
                    <option value="fresh_weekly">Fresh Weekly</option>
                    <option value="pantry_monthly">Pantry Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                <div>
                  <NumberStepper
                    label="Calories"
                    value={customFoodForm.calories_per_100g}
                    onChange={(val) => setCustomFoodForm({ ...customFoodForm, calories_per_100g: val })}
                    min={0}
                    max={1000}
                    step={10}
                    unit="kcal"
                    size="sm"
                  />
                </div>
                <div>
                  <NumberStepper
                    label="Protein"
                    value={customFoodForm.protein_per_100g}
                    onChange={(val) => setCustomFoodForm({ ...customFoodForm, protein_per_100g: val })}
                    min={0}
                    max={100}
                    step={1}
                    unit="g"
                    size="sm"
                  />
                </div>
                <div>
                  <NumberStepper
                    label="Carbs"
                    value={customFoodForm.carbs_per_100g}
                    onChange={(val) => setCustomFoodForm({ ...customFoodForm, carbs_per_100g: val })}
                    min={0}
                    max={100}
                    step={1}
                    unit="g"
                    size="sm"
                  />
                </div>
                <div>
                  <NumberStepper
                    label="Fat"
                    value={customFoodForm.fat_per_100g}
                    onChange={(val) => setCustomFoodForm({ ...customFoodForm, fat_per_100g: val })}
                    min={0}
                    max={100}
                    step={1}
                    unit="g"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowCustomFoodModal(false)}
                className="flex-1 py-2 rounded-xl bg-surface-200 text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold text-xs shadow-glow"
              >
                Save Food
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
