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
  GroceryStoreTag,
  ScheduledDayPlan,
  ScheduledPlannedMeal,
  MasterScheduleTemplate,
  AppNavigationTab,
  BuiltCustomMeal,
} from '@/lib/types';
import { MASTER_SCHEDULE_TEMPLATES } from '@/lib/schedule-templates';
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
import { isSupabaseConfigured, supabase, purgeLegacyLocalStorage } from '@/lib/supabase/client';
import { normalizeFoodCategory } from '@/lib/food-database';
import {
  SimpleMovementActivity,
  DEFAULT_SIMPLE_DAILY_CHOICES,
} from '@/lib/movement-database';

export type SyncStatusType = 'synced' | 'syncing' | 'offline' | 'error' | 'local_only';

export const isUuid = (str?: string | null): boolean =>
  Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

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
  logFood: (entry: Omit<FoodLogEntry, 'id' | 'created_at' | 'calories' | 'protein_g' | 'carbs_g' | 'fat_g'> & { food: FoodItem }) => string;
  updateFoodLog: (id: string, updates: Partial<FoodLogEntry>) => void;
  deleteFoodLog: (id: string) => void;
  
  // Calculated Nutrition State (Today & Date-Selectable)
  todayDate: string;
  currentDayFoodLogs: FoodLogEntry[];
  todayMacros: { calories: number; protein: number; carbs: number; fat: number };
  todayRemaining: { calories: number; protein: number; carbs: number; fat: number };
  mealSplitTargets: MealSplitTarget[];

  // Selected Date Navigation for Food Diary & Daily History
  selectedDate: string;
  setSelectedDate: (dateStr: string) => void;
  selectedDayFoodLogs: FoodLogEntry[];
  selectedDayMacros: { calories: number; protein: number; carbs: number; fat: number };
  selectedDayRemaining: { calories: number; protein: number; carbs: number; fat: number };
  copyDayFoodLogs: (fromDateStr: string, toDateStr: string) => number;
  quickLogCalories: (name: string, calories: number, mealIndex: number, dateStr?: string, protein?: number, carbs?: number, fat?: number) => string;

  // Custom Meals & Recipe Builder
  customMeals: BuiltCustomMeal[];
  saveCustomMeal: (meal: BuiltCustomMeal) => void;
  deleteCustomMeal: (id: string) => void;
  logBuiltMealToDiary: (
    meal: BuiltCustomMeal,
    options: {
      servings: number;
      mealIndex: number;
      dateStr?: string;
      logAsSingleItem?: boolean;
    }
  ) => void;
  updateBuiltMealInDiary: (
    logId: string,
    meal: BuiltCustomMeal,
    options: {
      servings: number;
      mealIndex: number;
      dateStr?: string;
    }
  ) => void;
  editingMealLog: {
    logId: string;
    meal: BuiltCustomMeal;
    mealIndex: number;
    dateStr: string;
    servings: number;
  } | null;
  setEditingMealLog: React.Dispatch<
    React.SetStateAction<{
      logId: string;
      meal: BuiltCustomMeal;
      mealIndex: number;
      dateStr: string;
      servings: number;
    } | null>
  >;

  // Cross-Referenced Reports & History
  getDailyReport: (dateStr: string) => {
    date: string;
    foodLogs: FoodLogEntry[];
    macros: { calories: number; protein: number; carbs: number; fat: number };
    caloriesTarget: number;
    proteinTarget: number;
    workouts: WorkoutSessionLog[];
    totalVolumeLbs: number;
    totalSets: number;
    workoutMinutes: number;
    steps: number;
    stepMiles: number;
    stepCalories: number;
    waterOz: number;
    waterGoalOz: number;
    weightKg: number | null;
  };
  getWeeklyReport: (endDateStr?: string) => {
    startDate: string;
    endDate: string;
    days: Array<{
      date: string;
      calories: number;
      protein: number;
      steps: number;
      waterOz: number;
      hasWorkout: boolean;
      weightKg: number | null;
    }>;
    avgCalories: number;
    avgProtein: number;
    avgSteps: number;
    totalWorkouts: number;
    totalVolumeLbs: number;
    totalWaterOz: number;
    weightChangeLbs: number | null;
    adherenceScore: number;
    insight: string;
  };
  getMonthlyReport: (yearMonthStr?: string) => {
    monthStr: string;
    totalDays: number;
    daysLogged: number;
    avgDailyCalories: number;
    avgDailyProtein: number;
    totalSteps: number;
    totalMiles: number;
    totalWorkouts: number;
    totalVolumeLbs: number;
    startWeightKg: number | null;
    endWeightKg: number | null;
    weightChangeLbs: number | null;
    insight: string;
  };
  getYearlyReport: (yearStr?: string) => {
    yearStr: string;
    totalWorkouts: number;
    totalVolumeLbs: number;
    totalSteps: number;
    totalMiles: number;
    activeDaysCount: number;
    netWeightChangeLbs: number | null;
    monthsData: Array<{
      monthName: string;
      avgCalories: number;
      workoutsCount: number;
      stepsCount: number;
    }>;
    insight: string;
  };
  
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
  loadDefaultSimpleMovementActivities: () => void;

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
  clearAllGrocery: () => void;
  clearStoreGrocery: (storeTag: GroceryStoreTag) => void;
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

  // Step Tracker & Automated Watch / Apple Health Sync
  stepGoal: number;
  setStepGoal: (goal: number) => void;
  stepLogs: StepLogEntry[];
  todaySteps: number;
  todayStepMiles: number;
  todayStepCalories: number;
  lastStepSyncTimestamp: string | null;
  stepSyncSource: StepLogEntry['source'];
  logSteps: (steps: number, source?: StepLogEntry['source'], distanceMiles?: number, caloriesBurned?: number) => void;
  resetTodaySteps: () => void;
  
  // 90-Day Rolling Master Schedule & Planner
  scheduledPlans: Record<string, ScheduledDayPlan>;
  saveScheduledDayPlan: (dateStr: string, planUpdates: Partial<ScheduledDayPlan>) => void;
  deployMasterScheduleTemplate: (templateId: string, startDateStr: string, durationWeeks?: number, preserveOverrides?: boolean) => void;
  deleteScheduledDayPlan: (dateStr: string) => void;
  clearScheduledRange: (startDateStr: string, endDateStr: string) => void;
  generateGroceryFromScheduledRange: (startDateStr: string, endDateStr: string) => number;

  // App State & Modals
  isDemoMode: boolean;
  activeTab: AppNavigationTab;
  setActiveTab: (tab: AppNavigationTab) => void;
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

const LOCAL_STORAGE_KEY = 'health_seelye_app_state_v8';

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
  
  const [activeTab, setActiveTab] = useState<AppNavigationTab>('dashboard');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  const [waterGoalOz, setWaterGoalOz] = useState<number>(96);
  const [waterLogs, setWaterLogs] = useState<WaterLogEntry[]>([]);
  const [stepGoal, setStepGoal] = useState<number>(10000);
  const [stepLogs, setStepLogs] = useState<StepLogEntry[]>([]);
  const [lastStepSyncTimestamp, setLastStepSyncTimestamp] = useState<string | null>(null);
  const [stepSyncSource, setStepSyncSource] = useState<StepLogEntry['source']>('apple_health');
  const [simpleMovementActivities, setSimpleMovementActivities] = useState<SimpleMovementActivity[]>(DEFAULT_SIMPLE_DAILY_CHOICES);
  const [scheduledPlans, setScheduledPlans] = useState<Record<string, ScheduledDayPlan>>({});
  const [customMeals, setCustomMeals] = useState<BuiltCustomMeal[]>([]);
  const [editingMealLog, setEditingMealLog] = useState<{
    logId: string;
    meal: BuiltCustomMeal;
    mealIndex: number;
    dateStr: string;
    servings: number;
  } | null>(null);

  // Cloud Auth & Sync States
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>(isSupabaseConfigured ? 'synced' : 'local_only');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  
  const getLocalDateString = useCallback((d: Date = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const todayDate = useMemo(() => getLocalDateString(), [getLocalDateString]);
  const [selectedDate, setSelectedDate] = useState<string>(() => getLocalDateString());
  
  // Real-time ticking for fasting timer
  const [nowTick, setNowTick] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Initial Load from LocalStorage & Immediate URL Step Ingestion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        purgeLegacyLocalStorage();

        const saved =
          localStorage.getItem(LOCAL_STORAGE_KEY) ||
          localStorage.getItem('health_seelye_app_state_v7') ||
          localStorage.getItem('health_seelye_app_state_v6');

        let loadedStepLogs: StepLogEntry[] = [];

        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.profile) {
            const prof = { ...parsed.profile };
            // Purge all legacy or unconfigured default biometrics (ensure 0 unless explicitly configured)
            if (
              !prof.has_configured_biometrics ||
              (prof.height_cm === 178 && prof.current_weight_kg === 80) ||
              !prof.height_cm ||
              !prof.current_weight_kg
            ) {
              prof.height_cm = 0;
              prof.current_weight_kg = 0;
              prof.target_weight_kg = 0;
              prof.has_configured_biometrics = false;
            }
            setProfile(prof);
          }

          const customFoods = Array.isArray(parsed.customFoods)
            ? parsed.customFoods
            : (parsed.foods && Array.isArray(parsed.foods))
            ? parsed.foods.filter((f: FoodItem) => f.id.startsWith('cf-') || (!DEFAULT_FOODS.some((df) => df.id === f.id) && !f.id.includes('-v')))
            : [];
          setFoods([...DEFAULT_FOODS, ...customFoods]);

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
          if (parsed.stepLogs && Array.isArray(parsed.stepLogs)) {
            loadedStepLogs = parsed.stepLogs.filter((s: StepLogEntry) => !(s.steps === 8 && s.source === 'apple_health'));
          }
          if (parsed.simpleMovementActivities && Array.isArray(parsed.simpleMovementActivities)) {
            setSimpleMovementActivities(parsed.simpleMovementActivities);
          }
          if (parsed.scheduledPlans && typeof parsed.scheduledPlans === 'object') {
            setScheduledPlans(parsed.scheduledPlans);
          }
          if (parsed.customMeals && Array.isArray(parsed.customMeals)) {
            setCustomMeals(parsed.customMeals);
          }
        } else {
          setFoods(DEFAULT_FOODS);
          setWorkoutLogs(INITIAL_WORKOUT_LOGS);
        }

        // Direct check for incoming step sync in URL parameters
        try {
          const urlParams = new URLSearchParams(window.location.search);
          let rawParam = urlParams.get('sync_steps') || urlParams.get('steps');

          if (!rawParam && window.location.hash) {
            const hashQuery = window.location.hash.replace(/^#\??/, '');
            const hashParams = new URLSearchParams(hashQuery);
            rawParam = hashParams.get('sync_steps') || hashParams.get('steps');
          }

          if (rawParam && rawParam.trim().length > 0) {
            const cleanedDigits = rawParam.replace(/[^\d]/g, '');
            const parsedSteps = parseInt(cleanedDigits, 10);
            if (!isNaN(parsedSteps) && parsedSteps >= 0) {
              const localDate = getLocalDateString();
              const newEntry: StepLogEntry = {
                id: `stp-${Date.now()}`,
                steps: parsedSteps,
                distance_miles: Number((parsedSteps * 0.00045).toFixed(2)),
                calories_burned: Math.round(parsedSteps * 0.04),
                source: 'apple_health',
                logged_at: localDate,
              };
              loadedStepLogs = [newEntry, ...loadedStepLogs.filter((s) => s.logged_at !== localDate && s.logged_at !== new Date().toISOString().split('T')[0])];
              setLastStepSyncTimestamp(new Date().toISOString());
              setStepSyncSource('apple_health');
              window.history.replaceState({}, document.title, '/');

              if (supabase) {
                const client = supabase;
                client.auth.getSession().then(({ data: { session } }) => {
                  if (session?.user) {
                    client.auth.updateUser({
                      data: {
                        step_logs: loadedStepLogs,
                        latest_steps: parsedSteps,
                        last_step_sync: new Date().toISOString(),
                      },
                    }).catch(() => {});
                  }
                });
              }
            }
          }
        } catch {
          // Safe fail
        }

        setStepLogs(loadedStepLogs);
        stepLogsRef.current = loadedStepLogs;
      } catch (err) {
        console.warn('Failed to load local state:', err);
        setFoods(DEFAULT_FOODS);
      }
    }
  }, [getLocalDateString]);

  // 2. Persist to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userCustomFoods = foods.filter((f) => f.id.startsWith('cf-'));
        const stateToPersist = {
          profile,
          customFoods: userCustomFoods,
          foodLogs,
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
          scheduledPlans,
          customMeals,
        };
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
        } catch (storageErr) {
          console.warn('Storage quota hit while persisting state, purging legacy storage...', storageErr);
          purgeLegacyLocalStorage();
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
          } catch (secondaryErr) {
            try {
              const minimal = {
                profile,
                foodLogs: foodLogs.slice(0, 50),
                weightLogs: weightLogs.slice(0, 30),
                waterLogs: waterLogs.slice(0, 30),
                customMeals,
                simpleMovementActivities,
              };
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(minimal));
            } catch {}
          }
        }
      } catch (err) {
        console.warn('Failed to persist state:', err);
      }
    }
  }, [profile, foods, foodLogs, groceryList, weightLogs, workoutLogs, activeProgramId, notificationsEnabled, waterGoalOz, waterLogs, stepGoal, stepLogs, simpleMovementActivities, scheduledPlans, customMeals]);

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

  const stepLogsRef = useRef<StepLogEntry[]>(stepLogs);
  useEffect(() => {
    stepLogsRef.current = stepLogs;
  }, [stepLogs]);

  const authUserRef = useRef<any>(authUser);
  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  const customMealsRef = useRef<BuiltCustomMeal[]>(customMeals);
  useEffect(() => {
    customMealsRef.current = customMeals;
  }, [customMeals]);

  const simpleMovementsRef = useRef<SimpleMovementActivity[]>(simpleMovementActivities);
  useEffect(() => {
    simpleMovementsRef.current = simpleMovementActivities;
  }, [simpleMovementActivities]);

  const waterLogsRef = useRef<WaterLogEntry[]>(waterLogs);
  useEffect(() => {
    waterLogsRef.current = waterLogs;
  }, [waterLogs]);

  const workoutLogsRef = useRef<WorkoutSessionLog[]>(workoutLogs);
  useEffect(() => {
    workoutLogsRef.current = workoutLogs;
  }, [workoutLogs]);

  const scheduledPlansRef = useRef<Record<string, ScheduledDayPlan>>(scheduledPlans);
  useEffect(() => {
    scheduledPlansRef.current = scheduledPlans;
  }, [scheduledPlans]);

  const isSyncingRef = useRef<boolean>(false);
  const syncDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to push local profile to cloud safely via UPSERT with onConflict: 'id'
  const pushLocalProfileToCloud = async (client: any, user: any, p: UserProfile) => {
    try {
      const isConfigured = Boolean(
        (Number(p.height_cm) > 0 || Number(p.current_weight_kg) > 0) &&
        !(Number(p.height_cm) === 178 && Number(p.current_weight_kg) === 80 && Number(p.target_weight_kg) === 75)
      );

      const payload = {
        id: user.id,
        email: user.email || p.email,
        full_name: p.full_name || user.user_metadata?.full_name || 'Athlete',
        age: p.age || 35,
        height_cm: isConfigured ? Number(p.height_cm) : 0,
        current_weight_kg: isConfigured ? Number(p.current_weight_kg) : 0,
        target_weight_kg: isConfigured ? Number(p.target_weight_kg) : 0,
        sex: p.sex || 'male',
        activity_level: p.activity_level || 'moderate',
        goal: p.goal || 'cut_500',
        unit_preference: p.unit_preference || 'imperial',
        daily_calorie_target: p.daily_calorie_target || 2000,
        protein_target_g: p.protein_target_g || 150,
        carb_target_g: p.carb_target_g || 200,
        fat_target_g: p.fat_target_g || 60,
        fasting_protocol: p.fasting_protocol || '16_8',
        fasting_start_time: p.fasting_start_time || '20:00',
        meal_count: p.meal_count || 3,
        updated_at: p.updated_at || new Date().toISOString(),
      };

      const { error: upsertErr } = await (client.from('profiles') as any).upsert(payload, { onConflict: 'id' });
      if (upsertErr) {
        console.warn('Failed to upsert profile to cloud:', upsertErr);
      }
    } catch (err) {
      console.warn('Error pushing profile to cloud:', err);
    }
  };

  // 3. Supabase Cloud Sync Engine (Non-Destructive Reconciliation with Mutex Guard)
  const performCloudSync = useCallback(async (targetUser?: any) => {
    const user = targetUser || authUserRef.current;
    if (!isSupabaseConfigured || !supabase || !user) return;
    if (isSyncingRef.current) return; // Prevent concurrent re-entrant executions

    isSyncingRef.current = true;
    setSyncStatus('syncing');

    try {
      const client = supabase;

      // Always fetch fresh user metadata from server so cross-device updates propagate immediately
      let liveUser = user;
      try {
        const { data: freshUserData } = await client.auth.getUser();
        if (freshUserData?.user) {
          liveUser = freshUserData.user;
          setAuthUser(liveUser);
          authUserRef.current = liveUser;
        }
      } catch {}

      // A. Profile Reconciliation (Strict Zero-Default Guard)
      const { data: cloudProfile, error: profileErr } = await (client.from('profiles') as any)
        .select('*')
        .eq('id', liveUser.id)
        .maybeSingle();

      const localProf = profileRef.current;
      const localHasBiometrics = Boolean(
        (Number(localProf.height_cm) > 0 || Number(localProf.current_weight_kg) > 0) &&
        !(Number(localProf.height_cm) === 178 && Number(localProf.current_weight_kg) === 80 && Number(localProf.target_weight_kg) === 75)
      );

      if (cloudProfile && !profileErr) {
        const cloudHeight = Number(cloudProfile.height_cm) || 0;
        const cloudWeight = Number(cloudProfile.current_weight_kg) || 0;
        const cloudTarget = Number(cloudProfile.target_weight_kg) || 0;

        // Any cloud profile that has real biometrics (>0) and not the old 178/80/75 placeholder is valid
        const cloudHasBiometrics = Boolean(
          (cloudHeight > 0 || cloudWeight > 0) &&
          !(cloudHeight === 178 && cloudWeight === 80 && cloudTarget === 75)
        );

        if (cloudHasBiometrics && !localHasBiometrics) {
          // Cloud has real biometrics, local device (iPhone/iPad) is fresh/unconfigured.
          // ADOPT CLOUD BIOMETRICS ON THIS FRESH DEVICE:
          setProfile((prev) => ({
            ...prev,
            id: liveUser.id,
            email: liveUser.email || cloudProfile.email || prev.email,
            full_name: cloudProfile.full_name || liveUser.user_metadata?.full_name || prev.full_name || 'Athlete',
            age: cloudProfile.age ?? prev.age,
            height_cm: cloudHeight,
            current_weight_kg: cloudWeight,
            target_weight_kg: cloudTarget,
            has_configured_biometrics: true,
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
            updated_at: cloudProfile.updated_at || prev.updated_at,
          }));
        } else if (!cloudHasBiometrics && localHasBiometrics) {
          // Local device (Laptop) has real configured biometrics, but cloud was empty.
          // PUSH LOCAL BIOMETRICS TO CLOUD:
          await pushLocalProfileToCloud(client, liveUser, localProf);
          setProfile((prev) => ({
            ...prev,
            id: liveUser.id,
            email: liveUser.email || prev.email,
          }));
        } else if (cloudHasBiometrics && localHasBiometrics) {
          // Both have configured biometrics. Compare updated_at timestamps.
          const localTime = localProf.updated_at ? new Date(localProf.updated_at).getTime() : 0;
          const cloudTime = cloudProfile.updated_at ? new Date(cloudProfile.updated_at).getTime() : 0;

          if (localTime > cloudTime) {
            await pushLocalProfileToCloud(client, liveUser, localProf);
          } else {
            setProfile((prev) => ({
              ...prev,
              id: liveUser.id,
              email: liveUser.email || cloudProfile.email || prev.email,
              full_name: cloudProfile.full_name || liveUser.user_metadata?.full_name || prev.full_name || 'Athlete',
              age: cloudProfile.age ?? prev.age,
              height_cm: cloudHeight,
              current_weight_kg: cloudWeight,
              target_weight_kg: cloudTarget,
              has_configured_biometrics: true,
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
              updated_at: cloudProfile.updated_at,
            }));
          }
        } else {
          // Neither has biometrics configured yet -> Strictly keep 0
          setProfile((prev) => ({
            ...prev,
            id: liveUser.id,
            email: liveUser.email || prev.email,
            full_name: cloudProfile.full_name || liveUser.user_metadata?.full_name || prev.full_name || 'Athlete',
            height_cm: 0,
            current_weight_kg: 0,
            target_weight_kg: 0,
            has_configured_biometrics: false,
          }));
        }
      } else {
        // Cloud profile row does not exist yet!
        if (localHasBiometrics) {
          await pushLocalProfileToCloud(client, liveUser, localProf);
        } else {
          await (client.from('profiles') as any).upsert({
            id: liveUser.id,
            email: liveUser.email,
            full_name: liveUser.user_metadata?.full_name || localProf.full_name || 'Athlete',
            age: localProf.age || 35,
            height_cm: 0,
            current_weight_kg: 0,
            target_weight_kg: 0,
            sex: localProf.sex || 'male',
            activity_level: localProf.activity_level || 'moderate',
            goal: localProf.goal || 'cut_500',
            unit_preference: localProf.unit_preference || 'imperial',
            daily_calorie_target: localProf.daily_calorie_target || 2000,
            protein_target_g: localProf.protein_target_g || 150,
            carb_target_g: localProf.carb_target_g || 200,
            fat_target_g: localProf.fat_target_g || 60,
            fasting_protocol: localProf.fasting_protocol || '16_8',
            fasting_start_time: localProf.fasting_start_time || '20:00',
            meal_count: localProf.meal_count || 3,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        }
      }

      // B. Food Logs Cloud Table Fetch (Full Reconciliation in Section E)
      let cloudFoodLogs: any[] = [];
      try {
        const { data: dbFoodData, error: dbFoodErr } = await (client.from('food_logs') as any)
          .select('*')
          .eq('user_id', liveUser.id);
        if (!dbFoodErr && Array.isArray(dbFoodData)) {
          cloudFoodLogs = dbFoodData;
        }
      } catch (fErr) {
        console.warn('Food logs cloud fetch warning:', fErr);
      }

      // C. Weight Logs Sync
      const { data: cloudWeightLogs } = await (client.from('weight_logs') as any)
        .select('*')
        .eq('user_id', liveUser.id)
        .order('logged_at', { ascending: false });

      if (cloudWeightLogs && Array.isArray(cloudWeightLogs)) {
        const cloudDates = new Set(cloudWeightLogs.map((c: any) => c.logged_at));
        const currentLocalWeights = weightLogsRef.current;
        const localOnlyWeights = currentLocalWeights.filter((w) => !cloudDates.has(w.logged_at));

        if (localOnlyWeights.length > 0) {
          const weightRows = localOnlyWeights.map((w) => ({
            user_id: liveUser.id,
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

      // D. Step Logs Sync (Triple-Resilient Cloud <-> Local Non-Destructive Bidirectional Sync)
      try {
        const cloudStepEntries: any[] = [];

        // Source 1: Auth User Metadata (zero-migration guarantee, always works across devices)
        if (liveUser.user_metadata?.step_logs && Array.isArray(liveUser.user_metadata.step_logs)) {
          liveUser.user_metadata.step_logs.forEach((s: any) => {
            if (s && typeof s === 'object') cloudStepEntries.push(s);
          });
        }

        // Source 2: Step Logs Database Table (if table exists)
        try {
          const { data: cloudStepLogs, error: stepFetchErr } = await (client.from('step_logs') as any)
            .select('*')
            .eq('user_id', liveUser.id)
            .order('logged_at', { ascending: false });

          if (!stepFetchErr && cloudStepLogs && Array.isArray(cloudStepLogs)) {
            cloudStepLogs.forEach((cs: any) => cloudStepEntries.push(cs));
          }
        } catch {
          // Table might not exist yet
        }

        // Source 3: Cloud Profile Metadata fallback
        if (cloudProfile && cloudProfile.equipment_inventory && typeof cloudProfile.equipment_inventory === 'object') {
          if (Array.isArray((cloudProfile.equipment_inventory as any).step_logs)) {
            (cloudProfile.equipment_inventory as any).step_logs.forEach((s: any) => cloudStepEntries.push(s));
          }
        }

        const cloudMap = new Map<string, any>();
        cloudStepEntries.forEach((cs: any) => {
          const dateKey = String(cs.logged_at).split('T')[0];
          const existing = cloudMap.get(dateKey);
          const steps = Number(cs.steps) || 0;
          if (!existing || steps > (Number(existing.steps) || 0)) {
            cloudMap.set(dateKey, { ...cs, steps, logged_at: dateKey });
          }
        });

        // Ensure we load from localStorage fallback if stepLogsRef hasn't rendered yet
        let currentLocalSteps = stepLogsRef.current || [];
        if (currentLocalSteps.length === 0 && typeof window !== 'undefined') {
          try {
            const saved =
              localStorage.getItem(LOCAL_STORAGE_KEY) ||
              localStorage.getItem('health_seelye_app_state_v7') ||
              localStorage.getItem('health_seelye_app_state_v6');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed.stepLogs && Array.isArray(parsed.stepLogs)) {
                currentLocalSteps = parsed.stepLogs.filter((s: StepLogEntry) => !(s.steps === 8 && s.source === 'apple_health'));
              }
            }
          } catch {}
        }

        const localMap = new Map<string, StepLogEntry>();
        currentLocalSteps.forEach((ls) => {
          const dateKey = String(ls.logged_at).split('T')[0];
          const existing = localMap.get(dateKey);
          const steps = Number(ls.steps) || 0;
          if (!existing || steps > (Number(existing.steps) || 0)) {
            localMap.set(dateKey, { ...ls, steps, logged_at: dateKey });
          }
        });

        const allDates = new Set<string>();
        cloudMap.forEach((_, k) => allDates.add(k));
        localMap.forEach((_, k) => allDates.add(k));
        const mergedSteps: StepLogEntry[] = [];
        const dateKeys = Array.from(allDates);
        let hasLocalUpdateForCloud = false;

        for (const dateKey of dateKeys) {
          const cloudEntry = cloudMap.get(dateKey);
          const localEntry = localMap.get(dateKey);

          if (cloudEntry && localEntry) {
            const cloudCount = Number(cloudEntry.steps) || 0;
            const localCount = Number(localEntry.steps) || 0;

            if (localCount > cloudCount) {
              hasLocalUpdateForCloud = true;
              mergedSteps.push({
                id: cloudEntry.id || localEntry.id,
                steps: localCount,
                distance_miles: localEntry.distance_miles ?? Number((localCount * 0.00045).toFixed(2)),
                calories_burned: localEntry.calories_burned ?? Math.round(localCount * 0.04),
                source: localEntry.source || 'apple_health',
                logged_at: dateKey,
              });

              (client.from('step_logs') as any)
                .upsert({
                  id: cloudEntry.id,
                  user_id: liveUser.id,
                  steps: localCount,
                  distance_miles: localEntry.distance_miles ?? Number((localCount * 0.00045).toFixed(2)),
                  calories_burned: localEntry.calories_burned ?? Math.round(localCount * 0.04),
                  source: localEntry.source || 'apple_health',
                  logged_at: dateKey,
                  updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id,logged_at' })
                .catch(() => {});
            } else {
              mergedSteps.push({
                id: cloudEntry.id,
                steps: cloudCount,
                distance_miles: cloudEntry.distance_miles ? Number(cloudEntry.distance_miles) : Number((cloudCount * 0.00045).toFixed(2)),
                calories_burned: cloudEntry.calories_burned ? Number(cloudEntry.calories_burned) : Math.round(cloudCount * 0.04),
                source: cloudEntry.source || 'apple_health',
                logged_at: dateKey,
              });
            }
          } else if (localEntry && !cloudEntry) {
            const stepCount = Number(localEntry.steps) || 0;
            if (stepCount > 0) {
              hasLocalUpdateForCloud = true;
              mergedSteps.push({
                id: localEntry.id,
                steps: stepCount,
                distance_miles: localEntry.distance_miles ?? Number((stepCount * 0.00045).toFixed(2)),
                calories_burned: localEntry.calories_burned ?? Math.round(stepCount * 0.04),
                source: localEntry.source || 'apple_health',
                logged_at: dateKey,
              });

              (client.from('step_logs') as any)
                .insert({
                  user_id: liveUser.id,
                  steps: stepCount,
                  distance_miles: localEntry.distance_miles ?? Number((stepCount * 0.00045).toFixed(2)),
                  calories_burned: localEntry.calories_burned ?? Math.round(stepCount * 0.04),
                  source: localEntry.source || 'apple_health',
                  logged_at: dateKey,
                })
                .catch(() => {});
            }
          } else if (cloudEntry && !localEntry) {
            const cloudCount = Number(cloudEntry.steps) || 0;
            mergedSteps.push({
              id: cloudEntry.id,
              steps: cloudCount,
              distance_miles: cloudEntry.distance_miles ? Number(cloudEntry.distance_miles) : Number((cloudCount * 0.00045).toFixed(2)),
              calories_burned: cloudEntry.calories_burned ? Number(cloudEntry.calories_burned) : Math.round(cloudCount * 0.04),
              source: cloudEntry.source || 'apple_health',
              logged_at: dateKey,
            });
          }
        }

        mergedSteps.sort((a, b) => b.logged_at.localeCompare(a.logged_at));
        setStepLogs(mergedSteps);
        stepLogsRef.current = mergedSteps;
        if (mergedSteps.length > 0) {
          setLastStepSyncTimestamp(new Date().toISOString());
        }

        if (hasLocalUpdateForCloud || (mergedSteps.length > 0 && (!liveUser.user_metadata?.step_logs || liveUser.user_metadata.step_logs.length !== mergedSteps.length))) {
          client.auth.updateUser({
            data: {
              step_logs: mergedSteps,
              latest_step_sync: new Date().toISOString(),
            },
          }).catch(() => {});

          (client.from('profiles') as any).update({
            equipment_inventory: {
              step_logs: mergedSteps,
            },
            updated_at: new Date().toISOString(),
          }).eq('id', liveUser.id).catch(() => {});
        }
      } catch (stepErr) {
        console.warn('Step logs sync warning:', stepErr);
      }

      // E. Multi-Device App Sync Bundle (Food Logs, Custom Meals, Daily Movements, Hydration Water, Workout Logs, Scheduled Plans)
      try {
        let cloudBundle: any = liveUser.user_metadata?.app_sync_bundle || null;
        if (!cloudBundle && cloudProfile?.equipment_inventory && typeof cloudProfile.equipment_inventory === 'object') {
          cloudBundle = (cloudProfile.equipment_inventory as any).app_sync_bundle || null;
        }

        const localCustomMeals = customMealsRef.current || [];
        const localSimpleMovements = simpleMovementsRef.current || [];
        const localWaterLogs = waterLogsRef.current || [];
        const localWorkoutLogs = workoutLogsRef.current || [];
        const localScheduledPlans = scheduledPlansRef.current || {};
        const localFoodLogs = foodLogsRef.current || [];

        let hasBundleUpdate = false;

        // 1. Food Logs Reconciliation (Multi-Device Bundle + Cloud DB)
        const cloudBundleFoodLogs: FoodLogEntry[] = Array.isArray(cloudBundle?.food_logs) ? cloudBundle.food_logs : [];
        const foodMap = new Map<string, FoodLogEntry>();
        const sigMap = new Map<string, string>();

        const makeFoodSignature = (entry: FoodLogEntry): string => {
          const d = entry.logged_at ? String(entry.logged_at).split('T')[0] : todayDate;
          const name = (entry.food_name || '').trim().toLowerCase();
          const cals = Math.round(Number(entry.calories) || 0);
          const meal = Number(entry.meal_index) || 1;
          return `${d}_m${meal}_${name}_${cals}`;
        };

        // Source 1: PostgreSQL Table rows
        cloudFoodLogs.forEach((c: any) => {
          if (!c || !c.id) return;
          const normalized: FoodLogEntry = {
            id: c.id,
            user_id: c.user_id || liveUser.id,
            food_id: c.food_id || c.id,
            food_name: c.food_name || 'Food Item',
            grams_consumed: Number(c.grams_consumed) || 100,
            meal_index: Number(c.meal_index) || 1,
            logged_at: c.logged_at ? String(c.logged_at).split('T')[0] : todayDate,
            calories: Number(c.calories) || 0,
            protein_g: Number(c.protein_g) || 0,
            carbs_g: Number(c.carbs_g) || 0,
            fat_g: Number(c.fat_g) || 0,
            created_at: c.created_at || new Date().toISOString(),
          };
          foodMap.set(normalized.id, normalized);
          sigMap.set(makeFoodSignature(normalized), normalized.id);
        });

        // Source 2: App Sync Bundle
        cloudBundleFoodLogs.forEach((cb) => {
          if (!cb || !cb.id) return;
          const sig = makeFoodSignature(cb);
          if (foodMap.has(cb.id)) {
            const existing = foodMap.get(cb.id)!;
            if (cb.custom_meal_id && !existing.custom_meal_id) {
              foodMap.set(cb.id, { ...existing, custom_meal_id: cb.custom_meal_id, custom_meal_data: cb.custom_meal_data, servings_logged: cb.servings_logged });
            }
          } else if (sigMap.has(sig)) {
            const existingId = sigMap.get(sig)!;
            const existing = foodMap.get(existingId)!;
            if (cb.custom_meal_id && !existing.custom_meal_id) {
              foodMap.set(existingId, { ...existing, custom_meal_id: cb.custom_meal_id, custom_meal_data: cb.custom_meal_data, servings_logged: cb.servings_logged });
            }
          } else {
            foodMap.set(cb.id, cb);
            sigMap.set(sig, cb.id);
          }
        });

        // Source 3: Local device food logs
        localFoodLogs.forEach((l) => {
          if (!l || !l.id) return;
          const sig = makeFoodSignature(l);
          if (!foodMap.has(l.id) && !sigMap.has(sig)) {
            foodMap.set(l.id, l);
            sigMap.set(sig, l.id);
            hasBundleUpdate = true;
          } else {
            const existingId = foodMap.has(l.id) ? l.id : sigMap.get(sig)!;
            const existing = foodMap.get(existingId)!;
            if (l.custom_meal_id && !existing.custom_meal_id) {
              foodMap.set(existingId, { ...existing, custom_meal_id: l.custom_meal_id, custom_meal_data: l.custom_meal_data, servings_logged: l.servings_logged });
              hasBundleUpdate = true;
            }
          }
        });

        const mergedFoodLogs = Array.from(foodMap.values()).sort((a, b) => {
          const dateComp = (b.logged_at || '').localeCompare(a.logged_at || '');
          if (dateComp !== 0) return dateComp;
          return (a.meal_index || 1) - (b.meal_index || 1);
        });

        setFoodLogs(mergedFoodLogs);
        foodLogsRef.current = mergedFoodLogs;

        if (localFoodLogs.length > 0 && cloudBundleFoodLogs.length === 0) {
          hasBundleUpdate = true;
        }

        // Push any unpersisted rows to PostgreSQL food_logs table in background
        const cloudDbIds = new Set(cloudFoodLogs.map((c: any) => c.id));
        const unpersistedDbLogs = mergedFoodLogs.filter((l) => !cloudDbIds.has(l.id));
        if (unpersistedDbLogs.length > 0) {
          const rowsToInsert = unpersistedDbLogs.slice(0, 50).map((l) => ({
            id: isUuid(l.id) ? l.id : undefined,
            user_id: liveUser.id,
            food_id: isUuid(l.food_id) ? l.food_id : null,
            food_name: l.food_name,
            grams_consumed: Number(l.grams_consumed) || 100,
            meal_index: Number(l.meal_index) || 1,
            logged_at: l.logged_at ? String(l.logged_at).split('T')[0] : todayDate,
            calories: Number(l.calories) || 0,
            protein_g: Number(l.protein_g) || 0,
            carbs_g: Number(l.carbs_g) || 0,
            fat_g: Number(l.fat_g) || 0,
          }));
          (client.from('food_logs') as any)
            .insert(rowsToInsert)
            .select()
            .then(({ data: insertedRows }: any) => {
              if (insertedRows && Array.isArray(insertedRows)) {
                setFoodLogs((prev) => {
                  const copy = [...prev];
                  insertedRows.forEach((ir: any, idx: number) => {
                    if (unpersistedDbLogs[idx]) {
                      const match = copy.find((c) => c.id === unpersistedDbLogs[idx].id);
                      if (match && ir.id) match.id = ir.id;
                    }
                  });
                  return copy;
                });
              }
            })
            .catch(() => {});
        }

        // 2. Custom Meals Reconciliation
        const cloudCustomMeals: BuiltCustomMeal[] = Array.isArray(cloudBundle?.custom_meals) ? cloudBundle.custom_meals : [];
        const mealMap = new Map<string, BuiltCustomMeal>();
        cloudCustomMeals.forEach((cm) => {
          if (cm && cm.id) mealMap.set(cm.id, cm);
        });
        localCustomMeals.forEach((lm) => {
          if (lm && lm.id) {
            if (!mealMap.has(lm.id)) {
              mealMap.set(lm.id, lm);
              hasBundleUpdate = true;
            } else {
              const existing = mealMap.get(lm.id)!;
              const localTime = lm.created_at ? new Date(lm.created_at).getTime() : 0;
              const cloudTime = existing.created_at ? new Date(existing.created_at).getTime() : 0;
              if (localTime > cloudTime) {
                mealMap.set(lm.id, lm);
                hasBundleUpdate = true;
              }
            }
          }
        });
        const mergedCustomMeals = Array.from(mealMap.values());
        setCustomMeals(mergedCustomMeals);
        customMealsRef.current = mergedCustomMeals;

        // 3. Simple Movements (Daily Chosen Activities)
        let mergedMovements = localSimpleMovements;
        const cloudMovements: SimpleMovementActivity[] = Array.isArray(cloudBundle?.simple_movements) ? cloudBundle.simple_movements : [];
        if (cloudMovements.length > 0) {
          const localCount = localSimpleMovements.length;
          const cloudCount = cloudMovements.length;
          if (cloudCount > 0 && localCount === 0) {
            mergedMovements = cloudMovements;
            setSimpleMovementActivities(mergedMovements);
            simpleMovementsRef.current = mergedMovements;
          } else if (localCount > 0) {
            hasBundleUpdate = true;
          }
        } else if (localSimpleMovements.length > 0) {
          hasBundleUpdate = true;
        }

        // 4. Water Logs Reconciliation
        const cloudWaterLogs: WaterLogEntry[] = Array.isArray(cloudBundle?.water_logs) ? cloudBundle.water_logs : [];
        const waterMap = new Map<string, WaterLogEntry>();
        cloudWaterLogs.forEach((cw) => {
          if (cw && cw.id) waterMap.set(cw.id, cw);
        });
        localWaterLogs.forEach((lw) => {
          if (lw && lw.id && !waterMap.has(lw.id)) {
            waterMap.set(lw.id, lw);
            hasBundleUpdate = true;
          }
        });
        const mergedWaterLogs = Array.from(waterMap.values()).sort((a, b) => b.logged_at.localeCompare(a.logged_at));
        setWaterLogs(mergedWaterLogs);
        waterLogsRef.current = mergedWaterLogs;

        // 5. Workout Logs Reconciliation
        const cloudWorkoutLogs: WorkoutSessionLog[] = Array.isArray(cloudBundle?.workout_logs) ? cloudBundle.workout_logs : [];
        const workoutMap = new Map<string, WorkoutSessionLog>();
        cloudWorkoutLogs.forEach((cw) => {
          if (cw && cw.id) workoutMap.set(cw.id, cw);
        });
        localWorkoutLogs.forEach((lw) => {
          if (lw && lw.id && !workoutMap.has(lw.id)) {
            workoutMap.set(lw.id, lw);
            hasBundleUpdate = true;
          }
        });
        const mergedWorkoutLogs = Array.from(workoutMap.values());
        setWorkoutLogs(mergedWorkoutLogs);
        workoutLogsRef.current = mergedWorkoutLogs;

        // 6. Scheduled Plans Reconciliation
        const cloudPlans: Record<string, ScheduledDayPlan> = (cloudBundle?.scheduled_plans && typeof cloudBundle.scheduled_plans === 'object') ? cloudBundle.scheduled_plans : {};
        const mergedPlans = { ...cloudPlans, ...localScheduledPlans };
        if (Object.keys(localScheduledPlans).length > 0) {
          hasBundleUpdate = true;
        }
        setScheduledPlans(mergedPlans);
        scheduledPlansRef.current = mergedPlans;

        // Push bundle if local had additions, cloud was missing bundle, or cloud food_logs was missing
        const updatedBundle = {
          food_logs: mergedFoodLogs.slice(0, 150),
          custom_meals: mergedCustomMeals,
          simple_movements: mergedMovements,
          water_logs: mergedWaterLogs,
          workout_logs: mergedWorkoutLogs,
          scheduled_plans: mergedPlans,
          last_bundle_sync: new Date().toISOString(),
        };

        if (hasBundleUpdate || !cloudBundle || !cloudBundle.food_logs) {
          client.auth.updateUser({
            data: {
              app_sync_bundle: updatedBundle,
            },
          }).catch(() => {});

          const currentEq = (cloudProfile?.equipment_inventory && typeof cloudProfile.equipment_inventory === 'object')
            ? cloudProfile.equipment_inventory
            : {};
          (client.from('profiles') as any).update({
            equipment_inventory: {
              ...currentEq,
              app_sync_bundle: updatedBundle,
            },
            updated_at: new Date().toISOString(),
          }).eq('id', liveUser.id).catch(() => {});
        }
      } catch (bundleErr) {
        console.warn('App sync bundle warning:', bundleErr);
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

  const triggerDebouncedSync = useCallback(() => {
    if (syncDebounceTimerRef.current) {
      clearTimeout(syncDebounceTimerRef.current);
    }
    syncDebounceTimerRef.current = setTimeout(() => {
      performCloudSync().catch(() => {});
    }, 1500);
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

  // 5. Automatic Cross-Device Poller & Lifecycle Sync (Tab Focus, App Open, Page Visibility)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !authUser) return;

    const handleLifecycleSync = () => {
      if (document.visibilityState === 'visible') {
        performCloudSync();
      }
    };

    window.addEventListener('focus', handleLifecycleSync);
    window.addEventListener('pageshow', handleLifecycleSync);
    document.addEventListener('visibilitychange', handleLifecycleSync);

    // Background interval check every 30s
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        performCloudSync();
      }
    }, 30000);

    return () => {
      window.removeEventListener('focus', handleLifecycleSync);
      window.removeEventListener('pageshow', handleLifecycleSync);
      document.removeEventListener('visibilitychange', handleLifecycleSync);
      clearInterval(interval);
    };
  }, [authUser, performCloudSync]);

  // Auth Methods
  const signInWithPassword = async (email: string, password: string) => {
    if (!supabase) return { error: { message: 'Cloud database not configured' } };
    purgeLegacyLocalStorage();
    let res: any;
    try {
      res = await supabase.auth.signInWithPassword({ email, password });
    } catch (err: any) {
      if (/quota/i.test(err?.message || '')) {
        purgeLegacyLocalStorage();
        try {
          res = await supabase.auth.signInWithPassword({ email, password });
        } catch (retryErr: any) {
          return { error: retryErr };
        }
      } else {
        return { error: err };
      }
    }
    if (res?.error && /quota/i.test(res.error.message || '')) {
      purgeLegacyLocalStorage();
      res = await supabase.auth.signInWithPassword({ email, password });
    }
    if (!res.error && res.data?.user) {
      setAuthUser(res.data.user);
      authUserRef.current = res.data.user;
      await performCloudSync(res.data.user);
    }
    return { error: res.error };
  };

  const signUpWithPassword = async (email: string, password: string, fullName?: string) => {
    if (!supabase) return { error: { message: 'Cloud database not configured' } };
    purgeLegacyLocalStorage();
    const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://health.seelye.info/';
    let res: any;
    try {
      res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || (profile.full_name === 'John Seelye' ? 'Athlete' : profile.full_name) || 'Athlete' },
          emailRedirectTo,
        },
      });
    } catch (err: any) {
      if (/quota/i.test(err?.message || '')) {
        purgeLegacyLocalStorage();
        try {
          res = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName || (profile.full_name === 'John Seelye' ? 'Athlete' : profile.full_name) || 'Athlete' },
              emailRedirectTo,
            },
          });
        } catch (retryErr: any) {
          return { error: retryErr };
        }
      } else {
        return { error: err };
      }
    }
    if (res?.error && /quota/i.test(res.error.message || '')) {
      purgeLegacyLocalStorage();
      res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || (profile.full_name === 'John Seelye' ? 'Athlete' : profile.full_name) || 'Athlete' },
          emailRedirectTo,
        },
      });
    }
    if (!res.error && res.data?.user) {
      setAuthUser(res.data.user);
      authUserRef.current = res.data.user;
      setProfile((prev) => ({ ...prev, full_name: fullName || 'Athlete', email }));
      await pushLocalProfileToCloud(supabase, res.data.user, {
        ...profileRef.current,
        full_name: fullName || profileRef.current.full_name || 'Athlete',
        email,
      });
      await performCloudSync(res.data.user);
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

  // Macro Calculation Engine
  const calculatedMacros = useMemo(() => {
    return calculateMacroTargets({
      weightKg: profile.current_weight_kg,
      heightCm: profile.height_cm,
      age: profile.age,
      sex: profile.sex,
      activityLevel: profile.activity_level,
      goal: profile.goal,
    });
  }, [profile.current_weight_kg, profile.height_cm, profile.age, profile.sex, profile.activity_level, profile.goal]);

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
    return foodLogs.filter((log) => {
      if (!log.logged_at) return false;
      return String(log.logged_at).split('T')[0] === todayDate;
    });
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

  // Compute Selected Day's Food Logs & Macros (MyFitnessPal date-selectable diary)
  const selectedDayFoodLogs = useMemo(() => {
    return foodLogs.filter((log) => {
      if (!log.logged_at) return false;
      return String(log.logged_at).split('T')[0] === selectedDate;
    });
  }, [foodLogs, selectedDate]);

  const selectedDayMacros = useMemo(() => {
    return selectedDayFoodLogs.reduce(
      (acc, item) => ({
        calories: Math.round(acc.calories + item.calories),
        protein: Math.round(acc.protein + item.protein_g),
        carbs: Math.round(acc.carbs + item.carbs_g),
        fat: Math.round(acc.fat + item.fat_g),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [selectedDayFoodLogs]);

  const selectedDayRemaining = useMemo(() => {
    return {
      calories: Math.max(0, profile.daily_calorie_target - selectedDayMacros.calories),
      protein: Math.max(0, profile.protein_target_g - selectedDayMacros.protein),
      carbs: Math.max(0, profile.carb_target_g - selectedDayMacros.carbs),
      fat: Math.max(0, profile.fat_target_g - selectedDayMacros.fat),
    };
  }, [profile, selectedDayMacros]);

  const copyDayFoodLogs = useCallback((fromDateStr: string, toDateStr: string) => {
    const fromDateOnly = fromDateStr ? fromDateStr.split('T')[0] : '';
    const toDateOnly = toDateStr ? toDateStr.split('T')[0] : '';
    const logsToCopy = foodLogs.filter((l) => {
      if (!l.logged_at) return false;
      return String(l.logged_at).split('T')[0] === fromDateOnly;
    });
    if (logsToCopy.length === 0) return 0;

    const newLogs: FoodLogEntry[] = logsToCopy.map((log, idx) => ({
      ...log,
      id: `copy-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      logged_at: toDateOnly,
      created_at: new Date().toISOString(),
    }));

    setFoodLogs((prev) => [...newLogs, ...prev]);
    triggerDebouncedSync();
    return newLogs.length;
  }, [foodLogs, triggerDebouncedSync]);

  const quickLogCalories = useCallback((
    name: string,
    calories: number,
    mealIndex: number,
    dateStr?: string,
    protein?: number,
    carbs?: number,
    fat?: number
  ) => {
    const targetDate = dateStr ? String(dateStr).split('T')[0] : (selectedDate || todayDate);
    const p = protein ?? Math.round((calories * 0.25) / 4);
    const c = carbs ?? Math.round((calories * 0.5) / 4);
    const f = fat ?? Math.round((calories * 0.25) / 9);

    const quickFood: FoodItem = {
      id: `quick-${Date.now()}`,
      name: name.trim() || 'Quick Food Log',
      category: 'grains_carbs',
      calories_per_100g: calories,
      protein_per_100g: p,
      carbs_per_100g: c,
      fat_per_100g: f,
      is_gluten_free: false,
      is_dairy_free: false,
      serving_size_g: 100,
      default_unit: 'serving',
      storage_type: 'pantry_monthly',
    };

    const newEntry: FoodLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: profile.id,
      food_id: quickFood.id,
      food_name: quickFood.name,
      grams_consumed: 100,
      meal_index: mealIndex,
      logged_at: targetDate,
      calories,
      protein_g: p,
      carbs_g: c,
      fat_g: f,
      created_at: new Date().toISOString(),
    };

    setFoodLogs((prev) => [newEntry, ...prev]);
    triggerDebouncedSync();

    const user = authUserRef.current;
    if (supabase && user) {
      (supabase.from('food_logs') as any)
        .insert({
          user_id: user.id,
          food_id: null,
          food_name: newEntry.food_name,
          grams_consumed: 100,
          meal_index: mealIndex,
          logged_at: targetDate,
          calories,
          protein_g: p,
          carbs_g: c,
          fat_g: f,
        })
        .select()
        .single()
        .then(({ data }: any) => {
          if (data?.id) {
            setFoodLogs((prev) =>
              prev.map((l) => (l.id === newEntry.id ? { ...l, id: data.id } : l))
            );
          }
        })
        .catch(() => {});
    }

    return newEntry.id;
  }, [selectedDate, todayDate, profile.id, triggerDebouncedSync]);

  const updateFoodLog = useCallback((id: string, updates: Partial<FoodLogEntry>) => {
    setFoodLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...updates } : log))
    );
    triggerDebouncedSync();
    const user = authUserRef.current;
    if (supabase && user && (isUuid(id) || !id.startsWith('log-'))) {
      (supabase.from('food_logs') as any).update(updates).eq('id', id).then(() => {});
    }
  }, [triggerDebouncedSync]);

  // Custom Meals Management & Diary Integration
  const saveCustomMeal = useCallback((meal: BuiltCustomMeal) => {
    setCustomMeals((prev) => {
      const idx = prev.findIndex((m) => m.id === meal.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = meal;
        return next;
      }
      return [meal, ...prev];
    });
  }, []);

  const deleteCustomMeal = useCallback((id: string) => {
    setCustomMeals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const logBuiltMealToDiary = useCallback(
    (
      meal: BuiltCustomMeal,
      options: {
        servings: number;
        mealIndex: number;
        dateStr?: string;
        logAsSingleItem?: boolean;
      }
    ) => {
      const targetDate = options.dateStr ? String(options.dateStr).split('T')[0] : (selectedDate || todayDate);
      const servings = Math.max(0.1, options.servings || 1);
      const asSingle = options.logAsSingleItem !== false;

      // Always save or update meal in library
      saveCustomMeal(meal);

      if (asSingle) {
        const perServing = meal.per_serving_nutrition;
        const totalCals = Math.round(perServing.calories * servings);
        const totalProt = Number((perServing.protein_g * servings).toFixed(1));
        const totalCarbs = Number((perServing.carbs_g * servings).toFixed(1));
        const totalFat = Number((perServing.fat_g * servings).toFixed(1));
        const totalGrams = Math.round(perServing.total_weight_g * servings) || 100;

        const customFoodItem: FoodItem = {
          id: `built-food-${meal.id}`,
          name: `${meal.name} (${servings === 1 ? '1 serving' : `${servings} servings`})`,
          category: 'grains_carbs',
          calories_per_100g: totalGrams > 0 ? Math.round((totalCals / totalGrams) * 100) : totalCals,
          protein_per_100g: totalGrams > 0 ? Number(((totalProt / totalGrams) * 100).toFixed(1)) : totalProt,
          carbs_per_100g: totalGrams > 0 ? Number(((totalCarbs / totalGrams) * 100).toFixed(1)) : totalCarbs,
          fat_per_100g: totalGrams > 0 ? Number(((totalFat / totalGrams) * 100).toFixed(1)) : totalFat,
          fiber_per_100g: Number(((perServing.fiber_g * servings / totalGrams) * 100).toFixed(1)),
          sugar_per_100g: Number(((perServing.sugar_g * servings / totalGrams) * 100).toFixed(1)),
          saturated_fat_per_100g: Number(((perServing.saturated_fat_g * servings / totalGrams) * 100).toFixed(1)),
          sodium_per_100g: Math.round((perServing.sodium_mg * servings / totalGrams) * 100),
          potassium_per_100g: Math.round((perServing.potassium_mg * servings / totalGrams) * 100),
          is_gluten_free: false,
          is_dairy_free: false,
          serving_size_g: totalGrams,
          default_unit: 'serving',
          storage_type: 'fresh_weekly',
        };

        const newEntry: FoodLogEntry = {
          id: `log-meal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          user_id: profile.id,
          food_id: customFoodItem.id,
          food_name: customFoodItem.name,
          grams_consumed: totalGrams,
          meal_index: options.mealIndex,
          logged_at: targetDate,
          calories: totalCals,
          protein_g: totalProt,
          carbs_g: totalCarbs,
          fat_g: totalFat,
          created_at: new Date().toISOString(),
          custom_meal_id: meal.id,
          custom_meal_data: meal,
          servings_logged: servings,
        };

        setFoodLogs((prev) => [newEntry, ...prev]);
        triggerDebouncedSync();

        const user = authUserRef.current;
        if (supabase && user) {
          (supabase.from('food_logs') as any)
            .insert({
              user_id: user.id,
              food_id: null,
              food_name: newEntry.food_name,
              grams_consumed: totalGrams,
              meal_index: options.mealIndex,
              logged_at: targetDate,
              calories: totalCals,
              protein_g: totalProt,
              carbs_g: totalCarbs,
              fat_g: totalFat,
            })
            .select()
            .single()
            .then(({ data }: any) => {
              if (data?.id) {
                setFoodLogs((prev) =>
                  prev.map((l) => (l.id === newEntry.id ? { ...l, id: data.id } : l))
                );
              }
            })
            .catch(() => {});
        }
      } else {
        const scale = servings / Math.max(1, meal.servings_yield);
        const newLogs: FoodLogEntry[] = meal.ingredients.map((ing, idx) => {
          const scaledGrams = Math.round(ing.grams * scale);
          const scaledCals = Math.round(ing.calories * scale);
          const scaledProt = Number((ing.protein_g * scale).toFixed(1));
          const scaledCarbs = Number((ing.carbs_g * scale).toFixed(1));
          const scaledFat = Number((ing.fat_g * scale).toFixed(1));

          return {
            id: `log-ing-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            user_id: profile.id,
            food_id: ing.food_id,
            food_name: `${ing.name} (from ${meal.name})`,
            grams_consumed: scaledGrams,
            meal_index: options.mealIndex,
            logged_at: targetDate,
            calories: scaledCals,
            protein_g: scaledProt,
            carbs_g: scaledCarbs,
            fat_g: scaledFat,
            created_at: new Date().toISOString(),
            custom_meal_id: meal.id,
            custom_meal_data: meal,
            servings_logged: servings,
          };
        });

        setFoodLogs((prev) => [...newLogs, ...prev]);
        triggerDebouncedSync();

        const user = authUserRef.current;
        if (supabase && user && newLogs.length > 0) {
          const rows = newLogs.map((l) => ({
            user_id: user.id,
            food_id: isUuid(l.food_id) ? l.food_id : null,
            food_name: l.food_name,
            grams_consumed: l.grams_consumed,
            meal_index: l.meal_index,
            logged_at: l.logged_at,
            calories: l.calories,
            protein_g: l.protein_g,
            carbs_g: l.carbs_g,
            fat_g: l.fat_g,
          }));
          (supabase.from('food_logs') as any)
            .insert(rows)
            .select()
            .then(({ data }: any) => {
              if (data && Array.isArray(data) && data.length === newLogs.length) {
                setFoodLogs((prev) => {
                  const updated = [...prev];
                  newLogs.forEach((nl, idx) => {
                    const matchIdx = updated.findIndex((u) => u.id === nl.id);
                    if (matchIdx >= 0 && data[idx]?.id) {
                      updated[matchIdx] = { ...updated[matchIdx], id: data[idx].id };
                    }
                  });
                  return updated;
                });
              }
            })
            .catch(() => {});
        }
      }
    },
    [profile.id, selectedDate, todayDate, saveCustomMeal, triggerDebouncedSync]
  );

  const updateBuiltMealInDiary = useCallback(
    (
      logId: string,
      meal: BuiltCustomMeal,
      options: {
        servings: number;
        mealIndex: number;
        dateStr?: string;
      }
    ) => {
      const perServing = meal.per_serving_nutrition;
      const servings = Math.max(0.1, options.servings || 1);
      const totalCals = Math.round(perServing.calories * servings);
      const totalProt = Number((perServing.protein_g * servings).toFixed(1));
      const totalCarbs = Number((perServing.carbs_g * servings).toFixed(1));
      const totalFat = Number((perServing.fat_g * servings).toFixed(1));
      const totalGrams = Math.round(perServing.total_weight_g * servings) || 100;
      const targetDate = options.dateStr ? String(options.dateStr).split('T')[0] : (selectedDate || todayDate);

      updateFoodLog(logId, {
        food_name: `${meal.name} (${servings === 1 ? '1 serving' : `${servings} servings`})`,
        grams_consumed: totalGrams,
        meal_index: options.mealIndex,
        logged_at: targetDate,
        calories: totalCals,
        protein_g: totalProt,
        carbs_g: totalCarbs,
        fat_g: totalFat,
        custom_meal_id: meal.id,
        custom_meal_data: meal,
        servings_logged: servings,
      });

      saveCustomMeal(meal);
      triggerDebouncedSync();
    },
    [updateFoodLog, saveCustomMeal, selectedDate, todayDate, triggerDebouncedSync]
  );

  // Comprehensive Cross-Referenced Reporting Engines
  const getDailyReport = useCallback((dateStr: string) => {
    const dayFoods = foodLogs.filter((l) => (l.logged_at ? String(l.logged_at).split('T')[0] === dateStr : false));
    const macros = dayFoods.reduce(
      (acc, item) => ({
        calories: Math.round(acc.calories + item.calories),
        protein: Math.round(acc.protein + item.protein_g),
        carbs: Math.round(acc.carbs + item.carbs_g),
        fat: Math.round(acc.fat + item.fat_g),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const dayWorkouts = workoutLogs.filter((w) => w.logged_date === dateStr);
    const totalVolumeLbs = dayWorkouts.reduce((sum, w) => sum + (w.total_volume_lbs || 0), 0);
    const totalSets = dayWorkouts.reduce((sum, w) => sum + (w.total_sets_completed || 0), 0);
    const workoutMinutes = dayWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);

    const dayStepLogs = stepLogs.filter(
      (s) => s.logged_at === dateStr || s.logged_at.startsWith(dateStr)
    );
    const steps = dayStepLogs.length > 0 ? Math.max(...dayStepLogs.map((s) => s.steps)) : 0;
    const stepMiles = Number((steps * 0.00045).toFixed(2));
    const stepCalories = Math.round(steps * 0.04);

    const dayWaterLogs = waterLogs.filter((w) => w.logged_at.startsWith(dateStr));
    const waterOz = dayWaterLogs.reduce((sum, w) => sum + w.amount_oz, 0);

    const weightLog = weightLogs.find((w) => w.logged_at === dateStr || w.logged_at.startsWith(dateStr));

    return {
      date: dateStr,
      foodLogs: dayFoods,
      macros,
      caloriesTarget: profile.daily_calorie_target,
      proteinTarget: profile.protein_target_g,
      workouts: dayWorkouts,
      totalVolumeLbs,
      totalSets,
      workoutMinutes,
      steps,
      stepMiles,
      stepCalories,
      waterOz,
      waterGoalOz,
      weightKg: weightLog ? weightLog.weight_kg : null,
    };
  }, [foodLogs, workoutLogs, stepLogs, waterLogs, weightLogs, profile.daily_calorie_target, profile.protein_target_g, waterGoalOz]);

  const getWeeklyReport = useCallback((endDateStr?: string) => {
    const targetEnd = endDateStr || selectedDate || todayDate;
    const endD = new Date(targetEnd + 'T12:00:00');
    const dayList: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(endD);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dayList.push(`${y}-${m}-${day}`);
    }

    const days = dayList.map((dt) => {
      const r = getDailyReport(dt);
      return {
        date: dt,
        calories: r.macros.calories,
        protein: r.macros.protein,
        steps: r.steps,
        waterOz: r.waterOz,
        hasWorkout: r.workouts.length > 0,
        weightKg: r.weightKg,
      };
    });

    const loggedCalDays = days.filter((d) => d.calories > 0);
    const avgCalories = loggedCalDays.length > 0 ? Math.round(loggedCalDays.reduce((s, d) => s + d.calories, 0) / loggedCalDays.length) : 0;
    const avgProtein = loggedCalDays.length > 0 ? Math.round(loggedCalDays.reduce((s, d) => s + d.protein, 0) / loggedCalDays.length) : 0;
    const avgSteps = Math.round(days.reduce((s, d) => s + d.steps, 0) / 7);
    const totalWorkouts = days.filter((d) => d.hasWorkout).length;
    const totalVolumeLbs = workoutLogs
      .filter((w) => dayList.includes(w.logged_date))
      .reduce((sum, w) => sum + (w.total_volume_lbs || 0), 0);
    const totalWaterOz = days.reduce((s, d) => s + d.waterOz, 0);

    const weightsWithDate = days.filter((d) => d.weightKg !== null).map((d) => d.weightKg as number);
    let weightChangeLbs: number | null = null;
    if (weightsWithDate.length >= 2) {
      const first = weightsWithDate[0];
      const last = weightsWithDate[weightsWithDate.length - 1];
      weightChangeLbs = Number(((last - first) * 2.20462).toFixed(1));
    }

    let adherencePoints = 0;
    if (loggedCalDays.length >= 5) adherencePoints += 40;
    else adherencePoints += loggedCalDays.length * 8;
    if (totalWorkouts >= 3) adherencePoints += 30;
    else adherencePoints += totalWorkouts * 10;
    if (avgSteps >= stepGoal * 0.8) adherencePoints += 30;
    else adherencePoints += Math.round((avgSteps / (stepGoal || 10000)) * 30);

    const adherenceScore = Math.min(100, Math.max(0, adherencePoints));

    let insight = 'Great start! Log your daily meals and hit your hydration target to establish a reliable baseline.';
    if (totalWorkouts >= 3 && avgProtein >= profile.protein_target_g * 0.8) {
      insight = `Outstanding week! You completed ${totalWorkouts} workouts and kept average protein high at ${avgProtein}g. Your muscle recovery and metabolic rate are well primed.`;
    } else if (avgSteps >= 8000) {
      insight = `Strong active movement with ${avgSteps.toLocaleString()} daily steps on average. Keep prioritizing consistent protein at every meal.`;
    } else if (loggedCalDays.length >= 4) {
      insight = `Consistent food tracking this week! Your average intake was ${avgCalories.toLocaleString()} kcal against your ${profile.daily_calorie_target} kcal goal.`;
    }

    return {
      startDate: dayList[0],
      endDate: dayList[6],
      days,
      avgCalories,
      avgProtein,
      avgSteps,
      totalWorkouts,
      totalVolumeLbs,
      totalWaterOz,
      weightChangeLbs,
      adherenceScore,
      insight,
    };
  }, [selectedDate, todayDate, getDailyReport, workoutLogs, stepGoal, profile.protein_target_g, profile.daily_calorie_target]);

  const getMonthlyReport = useCallback((yearMonthStr?: string) => {
    const ym = yearMonthStr || (selectedDate || todayDate).substring(0, 7);
    const [yearNum, monthNum] = ym.split('-').map(Number);
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

    let daysLogged = 0;
    let totalCals = 0;
    let totalProt = 0;
    let totalSteps = 0;
    const monthWorkouts = workoutLogs.filter((w) => w.logged_date && w.logged_date.startsWith(ym));
    const totalVolumeLbs = monthWorkouts.reduce((s, w) => s + (w.total_volume_lbs || 0), 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const dt = `${ym}-${String(day).padStart(2, '0')}`;
      const dayLogs = foodLogs.filter((l) => (l.logged_at ? String(l.logged_at).split('T')[0] === dt : false));
      if (dayLogs.length > 0) {
        daysLogged++;
        totalCals += dayLogs.reduce((s, l) => s + l.calories, 0);
        totalProt += dayLogs.reduce((s, l) => s + l.protein_g, 0);
      }
      const daySteps = stepLogs.filter((s) => s.logged_at === dt || s.logged_at.startsWith(dt));
      if (daySteps.length > 0) {
        totalSteps += Math.max(...daySteps.map((s) => s.steps));
      }
    }

    const avgDailyCalories = daysLogged > 0 ? Math.round(totalCals / daysLogged) : 0;
    const avgDailyProtein = daysLogged > 0 ? Math.round(totalProt / daysLogged) : 0;
    const totalMiles = Number((totalSteps * 0.00045).toFixed(1));

    const monthWeights = weightLogs
      .filter((w) => w.logged_at && w.logged_at.startsWith(ym))
      .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime());

    const startWeightKg = monthWeights.length > 0 ? monthWeights[0].weight_kg : null;
    const endWeightKg = monthWeights.length > 0 ? monthWeights[monthWeights.length - 1].weight_kg : null;
    const weightChangeLbs =
      startWeightKg !== null && endWeightKg !== null
        ? Number(((endWeightKg - startWeightKg) * 2.20462).toFixed(1))
        : null;

    let insight = `Logged ${daysLogged} days this month with ${monthWorkouts.length} completed workout sessions.`;
    if (weightChangeLbs !== null && weightChangeLbs < 0) {
      insight += ` Down ${Math.abs(weightChangeLbs)} lbs for the month with consistent caloric discipline!`;
    } else if (totalMiles >= 30) {
      insight += ` Covered ${totalMiles} total walking miles, showing great overall cardiovascular base.`;
    }

    return {
      monthStr: ym,
      totalDays: daysInMonth,
      daysLogged,
      avgDailyCalories,
      avgDailyProtein,
      totalSteps,
      totalMiles,
      totalWorkouts: monthWorkouts.length,
      totalVolumeLbs,
      startWeightKg,
      endWeightKg,
      weightChangeLbs,
      insight,
    };
  }, [selectedDate, todayDate, workoutLogs, foodLogs, stepLogs, weightLogs]);

  const getYearlyReport = useCallback((yearStr?: string) => {
    const yr = yearStr || (selectedDate || todayDate).substring(0, 4);
    const yrWorkouts = workoutLogs.filter((w) => w.logged_date && w.logged_date.startsWith(yr));
    const totalVolumeLbs = yrWorkouts.reduce((s, w) => s + (w.total_volume_lbs || 0), 0);

    const yrStepLogs = stepLogs.filter((s) => s.logged_at && s.logged_at.startsWith(yr));
    const totalSteps = yrStepLogs.reduce((s, entry) => s + entry.steps, 0);
    const totalMiles = Number((totalSteps * 0.00045).toFixed(1));

    const activeDaysSet = new Set<string>();
    foodLogs.forEach((l) => { if (l.logged_at && l.logged_at.startsWith(yr)) activeDaysSet.add(l.logged_at); });
    workoutLogs.forEach((w) => { if (w.logged_date && w.logged_date.startsWith(yr)) activeDaysSet.add(w.logged_date); });
    stepLogs.forEach((s) => { if (s.logged_at && s.logged_at.startsWith(yr)) activeDaysSet.add(s.logged_at.split('T')[0]); });

    const yrWeights = weightLogs
      .filter((w) => w.logged_at && w.logged_at.startsWith(yr))
      .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime());

    const startW = yrWeights.length > 0 ? yrWeights[0].weight_kg : null;
    const endW = yrWeights.length > 0 ? yrWeights[yrWeights.length - 1].weight_kg : null;
    const netWeightChangeLbs = startW !== null && endW !== null ? Number(((endW - startW) * 2.20462).toFixed(1)) : null;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsData = monthNames.map((name, idx) => {
      const mStr = `${yr}-${String(idx + 1).padStart(2, '0')}`;
      const mFoods = foodLogs.filter((l) => l.logged_at && l.logged_at.startsWith(mStr));
      const mWorkouts = workoutLogs.filter((w) => w.logged_date && w.logged_date.startsWith(mStr));
      const mSteps = stepLogs.filter((s) => s.logged_at && s.logged_at.startsWith(mStr));
      const avgCalories = mFoods.length > 0 ? Math.round(mFoods.reduce((s, l) => s + l.calories, 0) / (mFoods.length || 1)) : 0;
      return {
        monthName: name,
        avgCalories,
        workoutsCount: mWorkouts.length,
        stepsCount: mSteps.reduce((s, e) => s + e.steps, 0),
      };
    });

    return {
      yearStr: yr,
      totalWorkouts: yrWorkouts.length,
      totalVolumeLbs,
      totalSteps,
      totalMiles,
      activeDaysCount: activeDaysSet.size,
      netWeightChangeLbs,
      monthsData,
      insight: `Cumulative annual activity: ${yrWorkouts.length} strength & conditioning sessions, ${totalVolumeLbs.toLocaleString()} lbs lifted, and ${activeDaysSet.size} active habit days logged!`,
    };
  }, [selectedDate, todayDate, workoutLogs, stepLogs, foodLogs, weightLogs]);

  const toggleUnitPreference = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      unit_preference: prev.unit_preference === 'imperial' ? 'metric' : 'imperial',
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const toggleExperienceMode = useCallback(() => {
    setProfile((prev) => {
      const current = prev.experience_mode || 'standard';
      let nextMode: ExperienceMode = 'standard';
      if (current === 'standard') nextMode = 'advanced';
      else if (current === 'advanced') nextMode = 'tutorial';
      else nextMode = 'standard';
      return {
        ...prev,
        experience_mode: nextMode,
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const setExperienceMode = useCallback((mode: ExperienceMode) => {
    setProfile((prev) => ({
      ...prev,
      experience_mode: mode,
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const experienceMode = profile.experience_mode || 'standard';

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

  // Update profile and optionally push to cloud with synchronous macro calculation and upsert
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      let nextProfile: UserProfile | null = null;

      setProfile((prev) => {
        const merged = { ...prev, ...updates };
        const hCm = Number(merged.height_cm) || 0;
        const wKg = Number(merged.current_weight_kg) || 0;
        const hasBio = Boolean(hCm > 0 || wKg > 0 || updates.has_configured_biometrics);

        let macroResult = {
          dailyCalories: merged.daily_calorie_target,
          proteinGrams: merged.protein_target_g,
          carbGrams: merged.carb_target_g,
          fatGrams: merged.fat_target_g,
        };

        if (hCm > 0 && wKg > 0) {
          macroResult = calculateMacroTargets({
            weightKg: wKg,
            heightCm: hCm,
            age: merged.age || 35,
            sex: merged.sex || 'male',
            activityLevel: merged.activity_level || 'moderate',
            goal: merged.goal || 'cut_500',
          });
        }

        const finalUpdated: UserProfile = {
          ...merged,
          height_cm: hCm,
          current_weight_kg: wKg,
          target_weight_kg: Number(merged.target_weight_kg) || 0,
          has_configured_biometrics: hasBio,
          daily_calorie_target: updates.daily_calorie_target ?? macroResult.dailyCalories,
          protein_target_g: updates.protein_target_g ?? macroResult.proteinGrams,
          carb_target_g: updates.carb_target_g ?? macroResult.carbGrams,
          fat_target_g: updates.fat_target_g ?? macroResult.fatGrams,
          updated_at: new Date().toISOString(),
        };

        nextProfile = finalUpdated;
        return finalUpdated;
      });

      const user = authUserRef.current;
      if (supabase && user && nextProfile) {
        const p: UserProfile = nextProfile;
        try {
          const { error: upsertErr } = await (supabase.from('profiles') as any).upsert(
            {
              id: user.id,
              email: user.email || p.email,
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
            },
            { onConflict: 'id' }
          );

          if (!upsertErr) {
            setSyncStatus('synced');
            setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } else {
            console.warn('Profile upsert error:', upsertErr);
            setSyncStatus('error');
          }
        } catch (err) {
          console.warn('Network error while upserting profile:', err);
          setSyncStatus('error');
        }
      }
    },
    []
  );

  const recalculateMacros = useCallback(async () => {
    let recalculatedProfile: UserProfile | null = null;

    setProfile((prev) => {
      const result = calculateMacroTargets({
        weightKg: prev.current_weight_kg,
        heightCm: prev.height_cm,
        age: prev.age,
        sex: prev.sex,
        activityLevel: prev.activity_level,
        goal: prev.goal,
      });

      const updated = {
        ...prev,
        daily_calorie_target: result.dailyCalories,
        protein_target_g: result.proteinGrams,
        carb_target_g: result.carbGrams,
        fat_target_g: result.fatGrams,
        updated_at: new Date().toISOString(),
      };
      recalculatedProfile = updated;
      return updated;
    });

    const user = authUserRef.current;
    if (supabase && user && recalculatedProfile) {
      const p: UserProfile = recalculatedProfile;
      try {
        await (supabase.from('profiles') as any).upsert(
          {
            id: user.id,
            email: user.email || p.email,
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
          },
          { onConflict: 'id' }
        );
      } catch (err) {
        console.warn('Failed to sync recalculated macros to cloud:', err);
      }
    }
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
      const targetDate = logged_at ? String(logged_at).split('T')[0] : new Date().toISOString().split('T')[0];

      const newEntry: FoodLogEntry = {
        id: `log-${Date.now()}`,
        user_id: user_id || user?.id || currentProf.id,
        food_id: food.id,
        food_name: food_name || food.name,
        grams_consumed,
        meal_index,
        logged_at: targetDate,
        calories: calculatedCalories,
        protein_g: calculatedProtein,
        carbs_g: calculatedCarbs,
        fat_g: calculatedFat,
        created_at: new Date().toISOString(),
      };

      setFoodLogs((prev) => [newEntry, ...prev]);
      triggerDebouncedSync();

      if (supabase && user) {
        (supabase.from('food_logs') as any)
          .insert({
            user_id: user.id,
            food_id: isUuid(food.id) ? food.id : null,
            food_name: newEntry.food_name,
            grams_consumed,
            meal_index,
            logged_at: newEntry.logged_at,
            calories: calculatedCalories,
            protein_g: calculatedProtein,
            carbs_g: calculatedCarbs,
            fat_g: calculatedFat,
          })
          .select()
          .single()
          .then(({ data }: any) => {
            if (data?.id) {
              setFoodLogs((prev) =>
                prev.map((l) => (l.id === newEntry.id ? { ...l, id: data.id } : l))
              );
            }
          })
          .catch((err: any) => console.warn('Food log cloud insert warning:', err));
      }

      return newEntry.id;
    },
    [triggerDebouncedSync]
  );

  const deleteFoodLog = useCallback((id: string) => {
    setFoodLogs((prev) => prev.filter((log) => log.id !== id));
    triggerDebouncedSync();
    const user = authUserRef.current;
    if (supabase && user && (isUuid(id) || !id.startsWith('log-'))) {
      (supabase.from('food_logs') as any).delete().eq('id', id).then(() => {});
    }
  }, [triggerDebouncedSync]);

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

  const clearAllGrocery = useCallback(() => {
    setGroceryList([]);
  }, []);

  const clearStoreGrocery = useCallback((storeTag: GroceryStoreTag) => {
    setGroceryList((prev) => {
      if (storeTag === 'all') return [];
      return prev.filter((item) => item.store_tag !== storeTag);
    });
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
    setSimpleMovementActivities([]);
  }, []);

  const loadDefaultSimpleMovementActivities = useCallback(() => {
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
    triggerDebouncedSync();
  }, [triggerDebouncedSync]);

  const resetTodayWater = useCallback(() => {
    setWaterLogs((prev) => prev.filter((w) => !w.logged_at.startsWith(todayDate)));
    triggerDebouncedSync();
  }, [todayDate, triggerDebouncedSync]);

  // Step Tracker Engine
  const todaySteps = useMemo(() => {
    const localToday = getLocalDateString();
    const utcToday = new Date().toISOString().split('T')[0];
    const todayLogs = stepLogs.filter(
      (s) =>
        s.logged_at === localToday ||
        s.logged_at === utcToday ||
        s.logged_at.startsWith(localToday) ||
        s.logged_at.startsWith(utcToday)
    );
    if (todayLogs.length === 0) return 0;
    // Use maximum recorded daily total to prevent duplicate summing and eliminate lower stale entries
    return Math.max(...todayLogs.map((s) => s.steps));
  }, [stepLogs, getLocalDateString]);

  const todayStepMiles = useMemo(() => {
    return Number((todaySteps * 0.00045).toFixed(2));
  }, [todaySteps]);

  const todayStepCalories = useMemo(() => {
    return Math.round(todaySteps * 0.04);
  }, [todaySteps]);

  const logSteps = useCallback((steps: number, source: StepLogEntry['source'] = 'apple_health', distanceMiles?: number, caloriesBurned?: number) => {
    const localToday = getLocalDateString();
    const utcToday = new Date().toISOString().split('T')[0];
    const dist = distanceMiles ?? Number((steps * 0.00045).toFixed(2));
    const cals = caloriesBurned ?? Math.round(steps * 0.04);
    const entry: StepLogEntry = {
      id: `stp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      steps,
      distance_miles: dist,
      calories_burned: cals,
      source,
      logged_at: localToday,
    };
    setLastStepSyncTimestamp(new Date().toISOString());
    setStepSyncSource(source);

    let updatedLogs: StepLogEntry[] = [];
    setStepLogs((prev) => {
      // Remove all today logs and any 8-step artifacts
      const filtered = prev.filter(
        (s) =>
          s.logged_at !== localToday &&
          s.logged_at !== utcToday &&
          !s.logged_at.startsWith(localToday) &&
          !s.logged_at.startsWith(utcToday) &&
          !(s.steps === 8 && s.source === 'apple_health')
      );
      updatedLogs = [entry, ...filtered];
      stepLogsRef.current = updatedLogs;
      return updatedLogs;
    });

    // Push directly to cloud across Auth metadata & database for multi-device sync
    const user = authUserRef.current;
    if (supabase && user) {
      const client = supabase;
      // 1. Auth user_metadata push (instant, zero-migration guarantee across all devices)
      client.auth.updateUser({
        data: {
          step_logs: updatedLogs,
          latest_steps_today: steps,
          last_step_sync: new Date().toISOString(),
        },
      }).catch(() => {});

      // 2. Database table push
      (async () => {
        try {
          const { data: existing } = await (client.from('step_logs') as any)
            .select('id, steps')
            .eq('user_id', user.id)
            .eq('logged_at', localToday)
            .maybeSingle();

          if (existing) {
            await (client.from('step_logs') as any)
              .update({
                steps,
                distance_miles: dist,
                calories_burned: cals,
                source,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id);
          } else {
            await (client.from('step_logs') as any).insert({
              user_id: user.id,
              steps,
              distance_miles: dist,
              calories_burned: cals,
              source,
              logged_at: localToday,
            });
          }
        } catch (err) {
          console.warn('Database step table sync warning:', err);
        }
      })();
    }
  }, [getLocalDateString]);

  const resetTodaySteps = useCallback(() => {
    const localToday = getLocalDateString();
    const utcToday = new Date().toISOString().split('T')[0];
    let remainingLogs: StepLogEntry[] = [];
    setStepLogs((prev) => {
      remainingLogs = prev.filter(
        (s) =>
          s.logged_at !== localToday &&
          s.logged_at !== utcToday &&
          !s.logged_at.startsWith(localToday) &&
          !s.logged_at.startsWith(utcToday) &&
          !(s.steps === 8 && s.source === 'apple_health')
      );
      stepLogsRef.current = remainingLogs;
      return remainingLogs;
    });
    setLastStepSyncTimestamp(null);

    const user = authUserRef.current;
    if (supabase && user) {
      const client = supabase;
      client.auth.updateUser({
        data: {
          step_logs: remainingLogs,
          latest_steps_today: 0,
          last_step_sync: new Date().toISOString(),
        },
      }).catch(() => {});

      (async () => {
        try {
          await (client.from('step_logs') as any)
            .delete()
            .eq('user_id', user.id)
            .eq('logged_at', localToday);
        } catch (err) {
          console.warn('Could not reset cloud steps:', err);
        }
      })();
    }
  }, [getLocalDateString]);

  // Automated Apple Health & Watch Sync (URL Params, Lifecycle, and Tab Visibility Triggers)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkUrlStepSync = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let rawParam = urlParams.get('sync_steps') || urlParams.get('steps');

        // Check hash parameters if query was passed in hash
        if (!rawParam && window.location.hash) {
          const hashQuery = window.location.hash.replace(/^#\??/, '');
          const hashParams = new URLSearchParams(hashQuery);
          rawParam = hashParams.get('sync_steps') || hashParams.get('steps');
        }

        if (rawParam && rawParam.trim().length > 0) {
          const cleanedDigits = rawParam.replace(/[^\d]/g, '');
          const parsed = parseInt(cleanedDigits, 10);
          if (!isNaN(parsed) && parsed >= 0) {
            logSteps(parsed, 'apple_health');
            // Clean URL query parameters and path without reloading
            window.history.replaceState({}, document.title, '/');
          }
        }
      } catch {
        // Safe fail
      }
    };

    // Check on initial load
    checkUrlStepSync();

    // Check on tab visibility / phone unlock
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkUrlStepSync();
      }
    };

    const handleFocus = () => {
      checkUrlStepSync();
    };

    // Periodic refresh while app is actively open on screen (every 60s)
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        checkUrlStepSync();
      }
    }, 60000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [logSteps]);

  // 90-Day Master Schedule Planner Functions
  const saveScheduledDayPlan = useCallback((dateStr: string, planUpdates: Partial<ScheduledDayPlan>) => {
    setScheduledPlans((prev) => {
      const existing = prev[dateStr] || { date: dateStr };
      const updated: ScheduledDayPlan = {
        ...existing,
        ...planUpdates,
        date: dateStr,
        is_custom_override: true,
        updated_at: new Date().toISOString(),
      };
      return { ...prev, [dateStr]: updated };
    });
  }, []);

  const deployMasterScheduleTemplate = useCallback(
    (templateId: string, startDateStr: string, durationWeeks: number = 12, preserveOverrides: boolean = true) => {
      const template = MASTER_SCHEDULE_TEMPLATES.find((t) => t.id === templateId) || MASTER_SCHEDULE_TEMPLATES[0];
      if (!template) return;

      const [sYear, sMonth, sDay] = startDateStr.split('-').map((n) => parseInt(n, 10));
      const startDate = new Date(sYear, sMonth - 1, sDay);

      setScheduledPlans((prev) => {
        const nextPlans = { ...prev };
        const totalDays = durationWeeks * 7;

        for (let i = 0; i < totalDays; i++) {
          const currDate = new Date(startDate);
          currDate.setDate(startDate.getDate() + i);

          const y = currDate.getFullYear();
          const m = String(currDate.getMonth() + 1).padStart(2, '0');
          const d = String(currDate.getDate()).padStart(2, '0');
          const dateKey = `${y}-${m}-${d}`;

          // If preserveOverrides is true and this day is an explicit custom override, keep it intact
          if (preserveOverrides && nextPlans[dateKey]?.is_custom_override) {
            continue;
          }

          // get day of week (1=Mon ... 7=Sun)
          const jsDay = currDate.getDay();
          const dayOfWeek = jsDay === 0 ? 7 : jsDay;

          const templateDay = template.weekly_rhythm.find((r) => r.day_of_week === dayOfWeek) || template.weekly_rhythm[0];

          const baseCalories = profile.daily_calorie_target || 2000;
          const targetCalories = Math.max(1200, baseCalories + (templateDay.calorie_offset || 0));

          // Generate planned meals from preset names if available
          const plannedMeals: ScheduledPlannedMeal[] = (templateDay.planned_meal_names || []).map((mealName, idx) => {
            const mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = idx === 0 ? 'breakfast' : idx === 1 ? 'lunch' : 'dinner';
            const calories = Math.round(targetCalories / (templateDay.planned_meal_names?.length || 3));
            return {
              id: `pm-${dateKey}-${idx}`,
              meal_type: mealType,
              meal_title: mealName,
              calories,
              protein_g: Math.round((calories * 0.3) / 4),
              carbs_g: Math.round((calories * 0.4) / 4),
              fat_g: Math.round((calories * 0.3) / 9),
              is_batch_prep: templateDay.is_batch_prep_day && idx === 1,
            };
          });

          nextPlans[dateKey] = {
            date: dateKey,
            is_custom_override: false,
            workout_title: templateDay.workout_title,
            workout_category: templateDay.workout_category,
            program_id: templateDay.program_id,
            workout_day_title: `${templateDay.day_label} — ${templateDay.workout_title}`,
            exercises: templateDay.exercises || [],
            target_steps: templateDay.target_steps || 10000,
            target_calories: targetCalories,
            target_protein_g: profile.protein_target_g || 160,
            target_carbs_g: profile.carb_target_g || 200,
            target_fat_g: profile.fat_target_g || 65,
            planned_meals: plannedMeals,
            fasting_protocol: templateDay.fasting_protocol || '16_8',
            fasting_start_time: profile.fasting_start_time || '20:00',
            water_goal_oz: templateDay.water_goal_oz || 100,
            is_grocery_shopping_day: templateDay.is_grocery_day || false,
            is_batch_prep_day: templateDay.is_batch_prep_day || false,
            day_notes: templateDay.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }

        return nextPlans;
      });
    },
    [profile]
  );

  const deleteScheduledDayPlan = useCallback((dateStr: string) => {
    setScheduledPlans((prev) => {
      const next = { ...prev };
      delete next[dateStr];
      return next;
    });
  }, []);

  const clearScheduledRange = useCallback((startDateStr: string, endDateStr: string) => {
    setScheduledPlans((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k >= startDateStr && k <= endDateStr) {
          delete next[k];
        }
      });
      return next;
    });
  }, []);

  const generateGroceryFromScheduledRange = useCallback(
    (startDateStr: string, endDateStr: string) => {
      let addedCount = 0;
      const daysInRange = Object.values(scheduledPlans).filter(
        (plan) => plan.date >= startDateStr && plan.date <= endDateStr
      );

      const itemsToAdd: GroceryItem[] = [];

      daysInRange.forEach((plan) => {
        (plan.planned_meals || []).forEach((meal) => {
          itemsToAdd.push({
            id: `groc-sch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            item_name: meal.meal_title,
            category: 'fresh_weekly',
            department: 'meat_seafood',
            quantity: 1,
            unit: 'serving',
            is_checked: false,
            in_pantry: false,
            store_tag: 'all',
          });
          addedCount++;
        });
      });

      if (itemsToAdd.length > 0) {
        setGroceryList((prev) => [...prev, ...itemsToAdd]);
      }

      return addedCount;
    },
    [scheduledPlans]
  );

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
    setScheduledPlans({});
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
        updateFoodLog,
        deleteFoodLog,
        todayDate,
        currentDayFoodLogs,
        todayMacros,
        todayRemaining,
        mealSplitTargets,
        selectedDate,
        setSelectedDate,
        selectedDayFoodLogs,
        selectedDayMacros,
        selectedDayRemaining,
        copyDayFoodLogs,
        quickLogCalories,

        // Custom Meals Studio
        customMeals,
        saveCustomMeal,
        deleteCustomMeal,
        logBuiltMealToDiary,
        updateBuiltMealInDiary,
        editingMealLog,
        setEditingMealLog,

        getDailyReport,
        getWeeklyReport,
        getMonthlyReport,
        getYearlyReport,
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
        loadDefaultSimpleMovementActivities,

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
        clearAllGrocery,
        clearStoreGrocery,
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

        // Step Tracker & Automated Watch / Apple Health Sync
        stepGoal,
        setStepGoal,
        stepLogs,
        todaySteps,
        todayStepMiles,
        todayStepCalories,
        lastStepSyncTimestamp,
        stepSyncSource,
        logSteps,
        resetTodaySteps,

        // 90-Day Master Schedule Planner
        scheduledPlans,
        saveScheduledDayPlan,
        deployMasterScheduleTemplate,
        deleteScheduledDayPlan,
        clearScheduledRange,
        generateGroceryFromScheduledRange,

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
