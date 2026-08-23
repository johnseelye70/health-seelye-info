'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  ActivityLevel,
  BiologicalSex,
  FastingProtocol,
  GoalType,
  UnitPreference,
  ExperienceMode,
} from '@/lib/types';
import { kgToLbs, lbsToKg, cmToFtIn, ftInToCm } from '@/lib/units';
import {
  User,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Save,
  Calculator,
  GitCommit,
  History,
  Scale,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  Lock,
  Cloud,
  Smartphone,
  Laptop,
  RefreshCw,
  LogOut,
  Check,
  Copy,
  Code,
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '@/lib/supabase/schema-sql';

export const ProfileSettings: React.FC = () => {
  const {
    profile,
    updateProfile,
    recalculateMacros,
    setShowOnboardingModal,
    resetAllData,
    experienceMode,
    setExperienceMode,
    authUser,
    setShowAuthModal,
    syncStatus,
    syncWithCloud,
    signOut,
    lastSyncedAt,
  } = useHealth();

  const isImperial = profile.unit_preference === 'imperial';
  const initialFtIn = cmToFtIn(profile.height_cm);

  const [showChangelog, setShowChangelog] = useState<boolean>(false);
  const [form, setForm] = useState({
    full_name: profile.full_name,
    email: profile.email,
    age: profile.age,
    sex: profile.sex,
    unit_preference: profile.unit_preference,
    experience_mode: profile.experience_mode || 'simple',
    height_cm: profile.height_cm,
    height_ft: initialFtIn.feet,
    height_in: initialFtIn.inches,
    current_weight_input: isImperial ? kgToLbs(profile.current_weight_kg) : profile.current_weight_kg,
    target_weight_input: isImperial ? kgToLbs(profile.target_weight_kg) : profile.target_weight_kg,
    activity_level: profile.activity_level,
    goal: profile.goal,
    meal_count: profile.meal_count,
    fasting_protocol: profile.fasting_protocol,
    fasting_start_time: profile.fasting_start_time,
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);
  const [showSqlViewer, setShowSqlViewer] = useState<boolean>(false);

  const handleCopySql = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2500);
    }
  };

  const handleUnitToggle = (newUnit: UnitPreference) => {
    if (newUnit === form.unit_preference) return;

    if (newUnit === 'imperial') {
      // Metric to Imperial
      const ftIn = cmToFtIn(form.height_cm);
      setForm((prev) => ({
        ...prev,
        unit_preference: 'imperial',
        height_ft: ftIn.feet,
        height_in: ftIn.inches,
        current_weight_input: kgToLbs(prev.current_weight_input),
        target_weight_input: kgToLbs(prev.target_weight_input),
      }));
    } else {
      // Imperial to Metric
      const cm = ftInToCm(form.height_ft, form.height_in);
      setForm((prev) => ({
        ...prev,
        unit_preference: 'metric',
        height_cm: cm,
        current_weight_input: lbsToKg(prev.current_weight_input),
        target_weight_input: lbsToKg(prev.target_weight_input),
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const finalWeightKg = form.unit_preference === 'imperial'
      ? lbsToKg(Number(form.current_weight_input))
      : Number(form.current_weight_input);

    const finalTargetWeightKg = form.unit_preference === 'imperial'
      ? lbsToKg(Number(form.target_weight_input))
      : Number(form.target_weight_input);

    const finalHeightCm = form.unit_preference === 'imperial'
      ? ftInToCm(Number(form.height_ft), Number(form.height_in))
      : Number(form.height_cm);

    updateProfile({
      full_name: form.full_name,
      email: form.email,
      age: Number(form.age),
      sex: form.sex,
      unit_preference: form.unit_preference,
      experience_mode: form.experience_mode,
      height_cm: finalHeightCm,
      current_weight_kg: finalWeightKg,
      target_weight_kg: finalTargetWeightKg,
      activity_level: form.activity_level,
      goal: form.goal,
      meal_count: Number(form.meal_count),
      fasting_protocol: form.fasting_protocol,
      fasting_start_time: form.fasting_start_time,
    });

    setExperienceMode(form.experience_mode);
    recalculateMacros();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    resetAllData();
    setForm({
      full_name: 'John Seelye',
      email: 'john@seelye.info',
      age: 35,
      sex: 'male',
      unit_preference: 'imperial',
      experience_mode: 'simple',
      height_cm: 178,
      height_ft: 5,
      height_in: 10,
      current_weight_input: 176.0,
      target_weight_input: 165.0,
      activity_level: 'moderate',
      goal: 'cut_500',
      meal_count: 3,
      fasting_protocol: '16_8',
      fasting_start_time: '20:00',
    });
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const changelogHistory = [
    {
      version: 'Beta 0.12.3',
      date: '2026-08-23',
      title: 'Universal Schema Self-Healing & Column Auto-Provisioning (ADD COLUMN IF NOT EXISTS)',
      changes: [
        'Added ADD COLUMN IF NOT EXISTS for all table columns (including user_id) preventing 42703 column missing errors on existing databases.',
        'Guaranteed 100% idempotent SQL execution regardless of prior schema state.',
      ],
    },
    {
      version: 'Beta 0.12.2',
      date: '2026-08-23',
      title: 'Idempotent Supabase SQL Schema Execution (DROP POLICY IF EXISTS)',
      changes: [
        'Added DROP POLICY IF EXISTS guards before all Row-Level Security policy definitions to prevent 42710 duplicate object errors on re-execution.',
        'Updated in-app schema copy utility with safe idempotent script.',
      ],
    },
    {
      version: 'Beta 0.12.1',
      date: '2026-08-23',
      title: 'In-App 1-Click Supabase SQL Schema Copy & Live Script Viewer',
      changes: [
        'Added 1-click "Copy SQL Script" button with clipboard confirmation feedback inside the Goals & Profile cloud panel.',
        'Added inline interactive Supabase SQL script inspector with full schema and RLS policies.',
      ],
    },
    {
      version: 'Beta 0.12.0',
      date: '2026-08-23',
      title: 'Multi-Device Account Creation & Bidirectional Cloud Sync',
      changes: [
        'Added hybrid offline-first cloud authentication allowing users to create accounts with email & password.',
        'Engineered bidirectional non-destructive cloud sync carrying over meals, workouts, weights, and goals across desktop, laptop, tablet, and phone.',
        'Integrated multi-device account management panel in Goals & Profile and persistent sync status indicators in Header and Sidebar.',
      ],
    },
    {
      version: 'Beta 0.11.0',
      date: '2026-08-23',
      title: 'Collapsible Changelog & Interactive Version Access Button',
      changes: [
        'Hidden verbose changelog history behind the active version trigger button to maintain an uncluttered Goals & Profile screen.',
        'Engineered smooth inline collapsible disclosure (pre-architected for future Admin password gate).',
      ],
    },
    {
      version: 'Beta 0.10.1',
      date: '2026-08-23',
      title: 'Static Generation Timeout Fix & Deterministic Catalog Matrix',
      changes: [
        'Resolved static page compilation timeout on Next.js / Vercel cloud builds.',
        'Refactored catalog generator with deterministic bounded loops executing in < 1ms.',
      ],
    },
    {
      version: 'Beta 0.10.0',
      date: '2026-08-23',
      title: 'Massive Food Catalog Expansion (1,250+ Verified Foods)',
      changes: [
        'Expanded entire nutrition catalog to 1,250+ authentic verified items across all 10 master categories (125+ items per category).',
        'Added comprehensive preparation styles, cuts, wild/organic variants, and precise USDA macro profiles.',
        'Upgraded state migration engine to v6 ensuring all 1,250 items load instantaneously.',
      ],
    },
    {
      version: 'Beta 0.9.0',
      date: '2026-08-23',
      title: '3-Tier Progressive Food Browser & Expansive Sub-Categories',
      changes: [
        'Added a second hierarchical layer with specific Sub-Categories (e.g. Chicken Cuts, Turkey, Steaks, Lean Ground Meats, Pork Cuts, Wild Salmon, White Fish, Whole Eggs, Greek Yogurts, Rolled Oats, Breads, Berries, etc.).',
        'Engineered 3-Tier Progressive Disclosure architecture: Master Categories -> Sub-Categories -> Food Items.',
        'Added dynamic breadcrumb navigation with one-click step-back links.',
        'Omnipresent global instant search querying across food names, parent categories, and subcategories.',
      ],
    },
    {
      version: 'Beta 0.8.0',
      date: '2026-08-23',
      title: 'Food Database State Migration & Category Normalization',
      changes: [
        'Added automated state migration (v4) to guarantee full 120+ food database loads across all user sessions.',
        'Implemented bidirectional category normalizer ensuring all items populate their respective visual categories without manual cache resets.',
        'Integrated multi-attribute keyword matching across food names and normalized category tags.',
      ],
    },
    {
      version: 'Beta 0.7.0',
      date: '2026-08-23',
      title: 'Comprehensive Layered Food Database & Instant Search',
      changes: [
        'Expanded food database to 120+ authentic ingredients across 10 clean, visual categories.',
        'Engineered 2-layer progressive exploration: Category cards drill down seamlessly to prevent visual clutter.',
        'Added global instant search bar to find any food across all categories in real-time with zero lag.',
        'Added quick dietary filter pills (🥩 High Protein, 🌾 Gluten-Free, 🥛 Dairy-Free).',
      ],
    },
    {
      version: 'Beta 0.6.0',
      date: '2026-08-23',
      title: 'Dual Experience Modes (Casual Friendly vs Athlete Pro)',
      changes: [
        'Added "Simple & Friendly Mode" by default with warm, encouraging terminology, clean layouts, and hydration tracking.',
        'Preserved full power "Advanced Athlete Mode" with periodized splits, granular macro ratios, and biological fasting milestones.',
        'Added persistent Experience Mode switcher in Header, Sidebar, and Settings.',
      ],
    },
    {
      version: 'Beta 0.5.0',
      date: '2026-08-23',
      title: 'Imperial & Metric System Customization',
      changes: [
        'Added global toggle for Imperial (lbs / ft-in) and Metric (kg / cm) measurement systems.',
        'Integrated real-time unit switcher button in header, settings, and biometric logs.',
        'Dynamic weight logger adapting in exercise sets and SVG trend curves.',
      ],
    },
    {
      version: 'Beta 0.4.0',
      date: '2026-08-23',
      title: 'UI Streamlining & Production Navigation Polish',
      changes: [
        'Removed developer Database Blueprint tab from end-user navigation.',
        'Preserved PostgreSQL schema migrations in repository root for developer deployment.',
      ],
    },
    {
      version: 'Beta 0.3.0',
      date: '2026-08-23',
      title: 'Production State Cleanse & Fresh Initialization',
      changes: [
        'Removed all placeholder athlete test personas (Alex Vance), dummy food logs, and simulated weigh-in histories.',
        'Reset initial user profile to clean production defaults ready for personalization.',
        'Added one-click database/storage purge and state reset engine in settings.',
      ],
    },
    {
      version: 'Beta 0.2.0',
      date: '2026-08-23',
      title: 'Supabase PostgreSQL Production Connection',
      changes: [
        'Configured live Supabase database backend connection with production URL normalization and anon API authentication.',
        'Connected real-time client state initialization with automatic fallback persistence.',
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
                SYSTEM CONFIGURATION & PREFERENCES
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-brand-400 font-mono text-xs font-bold uppercase">
                {form.experience_mode === 'simple' ? '✨ Simple Mode Active' : '⚡ Athlete Mode Active'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Goals & Profile Settings
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Customize your experience mode, biological metrics, unit preferences, fasting times, and review application revision history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all hover:border-zinc-700"
            >
              <Calculator className="w-4 h-4 text-accent-cyan" />
              <span>Rerun Nutrition Setup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Account & Cross-Device Sync Card */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-glow">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">Multi-Device Cloud Account</h2>
              <p className="text-xs text-zinc-400">
                {authUser
                  ? `Connected as ${authUser.email}`
                  : 'Sync meals, workouts, weights, and goals across your iPhone, iPad, and computer.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {authUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={syncWithCloud}
                  disabled={syncStatus === 'syncing'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-brand-400' : ''}`} />
                  <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Cloud Records'}</span>
                </button>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 transition-all active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 cursor-pointer"
              >
                <Cloud className="w-4 h-4" />
                <span>Create Account / Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Sync Status Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-200/60 border border-surface-border flex items-center justify-between">
            <span className="text-zinc-400">Account Status:</span>
            <span className="font-semibold text-zinc-200">
              {authUser ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Authenticated</span>
                </span>
              ) : (
                <span className="text-amber-400">Local Device Only</span>
              )}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-200/60 border border-surface-border flex items-center justify-between">
            <span className="text-zinc-400">Supported Devices:</span>
            <span className="font-semibold text-zinc-200 flex items-center gap-2 font-mono text-[11px]">
              <Smartphone className="w-3.5 h-3.5 text-brand-400" />
              <span>iOS / Android / Mac / PC</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-200/60 border border-surface-border flex items-center justify-between">
            <span className="text-zinc-400">Last Synced:</span>
            <span className="font-mono text-zinc-300 text-[11px]">
              {lastSyncedAt ? `${lastSyncedAt}` : (authUser ? 'Just now' : 'Local Storage')}
            </span>
          </div>
        </div>

        {/* Supabase SQL Database Setup Bar with 1-Click Copy */}
        <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Code className="w-4 h-4 text-brand-400" />
            <span>Supabase PostgreSQL Schema & Security Policies (RLS)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-copy-sql-schema"
              onClick={handleCopySql}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                sqlCopied
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-zinc-200 hover:border-brand-500/40'
              }`}
            >
              {sqlCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SQL Schema Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-brand-400" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowSqlViewer((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-surface-200/60 hover:bg-surface-200 border border-surface-border text-zinc-400 hover:text-zinc-200 text-xs font-medium cursor-pointer"
            >
              {showSqlViewer ? 'Hide SQL' : 'View SQL'}
            </button>
          </div>
        </div>

        {showSqlViewer && (
          <div className="p-4 rounded-2xl bg-surface-300/80 border border-surface-border font-mono text-[11px] text-zinc-300 max-h-60 overflow-y-auto space-y-2 select-all animate-fadeIn">
            <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-6">
        {/* Experience Mode Selector Card */}
        <div className="p-5 rounded-2xl bg-surface-200/80 border border-surface-border space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-zinc-100">Application Experience Mode</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Choose how detailed and technical you want the application to be. You can switch between modes at any time without losing any data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => setForm({ ...form, experience_mode: 'simple' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                form.experience_mode === 'simple'
                  ? 'bg-brand-500/15 border-brand-500/50 shadow-glow text-white'
                  : 'bg-surface-300/40 border-surface-border text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 mb-1">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>✨ Simple & Friendly Mode (Recommended)</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Warm, encouraging language with clean daily calorie tracking, hydration goals, friendly portion sizes, and easy guided routines.
              </p>
            </div>

            <div
              onClick={() => setForm({ ...form, experience_mode: 'advanced' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                form.experience_mode === 'advanced'
                  ? 'bg-purple-950/40 border-purple-500/50 shadow-glow text-white'
                  : 'bg-surface-300/40 border-surface-border text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 mb-1">
                <Flame className="w-4 h-4 text-purple-400" />
                <span>⚡ Advanced Athlete Mode</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Granular macronutrient ratios (P/C/F grams & percentages), 4-week periodized split matrices, set-by-set weight logging, and biological fasting milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Biometrics & Units Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            <h2 className="text-base font-bold text-zinc-100">Personal Health Metrics</h2>
          </div>

          {/* Unit System Switcher */}
          <div className="flex items-center gap-2 bg-surface-200 p-1 rounded-xl border border-surface-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleUnitToggle('imperial')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                form.unit_preference === 'imperial'
                  ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Imperial (lbs / ft-in)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('metric')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                form.unit_preference === 'metric'
                  ? 'bg-accent-cyan text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Metric (kg / cm)
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs text-brand-400 font-semibold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved & Plan Updated!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-300">Your Name</label>
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

          {/* Height Input (Conditional: ft/in or cm) */}
          {form.unit_preference === 'imperial' ? (
            <div>
              <label className="font-semibold text-zinc-300">Height (Feet & Inches)</label>
              <div className="flex gap-2 mt-1">
                <div className="flex-1 flex items-center bg-surface-200 border border-surface-border rounded-xl px-3 py-2">
                  <input
                    type="number"
                    min="3"
                    max="8"
                    value={form.height_ft}
                    onChange={(e) => setForm({ ...form, height_ft: Number(e.target.value) })}
                    className="w-full bg-transparent text-zinc-100 font-mono text-xs focus:outline-none"
                  />
                  <span className="text-zinc-500 font-mono text-xs">ft</span>
                </div>
                <div className="flex-1 flex items-center bg-surface-200 border border-surface-border rounded-xl px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={form.height_in}
                    onChange={(e) => setForm({ ...form, height_in: Number(e.target.value) })}
                    className="w-full bg-transparent text-zinc-100 font-mono text-xs focus:outline-none"
                  />
                  <span className="text-zinc-500 font-mono text-xs">in</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="font-semibold text-zinc-300">Height (cm)</label>
              <input
                type="number"
                value={form.height_cm}
                onChange={(e) => setForm({ ...form, height_cm: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono"
              />
            </div>
          )}

          {/* Weight Input (Conditional: lbs or kg) */}
          <div>
            <label className="font-semibold text-zinc-300">
              Current Weight ({form.unit_preference === 'imperial' ? 'lbs' : 'kg'})
            </label>
            <input
              type="number"
              step="0.1"
              value={form.current_weight_input}
              onChange={(e) => setForm({ ...form, current_weight_input: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono"
            />
          </div>

          {/* Target Weight Input (Conditional: lbs or kg) */}
          <div>
            <label className="font-semibold text-zinc-300">
              Target Goal Weight ({form.unit_preference === 'imperial' ? 'lbs' : 'kg'})
            </label>
            <input
              type="number"
              step="0.1"
              value={form.target_weight_input}
              onChange={(e) => setForm({ ...form, target_weight_input: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Activity Level</label>
            <select
              value={form.activity_level}
              onChange={(e) => setForm({ ...form, activity_level: e.target.value as ActivityLevel })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
            >
              <option value="sedentary">Sedentary (Mostly desk work)</option>
              <option value="light">Light Activity (1-3 days walks/workouts)</option>
              <option value="moderate">Moderate Activity (3-5 days workouts)</option>
              <option value="high">High Activity (6-7 days hard training)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-zinc-300">Primary Wellness Goal</label>
            <select
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value as GoalType })}
              className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
            >
              <option value="cut_500">Healthy Weight Loss (~1 lb/week)</option>
              <option value="cut_250">Gentle Weight Loss (~0.5 lb/week)</option>
              <option value="maintain">Maintain Healthy Weight & Vitality</option>
              <option value="bulk_250">Build Strength & Muscle Tone</option>
            </select>
          </div>
        </div>

        {resetSuccess && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-fadeIn">
            ✓ All local session cache and historical dummy data purged! Fresh state initialized.
          </div>
        )}

        <div className="pt-4 border-t border-surface-border flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Purge Data & Reset to Clean State</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 text-xs font-bold shadow-glow"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences & Recalculate</span>
          </button>
        </div>
      </form>

      {/* Version History & Changelog Display (Required by standard - Hidden behind version button) */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-base font-bold text-zinc-100">Application Version</h2>
          </div>

          {/* Interactive Version Trigger Button */}
          <button
            type="button"
            id="toggle-changelog-btn"
            onClick={() => setShowChangelog((prev) => !prev)}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Click to view release changelog history"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span>Active: Beta 0.12.3</span>
            {showChangelog ? (
              <ChevronUp className="w-3.5 h-3.5 text-brand-400 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-brand-400 group-hover:translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>

        {/* 100% Inline Collapsible Changelog Drawer */}
        {showChangelog && (
          <div className="pt-4 border-t border-surface-border space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">Release Changelog History</span>
              <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                <span>Admin Passcode Ready</span>
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
                      <h3 className="text-xs font-semibold text-zinc-300 mt-0.5">{release.title}</h3>
                    </div>
                  </div>
                  <ul className="pl-8 list-disc space-y-1.5 text-xs text-zinc-400">
                    {release.changes.map((change, i) => (
                      <li key={i} className="leading-relaxed">{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
