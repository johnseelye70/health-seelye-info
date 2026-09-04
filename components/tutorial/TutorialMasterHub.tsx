'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  UtensilsCrossed,
  Timer,
  Footprints,
  ShoppingCart,
  TrendingUp,
  Dumbbell,
  Calculator,
  SlidersHorizontal,
  Cloud,
  Check,
  Award,
  ChevronRight,
  FileText,
  Scale,
  Clock,
  Layers,
  Calendar,
  BarChart3,
  Trophy,
} from 'lucide-react';

type TutorialTrack = 'standard' | 'advanced';

export const TutorialMasterHub: React.FC = () => {
  const {
    setExperienceMode,
    setActiveTab,
  } = useHealth();

  const [activeTrack, setActiveTrack] = useState<TutorialTrack>('standard');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Interactive Sandbox Local States
  const [demoFoodLogged, setDemoFoodLogged] = useState<boolean>(false);
  const [demoStepsCount, setDemoStepsCount] = useState<number>(6500);
  const [demoFastingActive, setDemoFastingActive] = useState<boolean>(true);
  const [demoGroceryChecked, setDemoGroceryChecked] = useState<boolean>(false);
  const [demoWeightInput, setDemoWeightInput] = useState<number>(175.4);
  const [demoWeightLogged, setDemoWeightLogged] = useState<boolean>(false);

  // Advanced Sandbox States
  const [demoBarWeight, setDemoBarWeight] = useState<number>(45);
  const [demoPlatesPerSide, setDemoPlatesPerSide] = useState<{ p45: number; p25: number; p10: number; p5: number }>({
    p45: 1,
    p25: 1,
    p10: 0,
    p5: 0,
  });
  const [demoMacroMultiplier, setDemoMacroMultiplier] = useState<number>(1.0);
  const [demoWorkoutSetCompleted, setDemoWorkoutSetCompleted] = useState<boolean>(false);
  const [demoEquipmentToggled, setDemoEquipmentToggled] = useState<boolean>(false);

  const markStepDone = (track: TutorialTrack, stepNum: number) => {
    setCompletedSteps((prev) => ({ ...prev, [`${track}-${stepNum}`]: true }));
  };

  const isStepDone = (track: TutorialTrack, stepNum: number) => {
    return Boolean(completedSteps[`${track}-${stepNum}`]);
  };

  // Standard Track Lessons (7 Steps)
  const standardSteps = [
    {
      num: 1,
      title: 'Welcome to Standard Mode & Your Daily Wellness Hub',
      subtitle: 'The clean, intuitive health companion built for daily consistency',
      icon: Sparkles,
      color: '#38bdf8',
    },
    {
      num: 2,
      title: 'Wholesome Food & Meal Logging Made Simple',
      subtitle: 'Track meals with zero stress, visual portions, and automatic balance',
      icon: UtensilsCrossed,
      color: '#10b981',
    },
    {
      num: 3,
      title: 'Intermittent Fasting & Circadian Rhythm Clock',
      subtitle: 'Effortless 16:8 fasting with clear eating windows & countdown timers',
      icon: Timer,
      color: '#f59e0b',
    },
    {
      num: 4,
      title: 'Daily Steps & Apple Health Movement Tracker',
      subtitle: 'Seamless iPhone step sync, quick manual additions, and daily active goals',
      icon: Footprints,
      color: '#06b6d4',
    },
    {
      num: 5,
      title: 'Smart Grocery List & Aisle-by-Aisle Pantry',
      subtitle: 'Auto-generated shopping items sorted by grocery store aisles',
      icon: ShoppingCart,
      color: '#8b5cf6',
    },
    {
      num: 6,
      title: 'Weight Trends & Healthy Habit Streaks',
      subtitle: 'Celebrate progress with smooth 7-day rolling averages',
      icon: TrendingUp,
      color: '#ec4899',
    },
    {
      num: 7,
      title: 'Standard Mode Mastered! Next Steps & Advanced Preview',
      subtitle: 'Ready to use Standard Mode daily, or explore the Advanced Athlete Engine',
      icon: Award,
      color: '#3b82f6',
    },
  ];

  // Advanced Track Lessons (7 Steps)
  const advancedSteps = [
    {
      num: 1,
      title: 'Precision Macro Targets & Energy Balance Engine',
      subtitle: 'Exact Mifflin-St Jeor TDEE, grams/lb protein ratios, and deficit/surplus tuning',
      icon: Flame,
      color: '#f97316',
    },
    {
      num: 2,
      title: 'Dynamic Workout Generator & Live Set Tracker',
      subtitle: 'Interactive sets, reps, weight logging, and equipment-filtered splits',
      icon: Dumbbell,
      color: '#3b82f6',
    },
    {
      num: 3,
      title: 'Olympic Barbell Plate Math Calculator',
      subtitle: 'Visual plate loader showing exact pairs of 45s, 25s, 10s, 5s for target weight',
      icon: Calculator,
      color: '#10b981',
    },
    {
      num: 4,
      title: 'Pre-Made Master Programs & Printable Workout Sheets',
      subtitle: 'P90X, CrossFit, Concept2 Pete Plan, Dorian Yates, and printable logs',
      icon: FileText,
      color: '#8b5cf6',
    },
    {
      num: 5,
      title: 'Recipe Studio & Weekly Batch Scaling',
      subtitle: 'Build macro-balanced recipes, custom foods, and 2x–8x meal prep scaling',
      icon: UtensilsCrossed,
      color: '#ec4899',
    },
    {
      num: 6,
      title: 'Equipment Customizer & Gym Footprint Matching',
      subtitle: 'Select your home gym gear (dumbbells, Concept2, cables) to unlock tailored exercises',
      icon: SlidersHorizontal,
      color: '#06b6d4',
    },
    {
      num: 7,
      title: 'Triple-Layer Multi-Device Cloud Synchronization',
      subtitle: 'Zero-loss Supabase synchronization across iPhone, iPad, laptop, and desktop',
      icon: Cloud,
      color: '#14b8a6',
    },
  ];

  const totalStepsInTrack = activeTrack === 'standard' ? standardSteps.length : advancedSteps.length;
  const currentStepData = activeTrack === 'standard' ? standardSteps[currentStep - 1] : advancedSteps[currentStep - 1];

  // Calculate Barbell Weight in Demo
  const totalBarbellWeight =
    demoBarWeight + (demoPlatesPerSide.p45 * 45 + demoPlatesPerSide.p25 * 25 + demoPlatesPerSide.p10 * 10 + demoPlatesPerSide.p5 * 5) * 2;

  const handleNextStep = () => {
    markStepDone(activeTrack, currentStep);
    if (currentStep < totalStepsInTrack) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSwitchToStandardApp = () => {
    setExperienceMode('standard');
    setActiveTab('dashboard');
  };

  const handleSwitchToAdvancedApp = () => {
    setExperienceMode('advanced');
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Interactive Tutorial Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/40 animate-pulse">
                🎓 INTERACTIVE HAND-HELD TUTORIAL
              </span>
              <span className="text-xs text-zinc-400 font-mono">Step-by-Step Guided Mastery</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Interactive System Walkthrough & Tutorial Mode
            </h1>
            <p className="text-xs md:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              Welcome to the complete, zero-stress guide. Try live buttons, interactive sandboxes, and discover how to navigate both the <strong className="text-brand-400">Standard</strong> daily wellness mode and the <strong className="text-accent-cyan">Advanced</strong> precision engine.
            </p>
          </div>

          {/* Quick Track Switcher Pills */}
          <div className="flex items-center gap-2 bg-surface-200/80 p-1.5 rounded-2xl border border-surface-border self-start lg:self-auto">
            <button
              type="button"
              id="tutorial-track-standard-btn"
              onClick={() => {
                setActiveTrack('standard');
                setCurrentStep(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTrack === 'standard'
                  ? 'bg-brand-500 text-zinc-950 shadow-glow scale-100'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Standard Mode Guide</span>
            </button>
            <button
              type="button"
              id="tutorial-track-advanced-btn"
              onClick={() => {
                setActiveTrack('advanced');
                setCurrentStep(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTrack === 'advanced'
                  ? 'bg-accent-cyan text-zinc-950 shadow-glow scale-100'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>2. Advanced Mode Guide</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Step Numbers */}
        <div className="pt-4 border-t border-surface-border/60 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                Track: {activeTrack === 'standard' ? 'Standard (Daily Wellness)' : 'Advanced (Precision Engine)'}
              </span>
              <span>•</span>
              <span>Lesson {currentStep} of {totalStepsInTrack}</span>
            </div>
            <span className="font-mono text-brand-400 font-bold">
              {Math.round((currentStep / totalStepsInTrack) * 100)}% Completed
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-surface-300 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                activeTrack === 'standard' ? 'bg-brand-500 shadow-glow' : 'bg-accent-cyan shadow-glow'
              }`}
              style={{ width: `${(currentStep / totalStepsInTrack) * 100}%` }}
            />
          </div>

          {/* Interactive Step Navigation Circles */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(activeTrack === 'standard' ? standardSteps : advancedSteps).map((st) => {
              const active = currentStep === st.num;
              const done = isStepDone(activeTrack, st.num);
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-surface-300 text-white border border-brand-400/60 shadow-sm'
                      : done
                      ? 'bg-surface-200/60 text-brand-300 border border-brand-500/20'
                      : 'bg-surface-200/30 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      done
                        ? 'bg-brand-500 text-zinc-950'
                        : active
                        ? 'bg-brand-400 text-zinc-950'
                        : 'bg-surface-300 text-zinc-400'
                    }`}
                  >
                    {done ? '✓' : st.num}
                  </span>
                  <span>{st.title.split(' ')[0]} {st.title.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Lesson Card (100% Inline Architecture) */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/95 border border-surface-border shadow-2xl space-y-6">
        {/* Lesson Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-surface-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-surface-200 border border-surface-border text-brand-400">
                LESSON {currentStep} OF {totalStepsInTrack}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {activeTrack === 'standard' ? 'Standard Protocol' : 'Advanced Protocol'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">{currentStepData.title}</h2>
            <p className="text-xs md:text-sm text-zinc-300">{currentStepData.subtitle}</p>
          </div>

          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${currentStepData.color}20`,
              borderColor: `${currentStepData.color}40`,
              color: currentStepData.color,
            }}
          >
            {React.createElement(currentStepData.icon, { className: 'w-6 h-6' })}
          </div>
        </div>

        {/* STANDARD TRACK LESSONS */}
        {activeTrack === 'standard' && (
          <div className="space-y-6">
            {/* Step 1: Standard Dashboard */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-5 rounded-2xl bg-surface-200/40 border border-surface-border space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    How Standard Mode Works
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Standard mode removes complicated bodybuilding math, calorie deficits, and complex percentages. Instead, it gives you a clean visual overview of your day: 3 simple rings for food, hydration, and movement, plus your eating window.
                  </p>
                </div>

                {/* Interactive Mock Dashboard Preview */}
                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border/80 space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>LIVE INTERACTIVE PREVIEW</span>
                    <span className="text-brand-400">Interactive Rings Sandbox</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">🥗 Daily Nourishment</span>
                        <span className="text-brand-400 font-bold">1,650 / 2,000 kcal</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-100 overflow-hidden">
                        <div className="w-[82%] h-full bg-brand-500 rounded-full" />
                      </div>
                      <p className="text-[11px] text-zinc-400">3 Wholesome meals logged today</p>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">💧 Hydration Target</span>
                        <span className="text-accent-cyan font-bold">72 / 96 oz</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-100 overflow-hidden">
                        <div className="w-[75%] h-full bg-accent-cyan rounded-full" />
                      </div>
                      <p className="text-[11px] text-zinc-400">3 of 4 water glasses logged</p>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">🚶 Daily Movement</span>
                        <span className="text-emerald-400 font-bold">{demoStepsCount.toLocaleString()} / 10,000</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (demoStepsCount / 10000) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400">Synced from iPhone / Apple Health</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
                    <span className="text-xs text-brand-300">
                      💡 <strong>Try it:</strong> Standard mode updates these rings in real-time as you log food or walk!
                    </span>
                    <button
                      type="button"
                      onClick={() => setDemoStepsCount((prev) => prev + 1000)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-brand-500 text-zinc-950 hover:bg-brand-400 cursor-pointer"
                    >
                      +1,000 Steps Demo
                    </button>
                  </div>
                </div>

                {/* Real-World Daily Rhythm Callout */}
                <div className="p-5 rounded-2xl bg-surface-200/50 border border-surface-border space-y-3">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-400" />
                    <span>A Day in the Life: Simple Daily Flow</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60 space-y-1">
                      <div className="font-bold text-cyan-400">1. Morning (7 AM)</div>
                      <p className="text-zinc-400 text-[11px]">Step on the scale, drink 16 oz water, and see your remaining fasting countdown.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60 space-y-1">
                      <div className="font-bold text-brand-400">2. Lunch (12 PM)</div>
                      <p className="text-zinc-400 text-[11px]">Break your fast with high protein. Log meals in 1 tap or Quick Add.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60 space-y-1">
                      <div className="font-bold text-emerald-400">3. Afternoon (5 PM)</div>
                      <p className="text-zinc-400 text-[11px]">Get your daily walk or gym workout in. Steps sync right from your phone or watch.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60 space-y-1">
                      <div className="font-bold text-purple-400">4. Evening (8 PM)</div>
                      <p className="text-zinc-400 text-[11px]">Finish dinner, start your fasting clock, and review your day's reports.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Meal Logging */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  In Standard Mode, you don't have to weigh grams or calculate macros. You simply select wholesome meals, breakfasts, and snacks from the library or quick-add your favorite foods with one tap.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>INTERACTIVE FOOD LOGGING SANDBOX</span>
                    <span className={demoFoodLogged ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                      {demoFoodLogged ? '✓ Sample Food Logged' : 'Try Logging Below'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-surface-200 border border-surface-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍓</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Greek Yogurt Berry Bowl</h4>
                          <p className="text-[11px] text-zinc-400">Wholesome Breakfast • 320 kcal</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDemoFoodLogged(true);
                          markStepDone('standard', 2);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          demoFoodLogged
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-brand-500 text-zinc-950 hover:bg-brand-400'
                        }`}
                      >
                        {demoFoodLogged ? 'Logged ✓' : 'Tap to Log'}
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-200 border border-surface-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🥑</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Salmon Avocado Salad</h4>
                          <p className="text-[11px] text-zinc-400">Nutrient-Dense Lunch • 520 kcal</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDemoFoodLogged(true);
                          markStepDone('standard', 2);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-300 hover:bg-surface-200 text-white cursor-pointer"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>

                  {demoFoodLogged && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Great job! Food is logged and your daily calories and progress rings are updated.</span>
                    </div>
                  )}
                </div>

                {/* Real-World Scenarios */}
                <div className="p-5 rounded-2xl bg-surface-200/50 border border-surface-border space-y-3">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                    <span>Real-Life Scenarios: How to Log in Any Situation</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-border/60 space-y-1.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>🥗</span>
                        <span>Eating Out or Fast-Casual</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        At Chipotle or a deli? Don't stress weighing grams. Tap <strong>Quick Add</strong>, type "Chipotle Burrito Bowl" and enter ~650 calories. Fast and accurate enough for 95% of results.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-border/60 space-y-1.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>Creature of Habit / Leftovers</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        Eat the same Greek yogurt breakfast or dinner leftovers every day? Tap <strong>Copy Yesterday's Meals</strong> to instantly duplicate all items to today in 1 click.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-border/60 space-y-1.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>📅</span>
                        <span>Forgot to Log Yesterday?</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        Life gets busy. Simply tap the <strong>&lt; Previous Day</strong> arrow in the Food Diary, enter what you ate, and your weekly reports stay 100% up to date.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Fasting */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Intermittent Fasting made effortless. Standard mode defaults to the proven <strong>16:8 Protocol</strong> (16 hours fasting, 8 hours eating window). It tracks when your window opens and closes automatically.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>LIVE FASTING CLOCK SANDBOX</span>
                    <span className="text-amber-400 font-bold">16:8 Protocol</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-200 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold">
                        ⏱️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {demoFastingActive ? 'Fasting Time • Resting & Digesting' : 'Eating Window • Time for Healthy Food'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                            {demoFastingActive ? 'FASTING' : 'EATING'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                          {demoFastingActive ? 'Time remaining until window opens: 04:15:20' : 'Window closes at 8:00 PM'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDemoFastingActive(!demoFastingActive);
                        markStepDone('standard', 3);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-300 hover:bg-surface-100 text-white border border-surface-border cursor-pointer whitespace-nowrap"
                    >
                      {demoFastingActive ? 'Simulate Eating Window' : 'Simulate Fasting Window'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Step Tracking */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Automatic and instant. Steps entered on your iPhone, Apple Health shortcut, or Apple Watch automatically sync to your laptop and desktop browsers in real time.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>LIVE STEP COUNTER & SYNC SANDBOX</span>
                    <span className="text-cyan-400 font-bold">Live Cloud Stream</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-200 border border-surface-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                          <Footprints className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white font-mono">{demoStepsCount.toLocaleString()} STEPS</h4>
                          <p className="text-xs text-zinc-400">Daily Target: 10,000 Steps</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {Math.round((demoStepsCount / 10000) * 100)}% of goal
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border">
                      <button
                        type="button"
                        onClick={() => {
                          setDemoStepsCount((prev) => prev + 500);
                          markStepDone('standard', 4);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-300 hover:bg-surface-100 text-white cursor-pointer"
                      >
                        +500 Steps
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDemoStepsCount((prev) => prev + 1000);
                          markStepDone('standard', 4);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-500 text-zinc-950 hover:bg-brand-400 cursor-pointer"
                      >
                        +1,000 Steps
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDemoStepsCount(10000);
                          markStepDone('standard', 4);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 cursor-pointer"
                      >
                        🎯 Complete 10k Goal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Practical Step Advice */}
                <div className="p-5 rounded-2xl bg-surface-200/50 border border-surface-border space-y-3">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-emerald-400" />
                    <span>How to Hit 8,000–10,000 Steps Without Running a Marathon</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60">
                      <strong className="text-white block mb-0.5">Morning Stroll</strong>
                      <span className="text-zinc-400 text-[11px]">15-minute neighborhood walk = ~1,800 steps.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60">
                      <strong className="text-white block mb-0.5">Phone Call Pacing</strong>
                      <span className="text-zinc-400 text-[11px]">Stand and pace during calls = ~1,200 steps.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60">
                      <strong className="text-white block mb-0.5">Post-Lunch Walk</strong>
                      <span className="text-zinc-400 text-[11px]">20-minute stroll = ~2,200 steps &amp; lowers blood sugar.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60">
                      <strong className="text-white block mb-0.5">Evening Wind Down</strong>
                      <span className="text-zinc-400 text-[11px]">20 minutes with family/dog = ~2,500 steps.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Grocery */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Never forget an ingredient. When you choose recipes in Standard mode, missing items are automatically sorted by grocery store aisles (Produce, Dairy, Meat, Pantry) so your shopping is fast and organized.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>AISLE-BY-AISLE CART SANDBOX</span>
                    <span className="text-purple-400 font-bold">Produce Aisle</span>
                  </div>

                  <div className="space-y-2">
                    <div
                      onClick={() => {
                        setDemoGroceryChecked(!demoGroceryChecked);
                        markStepDone('standard', 5);
                      }}
                      className="p-3.5 rounded-xl bg-surface-200 border border-surface-border flex items-center justify-between cursor-pointer hover:bg-surface-200/80 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            demoGroceryChecked
                              ? 'bg-brand-500 border-brand-500 text-zinc-950'
                              : 'border-zinc-500'
                          }`}
                        >
                          {demoGroceryChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            demoGroceryChecked ? 'line-through text-zinc-500' : 'text-white'
                          }`}
                        >
                          Organic Baby Spinach (16 oz Container)
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">Produce Aisle</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Weight & Habits */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Track your weight and body composition with smoothing curves. Standard mode filters out normal daily water fluctuations so you see your true progress over time.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>WEIGHT LOGGING SANDBOX</span>
                    <span className="text-pink-400 font-bold">7-Day Trend</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-200 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Scale className="w-6 h-6 text-pink-400" />
                      <div>
                        <h4 className="text-xs font-bold text-white">Log Morning Weight</h4>
                        <p className="text-[11px] text-zinc-400">Step on scale after waking up</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={demoWeightInput}
                        onChange={(e) => setDemoWeightInput(parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-border text-white text-xs font-mono"
                      />
                      <span className="text-xs text-zinc-400">lbs</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDemoWeightLogged(true);
                          markStepDone('standard', 6);
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-500 text-zinc-950 hover:bg-brand-400 cursor-pointer"
                      >
                        {demoWeightLogged ? 'Saved ✓' : 'Save Log'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Realistic Scale Fluctuations */}
                <div className="p-5 rounded-2xl bg-surface-200/50 border border-surface-border space-y-3">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-4 h-4 text-pink-400" />
                    <span>Why Did the Scale Jump 2 Pounds Overnight? (And Why You Shouldn't Panic)</span>
                  </h4>
                  <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                    <p>
                      A 2-lb spike on the scale does <strong>NOT</strong> mean you gained 2 lbs of fat overnight (gaining 1 lb of fat requires eating 3,500 surplus calories above maintenance!). Here is what really happens:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60">
                        <strong className="text-amber-400 block mb-0.5">🧂 Sodium &amp; Water</strong>
                        <span className="text-zinc-400 text-[11px]">Salty restaurant foods cause kidneys to temporarily retain water. It flushes out in 24–48 hours.</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60">
                        <strong className="text-cyan-400 block mb-0.5">🍚 Carbohydrates</strong>
                        <span className="text-zinc-400 text-[11px]">Each 1g of stored muscle glycogen binds 3g of water. It is cellular fuel in your muscles, not fat.</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-100 border border-surface-border/60">
                        <strong className="text-emerald-400 block mb-0.5">🏋️ Lifting Soreness</strong>
                        <span className="text-zinc-400 text-[11px]">Intense resistance training causes micro-tears that hold healing fluids. This is healthy muscle recovery.</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-brand-400 font-bold pt-1">
                      💡 <strong>Key takeaway:</strong> Look at your 7-Day and 30-Day Weekly/Monthly Reports under Trends. Long-term rolling trends are what matter, not daily noise.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Standard Mastered & Advanced Preview */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-fadeIn text-center py-6">
                <div className="w-16 h-16 rounded-3xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 text-3xl mx-auto shadow-glow">
                  🏆
                </div>
                <div className="space-y-2 max-w-xl mx-auto">
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    Standard Mode Mastered!
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                    You understand everything you need to manage meals, fasting, steps, and grocery lists smoothly every single day.
                  </p>
                </div>

                {/* Reports Overview Feature Card */}
                <div className="p-5 rounded-2xl bg-surface-200/50 border border-surface-border space-y-3 text-left max-w-xl mx-auto">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brand-400" />
                    <span>Your Historical Cross-Referenced Reports</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Under the <strong>Progress &amp; Trends</strong> tab, you can view your entire journey cross-referenced across nutrition, workouts, walking, hydration, and weight:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-surface-100 border border-surface-border/60">
                      <strong className="text-brand-400 block">📅 Daily Report</strong>
                      <span className="text-[11px] text-zinc-400">Exact food log, workouts, and fluid balance for any date.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-100 border border-surface-border/60">
                      <strong className="text-cyan-400 block">🗓️ Weekly Summary</strong>
                      <span className="text-[11px] text-zinc-400">7-day rolling averages and consistency scores.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-100 border border-surface-border/60">
                      <strong className="text-purple-400 block">📆 Monthly Review</strong>
                      <span className="text-[11px] text-zinc-400">Total miles, workouts, and net scale shift.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-100 border border-surface-border/60">
                      <strong className="text-amber-400 block">🏆 Yearly &amp; All-Time</strong>
                      <span className="text-[11px] text-zinc-400">Lifetime iron tonnage, miles, and active habit days.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    id="launch-standard-mode-btn"
                    onClick={handleSwitchToStandardApp}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold bg-brand-500 text-zinc-950 hover:bg-brand-400 shadow-glow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch Standard Mode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="continue-to-advanced-guide-btn"
                    onClick={() => {
                      setActiveTrack('advanced');
                      setCurrentStep(1);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold bg-surface-200 hover:bg-surface-300 text-white border border-surface-border cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Advanced Mode Guide</span>
                    <ChevronRight className="w-4 h-4 text-accent-cyan" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADVANCED TRACK LESSONS */}
        {activeTrack === 'advanced' && (
          <div className="space-y-6">
            {/* Step 1: Macro Targets */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Advanced Mode provides full biometric control: Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), exact gram targets for Protein (1.0g/lb), Carbohydrates, and Fats, plus caloric deficit/surplus periodization.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>MACRO ENGINE SIMULATOR</span>
                    <span className="text-orange-400 font-bold">Mifflin-St Jeor Formula</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-zinc-400 font-mono">CALORIE TARGET</span>
                      <p className="text-lg font-black text-white font-mono mt-1">
                        {Math.round(2200 * demoMacroMultiplier)} kcal
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-brand-400 font-mono">PROTEIN (40%)</span>
                      <p className="text-lg font-black text-brand-300 font-mono mt-1">
                        {Math.round(180 * demoMacroMultiplier)}g
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-amber-400 font-mono">CARBS (35%)</span>
                      <p className="text-lg font-black text-amber-300 font-mono mt-1">
                        {Math.round(195 * demoMacroMultiplier)}g
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-pink-400 font-mono">FAT (25%)</span>
                      <p className="text-lg font-black text-pink-300 font-mono mt-1">
                        {Math.round(60 * demoMacroMultiplier)}g
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-zinc-400">Simulate Deficit vs Bulk:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDemoMacroMultiplier(0.85);
                          markStepDone('advanced', 1);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          demoMacroMultiplier === 0.85
                            ? 'bg-brand-500 text-zinc-950'
                            : 'bg-surface-200 text-zinc-300'
                        }`}
                      >
                        -500 Fat Cut
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDemoMacroMultiplier(1.0);
                          markStepDone('advanced', 1);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          demoMacroMultiplier === 1.0
                            ? 'bg-brand-500 text-zinc-950'
                            : 'bg-surface-200 text-zinc-300'
                        }`}
                      >
                        Maintenance
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDemoMacroMultiplier(1.15);
                          markStepDone('advanced', 1);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          demoMacroMultiplier === 1.15
                            ? 'bg-brand-500 text-zinc-950'
                            : 'bg-surface-200 text-zinc-300'
                        }`}
                      >
                        +300 Clean Bulk
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Workout Generator */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  The Advanced workout engine dynamically generates splits (Push/Pull/Legs, Upper/Lower, 5x5) filtered strictly by the equipment in your inventory. Log working sets, weight (lbs/kg), reps, and check off completed sets.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>LIVE WORKOUT LOGGING DEMO</span>
                    <span className="text-blue-400 font-bold">Barbell Bench Press</span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-brand-400" />
                        <span className="text-xs font-bold text-white">Barbell Flat Bench Press</span>
                      </div>
                      <span className="text-xs font-mono text-zinc-400">Target: 3 Sets × 8–10 Reps</span>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="font-bold text-zinc-400">SET 1:</span>
                        <span className="text-white font-bold">225 lbs × 10 reps</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDemoWorkoutSetCompleted(!demoWorkoutSetCompleted);
                          markStepDone('advanced', 2);
                        }}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          demoWorkoutSetCompleted
                            ? 'bg-emerald-500 text-zinc-950'
                            : 'bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-white'
                        }`}
                      >
                        {demoWorkoutSetCompleted ? 'Completed ✓' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Barbell Plate Calculator */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Never do gym mental math again. The Olympic Barbell Calculator computes the exact pairs of 45s, 25s, 10s, 5s, and 2.5s to slide onto each side of the barbell for any target weight.
                </p>

                {/* Interactive Barbell Widget */}
                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-5">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>INTERACTIVE BARBELL MATH CALCULATOR</span>
                    <span className="text-emerald-400 font-bold">Olympic 45lb Bar</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-200 border border-surface-border text-center space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 font-mono">TOTAL LOADED BAR WEIGHT</span>
                      <h3 className="text-3xl font-black text-white font-mono text-emerald-400">
                        {totalBarbellWeight} LBS
                      </h3>
                      <p className="text-xs text-zinc-400">
                        ({(totalBarbellWeight - demoBarWeight) / 2} lbs on each sleeve)
                      </p>
                    </div>

                    {/* Interactive Plate Increments */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-surface-border">
                      <button
                        type="button"
                        onClick={() => {
                          setDemoPlatesPerSide((prev) => ({
                            ...prev,
                            p45: prev.p45 > 0 ? prev.p45 - 1 : prev.p45 + 1,
                          }));
                          markStepDone('advanced', 3);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-blue-600/30 border border-blue-500/50 text-blue-300 hover:bg-blue-600/50 cursor-pointer"
                      >
                        45 lb Pair: {demoPlatesPerSide.p45}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDemoPlatesPerSide((prev) => ({
                            ...prev,
                            p25: prev.p25 > 0 ? prev.p25 - 1 : prev.p25 + 1,
                          }));
                          markStepDone('advanced', 3);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-600/30 border border-amber-500/50 text-amber-300 hover:bg-amber-600/50 cursor-pointer"
                      >
                        25 lb Pair: {demoPlatesPerSide.p25}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDemoPlatesPerSide((prev) => ({
                            ...prev,
                            p10: prev.p10 > 0 ? prev.p10 - 1 : prev.p10 + 1,
                          }));
                          markStepDone('advanced', 3);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/50 cursor-pointer"
                      >
                        10 lb Pair: {demoPlatesPerSide.p10}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Pre-Made Master Programs */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Access 25+ iconic training systems: P90X 12-routine master sheets, CrossFit benchmark girls & heroes, Concept2 Pete Plan & 2K peaking rowing protocols, Dorian Yates Blood & Guts, and German Volume Training.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>PROGRAM LIBRARY PREVIEW</span>
                    <span className="text-purple-400 font-bold">Interactive Worksheets</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">Concept2® Pete Plan Rowing</span>
                        <span className="text-xs">🚣</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">8×500m sprints, 10k steady state, pyramid rows</p>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">P90X® Classic 12-Routine</span>
                        <span className="text-xs">⚡</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">Chest & Back, Plyometrics, Shoulders & Arms</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Recipe Studio & Batch Scaling */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Build customized macro-engineered recipes and scale batch meal prep from 1 serving up to 8 servings for the entire week with automatic ingredient multiplier calculations.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>BATCH SCALING SANDBOX</span>
                    <span className="text-pink-400 font-bold">4 Servings (Meal Prep)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Anabolic Chipotle Chicken Bowl</span>
                      <span className="text-pink-400 font-mono font-bold">Batch: 4× Servings</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 space-y-1 font-mono">
                      <div>• 24 oz (680g) Chicken Breast (Seared)</div>
                      <div>• 2 cups Jasmine Rice (Cooked)</div>
                      <div>• 1 cup Black Beans + 1 Avocado</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Equipment Customizer */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  Whether you train at home with dumbbells, in a garage gym with a Concept2 rower, or at a commercial gym with cables, toggle your exact gear to automatically filter only the exercises you can perform.
                </p>

                <div className="p-6 rounded-2xl bg-surface-300/30 border border-surface-border space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>EQUIPMENT TOGGLE DEMO</span>
                    <span className="text-cyan-400 font-bold">Instant Exercise Unlocking</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDemoEquipmentToggled(!demoEquipmentToggled);
                        markStepDone('advanced', 6);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        demoEquipmentToggled
                          ? 'bg-brand-500 text-zinc-950 shadow-glow'
                          : 'bg-surface-200 text-zinc-300 border border-surface-border'
                      }`}
                    >
                      <span>🚣 Concept2 Indoor Rower</span>
                      <span>{demoEquipmentToggled ? '✓ Active' : '+ Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Cloud Sync */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-fadeIn text-center py-6">
                <div className="w-16 h-16 rounded-3xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan text-3xl mx-auto shadow-glow">
                  🏆
                </div>
                <div className="space-y-2 max-w-xl mx-auto">
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    Advanced Mode Mastered!
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                    You have complete command over the precision macro engine, barbell calculations, periodized workout sheets, and multi-device cloud synchronization.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    id="launch-advanced-mode-btn"
                    onClick={handleSwitchToAdvancedApp}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold bg-accent-cyan text-zinc-950 hover:bg-cyan-400 shadow-glow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch Advanced Mode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="return-to-standard-guide-btn"
                    onClick={() => {
                      setActiveTrack('standard');
                      setCurrentStep(1);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold bg-surface-200 hover:bg-surface-300 text-white border border-surface-border cursor-pointer transition-all"
                  >
                    Review Standard Guide
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step Navigation Footer Controls */}
        <div className="pt-6 border-t border-surface-border flex items-center justify-between gap-3">
          <button
            type="button"
            id="tutorial-prev-step-btn"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentStep === 1
                ? 'opacity-40 text-zinc-500 cursor-not-allowed bg-surface-200/40'
                : 'bg-surface-200 hover:bg-surface-300 text-white border border-surface-border cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Lesson</span>
          </button>

          <div className="text-xs text-zinc-500 font-mono hidden sm:block">
            Lesson {currentStep} / {totalStepsInTrack}
          </div>

          <button
            type="button"
            id="tutorial-next-step-btn"
            onClick={handleNextStep}
            disabled={currentStep === totalStepsInTrack}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentStep === totalStepsInTrack
                ? 'opacity-40 text-zinc-500 cursor-not-allowed bg-surface-200/40'
                : 'bg-brand-500 hover:bg-brand-400 text-zinc-950 shadow-glow cursor-pointer'
            }`}
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
