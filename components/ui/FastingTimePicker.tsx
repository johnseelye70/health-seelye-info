'use client';

import React from 'react';
import { Clock, Minus, Plus, ChevronDown } from 'lucide-react';

interface FastingTimePickerProps {
  value: string; // "HH:MM" 24h format e.g. "20:00"
  onChange: (timeStr: string) => void;
  label?: string;
  id?: string;
}

// Generate 48 half-hour slots across 24h with friendly 12h labels
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const hour24Str = hour.toString().padStart(2, '0');
  const value = `${hour24Str}:${minute}`;

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const label12 = `${hour12}:${minute} ${period}`;
  
  let tag = '';
  if (value === '20:00') tag = ' • Most Popular (8:00 PM)';
  else if (value === '19:00') tag = ' • Early Dinner (7:00 PM)';
  else if (value === '21:00') tag = ' • Late Evening (9:00 PM)';
  else if (value === '18:00') tag = ' • Early Evening (6:00 PM)';

  return {
    value,
    label: `${label12}${tag}`,
    displayLabel: label12,
  };
});

export const FastingTimePicker: React.FC<FastingTimePickerProps> = ({
  value = '20:00',
  onChange,
  label = 'Fasting Starts Every Evening At:',
  id = 'fasting-time-select',
}) => {
  // Parse current value
  const [currentH = 20, currentM = 0] = (value || '20:00').split(':').map(Number);
  const totalMinutes = currentH * 60 + currentM;

  const handleStep = (deltaMinutes: number) => {
    let nextMinutes = (totalMinutes + deltaMinutes) % (24 * 60);
    if (nextMinutes < 0) nextMinutes += 24 * 60;
    const h = Math.floor(nextMinutes / 60).toString().padStart(2, '0');
    const m = (nextMinutes % 60).toString().padStart(2, '0');
    onChange(`${h}:${m}`);
  };

  const currentOption = TIME_OPTIONS.find((t) => t.value === value) || {
    value,
    displayLabel: `${currentH % 12 === 0 ? 12 : currentH % 12}:${currentM.toString().padStart(2, '0')} ${currentH >= 12 ? 'PM' : 'AM'}`,
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>{label}</span>
          </span>
          <span className="text-[11px] font-mono text-purple-300 font-bold bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/30">
            {currentOption.displayLabel}
          </span>
        </label>
      )}

      <div className="flex items-center gap-2 bg-surface-200/90 p-1.5 rounded-2xl border border-surface-border hover:border-zinc-700 transition-colors">
        {/* Large Ergonomic Step Backward Button */}
        <button
          type="button"
          onClick={() => handleStep(-30)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-300 hover:bg-surface-400 active:scale-95 text-zinc-200 font-bold border border-surface-border transition-all cursor-pointer shadow-sm shrink-0"
          title="30 minutes earlier"
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Formatted Select Dropdown with Chevron */}
        <div className="relative flex-1 min-w-0">
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 pl-3 pr-8 rounded-xl bg-surface-300/80 border border-surface-border text-zinc-100 font-mono text-xs sm:text-sm font-semibold focus:outline-none focus:border-brand-500 appearance-none cursor-pointer hover:bg-surface-300 transition-colors"
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface-100 text-zinc-100 py-1 font-sans">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        </div>

        {/* Large Ergonomic Step Forward Button */}
        <button
          type="button"
          onClick={() => handleStep(30)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/20 hover:bg-purple-500 hover:text-zinc-950 active:scale-95 text-purple-300 font-bold border border-purple-500/30 transition-all cursor-pointer shadow-sm shrink-0"
          title="30 minutes later"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
