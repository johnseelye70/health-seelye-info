# Seelye Family Health — Precision Fitness & Nutrition Application
**Version: Beta 2.16.0** | **Production Domain: https://health.seelye.info**

High-performance, dark-mode first athletic health and nutrition platform engineered with Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL), and integrated Wholesome Recipe & Meal Prep Engine.

---

## ⚡ Key Architectural Modules

### 1. Dynamic Macro Calculator & Metabolic Engine
- **Mifflin-St Jeor BMR & TDEE Calculations:** Computes baseline energy expenditure dynamically configured for biological sex, age, height, current weight, and activity level multipliers (1.2x - 1.9x).
- **Target Deficit Calibration:** Standard 500 kcal deficit targeting ~1 lb/week of fat oxidation with lean mass preservation formulas (1.0g protein/lb, 25% fats, remainder clean complex carbs).
- **Dynamic Meal Splitter:** Recalculates and divides daily macro targets across 2 meals, 3 meals, or 4 meals per day in real-time.

### 2. Fasting & Feeding Window Manager
- **Protocols Supported:** 16:8 LeanGains, 18:6 Deep Fast, 20:4 Warrior Diet, 14:10 Gentle, 23:1 OMAD, and Standard 12:12 Circadian.
- **Active Circular Countdown Timer:** Live second-by-second countdown clock tracking hours elapsed vs remaining.
- **Biological Milestones:** Real-time state tracker for Digestion, Blood Sugar Stabilization, Lipolysis / Fat Burning, Ketosis Activation, and Autophagy Induction.
- **Push Notification Mockups:** Local browser alerts and simulated toasts for fasting and feeding window transitions.

### 3. Food Database & Real-Time Macro Swap Engine
- **Curated Staples Catalog:** Chicken breast, lean ground turkey, wild Atlantic salmon, whole eggs, egg whites, Greek yogurt, gluten-free rolled oats, sweet potatoes, jasmine rice, quinoa, blueberries, avocados, almonds, broccoli, asparagus, etc.
- **Instant Macro Swap Matrix:** Computes exact equivalent grams needed when swapping a source food for another alternative to match target protein or carbohydrates with zero math required.
- **Custom Food Creator:** Add custom foods with macronutrient profiles per 100g.

### 4. Automated Weekly Grocery Manager
- **Dynamic Ingredient Aggregation:** Auto-compiles ingredients from the athlete's nutrition plan.
- **Categorized Presentation:** "Pantry & Freezer Staples (Buy Once Monthly)" vs "Fresh Pickups (Buy Weekly)".
- **Serving Scaler:** 1x Solo, 2x Couple, 4x Bulk Prep.
- **Print Optimization:** Dedicated `@media print` layout stripping UI chrome to produce a physical checklist or monochrome PDF.

### 5. Equipment-Based Workout Generator & Player
- **Equipment Inventory Matrix:** Check off available gear (Bodyweight only, Dumbbells, Barbells, Resistance Bands, Kettlebells, Cable Machine, Full Gym).
- **Adaptive 4-Week Periodized Split:** Generates Push, Pull, Legs, Upper, and HIIT Conditioning splits dynamically filtered to only include exercises possible with your selected gear.
- **Interactive Workout Player:** Set-by-set weight and rep logger with progressive overload tracking.
- **HIIT Interval Engine:** Web Audio synthesizer with sound beeps, color-shifting interval states, and work/rest timers.

### 6. Supabase Relational Database Architecture
- 7 Relational Tables: `profiles`, `food_database`, `food_logs`, `exercises`, `workout_plans`, `grocery_items`, `weight_logs`.
- Row Level Security (RLS) policies for complete multi-tenant security.
- Auto-sync triggers for new user registration and profile initialization.

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm / yarn

### Installation
```bash
# Clone or navigate to the repository
cd health-seelye-info

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

## 🗄️ Supabase Database Migration

1. Create a new project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the contents of `supabase/migrations/20260823000000_health_schema.sql` (or copy directly from the in-app **Database Blueprint** tab).
4. Run the script. This creates all tables, RLS policies, triggers, and populates seed data for foods and exercises.
5. In your project settings, copy `Project URL` and `anon key` into `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://health.seelye.info
```

---

## 🚀 Deployment to Vercel

```bash
vercel --prod
```
Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your Vercel Project Environment Variables.

---

## 📜 Version History
- **Beta 0.1.0 (2026-08-23)**: Complete interactive Next.js application, dynamic macro calculator, fasting tracker, real-time food swap tool, equipment-filtered 4-week workout periodization, monochrome printable grocery manager, and Supabase PostgreSQL schema blueprints.
