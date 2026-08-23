'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { ActivityLevel, BiologicalSex, FastingProtocol, GoalType, UnitPreference } from '@/lib/types';
import { calculateMacroTargets } from '@/lib/macro-calculator';
import { kgToLbs, lbsToKg, cmToFtIn, ftInToCm } from '@/lib/units';
import {
  Calculator,
  Flame,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Layers,
  X,
  Target,
} from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { FastingTimePicker } from '@/components/ui/FastingTimePicker';

export const OnboardingModal: React.FC = () => {
  const {
    profile,
    updateProfile,
    showOnboardingModal,
    setShowOnboardingModal,
    regenerateWorkouts,
  } = useHealth();

  const isImperial = profile.unit_preference === 'imperial';
  const initialFtIn = cmToFtIn(profile.height_cm);

  const [step, setStep] = useState<number>(1);

  // Form State
  const [unitPref, setUnitPref] = useState<UnitPreference>(profile.unit_preference);
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    age: profile.age,
    sex: profile.sex,
    height_cm: profile.height_cm,
    height_ft: initialFtIn.feet,
    height_in: initialFtIn.inches,
    current_weight_input: isImperial ? kgToLbs(profile.current_weight_kg) : profile.current_weight_kg,
    target_weight_input: isImperial ? kgToLbs(profile.target_weight_kg) : profile.target_weight_kg,
    activity_level: profile.activity_level,
    goal: profile.goal,
    meal_count: profile.meal_count,
    fasting_protocol: profile.fasting_protocol,
  });

  if (!showOnboardingModal) return null;

  const handleUnitToggle = (newUnit: UnitPreference) => {
    if (newUnit === unitPref) return;
    if (newUnit === 'imperial') {
      const ftIn = cmToFtIn(formData.height_cm);
      setUnitPref('imperial');
      setFormData((prev) => ({
        ...prev,
        height_ft: ftIn.feet,
        height_in: ftIn.inches,
        current_weight_input: kgToLbs(prev.current_weight_input),
        target_weight_input: kgToLbs(prev.target_weight_input),
      }));
    } else {
      const cm = ftInToCm(formData.height_ft, formData.height_in);
      setUnitPref('metric');
      setFormData((prev) => ({
        ...prev,
        height_cm: cm,
        current_weight_input: lbsToKg(prev.current_weight_input),
        target_weight_input: lbsToKg(prev.target_weight_input),
      }));
    }
  };

  const normalizedWeightKg = unitPref === 'imperial'
    ? lbsToKg(Number(formData.current_weight_input))
    : Number(formData.current_weight_input);

  const normalizedTargetWeightKg = unitPref === 'imperial'
    ? lbsToKg(Number(formData.target_weight_input))
    : Number(formData.target_weight_input);

  const normalizedHeightCm = unitPref === 'imperial'
    ? ftInToCm(Number(formData.height_ft), Number(formData.height_in))
    : Number(formData.height_cm);

  // Real-time calculation preview
  const calculated = calculateMacroTargets({
    weightKg: normalizedWeightKg,
    heightCm: normalizedHeightCm,
    age: formData.age,
    sex: formData.sex,
    activityLevel: formData.activity_level,
    goal: formData.goal,
  });

  const handleApplyAndFinish = () => {
    updateProfile({
      full_name: formData.full_name,
      age: Number(formData.age),
      sex: formData.sex,
      unit_preference: unitPref,
      height_cm: normalizedHeightCm,
      current_weight_kg: normalizedWeightKg,
      target_weight_kg: normalizedTargetWeightKg,
      activity_level: formData.activity_level,
      goal: formData.goal,
      meal_count: Number(formData.meal_count),
      fasting_protocol: formData.fasting_protocol,
      daily_calorie_target: calculated.dailyCalories,
      protein_target_g: calculated.proteinGrams,
      carb_target_g: calculated.carbGrams,
      fat_target_g: calculated.fatGrams,
    });
    regenerateWorkouts();
    setShowOnboardingModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-surface-100 border border-surface-border p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dynamic Macro Calculator Engine</h3>
              <p className="text-xs text-zinc-400">Step {step} of 3 • Mifflin-St Jeor TDEE & Macro Allocation</p>
            </div>
          </div>
          <button
            onClick={() => setShowOnboardingModal(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Biometrics & Anthropometry */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            {/* Unit Preference Selector */}
            <div className="flex items-center justify-between bg-surface-200 p-2.5 rounded-2xl border border-surface-border">
              <span className="text-xs font-semibold text-zinc-300">Measurement System:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('imperial')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                    unitPref === 'imperial'
                      ? 'bg-brand-500 text-zinc-950 font-bold shadow-glow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Imperial (lbs / ft-in)
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('metric')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                    unitPref === 'metric'
                      ? 'bg-accent-cyan text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Metric (kg / cm)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-zinc-300">Athlete Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 font-sans text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300">Biological Sex</label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value as BiologicalSex })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 text-sm"
                >
                  <option value="male">Male (Mifflin Base +5)</option>
                  <option value="female">Female (Mifflin Base -161)</option>
                  <option value="other">Neutral Average</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <NumberStepper
                  label="Age (Years)"
                  value={formData.age}
                  onChange={(val) => setFormData({ ...formData, age: val })}
                  min={16}
                  max={100}
                  step={1}
                  unit="yrs"
                />
              </div>

              {/* Height Input */}
              {unitPref === 'imperial' ? (
                <div className="grid grid-cols-2 gap-2">
                  <NumberStepper
                    label="Height (Feet)"
                    value={formData.height_ft}
                    onChange={(val) => setFormData({ ...formData, height_ft: val })}
                    min={3}
                    max={7}
                    step={1}
                    unit="ft"
                  />
                  <NumberStepper
                    label="Height (Inches)"
                    value={formData.height_in}
                    onChange={(val) => setFormData({ ...formData, height_in: val })}
                    min={0}
                    max={11}
                    step={1}
                    unit="in"
                  />
                </div>
              ) : (
                <div>
                  <NumberStepper
                    label="Height (cm)"
                    value={formData.height_cm}
                    onChange={(val) => setFormData({ ...formData, height_cm: val })}
                    min={100}
                    max={250}
                    step={1}
                    unit="cm"
                  />
                </div>
              )}

              {/* Weight Input */}
              <div>
                <NumberStepper
                  label={`Weight (${unitPref === 'imperial' ? 'lbs' : 'kg'})`}
                  value={formData.current_weight_input}
                  onChange={(val) => setFormData({ ...formData, current_weight_input: val })}
                  min={unitPref === 'imperial' ? 60 : 30}
                  max={unitPref === 'imperial' ? 600 : 300}
                  step={0.5}
                  decimals={1}
                  unit={unitPref === 'imperial' ? 'lbs' : 'kg'}
                />
              </div>
            </div>

            <div>
              <NumberStepper
                label={`Target Goal Weight (${unitPref === 'imperial' ? 'lbs' : 'kg'})`}
                value={formData.target_weight_input}
                onChange={(val) => setFormData({ ...formData, target_weight_input: val })}
                min={unitPref === 'imperial' ? 60 : 30}
                max={unitPref === 'imperial' ? 600 : 300}
                step={0.5}
                decimals={1}
                unit={unitPref === 'imperial' ? 'lbs' : 'kg'}
              />
            </div>
          </div>
        )}

        {/* Step 2: Activity Level & Deficit Pacing */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-zinc-300 block mb-2">Activity Level Multiplier</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'sedentary', label: 'Sedentary (1.2x)', desc: 'Desk job, minimal formal training' },
                  { id: 'light', label: 'Lightly Active (1.375x)', desc: 'Exercise 1-3 days per week' },
                  { id: 'moderate', label: 'Moderately Active (1.55x)', desc: 'Resistance training 3-5 days/wk' },
                  { id: 'high', label: 'Highly Active (1.725x)', desc: 'Hard training 6-7 days/wk' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, activity_level: act.id as ActivityLevel })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      formData.activity_level === act.id
                        ? 'bg-brand-500/15 border-brand-500/50 text-white shadow-glow'
                        : 'bg-surface-200/60 border-surface-border text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-zinc-200">{act.label}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{act.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-2">Caloric Objective & Deficit</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'cut_500', label: 'Fat Loss (500 kcal Deficit)', desc: 'Target ~1 lb fat loss / week' },
                  { id: 'maintain', label: 'Energy Balance (Maintenance)', desc: 'Body recomposition' },
                  { id: 'bulk_250', label: 'Lean Mass Gain (+250 kcal)', desc: 'Hypertrophy with minimal fat' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: g.id as GoalType })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      formData.goal === g.id
                        ? 'bg-brand-500/15 border-brand-500/50 text-white shadow-glow'
                        : 'bg-surface-200/60 border-surface-border text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-zinc-200">{g.label}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Fasting Cadence & Scientific Macro Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface-200 border border-surface-border">
              <div className="text-xs uppercase font-bold text-brand-400 tracking-wider mb-2">
                Calculated Metabolic Equations
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-surface-300">
                  <div className="text-[10px] text-zinc-400">BMR (Mifflin)</div>
                  <div className="text-sm font-bold text-zinc-100">{calculated.bmr} kcal</div>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-300">
                  <div className="text-[10px] text-zinc-400">TDEE Multiplier</div>
                  <div className="text-sm font-bold text-accent-teal">{calculated.tdee} kcal</div>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-300">
                  <div className="text-[10px] text-zinc-400">Daily Target</div>
                  <div className="text-sm font-bold text-brand-400">{calculated.dailyCalories} kcal</div>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-300">
                  <div className="text-[10px] text-zinc-400">Protein (1.0g/lb)</div>
                  <div className="text-sm font-bold text-accent-cyan">{calculated.proteinGrams}g</div>
                </div>
              </div>
            </div>

            {/* Macro Split Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-surface-200 border border-surface-border text-xs space-y-2">
              <div className="flex justify-between text-zinc-300 font-semibold">
                <span>Macronutrient Breakdown (Gram & % Ratio)</span>
                <span className="font-mono text-brand-400">{calculated.dailyCalories} Total Calories</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/30">
                  <div className="text-brand-400 font-bold">{calculated.proteinGrams}g Protein</div>
                  <div className="text-[10px] text-zinc-400">{calculated.proteinPercent}% of calories</div>
                </div>
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <div className="text-cyan-400 font-bold">{calculated.carbGrams}g Carbs</div>
                  <div className="text-[10px] text-zinc-400">{calculated.carbPercent}% of calories</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-amber-400 font-bold">{calculated.fatGrams}g Healthy Fats</div>
                  <div className="text-[10px] text-zinc-400">{calculated.fatPercent}% of calories</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-200 text-zinc-300 text-xs font-semibold hover:bg-surface-300"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 text-xs font-bold shadow-glow"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleApplyAndFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 text-xs font-black shadow-glow"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Calculated Targets</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
