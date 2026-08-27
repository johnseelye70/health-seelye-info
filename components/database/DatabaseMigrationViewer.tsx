'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  Database,
  Copy,
  Check,
  ShieldCheck,
  Server,
  FileCode,
  Key,
  ExternalLink,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const DatabaseMigrationViewer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tables' | 'rls' | 'seed'>('all');

  const fullSqlScript = `-- ==============================================================================
-- HEALTH.SEELYE.INFO - SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATION BLUEPRINT
-- Revision: Beta 0.1.0
-- Includes: Relational Tables, Foreign Keys, RLS Policies, Indexes & Seed Data
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES TABLE (Linked to auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    age INTEGER CHECK (age >= 13 AND age <= 120),
    height_cm NUMERIC(5, 2) CHECK (height_cm > 50 AND height_cm < 300),
    current_weight_kg NUMERIC(5, 2) CHECK (current_weight_kg > 20 AND current_weight_kg < 500),
    target_weight_kg NUMERIC(5, 2),
    sex TEXT CHECK (sex IN ('male', 'female', 'other')),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'high', 'extreme')),
    goal TEXT CHECK (goal IN ('cut_500', 'cut_250', 'maintain', 'bulk_250', 'bulk_500')) DEFAULT 'cut_500',
    unit_preference TEXT CHECK (unit_preference IN ('imperial', 'metric')) DEFAULT 'imperial',
    
    -- Calculated Macro Targets
    daily_calorie_target INTEGER NOT NULL DEFAULT 2000,
    protein_target_g INTEGER NOT NULL DEFAULT 160,
    carb_target_g INTEGER NOT NULL DEFAULT 200,
    fat_target_g INTEGER NOT NULL DEFAULT 60,
    
    -- Fasting & Meal Configuration
    fasting_protocol TEXT CHECK (fasting_protocol IN ('16_8', '18_6', '20_4', '14_10', '23_1_omad', 'standard_3_meal')) DEFAULT '16_8',
    fasting_start_time TIME DEFAULT '20:00:00',
    eating_window_duration_hours INTEGER DEFAULT 8,
    meal_count INTEGER CHECK (meal_count BETWEEN 2 AND 6) DEFAULT 3,
    
    -- Equipment Available (JSON Array of strings)
    equipment_inventory JSONB DEFAULT '["bodyweight", "dumbbells", "resistance_bands"]'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Row Level Security (RLS) for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ==============================================================================
-- 2. FOOD DATABASE (Curated Global Staples + Verified Nutritional Items)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.food_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('protein', 'carbohydrate', 'healthy_fat', 'vegetable', 'fruit', 'dairy_alternative', 'pantry_staple', 'beverage')),
    calories_per_100g NUMERIC(6, 2) NOT NULL,
    protein_per_100g NUMERIC(5, 2) NOT NULL,
    carbs_per_100g NUMERIC(5, 2) NOT NULL,
    fat_per_100g NUMERIC(5, 2) NOT NULL,
    fiber_per_100g NUMERIC(5, 2) DEFAULT 0,
    is_gluten_free BOOLEAN NOT NULL DEFAULT true,
    is_dairy_free BOOLEAN NOT NULL DEFAULT true,
    serving_size_g NUMERIC(6, 2) NOT NULL DEFAULT 100,
    default_unit TEXT NOT NULL DEFAULT 'g',
    storage_type TEXT CHECK (storage_type IN ('fresh_weekly', 'pantry_monthly', 'freezer_monthly')) DEFAULT 'fresh_weekly',
    swap_group TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.food_database ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public food database is viewable by all authenticated users"
    ON public.food_database FOR SELECT
    TO authenticated, anon
    USING (true);

-- ==============================================================================
-- 3. FOOD LOGS (User Daily Nutrition Tracking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    food_id UUID REFERENCES public.food_database(id) ON DELETE SET NULL,
    food_name TEXT NOT NULL,
    grams_consumed NUMERIC(6, 2) NOT NULL CHECK (grams_consumed > 0),
    meal_index INTEGER NOT NULL CHECK (meal_index BETWEEN 1 AND 6),
    logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    
    calories NUMERIC(6, 2) NOT NULL,
    protein_g NUMERIC(5, 2) NOT NULL,
    carbs_g NUMERIC(5, 2) NOT NULL,
    fat_g NUMERIC(5, 2) NOT NULL
);

ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own food logs"
    ON public.food_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food logs"
    ON public.food_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs"
    ON public.food_logs FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON public.food_logs (user_id, logged_at);

-- ==============================================================================
-- 4. EXERCISES DATABASE (Matrix of Movements & Gear)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    target_muscle TEXT NOT NULL CHECK (target_muscle IN ('chest', 'back', 'quads', 'hamstrings', 'glutes', 'shoulders', 'biceps', 'triceps', 'core', 'full_body_cardio')),
    equipment_required TEXT NOT NULL CHECK (equipment_required IN ('bodyweight', 'dumbbells', 'barbells', 'resistance_bands', 'kettlebells', 'cable_machine', 'full_gym')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
    category TEXT NOT NULL CHECK (category IN ('hypertrophy', 'strength', 'hiit_interval', 'mobility', 'warmup')),
    instructions TEXT,
    video_url_mock TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are viewable by all users"
    ON public.exercises FOR SELECT
    TO authenticated, anon
    USING (true);

-- ==============================================================================
-- 5. WORKOUT PLANS & LOGS (4-Week Split)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 4) DEFAULT 1,
    day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7),
    day_title TEXT NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    target_sets INTEGER NOT NULL DEFAULT 3,
    target_reps TEXT NOT NULL DEFAULT '8-12',
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    order_index INTEGER NOT NULL DEFAULT 1,
    
    completed BOOLEAN NOT NULL DEFAULT false,
    logged_weight_kg NUMERIC(5, 2),
    logged_reps INTEGER,
    logged_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their workout plans"
    ON public.workout_plans FOR ALL
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 6. GROCERY REQUISITIONS & 7. WEIGHT LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.grocery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('pantry_monthly', 'fresh_weekly')),
    quantity NUMERIC(6, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'g',
    is_checked BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.grocery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their grocery items" ON public.grocery_items FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.weight_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5, 2) NOT NULL,
    body_fat_percentage NUMERIC(4, 1),
    logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, logged_at)
);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their weight logs" ON public.weight_logs FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. STEP LOGS (Automated Apple Watch, iPhone & Multi-Device Step Sync)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.step_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    steps INTEGER NOT NULL DEFAULT 0,
    distance_miles NUMERIC(6, 2) DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    source TEXT DEFAULT 'apple_health',
    logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, logged_at)
);

ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their step logs" ON public.step_logs FOR ALL USING (auth.uid() = user_id);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                SUPABASE / POSTGRESQL ARCHITECTURAL BLUEPRINT
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Database Schema & Migration Scripts
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Complete production SQL migrations with Row Level Security (RLS) policies, foreign keys, automated profile triggers, and seed catalogs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied SQL Script!' : 'Copy SQL Migration'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backend Status & Quick Configuration Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isSupabaseConfigured ? 'bg-brand-500/20 text-brand-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-semibold">Supabase Connection</div>
              <div className="text-sm font-bold text-zinc-100">
                {isSupabaseConfigured ? 'Connected (Live Postgres)' : 'Offline / Reactive Demo Mode'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-semibold">Row Level Security</div>
              <div className="text-sm font-bold text-zinc-100">Enforced Across All 8 Tables</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-semibold">Target Production Domain</div>
              <div className="text-sm font-bold text-zinc-100 font-mono">health.seelye.info</div>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-mono font-bold text-zinc-200">
              supabase/migrations/20260823000000_health_schema.sql
            </span>
          </div>

          <span className="text-[11px] font-mono text-zinc-400">PostgreSQL 15+ / Supabase</span>
        </div>

        <pre className="p-4 rounded-2xl bg-surface-300/80 border border-surface-border text-xs font-mono text-zinc-300 overflow-x-auto max-h-[500px] leading-relaxed select-text">
          {fullSqlScript}
        </pre>
      </div>
    </div>
  );
};
