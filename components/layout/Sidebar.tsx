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
  Database,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Sparkles,
  Cloud,
  UserCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    profile,
    fastingStatus,
    isDemoMode,
    experienceMode,
    authUser,
    setShowAuthModal,
  } = useHealth();

  const isSimple = experienceMode === 'simple';

  const navItems = isSimple
    ? ([
        { id: 'dashboard', label: 'Today', icon: Sparkles, badge: null },
        { id: 'nutrition', label: 'Food & Meals', icon: UtensilsCrossed, badge: null },
        { id: 'workouts', label: 'Movement', icon: Dumbbell, badge: null },
        { id: 'trends', label: 'Progress & Goals', icon: TrendingUp, badge: null },
      ] as const)
    : ([
        { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'nutrition', label: 'Macro Split & Foods', icon: UtensilsCrossed, badge: `${profile.meal_count} Meals` },
        { id: 'fasting', label: 'Fasting Telemetry', icon: Timer, badge: fastingStatus.isFasting ? 'Fasting' : 'Eating Window' },
        { id: 'workouts', label: 'Workout Split & Math', icon: Dumbbell, badge: '4-Week' },
        { id: 'grocery', label: 'Macro Requisition', icon: ShoppingCart, badge: 'Auto' },
        { id: 'trends', label: 'Biometric Analytics', icon: TrendingUp, badge: null },
        { id: 'settings', label: 'BMR & System Settings', icon: SlidersHorizontal, badge: null },
      ] as const);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-200/90 border-r border-surface-border h-screen sticky top-0 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-teal flex items-center justify-center shadow-glow">
            <Flame className="w-5 h-5 text-zinc-950 fill-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white font-sans">
                SEELYE FAMILY <span className="text-brand-400">HEALTH</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">Precision Nutrition & Fit</p>
          </div>
        </div>
      </div>

      {/* Logged-on User Status & Cloud Account Pill */}
      <div className="px-4 py-3 border-b border-surface-border/60 bg-surface-300/40 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Logged-on User:</span>
          <span className="font-semibold text-zinc-200 truncate max-w-[120px]">
            {authUser ? (authUser.user_metadata?.full_name || profile.full_name) : profile.full_name}
          </span>
        </div>

        {/* Cloud Sync Status Indicator */}
        <button
          type="button"
          onClick={() => setShowAuthModal(true)}
          className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg bg-surface-200/80 hover:bg-surface-200 border border-surface-border text-[11px] transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${authUser ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`}></span>
            <span className={authUser ? 'text-emerald-300 font-mono font-medium' : 'text-zinc-400 font-medium'}>
              {authUser ? 'Cloud Synced' : 'Guest / Local'}
            </span>
          </div>
          <span className="text-brand-400 text-[10px] hover:underline font-semibold">
            {authUser ? 'Manage' : 'Sign In'}
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-500/20 to-accent-teal/10 text-brand-400 border border-brand-500/30 shadow-glow font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-surface-100/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'bg-zinc-800 text-zinc-400'
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
      <div className="p-4 border-t border-surface-border text-xs text-zinc-400 bg-surface-300/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          <span className="font-mono text-[11px] text-zinc-300">Beta 2.3.0</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">health.seelye.info</span>
      </div>
    </aside>
  );
};
