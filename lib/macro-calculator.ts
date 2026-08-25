import { ActivityLevel, BiologicalSex, FastingProtocol, GoalType, MealSplitTarget, UserProfile } from './types';

/**
 * Activity Level Multipliers for Total Daily Energy Expenditure (TDEE)
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Desk job, little to no formal exercise
  light: 1.375, // Light exercise/sports 1-3 days/week
  moderate: 1.55, // Moderate exercise/sports 3-5 days/week
  high: 1.725, // Hard exercise/sports 6-7 days a week
  extreme: 1.9, // Very hard daily training & physical job
};

/**
 * Caloric adjustment per goal
 */
export const GOAL_CALORIE_ADJUSTMENTS: Record<GoalType, number> = {
  cut_500: -500, // Standard fat loss deficit (~1 lb/week)
  cut_250: -250, // Conservative deficit
  maintain: 0, // Energy balance
  bulk_250: 250, // Lean muscle gain
  bulk_500: 500, // Accelerated muscle gain
};

/**
 * Fasting protocol configurations: Fasting Hours vs Eating Window Hours
 */
export const FASTING_CONFIGS: Record<FastingProtocol, { name: string; fastHours: number; eatHours: number; description: string }> = {
  '16_8': {
    name: '16:8 LeanGains',
    fastHours: 16,
    eatHours: 8,
    description: 'Gold-standard fasting protocol for optimal metabolic health, fat oxidation, and muscle preservation.',
  },
  '18_6': {
    name: '18:6 Deep Fast',
    fastHours: 18,
    eatHours: 6,
    description: 'Advanced window accelerating cellular autophagy and deeper ketosis while allowing 2 solid meals.',
  },
  '20_4': {
    name: '20:4 Warrior Diet',
    fastHours: 20,
    eatHours: 4,
    description: 'Extended fasting with a concentrated 4-hour evening feeding window for maximum fat burning.',
  },
  '14_10': {
    name: '14:10 Gentle Transition',
    fastHours: 14,
    eatHours: 10,
    description: 'Beginner-friendly circadian fast ideal for circadian rhythm alignment and digestive rest.',
  },
  '23_1_omad': {
    name: '23:1 One Meal A Day (OMAD)',
    fastHours: 23,
    eatHours: 1,
    description: 'Maximum time-restricted feeding condensing total daily nutritional macros into one epic feast.',
  },
  'standard_3_meal': {
    name: 'Circadian 12:12 / Standard',
    fastHours: 12,
    eatHours: 12,
    description: 'Balanced 3-meal cadence aligned with daylight hours without extended fasting restriction.',
  },
};

/**
 * Calculates Basal Metabolic Rate (BMR) via Mifflin-St Jeor Equation
 * Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 * Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: BiologicalSex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') {
    return Math.round(base + 5);
  } else if (sex === 'female') {
    return Math.round(base - 161);
  }
  // Other/Neutral average
  return Math.round(base - 78);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.375;
  return Math.round(bmr * multiplier);
}

/**
 * Complete Macro Split Calculation
 * - Protein: 1.0g per lb of body weight (~2.2g per kg)
 * - Fat: 25% of total caloric target (9 kcal/g)
 * - Carbs: Remaining calories allocated to carbohydrates (4 kcal/g)
 */
export function calculateMacroTargets(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: BiologicalSex;
  activityLevel: ActivityLevel;
  goal: GoalType;
}) {
  const safeWeightKg = params.weightKg > 0 ? params.weightKg : 75;
  const safeHeightCm = params.heightCm > 0 ? params.heightCm : 175;
  const bmr = calculateBMR(safeWeightKg, safeHeightCm, params.age || 35, params.sex || 'male');
  const tdee = calculateTDEE(bmr, params.activityLevel || 'moderate');
  const adjustment = GOAL_CALORIE_ADJUSTMENTS[params.goal] ?? -500;
  
  // Total daily calorie target (minimum floor 1200 kcal for metabolic safety)
  const dailyCalories = Math.max(1200, tdee + adjustment);

  // 1.0g protein per lb of body weight (1 kg = 2.20462 lbs)
  const weightLbs = safeWeightKg * 2.20462;
  const proteinGrams = Math.round(Math.min(dailyCalories * 0.45 / 4, Math.max(100, weightLbs * 1.0)));
  const proteinCalories = proteinGrams * 4;

  // 25% of total calories from healthy fats (9 kcal per gram)
  const fatCalories = dailyCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  // Remainder to complex & clean carbohydrates (4 kcal per gram)
  const remainingCalories = Math.max(0, dailyCalories - proteinCalories - (fatGrams * 9));
  const carbGrams = Math.round(remainingCalories / 4);

  return {
    bmr,
    tdee,
    dailyCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    proteinPercent: Math.round((proteinCalories / dailyCalories) * 100),
    fatPercent: Math.round(((fatGrams * 9) / dailyCalories) * 100),
    carbPercent: Math.round(((carbGrams * 4) / dailyCalories) * 100),
  };
}

/**
 * Dynamic Meal Splitter
 * Distributes daily macro targets across 2, 3, or 4 meals per day
 */
export function calculateMealSplitTargets(
  dailyCalories: number,
  proteinG: number,
  carbG: number,
  fatG: number,
  mealCount: number,
  eatingWindowHours: number = 8,
  fastingStartTime: string = '20:00'
): MealSplitTarget[] {
  const count = Math.max(2, Math.min(6, mealCount));
  
  // Parse fasting start time to determine approximate meal timing within eating window
  const [fastHourStr] = fastingStartTime.split(':');
  const fastHour = parseInt(fastHourStr, 10) || 20;
  // If fast starts at 20:00 and eat window is 8h (16:8), eating starts at (20 - 8 + 24) % 24 = 12:00
  const eatStartHour = (fastHour - eatingWindowHours + 24) % 24;

  // Ratios for meal division
  let ratios: { title: string; fraction: number; timeOffsetHrs: number }[] = [];

  if (count === 2) {
    ratios = [
      { title: 'Meal 1 (Break-Fast / Anabolic Kickstart)', fraction: 0.50, timeOffsetHrs: 0 },
      { title: 'Meal 2 (Feast / Recovery Dinner)', fraction: 0.50, timeOffsetHrs: eatingWindowHours - 1 },
    ];
  } else if (count === 3) {
    ratios = [
      { title: 'Meal 1 (Fast-Breaker Lunch)', fraction: 0.35, timeOffsetHrs: 0 },
      { title: 'Meal 2 (Midday Fuel / Pre-Workout)', fraction: 0.40, timeOffsetHrs: Math.round(eatingWindowHours * 0.45) },
      { title: 'Meal 3 (Night Recovery Dinner)', fraction: 0.25, timeOffsetHrs: eatingWindowHours - 1 },
    ];
  } else if (count === 4) {
    ratios = [
      { title: 'Meal 1 (Break-Fast Starter)', fraction: 0.25, timeOffsetHrs: 0 },
      { title: 'Meal 2 (Mid-Day Power Lunch)', fraction: 0.30, timeOffsetHrs: Math.round(eatingWindowHours * 0.33) },
      { title: 'Meal 3 (Pre/Post-Workout Snack)', fraction: 0.25, timeOffsetHrs: Math.round(eatingWindowHours * 0.66) },
      { title: 'Meal 4 (Fast Close Dinner)', fraction: 0.20, timeOffsetHrs: eatingWindowHours - 1 },
    ];
  } else {
    // Generic fallback for N meals
    ratios = Array.from({ length: count }, (_, i) => ({
      title: `Meal ${i + 1}`,
      fraction: 1 / count,
      timeOffsetHrs: (eatingWindowHours / count) * i,
    }));
  }

  return ratios.map((r, index) => {
    const mealHour = (eatStartHour + Math.round(r.timeOffsetHrs)) % 24;
    const formattedTime = `${mealHour.toString().padStart(2, '0')}:00`;
    
    return {
      mealIndex: index + 1,
      title: r.title,
      suggestedTime: formattedTime,
      calories: Math.round(dailyCalories * r.fraction),
      protein_g: Math.round(proteinG * r.fraction),
      carbs_g: Math.round(carbG * r.fraction),
      fat_g: Math.round(fatG * r.fraction),
      percentOfTotal: Math.round(r.fraction * 100),
    };
  });
}

/**
 * Fasting Window State & Biological Stages
 */
export interface FastingStatus {
  isFasting: boolean;
  stageName: string;
  stageDescription: string;
  elapsedSeconds: number;
  totalTargetSeconds: number;
  remainingSeconds: number;
  progressPercent: number;
  currentPhaseText: string;
  nextMilestoneText: string;
  eatStartFormatted: string;
  eatEndFormatted: string;
}

export function computeFastingStatus(
  protocol: FastingProtocol,
  fastingStartTimeStr: string = '20:00',
  customEatHours?: number
): FastingStatus {
  const config = FASTING_CONFIGS[protocol] || FASTING_CONFIGS['16_8'];
  const eatHours = customEatHours || config.eatHours;
  const fastHours = 24 - eatHours;

  const now = new Date();
  const [fastHour, fastMinute] = fastingStartTimeStr.split(':').map((v) => parseInt(v, 10) || 0);

  // Fasting starts at fastHour:fastMinute
  // Fast ends (Eating starts) at (fastHour + fastHours) % 24
  // Eating ends at (fastHour + fastHours + eatHours) = fastHour
  const eatStartHour = (fastHour + fastHours) % 24;
  const eatEndHour = fastHour;

  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

  let isFasting = false;
  let elapsedSeconds = 0;
  const totalTargetSeconds = fastHours * 3600;

  // Determine if current time falls in fasting or eating window
  // e.g. Fast starts at 20:00 (8 PM) and lasts 16h (ends at 12:00 PM next day)
  const isOvernightFast = fastHour > eatStartHour;
  
  if (isOvernightFast) {
    if (currentHour >= fastHour || currentHour < eatStartHour) {
      isFasting = true;
      const hoursSinceStart = currentHour >= fastHour 
        ? currentHour - fastHour 
        : (24 - fastHour) + currentHour;
      elapsedSeconds = hoursSinceStart * 3600;
    } else {
      isFasting = false;
      const hoursSinceEatStart = currentHour - eatStartHour;
      elapsedSeconds = hoursSinceEatStart * 3600;
    }
  } else {
    // Fasting during the day (e.g. 08:00 to 00:00)
    if (currentHour >= fastHour && currentHour < eatStartHour) {
      isFasting = true;
      elapsedSeconds = (currentHour - fastHour) * 3600;
    } else {
      isFasting = false;
      const hoursSinceEatStart = currentHour >= eatStartHour 
        ? currentHour - eatStartHour 
        : (24 - eatStartHour) + currentHour;
      elapsedSeconds = hoursSinceEatStart * 3600;
    }
  }

  const durationTarget = isFasting ? fastHours * 3600 : eatHours * 3600;
  const remainingSeconds = Math.max(0, durationTarget - elapsedSeconds);
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedSeconds / durationTarget) * 100)));

  const elapsedHours = elapsedSeconds / 3600;

  // Biological fasting stages
  let stageName = 'Anabolic / Digestion';
  let stageDescription = 'Body is digesting recent meal, blood glucose & insulin levels are active.';
  let nextMilestoneText = 'Blood Sugar Stabilization (at 4-8 hrs)';

  if (isFasting) {
    if (elapsedHours < 4) {
      stageName = 'Early Post-Absorptive';
      stageDescription = 'Nutrient absorption finishing; insulin begins decreasing to baseline.';
      nextMilestoneText = 'Glycogen Depletion begins at 8 hours.';
    } else if (elapsedHours < 8) {
      stageName = 'Blood Sugar Stabilization';
      stageDescription = 'Insulin drops significantly, liver begins releasing stored glycogen for energy.';
      nextMilestoneText = 'Fat Oxidation & Ketone Rise at 12 hours.';
    } else if (elapsedHours < 12) {
      stageName = 'Glycogen Depletion & Lipolysis';
      stageDescription = 'Body transitions to burning stored subcutaneous and visceral fat for primary fuel.';
      nextMilestoneText = 'Ketosis Activation at 14-16 hours.';
    } else if (elapsedHours < 16) {
      stageName = 'Ketosis & Accelerated Fat Burn';
      stageDescription = 'Ketone body production ramps up, cognitive clarity increases, growth hormone spikes.';
      nextMilestoneText = 'Autophagy Induction at 18+ hours.';
    } else {
      stageName = 'Deep Autophagy & Cellular Repair';
      stageDescription = 'Damaged cellular debris and dysfunctional mitochondria are recycled into fresh amino acids.';
      nextMilestoneText = 'Peak fasting benefits active!';
    }
  } else {
    stageName = 'Active Eating / Nutrient Refueling';
    stageDescription = `Replenishing glycogen stores and delivering amino acids to rebuild muscle tissue (${Math.round(remainingSeconds / 3600)}h left in eating window).`;
    nextMilestoneText = `Fast starts again at ${fastHour.toString().padStart(2, '0')}:${fastMinute.toString().padStart(2, '0')}`;
  }

  return {
    isFasting,
    stageName,
    stageDescription,
    elapsedSeconds: Math.floor(elapsedSeconds),
    totalTargetSeconds: durationTarget,
    remainingSeconds: Math.floor(remainingSeconds),
    progressPercent,
    currentPhaseText: isFasting ? `Fasting Phase (${fastHours}h Target)` : `Eating Window (${eatHours}h Window)`,
    nextMilestoneText,
    eatStartFormatted: `${eatStartHour.toString().padStart(2, '0')}:00`,
    eatEndFormatted: `${fastHour.toString().padStart(2, '0')}:${fastMinute.toString().padStart(2, '0')}`,
  };
}

/**
 * Calculates Real-time Food Swap Equivalent grams
 * E.g., If user is swapping 150g of Chicken Breast (46.5g protein) for 93/7 Ground Turkey (22g protein/100g),
 * calculate the exact grams of Turkey required to hit identical target protein!
 */
export function calculateSwapEquivalentGrams(
  sourceFood: { protein_per_100g: number; carbs_per_100g: number; calories_per_100g: number },
  sourceGrams: number,
  targetFood: { protein_per_100g: number; carbs_per_100g: number; calories_per_100g: number },
  priorityMacro: 'protein' | 'carbs' | 'calories' = 'protein'
): number {
  if (priorityMacro === 'protein') {
    const targetProteinNeeded = (sourceFood.protein_per_100g / 100) * sourceGrams;
    if (targetFood.protein_per_100g <= 0) return sourceGrams;
    return Math.round((targetProteinNeeded / targetFood.protein_per_100g) * 100);
  } else if (priorityMacro === 'carbs') {
    const targetCarbsNeeded = (sourceFood.carbs_per_100g / 100) * sourceGrams;
    if (targetFood.carbs_per_100g <= 0) return sourceGrams;
    return Math.round((targetCarbsNeeded / targetFood.carbs_per_100g) * 100);
  } else {
    const targetCaloriesNeeded = (sourceFood.calories_per_100g / 100) * sourceGrams;
    if (targetFood.calories_per_100g <= 0) return sourceGrams;
    return Math.round((targetCaloriesNeeded / targetFood.calories_per_100g) * 100);
  }
}
