import { PreMadeWorkoutProgram } from './types';

export const PREMADE_WORKOUT_PROGRAMS: PreMadeWorkoutProgram[] = [
  // =========================================================================
  // 1. P90X (CLASSIC 90-DAY EXTREME HOME FITNESS) — TONY HORTON
  // =========================================================================
  {
    id: 'p90x_classic',
    title: 'P90X® Classic 90-Day Extreme',
    subtitle: 'Muscle Confusion™ Periodized Home Transformation',
    creator: 'Tony Horton & Beachbody',
    category: 'p90x_series',
    difficulty: 'advanced',
    equipment_needed: ['dumbbells', 'pull_up_bar', 'resistance_bands', 'yoga_mat'],
    duration_weeks: 12,
    days_per_week: 6,
    description:
      'The legendary 90-day extreme fitness program that pioneered Muscle Confusion. Rotates heavy calisthenics, free weight supersets, high-velocity plyometrics, and traditional isometric yoga to shatter plateaus.',
    icon: '⚡',
    accent_color: '#3b82f6',
    schedule: [
      {
        day_number: 1,
        day_title: 'Chest & Back + Ab Ripper X',
        focus: 'Upper Body Antagonistic Hypertrophy & Calisthenics',
        duration_minutes: 68,
        exercises: [
          { id: 'p90x-cb-1', name: 'Standard Push-Ups (Max Reps)', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '15–30 reps', instructions: 'Full range of motion, chest 1 inch off floor.' },
          { id: 'p90x-cb-2', name: 'Wide Front Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8–15 reps', instructions: 'Overhand wide grip, clear chin over bar.' },
          { id: 'p90x-cb-3', name: 'Military Push-Ups (Elbows Tucked)', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '15–25 reps', instructions: 'Elbows scraping ribcage, tricep emphasis.' },
          { id: 'p90x-cb-4', name: 'Reverse Grip Chin-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8–12 reps', instructions: 'Underhand grip, squeeze lower lats and biceps.' },
          { id: 'p90x-cb-5', name: 'Wide Fly Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '12–20 reps', instructions: 'Hands placed wider than shoulder width.' },
          { id: 'p90x-cb-6', name: 'Closed Grip Overhand Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '6–10 reps', instructions: 'Hands 6-8 inches apart on bar.' },
          { id: 'p90x-cb-7', name: 'Heavy Lawnmower Dumbbell Rows', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10–12 reps/side', instructions: 'Staggered stance, pull dumbbell back into hip.' },
          { id: 'p90x-cb-8', name: 'Diamond Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10–15 reps', instructions: 'Index fingers and thumbs touching under chest.' },
          { id: 'p90x-cb-9', name: 'Ab Ripper X: In & Outs + Seated Bicycles', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps each', instructions: 'Balance on sit bones, knees to chest.' },
          { id: 'p90x-cb-10', name: 'Ab Ripper X: Fifer Scissor Kicks', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps', instructions: 'Alternate straight leg raises off floor.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Plyometrics (Jump Training)',
        focus: 'Cardiovascular Explosive Power & Aerobic Conditioning',
        duration_minutes: 58,
        exercises: [
          { id: 'p90x-plyo-1', name: 'Jump Squats (Explosive Reach)', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Deep squat into vertical jump with overhead reach.' },
          { id: 'p90x-plyo-2', name: 'Airborne Heismans', target_muscle: 'glutes', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Lateral high-knee bounding with torso twist.' },
          { id: 'p90x-plyo-3', name: 'Swing Kicks into 180° Jump Turns', target_muscle: 'hamstrings', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Front kick, step back, explosive 180 spin jump.' },
          { id: 'p90x-plyo-4', name: 'Squat X-Jumps', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Touch floor in deep squat, explode into mid-air X.' },
          { id: 'p90x-plyo-5', name: 'Rock Star Hops', target_muscle: 'calves', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Jump kicking both heels back to glutes.' },
          { id: 'p90x-plyo-6', name: 'Mary Katherine Jump Lunges', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Scissor jump switching legs in deep lunge.' },
        ],
      },
      {
        day_number: 3,
        day_title: 'Shoulders & Arms + Ab Ripper X',
        focus: 'Deltoids, Biceps & Triceps Isolation',
        duration_minutes: 65,
        exercises: [
          { id: 'p90x-sa-1', name: 'Alternating Seated Shoulder Press', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Smooth vertical press with dumbbells.' },
          { id: 'p90x-sa-2', name: 'In-and-Out Bicep Curls', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Alternate front curl and wide lateral curl.' },
          { id: 'p90x-sa-3', name: 'Two-Arm Overhead Tricep Extension', target_muscle: 'triceps', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Lower dumbbell behind head, extend elbows.' },
          { id: 'p90x-sa-4', name: 'Deep Pike Presses (Chair or Floor)', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '12–15 reps', instructions: 'Elevated hips, lower crown of head to floor.' },
          { id: 'p90x-sa-5', name: 'Seated Static Hammer Curls', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '10 reps/side', instructions: 'Hold one arm at 90° while other completes reps.' },
          { id: 'p90x-sa-6', name: 'Side Tri-Rises', target_muscle: 'triceps', suggested_sets: 3, suggested_reps: '12 reps/side', instructions: 'Lie on side, press upper body up using top arm.' },
        ],
      },
      {
        day_number: 4,
        day_title: 'Yoga X',
        focus: 'Vinyasa Flow, Hip Openers & Core Balance',
        duration_minutes: 90,
        exercises: [
          { id: 'p90x-yoga-1', name: 'Sun Salutations (Surya Namaskar A & B)', target_muscle: 'full_body_cardio', suggested_sets: 4, suggested_reps: 'Continuous Flow', instructions: 'Chaturanga Dandasana to Upward Dog to Downward Dog.' },
          { id: 'p90x-yoga-2', name: 'Warrior Sequence (Warrior 1, 2, Reverse, Side Angle)', target_muscle: 'quads', suggested_sets: 2, suggested_reps: '60s hold/side', instructions: 'Deep 90-degree front knee lunge, arms extended.' },
          { id: 'p90x-yoga-3', name: 'Half Moon Balance (Ardha Chandrasana)', target_muscle: 'glutes', suggested_sets: 2, suggested_reps: '45s hold/side', instructions: 'Single-leg balance with open chest and raised leg.' },
          { id: 'p90x-yoga-4', name: 'Yoga Belly 7 (Core Flow & Navasana Boat Pose)', target_muscle: 'core', suggested_sets: 1, suggested_reps: '10 minutes', instructions: 'Static boat pose holds and scissor leg pulses.' },
        ],
      },
      {
        day_number: 5,
        day_title: 'Legs & Back + Ab Ripper X',
        focus: 'Posterior Chain, Quads, Calisthenic Pulls',
        duration_minutes: 68,
        exercises: [
          { id: 'p90x-lb-1', name: 'Weighted Step-Back Lunges', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '12–15 reps/side', instructions: 'Dumbbells at side, step back into 90° lunge.' },
          { id: 'p90x-lb-2', name: 'Underhand Chin-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Full extension at bottom to sternum touch at bar.' },
          { id: 'p90x-lb-3', name: 'Super Skater Single-Leg Squats', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '15 reps/side', instructions: 'Single-leg balance squat reaching rear toe back.' },
          { id: 'p90x-lb-4', name: 'Wide Front Overhand Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8–12 reps', instructions: 'Squeeze upper lats and shoulder blades.' },
          { id: 'p90x-lb-5', name: 'Wall Squat Isometric Iso-Hold', target_muscle: 'quads', suggested_sets: 2, suggested_reps: '60–90 seconds', instructions: 'Back flat against wall, thighs parallel to floor.' },
          { id: 'p90x-lb-6', name: 'Deadlift Romanian Hinges', target_muscle: 'hamstrings', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Flat back, push hips back for deep hamstring stretch.' },
        ],
      },
      {
        day_number: 6,
        day_title: 'Kenpo X',
        focus: 'Martial Arts Kickboxing & Core Rotation',
        duration_minutes: 45,
        exercises: [
          { id: 'p90x-kenpo-1', name: 'Jab, Cross, Hook, Uppercut Combinations', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '45 seconds', instructions: 'Pivot on balls of feet, snap punches with hip torque.' },
          { id: 'p90x-kenpo-2', name: 'Step-Behind Side Kicks', target_muscle: 'glutes', suggested_sets: 3, suggested_reps: '20 kicks/side', instructions: 'Chamber knee, strike with heel, re-chamber.' },
          { id: 'p90x-kenpo-3', name: 'Front Kick into Back Kick Flow', target_muscle: 'hamstrings', suggested_sets: 3, suggested_reps: '15 combos/side', instructions: 'Snap front ball of foot, drive back heel.' },
          { id: 'p90x-kenpo-4', name: 'Horse Stance Punching Flurry', target_muscle: 'quads', suggested_sets: 2, suggested_reps: '60 seconds', instructions: 'Deep wide squat stance, continuous alternating punches.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 2. P90X2 (POST-ACTIVATION POTENTIATION & FUNCTIONAL INSTABILITY)
  // =========================================================================
  {
    id: 'p90x2_asylum',
    title: 'P90X2® Post-Activation Potentiation',
    subtitle: 'Athletic Foundation & Multi-Planar Instability',
    creator: 'Tony Horton',
    category: 'p90x_series',
    difficulty: 'advanced',
    equipment_needed: ['dumbbells', 'pull_up_bar', 'medicine_ball', 'foam_roller'],
    duration_weeks: 12,
    days_per_week: 5,
    description:
      'Engineered around Post-Activation Potentiation (PAP) and balance training. Uses medicine ball instability, foam roller myofascial release, and complex athletic movements to build functional athletic horsepower.',
    icon: '🦾',
    accent_color: '#06b6d4',
    schedule: [
      {
        day_number: 1,
        day_title: 'X2 Core (Instability Dynamics)',
        focus: 'Core Transverse Abdominis & Rotational Equilibrium',
        duration_minutes: 55,
        exercises: [
          { id: 'p90x2-c-1', name: 'Medicine Ball Sphinx Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Hands on medicine ball, tricep press from forearms.' },
          { id: 'p90x2-c-2', name: 'Roll-Outs with Stability Ball/Wheel', target_muscle: 'core', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Full spinal anti-extension reach, contract abs.' },
          { id: 'p90x2-c-3', name: '4-Ball Push-Ups (Hands & Feet on Med Balls)', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '8–10 reps', instructions: 'Balance all 4 limbs on separate balls, execute strict push-up.' },
          { id: 'p90x2-c-4', name: 'Warr-1 Hops on Single Leg', target_muscle: 'glutes', suggested_sets: 3, suggested_reps: '10 hops/side', instructions: 'Single-leg balance hop holding warrior torso angle.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Plyocide (PAP Explosiveness)',
        focus: 'Deceleration Control & Explosive Power',
        duration_minutes: 55,
        exercises: [
          { id: 'p90x2-p-1', name: 'Wide Leg Jump to Frog Squat', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '45 seconds', instructions: 'Bound forward softly into deep squat, hop back.' },
          { id: 'p90x2-p-2', name: '100-Meter Bounding Skaters', target_muscle: 'glutes', suggested_sets: 3, suggested_reps: '45 seconds', instructions: 'Wide lateral bounds with 1-second balance stick.' },
          { id: 'p90x2-p-3', name: 'Medicine Ball Slams into Burpee', target_muscle: 'full_body_cardio', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Slam ball explosively, drop into chest-to-floor burpee.' },
        ],
      },
      {
        day_number: 3,
        day_title: 'X2 Total Body + Ab Ripper',
        focus: 'Full-Body Compound Movement Matrix',
        duration_minutes: 62,
        exercises: [
          { id: 'p90x2-tb-1', name: '1-Arm 1-Leg Flat Dumbbell Press', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '8–10 reps/side', instructions: 'Lie on bench, press right arm with left leg raised in air.' },
          { id: 'p90x2-tb-2', name: 'Scapular Pull-Ups to Lever Pulls', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8 reps', instructions: 'Retract scapula, pull into 45-degree front lever angle.' },
          { id: 'p90x2-tb-3', name: 'Balance Squats on Medicine Ball', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Stand with one foot on ball, squat to parallel.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 3. P90X3 (30-MINUTE HIGH-INTENSITY ACCELERATED SPLIT)
  // =========================================================================
  {
    id: 'p90x3_accelerated',
    title: 'P90X3® 30-Minute Accelerated',
    subtitle: 'High-Density Metabolic Periodization',
    creator: 'Tony Horton',
    category: 'p90x_series',
    difficulty: 'intermediate',
    equipment_needed: ['dumbbells', 'pull_up_bar', 'resistance_bands'],
    duration_weeks: 12,
    days_per_week: 6,
    description:
      '30-minute nonstop high-intensity workouts designed using maximum density training. Zero wasted seconds—transitions straight from eccentric strength to isometric holds and cardio complexes.',
    icon: '⏱️',
    accent_color: '#f97316',
    schedule: [
      {
        day_number: 1,
        day_title: 'Total Synergistics (30 Min)',
        focus: 'Full-Body Neuro-Muscular Activation',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-ts-1', name: 'Push-Up Side Arm Balance with Knee Tuck', target_muscle: 'chest', suggested_sets: 2, suggested_reps: '12 reps', instructions: 'Push-up, rotate to side plank, drive top knee to elbow.' },
          { id: 'p90x3-ts-2', name: 'Crescent Chair Squats with DB Press', target_muscle: 'shoulders', suggested_sets: 2, suggested_reps: '10 reps', instructions: 'Step into crescent lunge, squat, overhead press.' },
          { id: 'p90x3-ts-3', name: 'Pull-Up Knees-to-Elbows Crunch', target_muscle: 'back', suggested_sets: 2, suggested_reps: '8 reps', instructions: 'Pull chin over bar, tuck knees simultaneously.' },
          { id: 'p90x3-ts-4', name: 'Crawling Plank Push-Ups', target_muscle: 'core', suggested_sets: 2, suggested_reps: '10 reps', instructions: 'Walk hands 3 steps forward in plank, push-up.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'The Challenge (Chest & Back 30 Min)',
        focus: 'Max Density Pull-Ups & Push-Ups Ladder',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-tc-1', name: 'Standard Push-Ups (Goal Target: 25)', target_muscle: 'chest', suggested_sets: 4, suggested_reps: '20–30 reps', instructions: 'Strict form, chest to floor.' },
          { id: 'p90x3-tc-2', name: 'Wide Grip Pull-Ups (Goal Target: 10)', target_muscle: 'back', suggested_sets: 4, suggested_reps: '8–12 reps', instructions: 'Overhand grip, deadhang to chin over bar.' },
          { id: 'p90x3-tc-3', name: 'Military Close Push-Ups (Goal: 20)', target_muscle: 'chest', suggested_sets: 4, suggested_reps: '15–25 reps', instructions: 'Elbows brushing ribs.' },
          { id: 'p90x3-tc-4', name: 'Reverse Chin-Ups (Goal: 10)', target_muscle: 'back', suggested_sets: 4, suggested_reps: '8–12 reps', instructions: 'Underhand supinated grip.' },
        ],
      },
      {
        day_number: 3,
        day_title: 'CVX (Cardio Vascular Extreme with Weights)',
        focus: 'Light Weighted Metabolic Resistance',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-cvx-1', name: 'Press Jack with 5lb Dumbbell', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Jumping jacks pressing light weight overhead.' },
          { id: 'p90x3-cvx-2', name: 'Atlas Twist Lunges', target_muscle: 'core', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Lunge while twisting weight diagonally across torso.' },
          { id: 'p90x3-cvx-3', name: 'Speed Skater Reach & Press', target_muscle: 'glutes', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Lateral bounding while punching weight forward.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 4. STRONGLIFTS 5x5 (LINEAR STRENGTH PROGRESSION) — MEHDI
  // =========================================================================
  {
    id: 'stronglifts_5x5',
    title: 'StrongLifts 5×5 Strength Program',
    subtitle: 'Compound Linear Progressive Overload System',
    creator: 'Mehdi Hadim',
    category: 'strength_powerlifting',
    difficulty: 'beginner',
    equipment_needed: ['barbells', 'weight_plates', 'power_rack', 'flat_bench'],
    duration_weeks: 12,
    days_per_week: 3,
    description:
      'The gold standard 3-day full-body strength program. Consists of 5 compound barbell lifts performed for 5 sets of 5 reps, adding 5 lbs (2.5 kg) to the bar every single session for exponential strength gains.',
    icon: '🏋️‍♂️',
    accent_color: '#10b981',
    schedule: [
      {
        day_number: 1,
        day_title: 'Workout A (Squat, Bench, Row)',
        focus: 'Compound Strength Foundation A',
        duration_minutes: 50,
        exercises: [
          { id: 'sl-sq-1', name: 'Barbell Back Squat', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+5 lbs from last session', instructions: 'Squat below parallel depth, drive through whole foot, keep chest proud.' },
          { id: 'sl-bp-1', name: 'Barbell Flat Bench Press', target_muscle: 'chest', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+5 lbs from last session', instructions: 'Plant feet, retract scapulae, lower bar to mid-sternum, press locking out elbows.' },
          { id: 'sl-br-1', name: 'Barbell Pendlay Row', target_muscle: 'back', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+5 lbs from last session', instructions: 'Torso parallel to floor, pull bar from dead-stop off floor into lower chest.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Workout B (Squat, Overhead Press, Deadlift)',
        focus: 'Compound Strength Foundation B',
        duration_minutes: 50,
        exercises: [
          { id: 'sl-sq-2', name: 'Barbell Back Squat', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+5 lbs from last session', instructions: 'Squat deep, brace core 360 degrees.' },
          { id: 'sl-ohp-1', name: 'Standing Barbell Overhead Press (OHP)', target_muscle: 'shoulders', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+2.5 to 5 lbs', instructions: 'Squeeze glutes and abs, press straight vertical clearing chin.' },
          { id: 'sl-dl-1', name: 'Conventional Barbell Deadlift', target_muscle: 'back', suggested_sets: 1, suggested_reps: '5 reps (Heavy 1x5)', suggested_weight_guide: '+10 lbs from last session', instructions: 'Bar over midfoot, engage lats, push floor away with legs, lock hips.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 5. TAI CHI & QIGONG (24-FORM YANG STYLE LONGEVITY FLOW)
  // =========================================================================
  {
    id: 'tai_chi_yang_24',
    title: 'Tai Chi 24-Form Yang Style & Qigong',
    subtitle: 'Mind-Body Flow, Balance & Cellular Longevity',
    creator: 'Traditional Yang Family Style',
    category: 'mind_body_longevity',
    difficulty: 'all_levels',
    equipment_needed: ['bodyweight'],
    duration_weeks: 8,
    days_per_week: 5,
    description:
      'The internationally standardized 24-Form Yang Style Tai Chi Chuan. Emphasizes slow, continuous, fluid circular movements, diaphragmatic breathing (Dan Tian), balance transfer, and joint decompression.',
    icon: '☯️',
    accent_color: '#14b8a6',
    schedule: [
      {
        day_number: 1,
        day_title: 'Part 1: Commencing to White Crane',
        focus: 'Grounding, Rooting & Postural Alignment',
        duration_minutes: 35,
        exercises: [
          { id: 'tc-form-1', name: 'Form 1: Commencing Form (Qishi)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '5 slow cycles', instructions: 'Stand shoulder width, slowly raise wrists to shoulder height, sink hips lowering palms.' },
          { id: 'tc-form-2', name: 'Form 2: Parting the Wild Horse’s Mane (Left & Right)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '6 paces (3 L, 3 R)', instructions: 'Hold ball of Chi, step diagonally into bow stance, expand arms parting energy.' },
          { id: 'tc-form-3', name: 'Form 3: White Crane Spreads Its Wings (Baihe Liangchi)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 transitions', instructions: 'Shift weight to rear leg into empty stance, open right arm high, left arm protects groin.' },
          { id: 'tc-form-4', name: 'Form 4: Brush Knee and Twist Step (Louxi Aobu)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '6 paces', instructions: 'Circle hand clearing knee while pushing opposite palm forward in bow stance.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Part 2: Playing Lute to Wave Hands Like Clouds',
        focus: 'Weight Shifting & Circular Flow',
        duration_minutes: 40,
        exercises: [
          { id: 'tc-form-5', name: 'Form 5: Playing the Lute (Shouhui Pipa)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 holds', instructions: 'Heel stance balance, align nose, fingertips, and front toe on midline.' },
          { id: 'tc-form-6', name: 'Form 6: Step Back and Repulse Monkey (Daojuan Gong)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 steps back', instructions: 'Step rearward, trace circular palm strike while drawing front arm to ear.' },
          { id: 'tc-form-7', name: 'Form 7: Grasp the Sparrow’s Tail (Left & Right Ward Off, Rollback, Press, Push)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 complete sequences', instructions: 'Execute Peng, Lu, Ji, An with seamless fluid momentum.' },
          { id: 'tc-form-8', name: 'Form 8: Single Whip (Danbian)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 transitions', instructions: 'Form hook hand with right wrist, extend left palm into wide horse stance.' },
          { id: 'tc-form-9', name: 'Form 9: Wave Hands Like Clouds (Yunshou)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '3 sideways paces L & R', instructions: 'Side step smoothly, rotating continuous figure-8 cloud palms in front of chest.' },
        ],
      },
      {
        day_number: 3,
        day_title: 'Part 3: Kicks to Closing Form',
        focus: 'Single-Leg Balance & Qi Consolidation',
        duration_minutes: 40,
        exercises: [
          { id: 'tc-form-10', name: 'Form 10: High Pat on Horse (Gaotan Ma)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 holds', instructions: 'Shift back into empty stance, thrust palm forward at throat height.' },
          { id: 'tc-form-11', name: 'Form 11: Right Heel Kick (You Dengjiao)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 kicks/side', instructions: 'Cross wrists, raise right knee, extend heel kick horizontally with open arms.' },
          { id: 'tc-form-12', name: 'Form 12: Strike to Ears with Both Fists (Shuangfeng Guan’er)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 strikes', instructions: 'Step into bow stance, swing twin circular fists inwards at ear level.' },
          { id: 'tc-form-13', name: 'Form 13: Golden Rooster Stands on One Leg (Jinji Duli)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 holds/side (10s each)', instructions: 'Lift left knee to waist height, extend left fingertips vertical like a rooster comb.' },
          { id: 'tc-form-14', name: 'Form 14: Closing Form (Shoushi)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '5 breathing cycles', instructions: 'Step feet together, lower hands smoothly, gather Qi into lower Dan Tian.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 6. ARNOLD SCHWARZENEGGER GOLDEN SIX (CLASSIC GOLDEN ERA SPLIT)
  // =========================================================================
  {
    id: 'arnold_golden_six',
    title: 'Arnold Schwarzenegger Golden Six',
    subtitle: 'Classic Golden Era Full-Body Hypertrophy Blueprint',
    creator: 'Arnold Schwarzenegger',
    category: 'bodybuilding_splits',
    difficulty: 'intermediate',
    equipment_needed: ['barbells', 'weight_plates', 'flat_bench', 'pull_up_bar'],
    duration_weeks: 8,
    days_per_week: 3,
    description:
      'The foundational 6-exercise full-body hypertrophy routine Arnold used at Munich Gym to build his legendary physique. Performed 3 days a week with heavy basic compound movements.',
    icon: '👑',
    accent_color: '#eab308',
    schedule: [
      {
        day_number: 1,
        day_title: 'The Golden Six Session (Full Body)',
        focus: 'Classic Golden Era Mass & Proportions',
        duration_minutes: 65,
        exercises: [
          { id: 'arnold-1', name: 'Barbell Back Squat', target_muscle: 'quads', suggested_sets: 4, suggested_reps: '10 reps', instructions: 'Thighs below parallel, explosive ascent.' },
          { id: 'arnold-2', name: 'Wide-Grip Barbell Flat Bench Press', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Wide grip, touch lower chest, maximum pectoral flare.' },
          { id: 'arnold-3', name: 'Wide-Grip Overhand Chin-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: 'Max reps (Goal: 10+)', instructions: 'Pull to sternum, full stretch at bottom.' },
          { id: 'arnold-4', name: 'Behind-the-Neck Barbell Overhead Press', target_muscle: 'shoulders', suggested_sets: 4, suggested_reps: '10 reps', instructions: 'Lower bar smoothly to ear level, press overhead.' },
          { id: 'arnold-5', name: 'Standing Barbell Bicep Curls', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Strict form, no hip swing, 2-second negative.' },
          { id: 'arnold-6', name: 'Bent-Knee Situps / Crunches', target_muscle: 'core', suggested_sets: 4, suggested_reps: '25 reps', instructions: 'Roll spine up vertebra by vertebra, squeeze abs.' },
        ],
      },
    ],
  },
];
