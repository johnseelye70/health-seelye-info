'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import { PlateInventory } from '@/lib/types';
import {
  DEFAULT_PLATE_INVENTORY,
  INDIVIDUAL_PLATE_DENOMINATIONS,
  BARBELL_TYPES,
  getNormalizedPlateCounts,
  calculateTotalPlateWeight,
  calculateBarbellPlateLoading,
} from '@/lib/equipment-database';
import {
  Dumbbell,
  Plus,
  Minus,
  RotateCcw,
  Scale,
  Boxes,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface PlateInventoryCalculatorProps {
  onPlatesUpdated?: (plates: PlateInventory) => void;
}

export const PlateInventoryCalculator: React.FC<PlateInventoryCalculatorProps> = ({
  onPlatesUpdated,
}) => {
  const { profile, updateProfile, experienceMode } = useHealth();
  const isImperial = profile.unit_preference === 'imperial';
  const isSimple = experienceMode === 'standard' || experienceMode === 'tutorial';

  const currentPlates: PlateInventory = profile.plate_inventory || DEFAULT_PLATE_INVENTORY;
  const counts = useMemo(() => getNormalizedPlateCounts(currentPlates), [currentPlates]);

  const [testTargetWeight, setTestTargetWeight] = useState<number>(225);

  const stats = useMemo(() => {
    return calculateTotalPlateWeight(currentPlates);
  }, [currentPlates]);

  const loadingSimulation = useMemo(() => {
    return calculateBarbellPlateLoading(testTargetWeight, currentPlates);
  }, [testTargetWeight, currentPlates]);

  const updateIndividualPlate = (key: string, delta: number) => {
    const currentVal = counts[key] || 0;
    const newVal = Math.max(0, currentVal + delta);
    const updated: PlateInventory = {
      ...currentPlates,
      [key]: newVal,
    };
    updateProfile({ plate_inventory: updated });
    if (onPlatesUpdated) onPlatesUpdated(updated);
  };

  const setIndividualPlateCount = (key: string, count: number) => {
    const newVal = Math.max(0, Math.floor(count));
    const updated: PlateInventory = {
      ...currentPlates,
      [key]: newVal,
    };
    updateProfile({ plate_inventory: updated });
    if (onPlatesUpdated) onPlatesUpdated(updated);
  };

  const setBarType = (barWeight: number) => {
    const updated: PlateInventory = {
      ...currentPlates,
      bar_weight_lbs: barWeight,
    };
    updateProfile({ plate_inventory: updated });
    if (onPlatesUpdated) onPlatesUpdated(updated);
  };

  const applyPlatePreset = (preset: Partial<PlateInventory>) => {
    const updated: PlateInventory = {
      ...DEFAULT_PLATE_INVENTORY,
      ...preset,
    };
    updateProfile({ plate_inventory: updated });
    if (onPlatesUpdated) onPlatesUpdated(updated);
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Top Banner & Total Capacity Metric */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100 border border-surface-border space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30">
                BARBELL & PLATE INVENTORY
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-foreground">
              Weight Plates & Barbell Loading Engine
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              {isSimple
                ? 'Specify the quantity of each plate you own to calculate your maximum capacity and see exact barbell loading instructions.'
                : 'Exact plate inventory ledger. Computes bilateral even-pair barbell distribution and safe load boundaries.'}
            </p>
          </div>

          {/* Max Capacity KPI Card */}
          <div className="p-4 rounded-2xl bg-surface-200 border border-surface-border flex items-center gap-4 self-start lg:self-auto shrink-0">
            <div className="w-12 h-12 rounded-xl bg-brand-500 text-zinc-950 flex items-center justify-center font-black shadow-glow shrink-0">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Max Barbell Load</div>
              <div className="text-xl font-black text-foreground font-mono">
                {stats.maxBarbellLbs} lbs{' '}
                <span className="text-xs text-zinc-400 font-normal">({stats.maxBarbellKg} kg)</span>
              </div>
              <div className="text-[11px] text-brand-400 font-mono">
                {stats.plateWeightLbs} lbs plates ({stats.totalPlatesCount} total) + {stats.barWeightLbs} lb bar
              </div>
            </div>
          </div>
        </div>

        {/* Quick Packages */}
        <div className="pt-4 border-t border-surface-border flex items-center gap-2 flex-wrap text-xs">
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] shrink-0">
            ⚡ Quick Sets:
          </span>
          <button
            type="button"
            onClick={() =>
              applyPlatePreset({
                plates_45lb: 4,
                plates_35lb: 2,
                plates_25lb: 2,
                plates_10lb: 4,
                plates_5lb: 4,
                plates_2_5lb: 2,
                bar_weight_lbs: 45,
              })
            }
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground font-semibold transition-all cursor-pointer text-xs"
          >
            Standard 300 lb Olympic Set
          </button>

          <button
            type="button"
            onClick={() =>
              applyPlatePreset({
                plates_100lb: 2,
                plates_55lb: 2,
                plates_45lb: 10,
                plates_35lb: 4,
                plates_25lb: 4,
                plates_10lb: 8,
                plates_5lb: 8,
                plates_2_5lb: 4,
                plates_1_25lb: 2,
                bar_weight_lbs: 45,
              })
            }
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground font-semibold transition-all cursor-pointer text-xs"
          >
            Powerlifting Gym (1,000+ lbs)
          </button>

          <button
            type="button"
            onClick={() =>
              applyPlatePreset({
                plates_45lb: 2,
                plates_25lb: 2,
                plates_10lb: 2,
                plates_5lb: 2,
                plates_2_5lb: 2,
                bar_weight_lbs: 45,
              })
            }
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground font-semibold transition-all cursor-pointer text-xs"
          >
            Home 160 lb Set
          </button>

          <button
            type="button"
            onClick={() => applyPlatePreset(DEFAULT_PLATE_INVENTORY)}
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-surface-border font-semibold transition-all cursor-pointer text-xs"
          >
            Reset (0 Plates)
          </button>
        </div>

        {/* Barbell Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-brand-400" />
            <span>Active Base Barbell:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {BARBELL_TYPES.map((b) => {
              const isSelected = (currentPlates.bar_weight_lbs || 45) === b.weightLbs;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBarType(b.weightLbs)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-brand-500 text-zinc-950 font-bold border-brand-400 shadow-glow'
                      : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-foreground'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{b.name}</div>
                  <div className="text-[11px] font-mono mt-0.5 opacity-80">
                    {b.weightLbs} lbs ({b.weightKg} kg)
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Individual Plate Denominations Grid */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Exact Individual Plate Inventory:</span>
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              Total: {stats.totalPlatesCount} Plates ({stats.plateWeightLbs} lbs)
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INDIVIDUAL_PLATE_DENOMINATIONS.map((denom) => {
              const count = counts[denom.key] || 0;
              const weightTotal = count * denom.weightLbs;
              const pairs = Math.floor(count / 2);
              const hasOdd = count % 2 !== 0;

              return (
                <div
                  key={denom.key}
                  className="p-3.5 rounded-2xl bg-surface-200 border border-surface-border flex items-center justify-between gap-3 shadow-sm hover:border-brand-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      style={{ backgroundColor: denom.color }}
                      className="w-10 h-10 rounded-xl text-white font-black text-xs flex items-center justify-center shadow shrink-0 border border-white/20"
                    >
                      <span className="text-[11px] font-mono drop-shadow">{denom.weightLbs}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{denom.label}</div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        {count} owned ({weightTotal} lbs)
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {pairs} {pairs === 1 ? 'pair' : 'pairs'} {hasOdd ? '(+1 odd)' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateIndividualPlate(denom.key, -1)}
                      disabled={count <= 0}
                      className="w-7 h-7 rounded-lg bg-surface-300 hover:bg-surface-100 disabled:opacity-30 text-foreground flex items-center justify-center font-bold cursor-pointer active:scale-95 transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) => setIndividualPlateCount(denom.key, Number(e.target.value))}
                      className="w-10 py-1 text-center font-mono font-bold text-xs text-brand-400 bg-surface-300 rounded-lg border border-surface-border focus:outline-none focus:border-brand-500"
                    />

                    <button
                      type="button"
                      onClick={() => updateIndividualPlate(denom.key, 1)}
                      className="w-7 h-7 rounded-lg bg-surface-300 hover:bg-surface-100 text-foreground flex items-center justify-center font-bold cursor-pointer active:scale-95 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Barbell Loading Simulator (Zero Inner Scrollbars) */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100 border border-surface-border space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-base font-bold text-foreground">Visual Barbell Plate Loading Simulator</h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Symmetrical plate loading from your owned inventory
          </span>
        </div>

        {/* Target Weight Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 font-bold uppercase shrink-0">Target:</span>
          {[135, 185, 225, 275, 315, 365, 405, 495].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setTestTargetWeight(w)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                testTargetWeight === w
                  ? 'bg-brand-500 text-zinc-950 shadow-glow'
                  : 'bg-surface-200 hover:bg-surface-300 text-foreground'
              }`}
            >
              {w} lbs
            </button>
          ))}

          <div className="flex items-center gap-2 sm:ml-auto">
            <input
              type="number"
              value={testTargetWeight}
              onChange={(e) => setTestTargetWeight(Math.max(15, Number(e.target.value)))}
              step="5"
              className="w-20 px-2.5 py-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-brand-500 text-center"
            />
            <span className="text-xs text-zinc-400 font-mono">lbs</span>
          </div>
        </div>

        {/* Clean Responsive Barbell Loading Card */}
        <div className="p-5 md:p-6 rounded-2xl bg-surface-200 border border-surface-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-foreground font-mono">
              Target: {testTargetWeight} lbs ({Number((testTargetWeight * 0.453592).toFixed(1))} kg)
            </span>
            <span
              className={`font-mono font-bold px-3 py-1 rounded-full border self-start sm:self-auto text-xs ${
                loadingSimulation.isExact
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              {loadingSimulation.message}
            </span>
          </div>

          {/* Clean Vector SVG Barbell Graphic (Scales 100% without horizontal scrollbars) */}
          <div className="py-6 flex items-center justify-center select-none w-full max-w-full">
            <div className="flex items-center justify-center w-full max-w-xl px-2">
              {/* Left Plate Stack */}
              <div className="flex items-center justify-end gap-1 flex-1 pr-1.5">
                {[...loadingSimulation.platesPerSide].reverse().map((p, idx) =>
                  Array.from({ length: p.count }).map((_, i) => (
                    <div
                      key={`l-${idx}-${i}`}
                      style={{
                        backgroundColor: p.color,
                        height: `${Math.min(80, Math.max(35, p.weightLbs * 1.4))}px`,
                      }}
                      className="w-2.5 sm:w-3.5 rounded-xs shadow flex items-center justify-center"
                      title={`Left side: ${p.label}`}
                    />
                  ))
                )}
                {/* Left Collar Stop */}
                <div className="w-2 sm:w-2.5 h-12 bg-zinc-400 rounded-xs shadow-inner" />
              </div>

              {/* Center Knurled Bar Shaft */}
              <div className="w-28 sm:w-44 h-4 bg-zinc-400 rounded-full flex items-center justify-center shadow border border-zinc-500 shrink-0">
                <span className="text-[9px] sm:text-[10px] font-mono font-black text-zinc-950 tracking-tight">
                  {currentPlates.bar_weight_lbs || 45} LB BAR
                </span>
              </div>

              {/* Right Plate Stack */}
              <div className="flex items-center justify-start gap-1 flex-1 pl-1.5">
                {/* Right Collar Stop */}
                <div className="w-2 sm:w-2.5 h-12 bg-zinc-400 rounded-xs shadow-inner" />
                {loadingSimulation.platesPerSide.map((p, idx) =>
                  Array.from({ length: p.count }).map((_, i) => (
                    <div
                      key={`r-${idx}-${i}`}
                      style={{
                        backgroundColor: p.color,
                        height: `${Math.min(80, Math.max(35, p.weightLbs * 1.4))}px`,
                      }}
                      className="w-2.5 sm:w-3.5 rounded-xs shadow flex items-center justify-center"
                      title={`Right side: ${p.label}`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Plate Breakdown Pills */}
          <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Load on EACH Side:</span>
              {loadingSimulation.platesPerSide.length === 0 ? (
                <span className="text-zinc-400 italic">Empty Bar ({currentPlates.bar_weight_lbs || 45} lbs)</span>
              ) : (
                loadingSimulation.platesPerSide.map((p, idx) => (
                  <span
                    key={idx}
                    style={{ borderColor: `${p.color}60`, backgroundColor: `${p.color}20` }}
                    className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold border text-foreground flex items-center gap-1.5"
                  >
                    <span style={{ backgroundColor: p.color }} className="w-2 h-2 rounded-full" />
                    <span>
                      {p.count} × {p.label}
                    </span>
                  </span>
                ))
              )}
            </div>

            <div className="text-[11px] font-mono text-brand-400 font-bold">
              Total Bar Loaded: {loadingSimulation.actualWeightLbs} lbs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
