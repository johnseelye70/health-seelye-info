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
  Cloud,
  User,
  RefreshCw,
  Sun,
  Moon,
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
    experienceMode,
    toggleExperienceMode,
    setExperienceMode,
    themeMode,
    toggleThemeMode,
    authUser,
    setShowAuthModal,
    syncStatus,
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
    <header className="sticky top-0 z-20 bg-surface-200/90 backdrop-blur-2xl border-b border-surface-border px-3.5 sm:px-6 md:px-8 pt-[max(env(safe-area-inset-top),12px)] pb-3 flex items-center justify-between">
      {/* Left: Brand/Date & Experience Mode Segmented Switch */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Mobile Brand Icon (Visible on small screens) */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-teal flex items-center justify-center shadow-glow">
            <Flame className="w-4 h-4 text-zinc-950 fill-zinc-950" />
          </div>
          <span className="font-black text-xs tracking-tight text-white font-sans sm:hidden">
            SEELYE <span className="text-brand-400">HEALTH</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-zinc-300 font-medium text-xs sm:text-sm">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Static, Non-Moving Experience Mode Segmented Switch */}
        <div className="flex items-center p-0.5 rounded-xl bg-surface-100 border border-surface-border select-none shrink-0 shadow-inner">
          <button
            type="button"
            id="btn-mode-simple"
            onClick={() => setExperienceMode('simple')}
            title="Switch to Simple Daily Wellness Mode"
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              experienceMode === 'simple'
                ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs">Simple</span>
          </button>
          <button
            type="button"
            id="btn-mode-athlete"
            onClick={() => setExperienceMode('advanced')}
            title="Switch to High-Tech Athlete Mode"
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              experienceMode === 'advanced'
                ? 'bg-purple-600 text-white shadow-glow font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs">Athlete</span>
          </button>
        </div>
      </div>

      {/* Right: Actions & Fasting / Quick Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Fasting / Eating Pill (Static position on right side cluster) */}
        <div
          onClick={() => setActiveTab('fasting')}
          className={`cursor-pointer hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
            fastingStatus.isFasting
              ? 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:border-purple-500/60'
              : 'bg-emerald-950/40 border-brand-500/30 text-brand-300 hover:border-brand-500/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold">
            {fastingStatus.isFasting ? 'Fasting' : 'Eating Window'}
          </span>
          <span className="text-[10px] text-zinc-400">
            {Math.floor(fastingStatus.remainingSeconds / 3600)}h {Math.floor((fastingStatus.remainingSeconds % 3600) / 60)}m
          </span>
        </div>

        {/* Local Notification Button (Tablet & Desktop) */}
        <button
          onClick={handleNotificationToggle}
          title={notificationsEnabled ? 'Fasting Alerts Active' : 'Enable Fasting Alerts'}
          className={`hidden md:flex p-2 rounded-xl border text-xs transition-colors items-center gap-1.5 cursor-pointer ${
            notificationsEnabled
              ? 'bg-brand-500/10 border-brand-500/40 text-brand-400'
              : 'bg-surface-100 border-surface-border text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="hidden xl:inline text-[11px]">{notificationsEnabled ? 'Alerts On' : 'Alerts'}</span>
        </button>

        {/* Theme Mode Toggle (Dark vs Light) */}
        <button
          id="btn-toggle-theme-mode"
          type="button"
          onClick={toggleThemeMode}
          title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-xs font-bold text-zinc-300 transition-all hover:border-brand-500/40 cursor-pointer select-none"
        >
          {themeMode === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Unit Preference Toggle (Imperial vs Metric) */}
        <button
          id="btn-toggle-units"
          onClick={toggleUnitPreference}
          title={`Currently using ${profile.unit_preference.toUpperCase()} units (Click to toggle)`}
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-zinc-200 transition-all hover:border-brand-500/40 cursor-pointer"
        >
          <span className={profile.unit_preference === 'imperial' ? 'text-brand-400 font-bold' : 'text-zinc-500'}>LBS</span>
          <span className="text-zinc-600">/</span>
          <span className={profile.unit_preference === 'metric' ? 'text-accent-cyan font-bold' : 'text-zinc-500'}>KG</span>
        </button>

        {/* Macro Calculator & Onboarding trigger */}
        <button
          id="btn-recalculate-macros"
          onClick={() => setShowOnboardingModal(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-zinc-200 text-xs font-semibold transition-all hover:border-zinc-700 cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-accent-cyan" />
          <span className="hidden lg:inline">Macro Calc</span>
        </button>

        {/* Cloud Account & Cross-Device Sync Button */}
        <button
          id="btn-cloud-sync-header"
          onClick={() => setShowAuthModal(true)}
          title={
            authUser
              ? `Signed in as ${authUser.email} (Click to manage sync)`
              : 'Sign in to sync your data across iPhone, iPad & Computer'
          }
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            authUser
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
              : 'bg-surface-100 hover:bg-surface-50 border-surface-border text-zinc-300 hover:border-brand-500/40'
          }`}
        >
          {authUser ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline font-mono text-[11px]">Synced</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Sync Cloud</span>
            </>
          )}
        </button>

        {/* Quick Log Meal */}
        <button
          id="btn-quick-log-meal"
          onClick={() => setActiveTab('nutrition')}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Log Food</span>
        </button>
      </div>
    </header>
  );
};
