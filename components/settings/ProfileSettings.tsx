'use client';

import React, { useState, useEffect } from 'react';
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
  X,
  ChevronRight,
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '@/lib/supabase/schema-sql';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { FastingTimePicker } from '@/components/ui/FastingTimePicker';

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
  const initialFtIn = profile.height_cm > 0 ? cmToFtIn(profile.height_cm) : { feet: 0, inches: 0 };

  const [showChangelog, setShowChangelog] = useState<boolean>(false);
  const [form, setForm] = useState({
    full_name: profile.full_name,
    email: profile.email,
    age: profile.age,
    sex: profile.sex,
    unit_preference: profile.unit_preference,
    experience_mode: profile.experience_mode || 'simple',
    height_cm: profile.height_cm || 0,
    height_ft: initialFtIn.feet,
    height_in: initialFtIn.inches,
    current_weight_input: profile.current_weight_kg > 0 ? (isImperial ? kgToLbs(profile.current_weight_kg) : profile.current_weight_kg) : 0,
    target_weight_input: profile.target_weight_kg > 0 ? (isImperial ? kgToLbs(profile.target_weight_kg) : profile.target_weight_kg) : 0,
    activity_level: profile.activity_level,
    goal: profile.goal,
    meal_count: profile.meal_count,
    fasting_protocol: profile.fasting_protocol,
    fasting_start_time: profile.fasting_start_time,
  });

  // Keep form in sync when profile updates (e.g. on account login/sync)
  useEffect(() => {
    const ftIn = profile.height_cm > 0 ? cmToFtIn(profile.height_cm) : { feet: 0, inches: 0 };
    setForm({
      full_name: profile.full_name || '',
      email: profile.email || '',
      age: profile.age,
      sex: profile.sex,
      unit_preference: profile.unit_preference,
      experience_mode: profile.experience_mode || 'simple',
      height_cm: profile.height_cm || 0,
      height_ft: ftIn.feet,
      height_in: ftIn.inches,
      current_weight_input: profile.current_weight_kg > 0 ? (profile.unit_preference === 'imperial' ? kgToLbs(profile.current_weight_kg) : profile.current_weight_kg) : 0,
      target_weight_input: profile.target_weight_kg > 0 ? (profile.unit_preference === 'imperial' ? kgToLbs(profile.target_weight_kg) : profile.target_weight_kg) : 0,
      activity_level: profile.activity_level,
      goal: profile.goal,
      meal_count: profile.meal_count,
      fasting_protocol: profile.fasting_protocol,
      fasting_start_time: profile.fasting_start_time,
    });
  }, [profile]);

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
      has_configured_biometrics: finalHeightCm > 0 || finalWeightKg > 0,
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
      full_name: 'Logged-on User',
      email: '',
      age: 35,
      sex: 'male',
      unit_preference: 'imperial',
      experience_mode: 'simple',
      height_cm: 0,
      height_ft: 0,
      height_in: 0,
      current_weight_input: 0,
      target_weight_input: 0,
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
      version: 'Beta 2.8.0',
      date: '2026-08-25',
      title: 'Dynamic Ingredient Swapping Engine & Live Macro Recalculation',
      changes: [
        'Dynamic Ingredient Swapping: For any ingredient in any recipe, instantly swap out items with 1-tap recommended alternatives (e.g. 2% Milk ↔ Whole Milk ↔ Almond Milk ↔ Fairlife, Chicken Breast ↔ Flank Steak ↔ Salmon ↔ Tofu) or browse whole foods across any category (e.g. Green Beans ↔ Asparagus ↔ Broccoli).',
        'Live Automatic Macro & Stats Recalculation: Swapping any ingredient automatically recalculates Calories, Protein (g), Carbs (g), and Fat (g) in real-time with visual delta badges.',
        'Seamless Platform Integration: 1-Tap Meal Logging, 1-Tap Grocery List Sync, and 4" x 6" Card / 8.5" x 11" Letter Print Previews all dynamically consume the exact customized ingredients and updated macros.',
      ],
    },
    {
      version: 'Beta 2.7.0',
      date: '2026-08-25',
      title: '290+ Healthy Recipe Mega Library & High-Performance Catalog Browser',
      changes: [
        'Massive 290+ Healthy Recipe Library: Scaled the platform recipe collection to 290 complete healthy meals, snacks, and batch prep staples spanning all culinary cuisines and dietary profiles.',
        'High-Performance Smooth Pagination: Implemented seamless 36-item incremental pagination with "Load More" and "Show All" controls for instant loading and zero lag across mobile and desktop.',
        'Universal Kitchen Studio Compatibility: Every single one of the 290 recipes features precision US & Metric measurements, 1-tap grocery list sync, 1-tap meal logging, multi-batch yield scaling (1x-6x), and instant 4" x 6" index card / 8.5" x 11" letter print studio support.',
      ],
    },
    {
      version: 'Beta 2.6.0',
      date: '2026-08-25',
      title: 'Massive Recipe Expansion & Sub-Category Architecture',
      changes: [
        'Comprehensive Recipe Library: Massively expanded the recipe database across all categories, adding dozens of chef-crafted, high-protein, whole food meals.',
        'Interactive Sub-Category Filtering: Introduced dynamic sub-categories (Eggs & Scrambles, Oats & Pancakes, Smoothies & Bowls, Power Bowls, Wraps & Pockets, Crisp Salads, Soups & Chilis, Poultry, Steaks & Sirloin, Seafood & Fish, Pastas, Sheet-Pan Preps, Slow Cooker, Casseroles, Protein Bars & Bites, Sweet Treats, and Savory Crunches) with dedicated badge counts.',
        'Full Ingredient Scaler & Print Integration: All new recipes seamlessly integrate with the batch scaler (1x-6x), 1-tap grocery list sync, 1-tap meal logging, and 4" x 6" card / 8.5" x 11" letter print studio.',
      ],
    },
    {
      version: 'Beta 2.5.4',
      date: '2026-08-25',
      title: 'Removed Duplicate Recipe View and Unified Print Preview Canvas',
      changes: [
        'Eliminated Duplicate Recipe View: Completely removed the broken, cut-off second recipe markup rendered below the visual preview, delivering a single, pristine on-screen preview card.',
        'Unified Screen & Paper Canvas: Merged the on-screen preview and physical print target into a single high-fidelity component with exact 4" x 6" and 8.5" x 11" paper boundaries.',
      ],
    },
    {
      version: 'Beta 2.5.3',
      date: '2026-08-25',
      title: 'Dedicated Recipe Print Preview Studio & Isolated Card Canvas',
      changes: [
        'Interactive Print Preview Studio: Added a dedicated, 100% inline print preview studio with format options for 4" x 6" Kitchen Index Cards and 8.5" x 11" Standard Letter binder sheets.',
        '100% Pure Recipe Print Isolation: Configured isolated print canvas rules so only the ink-friendly recipe card or sheet prints to your printer/PDF with zero screen chrome, sidebars, headers, or buttons.',
        'Live On-Screen Visual Simulation: Preview your exact physical kitchen card or letter sheet on screen with interactive unit toggles (US/Metric) and batch multipliers (1x-6x).',
      ],
    },
    {
      version: 'Beta 2.5.2',
      date: '2026-08-25',
      title: 'Fixed Recipe Print Preview Multi-Page Layout & Unbounded Pagination',
      changes: [
        'Unbounded Multi-Page Pagination: Removed rigid single-page constraints and fixed viewport overflow traps from print styles, allowing long recipes, directions, and ingredient lists to cleanly flow across as many printed pages as needed without being clipped.',
        'Spacious Clean Typography: Redesigned the printable card layout with crisp 2-column ingredients, full-width step-by-step directions, and chef notes with break-inside protection.',
        'Total Screen UI Stripping: Guaranteed that all modal backdrops, navigation bars, buttons, and screen chrome are stripped during printing for pure paper and PDF generation.',
      ],
    },
    {
      version: 'Beta 2.5.1',
      date: '2026-08-25',
      title: '100% Inline Recipe Detail View & Elimination of Nested Modals',
      changes: [
        '100% Inline Recipe Detail View: Clicking "View Recipe" or any recipe title now seamlessly transitions directly to the full recipe view in place, fixing the issue where clicking the button previously did nothing due to nested modal z-index conflicts.',
        'Zero Nested Modals: Eliminated RecipeDetailModal completely in favor of smooth, instantaneous inline transitions with explicit "← Back to All Recipes" navigation buttons.',
        'Interactive Checklist & Batch Scaler: Full support for interactive ingredient checks, batch scaling (1x, 2x, 4x, 6x), direct 1-click printing, and grocery list sync.',
      ],
    },
    {
      version: 'Beta 2.5.0',
      date: '2026-08-25',
      title: 'Fixed Wholesome Home Recipes Header Clipping & Top Margin Architecture',
      changes: [
        'Top Header Clipping Resolved: Fixed Wholesome Home Recipes view to use top-aligned document flow with generous safe margins (pt-8/pt-14) preventing the banner and title from clipping under the browser status bar or top viewport.',
        'Dedicated Sticky Header Bar: Added a clean, pinned header bar with title icon and high-contrast Close button that remains visible without overlapping recipe titles.',
        'Zero Scroll-Trap Viewport: Completely eliminated fixed 92vh height scroll-locks in favor of full-page fluid scrolling across mobile and desktop displays.',
      ],
    },
    {
      version: 'Beta 2.4.9',
      date: '2026-08-25',
      title: 'Eliminated Recipe Print Modal & Direct High-Contrast Print Pipeline',
      changes: [
        'Eliminated Recipe Print Modal: Completely removed the recipe print preview modal window that created screen clutter and trapped users without an obvious close button.',
        'Direct 1-Click Print Engine: Clicking "Print Recipe" now directly activates your browser/device native print pipeline with automatic clean black-and-white recipe formatting.',
        'Enhanced Recipe View Navigation: Added a prominent, dedicated "Close" button in both header and footer alongside backdrop dismiss controls for effortless navigation.',
      ],
    },
    {
      version: 'Beta 2.4.8',
      date: '2026-08-25',
      title: 'Cloud Database Biometric Default Purge & Blank-State Stepper Controls',
      changes: [
        'Cloud Database Default Purge: Fixed cloud synchronization to detect and purge stale 178cm / 80kg / 75kg default entries from Supabase user accounts, preventing them from being synced back to desktop and mobile browsers.',
        'Zero-Clamping Input Steppers: Updated all numeric height and weight steppers with allowEmptyZero support so inputs remain cleanly blank with helpful placeholder text until you input your personal metrics.',
        'Instant Clean-Slate Initialization: Guaranteed that any newly opened or existing desktop/mobile session boots with clean em-dashes and direct 1-click customization studios.',
      ],
    },
    {
      version: 'Beta 2.4.7',
      date: '2026-08-25',
      title: 'Zero Forced Biometrics & Legacy Default State Purge (v8 Local Storage)',
      changes: [
        'Zero Forced Biometrics: Eliminated all hardcoded weight (176 lbs), goal target (165 lbs), and height (5\'10") baseline defaults throughout the app and initialization templates.',
        'Legacy Default State Purge: Upgraded local storage engine to v8 and automated clean sanitization of stale cached profiles on all connected mobile and desktop devices.',
        'Intuitive Biometrics Inputs: Displays clean em-dashes ("—") and direct 1-tap setup buttons until the user inputs their real height, weight, and goals.',
      ],
    },
    {
      version: 'Beta 2.4.6',
      date: '2026-08-25',
      title: 'Zero Modal Popup & 100% Inline Plate Inventory Architecture',
      changes: [
        'Zero Modal Popups: Completely removed the 90vh popup modal window from Equipment Inventory that previously trapped the Plate Inventory in scrollbars inside scrollbars.',
        'Direct Sub-Tab Navigation: Clicking "Plate Inventory & Barbell Math" now immediately switches to the dedicated, full-screen Olympic Barbell Plate Math view.',
        'Crisp Solid Aesthetics: Eliminated all hazy backdrop filters and blur overlays across the plate inventory and visual loading simulator for ultra-clean rendering.',
      ],
    },
    {
      version: 'Beta 2.4.5',
      date: '2026-08-25',
      title: 'Weight Plate Inventory & Visual Barbell Loader Overhaul',
      changes: [
        'Zero Nested Scrollbars: Removed all nested scrollbars and inner overflow scroll-traps across the Plate Inventory and Barbell Calculator views.',
        'Eliminated Blur Haze & Screen Clutter: Replaced GPU-choking backdrop blur stacking with crisp, high-contrast, clean solid surfaces for ultra-sharp readability and smooth scrolling.',
        'Responsive 100% Width Barbell Graphic: Redesigned the visual barbell plate loader to dynamically scale and fit all mobile and desktop screens with zero horizontal overflow.',
      ],
    },
    {
      version: 'Beta 2.4.4',
      date: '2026-08-25',
      title: 'Authenticated Mobile Viewport & Background Blur Offset Fix for iOS',
      changes: [
        'Authenticated Header Fix: Locked action buttons (Cloud Sync & Theme Toggle) to fixed compact dimensions (w-8 h-8) on mobile screens, preventing the header from expanding horizontally upon cloud login.',
        'Eliminated Negative Blur Offsets: Removed all negative margins and coordinate offsets (-mr-20, -top-24, -right-24) on background ambient blur nodes across Dashboard and Fasting views, strictly adhering to iOS Safari layout boundaries.',
        'Zero Side-to-Side Elasticity: Guaranteed zero horizontal wiggle on iPhone viewports both before and after authenticating.',
      ],
    },
    {
      version: 'Beta 2.4.3',
      date: '2026-08-25',
      title: 'Zero Forced Biometrics & Inline Biometrics Studio in Progress Section',
      changes: [
        'Zero Forced Biometrics: Eliminated hardcoded and unselected defaults (e.g. 176 lbs / 165 lbs / 15.3% body fat) from the Progress & Analytics section, ensuring every metric reflects real user data.',
        'Inline Biometrics Studio: Added a dedicated, 1-click Biometrics Editor right inside the Progress section to customize Height (Feet & Inches or CM), Starting Weight, Target Goal Weight, Age, Biological Sex, and Activity Level.',
        'Instant Target Recalculation: Saving custom biometrics immediately updates your Mifflin-St Jeor TDEE, macro distribution, and hydration targets in real-time.',
        'Clean Empty State Trajectory: If no weigh-in entries have been recorded, displays an inviting check-in prompt instead of plotting arbitrary curves.',
      ],
    },
    {
      version: 'Beta 2.4.2',
      date: '2026-08-25',
      title: 'iPhone Header Viewport Fit & Horizontal Elasticity Fix',
      changes: [
        'iPhone Header Fit: Streamlined mobile header layout, element spacing, and button touch bounds to fit 100% within standard iPhone screen widths (320px–390px), completely eliminating side-to-side wiggling.',
        'Responsive Action Controls: Optimized theme toggle, cloud sync status, and quick log action buttons for compact mobile touch targets.',
        'Viewport Container Guards: Applied strict boundary width constraints (w-full max-w-full min-w-0) across page wrappers to prevent horizontal content overflow on iOS Safari.',
      ],
    },
    {
      version: 'Beta 2.4.1',
      date: '2026-08-25',
      title: 'Neutral Obsidian Charcoal & Crisp Porcelain Surfaces (Eliminated Blue-on-Blue)',
      changes: [
        'Neutral Obsidian Canvas: Replaced navy/blue-tinted background and cards with pure, deep obsidian charcoal (#090a0d) and graphite cards (#141417), completely eliminating the blue-on-blue aesthetic.',
        'High-Contrast Porcelain Light Mode: Clean warm porcelain canvas (#f4f4f6) with pure white elevated cards (#ffffff) and subtle silver borders (#e2e8f0).',
        'Vibrant Multi-Metric Contrast: Restored clean primary health emerald (#10b981) while letting Flame Coral, Warm Saffron, Bio-Cyan, and Royal Violet pop vibrantly on neutral surfaces.',
      ],
    },
    {
      version: 'Beta 2.4.0',
      date: '2026-08-25',
      title: 'Choice-Driven Feel-Good Movement Engine & Custom Activity Studio for Simple Mode',
      changes: [
        'Choice-Driven Movement Architecture: Eliminated forced gym routines and rigid split exercises in Simple Mode, empowering users to choose feel-good activities they genuinely enjoy.',
        '16+ Categorized Feel-Good Library: Built a comprehensive library spanning Walking & Steps (Brisk Walks, Nature Hikes, Post-Meal Strolls), Mobility & Yoga (Morning Stretches, Bedtime Wind-Down), Strength & Tone, and Active Fun (Cycling, Swimming, Dance, Gardening, Pickleball).',
        'Custom Activity Studio: Added a dedicated builder for creating personalized feel-good activities with custom duration, calorie burn estimates, and emoji icons.',
        'Interactive Movement Dashboard: Integrated 1-tap completion toggles, activity swapping, removal, and live "Log to Daily Burn & Step Tracker" integration across both the Movement Hub and Today Dashboard.',
      ],
    },
    {
      version: 'Beta 2.3.0',
      date: '2026-08-25',
      title: 'Apple Health Multi-Metric Color Overhaul & Dynamic Light/Dark Mode Switcher',
      changes: [
        'Multi-Metric Health Palette: Overhauled color system inspired by Apple Health and Fitness+, replacing monochrome green with vibrant semantic color coding for Movement (Flame Coral), Nutrition (Saffron & Sage), Hydration (Bio-Aqua Cyan), and Recovery/Fasting (Deep Lavender).',
        'Dynamic Light & Dark Mode Engine: Built instant "Light / Dark" theme switcher in top navigation header with full CSS-variable token integration across all pages and components.',
        'Fresh Morning Studio (Light Mode): Clean, airy slate-50 canvas (#f8fafc) with pure white frosted glass cards (#ffffff), crisp slate typography (#0f172a), and high-contrast accents.',
        'Single-Scroll Modal Architecture: Completely eliminated nested scrollbars across all modals with pinned headers, pinned footers, and unified single-stream body scrolling.',
      ],
    },
    {
      version: 'Beta 2.2.2',
      date: '2026-08-25',
      title: 'Complete Modal Popup Architecture for Recipes, Print Studio & Builders',
      changes: [
        'Popup Modal Architecture: Standardized all recipe detail inspections, custom recipe creations, and printing tools into dedicated high-performance modal windows with backdrop blur.',
        'Recipe Detail Modal (RecipeDetailModal): Clicking any recipe card launches a dedicated popup window featuring batch scaling, step-by-step directions, ingredient checklist, and direct logging.',
        'Recipe Print Modal (RecipePrintModal): Print trigger launches a dedicated popup window supporting 4x6 index card and 8.5x11 standard letter size with live print preview.',
        'Custom Recipe Builder Modal (CustomRecipeModal): Multi-ingredient custom recipe creator now pops up in a dedicated clean modal dialog with live macro calculation.',
        'Today Dashboard Direct Launcher: Added 1-click recipe studio modal launcher directly from the Today Overview screen.',
      ],
    },
    {
      version: 'Beta 2.2.1',
      date: '2026-08-25',
      title: 'Recipe Printing Suite (4x6 Index Card & 8.5x11 Standard Letter Formats)',
      changes: [
        '4" x 6" Kitchen Index Card Printing: Built dedicated 4x6 recipe card print layout with high-contrast borders, ingredient checkboxes, step-by-step instructions, and macro profile.',
        '8.5" x 11" Full Sheet Printing: Added full-page culinary sheet layout formatted for kitchen binders and clipboard meal planning.',
        'Live Print Preview & Scaler: Interactive print modal with real-time visual card preview, Imperial/Metric unit switching, and 1x/2x/4x/6x batch ingredient scaling before printing.',
        'Ink-Friendly Pure B&W Output: Dedicated @media print stylesheet stripping all UI chrome and dark backgrounds for clean, high-contrast monochrome printing.',
      ],
    },
    {
      version: 'Beta 2.2.0',
      date: '2026-08-25',
      title: 'Wholesome Kitchen Recipe Engine & Athlete Meal Prep Studio (Modal & Traditional Measures)',
      changes: [
        'Wholesome Kitchen Recipe Engine: Integrated curated database of wholesome, nutrient-dense recipes across breakfast, lunch, dinner, snacks, and meal prep.',
        'Traditional Culinary Measurements: Built recipe system using standard kitchen units (cups, tablespoons, teaspoons, ounces, grams) with dynamic Imperial/Metric unit adaptation.',
        'Recipe Studio Modal Window: Built accessible backdrop-blurred modal window with category filters, step-by-step cooking instructions, and chef notes.',
        '1-Tap Direct Logging & Grocery Sync: 1-click "Cooked This!" direct logging to daily energy balance and 1-tap "Add to Shopping List" ingredient synchronization.',
        'Athlete Batch Prep Scaler & Custom Creator: Engineered 1x, 2x, 4x, 6x meal prep batch scaler with raw ingredient grams, MPS macro blueprint, and custom multi-food recipe builder.',
      ],
    },
    {
      version: 'Beta 2.1.0',
      date: '2026-08-25',
      title: 'Radical Simplification of Simple Mode (4 Core Tabs & Zero Math)',
      changes: [
        'Consolidated Navigation: Streamlined Simple Mode from 7 dense tabs down to 4 ultra-clean tabs (Today, Food & Meals, Movement, Progress & Goals).',
        'Intuitive Hand Portion Guide: Replaced digital gram-scale calculations with visual hand portion sizing (1 Palm Protein, 1 Fist Veggies, 1 Cup Carbs, 1 Thumb Fat).',
        '1-Click Wholesome Meals: Added 1-tap wholesome meal plates (Oatmeal & Berries, Chicken Power Bowl, Salmon Sweet Potato) for instant effortless logging.',
        'Gentle Feel-Good Movement: Replaced complex periodized splits with 3 gentle daily choices (20-min Walk, 10-min Stretch, 15-min Tone) and 1-tap completion.',
        'Inline Goals & Preferences: Integrated unit preferences and calorie/water targets directly into Progress & Goals for zero-friction personalization.',
      ],
    },
    {
      version: 'Beta 2.0.3',
      date: '2026-08-24',
      title: 'Consistent Title-Case Fasting State Labels Across All Modes',
      changes: [
        'Clean Title Case: Replaced uppercase FASTING and EATING WINDOW text in Athlete Mode with clean Title Case ("Fasting" and "Eating Window") matching Simple Mode.',
        'Unified Fasting Indicators: Standardized live status indicators across both the header pill and the circadian fasting tracker screen.',
      ],
    },
    {
      version: 'Beta 2.0.2',
      date: '2026-08-24',
      title: 'Static Anchored Header Toggle for Simple vs Athlete Mode',
      changes: [
        'Static Segmented Switch: Replaced the dynamic toggle with an anchored dual-segment switch ([ Simple | Athlete ]) in the header that never shifts on click.',
        'Zero Layout Shift: Removed conditional layout-shifting elements from the header navigation row to guarantee pixel-stable positioning across screen sizes.',
      ],
    },
    {
      version: 'Beta 2.0.1',
      date: '2026-08-24',
      title: 'Full User Control & System-Wide Default State Purge',
      changes: [
        'Removed Hardcoded Exercise Checks: Fixed exercise split generator so no workout exercises are pre-checked as completed upon initialization.',
        'Zero-Default System State: Purged mock default workout history logs and initialized grocery lists cleanly to give the user 100% control over all daily choices.',
        'Upgraded Local State Storage: Migrated state schema to v7 to ensure fresh, clean un-checked state across all connected devices.',
      ],
    },
    {
      version: 'Beta 2.0.0',
      date: '2026-08-23',
      title: 'Landmark Milestone: Radical Dual-Mode Architecture (Ultra-Simple vs High-Tech Athlete)',
      changes: [
        'Radical Dual-Mode Architecture: Complete bifurcation of all 8 core modules between Standard User ("Daily Wellness Companion") and Advanced Athlete ("Athlete Metric Engine").',
        'Standard User Experience: Drastically simplified, peaceful, conversational layout with 1-click wholesome meal ideas, visual portion guides (palm/fist/cup), guided routine checklists, and clean aisle-by-aisle shopping lists with zero equation fatigue.',
        'Advanced Athlete Experience: High-tech obsidian telemetry with precision macro progress rings, raw P/C/F splits with delta variance, 1RM % calculators, RPE/RIR tracking, Olympic barbell plate math, HIIT interval timers, and 5-stage biological fasting telemetry.',
        'Seamless 1-Tap Toggle: Instantly switch between Daily Wellness Companion and Athlete Metric Engine via the persistent header toggle.',
      ],
    },
    {
      version: 'Beta 1.4.1',
      date: '2026-08-23',
      title: 'Context-Aware Device Detection for Phone Pedometer & Desktop/iPad Sync Station',
      changes: [
        'Device-Aware Interface: Automatically tailors the step tracking suite based on active hardware (Mobile Phone vs iPad vs Desktop/Laptop).',
        'Mobile Phone Mode: Prominently mounts the in-pocket Live Accelerometer Sensor Pedometer with live cadence oscillation tracking and tactile controls.',
        'Desktop & iPad Mode: Mounts the Watch & Multi-Device Sync Station with inline watch step entry, Bluetooth BLE device pairing, and cloud synchronization.',
      ],
    },
    {
      version: 'Beta 1.4.0',
      date: '2026-08-23',
      title: 'Advanced Hydration Engine & Phone/Watch Step Tracking Suite',
      changes: [
        'Advanced Hydration Engine: Built dynamic water tracking beyond 8 glasses (64 oz, 96 oz, 128 oz / 1 Gallon, 160 oz / 1.25 Gallons, or custom oz/mL) with container presets (Glass, Mug, Bottle, Shaker, Hydro Flask, Half Gallon) and history logging.',
        'Live Phone Accelerometer Pedometer: Added real-time step sensing using iOS Safari and Android CoreMotion DeviceMotionEvent with peak-detection cadence and active calorie calculation.',
        'Phone & Watch Health Sync Hub: Integrated Apple Health, Garmin, Fitbit, and Bluetooth Smart (BLE) fitness watch pairing directly in the browser.',
      ],
    },
    {
      version: 'Beta 1.3.2',
      date: '2026-08-23',
      title: "Store Brand Product Catalogs & 1-Click Run Presets (Sam's Club, Aldi, Meijer)",
      changes: [
        "Authentic Store Brand Products: Integrated 50+ actual signature items for Member's Mark (Sam's Club), Simply Nature / Friendly Farms / Earth Grown (Aldi), and True Goodness / Frederik's by Meijer (Meijer).",
        "1-Click Store Run Presets: Added instant load buttons for Sam's Club Bulk Run, Aldi Organics Run, and Meijer Weekly Run with calibrated package sizes and units.",
        "Store Catalog Tab Browser: Quick-Add modal now features dedicated store filter tabs displaying exact brand names, packaging sizes, and verified macronutrients.",
      ],
    },
    {
      version: 'Beta 1.3.1',
      date: '2026-08-23',
      title: "Food Database Grocery Integration & Sam's Club, Aldi, Meijer Store Support",
      changes: [
        "Food Database Integration: Connected the Weekly Grocery & Pantry Manager directly to the comprehensive 1,000+ item master food database with verified macronutrient profiles (protein, calories, carbs, fat).",
        "Updated Store Routing: Replaced Costco with Sam's Club, replaced Trader Joe's with Aldi, and added Meijer across store filters, item tags, and named lists.",
      ],
    },
    {
      version: 'Beta 1.3.0',
      date: '2026-08-23',
      title: 'Master Grocery Catalog, Smart Item Swaps & Pantry Inventory Suite',
      changes: [
        'Master Grocery Catalog: Built expansive item catalog across supermarket departments.',
        '1-Click Smart Item Swap Engine: Added dedicated substitution engine on every item to instantly swap culinary and macro-matched alternatives with conversion ratios.',
        'Pantry vs Need to Buy Mode: Integrated pantry stock toggle allowing users to track what they have at home vs what is needed in the shopping cart.',
        'Multi-List & iOS Export: Added named list switcher and 1-tap Copy for Apple Reminders, Notes, and iMessage.',
      ],
    },
    {
      version: 'Beta 1.2.0',
      date: '2026-08-23',
      title: 'Dedicated iPhone & iPad Mobile UI Enhancements & iOS Safari Constraints',
      changes: [
        'Optimized iOS Safe Areas: Added dynamic safe-area insets for iPhone notch, Dynamic Island, and bottom home swipe indicator across Header, BottomNav, and Modals.',
        'Engineered Mobile Table Layout: Applied strict table-layout fixed, responsive percentage column widths, and compact input steppers to prevent iOS Safari horizontal blowout on iPhone SE & standard iPhones.',
        'Responsive Mobile Navigation: Enhanced BottomNav to feature all 7 core modules with 44px+ touch targets and active glow states, paired with smooth horizontal sub-tab swiping in Daily Fitness.',
        'Preserved High-End Desktop Layout: Maintained dark-mode obsidian aesthetics, multi-column analytics grids, full sidebar, and hover micro-animations on laptops and desktops.',
      ],
    },
    {
      version: 'Beta 1.1.1',
      date: '2026-08-23',
      title: 'Dedicated Program Detail Modal Window & Layered Worksheet Architecture',
      changes: [
        'Updated program card interaction: Clicking any workout program immediately opens a dedicated Program Detail Modal Window with complete schedule metadata and required gear.',
        'Engineered layered window-over-window workflow: Opening any worksheet now launches the Interactive & Printable Workout Sheet directly on top of the program modal with z-[60] backdrop.',
        'Added backdrop dismiss and close controls to all program modals and tracking sheets.',
      ],
    },
    {
      version: 'Beta 1.1.0',
      date: '2026-08-23',
      title: 'Full Complement of Workout Sheets & Dedicated CrossFit Benchmarks Catalog',
      changes: [
        'Added full complement of 12 workout sheets for P90X Classic (Chest & Back, Plyo, Shoulders/Arms, Yoga X, Legs/Back, Kenpo X, X Stretch, Core Synergistics, Chest/Shoulders/Tris, Back/Bis, Cardio X, Ab Ripper X).',
        'Added complete 12 sheets for P90X2 (X2 Core, Plyocide, Recovery/Mobility, Total Body, Yoga, Balance & Power, Chest/Back/Balance, Shoulders/Arms, Base/Back, P.A.P. Lower, P.A.P. Upper, X2 Ab Ripper).',
        'Added complete 19 sheets for P90X3 (Total Synergistics, Agility X, The Challenge, X3 Yoga, CVX, The Warrior, Isometrix, Dynamix, Accelerator, Decelerator, Incinerator, Triometrics, MMX, Eccentric Upper/Lower, Complex Upper/Lower, Ab Ripper).',
        'Added dedicated CrossFit® category featuring all 18 "The Girls" benchmarks (Fran, Cindy, Helen, Grace, Isabel, Diane, Elizabeth, Karen, Annie, Jackie, Mary, Chelsea, Nancy, Eva, Kelly, Angie, Barbara, Linda) and 10 Hero WODs (Murph, DT, Chad 1000X, Nate, Badger, The Seven, Lumberjack 20).',
      ],
    },
    {
      version: 'Beta 1.0.0',
      date: '2026-08-23',
      title: 'Milestone Release: Complete Health, Nutrition & Strength Ecosystem',
      changes: [
        'Complete precision nutrition suite: Multi-category food database with stacked macro/allergen filters, 4-tier daily calorie & macro targets, fasting tracker, and smart grocery list.',
        'Equipment & Exercise Matrix: Symbiotic 120+ piece equipment database and hundreds of verified exercises filtered by owned gym gear with 0-equipment pure bodyweight fallback.',
        'Custom Weight Plate Ledger: Exact individual plate count inventory (100lb down to 0.5lb micro-plates) with real-time symmetrical barbell loading calculator and safety capacity enforcement.',
        'Pre-Done Training Programs: 40+ iconic protocols across 6 categories (P90X series, StrongLifts 5x5, Starting Strength, Body Beast, Insanity, PPL, Arnold Golden Six, Tai Chi 24-Form, Qigong, and HYROX).',
        'Interactive & Printable Workout Sheets: Online session logging with auto-computed volume and 1-click database saves, plus clean high-contrast black & white print layouts.',
        'Workout Database & Analytics Engine: Searchable historical workout database with date range queries, volume progression charts, and estimated 1RM personal record metrics.',
      ],
    },
    {
      version: 'Beta 0.18.0',
      date: '2026-08-23',
      title: 'Expanded Pre-Made Training Programs Catalog (40+ Legendary Protocols)',
      changes: [
        'Added full multi-week day-by-day programs for Insanity Max Interval Training, Body Beast, LIIFT4, Starting Strength, Wendler 5/3/1 BBB, and Texas Method.',
        'Integrated Push/Pull/Legs (PPL 6-Day Hypertrophy), PHUL 4-Day Power/Hypertrophy, Dorian Yates Blood & Guts HIT, and German Volume Training (GVT 10x10).',
        'Added mind-body and longevity sequences: Baduanjin Qigong (8 Pieces of Brocade), Ashtanga Primary Series Yoga, and Dr. Kelly Starrett Mobility WODs.',
        'Integrated tactical and hybrid race protocols: Simple & Sinister Kettlebell, CrossFit "The Girls" Benchmarks, 300 Spartan Challenge, HYROX Race Simulation, and Concept2 Pete Plan Rowing.',
      ],
    },
    {
      version: 'Beta 0.17.0',
      date: '2026-08-23',
      title: 'Individual Weight Plate Ledger, Pre-Made Programs (P90X, 5x5, Tai Chi) & Ongoing Workout Database Query Engine',
      changes: [
        'Added exact individual weight plate quantity ledger supporting custom counts across 100lb, 55lb, 45lb, 35lb, 25lb, 15lb, 10lb, 5lb, 2.5lb, 1.25lb, 1lb, and 0.5lb plates.',
        'Integrated renowned pre-made training programs including P90X Classic, P90X2, P90X3, StrongLifts 5x5, Starting Strength, Tai Chi 24-Form Yang Style, and Arnold Golden Six.',
        'Engineered interactive online workout sheets that can be logged and saved into a local/cloud database, plus high-contrast printable manual sheets.',
        'Built an Ongoing Workout Database & Analytics Query Engine to search and query historical training sessions, total volume lifted, and estimated 1RM personal records.',
      ],
    },
    {
      version: 'Beta 0.16.0',
      date: '2026-08-23',
      title: 'Olympic Weight Plate Inventory Engine & Max Barbell Capacity Calculator',
      changes: [
        'Engineered an interactive Olympic Weight Plate Inventory manager supporting pairs of 45lb, 35lb, 25lb, 10lb, 5lb, and 2.5lb micro-loading plates.',
        'Added dynamic Barbell Selector (Olympic 45lb, Women 35lb, Trap Bar 60lb, EZ Curl Bar 20lb, Safety Squat Bar 65lb, Swiss Multi-Grip Bar 40lb).',
        'Built a real-time Visual Barbell Plate Loading Simulator that calculates the exact per-side plate distribution for any target load and warns if target exceeds inventory.',
        'Symbiotically integrated Max Barbell Capacity constraints across compound lifts (deadlifts, barbell squats, flat bench press, and hip thrusts).',
        'Expanded equipment and exercise libraries with hundreds of new movements and biomechanical execution cues.',
      ],
    },
    {
      version: 'Beta 0.15.0',
      date: '2026-08-23',
      title: 'Symbiotic Equipment Database & Complete Exercise Database Architecture',
      changes: [
        'Set equipment inventory to unselected (0 items) by default, leaving full custom equipment configuration to the logged-on user.',
        'Engineered an expansive 7-category, 28-subcategory Equipment Database with 120+ pieces of gym gear, fast setup presets, and 1-tap inventory management.',
        'Built a comprehensive 9-category, 36-subcategory Exercise Database with hundreds of verified movements, execution cues, video links, and biomechanics.',
        'Created a symbiotic relationship where checking/unchecking equipment dynamically recalculates available exercises across both the Exercise Database and 4-Week Daily Split routines.',
      ],
    },
    {
      version: 'Beta 0.14.2',
      date: '2026-08-23',
      title: 'Branding & Identity Customization (Seelye Family Health & Logged-on User Label)',
      changes: [
        'Updated brand title in top-left sidebar header and application metadata to "Seelye Family Health".',
        'Renamed profile identifier from "Athlete:" to "Logged-on User:".',
      ],
    },
    {
      version: 'Beta 0.14.1',
      date: '2026-08-23',
      title: 'Expanded 2,250-Item Verified Food Database & Comprehensive 11-Filter Nutritional Matrix',
      changes: [
        'Added 100+ verified food items per category, scaling the master nutrition library to 2,250+ verified items across all 10 tiered groups.',
        'Engineered an expansive 11-category stackable filter system spanning High Protein, Gluten-Free, Dairy-Free, Low Carb/Keto, Low Calorie, Ultra Lean, Calorie Dense, Plant-Based, High Fiber, Paleo, and Fasting-Safe.',
        'Added a dedicated Filter Matrix Modal Window with live item count diagnostics and 1-click active tag pill dismissals.',
      ],
    },
    {
      version: 'Beta 0.14.0',
      date: '2026-08-23',
      title: 'Layered Modal Window Architecture & Windows-Over-Windows Design System',
      changes: [
        'Transformed all dialogs, detail inspections, and viewers across the site into rich, layered modal windows with backdrop blurs and fluid animations.',
        'Added dedicated modal windows for SQL Schema Inspector, Version Release Changelog, Food Nutrition & Bioavailability Breakdown, and Exercise Form Technique & Video Demonstrations.',
        'Polished layered z-index hierarchy and touch-friendly close controls for seamless multi-window workflows.',
      ],
    },
    {
      version: 'Beta 0.13.2',
      date: '2026-08-23',
      title: 'Preserved Hierarchical Category Navigation & Stackable Multi-Select Dietary Filtering',
      changes: [
        'Preserved the Category and Sub-Category browsing flow while filtering, dynamically reducing item counts on each category and sub-category card in real time.',
        'Engineered stackable multi-select dietary buttons allowing simultaneous combination of High Protein, Gluten-Free, and Dairy-Free filters with AND conjunctions.',
        'Added dynamic zero-count status indicators and visual state tags across cards.',
      ],
    },
    {
      version: 'Beta 0.13.1',
      date: '2026-08-23',
      title: 'Food Database Reactive Dietary Filtering & Live Count Integration',
      changes: [
        'Fixed dietary filter buttons (High Protein, Gluten-Free, Dairy-Free) to immediately trigger reactive view-switching and display matching foods instantly.',
        'Added dynamic live count badges to dietary filters and categorized cards.',
        'Added visual match indicators on all food cards and enhanced breadcrumb filter clearing.',
      ],
    },
    {
      version: 'Beta 0.13.0',
      date: '2026-08-23',
      title: 'Fasting Time Dropdown & Ergonomic Accessible Universal Steppers (+/-)',
      changes: [
        'Added rich 12-hour AM/PM formatted dropdown selector with quick 30-minute earlier/later steppers for fasting start times.',
        'Replaced all small browser number spinners across Profile Settings, Food Logging, Workouts, HIIT Timer, and Requisitions with large, tactile touch-friendly NumberStepper (+ / -) controls.',
        'Enhanced mobile and desktop precision with comfortable button touch-targets and direct numeric input support.',
      ],
    },
    {
      version: 'Beta 0.12.5',
      date: '2026-08-23',
      title: 'Explicit Origin-Aware Email Confirmation Redirect Routing',
      changes: [
        'Added dynamic emailRedirectTo during Supabase user registration ensuring confirmation links route directly to the active live production origin.',
      ],
    },
    {
      version: 'Beta 0.12.4',
      date: '2026-08-23',
      title: 'Hydration 0-Default Daily Persistence & Generic Authentication Privacy Sanitization',
      changes: [
        'Fixed water tracker initialization to default to 0 glasses every new day with date-keyed local persistence.',
        'Sanitized all default profile state, login placeholders, and account creation routines to remove personal demo information.',
        'Added dynamic profile form synchronization on user authentication.',
      ],
    },
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
              onClick={() => setShowSqlViewer(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-200/60 hover:bg-surface-200 border border-surface-border text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer active:scale-95 transition-all"
            >
              Inspect SQL Modal
            </button>
          </div>
        </div>

        {/* Modal Window: Supabase SQL Schema Inspector */}
        {showSqlViewer && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
            <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl flex flex-col space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-brand-400" />
                  <h3 className="text-base font-bold text-white">Supabase PostgreSQL Schema & Security Policies</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSqlViewer(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-zinc-400">
                Idempotent database migration script. Execute this in your Supabase SQL Editor to provision all 6 tables and row-level security (RLS) policies.
              </p>

              <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-surface-300/90 border border-surface-border font-mono text-[11px] text-zinc-300 select-all">
                <pre className="whitespace-pre-wrap leading-relaxed">{SUPABASE_SQL_SCHEMA}</pre>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-border text-xs">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold shadow-glow active:scale-95 cursor-pointer"
                >
                  {sqlCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{sqlCopied ? 'SQL Script Copied!' : 'Copy Entire SQL Script'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSqlViewer(false)}
                  className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-200 font-semibold cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
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
            <label className="font-semibold text-zinc-300 block mb-1">Biological Sex</label>
            <select
              value={form.sex}
              onChange={(e) => setForm({ ...form, sex: e.target.value as BiologicalSex })}
              className="w-full h-[52px] px-3.5 rounded-2xl bg-surface-200/90 border border-surface-border text-zinc-100 font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Neutral</option>
            </select>
          </div>

          <div>
            <NumberStepper
              label="Age"
              value={form.age}
              onChange={(val) => setForm({ ...form, age: val })}
              min={14}
              max={100}
              step={1}
              unit="yrs"
            />
          </div>

          {/* Height Input (Conditional: ft/in or cm) */}
          {form.unit_preference === 'imperial' ? (
            <div className="grid grid-cols-2 gap-2">
              <NumberStepper
                label="Height (Feet)"
                value={form.height_ft}
                onChange={(val) => setForm({ ...form, height_ft: val })}
                min={0}
                max={7}
                step={1}
                allowEmptyZero={true}
                placeholder="Feet (e.g. 5)"
                unit="ft"
              />
              <NumberStepper
                label="Height (Inches)"
                value={form.height_in}
                onChange={(val) => setForm({ ...form, height_in: val })}
                min={0}
                max={11}
                step={1}
                allowEmptyZero={true}
                placeholder="Inches (e.g. 10)"
                unit="in"
              />
            </div>
          ) : (
            <div>
              <NumberStepper
                label="Height (cm)"
                value={form.height_cm}
                onChange={(val) => setForm({ ...form, height_cm: val })}
                min={0}
                max={250}
                step={1}
                allowEmptyZero={true}
                placeholder="cm (e.g. 178)"
                unit="cm"
              />
            </div>
          )}

          {/* Weight Input (Conditional: lbs or kg) */}
          <div>
            <NumberStepper
              label={`Current Weight (${form.unit_preference === 'imperial' ? 'lbs' : 'kg'})`}
              value={form.current_weight_input}
              onChange={(val) => setForm({ ...form, current_weight_input: val })}
              min={0}
              max={form.unit_preference === 'imperial' ? 600 : 300}
              step={0.5}
              decimals={1}
              allowEmptyZero={true}
              placeholder={form.unit_preference === 'imperial' ? 'e.g. 175.0' : 'e.g. 79.5'}
              unit={form.unit_preference === 'imperial' ? 'lbs' : 'kg'}
            />
          </div>

          {/* Target Weight Input (Conditional: lbs or kg) */}
          <div>
            <NumberStepper
              label={`Target Goal Weight (${form.unit_preference === 'imperial' ? 'lbs' : 'kg'})`}
              value={form.target_weight_input}
              onChange={(val) => setForm({ ...form, target_weight_input: val })}
              min={0}
              max={form.unit_preference === 'imperial' ? 600 : 300}
              step={0.5}
              decimals={1}
              allowEmptyZero={true}
              placeholder={form.unit_preference === 'imperial' ? 'e.g. 165.0' : 'e.g. 75.0'}
              unit={form.unit_preference === 'imperial' ? 'lbs' : 'kg'}
            />
          </div>

          <div>
            <FastingTimePicker
              label="Fasting Starts Every Evening At:"
              value={form.fasting_start_time}
              onChange={(val) => setForm({ ...form, fasting_start_time: val })}
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1">Activity Level</label>
            <select
              value={form.activity_level}
              onChange={(e) => setForm({ ...form, activity_level: e.target.value as ActivityLevel })}
              className="w-full h-[52px] px-3.5 rounded-2xl bg-surface-200/90 border border-surface-border text-zinc-100 font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="sedentary">Sedentary (Mostly desk work)</option>
              <option value="light">Light Activity (1-3 days walks/workouts)</option>
              <option value="moderate">Moderate Activity (3-5 days workouts)</option>
              <option value="high">High Activity (6-7 days hard training)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1">Primary Wellness Goal</label>
            <select
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value as GoalType })}
              className="w-full h-[52px] px-3.5 rounded-2xl bg-surface-200/90 border border-surface-border text-zinc-100 font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
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

      {/* Version History & Changelog Display (Modal Window Architecture) */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-base font-bold text-zinc-100">Application Version</h2>
          </div>

          {/* Interactive Version Trigger Button - Opens Modal */}
          <button
            type="button"
            id="toggle-changelog-btn"
            onClick={() => setShowChangelog(true)}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Click to open release changelog modal window"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span>Active: Beta 2.8.0</span>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Dedicated Modal Window: Version History & Changelog */}
        {showChangelog && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
            <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl flex flex-col space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-accent-cyan" />
                  <h3 className="text-base font-bold text-white">Application Version & Release Changelog</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangelog(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300">Detailed Release Ledger</span>
                <span className="text-[11px] font-mono text-zinc-500">Live Health.Seelye Architecture</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {changelogHistory.map((release) => (
                  <div key={release.version} className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-3">
                    <div className="flex items-center gap-3">
                      <GitCommit className="w-5 h-5 text-brand-400 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-mono text-zinc-100">{release.version}</span>
                          <span className="text-xs text-zinc-400 font-mono">({release.date})</span>
                        </div>
                        <h4 className="text-xs font-semibold text-zinc-300 mt-0.5">{release.title}</h4>
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

              <div className="flex justify-end pt-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowChangelog(false)}
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold text-xs shadow-glow active:scale-95 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
