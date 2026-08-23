'use client';

import React, { useState } from 'react';
import { WorkoutExerciseSlot } from '@/lib/types';
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
  const [repsInput, setRepsInput] = useState<number>(slot.logged_reps || 10);
  const [weightInput, setWeightInput] = useState<number>(slot.logged_weight_kg || 20);
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
    onSaveSetData(Number(repsInput), Number(weightInput));
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

        {/* Right: Quick Set Logger */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-1.5 bg-surface-300 px-2.5 py-1.5 rounded-xl border border-surface-border text-xs">
            <span className="text-zinc-400 font-mono">Kg:</span>
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(Number(e.target.value))}
              className="w-12 bg-transparent text-zinc-100 font-mono font-bold text-center focus:outline-none"
            />
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-400 font-mono">Reps:</span>
            <input
              type="number"
              value={repsInput}
              onChange={(e) => setRepsInput(Number(e.target.value))}
              className="w-10 bg-transparent text-zinc-100 font-mono font-bold text-center focus:outline-none"
            />
          </div>

          <button
            onClick={handleQuickSave}
            className="p-2 rounded-xl bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-brand-400 transition-colors"
            title="Save set log"
          >
            <Save className="w-4 h-4" />
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
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-xs text-zinc-400 hover:text-brand-400 flex items-center gap-1 font-medium"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showInstructions ? 'Hide Form Technique' : 'Form Technique'}</span>
        </button>
      </div>

      {/* Expanded Technique Instructions */}
      {showInstructions && (
        <div className="mt-3 p-3.5 rounded-xl bg-surface-300/60 border border-surface-border text-xs space-y-2 animate-fadeIn">
          <div className="text-zinc-300 font-medium leading-relaxed">
            {slot.exercise.instructions || 'Execute with controlled 3-second eccentric tempo and explosive contraction.'}
          </div>
          <div className="text-[11px] text-accent-teal flex items-center gap-1 font-mono">
            <span>Mock Video Demo:</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="underline flex items-center gap-1">
              <span>{slot.exercise.video_url_mock}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
