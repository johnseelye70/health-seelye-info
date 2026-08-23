'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import { PlateInventory } from '@/lib/types';
import {
  DEFAULT_PLATE_INVENTORY,
  PLATE_DENOMINATIONS,
  BARBELL_TYPES,
  calculateTotalPlateWeight,
  calculateBarbellPlateLoading,
} from '@/lib/equipment-database';
import {
  Dumbbell,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Scale,
} from 'lucide-react';

interface PlateInventoryCalculatorProps {
  onPlatesUpdated?: (plates: PlateInventory) => void;
}

export const PlateInventoryCalculator: React.FC<PlateInventoryCalculatorProps> = ({
  onPlatesUpdated,
}) => {
  const { profile, updateProfile, experienceMode } = useHealth();
  const isImperial = profile.unit_preference === 'imperial';
  const isSimple = experienceMode === 'simple';

  const currentPlates: PlateInventory = profile.plate_inventory || DEFAULT_PLATE_INVENTORY;

  const [testTargetWeight, setTestTargetWeight] = useState<number>(225);

  const stats = useMemo(() => {
    return calculateTotalPlateWeight(currentPlates);
  }, [currentPlates]);

  const loadingSimulation = useMemo(() => {
    return calculateBarbellPlateLoading(testTargetWeight, currentPlates);
  }, [testTargetWeight, currentPlates]);

  const updatePlatePair = (key: keyof PlateInventory, delta: number) => {
    const currentVal = (currentPlates[key] as number) || 0;
    const newVal = Math.max(0, currentVal + delta);
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
    <div className="space-y-6">
      {/* Top Banner & Total Capacity Metric */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                💿 FREE WEIGHT PLATE INVENTORY & BARBELL CALCULATOR
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Custom Plate Inventory & Max Barbell Capacity
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
              {isSimple
                ? 'Specify the pairs of weight plates you own. This calculates the maximum safe barbell weight available for squats, deadlifts, and bench presses.'
                : 'Olympic plate inventory manager with visual barbell loading engine. Enforces maximum capacity boundaries on periodized strength progression.'}
            </p>
          </div>

          {/* Max Capacity KPI Card */}
          <div className="p-4 rounded-2xl bg-surface-200/90 border border-surface-border flex items-center gap-4 self-start lg:self-auto shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-teal flex items-center justify-center text-zinc-950 font-black text-xl shadow-glow">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Max Barbell Capacity</div>
              <div className="text-xl font-black text-white font-mono">
                {stats.maxBarbellLbs} lbs{' '}
                <span className="text-xs text-zinc-400 font-normal">({stats.maxBarbellKg} kg)</span>
              </div>
              <div className="text-[10px] text-brand-300 font-mono">
                {stats.plateWeightLbs} lbs plates + {stats.barWeightLbs} lbs bar ({stats.totalPlatesCount} plates total)
              </div>
            </div>
          </div>
        </div>

        {/* Plate Package Presets */}
        <div className="pt-3 border-t border-surface-border/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
            ⚡ Quick Plate Sets:
          </span>
          <button
            type="button"
            onClick={() =>
              applyPlatePreset({
                pairs_45lb: 2,
                pairs_35lb: 1,
                pairs_25lb: 1,
                pairs_10lb: 2,
                pairs_5lb: 2,
                pairs_2_5lb: 1,
                bar_weight_lbs: 45,
              })
            }
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-200 hover:text-white font-semibold transition-all cursor-pointer"
          >
            Standard 300 lb Olympic Set
          </button>

          <button
            type="button"
            onClick={() =>
              applyPlatePreset({
                pairs_45lb: 6,
                pairs_35lb: 2,
                pairs_25lb: 2,
                pairs_10lb: 4,
                pairs_5lb: 4,
                pairs_2_5lb: 2,
                bar_weight_lbs: 45,
              })
            }
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-200 hover:text-white font-semibold transition-all cursor-pointer"
          >
            Heavy Powerlifting Tree (800+ lbs)
          </button>

          <button
            type="button"
            onClick={() =>
              applyPlatePreset({
                pairs_45lb: 1,
                pairs_25lb: 1,
                pairs_10lb: 1,
                pairs_5lb: 1,
                pairs_2_5lb: 1,
                bar_weight_lbs: 45,
              })
            }
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-200 hover:text-white font-semibold transition-all cursor-pointer"
          >
            Minimalist Home 160 lb Set
          </button>

          <button
            type="button"
            onClick={() => applyPlatePreset(DEFAULT_PLATE_INVENTORY)}
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-surface-border font-semibold transition-all cursor-pointer"
          >
            Clear All (0 Plates)
          </button>
        </div>

        {/* Barbell Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
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
                      : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-zinc-300'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{b.name}</div>
                  <div className="text-[11px] font-mono mt-0.5 opacity-90">
                    {b.weightLbs} lbs ({b.weightKg} kg)
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Plate Denominations Pairs Steppers */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Select Pairs of Weight Plates Owned (Each Pair = 2 Matching Plates):</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* 45 lb */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shadow-md">
                  45
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">45 lb (20.4 kg)</div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {currentPlates.pairs_45lb * 2} plates ({currentPlates.pairs_45lb * 90} lbs)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_45lb', -1)}
                  disabled={currentPlates.pairs_45lb <= 0}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border disabled:opacity-40 text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-brand-300">
                  {currentPlates.pairs_45lb}p
                </span>
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_45lb', 1)}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 35 lb */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500 text-zinc-950 font-black text-xs flex items-center justify-center shadow-md">
                  35
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">35 lb (15.9 kg)</div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {currentPlates.pairs_35lb * 2} plates ({currentPlates.pairs_35lb * 70} lbs)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_35lb', -1)}
                  disabled={currentPlates.pairs_35lb <= 0}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border disabled:opacity-40 text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-brand-300">
                  {currentPlates.pairs_35lb}p
                </span>
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_35lb', 1)}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 25 lb */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center shadow-md">
                  25
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">25 lb (11.3 kg)</div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {currentPlates.pairs_25lb * 2} plates ({currentPlates.pairs_25lb * 50} lbs)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_25lb', -1)}
                  disabled={currentPlates.pairs_25lb <= 0}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border disabled:opacity-40 text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-brand-300">
                  {currentPlates.pairs_25lb}p
                </span>
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_25lb', 1)}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 10 lb */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center shadow-md">
                  10
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">10 lb (4.5 kg)</div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {currentPlates.pairs_10lb * 2} plates ({currentPlates.pairs_10lb * 20} lbs)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_10lb', -1)}
                  disabled={currentPlates.pairs_10lb <= 0}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border disabled:opacity-40 text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-brand-300">
                  {currentPlates.pairs_10lb}p
                </span>
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_10lb', 1)}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5 lb */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center shadow-md">
                  5
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">5 lb (2.3 kg)</div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {currentPlates.pairs_5lb * 2} plates ({currentPlates.pairs_5lb * 10} lbs)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_5lb', -1)}
                  disabled={currentPlates.pairs_5lb <= 0}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border disabled:opacity-40 text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-brand-300">
                  {currentPlates.pairs_5lb}p
                </span>
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_5lb', 1)}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2.5 lb Fractional */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white font-black text-[10px] flex items-center justify-center shadow-md">
                  2.5
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">2.5 lb (1.1 kg)</div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {currentPlates.pairs_2_5lb * 2} plates ({currentPlates.pairs_2_5lb * 5} lbs)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_2_5lb', -1)}
                  disabled={currentPlates.pairs_2_5lb <= 0}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border disabled:opacity-40 text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-brand-300">
                  {currentPlates.pairs_2_5lb}p
                </span>
                <button
                  type="button"
                  onClick={() => updatePlatePair('pairs_2_5lb', 1)}
                  className="w-8 h-8 rounded-xl bg-surface-300 hover:bg-surface-border text-white flex items-center justify-center font-bold cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          VISUAL BARBELL LOADER SIMULATOR
          ===================================================================== */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-base font-bold text-white">Visual Barbell Plate Loading Simulator</h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Calculates exact loading per side from your inventory
          </span>
        </div>

        {/* Target Weight Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-zinc-400 font-bold uppercase">Test Target Weight:</span>
          {[135, 185, 225, 275, 315, 365, 405].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setTestTargetWeight(w)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                testTargetWeight === w
                  ? 'bg-brand-500 text-zinc-950 shadow-glow'
                  : 'bg-surface-200 hover:bg-surface-300 text-zinc-300'
              }`}
            >
              {w} lbs
            </button>
          ))}

          <div className="flex items-center gap-2 ml-auto">
            <input
              type="number"
              value={testTargetWeight}
              onChange={(e) => setTestTargetWeight(Math.max(45, Number(e.target.value)))}
              step="5"
              className="w-24 px-3 py-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs font-mono font-bold text-zinc-100 focus:outline-none focus:border-brand-500 text-center"
            />
            <span className="text-xs text-zinc-400 font-mono">lbs</span>
          </div>
        </div>

        {/* Visual Barbell Graphic Rendering */}
        <div className="p-6 rounded-2xl bg-surface-200/90 border border-surface-border space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-300 font-mono">
              Target: {testTargetWeight} lbs ({Number((testTargetWeight * 0.453592).toFixed(1))} kg)
            </span>
            <span
              className={`font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                loadingSimulation.isExact
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {loadingSimulation.message}
            </span>
          </div>

          {/* Barbell Sleeve Graphic */}
          <div className="relative py-8 flex items-center justify-center overflow-x-auto select-none">
            {/* Center Bar Shaft */}
            <div className="flex items-center justify-center gap-0 w-full max-w-xl">
              {/* Left Collar & Sleeve */}
              <div className="flex items-center justify-end gap-1 flex-1 pr-2">
                {[...loadingSimulation.platesPerSide].reverse().map((p, idx) =>
                  Array.from({ length: p.count }).map((_, i) => (
                    <div
                      key={`l-${idx}-${i}`}
                      style={{
                        backgroundColor: p.color,
                        height: `${Math.min(90, Math.max(45, p.weightLbs * 1.8))}px`,
                        width: '14px',
                      }}
                      className="rounded-sm shadow-md flex items-center justify-center text-[9px] font-black text-zinc-950 writing-mode-vertical"
                      title={`Left side: ${p.label}`}
                    ></div>
                  ))
                )}
                {/* Left Collar Stop */}
                <div className="w-3 h-14 bg-zinc-400 rounded-sm shadow-inner"></div>
              </div>

              {/* Center Knurled Bar Shaft */}
              <div className="w-48 h-5 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 rounded-full flex items-center justify-center shadow-lg border border-zinc-500">
                <span className="text-[10px] font-mono font-black text-zinc-900 tracking-wider">
                  {currentPlates.bar_weight_lbs || 45} LB BAR
                </span>
              </div>

              {/* Right Collar & Sleeve */}
              <div className="flex items-center justify-start gap-1 flex-1 pl-2">
                {/* Right Collar Stop */}
                <div className="w-3 h-14 bg-zinc-400 rounded-sm shadow-inner"></div>
                {loadingSimulation.platesPerSide.map((p, idx) =>
                  Array.from({ length: p.count }).map((_, i) => (
                    <div
                      key={`r-${idx}-${i}`}
                      style={{
                        backgroundColor: p.color,
                        height: `${Math.min(90, Math.max(45, p.weightLbs * 1.8))}px`,
                        width: '14px',
                      }}
                      className="rounded-sm shadow-md flex items-center justify-center text-[9px] font-black text-zinc-950"
                      title={`Right side: ${p.label}`}
                    ></div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Plate Breakdown Pills */}
          <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Load on EACH Side:</span>
              {loadingSimulation.platesPerSide.length === 0 ? (
                <span className="text-zinc-400 italic">Empty Bar ({currentPlates.bar_weight_lbs || 45} lbs)</span>
              ) : (
                loadingSimulation.platesPerSide.map((p, idx) => (
                  <span
                    key={idx}
                    style={{ borderColor: `${p.color}60`, backgroundColor: `${p.color}20` }}
                    className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold border text-zinc-100 flex items-center gap-1.5"
                  >
                    <span style={{ backgroundColor: p.color }} className="w-2.5 h-2.5 rounded-full"></span>
                    <span>
                      {p.count} × {p.label}
                    </span>
                  </span>
                ))
              )}
            </div>

            <div className="text-[11px] font-mono text-zinc-400">
              Total Bar Loaded: {loadingSimulation.actualWeightLbs} lbs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
