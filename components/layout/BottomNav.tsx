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
} from 'lucide-react';

interface NavItem {
  id: 'dashboard' | 'nutrition' | 'fasting' | 'workouts' | 'grocery' | 'trends' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string | null;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, experienceMode, groceryList } = useHealth();
  const isSimple = experienceMode === 'simple';
  const unpurchasedCount = groceryList.filter((i) => !i.is_checked && !i.in_pantry).length;

  const navItems: NavItem[] = isSimple
    ? [
        { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
        { id: 'nutrition', label: 'Meals', icon: UtensilsCrossed },
        { id: 'grocery', label: 'Shopping', icon: ShoppingCart, badge: unpurchasedCount > 0 ? unpurchasedCount : null },
        { id: 'workouts', label: 'Movement', icon: Dumbbell },
        { id: 'trends', label: 'Progress', icon: TrendingUp },
      ]
    : [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'nutrition', label: 'Meals', icon: UtensilsCrossed },
        { id: 'fasting', label: 'Fast', icon: Timer },
        { id: 'workouts', label: 'Fitness', icon: Dumbbell },
        { id: 'grocery', label: 'Shopping', icon: ShoppingCart, badge: unpurchasedCount > 0 ? unpurchasedCount : null },
        { id: 'trends', label: 'Stats', icon: TrendingUp },
        { id: 'settings', label: 'Profile', icon: SlidersHorizontal },
      ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-200/95 backdrop-blur-2xl border-t border-surface-border px-1.5 pt-1.5 pb-[max(env(safe-area-inset-bottom),10px)] flex items-center justify-around select-none shadow-2xl"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-tab-${item.id}`}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all duration-200 min-w-[44px] min-h-[44px] cursor-pointer active:scale-95 ${
              isActive
                ? 'text-brand-400 bg-brand-500/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'text-brand-400 stroke-[2.5] scale-110' : 'text-zinc-400'
                }`}
              />
              {item.badge && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-brand-500 text-zinc-950 text-[8px] font-mono font-black rounded-full leading-none shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[9px] mt-0.5 font-sans tracking-tight ${
                isActive ? 'font-black text-brand-300' : 'font-medium text-zinc-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
