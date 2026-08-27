'use client';

import React from 'react';
import { useHealth } from '@/context/HealthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { MealPlanner } from '@/components/nutrition/MealPlanner';
import { FastingTracker } from '@/components/fasting/FastingTracker';
import { WorkoutGenerator } from '@/components/workouts/WorkoutGenerator';
import { GroceryManager } from '@/components/grocery/GroceryManager';
import { ProgressTrends } from '@/components/analytics/ProgressTrends';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { AuthModal } from '@/components/auth/AuthModal';

export default function HomePage() {
  const { activeTab } = useHealth();

  return (
    <div className="flex min-h-screen bg-background text-foreground relative w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Persistent Responsive Sidebar Navigation (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0 w-full max-w-full overflow-x-hidden">
        {/* Persistent Top Header */}
        <Header />

        {/* Dynamic Screen View Content */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 max-w-7xl w-full min-w-0 mx-auto overflow-x-hidden">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'nutrition' && <MealPlanner />}
          {activeTab === 'fasting' && <FastingTracker />}
          {activeTab === 'workouts' && <WorkoutGenerator />}
          {activeTab === 'grocery' && <GroceryManager />}
          {activeTab === 'trends' && <ProgressTrends />}
          {activeTab === 'settings' && <ProfileSettings />}

          {/* Mobile View Version Footer (Always visible on iPhone at bottom of document stream) */}
          <footer className="md:hidden text-center pt-8 pb-4 text-xs text-zinc-500 flex flex-col items-center justify-center gap-1 border-t border-surface-border/40 mt-8 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="font-mono text-xs text-zinc-200 font-bold">Health.Seelye b2.27.0</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Precision Nutrition & Adaptive Fitness Engine</span>
          </footer>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <BottomNav />

      {/* Dynamic Macro Calculator & Profile Onboarding Modal */}
      <OnboardingModal />

      {/* Cloud Account & Cross-Device Sync Modal */}
      <AuthModal />
    </div>
  );
}
