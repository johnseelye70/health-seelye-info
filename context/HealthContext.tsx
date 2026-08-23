'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
} from '@/lib/types';
import {
  INITIAL_PROFILE,
  DEFAULT_FOODS,
  INITIAL_FOOD_LOGS,
  INITIAL_WEIGHT_LOGS,
  generateWorkoutPlanSplit,
  compileGroceryList,
} from '@/lib/mock-data';
import {
  calculateMacroTargets,
  calculateMealSplitTargets,
  computeFastingStatus,
  FastingStatus,
} from '@/lib/macro-calculator';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { normalizeFoodCategory } from '@/lib/food-database';

export type SyncStatusType = 'synced' | 'syncing' | 'offline' | 'error' | 'local_only';

interface HealthContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  recalculateMacros: () => void;
  toggleUnitPreference: () => void;
  experienceMode: ExperienceMode;
  toggleExperienceMode: () => void;
  setExperienceMode: (mode: ExperienceMode) => void;
  
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
  
  // Workouts
  workoutPlan: WorkoutPlanDay[];
  activeWeek: number;
  setActiveWeek: (week: number) => void;
  activeDay: number;
  setActiveDay: (day: number) => void;
  toggleExerciseCompleted: (dayId: string, slotId: string) => void;
  updateExerciseSetData: (dayId: string, slotId: string, reps: number, weightKg: number) => void;
  regenerateWorkouts: (equipment?: EquipmentType[]) => void;
  toggleEquipment: (eq: EquipmentType) => void;
  
  // Grocery Manager
  groceryList: GroceryItem[];
  groceryMultiplier: number;
  setGroceryMultiplier: (mult: number) => void;
  toggleGroceryItem: (id: string) => void;
  addGroceryItem: (item: Omit<GroceryItem, 'id'>) => void;
  deleteGroceryItem: (id: string) => void;
  clearCheckedGrocery: () => void;
  
  // Weight & Analytics
  weightLogs: WeightLog[];
  logWeight: (weightKg: number, bodyFat?: number) => void;
  
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

const LOCAL_STORAGE_KEY = 'health_seelye_app_state_v6';

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [foods, setFoods] = useState<FoodItem[]>(DEFAULT_FOODS);
  const [foodLogs, setFoodLogs] = useState<FoodLogEntry[]>(INITIAL_FOOD_LOGS);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanDay[]>(() => generateWorkoutPlanSplit(INITIAL_PROFILE.equipment_inventory));
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => compileGroceryList(DEFAULT_FOODS));
  const [groceryMultiplier, setGroceryMultiplier] = useState<number>(1);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(INITIAL_WEIGHT_LOGS);
  
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [activeDay, setActiveDay] = useState<number>(() => {
    const day = new Date().getDay(); // 0 is Sun, 1 is Mon...
    return day === 0 ? 7 : day;
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'nutrition' | 'fasting' | 'workouts' | 'grocery' | 'trends' | 'settings'>('dashboard');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

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
          if (parsed.notificationsEnabled !== undefined) setNotificationsEnabled(parsed.notificationsEnabled);
        } else {
          setFoods(DEFAULT_FOODS);
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
          notificationsEnabled,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
      } catch (err) {
        console.warn('Failed to persist state:', err);
      }
    }
  }, [profile, foods, foodLogs, workoutPlan, groceryList, weightLogs, notificationsEnabled]);

  // 3. Supabase Cloud Sync Engine (Non-Destructive Reconciliation)
  const syncWithCloud = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase || !authUser) return;

    const client = supabase;
    setSyncStatus('syncing');
    try {
      // A. Profile Sync
      const { data: cloudProfile, error: profileErr } = await (client.from('profiles') as any)
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (cloudProfile && !profileErr) {
        setProfile((prev) => ({
          ...prev,
          id: authUser.id,
          email: authUser.email || cloudProfile.email || prev.email,
          full_name: cloudProfile.full_name || authUser.user_metadata?.full_name || (prev.full_name === 'John Seelye' ? 'Athlete' : prev.full_name) || 'Athlete',
          age: cloudProfile.age || prev.age,
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
        // Push local baseline to cloud profile
        await (client.from('profiles') as any).upsert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || (profile.full_name === 'John Seelye' ? 'Athlete' : profile.full_name) || 'Athlete',
          age: profile.age,
          height_cm: profile.height_cm,
          current_weight_kg: profile.current_weight_kg,
          target_weight_kg: profile.target_weight_kg,
          sex: profile.sex,
          activity_level: profile.activity_level,
          goal: profile.goal,
          unit_preference: profile.unit_preference,
          daily_calorie_target: profile.daily_calorie_target,
          protein_target_g: profile.protein_target_g,
          carb_target_g: profile.carb_target_g,
          fat_target_g: profile.fat_target_g,
          fasting_protocol: profile.fasting_protocol,
          fasting_start_time: profile.fasting_start_time,
          meal_count: profile.meal_count,
        });
      }

      // B. Food Logs Sync (Merge Cloud & Local Non-Destructively)
      const { data: cloudFoodLogs } = await (client.from('food_logs') as any)
        .select('*')
        .eq('user_id', authUser.id);

      if (cloudFoodLogs && Array.isArray(cloudFoodLogs)) {
        setFoodLogs((prevLogs) => {
          const cloudIds = new Set(cloudFoodLogs.map((c: any) => c.id));
          const localOnlyLogs = prevLogs.filter((l) => !cloudIds.has(l.id));

          // Asynchronously push local-only logs to cloud
          if (localOnlyLogs.length > 0) {
            const rowsToInsert = localOnlyLogs.map((l) => ({
              id: l.id.startsWith('log-') ? undefined : l.id,
              user_id: authUser.id,
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
            (client.from('food_logs') as any).insert(rowsToInsert).then(() => {});
          }

          // Return merged logs
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

          return merged;
        });
      }

      // C. Weight Logs Sync
      const { data: cloudWeightLogs } = await (client.from('weight_logs') as any)
        .select('*')
        .eq('user_id', authUser.id)
        .order('logged_at', { ascending: false });

      if (cloudWeightLogs && Array.isArray(cloudWeightLogs)) {
        setWeightLogs((prev) => {
          const cloudDates = new Set(cloudWeightLogs.map((c: any) => c.logged_at));
          const localOnly = prev.filter((w) => !cloudDates.has(w.logged_at));

          if (localOnly.length > 0) {
            const weightRows = localOnly.map((w) => ({
              user_id: authUser.id,
              weight_kg: w.weight_kg,
              body_fat_percentage: w.body_fat_percentage,
              logged_at: w.logged_at,
            }));
            (client.from('weight_logs') as any).insert(weightRows).then(() => {});
          }

          return [
            ...cloudWeightLogs.map((c: any) => ({
              id: c.id,
              weight_kg: Number(c.weight_kg),
              body_fat_percentage: c.body_fat_percentage ? Number(c.body_fat_percentage) : undefined,
              logged_at: c.logged_at,
            })),
            ...localOnly,
          ];
        });
      }

      setSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Sync error:', err);
      setSyncStatus('error');
    }
  }, [authUser, profile]);

  // 4. Supabase Auth Session Listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    const client = supabase;

    // Get current session on load
    client.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user || null);
      setAuthLoading(false);
      if (session?.user) {
        syncWithCloud();
      }
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
      if (session?.user) {
        syncWithCloud();
      } else {
        setSyncStatus('local_only');
      }
    });

    return () => subscription.unsubscribe();
  }, [syncWithCloud]);

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

  // Update profile and optionally push to cloud
  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setProfile((prev) => {
        const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
        
        // Asynchronously update cloud profile if logged in
        if (supabase && authUser) {
          (supabase.from('profiles') as any)
            .update({
              full_name: updated.full_name,
              age: updated.age,
              height_cm: updated.height_cm,
              current_weight_kg: updated.current_weight_kg,
              target_weight_kg: updated.target_weight_kg,
              sex: updated.sex,
              activity_level: updated.activity_level,
              goal: updated.goal,
              unit_preference: updated.unit_preference,
              daily_calorie_target: updated.daily_calorie_target,
              protein_target_g: updated.protein_target_g,
              carb_target_g: updated.carb_target_g,
              fat_target_g: updated.fat_target_g,
              fasting_protocol: updated.fasting_protocol,
              fasting_start_time: updated.fasting_start_time,
              meal_count: updated.meal_count,
              updated_at: updated.updated_at,
            })
            .eq('id', authUser.id)
            .then(() => {});
        }
        return updated;
      });
    },
    [authUser]
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

    if (supabase && authUser) {
      (supabase.from('food_database') as any)
        .insert({
          user_id: authUser.id,
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
  }, [authUser]);

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

      const newEntry: FoodLogEntry = {
        id: `log-${Date.now()}`,
        user_id: user_id || authUser?.id || profile.id,
        food_id: food.id,
        food_name: food_name || food.name,
        grams_consumed,
        meal_index,
        logged_at: logged_at || todayDate,
        calories: calculatedCalories,
        protein_g: calculatedProtein,
        carbs_g: calculatedCarbs,
        fat_g: calculatedFat,
        created_at: new Date().toISOString(),
      };

      setFoodLogs((prev) => [newEntry, ...prev]);

      if (supabase && authUser) {
        (supabase.from('food_logs') as any)
          .insert({
            user_id: authUser.id,
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
    [profile.id, todayDate, authUser]
  );

  const deleteFoodLog = useCallback((id: string) => {
    setFoodLogs((prev) => prev.filter((log) => log.id !== id));
    if (supabase && authUser && !id.startsWith('log-')) {
      (supabase.from('food_logs') as any).delete().eq('id', id).then(() => {});
    }
  }, [authUser]);

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

  const toggleGroceryItem = useCallback((id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_checked: !item.is_checked } : item))
    );
  }, []);

  const addGroceryItem = useCallback((itemData: Omit<GroceryItem, 'id'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: `gi-${Date.now()}`,
    };
    setGroceryList((prev) => [newItem, ...prev]);
  }, []);

  const deleteGroceryItem = useCallback((id: string) => {
    setGroceryList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCheckedGrocery = useCallback(() => {
    setGroceryList((prev) => prev.filter((item) => !item.is_checked));
  }, []);

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

    if (supabase && authUser) {
      (supabase.from('weight_logs') as any)
        .insert({
          user_id: authUser.id,
          weight_kg: weightKg,
          body_fat_percentage: bodyFat || null,
          logged_at: today,
        })
        .then(() => {});
    }
  }, [authUser]);

  const resetAllData = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('health_seelye_app_state_v1');
        localStorage.removeItem('health_seelye_app_state_v2');
        localStorage.removeItem('health_seelye_app_state_v3');
        localStorage.removeItem('health_seelye_app_state_v4');
        localStorage.removeItem('health_seelye_app_state_v5');
        localStorage.removeItem('health_seelye_app_state_v6');
      } catch (e) {
        // ignore
      }
    }
    setProfile(INITIAL_PROFILE);
    setFoods(DEFAULT_FOODS);
    setFoodLogs([]);
    setWorkoutPlan(generateWorkoutPlanSplit(INITIAL_PROFILE.equipment_inventory));
    setGroceryList(compileGroceryList(DEFAULT_FOODS));
    setWeightLogs([]);
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
        groceryList,
        groceryMultiplier,
        setGroceryMultiplier,
        toggleGroceryItem,
        addGroceryItem,
        deleteGroceryItem,
        clearCheckedGrocery,
        weightLogs,
        logWeight,
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
