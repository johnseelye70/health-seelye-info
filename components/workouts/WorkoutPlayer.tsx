'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { WorkoutExerciseSlot } from '@/lib/types';
import { kgToLbs, lbsToKg } from '@/lib/units';
import {
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  ExternalLink,
  Save,
  Dumbbell,
  Timer,
  X,
} from 'lucide-react';

interface WorkoutPlayerProps {
  slot: WorkoutExerciseSlot;
  dayId: string;
  onToggleComplete: () => void;
  onSaveSetData: (reps: number, weightKg: number) => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  slot,
  dayId,
  onToggleComplete,
  onSaveSetData,
}) => {
  const { profile } = useHealth();
  const isImperial = profile.unit_preference === 'imperial';

  const defaultWeight = isImperial
    ? kgToLbs(slot.logged_weight_kg || 20)
    : slot.logged_weight_kg || 20;

  const [repsInput, setRepsInput] = useState<number>(slot.logged_reps || 10);
  const [weightInput, setWeightInput] = useState<number>(defaultWeight);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Set-by-set state matrix
  const setsCount = slot.target_sets || 3;
  const [setsState, setSetsState] = useState<{ setNum: number; reps: number; weight: number; done: boolean }[]>(() =>
    Array.from({ length: setsCount }, (_, i) => ({
      setNum: i + 1,
      reps: slot.logged_reps || 10,
      weight: slot.logged_weight_kg || 20,
      done: slot.completed,
    }))
  );

  const handleToggleSet = (index: number) => {
    setSetsState((prev) => {
      const next = [...prev];
      next[index].done = !next[index].done;
      const allDone = next.every((s) => s.done);
      if (allDone && !slot.completed) {
        onToggleComplete();
      }
      return next;
    });
  };

  const handleQuickSave = () => {
    const weightKg = isImperial ? lbsToKg(Number(weightInput)) : Number(weightInput);
    onSaveSetData(Number(repsInput), weightKg);
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        slot.completed
          ? 'bg-brand-950/20 border-brand-500/30 text-zinc-300'
          : 'bg-surface-200/70 border-surface-border hover:border-zinc-700 text-zinc-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Exercise Name & Specs */}
        <div className="flex items-start gap-3">
          <button
            onClick={onToggleComplete}
            className="mt-0.5 p-1 rounded-lg text-brand-400 hover:text-brand-300 transition-colors"
          >
            {slot.completed ? (
              <CheckCircle2 className="w-6 h-6 text-brand-400" />
            ) : (
              <Circle className="w-6 h-6 text-zinc-500" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h4 className={`text-sm font-bold ${slot.completed ? 'line-through text-zinc-400' : 'text-zinc-100'}`}>
                {slot.exercise.name}
              </h4>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface-300 text-brand-300">
                {slot.exercise.target_muscle.replace('_', ' ')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1 font-mono">
              <span>🎯 Target: <strong>{slot.target_sets} Sets</strong> × <strong>{slot.target_reps}</strong></span>
              <span>•</span>
              <span>⏳ Rest: {slot.rest_seconds}s</span>
              <span>•</span>
              <span className="capitalize">{slot.exercise.equipment_required.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Set Logger with Large Touch Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-1.5 bg-surface-300/90 p-1.5 rounded-2xl border border-surface-border">
            <span className="text-[11px] font-mono text-zinc-400 font-bold pl-1">{isImperial ? 'Lbs' : 'Kg'}</span>
            <button
              type="button"
              onClick={() => setWeightInput((prev) => Math.max(0, Number((prev - (isImperial ? 5 : 2.5)).toFixed(1))))}
              className="w-7 h-7 rounded-lg bg-surface-200 hover:bg-surface-400 text-zinc-200 font-bold flex items-center justify-center text-xs active:scale-95 transition-all cursor-pointer"
              title="Decrease weight"
            >
              -
            </button>
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(Number(e.target.value))}
              className="w-12 bg-transparent text-zinc-100 font-mono font-bold text-center text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setWeightInput((prev) => Number((prev + (isImperial ? 5 : 2.5)).toFixed(1)))}
              className="w-7 h-7 rounded-lg bg-brand-500/20 hover:bg-brand-500 hover:text-zinc-950 text-brand-300 font-bold flex items-center justify-center text-xs active:scale-95 transition-all cursor-pointer"
              title="Increase weight"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-300/90 p-1.5 rounded-2xl border border-surface-border">
            <span className="text-[11px] font-mono text-zinc-400 font-bold pl-1">Reps</span>
            <button
              type="button"
              onClick={() => setRepsInput((prev) => Math.max(1, prev - 1))}
              className="w-7 h-7 rounded-lg bg-surface-200 hover:bg-surface-400 text-zinc-200 font-bold flex items-center justify-center text-xs active:scale-95 transition-all cursor-pointer"
              title="Decrease reps"
            >
              -
            </button>
            <input
              type="number"
              value={repsInput}
              onChange={(e) => setRepsInput(Number(e.target.value))}
              className="w-8 bg-transparent text-zinc-100 font-mono font-bold text-center text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setRepsInput((prev) => prev + 1)}
              className="w-7 h-7 rounded-lg bg-brand-500/20 hover:bg-brand-500 hover:text-zinc-950 text-brand-300 font-bold flex items-center justify-center text-xs active:scale-95 transition-all cursor-pointer"
              title="Increase reps"
            >
              +
            </button>
          </div>

          <button
            onClick={handleQuickSave}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-glow active:scale-95 cursor-pointer transition-all"
            title="Save set log"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Set-by-Set Checkbox Row */}
      <div className="mt-4 pt-3 border-t border-surface-border/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Sets:</span>
          {setsState.map((set, idx) => (
            <button
              key={idx}
              onClick={() => handleToggleSet(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                set.done
                  ? 'bg-brand-500 text-zinc-950 shadow-glow'
                  : 'bg-surface-300 text-zinc-400 hover:bg-surface-200'
              }`}
            >
              Set {set.setNum} {set.done && '✓'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowInstructions(true)}
          className="text-xs text-brand-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer active:scale-95 transition-all"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Form Technique & Video</span>
        </button>
      </div>

      {/* Modal Window: Exercise Technique & Movement Cues */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">{slot.exercise.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-surface-200 text-zinc-300 font-mono font-semibold">
                  Target: {slot.exercise.target_muscle}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono font-semibold">
                  {slot.target_sets} Sets × {slot.target_reps} Reps
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-200/60 border border-surface-border text-zinc-300 font-medium leading-relaxed">
                {slot.exercise.instructions || 'Execute with controlled 3-second eccentric tempo and explosive contraction.'}
              </div>

              <div className="p-3 rounded-2xl bg-surface-300/80 border border-surface-border text-[11px] text-accent-teal flex items-center justify-between font-mono">
                <span>Video Demonstration:</span>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="underline flex items-center gap-1 text-accent-cyan hover:text-cyan-300"
                >
                  <span>{slot.exercise.video_url_mock}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold text-xs shadow-glow cursor-pointer active:scale-95"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
