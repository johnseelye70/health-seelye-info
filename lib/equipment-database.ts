import { EquipmentCategoryMeta, EquipmentSubCategoryMeta, EquipmentItem, EquipmentCategory, PlateInventory } from './types';

export const DEFAULT_PLATE_INVENTORY: PlateInventory = {
  plates_100lb: 0,
  plates_55lb: 0,
  plates_45lb: 0,
  plates_35lb: 0,
  plates_25lb: 0,
  plates_15lb: 0,
  plates_10lb: 0,
  plates_5lb: 0,
  plates_2_5lb: 0,
  plates_1_25lb: 0,
  plates_1lb: 0,
  plates_0_5lb: 0,
  bar_weight_lbs: 45,
};

export const BARBELL_TYPES = [
  { id: 'olympic_45', name: 'Olympic Standard Men Barbell (7ft)', weightLbs: 45, weightKg: 20 },
  { id: 'olympic_35', name: 'Olympic Women Barbell (6.5ft)', weightLbs: 35, weightKg: 15 },
  { id: 'ez_curl_20', name: 'EZ Curl Cambered Barbell', weightLbs: 20, weightKg: 9 },
  { id: 'trap_bar_60', name: 'Hex / Trap Barbell (Heavy Duty)', weightLbs: 60, weightKg: 27 },
  { id: 'safety_squat_65', name: 'Safety Squat Bar (SSB Padded)', weightLbs: 65, weightKg: 29.5 },
  { id: 'swiss_multigrip_40', name: 'Swiss Multi-Grip Neutral Bar', weightLbs: 40, weightKg: 18 },
];

export const INDIVIDUAL_PLATE_DENOMINATIONS = [
  { key: 'plates_100lb' as const, weightLbs: 100, weightKg: 45.4, color: '#1e293b', label: '100 lb / 45.4 kg', standardColorName: 'Heavy Black' },
  { key: 'plates_55lb' as const, weightLbs: 55, weightKg: 25.0, color: '#ef4444', label: '55 lb / 25.0 kg', standardColorName: 'Olympic Red' },
  { key: 'plates_45lb' as const, weightLbs: 45, weightKg: 20.4, color: '#3b82f6', label: '45 lb / 20.4 kg', standardColorName: 'Olympic Blue' },
  { key: 'plates_35lb' as const, weightLbs: 35, weightKg: 15.9, color: '#eab308', label: '35 lb / 15.9 kg', standardColorName: 'Olympic Yellow' },
  { key: 'plates_25lb' as const, weightLbs: 25, weightKg: 11.3, color: '#10b981', label: '25 lb / 11.3 kg', standardColorName: 'Olympic Green' },
  { key: 'plates_15lb' as const, weightLbs: 15, weightKg: 6.8, color: '#6366f1', label: '15 lb / 6.8 kg', standardColorName: 'Technique Indigo' },
  { key: 'plates_10lb' as const, weightLbs: 10, weightKg: 4.5, color: '#f97316', label: '10 lb / 4.5 kg', standardColorName: 'Olympic White/Orange' },
  { key: 'plates_5lb' as const, weightLbs: 5, weightKg: 2.3, color: '#ec4899', label: '5 lb / 2.3 kg', standardColorName: 'Olympic Grey/Pink' },
  { key: 'plates_2_5lb' as const, weightLbs: 2.5, weightKg: 1.1, color: '#8b5cf6', label: '2.5 lb / 1.1 kg', standardColorName: 'Fractional Micro' },
  { key: 'plates_1_25lb' as const, weightLbs: 1.25, weightKg: 0.57, color: '#14b8a6', label: '1.25 lb / 0.57 kg', standardColorName: 'Micro Teal' },
  { key: 'plates_1lb' as const, weightLbs: 1.0, weightKg: 0.45, color: '#a855f7', label: '1.0 lb / 0.45 kg', standardColorName: 'Micro Purple' },
  { key: 'plates_0_5lb' as const, weightLbs: 0.5, weightKg: 0.23, color: '#94a3b8', label: '0.5 lb / 0.23 kg', standardColorName: 'Micro Silver' },
];

export const PLATE_DENOMINATIONS = INDIVIDUAL_PLATE_DENOMINATIONS;

/**
 * Extracts exact count for each plate denomination, normalizing pairs and individual inputs
 */
export function getNormalizedPlateCounts(plates: PlateInventory = DEFAULT_PLATE_INVENTORY): Record<string, number> {
  return {
    plates_100lb: plates.plates_100lb || 0,
    plates_55lb: plates.plates_55lb || 0,
    plates_45lb: plates.plates_45lb ?? (plates.pairs_45lb ? plates.pairs_45lb * 2 : 0),
    plates_35lb: plates.plates_35lb ?? (plates.pairs_35lb ? plates.pairs_35lb * 2 : 0),
    plates_25lb: plates.plates_25lb ?? (plates.pairs_25lb ? plates.pairs_25lb * 2 : 0),
    plates_15lb: plates.plates_15lb || 0,
    plates_10lb: plates.plates_10lb ?? (plates.pairs_10lb ? plates.pairs_10lb * 2 : 0),
    plates_5lb: plates.plates_5lb ?? (plates.pairs_5lb ? plates.pairs_5lb * 2 : 0),
    plates_2_5lb: plates.plates_2_5lb ?? (plates.pairs_2_5lb ? plates.pairs_2_5lb * 2 : 0),
    plates_1_25lb: plates.plates_1_25lb || 0,
    plates_1lb: plates.plates_1lb || 0,
    plates_0_5lb: plates.plates_0_5lb || 0,
  };
}

/**
 * Calculates total available plate weight and maximum safe barbell load
 */
export function calculateTotalPlateWeight(plates: PlateInventory = DEFAULT_PLATE_INVENTORY) {
  const counts = getNormalizedPlateCounts(plates);
  let totalPlateWeightLbs = 0;
  let totalPlatesCount = 0;
  let evenPairsPlateWeightLbs = 0;

  for (const denom of INDIVIDUAL_PLATE_DENOMINATIONS) {
    const count = counts[denom.key] || 0;
    totalPlateWeightLbs += count * denom.weightLbs;
    totalPlatesCount += count;
    // For even loading on barbell (both sides matching):
    const pairsCount = Math.floor(count / 2);
    evenPairsPlateWeightLbs += pairsCount * 2 * denom.weightLbs;
  }

  const barWeightLbs = plates.bar_weight_lbs || 45;
  const maxBarbellLbs = evenPairsPlateWeightLbs + barWeightLbs;
  const totalPlateKg = Number((totalPlateWeightLbs * 0.45359237).toFixed(1));
  const maxBarbellKg = Number((maxBarbellLbs * 0.45359237).toFixed(1));

  return {
    plateWeightLbs: totalPlateWeightLbs,
    evenPairsPlateWeightLbs,
    totalPlateKg,
    barWeightLbs,
    maxBarbellLbs,
    maxBarbellKg,
    totalPlatesCount,
  };
}

/**
 * Calculates the exact plate loading per side for any target barbell weight
 */
export function calculateBarbellPlateLoading(
  targetWeightLbs: number,
  plates: PlateInventory = DEFAULT_PLATE_INVENTORY
) {
  const barWeight = plates.bar_weight_lbs || 45;
  if (targetWeightLbs < barWeight) {
    return {
      possible: false,
      isExact: false,
      actualWeightLbs: barWeight,
      targetWeightLbs,
      platesPerSide: [],
      remainingLbs: targetWeightLbs - barWeight,
      message: `Target weight (${targetWeightLbs} lbs) is less than the bar weight (${barWeight} lbs).`,
    };
  }

  const counts = getNormalizedPlateCounts(plates);
  let weightNeededPerSide = (targetWeightLbs - barWeight) / 2;
  const platesPerSide: { weightLbs: number; count: number; color: string; label: string }[] = [];

  let actualPerSide = 0;

  for (const denom of INDIVIDUAL_PLATE_DENOMINATIONS) {
    const totalOwned = counts[denom.key] || 0;
    const availablePairs = Math.floor(totalOwned / 2);

    if (weightNeededPerSide >= denom.weightLbs && availablePairs > 0) {
      const neededCount = Math.floor(weightNeededPerSide / denom.weightLbs);
      const usedCount = Math.min(neededCount, availablePairs);
      if (usedCount > 0) {
        platesPerSide.push({
          weightLbs: denom.weightLbs,
          count: usedCount,
          color: denom.color,
          label: `${denom.weightLbs} lb`,
        });
        weightNeededPerSide -= usedCount * denom.weightLbs;
        actualPerSide += usedCount * denom.weightLbs;
      }
    }
  }

  const actualTotalLbs = barWeight + actualPerSide * 2;
  const isExact = Math.abs(actualTotalLbs - targetWeightLbs) < 0.1;

  return {
    possible: true,
    isExact,
    actualWeightLbs: actualTotalLbs,
    targetWeightLbs,
    platesPerSide,
    remainingLbs: targetWeightLbs - actualTotalLbs,
    message: isExact
      ? `Exact match: Load ${platesPerSide.map((p) => `${p.count}×${p.label}`).join(' + ')} on each side.`
      : `Loaded ${actualTotalLbs} lbs (limited by available plate inventory).`,
  };
}

export const EQUIPMENT_CATEGORIES: EquipmentCategoryMeta[] = [
  {
    id: 'free_weights',
    name: 'Free Weights & Resistance',
    shortLabel: 'Free Weights',
    icon: '🏋️‍♂️',
    description: 'Olympic barbells, specialty bars, custom weight plates, dumbbells, kettlebells & slam balls',
    accentColor: '#f97316',
  },
  {
    id: 'benches_racks',
    name: 'Benches, Racks & Power Cages',
    shortLabel: 'Benches & Racks',
    icon: '🏗️',
    description: 'Adjustable incline benches, competition flat benches, power cages, squat stands & GHDs',
    accentColor: '#3b82f6',
  },
  {
    id: 'cable_machines',
    name: 'Cable Towers & Pulley Systems',
    shortLabel: 'Cable Machines',
    icon: '⚙️',
    description: 'Dual adjustable pulleys, lat pulldowns, seated cable rows, smith machines & crossover towers',
    accentColor: '#06b6d4',
  },
  {
    id: 'plate_machines',
    name: 'Plate-Loaded & Selectorized Machines',
    shortLabel: 'Gym Machines',
    icon: '🦾',
    description: 'Linear leg press, hack squats, pendulum squats, leg curl/extension, chest press & pec flyes',
    accentColor: '#8b5cf6',
  },
  {
    id: 'bodyweight_calisthenics',
    name: 'Bodyweight & Calisthenics Stations',
    shortLabel: 'Bodyweight & Bars',
    icon: '🤸‍♂️',
    description: 'Pull-up bars, dip stations, gymnastic rings, parallettes, ab rollers & suspension trainers',
    accentColor: '#10b981',
  },
  {
    id: 'bands_accessories',
    name: 'Resistance Bands & Accessories',
    shortLabel: 'Bands & Straps',
    icon: '🎗️',
    description: 'Loop resistance bands, tube bands, glute bands, lifting belts, wrist wraps & foam rollers',
    accentColor: '#ec4899',
  },
  {
    id: 'cardio_conditioning',
    name: 'Cardio & Conditioning Gear',
    shortLabel: 'Cardio & Conditioning',
    icon: '⚡',
    description: 'Concept2 rowers, assault air bikes, SkiErgs, speed jump ropes, plyo boxes & battle ropes',
    accentColor: '#eab308',
  },
];

export const EQUIPMENT_SUB_CATEGORIES: EquipmentSubCategoryMeta[] = [
  // 1. Free Weights
  { id: 'dumbbells_sub', parentId: 'free_weights', name: 'Dumbbells (Light, Heavy & Adjustable)', icon: '🏋️', description: 'Selectorized dumbbells, urethane fixed pairs & micro-loading sets' },
  { id: 'barbells_sub', parentId: 'free_weights', name: 'Olympic & Specialty Barbells', icon: '🔩', description: 'Olympic 20kg bars, women 15kg bars, safety squat bars, swiss bars & trap bars' },
  { id: 'weight_plates_sub', parentId: 'free_weights', name: 'Olympic Weight Plates & Fractional Pairs', icon: '💿', description: '45lb, 35lb, 25lb, 10lb, 5lb & 2.5lb bumper/iron plates' },
  { id: 'kettlebells_sub', parentId: 'free_weights', name: 'Cast Iron & Competition Kettlebells', icon: '🔔', description: 'Hardstyle cast iron & competition standard kettlebells (8kg–48kg)' },
  { id: 'ez_curl_bars_sub', parentId: 'free_weights', name: 'EZ Curl & Cambered Short Bars', icon: '🦾', description: 'Cambered EZ curl bars, tricep hammer bars & short technique bars' },
  { id: 'medicine_balls_sub', parentId: 'free_weights', name: 'Slam Balls, Sandbags & Atlas Gear', icon: '🏀', description: 'Dead-bounce rubber slam balls, heavy sandbags & medicine balls' },

  // 2. Benches & Racks
  { id: 'adj_benches_sub', parentId: 'benches_racks', name: 'Adjustable Incline / Decline Benches', icon: '🪑', description: '0-90 degree incline/decline commercial ladder utility benches' },
  { id: 'flat_benches_sub', parentId: 'benches_racks', name: 'Flat Competition Utility Benches', icon: '🪵', description: 'IPF specification flat benches with wide high-density foam' },
  { id: 'power_racks_sub', parentId: 'benches_racks', name: 'Power Cages & 6-Post Racks', icon: '🏗️', description: '3x3 steel heavy cages with safety strap pins, pull-up bars and J-cups' },
  { id: 'squat_stands_sub', parentId: 'benches_racks', name: 'Squat Stands & Folding Wall Racks', icon: '📐', description: 'Compact home gym squat stands with safety spotter arms' },
  { id: 'specialized_benches_sub', parentId: 'benches_racks', name: 'Preacher, GHD & Hyperextension Benches', icon: '💪', description: 'Preacher curl benches, GHD glute ham developers & 45° Roman chairs' },

  // 3. Cable Machines
  { id: 'cable_towers_sub', parentId: 'cable_machines', name: 'Dual Adjustable Cable Pulley Towers', icon: '🗼', description: 'Commercial dual weight stack functional trainers with multi-position pulleys' },
  { id: 'lat_pulldowns_sub', parentId: 'cable_machines', name: 'Lat Pulldown & Seated Low Rows', icon: '🎣', description: 'Dedicated vertical cable towers with thigh pads and seated row footplates' },
  { id: 'crossover_stations_sub', parentId: 'cable_machines', name: 'Wide Span Cable Crossovers', icon: '⚙️', description: 'Wide-span cable crossover with multi-grip chin-up crossbars' },
  { id: 'smith_machines_sub', parentId: 'cable_machines', name: 'Smith Machines (Linear & 3D)', icon: '🔒', description: 'Linear bearing guided barbell track systems with safety lockouts' },

  // 4. Plate-Loaded Machines
  { id: 'leg_press_sub', parentId: 'plate_machines', name: 'Leg Press, Hack Squats & Belt Squats', icon: '🦵', description: '45-degree linear leg press, hack squats and belt squat platforms' },
  { id: 'leg_curl_ext_sub', parentId: 'plate_machines', name: 'Leg Extension & Hamstring Curls', icon: '🦿', description: 'Pin-selectorized and plate-loaded quad extensions and lying/seated leg curls' },
  { id: 'chest_back_machines_sub', parentId: 'plate_machines', name: 'Iso-Lateral Chest & Row Machines', icon: '🛡️', description: 'Converging chest press, incline press and chest-supported T-bar rows' },
  { id: 'fly_delt_machines_sub', parentId: 'plate_machines', name: 'Pec Deck & Rear Delt Machines', icon: '🦅', description: 'Dual function chest flye, rear delt machines and lateral raise machines' },

  // 5. Bodyweight & Calisthenics
  { id: 'pull_up_bars_sub', parentId: 'bodyweight_calisthenics', name: 'Pull-Up & Multi-Grip Bars', icon: '🚪', description: 'Ceiling, wall-mounted, and doorway multi-grip pull-up bars' },
  { id: 'dip_stations_sub', parentId: 'bodyweight_calisthenics', name: 'Dip Bars & Power Towers', icon: '🧱', description: 'Parallel dip bars, wall-mounted dip horns and vertical knee raise stations' },
  { id: 'rings_suspension_sub', parentId: 'bodyweight_calisthenics', name: 'Gymnastic Rings & TRX Straps', icon: '⭕', description: 'Wooden gymnastic rings with numbered straps and suspension trainers' },
  { id: 'parallettes_ab_sub', parentId: 'bodyweight_calisthenics', name: 'Parallettes, Ab Wheels & Core Sliders', icon: '🛹', description: 'Low pushup parallettes, dual-wheel ab rollers and core gliders' },

  // 6. Bands & Accessories
  { id: 'loop_bands_sub', parentId: 'bands_accessories', name: 'Heavy Loop Power Resistance Bands', icon: '➰', description: '41-inch latex loop powerlifting and pull-up assist bands (10–150 lbs)' },
  { id: 'tube_bands_sub', parentId: 'bands_accessories', name: 'Handled Resistance Tube Systems', icon: '〰️', description: 'Modular tube bands with foam handles, door anchors and ankle straps' },
  { id: 'lifting_accessories_sub', parentId: 'bands_accessories', name: 'Lifting Belts, Straps & Wraps', icon: '🎗️', description: '10mm/13mm leather lever belts, lasso straps, figure-8 straps & wrist wraps' },
  { id: 'recovery_foam_sub', parentId: 'bands_accessories', name: 'Foam Rollers & Mobility Lacrosse Balls', icon: '🧘', description: 'High-density foam rollers, peanut rollers and trigger point balls' },

  // 7. Cardio & Conditioning
  { id: 'rowers_bikes_sub', parentId: 'cardio_conditioning', name: 'Concept2 Rowers, SkiErgs & AirBikes', icon: '🚣', description: 'Concept2 indoor rowers, Rogue Echo assault bikes & SkiErgs' },
  { id: 'jump_ropes_boxes_sub', parentId: 'cardio_conditioning', name: 'Speed Jump Ropes & 3-in-1 Plyo Boxes', icon: '📦', description: 'Ball-bearing speed jump ropes and heavy wooden/foam plyometric boxes' },
  { id: 'battle_ropes_sleds_sub', parentId: 'cardio_conditioning', name: 'Battle Ropes, Prowler Sleds & Turf', icon: '〰️', description: '50-foot heavy battle ropes, push/pull prowler sleds and turf tracks' },
];

export const MASTER_EQUIPMENT_DATABASE: EquipmentItem[] = [
  // ========================================================
  // 1. FREE WEIGHTS - DUMBBELLS, BARBELLS & PLATES
  // ========================================================
  { id: 'dumbbells', name: 'Adjustable Dumbbells Set (5–50 lbs)', category: 'free_weights', sub_category: 'dumbbells_sub', icon: '🏋️', description: 'Quick-change selectorized or plate-loaded dumbbell pairs for versatile home strength', footprint: 'compact', typical_exercises_unlocked: 120 },
  { id: 'heavy_dumbbells', name: 'Heavy Fixed Dumbbells (55–120+ lbs)', category: 'free_weights', sub_category: 'dumbbells_sub', icon: '🏋️‍♂️', description: 'Commercial urethane heavy dumbbell rack for heavy presses, rows and farmer carries', footprint: 'commercial_heavy', typical_exercises_unlocked: 65 },
  { id: 'light_dumbbells', name: 'Light Dumbbells (2–15 lbs)', category: 'free_weights', sub_category: 'dumbbells_sub', icon: '🏋️', description: 'Neoprene or rubber light dumbbells for lateral raises, rotator cuff and high-rep conditioning', footprint: 'compact', typical_exercises_unlocked: 45 },

  { id: 'barbells', name: 'Olympic 20kg Standard Barbell (7ft / 45 lbs)', category: 'free_weights', sub_category: 'barbells_sub', icon: '🔩', description: 'Standard 45 lb Olympic barbell with rotating sleeves and center knurling for bench, squats and deadlifts', footprint: 'medium', typical_exercises_unlocked: 110 },
  { id: 'womens_barbell_15kg', name: 'Olympic Women 15kg Barbell (6.5ft / 35 lbs)', category: 'free_weights', sub_category: 'barbells_sub', icon: '🔩', description: '25mm grip diameter 35 lb Olympic barbell designed for Olympic lifts and cross-training', footprint: 'medium', typical_exercises_unlocked: 95 },
  { id: 'safety_squat_bar', name: 'Safety Squat Bar (SSB with Padded Yoke)', category: 'free_weights', sub_category: 'barbells_sub', icon: '🛡️', description: 'Cambered squat bar with shoulder pads and forward handles to reduce shoulder and wrist strain', footprint: 'medium', typical_exercises_unlocked: 25 },
  { id: 'trap_bar', name: 'Heavy-Duty Hex / Trap Bar', category: 'free_weights', sub_category: 'barbells_sub', icon: '🛑', description: 'Neutral-grip deadlift bar for lower-back friendly deadlifts, shrugs and heavy carries', footprint: 'medium', typical_exercises_unlocked: 30 },
  { id: 'swiss_multigrip_bar', name: 'Swiss Multi-Grip / Football Bar', category: 'free_weights', sub_category: 'barbells_sub', icon: '🏈', description: 'Angled neutral-grip barbell for shoulder-friendly bench presses and hammer curls', footprint: 'medium', typical_exercises_unlocked: 22 },
  { id: 'ez_curl_bar', name: 'Cambered EZ Curl Bar (20 lbs)', category: 'free_weights', sub_category: 'ez_curl_bars_sub', icon: '🦾', description: 'Ergonomic undulating bar for wrist-friendly bicep curls, skullcrushers and upright rows', footprint: 'compact', typical_exercises_unlocked: 35 },

  { id: 'weight_plates', name: 'Olympic Weight Plates Set (2.5–45 lbs)', category: 'free_weights', sub_category: 'weight_plates_sub', icon: '💿', description: 'Full set of Olympic 45s, 35s, 25s, 10s, 5s and 2.5s for barbell and machine loading', footprint: 'medium', typical_exercises_unlocked: 130 },
  { id: 'bumper_plates', name: 'High-Density Bumper Plates (Olympic Drop Safe)', category: 'free_weights', sub_category: 'weight_plates_sub', icon: '🛞', description: 'Solid virgin rubber drop plates with steel inserts for deadlifts, cleans and snatches', footprint: 'medium', typical_exercises_unlocked: 80 },
  { id: 'fractional_plates', name: 'Micro Fractional Plates (0.5 lb, 1 lb, 1.5 lb)', category: 'free_weights', sub_category: 'weight_plates_sub', icon: '🔘', description: 'Precision micro-loading plates for continuous progressive overload on overhead press and bench', footprint: 'compact', typical_exercises_unlocked: 50 },

  { id: 'kettlebells', name: 'Competition Cast Iron Kettlebells (16kg–32kg)', category: 'free_weights', sub_category: 'kettlebells_sub', icon: '🔔', description: 'Hardstyle cast iron kettlebells for explosive hip swings, snatches, cleans and Turkish get-ups', footprint: 'compact', typical_exercises_unlocked: 55 },
  { id: 'light_kettlebell', name: 'Light Kettlebells (8kg–12kg / 18–26 lbs)', category: 'free_weights', sub_category: 'kettlebells_sub', icon: '🔔', description: 'Lighter kettlebells for halos, windmills, single-arm presses and warmup mobility', footprint: 'compact', typical_exercises_unlocked: 35 },
  { id: 'medicine_ball', name: 'Heavy Rubber Slam Ball (20–30 lbs)', category: 'free_weights', sub_category: 'medicine_balls_sub', icon: '🏀', description: 'Dead-bounce rubber sand-filled slam ball for core rotational slams and conditioning', footprint: 'compact', typical_exercises_unlocked: 30 },
  { id: 'sandbag_training', name: 'Heavy Workout Sandbag (50–100 lbs)', category: 'free_weights', sub_category: 'medicine_balls_sub', icon: '🎒', description: 'Unstable load filler sandbag with multi-handles for functional carries, cleans and squats', footprint: 'compact', typical_exercises_unlocked: 25 },

  // ========================================================
  // 2. BENCHES & RACKS
  // ========================================================
  { id: 'adjustable_bench', name: 'Commercial Adjustable Incline Bench (-15° to +85°)', category: 'benches_racks', sub_category: 'adj_benches_sub', icon: '🪑', description: 'Ladder-style commercial bench with multi-angle adjustments for incline, flat and decline pressing', footprint: 'medium', typical_exercises_unlocked: 140 },
  { id: 'flat_bench', name: 'Heavy Duty Flat Competition Bench', category: 'benches_racks', sub_category: 'flat_benches_sub', icon: '🪵', description: 'Sturdy 12-inch wide pad competition flat utility bench for powerlifting bench presses and rows', footprint: 'medium', typical_exercises_unlocked: 80 },
  { id: 'power_rack', name: 'Full 4-Post Heavy Power Cage / Squat Rack', category: 'benches_racks', sub_category: 'power_racks_sub', icon: '🏗️', description: 'Heavy gauge steel cage with safety flip-down arms and pull-up bar for squats and bench pressing', footprint: 'commercial_heavy', typical_exercises_unlocked: 100 },
  { id: 'squat_stands', name: 'Independent Squat Stands / Half Rack', category: 'benches_racks', sub_category: 'squat_stands_sub', icon: '📐', description: 'Space-saving adjustable height stands for barbell squats, lunges and overhead pressing', footprint: 'medium', typical_exercises_unlocked: 60 },
  { id: 'preacher_bench', name: 'Seated Preacher Arm Curl Bench', category: 'benches_racks', sub_category: 'specialized_benches_sub', icon: '💪', description: 'Angled arm pad support for strict bicep isolation without shoulder compensation', footprint: 'medium', typical_exercises_unlocked: 18 },
  { id: 'ghd_machine', name: 'Glute Ham Developer (GHD)', category: 'benches_racks', sub_category: 'specialized_benches_sub', icon: '🍑', description: 'Split-thigh pad station for posterior chain hamstring raises and hyperextensions', footprint: 'commercial_heavy', typical_exercises_unlocked: 22 },
  { id: 'roman_chair_hyperextension', name: '45-Degree Back Hyperextension Roman Chair', category: 'benches_racks', sub_category: 'specialized_benches_sub', icon: '📐', description: 'Angled hip support for spinal erector strengthening, glute bridges and side bends', footprint: 'medium', typical_exercises_unlocked: 16 },

  // ========================================================
  // 3. CABLE MACHINES & PULLEYS
  // ========================================================
  { id: 'cable_machine', name: 'Dual Adjustable Cable Pulley Functional Trainer', category: 'cable_machines', sub_category: 'cable_towers_sub', icon: '🗼', description: 'Dual weight stack functional trainer with 36-position swivel pulleys for 360° rotational exercises', footprint: 'commercial_heavy', typical_exercises_unlocked: 110 },
  { id: 'lat_pulldown', name: 'Lat Pulldown & Seated Low Row Tower', category: 'cable_machines', sub_category: 'lat_pulldowns_sub', icon: '🎣', description: 'Vertical cable tower with adjustable thigh pads and seated row footplate', footprint: 'commercial_heavy', typical_exercises_unlocked: 45 },
  { id: 'cable_crossover', name: 'Wide Span Cable Crossover Machine', category: 'cable_machines', sub_category: 'crossover_stations_sub', icon: '⚙️', description: 'Full-gym cable crossover for high-to-low chest flyes, woodchops and cable lateral raises', footprint: 'commercial_heavy', typical_exercises_unlocked: 85 },
  { id: 'smith_machine', name: 'Linear Bearing Smith Machine', category: 'cable_machines', sub_category: 'smith_machines_sub', icon: '🔒', description: 'Fixed plane barbell on precision linear bearings with safety hook lockouts', footprint: 'commercial_heavy', typical_exercises_unlocked: 70 },

  // ========================================================
  // 4. PLATE-LOADED & GYM MACHINES
  // ========================================================
  { id: 'leg_press', name: '45-Degree Plate-Loaded Leg Press', category: 'plate_machines', sub_category: 'leg_press_sub', icon: '🦵', description: 'Heavy linear sled for high-volume quad and glute pressing without spinal loading', footprint: 'commercial_heavy', typical_exercises_unlocked: 20 },
  { id: 'hack_squat', name: 'Linear Hack Squat Machine', category: 'plate_machines', sub_category: 'leg_press_sub', icon: '🦿', description: 'Angled shoulder pad sled for intense quadriceps teardrop (VMO) isolation', footprint: 'commercial_heavy', typical_exercises_unlocked: 15 },
  { id: 'leg_extension', name: 'Seated Leg Extension Machine', category: 'plate_machines', sub_category: 'leg_curl_ext_sub', icon: '🦿', description: 'Pin-loaded machine for strict rectus femoris knee extension peak contraction', footprint: 'commercial_heavy', typical_exercises_unlocked: 14 },
  { id: 'leg_curl', name: 'Lying or Seated Hamstring Curl Machine', category: 'plate_machines', sub_category: 'leg_curl_ext_sub', icon: '🦵', description: 'Isolated knee flexion machine for hamstring hypertrophy and knee joint integrity', footprint: 'commercial_heavy', typical_exercises_unlocked: 16 },
  { id: 'chest_press_machine', name: 'Iso-Lateral Chest Press Machine', category: 'plate_machines', sub_category: 'chest_back_machines_sub', icon: '🛡️', description: 'Converging lever arm machine for joint-friendly heavy pressing overload', footprint: 'commercial_heavy', typical_exercises_unlocked: 20 },
  { id: 't_bar_row_machine', name: 'Chest-Supported T-Bar Row Machine', category: 'plate_machines', sub_category: 'chest_back_machines_sub', icon: '🚣', description: 'Angled pad support for heavy upper back rows without lower back fatigue', footprint: 'commercial_heavy', typical_exercises_unlocked: 18 },
  { id: 'pec_deck', name: 'Pec Deck & Rear Delt Flye Machine', category: 'plate_machines', sub_category: 'fly_delt_machines_sub', icon: '🦅', description: 'Rotational arm flye machine for pectorals and posterior deltoid isolation', footprint: 'commercial_heavy', typical_exercises_unlocked: 20 },
  { id: 'calf_raise_machine', name: 'Seated & Standing Calf Raise Machines', category: 'plate_machines', sub_category: 'leg_press_sub', icon: '👣', description: 'Soleus and gastrocnemius targeted ankle plantarflexion machines', footprint: 'medium', typical_exercises_unlocked: 15 },

  // ========================================================
  // 5. BODYWEIGHT & CALISTHENICS
  // ========================================================
  { id: 'bodyweight', name: 'Floor & Open Floor Space (Bodyweight)', category: 'bodyweight_calisthenics', sub_category: 'pull_up_bars_sub', icon: '🤸', description: 'Basic floor space for push-ups, squats, lunges, planks and calisthenics', footprint: 'compact', typical_exercises_unlocked: 110 },
  { id: 'pull_up_bar', name: 'Pull-Up / Chin-Up Bar (Door or Wall Mounted)', category: 'bodyweight_calisthenics', sub_category: 'pull_up_bars_sub', icon: '🚪', description: 'Overhead bar for wide-grip pull-ups, chin-ups and hanging knee raises', footprint: 'compact', typical_exercises_unlocked: 40 },
  { id: 'dip_bars', name: 'Parallel Dip Station / Dip Horns', category: 'bodyweight_calisthenics', sub_category: 'dip_stations_sub', icon: '🧱', description: 'Freestanding or rack-mounted parallel bars for tricep and chest dips', footprint: 'compact', typical_exercises_unlocked: 25 },
  { id: 'gymnastic_rings', name: 'Wooden Gymnastic Rings & Straps', category: 'bodyweight_calisthenics', sub_category: 'rings_suspension_sub', icon: '⭕', description: 'Instability rings for ring dips, ring push-ups, face pulls and muscle-ups', footprint: 'compact', typical_exercises_unlocked: 38 },
  { id: 'trx_suspension', name: 'TRX / Suspension Bodyweight Trainer', category: 'bodyweight_calisthenics', sub_category: 'rings_suspension_sub', icon: '🎗️', description: 'Adjustable webbing straps with handles for suspended bodyweight rows and core pikes', footprint: 'compact', typical_exercises_unlocked: 45 },
  { id: 'ab_wheel', name: 'Ab Roller Wheel (Dual Wheel)', category: 'bodyweight_calisthenics', sub_category: 'parallettes_ab_sub', icon: '🛹', description: 'Dual wheel with rubber handles for intense anti-extension rollouts', footprint: 'compact', typical_exercises_unlocked: 15 },
  { id: 'parallettes_bars', name: 'Wooden Push-Up Parallettes', category: 'bodyweight_calisthenics', sub_category: 'parallettes_ab_sub', icon: '🪵', description: 'Low parallettes for deep deficit push-ups, L-sits and handstand practice', footprint: 'compact', typical_exercises_unlocked: 20 },

  // ========================================================
  // 6. BANDS & ACCESSORIES
  // ========================================================
  { id: 'resistance_bands', name: 'Heavy Loop Power Bands (10–120 lbs)', category: 'bands_accessories', sub_category: 'loop_bands_sub', icon: '➰', description: 'Continuous latex loop bands for accommodating resistance, pull-up assist and mobility', footprint: 'compact', typical_exercises_unlocked: 60 },
  { id: 'tube_bands', name: 'Handled Resistance Tube Set with Door Anchor', category: 'bands_accessories', sub_category: 'tube_bands_sub', icon: '〰️', description: 'Elastic tubes with foam handles and door anchor for home resistance training', footprint: 'compact', typical_exercises_unlocked: 55 },
  { id: 'glute_mini_bands', name: 'Fabric / Latex Mini Glute Loop Bands', category: 'bands_accessories', sub_category: 'loop_bands_sub', icon: '🩲', description: 'High-resistance hip circle bands for glute bridges, clam shells and lateral walks', footprint: 'compact', typical_exercises_unlocked: 25 },
  { id: 'weight_belt', name: 'Leather Powerlifting Lever Belt (10mm/13mm)', category: 'bands_accessories', sub_category: 'lifting_accessories_sub', icon: '🥋', description: 'Heavy leather lifting belt for intra-abdominal bracing on squats and deadlifts', footprint: 'compact', typical_exercises_unlocked: 35 },
  { id: 'lifting_straps', name: 'Weight Lifting Straps & Wrist Wraps', category: 'bands_accessories', sub_category: 'lifting_accessories_sub', icon: '🎗️', description: 'Cotton lasso straps and heavy wrist wraps for grip assistance on heavy pulls', footprint: 'compact', typical_exercises_unlocked: 30 },
  { id: 'foam_roller', name: 'High-Density Foam Roller & Massage Ball', category: 'bands_accessories', sub_category: 'recovery_foam_sub', icon: '🧘', description: 'Self-myofascial release roller and lacrosse ball for spine, quad and lat recovery', footprint: 'compact', typical_exercises_unlocked: 25 },

  // ========================================================
  // 7. CARDIO & CONDITIONING
  // ========================================================
  { id: 'rower', name: 'Concept2 Rowing Machine (PM5 Ergometer)', category: 'cardio_conditioning', sub_category: 'rowers_bikes_sub', icon: '🚣', description: 'Air resistance indoor rower for full-body low-impact cardiovascular power', footprint: 'medium', typical_exercises_unlocked: 18 },
  { id: 'air_bike', name: 'Rogue Echo / Assault Air Resistance Bike', category: 'cardio_conditioning', sub_category: 'rowers_bikes_sub', icon: '🚴', description: 'Fan-driven high-intensity sprint bike with dual arm handles for VO2 max intervals', footprint: 'medium', typical_exercises_unlocked: 15 },
  { id: 'skierg', name: 'Concept2 SkiErg Station', category: 'cardio_conditioning', sub_category: 'rowers_bikes_sub', icon: '🎿', description: 'Nordic skiing ergometer for upper-body and core endurance power', footprint: 'medium', typical_exercises_unlocked: 12 },
  { id: 'jump_rope', name: 'Speed Jump Rope (Ball-Bearing Cable)', category: 'cardio_conditioning', sub_category: 'jump_ropes_boxes_sub', icon: '🪢', description: 'Steel cable speed rope for boxer skips, double-unders and footwork', footprint: 'compact', typical_exercises_unlocked: 18 },
  { id: 'plyo_box', name: '3-in-1 Wooden / Foam Plyo Box (20"/24"/30")', category: 'cardio_conditioning', sub_category: 'jump_ropes_boxes_sub', icon: '📦', description: 'Multi-height box for explosive box jumps, step-ups and elevated split squats', footprint: 'medium', typical_exercises_unlocked: 30 },
  { id: 'battle_rope', name: 'Heavy 50ft Battle Rope (1.5" / 2.0")', category: 'cardio_conditioning', sub_category: 'battle_ropes_sleds_sub', icon: '〰️', description: 'Heavy poly rope for explosive alternating waves, double slams and rotational whips', footprint: 'medium', typical_exercises_unlocked: 22 },
  { id: 'prowler_sled', name: 'Push / Pull Prowler Sled', category: 'cardio_conditioning', sub_category: 'battle_ropes_sleds_sub', icon: '🚜', description: 'Heavy turf sled for sprint pushes, backward drags and metabolic conditioning', footprint: 'medium', typical_exercises_unlocked: 16 },
];

export const EQUIPMENT_PRESETS = [
  {
    id: 'commercial_gym',
    name: '🏢 Full Commercial Gym',
    description: 'All free weights, specialty bars, full plate inventory, cable towers, machines & cardio',
    equipmentIds: MASTER_EQUIPMENT_DATABASE.map((e) => e.id),
    defaultPlates: {
      pairs_45lb: 6,
      pairs_35lb: 2,
      pairs_25lb: 2,
      pairs_10lb: 4,
      pairs_5lb: 4,
      pairs_2_5lb: 2,
      bar_weight_lbs: 45,
    },
  },
  {
    id: 'home_garage_gym',
    name: '🏠 Home Garage Gym Setup',
    description: 'Power rack, Olympic barbell, 45/35/25/10/5/2.5lb plates, adjustable bench, dumbbells & pull-up bar',
    equipmentIds: [
      'bodyweight',
      'dumbbells',
      'barbells',
      'weight_plates',
      'adjustable_bench',
      'power_rack',
      'pull_up_bar',
      'resistance_bands',
      'foam_roller',
    ],
    defaultPlates: {
      pairs_45lb: 2,
      pairs_35lb: 1,
      pairs_25lb: 1,
      pairs_10lb: 2,
      pairs_5lb: 2,
      pairs_2_5lb: 1,
      bar_weight_lbs: 45,
    },
  },
  {
    id: 'dumbbell_bench_home',
    name: '🎒 Dumbbell & Bench Minimalist Home Setup',
    description: 'Adjustable dumbbells, incline bench, pull-up bar, resistance bands & floor space',
    equipmentIds: [
      'bodyweight',
      'dumbbells',
      'adjustable_bench',
      'pull_up_bar',
      'resistance_bands',
      'ab_wheel',
      'jump_rope',
    ],
    defaultPlates: DEFAULT_PLATE_INVENTORY,
  },
  {
    id: 'bodyweight_calisthenics',
    name: '🤸‍♂️ Calisthenics & Bodyweight Only',
    description: 'Zero heavy machinery: Floor space, pull-up bar, dip station & resistance bands',
    equipmentIds: [
      'bodyweight',
      'pull_up_bar',
      'dip_bars',
      'resistance_bands',
      'ab_wheel',
    ],
    defaultPlates: DEFAULT_PLATE_INVENTORY,
  },
  {
    id: 'empty_inventory',
    name: '🧹 Clear All (0 Selected)',
    description: 'Uncheck all equipment to start with a fresh custom inventory',
    equipmentIds: [],
    defaultPlates: DEFAULT_PLATE_INVENTORY,
  },
];
