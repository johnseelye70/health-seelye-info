export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high' | 'extreme';
export type BiologicalSex = 'male' | 'female' | 'other';
export type GoalType = 'cut_500' | 'cut_250' | 'maintain' | 'bulk_250' | 'bulk_500';
export type UnitPreference = 'imperial' | 'metric';
export type ExperienceMode = 'simple' | 'advanced';
export type FastingProtocol = '16_8' | '18_6' | '20_4' | '14_10' | '23_1_omad' | 'standard_3_meal';
export type EquipmentType = string;

export type EquipmentCategory =
  | 'free_weights'
  | 'benches_racks'
  | 'cable_machines'
  | 'plate_machines'
  | 'bodyweight_calisthenics'
  | 'bands_accessories'
  | 'cardio_conditioning';

export interface EquipmentCategoryMeta {
  id: EquipmentCategory;
  name: string;
  shortLabel: string;
  icon: string;
  description: string;
  accentColor: string;
}

export interface EquipmentSubCategoryMeta {
  id: string;
  parentId: EquipmentCategory;
  name: string;
  icon: string;
  description: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  sub_category: string;
  icon: string;
  description: string;
  footprint: 'compact' | 'medium' | 'commercial_heavy';
  typical_exercises_unlocked: number;
}

export type ExerciseCategory =
  | 'chest_pecs'
  | 'back_lats'
  | 'shoulders_delts'
  | 'arms_biceps_triceps'
  | 'legs_quads_hamstrings'
  | 'glutes_hips'
  | 'core_abdominals'
  | 'hiit_conditioning'
  | 'mobility_warmup';

export interface ExerciseCategoryMeta {
  id: ExerciseCategory;
  name: string;
  shortLabel: string;
  icon: string;
  description: string;
  accentColor: string;
}

export interface ExerciseSubCategoryMeta {
  id: string;
  parentId: ExerciseCategory;
  name: string;
  icon: string;
  description: string;
}

export interface PlateInventory {
  plates_100lb?: number;
  plates_55lb?: number;
  plates_45lb?: number;
  plates_35lb?: number;
  plates_25lb?: number;
  plates_15lb?: number;
  plates_10lb?: number;
  plates_5lb?: number;
  plates_2_5lb?: number;
  plates_1_25lb?: number;
  plates_1lb?: number;
  plates_0_5lb?: number;
  bar_weight_lbs: number; // default 45
  // Backward compatibility pairs aliases
  pairs_45lb?: number;
  pairs_35lb?: number;
  pairs_25lb?: number;
  pairs_10lb?: number;
  pairs_5lb?: number;
  pairs_2_5lb?: number;
}

export interface ProgramExerciseTemplate {
  id: string;
  name: string;
  target_muscle: string;
  suggested_sets: number;
  suggested_reps: string;
  suggested_weight_guide?: string;
  equipment_needed?: string;
  instructions?: string;
  notes?: string;
}

export interface WorkoutProgramDay {
  day_number: number;
  day_title: string;
  focus: string;
  duration_minutes: number;
  exercises: ProgramExerciseTemplate[];
  notes?: string;
}

export type ProgramCategory =
  | 'p90x_series'
  | 'beachbody_classic'
  | 'strength_powerlifting'
  | 'bodybuilding_splits'
  | 'mind_body_longevity'
  | 'functional_tactical'
  | 'hybrid_endurance';

export interface PreMadeWorkoutProgram {
  id: string;
  title: string;
  subtitle: string;
  creator: string;
  category: ProgramCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  equipment_needed: string[];
  duration_weeks: number;
  days_per_week: number;
  description: string;
  icon: string;
  accent_color: string;
  schedule: WorkoutProgramDay[];
}

export interface CompletedSetLog {
  set_number: number;
  reps: number;
  weight_lbs: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
}

export interface CompletedExerciseLog {
  exercise_id: string;
  exercise_name: string;
  target_muscle: string;
  sets: CompletedSetLog[];
  notes?: string;
}

export interface WorkoutSessionLog {
  id: string;
  user_id?: string;
  program_id?: string;
  program_title: string;
  day_title: string;
  logged_date: string; // YYYY-MM-DD
  duration_minutes: number;
  total_volume_lbs: number;
  total_sets_completed: number;
  exercises: CompletedExerciseLog[];
  notes?: string;
  energy_rating?: number; // 1-5
  created_at: string;
}

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
  equipment_inventory: string[];
  plate_inventory?: PlateInventory;
  workout_logs?: WorkoutSessionLog[];
  active_program_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type FoodCategory =
  | 'poultry_meat'
  | 'fish_seafood'
  | 'plant_protein'
  | 'dairy_eggs'
  | 'grains_carbs'
  | 'fruits'
  | 'vegetables'
  | 'nuts_fats_oils'
  | 'beverages_hydration'
  | 'snacks_pantry'
  | 'protein'
  | 'carbohydrate'
  | 'healthy_fat'
  | 'vegetable'
  | 'fruit'
  | 'dairy_alternative'
  | 'pantry_staple'
  | 'beverage';

export interface FoodSubCategoryMeta {
  id: string;
  parentId: FoodCategory;
  name: string;
  icon: string;
  description: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  sub_category?: string;
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
  target_muscle:
    | 'chest'
    | 'back'
    | 'quads'
    | 'hamstrings'
    | 'glutes'
    | 'shoulders'
    | 'biceps'
    | 'triceps'
    | 'core'
    | 'calves'
    | 'full_body_cardio';
  secondary_muscles?: string[];
  equipment_required: string; // Primary equipment tag for backward compatibility
  required_equipment_ids?: string[]; // Multiple equipment IDs needed (e.g. ['dumbbells', 'adjustable_bench'])
  category: 'hypertrophy' | 'strength' | 'hiit_interval' | 'mobility' | 'warmup';
  exercise_category?: ExerciseCategory;
  sub_category?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string;
  video_url_mock: string;
  suggested_sets_reps?: string;
  mechanics?: 'compound' | 'isolation' | 'isometric';
  is_barbell_plate_loaded?: boolean;
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
