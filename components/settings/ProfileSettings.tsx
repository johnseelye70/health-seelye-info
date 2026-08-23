'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { ActivityLevel, BiologicalSex, FastingProtocol, GoalType } from '@/lib/types';
import {
  SlidersHorizontal,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Calculator,
  User,
  History,
  GitCommit,
  CheckCircle2,
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, recalculateMacros, setShowOnboardingModal } = useHealth();

  const [form, setForm] = useState({
    full_name: profile.full_name,
    email: profile.email,
    age: profile.age,
    sex: profile.sex,
    height_cm: profile.height_cm,
    current_weight_kg: profile.current_weight_kg,
    target_weight_kg: profile.target_weight_kg,
    activity_level: profile.activity_level,
    goal: profile.goal,
    meal_count: profile.meal_count,
    fasting_protocol: profile.fasting_protocol,
    fasting_start_time: profile.fasting_start_time,
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: form.full_name,
      email: form.email,
      age: Number(form.age),
      sex: form.sex,
      height_cm: Number(form.height_cm),
      current_weight_kg: Number(form.current_weight_kg),
      target_weight_kg: Number(form.target_weight_kg),
      activity_level: form.activity_level,
      goal: form.goal,
      meal_count: Number(form.meal_count),
      fasting_protocol: form.fasting_protocol,
      fasting_start_time: form.fasting_start_time,
    });
    recalculateMacros();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const changelogHistory = [
    {
      version: 'Beta 0.2.0',
      date: '2026-08-23',
      title: 'Supabase PostgreSQL Production Connection',
      changes: [
        'Configured live Supabase database backend connection with production URL normalization and anon API authentication.',
        'Connected real-time client state initialization with automatic fallback persistence.',
      ],
    },
    {
      version: 'Beta 0.1.0',
      date: '2026-08-23',
      title: 'Initial Architecture & Blueprint Release',
      changes: [
        'Complete React/Next.js App Router frontend with Tailwind CSS and dark-mode first design tokens.',
        'Dynamic Macro Calculator Engine supporting Mifflin-St Jeor BMR and activity level TDEE formulas with standard 500 kcal fat-oxidation deficit.',
        'Dynamic Meal Splitter recalculating per-meal targets across 2, 3, or 4 meals per day in real-time.',
        'Fasting & Feeding Window Manager supporting 16:8, 18:6, 20:4, 14:10, and OMAD protocols with live countdown clocks and biological milestones.',
        'Real-time Food Swap engine calculating exact equivalent portion grams to match target protein and carbs.',
        'Automated Grocery Requisition system categorizing fresh pickups vs pantry staples with serving scaler and monochrome print optimization.',
        'Equipment-filtered 4-week periodized workout generator with interactive player and HIIT interval synthesizer timer.',
        'Comprehensive Supabase PostgreSQL relational database migration script with RLS policies, triggers, and seed catalogs.',
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                SYSTEM PREFERENCES & ATHLETE PROFILE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Settings & Version History
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Configure your biological metrics, fasting parameters, and review application revision release notes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all hover:border-zinc-700"
            >
              <Calculator className="w-4 h-4 text-accent-cyan" />
              <span>Rerun Macro Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            <h2 className="text-base font-bold text-zinc-100">Athlete Biometrics & Parameters</h2>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-brand-400 font-semibold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Changes Saved & Macros Recalculated!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-300">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Biological Sex</label>
            <select
              value={form.sex}
              onChange={(e) => setForm({ ...form, sex: e.target.value as BiologicalSex })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Neutral</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Height (cm)</label>
            <input
              type="number"
              value={form.height_cm}
              onChange={(e) => setForm({ ...form, height_cm: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Current Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              value={form.current_weight_kg}
              onChange={(e) => setForm({ ...form, current_weight_kg: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Target Goal Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              value={form.target_weight_kg}
              onChange={(e) => setForm({ ...form, target_weight_kg: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Activity Multiplier</label>
            <select
              value={form.activity_level}
              onChange={(e) => setForm({ ...form, activity_level: e.target.value as ActivityLevel })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
            >
              <option value="sedentary">Sedentary (1.2x)</option>
              <option value="light">Lightly Active (1.375x)</option>
              <option value="moderate">Moderately Active (1.55x)</option>
              <option value="high">Highly Active (1.725x)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Nutritional Objective</label>
            <select
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value as GoalType })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
            >
              <option value="cut_500">Fat Loss (500 kcal Deficit)</option>
              <option value="cut_250">Conservative Deficit (250 kcal)</option>
              <option value="maintain">Maintenance / Recomp</option>
              <option value="bulk_250">Lean Muscle Gain (+250 kcal)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-border flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 text-xs font-bold shadow-glow"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate</span>
          </button>
        </div>
      </form>

      {/* Version History & Changelog Display (Required by standard) */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-base font-bold text-zinc-100">Version History & Changelog</h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            Active: Beta 0.2.0
          </span>
        </div>

        <div className="space-y-6">
          {changelogHistory.map((release) => (
            <div key={release.version} className="space-y-3">
              <div className="flex items-center gap-3">
                <GitCommit className="w-5 h-5 text-brand-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-zinc-100">{release.version}</span>
                    <span className="text-xs text-zinc-400 font-mono">({release.date})</span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-300">{release.title}</div>
                </div>
              </div>

              <ul className="pl-8 space-y-1.5 text-xs text-zinc-400 list-disc">
                {release.changes.map((change, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
