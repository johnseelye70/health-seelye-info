import { EquipmentType, ExerciseItem, FoodItem, FoodLogEntry, GroceryItem, UserProfile, WeightLog, WorkoutPlanDay } from './types';

export const INITIAL_PROFILE: UserProfile = {
  id: 'athlete-01',
  email: 'john@seelye.info',
  full_name: 'John Seelye',
  age: 35,
  height_cm: 178, // ~5'10"
  current_weight_kg: 80.0, // ~176 lbs
  target_weight_kg: 75.0, // ~165 lbs
  sex: 'male',
  activity_level: 'moderate',
  goal: 'cut_500',
  unit_preference: 'imperial',
  experience_mode: 'simple',
  daily_calorie_target: 2150,
  protein_target_g: 176,
  carb_target_g: 210,
  fat_target_g: 60,
  fasting_protocol: '16_8',
  fasting_start_time: '20:00',
  eating_window_duration_hours: 8,
  meal_count: 3,
  equipment_inventory: ['bodyweight', 'dumbbells', 'resistance_bands'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

import { COMPREHENSIVE_FOOD_DATABASE } from './food-database';

export const DEFAULT_FOODS: FoodItem[] = COMPREHENSIVE_FOOD_DATABASE;

export const DEFAULT_EXERCISES: ExerciseItem[] = [
  {
    id: 'ex-1',
    name: 'Push-Ups (Strict Form)',
    target_muscle: 'chest',
    equipment_required: 'bodyweight',
    difficulty: 'beginner',
    category: 'hypertrophy',
    instructions: 'Maintain a tight hollow plank, lower chest until 1 inch above floor, flare elbows at 45 degrees, press back up.',
    video_url_mock: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-2',
    name: 'Dumbbell Flat Bench Press',
    target_muscle: 'chest',
    equipment_required: 'dumbbells',
    difficulty: 'intermediate',
    category: 'strength',
    instructions: 'Retract shoulder blades, lower dumbbells with a 3-second eccentric phase, drive up squeezing pecs.',
    video_url_mock: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-3',
    name: 'Barbell Incline Bench Press',
    target_muscle: 'chest',
    equipment_required: 'barbells',
    difficulty: 'advanced',
    category: 'strength',
    instructions: 'Set bench to 30 degrees. Touch upper clavicle line softly and press up in a controlled vertical path.',
    video_url_mock: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-4',
    name: 'Bodyweight Pull-Ups (Overhand)',
    target_muscle: 'back',
    equipment_required: 'bodyweight',
    difficulty: 'intermediate',
    category: 'strength',
    instructions: 'From full deadhang, depress scapulae and pull elbows down into ribcage until chin is clearly above bar.',
    video_url_mock: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-5',
    name: 'Dumbbell Single-Arm Row',
    target_muscle: 'back',
    equipment_required: 'dumbbells',
    difficulty: 'beginner',
    category: 'hypertrophy',
    instructions: 'Support knee on bench, hinge at hips, pull dumbbell towards hip crease while squeezing lower lat.',
    video_url_mock: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-6',
    name: 'Barbell Deadlift (Conventional)',
    target_muscle: 'hamstrings',
    equipment_required: 'barbells',
    difficulty: 'advanced',
    category: 'strength',
    instructions: 'Lock lats, brace abdominal wall, push floor away with midfoot, stand tall with glute contraction.',
    video_url_mock: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-7',
    name: 'Bodyweight Air Squats',
    target_muscle: 'quads',
    equipment_required: 'bodyweight',
    difficulty: 'beginner',
    category: 'hypertrophy',
    instructions: 'Feet shoulder-width apart, knees track over toes, sink hips below parallel while keeping chest proud.',
    video_url_mock: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-8',
    name: 'Goblet Squat (Dumbbell / KB)',
    target_muscle: 'quads',
    equipment_required: 'dumbbells',
    difficulty: 'beginner',
    category: 'strength',
    instructions: 'Hold dumbbell vertically against chest bone, squat between hips with neutral spine, drive out of the hole.',
    video_url_mock: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-9',
    name: 'Barbell Back Squat',
    target_muscle: 'quads',
    equipment_required: 'barbells',
    difficulty: 'advanced',
    category: 'strength',
    instructions: 'Bar resting firm across upper traps, take deep Valsalva breath, squat to full depth and explode up.',
    video_url_mock: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-10',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    target_muscle: 'hamstrings',
    equipment_required: 'dumbbells',
    difficulty: 'intermediate',
    category: 'hypertrophy',
    instructions: 'Keep slight bend in knees, hinge hips back as if touching a wall behind you, feel deep hamstring stretch.',
    video_url_mock: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-11',
    name: 'Resistance Band Lateral Pull-Aparts',
    target_muscle: 'shoulders',
    equipment_required: 'resistance_bands',
    difficulty: 'beginner',
    category: 'hypertrophy',
    instructions: 'Hold band out straight at shoulder height, pull hands wide apart until band touches chest, pinch rear delts.',
    video_url_mock: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-12',
    name: 'Dumbbell Standing Overhead Press',
    target_muscle: 'shoulders',
    equipment_required: 'dumbbells',
    difficulty: 'intermediate',
    category: 'strength',
    instructions: 'Brace core and glutes, press dumbbells vertically without hyperextending lumbar spine.',
    video_url_mock: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-13',
    name: 'Dumbbell Lateral Raises',
    target_muscle: 'shoulders',
    equipment_required: 'dumbbells',
    difficulty: 'beginner',
    category: 'hypertrophy',
    instructions: 'Slight forward lean, raise arms to 90 degrees leading with elbows, pause 1 second at top.',
    video_url_mock: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-14',
    name: 'Resistance Band Bicep Curls',
    target_muscle: 'biceps',
    equipment_required: 'resistance_bands',
    difficulty: 'beginner',
    category: 'hypertrophy',
    instructions: 'Anchor band with feet, curl upward keeping elbows pinned to side, peak contraction at top.',
    video_url_mock: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-15',
    name: 'Dips / Bench Dips',
    target_muscle: 'triceps',
    equipment_required: 'bodyweight',
    difficulty: 'intermediate',
    category: 'hypertrophy',
    instructions: 'Lower until upper arms are parallel to floor, press through heels of hands to lockout triceps.',
    video_url_mock: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-16',
    name: 'High-Intensity Burpee Blitz',
    target_muscle: 'full_body_cardio',
    equipment_required: 'bodyweight',
    difficulty: 'intermediate',
    category: 'hiit_interval',
    instructions: 'Drop chest to deck, snap feet forward under hips, jump explosively clapping overhead.',
    video_url_mock: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-17',
    name: 'Kettlebell Russian Swings',
    target_muscle: 'glutes',
    equipment_required: 'kettlebells',
    difficulty: 'intermediate',
    category: 'hiit_interval',
    instructions: 'Hinge deeply at hips, explode forward snapping glutes, let kettlebell float to eye level.',
    video_url_mock: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-18',
    name: 'Dumbbell Renegade Plank Rows',
    target_muscle: 'core',
    equipment_required: 'dumbbells',
    difficulty: 'advanced',
    category: 'hiit_interval',
    instructions: 'Hold pushup plank on dumbbells, row one side into ribs keeping hips parallel to ground.',
    video_url_mock: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-19',
    name: 'Cable Lat Pulldowns',
    target_muscle: 'back',
    equipment_required: 'cable_machine',
    difficulty: 'intermediate',
    category: 'hypertrophy',
    instructions: 'Grip bar wide, pull down smoothly to upper collarbone squeezing shoulder blades together.',
    video_url_mock: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex-20',
    name: 'Cable Tricep Rope Pushdown',
    target_muscle: 'triceps',
    equipment_required: 'cable_machine',
    difficulty: 'beginner',
    category: 'hypertrophy',
    instructions: 'Lock elbows at ribs, press rope down and flare ends outward at full extension.',
    video_url_mock: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_FOOD_LOGS: FoodLogEntry[] = [];

export const INITIAL_WEIGHT_LOGS: WeightLog[] = [];

/**
 * Dynamic 4-Week Workout Split Generator filtered strictly by available equipment
 */
export function generateWorkoutPlanSplit(availableEquipment: EquipmentType[]): WorkoutPlanDay[] {
  const isAvailable = (eq: EquipmentType) => availableEquipment.includes(eq) || eq === 'bodyweight';

  // Candidate pool filtered by gear
  const validExercises = DEFAULT_EXERCISES.filter((ex) => isAvailable(ex.equipment_required));

  const findBestExercise = (
    muscle: ExerciseItem['target_muscle'],
    fallbackMuscles: ExerciseItem['target_muscle'][] = []
  ): ExerciseItem => {
    const match = validExercises.find((e) => e.target_muscle === muscle);
    if (match) return match;
    for (const fb of fallbackMuscles) {
      const fbMatch = validExercises.find((e) => e.target_muscle === fb);
      if (fbMatch) return fbMatch;
    }
    return validExercises[0] || DEFAULT_EXERCISES[0];
  };

  const days: WorkoutPlanDay[] = [];

  // Generate 4 Weeks (7 Days each)
  for (let week = 1; week <= 4; week++) {
    // Day 1: Push & Chest/Triceps Strength
    const pushEx1 = findBestExercise('chest');
    const pushEx2 = findBestExercise('shoulders', ['chest']);
    const pushEx3 = findBestExercise('triceps', ['chest']);
    const pushEx4 = findBestExercise('core');

    days.push({
      id: `w${week}-d1`,
      week_number: week,
      day_number: 1,
      day_title: 'Push Power & Hypertrophy',
      split_type: 'push',
      exercises: [
        { id: `w${week}-d1-e1`, exercise_id: pushEx1.id, exercise: pushEx1, target_sets: 4, target_reps: '8-10', rest_seconds: 90, order_index: 1, completed: week === 1 },
        { id: `w${week}-d1-e2`, exercise_id: pushEx2.id, exercise: pushEx2, target_sets: 3, target_reps: '10-12', rest_seconds: 60, order_index: 2, completed: week === 1 },
        { id: `w${week}-d1-e3`, exercise_id: pushEx3.id, exercise: pushEx3, target_sets: 3, target_reps: '12-15', rest_seconds: 60, order_index: 3, completed: false },
        { id: `w${week}-d1-e4`, exercise_id: pushEx4.id, exercise: pushEx4, target_sets: 3, target_reps: '15-20', rest_seconds: 45, order_index: 4, completed: false },
      ],
    });

    // Day 2: Pull & Lat Hypertrophy
    const pullEx1 = findBestExercise('back');
    const pullEx2 = findBestExercise('hamstrings', ['back']);
    const pullEx3 = findBestExercise('biceps', ['back']);
    const pullEx4 = findBestExercise('core');

    days.push({
      id: `w${week}-d2`,
      week_number: week,
      day_number: 2,
      day_title: 'Pull Density & Posterior Chain',
      split_type: 'pull',
      exercises: [
        { id: `w${week}-d2-e1`, exercise_id: pullEx1.id, exercise: pullEx1, target_sets: 4, target_reps: '8-10', rest_seconds: 90, order_index: 1, completed: false },
        { id: `w${week}-d2-e2`, exercise_id: pullEx2.id, exercise: pullEx2, target_sets: 3, target_reps: '10-12', rest_seconds: 75, order_index: 2, completed: false },
        { id: `w${week}-d2-e3`, exercise_id: pullEx3.id, exercise: pullEx3, target_sets: 3, target_reps: '12-15', rest_seconds: 60, order_index: 3, completed: false },
        { id: `w${week}-d2-e4`, exercise_id: pullEx4.id, exercise: pullEx4, target_sets: 3, target_reps: '15', rest_seconds: 45, order_index: 4, completed: false },
      ],
    });

    // Day 3: Lower Body Wheels of Steel
    const legEx1 = findBestExercise('quads');
    const legEx2 = findBestExercise('hamstrings', ['quads']);
    const legEx3 = findBestExercise('glutes', ['quads']);
    const legEx4 = findBestExercise('core');

    days.push({
      id: `w${week}-d3`,
      week_number: week,
      day_number: 3,
      day_title: 'Legs & Quad Annihilation',
      split_type: 'legs',
      exercises: [
        { id: `w${week}-d3-e1`, exercise_id: legEx1.id, exercise: legEx1, target_sets: 4, target_reps: '10-12', rest_seconds: 90, order_index: 1, completed: false },
        { id: `w${week}-d3-e2`, exercise_id: legEx2.id, exercise: legEx2, target_sets: 3, target_reps: '10-12', rest_seconds: 75, order_index: 2, completed: false },
        { id: `w${week}-d3-e3`, exercise_id: legEx3.id, exercise: legEx3, target_sets: 3, target_reps: '15', rest_seconds: 60, order_index: 3, completed: false },
        { id: `w${week}-d3-e4`, exercise_id: legEx4.id, exercise: legEx4, target_sets: 3, target_reps: '20', rest_seconds: 45, order_index: 4, completed: false },
      ],
    });

    // Day 4: HIIT Interval Conditioning & Core Melt
    const hiitEx1 = findBestExercise('full_body_cardio', ['core', 'quads']);
    const hiitEx2 = findBestExercise('glutes', ['full_body_cardio']);
    const hiitEx3 = findBestExercise('core');

    days.push({
      id: `w${week}-d4`,
      week_number: week,
      day_number: 4,
      day_title: 'HIIT Interval Blitz & Core',
      split_type: 'hiit_conditioning',
      exercises: [
        { id: `w${week}-d4-e1`, exercise_id: hiitEx1.id, exercise: hiitEx1, target_sets: 6, target_reps: '40s Work / 20s Rest', rest_seconds: 20, order_index: 1, completed: false },
        { id: `w${week}-d4-e2`, exercise_id: hiitEx2.id, exercise: hiitEx2, target_sets: 5, target_reps: '45s Work / 15s Rest', rest_seconds: 15, order_index: 2, completed: false },
        { id: `w${week}-d4-e3`, exercise_id: hiitEx3.id, exercise: hiitEx3, target_sets: 4, target_reps: '20 reps', rest_seconds: 30, order_index: 3, completed: false },
      ],
    });

    // Day 5: Upper Body Hypertrophy
    const upEx1 = findBestExercise('chest');
    const upEx2 = findBestExercise('back');
    const upEx3 = findBestExercise('shoulders');
    const upEx4 = findBestExercise('biceps');

    days.push({
      id: `w${week}-d5`,
      week_number: week,
      day_number: 5,
      day_title: 'Upper Body Pump & Symmetry',
      split_type: 'upper',
      exercises: [
        { id: `w${week}-d5-e1`, exercise_id: upEx1.id, exercise: upEx1, target_sets: 3, target_reps: '12-15', rest_seconds: 60, order_index: 1, completed: false },
        { id: `w${week}-d5-e2`, exercise_id: upEx2.id, exercise: upEx2, target_sets: 3, target_reps: '12-15', rest_seconds: 60, order_index: 2, completed: false },
        { id: `w${week}-d5-e3`, exercise_id: upEx3.id, exercise: upEx3, target_sets: 3, target_reps: '15', rest_seconds: 45, order_index: 3, completed: false },
        { id: `w${week}-d5-e4`, exercise_id: upEx4.id, exercise: upEx4, target_sets: 3, target_reps: '15', rest_seconds: 45, order_index: 4, completed: false },
      ],
    });

    // Day 6: Active Recovery & Cardio Flush
    days.push({
      id: `w${week}-d6`,
      week_number: week,
      day_number: 6,
      day_title: 'Circadian Walk & Active Recovery',
      split_type: 'rest_active',
      exercises: [
        { id: `w${week}-d6-e1`, exercise_id: 'rec-1', exercise: { id: 'rec-1', name: 'Zone 2 Circadian Outdoor Walk', target_muscle: 'full_body_cardio', equipment_required: 'bodyweight', difficulty: 'beginner', category: 'mobility', instructions: '45-60 minutes brisk pace in sunlight to lower cortisol and accelerate lactate clearance.', video_url_mock: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80' }, target_sets: 1, target_reps: '45-60 mins', rest_seconds: 0, order_index: 1, completed: false }
      ],
    });

    // Day 7: Full Rest & Meal Prep
    days.push({
      id: `w${week}-d7`,
      week_number: week,
      day_number: 7,
      day_title: 'Central Nervous System Rest & Prep',
      split_type: 'rest_active',
      exercises: [
        { id: `w${week}-d7-e1`, exercise_id: 'rec-2', exercise: { id: 'rec-2', name: 'Full Body Mobility & Hydration Focus', target_muscle: 'full_body_cardio', equipment_required: 'bodyweight', difficulty: 'beginner', category: 'mobility', instructions: 'Foam rolling, deep tissue breathing, and preparing weekly grocery macros.', video_url_mock: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80' }, target_sets: 1, target_reps: '20 mins', rest_seconds: 0, order_index: 1, completed: false }
      ],
    });
  }

  return days;
}

/**
 * Compiles a full 7-day grocery checklist from the athlete's nutrition plan
 */
export function compileGroceryList(foods: FoodItem[], multiplier: number = 1): GroceryItem[] {
  const pantryItems: GroceryItem[] = [
    { id: 'g-p1', item_name: 'Certified Gluten-Free Rolled Oats', category: 'pantry_monthly', quantity: 2 * multiplier, unit: 'kg bag', is_checked: false, notes: 'Whole grain breakfast & shake carbohydrate base' },
    { id: 'g-p2', item_name: '100% Pure Whey Isolate (Vanilla/Natural)', category: 'pantry_monthly', quantity: 1 * multiplier, unit: '5lb tub', is_checked: false, notes: 'Post-workout rapid absorption' },
    { id: 'g-p3', item_name: 'Steamed Jasmine Rice (Bulk)', category: 'pantry_monthly', quantity: 3 * multiplier, unit: 'kg bag', is_checked: false, notes: 'Clean easy-digesting starchy carb' },
    { id: 'g-p4', item_name: 'Organic Tri-Color Quinoa', category: 'pantry_monthly', quantity: 1 * multiplier, unit: 'kg bag', is_checked: false, notes: 'Complete amino acid profile carb' },
    { id: 'g-p5', item_name: 'Extra Virgin First Cold-Pressed Olive Oil', category: 'pantry_monthly', quantity: 1 * multiplier, unit: '750ml btl', is_checked: false, notes: 'Polyphenol-rich cooking and dressing fat' },
    { id: 'g-p6', item_name: 'Raw Organic Almonds & Walnuts', category: 'pantry_monthly', quantity: 1 * multiplier, unit: 'lb bag', is_checked: false, notes: 'Omega-3 and mineral dense healthy fat' },
    { id: 'g-p7', item_name: 'Unsweetened Almond Milk', category: 'pantry_monthly', quantity: 4 * multiplier, unit: 'cartons', is_checked: false, notes: 'Smoothie and oatmeal liquid' },
    { id: 'g-p8', item_name: 'Pink Himalayan Crystal Salt & Black Pepper', category: 'pantry_monthly', quantity: 1 * multiplier, unit: 'grinder', is_checked: true, notes: 'Electrolyte balance & sodium repletion' },
  ];

  const freshItems: GroceryItem[] = [
    { id: 'g-f1', item_name: 'Boneless Skinless Chicken Breast', category: 'fresh_weekly', quantity: 3.5 * multiplier, unit: 'lbs', is_checked: false, notes: 'Meal prep batch: 250g raw/day' },
    { id: 'g-f2', item_name: '93/7 Lean Ground Turkey', category: 'fresh_weekly', quantity: 2.0 * multiplier, unit: 'lbs', is_checked: false, notes: 'High satiety evening protein' },
    { id: 'g-f3', item_name: 'Fresh Wild Atlantic Salmon Fillets', category: 'fresh_weekly', quantity: 1.5 * multiplier, unit: 'lbs', is_checked: false, notes: 'Rich in EPA/DHA essential fatty acids' },
    { id: 'g-f4', item_name: 'Pasture-Raised Organic Whole Eggs', category: 'fresh_weekly', quantity: 2 * multiplier, unit: 'dozen', is_checked: false, notes: 'Choline and micronutrient rich' },
    { id: 'g-f5', item_name: 'Liquid 100% Egg Whites', category: 'fresh_weekly', quantity: 2 * multiplier, unit: 'cartons (32oz)', is_checked: false, notes: 'High-volume pure protein omelets' },
    { id: 'g-f6', item_name: 'Non-Fat Plain Greek Yogurt (0% Sugar)', category: 'fresh_weekly', quantity: 3 * multiplier, unit: 'tubs (32oz)', is_checked: false, notes: 'Probiotic-rich casein/whey protein' },
    { id: 'g-f7', item_name: 'Organic Garnet Sweet Potatoes', category: 'fresh_weekly', quantity: 5 * multiplier, unit: 'lbs', is_checked: false, notes: 'Pre-bake for instant meal carb source' },
    { id: 'g-f8', item_name: 'Fresh Hass Avocados', category: 'fresh_weekly', quantity: 5 * multiplier, unit: 'count', is_checked: false, notes: 'Potassium & monounsaturated fats' },
    { id: 'g-f9', item_name: 'Fresh Organic Blueberries & Blackberries', category: 'fresh_weekly', quantity: 4 * multiplier, unit: 'clamshells (6oz)', is_checked: false, notes: 'Antioxidant & polyphenol fruit carb' },
    { id: 'g-f10', item_name: 'Organic Broccoli Florets', category: 'fresh_weekly', quantity: 3 * multiplier, unit: 'lbs', is_checked: false, notes: 'Sulforaphane & cruciferous micronutrients' },
    { id: 'g-f11', item_name: 'Organic Baby Spinach (Pre-washed)', category: 'fresh_weekly', quantity: 2 * multiplier, unit: 'tubs (16oz)', is_checked: false, notes: 'Nitrate and magnesium source' },
    { id: 'g-f12', item_name: 'Fresh Green Asparagus Spears', category: 'fresh_weekly', quantity: 2 * multiplier, unit: 'bunches', is_checked: false, notes: 'Natural diuretic and prebiotic fiber' },
  ];

  return [...pantryItems, ...freshItems];
}
