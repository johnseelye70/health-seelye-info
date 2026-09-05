'use client';

import React, { useState, useEffect } from 'react';
import { useHealth } from '@/context/HealthContext';
import { APP_VERSION_SHORT } from '@/lib/version';
import {
  ActivityLevel,
  BiologicalSex,
  FastingProtocol,
  GoalType,
  UnitPreference,
  ExperienceMode,
} from '@/lib/types';
import { kgToLbs, lbsToKg, cmToFtIn, ftInToCm } from '@/lib/units';
import { calculateMacroTargets } from '@/lib/macro-calculator';
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
  GraduationCap,
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
    experience_mode: profile.experience_mode || 'standard',
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
      experience_mode: profile.experience_mode || 'standard',
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

  const handleSave = async (e: React.FormEvent) => {
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

    const calculated = calculateMacroTargets({
      weightKg: finalWeightKg,
      heightCm: finalHeightCm,
      age: Number(form.age),
      sex: form.sex,
      activityLevel: form.activity_level,
      goal: form.goal,
    });

    await updateProfile({
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
      daily_calorie_target: calculated.dailyCalories,
      protein_target_g: calculated.proteinGrams,
      carb_target_g: calculated.carbGrams,
      fat_target_g: calculated.fatGrams,
    });

    setExperienceMode(form.experience_mode);
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
      experience_mode: 'standard',
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
      version: 'b4.14.1',
      date: '2026-09-05',
      title: 'Automatic Viewport Scroll-to-Top on Guided Step Progression',
      changes: [
        'Instant Top Viewport Snap: Engineered an immediate multi-tiered scroll reset (window.scrollTo, documentElement.scrollTop, and body.scrollTop) across step navigation buttons, back links, and progress pills.',
        'Zero Stale Scroll Clamping: Resolved iOS Safari viewport retention by pairing instant programmatic resets with a reactive layout effect that pins the view to the top whenever active steps or tabs change.',
        'Top & Bottom Bar Synchronization: Added synchronous scroll resets to both the header banner and the bottom completion bar, guaranteeing a smooth start at the top of every step without manual scrolling.',
      ],
    },
    {
      version: 'b4.14.0',
      date: '2026-09-05',
      title: 'Guided Daily Step-by-Step Flow with Forward Progression & Dashboard Completion',
      changes: [
        'End-to-End Guided Daily Flow: Engineered an automated 4-step progression system (Step 1: Morning Check-In → Step 2: Log Meals → Step 3: Daily Movement → Step 4: Review Your Day → Dashboard).',
        'Inline Step Navigation Banners: Added top and bottom inline walkthrough banners on every step page with direct forward buttons ("Continue to Next Step →"), previous step links, and one-tap return to dashboard.',
        'Interactive Progress Track: Displayed live step pills (1, 2, 3, 4) with instant step jumping and real-time completion checkmarks as fasting, water, meals, and workouts are logged.',
        'Seamless Completion Handoff: Finishing Step 4 provides a prominent "✓ Daily Flow Complete — Go to Dashboard to Begin Daily Use" button that safely exits guided mode and transitions to regular app usage.',
        '1-Tap Dashboard Launcher: Added a "Start Today\'s Flow" launcher button directly inside the Dashboard Step-by-Step section.',
      ],
    },
    {
      version: 'b4.13.9',
      date: '2026-09-05',
      title: 'Complete Pinch-to-Zoom & Multi-Touch Scale Lockdown for iOS Safari',
      changes: [
        'Zero Pinch-to-Zoom: Intercepted WebKit gesturestart, gesturechange, and gestureend events with active preventDefault guards, completely stopping iOS Safari from zooming or scaling when multiple fingers touch the screen.',
        'Multi-Finger Canvas Pan Elimination: Blocked multi-touch touchmove (e.touches.length > 1), ensuring accidental two-thumb or pinch gestures never shift or distort the UI frame.',
        'True Native App Feel: Locked the viewport at an unshakeable 1:1 physical scale while keeping standard single-finger vertical scrolling 100% natural and fluid.',
      ],
    },
    {
      version: 'b4.13.8',
      date: '2026-09-05',
      title: 'Rock-Solid iOS Safari Gesture Stability & Zero Side-to-Side Swirling',
      changes: [
        'Locked Viewport Scale & Canvas: Configured Next.js viewport metadata with maximumScale: 1, userScalable: false, and viewportFit: cover, completely stopping iOS Safari from shifting, swirling, or zooming the canvas in 2D space.',
        'Zero Side-to-Side Motion (touch-action: pan-y): Enforced strict touch-action: pan-y on html, body, and page wrappers, instructing Safari to reject horizontal drag/pan gestures while keeping vertical scrolling 100% natural and fluid.',
        'Eliminated Elastic Horizontal Rubber-Banding: Added overscroll-behavior-x: none to html and body, permanently terminating Safari\'s side-to-side history bounce and rubber-band elasticity.',
        'Strict Body Overflow Bounds: Replaced overflow-x: clip with overflow-x: hidden on body and clamped ambient background glow elements within strict 100% boundary width limits with overflow: hidden.',
        'Touch Callout & Input Protection: Disabled accidental Safari text selection callouts during touch movement with -webkit-touch-callout: none while fully preserving selection and typing across inputs, textareas, and horizontal carousels.',
      ],
    },
    {
      version: 'b4.13.7',
      date: '2026-09-04',
      title: 'Automated Real-Time Cross-Device Background Sync Architecture',
      changes: [
        'Supabase Realtime WebSockets: Connected live postgres_changes channel subscriptions on public.profiles and public.food_logs. When food or water is logged or updated on one device, the other device automatically syncs within milliseconds without manual intervention.',
        'Sub-Second 400ms Push Debounce: Reduced cloud write debounce from 1,500ms to 400ms, pushing food entries, water logs, and custom meals to the cloud almost instantaneously.',
        'Immediate Auto-Sync on Tab Navigation: Navigating between Dashboard, Food Diary, Fasting, and Workouts triggers instant background data reconciliation.',
        'Eager 8-Second Polling & Mobile App Lifecycle Resume: Dropped visibility fallback polling from 30s to 8s, and added listeners for window focus, pageshow, and screen unlock/visibilitychange on iOS Safari.',
        'Universal Mutation Auto-Sync: Hooked automated background cloud sync into custom meal creation, meal deletions, and body weight logs alongside food diary and hydration adjustments.',
      ],
    },
    {
      version: 'b4.13.6',
      date: '2026-09-04',
      title: 'Standard Mode Water Reset Buttons & Truthful Cross-Device Sync Status',
      changes: [
        'Universal Standard Mode Water Reset: Added prominent, high-contrast [↺ Reset] buttons directly to the Standard Mode Water & Hydration card header and an inline (Reset to 0) link beside the ounce readout on both iPhone and desktop.',
        'Always-Visible Hydration Engine Reset: Removed restrictive entry guards so the [↺ Reset Water] button is always visible in the card header, quick log containers, and history modal regardless of current count.',
        'Resolved UTC Midnight Water Inflation: Upgraded isWaterKilled to match entries within 36 hours of the reset timestamp, preventing old iPhone local logs from incorrectly merging with cloud logs and skewing water totals higher.',
        'Evening Timezone Rollover Food Matching: Implemented isDateMatch across currentDayFoodLogs, selectedDayFoodLogs, and todayWaterOz to seamlessly bridge local EDT calendar dates with UTC cloud timestamps.',
        'Truthful Sync & Guest Mode Alerts: Replaced false "Sync Complete" toasts with active sign-in modals when unauthenticated, and added real-time account status diagnostic banners showing the active email on Dashboard and Food Diary.',
        'Guaranteed App Sync Bundle Persistence: Ensured multi-device equipment_inventory sync bundles save whenever records exist without being blocked by stale signature comparisons.',
      ],
    },
    {
      version: 'b4.13.5',
      date: '2026-09-04',
      title: 'Food Diary Cross-Device Sync & Hydration Deletion/Reset Architecture',
      changes: [
        'Guaranteed PostgreSQL Profile Upsert: Upgraded cloud profile bundle saving from .update() to .upsert({ onConflict: "id" }), ensuring user profile records and equipment_inventory sync bundles are created and persisted without silent failures.',
        'Lean Multi-Device Sync Bundle: Stripped redundant nested custom_meal_data from food logs inside the cloud sync bundle, eliminating 4KB Supabase Auth metadata quota exceptions while preserving full recipe structures in custom_meals.',
        'Water Tombstone & Reset Architecture: Engineered deleted_water_ids tombstones and water_reset_at timestamps that propagate to the cloud, permanently preventing deleted or reset hydration logs from resurrecting upon sync.',
        'Local Calendar Timestamping for Hydration: Standardized water log timestamps to use local calendar dates (todayDate + local time) rather than UTC toISOString, eliminating evening timezone rollover discrepancies where water logged after 8:00 PM EDT vanished or mapped to tomorrow.',
        'Clean PostgreSQL Food Logs Batch Insert: Ensured profile row exists prior to food_logs table inserts to satisfy foreign key constraints, omitted client-generated IDs so PostgreSQL generates clean UUIDs, and enforced food_id: null to prevent foreign key errors.',
        '1-Tap Mobile Header Cloud Sync: Configured the mobile header cloud icon to trigger an immediate 1-tap sync for authenticated users with active spinning status indicators instead of redundantly opening the auth modal.',
      ],
    },
    {
      version: 'b4.13.4',
      date: '2026-09-04',
      title: 'Resolved Cross-Device Sync Race Conditions & Hydration Water Log Deduplication',
      changes: [
        'Eliminated Destructive Sync Clobbering: Removed the redundant Section D step sync that was concurrently overwriting profiles.equipment_inventory and auth user_metadata, ensuring the full app_sync_bundle (food_logs, water_logs, custom_meals, workout_logs, scheduled_plans) persists reliably in PostgreSQL without being wiped out.',
        'Fresh-Device Food Push Guard: Implemented strict push guards preventing uninitialized secondary devices (like a freshly signed-in iPhone) from overwriting cloud food logs with empty arrays.',
        'Hydration Water Log Deduplication: Engineered composite signature deduplication (date, oz amount, container, and 5-minute time block) to prevent water logs from duplicating and skewing totals higher when syncing between laptop and iPhone.',
        'Interactive Water Log Deletion & Reset: Added individual entry delete buttons (trash icon) and a "Reset Today" button in the Hydration History modal so any duplicate or test water taps can be removed in 1 click.',
        'Awaited PostgreSQL Food Log Inserts: Switched database food_logs inserts to fully awaited queries with active error catching, ensuring entries are confirmed in PostgreSQL and primary key UUIDs are linked immediately.',
        'Local Calendar Date Normalization: Standardized all food and water logging to use local calendar date strings (selectedDate || todayDate) instead of UTC toISOString, preventing date roll-over discrepancies in evening hours.',
      ],
    },
    {
      version: 'b4.13.3',
      date: '2026-09-04',
      title: 'Standardized "Food Diary" Navigation & Quick 1-Tap Sidebar Cloud Sync',
      changes: [
        'Standardized "Food Diary" Navigation: Renamed navigation tabs across laptop sidebar and mobile bottom bar to explicitly display "Food Diary" in all experience modes (Standard, Tutorial, and Advanced), eliminating ambiguity.',
        '1-Tap Sidebar Cloud Sync: Added a dedicated 1-tap cloud sync refresh button directly beside the user authentication status in the laptop sidebar for immediate synchronization at any time.',
        'Interactive Dashboard Calorie Balance Link: Made the Calorie Balance card and Macro rings on the main dashboard directly clickable to instantly navigate to the Food Diary.',
      ],
    },
    {
      version: 'b4.13.2',
      date: '2026-09-04',
      title: 'Real-Time Food Log & Calorie Balance Cross-Device Cloud Sync',
      changes: [
        'Multi-Device Food Log Bundle Synchronization: Added food_logs into the app_sync_bundle carried inside Supabase Auth user metadata and profiles cloud records, ensuring food entries recorded on laptop synchronize bidirectionally to iPhone just like hydration water logs.',
        'Immediate Real-Time Calorie Balance on Mobile: Resolved the issue where iPhone showed 0 calories consumed despite food logged on laptop; calorie balance and macro targets now update in real-time on all devices.',
        'Triple-Source Non-Destructive Reconciliation: Reconciles food logs across Supabase PostgreSQL table, cloud sync bundle, and local device state using unique entry IDs and composite signatures to prevent duplicate or missing logs.',
        '1.5s Auto-Debounced Cloud Persistence: Food diary entries, custom meal builder logs, quick calories, and hydration water updates trigger immediate background cloud syncing within 1.5 seconds without requiring tab switching.',
        '1-Tap "Sync Cloud" Food Diary Action: Added an explicit 1-tap "Sync Cloud" button in the Daily Food Diary header bar with live syncing status animations and completion notifications for immediate user control on laptop and iPhone.',
        'Robust Date Timestamp Normalization: Standardized date matching across diary, reports, and calculations to cleanly match both date-only and ISO timestamp strings.',
      ],
    },
    {
      version: 'b4.13.1',
      date: '2026-09-04',
      title: 'iOS Safari Storage Quota Resolution & Safe Auth Storage Adapter',
      changes: [
        'Resolved Safari "Quota Exceeded" Exception: Eliminated the DOMException QuotaExceededError by removing the static 1,700-item food catalog and generated workout splits from localStorage, reducing the state persistence footprint by 97% (from 1.3 MB down to ~30 KB).',
        'Automatic Legacy Storage Cache Purge: Added an automatic startup sweeper that purges stale app state keys from prior versions (v1 through v7) that were consuming all 5MB of Safari storage budget.',
        'Safe Auth Storage Adapter with Auto-Recovery: Re-engineered Supabase client auth storage with automatic fallback and in-memory persistence, ensuring auth token storage and user sign-in never crash or fail on mobile devices.',
        'Seamless Sign-In Auto-Retry: Auth modal automatically catches any storage quota limitations and recovers transparently during sign-in without interrupting user authentication.',
      ],
    },
    {
      version: 'b4.13.0',
      date: '2026-09-04',
      title: 'Full Multi-Device Laptop-to-iPhone Cloud Synchronization Engine',
      changes: [
        'PostgreSQL Food Log UUID Resilience: Resolved Postgres error 22P02 by safely sanitizing food_logs.food_id to prevent type mismatches on curated string IDs, and added automatic database UUID capture via .select() to seamlessly link local log entries to cloud database rows.',
        'Multi-Domain App Sync Bundle: Unified custom built meals & recipes, daily chosen movements, hydration water logs, workout session ledgers, and scheduled plans into an automatic multi-device sync bundle stored in user metadata and profile cloud records.',
        'iPhone Safari Session Persistence: Configured persistent auth token storage in Supabase client options with auto-refresh and URL detection to maintain authenticated state on iOS Safari.',
        'Immediate Diary & Meal Cloud Push: Connected logBuiltMealToDiary, updateBuiltMealInDiary, quickLogCalories, and logFood to push immediately to cloud tables with automatic local ID reconciliation.',
        'Prominent Cross-Device UI Status & Instructions: Upgraded Header with an amber sync status indicator on unauthenticated devices and added clear step-by-step guidance in AuthModal and Settings for syncing between laptop and iPhone.',
      ],
    },
    {
      version: 'b4.12.0',
      date: '2026-09-04',
      title: 'Complete Sam\'s Club Egg Catalog Integration',
      changes: [
        'Member\'s Mark Fresh Shell Eggs: Added Member\'s Mark Cage-Free Grade AA Large White Eggs (2 Dozen / 24-Pack & 5 Dozen / 60-Count Crate), Cage-Free Large Brown Eggs (24-Pack), Organic Cage-Free Large Brown Eggs (24-Pack), Free Range Large Brown Eggs (24-Pack), and Pasture-Raised Organic Grade A Large Brown Eggs (18-Count / 1.5 Dozen).',
        'Commercial & Prepared Egg Products: Added Member\'s Mark Pasteurized Liquid Real Whole Eggs with Citric Acid, Member\'s Mark Sous Vide Uncured Bacon & Three Cheese Egg Bites (5-Pack / 10 Bites), and Three Bridges Uncured Bacon & Cheese Egg Bites (8-Pack / 16 Bites).',
        'National Brand Egg Lines at Sam\'s Club: Added Sunny Meadow Grade A Large Eggs (36-Count Case / 2 x 18-Pack), Eggland\'s Best Cage-Free Large Brown (18-Count), Eggland\'s Best Organic Large (18-Count), Eggland\'s Best Large White (30-Count Flat), Eggland\'s Best Three Cheese Omelets (8-Count), Happy Egg Co. Free Range Large Brown (18-Count), and Vital Farms Pasture-Raised Organic Large (18-Count).',
        'Hard-Boiled Multi-Packs: Added convenient grab-and-go peeled egg multi-packs including Great Day Farms Cage-Free Hard-Boiled (12 x 2-Pack / 24-Count), Snack Attack Cage-Free Hard-Boiled (12 x 2-Pack), The Farmer\'s Hen Free Range Hard-Cooked (12 x 2-Pack), Almark Foods Cage-Free Hard-Cooked (12 x 2-Pack), and Eggland\'s Best Hard-Cooked Peeled Eggs (8-Pack).',
        'Plant-Based & Alternative Options: Added Just Egg Plant-Based Liquid Scramble (32 oz Club Pack) and Just Egg Plant-Based Folded Patties (Club Pack), plus Bob Evans Liquid Real Whole Eggs (32 oz Club Pack).',
        'Database Scale: Master Food Database expanded to 1,709 verified items (310 items in Dairy & Eggs; 63 authentic egg items).',
      ],
    },
    {
      version: 'b4.11.0',
      date: '2026-09-04',
      title: 'Preferred Stores Dairy & Greek Yogurt Expansion (Meijer, Walmart, Costco, Sam\'s Club, Aldi & National Brands)',
      changes: [
        'Comprehensive Greek Yogurt Catalog: Added 36 Greek yogurts spanning all fat percentages (0% nonfat, 2% lowfat, 4-5% whole milk) and top flavors across Fage Total, Chobani, Dannon Oikos (Triple Zero & Pro 20g/25g), Dannon Light & Fit (12g protein zero-sugar), Siggi\'s Icelandic Skyr, Two Good (2g sugar), Meijer, Great Value, Kirkland Signature Organic, Member\'s Mark, Friendly Farms (Aldi), and Simply Nature Organic.',
        'Cottage Cheese Varieties: Added 19 cottage cheeses across 4% whole milk, 2% low-fat, nonfat, and whipped curd textures from Good Culture (Organic Whole Milk, 2% Low-Fat, Simply, Whipped), Daisy (4% & 2%), Breakstone\'s (4% Small Curd, 2%, Multi-Serve), Meijer, Great Value Small Curd, Member\'s Mark, and Friendly Farms (Aldi).',
        'Dairy Milks Across Preferred Stores: Added 26 dairy milks spanning whole milk, 2% reduced fat, 1% low-fat, skim/fat-free, and lactose-free filtered milk across Fairlife, Horizon Organic, Organic Valley, a2 Milk, Meijer, Great Value, Kirkland Signature, Member\'s Mark, and Friendly Farms.',
        'Eggs, Egg Whites & Pasture-Raised Lines: Added 23 authentic egg products including pasture-raised certified humane and organic eggs from Vital Farms, Eggland\'s Best (Omega-3 & Cage-Free), Happy Egg Co., Goldhen (Aldi), Simply Nature Organic Pasture-Raised (Aldi), Meijer Grade A Large & Extra Large, Great Value Large & Cage-Free, Kirkland Signature 2-Dozen Pasture-Raised, and Member\'s Mark 24-Count Pasture-Raised & 30-Count Trays, plus 100% pasteurized liquid egg white cartons across all 5 stores and Bob Evans.',
        'Cheeses of All Types: Added 61 cheeses spanning blocks, deli slices, finely shredded bags, snacking strings, and wheels across Sharp Cheddar, Extra Sharp, Medium/Mild Cheddar, Part-Skim Mozzarella, Swiss, Provolone, Pepper Jack, Colby Jack, Creamy Havarti, Muenster, Smoked Gouda, Dubliner/Irish Cheddar, Shredded Parmesan, Crumbled Feta, and French Brie from Kraft, Tillamook, Cabot, Sargento, Kerrygold, BelGioioso, Babybel, Athenos, Frigo, Happy Farms (Aldi), Emporium Selection (Aldi), Meijer, Great Value, Kirkland Signature, and Member\'s Mark.',
        'Cream Cheese Selection: Added 16 cream cheese options across 8 oz foil bricks, soft spreads, whipped tubs, and 1/3 less fat Neufchâtel from Philadelphia, Tillamook Farmstyle, Happy Farms, Meijer, Great Value, Kirkland Signature, and Member\'s Mark.',
        'Pure Sour Cream & Heavy Whipping Cream: Added 13 pure cultured sour cream and light squeeze options from Daisy, Breakstone\'s, Meijer, Great Value, Member\'s Mark, and Friendly Farms, along with 8 Grade A heavy whipping creams (36-40% butterfat) from Land O\'Lakes, Horizon Organic, Countryside Creamery, Meijer, Great Value, Kirkland Signature, and Member\'s Mark.',
        'Total Master Database Growth: Master Food Database expanded from 1,498 to 1,685 verified, laboratory-accurate items (99 to 286 items in Dairy & Eggs) with seamless multi-token store and brand filtering across all search interfaces.',
      ],
    },
    {
      version: 'b4.10.0',
      date: '2026-09-04',
      title: 'Name Brand Protein Bars, RTD Drinks, Atkins Catalog & Comprehensive Nut Varieties',
      changes: [
        'Chef Robert Irvine FitCrunch Bars Integration: Added the full FitCrunch roster including full-size 88g bars, 46g snack-size bars, and protein wafers in all top flavors (Chocolate Peanut Butter, Peanut Butter & Jelly, Chocolate Chip Cookie Dough, Milk & Cookies, Mint Chocolate Chip, Caramel Peanut, Strawberry Strudel, Apple Pie, Lemon Cake).',
        'Atkins Products Suite: Added the complete Atkins line of low-carb meal bars (Chocolate Peanut Butter, Chocolate Chip Granola, Blueberry Greek Yogurt, Cookie Dough), snack bars (Caramel Chocolate Nut Roll, Lemon, White Chocolate Macadamia), Endulge treats (Caramel Nut Chew, Peanut Butter Cups, Pecan Caramel Mousse), and ready-to-drink shakes (Atkins Plus 30g, Atkins Meal 15g, Iced Coffee shakes).',
        'Top Brand Protein Bars: Added 86 curated protein bars across Quest Nutrition, Barebells, ONE Brands, Pure Protein, Built Bar & Puffs, Gatorade Whey, CLIF Builder\'s, Met-Rx Big 100, RXBAR, Think!, Kirkland Signature, No Cow, Aloha, Lenny & Larry\'s, and Grenade Carb Killa.',
        'Ready-to-Drink (RTD) Protein Shakes: Added 51 name brand protein drinks across Fairlife Core Power Elite (42g), Core Power (26g), Fairlife Nutrition Plan (30g), Premier Protein (30g), Muscle Milk (25g, 40g Pro, Zero), Quest RTD, Ensure Max Protein, Boost Max, Orgain Organic & Clean Protein, OWYN 100% Plant-Based (32g Pro Elite), Slate Milk, Ghost RTD, and Shamrock Farms Rockin\' Protein.',
        'Comprehensive Nut Varieties: Expanded the healthy fats and nuts domain with 43 diverse nut types and preps across Peanuts (Planters salted, honey roasted, dry roasted, Spanish, boiled, Virginia jumbo), Pistachios (Wonderful shelled, lightly salted, sweet chili, salt & pepper), Almonds (Blue Diamond smokehouse, wasabi & soy, habanero BBQ, whole raw, slivered), Walnuts (English, Emerald glazed, chopped), Pecans (Georgia roasted, praline glazed), Cashews (Planters, Kirkland fancy, rosemary olive oil), Pine Nuts (Italian toasted, Siberian wild), Hazelnuts, Macadamias (Mauna Loa), Chestnuts, Deluxe Mixed Nuts, Pili Nuts, and Tiger Nuts.',
        'Dedicated Sub-Categories & Smart Search: Added new "Protein Bars & Snacks" and "Ready-to-Drink Protein Shakes" sub-categories, enhanced multi-token and singular/plural search matching across the Food Database Browser, Meal Builder, and Food Search API.',
      ],
    },
    {
      version: 'b4.9.1',
      date: '2026-09-04',
      title: 'Standard Movement Reset & Clear Workflow Alignment',
      changes: [
        'Complete Movement Reset & Clear: Updated the Standard movement Reset action to cleanly clear all chosen movements for the day, ensuring previously selected activities no longer appear in "Your Chosen Movements For Today" or show as selected in the picker/chips.',
        'Clean Empty Slate UI: Added an encouraging empty state card when all chosen movements are reset or cleared, providing quick 1-click action buttons to add activities, browse pre-made programs, or restore recommended baseline defaults.',
        'Individual Activity Removal: Removed the minimum 1 item constraint on the activity trash buttons so users can freely delete any chosen activity individually down to an empty slate.',
        'Persistence Alignment: Corrected local storage restoration logic so an empty array of chosen movements persists cleanly across page reloads instead of resurrecting old default items.',
      ],
    },
    {
      version: 'b4.9.0',
      date: '2026-09-04',
      title: 'Full Pre-Made Workouts Search, Quick-Add & Browser Integration in Standard Movement Mode',
      changes: [
        'Standard Mode Pre-Made Workouts Search & Discovery: Enabled full search across all 42 pre-made programs and 180+ workout sessions (P90X, StrongLifts 5x5, CrossFit Benchmarks, Hero WODs, Arnold Golden Six, Insanity, Tai Chi, Concept2) directly from Standard Feel-Good Movement mode.',
        'Standard Mode Sub-Navigation Toggle: Added a clean 2-pill switcher ("Daily Movement Choices" & "Pre-Made Programs (42)") allowing Standard mode users to easily toggle into the rich program browser without leaving the streamlined interface.',
        'Search & Quick-Add Shelf: Added an instant inline search card with real-time results and 1-click popular program chips (P90X, 5x5, Cindy, Arnold, Insanity, Tai Chi, Row 5K) to add structured routines directly to daily movement goals.',
        'Simple Movement Picker Modal Integration: Added a dedicated "🏆 Pre-Made Workouts (42+)" filter pill and merged all pre-made programs into the modal search index with distinct visual badges and calorie/step estimates.',
        'Interactive Routine Sheet Access: Added "View Interactive Workout Sheet & Exercises" action buttons for chosen pre-made workouts in Standard mode, opening full exercise rosters, sets, reps, and printable sheets.',
        'One-Click Add from Library: Enhanced the Pre-Made Programs Browser with "+ Add to Today" quick-action buttons on every program card and schedule item, providing instant green feedback banners and smooth return navigation.',
      ],
    },
    {
      version: 'b4.8.1',
      date: '2026-09-04',
      title: 'Progress Section Meal Slot Indexing Fix & Diary Display Alignment',
      changes: [
        'Progress Section Meal Slot Correction: Fixed an off-by-one indexing bug in the Progress Trends day breakdown where 1-indexed meal records (Meal 1 = Breakfast) were mapped using a 0-based offset, causing Breakfast entries to display as Lunch.',
        'Diary Meal Slot Label Alignment: Enhanced the "Today\'s Meals Eaten" diary list to explicitly display human-readable meal names ("Breakfast (Meal 1)", "Lunch (Meal 2)", "Dinner (Meal 3)") alongside portion amounts.',
      ],
    },
    {
      version: 'b4.8.0',
      date: '2026-09-04',
      title: 'Logged Meal Editing & Custom Meal Builder / Customize Terminology Branding',
      changes: [
        'In-Place Logged Meal Editing: Added edit action buttons to logged meals in "Today\'s Meals Eaten" (Standard mode) and meal cards (Athlete mode), allowing instant corrections or portion adjustments for logged meals.',
        'Custom Meal Builder Synchronization: Editing a logged meal pre-populates the Custom Meal Builder with all ingredients, portions, date, and meal category. Submitting updates the diary entry in place with live recalculated macros.',
        'Terminology & Tag Branding Update: Standardized naming to "Custom Meal Builder" across navigation tabs, dashboard action cards, and builder headers, and updated the badge tag above it to "Customize".',
        'Legacy & Single Food Item Support: Supported seamless editing of both multi-ingredient custom meals and single food log entries with lossless recalculation.',
      ],
    },
    {
      version: 'b4.7.0',
      date: '2026-09-04',
      title: 'Water & Hydration: ±1 oz Precision Custom Stepper & Standard Mode Parity',
      changes: [
        'Advanced Hydration Engine Stepper Precision: Reconfigured the custom amount incrementer step from 4 oz to ±1 oz increments, providing fine-grained logging control.',
        'Standard Mode Hydration Parity: Added the custom amount incrementer and 1-click log button to the Standard mode Water & Hydration dashboard card alongside existing quick-log cups and bottles.',
      ],
    },
    {
      version: 'b4.6.0',
      date: '2026-09-04',
      title: 'App Terminology Standardization: Clean Meal Builder & Nutrition Interface',
      changes: [
        'Meal Builder Title & Header Redesign: Renamed "World-Class Custom Meal Builder" and "EXHAUSTIVE MEAL STUDIO" to clean, industry-standard "Meal Builder" across navigation, tabs, and builder viewports.',
        'Action & Step Clarity: Standardized step titles to "Step 1: Meal Details" and "Step 2: Search & Add Ingredients", and updated clear actions to "Clear All".',
        'Nutrition Breakdown Standard: Renamed "Extensive Nutrition Stats" to clean, familiar "Nutrition Breakdown" with FDA / MyFitnessPal style label.',
        'Approachable Descriptions: Replaced hyperbolic terminology with clear, practical descriptions for custom meal creation, empty states, and database searching.',
      ],
    },
    {
      version: 'b4.5.0',
      date: '2026-09-04',
      title: 'Popular Name-Brand Whey Powders Addition (Optimum Nutrition Gold Standard Extreme Milk Chocolate & Top Athletic Brands)',
      changes: [
        'Optimum Nutrition (ON) Gold Standard 100% Whey: Added Optimum Nutrition Gold Standard Extreme Milk Chocolate (32g scoop, 130 kcal, 24g protein, 4g carbs, 1.5g fat), Double Rich Chocolate, Vanilla Ice Cream, Delicious Strawberry, Cookies & Cream, Mocha Cappuccino, Banana Cream, French Vanilla, and Gold Standard 100% Isolate (Chocolate Bliss & Rich Vanilla).',
        'Dymatize ISO100 & Elite Whey: Added Dymatize ISO100 Hydrolyzed Whey Isolate (Gourmet Chocolate, Gourmet Vanilla, Fruity Pebbles, Cocoa Pebbles, Peanut Butter, Fudge Brownie, Dunkin\' Glazed Donut) and Dymatize Elite 100% Whey (Rich Chocolate & Smooth Vanilla).',
        'Ghost 100% Whey Protein: Added Ghost Cereal Milk, Chips Ahoy!, Oreo, Milk Chocolate, Peanut Butter Cereal Milk, and Nutter Butter.',
        'MuscleTech & BSN: Added MuscleTech Nitro-Tech 100% Whey Gold (Double Rich Chocolate & French Vanilla Cream), 100% Grass-Fed Whey, Nitro-Tech Ripped, and BSN Syntha-6 (Chocolate Milkshake, Vanilla Ice Cream, Strawberry Milkshake, Syntha-6 Edge).',
        'Pure Isolates & Clean Formulas: Added Isopure Zero Carb & Low Carb (Unflavored, Creamy Vanilla, Dutch Chocolate, Strawberries & Cream), Transparent Labs 100% Grass-Fed Whey Isolate, PEScience Select Protein (Snickerdoodle, Gourmet Vanilla, Chocolate Cupcake, Cake Pop), Rule 1 R1 Protein, Ryse Loaded, Ascent Native Fuel, Nutricost, and NOW Sports.',
        'Store-Brand & Club Pack Whey: Added Costco Kirkland Signature Complete 100% Whey, Sam\'s Club Member\'s Mark 100% Whey (Chocolate & Vanilla 5 lb tubs), Walmart Equate 100% Whey (Chocolate & Vanilla), Meijer 100% Whey, and Aldi Elevation by Millville 100% Whey.',
        'Store Database Integration: Added 23 store-brand and name-brand whey protein tubs and bulk bags across Costco, Sam\'s Club, Meijer, Walmart, and Aldi.',
      ],
    },
    {
      version: 'b4.4.0',
      date: '2026-09-04',
      title: 'Store-Brand & Name-Brand Gluten-Free Expansion: Breads, Crackers, and Desserts across Meijer, Walmart, Costco, Sam\'s Club & Aldi',
      changes: [
        'Gluten-Free Bread & Bagels: Added 28 gluten-free breads, rolls, and bagels across store brands (liveGfree Aldi Wide Pan White, Whole Grain & Bagels; Meijer GF White & Whole Grain; True Goodness Multigrain; Great Value Walmart GF White & Whole Grain; Member\'s Mark Sam\'s Club GF White Twin Pack; Kirkland Signature Costco GF Multigrain) and premier name brands (Canyon Bakehouse Country White, Mountain White, Brioche, Everything Bagels, English Muffins, Sub Rolls; Schär Artisan Baker White, Multigrain, Deli Sourdough, Ciabatta Rolls, Plain Bagels; Udi\'s Delicious Soft White, Whole Grain, Hamburger Buns, Plain Bagels; BFree Pita Pockets & Baguettes).',
        'Gluten-Free Crackers & Pretzels: Added 34 gluten-free crackers and pretzel varieties across store brands (liveGfree Sea Salt, Rosemary Multiseed, Cheddar Cheese Bites, Pretzel Twists; True Goodness Meijer Almond Flour Sea Salt & Rosemary, Crispy Rice, Pretzel Twists; Great Value Rice & Multiseed, GF Pretzel Twists, Honey Mustard Pretzel Pieces; Member\'s Mark GF Almond Flour Sea Salt Club Box; Kirkland Signature Organic Rice Crackers) and name brands (Simple Mills Almond Flour Rosemary, Fine Ground Sea Salt, Farmhouse Cheddar, Sun-Dried Tomato Basil; Crunchmaster Multi-Seed Sea Salt, Multi-Grain, Tuscan Peasant, Avocado Toast; Milton\'s Craft Bakers Crispy Sea Salt, Cheddar, Everything; Mary\'s Gone Crackers Everything & Herb; Glutino Original Crackers & Salted Pretzels; Lance GF Peanut Butter & Cheddar Sandwiches; Hu Kitchen Grain-Free Sea Salt).',
        'Gluten-Free Desserts, Cookies & Baking Mixes: Added 42 gluten-free cookies, sweet snacks, and baking mixes across store brands (liveGfree Chocolate Chip, Double Chocolate Soft Baked, Snickerdoodle, Deluxe Fudge Brownie Mix, Yellow Cake Mix; True Goodness Meijer GF Chocolate Chip Cookies, Cookie Mix, Brownie Mix; Great Value GF Chocolate Chip, Vanilla Creme Sandwiches, Brownie Mix, Chocolate Cake Mix; Member\'s Mark GF Brownie Mix 3-pack) and top national brands (Tate\'s Bake Shop GF Chocolate Chip, Ginger Zinger, Lemon, Double Chocolate; Oreo Gluten Free Chocolate, Double Stuf, Mint, Golden; Sweet Loren\'s Place & Bake Chocolate Chunk, Fudgy Brownie, Sugar Cookie Dough; Simple Mills Sweet Thins Honey Cinnamon & Brownie, Crunchy Choc Chip; King Arthur GF Ultimate Fudge Brownie, Chocolate Cake, Classic Yellow Cake, Chocolate Chip Cookie Mixes; Goodie Girl Mint Slims, Fudge Striped, Birthday Cake; Schär Hazelnut Wafers & Choc O\'s; Partake Foods Chocolate Chip & Birthday Cake; Heavenly Hunks Oatmeal Dark Chocolate Chunks; Universal Bakery Aussie Bites).',
        'Store Products Database Synchronization: Enhanced store-specific product databases with 63 dedicated gluten-free grocery items spanning Meijer, Walmart, Costco, Sam\'s Club, and Aldi with package sizing, store tag primaries, and smart substitution mappings.',
        '100% Gluten-Free Tagging & Allergen Auditing: Every added item verified with is_gluten_free: true and is_dairy_free where appropriate, fully searchable within the Custom Meal Builder studio.',
      ],
    },
    {
      version: 'b4.3.0',
      date: '2026-09-04',
      title: 'Store-Brand Product Expansion Across All Major Stores (Meijer, Walmart, Costco, Sam\'s Club & Aldi) + Meijer Sugar-Free Oatmeal',
      changes: [
        'Meijer Sugar-Free Oatmeal: Added Meijer Sugar Free Instant Oatmeal (Maple & Brown Sugar, 10-pack, 120 kcal, 0g sugar) with full micronutrient breakdown.',
        'Store-Brand Instant Oatmeals: Added complete store-brand instant oatmeal varieties across Walmart (Great Value Original, Maple & Brown Sugar, Apples & Cinnamon), Sam\'s Club (Member\'s Mark Maple & Brown Sugar), and Costco (Kirkland Signature Organic Whole Grain Oats).',
        'Store-Brand Peanut Butters: Added store-brand peanut butters for Meijer (Creamy, Crunchy, True Goodness Organic), Walmart (Great Value Creamy & Crunchy), Aldi (Peanut Delight Creamy & Crunchy), Sam\'s Club (Member\'s Mark Creamy 6 lb twin pack), and Costco (Kirkland Signature Organic Creamy).',
        'Store-Brand Breads: Added store-brand breads for Meijer (100% Whole Wheat & Classic White), Walmart (Great Value Whole Wheat & White), Aldi (L\'oven Fresh Whole Wheat, White & English Muffins), Sam\'s Club (Member\'s Mark Whole Wheat twin pack), and Costco (Kirkland Signature Whole Wheat & Country French Sourdough).',
        'Store-Brand Butters in Sticks & Tubs for ALL Stores: Added full stick and spreadable tub varieties across Meijer (Salted Sticks, Unsalted Sticks, Canola Oil Tub, Vegetable Oil Spread Tub), Walmart (Great Value Salted Sticks, Unsalted Sticks, Canola Oil Tub, Oil Spread Tub), Sam\'s Club (Member\'s Mark Salted Sticks, Unsalted Sticks, Canola Oil Tub), and Costco (Kirkland Signature Salted Sticks, Unsalted Sticks, New Zealand Grass-Fed Foil Sticks), complementing Aldi Countryside Creamery.',
        'Store-Brand Jellies, Jams & Preserves: Added store-brand fruit spreads across Meijer (Concord Grape, Strawberry Jam, Sugar-Free Strawberry), Walmart (Great Value Grape Jelly, Strawberry Preserves, Sugar-Free Strawberry), Aldi (Specially Selected Strawberry & Grandessa Grape), Sam\'s Club (Member\'s Mark Organic Strawberry Spread), and Costco (Kirkland Signature Organic Strawberry Spread).',
        'Store-Brand Sugar-Free Syrups: Added store-brand sugar-free pancake syrups across Meijer, Walmart (Great Value), Aldi (Aunt Maple\'s), and Sam\'s Club (Member\'s Mark).',
        'Store-Brand Grocery Catalog Synchronization: Fully populated Meijer, Walmart, Costco, Sam\'s Club, and Aldi store catalogs in store-products-database with department tags, package sizes, serving sizes, and smart substitute recommendations.',
      ],
    },
    {
      version: 'b4.2.0',
      date: '2026-09-04',
      title: 'Major Name-Brand Food Catalog Expansion: Oatmeals, Peanut Butters, Jellies & Jams, Breads, Butters (Sticks & Tubs), & Sugar-Free Syrups',
      changes: [
        'Name-Brand Instant Oatmeals: Added Quaker Instant Oatmeal (Original, Maple & Brown Sugar, Apples & Cinnamon, Lower Sugar, Strawberries & Cream), Kodiak Cakes Protein Oatmeal (Maple Brown Sugar, Chocolate Chip), Better Oats 100 Calorie, and Millville (Aldi) Instant Oatmeal.',
        'Name-Brand Peanut Butters: Added Jif (Creamy, Extra Crunchy, Natural 90%), Skippy (Creamy, Super Chunk, Natural), Peter Pan Creamy, Smucker’s Natural Creamy, Justin’s Classic, and PBfit All-Natural Powdered Peanut Butter (87% less fat).',
        'Name-Brand Jellies, Jams & Preserves: Added Smucker’s (Concord Grape Jelly, Strawberry Jam, Natural Fruit Spread, Sugar-Free Strawberry & Concord Grape), Bonne Maman Preserves (Strawberry, Four Fruits, Wild Blueberry), Welch’s Concord Grape Jelly, and Polaner All Fruit Strawberry Spread.',
        'Name-Brand Breads: Added Dave’s Killer Bread (21 Whole Grains, Powerseed, Thin-Sliced 21), Nature’s Own (100% Whole Wheat, Honey Wheat, Butterbread), Sara Lee (Artesano Bakery, Delightful 45-Calorie Whole Wheat), Wonder Bread Classic White, Pepperidge Farm (Farmhouse Hearty White, Whole Grain 100% Wheat), and Thomas’ English Muffins (Original & Light Multi-Grain).',
        'Name-Brand & Aldi Brand Butters (Sticks & Tubs for All): Added Land O’Lakes (Salted Sticks, Unsalted Sticks, Canola Oil Tub, Light Tub), Kerrygold Pure Irish (Salted Sticks, Unsalted Sticks, Naturally Softer Tub), Country Crock (Original Spread Tub, Plant Butter Sticks & Tub), I Can’t Believe It’s Not Butter! (Original Tub & Sticks, Light Tub), Challenge Dairy (Salted Sticks, Unsalted Sticks, Olive Oil Tub), and Aldi Countryside Creamery (Salted Sticks, Unsalted Sticks, Canola Oil Tub, Homestyle Spread Tub, Pure Irish Sticks & Tub, Plant Based Sticks & Tub).',
        'Name-Brand Sugar-Free Syrups: Added Mrs. Butterworth’s Sugar Free Thick & Rich, Log Cabin Sugar Free, Cary’s Sugar Free Low Calorie, Walden Farms Calorie Free, ChocZero Sugar Free Maple (Monk Fruit & Prebiotic Fiber), Lakanto Sugar Free Maple (Monk Fruit), Smucker’s Sugar Free Breakfast Syrup, Hungry Jack Sugar Free Butter Flavor, Torani Sugar Free Vanilla, and Jordan’s Skinny Syrups Sugar Free Salted Caramel.',
        'Store-Brand Requisition Catalog: Aligned all new Aldi Countryside Creamery and Millville products into Aldi store-brand smart grocery lists.',
      ],
    },
    {
      version: 'b4.1.0',
      date: '2026-09-04',
      title: 'Added Meijer Instant Oatmeal Catalog Expansion & Enhanced Brand Search Matching',
      changes: [
        'Added Meijer Instant Oatmeal Varieties: Integrated official Meijer Instant Oatmeal items (Original / Plain 12-pack, Maple & Brown Sugar 10-pack, Apples & Cinnamon 10-pack, Strawberries & Cream 10-pack) with full micronutrient profiles (iron, calcium, sodium, potassium, vitamin A, fiber, healthy fats, sugars).',
        'Meijer Store Brand Product Alignment: Added Meijer Instant Oatmeal products to the Meijer store-brand grocery catalog with bulk canister and box conversion substitutes.',
        'Brand-Aware Search Matching: Upgraded local and server-side food search indexes to match brand metadata alongside food titles, enabling fast lookups for store and commercial brands.',
      ],
    },
    {
      version: 'b4.0.0',
      date: '2026-09-04',
      title: 'Meal Builder, 3.5M+ Food Database & Daily Plan Integration',
      changes: [
        'Meal Builder: Interactive studio allowing users to build custom meals and recipes by adding ingredients from our food database with instant live recalculations.',
        'Comprehensive Food Database (Local + Global): Integrated 1,012 verified whole foods and grocery staples with real-time access to 3,500,000+ commercial, branded, and grocery products via Open Food Facts v2 API.',
        'Detailed Nutrition Breakdown: Complete calculation of Calories, Protein, Carbohydrates, Fats, Net Impact Carbs, Saturated Fat, Monounsaturated Fat, Polyunsaturated Fat, Trans Fat, Cholesterol, Dietary Fiber, Sugars, Added Sugars, Sodium, Potassium, Calcium, Iron, Magnesium, Zinc, and Vitamins A, C, and D.',
        'Batch Yield Scaler & Serving Switcher: Toggle seamlessly between "Per 1 Serving" and "Entire Meal Batch" with dynamic yield scaling (1x to 12x).',
        'Direct 1-Click Daily Plan Integration: Log custom built meals directly into Breakfast, Lunch, Dinner, or Snacks on Today or any selected historical date, with single consolidated entry or itemized ingredient breakdown.',
        'Saved Meals Library: Save favorite custom meals to a reusable library with 1-click quick-logging, editing in builder, and cross-device sync.',
        '100% Inline Architecture: Fully inline design without modal dialogs or popup overlays, strictly following zero-modal architectural rules.',
      ],
    },
    {
      version: 'b3.3.0',
      date: '2026-09-04',
      title: 'User-Friendly Redesign & Cross-Referenced Historical Reports Hub',
      changes: [
        'Added Cross-Referenced Reports Hub: 100% inline Daily, Weekly, Monthly, and Yearly reports cross-referencing nutrition, workout tonnage, walking steps, hydration, and weight trends in one connected view.',
        'MyFitnessPal-Style Date Navigation: Full calendar & stepper navigation in the Food Diary, allowing users to log, review, and edit meals for past or future dates.',
        '1-Click "Copy Yesterday\'s Meals": Instantly duplicate previous day meals with a single tap for creatures of habit and meal preppers.',
        'Quick Add Calorie & Restaurant Entry: Fast logging of restaurant meals (e.g. Chipotle, diners, deli) with automatic calorie and macro estimation.',
        'Step-by-Step Daily Walkthrough on Dashboard: Clean 4-step morning-to-night guide (Morning Check-In, Food Diary, Daily Movement, Review & Reports) with live interactive status indicators.',
        'Humanized Tutorial Master Hub: Enriched lessons with practical, real-world examples for dining out, meal prep, office step routines, and scale water weight fluctuation psychology.',
        'Softened Terminology: Replaced dense technical jargon across navigation, headers, and dashboard with clear, approachable everyday language.',
      ],
    },
    {
      version: 'b3.2.2',
      date: '2026-08-27',
      title: 'Z-Index Foreground Stacking Elevation',
      changes: [
        'Elevated CalendarDatePicker stacking context to max foreground (z-[9999] popover and z-[999] container), ensuring the calendar dropdown renders completely above all downstream dashboard cards and active plan sections.',
      ],
    },
    {
      version: 'b3.2.1',
      date: '2026-08-27',
      title: 'Enhanced Calendar Dropdown Opacity & Contrast',
      changes: [
        'Upgraded CalendarDatePicker popover to 100% solid opaque obsidian (zinc-950) with elevated drop-shadows, preventing background text bleed-through.',
      ],
    },
    {
      version: 'b3.2.0',
      date: '2026-08-27',
      title: 'Interactive Calendar DatePicker Dropdown Engine',
      changes: [
        'Built dedicated dark-themed CalendarDatePicker popover component with month/year navigation, weekday matrices, and 1-click quick-pick chips (Today, Tomorrow, Next Monday, +7 Days, +14 Days).',
        'Integrated CalendarDatePicker into the 90-Day Master Schedule deployment wizard start date selector and toolbar fast jumper.',
        'Integrated CalendarDatePicker into printable Workout Session sheets for rapid date logging.',
      ],
    },
    {
      version: 'b3.1.3',
      date: '2026-08-27',
      title: 'App Navigation Tab Type Alignment',
      changes: [
        'Unified activeTab state and setter across HealthContext with centralized AppNavigationTab type definition.',
      ],
    },
    {
      version: 'b3.1.2',
      date: '2026-08-27',
      title: 'Grocery Department & Requisition Type Strictness',
      changes: [
        'Aligned GroceryItem interface types with standard catalog departments and item_name properties in schedule-to-grocery requisition generator.',
      ],
    },
    {
      version: 'b3.1.1',
      date: '2026-08-27',
      title: 'Type Safety & Build Optimization',
      changes: [
        'Resolved TypeScript strict type definitions for UserProfile carbohydrate targets in RollingSchedulePlanner.',
        'Verified clean compiler build and automated continuous deployment.',
      ],
    },
    {
      version: 'b3.1.0',
      date: '2026-08-27',
      title: 'Rolling 90-Day Master Schedule & Holistic Wellness Planner',
      changes: [
        'Added Rolling 90-Day Master Schedule: Continuous forward planning engine staging workouts, daily target macros, planned meals, 16:8 fasting windows, and step targets up to 90 days out.',
        '100% Day-by-Day Customization: Complete modular freedom to edit or override any individual calendar day (swap exercises, change meals, tweak fasting, or add day notes) without breaking the rest of the schedule.',
        'Master Template Deployment Studio: 1-click deployment of StrongLifts 5x5 + Concept2 Hybrid, Hypertrophy PPL, or Daily Wellness routines across 4, 8, or 12 weeks with custom start date picker.',
        'Multi-View Calendar & Agenda: Switch dynamically between Rolling 90-Day Timeline, Monthly Calendar Grid, and Weekly Detailed Agenda.',
        'Forward Grocery Requisition Sync: 1-click aggregation pulling all planned meals from upcoming scheduled days directly into your Aisle-by-Aisle shopping list.',
      ],
    },
    {
      version: 'b3.0.0',
      date: '2026-08-27',
      title: '3-Mode Architecture: Standard, Advanced & Interactive Hand-Held Tutorial',
      changes: [
        'Added Interactive Tutorial Mode: Complete hand-held step-by-step guided walkthrough with interactive sandboxes, live test buttons, and mastery progression.',
        'Two-Track Guided Mastery: Complete Standard Mode walkthrough (food logging, 16:8 fasting, step tracking, grocery aisles) followed seamlessly by Advanced Mode walkthrough (macro engineering, Olympic barbell math, periodized workout sheets, cloud sync).',
        'Refactored Mode Hierarchy: Cleanly transitioned Athlete Mode to Advanced Mode and Simple Mode to Standard Mode across all navigation, headers, and biometrics.',
        'Unified 3-Mode Quick Switcher: Seamlessly cycle between Standard, Advanced, and Tutorial modes with 1-click header pill controls.',
        'Zero-Modal Inline Architecture: Designed all tutorial lessons, step checklists, and sandbox controls directly in the main viewport stream.',
      ],
    },
    {
      version: 'b2.37.0',
      date: '2026-08-27',
      title: 'Expanded Concept2® Rowing & Hybrid Endurance Suite',
      changes: [
        'Added Concept2® 2,000m Erg Test & Sub-7 Peaking Protocol: 8-week periodized master plan targeting anaerobic threshold, VO2 max lactate tolerance, and 2K time trial pacing.',
        'Added Concept2® Daily WOD & Calorie Crusher Suite: 6-week program featuring Tabata 20/10 calorie sprints, 5k step-rate ladders, 4x2000m aerobic threshold intervals, and 30-min open yardage challenges.',
        'Added Concept2® Row & Kettlebell / Calisthenics Hybrid Metcon: 8-week hybrid conditioning pairing 500m/750m/1000m erg splits with kettlebell swings, strict pull-ups, push-ups, and heavy carries.',
        'Added Concept2® 10,000m to Half-Marathon (21,097m) Endurance Builder: 12-week ultra-aerobic engine builder with low-rate high-wattage (16-20 SPM) pacing and negative split mastery.',
        'Expanded Pete Plan Schedule: Fully integrated all 5 classic Pete Plan days (8x500m sprints, 8k-10k steady state, speed pyramids, 4x2000m, and 10k time trial).',
      ],
    },
    {
      version: 'b2.36.1',
      date: '2026-08-27',
      title: 'Resilient Multi-Device Step Stream & Auth Metadata Engine',
      changes: [
        'Live Server Auth Metadata Sync: Sync engine fetches live user metadata via direct server queries, eliminating stale cached token delays and propagating iPhone steps to desktop immediately.',
        'Zero-Migration Triple-Layer Fallback: Step records synchronize across Supabase Auth user_metadata, profiles JSONB store, and relational step_logs table.',
        'Mount Lifecycle Ingestion Guard: Added localStorage fallback to performCloudSync on mount so existing mobile steps push to the cloud even before local render completes.',
        'Interactive Step Sync Feedback: Connected step tracker refresh buttons to authenticated cloud sync with live progress and status notifications.',
      ],
    },
    {
      version: 'b2.36.0',
      date: '2026-08-27',
      title: 'Automated Multi-Device Step & Movement Cloud Synchronization',
      changes: [
        'Added Bidirectional Step Cloud Sync: Step logs recorded on iPhone (via Apple Health shortcut, phone sensor, or manual entry) now automatically synchronize in real-time across laptop and desktop sessions.',
        'Added Cloud step_logs Table & Security Policies: PostgreSQL step ledger with daily timestamps, distance (mi/km), active calorie burn, and hardware source attribution.',
        'Non-Destructive Step Merging Engine: Multi-device sync reconciles local and cloud step entries by date, automatically prioritizing the highest recorded daily total and newest timestamp.',
        'Interactive Cross-Device Refresh: "Sync Now" in the Step Tracker triggers instant bidirectional cloud reconciliation across all authenticated devices.',
      ],
    },
    {
      version: 'b2.35.0',
      date: '2026-08-26',
      title: 'Expanded Mind-Body, Qigong, Yoga & Mobility Library',
      changes: [
        'Added Yi Jin Jing (Muscle-Tendon Changing Classic): 1,500-year-old Shaolin internal tendon-strengthening sequence with 12 complete classic forms.',
        'Added Wu Qin Xi (Five Animal Frolics Qigong): Hua Tuo\'s 1,800-year-old animal longevity system (Tiger, Deer, Bear, Monkey, Crane) for 5-organ vitality.',
        'Added Full-Body Joint Mobility & Decompression (CARs & FRC): Controlled Articular Rotations for neck, thoracic spine, hips, shoulders, and ankles.',
        'Added Hatha Vinyasa Yoga & Active Recovery: Sun Salutations, Warrior flows, deep hip openers (Lizard/Pigeon), and parasympathetic down-regulation.',
      ],
    },
    {
      version: 'b2.34.0',
      date: '2026-08-26',
      title: 'Expanded Hypertrophy, PPL & Bodybuilding Master Suite',
      changes: [
        'Added German Volume Training (GVT 10x10 Method): Charles Poliquin\'s rapid hypertrophy 10-set compound protocol with exact 4-0-2-0 tempos and antagonistic super-sets.',
        'Added Dorian Yates "Blood & Guts" (HIT System): 6x Mr. Olympia beyond-failure training with warm-ups, 1 single all-out work set, rest-pause, and forced reps.',
        'Added Arnold Schwarzenegger Classic Double-Split: Venice Gold\'s Gym 6-day chest/back and bicep/tricep antagonistic high-volume blueprint.',
        'Added Upper / Lower 4-Day Hypertrophy Split: Scientific 2x/week frequency periodization balancing horizontal/vertical planes and quad/posterior chain loads.',
      ],
    },
    {
      version: 'b2.33.0',
      date: '2026-08-26',
      title: 'Added Insanity & Beachbody Classic Master Worksheet Library',
      changes: [
        'Added Insanity® Max:30 (Max Out Sheet System): Shaun T\'s 30-minute high-intensity Tabata system with exact min:sec Max Out logging sheets.',
        'Added Insanity®: The Asylum (Athletic Matrix): Pro-athlete speed, agility ladder, vertical plyo, and dumbbell strength progression worksheets.',
        'Added Body Beast® (Dynamic Set Training Master Split): Hardcore bodybuilding splits (Single, Super, Giant, and Progressive sets) with weight/rep worksheets.',
        'Added LIIFT4® (Lift & HIIT 4-Day Periodization): 4-day hybrid lifting and metabolic intervals with full interactive tracking sheets.',
        'Added 21 Day Fix® Extreme (Worksheet Edition): Autumn Calabrese\'s 21-day rapid-fire resistance and sculpting splits.',
        'Added The Master\'s Hammer and Chisel®: Sagi Kalev & Autumn Calabrese\'s dual-coach powerlifting and unilateral sculpting program.',
      ],
    },
    {
      version: 'b2.32.0',
      date: '2026-08-26',
      title: 'Expanded Tony Horton & P90X Collection',
      changes: [
        'Added P90® (The Classic On-Ramp System): Tony Horton\'s foundational 3-stage progressive system (Sculpt A/B/C, Sweat A/B/C, and Ab Ripper A/B/C) with full interactive routines.',
        'Added P90X® Plus (The Advanced Extension Series): 5 hyper-condensed plateau-shattering workouts (Upper Plus, Interval X Plus, Total Body Plus, Kenpo Plus, Abs/Core Plus).',
        'Added P90X® ONE on ONE with Tony Horton: Unfiltered Santa Monica master sessions including Chest, Back & Balls, Diamond Delts, Plyo Legs, V-Sculpt, and 100/30/20.',
      ],
    },
    {
      version: 'b2.31.0',
      date: '2026-08-26',
      title: 'Expanded CrossFit Benchmark & Championship Suite',
      changes: [
        'Added CrossFit "The New Girls" Benchmarks: Gwen (15-12-9 touch-and-go clean & jerks), Amanda (muscle-ups + 135# snatches), Lynne (bodyweight bench + pull-ups), Nicole (400m + pull-ups), Megan, and Hope.',
        'Added CrossFit Heavy Barbell & Strength WODs: The CrossFit Total (1RM Squat, Press, Deadlift), Linda (Three Bars of Death), The Bear Complex (5 rounds of 7 unbroken cycles), and King Kong (455# deadlifts, muscle-ups, 250# squat cleans).',
        'Added CrossFit Semifinals & Championship Test Suite: The Ranch Mini-Chipper (pistols, row, 50# DB push presses), 2023 Semifinals Test 3 (Echo Bike, muscle-ups, 70# DB snatches), and 2021 Semifinal Grendel (225# power cleans, HSPU, burpees).',
      ],
    },
    {
      version: 'b2.30.0',
      date: '2026-08-26',
      title: 'Expanded Pre-Made Strength & Barbell Program Library',
      changes: [
        'Added The Texas Method (5x5 Volume / Light Recovery / 1x5 Intensity): The premier intermediate wave periodization barbell program with complete daily schedules and printable tracking sheets.',
        'Added Madcow 5x5 (Bill Starr Method): Intermediate linear ramping sets with weekly triple PR periodization for steady, burnout-free barbell progression.',
        'Added P.H.U.L. (Power Hypertrophy Upper Lower): 4-day hybrid split combining heavy 3-5 rep powerlifting compound strength with 8-12 rep muscle hypertrophy.',
      ],
    },
    {
      version: 'b2.29.0',
      date: '2026-08-26',
      title: 'Legacy Step Artifact Purge & Max Daily Value Evaluation',
      changes: [
        'Corrupted 8-Step Auto-Purge: Added an automated cleansing layer on boot and sync that permanently clears any legacy 8-step artifact from local storage.',
        'Max Daily Value Aggregation: Upgraded todaySteps metric resolution to compute the maximum validated daily total, preventing stale lower counts from masking updated Apple Watch numbers.',
      ],
    },
    {
      version: 'b2.28.0',
      date: '2026-08-26',
      title: 'Precision Parameter Hygiene & Zero-False Fallback Extraction',
      changes: [
        'Precision Parameter Hygiene: Eliminated loose regex matching fallbacks that previously captured internal configuration values (like 8-hour eating windows) when URLs arrived with empty parameters.',
        'Strict Numerical Query Validation: Ensured step synchronizations strictly ingest positive step integers directly following ?sync_steps= or ?steps=, preventing accidental default number injections.',
      ],
    },
    {
      version: 'b2.27.0',
      date: '2026-08-26',
      title: 'Timezone-Aligned Step Logging & Initial State Mounting Race Fix',
      changes: [
        'Timezone Alignment: Resolved UTC vs Local date boundary discrepancy (getLocalDateString) so that evening step synchronizations (e.g. 10 PM) properly match and display in the current day view.',
        'Initial State Race Fix: Unified URL step parsing directly within the primary local storage state loader, guaranteeing that step totals from Apple Shortcuts are never overwritten by cached empty state upon page load.',
        'Multi-Date Fallback Matching: Enabled dual-date verification (Local & UTC timestamps) in todaySteps calculation for foolproof movement metric aggregation.',
      ],
    },
    {
      version: 'b2.26.0',
      date: '2026-08-26',
      title: 'Resilient Multi-Variant Step Query Parsing & Digit Extraction',
      changes: [
        'Resilient Digit Extraction: Upgraded URL step parsing with a multi-variant regular expression extractor, capturing step counts regardless of formatting, spacing, commas, or labels attached by Apple Shortcuts.',
        'Immediate Memory Sync: Ensured incoming step counts from iOS Shortcuts immediately update reactive dashboard metrics and persist reliably to local storage and user history.',
      ],
    },
    {
      version: 'b2.25.0',
      date: '2026-08-26',
      title: 'Universal 404 Prevention Rewrite & Flexible URL Step Parsing',
      changes: [
        'Universal 404 Prevention: Configured Next.js fallback rewrites in next.config.mjs so that any iOS shortcut URL variations or deep paths seamlessly route to the main application without triggering 404 errors.',
        'Multi-Format Step Ingestion: Upgraded the step synchronization engine to parse step totals from query parameters (?sync_steps=, ?steps=), hash fragments (#sync_steps=), or path segments (/8432).',
        'Automatic URL Hygiene: Seamlessly sanitizes the browser address bar to clean root (/) immediately after ingesting incoming step counts without triggering full page reloads.',
      ],
    },
    {
      version: 'b2.24.0',
      date: '2026-08-26',
      title: 'Streamlined Apple Watch & Health Sync Hub with 1-Tap Copy Setup',
      changes: [
        'Streamlined 3-Step Shortcut Guide: Redesigned the Apple Watch & Health Auto-Sync modal with a 1-minute 3-step setup guide with 1-tap copy buttons for seamless shortcut configuration.',
        'Zero-Friction Step Streaming: Enabled direct URL parameter and background sync handling (?sync_steps=) so Apple Watch movement totals effortlessly stream into the dashboard on app open.',
        'Clean Modal Aesthetics: Upgraded step tracker status cues and manual entry inputs for an intuitive, hassle-free user experience.',
      ],
    },
    {
      version: 'b2.23.0',
      date: '2026-08-26',
      title: 'Real-Time Cross-Device Profile Synchronization & Lifecycle Focus Listeners',
      changes: [
        'Real-Time Cross-Device Sync: Added automatic lifecycle listeners (visibilitychange, pageshow, focus, and 30s background poller) so when profile biometrics are saved on a laptop, they immediately populate on iPhone and iPad upon unlocking or switching back to the app.',
        'Schema Payload Compatibility: Sanitized Supabase upsert payloads to use standard PostgreSQL profiles schema columns, preventing REST API validation rejections and guaranteeing profile updates persist reliably.',
        'Seamless Biometric Propagation: Re-engineered cloud reconciliation so any non-zero metric values saved on one device are instantly adopted by other devices logged into the same account without requiring manual page refreshes.',
      ],
    },
    {
      version: 'b2.22.0',
      date: '2026-08-26',
      title: 'Complete Zero-Default Biometric Enforcement & Input Placeholder Cleansing',
      changes: [
        'Purged All Unconfigured Default Biometrics: Completely eliminated system default height, starting weight, and target weight from local storage and Supabase database records. Biometric inputs now strictly remain 0 and unconfigured until explicitly entered and saved by the user.',
        'Cleaned Input Placeholders: Removed all example numbers (e.g., "5 ft", "10 in", "178 cm", "175.0 lbs", "165.0 lbs") from all profile and onboarding number steppers, replacing them with clean "0" and "0.0" cues.',
        'Database Row Cleansing on Sync: When connecting to Supabase, any legacy database rows containing old unconfigured SQL default metrics (178cm/80kg/75kg) are automatically cleansed to 0, ensuring no pre-filled fake data is ever injected into user accounts.',
        'NumberStepper Clamping Guard: Updated NumberStepper increment/decrement controls to properly respect allowEmptyZero without auto-clamping 0 to non-zero minimum bounds.',
      ],
    },
    {
      version: 'b2.21.0',
      date: '2026-08-26',
      title: 'Hardened Multi-Device Profile Sync & Non-Destructive Reconciliation Engine',
      changes: [
        'Resolved Multi-Device Profile Overwrite: Re-engineered cloud profile synchronization with non-destructive biometric guards (pushLocalProfileToCloud via UPSERT). Fresh or uninitialized devices (iPhone) with empty baseline defaults (0) are strictly blocked from overwriting cloud profiles containing configured biometrics.',
        'Bidirectional Biometric Reconciliation: When signing in on a new device, the app now automatically checks for configured biometrics on both local and cloud records. If the local device has custom metrics and the cloud was empty, local metrics are pushed to the cloud; if the cloud has metrics and the local device was fresh, the cloud metrics are seamlessly adopted.',
        'Synchronous Macro Calculation on Save: Profile settings and macro recalculations now calculate calorie and macronutrient targets synchronously and immediately upsert the complete updated profile to Supabase with error handling and retry guards.',
        'Purged False-Positive Metric Reset: Completely eliminated legacy 178cm/80kg/75kg placeholder reset logic that previously caused false-positive zeroing on realistic user inputs.',
      ],
    },
    {
      version: 'b2.20.1',
      date: '2026-08-26',
      title: 'Automated Apple Health & Watch Background Step Sync Engine & 60s Poller',
      changes: [
        'Automated Apple Health & Watch Sync: Replaced the battery-draining live accelerometer sensor with a seamless background sync engine that automatically pulls deduplicated Apple Watch and iPhone movement steps on app launch, phone unlock, and tab refocus.',
        'Zero Battery & Zero CPU Overhead: Eliminated in-browser continuous motion calculations (DeviceMotionEvent), relying on iOS hardware-level M-series motion aggregation for 100% accurate step metrics with 0% idle battery drain.',
        'Automated Sync API & URL Handlers: Integrated Next.js /api/sync/steps endpoint with smart query param handlers (?sync_steps=) and 1-minute iOS Shortcut automation guidance.',
        'Streamlined Step Tracker Dashboard: Upgraded StepTracker UI with live sync timestamps, quick-refresh action, and instant increment logging chips (+1,000, +2,500, +5,000).',
      ],
    },
    {
      version: 'b2.19.0',
      date: '2026-08-25',
      title: 'Unified 1-Button Mode Toggle & Compact Version Badge Branding',
      changes: [
        'Unified 1-Button Experience Toggle: Replaced the dual-segment switch with a single compact, reactive mode toggle button (✨ Simple ↔ 🔥 Athlete), cutting 55px of horizontal header width and maximizing space on mobile screens.',
        'Compact "b2.19.0" Version Formatting: Adopted the streamlined "b2.19.0" badge format across the mobile header, home dashboard banner, sidebar, and document footer for a sleeker footprint.',
        'Zero Horizontal Header Drift: Combined compact mode switching and bounded touch targets to ensure a perfectly centered, rock-solid header on iPhone and mobile viewports.',
      ],
    },
    {
      version: 'Beta 2.18.0',
      date: '2026-08-25',
      title: 'iPhone Header Width Optimization & Universal Mobile Version Display',
      changes: [
        'Resolved iPhone Horizontal Slop: Re-architected mobile header action cluster with responsive touch targets (32x32px square icon buttons for Log Food and Shopping List), guaranteeing zero horizontal boundary overflow and eliminating side-to-side elasticity on narrow iPhone screens (iPhone SE, 12/13/14/15/16).',
        'Universal Mobile Version Info: Prominently integrated the system version badge ("Beta 2.18.0") directly into the persistent mobile header brand bar, home dashboard welcome banner, and mobile document stream footer so you can immediately see the active version on iPhone without searching.',
        'Strict Viewport Overflow Guards: Added overflow-x-hidden constraints and bounded mobile bottom navigation badge coordinates, ensuring full-screen layout stability across iOS Safari.',
      ],
    },
    {
      version: 'Beta 2.17.0',
      date: '2026-08-25',
      title: 'Realistic Master Food Database Overhaul & Multi-Category Expansion',
      changes: [
        'Eliminated Synthetic Multipliers & Artificial Suffixes: Purged all 22 artificial cooking variations and duplicate permutations (e.g. "(Air-Fried Crisp)", "(Meal-Prep Steamed)") across the entire food catalog.',
        '1,000+ Distinct Authentic Whole Foods: Expanded master food catalog across 10 complete nutritional domains to 1,012 genuine grocery staples, fresh cuts, wild seafood species, heirloom grains, artisan breads, real produce, and pantry essentials with 0 synthetic duplicates.',
        'Clean Canonical State Hydration: Upgraded HealthContext local storage loader to automatically synchronize canonical authentic food items while flawlessly preserving custom user foods.',
        'Realistic Multi-Variety Search: Searching common foods (e.g. Strawberries, Bananas, Apples, Eggs, Salmon, Oats) now returns concise, authentic grocery varieties (fresh, frozen, freeze-dried, organic) with zero redundant permutations.',
      ],
    },
    {
      version: 'Beta 2.16.0',
      date: '2026-08-25',
      title: 'High-Contrast Search Readability & Instant Debounced Filtering Engine',
      changes: [
        'High-Contrast Text Readability: Upgraded global search boxes in Food Database, Exercise Browser, Equipment Inventory, and Recipe Engine with high-contrast, crisp white text, luminous borders, and bright neon blue carets.',
        '0ms Keystroke Responsiveness: Engineered decoupled input state with 120ms debounced background filtering, eliminating all keystroke latency and typing freezes.',
        'Paginated DOM Rendering: Integrated 36-item incremental grid slicing with "Load More" controls, preventing the browser from mounting hundreds of cards on every keystroke.',
        'Instant Search Indicators & Reset Controls: Added animated searching indicators and 1-tap quick clear controls.',
      ],
    },
    {
      version: 'Beta 2.15.0',
      date: '2026-08-25',
      title: 'Instant Meal Log Undo Engine & 1-Tap Nutrition Jump',
      changes: [
        '1-Tap Toast Undo Action: Added an immediate "[ ↩️ Undo Log ]" button inside recipe action toasts that allows users to instantly remove accidentally logged meals without leaving the recipe view.',
        'Direct Nutrition Navigation: Added a 1-tap "[ View in Nutrition ➔ ]" shortcut inside the feedback banner to jump directly to daily meal logs.',
        'Nutrition Tab Meal Log Management: Logged meals remain fully manageable and removable at any time with individual delete icons in Simple Mode ("Today’s Meals") and Athlete Mode ("Meal 1 / Meal 2 / Meal 3" cards).',
      ],
    },
    {
      version: 'Beta 2.14.0',
      date: '2026-08-25',
      title: 'Recipe Card Grid Footer Size Optimization & Contained Multi-Row Layout',
      changes: [
        'Size-Optimized Card Footer: Completely re-architected recipe card action footers into a sleek 2-row layout, completely eliminating horizontal button overflow and grid card collision on all screen viewports.',
        'Contained Action Flow: Placed "View Recipe ➔", compact "Print", and "+ List" actions on the upper tool row, giving "Cooked This Meal!" and Athlete Meal Slot selectors dedicated full-width space.',
        'Strict Grid Boundary Isolation: Added overflow-hidden constraints to recipe card parent containers to prevent visual overlap across columns.',
      ],
    },
    {
      version: 'Beta 2.13.0',
      date: '2026-08-25',
      title: 'Expansion to 75 Authentic Chef-Crafted Wholesome Recipes',
      changes: [
        '50 Brand-New Authentic Recipes: Expanded master recipe database to 75 total gourmet, macro-balanced recipes across all 19 culinary subcategories.',
        'Zero-Template Uniqueness: Every single recipe features realistic cooking steps, authentic ingredient measurements (cups, tbsp, oz, grams), matching macro calories, and true chef pro tips.',
        'Comprehensive Subcategory Coverage: Expanded Morning Primers & Breakfasts (20), Midday Power & Lunches (15), Dinner Protocols (14), Bulk Meal Preps (13), and High-Protein Snacks & Treats (13).',
        'Deep Swap Engine Integration: All 75 recipes fully integrate with the dynamic culinary ingredient swapper, store grocery router (Aldi, Meijer, Sam’s Club, Costco, Walmart), and 4x6 / Letter print studio.',
      ],
    },
    {
      version: 'Beta 2.12.0',
      date: '2026-08-25',
      title: 'Shopping Cart Clearing Engine & Store-Specific Empty Actions',
      changes: [
        '1-Click Clear Cart Button: Added prominent "Clear Cart" actions in the Grocery Manager header and in-list progress toolbar with trash indicator.',
        'Safe Confirmation Interface: Integrated a non-destructive, inline confirmation prompt allowing users to safely empty their entire shopping list or selectively clear items for the active store filter only.',
        'Enhanced Empty State: Added 1-click quick-start preset buttons for all 5 major store brand lines (Aldi Organics, Meijer Weekly, Sam’s Club Bulk, Costco Wholesale, and Walmart Fresh) when cart is cleared.',
        'Context State Handlers: Engineered global clearAllGrocery and clearStoreGrocery methods in HealthContext with instant toast confirmation.',
      ],
    },
    {
      version: 'Beta 2.11.0',
      date: '2026-08-25',
      title: 'Global Shopping List Navigation, Unified Lists & 1-Tap Recipe Jump',
      changes: [
        'Simple & Athlete Mode Navigation: Added explicit, persistent "Shopping List" navigation across both desktop Sidebar and mobile BottomNav in Simple and Athlete modes, complete with live unpurchased item badges.',
        'Top Header Quick-Access: Added dedicated Shopping List shortcut button in the top navigation header displaying live cart item counts.',
        '1-Tap "Open Shopping List" Action: Added instant "Open Shopping List ➔" action buttons inside recipe toast feedback banners, detail headers, and bottom toolbars to immediately jump to the store checklist.',
        'Unified List Matching: Resolved list isolation so newly added ingredients with store tags (Aldi, Meijer, Sam’s Club, Costco, Walmart) appear seamlessly on the master shopping list as well as dedicated store run tabs.',
      ],
    },
    {
      version: 'Beta 2.10.0',
      date: '2026-08-25',
      title: 'Multi-Store Recipe Grocery Routing (Aldi, Meijer, Sam’s Club, Costco, Walmart)',
      changes: [
        'Multi-Store Grocery Routing: Seamlessly route chosen recipe ingredients directly into store-specific shopping lists with 1-click store destination filters (Aldi, Meijer, Sam’s Club, Costco Wholesale, Walmart, or All Stores).',
        'Costco & Walmart Brand Product Integration: Added signature Kirkland Signature (Costco) and Great Value / Marketside (Walmart) fresh, bulk, and pantry items to store database catalogs, 1-click run presets, and substituter.',
        'Bidirectional Grocery Integration: Filter, sort, view, and check off recipe ingredients by store in the Grocery Manager, or send ingredients straight from any recipe card or detail page.',
      ],
    },
    {
      version: 'Beta 2.9.1',
      date: '2026-08-25',
      title: 'Authentic Culinary Role-Based Swap Mapping & Sauce Engine',
      changes: [
        'Culinary Role-Based Swapping: Replaced broad generic category matching with strictly curated, authentic culinary swaps (e.g. Tomatoes swap for San Marzano Plum Tomatoes, Fire-Roasted Tomatoes, Tomatillo Salsa Verde, Roasted Red Pepper Purée, or Herb Marinara; Onions swap for Shallots, Red Onions, Vidalia Onions, or Leeks).',
        'Eliminated Incompatible Suggestions: Ingredients without legitimate direct culinary substitutes are marked as core essentials rather than offering mismatched vegetables.',
      ],
    },
    {
      version: 'Beta 2.9.0',
      date: '2026-08-25',
      title: 'Context-Aware Culinary Instruction Adaptation & Step Rewriter',
      changes: [
        'Dynamic Culinary Step Synthesis: When ingredients are swapped (e.g. raw eggs ➔ Greek yogurt or sliced hard-boiled eggs; raw chicken ➔ pressed tofu or canned black beans; jasmine rice ➔ riced cauliflower), the step-by-step cooking directions dynamically rewrite techniques, actions, and preparation methods.',
        'Adaptive Cook & Prep Timings: Total recipe cooking times adjust automatically (e.g. -8 min when switching to no-cook Greek yogurt or pre-cooked eggs; -10 min when switching to sautéed riced cauliflower).',
        'Intelligent Technique Guidance & Visual Indicators: Adapted steps are visually marked with custom badges and custom chef technique notes in both on-screen view and physical print studio (4x6 cards / 8.5x11 sheets).',
      ],
    },
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
                {form.experience_mode === 'standard'
                  ? '✨ Standard Mode Active'
                  : form.experience_mode === 'advanced'
                  ? '⚡ Advanced Mode Active'
                  : '🎓 Tutorial Mode Active'}
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

        {!authUser && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white">Syncing Laptop to iPhone:</span>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                Create an account or sign in with your email on your laptop, then open <strong className="text-white">health.seelye.info</strong> on your iPhone Safari and sign into that exact same email. All your entries, foods, movements, and biometrics will sync instantly.
              </p>
            </div>
          </div>
        )}

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div
              onClick={() => setForm({ ...form, experience_mode: 'standard' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                form.experience_mode === 'standard'
                  ? 'bg-brand-500/15 border-brand-500/50 shadow-glow text-white'
                  : 'bg-surface-300/40 border-surface-border text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 mb-1">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>✨ Standard Mode (Recommended)</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Warm, encouraging language with clean daily calorie tracking, hydration goals, friendly portion sizes, and easy guided routines.
              </p>
            </div>

            <div
              onClick={() => setForm({ ...form, experience_mode: 'advanced' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                form.experience_mode === 'advanced'
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-glow text-white'
                  : 'bg-surface-300/40 border-surface-border text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 mb-1">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>⚡ Advanced Mode</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Granular macronutrient ratios (P/C/F grams & percentages), periodized split matrices, barbell calculators, and biological fasting milestones.
              </p>
            </div>

            <div
              onClick={() => setForm({ ...form, experience_mode: 'tutorial' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                form.experience_mode === 'tutorial'
                  ? 'bg-amber-950/40 border-amber-500/50 shadow-glow text-white'
                  : 'bg-surface-300/40 border-surface-border text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 mb-1">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>🎓 Interactive Tutorial Mode</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Complete step-by-step hand-held guided walkthrough with interactive sandboxes for both Standard and Advanced systems.
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
                placeholder="0"
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
                placeholder="0"
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
                placeholder="0"
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
              placeholder="0.0"
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
              placeholder="0.0"
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
            <span>Active: {APP_VERSION_SHORT}</span>
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
