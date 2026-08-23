'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Plus,
  Calendar,
  Sparkles,
  Award,
  Activity,
  Flame,
  CheckCircle2,
  X,
} from 'lucide-react';

export const ProgressTrends: React.FC = () => {
  const { profile, weightLogs, logWeight } = useHealth();
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [newWeightInput, setNewWeightInput] = useState<number>(profile.current_weight_kg);
  const [newBodyFatInput, setNewBodyFatInput] = useState<number>(15.5);

  const sortedLogs = [...weightLogs].sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
  );

  const initialWeight = sortedLogs[0]?.weight_kg || profile.current_weight_kg;
  const currentWeight = sortedLogs[sortedLogs.length - 1]?.weight_kg || profile.current_weight_kg;
  const totalWeightDelta = Number((currentWeight - initialWeight).toFixed(1));
  const remainingToGoal = Number((currentWeight - profile.target_weight_kg).toFixed(1));

  // Determine min & max for SVG trend line
  const weights = sortedLogs.map((l) => l.weight_kg);
  const minW = Math.min(...weights, profile.target_weight_kg) - 1;
  const maxW = Math.max(...weights) + 1;
  const range = maxW - minW || 1;

  // Generate SVG Points for Line Chart
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = 30;

  const points = sortedLogs.map((log, idx) => {
    const x = padding + (idx / (sortedLogs.length - 1 || 1)) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - ((log.weight_kg - minW) / range) * (svgHeight - 2 * padding);
    return { x, y, ...log };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`
    : '';

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    logWeight(Number(newWeightInput), Number(newBodyFatInput));
    setShowLogModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                BIOMETRIC PROGRESS & ADHERENCE MATRIX
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Weight Trends & Body Composition
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Track your fat loss trajectory, weekly rate of loss against Mifflin-St Jeor 500 kcal deficit targets, and lean mass preservation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Weight Check-In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
          <div className="text-xs font-semibold text-zinc-400">Current Weight</div>
          <div className="text-3xl font-black font-mono text-white mt-1">
            {currentWeight} <span className="text-sm font-normal text-zinc-400">kg</span>
          </div>
          <div className="text-xs text-zinc-400 mt-1 font-mono">
            ~{(currentWeight * 2.20462).toFixed(1)} lbs
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
          <div className="text-xs font-semibold text-zinc-400">Total Change</div>
          <div className={`text-3xl font-black font-mono mt-1 ${totalWeightDelta <= 0 ? 'text-brand-400' : 'text-amber-400'}`}>
            {totalWeightDelta > 0 ? `+${totalWeightDelta}` : totalWeightDelta} <span className="text-sm font-normal text-zinc-400">kg</span>
          </div>
          <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-brand-400" />
            <span>Deficit Fat Loss Pace</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
          <div className="text-xs font-semibold text-zinc-400">Target Goal Weight</div>
          <div className="text-3xl font-black font-mono text-accent-cyan mt-1">
            {profile.target_weight_kg} <span className="text-sm font-normal text-zinc-400">kg</span>
          </div>
          <div className="text-xs text-zinc-400 mt-1 font-mono">
            {remainingToGoal > 0 ? `${remainingToGoal}kg left to target` : 'Goal Achieved!'}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
          <div className="text-xs font-semibold text-zinc-400">Estimated Body Fat</div>
          <div className="text-3xl font-black font-mono text-purple-400 mt-1">
            {sortedLogs[sortedLogs.length - 1]?.body_fat_percentage || 15.3}%
          </div>
          <div className="text-xs text-zinc-400 mt-1">Lean Athletic Division</div>
        </div>
      </div>

      {/* SVG Interactive Line Chart Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              <span>Weight Trajectory Curve</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              High-contrast vector plot of morning weigh-ins
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-surface-300 text-zinc-300">
            {sortedLogs.length} Data Points
          </span>
        </div>

        {/* Vector SVG Line Chart */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-56 min-w-[500px]"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0.25, 0.5, 0.75].map((pct, i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + pct * (svgHeight - 2 * padding)}
                x2={svgWidth - padding}
                y2={padding + pct * (svgHeight - 2 * padding)}
                stroke="#272a38"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Area Fill */}
            {areaD && <path d={areaD} fill="url(#trendGradient)" />}

            {/* Target Goal Line */}
            <line
              x1={padding}
              y1={svgHeight - padding - ((profile.target_weight_kg - minW) / range) * (svgHeight - 2 * padding)}
              x2={svgWidth - padding}
              y2={svgHeight - padding - ((profile.target_weight_kg - minW) / range) * (svgHeight - 2 * padding)}
              stroke="#06b6d4"
              strokeDasharray="6 6"
              strokeWidth="1.5"
            />

            {/* Main Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Point Circles */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="5" fill="#10b981" stroke="#090a0f" strokeWidth="2" />
                <text
                  x={p.x}
                  y={p.y - 10}
                  fill="#d1fae5"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {p.weight_kg}kg
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mt-4 pt-4 border-t border-surface-border/60">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-500 inline-block" />
            <span>Actual Weigh-In</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-accent-cyan inline-block border-t border-dashed border-accent-cyan" />
            <span>Goal Target ({profile.target_weight_kg} kg)</span>
          </span>
        </div>
      </div>

      {/* Historical Check-In Logs Table */}
      <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
        <h3 className="text-base font-bold text-zinc-100 mb-4">Historical Check-In Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="border-b border-surface-border text-zinc-400">
                <th className="pb-3 w-1/3">Check-In Date</th>
                <th className="pb-3 w-1/3">Weight (kg / lbs)</th>
                <th className="pb-3 w-1/3">Body Fat %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {sortedLogs.slice().reverse().map((log) => (
                <tr key={log.id} className="text-zinc-200">
                  <td className="py-3">{log.logged_at}</td>
                  <td className="py-3 font-bold text-brand-400">
                    {log.weight_kg} kg <span className="text-zinc-500 font-normal">({(log.weight_kg * 2.20462).toFixed(1)} lbs)</span>
                  </td>
                  <td className="py-3 text-purple-300">
                    {log.body_fat_percentage ? `${log.body_fat_percentage}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Weight */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleSaveWeight} className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Log Biometric Check-In</h3>
              <button type="button" onClick={() => setShowLogModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-300">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  required
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300">Estimated Body Fat % (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  min="3"
                  max="60"
                  value={newBodyFatInput}
                  onChange={(e) => setNewBodyFatInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="flex-1 py-2 rounded-xl bg-surface-200 text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold text-xs shadow-glow"
              >
                Save Log
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
