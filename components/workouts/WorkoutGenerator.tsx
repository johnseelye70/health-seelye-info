'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { EquipmentType } from '@/lib/types';
import { WorkoutPlayer } from './WorkoutPlayer';
import { HiitTimer } from './HiitTimer';
import { EquipmentInventoryBrowser } from './EquipmentInventoryBrowser';
import { ExerciseDatabaseBrowser } from './ExerciseDatabaseBrowser';
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
  } = useHealth();

  const isSimple = experienceMode === 'simple';
  const [activeSubTab, setActiveSubTab] = useState<'routine' | 'exercise_db' | 'equipment_db' | 'hiit'>('routine');

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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Main Navigation Tabs for Daily Fitness Section */}
      <div className="p-2 rounded-2xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-wrap items-center gap-2 select-none shadow-md">
        <button
          type="button"
          id="fitness-tab-routine"
          onClick={() => setActiveSubTab('routine')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'routine'
              ? 'bg-brand-500 text-zinc-950 shadow-glow'
              : 'text-zinc-300 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Workout Split & Player</span>
        </button>

        <button
          type="button"
          id="fitness-tab-exercise-db"
          onClick={() => setActiveSubTab('exercise_db')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'exercise_db'
              ? 'bg-brand-500 text-zinc-950 shadow-glow'
              : 'text-zinc-300 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>Exercise Database</span>
        </button>

        <button
          type="button"
          id="fitness-tab-equipment-db"
          onClick={() => setActiveSubTab('equipment_db')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'equipment_db'
              ? 'bg-brand-500 text-zinc-950 shadow-glow'
              : 'text-zinc-300 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Equipment Inventory {ownedCount > 0 ? `(${ownedCount})` : '(0)'}</span>
        </button>

        <button
          type="button"
          id="fitness-tab-hiit"
          onClick={() => setActiveSubTab('hiit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'hiit'
              ? 'bg-brand-500 text-zinc-950 shadow-glow'
              : 'text-zinc-300 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>HIIT & Tabata Timer</span>
        </button>
      </div>

      {/* =====================================================================
          VIEW 1: DAILY WORKOUT ROUTINES & INTERACTIVE PLAYER
          ===================================================================== */}
      {activeSubTab === 'routine' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-teal/20 text-accent-teal border border-accent-teal/30">
                    {isSimple ? 'DAILY FITNESS & EXERCISES' : 'EQUIPMENT-FILTERED 4-WEEK PERIODIZED SPLIT'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {isSimple ? 'Daily Fitness & Workout Routines' : 'Adaptive Workout Generator & Player'}
                </h1>
                <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                  {isSimple
                    ? 'Guided daily movement routine adapted to your active gym equipment. Mark sets completed and track weights as you go.'
                    : '4-Week periodized athletic training split dynamically generated to match your checked equipment inventory.'}
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
                    Your routines are currently defaulting to pure bodyweight exercises. Check off your gym gear to unlock hundreds of barbell, dumbbell, and cable exercises.
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

      {/* =====================================================================
          VIEW 2: COMPLETE EXERCISE DATABASE BROWSER (3-Tier Hierarchical View)
          ===================================================================== */}
      {activeSubTab === 'exercise_db' && (
        <ExerciseDatabaseBrowser
          onNavigateToEquipment={() => setActiveSubTab('equipment_db')}
        />
      )}

      {/* =====================================================================
          VIEW 3: COMPLETE EQUIPMENT INVENTORY BROWSER (3-Tier Hierarchical View)
          ===================================================================== */}
      {activeSubTab === 'equipment_db' && (
        <EquipmentInventoryBrowser
          onNavigateToExercises={() => setActiveSubTab('exercise_db')}
        />
      )}

      {/* =====================================================================
          VIEW 4: HIIT & TABATA INTERVAL TIMER
          ===================================================================== */}
      {activeSubTab === 'hiit' && (
        <div className="animate-fadeIn">
          <HiitTimer initialWorkSeconds={40} initialRestSeconds={20} initialRounds={8} />
        </div>
      )}
    </div>
  );
};
