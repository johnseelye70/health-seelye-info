'use client';

import React from 'react';
import { useHealth } from '@/context/HealthContext';
import { MacroProgressRing } from '@/components/nutrition/MacroProgressRing';
import {
  Flame,
  Dumbbell,
  Timer,
  UtensilsCrossed,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { FASTING_CONFIGS } from '@/lib/macro-calculator';

export const DashboardOverview: React.FC = () => {
  const {
    profile,
    todayMacros,
    todayRemaining,
    fastingStatus,
    workoutPlan,
    activeWeek,
    activeDay,
    toggleExerciseCompleted,
    setActiveTab,
    currentDayFoodLogs,
    mealSplitTargets,
  } = useHealth();

  // Find today's workout
  const todayWorkout = workoutPlan.find(
    (w) => w.week_number === activeWeek && w.day_number === activeDay
  ) || workoutPlan[0];

  const completedExercisesCount = todayWorkout?.exercises.filter((e) => e.completed).length || 0;
  const totalExercisesCount = todayWorkout?.exercises.length || 0;
  const workoutProgress = totalExercisesCount > 0 ? Math.round((completedExercisesCount / totalExercisesCount) * 100) : 0;

  const currentFastingConfig = FASTING_CONFIGS[profile.fasting_protocol];

  // Hours and minutes calculation
  const remainingHours = Math.floor(fastingStatus.remainingSeconds / 3600);
  const remainingMins = Math.floor((fastingStatus.remainingSeconds % 3600) / 60);
  const remainingSecs = fastingStatus.remainingSeconds % 60;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-100 via-surface-100 to-surface-50 border border-surface-border p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                ATHLETE METRIC ENGINE
              </span>
              <span className="text-zinc-400 text-xs">•</span>
              <span className="text-zinc-400 text-xs font-mono">
                {profile.goal === 'cut_500' ? '500 kcal Deficit (Fat Oxidation)' : profile.goal.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Welcome back, {profile.full_name}
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              Your Mifflin-St Jeor TDEE target is configured for{' '}
              <strong className="text-zinc-200">{profile.daily_calorie_target} kcal</strong> across{' '}
              <strong className="text-brand-400">{profile.meal_count} scheduled meals</strong> within your{' '}
              <strong className="text-accent-teal">{currentFastingConfig.name}</strong> window.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('fasting')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200/90 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all"
            >
              <Timer className="w-4 h-4 text-brand-400" />
              <span>Fast Status: {fastingStatus.isFasting ? 'Fasting' : 'Eating'}</span>
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Start Today's Workout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Macro Rings Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MacroProgressRing
          label="Calories"
          current={todayMacros.calories}
          target={profile.daily_calorie_target}
          unit="kcal"
          color="#10b981"
          sublabel={`${todayRemaining.calories} kcal remaining`}
        />
        <MacroProgressRing
          label="Protein"
          current={todayMacros.protein}
          target={profile.protein_target_g}
          unit="g"
          color="#14b8a6"
          sublabel={`${todayRemaining.protein}g left (1.0g/lb lean)`}
        />
        <MacroProgressRing
          label="Carbohydrates"
          current={todayMacros.carbs}
          target={profile.carb_target_g}
          unit="g"
          color="#06b6d4"
          sublabel={`${todayRemaining.carbs}g left (Complex Fuel)`}
        />
        <MacroProgressRing
          label="Healthy Fats"
          current={todayMacros.fat}
          target={profile.fat_target_g}
          unit="g"
          color="#f59e0b"
          sublabel={`${todayRemaining.fat}g left (25% Total)`}
        />
      </div>

      {/* Main Two-Column Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Fasting Status & Today's Meals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fasting Tracker Live Widget Card */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100">Fasting & Eating Window</h2>
                  <p className="text-xs text-zinc-400">{currentFastingConfig.name} ({profile.eating_window_duration_hours}h Feeding Window)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('fasting')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>Adjust</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Countdown & Progress bar */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                    {fastingStatus.currentPhaseText}
                  </div>
                  <div className="text-3xl font-black font-mono text-white tracking-tight mt-1 flex items-baseline gap-1">
                    <span>{remainingHours.toString().padStart(2, '0')}</span>
                    <span className="text-zinc-500 text-lg">:</span>
                    <span>{remainingMins.toString().padStart(2, '0')}</span>
                    <span className="text-zinc-500 text-lg">:</span>
                    <span className="text-brand-400 text-xl">{remainingSecs.toString().padStart(2, '0')}</span>
                    <span className="text-xs font-sans text-zinc-400 font-normal ml-2">remaining</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-zinc-300 font-semibold">{fastingStatus.stageName}</div>
                  <div className="text-[11px] text-zinc-400 max-w-xs">{fastingStatus.stageDescription}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1.5 font-mono">
                  <span>Fast Starts: {profile.fasting_start_time}</span>
                  <span>{fastingStatus.progressPercent}% Completed</span>
                  <span>Eating Window: {fastingStatus.eatStartFormatted}</span>
                </div>
                <div className="w-full h-2.5 bg-surface-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      fastingStatus.isFasting
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-400'
                        : 'bg-gradient-to-r from-brand-500 to-accent-teal'
                    }`}
                    style={{ width: `${fastingStatus.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Today's Meals Timeline */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100">Today's Meal Allocation</h2>
                  <p className="text-xs text-zinc-400">Dynamic {profile.meal_count}-Meal Distribution Structure</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('nutrition')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>Log Meal</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {mealSplitTargets.map((target) => {
                const logsForMeal = currentDayFoodLogs.filter((log) => log.meal_index === target.mealIndex);
                const loggedCalories = logsForMeal.reduce((acc, log) => acc + log.calories, 0);
                const loggedProtein = logsForMeal.reduce((acc, log) => acc + log.protein_g, 0);
                const isFulfilled = loggedCalories >= target.calories * 0.85;

                return (
                  <div
                    key={target.mealIndex}
                    className={`p-4 rounded-2xl border transition-all ${
                      isFulfilled
                        ? 'bg-surface-200/90 border-brand-500/30'
                        : 'bg-surface-200/50 border-surface-border hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isFulfilled
                              ? 'bg-brand-500 text-zinc-950'
                              : 'bg-surface-300 text-zinc-400'
                          }`}
                        >
                          {target.mealIndex}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                            <span>{target.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-surface-300 text-zinc-400 font-mono">
                              ~{target.suggestedTime}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            Target: <span className="text-zinc-200 font-medium">{target.calories} kcal</span> ({target.protein_g}g P / {target.carbs_g}g C / {target.fat_g}g F)
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-zinc-100">
                          {loggedCalories} <span className="text-xs font-normal text-zinc-400">kcal logged</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {loggedProtein.toFixed(0)}g protein
                        </div>
                      </div>
                    </div>

                    {/* Logged Items Chips */}
                    {logsForMeal.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-surface-border/60 flex flex-wrap gap-1.5">
                        {logsForMeal.map((log) => (
                          <span
                            key={log.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-300 text-zinc-300 text-xs border border-surface-border"
                          >
                            <span>{log.food_name}</span>
                            <span className="text-zinc-400 font-mono text-[10px]">({log.grams_consumed}g)</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Workout & Equipment Status */}
        <div className="space-y-6">
          {/* Today's Workout Card */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-accent-teal" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100">Today's Workout</h2>
                  <p className="text-xs text-zinc-400">Week {activeWeek}, Day {activeDay} Training Split</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-200/90 border border-surface-border mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-accent-teal">
                    {todayWorkout.split_type.replace('_', ' ').toUpperCase()}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{todayWorkout.day_title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-brand-400">
                    {completedExercisesCount}/{totalExercisesCount}
                  </span>
                  <div className="text-[10px] text-zinc-400">Completed</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-surface-300 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-teal transition-all duration-300"
                  style={{ width: `${workoutProgress}%` }}
                />
              </div>
            </div>

            {/* Exercise Checklist */}
            <div className="space-y-2">
              {todayWorkout.exercises.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => toggleExerciseCompleted(todayWorkout.id, slot.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    slot.completed
                      ? 'bg-brand-500/10 border-brand-500/30 text-zinc-300'
                      : 'bg-surface-200/50 border-surface-border hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {slot.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-500 shrink-0" />
                    )}
                    <div>
                      <div className={`text-xs font-semibold ${slot.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                        {slot.exercise.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {slot.target_sets} sets × {slot.target_reps} • {slot.exercise.equipment_required.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('workouts')}
              className="w-full mt-4 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              <span>Open Interactive Workout Player</span>
              <ArrowRight className="w-4 h-4 text-brand-400" />
            </button>
          </div>

          {/* Equipment Inventory Pill Box */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Active Equipment Matrix</span>
              </div>
              <button
                onClick={() => setActiveTab('workouts')}
                className="text-xs text-brand-400 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.equipment_inventory.map((eq) => (
                <span
                  key={eq}
                  className="px-2.5 py-1 rounded-lg bg-surface-200 border border-surface-border text-[11px] font-medium text-zinc-300 capitalize"
                >
                  ✓ {eq.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
