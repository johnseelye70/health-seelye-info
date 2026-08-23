'use client';

import React from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Timer,
  Dumbbell,
  ShoppingCart,
  SlidersHorizontal,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHealth();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Meals', icon: UtensilsCrossed },
    { id: 'fasting', label: 'Fast', icon: Timer },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
    { id: 'settings', label: 'Profile', icon: SlidersHorizontal },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-200/95 backdrop-blur-xl border-t border-surface-border px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-tab-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
              isActive ? 'text-brand-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400 stroke-[2.5]' : 'text-zinc-400'}`} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
