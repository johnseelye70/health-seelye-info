'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { FastingProtocol } from '@/lib/types';
import { FASTING_CONFIGS } from '@/lib/macro-calculator';
import {
  Timer,
  Clock,
  Bell,
  CheckCircle2,
  Sparkles,
  Flame,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Utensils,
  ChevronRight,
  Info,
} from 'lucide-react';

export const FastingTracker: React.FC = () => {
  const {
    profile,
    updateFastingProtocol,
    fastingStatus,
    mealSplitTargets,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useHealth();

  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [fastStartTimeInput, setFastStartTimeInput] = useState<string>(profile.fasting_start_time || '20:00');

  const protocols: { id: FastingProtocol; label: string; ratio: string; tag: string }[] = [
    { id: '16_8', label: 'LeanGains Classic', ratio: '16:8', tag: 'Most Popular' },
    { id: '18_6', label: 'Deep Fasting', ratio: '18:6', tag: 'Enhanced Autophagy' },
    { id: '20_4', label: 'Warrior Diet', ratio: '20:4', tag: 'Peak Fat Burn' },
    { id: '14_10', label: 'Circadian Gentle', ratio: '14:10', tag: 'Beginner' },
    { id: '23_1_omad', label: 'OMAD Feast', ratio: '23:1', tag: 'Extreme Focus' },
    { id: 'standard_3_meal', label: 'Standard 3-Meal', ratio: '12:12', tag: 'Non-Restricted' },
  ];

  const handleProtocolSelect = (proto: FastingProtocol) => {
    updateFastingProtocol(proto, fastStartTimeInput);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFastStartTimeInput(val);
    updateFastingProtocol(profile.fasting_protocol, val);
  };

  const testPushNotification = (type: string) => {
    const message =
      type === 'fast_start'
        ? `🕒 Fasting Phase Initiated! Fast started at ${profile.fasting_start_time}. Target: ${FASTING_CONFIGS[profile.fasting_protocol].fastHours} hours.`
        : `🍽️ Eating Window Open! Your ${profile.eating_window_duration_hours}-hour nutrient feeding window is now active.`;

    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 5000);

    if (notificationsEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Health.Seelye Fasting Alert', { body: message, icon: '/favicon.ico' });
    }
  };

  const remainingHours = Math.floor(fastingStatus.remainingSeconds / 3600);
  const remainingMins = Math.floor((fastingStatus.remainingSeconds % 3600) / 60);
  const remainingSecs = fastingStatus.remainingSeconds % 60;

  const currentConfig = FASTING_CONFIGS[profile.fasting_protocol];

  // Biological Milestone Stages for Timeline
  const fastingStages = [
    { hour: '0 - 4h', name: 'Anabolic / Digestion', desc: 'Body digests recent meal; blood glucose and insulin levels peak then decline.', active: true },
    { hour: '4 - 8h', name: 'Blood Sugar Stabilization', desc: 'Insulin drops to baseline; liver glycogen breakdown initiates.', active: fastingStatus.isFasting && fastingStatus.elapsedSeconds >= 4 * 3600 },
    { hour: '8 - 12h', name: 'Glycogen Depletion & Lipolysis', desc: 'Liver glycogen nears depletion; cellular lipolysis accelerates fat burning.', active: fastingStatus.isFasting && fastingStatus.elapsedSeconds >= 8 * 3600 },
    { hour: '12 - 16h', name: 'Ketosis & Ketone Production', desc: 'Acetoacetate & Beta-hydroxybutyrate rise, mental clarity increases, GH surges.', active: fastingStatus.isFasting && fastingStatus.elapsedSeconds >= 12 * 3600 },
    { hour: '16 - 24h', name: 'Autophagy Induction & Cellular Cleanup', desc: 'Lysosomes recycle misfolded proteins, damaged organelles, and senescent cells.', active: fastingStatus.isFasting && fastingStatus.elapsedSeconds >= 16 * 3600 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Notification Toast Alert */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-zinc-900 border border-brand-500/50 shadow-2xl text-zinc-100 flex items-center gap-3 animate-slideIn">
          <Sparkles className="w-5 h-5 text-brand-400 shrink-0" />
          <span className="text-xs font-semibold">{notificationToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                CIRCADIAN FASTING & FEEDING WINDOW MANAGER
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Fasting Protocol Engine
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Synchronize your metabolic fasting and feeding cycles to optimize insulin sensitivity, fat oxidation, and cellular autophagy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => testPushNotification(fastingStatus.isFasting ? 'eat_start' : 'fast_start')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-300 transition-all"
            >
              <Bell className="w-4 h-4 text-brand-400" />
              <span>Simulate Notification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Protocol Selection Carousel / Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
            Select Fasting Protocol
          </h2>
          <span className="text-xs text-zinc-400">Current: <strong className="text-brand-400">{currentConfig.name}</strong></span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {protocols.map((proto) => {
            const isSelected = profile.fasting_protocol === proto.id;
            return (
              <button
                key={proto.id}
                onClick={() => handleProtocolSelect(proto.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-brand-500/15 to-accent-teal/5 border-brand-500/50 shadow-glow text-white'
                    : 'bg-surface-100/70 border-surface-border hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-300 text-zinc-200">
                      {proto.ratio}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                  </div>
                  <div className="font-bold text-sm leading-tight text-zinc-100">{proto.label}</div>
                </div>
                <div className="mt-3 text-[10px] text-zinc-400 font-medium">
                  {proto.tag}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Fasting Clock & Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Giant Fasting Clock & Biological Tracker */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-brand-400" />
              <span>Active Cycle Status</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-400 font-mono">Fast Starts:</label>
              <input
                type="time"
                value={fastStartTimeInput}
                onChange={handleTimeChange}
                className="px-2.5 py-1 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 text-xs font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Large Circular Fasting Gauge */}
          <div className="relative my-4 flex items-center justify-center">
            <svg width="280" height="280" className="transform -rotate-90">
              <circle
                cx="140"
                cy="140"
                r="115"
                stroke="#1c202c"
                strokeWidth="16"
                fill="transparent"
              />
              <circle
                cx="140"
                cy="140"
                r="115"
                stroke={fastingStatus.isFasting ? '#a855f7' : '#10b981'}
                strokeWidth="16"
                strokeDasharray={2 * Math.PI * 115}
                strokeDashoffset={2 * Math.PI * 115 - (fastingStatus.progressPercent / 100) * (2 * Math.PI * 115)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider mb-2 ${
                  fastingStatus.isFasting
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                }`}
              >
                {fastingStatus.isFasting ? 'Fasting Window' : 'Feeding Window'}
              </span>

              <div className="text-4xl md:text-5xl font-black font-mono text-white tracking-tight">
                {remainingHours.toString().padStart(2, '0')}:
                {remainingMins.toString().padStart(2, '0')}:
                <span className="text-brand-400 text-3xl md:text-4xl">{remainingSecs.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xs text-zinc-400 mt-1 font-medium">Time Remaining</span>

              <div className="text-xs font-mono text-zinc-400 mt-3">
                {fastingStatus.progressPercent}% Elapsed
              </div>
            </div>
          </div>

          {/* Bottom Stage Banner */}
          <div className="w-full mt-4 p-4 rounded-2xl bg-surface-200/80 border border-surface-border text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                <span className="text-xs font-bold text-zinc-200">Current Phase: {fastingStatus.stageName}</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{fastingStatus.nextMilestoneText}</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{fastingStatus.stageDescription}</p>
          </div>
        </div>

        {/* Right 5 Columns: Biological Milestones & Feeding Schedule */}
        <div className="lg:col-span-5 space-y-6">
          {/* Biological Stages Timeline */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Metabolic Fasting Milestones</span>
            </div>

            <div className="space-y-3">
              {fastingStages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    stage.active
                      ? 'bg-purple-950/30 border-purple-500/40 text-zinc-200'
                      : 'bg-surface-200/40 border-surface-border/60 text-zinc-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className={stage.active ? 'text-purple-300 font-bold' : 'text-zinc-400'}>
                      {stage.name}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-300">
                      {stage.hour}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Feeding Window Times Card */}
          <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">
              <Utensils className="w-4 h-4 text-brand-400" />
              <span>Eating Window Coordinates</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-200 border border-surface-border">
                <div className="text-[11px] text-zinc-400">Eating Window Opens</div>
                <div className="text-xl font-bold font-mono text-brand-400 mt-0.5">
                  {fastingStatus.eatStartFormatted}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Break-Fast Meal</div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-200 border border-surface-border">
                <div className="text-[11px] text-zinc-400">Fasting Begins (Close)</div>
                <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
                  {fastingStatus.eatEndFormatted}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Fast Starts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
