'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { EquipmentType } from '@/lib/types';
import { WorkoutPlayer } from './WorkoutPlayer';
import { HiitTimer } from './HiitTimer';
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
} from 'lucide-react';

export const WorkoutGenerator: React.FC = () => {
  const {
    profile,
    toggleEquipment,
    workoutPlan,
    activeWeek,
    setActiveWeek,
    activeDay,
    setActiveDay,
    toggleExerciseCompleted,
    updateExerciseSetData,
    regenerateWorkouts,
  } = useHealth();

  const [showHiitModal, setShowHiitModal] = useState<boolean>(false);

  const equipmentList: { id: EquipmentType; label: string; desc: string }[] = [
    { id: 'bodyweight', label: 'Bodyweight Only', desc: 'Calisthenics, pushups, pullups & plyometrics' },
    { id: 'dumbbells', label: 'Adjustable Dumbbells', desc: 'Free weights, bench presses, rows & lunges' },
    { id: 'barbells', label: 'Olympic Barbells', desc: 'Heavy compounds, back squats, deadlifts & bench' },
    { id: 'resistance_bands', label: 'Resistance Bands', desc: 'Tension curves, bicep curls & pull-aparts' },
    { id: 'kettlebells', label: 'Kettlebells', desc: 'Explosive hip hinges, swings & carries' },
    { id: 'cable_machine', label: 'Cable Machine / Pulleys', desc: 'Constant tension isolation & lat pulldowns' },
    { id: 'full_gym', label: 'Full Commercial Gym', desc: 'Complete arsenal of free weights & machines' },
  ];

  // Find active day's plan
  const activeDayWorkout = workoutPlan.find(
    (w) => w.week_number === activeWeek && w.day_number === activeDay
  ) || workoutPlan[0];

  const completedCount = activeDayWorkout?.exercises.filter((e) => e.completed).length || 0;
  const totalCount = activeDayWorkout?.exercises.length || 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // Days list (1: Mon -> 7: Sun)
  const daysOfWeek = [
    { dayNum: 1, label: 'Mon', title: 'Push Power' },
    { dayNum: 2, label: 'Tue', title: 'Pull Density' },
    { dayNum: 3, label: 'Wed', title: 'Legs & Quads' },
    { dayNum: 4, label: 'Thu', title: 'HIIT Blitz' },
    { dayNum: 5, label: 'Fri', title: 'Upper Hypertrophy' },
    { dayNum: 6, label: 'Sat', title: 'Active Recovery' },
    { dayNum: 7, label: 'Sun', title: 'Rest & Mobility' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
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
              Dynamically filters all exercises based on your checked equipment matrix. Follow set-by-set progressive overload tracking and integrated HIIT interval timers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHiitModal(!showHiitModal)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all hover:border-zinc-700"
            >
              <Flame className="w-4 h-4 text-brand-400" />
              <span>{showHiitModal ? 'Hide HIIT Timer' : 'Open HIIT Timer'}</span>
            </button>
            <button
              onClick={() => regenerateWorkouts()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Regenerate Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Inventory Matrix Card */}
      <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Available Equipment Matrix</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Check off your available gear. Training movements update in real-time.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-surface-300 text-zinc-300">
            {profile.equipment_inventory.length} Gear Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {equipmentList.map((item) => {
            const isChecked = profile.equipment_inventory.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleEquipment(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  isChecked
                    ? 'bg-gradient-to-b from-brand-500/15 to-accent-teal/5 border-brand-500/50 shadow-glow text-white'
                    : 'bg-surface-200/50 border-surface-border hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-zinc-200">{item.label}</div>
                  <div className="text-[10px] text-zinc-400 leading-snug">{item.desc}</div>
                </div>

                <div className="mt-0.5 ml-2 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-brand-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded HIIT Timer Drawer / Panel */}
      {showHiitModal && (
        <div className="animate-fadeIn">
          <HiitTimer initialWorkSeconds={40} initialRestSeconds={20} initialRounds={8} />
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
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
            const dayCompleted = targetDayPlan?.exercises.every((e) => e.completed) && targetDayPlan?.exercises.length > 0;

            return (
              <button
                key={day.dayNum}
                id={`btn-day-${day.dayNum}`}
                onClick={() => setActiveDay(day.dayNum)}
                className={`p-3 rounded-2xl border text-left transition-all ${
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
              <div className="text-[10px] text-zinc-400">Progressive Overload Active</div>
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
  );
};
