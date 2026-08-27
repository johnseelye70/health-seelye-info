'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  decimals?: number;
  placeholder?: string;
  allowEmptyZero?: boolean;
  className?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  unit,
  label,
  id,
  size = 'md',
  decimals = 0,
  placeholder,
  allowEmptyZero = false,
  className = '',
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentVal = typeof value === 'number' && !isNaN(value) ? value : 0;
    const effectiveMin = allowEmptyZero ? 0 : min;
    const nextVal = Math.max(effectiveMin, Number((currentVal - step).toFixed(decimals || 2)));
    onChange(nextVal);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentVal = typeof value === 'number' && !isNaN(value) ? value : 0;
    const nextVal = Math.min(max, Number((currentVal + step).toFixed(decimals || 2)));
    onChange(nextVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      onChange(0);
      return;
    }
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      const effectiveMin = allowEmptyZero ? 0 : min;
      onChange(Math.max(effectiveMin, Math.min(max, num)));
    }
  };

  const btnSizeClasses =
    size === 'sm'
      ? 'w-8 h-8 rounded-lg text-xs'
      : size === 'lg'
      ? 'w-12 h-12 rounded-2xl text-base'
      : 'w-10 h-10 rounded-xl text-sm';

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  const displayVal =
    isNaN(value) || (allowEmptyZero && (value === 0 || !value))
      ? ''
      : decimals > 0
      ? value.toFixed(decimals)
      : value;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-zinc-300 block">{label}</label>}
      <div className="flex items-center gap-2 bg-surface-200/90 p-1.5 rounded-2xl border border-surface-border hover:border-zinc-700 transition-colors">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min && value > 0}
          className={`${btnSizeClasses} flex items-center justify-center bg-surface-300 hover:bg-surface-400 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-zinc-200 font-bold border border-surface-border transition-all cursor-pointer shadow-sm`}
          title={`Decrease by ${step}`}
        >
          <Minus className={`${iconSize} stroke-[2.5]`} />
        </button>

        <div className="flex-1 flex items-center justify-center gap-1 px-2 text-center min-w-0">
          <input
            id={id}
            type="number"
            value={displayVal}
            placeholder={placeholder}
            onChange={handleInputChange}
            step={step}
            min={min}
            max={max}
            className="w-full bg-transparent text-center font-mono font-bold text-zinc-100 placeholder:text-zinc-500 focus:outline-none text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && <span className="text-xs font-mono font-medium text-zinc-400 select-none shrink-0">{unit}</span>}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={`${btnSizeClasses} flex items-center justify-center bg-brand-500/20 hover:bg-brand-500 hover:text-zinc-950 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-brand-300 font-bold border border-brand-500/30 transition-all cursor-pointer shadow-sm`}
          title={`Increase by ${step}`}
        >
          <Plus className={`${iconSize} stroke-[2.5]`} />
        </button>
      </div>
    </div>
  );
};
