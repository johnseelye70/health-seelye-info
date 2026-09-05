'use client';

import React, { useState } from 'react';
import { useHealth, normalizeDateStr, isDateMatch } from '@/context/HealthContext';
import {
  Droplets,
  Plus,
  RotateCcw,
  Sparkles,
  Settings2,
  CheckCircle2,
  GlassWater,
  X,
  History,
  Trash2,
} from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';

const CONTAINER_PRESETS = [
  { label: 'Glass', icon: '🥛', oz: 8, desc: '8 oz cup' },
  { label: 'Mug', icon: '☕', oz: 12, desc: '12 oz mug' },
  { label: 'Bottle', icon: '🍼', oz: 16.9, desc: '500 mL bottle' },
  { label: 'Shaker', icon: '🥤', oz: 24, desc: '24 oz blender bottle' },
  { label: 'Hydro Flask', icon: '🧊', oz: 32, desc: '32 oz / 1 quart' },
  { label: 'Half Gallon', icon: '🫙', oz: 64, desc: '64 oz jug' },
];

const GOAL_PRESETS = [
  { label: '64 oz (8 cups)', oz: 64 },
  { label: '96 oz (12 cups)', oz: 96 },
  { label: '128 oz (1 Gallon)', oz: 128 },
  { label: '160 oz (1.25 Gallons)', oz: 160 },
];

export const HydrationTracker: React.FC = () => {
  const {
    waterGoalOz,
    setWaterGoalOz,
    waterLogs,
    todayWaterOz,
    logWaterOz,
    resetTodayWater,
    deleteWaterLog,
    todayDate,
    profile,
    syncWithCloud,
  } = useHealth();

  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [customGoalInput, setCustomGoalInput] = useState<number>(waterGoalOz);
  const [customOzInput, setCustomOzInput] = useState<number>(8);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const progressPercent = Math.min(200, Math.round((todayWaterOz / (waterGoalOz || 96)) * 100));
  const remainingOz = Math.max(0, waterGoalOz - todayWaterOz);
  const totalLiters = (todayWaterOz * 0.0295735).toFixed(1);
  const goalLiters = (waterGoalOz * 0.0295735).toFixed(1);

  const todayEntries = waterLogs.filter((w) => isDateMatch(w.logged_at, todayDate));

  const handleSaveGoal = (newGoal: number) => {
    setWaterGoalOz(newGoal);
    setShowGoalModal(false);
  };

  return (
    <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-7 backdrop-blur-xl space-y-5 shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>Daily Hydration Engine</span>
              {progressPercent >= 100 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Goal Met! 🎉
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Target: {waterGoalOz} oz ({goalLiters}L) • Logged: {todayWaterOz} oz ({totalLiters}L)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Always-Visible Prominent Reset Water Button */}
          <button
            id="btn-hydration-reset-header"
            type="button"
            onClick={async () => {
              resetTodayWater();
              await syncWithCloud();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-sm"
            title="Reset today's water to 0 oz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Water</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="p-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-zinc-200 border border-surface-border text-xs transition-all cursor-pointer"
            title="View today's water log timestamps"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCustomGoalInput(waterGoalOz);
              setShowGoalModal(true);
            }}
            className="p-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-zinc-200 border border-surface-border text-xs transition-all cursor-pointer"
            title="Configure Daily Water Target"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Fill Progress Meter */}
      <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                {todayWaterOz}{' '}
                <span className="text-sm font-normal text-zinc-400">
                  / {waterGoalOz} oz
                </span>
              </div>
              {todayWaterOz > 0 && (
                <button
                  type="button"
                  id="btn-quick-zero-water"
                  onClick={async () => {
                    resetTodayWater();
                    await syncWithCloud();
                  }}
                  className="text-[11px] font-mono text-rose-400 hover:text-rose-300 underline underline-offset-2 cursor-pointer"
                  title="Reset today's water to 0 oz"
                >
                  (Reset to 0)
                </button>
              )}
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              {remainingOz > 0 ? (
                <span>
                  Drink <strong className="text-cyan-300">{remainingOz} oz</strong> more to hit your goal
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  Hydration target exceeded by {todayWaterOz - waterGoalOz} oz! 💧
                </span>
              )}
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-xl font-bold text-cyan-300">{progressPercent}%</span>
            <div className="text-[10px] text-zinc-500">of daily goal</div>
          </div>
        </div>

        {/* Animated Cylinder Bar */}
        <div className="relative w-full h-3.5 bg-surface-300 rounded-full overflow-hidden border border-surface-border/80">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-400 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick Add Container Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <span>Quick Log Containers:</span>
          <button
            type="button"
            onClick={async () => {
              resetTodayWater();
              await syncWithCloud();
            }}
            className="text-zinc-400 hover:text-rose-400 text-xs font-mono flex items-center gap-1 cursor-pointer font-bold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Today</span>
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CONTAINER_PRESETS.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => logWaterOz(c.oz, c.label)}
              className="p-2.5 rounded-2xl bg-surface-200 hover:bg-cyan-500/20 border border-surface-border hover:border-cyan-500/40 text-center transition-all cursor-pointer group active:scale-95 flex flex-col items-center justify-center space-y-1"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                {c.icon}
              </span>
              <div className="text-[11px] font-bold text-zinc-200 group-hover:text-cyan-300">
                +{c.oz} oz
              </div>
              <div className="text-[9px] text-zinc-500 font-mono truncate w-full">
                {c.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Stepper Increment */}
      <div className="pt-2 border-t border-surface-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-semibold">Custom Amount:</span>
          <div className="w-32">
            <NumberStepper
              id="hydration-custom-stepper"
              value={customOzInput}
              onChange={(val) => setCustomOzInput(Math.max(1, val))}
              step={1}
              min={1}
              max={128}
              unit="oz"
            />
          </div>
        </div>

        <button
          type="button"
          id="hydration-log-custom-btn"
          onClick={() => logWaterOz(customOzInput, 'Custom')}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-black shadow-glow transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+ Log {customOzInput} oz</span>
        </button>
      </div>

      {/* =========================================================================
          MODAL: CONFIGURE WATER GOAL
          ========================================================================= */}
      {showGoalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowGoalModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Set Daily Water Intake Goal</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Popular Target Presets:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GOAL_PRESETS.map((g) => (
                  <button
                    key={g.oz}
                    type="button"
                    onClick={() => handleSaveGoal(g.oz)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      waterGoalOz === g.oz
                        ? 'bg-cyan-500 text-zinc-950 border-cyan-400 shadow-glow'
                        : 'bg-surface-200 border-surface-border text-zinc-300 hover:border-cyan-500/40'
                    }`}
                  >
                    <div>{g.label}</div>
                    <div className="text-[10px] font-mono mt-0.5 opacity-80">
                      {(g.oz * 0.0295735).toFixed(1)} Liters / Day
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                  Custom Daily Target (oz):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="16"
                    max="300"
                    step="8"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveGoal(customGoalInput)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-zinc-950 font-black text-xs shadow-glow cursor-pointer"
                  >
                    Save Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TODAY'S HYDRATION LOG HISTORY
          ========================================================================= */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Today's Water Entries ({todayEntries.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {todayEntries.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500 font-mono">
                  No water logged yet today. Click any container to start!
                </div>
              ) : (
                todayEntries.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-2xl bg-surface-200 border border-surface-border flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">💧</span>
                      <div>
                        <div className="font-bold text-zinc-200">
                          +{w.amount_oz} oz {w.container ? `(${w.container})` : ''}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {new Date(w.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {(w.amount_oz * 0.0295735).toFixed(2)}L
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteWaterLog(w.id)}
                        className="p-1 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete this water entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                id="btn-history-modal-reset-water"
                onClick={async () => {
                  resetTodayWater();
                  await syncWithCloud();
                }}
                className="py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Today (0 oz)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 text-xs font-bold cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
