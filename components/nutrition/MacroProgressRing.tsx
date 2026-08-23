'use client';

import React from 'react';

interface MacroProgressRingProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
  size?: number;
  strokeWidth?: number;
  sublabel?: string;
}

export const MacroProgressRing: React.FC<MacroProgressRingProps> = ({
  label,
  current,
  target,
  unit = 'g',
  color,
  size = 110,
  strokeWidth = 9,
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const remaining = Math.max(0, target - current);

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-100/60 border border-surface-border backdrop-blur-md">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1f2330"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold text-foreground tracking-tight leading-none">
            {current}
            <span className="text-[10px] text-zinc-400 font-normal ml-0.5">{unit}</span>
          </span>
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mt-1">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-xs font-semibold text-zinc-200">{label}</div>
        <div className="text-[11px] text-zinc-400">
          {sublabel || `${remaining}${unit} left of ${target}${unit}`}
        </div>
      </div>
    </div>
  );
};
