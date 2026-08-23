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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, profile, fastingStatus, isDemoMode, experienceMode } = useHealth();

  const isSimple = experienceMode === 'simple';

  const navItems = [
    { id: 'dashboard', label: isSimple ? 'Home Overview' : 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'nutrition', label: isSimple ? 'Food & Meals' : 'Meal Plan & Food', icon: UtensilsCrossed, badge: `${profile.meal_count} Meals` },
    { id: 'fasting', label: isSimple ? 'Eating & Fasting' : 'Fasting Tracker', icon: Timer, badge: fastingStatus.isFasting ? (isSimple ? 'Fasting' : 'Fasting') : (isSimple ? 'Eating' : 'Eating') },
    { id: 'workouts', label: isSimple ? 'Daily Fitness' : 'Workout Split', icon: Dumbbell, badge: isSimple ? 'Active' : '4-Week' },
    { id: 'grocery', label: isSimple ? 'Shopping List' : 'Grocery Manager', icon: ShoppingCart, badge: 'Auto' },
    { id: 'trends', label: isSimple ? 'My Progress' : 'Weight & Trends', icon: TrendingUp, badge: null },
    { id: 'settings', label: isSimple ? 'Goals & Profile' : 'Macro & Profile', icon: SlidersHorizontal, badge: null },
  ] as const;

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
              <span className="font-black text-lg tracking-tight text-white font-sans">
                HEALTH<span className="text-brand-400">.SEELYE</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">Precision Nutrition & Fit</p>
          </div>
        </div>
      </div>

      {/* Athlete Status Pill */}
      <div className="px-4 py-3 border-b border-surface-border/60 bg-surface-300/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Athlete:</span>
          <span className="font-semibold text-zinc-200">{profile.full_name}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] mt-1">
          <span className="text-zinc-400">Protocol:</span>
          <span className="text-brand-400 font-mono font-medium">{profile.fasting_protocol.replace('_', ':').toUpperCase()}</span>
        </div>
        {isDemoMode && (
          <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Active Demo State</span>
          </div>
        )}
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
          <span className="font-mono text-[11px] text-zinc-300">Beta 0.11.0</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">health.seelye.info</span>
      </div>
    </aside>
  );
};
