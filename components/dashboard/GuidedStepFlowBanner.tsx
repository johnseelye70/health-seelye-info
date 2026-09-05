'use client';

import React from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Home,
  Sparkles,
  Timer,
  UtensilsCrossed,
  Dumbbell,
  TrendingUp,
  X,
} from 'lucide-react';

export const GuidedStepFlowBanner: React.FC = () => {
  const {
    activeGuidedStep,
    startGuidedFlow,
    nextGuidedStep,
    prevGuidedStep,
    exitGuidedFlow,
    todayWaterOz,
    fastingStatus,
    currentDayFoodLogs,
    workoutPlan,
    activeWeek,
    activeDay,
    simpleMovementActivities,
    todaySteps,
  } = useHealth();

  if (!activeGuidedStep) return null;

  const todayWorkout = workoutPlan?.find(
    (w) => w.week_number === activeWeek && w.day_number === activeDay
  ) || workoutPlan?.[0];
  const completedWorkoutExercises = todayWorkout?.exercises?.filter((e) => e.completed).length || 0;
  const completedSimpleMovements = simpleMovementActivities?.filter((a) => a.completed).length || 0;

  const step1Done = todayWaterOz >= 16 || !fastingStatus.isFasting;
  const step2Done = currentDayFoodLogs.length >= 1;
  const step3Done = completedWorkoutExercises >= 1 || completedSimpleMovements >= 1 || todaySteps >= 3000;
  const step4Done = step1Done && step2Done && step3Done;

  const stepsMeta = [
    {
      step: 1 as const,
      name: 'Morning Check-In',
      tab: 'fasting',
      icon: Timer,
      done: step1Done,
      summary: 'Fasting timer & morning water check',
      nextLabel: 'Continue to Step 2: Log Meals',
    },
    {
      step: 2 as const,
      name: 'Log Your Meals',
      tab: 'nutrition',
      icon: UtensilsCrossed,
      done: step2Done,
      summary: 'Breakfast, lunch, or dinner in diary',
      nextLabel: 'Continue to Step 3: Movement',
    },
    {
      step: 3 as const,
      name: 'Daily Movement',
      tab: 'workouts',
      icon: Dumbbell,
      done: step3Done,
      summary: 'Workout routine or daily step targets',
      nextLabel: 'Continue to Step 4: Review Day',
    },
    {
      step: 4 as const,
      name: 'Review Your Day',
      tab: 'trends',
      icon: TrendingUp,
      done: step4Done,
      summary: 'Calorie balance, macros & daily progress',
      nextLabel: 'Complete Flow & Go to Dashboard',
    },
  ];

  const currentMeta = stepsMeta[activeGuidedStep - 1];
  const NextIcon = activeGuidedStep === 4 ? Home : ArrowRight;

  return (
    <section
      aria-label="Daily Step-by-Step Flow Navigation"
      className="mb-6 rounded-3xl bg-surface-100/95 border border-brand-500/40 p-4 sm:p-5 shadow-2xl backdrop-blur-xl animate-fadeIn relative overflow-hidden select-none"
    >
      {/* Background Accent Sheen */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row: Step Pill & Exit */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-surface-border/80 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono">
            Guided Daily Flow • Step {activeGuidedStep} of 4
          </span>
          {currentMeta.done && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={exitGuidedFlow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-surface-200 border border-surface-border/50 transition-colors"
          title="Return to Main Dashboard"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
          <X className="w-3.5 h-3.5 sm:hidden" />
        </button>
      </div>

      {/* Main Guidance Row */}
      <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span>Step {activeGuidedStep}: {currentMeta.name}</span>
            {currentMeta.done && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline sm:hidden" />}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">{currentMeta.summary}</p>
        </div>

        {/* Step Progression Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {activeGuidedStep > 1 && (
            <button
              type="button"
              onClick={prevGuidedStep}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-surface-200 border border-surface-border text-xs font-semibold text-zinc-300 hover:bg-surface-300 hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Step {activeGuidedStep - 1}</span>
              <span className="sm:hidden">Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={nextGuidedStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
              activeGuidedStep === 4
                ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/30'
                : 'bg-brand-500 hover:bg-brand-400 text-zinc-950 shadow-brand-500/30'
            }`}
          >
            <span>{currentMeta.nextLabel}</span>
            <NextIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Step Interactive Progress Pills */}
      <div className="grid grid-cols-4 gap-1.5 pt-2.5 border-t border-surface-border/50 relative z-10">
        {stepsMeta.map((s) => {
          const isActive = activeGuidedStep === s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => startGuidedFlow(s.step)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-500 text-zinc-950 ring-2 ring-brand-400/50 shadow-sm'
                  : s.done
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-surface-200/60 text-zinc-400 hover:text-zinc-200 hover:bg-surface-200'
              }`}
            >
              {s.done ? (
                <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-400" />
              ) : (
                <span className="font-mono text-[9px]">#{s.step}</span>
              )}
              <span className="truncate hidden sm:inline">{s.name}</span>
              <span className="sm:hidden">{s.step}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export const GuidedStepFlowBottomBar: React.FC = () => {
  const {
    activeGuidedStep,
    nextGuidedStep,
    prevGuidedStep,
    exitGuidedFlow,
  } = useHealth();

  if (!activeGuidedStep) return null;

  const isLast = activeGuidedStep === 4;

  const nextLabels = {
    1: 'Continue to Step 2: Log Your Meals →',
    2: 'Continue to Step 3: Daily Movement →',
    3: 'Continue to Step 4: Review Your Day →',
    4: '✓ Daily Flow Complete — Go to Dashboard to Begin Daily Use →',
  };

  return (
    <div className="mt-8 mb-4 p-4 sm:p-5 rounded-3xl bg-surface-100/95 border border-brand-500/40 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl select-none">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold text-foreground">
            {isLast
              ? 'All 4 Daily Steps Reviewed!'
              : `Done with Step ${activeGuidedStep}? Move to next step`}
          </div>
          <div className="text-[11px] text-zinc-400">
            {isLast
              ? 'Click below to return to the main dashboard and begin your regular daily use.'
              : `Continue seamlessly to Step ${activeGuidedStep + 1} without going back to the dashboard.`}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        {activeGuidedStep > 1 && (
          <button
            type="button"
            onClick={prevGuidedStep}
            className="px-3.5 py-2.5 rounded-2xl bg-surface-200 border border-surface-border text-xs font-semibold text-zinc-300 hover:bg-surface-300 hover:text-white transition-all active:scale-95"
          >
            ← Back
          </button>
        )}

        <button
          type="button"
          onClick={nextGuidedStep}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
            isLast
              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/30'
              : 'bg-brand-500 hover:bg-brand-400 text-zinc-950 shadow-brand-500/30'
          }`}
        >
          <span>{nextLabels[activeGuidedStep]}</span>
          {isLast ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
