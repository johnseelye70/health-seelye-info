'use client';

import React from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  Flame,
  Calendar,
  Sparkles,
  PlusCircle,
  Calculator,
  Bell,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    todayRemaining,
    todayMacros,
    fastingStatus,
    setShowOnboardingModal,
    setActiveTab,
    notificationsEnabled,
    setNotificationsEnabled,
    toggleUnitPreference,
  } = useHealth();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const handleNotificationToggle = () => {
    if (!notificationsEnabled) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            new Notification('Health.Seelye Fasting Alerts Active', {
              body: 'Fasting and eating window milestone notifications enabled.',
              icon: '/favicon.ico',
            });
          } else {
            setNotificationsEnabled(true); // Enable in-app mockup
          }
        });
      } else {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-surface-200/80 backdrop-blur-xl border-b border-surface-border px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Date & Current Active Window Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
          <Calendar className="w-4 h-4 text-brand-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Fasting / Eating Pill */}
        <div
          onClick={() => setActiveTab('fasting')}
          className={`cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
            fastingStatus.isFasting
              ? 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:border-purple-500/60'
              : 'bg-emerald-950/40 border-brand-500/30 text-brand-300 hover:border-brand-500/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold">{fastingStatus.isFasting ? 'FASTING' : 'EATING WINDOW'}</span>
          <span className="text-[10px] text-zinc-400">
            {Math.floor(fastingStatus.remainingSeconds / 3600)}h {Math.floor((fastingStatus.remainingSeconds % 3600) / 60)}m left
          </span>
        </div>
      </div>

      {/* Right: Actions & Quick Stats */}
      <div className="flex items-center gap-3">
        {/* Calorie Pill summary */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-surface-100/80 border border-surface-border text-xs">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span className="text-zinc-400">Budget:</span>
          <span className="font-bold text-zinc-100 font-mono">{todayRemaining.calories} kcal</span>
          <span className="text-zinc-400">/ {profile.daily_calorie_target}</span>
        </div>

        {/* Local Notification Button */}
        <button
          onClick={handleNotificationToggle}
          title={notificationsEnabled ? 'Fasting Alerts Active' : 'Enable Fasting Alerts'}
          className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
            notificationsEnabled
              ? 'bg-brand-500/10 border-brand-500/40 text-brand-400'
              : 'bg-surface-100 border-surface-border text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="hidden xl:inline text-[11px]">{notificationsEnabled ? 'Alerts On' : 'Alerts'}</span>
        </button>

        {/* Unit Preference Toggle (Imperial vs Metric) */}
        <button
          id="btn-toggle-units"
          onClick={toggleUnitPreference}
          title={`Currently using ${profile.unit_preference.toUpperCase()} units (Click to toggle)`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-zinc-200 transition-all hover:border-brand-500/40"
        >
          <span className={profile.unit_preference === 'imperial' ? 'text-brand-400 font-bold' : 'text-zinc-500'}>LBS</span>
          <span className="text-zinc-600">/</span>
          <span className={profile.unit_preference === 'metric' ? 'text-accent-cyan font-bold' : 'text-zinc-500'}>KG</span>
        </button>

        {/* Macro Calculator & Onboarding trigger */}
        <button
          id="btn-recalculate-macros"
          onClick={() => setShowOnboardingModal(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-zinc-200 text-xs font-semibold transition-all hover:border-zinc-700"
        >
          <Calculator className="w-4 h-4 text-accent-cyan" />
          <span className="hidden sm:inline">Macro Calc</span>
        </button>

        {/* Quick Log Meal */}
        <button
          id="btn-quick-log-meal"
          onClick={() => setActiveTab('nutrition')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Log Food</span>
        </button>
      </div>
    </header>
  );
};
