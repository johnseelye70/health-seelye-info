'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { PreMadeWorkoutProgram, WorkoutProgramDay, CompletedExerciseLog, CompletedSetLog } from '@/lib/types';
import {
  Printer,
  Save,
  X,
  Check,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Flame,
  Calendar,
  Clock,
  Sparkles,
  Info,
  Layers,
  Scale,
  Award,
} from 'lucide-react';
import { CalendarDatePicker } from '@/components/ui/CalendarDatePicker';

interface WorkoutSheetModalProps {
  program: PreMadeWorkoutProgram;
  day: WorkoutProgramDay;
  onClose: () => void;
}

export const WorkoutSheetModal: React.FC<WorkoutSheetModalProps> = ({
  program,
  day,
  onClose,
}) => {
  const { profile, saveWorkoutSessionLog } = useHealth();

  const [loggedDate, setLoggedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(day.duration_minutes || 45);
  const [energyRating, setEnergyRating] = useState<number>(5);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Initialize interactive exercise sheet rows
  const [exerciseRows, setExerciseRows] = useState<CompletedExerciseLog[]>(() =>
    day.exercises.map((ex) => ({
      exercise_id: ex.id,
      exercise_name: ex.name,
      target_muscle: ex.target_muscle,
      notes: '',
      sets: Array.from({ length: ex.suggested_sets || 3 }).map((_, idx) => ({
        set_number: idx + 1,
        reps: Number(ex.suggested_reps?.split('–')[0]?.replace(/\D/g, '')) || 10,
        weight_lbs: 0,
        rpe: 8,
        completed: false,
      })),
    }))
  );

  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    setExerciseRows((prev) => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      const sets = [...ex.sets];
      sets[setIdx] = { ...sets[setIdx], completed: !sets[setIdx].completed };
      ex.sets = sets;
      updated[exIdx] = ex;
      return updated;
    });
  };

  const updateSetField = (
    exIdx: number,
    setIdx: number,
    field: 'reps' | 'weight_lbs' | 'rpe',
    value: number
  ) => {
    setExerciseRows((prev) => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      const sets = [...ex.sets];
      sets[setIdx] = { ...sets[setIdx], [field]: Math.max(0, value) };
      ex.sets = sets;
      updated[exIdx] = ex;
      return updated;
    });
  };

  const addSetToExercise = (exIdx: number) => {
    setExerciseRows((prev) => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: CompletedSetLog = {
        set_number: ex.sets.length + 1,
        reps: lastSet ? lastSet.reps : 10,
        weight_lbs: lastSet ? lastSet.weight_lbs : 0,
        rpe: 8,
        completed: false,
      };
      ex.sets = [...ex.sets, newSet];
      updated[exIdx] = ex;
      return updated;
    });
  };

  const removeSetFromExercise = (exIdx: number, setIdx: number) => {
    setExerciseRows((prev) => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      if (ex.sets.length <= 1) return prev;
      ex.sets = ex.sets.filter((_, i) => i !== setIdx).map((s, i) => ({ ...s, set_number: i + 1 }));
      updated[exIdx] = ex;
      return updated;
    });
  };

  // Calculate live volume and completion
  let totalVolumeLbs = 0;
  let totalCompletedSets = 0;
  let totalPossibleSets = 0;

  exerciseRows.forEach((ex) => {
    ex.sets.forEach((set) => {
      totalPossibleSets++;
      if (set.completed) {
        totalCompletedSets++;
        totalVolumeLbs += set.reps * (set.weight_lbs || 0);
      }
    });
  });

  const handleSaveWorkoutSession = () => {
    saveWorkoutSessionLog({
      program_id: program.id,
      program_title: program.title,
      day_title: day.day_title,
      logged_date: loggedDate,
      duration_minutes: durationMinutes,
      total_volume_lbs: totalVolumeLbs,
      total_sets_completed: totalCompletedSets,
      exercises: exerciseRows,
      notes: sessionNotes,
      energy_rating: energyRating,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-surface-100 border border-surface-border shadow-2xl overflow-hidden animate-scaleUp print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:max-h-none print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable & Interactive Header */}
        <div className="p-5 sm:p-6 bg-surface-200/90 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none print:bg-white print:border-b-2 print:border-black print:pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 print:text-black print:border-black">
                {program.title}
              </span>
              <span className="text-xs text-zinc-400 font-mono print:text-gray-700">
                Day {day.day_number}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
              {day.day_title}
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5 print:text-gray-700">
              Focus: {day.focus} • Estimated Duration: {day.duration_minutes} min
            </p>
          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="flex items-center gap-2 print:hidden self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-300 hover:bg-surface-border text-zinc-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Print clean manual workout sheet"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>

            <button
              type="button"
              onClick={handleSaveWorkoutSession}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-400 text-zinc-950 text-xs font-black shadow-glow transition-all cursor-pointer active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Database!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Session</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-300 text-zinc-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print-Only Top Metadata Header (Visible only on paper/PDF print) */}
        <div className="hidden print:block p-4 border-b border-gray-300 text-xs font-mono space-y-2">
          <div className="text-center font-bold text-base mb-2">
            SEELYE FAMILY HEALTH — DAILY WORKOUT SHEET
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <strong>Logged-on User:</strong> {profile.full_name || 'Athlete'}
            </div>
            <div>
              <strong>Date:</strong> {loggedDate}
            </div>
            <div>
              <strong>Duration:</strong> {durationMinutes} min
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 print:overflow-visible print:p-2">
          {/* Metadata Controls Bar (Interactive) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
            <div>
              <CalendarDatePicker
                value={loggedDate}
                onChange={setLoggedDate}
                label="Session Date"
              />
            </div>

            <div className="p-3 rounded-2xl bg-surface-200/60 border border-surface-border flex items-center gap-3">
              <Clock className="w-4 h-4 text-accent-cyan" />
              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-mono font-bold text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-200/60 border border-surface-border flex items-center gap-3">
              <Flame className="w-4 h-4 text-amber-400" />
              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Energy & Exertion (1–5)
                </label>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEnergyRating(lvl)}
                      className={`w-6 h-6 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        energyRating >= lvl
                          ? 'bg-amber-500 text-zinc-950 font-black'
                          : 'bg-surface-300 text-zinc-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Session Summary KPIs */}
          <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between gap-4 flex-wrap print:hidden shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400">Total Volume</div>
                <div className="text-base font-mono font-black text-brand-400">
                  {totalVolumeLbs.toLocaleString()} lbs
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400">Sets Completed</div>
                <div className="text-base font-mono font-black text-emerald-400">
                  {totalCompletedSets} / {totalPossibleSets} Sets
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Progress</div>
              <div className="text-base font-mono font-black text-zinc-200">
                {totalPossibleSets > 0
                  ? `${Math.round((totalCompletedSets / totalPossibleSets) * 100)}%`
                  : '0%'}
              </div>
            </div>
          </div>

          {/* Exercises Workout Sheet Table */}
          <div className="space-y-6">
            {exerciseRows.map((ex, exIdx) => {
              const template = day.exercises[exIdx];

              return (
                <div
                  key={ex.exercise_id}
                  className="p-4 sm:p-5 rounded-3xl bg-surface-200/40 border border-surface-border space-y-3 print:bg-white print:border print:border-gray-400 print:rounded-none print:p-3 print:break-inside-avoid"
                >
                  {/* Exercise Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-border/60 print:border-black">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 text-xs font-mono font-bold flex items-center justify-center print:border print:border-black print:text-black">
                          {exIdx + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white print:text-black">
                          {ex.exercise_name}
                        </h3>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5 print:text-gray-700 ml-8">
                        Target: <span className="capitalize">{ex.target_muscle}</span> • Guide:{' '}
                        {template?.suggested_sets} sets × {template?.suggested_reps}
                        {template?.suggested_weight_guide && ` (${template.suggested_weight_guide})`}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addSetToExercise(exIdx)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-[11px] font-bold text-zinc-300 hover:text-white print:hidden cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5 text-brand-400" />
                      <span>Add Set</span>
                    </button>
                  </div>

                  {/* Sets Grid - Mobile Fixed Table */}
                  <div className="w-full">
                    <table className="mobile-fixed-table table-fixed w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-surface-border text-[9px] sm:text-[10px] text-zinc-400 uppercase font-mono print:text-black print:border-black">
                          <th className="py-1.5 px-1 sm:py-2 sm:px-2.5 w-[18%] sm:w-16">Set</th>
                          <th className="py-1.5 px-1 sm:py-2 sm:px-2.5 w-[26%] sm:w-24">Reps</th>
                          <th className="py-1.5 px-1 sm:py-2 sm:px-2.5 w-[32%] sm:w-28">Weight</th>
                          <th className="py-1.5 px-1 sm:py-2 sm:px-2.5 w-[14%] sm:w-20 hidden xs:table-cell">RPE</th>
                          <th className="py-1.5 px-1 sm:py-2 sm:px-2.5 w-[14%] sm:w-16 text-center print:hidden">Done</th>
                          <th className="py-1.5 px-1 sm:py-2 sm:px-2.5 w-[8%] sm:w-10 print:hidden"></th>
                          <th className="py-1.5 px-1 sm:py-2 sm:px-2.5 hidden print:table-cell w-24">Check (✓)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border/40 print:divide-gray-300">
                        {ex.sets.map((set, setIdx) => (
                          <tr
                            key={set.set_number}
                            className={`transition-colors ${
                              set.completed
                                ? 'bg-brand-500/10 print:bg-transparent'
                                : 'hover:bg-surface-200/40'
                            }`}
                          >
                            <td className="py-1.5 px-1 sm:py-2 sm:px-2.5 font-mono font-bold text-zinc-300 print:text-black text-[11px] sm:text-xs">
                              #{set.set_number}
                            </td>

                            {/* Reps Input */}
                            <td className="py-1.5 px-1 sm:py-2 sm:px-2.5">
                              <input
                                type="number"
                                value={set.reps}
                                onChange={(e) =>
                                  updateSetField(exIdx, setIdx, 'reps', Number(e.target.value))
                                }
                                className="w-full max-w-[4rem] sm:max-w-[5rem] px-1 sm:px-2 py-1 rounded-lg bg-surface-200 border border-surface-border text-zinc-100 font-mono font-bold text-center text-xs focus:outline-none focus:border-brand-500 print:bg-white print:border-black print:text-black"
                              />
                            </td>

                            {/* Weight Input */}
                            <td className="py-1.5 px-1 sm:py-2 sm:px-2.5">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={set.weight_lbs}
                                  onChange={(e) =>
                                    updateSetField(
                                      exIdx,
                                      setIdx,
                                      'weight_lbs',
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-full max-w-[3.8rem] sm:max-w-[4.8rem] px-1 sm:px-2 py-1 rounded-lg bg-surface-200 border border-surface-border text-zinc-100 font-mono font-bold text-center text-xs focus:outline-none focus:border-brand-500 print:bg-white print:border-black print:text-black"
                                />
                                <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono print:text-black">
                                  lbs
                                </span>
                              </div>
                            </td>

                            {/* RPE Input */}
                            <td className="py-1.5 px-1 sm:py-2 sm:px-2.5 hidden xs:table-cell">
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={set.rpe || 8}
                                onChange={(e) =>
                                  updateSetField(exIdx, setIdx, 'rpe', Number(e.target.value))
                                }
                                className="w-full max-w-[3rem] px-1 py-1 rounded-lg bg-surface-200 border border-surface-border text-zinc-100 font-mono text-center text-xs focus:outline-none print:bg-white print:border-black print:text-black"
                              />
                            </td>

                            {/* Completed Toggle */}
                            <td className="py-1.5 px-1 sm:py-2 sm:px-2.5 text-center print:hidden">
                              <button
                                type="button"
                                onClick={() => toggleSetComplete(exIdx, setIdx)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center mx-auto ${
                                  set.completed
                                    ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-glow'
                                    : 'bg-surface-200 border-surface-border text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                {set.completed ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </td>

                            {/* Delete Set */}
                            <td className="py-1.5 px-0.5 sm:py-2 sm:px-2.5 text-right print:hidden">
                              {ex.sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSetFromExercise(exIdx, setIdx)}
                                  className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer min-w-[24px] min-h-[24px] flex items-center justify-center ml-auto"
                                  title="Delete set"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                              )}
                            </td>

                            {/* Print-Only Check Box Column */}
                            <td className="py-1.5 px-2 hidden print:table-cell border border-black text-center">
                              [ ]
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Session Notes */}
          <div className="p-4 rounded-3xl bg-surface-200/40 border border-surface-border space-y-2 print:border print:border-black print:rounded-none">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block print:text-black">
              📝 Workout Notes & Observations:
            </label>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Record form cues, energy levels, personal records, or adjustments for next session..."
              rows={3}
              className="w-full p-3 rounded-2xl bg-surface-200/80 border border-surface-border text-xs text-zinc-100 focus:outline-none focus:border-brand-500 print:bg-white print:text-black print:border-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 bg-surface-200/90 border-t border-surface-border flex items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-surface-300 hover:bg-surface-border text-zinc-300 hover:text-white text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-300 hover:bg-surface-border text-zinc-200 text-xs font-bold cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>

            <button
              type="button"
              onClick={handleSaveWorkoutSession}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-black shadow-glow cursor-pointer transition-all active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save to Workout History</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
