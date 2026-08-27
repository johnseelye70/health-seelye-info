export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- Health.Seelye.Info — Supabase PostgreSQL Schema & Security Policies
-- Version: Beta 0.12.3 (Guaranteed Schema Repair & Auto Column Migration)
-- Production Domain: https://health.seelye.info
-- =========================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Ensure all columns exist on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age INTEGER DEFAULT 35;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height_cm NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_weight_kg NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_weight_kg NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sex TEXT DEFAULT 'male';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activity_level TEXT DEFAULT 'moderate';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goal TEXT DEFAULT 'cut_500';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unit_preference TEXT DEFAULT 'imperial';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_calorie_target INTEGER DEFAULT 2150;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS protein_target_g INTEGER DEFAULT 176;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS carb_target_g INTEGER DEFAULT 210;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fat_target_g INTEGER DEFAULT 60;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fasting_protocol TEXT DEFAULT '16_8';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fasting_start_time TEXT DEFAULT '20:00';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS eating_window_duration_hours INTEGER DEFAULT 8;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS meal_count INTEGER DEFAULT 3;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS equipment_inventory JSONB DEFAULT '["bodyweight", "dumbbells", "resistance_bands"]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- 2. FOOD LOGS TABLE
CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Ensure all columns exist on food_logs
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS food_id TEXT;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS food_name TEXT;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS grams_consumed NUMERIC;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS meal_index INTEGER DEFAULT 1;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS logged_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS calories NUMERIC;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS protein_g NUMERIC;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS carbs_g NUMERIC;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS fat_g NUMERIC;
ALTER TABLE public.food_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own food logs" ON public.food_logs;
CREATE POLICY "Users can view their own food logs"
  ON public.food_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own food logs" ON public.food_logs;
CREATE POLICY "Users can insert their own food logs"
  ON public.food_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own food logs" ON public.food_logs;
CREATE POLICY "Users can update their own food logs"
  ON public.food_logs FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own food logs" ON public.food_logs;
CREATE POLICY "Users can delete their own food logs"
  ON public.food_logs FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON public.food_logs(user_id, logged_at);


-- 3. WEIGHT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Ensure all columns exist on weight_logs
ALTER TABLE public.weight_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.weight_logs ADD COLUMN IF NOT EXISTS weight_kg NUMERIC;
ALTER TABLE public.weight_logs ADD COLUMN IF NOT EXISTS body_fat_percentage NUMERIC;
ALTER TABLE public.weight_logs ADD COLUMN IF NOT EXISTS logged_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.weight_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own weight logs" ON public.weight_logs;
CREATE POLICY "Users can view their own weight logs"
  ON public.weight_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own weight logs" ON public.weight_logs;
CREATE POLICY "Users can insert their own weight logs"
  ON public.weight_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own weight logs" ON public.weight_logs;
CREATE POLICY "Users can update their own weight logs"
  ON public.weight_logs FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own weight logs" ON public.weight_logs;
CREATE POLICY "Users can delete their own weight logs"
  ON public.weight_logs FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON public.weight_logs(user_id, logged_at);


-- 4. FOOD DATABASE / CUSTOM FOODS TABLE
CREATE TABLE IF NOT EXISTS public.food_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Ensure all columns exist on food_database
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS calories_per_100g NUMERIC;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS protein_per_100g NUMERIC;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS carbs_per_100g NUMERIC;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS fat_per_100g NUMERIC;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS fiber_per_100g NUMERIC DEFAULT 0;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN DEFAULT true;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS is_dairy_free BOOLEAN DEFAULT true;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS serving_size_g NUMERIC DEFAULT 100;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS default_unit TEXT DEFAULT 'g';
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS storage_type TEXT DEFAULT 'fresh_weekly';
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS swap_group TEXT;
ALTER TABLE public.food_database ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.food_database ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view public and their own foods" ON public.food_database;
CREATE POLICY "Users can view public and their own foods"
  ON public.food_database FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own foods" ON public.food_database;
CREATE POLICY "Users can insert their own foods"
  ON public.food_database FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own foods" ON public.food_database;
CREATE POLICY "Users can update their own foods"
  ON public.food_database FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own foods" ON public.food_database;
CREATE POLICY "Users can delete their own foods"
  ON public.food_database FOR DELETE
  USING (auth.uid() = user_id);


-- 5. WORKOUT PLANS TABLE
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Ensure all columns exist on workout_plans
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS week_number INTEGER DEFAULT 1;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS day_number INTEGER DEFAULT 1;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS day_title TEXT;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS exercise_id TEXT;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS exercise_name TEXT;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS target_sets INTEGER DEFAULT 3;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS target_reps TEXT DEFAULT '8-12';
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS rest_seconds INTEGER DEFAULT 90;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 1;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS logged_weight_kg NUMERIC;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS logged_reps INTEGER;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS logged_at TIMESTAMPTZ;
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own workout plans" ON public.workout_plans;
CREATE POLICY "Users can view their own workout plans"
  ON public.workout_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own workout plans" ON public.workout_plans;
CREATE POLICY "Users can insert their own workout plans"
  ON public.workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own workout plans" ON public.workout_plans;
CREATE POLICY "Users can update their own workout plans"
  ON public.workout_plans FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own workout plans" ON public.workout_plans;
CREATE POLICY "Users can delete their own workout plans"
  ON public.workout_plans FOR DELETE
  USING (auth.uid() = user_id);


-- 6. GROCERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.grocery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Ensure all columns exist on grocery_items
ALTER TABLE public.grocery_items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.grocery_items ADD COLUMN IF NOT EXISTS item_name TEXT;
ALTER TABLE public.grocery_items ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'fresh_weekly';
ALTER TABLE public.grocery_items ADD COLUMN IF NOT EXISTS quantity NUMERIC DEFAULT 1;
ALTER TABLE public.grocery_items ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'item';
ALTER TABLE public.grocery_items ADD COLUMN IF NOT EXISTS is_checked BOOLEAN DEFAULT false;
ALTER TABLE public.grocery_items ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.grocery_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.grocery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own grocery items" ON public.grocery_items;
CREATE POLICY "Users can view their own grocery items"
  ON public.grocery_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own grocery items" ON public.grocery_items;
CREATE POLICY "Users can insert their own grocery items"
  ON public.grocery_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own grocery items" ON public.grocery_items;
CREATE POLICY "Users can update their own grocery items"
  ON public.grocery_items FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own grocery items" ON public.grocery_items;
CREATE POLICY "Users can delete their own grocery items"
  ON public.grocery_items FOR DELETE
  USING (auth.uid() = user_id);


-- 7. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Athlete')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;
