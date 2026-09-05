'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { APP_VERSION_SHORT } from '@/lib/version';
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
  Droplets,
  Heart,
  Smile,
  Sun,
  ChefHat,
  BookOpen,
  Calendar,
  RotateCcw,
  RefreshCw,
  Cloud,
} from 'lucide-react';
import { FASTING_CONFIGS } from '@/lib/macro-calculator';
import { HydrationTracker } from '@/components/dashboard/HydrationTracker';
import { StepTracker } from '@/components/dashboard/StepTracker';
import { RecipeEngine } from '@/components/nutrition/RecipeEngine';
import { SimpleMovementPickerModal } from '@/components/workouts/SimpleMovementPickerModal';
import { NumberStepper } from '@/components/ui/NumberStepper';

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
    experienceMode,
    waterGoalOz,
    todayWaterOz,
    logWaterOz,
    resetTodayWater,
    setTodayWaterOzDirectly,
    stepGoal,
    todaySteps,
    todayStepMiles,
    todayStepCalories,
    simpleMovementActivities,
    toggleSimpleMovementCompleted,
    addSimpleMovementActivity,
    swapSimpleMovementActivity,
    syncWithCloud,
    syncStatus,
    authUser,
    setShowAuthModal,
  } = useHealth();

  const isStandard = experienceMode === 'standard' || experienceMode === 'tutorial';
  const [showDashboardRecipeModal, setShowDashboardRecipeModal] = useState<boolean>(false);
  const [showDashboardMovementModal, setShowDashboardMovementModal] = useState<boolean>(false);
  const [standardWaterCustomOz, setStandardWaterCustomOz] = useState<number>(8);

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

  const firstName = profile.full_name.split(' ')[0] || 'Friend';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-100 via-surface-100 to-surface-50 border border-surface-border p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>DAILY HEALTH & FITNESS COMPANION</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-surface-200 border border-surface-border text-brand-400">
                {APP_VERSION_SHORT}
              </span>
              <span className="text-zinc-500 text-xs hidden sm:inline">•</span>
              <span className="text-zinc-400 text-xs font-mono">
                {profile.goal === 'cut_500' ? 'Healthy Fat Loss Goal' : profile.goal.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Good day, {firstName}! ✨
            </h1>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 max-w-xl">
              You have <strong className="text-brand-500 dark:text-brand-400 font-bold">{todayRemaining.calories} calories</strong> remaining today across <strong className="text-foreground">{profile.meal_count} wholesome meals</strong>. Take your time, log as you go, and stay hydrated!
            </p>

            {/* Account Sync Status Diagnostic Badge */}
            {authUser ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-emerald-400 shrink-0 ${syncStatus === 'syncing' ? 'animate-ping' : ''}`} />
                  <span>
                    Synced as <strong className="font-mono text-white">{authUser.email}</strong> • Cross-device sync active
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-overview-sync-now"
                  onClick={() => syncWithCloud()}
                  disabled={syncStatus === 'syncing'}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  title="Sync immediately across laptop & iPhone"
                >
                  <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                  <span>
                    <strong>Guest Mode (Local Only):</strong> Sign in to sync your food diary & water between laptop and iPhone.
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-overview-signin-sync"
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Sign In to Sync
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200/90 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-brand-400" />
              <span>Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('fasting')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200/90 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
            >
              <Timer className="w-4 h-4 text-brand-400" />
              <span>{fastingStatus.isFasting ? 'Fasting Time' : 'Eating Window Active'}</span>
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Dumbbell className="w-4 h-4" />
              <span>{isStandard ? "Today's Routine" : "Start Today's Workout"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Step-by-Step Flow (MyFitnessPal / StrongLifts Walkthrough Experience) */}
      {(() => {
        const step1Done = todayWaterOz >= 16 || !fastingStatus.isFasting;
        const step2Done = currentDayFoodLogs.length >= 1;
        const step3Done = completedExercisesCount >= 1 || todaySteps >= 3000;
        const step4Done = step1Done && step2Done && step3Done;
        const completedCount = [step1Done, step2Done, step3Done, step4Done].filter(Boolean).length;

        return (
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-5 md:p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Today's Simple Step-by-Step Flow
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Follow these 4 simple steps to stay consistent, reach your daily targets, and build lifelong healthy habits.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full w-fit">
                <span>{completedCount} of 4 Completed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div
                onClick={() => setActiveTab('fasting')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  step1Done
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-surface-200/50 border-surface-border hover:border-brand-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-surface-300 text-zinc-300">
                    STEP 1
                  </span>
                  {step1Done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <div className="font-bold text-foreground text-sm">Morning Check-In</div>
                <div className="text-xs text-zinc-400 mt-1">
                  Check fasting window & drink your first glass of water.
                </div>
              </div>

              {/* Step 2 */}
              <div
                onClick={() => setActiveTab('nutrition')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  step2Done
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-surface-200/50 border-surface-border hover:border-brand-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-surface-300 text-zinc-300">
                    STEP 2
                  </span>
                  {step2Done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <div className="font-bold text-foreground text-sm">Log Your Meals</div>
                <div className="text-xs text-zinc-400 mt-1">
                  {currentDayFoodLogs.length > 0
                    ? `${currentDayFoodLogs.length} meals logged (${todayMacros.calories} kcal)`
                    : 'Track breakfast, lunch, or dinner in your diary.'}
                </div>
              </div>

              {/* Step 3 */}
              <div
                onClick={() => setActiveTab('workouts')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  step3Done
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-surface-200/50 border-surface-border hover:border-brand-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-surface-300 text-zinc-300">
                    STEP 3
                  </span>
                  {step3Done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <div className="font-bold text-foreground text-sm">Daily Movement</div>
                <div className="text-xs text-zinc-400 mt-1">
                  {completedExercisesCount > 0
                    ? `${completedExercisesCount} exercises finished`
                    : todaySteps > 0
                    ? `${todaySteps.toLocaleString()} steps tracked`
                    : 'Record your workout or track daily steps.'}
                </div>
              </div>

              {/* Step 4 */}
              <div
                onClick={() => setActiveTab('trends')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  step4Done
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-surface-200/50 border-surface-border hover:border-brand-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-surface-300 text-zinc-300">
                    STEP 4
                  </span>
                  {step4Done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <div className="font-bold text-foreground text-sm">Review Your Day</div>
                <div className="text-xs text-zinc-400 mt-1">
                  View daily, weekly & monthly reports and celebrate progress.
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Dashboard Body: Standard vs Advanced Mode */}
      {isStandard ? (
        /* ================= STANDARD DAILY WELLNESS COMPANION ================= */
        <div className="space-y-6">
          {/* Today's 3 Big Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Calorie Balance Card (Warm Saffron / Nutrition) */}
            <div
              onClick={() => setActiveTab('nutrition')}
              className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col justify-between space-y-4 cursor-pointer hover:border-accent-amber/50 hover:bg-surface-50 transition-all group"
              title="Open Food Diary"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-zinc-400 group-hover:text-accent-amber uppercase tracking-wider transition-colors flex items-center gap-1.5">
                  <span>Calorie Balance</span>
                  <span className="text-[10px] text-accent-amber font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity">→ View Food Diary</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Flame className="w-5 h-5 text-accent-amber fill-accent-amber/20" />
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-accent-amber">
                  {todayRemaining.calories} <span className="text-sm font-medium text-zinc-400">kcal left</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  {todayMacros.calories} of {profile.daily_calorie_target} kcal consumed today
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-surface-300 rounded-full overflow-hidden border border-surface-border">
                  <div
                    className="h-full bg-gradient-to-r from-accent-amber to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((todayMacros.calories / (profile.daily_calorie_target || 2000)) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>{Math.round((todayMacros.calories / (profile.daily_calorie_target || 2000)) * 100)}% used</span>
                  <span className="text-accent-amber font-bold">{todayRemaining.calories} remaining</span>
                </div>
              </div>
            </div>

            {/* 2. Hydration Cups Card (Bio-Aqua Cyan) */}
            <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Water & Hydration</div>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-standard-reset-water-header"
                    type="button"
                    onClick={async () => {
                      resetTodayWater();
                      await syncWithCloud();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-sm"
                    title="Reset today's water to 0 oz"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-accent-cyan fill-accent-cyan/20" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-accent-cyan">
                    {todayWaterOz} <span className="text-sm font-medium text-zinc-400">/ {waterGoalOz} oz</span>
                  </div>
                  {todayWaterOz > 0 && (
                    <button
                      type="button"
                      id="btn-standard-zero-water"
                      onClick={async () => {
                        resetTodayWater();
                        await syncWithCloud();
                      }}
                      className="text-[11px] font-mono text-rose-400 hover:text-rose-300 underline underline-offset-2 cursor-pointer"
                      title="Reset today's water to 0 oz"
                    >
                      (Reset to 0)
                    </button>
                  )}
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  ~{Math.round(todayWaterOz / 8)} of {Math.round((waterGoalOz || 96) / 8)} cups enjoyed today
                </div>
              </div>

              {/* 1-Tap Quick Hydrate Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  id="standard-log-cup-btn"
                  onClick={() => logWaterOz(8, 'Glass')}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+8 oz Cup</span>
                </button>
                <button
                  type="button"
                  id="standard-log-bottle-btn"
                  onClick={() => logWaterOz(16, 'Bottle')}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+16 oz Bottle</span>
                </button>
              </div>

              {/* Custom Stepper Increment */}
              <div className="pt-2 border-t border-surface-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-semibold">Custom:</span>
                  <div className="w-32">
                    <NumberStepper
                      id="standard-water-custom-stepper"
                      value={standardWaterCustomOz}
                      onChange={(val) => setStandardWaterCustomOz(Math.max(1, val))}
                      step={1}
                      min={1}
                      max={128}
                      unit="oz"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  id="standard-log-custom-water-btn"
                  onClick={() => logWaterOz(standardWaterCustomOz, 'Custom')}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-black shadow-glow transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Log {standardWaterCustomOz} oz</span>
                </button>
              </div>
            </div>

            {/* 3. Daily Movement / Steps Card (Flame Coral) */}
            <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Daily Movement</div>
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-accent-coral" />
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-accent-coral">
                  {todaySteps.toLocaleString()} <span className="text-sm font-medium text-zinc-400">steps</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  {todayStepMiles} miles • {todayStepCalories} active kcal burned
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-surface-300 rounded-full overflow-hidden border border-surface-border">
                  <div
                    className="h-full bg-gradient-to-r from-accent-coral to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((todaySteps / (stepGoal || 10000)) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>{Math.min(100, Math.round((todaySteps / (stepGoal || 10000)) * 100))}% of {stepGoal.toLocaleString()} goal</span>
                  <span className="text-accent-coral font-bold">{Math.max(0, stepGoal - todaySteps).toLocaleString()} left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Middle Area: 1-Tap Meals & Today's Movement */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: 1-Tap Wholesome Meals */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-100">1-Tap Wholesome Meals</h2>
                      <p className="text-xs text-zinc-400">Tap to instantly record a wholesome balanced plate</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDashboardRecipeModal(true)}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Browse All Recipes</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    { id: 'p1', name: '🥣 Oatmeal & Fresh Berries', cals: 350, desc: 'Rolled oats, blueberries & almond butter' },
                    { id: 'p2', name: '🥗 Grilled Chicken Power Bowl', cals: 520, desc: 'Tender chicken, jasmine rice & broccoli' },
                    { id: 'p3', name: '🐟 Salmon & Sweet Potato', cals: 580, desc: 'Wild salmon, roasted sweet potato & asparagus' },
                    { id: 'p4', name: '🍓 Greek Yogurt & Berries', cals: 200, desc: 'Non-fat Greek yogurt with fresh strawberries' },
                  ].map((meal) => (
                    <div
                      key={meal.id}
                      className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between gap-3 hover:border-brand-500/40 transition-all"
                    >
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-zinc-100 truncate">{meal.name}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{meal.desc}</div>
                        <div className="text-[11px] font-mono font-bold text-brand-400 mt-1">+{meal.cals} kcal</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('nutrition')}
                        className="px-3 py-1.5 rounded-xl bg-brand-500/15 hover:bg-brand-500 text-brand-300 hover:text-zinc-950 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95"
                      >
                        + Log
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eating Schedule Card */}
              <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">
                      {fastingStatus.isFasting ? 'Rest & Digest Hours 🌙' : 'Daytime Eating Hours ☀️'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {fastingStatus.isFasting
                        ? 'Drink water, herbal tea, or black coffee to stay refreshed.'
                        : 'Fuel your body with wholesome meals and healthy hydration.'}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono self-end sm:self-center">
                  <div className="text-lg font-black text-brand-300">
                    {remainingHours}h {remainingMins}m
                  </div>
                  <div className="text-[10px] text-zinc-400 uppercase">
                    {fastingStatus.isFasting ? 'Until Breakfast' : 'Remaining Today'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Column: Today's Gentle Movement & Habit Check */}
            <div className="space-y-6">
              {/* Today's Chosen Movement Card (Simple Mode) */}
              <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-accent-coral shadow-glow-coral">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">Today's Movement</h2>
                      <p className="text-xs text-zinc-400">Your chosen feel-good activities</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDashboardMovementModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-accent-coral/15 hover:bg-accent-coral/25 border border-accent-coral/30 text-accent-coral text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Choices</span>
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {simpleMovementActivities.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-surface-200/50 border border-dashed border-surface-border text-center space-y-1.5 py-6">
                      <p className="text-xs text-zinc-400 font-medium">No movements chosen for today yet.</p>
                      <button
                        type="button"
                        onClick={() => setShowDashboardMovementModal(true)}
                        className="text-xs text-accent-coral font-bold hover:underline cursor-pointer"
                      >
                        + Choose today&apos;s movement
                      </button>
                    </div>
                  ) : (
                    simpleMovementActivities.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => toggleSimpleMovementCompleted(m.id)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          m.completed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-zinc-300'
                            : 'bg-surface-200/60 border-surface-border hover:border-accent-coral/40 text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            className="text-zinc-400 hover:text-foreground shrink-0 cursor-pointer"
                          >
                            {m.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-400 hover:text-accent-coral" />
                            )}
                          </button>
                          <div>
                            <div className={`text-xs font-bold ${m.completed ? 'line-through text-zinc-400' : 'text-foreground'}`}>
                              {m.icon} {m.title}
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">
                              {m.duration_minutes}m • ~{m.estimated_calories} kcal
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-accent-coral shrink-0">
                          {m.completed ? 'Done ✓' : 'Tap to Complete'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('workouts')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-accent-coral to-rose-500 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-black shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Heart className="w-4 h-4" />
                  <span>Open Movement Studio & Choices</span>
                </button>
              </div>

              {/* Simple Movement Picker Modal Dialog from Today Overview */}
              <SimpleMovementPickerModal
                isOpen={showDashboardMovementModal}
                onClose={() => setShowDashboardMovementModal(false)}
                onSelectActivity={(act) => addSimpleMovementActivity(act)}
                selectedActivityIds={simpleMovementActivities.map((a) => a.id)}
              />

              {/* Friendly Daily Tip */}
              <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-400">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span>Healthy Living Note</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "Small daily habits create long-term health. Enjoy delicious wholesome food, take a refreshing walk, and get a good night's sleep."
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ATHLETE METRIC ENGINE ================= */
        <div className="space-y-6">
          {/* 4 Precision Macro Rings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MacroProgressRing
              label="Calories"
              current={todayMacros.calories}
              target={profile.daily_calorie_target}
              unit="kcal"
              color="#f59e0b"
              sublabel={`${todayRemaining.calories} kcal remaining`}
              onClick={() => setActiveTab('nutrition')}
            />
            <MacroProgressRing
              label="Protein"
              current={todayMacros.protein}
              target={profile.protein_target_g}
              unit="g"
              color="#3b82f6"
              sublabel={`${todayRemaining.protein}g left (1.0g/lb lean)`}
              onClick={() => setActiveTab('nutrition')}
            />
            <MacroProgressRing
              label="Carbohydrates"
              current={todayMacros.carbs}
              target={profile.carb_target_g}
              unit="g"
              color="#10b981"
              sublabel={`${todayRemaining.carbs}g left (Complex Fuel)`}
              onClick={() => setActiveTab('nutrition')}
            />
            <MacroProgressRing
              label="Healthy Fats"
              current={todayMacros.fat}
              target={profile.fat_target_g}
              unit="g"
              color="#8b5cf6"
              sublabel={`${todayRemaining.fat}g left (25% Total)`}
              onClick={() => setActiveTab('nutrition')}
            />
          </div>

          {/* Hydration Engine & Step Tracker Suite */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HydrationTracker />
            <StepTracker />
          </div>

          {/* Main Two-Column Dashboard Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Fasting Status & Today's Meals */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fasting & Eating Window Card */}
              <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Timer className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-100">Fasting & Eating Window</h2>
                      <p className="text-xs text-zinc-400">
                        {currentFastingConfig.name} ({profile.eating_window_duration_hours}h Feeding Window)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('fasting')}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Adjust</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 rounded-full ${fastingStatus.isFasting ? 'bg-purple-500 animate-pulse' : 'bg-brand-500 animate-pulse'}`} />
                    <div>
                      <div className="text-xs font-bold text-zinc-100">
                        {fastingStatus.isFasting ? 'Currently in Fasting State' : 'Currently in Eating Window'}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {fastingStatus.isFasting ? 'Cells are burning stored fatty acids.' : 'Digestive enzymes active for nutrient partitioning.'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono self-end sm:self-center">
                    <div className="text-lg font-black text-brand-300">
                      {remainingHours}h {remainingMins}m
                    </div>
                    <div className="text-[10px] text-zinc-400 uppercase">
                      {fastingStatus.isFasting ? 'Until Eating Window' : 'Until Fasting Starts'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Meals Timeline */}
              <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-100">Today's Nutrition Breakdown</h2>
                      <p className="text-xs text-zinc-400">
                        {profile.meal_count} meals planned • {todayRemaining.calories} kcal remaining
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-xs font-semibold text-brand-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Meal</span>
                  </button>
                </div>

                {/* Meal Slots List */}
                <div className="space-y-3">
                  {mealSplitTargets.map((target) => {
                    const logsForMeal = currentDayFoodLogs.filter((l) => l.meal_index === target.mealIndex);
                    const loggedCalories = logsForMeal.reduce((sum, l) => sum + l.calories, 0);
                    const loggedProtein = logsForMeal.reduce((sum, l) => sum + l.protein_g, 0);

                    return (
                      <div
                        key={target.mealIndex}
                        className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold font-mono text-xs ${
                                logsForMeal.length > 0
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
                                Target: <span className="text-zinc-200 font-medium">{target.calories} kcal</span>
                                {` (${target.protein_g}g P / ${target.carbs_g}g C / ${target.fat_g}g F)`}
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

            {/* Right Column: Today's Routine & Helpful Telemetry */}
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
                      <p className="text-xs text-zinc-400">
                        Week {activeWeek}, Day {activeDay} Training Split
                      </p>
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
                      <div className="flex items-center gap-2.5">
                        {slot.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-500 shrink-0" />
                        )}
                        <span className={`text-xs font-medium ${slot.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                          {slot.exercise.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {slot.target_sets} sets
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('workouts')}
                  className="w-full mt-4 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Open Workout Player</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Athlete Telemetry Note */}
              <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-400">
                  <Zap className="w-4 h-4 text-brand-400" />
                  <span>Performance Optimization</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "Maintain clean progressive overload and prioritize 1.0g protein per lb of lean mass to maximize MPS."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Studio Modal Launcher from Today Dashboard */}
      <RecipeEngine
        isModal={true}
        isOpen={showDashboardRecipeModal}
        onClose={() => setShowDashboardRecipeModal(false)}
      />
    </div>
  );
};
