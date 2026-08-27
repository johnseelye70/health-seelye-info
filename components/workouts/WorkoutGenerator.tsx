'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { EquipmentType } from '@/lib/types';
import { WorkoutPlayer } from './WorkoutPlayer';
import { HiitTimer } from './HiitTimer';
import { EquipmentInventoryBrowser } from './EquipmentInventoryBrowser';
import { ExerciseDatabaseBrowser } from './ExerciseDatabaseBrowser';
import { PlateInventoryCalculator } from './PlateInventoryCalculator';
import { PreMadeProgramsBrowser } from './PreMadeProgramsBrowser';
import { WorkoutHistoryAnalytics } from './WorkoutHistoryAnalytics';
import { SimpleMovementPickerModal } from './SimpleMovementPickerModal';
import {
  SimpleMovementActivity,
  POPULAR_MOVEMENT_CHOICES,
} from '@/lib/movement-database';
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  Zap,
  RotateCcw,
  Sparkles,
  Flame,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  Plus,
  ArrowRight,
  Check,
  AlertTriangle,
  Library,
  Boxes,
  Timer,
  Scale,
  Award,
  BarChart3,
  FileText,
  Clock,
  Footprints,
  Heart,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export const WorkoutGenerator: React.FC = () => {
  const {
    profile,
    toggleEquipment,
    setEquipmentInventory,
    workoutPlan,
    activeWeek,
    setActiveWeek,
    activeDay,
    setActiveDay,
    toggleExerciseCompleted,
    updateExerciseSetData,
    regenerateWorkouts,
    experienceMode,
    workoutLogs,
    simpleMovementActivities,
    toggleSimpleMovementCompleted,
    addSimpleMovementActivity,
    removeSimpleMovementActivity,
    swapSimpleMovementActivity,
    resetSimpleMovementActivities,
    logSteps,
  } = useHealth();

  const isSimple = experienceMode === 'standard' || experienceMode === 'tutorial';
  const [activeSubTab, setActiveSubTab] = useState<
    'routine' | 'premade_programs' | 'workout_database' | 'exercise_db' | 'equipment_db' | 'plate_calc' | 'hiit'
  >('routine');

  // Simple Movement Picker State
  const [showPickerModal, setShowPickerModal] = useState<boolean>(false);
  const [swapTargetId, setSwapTargetId] = useState<string | null>(null);
  const [logToast, setLogToast] = useState<string | null>(null);

  const handleOpenPicker = (swapId?: string) => {
    setSwapTargetId(swapId || null);
    setShowPickerModal(true);
  };

  const handleSelectActivity = (activity: SimpleMovementActivity) => {
    if (swapTargetId) {
      swapSimpleMovementActivity(swapTargetId, activity);
      setSwapTargetId(null);
    } else {
      addSimpleMovementActivity(activity);
    }
  };

  const handleLogActivity = (act: SimpleMovementActivity) => {
    if (act.estimated_steps > 0) {
      logSteps(act.estimated_steps, 'manual', undefined, act.estimated_calories);
    } else {
      logSteps(0, 'manual', undefined, act.estimated_calories);
    }
    if (!act.completed) {
      toggleSimpleMovementCompleted(act.id);
    }
    setLogToast(`Logged "${act.title}"! (+${act.estimated_calories} kcal burned${act.estimated_steps > 0 ? `, +${act.estimated_steps.toLocaleString()} steps` : ''})`);
    setTimeout(() => setLogToast(null), 3500);
  };

  const simpleCompletedCount = simpleMovementActivities.filter((a) => a.completed).length;
  const simpleTotalCount = simpleMovementActivities.length;
  const simpleTotalCalories = simpleMovementActivities.reduce((sum, a) => sum + (a.completed ? a.estimated_calories : 0), 0);
  const simpleTargetCalories = simpleMovementActivities.reduce((sum, a) => sum + a.estimated_calories, 0);

  // Find active day's plan
  const activeDayWorkout = workoutPlan.find(
    (w) => w.week_number === activeWeek && w.day_number === activeDay
  ) || workoutPlan[0];

  const completedCount = activeDayWorkout?.exercises.filter((e) => e.completed).length || 0;
  const totalCount = activeDayWorkout?.exercises.length || 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // Days list (1: Mon -> 7: Sun)
  const daysOfWeek = [
    { dayNum: 1, label: 'Mon', title: isSimple ? 'Chest & Arms' : 'Push Power' },
    { dayNum: 2, label: 'Tue', title: isSimple ? 'Back & Posture' : 'Pull Density' },
    { dayNum: 3, label: 'Wed', title: isSimple ? 'Legs & Core' : 'Legs & Quads' },
    { dayNum: 4, label: 'Thu', title: isSimple ? 'Cardio Energy' : 'HIIT Blitz' },
    { dayNum: 5, label: 'Fri', title: isSimple ? 'Upper Body' : 'Upper Hypertrophy' },
    { dayNum: 6, label: 'Sat', title: isSimple ? 'Active Walk' : 'Active Recovery' },
    { dayNum: 7, label: 'Sun', title: isSimple ? 'Rest & Stretch' : 'Rest & Mobility' },
  ];

  const ownedCount = profile.equipment_inventory?.length || 0;
  const logsCount = workoutLogs?.length || 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Sub-Navigation (Athlete Mode Only) */}
      {!isSimple && (
        <div className="p-2 rounded-2xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap select-none shadow-md">
          <button
            type="button"
            id="fitness-tab-routine"
            onClick={() => setActiveSubTab('routine')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'routine'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-300 hover:text-white hover:bg-surface-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily Split & Player</span>
          </button>

          <button
            type="button"
            id="fitness-tab-premade-programs"
            onClick={() => setActiveSubTab('premade_programs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'premade_programs'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-300 hover:text-white hover:bg-surface-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Pre-Made Programs (P90X, CrossFit, 5x5)</span>
          </button>

          <button
            type="button"
            id="fitness-tab-workout-database"
            onClick={() => setActiveSubTab('workout_database')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'workout_database'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-300 hover:text-white hover:bg-surface-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Workout Telemetry {logsCount > 0 ? `(${logsCount})` : ''}</span>
          </button>

          <button
            type="button"
            id="fitness-tab-exercise-db"
            onClick={() => setActiveSubTab('exercise_db')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'exercise_db'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-300 hover:text-white hover:bg-surface-200'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Exercise Matrix</span>
          </button>

          <button
            type="button"
            id="fitness-tab-equipment-db"
            onClick={() => setActiveSubTab('equipment_db')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'equipment_db'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-300 hover:text-white hover:bg-surface-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Equipment Inventory ({ownedCount})</span>
          </button>

          <button
            type="button"
            id="fitness-tab-plate-calc"
            onClick={() => setActiveSubTab('plate_calc')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'plate_calc'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-300 hover:text-white hover:bg-surface-200'
            }`}
          >
            <Scale className="w-4 h-4 text-accent-cyan" />
            <span>Olympic Barbell Plate Math</span>
          </button>

          <button
            type="button"
            id="fitness-tab-hiit"
            onClick={() => setActiveSubTab('hiit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'hiit'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-300 hover:text-white hover:bg-surface-200'
            }`}
          >
            <Timer className="w-4 h-4 text-rose-400" />
            <span>HIIT & Tabata Telemetry</span>
          </button>
        </div>
      )}

      {/* =====================================================================
          VIEW 1: SIMPLE MODE DAILY MOVEMENT CHOICES ENGINE
          ===================================================================== */}
      {isSimple ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Simple Movement Picker Modal Dialog */}
          <SimpleMovementPickerModal
            isOpen={showPickerModal}
            onClose={() => {
              setShowPickerModal(false);
              setSwapTargetId(null);
            }}
            onSelectActivity={handleSelectActivity}
            selectedActivityIds={simpleMovementActivities.map((a) => a.id)}
            swapTargetId={swapTargetId}
          />

          {/* Toast Notification */}
          {logToast && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{logToast}</span>
            </div>
          )}

          {/* Simple Header Banner */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-accent-coral border border-rose-500/30">
                    DAILY FEEL-GOOD MOVEMENT CHOICES
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  Daily Feel-Good Movement
                </h1>
                <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                  Choose activities you actually enjoy doing today — walking, stretching, swimming, yoga, or home strength. Pick, swap, or log your movement anytime!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenPicker()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-coral hover:bg-rose-600 text-white text-xs font-bold shadow-glow-coral transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Choose / Add Activity</span>
                </button>
                <button
                  type="button"
                  onClick={resetSimpleMovementActivities}
                  title="Reset to recommended baseline choices"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-400 hover:text-foreground text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Summary Card */}
          <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-accent-coral shadow-glow-coral">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>Today's Movement Goal</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-coral/15 text-accent-coral font-mono font-bold">
                    {simpleCompletedCount} of {simpleTotalCount} Done
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {simpleCompletedCount === simpleTotalCount && simpleTotalCount > 0
                    ? '🎉 Fantastic job! You completed all your chosen movements for today!'
                    : `Active energy burn target: ~${simpleTotalCalories} of ~${simpleTargetCalories} kcal`}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full sm:w-48 space-y-1.5 self-end sm:self-center">
              <div className="w-full h-2.5 bg-surface-300 rounded-full overflow-hidden border border-surface-border">
                <div
                  className="h-full bg-gradient-to-r from-accent-coral to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${simpleTotalCount > 0 ? (simpleCompletedCount / simpleTotalCount) * 100 : 0}%` }}
                />
              </div>
              <div className="text-right text-[11px] font-mono text-zinc-400">
                {simpleTotalCount > 0 ? Math.round((simpleCompletedCount / simpleTotalCount) * 100) : 0}% Completed
              </div>
            </div>
          </div>

          {/* Today's Chosen Movement Activities List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-coral" />
                <h2 className="text-base font-bold text-foreground">Your Chosen Movements For Today</h2>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPicker()}
                className="text-xs text-accent-coral hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Movement Choice</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {simpleMovementActivities.map((act) => (
                <div
                  key={act.id}
                  className={`p-5 rounded-3xl border backdrop-blur-xl transition-all ${
                    act.completed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-surface-100/90 border-surface-border hover:border-accent-coral/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Activity Info & Checkbox */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleSimpleMovementCompleted(act.id)}
                        className="mt-0.5 text-zinc-400 hover:text-foreground transition-transform active:scale-90 cursor-pointer"
                        title={act.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {act.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Circle className="w-6 h-6 text-zinc-400 hover:text-accent-coral" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xl">{act.icon}</span>
                          <h3 className={`text-base font-bold ${act.completed ? 'line-through text-zinc-400' : 'text-foreground'}`}>
                            {act.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-200 text-zinc-400 border border-surface-border">
                            {act.category_label}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                          {act.description}
                        </p>

                        {act.benefits && (
                          <p className="text-[11px] text-zinc-500 italic">
                            💡 {act.benefits}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metrics & Action Buttons */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-border">
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="flex items-center gap-1 font-bold text-foreground bg-surface-200 px-2.5 py-1 rounded-xl border border-surface-border">
                          <Clock className="w-3.5 h-3.5 text-accent-coral" />
                          {act.duration_minutes}m
                        </span>
                        <span className="text-zinc-400">~{act.estimated_calories} kcal</span>
                        {act.estimated_steps > 0 && (
                          <span className="text-zinc-400">{act.estimated_steps.toLocaleString()} steps</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLogActivity(act)}
                          className="px-3 py-1.5 rounded-xl bg-accent-coral/15 hover:bg-accent-coral/25 border border-accent-coral/30 text-accent-coral text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                          title="Log this activity's steps and calories to your daily burn"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>{act.completed ? 'Logged ✓' : 'Log & Burn'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenPicker(act.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-400 hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
                          title="Swap with a different movement choice"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        {simpleMovementActivities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSimpleMovementActivity(act.id)}
                            className="p-1.5 rounded-xl bg-surface-200 hover:bg-red-500/20 border border-surface-border text-zinc-400 hover:text-red-400 text-xs transition-all cursor-pointer"
                            title="Remove from today's plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Movements CTA Card */}
            <div
              onClick={() => handleOpenPicker()}
              className="p-4 rounded-2xl border border-dashed border-surface-border hover:border-accent-coral/50 bg-surface-100/40 hover:bg-surface-100 flex items-center justify-center gap-2 text-xs font-bold text-zinc-400 hover:text-accent-coral transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Movement Choice (Walking, Yoga, Swimming, Dance, Cycling...)</span>
            </div>
          </div>

          {/* Explore More Feel-Good Movement Ideas Shelf */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-foreground">Explore Other Feel-Good Movement Choices</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {POPULAR_MOVEMENT_CHOICES.filter((p) => !simpleMovementActivities.some((a) => a.id === p.id))
                .slice(0, 6)
                .map((idea) => (
                  <div
                    key={idea.id}
                    className="p-4 rounded-2xl bg-surface-100/80 border border-surface-border flex flex-col justify-between space-y-3 hover:border-accent-coral/40 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{idea.icon}</span>
                        <h4 className="text-xs font-bold text-foreground leading-snug">{idea.title}</h4>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">
                        {idea.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500">{idea.duration_minutes}m • ~{idea.estimated_calories} kcal</span>
                      <button
                        type="button"
                        onClick={() => addSimpleMovementActivity({ ...idea, completed: false })}
                        className="px-2.5 py-1 rounded-xl bg-surface-200 hover:bg-accent-coral hover:text-white border border-surface-border text-foreground text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================================
            ATHLETE MODE: 4-WEEK PERIODIZED SPLIT & ADVANCED SUITE
            ===================================================================== */
        <>
          {activeSubTab === 'routine' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Banner */}
              <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-teal/20 text-accent-teal border border-accent-teal/30">
                        EQUIPMENT-FILTERED 4-WEEK PERIODIZED SPLIT
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      Adaptive Workout Generator & Player
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                      4-Week periodized athletic training split dynamically generated to match your checked equipment inventory.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => regenerateWorkouts()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Regenerate Routine</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Zero Equipment Notice Banner */}
              {ownedCount === 0 && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-surface-100 to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-200">No Equipment Currently Selected</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Your routines are currently defaulting to pure bodyweight exercises. Check off your gym gear or choose a pre-made program (like P90X or StrongLifts) above.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('equipment_db')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-glow whitespace-nowrap self-start sm:self-auto cursor-pointer transition-all active:scale-95"
                  >
                    <span>Select Your Equipment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Week & Day Periodization Navigation */}
              <div className="space-y-4">
                {/* 4-Week Selector Tabs */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-400" />
                    <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
                      Training Periodization
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 bg-surface-200 p-1.5 rounded-2xl border border-surface-border">
                    {[1, 2, 3, 4].map((wk) => (
                      <button
                        key={wk}
                        id={`btn-week-${wk}`}
                        onClick={() => setActiveWeek(wk)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeWeek === wk
                            ? 'bg-brand-500 text-zinc-950 shadow-glow'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Week {wk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7-Day Matrix Carousel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                  {daysOfWeek.map((day) => {
                    const isDaySelected = activeDay === day.dayNum;
                    const targetDayPlan = workoutPlan.find(
                      (w) => w.week_number === activeWeek && w.day_number === day.dayNum
                    );
                    const dayCompleted =
                      targetDayPlan?.exercises.every((e) => e.completed) &&
                      (targetDayPlan?.exercises.length || 0) > 0;

                    return (
                      <button
                        key={day.dayNum}
                        id={`btn-day-${day.dayNum}`}
                        onClick={() => setActiveDay(day.dayNum)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isDaySelected
                            ? 'bg-surface-100 border-brand-500 shadow-glow text-white'
                            : 'bg-surface-200/60 border-surface-border hover:border-zinc-700 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className={isDaySelected ? 'font-bold text-brand-400' : 'text-zinc-400'}>
                            {day.label}
                          </span>
                          {dayCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                        </div>
                        <div className="text-xs font-bold text-zinc-200 truncate">{day.title}</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-1">
                          {targetDayPlan?.exercises.length || 0} Movements
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Workout Session Details & Exercise Player List */}
              <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border/80">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-accent-teal uppercase tracking-wider">
                      <span>{activeDayWorkout.split_type.replace('_', ' ').toUpperCase()}</span>
                      <span>•</span>
                      <span>Week {activeWeek}, Day {activeDay}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                      {activeDayWorkout.day_title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-brand-400">
                        {completedCount} / {totalCount} Exercises Done
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {ownedCount > 0 ? `${ownedCount} Gym Pieces Active` : 'Bodyweight Mode'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="space-y-4">
                  {activeDayWorkout.exercises.map((slot) => (
                    <WorkoutPlayer
                      key={slot.id}
                      slot={slot}
                      dayId={activeDayWorkout.id}
                      onToggleComplete={() => toggleExerciseCompleted(activeDayWorkout.id, slot.id)}
                      onSaveSetData={(reps, weight) => updateExerciseSetData(activeDayWorkout.id, slot.id, reps, weight)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: PRE-MADE WORKOUT PROGRAMS */}
          {activeSubTab === 'premade_programs' && <PreMadeProgramsBrowser />}

          {/* VIEW 3: ONGOING WORKOUT DATABASE & ANALYTICS */}
          {activeSubTab === 'workout_database' && <WorkoutHistoryAnalytics />}

          {/* VIEW 4: COMPLETE EXERCISE DATABASE BROWSER */}
          {activeSubTab === 'exercise_db' && (
            <ExerciseDatabaseBrowser
              onNavigateToEquipment={() => setActiveSubTab('equipment_db')}
            />
          )}

          {/* VIEW 5: COMPLETE EQUIPMENT INVENTORY BROWSER */}
          {activeSubTab === 'equipment_db' && (
            <EquipmentInventoryBrowser
              onNavigateToExercises={() => setActiveSubTab('exercise_db')}
              onNavigateToPlateCalculator={() => setActiveSubTab('plate_calc')}
            />
          )}

          {/* VIEW 6: WEIGHT PLATE INVENTORY & BARBELL MAX LOAD CALCULATOR */}
          {activeSubTab === 'plate_calc' && (
            <div className="animate-fadeIn">
              <PlateInventoryCalculator onPlatesUpdated={() => {}} />
            </div>
          )}

          {/* VIEW 7: HIIT & TABATA INTERVAL TIMER */}
          {activeSubTab === 'hiit' && (
            <div className="animate-fadeIn">
              <HiitTimer initialWorkSeconds={40} initialRestSeconds={20} initialRounds={8} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
