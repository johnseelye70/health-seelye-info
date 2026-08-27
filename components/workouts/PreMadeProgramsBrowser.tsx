'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import { PreMadeWorkoutProgram, WorkoutProgramDay } from '@/lib/types';
import { PREMADE_WORKOUT_PROGRAMS } from '@/lib/premade-programs';
import { WorkoutSheetModal } from './WorkoutSheetModal';
import {
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
  Calendar,
  Clock,
  Printer,
  FileText,
  Dumbbell,
  Check,
  Zap,
  Info,
  Play,
  Award,
  Search,
  X,
  Boxes,
  ExternalLink,
} from 'lucide-react';

export const PreMadeProgramsBrowser: React.FC = () => {
  const { profile, activeProgramId, setActiveProgramId } = useHealth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProgramModal, setActiveProgramModal] = useState<PreMadeWorkoutProgram | null>(null);
  const [activeSheetDay, setActiveSheetDay] = useState<{
    program: PreMadeWorkoutProgram;
    day: WorkoutProgramDay;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrograms = useMemo(() => {
    return PREMADE_WORKOUT_PROGRAMS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSub = p.subtitle.toLowerCase().includes(q);
        const matchesCreator = p.creator.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSub && !matchesCreator && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenProgram = (prog: PreMadeWorkoutProgram) => {
    setActiveProgramModal(prog);
  };

  const handleOpenSheet = (prog: PreMadeWorkoutProgram, day: WorkoutProgramDay) => {
    setActiveSheetDay({ program: prog, day });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                🏆 PRE-DONE WORKOUT PROGRAMS & WORKSHEET LIBRARY
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {PREMADE_WORKOUT_PROGRAMS.length} Master Programs Available
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              World-Class Pre-Made Workout Programs & Daily Tracking Sheets
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
              Click on any training program below to open its complete schedule of daily routines, complete interactive worksheets online, save logs to your workout history, or generate clean high-contrast printable sheets.
            </p>
          </div>
        </div>

        {/* Category Pills & Search */}
        <div className="pt-3 border-t border-surface-border/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'crossfit_benchmarks', label: 'CrossFit® (The Girls & Heroes)' },
              { id: 'p90x_series', label: 'P90X Series (1/2/3)' },
              { id: 'beachbody_classic', label: 'Insanity & Beachbody' },
              { id: 'strength_powerlifting', label: 'Strength & 5x5 / Barbell' },
              { id: 'bodybuilding_splits', label: 'Hypertrophy & PPL' },
              { id: 'mind_body_longevity', label: 'Tai Chi & Mobility' },
              { id: 'hybrid_endurance', label: 'Rowing & Hybrid (Concept2 & HYROX)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                id={`cat-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-brand-500 text-zinc-950 shadow-glow'
                    : 'bg-surface-200 hover:bg-surface-300 text-zinc-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              id="search-programs-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs (P90X, Fran, Squat)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map((prog) => {
          const isUserActive = activeProgramId === prog.id;

          return (
            <div
              key={prog.id}
              onClick={() => handleOpenProgram(prog)}
              className="p-5 rounded-3xl border border-surface-border bg-surface-100/80 hover:bg-surface-100 hover:border-brand-500/60 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:scale-[1.01] group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-surface-200/90 border border-surface-border group-hover:scale-110 transition-transform">
                    {prog.icon}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isUserActive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ACTIVE
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-surface-200 text-zinc-300 border border-surface-border uppercase">
                      {prog.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-zinc-100 group-hover:text-brand-300 transition-colors">
                  {prog.title}
                </h3>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">{prog.subtitle}</div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">By {prog.creator}</div>

                <p className="text-xs text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span>{prog.duration_weeks} Wks</span>
                  <span>•</span>
                  <span>{prog.days_per_week} Days/Wk</span>
                </div>
                <div className="text-brand-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Open {prog.schedule.length} Sheets</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MODAL WINDOW 1: PROGRAM SCHEDULE & WORKSHEETS MODAL
          ========================================================================= */}
      {activeProgramModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveProgramModal(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-surface-100 border border-surface-border shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-surface-200/90 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1.5 rounded-xl bg-surface-300 border border-surface-border">
                    {activeProgramModal.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-white">
                        {activeProgramModal.title}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-surface-300 text-zinc-300 border border-surface-border uppercase">
                        {activeProgramModal.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">
                      By {activeProgramModal.creator} • {activeProgramModal.duration_weeks} Weeks •{' '}
                      {activeProgramModal.days_per_week} Days/Wk
                    </p>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveProgramId(activeProgramModal.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-glow cursor-pointer active:scale-95 ${
                    activeProgramId === activeProgramModal.id
                      ? 'bg-emerald-500 text-zinc-950 font-black'
                      : 'bg-brand-500 hover:bg-brand-400 text-zinc-950'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {activeProgramId === activeProgramModal.id
                      ? '✓ Active Routine'
                      : 'Set as Active Routine'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveProgramModal(null)}
                  className="p-2 rounded-xl hover:bg-surface-300 text-zinc-400 hover:text-white cursor-pointer transition-all"
                  title="Close window"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Program Overview & Worksheets List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Program Description Box */}
              <div className="p-4 rounded-2xl bg-surface-200/50 border border-surface-border text-xs text-zinc-300 leading-relaxed">
                <p>{activeProgramModal.description}</p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">
                    Required Equipment:
                  </span>
                  {activeProgramModal.equipment_needed.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-surface-300 text-zinc-200 text-[11px] font-mono capitalize border border-surface-border"
                    >
                      {eq.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Worksheets Header */}
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                    Daily Worksheets ({activeProgramModal.schedule.length} Sessions)
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  Click any sheet to log online or print
                </span>
              </div>

              {/* Worksheets Grid List */}
              <div className="grid grid-cols-1 gap-3">
                {activeProgramModal.schedule.map((day) => (
                  <div
                    key={day.day_number}
                    className="p-4 rounded-2xl bg-surface-200/60 hover:bg-surface-200 border border-surface-border hover:border-brand-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          Day {day.day_number}
                        </span>
                        <h4 className="text-sm font-bold text-white">{day.day_title}</h4>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Focus: <span className="text-zinc-300">{day.focus}</span> •{' '}
                        {day.duration_minutes} min • {day.exercises.length} Movements
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenSheet(activeProgramModal, day)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-black shadow-glow transition-all cursor-pointer active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open Worksheet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleOpenSheet(activeProgramModal, day);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="p-2 rounded-xl bg-surface-300 hover:bg-surface-border text-zinc-300 hover:text-white transition-all cursor-pointer"
                        title="Print this sheet"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-surface-200/90 border-t border-surface-border flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">
                {activeProgramModal.schedule.length} workout sheets ready for logging
              </span>
              <button
                type="button"
                onClick={() => setActiveProgramModal(null)}
                className="px-4 py-2 rounded-xl bg-surface-300 hover:bg-surface-border text-zinc-200 text-xs font-bold cursor-pointer transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL WINDOW 2: INTERACTIVE & PRINTABLE WORKOUT SHEET (ON TOP OF PROGRAM MODAL)
          ========================================================================= */}
      {activeSheetDay && (
        <WorkoutSheetModal
          program={activeSheetDay.program}
          day={activeSheetDay.day}
          onClose={() => setActiveSheetDay(null)}
        />
      )}
    </div>
  );
};
