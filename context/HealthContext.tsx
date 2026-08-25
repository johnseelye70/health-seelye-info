'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  UserProfile,
  FoodItem,
  FoodLogEntry,
  WorkoutPlanDay,
  GroceryItem,
  WeightLog,
  MealSplitTarget,
  EquipmentType,
  FastingProtocol,
  ExperienceMode,
  ThemeMode,
  WorkoutSessionLog,
  WaterLogEntry,
  StepLogEntry,
} from '@/lib/types';
import {
  INITIAL_PROFILE,
  DEFAULT_FOODS,
  INITIAL_FOOD_LOGS,
  INITIAL_WEIGHT_LOGS,
  INITIAL_WORKOUT_LOGS,
  generateWorkoutPlanSplit,
  compileGroceryList,
} from '@/lib/mock-data';
import {
  calculateMacroTargets,
  calculateMealSplitTargets,
  computeFastingStatus,
  FastingStatus,
} from '@/lib/macro-calculator';
import { generateSmartGroceryRequisition } from '@/lib/grocery-database';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { normalizeFoodCategory } from '@/lib/food-database';
import {
  SimpleMovementActivity,
  DEFAULT_SIMPLE_DAILY_CHOICES,
} from '@/lib/movement-database';

export type SyncStatusType = 'synced' | 'syncing' | 'offline' | 'error' | 'local_only';

interface HealthContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  recalculateMacros: () => void;
  toggleUnitPreference: () => void;
  experienceMode: ExperienceMode;
  toggleExperienceMode: () => void;
  setExperienceMode: (mode: ExperienceMode) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  
  // Foods & Logs
  foods: FoodItem[];
  addCustomFood: (food: Omit<FoodItem, 'id'>) => void;
  foodLogs: FoodLogEntry[];
  logFood: (entry: Omit<FoodLogEntry, 'id' | 'created_at' | 'calories' | 'protein_g' | 'carbs_g' | 'fat_g'> & { food: FoodItem }) => void;
  deleteFoodLog: (id: string) => void;
  
  // Calculated Nutrition State
  todayDate: string;
  currentDayFoodLogs: FoodLogEntry[];
  todayMacros: { calories: number; protein: number; carbs: number; fat: number };
  todayRemaining: { calories: number; protein: number; carbs: number; fat: number };
  mealSplitTargets: MealSplitTarget[];
  
  // Fasting State
  fastingStatus: FastingStatus;
  updateFastingProtocol: (protocol: FastingProtocol, startTime?: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  
  // Workouts & Routines
  workoutPlan: WorkoutPlanDay[];
  activeWeek: number;
  setActiveWeek: (week: number) => void;
  activeDay: number;
  setActiveDay: (day: number) => void;
  toggleExerciseCompleted: (dayId: string, slotId: string) => void;
  updateExerciseSetData: (dayId: string, slotId: string, reps: number, weightKg: number) => void;
  regenerateWorkouts: (equipment?: EquipmentType[]) => void;
  toggleEquipment: (eq: EquipmentType) => void;
  setEquipmentInventory: (inventory: string[]) => void;

  // Simple Mode Feel-Good Movement Choices
  simpleMovementActivities: SimpleMovementActivity[];
  toggleSimpleMovementCompleted: (id: string) => void;
  addSimpleMovementActivity: (activity: SimpleMovementActivity) => void;
  removeSimpleMovementActivity: (id: string) => void;
  swapSimpleMovementActivity: (oldId: string, newActivity: SimpleMovementActivity) => void;
  resetSimpleMovementActivities: () => void;

  // Pre-Made Programs & Workout Database Query Engine
  workoutLogs: WorkoutSessionLog[];
  saveWorkoutSessionLog: (log: Omit<WorkoutSessionLog, 'id' | 'created_at'>) => void;
  deleteWorkoutSessionLog: (id: string) => void;
  activeProgramId: string | null;
  setActiveProgramId: (id: string | null) => void;
  
  // Grocery Manager
  groceryList: GroceryItem[];
  groceryMultiplier: number;
  setGroceryMultiplier: (mult: number) => void;
  toggleGroceryItem: (id: string) => void;
  togglePantryStatus: (id: string) => void;
  addGroceryItem: (item: Omit<GroceryItem, 'id'>) => void;
  updateGroceryItem: (id: string, updates: Partial<GroceryItem>) => void;
  swapGroceryItem: (id: string, replacement: Partial<GroceryItem>) => void;
  deleteGroceryItem: (id: string) => void;
  clearCheckedGrocery: () => void;
  syncGroceryFromMealPlan: () => void;
  
  // Weight & Analytics
  weightLogs: WeightLog[];
  logWeight: (weightKg: number, bodyFat?: number) => void;
  
  // Hydration & Water Engine
  waterGoalOz: number;
  setWaterGoalOz: (goal: number) => void;
  waterLogs: WaterLogEntry[];
  todayWaterOz: number;
  logWaterOz: (amountOz: number, container?: string) => void;
  resetTodayWater: () => void;

  // Step Tracker & Sensor Engine
  stepGoal: number;
  setStepGoal: (goal: number) => void;
  stepLogs: StepLogEntry[];
  todaySteps: number;
  todayStepMiles: number;
  todayStepCalories: number;
  logSteps: (steps: number, source?: StepLogEntry['source'], distanceMiles?: number, caloriesBurned?: number) => void;
  resetTodaySteps: () => void;
  
  // App State & Modals
  isDemoMode: boolean;
  activeTab: 'dashboard' | 'nutrition' | 'fasting' | 'workouts' | 'grocery' | 'trends' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'nutrition' | 'fasting' | 'workouts' | 'grocery' | 'trends' | 'settings') => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  resetAllData: () => void;

  // Cloud Account & Cross-Device Authentication
  authUser: any | null;
  authLoading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  syncStatus: SyncStatusType;
  lastSyncedAt: string | null;
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithPassword: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  syncWithCloud: () => Promise<void>;
  isSupabaseConfigured: boolean;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'health_seelye_app_state_v7';

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [foods, setFoods] = useState<FoodItem[]>(DEFAULT_FOODS);
  const [foodLogs, setFoodLogs] = useState<FoodLogEntry[]>(INITIAL_FOOD_LOGS);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanDay[]>(() => generateWorkoutPlanSplit(INITIAL_PROFILE.equipment_inventory));
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [groceryMultiplier, setGroceryMultiplier] = useState<number>(1);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(INITIAL_WEIGHT_LOGS);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutSessionLog[]>([]);
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
  
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [activeDay, setActiveDay] = useState<number>(() => {
    const day = new Date().getDay(); // 0 is Sun, 1 is Mon...
    return day === 0 ? 7 : day;
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'nutrition' | 'fasting' | 'workouts' | 'grocery' | 'trends' | 'settings'>('dashboard');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  const [waterGoalOz, setWaterGoalOz] = useState<number>(96);
  const [waterLogs, setWaterLogs] = useState<WaterLogEntry[]>([]);
  const [stepGoal, setStepGoal] = useState<number>(10000);
  const [stepLogs, setStepLogs] = useState<StepLogEntry[]>([]);
  const [simpleMovementActivities, setSimpleMovementActivities] = useState<SimpleMovementActivity[]>(DEFAULT_SIMPLE_DAILY_CHOICES);

  // Cloud Auth & Sync States
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>(isSupabaseConfigured ? 'synced' : 'local_only');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  
  const todayDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Real-time ticking for fasting timer
  const [nowTick, setNowTick] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved =
          localStorage.getItem(LOCAL_STORAGE_KEY) ||
          localStorage.getItem('health_seelye_app_state_v5') ||
          localStorage.getItem('health_seelye_app_state_v4');

        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.profile) setProfile(parsed.profile);

          if (parsed.foods && Array.isArray(parsed.foods) && parsed.foods.length >= DEFAULT_FOODS.length) {
            setFoods(
              parsed.foods.map((f: FoodItem) => {
                const defaultMatch = DEFAULT_FOODS.find((df) => df.id === f.id);
                return {
                  ...f,
                  category: normalizeFoodCategory(f.category),
                  sub_category: f.sub_category || defaultMatch?.sub_category,
                };
              })
            );
          } else {
            const customFoods = (parsed.foods || []).filter(
              (f: FoodItem) => !DEFAULT_FOODS.some((df) => df.id === f.id)
            );
            setFoods([...DEFAULT_FOODS, ...customFoods]);
          }

          if (parsed.foodLogs) setFoodLogs(parsed.foodLogs);
          if (parsed.workoutPlan) setWorkoutPlan(parsed.workoutPlan);
          if (parsed.groceryList) setGroceryList(parsed.groceryList);
          if (parsed.weightLogs) setWeightLogs(parsed.weightLogs);
          if (parsed.workoutLogs && Array.isArray(parsed.workoutLogs)) setWorkoutLogs(parsed.workoutLogs);
          if (parsed.activeProgramId) setActiveProgramId(parsed.activeProgramId);
          if (parsed.notificationsEnabled !== undefined) setNotificationsEnabled(parsed.notificationsEnabled);
          if (parsed.waterGoalOz) setWaterGoalOz(parsed.waterGoalOz);
          if (parsed.waterLogs && Array.isArray(parsed.waterLogs)) setWaterLogs(parsed.waterLogs);
          if (parsed.stepGoal) setStepGoal(parsed.stepGoal);
          if (parsed.stepLogs && Array.isArray(parsed.stepLogs)) setStepLogs(parsed.stepLogs);
          if (parsed.simpleMovementActivities && Array.isArray(parsed.simpleMovementActivities) && parsed.simpleMovementActivities.length > 0) {
            setSimpleMovementActivities(parsed.simpleMovementActivities);
          }
        } else {
          setFoods(DEFAULT_FOODS);
          setWorkoutLogs(INITIAL_WORKOUT_LOGS);
        }
      } catch (err) {
        console.warn('Failed to load local state:', err);
        setFoods(DEFAULT_FOODS);
      }
    }
  }, []);

  // 2. Persist to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stateToPersist = {
          profile,
          foods,
          foodLogs,
          workoutPlan,
          groceryList,
          weightLogs,
          workoutLogs,
          activeProgramId,
          notificationsEnabled,
          waterGoalOz,
          waterLogs,
          stepGoal,
          stepLogs,
          simpleMovementActivities,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
      } catch (err) {
        console.warn('Failed to persist state:', err);
      }
    }
  }, [profile, foods, foodLogs, workoutPlan, groceryList, weightLogs, workoutLogs, activeProgramId, notificationsEnabled, waterGoalOz, waterLogs, stepGoal, stepLogs, simpleMovementActivities]);

  // Refs to decouple async synchronization from React state render cycles
  const profileRef = useRef<UserProfile>(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const foodLogsRef = useRef<FoodLogEntry[]>(foodLogs);
  useEffect(() => {
    foodLogsRef.current = foodLogs;
  }, [foodLogs]);

  const weightLogsRef = useRef<WeightLog[]>(weightLogs);
  useEffect(() => {
    weightLogsRef.current = weightLogs;
  }, [weightLogs]);

  const authUserRef = useRef<any>(authUser);
  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  const isSyncingRef = useRef<boolean>(false);

  // 3. Supabase Cloud Sync Engine (Non-Destructive Reconciliation with Mutex Guard)
  const performCloudSync = useCallback(async (targetUser?: any) => {
    const user = targetUser || authUserRef.current;
    if (!isSupabaseConfigured || !supabase || !user) return;
    if (isSyncingRef.current) return; // Prevent concurrent re-entrant executions

    isSyncingRef.current = true;
    setSyncStatus('syncing');

    try {
      const client = supabase;

      // A. Profile Sync
      const { data: cloudProfile, error: profileErr } = await (client.from('profiles') as any)
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (cloudProfile && !profileErr) {
        setProfile((prev) => ({
          ...prev,
          id: user.id,
          email: user.email || cloudProfile.email || prev.email,
          full_name: cloudProfile.full_name || user.user_metadata?.full_name || prev.full_name || 'Athlete',
          age: cloudProfile.age ?? prev.age,
          height_cm: Number(cloudProfile.height_cm) || prev.height_cm,
          current_weight_kg: Number(cloudProfile.current_weight_kg) || prev.current_weight_kg,
          target_weight_kg: Number(cloudProfile.target_weight_kg) || prev.target_weight_kg,
          sex: (cloudProfile.sex as any) || prev.sex,
          activity_level: (cloudProfile.activity_level as any) || prev.activity_level,
          goal: (cloudProfile.goal as any) || prev.goal,
          unit_preference: (cloudProfile.unit_preference as any) || prev.unit_preference,
          daily_calorie_target: cloudProfile.daily_calorie_target || prev.daily_calorie_target,
          protein_target_g: cloudProfile.protein_target_g || prev.protein_target_g,
          carb_target_g: cloudProfile.carb_target_g || prev.carb_target_g,
          fat_target_g: cloudProfile.fat_target_g || prev.fat_target_g,
          fasting_protocol: (cloudProfile.fasting_protocol as any) || prev.fasting_protocol,
          fasting_start_time: cloudProfile.fasting_start_time || prev.fasting_start_time,
          meal_count: cloudProfile.meal_count || prev.meal_count,
        }));
      } else {
        const currentProf = profileRef.current;
        await (client.from('profiles') as any).upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || currentProf.full_name || 'Athlete',
          age: currentProf.age,
          height_cm: currentProf.height_cm,
          current_weight_kg: currentProf.current_weight_kg,
          target_weight_kg: currentProf.target_weight_kg,
          sex: currentProf.sex,
          activity_level: currentProf.activity_level,
          goal: currentProf.goal,
          unit_preference: currentProf.unit_preference,
          daily_calorie_target: currentProf.daily_calorie_target,
          protein_target_g: currentProf.protein_target_g,
          carb_target_g: currentProf.carb_target_g,
          fat_target_g: currentProf.fat_target_g,
          fasting_protocol: currentProf.fasting_protocol,
          fasting_start_time: currentProf.fasting_start_time,
          meal_count: currentProf.meal_count,
        });
      }

      // B. Food Logs Sync (Merge Cloud & Local Non-Destructively)
      const { data: cloudFoodLogs } = await (client.from('food_logs') as any)
        .select('*')
        .eq('user_id', user.id);

      if (cloudFoodLogs && Array.isArray(cloudFoodLogs)) {
        const cloudIds = new Set(cloudFoodLogs.map((c: any) => c.id));
        const currentLocalLogs = foodLogsRef.current;
        const localOnlyLogs = currentLocalLogs.filter((l) => !cloudIds.has(l.id));

        if (localOnlyLogs.length > 0) {
          const rowsToInsert = localOnlyLogs.map((l) => ({
            id: l.id.startsWith('log-') ? undefined : l.id,
            user_id: user.id,
            food_id: l.food_id,
            food_name: l.food_name,
            grams_consumed: l.grams_consumed,
            meal_index: l.meal_index,
            logged_at: l.logged_at,
            calories: l.calories,
            protein_g: l.protein_g,
            carbs_g: l.carbs_g,
            fat_g: l.fat_g,
          }));
          await (client.from('food_logs') as any).insert(rowsToInsert);
        }

        const merged: FoodLogEntry[] = [
          ...cloudFoodLogs.map((c: any) => ({
            id: c.id,
            user_id: c.user_id,
            food_id: c.food_id,
            food_name: c.food_name,
            grams_consumed: Number(c.grams_consumed),
            meal_index: c.meal_index,
            logged_at: c.logged_at,
            calories: Number(c.calories),
            protein_g: Number(c.protein_g),
            carbs_g: Number(c.carbs_g),
            fat_g: Number(c.fat_g),
            created_at: c.created_at,
          })),
          ...localOnlyLogs,
        ];
        setFoodLogs(merged);
      }

      // C. Weight Logs Sync
      const { data: cloudWeightLogs } = await (client.from('weight_logs') as any)
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (cloudWeightLogs && Array.isArray(cloudWeightLogs)) {
        const cloudDates = new Set(cloudWeightLogs.map((c: any) => c.logged_at));
        const currentLocalWeights = weightLogsRef.current;
        const localOnlyWeights = currentLocalWeights.filter((w) => !cloudDates.has(w.logged_at));

        if (localOnlyWeights.length > 0) {
          const weightRows = localOnlyWeights.map((w) => ({
            user_id: user.id,
            weight_kg: w.weight_kg,
            body_fat_percentage: w.body_fat_percentage,
            logged_at: w.logged_at,
          }));
          await (client.from('weight_logs') as any).insert(weightRows);
        }

        const mergedWeights: WeightLog[] = [
          ...cloudWeightLogs.map((c: any) => ({
            id: c.id,
            weight_kg: Number(c.weight_kg),
            body_fat_percentage: c.body_fat_percentage ? Number(c.body_fat_percentage) : undefined,
            logged_at: c.logged_at,
          })),
          ...localOnlyWeights,
        ];
        setWeightLogs(mergedWeights);
      }

      setSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Sync error:', err);
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const syncWithCloud = useCallback(async () => {
    await performCloudSync();
  }, [performCloudSync]);

  // 4. Supabase Auth Session Listener (Zero-Loop Stable Lifecycle)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    const client = supabase;

    // Get current session on load
    client.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      setAuthUser(user);
      setAuthLoading(false);
      if (user) {
        performCloudSync(user);
      }
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      setAuthUser(user);
      if (user) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
          performCloudSync(user);
        }
      } else {
        setSyncStatus('local_only');
      }
    });

    return () => subscription.unsubscribe();
  }, [performCloudSync]);

  // Auth Methods
  const signInWithPassword = async (email: string, password: string) => {
    if (!supabase) return { error: { message: 'Cloud database not configured' } };
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (!res.error && res.data.user) {
      setAuthUser(res.data.user);
    }
    return { error: res.error };
  };

  const signUpWithPassword = async (email: string, password: string, fullName?: string) => {
    if (!supabase) return { error: { message: 'Cloud database not configured' } };
    const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://health.seelye.info/';
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || (profile.full_name === 'John Seelye' ? 'Athlete' : profile.full_name) || 'Athlete' },
        emailRedirectTo,
      },
    });
    if (!res.error && res.data.user) {
      setAuthUser(res.data.user);
      setProfile((prev) => ({ ...prev, full_name: fullName || 'Athlete', email }));
    }
    return { error: res.error };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    setSyncStatus('local_only');
  };

  const resetPassword = async (email: string) => {
    if (!supabase) return { error: { message: 'Cloud database not configured' } };
    const res = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
    });
    return { error: res.error };
  };

  // Compute Fasting Status reactively
  const fastingStatus = useMemo(() => {
    void nowTick;
    return computeFastingStatus(
      profile.fasting_protocol,
      profile.fasting_start_time,
      profile.eating_window_duration_hours
    );
  }, [profile.fasting_protocol, profile.fasting_start_time, profile.eating_window_duration_hours, nowTick]);

  // Compute Dynamic Meal Splits (2, 3, or 4 meals)
  const mealSplitTargets = useMemo(() => {
    return calculateMealSplitTargets(
      profile.daily_calorie_target,
      profile.protein_target_g,
      profile.carb_target_g,
      profile.fat_target_g,
      profile.meal_count,
      profile.eating_window_duration_hours,
      profile.fasting_start_time
    );
  }, [
    profile.daily_calorie_target,
    profile.protein_target_g,
    profile.carb_target_g,
    profile.fat_target_g,
    profile.meal_count,
    profile.eating_window_duration_hours,
    profile.fasting_start_time,
  ]);

  // Compute Today's Food Logs & Macros
  const currentDayFoodLogs = useMemo(() => {
    return foodLogs.filter((log) => log.logged_at === todayDate);
  }, [foodLogs, todayDate]);

  const todayMacros = useMemo(() => {
    return currentDayFoodLogs.reduce(
      (acc, item) => ({
        calories: Math.round(acc.calories + item.calories),
        protein: Math.round(acc.protein + item.protein_g),
        carbs: Math.round(acc.carbs + item.carbs_g),
        fat: Math.round(acc.fat + item.fat_g),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [currentDayFoodLogs]);

  const todayRemaining = useMemo(() => {
    return {
      calories: Math.max(0, profile.daily_calorie_target - todayMacros.calories),
      protein: Math.max(0, profile.protein_target_g - todayMacros.protein),
      carbs: Math.max(0, profile.carb_target_g - todayMacros.carbs),
      fat: Math.max(0, profile.fat_target_g - todayMacros.fat),
    };
  }, [profile, todayMacros]);

  const toggleUnitPreference = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      unit_preference: prev.unit_preference === 'imperial' ? 'metric' : 'imperial',
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const toggleExperienceMode = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      experience_mode: prev.experience_mode === 'simple' ? 'advanced' : 'simple',
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const setExperienceMode = useCallback((mode: ExperienceMode) => {
    setProfile((prev) => ({
      ...prev,
      experience_mode: mode,
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const experienceMode = profile.experience_mode || 'simple';

  // Theme Mode: Dark vs Light
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = (localStorage.getItem('sfh_theme_mode') as ThemeMode) || profile.theme_mode || 'dark';
      setThemeModeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, [profile.theme_mode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sfh_theme_mode', mode);
      document.documentElement.classList.toggle('dark', mode === 'dark');
    }
    setProfile((prev) => ({
      ...prev,
      theme_mode: mode,
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const toggleThemeMode = useCallback(() => {
    const nextMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  }, [themeMode, setThemeMode]);

  // Update profile and optionally push to cloud
  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      let updatedProfile: UserProfile | null = null;
      setProfile((prev) => {
        const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
        updatedProfile = updated;
        return updated;
      });

      const user = authUserRef.current;
      if (supabase && user && updatedProfile) {
        const p: UserProfile = updatedProfile;
        (supabase.from('profiles') as any)
          .update({
            full_name: p.full_name,
            age: p.age,
            height_cm: p.height_cm,
            current_weight_kg: p.current_weight_kg,
            target_weight_kg: p.target_weight_kg,
            sex: p.sex,
            activity_level: p.activity_level,
            goal: p.goal,
            unit_preference: p.unit_preference,
            daily_calorie_target: p.daily_calorie_target,
            protein_target_g: p.protein_target_g,
            carb_target_g: p.carb_target_g,
            fat_target_g: p.fat_target_g,
            fasting_protocol: p.fasting_protocol,
            fasting_start_time: p.fasting_start_time,
            meal_count: p.meal_count,
            updated_at: p.updated_at,
          })
          .eq('id', user.id)
          .then(() => {});
      }
    },
    []
  );

  const recalculateMacros = useCallback(() => {
    setProfile((prev) => {
      const result = calculateMacroTargets({
        weightKg: prev.current_weight_kg,
        heightCm: prev.height_cm,
        age: prev.age,
        sex: prev.sex,
        activityLevel: prev.activity_level,
        goal: prev.goal,
      });

      return {
        ...prev,
        daily_calorie_target: result.dailyCalories,
        protein_target_g: result.proteinGrams,
        carb_target_g: result.carbGrams,
        fat_target_g: result.fatGrams,
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const updateFastingProtocol = useCallback((protocol: FastingProtocol, startTime?: string) => {
    setProfile((prev) => {
      let eatDuration = 8;
      if (protocol === '16_8') eatDuration = 8;
      else if (protocol === '18_6') eatDuration = 6;
      else if (protocol === '20_4') eatDuration = 4;
      else if (protocol === '14_10') eatDuration = 10;
      else if (protocol === '23_1_omad') eatDuration = 1;
      else if (protocol === 'standard_3_meal') eatDuration = 12;

      return {
        ...prev,
        fasting_protocol: protocol,
        fasting_start_time: startTime || prev.fasting_start_time,
        eating_window_duration_hours: eatDuration,
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const addCustomFood = useCallback((foodData: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...foodData,
      id: `cf-${Date.now()}`,
    };
    setFoods((prev) => [newFood, ...prev]);

    const user = authUserRef.current;
    if (supabase && user) {
      (supabase.from('food_database') as any)
        .insert({
          user_id: user.id,
          name: newFood.name,
          category: newFood.category,
          calories_per_100g: newFood.calories_per_100g,
          protein_per_100g: newFood.protein_per_100g,
          carbs_per_100g: newFood.carbs_per_100g,
          fat_per_100g: newFood.fat_per_100g,
          fiber_per_100g: newFood.fiber_per_100g || 0,
          is_gluten_free: newFood.is_gluten_free,
          is_dairy_free: newFood.is_dairy_free,
          serving_size_g: newFood.serving_size_g,
          default_unit: newFood.default_unit,
          storage_type: newFood.storage_type,
          swap_group: newFood.swap_group || null,
        })
        .then(() => {});
    }
  }, []);

  const logFood = useCallback(
    ({
      user_id,
      food,
      food_name,
      grams_consumed,
      meal_index,
      logged_at,
    }: Omit<FoodLogEntry, 'id' | 'created_at' | 'calories' | 'protein_g' | 'carbs_g' | 'fat_g'> & { food: FoodItem }) => {
      const multiplier = grams_consumed / 100;
      const calculatedCalories = Math.round(food.calories_per_100g * multiplier);
      const calculatedProtein = Number((food.protein_per_100g * multiplier).toFixed(1));
      const calculatedCarbs = Number((food.carbs_per_100g * multiplier).toFixed(1));
      const calculatedFat = Number((food.fat_per_100g * multiplier).toFixed(1));

      const user = authUserRef.current;
      const currentProf = profileRef.current;

      const newEntry: FoodLogEntry = {
        id: `log-${Date.now()}`,
        user_id: user_id || user?.id || currentProf.id,
        food_id: food.id,
        food_name: food_name || food.name,
        grams_consumed,
        meal_index,
        logged_at: logged_at || new Date().toISOString().split('T')[0],
        calories: calculatedCalories,
        protein_g: calculatedProtein,
        carbs_g: calculatedCarbs,
        fat_g: calculatedFat,
        created_at: new Date().toISOString(),
      };

      setFoodLogs((prev) => [newEntry, ...prev]);

      if (supabase && user) {
        (supabase.from('food_logs') as any)
          .insert({
            user_id: user.id,
            food_id: food.id,
            food_name: newEntry.food_name,
            grams_consumed,
            meal_index,
            logged_at: newEntry.logged_at,
            calories: calculatedCalories,
            protein_g: calculatedProtein,
            carbs_g: calculatedCarbs,
            fat_g: calculatedFat,
          })
          .then(() => {});
      }
    },
    []
  );

  const deleteFoodLog = useCallback((id: string) => {
    setFoodLogs((prev) => prev.filter((log) => log.id !== id));
    const user = authUserRef.current;
    if (supabase && user && !id.startsWith('log-')) {
      (supabase.from('food_logs') as any).delete().eq('id', id).then(() => {});
    }
  }, []);

  const toggleEquipment = useCallback((eq: EquipmentType) => {
    setProfile((prev) => {
      const exists = prev.equipment_inventory.includes(eq);
      const updatedEq = exists
        ? prev.equipment_inventory.filter((item) => item !== eq)
        : [...prev.equipment_inventory, eq];
      
      const newProfile = { ...prev, equipment_inventory: updatedEq };
      setWorkoutPlan(generateWorkoutPlanSplit(updatedEq));
      return newProfile;
    });
  }, []);

  const setEquipmentInventory = useCallback((inventory: string[]) => {
    setProfile((prev) => {
      const newProfile = { ...prev, equipment_inventory: inventory };
      setWorkoutPlan(generateWorkoutPlanSplit(inventory));
      return newProfile;
    });
  }, []);

  const regenerateWorkouts = useCallback((equipment?: EquipmentType[]) => {
    const eqList = equipment || profile.equipment_inventory;
    setWorkoutPlan(generateWorkoutPlanSplit(eqList));
  }, [profile.equipment_inventory]);

  const toggleExerciseCompleted = useCallback((dayId: string, slotId: string) => {
    setWorkoutPlan((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          exercises: day.exercises.map((slot) => {
            if (slot.id !== slotId) return slot;
            return { ...slot, completed: !slot.completed };
          }),
        };
      })
    );
  }, []);

  const updateExerciseSetData = useCallback((dayId: string, slotId: string, reps: number, weightKg: number) => {
    setWorkoutPlan((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          exercises: day.exercises.map((slot) => {
            if (slot.id !== slotId) return slot;
            return {
              ...slot,
              logged_reps: reps,
              logged_weight_kg: weightKg,
              completed: true,
            };
          }),
        };
      })
    );
  }, []);

  const saveWorkoutSessionLog = useCallback((logData: Omit<WorkoutSessionLog, 'id' | 'created_at'>) => {
    const newLog: WorkoutSessionLog = {
      ...logData,
      id: `wlog-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setWorkoutLogs((prev) => [newLog, ...prev]);
  }, []);

  const deleteWorkoutSessionLog = useCallback((id: string) => {
    setWorkoutLogs((prev) => prev.filter((log) => log.id !== id));
  }, []);

  const toggleGroceryItem = useCallback((id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_checked: !item.is_checked } : item))
    );
  }, []);

  const togglePantryStatus = useCallback((id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, in_pantry: !item.in_pantry } : item))
    );
  }, []);

  const addGroceryItem = useCallback((itemData: Omit<GroceryItem, 'id'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: `gi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setGroceryList((prev) => [newItem, ...prev]);
  }, []);

  const updateGroceryItem = useCallback((id: string, updates: Partial<GroceryItem>) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const swapGroceryItem = useCallback((id: string, replacement: Partial<GroceryItem>) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...replacement } : item))
    );
  }, []);

  const deleteGroceryItem = useCallback((id: string) => {
    setGroceryList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCheckedGrocery = useCallback(() => {
    setGroceryList((prev) => prev.filter((item) => !item.is_checked));
  }, []);

  const syncGroceryFromMealPlan = useCallback(() => {
    const generated = generateSmartGroceryRequisition(groceryMultiplier);
    setGroceryList(generated);
  }, [groceryMultiplier]);

  const logWeight = useCallback((weightKg: number, bodyFat?: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: WeightLog = {
      id: `w-${Date.now()}`,
      weight_kg: weightKg,
      body_fat_percentage: bodyFat,
      logged_at: today,
    };
    setWeightLogs((prev) => [newLog, ...prev]);
    setProfile((prev) => ({
      ...prev,
      current_weight_kg: weightKg,
    }));

    const user = authUserRef.current;
    if (supabase && user) {
      (supabase.from('weight_logs') as any)
        .insert({
          user_id: user.id,
          weight_kg: weightKg,
          body_fat_percentage: bodyFat || null,
          logged_at: today,
        })
        .then(() => {});
    }
  }, []);

  // Simple Mode Feel-Good Movement Handlers
  const toggleSimpleMovementCompleted = useCallback((id: string) => {
    setSimpleMovementActivities((prev) =>
      prev.map((act) =>
        act.id === id
          ? {
              ...act,
              completed: !act.completed,
              completed_at: !act.completed ? new Date().toISOString() : undefined,
            }
          : act
      )
    );
  }, []);

  const addSimpleMovementActivity = useCallback((activity: SimpleMovementActivity) => {
    setSimpleMovementActivities((prev) => {
      if (prev.some((a) => a.id === activity.id)) return prev;
      return [...prev, activity];
    });
  }, []);

  const removeSimpleMovementActivity = useCallback((id: string) => {
    setSimpleMovementActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const swapSimpleMovementActivity = useCallback((oldId: string, newActivity: SimpleMovementActivity) => {
    setSimpleMovementActivities((prev) =>
      prev.map((a) => (a.id === oldId ? newActivity : a))
    );
  }, []);

  const resetSimpleMovementActivities = useCallback(() => {
    setSimpleMovementActivities(DEFAULT_SIMPLE_DAILY_CHOICES);
  }, []);

  // Hydration Engine
  const todayWaterOz = useMemo(() => {
    return waterLogs
      .filter((w) => w.logged_at.startsWith(todayDate))
      .reduce((sum, w) => sum + w.amount_oz, 0);
  }, [waterLogs, todayDate]);

  const logWaterOz = useCallback((amountOz: number, container?: string) => {
    const entry: WaterLogEntry = {
      id: `wtr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      amount_oz: amountOz,
      container,
      logged_at: new Date().toISOString(),
    };
    setWaterLogs((prev) => [entry, ...prev]);
  }, []);

  const resetTodayWater = useCallback(() => {
    setWaterLogs((prev) => prev.filter((w) => !w.logged_at.startsWith(todayDate)));
  }, [todayDate]);

  // Step Tracker Engine
  const todaySteps = useMemo(() => {
    return stepLogs
      .filter((s) => s.logged_at.startsWith(todayDate))
      .reduce((sum, s) => sum + s.steps, 0);
  }, [stepLogs, todayDate]);

  const todayStepMiles = useMemo(() => {
    return Number((todaySteps * 0.00045).toFixed(2));
  }, [todaySteps]);

  const todayStepCalories = useMemo(() => {
    return Math.round(todaySteps * 0.04);
  }, [todaySteps]);

  const logSteps = useCallback((steps: number, source: StepLogEntry['source'] = 'manual', distanceMiles?: number, caloriesBurned?: number) => {
    const dist = distanceMiles ?? Number((steps * 0.00045).toFixed(2));
    const cals = caloriesBurned ?? Math.round(steps * 0.04);
    const entry: StepLogEntry = {
      id: `stp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      steps,
      distance_miles: dist,
      calories_burned: cals,
      source,
      logged_at: todayDate,
    };
    setStepLogs((prev) => {
      const filtered = prev.filter((s) => s.logged_at !== todayDate);
      return [entry, ...filtered];
    });
  }, [todayDate]);

  const resetTodaySteps = useCallback(() => {
    setStepLogs((prev) => prev.filter((s) => s.logged_at !== todayDate));
  }, [todayDate]);

  const resetAllData = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('health_seelye_app_state_v1');
        localStorage.removeItem('health_seelye_app_state_v2');
        localStorage.removeItem('health_seelye_app_state_v3');
        localStorage.removeItem('health_seelye_app_state_v4');
        localStorage.removeItem('health_seelye_app_state_v5');
        localStorage.removeItem('health_seelye_app_state_v6');
        localStorage.removeItem('health_seelye_app_state_v7');
      } catch (e) {
        // ignore
      }
    }
    setProfile(INITIAL_PROFILE);
    setFoods(DEFAULT_FOODS);
    setFoodLogs([]);
    setWorkoutPlan(generateWorkoutPlanSplit(INITIAL_PROFILE.equipment_inventory));
    setGroceryList([]);
    setWeightLogs([]);
    setWorkoutLogs([]);
    setWaterLogs([]);
    setStepLogs([]);
  }, []);

  return (
    <HealthContext.Provider
      value={{
        profile,
        updateProfile,
        recalculateMacros,
        toggleUnitPreference,
        experienceMode,
        toggleExperienceMode,
        setExperienceMode,
        themeMode,
        toggleThemeMode,
        setThemeMode,
        foods,
        addCustomFood,
        foodLogs,
        logFood,
        deleteFoodLog,
        todayDate,
        currentDayFoodLogs,
        todayMacros,
        todayRemaining,
        mealSplitTargets,
        fastingStatus,
        updateFastingProtocol,
        notificationsEnabled,
        setNotificationsEnabled,
        workoutPlan,
        activeWeek,
        setActiveWeek,
        activeDay,
        setActiveDay,
        toggleExerciseCompleted,
        updateExerciseSetData,
        regenerateWorkouts,
        toggleEquipment,
        setEquipmentInventory,

        // Simple Mode Movement Choices
        simpleMovementActivities,
        toggleSimpleMovementCompleted,
        addSimpleMovementActivity,
        removeSimpleMovementActivity,
        swapSimpleMovementActivity,
        resetSimpleMovementActivities,

        workoutLogs,
        saveWorkoutSessionLog,
        deleteWorkoutSessionLog,
        activeProgramId,
        setActiveProgramId,
        groceryList,
        groceryMultiplier,
        setGroceryMultiplier,
        toggleGroceryItem,
        togglePantryStatus,
        addGroceryItem,
        updateGroceryItem,
        swapGroceryItem,
        deleteGroceryItem,
        clearCheckedGrocery,
        syncGroceryFromMealPlan,
        weightLogs,
        logWeight,

        // Hydration Engine
        waterGoalOz,
        setWaterGoalOz,
        waterLogs,
        todayWaterOz,
        logWaterOz,
        resetTodayWater,

        // Step Tracker & Sensor Engine
        stepGoal,
        setStepGoal,
        stepLogs,
        todaySteps,
        todayStepMiles,
        todayStepCalories,
        logSteps,
        resetTodaySteps,

        isDemoMode: !authUser && !isSupabaseConfigured,
        activeTab,
        setActiveTab,
        showOnboardingModal,
        setShowOnboardingModal,
        resetAllData,

        // Cloud Auth & Sync
        authUser,
        authLoading,
        showAuthModal,
        setShowAuthModal,
        syncStatus,
        lastSyncedAt,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        resetPassword,
        syncWithCloud,
        isSupabaseConfigured,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}
