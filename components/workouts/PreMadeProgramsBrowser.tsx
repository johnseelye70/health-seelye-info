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
} from 'lucide-react';

export const PreMadeProgramsBrowser: React.FC = () => {
  const { profile, activeProgramId, setActiveProgramId } = useHealth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<PreMadeWorkoutProgram | null>(
    PREMADE_WORKOUT_PROGRAMS[0]
  );
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                🏆 RENOWNED TRAINING PROGRAMS & WORKOUT SHEETS
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Pre-Done Workout Programs & Printable Tracking Sheets
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Follow world-renowned workout protocols like <strong>P90X</strong>, <strong>P90X2</strong>, <strong>P90X3</strong>, <strong>StrongLifts 5x5</strong>, <strong>Tai Chi 24-Form</strong>, and <strong>Arnold Golden Six</strong>. Complete sheets online or print them out for manual logging.
            </p>
          </div>

          {selectedProgram && (
            <button
              type="button"
              onClick={() => setActiveProgramId(selectedProgram.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-glow cursor-pointer active:scale-95 self-start md:self-auto ${
                activeProgramId === selectedProgram.id
                  ? 'bg-emerald-500 text-zinc-950 font-black'
                  : 'bg-brand-500 hover:bg-brand-400 text-zinc-950'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {activeProgramId === selectedProgram.id
                  ? '✓ Active Training Program'
                  : 'Set as Active Routine'}
              </span>
            </button>
          )}
        </div>

        {/* Category Pills & Search */}
        <div className="pt-3 border-t border-surface-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'p90x_series', label: 'P90X Series' },
              { id: 'strength_powerlifting', label: 'Strength & 5x5' },
              { id: 'mind_body_longevity', label: 'Tai Chi & Longevity' },
              { id: 'bodybuilding_splits', label: 'Bodybuilding Splits' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map((prog) => {
          const isSelected = selectedProgram?.id === prog.id;
          const isUserActive = activeProgramId === prog.id;

          return (
            <div
              key={prog.id}
              onClick={() => setSelectedProgram(prog)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:scale-[1.01] ${
                isSelected
                  ? 'bg-surface-100 border-brand-500 shadow-glow text-white'
                  : 'bg-surface-100/70 border-surface-border hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-surface-200/90 border border-surface-border">
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

                <h3 className="text-base font-bold text-zinc-100">{prog.title}</h3>
                <div className="text-xs text-brand-300 font-medium mt-0.5">{prog.subtitle}</div>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5">By {prog.creator}</div>

                <p className="text-xs text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <span>{prog.duration_weeks} Weeks</span>
                  <span>•</span>
                  <span>{prog.days_per_week} Days/Wk</span>
                </div>
                <div className="text-brand-400 font-bold flex items-center gap-1">
                  <span>{prog.schedule.length} Sheets</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Program Detailed Schedule & Daily Workout Sheets */}
      {selectedProgram && (
        <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedProgram.icon}</span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {selectedProgram.title} Schedule & Workout Sheets
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Click on any session below to open the <strong>Interactive Online Workout Sheet</strong> or generate a <strong>Clean Printable Sheet</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-surface-200 text-zinc-300 border border-surface-border">
                {selectedProgram.schedule.length} Workout Sessions
              </span>
            </div>
          </div>

          {/* Daily Schedule List */}
          <div className="space-y-3">
            {selectedProgram.schedule.map((day) => (
              <div
                key={day.day_number}
                className="p-4 sm:p-5 rounded-2xl bg-surface-200/50 hover:bg-surface-200/90 border border-surface-border hover:border-brand-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300">
                      Day {day.day_number}
                    </span>
                    <h4 className="text-sm font-bold text-white">{day.day_title}</h4>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    Focus: <span className="text-zinc-300">{day.focus}</span> • {day.duration_minutes} min •{' '}
                    {day.exercises.length} Exercises
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSheetDay({ program: selectedProgram, day })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-bold shadow-glow transition-all cursor-pointer active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Workout Sheet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSheetDay({ program: selectedProgram, day });
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
      )}

      {/* Active Workout Sheet Modal Window */}
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
