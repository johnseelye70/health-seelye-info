export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high' | 'extreme';
export type BiologicalSex = 'male' | 'female' | 'other';
export type GoalType = 'cut_500' | 'cut_250' | 'maintain' | 'bulk_250' | 'bulk_500';
export type UnitPreference = 'imperial' | 'metric';
export type ExperienceMode = 'simple' | 'advanced';
export type FastingProtocol = '16_8' | '18_6' | '20_4' | '14_10' | '23_1_omad' | 'standard_3_meal';
export type EquipmentType = 'bodyweight' | 'dumbbells' | 'barbells' | 'resistance_bands' | 'kettlebells' | 'cable_machine' | 'full_gym';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  age: number;
  height_cm: number;
  current_weight_kg: number;
  target_weight_kg: number;
  sex: BiologicalSex;
  activity_level: ActivityLevel;
  goal: GoalType;
  unit_preference: UnitPreference;
  experience_mode: ExperienceMode;
  daily_calorie_target: number;
  protein_target_g: number;
  carb_target_g: number;
  fat_target_g: number;
  fasting_protocol: FastingProtocol;
  fasting_start_time: string; // e.g. "20:00"
  eating_window_duration_hours: number;
  meal_count: number; // 2, 3, 4
  equipment_inventory: EquipmentType[];
  created_at?: string;
  updated_at?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'protein' | 'carbohydrate' | 'healthy_fat' | 'vegetable' | 'fruit' | 'dairy_alternative' | 'pantry_staple' | 'beverage';
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  serving_size_g: number;
  default_unit: string;
  storage_type: 'fresh_weekly' | 'pantry_monthly' | 'freezer_monthly';
  swap_group?: string;
}

export interface FoodLogEntry {
  id: string;
  user_id: string;
  food_id?: string;
  food_name: string;
  grams_consumed: number;
  meal_index: number; // 1: Meal 1, 2: Meal 2, etc.
  logged_at: string; // YYYY-MM-DD
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  target_muscle: 'chest' | 'back' | 'quads' | 'hamstrings' | 'glutes' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'full_body_cardio';
  equipment_required: EquipmentType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'hypertrophy' | 'strength' | 'hiit_interval' | 'mobility' | 'warmup';
  instructions?: string;
  video_url_mock: string;
}

export interface WorkoutPlanDay {
  id: string;
  user_id?: string;
  week_number: number; // 1-4
  day_number: number; // 1-7
  day_title: string; // e.g. "Push Strength & Hypertrophy"
  split_type: 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full_body' | 'hiit_conditioning' | 'rest_active';
  exercises: WorkoutExerciseSlot[];
}

export interface WorkoutExerciseSlot {
  id: string;
  exercise_id: string;
  exercise: ExerciseItem;
  target_sets: number;
  target_reps: string;
  rest_seconds: number;
  order_index: number;
  completed: boolean;
  logged_weight_kg?: number;
  logged_reps?: number;
  logged_sets_data?: { set_num: number; reps: number; weight_kg: number; done: boolean }[];
}

export interface GroceryItem {
  id: string;
  item_name: string;
  category: 'fresh_weekly' | 'pantry_monthly';
  quantity: number;
  unit: string;
  is_checked: boolean;
  notes?: string;
  ingredient_type?: string;
}

export interface WeightLog {
  id: string;
  weight_kg: number;
  body_fat_percentage?: number;
  logged_at: string;
}

export interface MealSplitTarget {
  mealIndex: number;
  title: string;
  suggestedTime: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  percentOfTotal: number;
}
