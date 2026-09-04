# Seelye Family Health — Precision Fitness & Nutrition Application
**Version: Beta v4.10.0 (b4.10.0)** | **Production Domain: https://health.seelye.info**

High-performance, dark-mode first athletic health and nutrition platform engineered with Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL), and integrated Wholesome Recipe & Meal Prep Engine.

---

## ⚡ Key Architectural Modules

### 1. Name Brand Protein Bars, RTD Drinks, Atkins Suite & Nut Varieties (Beta v4.10.0)
- **Chef Robert Irvine FitCrunch Bars:** Full roster of authentic FitCrunch products including full-size 88g bars, 46g snack-size bars, and protein wafers in all top flavors: Chocolate Peanut Butter, Peanut Butter & Jelly, Chocolate Chip Cookie Dough, Milk & Cookies, Mint Chocolate Chip, Caramel Peanut, Strawberry Strudel, Apple Pie, and Lemon Cake.
- **Complete Atkins Products Suite:** Full suite of Atkins low-carb meal bars (Chocolate Peanut Butter, Chocolate Chip Granola, Blueberry Greek Yogurt, Cookie Dough), snack bars (Caramel Chocolate Nut Roll, Lemon, White Chocolate Macadamia, Cranberry Almond), Endulge treats (Caramel Nut Chew, Peanut Butter Cups, Pecan Caramel Mousse, Chocolate Coconut), and ready-to-drink shakes (Atkins Plus 30g, Atkins Meal 15g, Iced Coffee shakes).
- **Major Name Brand Protein Bars (86 Items):** Top-rated protein bars across Quest Nutrition, Barebells, ONE Brands, Pure Protein, Built Bar & Built Puffs, Gatorade Whey, CLIF Builder's, Met-Rx Big 100 Colossal, RXBAR whole food bars, Think!, Kirkland Signature, No Cow vegan, Aloha, Lenny & Larry's Complete Cookies, and Grenade Carb Killa.
- **Ready-to-Drink (RTD) Protein Shakes (51 Items):** Ready-to-drink protein drinks across Fairlife Core Power Elite (42g), Core Power (26g), Fairlife Nutrition Plan (30g), Premier Protein (30g), Muscle Milk (25g, 40g Pro, Zero), Quest RTD, Ensure Max Protein, Boost Max, Orgain Organic & Clean Protein, OWYN 100% Plant-Based (32g Pro Elite), Slate Milk, Ghost RTD, and Shamrock Farms Rockin' Protein.
- **Comprehensive Nut Varieties (43 Items):** Complete representation across Peanuts (Planters salted, honey roasted, dry roasted, Spanish red-skin, southern boiled, Virginia jumbo), Pistachios (Wonderful shelled, lightly salted, sweet chili, salt & pepper), Almonds (Blue Diamond smokehouse, wasabi & soy, habanero BBQ, raw, slivered), Walnuts (English, Emerald glazed, chopped), Pecans (Georgia roasted, praline glazed), Cashews (Planters, Kirkland fancy, rosemary olive oil), Pine Nuts (Italian toasted, Siberian wild), Hazelnuts, Macadamias (Mauna Loa), Chestnuts, Deluxe Mixed Nuts, Pili Nuts, and Tiger Nuts.
- **Dedicated Sub-Categories & Smart Search:** Introduced "Protein Bars & Snacks" (`protein_bars`) and "Ready-to-Drink Protein Shakes" (`protein_drinks`) sub-categories in the browser, with intelligent multi-term and singular/plural search matching across the Food Database Browser, Custom Meal Builder, and offline/online search APIs.

### 2. Pre-Made Programs, Standard Movement & Clean Reset (Beta v4.9.1)
- **Standard Mode Pre-Made Workouts Discovery:** Full search across all 42 master training programs and 180+ daily workout sessions (P90X, StrongLifts 5x5, CrossFit The Girls & Hero WODs, Arnold Golden Six, Insanity, Tai Chi, Concept2 Rowing) directly from the simplified Standard Feel-Good Movement mode.
- **Clean Sub-Navigation Switcher:** 2-pill toggle ("Daily Movement Choices" & "Pre-Made Programs (42)") allows users in Standard mode to seamlessly enter the rich program browser and interactive worksheets without cluttering their daily tracker.
- **Inline Quick-Add & Instant Search Card:** Real-time search with matching program previews, key exercise breakdowns, calorie burns, and 1-click popular program chips (P90X, 5x5, Cindy, Arnold, Insanity, Tai Chi, Row 5K) to add structured routines directly to daily movement goals.
- **Simple Movement Picker Modal Integration:** Merged all 42 pre-made programs and 180+ workout days into the activity picker modal with a dedicated "🏆 Pre-Made Workouts (42+)" filter pill and distinct visual badges.
- **Interactive Routine Sheet Access:** Logged pre-made workouts display a direct "View Interactive Workout Sheet & Exercises" button in Standard mode, launching full exercise rosters, sets, reps, and printable sheets.
- **One-Click Library Add:** Added "+ Add to Today" action buttons directly on every program card and day item in the Pre-Made Programs Browser with instant green feedback toast banners.
- **Clean Reset & Empty Slate UI:** The Standard movement Reset button completely clears all chosen activities from today's plan, removing selected states across the picker and chips, and provides an encouraging empty state with options to pick new activities, browse programs, or load default baselines. Individual items can be removed freely down to an empty list.

### 2. Custom Meal Builder, In-Place Diary Editing & Food Database (Beta v4.8.0)
- **Interactive Custom Meal Builder:** Assemble custom meals and recipes by adding ingredients with customized quantities and units (`g`, `oz`, `cups`, `tbsp`, `tsp`, `servings`).
- **In-Place Logged Meal Editing:** Full round-trip editing for logged diary entries in both Standard mode ("Today's Meals Eaten") and Athlete mode. Edit portions, swap or adjust ingredients, and update the entry in place with recalculated nutrition.
- **Comprehensive Food Database (Local + Global):** Access 1,300+ curated whole foods, fitness supplements, and brand-name staples across major household brands and top store brands: Meijer, Walmart (Great Value, Equate), Costco (Kirkland Signature), Sam's Club (Member's Mark), and Aldi (Elevation, liveGfree, Millville, Countryside Creamery, L'oven Fresh, Peanut Delight, Specially Selected, Aunt Maple's), with live integration to 3,500,000+ commercial products via Open Food Facts v2 API.
- **Popular Name-Brand Whey Powders:** Complete lineup of top-selling athletic whey powders including Optimum Nutrition Gold Standard 100% Whey (Extreme Milk Chocolate, Double Rich Chocolate, Vanilla Ice Cream, Delicious Strawberry, Cookies & Cream, Mocha Cappuccino, Banana Cream, French Vanilla, 100% Isolate), Dymatize ISO100 Hydrolyzed Whey Isolate (Gourmet Chocolate, Gourmet Vanilla, Fruity Pebbles, Cocoa Pebbles, Peanut Butter, Fudge Brownie, Glazed Donut) & Elite Whey, Ghost 100% Whey (Cereal Milk, Chips Ahoy!, Oreo, Milk Chocolate, Peanut Butter Cereal Milk, Nutter Butter), MuscleTech Nitro-Tech & 100% Grass-Fed, BSN Syntha-6 & Syntha-6 Edge, Isopure Zero Carb & Low Carb WPI, PEScience Select Protein, Rule 1 R1 Protein, Transparent Labs 100% Grass-Fed Isolate, Ryse Loaded, Ascent Native Fuel, Premier Protein, Nutricost, and NOW Sports, plus wholesale store-brand whey powders for Costco, Sam's Club, Walmart (Equate), Meijer, and Aldi (Elevation).
- **Store-Brand & Name-Brand Gluten-Free Parity:** Comprehensive gluten-free coverage across Meijer, Walmart, Costco, Sam's Club, and Aldi for gluten-free breads, crackers, pretzels, cookies, desserts, and baking mixes.
- **Store-Brand Parity:** Full store-brand coverage for instant oatmeals (including Meijer Sugar-Free Maple & Brown Sugar), peanut butters, jellies & jams, breads, butters in sticks and tubs for all stores, and sugar-free pancake syrups.
- **Detailed Nutrition Breakdown:** Complete nutritional breakdown including Calories, Protein, Carbohydrates, Fats, Net Impact Carbs, Saturated Fat, Monounsaturated Fat, Polyunsaturated Fat, Trans Fat, Cholesterol, Dietary Fiber, Sugars, Added Sugars, Sodium, Potassium, Calcium, Iron, Magnesium, Zinc, and Vitamins A, C, and D.
- **Serving Scaler & Yield Switcher:** Toggle between "Per 1 Serving" and "Full Batch" with dynamic yield scaling (1x to 12x).
- **Direct 1-Click Daily Plan Integration:** Log custom meals directly to Breakfast, Lunch, Dinner, or Snacks on Today or any historical date, as a single consolidated item or individual ingredients.
- **Saved Meals Library:** Save favorite meals to your private collection for instant re-logging anytime.

### 2. Dynamic Macro Calculator & Metabolic Engine
- **Mifflin-St Jeor BMR & TDEE Calculations:** Computes baseline energy expenditure dynamically configured for biological sex, age, height, current weight, and activity level multipliers (1.2x - 1.9x).
- **Target Deficit Calibration:** Standard 500 kcal deficit targeting ~1 lb/week of fat oxidation with lean mass preservation formulas (1.0g protein/lb, 25% fats, remainder clean complex carbs).
- **Dynamic Meal Splitter:** Recalculates and divides daily macro targets across 2 meals, 3 meals, or 4 meals per day in real-time.

### 3. Fasting & Feeding Window Manager
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
