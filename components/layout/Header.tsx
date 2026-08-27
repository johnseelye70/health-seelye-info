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
  ShoppingCart,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    todayRemaining,
    todayMacros,
    fastingStatus,
    setShowOnboardingModal,
    activeTab,
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
    groceryList,
  } = useHealth();

  const unpurchasedCount = groceryList.filter((i) => !i.is_checked && !i.in_pantry).length;

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
    <header className="sticky top-0 z-20 bg-surface-200/90 backdrop-blur-2xl border-b border-surface-border px-2.5 sm:px-6 md:px-8 pt-[max(env(safe-area-inset-top),10px)] pb-2.5 sm:pb-3 flex items-center justify-between w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Left: Brand/Date, Compact Version Badge & Unified 1-Button Mode Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
        {/* Mobile Brand Icon */}
        <div className="flex md:hidden items-center shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-teal flex items-center justify-center shadow-glow">
            <Flame className="w-4 h-4 text-zinc-950 fill-zinc-950" />
          </div>
        </div>

        {/* Compact Version Badge (Mobile & Desktop) */}
        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-surface-100 border border-surface-border text-brand-400 shrink-0 select-none shadow-sm">
          b2.23.0
        </span>

        <div className="hidden sm:flex items-center gap-2 text-zinc-300 font-medium text-xs sm:text-sm shrink-0">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Unified 1-Button Experience Mode Toggle (Simple ↔ Athlete) */}
        <button
          type="button"
          id="btn-toggle-experience-mode"
          onClick={toggleExperienceMode}
          title={
            experienceMode === 'simple'
              ? 'Current: Simple Mode (Click to switch to Athlete Mode)'
              : 'Current: Athlete Mode (Click to switch to Simple Mode)'
          }
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-sm shrink-0 ${
            experienceMode === 'simple'
              ? 'bg-brand-500/15 hover:bg-brand-500/25 border-brand-500/40 text-brand-300'
              : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-500/40 text-purple-300'
          }`}
        >
          {experienceMode === 'simple' ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Simple</span>
            </>
          ) : (
            <>
              <Flame className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Athlete</span>
            </>
          )}
        </button>
      </div>

      {/* Right: Actions & Fasting / Quick Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
          className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-xs font-bold text-zinc-300 transition-all hover:border-brand-500/40 cursor-pointer select-none shrink-0"
        >
          {themeMode === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline ml-1.5">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="hidden sm:inline ml-1.5">Dark</span>
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

        {/* Quick Shopping List Button (Responsive Compact on Mobile) */}
        <button
          id="btn-header-shopping-list"
          type="button"
          onClick={() => setActiveTab('grocery')}
          title="Open Shopping & Requisition List"
          className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'grocery'
              ? 'bg-brand-500 text-zinc-950 font-bold border-brand-400 shadow-glow'
              : 'bg-surface-100 hover:bg-surface-50 border-surface-border text-zinc-200 hover:border-brand-500/40'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <ShoppingCart className={`w-3.5 h-3.5 ${activeTab === 'grocery' ? 'text-zinc-950 stroke-[2.5]' : 'text-accent-cyan'}`} />
            {unpurchasedCount > 0 && (
              <span
                className={`sm:hidden absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[8px] font-mono font-bold leading-none ${
                  activeTab === 'grocery'
                    ? 'bg-zinc-950 text-brand-300'
                    : 'bg-brand-500 text-zinc-950'
                }`}
              >
                {unpurchasedCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline ml-1.5">Shopping</span>
          {unpurchasedCount > 0 && (
            <span
              className={`hidden sm:inline-block ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'grocery'
                  ? 'bg-zinc-950 text-brand-300'
                  : 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
              }`}
            >
              {unpurchasedCount}
            </span>
          )}
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

        {/* Cloud Account & Cross-Device Sync Button (Fixed Mobile Width) */}
        <button
          id="btn-cloud-sync-header"
          onClick={() => setShowAuthModal(true)}
          title={
            authUser
              ? `Signed in as ${authUser.email} (Click to manage sync)`
              : 'Sign in to sync your data across iPhone, iPad & Computer'
          }
          className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            authUser
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
              : 'bg-surface-100 hover:bg-surface-50 border-surface-border text-zinc-300 hover:border-brand-500/40'
          }`}
        >
          {authUser ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 hidden sm:inline-block"></span>
              <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0 sm:ml-1.5" />
              <span className="hidden md:inline font-mono text-[11px] ml-1.5">Synced</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="hidden sm:inline ml-1.5">Sync</span>
            </>
          )}
        </button>

        {/* Quick Log Meal (Responsive: Square Icon on Mobile, Full Width Label on Tablet/Desktop) */}
        <button
          id="btn-quick-log-meal"
          onClick={() => setActiveTab('nutrition')}
          title="Quick Log Food / Meal"
          className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 sm:w-4 sm:h-4 stroke-[2.5]" />
          <span className="hidden sm:inline text-xs font-bold ml-1.5">Log Food</span>
        </button>
      </div>
    </header>
  );
};
