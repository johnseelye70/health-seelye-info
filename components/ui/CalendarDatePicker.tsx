'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';

interface CalendarDatePickerProps {
  value: string; // ISO date format: "YYYY-MM-DD"
  onChange: (newDate: string) => void;
  label?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
  quickPicks?: boolean;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  className = '',
  quickPicks = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or fallback to today
  const selectedDateObj = useMemo(() => {
    if (!value) return new Date();
    const [y, m, d] = value.split('-').map((num) => parseInt(num, 10));
    return new Date(y, m - 1, d);
  }, [value]);

  // Current browsing month in the calendar dropdown
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    if (!value) return new Date();
    const [y, m, d] = value.split('-').map((num) => parseInt(num, 10));
    return new Date(y, m - 1, 1);
  });

  // Sync viewMonth when value changes externally
  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-').map((num) => parseInt(num, 10));
      setViewMonth(new Date(y, m - 1, 1));
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Format display label
  const formattedDisplay = useMemo(() => {
    if (!value) return 'Select Date';
    const d = selectedDateObj;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [value, selectedDateObj]);

  // Today ISO string
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  // Quick Pick Presets
  const presets = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const makeIso = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    // Tomorrow
    const tmrw = new Date(now);
    tmrw.setDate(now.getDate() + 1);

    // Next Monday
    const dayOfWeek = now.getDay();
    const daysUntilNextMon = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
    const nextMon = new Date(now);
    nextMon.setDate(now.getDate() + (daysUntilNextMon === 0 ? 7 : daysUntilNextMon));

    // +7 Days
    const in7 = new Date(now);
    in7.setDate(now.getDate() + 7);

    // +14 Days
    const in14 = new Date(now);
    in14.setDate(now.getDate() + 14);

    return [
      { label: 'Today', dateStr: makeIso(now) },
      { label: 'Tomorrow', dateStr: makeIso(tmrw) },
      { label: 'Next Monday', dateStr: makeIso(nextMon) },
      { label: '+7 Days', dateStr: makeIso(in7) },
      { label: '+14 Days', dateStr: makeIso(in14) },
    ];
  }, []);

  // Month Matrix Computation
  const monthMatrix = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay(); // 0 = Sun
    const totalDays = lastDay.getDate();

    const cells: ({ dateStr: string; dayNum: number; isCurrentMonth: boolean } | null)[] = [];

    // Leading empty slots
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(null);
    }

    // Days
    for (let d = 1; d <= totalDays; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      cells.push({
        dateStr: `${year}-${mStr}-${dStr}`,
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    return cells;
  }, [viewMonth]);

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {label && <label className="text-xs text-zinc-400 font-semibold block mb-1">{label}</label>}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border hover:border-brand-500/50 text-foreground text-xs font-semibold transition-all shadow-sm cursor-pointer group"
      >
        <div className="flex items-center gap-2 truncate">
          <Calendar className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform flex-shrink-0" />
          <span className="truncate font-mono font-medium">{formattedDisplay}</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-surface-200 px-1.5 py-0.5 rounded border border-surface-border/60">
          Pick
        </span>
      </button>

      {/* Calendar Dropdown Popover (100% Solid Opaque Background) */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-full min-w-[290px] sm:min-w-[320px] p-3.5 rounded-2xl bg-zinc-950 border border-zinc-700 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-3 animate-fadeIn">
          {/* Quick Picks Row */}
          {quickPicks && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800 text-[11px]">
              {presets.map((preset) => {
                const isSelected = preset.dateStr === value;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectDate(preset.dateStr)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-500 text-zinc-950 shadow-glow'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Month & Year Navigation Header */}
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-zinc-100">
              {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const prev = new Date(viewMonth);
                  prev.setMonth(prev.getMonth() - 1);
                  setViewMonth(prev);
                }}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = new Date(viewMonth);
                  next.setMonth(next.getMonth() + 1);
                  setViewMonth(next);
                }}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday Column Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-400 uppercase py-0.5">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {monthMatrix.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-7 w-7" />;
              }

              const isSelected = cell.dateStr === value;
              const isToday = cell.dateStr === todayStr;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => handleSelectDate(cell.dateStr)}
                  className={`h-7 w-7 sm:h-8 sm:w-8 mx-auto rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-500 text-zinc-950 shadow-glow font-black scale-105'
                      : isToday
                      ? 'bg-zinc-900 border border-brand-500/80 text-brand-400 hover:bg-zinc-800'
                      : 'text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {cell.dayNum}
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => handleSelectDate(todayStr)}
              className="text-brand-400 hover:underline font-semibold"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-zinc-200 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
