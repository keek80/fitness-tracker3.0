// ========== TRAINING PROGRAM DATA (Default Template) ==========
// 5-Day Push / Pull / Legs Split
const DEFAULT_TRAINING_PROGRAM = {
    days: [
        {
            id: 'push_a',
            name: 'Push A',
            dayOfWeek: 'Monday',
            color: '#e94560',
            exercises: [
                { name: 'Barbell Bench Press', sets: 3, repsTarget: '8-12', rest: '120s', notes: 'Control the negative (3 sec down)' },
                { name: 'Incline Dumbbell Press', sets: 3, repsTarget: '10-12', rest: '90s', notes: 'Focus on upper chest contraction' },
                { name: 'Seated Machine Shoulder Press', sets: 3, repsTarget: '10-15', rest: '90s', notes: 'Keep shoulder blades down and back' },
                { name: 'Dumbbell Lateral Raises', sets: 3, repsTarget: '12-15', rest: '60s', notes: 'Light weight, strict form for side delts' },
                { name: 'Cable Tricep Pushdowns (Rope)', sets: 3, repsTarget: '12-15', rest: '60s', notes: 'Keep elbows pinned, squeeze at bottom' },
                { name: 'Overhead Cable Tricep Extension', sets: 3, repsTarget: '10-12', rest: '60s', notes: 'Full stretch at top' },
                { name: 'Seated Abdominal Crunch Machine', sets: 3, repsTarget: '12-15', rest: '45s', notes: '🎯 CORE FINISHER — Focus on spinal flexion, control the eccentric' }
            ]
        },
        {
            id: 'pull_a',
            name: 'Pull A',
            dayOfWeek: 'Tuesday',
            color: '#0095ff',
            exercises: [
                { name: 'Lat Pulldown (Wide Grip)', sets: 3, repsTarget: '8-12', rest: '120s', notes: 'Pull to upper chest, squeeze lats at bottom' },
                { name: 'Seated Cable Rows (Close Grip)', sets: 3, repsTarget: '10-12', rest: '90s', notes: 'Pull to lower abs, squeeze shoulder blades' },
                { name: 'Machine Pec Deck Reverse Fly', sets: 3, repsTarget: '12-15', rest: '60s', notes: 'Focus on rear delts, slow and controlled' },
                { name: 'Barbell Bicep Curls', sets: 3, repsTarget: '10-12', rest: '60s', notes: 'Keep elbows tucked, avoid swinging' },
                { name: 'Machine Preacher Curls', sets: 3, repsTarget: '12-15', rest: '60s', notes: 'Isolate biceps, focus on peak contraction' },
                { name: 'Cable Wood Chop High-to-Low (Both Sides)', sets: 3, repsTarget: '10-12/side', rest: '60s', notes: '🎯 CORE FINISHER — Weak side first. Rotate torso, pivot hips, control the return. Complete all reps L then R before resting' }
            ]
        },
        {
            id: 'legs',
            name: 'Legs',
            dayOfWeek: 'Wednesday',
            color: '#00d68f',
            exercises: [
                { name: 'Leg Press Machine', sets: 4, repsTarget: '8-12', rest: '120s', notes: "Feet shoulder-width, don't lock knees" },
                { name: 'Romanian Deadlift (DB/Barbell)', sets: 3, repsTarget: '10-12', rest: '90s', notes: 'Hinge at hips, slight knee bend, feel hamstring stretch' },
                { name: 'Leg Extension Machine', sets: 3, repsTarget: '12-15', rest: '90s', notes: 'Squeeze quads hard at the top' },
                { name: 'Leg Curl Machine (Seated/Lying)', sets: 3, repsTarget: '12-15', rest: '90s', notes: 'Slow and controlled negative' },
                { name: 'Standing Calf Raises Machine', sets: 3, repsTarget: '15-20', rest: '45s', notes: 'Full range of motion, pause 1 sec at top and bottom' },
                { name: 'Cable Pull-Through', sets: 3, repsTarget: '15-20', rest: '60s', notes: 'Stand facing away from low cable pulley, hinge at hips, drive hips forward and squeeze glutes. Keep a flat back throughout' },
                { name: 'Kneeling Cable Anti-Extension', sets: 3, repsTarget: '10-15', rest: '45s', notes: '🎯 CORE FINISHER — Resist arching lower back, maintain straight torso throughout' }
            ]
        },
        {
            id: 'push_b',
            name: 'Push B',
            dayOfWeek: 'Thursday',
            color: '#ffaa00',
            exercises: [
                { name: 'Dumbbell Bench Press', sets: 3, repsTarget: '10-12', rest: '120s', notes: 'Focus on stability and full stretch at bottom' },
                { name: 'Pec Deck Fly Machine', sets: 3, repsTarget: '12-15', rest: '60s', notes: 'Squeeze chest hard at peak contraction' },
                { name: 'Seated Overhead Dumbbell Press', sets: 3, repsTarget: '8-12', rest: '90s', notes: 'Control descent, avoid locking out elbows' },
                { name: 'Cable Lateral Raises', sets: 3, repsTarget: '12-15', rest: '60s', notes: 'Constant cable tension for side delts' },
                { name: 'Close-Grip Bench Press (Smith Machine)', sets: 3, repsTarget: '8-12', rest: '90s', notes: 'Emphasize triceps, elbows close to body' },
                { name: 'Machine Dips', sets: 3, repsTarget: '10-15', rest: '60s', notes: 'Lean forward for chest, upright for triceps' },
                { name: 'Machine Oblique Crunch (Both Sides)', sets: 3, repsTarget: '12-15/side', rest: '45s', notes: '🎯 CORE FINISHER — Weak side first. Focus on side contraction. Complete all reps L then R before resting' }
            ]
        },
        {
            id: 'pull_b',
            name: 'Pull B',
            dayOfWeek: 'Friday',
            color: '#a855f7',
            exercises: [
                { name: 'Barbell Rows (Bent-Over)', sets: 3, repsTarget: '8-12', rest: '120s', notes: 'Maintain flat back, pull to lower chest' },
                { name: 'Assisted Pull-Up Machine', sets: 3, repsTarget: '8-12', rest: '90s', notes: 'Use assistance to hit target reps, full stretch at bottom' },
                { name: 'Straight Arm Pulldowns (Cable)', sets: 3, repsTarget: '12-15', rest: '60s', notes: 'Isolate lats, keep arms straight throughout' },
                { name: 'Dumbbell Hammer Curls', sets: 3, repsTarget: '10-12', rest: '60s', notes: 'Thumb up grip, targets brachialis and forearms' },
                { name: 'Reverse Grip Cable Curls', sets: 3, repsTarget: '12-15', rest: '60s', notes: 'Targets brachialis and forearm flexors' },
                { name: 'Cable Wood Chop Low-to-High (Both Sides)', sets: 3, repsTarget: '10-12/side', rest: '60s', notes: '🎯 CORE FINISHER — Variation: start low, pull diagonally upward. Weak side first. Complete all reps L then R before resting' }
            ]
        }
    ]
};

// Backward compatibility alias
const TRAINING_PROGRAM = DEFAULT_TRAINING_PROGRAM;

// ========== DYNAMIC TRAINING PROGRAM ==========
function getTrainingProgram() {
    try {
        const custom = localStorage.getItem('flt_custom_program');
        if (custom) {
            const parsed = JSON.parse(custom);
            if (parsed && parsed.days && parsed.days.length > 0) return parsed;
        }
    } catch (e) { console.warn('Error loading custom program:', e); }
    return DEFAULT_TRAINING_PROGRAM;
}

function saveTrainingProgram(program) {
    try {
        localStorage.setItem('flt_custom_program', JSON.stringify(program));
        if (typeof SupabaseSync !== 'undefined') SupabaseSync.customProgram(program);
    } catch (e) { console.error('Error saving custom program:', e); }
}

function resetTrainingProgram() {
    localStorage.removeItem('flt_custom_program');
    if (typeof SupabaseSync !== 'undefined') SupabaseSync.deleteCustomProgram();
}

function isCustomProgram() {
    return localStorage.getItem('flt_custom_program') !== null;
}

// ========== MEAL PLAN DATA ==========
const MEAL_PLAN = {
    dailyTargets: { calories: 2500, protein: 250, carbs: 150, fat: 75 },
    dailyActual: { calories: 2126, protein: 217, carbs: 155, fat: 74, fiber: 32, sugar: 30 },
    meals: [
        {
            id: 'meal1',
            name: 'Meal 1 — Protein Coffee Shake',
            emoji: '☕',
            time: 'Morning',
            calories: 230, protein: 29, carbs: 6, fat: 9.5,
            items: ['1 scoop Colossal Labs Whey', '8-12 oz brewed coffee', '1 tbsp natural peanut butter'],
            tip: 'Blend into cooled coffee or shake with ice for a "proffee."'
        },
        {
            id: 'meal2',
            name: 'Meal 2 — Turkey Breakfast Burrito',
            emoji: '🌯',
            time: 'Mid-Morning',
            calories: 506, protein: 46, carbs: 39, fat: 17.5,
            items: ['4 oz lean ground turkey (93/7)', '4 scrambled egg whites', '1 whole wheat tortilla (10")', '¼ diced avocado', '¼ cup diced tomatoes', '2 tbsp nonfat Greek yogurt', 'Salsa (2 tbsp)'],
            tip: 'Pre-roll and wrap in foil — refrigerate up to 3 days.'
        },
        {
            id: 'meal3',
            name: 'Meal 3 — Protein Coffee #2',
            emoji: '☕',
            time: 'Afternoon',
            calories: 135, protein: 25, carbs: 3, fat: 1.5,
            items: ['1 scoop Colossal Labs Whey', '8-12 oz brewed coffee'],
            tip: 'Consider decaf later in the day to protect sleep.'
        },
        {
            id: 'meal4',
            name: 'Meal 4 — Turkey Power Burrito',
            emoji: '🌯',
            time: 'Mid-Afternoon',
            calories: 560, protein: 43, carbs: 59, fat: 18.7,
            items: ['4 oz lean ground turkey', '1 whole wheat tortilla (10")', '½ cup corn kernels', '¼ avocado, sliced', '½ cup diced tomatoes', '1 cup salad greens', '100g nonfat Greek yogurt', 'Hot sauce / lime juice'],
            tip: 'Add ½ cup black beans for +8g protein and +7g fiber.'
        },
        {
            id: 'meal5',
            name: 'Meal 5 — Turkey & Avocado Wrap',
            emoji: '🥗',
            time: 'Dinner',
            calories: 395, protein: 41, carbs: 26, fat: 16.2,
            items: ['4 oz lean ground turkey', '1 low-carb tortilla (8")', '½ cup diced tomatoes', '1 cup salad greens', '½ avocado', '100g nonfat Greek yogurt', 'Seasonings'],
            tip: 'Swap turkey for salmon 2x/week for Omega-3s.'
        },
        {
            id: 'meal6',
            name: 'Meal 6 — Protein Brownie Mug Cake',
            emoji: '🍫',
            time: 'Dessert',
            calories: 300, protein: 33, carbs: 22, fat: 11,
            items: ['1 scoop chocolate protein powder', '1 tbsp cocoa powder', '½ banana, mashed', '1 tbsp almond butter', '1 egg white', 'Baking powder + vanilla'],
            tip: 'Microwave 60-90 seconds — tastes like a warm brownie!'
        }
    ]
};

// ========== CLIENT PROFILE ==========
const CLIENT_PROFILE = {
    height: "6'0\" (183 cm)",
    startWeight: 385,
    goalWeight: 250,
    totalToLose: 135,
    weeklyRateLoss: 1.5,
    timelineMonths: '18-24',
    bmr: 2800,
    tdee: 3360,
    deficit: 0.25
};

// ========== MILESTONES ==========
const MILESTONES = [
    { name: 'Start', weight: 385, month: 0 },
    { name: 'Phase 1 Start', weight: 355, month: 4 },
    { name: 'Phase 2 Start', weight: 320, month: 8 },
    { name: 'Phase 3 Start', weight: 285, month: 13 },
    { name: 'Goal!', weight: 250, month: 20 }
];

// ========== PHASE PROGRESSION ==========
const PHASES = [
    { phase: 1, range: '385-345 lbs', focus: 'Machines & dumbbells, learn movements, build base' },
    { phase: 2, range: '345-310 lbs', focus: 'Introduce barbell movements, increase intensity' },
    { phase: 3, range: '310-275 lbs', focus: 'Push/Pull/Legs split option, add compound lifts' },
    { phase: 4, range: '275-250 lbs', focus: 'Advanced programming, periodization' }
];

// ========== COLOR PALETTE FOR CUSTOM DAYS ==========
const DAY_COLORS = [
    '#0095ff', '#00d68f', '#ffaa00', '#a855f7',
    '#e94560', '#06b6d4', '#f97316', '#ec4899',
    '#14b8a6', '#8b5cf6', '#ef4444', '#22c55e'
];

// ========== EXERCISE DATABASE ==========
const EXERCISE_DATABASE = [
    // ── CHEST ──
    { name: 'Barbell Bench Press',            category: 'Chest',       equipment: 'Barbell',    notes: 'Control the negative (3 sec down), retract shoulder blades' },
    { name: 'Dumbbell Bench Press',           category: 'Chest',       equipment: 'Dumbbell',   notes: 'Full stretch at bottom, squeeze chest at top' },
    { name: 'Incline Barbell Press',          category: 'Chest',       equipment: 'Barbell',    notes: '30-45° incline, focus on upper chest' },
    { name: 'Incline Dumbbell Press',         category: 'Chest',       equipment: 'Dumbbell',   notes: '30° incline angle, focus on upper chest contraction' },
    { name: 'Decline Barbell Press',          category: 'Chest',       equipment: 'Barbell',    notes: 'Targets lower chest, keep feet locked in' },
    { name: 'Chest Press Machine',            category: 'Chest',       equipment: 'Machine',    notes: 'Control the negative (3 sec down)' },
    { name: 'Incline Chest Press Machine',    category: 'Chest',       equipment: 'Machine',    notes: 'Focus on upper chest, pause at contraction' },
    { name: 'Pec Deck Fly Machine',           category: 'Chest',       equipment: 'Machine',    notes: 'Squeeze chest hard at peak contraction, slow return' },
    { name: 'Cable Chest Fly (High-to-Low)',  category: 'Chest',       equipment: 'Cable',      notes: 'Arms slightly bent, focus on chest stretch and contraction' },
    { name: 'Cable Chest Fly (Low-to-High)',  category: 'Chest',       equipment: 'Cable',      notes: 'Targets upper chest, squeeze at top' },
    { name: 'Dumbbell Chest Fly',             category: 'Chest',       equipment: 'Dumbbell',   notes: 'Slight bend in elbows, feel the stretch, squeeze at top' },
    { name: 'Push-Ups',                       category: 'Chest',       equipment: 'Bodyweight', notes: 'Keep core tight, full range of motion' },
    { name: 'Smith Machine Bench Press',      category: 'Chest',       equipment: 'Machine',    notes: 'Controlled movement, good for beginners' },
    { name: 'Machine Dips',                   category: 'Chest',       equipment: 'Machine',    notes: 'Lean forward for chest emphasis, upright for triceps' },
    { name: 'Svend Press',                    category: 'Chest',       equipment: 'Bodyweight', notes: 'Press hands together at chest level, squeeze hard' },

    // === NEW / EXPANDED CHEST EXERCISES ===
    { name: 'Decline Dumbbell Press',         category: 'Chest',       equipment: 'Dumbbell',   notes: 'Targets lower chest, full stretch at bottom' },
    { name: 'Incline Smith Machine Press',    category: 'Chest',       equipment: 'Machine',    notes: 'Upper chest focus with guided path' },
    { name: 'Cable Crossover (High to Low)',  category: 'Chest',       equipment: 'Cable',      notes: 'Constant tension, cross hands at bottom' },
    { name: 'Cable Crossover (Low to High)',  category: 'Chest',       equipment: 'Cable',      notes: 'Upper chest emphasis' },
    { name: 'Dumbbell Pullover',              category: 'Chest',       equipment: 'Dumbbell',   notes: 'Lying on bench, stretch lats/chest at bottom' },
    { name: 'Floor Press (Barbell or DB)',    category: 'Chest',       equipment: 'Dumbbell',   notes: 'Limited range, heavy tricep + chest work' },
    { name: 'Guillotine Press',               category: 'Chest',       equipment: 'Barbell',    notes: 'Wide grip to neck level — advanced upper chest' },
    { name: 'Hex Press (Svend Variation)',    category: 'Chest',       equipment: 'Dumbbell',   notes: 'Dumbbells pressed together, constant inner chest squeeze' },
    { name: 'Incline Push-Ups',               category: 'Chest',       equipment: 'Bodyweight', notes: 'Hands elevated — easier variation' },
    { name: 'Decline Push-Ups',               category: 'Chest',       equipment: 'Bodyweight', notes: 'Feet elevated — harder variation' },
    { name: 'Chest Dips (Weighted)',          category: 'Chest',       equipment: 'Bodyweight', notes: 'Lean forward, full range' },
    { name: 'Pec Deck Fly (Single Arm)',      category: 'Chest',       equipment: 'Machine',    notes: 'Unilateral for imbalances' },
    { name: 'Resistance Band Chest Fly',      category: 'Chest',       equipment: 'Band',       notes: 'Home-friendly constant tension' },
    { name: 'Landmine Chest Press',           category: 'Chest',       equipment: 'Barbell',    notes: 'Unilateral or bilateral pressing' },
    { name: 'Deficit Push-Ups',               category: 'Chest',       equipment: 'Bodyweight', notes: 'Hands on elevated surfaces for deeper stretch' },

    // ── BACK ──
    { name: 'Barbell Rows (Bent-Over)',       category: 'Back',        equipment: 'Barbell',    notes: 'Maintain flat back, pull to lower chest' },
    { name: 'Lat Pulldown (Wide Grip)',       category: 'Back',        equipment: 'Cable',      notes: 'Pull to upper chest, squeeze lats at bottom' },
    { name: 'Lat Pulldown (Close Grip)',      category: 'Back',        equipment: 'Cable',      notes: 'Full stretch at top, squeeze at bottom' },
    { name: 'Lat Pulldown (Underhand)',       category: 'Back',        equipment: 'Cable',      notes: 'Supinated grip targets lower lats more' },
    { name: 'Seated Cable Rows (Close Grip)', category: 'Back',        equipment: 'Cable',      notes: 'Pull to lower abs, squeeze shoulder blades' },
    { name: 'Seated Cable Rows (Wide Grip)',  category: 'Back',        equipment: 'Cable',      notes: 'Pull to upper abs, elbows flared out' },
    { name: 'Straight Arm Pulldowns (Cable)', category: 'Back',        equipment: 'Cable',      notes: 'Isolate lats, keep arms straight throughout' },
    { name: 'Assisted Pull-Up Machine',       category: 'Back',        equipment: 'Machine',    notes: 'Use assistance to hit target reps, full stretch at bottom' },
    { name: 'Chest-Supported Row Machine',    category: 'Back',        equipment: 'Machine',    notes: 'Chest on pad removes lower back stress' },
    { name: 'T-Bar Row',                      category: 'Back',        equipment: 'Barbell',    notes: 'Keep chest on pad or brace core, squeeze at contraction' },
    { name: 'Single Arm Dumbbell Row',        category: 'Back',        equipment: 'Dumbbell',   notes: 'Pull elbow to hip, full range of motion' },
    { name: 'Back Extension Machine',         category: 'Back',        equipment: 'Machine',    notes: 'Focus on lower back contraction at top' },
    { name: 'Hyperextensions (45°)',          category: 'Back',        equipment: 'Bodyweight', notes: 'Hinge at hips, squeeze glutes at top' },
    { name: 'Plate Loaded Row',               category: 'Back',        equipment: 'Machine',    notes: 'Chest-supported or T-bar style plate loaded row' },
    { name: 'Plate Loaded Pulldown Machine',  category: 'Back',        equipment: 'Machine',    notes: 'Neutral or wide grip — full stretch at top' },
    { name: 'Pull-Ups (Wide Grip)',           category: 'Back',        equipment: 'Bodyweight', notes: 'Full range, pull chest to bar if possible; use assistance if needed' },
    { name: 'Chin-Ups (Supinated Grip)',      category: 'Back',        equipment: 'Bodyweight', notes: 'Underhand grip, emphasizes lower lats and biceps' },
    { name: 'Neutral Grip Pull-Ups',          category: 'Back',        equipment: 'Machine',    notes: 'Palms facing each other — joint friendly' },
    { name: 'Bent-Over Dumbbell Rows',        category: 'Back',        equipment: 'Dumbbell',   notes: 'Both arms or single-arm supported on bench' },
    { name: 'Pendlay Rows',                   category: 'Back',        equipment: 'Barbell',    notes: 'Reset bar on floor each rep, explosive pull' },
    { name: 'Seal Rows',                      category: 'Back',        equipment: 'Dumbbell',   notes: 'Lying face down on elevated bench — strict form' },
    { name: 'Meadows Rows',                   category: 'Back',        equipment: 'Barbell',    notes: 'Single-arm landmine-style row' },
    { name: 'Cable Face Pulls',               category: 'Back',        equipment: 'Cable',      notes: 'Rear delts + upper back, high pulley' },
    { name: 'Inverted Rows',                  category: 'Back',        equipment: 'Bodyweight', notes: 'Under a bar or rings, pull chest up' },
    { name: 'Single-Arm Cable Rows',          category: 'Back',        equipment: 'Cable',      notes: 'Seated or standing, focus on one side' },
    { name: 'Dumbbell Pullovers',             category: 'Back',        equipment: 'Dumbbell',   notes: 'Lying on bench, stretch lats at bottom' },
    { name: 'Rack Pulls',                     category: 'Back',        equipment: 'Barbell',    notes: 'Partial deadlift from knee height — heavy upper back focus' },
    { name: 'Deadlift (Conventional)',        category: 'Back',        equipment: 'Barbell',    notes: 'Full body, maintain neutral spine' },
    { name: 'Romanian Deadlift',              category: 'Back',        equipment: 'Barbell',    notes: 'Hamstring and lower back emphasis' },
    { name: 'Good Mornings',                  category: 'Back',        equipment: 'Barbell',    notes: 'Hinge at hips with light bar on back' },
    { name: 'Shrugs (Dumbbell or Barbell)',   category: 'Back',        equipment: 'Dumbbell',   notes: 'Traps and upper back, hold squeeze at top' },
    { name: 'Band Pull-Aparts',               category: 'Back',        equipment: 'Band',       notes: 'Great for upper back posture and warm-up' },
    { name: 'Y-T-I Raises (Prone)',           category: 'Back',        equipment: 'Bodyweight', notes: 'Lying face down, form letters Y-T-I for rear delts/upper back' },
    { name: 'Cable Seated Rows (Neutral Grip)', category: 'Back',      equipment: 'Cable',      notes: 'V-bar or rope grip' },
    { name: 'Lat-Focused Pulldowns (Narrow Grip)', category: 'Back',  equipment: 'Cable',      notes: 'Emphasize lat stretch and contraction' },
    { name: 'Machine Low Row',                category: 'Back',        equipment: 'Machine',    notes: 'Chest supported variation' },
    { name: 'Farmer\'s Carry',                category: 'Back',        equipment: 'Dumbbell',   notes: 'Heavy walks for grip and upper back endurance' },
    { name: 'Trap Bar Deadlift',              category: 'Back',        equipment: 'Trap Bar',   notes: 'More quad-friendly deadlift variation' },

    // ── SHOULDERS ──
    { name: 'Seated Machine Shoulder Press',  category: 'Shoulders',   equipment: 'Machine',    notes: 'Keep shoulder blades down and back' },
    { name: 'Seated Overhead Dumbbell Press', category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Control descent, avoid locking out elbows' },
    { name: 'Barbell Overhead Press',         category: 'Shoulders',   equipment: 'Barbell',    notes: 'Brace core, press straight up' },
    { name: 'Arnold Press',                   category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Rotate palms outward as you press up' },
    { name: 'Dumbbell Lateral Raises',        category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Light weight, strict form for side delts' },
    { name: 'Cable Lateral Raises',           category: 'Shoulders',   equipment: 'Cable',      notes: 'Constant cable tension for side delts' },
    { name: 'Machine Lateral Raises',         category: 'Shoulders',   equipment: 'Machine',    notes: 'Consistent tension, control the eccentric' },
    { name: 'Face Pulls (Cable)',             category: 'Shoulders',   equipment: 'Cable',      notes: 'Pull to face level, rear delts and external rotation' },
    { name: 'Rear Delt Fly Machine',          category: 'Shoulders',   equipment: 'Machine',    notes: 'Focus on rear delts, slow and controlled' },
    { name: 'Dumbbell Front Raises',          category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Raise to shoulder height, control the descent' },
    { name: 'Standing Dumbbell Shoulder Press', category: 'Shoulders', equipment: 'Dumbbell',   notes: 'More core engagement, press overhead with control' },
    { name: 'Single-Arm Dumbbell Shoulder Press', category: 'Shoulders', equipment: 'Dumbbell', notes: 'Seated or standing, alternate arms or focus on one side' },
    { name: 'Landmine Press',                 category: 'Shoulders',   equipment: 'Barbell',    notes: 'Unilateral, great for shoulder stability' },
    { name: 'Z-Press',                        category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Seated on floor with no back support — advanced core + shoulder' },
    { name: 'Pike Push-Ups',                  category: 'Shoulders',   equipment: 'Bodyweight', notes: 'Elevate feet for more difficulty, hips high' },
    { name: 'Leaning Lateral Raises',         category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Lean away from working side for better range' },
    { name: 'Y-Raises (Scaption)',            category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Thumbs up, 45-degree angle — rotator cuff friendly' },
    { name: 'Band Lateral Raises',            category: 'Shoulders',   equipment: 'Band',       notes: 'Constant tension, excellent for warm-up or home' },
    { name: 'Dumbbell Rear Delt Fly',         category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Bent-over or prone on incline bench, squeeze at top' },
    { name: 'Cable Rear Delt Fly',            category: 'Shoulders',   equipment: 'Cable',      notes: 'High pulley crossover or rear fly motion' },
    { name: 'Band Pull-Aparts',               category: 'Shoulders',   equipment: 'Band',       notes: 'Excellent rear delt / posture exercise' },
    { name: 'Bent-Over Rear Delt Rows',       category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Elbows high, pull like a wide row' },
    { name: 'Dumbbell Upright Rows',          category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Elbows lead, keep below shoulder height' },
    { name: 'Cable Front Raises',             category: 'Shoulders',   equipment: 'Cable',      notes: 'Single or dual arm, controlled movement' },
    { name: 'Incline Dumbbell Front Raises',  category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Lying on incline bench for support' },
    { name: 'Dumbbell Shrugs',                category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Traps + upper shoulders, hold squeeze at top' },
    { name: 'Farmer\'s Carry',                category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Heavy DBs, walk with strong posture and shoulder stability' },
    { name: 'Dumbbell Overhead Carry',        category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'One or two arms overhead while walking' },
    { name: 'Dumbbell Halo',                  category: 'Shoulders',   equipment: 'Dumbbell',   notes: 'Circle around head for mobility and stability' },
    { name: 'Band Overhead Pull-Aparts',      category: 'Shoulders',   equipment: 'Band',       notes: 'External rotation and shoulder mobility' },
    { name: 'Wall Angels',                    category: 'Shoulders',   equipment: 'Bodyweight', notes: 'Back against wall, slide arms up and down for mobility' },
    { name: 'Machine Pec Deck Reverse Fly',   category: 'Shoulders',   equipment: 'Machine',    notes: 'Rear delt focus (already in program but good to keep)' },
    { name: 'Egyptian Lateral Raises',        category: 'Shoulders',   equipment: 'Cable',      notes: 'Lean into cable for stretch (already partially covered)' },

    // ── BICEPS ──
    { name: 'Barbell Bicep Curls',            category: 'Biceps',      equipment: 'Barbell',    notes: 'Keep elbows tucked, avoid swinging' },
    { name: 'Dumbbell Bicep Curls',           category: 'Biceps',      equipment: 'Dumbbell',   notes: 'Alternate arms or together, full range' },
    { name: 'Dumbbell Hammer Curls',          category: 'Biceps',      equipment: 'Dumbbell',   notes: 'Thumb up grip, targets brachialis and forearms' },
    { name: 'Machine Preacher Curls',         category: 'Biceps',      equipment: 'Machine',    notes: 'Isolate biceps, focus on peak contraction' },
    { name: 'Cable Bicep Curls',              category: 'Biceps',      equipment: 'Cable',      notes: 'Constant tension throughout, squeeze at top' },
    { name: 'Concentration Curls',            category: 'Biceps',      equipment: 'Dumbbell',   notes: 'Elbow on thigh, full squeeze at top' },
    { name: 'Incline Dumbbell Curls',         category: 'Biceps',      equipment: 'Dumbbell',   notes: 'Full stretch at bottom, great for peak' },

    // === NEW / EXPANDED BICEPS EXERCISES ===
    { name: 'EZ-Bar Bicep Curls',             category: 'Biceps',      equipment: 'Barbell',    notes: 'EZ grip reduces wrist strain' },
    { name: 'Preacher Barbell Curls',         category: 'Biceps',      equipment: 'Barbell',    notes: 'Strict form on preacher bench' },
    { name: 'Cable Hammer Curls (Rope)',      category: 'Biceps',      equipment: 'Cable',      notes: 'Neutral grip for brachialis' },
    { name: 'Spider Curls',                   category: 'Biceps',      equipment: 'Dumbbell',   notes: 'Lying face down on incline bench' },
    { name: '21s (Barbell or DB)',            category: 'Biceps',      equipment: 'Dumbbell',   notes: '7 bottom half, 7 top half, 7 full reps' },
    { name: 'Reverse Barbell Curls',          category: 'Biceps',      equipment: 'Barbell',    notes: 'Targets brachialis and forearms' },
    { name: 'Cable Concentration Curls',      category: 'Biceps',      equipment: 'Cable',      notes: 'Single arm, peak contraction' },
    { name: 'Zottman Curls',                  category: 'Biceps',      equipment: 'Dumbbell',   notes: 'Supinated up, pronated down' },
    { name: 'Chin-Ups (Supinated)',           category: 'Biceps',      equipment: 'Bodyweight', notes: 'Underhand grip, full range' },
    { name: 'Band Bicep Curls',               category: 'Biceps',      equipment: 'Band',       notes: 'Constant tension, great finisher' },
    { name: 'Drag Curls',                     category: 'Biceps',      equipment: 'Barbell',    notes: 'Bar drags up body, elbows back' },

    // ── TRICEPS ──
    { name: 'Cable Tricep Pushdowns (Rope)',  category: 'Triceps',     equipment: 'Cable',      notes: 'Keep elbows pinned, squeeze at bottom' },
    { name: 'Overhead Cable Tricep Extension',category: 'Triceps',     equipment: 'Cable',      notes: 'Full stretch at top, extend fully' },
    { name: 'Skull Crushers (EZ Bar)',        category: 'Triceps',     equipment: 'Barbell',    notes: 'Lower to forehead, extend fully at top' },
    { name: 'Overhead Dumbbell Tricep Ext.', category: 'Triceps',     equipment: 'Dumbbell',   notes: 'Full stretch overhead, keep elbows in' },
    { name: 'Tricep Kickbacks (Dumbbell)',    category: 'Triceps',     equipment: 'Dumbbell',   notes: 'Hinge at hips, extend arm fully back, squeeze' },

    // === NEW / EXPANDED TRICEPS EXERCISES ===
    { name: 'Close-Grip Bench Press',         category: 'Triceps',     equipment: 'Barbell',    notes: 'Elbows close to body, tricep emphasis' },
    { name: 'Tricep Dips (Machine or Bench)', category: 'Triceps',     equipment: 'Machine',    notes: 'Upright torso for tricep focus' },
    { name: 'Cable Overhead Tricep Extension (Single Arm)', category: 'Triceps', equipment: 'Cable', notes: 'Unilateral, full stretch' },
    { name: 'JM Press',                       category: 'Triceps',     equipment: 'Barbell',    notes: 'Hybrid skull crusher + close grip' },
    { name: 'Tricep Pushdowns (Straight Bar)',category: 'Triceps',     equipment: 'Cable',      notes: 'Pronated grip variation' },
    { name: 'Diamond Push-Ups',               category: 'Triceps',     equipment: 'Bodyweight', notes: 'Hands in diamond shape' },
    { name: 'French Press (EZ or DB)',        category: 'Triceps',     equipment: 'Dumbbell',   notes: 'Seated or lying overhead extension' },
    { name: 'Bench Dips',                     category: 'Triceps',     equipment: 'Bodyweight', notes: 'Feet elevated for progression' },
    { name: 'Cable Tricep Kickbacks',         category: 'Triceps',     equipment: 'Cable',      notes: 'Constant tension version' },
    { name: 'Single-Arm Overhead DB Extension', category: 'Triceps',   equipment: 'Dumbbell',   notes: 'One arm at a time, focus on stretch' },
    { name: 'Resistance Band Pushdowns',      category: 'Triceps',     equipment: 'Band',       notes: 'Home or travel friendly' },
    { name: 'Lying Tricep Extension (DB)',    category: 'Triceps',     equipment: 'Dumbbell',   notes: 'Skull crusher variation with dumbbells' },

    // ── QUADS / LEGS ──
    { name: 'Leg Press Machine',              category: 'Quads',       equipment: 'Machine',    notes: "Feet shoulder-width, don't lock knees" },
    { name: 'Leg Extension Machine',          category: 'Quads',       equipment: 'Machine',    notes: 'Squeeze quads hard at the top' },
    { name: 'Barbell Back Squat',             category: 'Quads',       equipment: 'Barbell',    notes: 'Chest up, knees track over toes' },
    { name: 'Goblet Squat (DB)',              category: 'Quads',       equipment: 'Dumbbell',   notes: 'Squat to comfortable depth, chest up' },
    { name: 'Bulgarian Split Squat',          category: 'Quads',       equipment: 'Dumbbell',   notes: 'Rear foot elevated, drive through heel' },
    { name: 'Lunges (Dumbbell)',              category: 'Quads',       equipment: 'Dumbbell',   notes: 'Step forward, knee to 90°, push back up' },

    // ── HAMSTRINGS / GLUTES / CALVES ──
    { name: 'Romanian Deadlift (DB/Barbell)', category: 'Hamstrings',  equipment: 'Barbell',    notes: 'Hinge at hips, slight knee bend, feel hamstring stretch' },
    { name: 'Leg Curl Machine',               category: 'Hamstrings',  equipment: 'Machine',    notes: 'Slow and controlled negative' },
    { name: 'Hip Thrust (Barbell)',           category: 'Glutes',      equipment: 'Barbell',    notes: 'Drive hips up, squeeze glutes at top' },
    { name: 'Standing Calf Raises Machine',   category: 'Calves',      equipment: 'Machine',    notes: 'Full range of motion, pause at top' },

    // ── CORE (Updated with your requested dumbbell exercises) ──
    { name: 'Seated Abdominal Crunch Machine',category: 'Core',        equipment: 'Machine',    notes: 'Focus on spinal flexion, control the eccentric' },
    { name: 'Cable Wood Chop High-to-Low',    category: 'Core',        equipment: 'Cable',      notes: 'Weak side first, rotate torso, pivot hips' },
    { name: 'Cable Wood Chop Low-to-High',    category: 'Core',        equipment: 'Cable',      notes: 'Weak side first, start low, pull diagonally upward' },
    { name: 'Kneeling Cable Anti-Extension',  category: 'Core',        equipment: 'Cable',      notes: 'Resist arching lower back, maintain straight torso' },
    { name: 'Plank Hold',                     category: 'Core',        equipment: 'Bodyweight', notes: 'Squeeze glutes and abs, keep hips level' },
    { name: 'Side Plank Hold',                category: 'Core',        equipment: 'Bodyweight', notes: 'Weak side first, keep hips elevated' },

    // New Dumbbell Core Exercises
    { name: "Dumbbell Side Bend",             category: "Core",        equipment: "Dumbbell",   notes: "Hold dumbbell in one hand, bend sideways, control the return" },
    { name: "Dumbbell Russian Twist",         category: "Core",        equipment: "Dumbbell",   notes: "Sit with knees bent, twist side to side holding dumbbell" },
    { name: "Dumbbell Dead Bug",              category: "Core",        equipment: "Dumbbell",   notes: "Press dumbbell toward ceiling while extending opposite arm/leg" },
    { name: "Dumbbell Woodchopper",           category: "Core",        equipment: "Dumbbell",   notes: "High to low diagonal chop motion" },
    { name: "Dumbbell Suitcase Carry",        category: "Core",        equipment: "Dumbbell",   notes: "Walk while holding heavy dumbbell at side (anti-lateral flexion)" },
    { name: "Dumbbell Renegade Row",          category: "Core",        equipment: "Dumbbell",   notes: "Plank position with alternating rows - excellent anti-rotation" },
    { name: "Dumbbell Halo",                  category: "Core",        equipment: "Dumbbell",   notes: "Circle dumbbell around head for shoulder + core stability" },

    // ── CARDIO ──
    { name: 'Treadmill Walk (Incline)',       category: 'Cardio',      equipment: 'Machine',    notes: '10-15% incline, 3.0-3.5 mph for steady state cardio' },
    { name: 'Stationary Bike (Steady State)', category: 'Cardio',      equipment: 'Machine',    notes: 'Moderate resistance, maintain 70-80 RPM' },
    { name: 'Rowing Machine',                 category: 'Cardio',      equipment: 'Machine',    notes: '60% legs, 20% core, 20% arms' },
];

const DB_CATEGORIES = ['All','Chest','Back','Shoulders','Biceps','Triceps','Quads','Hamstrings','Glutes','Calves','Core','Cardio'];

// Equipment color map for badges
const EQUIPMENT_COLORS = {
    'Machine':    '#0095ff',
    'Cable':      '#00d68f',
    'Barbell':    '#e94560',
    'Dumbbell':   '#ffaa00',
    'Bodyweight': '#a855f7',
    'Smith Machine': '#06b6d4',
};
