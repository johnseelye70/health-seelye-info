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

interface HealthContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  recalculateMacros: () => void;
  
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
  
  // App & Sync State
  isDemoMode: boolean;
  activeTab: 'dashboard' | 'nutrition' | 'fasting' | 'workouts' | 'grocery' | 'trends' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'nutrition' | 'fasting' | 'workouts' | 'grocery' | 'trends' | 'settings') => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  resetAllData: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'health_seelye_app_state_v3';

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
  const [isDemoMode] = useState<boolean>(!isSupabaseConfigured);
  
  const todayDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Real-time ticking for fasting timer
  const [nowTick, setNowTick] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load persisted state from localStorage on mount if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.foods) setFoods(parsed.foods);
          if (parsed.foodLogs) setFoodLogs(parsed.foodLogs);
          if (parsed.workoutPlan) setWorkoutPlan(parsed.workoutPlan);
          if (parsed.groceryList) setGroceryList(parsed.groceryList);
          if (parsed.weightLogs) setWeightLogs(parsed.weightLogs);
          if (parsed.notificationsEnabled !== undefined) setNotificationsEnabled(parsed.notificationsEnabled);
        }
      } catch (err) {
        console.warn('Failed to load local state:', err);
      }
    }
  }, []);

  // Save to localStorage when critical states update
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

  // Compute Fasting Status reactively
  const fastingStatus = useMemo(() => {
    // nowTick referenced to trigger 1s update
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

  // Update profile and optionally recalculate macros
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
      return updated;
    });
  }, []);

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

  // Update Fasting Protocol
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

  // Add custom food to database
  const addCustomFood = useCallback((foodData: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...foodData,
      id: `cf-${Date.now()}`,
    };
    setFoods((prev) => [newFood, ...prev]);
  }, []);

  // Log food consumed
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
        user_id: user_id || profile.id,
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
    },
    [profile.id, todayDate]
  );

  const deleteFoodLog = useCallback((id: string) => {
    setFoodLogs((prev) => prev.filter((log) => log.id !== id));
  }, []);

  // Toggle Equipment in Inventory and regenerate workouts
  const toggleEquipment = useCallback((eq: EquipmentType) => {
    setProfile((prev) => {
      const exists = prev.equipment_inventory.includes(eq);
      const updatedEq = exists
        ? prev.equipment_inventory.filter((item) => item !== eq)
        : [...prev.equipment_inventory, eq];
      
      const newProfile = { ...prev, equipment_inventory: updatedEq };
      // Regenerate workouts immediately
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

  // Grocery Actions
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

  // Weight Logging
  const logWeight = useCallback((weightKg: number, bodyFat?: number) => {
    const newLog: WeightLog = {
      id: `w-${Date.now()}`,
      weight_kg: weightKg,
      body_fat_percentage: bodyFat,
      logged_at: new Date().toISOString().split('T')[0],
    };
    setWeightLogs((prev) => [newLog, ...prev]);
    // Also update current profile weight and recalculate
    setProfile((prev) => ({
      ...prev,
      current_weight_kg: weightKg,
    }));
  }, []);

  // Reset all state to clean baseline
  const resetAllData = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('health_seelye_app_state_v1');
        localStorage.removeItem('health_seelye_app_state_v2');
        localStorage.removeItem('health_seelye_app_state_v3');
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
        isDemoMode,
        activeTab,
        setActiveTab,
        showOnboardingModal,
        setShowOnboardingModal,
        resetAllData,
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
