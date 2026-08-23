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
  Droplets,
  Coffee,
  Heart,
} from 'lucide-react';

export const FastingTracker: React.FC = () => {
  const {
    profile,
    updateFastingProtocol,
    fastingStatus,
    mealSplitTargets,
    notificationsEnabled,
    setNotificationsEnabled,
    experienceMode,
  } = useHealth();

  const isSimple = experienceMode === 'simple';

  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [fastStartTimeInput, setFastStartTimeInput] = useState<string>(profile.fasting_start_time || '20:00');

  const protocols: { id: FastingProtocol; label: string; simpleLabel: string; ratio: string; tag: string }[] = [
    { id: '16_8', label: 'LeanGains Classic', simpleLabel: 'Classic Daily (16:8)', ratio: '16:8', tag: 'Most Popular' },
    { id: '14_10', label: 'Circadian Gentle', simpleLabel: 'Gentle & Easy (14:10)', ratio: '14:10', tag: 'Great for Beginners' },
    { id: '18_6', label: 'Deep Fasting', simpleLabel: 'Focused (18:6)', ratio: '18:6', tag: 'Deeper Fast' },
    { id: 'standard_3_meal', label: 'Standard 3-Meal', simpleLabel: 'Natural 3 Meals (12:12)', ratio: '12:12', tag: 'No Skipping' },
    { id: '20_4', label: 'Warrior Diet', simpleLabel: 'Evening Feast (20:4)', ratio: '20:4', tag: 'Advanced' },
    { id: '23_1_omad', label: 'OMAD Feast', simpleLabel: 'One Meal A Day (23:1)', ratio: '23:1', tag: 'Expert' },
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
        ? `🕒 Fasting time started at ${profile.fasting_start_time}. Target: ${FASTING_CONFIGS[profile.fasting_protocol].fastHours} hours of rest.`
        : `🍽️ Eating window is now open! Enjoy your wholesome meals.`;

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

  // Biological Milestone Stages for Timeline (Athlete Mode)
  const fastingStages = [
    { hour: '0 - 4h', name: 'Anabolic / Digestion', desc: 'Body digests recent meal; blood glucose and insulin levels peak then decline.', active: true },
    { hour: '4 - 8h', name: 'Blood Sugar Stabilization', desc: 'Insulin drops to baseline; liver glycogen breakdown initiates.', active: fastingStatus.isFasting && fastingStatus.elapsedSeconds >= 4 * 3600 },
    { hour: '8 - 12h', name: 'Glycogen Depletion & Lipolysis', desc: 'Liver glycogen nears depletion; cellular lipolysis accelerates fat burning.', active: fastingStatus.isFasting && fastingStatus.elapsedSeconds >= 8 * 3600 },
    { hour: '12 - 16h', name: 'Ketosis & Ketone Production', desc: 'Acetoacetate & Beta-hydroxybutyrate rise, mental clarity increases, GH surges.', active: fastingStatus.isFasting && fastingStatus.elapsedSeconds >= 12 * 3600 },
    { hour: '16h+', name: 'Autophagy & Cellular Repair', desc: 'Damaged proteins cleared; mitochondrial biogenesis and longevity pathways triggered.', active: fastingStatus.isFasting && fastingStatus.elapsedSeconds >= 16 * 3600 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Toast Alert */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-brand-500 text-zinc-950 font-bold text-xs shadow-2xl flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {isSimple ? 'EATING & FASTING SCHEDULE' : 'CIRCADIAN FASTING CADENCE'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {isSimple ? 'Eating & Fasting Clock' : 'Fasting Tracker & Biological Milestones'}
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              {isSimple
                ? 'Give your digestion a healthy, rejuvenating rest between meals to boost natural energy, mental clarity, and fat metabolism.'
                : 'Real-time circadian synchronization engine tracking metabolic shifts, ketosis state, and autophagy phases.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => testPushNotification(fastingStatus.isFasting ? 'fast_start' : 'eating_window')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-colors"
            >
              <Bell className="w-4 h-4 text-accent-cyan" />
              <span>Test Notification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Main Clock Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Countdown Ring */}
        <div className="lg:col-span-2 rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div
            className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
              fastingStatus.isFasting ? 'bg-purple-600/10' : 'bg-brand-500/10'
            }`}
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6 border bg-surface-200/80 border-surface-border">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                fastingStatus.isFasting ? 'bg-purple-500 animate-ping' : 'bg-brand-500 animate-ping'
              }`}
            />
            <span className="font-bold text-zinc-200">
              {fastingStatus.isFasting
                ? (isSimple ? 'Fasting Time • Resting & Digesting' : 'FASTING PHASE ACTIVE')
                : (isSimple ? 'Eating Window • Time for Healthy Food' : 'EATING WINDOW ACTIVE')}
            </span>
          </div>

          {/* Big Live Clock */}
          <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-white my-4 drop-shadow-md">
            <span>{String(remainingHours).padStart(2, '0')}</span>
            <span className="text-zinc-600 animate-pulse">:</span>
            <span>{String(remainingMins).padStart(2, '0')}</span>
            <span className="text-zinc-600 animate-pulse">:</span>
            <span className="text-brand-400">{String(remainingSecs).padStart(2, '0')}</span>
          </div>

          <div className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mt-1">
            {fastingStatus.isFasting ? 'Remaining until eating window' : 'Remaining in eating window'}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md h-3 bg-surface-300 rounded-full mt-6 overflow-hidden p-0.5 border border-surface-border">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fastingStatus.isFasting
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-glow'
                  : 'bg-gradient-to-r from-brand-500 to-accent-teal shadow-glow'
              }`}
              style={{ width: `${Math.min(100, fastingStatus.progressPercent)}%` }}
            />
          </div>

          <div className="flex justify-between w-full max-w-md text-xs font-mono text-zinc-400 mt-2">
            <span>{fastingStatus.progressPercent.toFixed(1)}% Completed</span>
            <span>{currentConfig.name}</span>
          </div>

          {/* Hydration / Simple Mode Reminder */}
          {isSimple && (
            <div className="mt-6 p-4 rounded-2xl bg-surface-200/70 border border-surface-border text-xs text-zinc-300 max-w-md text-left flex items-start gap-3">
              <Droplets className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-100">Simple Fasting Tip:</span> During your fasting hours, water, sparkling water, and black coffee or tea are completely fine. They help you stay energized and hydrated!
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Schedule Settings */}
        <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Clock className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-base font-bold text-white">Daily Schedule</h3>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Fasting Starts Every Evening At:
            </label>
            <input
              type="time"
              value={fastStartTimeInput}
              onChange={handleTimeChange}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 font-mono text-sm focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              Example: Stop eating at 8:00 PM to begin the resting window.
            </p>
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              Choose Fasting Cadence:
            </label>
            <div className="space-y-2">
              {protocols.map((proto) => (
                <button
                  key={proto.id}
                  onClick={() => handleProtocolSelect(proto.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    profile.fasting_protocol === proto.id
                      ? 'bg-brand-500/15 border-brand-500/50 text-white shadow-glow'
                      : 'bg-surface-200/60 border-surface-border text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-100">
                      {isSimple ? proto.simpleLabel : proto.label}
                    </div>
                    <div className="text-[10px] text-zinc-400">{proto.tag}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-300">
                    {proto.ratio}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Biological Milestones (Athlete Mode Only) */}
      {!isSimple && (
        <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-zinc-100">Biological Metabolic Shifts & Milestones</h3>
          </div>

          <div className="relative pl-6 space-y-6 border-l-2 border-surface-border">
            {fastingStages.map((stage, idx) => (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                    stage.active
                      ? 'bg-brand-500 border-brand-300 shadow-glow'
                      : 'bg-surface-300 border-surface-border'
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-brand-300">{stage.hour}</span>
                    <span className="text-xs font-bold text-zinc-200">— {stage.name}</span>
                  </div>
                  {stage.active && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-500/20 text-brand-300 self-start sm:self-auto">
                      Current Milestone State
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
