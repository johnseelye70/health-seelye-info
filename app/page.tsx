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

export default function HomePage() {
  const { activeTab } = useHealth();

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Persistent Responsive Sidebar Navigation (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Persistent Top Header */}
        <Header />

        {/* Dynamic Screen View Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'nutrition' && <MealPlanner />}
          {activeTab === 'fasting' && <FastingTracker />}
          {activeTab === 'workouts' && <WorkoutGenerator />}
          {activeTab === 'grocery' && <GroceryManager />}
          {activeTab === 'trends' && <ProgressTrends />}
          {activeTab === 'settings' && <ProfileSettings />}
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <BottomNav />

      {/* Dynamic Macro Calculator & Profile Onboarding Modal */}
      <OnboardingModal />
    </div>
  );
}
