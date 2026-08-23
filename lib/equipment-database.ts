import { EquipmentCategoryMeta, EquipmentSubCategoryMeta, EquipmentItem, EquipmentCategory } from './types';

export const EQUIPMENT_CATEGORIES: EquipmentCategoryMeta[] = [
  {
    id: 'free_weights',
    name: 'Free Weights & Resistance',
    shortLabel: 'Free Weights',
    icon: '🏋️‍♂️',
    description: 'Dumbbells, Olympic barbells, kettlebells, weight plates, EZ bars & trap bars',
    accentColor: '#f97316',
  },
  {
    id: 'benches_racks',
    name: 'Benches, Racks & Power Cages',
    shortLabel: 'Benches & Racks',
    icon: '🏗️',
    description: 'Adjustable incline benches, flat utility benches, power racks & squat stands',
    accentColor: '#3b82f6',
  },
  {
    id: 'cable_machines',
    name: 'Cable Towers & Pulley Systems',
    shortLabel: 'Cable Machines',
    icon: '⚙️',
    description: 'Dual adjustable pulleys, lat pulldowns, seated cable rows & functional trainers',
    accentColor: '#06b6d4',
  },
  {
    id: 'plate_machines',
    name: 'Plate-Loaded & Selectorized Machines',
    shortLabel: 'Gym Machines',
    icon: '🦾',
    description: 'Leg press, hack squat, leg curl, chest press, pec flye & smith machines',
    accentColor: '#8b5cf6',
  },
  {
    id: 'bodyweight_calisthenics',
    name: 'Bodyweight & Calisthenics Stations',
    shortLabel: 'Bodyweight & Bars',
    icon: '🤸‍♂️',
    description: 'Pull-up bars, dip stations, gymnastic rings, parallettes & suspension trainers',
    accentColor: '#10b981',
  },
  {
    id: 'bands_accessories',
    name: 'Resistance Bands & Accessories',
    shortLabel: 'Bands & Straps',
    icon: '🎗️',
    description: 'Loop resistance bands, tube bands, glute bands, weight belts & wrist wraps',
    accentColor: '#ec4899',
  },
  {
    id: 'cardio_conditioning',
    name: 'Cardio & Conditioning Gear',
    shortLabel: 'Cardio & Conditioning',
    icon: '⚡',
    description: 'Rowing machines, assault air bikes, battle ropes, jump ropes & plyo boxes',
    accentColor: '#eab308',
  },
];

export const EQUIPMENT_SUB_CATEGORIES: EquipmentSubCategoryMeta[] = [
  // 1. Free Weights
  { id: 'dumbbells_sub', parentId: 'free_weights', name: 'Dumbbells & Sets', icon: '🏋️', description: 'Adjustable, hex & commercial urethane dumbbell pairs' },
  { id: 'barbells_sub', parentId: 'free_weights', name: 'Olympic & Specialty Barbells', icon: '🔩', description: 'Olympic 20kg bars, women 15kg bars, trap bars & safety squat bars' },
  { id: 'kettlebells_sub', parentId: 'free_weights', name: 'Cast Iron & Competition Kettlebells', icon: '🔔', description: 'Hardstyle cast iron & competition standard kettlebells' },
  { id: 'ez_curl_bars_sub', parentId: 'free_weights', name: 'EZ Curl & Short Barbells', icon: '🦾', description: 'Cambered EZ curl bars & straight technique bars' },
  { id: 'weight_plates_sub', parentId: 'free_weights', name: 'Olympic Weight Plates & Bumpers', icon: '💿', description: 'Urethane Olympic plates, cast iron & bumper plates' },
  { id: 'medicine_balls_sub', parentId: 'free_weights', name: 'Medicine Balls & Slam Balls', icon: '🏀', description: 'Weighted slam balls, wall balls & leather medicine balls' },

  // 2. Benches & Racks
  { id: 'adj_benches_sub', parentId: 'benches_racks', name: 'Adjustable Incline Benches', icon: '🪑', description: '0-90 degree incline/decline commercial utility benches' },
  { id: 'flat_benches_sub', parentId: 'benches_racks', name: 'Flat Heavy-Duty Benches', icon: '🪵', description: 'Competition flat benches with high-density foam' },
  { id: 'power_racks_sub', parentId: 'benches_racks', name: 'Full Power Racks & Cages', icon: '🏗️', description: '3x3 steel power cages with safety pin pipes and J-cups' },
  { id: 'squat_stands_sub', parentId: 'benches_racks', name: 'Squat Stands & Half Racks', icon: '📐', description: 'Compact home gym squat stands with pull-up bar' },
  { id: 'preacher_benches_sub', parentId: 'benches_racks', name: 'Preacher & Specialized Benches', icon: '💪', description: 'Preacher curl benches & GHD glute ham developers' },

  // 3. Cable Machines
  { id: 'cable_towers_sub', parentId: 'cable_machines', name: 'Dual Adjustable Pulley Towers', icon: '🗼', description: 'Commercial dual cable stacks with adjustable height pulleys' },
  { id: 'lat_pulldowns_sub', parentId: 'cable_machines', name: 'Lat Pulldown & Low Row Units', icon: '🎣', description: 'High pulley lat pulldown and seated floor row combos' },
  { id: 'crossover_stations_sub', parentId: 'cable_machines', name: 'Cable Crossover Stations', icon: '⚙️', description: 'Wide-span cable crossover with multi-grip chin-up' },
  { id: 'smith_machines_sub', parentId: 'cable_machines', name: 'Smith Machines & Counterbalanced', icon: '🔒', description: 'Linear bearing guided barbell track system' },

  // 4. Plate-Loaded Machines
  { id: 'leg_press_sub', parentId: 'plate_machines', name: 'Leg Press & Hack Squat', icon: '🦵', description: '45-degree linear leg press and reverse hack squats' },
  { id: 'leg_curl_ext_sub', parentId: 'plate_machines', name: 'Leg Extension & Seated Leg Curl', icon: '🦿', description: 'Pin-selectorized or plate-loaded quad and hamstring machines' },
  { id: 'chest_back_machines_sub', parentId: 'plate_machines', name: 'Chest Press & Row Machines', icon: '🛡️', description: 'Iso-lateral chest press and converging row machines' },
  { id: 'fly_delt_machines_sub', parentId: 'plate_machines', name: 'Pec Deck & Rear Delt Machines', icon: '🦅', description: 'Dual function chest flye and posterior deltoid machines' },

  // 5. Bodyweight & Calisthenics
  { id: 'pull_up_bars_sub', parentId: 'bodyweight_calisthenics', name: 'Pull-Up & Chin-Up Bars', icon: '🚪', description: 'Doorway, wall-mounted or ceiling-mounted multi-grip bars' },
  { id: 'dip_stations_sub', parentId: 'bodyweight_calisthenics', name: 'Dip Bars & Power Towers', icon: '🧱', description: 'Parallel dip bars and captain chair vertical knee raise' },
  { id: 'rings_suspension_sub', parentId: 'bodyweight_calisthenics', name: 'Gymnastic Rings & TRX Straps', icon: '⭕', description: 'Wooden gymnastic rings and suspension bodyweight straps' },
  { id: 'parallettes_ab_sub', parentId: 'bodyweight_calisthenics', name: 'Parallettes & Ab Rollers', icon: '🛹', description: 'Low pushup parallettes and dual-wheel ab rollers' },

  // 6. Bands & Accessories
  { id: 'loop_bands_sub', parentId: 'bands_accessories', name: 'Heavy Loop Resistance Bands', icon: '➰', description: '41-inch latex powerlifting and pull-up assist bands' },
  { id: 'tube_bands_sub', parentId: 'bands_accessories', name: 'Handled Resistance Tube Sets', icon: '〰️', description: 'Modular tube bands with door anchors and ankle straps' },
  { id: 'lifting_accessories_sub', parentId: 'bands_accessories', name: 'Lifting Belts, Straps & Chalk', icon: '🎗️', description: 'Leather powerlifting belts, figure-8 lifting straps & liquid chalk' },

  // 7. Cardio & Conditioning
  { id: 'rowers_bikes_sub', parentId: 'cardio_conditioning', name: 'Rowers & Assault Air Bikes', icon: '🚣', description: 'Concept2 air rowers, Rogue Echo assault bikes & SkiErgs' },
  { id: 'jump_ropes_boxes_sub', parentId: 'cardio_conditioning', name: 'Speed Jump Ropes & Plyo Boxes', icon: '📦', description: 'Ball-bearing speed ropes and 3-in-1 foam plyometric boxes' },
  { id: 'battle_ropes_sub', parentId: 'cardio_conditioning', name: 'Battle Ropes & Slam Gear', icon: '〰️', description: '50-foot 1.5-inch heavy poly dacron battle ropes' },
];

export const MASTER_EQUIPMENT_DATABASE: EquipmentItem[] = [
  // Free Weights - Dumbbells
  { id: 'dumbbells', name: 'Adjustable Dumbbells Set', category: 'free_weights', sub_category: 'dumbbells_sub', icon: '🏋️', description: 'Quick-change selectorized or plate-loaded dumbbell pairs (5–50+ lbs)', footprint: 'compact', typical_exercises_unlocked: 95 },
  { id: 'heavy_dumbbells', name: 'Heavy Fixed Dumbbells (55–100+ lbs)', category: 'free_weights', sub_category: 'dumbbells_sub', icon: '🏋️‍♂️', description: 'Commercial urethane heavy dumbbell rack for heavy presses and rows', footprint: 'commercial_heavy', typical_exercises_unlocked: 45 },
  { id: 'light_dumbbells', name: 'Light Dumbbells (2–15 lbs)', category: 'free_weights', sub_category: 'dumbbells_sub', icon: '🏋️', description: 'Neoprene or rubber light dumbbells for lateral raises and rotator cuff', footprint: 'compact', typical_exercises_unlocked: 30 },

  // Free Weights - Barbells
  { id: 'barbells', name: 'Olympic 20kg Barbell (7ft)', category: 'free_weights', sub_category: 'barbells_sub', icon: '🔩', description: 'Standard 45 lb Olympic barbell with rotating brass sleeves and knurling', footprint: 'medium', typical_exercises_unlocked: 80 },
  { id: 'weight_plates', name: 'Olympic Weight Plates Set (2.5–45 lbs)', category: 'free_weights', sub_category: 'weight_plates_sub', icon: '💿', description: 'Cast iron or high-density bumper plates for barbell loading', footprint: 'medium', typical_exercises_unlocked: 80 },
  { id: 'ez_curl_bar', name: 'Cambered EZ Curl Bar', category: 'free_weights', sub_category: 'ez_curl_bars_sub', icon: '🦾', description: 'Ergonomic angled barbell for wrist-friendly bicep curls and skullcrushers', footprint: 'compact', typical_exercises_unlocked: 25 },
  { id: 'trap_bar', name: 'Hex / Trap Bar', category: 'free_weights', sub_category: 'barbells_sub', icon: '🛑', description: 'Neutral grip deadlift bar for quad-dominant, lower-back friendly deadlifts', footprint: 'medium', typical_exercises_unlocked: 18 },

  // Free Weights - Kettlebells & Balls
  { id: 'kettlebells', name: 'Competition Cast Iron Kettlebells', category: 'free_weights', sub_category: 'kettlebells_sub', icon: '🔔', description: '16kg (35 lb) / 24kg (53 lb) kettlebells for swings, cleans and snatches', footprint: 'compact', typical_exercises_unlocked: 40 },
  { id: 'medicine_ball', name: 'Heavy Slam Ball / Medicine Ball', category: 'free_weights', sub_category: 'medicine_balls_sub', icon: '🏀', description: 'Dead-bounce rubber slam ball (15–30 lbs) for core power and conditioning', footprint: 'compact', typical_exercises_unlocked: 22 },

  // Benches & Racks
  { id: 'adjustable_bench', name: 'Adjustable Incline / Flat Bench', category: 'benches_racks', sub_category: 'adj_benches_sub', icon: '🪑', description: 'Commercial ladder-style bench with -15 to +85 degree angle adjustments', footprint: 'medium', typical_exercises_unlocked: 110 },
  { id: 'flat_bench', name: 'Heavy Duty Flat Utility Bench', category: 'benches_racks', sub_category: 'flat_benches_sub', icon: '🪵', description: 'Sturdy flat bench with wide pad for powerlifting bench presses', footprint: 'medium', typical_exercises_unlocked: 65 },
  { id: 'power_rack', name: 'Full 4-Post Power Cage / Squat Rack', category: 'benches_racks', sub_category: 'power_racks_sub', icon: '🏗️', description: 'Heavy gauge steel cage with safety flip-down arms for squats and bench', footprint: 'commercial_heavy', typical_exercises_unlocked: 75 },
  { id: 'squat_stands', name: 'Independent Squat Stands', category: 'benches_racks', sub_category: 'squat_stands_sub', icon: '📐', description: 'Space-saving adjustable height stands for barbell squats and overhead press', footprint: 'medium', typical_exercises_unlocked: 45 },
  { id: 'preacher_bench', name: 'Preacher Arm Curl Bench', category: 'benches_racks', sub_category: 'preacher_benches_sub', icon: '💪', description: 'Angled pad support for strict bicep isolation', footprint: 'medium', typical_exercises_unlocked: 12 },

  // Cable Machines
  { id: 'cable_machine', name: 'Dual Adjustable Cable Pulley System', category: 'cable_machines', sub_category: 'cable_towers_sub', icon: '🗼', description: 'Dual weight stack functional trainer with 1:1 or 2:1 ratio smooth pulleys', footprint: 'commercial_heavy', typical_exercises_unlocked: 90 },
  { id: 'lat_pulldown', name: 'Lat Pulldown & Low Row Machine', category: 'cable_machines', sub_category: 'lat_pulldowns_sub', icon: '🎣', description: 'Dedicated vertical cable tower with thigh pads and seated row footplate', footprint: 'commercial_heavy', typical_exercises_unlocked: 35 },
  { id: 'smith_machine', name: 'Linear Bearing Smith Machine', category: 'cable_machines', sub_category: 'smith_machines_sub', icon: '🔒', description: 'Fixed plane barbell with safety hook lockouts', footprint: 'commercial_heavy', typical_exercises_unlocked: 55 },
  { id: 'cable_crossover', name: 'Wide Span Cable Crossover Machine', category: 'cable_machines', sub_category: 'crossover_stations_sub', icon: '⚙️', description: 'Full-gym cable crossover for flyes, lateral raises and tricep pushdowns', footprint: 'commercial_heavy', typical_exercises_unlocked: 70 },

  // Plate-Loaded & Gym Machines
  { id: 'leg_press', name: '45-Degree Plate-Loaded Leg Press', category: 'plate_machines', sub_category: 'leg_press_sub', icon: '🦵', description: 'Heavy linear roller sled for quad and glute compound volume', footprint: 'commercial_heavy', typical_exercises_unlocked: 15 },
  { id: 'hack_squat', name: 'Linear Hack Squat Machine', category: 'plate_machines', sub_category: 'leg_press_sub', icon: '🦿', description: 'Shoulder pad guided hack squat for extreme quadriceps isolation', footprint: 'commercial_heavy', typical_exercises_unlocked: 12 },
  { id: 'leg_extension', name: 'Seated Leg Extension Machine', category: 'plate_machines', sub_category: 'leg_curl_ext_sub', icon: '🦿', description: 'Pin-loaded machine for strict rectus femoris knee extension', footprint: 'commercial_heavy', typical_exercises_unlocked: 10 },
  { id: 'leg_curl', name: 'Lying or Seated Hamstring Curl Machine', category: 'plate_machines', sub_category: 'leg_curl_ext_sub', icon: '🦵', description: 'Isolated knee flexion machine for hamstring hypertrophy', footprint: 'commercial_heavy', typical_exercises_unlocked: 12 },
  { id: 'chest_press_machine', name: 'Iso-Lateral Chest Press Machine', category: 'plate_machines', sub_category: 'chest_back_machines_sub', icon: '🛡️', description: 'Converging lever arm machine for joint-friendly heavy pressing', footprint: 'commercial_heavy', typical_exercises_unlocked: 14 },
  { id: 'pec_deck', name: 'Pec Deck & Rear Delt Machine', category: 'plate_machines', sub_category: 'fly_delt_machines_sub', icon: '🦅', description: 'Rotational arm flye machine for pectorals and posterior deltoids', footprint: 'commercial_heavy', typical_exercises_unlocked: 15 },

  // Bodyweight & Calisthenics
  { id: 'bodyweight', name: 'Floor & Open Floor Space (Bodyweight)', category: 'bodyweight_calisthenics', sub_category: 'pull_up_bars_sub', icon: '🤸', description: 'Basic floor space for push-ups, squats, lunges, planks and calisthenics', footprint: 'compact', typical_exercises_unlocked: 85 },
  { id: 'pull_up_bar', name: 'Pull-Up / Chin-Up Bar', category: 'bodyweight_calisthenics', sub_category: 'pull_up_bars_sub', icon: '🚪', description: 'Overhead bar for bodyweight pull-ups, chin-ups and hanging knee raises', footprint: 'compact', typical_exercises_unlocked: 32 },
  { id: 'dip_bars', name: 'Parallel Dip Station / Dip Bars', category: 'bodyweight_calisthenics', sub_category: 'dip_stations_sub', icon: '🧱', description: 'Freestanding or rack-mounted parallel bars for tricep and chest dips', footprint: 'compact', typical_exercises_unlocked: 20 },
  { id: 'gymnastic_rings', name: 'Wooden Gymnastic Rings & Straps', category: 'bodyweight_calisthenics', sub_category: 'rings_suspension_sub', icon: '⭕', description: 'Instability rings for ring dips, ring push-ups and muscle-ups', footprint: 'compact', typical_exercises_unlocked: 28 },
  { id: 'trx_suspension', name: 'TRX / Suspension Bodyweight Trainer', category: 'bodyweight_calisthenics', sub_category: 'rings_suspension_sub', icon: '🎗️', description: 'Adjustable webbing straps with handles for suspended bodyweight rows', footprint: 'compact', typical_exercises_unlocked: 35 },
  { id: 'ab_wheel', name: 'Ab Roller Wheel', category: 'bodyweight_calisthenics', sub_category: 'parallettes_ab_sub', icon: '🛹', description: 'Dual wheel with rubber handles for intense anti-extension rollouts', footprint: 'compact', typical_exercises_unlocked: 10 },

  // Bands & Accessories
  { id: 'resistance_bands', name: 'Heavy Loop Power Bands (10–100 lbs)', category: 'bands_accessories', sub_category: 'loop_bands_sub', icon: '➰', description: 'Continuous latex loop bands for accommodating resistance and mobility', footprint: 'compact', typical_exercises_unlocked: 45 },
  { id: 'tube_bands', name: 'Handled Resistance Tube Bands', category: 'bands_accessories', sub_category: 'tube_bands_sub', icon: '〰️', description: 'Elastic tubes with foam handles and door anchor for home resistance', footprint: 'compact', typical_exercises_unlocked: 40 },
  { id: 'glute_mini_bands', name: 'Fabric / Latex Mini Glute Loop Bands', category: 'bands_accessories', sub_category: 'loop_bands_sub', icon: '🩲', description: 'High-resistance hip circle bands for glute bridges and lateral walks', footprint: 'compact', typical_exercises_unlocked: 20 },
  { id: 'lifting_straps', name: 'Weight Lifting Straps & Wrist Wraps', category: 'bands_accessories', sub_category: 'lifting_accessories_sub', icon: '🎗️', description: 'Cotton lasso straps for deadlift grip assistance and heavy rows', footprint: 'compact', typical_exercises_unlocked: 25 },
  { id: 'foam_roller', name: 'High-Density Foam Roller', category: 'bands_accessories', sub_category: 'lifting_accessories_sub', icon: '🧘', description: 'Self-myofascial release roller for spine, quads and lat recovery', footprint: 'compact', typical_exercises_unlocked: 18 },

  // Cardio & Conditioning
  { id: 'rower', name: 'Concept2 Rowing Machine (Ergometer)', category: 'cardio_conditioning', sub_category: 'rowers_bikes_sub', icon: '🚣', description: 'Air resistance indoor rower for full-body low-impact cardiovascular power', footprint: 'medium', typical_exercises_unlocked: 12 },
  { id: 'air_bike', name: 'Assault / Echo Air Resistance Bike', category: 'cardio_conditioning', sub_category: 'rowers_bikes_sub', icon: '🚴', description: 'Fan-driven high-intensity sprint bike with dual arm handles', footprint: 'medium', typical_exercises_unlocked: 10 },
  { id: 'jump_rope', name: 'Speed Jump Rope (Ball-Bearing)', category: 'cardio_conditioning', sub_category: 'jump_ropes_boxes_sub', icon: '🪢', description: 'Steel cable speed rope for boxer skips, double-unders and footwork', footprint: 'compact', typical_exercises_unlocked: 14 },
  { id: 'plyo_box', name: '3-in-1 Wooden or Foam Plyo Box', category: 'cardio_conditioning', sub_category: 'jump_ropes_boxes_sub', icon: '📦', description: '20" / 24" / 30" height box for box jumps, step-ups and elevated split squats', footprint: 'medium', typical_exercises_unlocked: 24 },
  { id: 'battle_rope', name: 'Heavy 50ft Battle Rope', category: 'cardio_conditioning', sub_category: 'battle_ropes_sub', icon: '〰️', description: 'Heavy poly rope for explosive alternating waves and slams', footprint: 'medium', typical_exercises_unlocked: 16 },
];

export const EQUIPMENT_PRESETS = [
  {
    id: 'commercial_gym',
    name: '🏢 Full Commercial Gym',
    description: 'All free weights, benches, cable towers, machines, bars & cardio equipment',
    equipmentIds: MASTER_EQUIPMENT_DATABASE.map((e) => e.id),
  },
  {
    id: 'home_garage_gym',
    name: '🏠 Home Garage Gym Setup',
    description: 'Power rack, Olympic barbell, bumper plates, adjustable bench, dumbbells & pull-up bar',
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
  },
  {
    id: 'empty_inventory',
    name: '🧹 Clear All (0 Selected)',
    description: 'Uncheck all equipment to start with a fresh custom inventory',
    equipmentIds: [],
  },
];
