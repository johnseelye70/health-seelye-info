export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          age: number | null
          height_cm: number | null
          current_weight_kg: number | null
          target_weight_kg: number | null
          sex: 'male' | 'female' | 'other' | null
          activity_level: 'sedentary' | 'light' | 'moderate' | 'high' | 'extreme' | null
          goal: 'cut_500' | 'cut_250' | 'maintain' | 'bulk_250' | 'bulk_500' | null
          unit_preference: 'imperial' | 'metric'
          daily_calorie_target: number
          protein_target_g: number
          carb_target_g: number
          fat_target_g: number
          fasting_protocol: '16_8' | '18_6' | '20_4' | '14_10' | '23_1_omad' | 'standard_3_meal'
          fasting_start_time: string | null
          eating_window_duration_hours: number | null
          meal_count: number
          equipment_inventory: Json
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      food_database: {
        Row: {
          id: string
          name: string
          category: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          fiber_per_100g: number
          is_gluten_free: boolean
          is_dairy_free: boolean
          serving_size_g: number
          default_unit: string
          storage_type: 'fresh_weekly' | 'pantry_monthly' | 'freezer_monthly'
          swap_group: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['food_database']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['food_database']['Row']>
      }
      food_logs: {
        Row: {
          id: string
          user_id: string
          food_id: string | null
          food_name: string
          grams_consumed: number
          meal_index: number
          logged_at: string
          created_at: string
          calories: number
          protein_g: number
          carbs_g: number
          fat_g: number
        }
        Insert: Omit<Database['public']['Tables']['food_logs']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['food_logs']['Row']>
      }
      exercises: {
        Row: {
          id: string
          name: string
          target_muscle: string
          equipment_required: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          category: 'hypertrophy' | 'strength' | 'hiit_interval' | 'mobility' | 'warmup'
          instructions: string | null
          video_url_mock: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['exercises']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['exercises']['Row']>
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          week_number: number
          day_number: number
          day_title: string
          exercise_id: string | null
          exercise_name: string
          target_sets: number
          target_reps: string
          rest_seconds: number
          order_index: number
          completed: boolean
          logged_weight_kg: number | null
          logged_reps: number | null
          logged_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['workout_plans']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['workout_plans']['Row']>
      }
      grocery_items: {
        Row: {
          id: string
          user_id: string
          item_name: string
          category: 'pantry_monthly' | 'fresh_weekly'
          quantity: number
          unit: string
          is_checked: boolean
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['grocery_items']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['grocery_items']['Row']>
      }
      weight_logs: {
        Row: {
          id: string
          user_id: string
          weight_kg: number
          body_fat_percentage: number | null
          logged_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['weight_logs']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['weight_logs']['Row']>
      }
      step_logs: {
        Row: {
          id: string
          user_id: string
          steps: number
          distance_miles: number | null
          calories_burned: number | null
          source: 'phone_sensor' | 'apple_health' | 'garmin' | 'fitbit' | 'manual'
          logged_at: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['step_logs']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['step_logs']['Row']>
      }
    }
  }
}
