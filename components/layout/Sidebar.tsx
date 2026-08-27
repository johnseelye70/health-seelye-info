'use client';

import React from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Timer,
  Dumbbell,
  ShoppingCart,
  TrendingUp,
  SlidersHorizontal,
  Flame,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    profile,
    fastingStatus,
    experienceMode,
    authUser,
    setShowAuthModal,
    groceryList,
  } = useHealth();

  const isSimple = experienceMode === 'simple';
  const unpurchasedGroceryCount = groceryList.filter((i) => !i.is_checked && !i.in_pantry).length;

  const navItems = isSimple
    ? ([
        { id: 'dashboard', label: 'Today', icon: Sparkles, color: 'text-brand-400', activeBg: 'bg-brand-500/15 border-brand-500/40 text-brand-400', badge: null },
        { id: 'nutrition', label: 'Food & Meals', icon: UtensilsCrossed, color: 'text-accent-amber', activeBg: 'bg-accent-amber/15 border-accent-amber/40 text-accent-amber', badge: null },
        { id: 'grocery', label: 'Shopping List', icon: ShoppingCart, color: 'text-accent-emerald', activeBg: 'bg-accent-emerald/15 border-accent-emerald/40 text-accent-emerald', badge: unpurchasedGroceryCount > 0 ? `${unpurchasedGroceryCount}` : null },
        { id: 'workouts', label: 'Movement', icon: Dumbbell, color: 'text-accent-coral', activeBg: 'bg-accent-coral/15 border-accent-coral/40 text-accent-coral', badge: null },
        { id: 'trends', label: 'Progress & Goals', icon: TrendingUp, color: 'text-accent-cyan', activeBg: 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan', badge: null },
      ] as const)
    : ([
        { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard, color: 'text-brand-400', activeBg: 'bg-brand-500/15 border-brand-500/40 text-brand-400', badge: null },
        { id: 'nutrition', label: 'Macro Split & Foods', icon: UtensilsCrossed, color: 'text-accent-amber', activeBg: 'bg-accent-amber/15 border-accent-amber/40 text-accent-amber', badge: `${profile.meal_count} Meals` },
        { id: 'fasting', label: 'Fasting Telemetry', icon: Timer, color: 'text-accent-purple', activeBg: 'bg-accent-purple/15 border-accent-purple/40 text-accent-purple', badge: fastingStatus.isFasting ? 'Fasting' : 'Eating Window' },
        { id: 'workouts', label: 'Workout Split & Math', icon: Dumbbell, color: 'text-accent-coral', activeBg: 'bg-accent-coral/15 border-accent-coral/40 text-accent-coral', badge: '4-Week' },
        { id: 'grocery', label: 'Shopping List & Pantry', icon: ShoppingCart, color: 'text-accent-emerald', activeBg: 'bg-accent-emerald/15 border-accent-emerald/40 text-accent-emerald', badge: unpurchasedGroceryCount > 0 ? `${unpurchasedGroceryCount}` : 'Auto' },
        { id: 'trends', label: 'Biometric Analytics', icon: TrendingUp, color: 'text-accent-cyan', activeBg: 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan', badge: null },
        { id: 'settings', label: 'BMR & System Settings', icon: SlidersHorizontal, color: 'text-indigo-400', activeBg: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400', badge: null },
      ] as const);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-200 border-r border-surface-border h-screen sticky top-0 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-teal flex items-center justify-center shadow-glow">
            <Flame className="w-5 h-5 text-zinc-950 fill-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-foreground font-sans">
                SEELYE FAMILY <span className="text-brand-500">HEALTH</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Precision Nutrition & Fit</p>
          </div>
        </div>
      </div>

      {/* Logged-on User Status & Cloud Account Pill */}
      <div className="px-4 py-3 border-b border-surface-border/60 bg-surface-300/40 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Logged-on User:</span>
          <span className="font-semibold text-foreground truncate max-w-[120px]">
            {authUser ? (authUser.user_metadata?.full_name || profile.full_name) : profile.full_name}
          </span>
        </div>

        {/* Cloud Sync Status Indicator */}
        <button
          type="button"
          onClick={() => setShowAuthModal(true)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-[11px] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${authUser ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
            <span className={authUser ? 'text-emerald-500 font-mono font-medium' : 'text-zinc-500 font-medium'}>
              {authUser ? 'Cloud Synced' : 'Guest / Local'}
            </span>
          </div>
          <span className="text-brand-500 text-[10px] hover:underline font-semibold">
            {authUser ? 'Manage' : 'Sign In'}
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold text-zinc-400 px-3 mb-2 tracking-wider">
          Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${item.activeBg} border shadow-sm font-bold`
                  : 'text-zinc-500 hover:text-foreground hover:bg-surface-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-surface-100/90 text-foreground border border-surface-border'
                      : 'bg-surface-100 text-zinc-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Version Footer */}
      <div className="p-4 border-t border-surface-border text-xs text-zinc-500 bg-surface-300/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          <span className="font-mono text-[11px] text-foreground font-semibold">b2.21.0</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">health.seelye.info</span>
      </div>
    </aside>
  );
};
