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
} from 'lucide-react';

interface WholesomeMealsSectionProps {
  onBrowseRecipes?: () => void;
  title?: string;
  subtitle?: string;
}

export const WholesomeMealsSection: React.FC<WholesomeMealsSectionProps> = ({
  onBrowseRecipes,
  title = '1-Tap Wholesome Meals',
  subtitle = 'Rotates daily • Tap to instantly record a balanced plate',
}) => {
  const {
    profile,
    todayRemaining,
    fastingStatus,
    logFood,
    selectedDate,
    todayDate,
    setActiveTab,
  } = useHealth();

  const [shuffleOffset, setShuffleOffset] = useState<number>(0);
  const [showSuggestion, setShowSuggestion] = useState<boolean>(true);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const [recentlyLoggedId, setRecentlyLoggedId] = useState<string | null>(null);
  const [recentlyLoggedName, setRecentlyLoggedName] = useState<string | null>(null);

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

  // 1-Tap Log Handler
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
    }, 3000);
  };

  const handleShuffle = () => {
    setShuffleOffset((prev) => prev + 1);
  };

  const handleCycleSuggestion = () => {
    setSuggestionIndex((prev) => prev + 1);
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
              {shuffleOffset > 0 && (
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
            <span>{showSuggestion ? 'Hide Suggestion' : 'Chef Suggestion'}</span>
          </button>

          {onBrowseRecipes && (
            <button
              type="button"
              id="wholesome-browse-recipes-btn"
              onClick={onBrowseRecipes}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>All Recipes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Inline Feedback Toast Banner */}
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

            {/* Macros & 1-Tap Log Button */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-surface-border/40">
              <div className="text-right">
                <div className="text-sm font-black font-mono text-brand-400">
                  +{smartSuggestion.meal.cals} kcal
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  {smartSuggestion.meal.protein_g}g P • {smartSuggestion.meal.carbs_g}g C • {smartSuggestion.meal.fat_g}g F
                </div>
              </div>

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
      )}

      {/* 4 Daily Wholesome Meals Grid (Breakfast, Lunch, Dinner, Snack) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Today's Daily Balanced Rotation</span>
          <span>4 plates for today</span>
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
                  <div className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-1">
                    {meal.name}
                  </div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2">
                    {meal.desc}
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between gap-2">
                  <div className="text-[10px] font-mono text-zinc-400">
                    {meal.protein_g}g P • {meal.carbs_g}g C • {meal.fat_g}g F
                  </div>

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
            );
          })}
        </div>
      </div>
    </div>
  );
};
