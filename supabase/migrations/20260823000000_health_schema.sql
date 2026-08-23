-- ==============================================================================
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

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

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
    swap_group TEXT, -- e.g., 'lean_protein_source', 'complex_carb_source'
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Row Level Security for Food Database (Public read, Admin manage)
ALTER TABLE public.food_database ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public food database is viewable by all authenticated users"
    ON public.food_database FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow anonymous read for demo and static exploration"
    ON public.food_database FOR SELECT
    TO anon
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
    meal_index INTEGER NOT NULL CHECK (meal_index BETWEEN 1 AND 6), -- Meal 1, Meal 2, Meal 3, etc.
    logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    
    -- Cached snapshot of calculated macros at time of consumption
    calories NUMERIC(6, 2) NOT NULL,
    protein_g NUMERIC(5, 2) NOT NULL,
    carbs_g NUMERIC(5, 2) NOT NULL,
    fat_g NUMERIC(5, 2) NOT NULL
);

-- RLS for Food Logs
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own food logs"
    ON public.food_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food logs"
    ON public.food_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs"
    ON public.food_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs"
    ON public.food_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Index for speedy daily queries
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON public.food_logs (user_id, logged_at);

-- ==============================================================================
-- 4. EXERCISES DATABASE (Matrix of Exercises & Equipment Constraints)
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
-- 5. WORKOUT PLANS & LOGS (User 4-Week Progressive Split)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 4) DEFAULT 1,
    day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7), -- 1: Mon, 2: Tue, etc.
    day_title TEXT NOT NULL, -- e.g., 'Push & Core Power', 'HIIT Conditioning Blitz'
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    target_sets INTEGER NOT NULL DEFAULT 3,
    target_reps TEXT NOT NULL DEFAULT '8-12',
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    order_index INTEGER NOT NULL DEFAULT 1,
    
    -- Completion & Tracking
    completed BOOLEAN NOT NULL DEFAULT false,
    logged_weight_kg NUMERIC(5, 2),
    logged_reps INTEGER,
    logged_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout plans"
    ON public.workout_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plans"
    ON public.workout_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans"
    ON public.workout_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans"
    ON public.workout_plans FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_workout_plans_user_week_day ON public.workout_plans (user_id, week_number, day_number);

-- ==============================================================================
-- 6. GROCERY LISTS (Auto-compiled from meal plans)
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

CREATE POLICY "Users can manage their own grocery list"
    ON public.grocery_items FOR ALL
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 7. WEIGHT & BIOMETRIC LOGS
-- ==============================================================================
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

CREATE POLICY "Users can manage their weight logs"
    ON public.weight_logs FOR ALL
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON public.weight_logs (user_id, logged_at DESC);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        age, 
        height_cm, 
        current_weight_kg, 
        sex, 
        activity_level, 
        daily_calorie_target, 
        protein_target_g, 
        carb_target_g, 
        fat_target_g
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Athlete'),
        30,
        175.0,
        78.0,
        'male',
        'moderate',
        2150,
        170,
        210,
        65
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SEED DATA: FOOD DATABASE STAPLES
-- ==============================================================================
INSERT INTO public.food_database (name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, is_gluten_free, is_dairy_free, serving_size_g, default_unit, storage_type, swap_group)
VALUES
    ('Boneless Skinless Chicken Breast', 'protein', 165, 31.0, 0.0, 3.6, 0.0, true, true, 150, 'g', 'fresh_weekly', 'lean_protein'),
    ('93/7 Lean Ground Turkey', 'protein', 152, 22.0, 0.0, 7.0, 0.0, true, true, 150, 'g', 'fresh_weekly', 'lean_protein'),
    ('Wild Atlantic Salmon Fillet', 'protein', 208, 20.0, 0.0, 13.0, 0.0, true, true, 160, 'g', 'fresh_weekly', 'fatty_protein'),
    ('Grass-Fed Beef Sirloin Steak', 'protein', 183, 27.0, 0.0, 8.0, 0.0, true, true, 170, 'g', 'fresh_weekly', 'lean_protein'),
    ('Organic Pasture-Raised Whole Eggs', 'protein', 143, 12.6, 0.7, 9.5, 0.0, true, true, 100, 'g', 'fresh_weekly', 'egg_source'),
    ('Liquid Egg Whites', 'protein', 52, 11.0, 0.7, 0.2, 0.0, true, true, 150, 'g', 'fresh_weekly', 'lean_protein'),
    ('Non-Fat Plain Greek Yogurt (0%)', 'protein', 59, 10.3, 3.6, 0.4, 0.0, true, false, 200, 'g', 'fresh_weekly', 'dairy_protein'),
    ('Whey Protein Isolate (Vanilla/Choc)', 'protein', 370, 85.0, 3.0, 1.5, 0.5, true, false, 30, 'g', 'pantry_monthly', 'powder_protein'),
    ('Plant-Based Pea/Rice Protein Powder', 'protein', 380, 78.0, 6.0, 4.0, 3.0, true, true, 35, 'g', 'pantry_monthly', 'powder_protein'),
    
    ('Certified Gluten-Free Rolled Oats', 'carbohydrate', 379, 13.2, 67.7, 6.5, 10.1, true, true, 60, 'g', 'pantry_monthly', 'complex_carb'),
    ('Baked Sweet Potato (Flesh only)', 'carbohydrate', 90, 2.0, 20.7, 0.2, 3.3, true, true, 200, 'g', 'fresh_weekly', 'complex_carb'),
    ('Steamed Jasmine White Rice', 'carbohydrate', 130, 2.7, 28.2, 0.3, 0.4, true, true, 180, 'g', 'pantry_monthly', 'complex_carb'),
    ('Organic Tri-Color Quinoa', 'carbohydrate', 120, 4.4, 21.3, 1.9, 2.8, true, true, 160, 'g', 'pantry_monthly', 'complex_carb'),
    ('Organic Blueberries', 'fruit', 57, 0.7, 14.5, 0.3, 2.4, true, true, 125, 'g', 'fresh_weekly', 'fruit_carb'),
    ('Honeycrisp Apple', 'fruit', 52, 0.3, 13.8, 0.2, 2.4, true, true, 180, 'g', 'fresh_weekly', 'fruit_carb'),
    
    ('Hass Avocado', 'healthy_fat', 160, 2.0, 8.5, 14.7, 6.7, true, true, 75, 'g', 'fresh_weekly', 'healthy_fat'),
    ('Extra Virgin Olive Oil', 'healthy_fat', 884, 0.0, 0.0, 100.0, 0.0, true, true, 15, 'ml', 'pantry_monthly', 'cooking_fat'),
    ('Raw Organic Almonds', 'healthy_fat', 579, 21.2, 21.6, 49.9, 12.5, true, true, 30, 'g', 'pantry_monthly', 'nut_fat'),
    ('Natural Creamy Peanut Butter', 'healthy_fat', 588, 25.0, 20.0, 50.0, 8.0, true, true, 32, 'g', 'pantry_monthly', 'nut_fat'),
    
    ('Fresh Steamed Broccoli Florets', 'vegetable', 35, 2.4, 7.2, 0.4, 2.6, true, true, 150, 'g', 'fresh_weekly', 'cruciferous_veg'),
    ('Organic Baby Spinach', 'vegetable', 23, 2.9, 3.6, 0.4, 2.2, true, true, 100, 'g', 'fresh_weekly', 'leafy_veg'),
    ('Fresh Green Asparagus Spears', 'vegetable', 20, 2.2, 3.9, 0.1, 2.1, true, true, 150, 'g', 'fresh_weekly', 'fiber_veg'),
    ('Unsweetened Almond Milk', 'beverage', 15, 0.6, 0.3, 1.2, 0.2, true, true, 240, 'ml', 'pantry_monthly', 'beverage')
ON CONFLICT (name) DO NOTHING;

-- ==============================================================================
-- SEED DATA: EXERCISES DATABASE MATRIX
-- ==============================================================================
INSERT INTO public.exercises (name, target_muscle, equipment_required, difficulty, category, instructions, video_url_mock)
VALUES
    ('Push-Ups (Strict Form)', 'chest', 'bodyweight', 'beginner', 'hypertrophy', 'Maintain tight plank, lower chest to 1 inch above floor, press up explosively.', 'https://mock.stream/pushup'),
    ('Dumbbell Flat Bench Press', 'chest', 'dumbbells', 'intermediate', 'strength', 'Retract scapulae, lower dumbbells with controlled tempo to chest level, press up.', 'https://mock.stream/db-bench'),
    ('Barbell Incline Bench Press', 'chest', 'barbells', 'advanced', 'strength', 'Set bench to 30 degrees. Touch upper chest and press vertically in smooth arc.', 'https://mock.stream/bb-incline'),
    ('Bodyweight Pull-Ups (Overhand)', 'back', 'bodyweight', 'intermediate', 'strength', 'Full deadhang at bottom, engage lats to drive chin clearly over bar.', 'https://mock.stream/pullups'),
    ('Dumbbell Single-Arm Row', 'back', 'dumbbells', 'beginner', 'hypertrophy', 'Hinge torso 45 deg, pull dumbbell towards hip pocket while squeezing lats.', 'https://mock.stream/db-row'),
    ('Barbell Deadlift (Conventional)', 'hamstrings', 'barbells', 'advanced', 'strength', 'Brace core, push the floor away, maintain neutral spine and lockout hips.', 'https://mock.stream/deadlift'),
    ('Bodyweight Air Squats', 'quads', 'bodyweight', 'beginner', 'hypertrophy', 'Hips back and down, break parallel with thighs, drive through whole foot.', 'https://mock.stream/air-squats'),
    ('Goblet Squat (Dumbbell/KB)', 'quads', 'dumbbells', 'beginner', 'strength', 'Hold weight against chest, squat deep between hips, keep torso upright.', 'https://mock.stream/goblet-squat'),
    ('Barbell Back Squat', 'quads', 'barbells', 'advanced', 'strength', 'Bar tight on upper traps, sit back and down to 90 degrees, explode upwards.', 'https://mock.stream/bb-squat'),
    ('Dumbbell Romanian Deadlift (RDL)', 'hamstrings', 'dumbbells', 'intermediate', 'hypertrophy', 'Soft knee bend, push hips back until deep hamstring stretch, squeeze glutes to return.', 'https://mock.stream/db-rdl'),
    ('Resistance Band Bicep Curls', 'biceps', 'resistance_bands', 'beginner', 'hypertrophy', 'Step on band middle, curl handles up keeping elbows pinned to ribs.', 'https://mock.stream/band-curls'),
    ('Dumbbell Overhead Shoulder Press', 'shoulders', 'dumbbells', 'intermediate', 'strength', 'Press dumbbells overhead without arching lower back, full lockout at top.', 'https://mock.stream/db-ohp'),
    ('Dumbbell Lateral Raises', 'shoulders', 'dumbbells', 'beginner', 'hypertrophy', 'Lead with elbows, raise dumbbells to shoulder height with 2-second eccentric.', 'https://mock.stream/lat-raises'),
    ('Bench Dips / Parallel Bar Dips', 'triceps', 'bodyweight', 'intermediate', 'hypertrophy', 'Lower until arms reach 90 degrees, press through palms to lock out triceps.', 'https://mock.stream/dips'),
    ('High-Intensity Burpee Blitz', 'full_body_cardio', 'bodyweight', 'intermediate', 'hiit_interval', 'Drop chest to floor, jump feet in, jump vertical with hands overhead.', 'https://mock.stream/burpees'),
    ('Kettlebell Russian Swings', 'glutes', 'kettlebells', 'intermediate', 'hiit_interval', 'Explosive hip hinge driving kettlebell to eye level with glute snap.', 'https://mock.stream/kb-swings'),
    ('Dumbbell Renegade Rows', 'core', 'dumbbells', 'advanced', 'hiit_interval', 'Push-up plank position on dumbbells, alternate rowing each side with zero hip rotation.', 'https://mock.stream/renegade-rows'),
    ('Hanging Leg Raises', 'core', 'bodyweight', 'advanced', 'strength', 'Hang from bar, contract abs to curl knees/toes up to chest level without swinging.', 'https://mock.stream/leg-raises'),
    ('Cable Lat Pulldowns', 'back', 'cable_machine', 'intermediate', 'hypertrophy', 'Wide grip, lean slightly back, pull bar to upper chest squeezing shoulder blades.', 'https://mock.stream/lat-pulldown'),
    ('Cable Tricep Rope Pushdown', 'triceps', 'cable_machine', 'beginner', 'hypertrophy', 'Elbows tight against torso, flare rope outward at bottom contraction.', 'https://mock.stream/rope-pushdown')
ON CONFLICT (name) DO NOTHING;
