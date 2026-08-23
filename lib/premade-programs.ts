import { PreMadeWorkoutProgram } from './types';

export const PREMADE_WORKOUT_PROGRAMS: PreMadeWorkoutProgram[] = [
  // =========================================================================
  // 1. P90X SERIES (FULL COMPLEMENT OF 12+ WORKSHEETS)
  // =========================================================================
  {
    id: 'p90x_classic',
    title: 'P90X® Classic (Complete 12-Routine Master Split)',
    subtitle: 'The Full 12-Workout Muscle Confusion™ Master System',
    creator: 'Tony Horton & Beachbody',
    category: 'p90x_series',
    difficulty: 'advanced',
    equipment_needed: ['dumbbells', 'pull_up_bar', 'resistance_bands', 'yoga_mat'],
    duration_weeks: 12,
    days_per_week: 6,
    description:
      'The complete master catalog of all 12 iconic P90X routines. Features full interactive and printable worksheets for every single phase: Phase 1/3 splits, Phase 2 splits, Recovery weeks, and Ab Ripper X.',
    icon: '⚡',
    accent_color: '#3b82f6',
    schedule: [
      {
        day_number: 1,
        day_title: '1. Chest & Back',
        focus: 'Upper Body Antagonistic Compound Strength',
        duration_minutes: 53,
        exercises: [
          { id: 'p90x-cb-1', name: 'Standard Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '15–30 reps', instructions: 'Chest 1 inch off deck, full elbow extension.' },
          { id: 'p90x-cb-2', name: 'Wide Front Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8–15 reps', instructions: 'Wide overhand grip, pull chin clearly over bar.' },
          { id: 'p90x-cb-3', name: 'Military Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '15–25 reps', instructions: 'Elbows scraping ribcage, tricep emphasis.' },
          { id: 'p90x-cb-4', name: 'Reverse Grip Chin-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8–12 reps', instructions: 'Underhand grip, squeeze biceps and lower lats.' },
          { id: 'p90x-cb-5', name: 'Wide Fly Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '12–20 reps', instructions: 'Hands wider than shoulder width.' },
          { id: 'p90x-cb-6', name: 'Heavy Lawnmower Rows', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10–12 reps/side', instructions: 'Staggered stance, pull dumbbell back into hip pocket.' },
          { id: 'p90x-cb-7', name: 'Decline Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '12–20 reps', instructions: 'Feet elevated on bench or chair.' },
          { id: 'p90x-cb-8', name: 'Heavy Back Flyes', target_muscle: 'back', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Hinged forward, fly dumbbells in horizontal plane.' },
          { id: 'p90x-cb-9', name: 'Diamond Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10–15 reps', instructions: 'Index fingers and thumbs forming diamond.' },
          { id: 'p90x-cb-10', name: 'Underhand Overhand Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8–10 reps', instructions: 'One palm forward, one palm backward; switch halfway.' },
        ],
      },
      {
        day_number: 2,
        day_title: '2. Plyometrics (Jump Training)',
        focus: 'Explosive Power & Cardiovascular Endurance',
        duration_minutes: 58,
        exercises: [
          { id: 'p90x-plyo-1', name: 'Jump Squats (Airborne Reach)', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Deep squat into vertical jump reaching for ceiling.' },
          { id: 'p90x-plyo-2', name: 'Airborne Heismans', target_muscle: 'glutes', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Lateral high-knee bounding with torso twist.' },
          { id: 'p90x-plyo-3', name: 'Squat X-Jumps', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Touch floor in deep squat, explode into mid-air X.' },
          { id: 'p90x-plyo-4', name: 'Mary Katherine Jump Lunges', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Scissor jump switching legs in deep lunge.' },
          { id: 'p90x-plyo-5', name: 'Gap Jumps (Broad Jump & Backpedal)', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Bound forward softly, fast backpedal.' },
          { id: 'p90x-plyo-6', name: 'Rock Star Hops', target_muscle: 'calves', suggested_sets: 3, suggested_reps: '30 seconds', instructions: 'Explode up, kicking heels to buttocks.' },
        ],
      },
      {
        day_number: 3,
        day_title: '3. Shoulders & Arms',
        focus: 'Deltoids, Biceps & Triceps Hypertrophy',
        duration_minutes: 60,
        exercises: [
          { id: 'p90x-sa-1', name: 'Alternating Shoulder Press', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Seated or standing, press dumbbells vertically.' },
          { id: 'p90x-sa-2', name: 'In-and-Out Bicep Curls', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Alternate front supinated curl and 45° wide curl.' },
          { id: 'p90x-sa-3', name: 'Two-Arm Overhead Tricep Extension', target_muscle: 'triceps', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Lower heavy dumbbell behind head, lock out overhead.' },
          { id: 'p90x-sa-4', name: 'Deep Pike Presses', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '12–15 reps', instructions: 'Elevated hips, lower crown of head to floor.' },
          { id: 'p90x-sa-5', name: 'Static Arm Curls (4 on 4)', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '16 reps (4 each)', instructions: 'Hold one arm at 90° isometric while other reps 4 times.' },
          { id: 'p90x-sa-6', name: 'Tricep Side Push-Ups', target_muscle: 'triceps', suggested_sets: 3, suggested_reps: '10 reps/side', instructions: 'Side lying, wrap bottom arm, press torso up with top arm.' },
        ],
      },
      {
        day_number: 4,
        day_title: '4. Yoga X',
        focus: 'Vinyasa Flow, Hip Mobility & Balance',
        duration_minutes: 90,
        exercises: [
          { id: 'p90x-yoga-1', name: 'Sun Salutations (Surya Namaskar A & B)', target_muscle: 'mobility', suggested_sets: 4, suggested_reps: 'Continuous Flow', instructions: 'Inhale reach, forward fold, chaturanga, up dog, down dog.' },
          { id: 'p90x-yoga-2', name: 'Warrior Sequence (Warrior 1, 2, Reverse, Right Angle)', target_muscle: 'quads', suggested_sets: 2, suggested_reps: '60s hold/side', instructions: 'Deep 90° front knee lunge, arms extended.' },
          { id: 'p90x-yoga-3', name: 'Half Moon & Triangle Balance', target_muscle: 'glutes', suggested_sets: 2, suggested_reps: '45s hold/side', instructions: 'Single-leg balance with open chest.' },
          { id: 'p90x-yoga-4', name: 'Yoga Belly 7 (Abs & Hip Flexors)', target_muscle: 'core', suggested_sets: 1, suggested_reps: '10 mins', instructions: 'Scissors, torso twists, and boat pose holds.' },
        ],
      },
      {
        day_number: 5,
        day_title: '5. Legs & Back',
        focus: 'Quads, Posterior Chain & Calisthenic Pulls',
        duration_minutes: 59,
        exercises: [
          { id: 'p90x-lb-1', name: 'Step-Back Lunges with Dumbbells', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '12–15 reps/side', instructions: 'Step backward into 90° lunge, drive up.' },
          { id: 'p90x-lb-2', name: 'Wide Front Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Wide overhand grip to chin over bar.' },
          { id: 'p90x-lb-3', name: 'Super Skater Single-Leg Squats', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '15 reps/side', instructions: 'Single-leg balance squat reaching rear toe backward.' },
          { id: 'p90x-lb-4', name: 'Close Grip Underhand Chin-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Hands touching on bar, full lat squeeze.' },
          { id: 'p90x-lb-5', name: 'Single-Leg Wall Squat Iso-Hold', target_muscle: 'quads', suggested_sets: 2, suggested_reps: '45s hold/side', instructions: 'Back flat against wall, thigh parallel, lift one leg.' },
        ],
      },
      {
        day_number: 6,
        day_title: '6. Kenpo X',
        focus: 'Kickboxing Conditioning & Rotational Core',
        duration_minutes: 45,
        exercises: [
          { id: 'p90x-kenpo-1', name: 'Jab, Cross, Hook, Uppercut Combinations', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '45 seconds', instructions: 'Snap punches with hip rotation.' },
          { id: 'p90x-kenpo-2', name: 'Step-Behind Side Kicks', target_muscle: 'glutes', suggested_sets: 3, suggested_reps: '20 kicks/side', instructions: 'Chamber knee, strike with heel.' },
          { id: 'p90x-kenpo-3', name: 'Front Kick Knee-Lift Combos', target_muscle: 'core', suggested_sets: 3, suggested_reps: '25 reps/side', instructions: 'Drive knee to chest, snap ball of foot forward.' },
        ],
      },
      {
        day_number: 7,
        day_title: '7. X Stretch',
        focus: 'Full-Body Fascial Decompression & Active Recovery',
        duration_minutes: 58,
        exercises: [
          { id: 'p90x-xs-1', name: 'Seated Hamstring & Spinal Stretch', target_muscle: 'mobility', suggested_sets: 2, suggested_reps: '60s hold', instructions: 'Lengthen spine, hinge from hips.' },
          { id: 'p90x-xs-2', name: 'Cat-Cow Spinal Mobilization', target_muscle: 'mobility', suggested_sets: 2, suggested_reps: '10 cycles', instructions: 'Alternate arching and rounding spine with breath.' },
          { id: 'p90x-xs-3', name: 'Glute Pigeon Stretch', target_muscle: 'mobility', suggested_sets: 2, suggested_reps: '90s/side', instructions: 'Front shin parallel, fold over thigh.' },
        ],
      },
      {
        day_number: 8,
        day_title: '8. Core Synergistics',
        focus: 'Multi-Planar Athletic Core Conditioning',
        duration_minutes: 57,
        exercises: [
          { id: 'p90x-cs-1', name: 'Stacked Foot Push-Ups with Knee Drive', target_muscle: 'core', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Push-up, drive knee across to opposite elbow.' },
          { id: 'p90x-cs-2', name: 'Banana / Superman Core Rolls', target_muscle: 'core', suggested_sets: 3, suggested_reps: '10 rolls L & R', instructions: 'Hollow body hold, roll to arch without touching limbs to floor.' },
          { id: 'p90x-cs-3', name: 'Row-Kickback Planks with Dumbbell', target_muscle: 'triceps', suggested_sets: 3, suggested_reps: '10 reps/side', instructions: 'Hold plank on one hand, row and kickback with other.' },
        ],
      },
      {
        day_number: 9,
        day_title: '9. Chest, Shoulders & Triceps',
        focus: 'Phase 2 Upper Push Hypertrophy',
        duration_minutes: 56,
        exercises: [
          { id: 'p90x-cst-1', name: 'Slow-Motion 3-in-1 Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '12 reps', instructions: '4 seconds down, 4 seconds hold, 4 seconds up.' },
          { id: 'p90x-cst-2', name: 'Incline Shoulder Flyes', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Chest supported on incline bench, raise dumbbells laterally.' },
          { id: 'p90x-cst-3', name: 'Chair Dips with Feet Elevated', target_muscle: 'triceps', suggested_sets: 3, suggested_reps: '20 reps', instructions: 'Lower hips below chair height, press through palms.' },
          { id: 'p90x-cst-4', name: 'Plushie Presses (Dumbbells Pressed Together)', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Press dumbbells together horizontally while pressing overhead.' },
        ],
      },
      {
        day_number: 10,
        day_title: '10. Back & Biceps',
        focus: 'Phase 2 Upper Pull Thickness & Bicep Peak',
        duration_minutes: 52,
        exercises: [
          { id: 'p90x-bb-1', name: 'Wide Grip Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Wide overhand grip.' },
          { id: 'p90x-bb-2', name: 'Seated Bicep Curls with Supination', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Full supination at top, squeeze bicep peak.' },
          { id: 'p90x-bb-3', name: 'Switch Grip Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Switch grip width every 2 reps.' },
          { id: 'p90x-bb-4', name: 'Twenty-Ones Bicep Curls (7 Lower, 7 Upper, 7 Full)', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '21 reps', instructions: '7 bottom half, 7 top half, 7 full range reps.' },
        ],
      },
      {
        day_number: 11,
        day_title: '11. Cardio X',
        focus: 'Low-Impact Aerobic Interval Fat Burn',
        duration_minutes: 43,
        exercises: [
          { id: 'p90x-cx-1', name: 'Yoga Vinyasa Warmup Flow', target_muscle: 'mobility', suggested_sets: 1, suggested_reps: '5 mins', instructions: 'Sun salutations to elevate core body temperature.' },
          { id: 'p90x-cx-2', name: 'Kenpo Karate Punch & Kick Intervals', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '45 seconds', instructions: 'High intensity striking drills.' },
          { id: 'p90x-cx-3', name: 'Jump Rope Simulation & High Knees', target_muscle: 'calves', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Fast feet on balls of toes.' },
        ],
      },
      {
        day_number: 12,
        day_title: '12. Ab Ripper X',
        focus: '339-Rep High-Velocity Core Blitz',
        duration_minutes: 16,
        exercises: [
          { id: 'p90x-ar-1', name: 'In & Outs', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps', instructions: 'Balance on sit bones, extend legs straight, pull knees to chest.' },
          { id: 'p90x-ar-2', name: 'Seated Bicycles (Forward & Reverse)', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 fwd + 25 rev', instructions: 'Pedal large circles with legs off floor.' },
          { id: 'p90x-ar-3', name: 'Crunchy Frogs', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps', instructions: 'Open arms and legs wide, hug knees to chest.' },
          { id: 'p90x-ar-4', name: 'Wide Leg Cross Sit-Ups', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps (alternate L/R)', instructions: 'Sit up, reach right hand to left foot, reverse.' },
          { id: 'p90x-ar-5', name: 'Fifer Scissors', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps (slow count)', instructions: 'One leg 1 inch off floor, other straight up at 90°, switch on command.' },
          { id: 'p90x-ar-6', name: 'Hip Rocking Raises', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps', instructions: 'Soles of feet together in diamond, thrust hips straight to ceiling.' },
          { id: 'p90x-ar-7', name: 'Pulse-Ups (Straight Leg Hip Thrusts)', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps', instructions: 'Legs straight up at 90°, pulse hips vertically.' },
          { id: 'p90x-ar-8', name: 'Mason Twist (Russian Twists with Clap)', target_muscle: 'core', suggested_sets: 1, suggested_reps: '50 reps', instructions: 'Interlock fingers, rotate and touch floor on each side rapidly.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 2. P90X2 (FULL COMPLEMENT OF 12 WORKSHEETS)
  // =========================================================================
  {
    id: 'p90x2_complete',
    title: 'P90X2® (Complete 12-Routine PAP System)',
    subtitle: 'Post-Activation Potentiation & Functional Athleticism',
    creator: 'Tony Horton',
    category: 'p90x_series',
    difficulty: 'advanced',
    equipment_needed: ['dumbbells', 'pull_up_bar', 'medicine_ball', 'foam_roller', 'stability_ball'],
    duration_weeks: 12,
    days_per_week: 5,
    description:
      'The complete 12-routine athletic periodization program. Spans Phase 1 (Foundation & Instability), Phase 2 (Strength & Hypertrophy), and Phase 3 (Post-Activation Potentiation power complexes).',
    icon: '🦾',
    accent_color: '#06b6d4',
    schedule: [
      {
        day_number: 1,
        day_title: '1. X2 Core (Instability Dynamics)',
        focus: 'Transverse Abdominis & Rotational Equilibrium',
        duration_minutes: 55,
        exercises: [
          { id: 'p90x2-c-1', name: 'Sphinx Push-Ups on Medicine Ball', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Forearms to palms on medicine ball.' },
          { id: 'p90x2-c-2', name: 'Stability Ball Rollouts', target_muscle: 'core', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Forearms on ball, extend spine.' },
          { id: 'p90x2-c-3', name: '4-Ball Push-Ups (Hands & Feet on Med Balls)', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '8–10 reps', instructions: 'Balance on separate medicine balls.' },
        ],
      },
      {
        day_number: 2,
        day_title: '2. Plyocide',
        focus: 'PAP Explosiveness & Reactive Ground Contact',
        duration_minutes: 55,
        exercises: [
          { id: 'p90x2-p-1', name: 'Wide Leg Jump to Frog Squat', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '45 seconds', instructions: 'Explode forward into soft deep squat.' },
          { id: 'p90x2-p-2', name: '100-Meter Bounding Skaters', target_muscle: 'glutes', suggested_sets: 3, suggested_reps: '45 seconds', instructions: 'Wide lateral bounds sticking each landing 1 second.' },
        ],
      },
      {
        day_number: 3,
        day_title: '3. X2 Recovery + Mobility',
        focus: 'Myofascial Foam Rolling & Joint Decompression',
        duration_minutes: 57,
        exercises: [
          { id: 'p90x2-rm-1', name: 'Full-Body Foam Roller Myofascial Release', target_muscle: 'mobility', suggested_sets: 1, suggested_reps: '30 mins', instructions: 'Roll IT bands, quads, thoracic spine, and calves.' },
          { id: 'p90x2-rm-2', name: 'Dynamic Hamstring & Hip Openers', target_muscle: 'mobility', suggested_sets: 2, suggested_reps: '10 reps/side', instructions: 'Leg sweeps and deep hip hinges.' },
        ],
      },
      {
        day_number: 4,
        day_title: '4. X2 Total Body',
        focus: 'Full-Body Functional Free Weight Complexes',
        duration_minutes: 62,
        exercises: [
          { id: 'p90x2-tb-1', name: '1-Arm Push-Up on Medicine Ball', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '8 reps/side', instructions: 'One hand on ball, one on floor.' },
          { id: 'p90x2-tb-2', name: 'Weighted Warrior 3 Dumbbell Rows', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10 reps/side', instructions: 'Balance on one leg in horizontal T, row dumbbell.' },
        ],
      },
      {
        day_number: 5,
        day_title: '5. X2 Yoga',
        focus: 'Isometric Flow & Spinal Mobility',
        duration_minutes: 67,
        exercises: [
          { id: 'p90x2-y-1', name: 'Sun Salutation Vinyasa Flow', target_muscle: 'mobility', suggested_sets: 4, suggested_reps: 'Continuous', instructions: 'Dynamic flowing transitions.' },
          { id: 'p90x2-y-2', name: 'Crane / Crow Pose (Bakasana)', target_muscle: 'core', suggested_sets: 3, suggested_reps: '30s hold', instructions: 'Knees on triceps, balance on palms.' },
        ],
      },
      {
        day_number: 6,
        day_title: '6. X2 Balance & Power',
        focus: 'Proprioception & Multi-Planar Strength',
        duration_minutes: 62,
        exercises: [
          { id: 'p90x2-bp-1', name: 'Single-Leg Dumbbell Squat Press', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '10 reps/side', instructions: 'Squat on one leg, press overhead standing.' },
          { id: 'p90x2-bp-2', name: 'Medicine Ball Plyo Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Switch hands across ball mid-air.' },
        ],
      },
      {
        day_number: 7,
        day_title: '7. Chest + Back + Balance',
        focus: 'Phase 2 Upper Hypertrophy with Instability',
        duration_minutes: 59,
        exercises: [
          { id: 'p90x2-cbb-1', name: 'Lever Pull-Ups (L-Sit Pull-Ups)', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8 reps', instructions: 'Legs parallel to floor in L-sit, pull chin over bar.' },
          { id: 'p90x2-cbb-2', name: '3-Ball Plyo Push-Ups', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Hands on 2 med balls, feet on 1 med ball.' },
        ],
      },
      {
        day_number: 8,
        day_title: '8. X2 Shoulders + Arms',
        focus: 'Unstable Deltoid & Arm Hypertrophy',
        duration_minutes: 52,
        exercises: [
          { id: 'p90x2-sa-1', name: 'Balance Ball Incline Bicep Curls', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Back supported on stability ball, deep curl.' },
          { id: 'p90x2-sa-2', name: 'Arnold Press on Single Leg', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '10 reps/side', instructions: 'Balance on one leg, rotate and press dumbbells.' },
        ],
      },
      {
        day_number: 9,
        day_title: '9. Base + Back',
        focus: 'Leg Power & Heavy Lat Pulls',
        duration_minutes: 55,
        exercises: [
          { id: 'p90x2-bb-1', name: 'Plyo Frog Squat Jumps', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '45 seconds', instructions: 'Deep touch floor, vertical jump.' },
          { id: 'p90x2-bb-2', name: 'Weighted Pull-Ups (Varying Grips)', target_muscle: 'back', suggested_sets: 4, suggested_reps: '8 reps', instructions: 'Add dumbbell between feet or weighted vest.' },
        ],
      },
      {
        day_number: 10,
        day_title: '10. P.A.P. Lower (Post-Activation Potentiation)',
        focus: 'Heavy Resistance Paired with Explosive Plyometrics',
        duration_minutes: 62,
        exercises: [
          { id: 'p90x2-papl-1', name: 'Step-Up Convict Lunges (Heavy Dumbbells)', target_muscle: 'quads', suggested_sets: 4, suggested_reps: '8 reps/side', instructions: 'Heavy loaded step-up on box.' },
          { id: 'p90x2-papl-2', name: 'Skater Plyo Bounds (Explosive Pair)', target_muscle: 'glutes', suggested_sets: 4, suggested_reps: '8 reps/side', instructions: 'Immediate explosive lateral jumps.' },
          { id: 'p90x2-papl-3', name: 'One-Legged Squat Hop (PAP Finisher)', target_muscle: 'quads', suggested_sets: 4, suggested_reps: '6 hops/side', instructions: 'Single-leg vertical power.' },
        ],
      },
      {
        day_number: 11,
        day_title: '11. P.A.P. Upper (Post-Activation Potentiation)',
        focus: 'Heavy Upper Pull/Push Paired with Plyometric Speed',
        duration_minutes: 52,
        exercises: [
          { id: 'p90x2-papu-1', name: 'Heavy Renegade Rows on Dumbbells', target_muscle: 'back', suggested_sets: 4, suggested_reps: '8 reps/side', instructions: 'Heavy row in push-up plank.' },
          { id: 'p90x2-papu-2', name: 'Plyometric Clapping Push-Ups', target_muscle: 'chest', suggested_sets: 4, suggested_reps: '8 reps', instructions: 'Explode off floor, clap hands under chest.' },
          { id: 'p90x2-papu-3', name: 'Medicine Ball Chest Pass against Wall', target_muscle: 'chest', suggested_sets: 4, suggested_reps: '10 explosive throws', instructions: 'Max velocity push.' },
        ],
      },
      {
        day_number: 12,
        day_title: '12. X2 Ab Ripper',
        focus: 'Advanced Athletic Core & Oblique Control',
        duration_minutes: 17,
        exercises: [
          { id: 'p90x2-ar-1', name: 'Scissor Claps', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps', instructions: 'Clap hands through alternating scissor legs.' },
          { id: 'p90x2-ar-2', name: 'Tornado Twists', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps', instructions: 'Full circular rotation with legs elevated.' },
          { id: 'p90x2-ar-3', name: 'Oblique Roll Crunches', target_muscle: 'core', suggested_sets: 1, suggested_reps: '25 reps/side', instructions: 'Side lying crunch targeting external obliques.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 3. P90X3 (FULL COMPLEMENT OF 19 WORKSHEETS)
  // =========================================================================
  {
    id: 'p90x3_complete',
    title: 'P90X3® (Complete 19-Routine 30-Min System)',
    subtitle: 'High-Density 30-Minute Metabolic Mastery',
    creator: 'Tony Horton',
    category: 'p90x_series',
    difficulty: 'intermediate',
    equipment_needed: ['dumbbells', 'pull_up_bar', 'resistance_bands', 'yoga_mat'],
    duration_weeks: 12,
    days_per_week: 6,
    description:
      'The entire catalog of all 19 P90X3 workouts. Exactly 30 minutes each of maximum density training: Classic, Lean, Mass, and Doubles tracks.',
    icon: '⏱️',
    accent_color: '#f97316',
    schedule: [
      {
        day_number: 1,
        day_title: '1. Total Synergistics (30 Min)',
        focus: 'Neuromuscular Full-Body Activation',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-1', name: 'Push-Up Side Arm Balance with Knee Tuck', target_muscle: 'chest', suggested_sets: 2, suggested_reps: '12 reps', instructions: 'Push-up, rotate to side plank, drive top knee to elbow.' },
          { id: 'p90x3-2', name: 'Pull-Up Knees-to-Elbows Crunch', target_muscle: 'back', suggested_sets: 2, suggested_reps: '8 reps', instructions: 'Pull chin over bar, tuck knees simultaneously.' },
          { id: 'p90x3-3', name: 'Crawling Push-Ups', target_muscle: 'chest', suggested_sets: 2, suggested_reps: '12 reps', instructions: 'Crawl 2 paces forward in bear crawl, push-up.' },
        ],
      },
      {
        day_number: 2,
        day_title: '2. Agility X (30 Min)',
        focus: 'Multi-Directional Footwork & Deceleration',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-2-1', name: 'Plyo Line Jumps (Tape Drills)', target_muscle: 'calves', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Fast lateral and front/back hops over tape line.' },
          { id: 'p90x3-2-2', name: 'X-Drill Sprints & Floor Touches', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Sprint diagonal X pattern, touch floor corners.' },
        ],
      },
      {
        day_number: 3,
        day_title: '3. The Challenge (30 Min)',
        focus: 'Max Density Pull-Ups & Push-Ups Ladder',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-3-1', name: 'Standard Push-Ups (Set Target)', target_muscle: 'chest', suggested_sets: 4, suggested_reps: '20–35 reps', instructions: 'Consistent rep target on every round.' },
          { id: 'p90x3-3-2', name: 'Wide Grip Pull-Ups (Set Target)', target_muscle: 'back', suggested_sets: 4, suggested_reps: '8–15 reps', instructions: 'Hit set rep goal every round.' },
          { id: 'p90x3-3-3', name: 'Military Close Push-Ups', target_muscle: 'triceps', suggested_sets: 4, suggested_reps: '15–25 reps', instructions: 'Elbows tucked.' },
          { id: 'p90x3-3-4', name: 'Underhand Chin-Ups', target_muscle: 'biceps', suggested_sets: 4, suggested_reps: '8–12 reps', instructions: 'Chin over bar.' },
        ],
      },
      {
        day_number: 4,
        day_title: '4. X3 Yoga (30 Min)',
        focus: 'Fast-Paced Vinyasa & Core Equilibrium',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-4-1', name: 'Flowing Sun Salutations', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: 'Continuous', instructions: 'Smooth transitions.' },
          { id: 'p90x3-4-2', name: 'Crescent Lunge to Warrior 3 Balance', target_muscle: 'glutes', suggested_sets: 2, suggested_reps: '45s/side', instructions: 'Extend arms forward, rear leg horizontal.' },
        ],
      },
      {
        day_number: 5,
        day_title: '5. CVX (Cardio with Weights - 30 Min)',
        focus: 'Continuous Resistance Aerobic Intervals',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-5-1', name: 'Press Jacks with Light Dumbbell (5-10 lbs)', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Jumping jack pressing dumbbell overhead on each rep.' },
          { id: 'p90x3-5-2', name: 'Atlas Twist Lunges with Weight', target_muscle: 'core', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Lunge, twist weight over front knee.' },
        ],
      },
      {
        day_number: 6,
        day_title: '6. The Warrior (30 Min)',
        focus: 'Military-Grade Calisthenics & Bodyweight Power',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-6-1', name: 'Plank Sprawl to Jump', target_muscle: 'full_body_cardio', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Drop into plank, snap feet forward, vertical jump.' },
          { id: 'p90x3-6-2', name: 'Super Burpees with Push-Up', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Full chest to deck burpee.' },
        ],
      },
      {
        day_number: 7,
        day_title: '7. Isometrix (30 Min)',
        focus: 'Isometric Stability & Joint Strength',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-7-1', name: 'Plank to Side Plank 45s Hold', target_muscle: 'core', suggested_sets: 2, suggested_reps: '45s/side', instructions: 'Perfect horizontal alignment.' },
          { id: 'p90x3-7-2', name: 'Warrior 3 Isometric Hold', target_muscle: 'hamstrings', suggested_sets: 2, suggested_reps: '45s/side', instructions: 'Zero pelvic tilt, hold steady.' },
        ],
      },
      {
        day_number: 8,
        day_title: '8. Dynamix (30 Min)',
        focus: 'Dynamic Flexibility & Range of Motion',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-8-1', name: 'Scorpion Hip Openers', target_muscle: 'mobility', suggested_sets: 2, suggested_reps: '10 reps/side', instructions: 'Prone, reach heel across to opposite hand.' },
          { id: 'p90x3-8-2', name: 'Inchworm Walkouts', target_muscle: 'mobility', suggested_sets: 2, suggested_reps: '10 reps', instructions: 'Hinge hips, walk palms to plank, walk feet in.' },
        ],
      },
      {
        day_number: 9,
        day_title: '9. Accelerator (30 Min)',
        focus: 'Max Heart Rate Conditioning & Speed',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-9-1', name: 'Speed Skaters to Burpee', target_muscle: 'full_body_cardio', suggested_sets: 3, suggested_reps: '60 seconds', instructions: '4 lateral bounds into 1 burpee.' },
        ],
      },
      {
        day_number: 10,
        day_title: '10. Decelerator (30 Min)',
        focus: 'Eccentric Muscle Landing & Joint Protection',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-10-1', name: 'Single-Leg Drop Squat Landings', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '10 reps/side', instructions: 'Jump, land softly on single leg with zero knee cave.' },
        ],
      },
      {
        day_number: 11,
        day_title: '11. Incinerator (30 Min)',
        focus: 'Push/Pull Failure Circuit',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-11-1', name: 'Renegade Dumbbell Row to Push-Up', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Row L, Row R, Push-up.' },
          { id: 'p90x3-11-2', name: 'Heavy Hammer Curls to Press', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Bicep curl directly into overhead press.' },
        ],
      },
      {
        day_number: 12,
        day_title: '12. MMX (Mixed Martial Arts X - 30 Min)',
        focus: 'Krav Maga / Muay Thai striking flow',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-12-1', name: 'Jab, Cross, Hook, Sprawl', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Striking combo into fast defensive sprawl.' },
        ],
      },
      {
        day_number: 13,
        day_title: '13. Eccentric Upper (30 Min)',
        focus: '4-Second Negative Upper Hypertrophy',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-13-1', name: 'Eccentric Dumbbell Chest Press (4s down)', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Lower dumbbells for 4 full seconds, explode up in 1s.' },
          { id: 'p90x3-13-2', name: 'Eccentric Pull-Ups (4s negative descent)', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8 reps', instructions: 'Jump chin over bar, lower for 4 slow seconds.' },
        ],
      },
      {
        day_number: 14,
        day_title: '14. Eccentric Lower (30 Min)',
        focus: '4-Second Negative Quad & Hamstring Growth',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-14-1', name: 'Eccentric Dumbbell Squats (4s down)', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '10 reps', instructions: '4-second slow descent into deep parallel squat.' },
          { id: 'p90x3-14-2', name: 'Eccentric Romanian Deadlifts (4s down)', target_muscle: 'hamstrings', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Slow hinge stretching hamstrings.' },
        ],
      },
      {
        day_number: 15,
        day_title: '15. Complex Upper (30 Min)',
        focus: 'Heavy Resistance to Explosive Complex',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-15-1', name: 'Heavy Barbell/Dumbbell Row into Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8 + 8 reps', instructions: 'Heavy row followed immediately by explosive pull-ups.' },
        ],
      },
      {
        day_number: 16,
        day_title: '16. Complex Lower (30 Min)',
        focus: 'Heavy Squats to Plyometric Jumps',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-16-1', name: 'Heavy Dumbbell Lunges into Jump Lunges', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '8 + 8 reps', instructions: 'Heavy load immediately into plyo hops.' },
        ],
      },
      {
        day_number: 17,
        day_title: '17. Triometrics (30 Min)',
        focus: '3-Tier Plyometric Escalation',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-17-1', name: 'Level 1, 2, 3 Jump Squats', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '60 seconds', instructions: 'Low jump, medium jump, max height jump.' },
        ],
      },
      {
        day_number: 18,
        day_title: '18. Pilates X (30 Min)',
        focus: 'Core Transverse & Pelvic Floor Strength',
        duration_minutes: 30,
        exercises: [
          { id: 'p90x3-18-1', name: 'Pilates The Hundred', target_muscle: 'core', suggested_sets: 1, suggested_reps: '100 pumps', instructions: 'Pump arms at sides while holding hollow body.' },
        ],
      },
      {
        day_number: 19,
        day_title: '19. X3 Ab Ripper (15 Min)',
        focus: 'High-Density 30-Second Core Stations',
        duration_minutes: 15,
        exercises: [
          { id: 'p90x3-ar-1', name: 'Seated Dolphin V-Ups', target_muscle: 'core', suggested_sets: 1, suggested_reps: '20 reps', instructions: 'V-up balance reaching for toes.' },
          { id: 'p90x3-ar-2', name: 'C-Sit Flutters', target_muscle: 'core', suggested_sets: 1, suggested_reps: '40 kicks', instructions: 'Lean back 45°, flutter kick feet rapidly.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 4. CROSSFIT® "THE GIRLS" BENCHMARK WORKOUTS (18 DEDICATED WORKSHEETS)
  // =========================================================================
  {
    id: 'crossfit_the_girls',
    title: 'CrossFit® "The Girls" Benchmark Catalog',
    subtitle: 'The 18 Legendary Benchmark WODs for Time & Reps',
    creator: 'Greg Glassman & CrossFit HQ',
    category: 'crossfit_benchmarks',
    difficulty: 'advanced',
    equipment_needed: ['barbells', 'weight_plates', 'pull_up_bar', 'kettlebells', 'rower', 'rings'],
    duration_weeks: 6,
    days_per_week: 3,
    description:
      'The definitive collection of all 18 classic CrossFit "Girls" benchmark workouts: Fran, Cindy, Helen, Grace, Isabel, Diane, Elizabeth, Karen, Annie, Jackie, Mary, Chelsea, Nancy, Eva, Kelly, Angie, Barbara, and Linda. Test and log your PR times on every sheet.',
    icon: '🏋️‍♀️',
    accent_color: '#ef4444',
    schedule: [
      {
        day_number: 1,
        day_title: 'WOD 1: "FRAN" (21–15–9 For Time)',
        focus: 'Barbell Thrusters & Pull-Ups Sprint',
        duration_minutes: 15,
        exercises: [
          { id: 'cf-fran-1', name: 'Barbell Thrusters @ 95 lbs / 43 kg (21, 15, 9)', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '21, 15, 9 reps', instructions: 'Full front squat directly into explosive overhead push press.' },
          { id: 'cf-fran-2', name: 'Pull-Ups (21, 15, 9)', target_muscle: 'back', suggested_sets: 3, suggested_reps: '21, 15, 9 reps', instructions: 'Chin clearing bar on every rep.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'WOD 2: "CINDY" (20-Min AMRAP)',
        focus: 'Gymnastic Calisthenic Density',
        duration_minutes: 20,
        exercises: [
          { id: 'cf-cindy-1', name: 'Pull-Ups', target_muscle: 'back', suggested_sets: 25, suggested_reps: '5 reps', instructions: 'Deadhang to chin over bar.' },
          { id: 'cf-cindy-2', name: 'Push-Ups', target_muscle: 'chest', suggested_sets: 25, suggested_reps: '10 reps', instructions: 'Chest touches floor, lock elbows.' },
          { id: 'cf-cindy-3', name: 'Air Squats', target_muscle: 'quads', suggested_sets: 25, suggested_reps: '15 reps', instructions: 'Crease of hip below knee.' },
        ],
      },
      {
        day_number: 3,
        day_title: 'WOD 3: "HELEN" (3 Rounds For Time)',
        focus: '400m Run, Kettlebell Swings, Pull-Ups',
        duration_minutes: 20,
        exercises: [
          { id: 'cf-helen-1', name: '400m Sprint Run', target_muscle: 'full_body_cardio', suggested_sets: 3, suggested_reps: '400 meters', instructions: 'Hard aerobic sprint.' },
          { id: 'cf-helen-2', name: 'American Kettlebell Swings @ 53 lbs / 24 kg', target_muscle: 'hamstrings', suggested_sets: 3, suggested_reps: '21 reps', instructions: 'Bell overhead with vertical arms.' },
          { id: 'cf-helen-3', name: 'Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '12 reps', instructions: 'Unbroken pull-up sets.' },
        ],
      },
      {
        day_number: 4,
        day_title: 'WOD 4: "GRACE" (30 Clean & Jerks For Time)',
        focus: 'Olympic Barbell Clean & Jerk Speed',
        duration_minutes: 10,
        exercises: [
          { id: 'cf-grace-1', name: 'Barbell Clean & Jerk @ 135 lbs / 61 kg (Women: 95 lbs)', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '30 reps for time', instructions: 'Bar from floor to shoulders, jerk overhead to locked elbows.' },
        ],
      },
      {
        day_number: 5,
        day_title: 'WOD 5: "ISABEL" (30 Snatches For Time)',
        focus: 'Olympic Power Snatch Speed',
        duration_minutes: 10,
        exercises: [
          { id: 'cf-isabel-1', name: 'Barbell Power Snatch @ 135 lbs / 61 kg (Women: 95 lbs)', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '30 reps for time', instructions: 'Bar from floor overhead in one continuous motion.' },
        ],
      },
      {
        day_number: 6,
        day_title: 'WOD 6: "DIANE" (21–15–9 For Time)',
        focus: 'Heavy Deadlifts & Handstand Push-Ups',
        duration_minutes: 12,
        exercises: [
          { id: 'cf-diane-1', name: 'Barbell Deadlifts @ 225 lbs / 102 kg (Women: 155 lbs)', target_muscle: 'back', suggested_sets: 3, suggested_reps: '21, 15, 9 reps', instructions: 'Full hip extension at top.' },
          { id: 'cf-diane-2', name: 'Handstand Push-Ups (HSPU against wall)', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '21, 15, 9 reps', instructions: 'Head touches floor, press to full arm lockout.' },
        ],
      },
      {
        day_number: 7,
        day_title: 'WOD 7: "ELIZABETH" (21–15–9 For Time)',
        focus: 'Squat Cleans & Ring Dips',
        duration_minutes: 15,
        exercises: [
          { id: 'cf-elizabeth-1', name: 'Barbell Squat Cleans @ 135 lbs / 61 kg', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '21, 15, 9 reps', instructions: 'Catch in deep full squat, stand tall.' },
          { id: 'cf-elizabeth-2', name: 'Gymnastic Ring Dips', target_muscle: 'triceps', suggested_sets: 3, suggested_reps: '21, 15, 9 reps', instructions: 'Biceps touch rings at bottom, lock elbows at top.' },
        ],
      },
      {
        day_number: 8,
        day_title: 'WOD 8: "KAREN" (150 Wall Balls For Time)',
        focus: 'Quad Burnout & Target Accuracy',
        duration_minutes: 15,
        exercises: [
          { id: 'cf-karen-1', name: 'Medicine Ball Wall Balls @ 20 lbs (10ft Target)', target_muscle: 'quads', suggested_sets: 1, suggested_reps: '150 reps for time', instructions: 'Squat below parallel, throw ball to 10-foot target line.' },
        ],
      },
      {
        day_number: 9,
        day_title: 'WOD 9: "ANNIE" (50–40–30–20–10 For Time)',
        focus: 'Double-Unders & AbMat Sit-Ups',
        duration_minutes: 15,
        exercises: [
          { id: 'cf-annie-1', name: 'Jump Rope Double-Unders', target_muscle: 'calves', suggested_sets: 5, suggested_reps: '50, 40, 30, 20, 10 reps', instructions: 'Rope passes twice under feet per single jump.' },
          { id: 'cf-annie-2', name: 'AbMat Sit-Ups', target_muscle: 'core', suggested_sets: 5, suggested_reps: '50, 40, 30, 20, 10 reps', instructions: 'Touch floor behind head, touch toes sitting up.' },
        ],
      },
      {
        day_number: 10,
        day_title: 'WOD 10: "JACKIE" (For Time)',
        focus: '1,000m Row, 50 Thrusters, 30 Pull-Ups',
        duration_minutes: 15,
        exercises: [
          { id: 'cf-jackie-1', name: 'Concept2 1,000m Row', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '1,000 meters', instructions: 'Fast steady rowing split.' },
          { id: 'cf-jackie-2', name: 'Barbell Thrusters @ 45 lbs (Empty Bar)', target_muscle: 'quads', suggested_sets: 1, suggested_reps: '50 reps unbroken', instructions: 'Deep squat to overhead press.' },
          { id: 'cf-jackie-3', name: 'Pull-Ups', target_muscle: 'back', suggested_sets: 1, suggested_reps: '30 reps', instructions: 'Sprint to the finish.' },
        ],
      },
      {
        day_number: 11,
        day_title: 'WOD 11: "MARY" (20-Min AMRAP)',
        focus: 'Handstand Push-Ups, Pistols, Pull-Ups',
        duration_minutes: 20,
        exercises: [
          { id: 'cf-mary-1', name: 'Handstand Push-Ups (HSPU)', target_muscle: 'shoulders', suggested_sets: 15, suggested_reps: '5 reps', instructions: 'Strict vertical press.' },
          { id: 'cf-mary-2', name: 'Single-Leg Pistol Squats (Alternating)', target_muscle: 'quads', suggested_sets: 15, suggested_reps: '10 reps (5L, 5R)', instructions: 'Single-leg squat below parallel without touching other foot.' },
          { id: 'cf-mary-3', name: 'Pull-Ups', target_muscle: 'back', suggested_sets: 15, suggested_reps: '15 reps', instructions: 'Chin over bar.' },
        ],
      },
      {
        day_number: 12,
        day_title: 'WOD 12: "CHELSEA" (EMOM for 30 Minutes)',
        focus: 'Every Minute on the Minute (EMOM) Endurance',
        duration_minutes: 30,
        exercises: [
          { id: 'cf-chelsea-1', name: '5 Pull-Ups + 10 Push-Ups + 15 Air Squats (EMOM)', target_muscle: 'full_body_cardio', suggested_sets: 30, suggested_reps: '1 round per minute for 30 mins', instructions: 'Complete all 30 reps inside 60 seconds; remaining time is rest.' },
        ],
      },
      {
        day_number: 13,
        day_title: 'WOD 13: "NANCY" (5 Rounds For Time)',
        focus: '400m Run & Overhead Squats',
        duration_minutes: 20,
        exercises: [
          { id: 'cf-nancy-1', name: '400m Sprint Run', target_muscle: 'full_body_cardio', suggested_sets: 5, suggested_reps: '400 meters', instructions: 'Hard pace.' },
          { id: 'cf-nancy-2', name: 'Barbell Overhead Squats @ 95 lbs / 43 kg', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '15 reps', instructions: 'Bar locked overhead, deep squat below parallel.' },
        ],
      },
      {
        day_number: 14,
        day_title: 'WOD 14: "EVA" (5 Rounds For Time)',
        focus: '800m Run, Heavy KB Swings, Pull-Ups',
        duration_minutes: 40,
        exercises: [
          { id: 'cf-eva-1', name: '800m Run', target_muscle: 'full_body_cardio', suggested_sets: 5, suggested_reps: '800 meters', instructions: 'Endurance run.' },
          { id: 'cf-eva-2', name: 'Heavy Kettlebell Swings @ 70 lbs / 32 kg', target_muscle: 'hamstrings', suggested_sets: 5, suggested_reps: '30 reps', instructions: 'Heavy hip snap overhead.' },
          { id: 'cf-eva-3', name: 'Pull-Ups', target_muscle: 'back', suggested_sets: 5, suggested_reps: '30 reps', instructions: 'Full range.' },
        ],
      },
      {
        day_number: 15,
        day_title: 'WOD 15: "KELLY" (5 Rounds For Time)',
        focus: '400m Run, 30 Box Jumps, 30 Wall Balls',
        duration_minutes: 35,
        exercises: [
          { id: 'cf-kelly-1', name: '400m Run', target_muscle: 'full_body_cardio', suggested_sets: 5, suggested_reps: '400 meters', instructions: 'Sprint run.' },
          { id: 'cf-kelly-2', name: 'Box Jumps on 24" Box', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '30 reps', instructions: 'Stand tall on box.' },
          { id: 'cf-kelly-3', name: 'Wall Balls @ 20 lbs', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '30 reps', instructions: 'Deep squat to 10ft target.' },
        ],
      },
      {
        day_number: 16,
        day_title: 'WOD 16: "ANGIE" (For Time)',
        focus: '100 Pull-Ups, 100 Push-Ups, 100 Sit-Ups, 100 Squats',
        duration_minutes: 30,
        exercises: [
          { id: 'cf-angie-1', name: 'Pull-Ups (Complete all 100 before moving on)', target_muscle: 'back', suggested_sets: 1, suggested_reps: '100 reps', instructions: 'Break into sets as needed.' },
          { id: 'cf-angie-2', name: 'Push-Ups (Complete all 100)', target_muscle: 'chest', suggested_sets: 1, suggested_reps: '100 reps', instructions: 'Chest to deck.' },
          { id: 'cf-angie-3', name: 'AbMat Sit-Ups (Complete all 100)', target_muscle: 'core', suggested_sets: 1, suggested_reps: '100 reps', instructions: 'Full range.' },
          { id: 'cf-angie-4', name: 'Air Squats (Complete all 100)', target_muscle: 'quads', suggested_sets: 1, suggested_reps: '100 reps', instructions: 'Sprint finish.' },
        ],
      },
      {
        day_number: 17,
        day_title: 'WOD 17: "BARBARA" (5 Rounds with 3 Min Rest)',
        focus: 'High-Volume Calisthenic Power Intervals',
        duration_minutes: 40,
        exercises: [
          { id: 'cf-barb-1', name: 'Pull-Ups (20 reps)', target_muscle: 'back', suggested_sets: 5, suggested_reps: '20 reps', instructions: '5 rounds with exactly 3 mins rest between rounds.' },
          { id: 'cf-barb-2', name: 'Push-Ups (30 reps)', target_muscle: 'chest', suggested_sets: 5, suggested_reps: '30 reps', instructions: 'Strict form.' },
          { id: 'cf-barb-3', name: 'AbMat Sit-Ups (40 reps)', target_muscle: 'core', suggested_sets: 5, suggested_reps: '40 reps', instructions: 'Continuous pace.' },
          { id: 'cf-barb-4', name: 'Air Squats (50 reps)', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '50 reps', instructions: 'Below parallel.' },
        ],
      },
      {
        day_number: 18,
        day_title: 'WOD 18: "LINDA" (The Three Bars of Death: 10–9–8...–1)',
        focus: 'Bodyweight Barbell Triplet (Deadlift, Bench, Clean)',
        duration_minutes: 35,
        exercises: [
          { id: 'cf-linda-1', name: 'Barbell Deadlift @ 1.5× Bodyweight (10, 9, 8... 1 reps)', target_muscle: 'back', suggested_sets: 10, suggested_reps: '10 down to 1', instructions: 'Heavy deadlift.' },
          { id: 'cf-linda-2', name: 'Barbell Bench Press @ 1.0× Bodyweight (10, 9, 8... 1 reps)', target_muscle: 'chest', suggested_sets: 10, suggested_reps: '10 down to 1', instructions: 'Bodyweight bench.' },
          { id: 'cf-linda-3', name: 'Barbell Squat Clean @ 0.75× Bodyweight (10, 9, 8... 1 reps)', target_muscle: 'quads', suggested_sets: 10, suggested_reps: '10 down to 1', instructions: 'Squat cleans.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 5. CROSSFIT® HERO BENCHMARK WORKOUTS (10 DEDICATED WORKSHEETS)
  // =========================================================================
  {
    id: 'crossfit_hero_wods',
    title: 'CrossFit® Legendary Hero WODs',
    subtitle: 'Memorial Workouts: Murph, DT, Chad 1000X, The Seven & Badger',
    creator: 'CrossFit Military Memorials',
    category: 'crossfit_benchmarks',
    difficulty: 'advanced',
    equipment_needed: ['barbells', 'pull_up_bar', 'weight_plates', 'kettlebells', 'plyo_box'],
    duration_weeks: 6,
    days_per_week: 3,
    description:
      'Tough, honor-driven Hero benchmark workouts engineered to test the limits of grit, mental stamina, and athletic work capacity.',
    icon: '🎖️',
    accent_color: '#475569',
    schedule: [
      {
        day_number: 1,
        day_title: 'Hero WOD 1: "MURPH" (With 20 lb Vest)',
        focus: '1 Mile Run, 100 Pull-Ups, 200 Push-Ups, 300 Squats, 1 Mile Run',
        duration_minutes: 60,
        exercises: [
          { id: 'hero-m-1', name: '1.0 Mile Run (1,600m)', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '1.0 Mile', instructions: 'Start at controlled aerobic pace with weighted vest.' },
          { id: 'hero-m-2', name: 'Pull-Ups (100 total reps or 20 rounds of 5)', target_muscle: 'back', suggested_sets: 20, suggested_reps: '5 reps', instructions: 'Partitioned or unpartitioned.' },
          { id: 'hero-m-3', name: 'Push-Ups (200 total reps or 20 rounds of 10)', target_muscle: 'chest', suggested_sets: 20, suggested_reps: '10 reps', instructions: 'Chest touches deck.' },
          { id: 'hero-m-4', name: 'Air Squats (300 total reps or 20 rounds of 15)', target_muscle: 'quads', suggested_sets: 20, suggested_reps: '15 reps', instructions: 'Full depth.' },
          { id: 'hero-m-5', name: '1.0 Mile Run (1,600m)', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '1.0 Mile', instructions: 'Final sprint to the finish line.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Hero WOD 2: "DT" (5 Rounds For Time @ 155 lbs / 70 kg)',
        focus: '12 Deadlifts, 9 Hang Power Cleans, 6 Push Jerks',
        duration_minutes: 20,
        exercises: [
          { id: 'hero-dt-1', name: 'Barbell Deadlifts @ 155 lbs / 70 kg (12 reps)', target_muscle: 'back', suggested_sets: 5, suggested_reps: '12 reps', instructions: 'Do 11 reps, pause, rep 12 directly into hang power clean.' },
          { id: 'hero-dt-2', name: 'Hang Power Cleans @ 155 lbs / 70 kg (9 reps)', target_muscle: 'back', suggested_sets: 5, suggested_reps: '9 reps', instructions: 'Bar above knees, explode to shoulders.' },
          { id: 'hero-dt-3', name: 'Push Jerks @ 155 lbs / 70 kg (6 reps)', target_muscle: 'shoulders', suggested_sets: 5, suggested_reps: '6 reps', instructions: 'Dip, drive, drop under bar, lockout overhead.' },
        ],
      },
      {
        day_number: 3,
        day_title: 'Hero WOD 3: "CHAD 1000X" (1,000 Step-Ups with 45 lb Ruck)',
        focus: '1,000 Weighted Step-Ups on 20" Box',
        duration_minutes: 60,
        exercises: [
          { id: 'hero-chad-1', name: 'Weighted Box Step-Ups on 20" Box (45 lb Ruck / 35 lb)', target_muscle: 'quads', suggested_sets: 10, suggested_reps: '100 reps per block (1,000 total)', instructions: 'Stand tall with full hip lockout at top of box on each rep.' },
        ],
      },
      {
        day_number: 4,
        day_title: 'Hero WOD 4: "NATE" (20-Min AMRAP)',
        focus: '2 Muscle-Ups, 4 Handstand Push-Ups, 8 Heavy KB Swings',
        duration_minutes: 20,
        exercises: [
          { id: 'hero-nate-1', name: 'Ring / Bar Muscle-Ups', target_muscle: 'back', suggested_sets: 15, suggested_reps: '2 reps', instructions: 'Explosive pull over rings.' },
          { id: 'hero-nate-2', name: 'Handstand Push-Ups (HSPU)', target_muscle: 'shoulders', suggested_sets: 15, suggested_reps: '4 reps', instructions: 'Strict or kipping HSPU.' },
          { id: 'hero-nate-3', name: 'Heavy Kettlebell Swings @ 70 lbs / 32 kg', target_muscle: 'hamstrings', suggested_sets: 15, suggested_reps: '8 reps', instructions: 'Full hip snap overhead.' },
        ],
      },
      {
        day_number: 5,
        day_title: 'Hero WOD 5: "BADGER" (3 Rounds For Time)',
        focus: '30 Squat Cleans @ 95#, 30 Pull-Ups, 800m Run',
        duration_minutes: 35,
        exercises: [
          { id: 'hero-badger-1', name: 'Barbell Squat Cleans @ 95 lbs / 43 kg', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '30 reps', instructions: 'Catch in deep squat.' },
          { id: 'hero-badger-2', name: 'Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '30 reps', instructions: 'Chin over bar.' },
          { id: 'hero-badger-3', name: '800m Run', target_muscle: 'full_body_cardio', suggested_sets: 3, suggested_reps: '800 meters', instructions: 'Fast pace.' },
        ],
      },
      {
        day_number: 6,
        day_title: 'Hero WOD 6: "THE SEVEN" (7 Rounds For Time)',
        focus: '7 HSPU, 7 Thrusters, 7 K2E, 7 Deadlifts 245#, 7 Burpees, 7 KB Swings, 7 Pull-Ups',
        duration_minutes: 40,
        exercises: [
          { id: 'hero-s-1', name: '7 Handstand Push-Ups + 7 Thrusters @ 135#', target_muscle: 'shoulders', suggested_sets: 7, suggested_reps: '7 + 7 reps', instructions: 'Strict form.' },
          { id: 'hero-s-2', name: '7 Knees-to-Elbows + 7 Deadlifts @ 245#', target_muscle: 'back', suggested_sets: 7, suggested_reps: '7 + 7 reps', instructions: 'Heavy deadlift pull.' },
          { id: 'hero-s-3', name: '7 Burpees + 7 KB Swings @ 70# + 7 Pull-Ups', target_muscle: 'full_body_cardio', suggested_sets: 7, suggested_reps: '7 + 7 + 7 reps', instructions: 'Sprint circuit.' },
        ],
      },
      {
        day_number: 7,
        day_title: 'Hero WOD 7: "LUMBERJACK 20" (For Time)',
        focus: '20 Reps of 7 Movements + 400m Runs',
        duration_minutes: 35,
        exercises: [
          { id: 'hero-lj-1', name: '20 Deadlifts @ 275# + 400m Run', target_muscle: 'back', suggested_sets: 1, suggested_reps: '20 reps + 400m', instructions: 'Heavy deadlift.' },
          { id: 'hero-lj-2', name: '20 KB Swings @ 70# + 400m Run', target_muscle: 'hamstrings', suggested_sets: 1, suggested_reps: '20 reps + 400m', instructions: 'Explosive swings.' },
          { id: 'hero-lj-3', name: '20 Overhead Squats @ 115# + 400m Run', target_muscle: 'quads', suggested_sets: 1, suggested_reps: '20 reps + 400m', instructions: 'Deep squat.' },
          { id: 'hero-lj-4', name: '20 Burpees + 400m Run + 20 Pull-Ups + 400m Run', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '20 + 400m + 20 + 400m', instructions: 'Relentless pace.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 6. CROSSFIT® GAMES & OPEN CLASSICS (6 WORKSHEETS)
  // =========================================================================
  {
    id: 'crossfit_open_games',
    title: 'CrossFit® Games & Open Classics',
    subtitle: 'Fight Gone Bad, Open 14.4, 21.1, 22.1, 23.1 & 24.1',
    creator: 'CrossFit Games Director',
    category: 'crossfit_benchmarks',
    difficulty: 'advanced',
    equipment_needed: ['barbells', 'rower', 'dumbbells', 'pull_up_bar', 'rings', 'weight_plates'],
    duration_weeks: 6,
    days_per_week: 3,
    description:
      'The definitive tournament workouts that have tested athletes worldwide in the CrossFit Open and Games.',
    icon: '🏆',
    accent_color: '#f59e0b',
    schedule: [
      {
        day_number: 1,
        day_title: '1. "FIGHT GONE BAD" (3 Rounds for Total Points)',
        focus: '1 Min Wall Balls, 1 Min SDHP, 1 Min Box Jumps, 1 Min Push Press, 1 Min Row',
        duration_minutes: 20,
        exercises: [
          { id: 'cf-fgb-1', name: 'Wall Ball Shots @ 20 lbs (1 min max reps)', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '1 min max reps', instructions: '10ft target.' },
          { id: 'cf-fgb-2', name: 'Sumo Deadlift High Pull @ 75 lbs (1 min max reps)', target_muscle: 'back', suggested_sets: 3, suggested_reps: '1 min max reps', instructions: 'Wide stance, elbows high.' },
          { id: 'cf-fgb-3', name: 'Box Jumps on 20" Box (1 min max reps)', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '1 min max reps', instructions: 'Fast rebounding.' },
          { id: 'cf-fgb-4', name: 'Push Press @ 75 lbs (1 min max reps)', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '1 min max reps', instructions: 'Dip, drive overhead.' },
          { id: 'cf-fgb-5', name: 'Concept2 Row for Calories (1 min max cals)', target_muscle: 'full_body_cardio', suggested_sets: 3, suggested_reps: '1 min max cals', instructions: 'Sprint row (1 min rest follows).' },
        ],
      },
      {
        day_number: 2,
        day_title: '2. "OPEN 14.4 / 17.4 / 20.4" (14-Min AMRAP Chipper)',
        focus: '60 Cal Row, 50 Toes-to-Bar, 40 Wall Balls, 30 Cleans 135#, 20 Muscle-Ups',
        duration_minutes: 14,
        exercises: [
          { id: 'cf-144-1', name: '60 Calorie Row', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '60 Calories', instructions: 'Fast aerobic pacing.' },
          { id: 'cf-144-2', name: '50 Toes-to-Bar', target_muscle: 'core', suggested_sets: 1, suggested_reps: '50 reps', instructions: 'Toes touch bar simultaneously.' },
          { id: 'cf-144-3', name: '40 Wall Ball Shots @ 20 lbs', target_muscle: 'quads', suggested_sets: 1, suggested_reps: '40 reps', instructions: '10ft line.' },
          { id: 'cf-144-4', name: '30 Barbell Cleans @ 135 lbs / 61 kg', target_muscle: 'back', suggested_sets: 1, suggested_reps: '30 reps', instructions: 'Power or squat cleans.' },
          { id: 'cf-144-5', name: '20 Ring Muscle-Ups', target_muscle: 'back', suggested_sets: 1, suggested_reps: '20 reps', instructions: 'Gymnastic high skill.' },
        ],
      },
      {
        day_number: 3,
        day_title: '3. "OPEN 21.1" (15-Min Time Cap Ladder)',
        focus: 'Wall Walks & Double-Unders Ladder: 1-3-6-9-15-21',
        duration_minutes: 15,
        exercises: [
          { id: 'cf-211-1', name: 'Wall Walks (1, 3, 6, 9, 15, 21)', target_muscle: 'shoulders', suggested_sets: 6, suggested_reps: '1, 3, 6, 9, 15, 21 reps', instructions: 'Hands walk to within 10 inches of wall, nose touches wall.' },
          { id: 'cf-211-2', name: 'Double-Unders (10, 30, 60, 90, 150, 210)', target_muscle: 'calves', suggested_sets: 6, suggested_reps: '10, 30, 60, 90, 150, 210 reps', instructions: 'Clean uninterrupted double unders.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 7. STRENGTH & BARBELL PROGRESSION (COMPLETE SHEETS)
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
      'The classic 3-day full-body strength program. 5 sets of 5 reps adding 5 lbs every session for exponential compound strength gains.',
    icon: '🏋️‍♂️',
    accent_color: '#10b981',
    schedule: [
      {
        day_number: 1,
        day_title: 'Workout A (Squat, Bench, Row)',
        focus: 'Compound Strength Foundation A',
        duration_minutes: 50,
        exercises: [
          { id: 'sl-sq-1', name: 'Barbell Back Squat', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+5 lbs', instructions: 'Squat below parallel depth.' },
          { id: 'sl-bp-1', name: 'Barbell Flat Bench Press', target_muscle: 'chest', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+5 lbs', instructions: 'Retract shoulder blades, touch chest.' },
          { id: 'sl-br-1', name: 'Barbell Pendlay Row', target_muscle: 'back', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+5 lbs', instructions: 'Torso parallel to floor, pull off ground.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Workout B (Squat, Overhead Press, Deadlift)',
        focus: 'Compound Strength Foundation B',
        duration_minutes: 50,
        exercises: [
          { id: 'sl-sq-2', name: 'Barbell Back Squat', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+5 lbs', instructions: 'Deep squat with 360° core brace.' },
          { id: 'sl-ohp-1', name: 'Standing Barbell Overhead Press', target_muscle: 'shoulders', suggested_sets: 5, suggested_reps: '5 reps', suggested_weight_guide: '+2.5 to 5 lbs', instructions: 'Strict vertical press.' },
          { id: 'sl-dl-1', name: 'Conventional Barbell Deadlift', target_muscle: 'back', suggested_sets: 1, suggested_reps: '5 reps (Heavy 1x5)', suggested_weight_guide: '+10 lbs', instructions: 'Push floor away, lock hips.' },
        ],
      },
    ],
  },
  {
    id: 'starting_strength_rippetoe',
    title: 'Starting Strength (Novice 3×5)',
    subtitle: 'The Classic Novice Barbell Progression Method',
    creator: 'Mark Rippetoe',
    category: 'strength_powerlifting',
    difficulty: 'beginner',
    equipment_needed: ['barbells', 'weight_plates', 'power_rack', 'flat_bench'],
    duration_weeks: 12,
    days_per_week: 3,
    description:
      'The foundational 3x5 barbell system with low-bar squats, presses, bench press, deadlifts, and power cleans.',
    icon: '🔩',
    accent_color: '#059669',
    schedule: [
      {
        day_number: 1,
        day_title: 'Day A: Squat, Press, Deadlift (3x5)',
        focus: 'Posterior Chain & Linear Base',
        duration_minutes: 55,
        exercises: [
          { id: 'ss-sq-1', name: 'Low-Bar Barbell Back Squat', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '5 reps', instructions: 'Low-bar position, hip drive.' },
          { id: 'ss-ohp-1', name: 'Standing Barbell Overhead Press', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '5 reps', instructions: 'Narrow grip, strict lockout.' },
          { id: 'ss-dl-1', name: 'Conventional Deadlift (1x5 Heavy)', target_muscle: 'back', suggested_sets: 1, suggested_reps: '5 reps', instructions: 'Heavy single working set.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Day B: Squat, Bench Press, Power Clean',
        focus: 'Explosive Power & Upper Strength',
        duration_minutes: 55,
        exercises: [
          { id: 'ss-sq-2', name: 'Low-Bar Barbell Back Squat', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '5 reps', instructions: 'Consistent depth.' },
          { id: 'ss-bp-1', name: 'Barbell Flat Bench Press', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '5 reps', instructions: 'Tuck elbows 75°.' },
          { id: 'ss-pc-1', name: 'Barbell Power Clean from Floor', target_muscle: 'full_body_cardio', suggested_sets: 5, suggested_reps: '3 reps (5x3)', instructions: 'Explosive triple extension.' },
        ],
      },
    ],
  },
  {
    id: 'wendler_531_bbb',
    title: 'Wendler 5/3/1 (Boring But Big)',
    subtitle: '4-Week Submaximal Wave Periodization & Hypertrophy',
    creator: 'Jim Wendler',
    category: 'strength_powerlifting',
    difficulty: 'intermediate',
    equipment_needed: ['barbells', 'weight_plates', 'power_rack', 'flat_bench'],
    duration_weeks: 4,
    days_per_week: 4,
    description:
      'Wave periodization with main 5/3/1+ AMRAP work sets followed by 5 sets of 10 reps @ 50-60% Training Max.',
    icon: '📊',
    accent_color: '#3b82f6',
    schedule: [
      {
        day_number: 1,
        day_title: 'Squat Day (5/3/1 + 5x10 BBB)',
        focus: 'Lower Body Strength & Quad Volume',
        duration_minutes: 60,
        exercises: [
          { id: 'w531-sq-1', name: 'Barbell Back Squat (5/3/1 Work Sets)', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '5, 3, 1+ AMRAP', instructions: 'Hit target percentages, rep out last set.' },
          { id: 'w531-sq-2', name: 'Barbell Back Squat BBB (5x10 @ 50-60% TM)', target_muscle: 'quads', suggested_sets: 5, suggested_reps: '10 reps', instructions: 'Relentless hypertrophy volume.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Bench Press Day (5/3/1 + 5x10 BBB)',
        focus: 'Pectoral Power & Volume Density',
        duration_minutes: 60,
        exercises: [
          { id: 'w531-bp-1', name: 'Barbell Flat Bench Press (5/3/1 Work Sets)', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '5, 3, 1+ AMRAP', instructions: 'Final set rep out.' },
          { id: 'w531-bp-2', name: 'Barbell Flat Bench Press BBB (5x10 @ 50-60% TM)', target_muscle: 'chest', suggested_sets: 5, suggested_reps: '10 reps', instructions: 'Controlled tempo.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 8. BODYBUILDING & HYPERTROPHY SPLITS (PPL, ARNOLD, GVT)
  // =========================================================================
  {
    id: 'push_pull_legs_6day',
    title: 'Push / Pull / Legs (PPL 6-Day Master Split)',
    subtitle: 'The Double-Frequency Muscle Building Standard',
    creator: 'Modern Bodybuilding Science',
    category: 'bodybuilding_splits',
    difficulty: 'intermediate',
    equipment_needed: ['barbells', 'dumbbells', 'cable_machine', 'adjustable_bench', 'pull_up_bar'],
    duration_weeks: 12,
    days_per_week: 6,
    description:
      'Complete 6-day split hitting every muscle twice every 7 days: Push A, Pull A, Legs A, Push B, Pull B, Legs B.',
    icon: '🔥',
    accent_color: '#f97316',
    schedule: [
      {
        day_number: 1,
        day_title: 'Push A (Heavy Strength)',
        focus: 'Heavy Bench, OHP, Incline Dumbbell Press',
        duration_minutes: 65,
        exercises: [
          { id: 'ppl-pa-1', name: 'Barbell Flat Bench Press', target_muscle: 'chest', suggested_sets: 4, suggested_reps: '6–8 reps', instructions: 'Heavy progressive overload.' },
          { id: 'ppl-pa-2', name: 'Standing Barbell Overhead Press', target_muscle: 'shoulders', suggested_sets: 3, suggested_reps: '8–10 reps', instructions: 'Strict vertical press.' },
          { id: 'ppl-pa-3', name: 'Incline Dumbbell Press', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Upper chest flare.' },
          { id: 'ppl-pa-4', name: 'Rope Tricep Pushdowns', target_muscle: 'triceps', suggested_sets: 4, suggested_reps: '12–15 reps', instructions: 'Peak contraction.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Pull A (Heavy Strength)',
        focus: 'Heavy Deadlift, Pull-Ups & Barbell Rows',
        duration_minutes: 65,
        exercises: [
          { id: 'ppl-pla-1', name: 'Conventional Deadlift', target_muscle: 'back', suggested_sets: 3, suggested_reps: '5 reps', instructions: 'Heavy pull.' },
          { id: 'ppl-pla-2', name: 'Overhand Wide-Grip Pull-Ups', target_muscle: 'back', suggested_sets: 4, suggested_reps: '8–10 reps', instructions: 'Deadhang to chest over bar.' },
          { id: 'ppl-pla-3', name: 'Bent-Over Barbell Rows', target_muscle: 'back', suggested_sets: 3, suggested_reps: '8–10 reps', instructions: 'Explode into sternum.' },
          { id: 'ppl-pla-4', name: 'Standing Barbell Curls', target_muscle: 'biceps', suggested_sets: 4, suggested_reps: '8–10 reps', instructions: 'Strict form.' },
        ],
      },
      {
        day_number: 3,
        day_title: 'Legs A (Squat Dominant)',
        focus: 'Heavy Squats, Romanian Deadlifts, Calves',
        duration_minutes: 65,
        exercises: [
          { id: 'ppl-la-1', name: 'Barbell Back Squat', target_muscle: 'quads', suggested_sets: 4, suggested_reps: '6–8 reps', instructions: 'Deep squat.' },
          { id: 'ppl-la-2', name: 'Romanian Deadlifts (Barbell RDL)', target_muscle: 'hamstrings', suggested_sets: 3, suggested_reps: '8–10 reps', instructions: 'Hips back.' },
          { id: 'ppl-la-3', name: '45-Degree Leg Press', target_muscle: 'quads', suggested_sets: 3, suggested_reps: '10–12 reps', instructions: 'Controlled descent.' },
        ],
      },
    ],
  },
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
      'The legendary 6-exercise full-body hypertrophy routine Arnold used at Munich Gym to build his classic physique.',
    icon: '👑',
    accent_color: '#eab308',
    schedule: [
      {
        day_number: 1,
        day_title: 'The Golden Six Session',
        focus: 'Full-Body Compound Proportions',
        duration_minutes: 65,
        exercises: [
          { id: 'arnold-1', name: 'Barbell Back Squat', target_muscle: 'quads', suggested_sets: 4, suggested_reps: '10 reps', instructions: 'Thighs below parallel.' },
          { id: 'arnold-2', name: 'Wide-Grip Barbell Flat Bench Press', target_muscle: 'chest', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Wide grip, touch lower sternum.' },
          { id: 'arnold-3', name: 'Wide-Grip Pull-Ups', target_muscle: 'back', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Deadhang to chest.' },
          { id: 'arnold-4', name: 'Behind-the-Neck Overhead Press', target_muscle: 'shoulders', suggested_sets: 4, suggested_reps: '10 reps', instructions: 'Smooth vertical press.' },
          { id: 'arnold-5', name: 'Standing Barbell Bicep Curls', target_muscle: 'biceps', suggested_sets: 3, suggested_reps: '10 reps', instructions: 'Strict form, 2s negative.' },
          { id: 'arnold-6', name: 'Bent-Knee Situps / Crunches', target_muscle: 'core', suggested_sets: 4, suggested_reps: '25 reps', instructions: 'Roll spine up.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 9. MIND-BODY, TAI CHI, QIGONG, YOGA & MOBILITY
  // =========================================================================
  {
    id: 'tai_chi_yang_24',
    title: 'Tai Chi 24-Form Yang Style & Qigong',
    subtitle: 'Mind-Body Flow, Balance & Dan Tian Breathing',
    creator: 'Traditional Yang Family Style',
    category: 'mind_body_longevity',
    difficulty: 'all_levels',
    equipment_needed: ['bodyweight'],
    duration_weeks: 8,
    days_per_week: 5,
    description:
      'The internationally standardized 24-Form Yang Style Tai Chi sequence. Emphasizes slow, continuous, fluid circular movements and balance transfer.',
    icon: '☯️',
    accent_color: '#14b8a6',
    schedule: [
      {
        day_number: 1,
        day_title: 'Forms 1–8: Commencing to Single Whip',
        focus: 'Grounding, Rooting & Postural Alignment',
        duration_minutes: 35,
        exercises: [
          { id: 'tc-1', name: 'Form 1: Commencing Form (Qishi)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '5 slow cycles', instructions: 'Raise wrists, sink hips.' },
          { id: 'tc-2', name: 'Form 2: Parting the Wild Horse’s Mane (Left & Right)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '6 paces', instructions: 'Expand arms in bow stance.' },
          { id: 'tc-3', name: 'Form 3: White Crane Spreads Its Wings', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 transitions', instructions: 'Open arms in empty stance.' },
          { id: 'tc-4', name: 'Form 4: Brush Knee and Twist Step', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '6 paces', instructions: 'Circle hand clearing knee, push palm.' },
        ],
      },
      {
        day_number: 2,
        day_title: 'Forms 9–16: Wave Hands to High Pat on Horse',
        focus: 'Circular Flow & Weight Shifting',
        duration_minutes: 40,
        exercises: [
          { id: 'tc-5', name: 'Form 9: Wave Hands Like Clouds (Yunshou)', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '3 paces L & R', instructions: 'Continuous figure-8 cloud palms.' },
          { id: 'tc-6', name: 'Form 10: Single Whip & High Pat on Horse', target_muscle: 'mobility', suggested_sets: 3, suggested_reps: '4 transitions', instructions: 'Extend hook hand, palm strike.' },
        ],
      },
    ],
  },
  {
    id: 'baduanjin_qigong',
    title: 'Baduanjin Qigong (Eight Pieces of Brocade)',
    subtitle: '800-Year-Old Ancient Health & Longevity Flow',
    creator: 'Traditional Shaolin & Chinese Medicine',
    category: 'mind_body_longevity',
    difficulty: 'all_levels',
    equipment_needed: ['bodyweight'],
    duration_weeks: 8,
    days_per_week: 7,
    description:
      'The 8 classic silk brocade movements designed to stimulate the 12 primary meridians and massage internal organs.',
    icon: '🧘',
    accent_color: '#10b981',
    schedule: [
      {
        day_number: 1,
        day_title: 'The 8 Brocades Flow',
        focus: 'Meridian Stimulation & Dan Tian Breathing',
        duration_minutes: 25,
        exercises: [
          { id: 'bdj-1', name: '1. Holding Sky to Regulate Triple Burner', target_muscle: 'mobility', suggested_sets: 1, suggested_reps: '6 reps', instructions: 'Press palms up.' },
          { id: 'bdj-2', name: '2. Drawing Bow to Shoot the Hawk', target_muscle: 'mobility', suggested_sets: 1, suggested_reps: '6 pairs', instructions: 'Horse stance draw.' },
          { id: 'bdj-3', name: '3. Raising Single Arm for Spleen & Stomach', target_muscle: 'mobility', suggested_sets: 1, suggested_reps: '6 pairs', instructions: 'Diagonal stretch.' },
          { id: 'bdj-4', name: '4. Looking Backwards for 5 Fatigues', target_muscle: 'mobility', suggested_sets: 1, suggested_reps: '6 pairs', instructions: 'Turn neck smoothly.' },
        ],
      },
    ],
  },

  // =========================================================================
  // 10. HYBRID & ENDURANCE (HYROX, PETE PLAN ROWING)
  // =========================================================================
  {
    id: 'hyrox_race_simulation',
    title: 'HYROX® Race Simulation Training',
    subtitle: '8× 1km Running Intervals Interspersed with 8 Functional Stations',
    creator: 'HYROX Global Fitness Racing',
    category: 'hybrid_endurance',
    difficulty: 'advanced',
    equipment_needed: ['rower', 'skierg', 'prowler_sled', 'dumbbells', 'sandbag_training'],
    duration_weeks: 10,
    days_per_week: 4,
    description:
      'Official simulation of the HYROX World Championships: 1km running intervals paired with SkiErg, Sled Push (125kg), Sled Pull (78kg), Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Lunges, and Wall Balls.',
    icon: '🏅',
    accent_color: '#eab308',
    schedule: [
      {
        day_number: 1,
        day_title: 'HYROX Full Station Simulation',
        focus: '1km Run + SkiErg + Sled Push + Burpee Broad Jumps',
        duration_minutes: 55,
        exercises: [
          { id: 'hy-1', name: '1,000m Interval Run @ Race Pace', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '1,000 meters', instructions: 'Target: 4:15/km.' },
          { id: 'hy-2', name: '1,000m Concept2 SkiErg', target_muscle: 'back', suggested_sets: 1, suggested_reps: '1,000 meters', instructions: 'Hinge hips, pull with lats.' },
          { id: 'hy-3', name: '50m Heavy Sled Push (125 kg / 275 lbs)', target_muscle: 'quads', suggested_sets: 1, suggested_reps: '50 meters', instructions: 'Drive low through toes.' },
          { id: 'hy-4', name: '80m Burpee Broad Jumps', target_muscle: 'full_body_cardio', suggested_sets: 1, suggested_reps: '80 meters', instructions: 'Chest to deck, jump forward.' },
        ],
      },
    ],
  },
  {
    id: 'concept2_pete_plan',
    title: 'Concept2® Pete Plan for Indoor Rowing',
    subtitle: 'Interval Sprints & Steady Endurance for 2,000m & 5,000m PBs',
    creator: 'Pete Marston',
    category: 'hybrid_endurance',
    difficulty: 'intermediate',
    equipment_needed: ['rower'],
    duration_weeks: 12,
    days_per_week: 5,
    description:
      'The indoor rowing training plan balancing 8x500m sprints, pyramid rows, and 8k-10k steady state endurance.',
    icon: '🚣',
    accent_color: '#0284c7',
    schedule: [
      {
        day_number: 1,
        day_title: 'Interval Sprint: 8 × 500m (3:30 Rest)',
        focus: 'Anaerobic Threshold & Stroke Power',
        duration_minutes: 45,
        exercises: [
          { id: 'row-1', name: 'Concept2 Rower: 8 × 500m', target_muscle: 'full_body_cardio', suggested_sets: 8, suggested_reps: '500m per interval', instructions: 'Rate 28-32 SPM, 2k split pace.' },
        ],
      },
    ],
  },
];
