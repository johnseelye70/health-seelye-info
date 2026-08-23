'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import { WorkoutSessionLog } from '@/lib/types';
import {
  Search,
  Calendar,
  Award,
  Flame,
  Clock,
  Dumbbell,
  Printer,
  Trash2,
  ChevronDown,
  ChevronUp,
  Filter,
  BarChart3,
  TrendingUp,
  Scale,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';

export const WorkoutHistoryAnalytics: React.FC = () => {
  const { workoutLogs, deleteWorkoutSessionLog, profile } = useHealth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    const now = Date.now();
    return workoutLogs.filter((log) => {
      // Program filter
      if (selectedProgramFilter !== 'all' && log.program_id !== selectedProgramFilter && log.program_title !== selectedProgramFilter) {
        return false;
      }

      // Date range filter
      if (selectedDateRange !== 'all') {
        const logDate = new Date(log.logged_date).getTime();
        const daysDiff = (now - logDate) / (1000 * 60 * 60 * 24);
        if (selectedDateRange === '7d' && daysDiff > 7) return false;
        if (selectedDateRange === '30d' && daysDiff > 30) return false;
        if (selectedDateRange === '90d' && daysDiff > 90) return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesProg = log.program_title.toLowerCase().includes(q);
        const matchesDay = log.day_title.toLowerCase().includes(q);
        const matchesNotes = (log.notes || '').toLowerCase().includes(q);
        const matchesEx = log.exercises.some((e) => e.exercise_name.toLowerCase().includes(q));
        if (!matchesProg && !matchesDay && !matchesNotes && !matchesEx) return false;
      }

      return true;
    });
  }, [workoutLogs, selectedProgramFilter, selectedDateRange, searchQuery]);

  // Aggregate stats
  const totalVolumeAll = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + (log.total_volume_lbs || 0), 0);
  }, [filteredLogs]);

  const totalSetsAll = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + (log.total_sets_completed || 0), 0);
  }, [filteredLogs]);

  const totalMinutesAll = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
  }, [filteredLogs]);

  // Calculate estimated 1RMs across all logs
  const personalRecords = useMemo(() => {
    const prMap: Record<string, { weightLbs: number; est1RM: number; date: string }> = {};

    workoutLogs.forEach((log) => {
      log.exercises.forEach((ex) => {
        const exName = ex.exercise_name.toLowerCase();
        let key = '';
        if (exName.includes('bench')) key = 'Flat Bench Press';
        else if (exName.includes('squat')) key = 'Barbell Back Squat';
        else if (exName.includes('deadlift')) key = 'Conventional Deadlift';
        else if (exName.includes('overhead press') || exName.includes('ohp')) key = 'Overhead Press';

        if (key) {
          ex.sets.forEach((set) => {
            if (set.completed && set.weight_lbs > 0 && set.reps > 0) {
              // Epley formula: 1RM = Weight * (1 + Reps / 30)
              const est1RM = Math.round(set.weight_lbs * (1 + set.reps / 30));
              if (!prMap[key] || est1RM > prMap[key].est1RM) {
                prMap[key] = {
                  weightLbs: set.weight_lbs,
                  est1RM,
                  date: log.logged_date,
                };
              }
            }
          });
        }
      });
    });

    return prMap;
  }, [workoutLogs]);

  const toggleExpand = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  const handlePrintLogs = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                📊 ONGOING WORKOUT DATABASE & QUERY ENGINE
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {filteredLogs.length} Sessions Logged
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Workout Session History & Performance Analytics
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Query, filter, and inspect your completed workout sessions across P90X, StrongLifts, Tai Chi, and custom splits. Tracks total volume, progressive overload, and estimated 1RM personal records.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto print:hidden">
            <button
              type="button"
              onClick={handlePrintLogs}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Database Report</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border space-y-1 shadow-inner">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Total Workouts</div>
            <div className="text-xl font-black font-mono text-white">
              {filteredLogs.length} Sessions
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {Math.round(totalMinutesAll / 60)} hrs total training
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border space-y-1 shadow-inner">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Total Volume</div>
            <div className="text-xl font-black font-mono text-brand-400">
              {totalVolumeAll.toLocaleString()} lbs
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {Number((totalVolumeAll * 0.453592).toFixed(0)).toLocaleString()} kg
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border space-y-1 shadow-inner">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Sets Completed</div>
            <div className="text-xl font-black font-mono text-emerald-400">
              {totalSetsAll.toLocaleString()} Sets
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">Logged with weights & reps</div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border space-y-1 shadow-inner">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Avg Duration</div>
            <div className="text-xl font-black font-mono text-amber-400">
              {filteredLogs.length > 0 ? Math.round(totalMinutesAll / filteredLogs.length) : 0} min
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">Per session density</div>
          </div>
        </div>

        {/* Personal Records (PR) Tracker */}
        {Object.keys(personalRecords).length > 0 && (
          <div className="p-4 rounded-2xl bg-surface-200/40 border border-surface-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Estimated 1-Rep Max (1RM) Personal Records:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(personalRecords).map(([lift, pr]) => (
                <div
                  key={lift}
                  className="p-3 rounded-xl bg-surface-200 border border-surface-border flex items-center justify-between"
                >
                  <div>
                    <div className="text-[11px] font-bold text-zinc-200 truncate">{lift}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{pr.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black font-mono text-amber-300">
                      {pr.est1RM} lbs
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono">
                      ({Number((pr.est1RM * 0.453592).toFixed(0))} kg)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Database Search & Query Filter Matrix */}
        <div className="pt-2 border-t border-surface-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query workout database by exercise name, program, or notes (e.g. Squat, Bench, P90X)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-200/90 border border-surface-border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Date Range Chips */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Time' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: '90d', label: 'Last 90 Days' },
            ].map((rng) => (
              <button
                key={rng.id}
                type="button"
                onClick={() => setSelectedDateRange(rng.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDateRange === rng.id
                    ? 'bg-brand-500 text-zinc-950 shadow-glow'
                    : 'bg-surface-200 hover:bg-surface-300 text-zinc-300'
                }`}
              >
                {rng.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Results / Workout Sessions Stream */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-surface-100/70 border border-surface-border space-y-2">
            <Dumbbell className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-300">No Workout Sessions Match Query</h4>
            <p className="text-xs text-zinc-500">
              Complete an online workout sheet or adjust your filters to see your recorded sessions.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border hover:border-brand-500/40 transition-all space-y-4 shadow-md print:bg-white print:border-black print:text-black print:rounded-none"
              >
                {/* Session Summary Bar */}
                <div
                  onClick={() => toggleExpand(log.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 print:text-black print:border-black">
                        {log.program_title}
                      </span>
                      <span className="text-xs font-mono text-zinc-400 print:text-gray-700">
                        {log.logged_date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white print:text-black">
                      {log.day_title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-sm font-black text-brand-400 print:text-black">
                        {log.total_volume_lbs.toLocaleString()} lbs
                      </div>
                      <div className="text-[11px] text-zinc-400 print:text-gray-700">
                        {log.total_sets_completed} Sets • {log.duration_minutes} min
                      </div>
                    </div>

                    <div className="p-1 rounded-xl bg-surface-200 text-zinc-400 print:hidden">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Session Details & Exercise Breakdown */}
                {isExpanded && (
                  <div className="pt-4 border-t border-surface-border/60 space-y-4 animate-fadeIn print:block">
                    {/* Exercise Breakdown Table */}
                    <div className="space-y-3">
                      {log.exercises.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3.5 rounded-2xl bg-surface-200/50 border border-surface-border/60 space-y-2 print:bg-white print:border-gray-400"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-zinc-200 print:text-black">
                              {exIdx + 1}. {ex.exercise_name}
                            </span>
                            <span className="font-mono text-zinc-400 uppercase text-[10px] print:text-gray-700">
                              {ex.target_muscle}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {ex.sets.map((set) => (
                              <span
                                key={set.set_number}
                                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1 ${
                                  set.completed
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 print:text-black print:border-black'
                                    : 'bg-surface-300 text-zinc-400 border-surface-border'
                                }`}
                              >
                                <span>Set {set.set_number}:</span>
                                <span>{set.reps} reps</span>
                                {set.weight_lbs > 0 && <span>@ {set.weight_lbs} lbs</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes recorded */}
                    {log.notes && (
                      <div className="p-3 rounded-2xl bg-surface-200/30 border border-surface-border text-xs text-zinc-300 leading-relaxed font-mono print:text-black">
                        <strong>Notes:</strong> {log.notes}
                      </div>
                    )}

                    {/* Log Actions */}
                    <div className="pt-2 flex items-center justify-between print:hidden">
                      <button
                        type="button"
                        onClick={() => deleteWorkoutSessionLog(log.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Log</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Summary</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
