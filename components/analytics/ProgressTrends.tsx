'use client';

import React, { useState, useEffect } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  kgToLbs,
  lbsToKg,
  formatWeight,
  cmToFtIn,
  ftInToCm,
  formatHeight,
} from '@/lib/units';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Plus,
  Calendar,
  Sparkles,
  Award,
  Activity,
  Flame,
  CheckCircle2,
  X,
  Droplets,
  Footprints,
  SlidersHorizontal,
  User,
  Target,
  Edit3,
  Save,
  Ruler,
} from 'lucide-react';
import { BiologicalSex } from '@/lib/types';
import { NumberStepper } from '@/components/ui/NumberStepper';

export const ProgressTrends: React.FC = () => {
  const {
    profile,
    weightLogs,
    logWeight,
    updateProfile,
    recalculateMacros,
    experienceMode,
    waterGoalOz,
    setWaterGoalOz,
    todayWaterOz,
    stepGoal,
    todaySteps,
    todayStepMiles,
    todayStepCalories,
  } = useHealth();

  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [showBiometricsEditor, setShowBiometricsEditor] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const isSimple = experienceMode === 'standard' || experienceMode === 'tutorial';
  const isImperial = profile.unit_preference === 'imperial';

  // Biometrics Form State initialized from user's current profile
  const hasConfigured = Boolean(profile.has_configured_biometrics && profile.height_cm > 0);
  const initialFtIn = profile.height_cm > 0 ? cmToFtIn(profile.height_cm) : { feet: 0, inches: 0 };
  
  const [bioFeet, setBioFeet] = useState<number>(profile.height_cm > 0 ? initialFtIn.feet : 0);
  const [bioInches, setBioInches] = useState<number>(profile.height_cm > 0 ? initialFtIn.inches : 0);
  const [bioHeightCm, setBioHeightCm] = useState<number>(profile.height_cm || 0);
  const [bioCurrentWeight, setBioCurrentWeight] = useState<number>(
    profile.current_weight_kg > 0
      ? (isImperial ? kgToLbs(profile.current_weight_kg) : profile.current_weight_kg)
      : 0
  );
  const [bioTargetWeight, setBioTargetWeight] = useState<number>(
    profile.target_weight_kg > 0
      ? (isImperial ? kgToLbs(profile.target_weight_kg) : profile.target_weight_kg)
      : 0
  );
  const [bioAge, setBioAge] = useState<number>(profile.age || 35);
  const [bioSex, setBioSex] = useState<BiologicalSex>(profile.sex || 'male');
  const [bioActivity, setBioActivity] = useState(profile.activity_level || 'moderate');

  // Keep biometrics form in sync if profile updates externally
  useEffect(() => {
    if (profile.height_cm > 0) {
      const ftIn = cmToFtIn(profile.height_cm);
      setBioFeet(ftIn.feet);
      setBioInches(ftIn.inches);
      setBioHeightCm(profile.height_cm);
    } else {
      setBioFeet(0);
      setBioInches(0);
      setBioHeightCm(0);
    }
    setBioCurrentWeight(
      profile.current_weight_kg > 0
        ? (isImperial ? kgToLbs(profile.current_weight_kg) : profile.current_weight_kg)
        : 0
    );
    setBioTargetWeight(
      profile.target_weight_kg > 0
        ? (isImperial ? kgToLbs(profile.target_weight_kg) : profile.target_weight_kg)
        : 0
    );
    setBioAge(profile.age || 35);
    setBioSex(profile.sex || 'male');
    setBioActivity(profile.activity_level || 'moderate');
  }, [profile, isImperial]);

  // Modal Log Weight State
  const [newWeightInput, setNewWeightInput] = useState<number>(
    profile.current_weight_kg > 0
      ? (isImperial ? kgToLbs(profile.current_weight_kg) : profile.current_weight_kg)
      : (isImperial ? 175 : 75)
  );
  const [newBodyFatInput, setNewBodyFatInput] = useState<string>('');

  const sortedLogs = [...weightLogs].sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
  );

  const initialWeightKg = sortedLogs[0]?.weight_kg || profile.current_weight_kg;
  const currentWeightKg = sortedLogs[sortedLogs.length - 1]?.weight_kg || profile.current_weight_kg;

  const totalWeightDeltaKg = Number((currentWeightKg - initialWeightKg).toFixed(1));
  const totalWeightDeltaLbs = Number((kgToLbs(currentWeightKg) - kgToLbs(initialWeightKg)).toFixed(1));

  const remainingToGoalKg = Number((currentWeightKg - profile.target_weight_kg).toFixed(1));
  const remainingToGoalLbs = Number((kgToLbs(currentWeightKg) - kgToLbs(profile.target_weight_kg)).toFixed(1));

  // Determine min & max for SVG trend line
  const weightsKg = sortedLogs.length > 0 ? sortedLogs.map((l) => l.weight_kg) : [currentWeightKg > 0 ? currentWeightKg : 75];
  const targetW = profile.target_weight_kg > 0 ? profile.target_weight_kg : weightsKg[0];
  const minWKg = Math.min(...weightsKg, targetW) - 1;
  const maxWKg = Math.max(...weightsKg) + 1;
  const rangeKg = maxWKg - minWKg || 1;

  // Generate SVG Points for Line Chart
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = 30;

  const points = sortedLogs.map((log, idx) => {
    const x = padding + (idx / (sortedLogs.length - 1 || 1)) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - ((log.weight_kg - minWKg) / rangeKg) * (svgHeight - 2 * padding);
    return { x, y, ...log };
  });

  const pathD =
    points.length > 0
      ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
      : '';

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`
      : '';

  const handleOpenModal = () => {
    setNewWeightInput(
      currentWeightKg > 0
        ? (isImperial ? kgToLbs(currentWeightKg) : currentWeightKg)
        : (isImperial ? 175 : 75)
    );
    setNewBodyFatInput('');
    setShowLogModal(true);
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightKg = isImperial ? lbsToKg(Number(newWeightInput)) : Number(newWeightInput);
    const bfNum = newBodyFatInput !== '' ? Number(newBodyFatInput) : undefined;
    logWeight(weightKg, bfNum);
    setShowLogModal(false);
  };

  const handleSaveBiometrics = (e: React.FormEvent) => {
    e.preventDefault();
    const computedHeightCm = isImperial ? ftInToCm(bioFeet, bioInches) : Number(bioHeightCm);
    const computedCurrentWeightKg = isImperial ? lbsToKg(bioCurrentWeight) : Number(bioCurrentWeight);
    const computedTargetWeightKg = isImperial ? lbsToKg(bioTargetWeight) : Number(bioTargetWeight);

    updateProfile({
      height_cm: computedHeightCm,
      current_weight_kg: computedCurrentWeightKg,
      target_weight_kg: computedTargetWeightKg,
      has_configured_biometrics: true,
      age: Number(bioAge),
      sex: bioSex,
      activity_level: bioActivity,
    });

    recalculateMacros();
    setShowBiometricsEditor(false);
    setSaveToast('Your custom height, weight, and targets have been saved & recalculated!');
    setTimeout(() => setSaveToast(null), 3500);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/15 text-brand-400 border border-brand-500/30">
                {isSimple ? 'MY PROGRESS & HEALTH JOURNEY' : 'BIOMETRIC PROGRESS & ADHERENCE MATRIX'}
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-brand-400 font-mono text-xs font-bold uppercase">
                {profile.unit_preference} Units Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              {isSimple ? 'Weight & Wellness Progress' : 'Weight Trends & Body Composition'}
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              {isSimple
                ? 'Check in with your morning weight, customize your personal height & weight goals, and track your steady progress over time.'
                : 'Track your fat loss trajectory, weekly rate of loss against Mifflin-St Jeor 500 kcal deficit targets, and lean mass preservation.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowBiometricsEditor(!showBiometricsEditor)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-accent-cyan" />
              <span>{showBiometricsEditor ? 'Hide Biometrics' : (profile.height_cm > 0 ? 'Edit My Biometrics' : 'Set My Biometrics')}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Weight Check-In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inline Biometrics & Body Parameters Editor */}
      {showBiometricsEditor && (
        <form
          onSubmit={handleSaveBiometrics}
          className="p-6 md:p-8 rounded-3xl bg-surface-100/95 border-2 border-brand-500/40 backdrop-blur-xl space-y-6 animate-fadeIn shadow-2xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Customize Your Personal Biometrics</h2>
                <p className="text-xs text-zinc-400">Set your actual height, current starting weight, and target goal</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowBiometricsEditor(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-foreground cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Height (Feet & Inches or CM) */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-accent-cyan" />
                  <span>Height</span>
                </label>
                <span className="text-[11px] font-mono text-zinc-400 font-bold">
                  {bioFeet > 0 || bioHeightCm > 0
                    ? (isImperial ? `${bioFeet} ft ${bioInches} in` : `${bioHeightCm} cm`)
                    : 'Not entered'}
                </span>
              </div>

              {isImperial ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Feet</label>
                    <input
                      type="number"
                      min={0}
                      max={7}
                      placeholder="e.g. 5"
                      value={bioFeet > 0 ? bioFeet : ''}
                      onChange={(e) => setBioFeet(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-foreground focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Inches</label>
                    <input
                      type="number"
                      min={0}
                      max={11}
                      placeholder="e.g. 10"
                      value={bioInches > 0 ? bioInches : ''}
                      onChange={(e) => setBioInches(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-foreground focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    min={0}
                    max={240}
                    placeholder="e.g. 178"
                    value={bioHeightCm > 0 ? bioHeightCm : ''}
                    onChange={(e) => setBioHeightCm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-foreground focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}
            </div>

            {/* Current Starting Weight */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-brand-400" />
                <span>Current Weight ({isImperial ? 'lbs' : 'kg'})</span>
              </label>
              <input
                type="number"
                step={0.5}
                min={0}
                max={isImperial ? 600 : 300}
                placeholder={isImperial ? 'e.g. 175.0' : 'e.g. 79.5'}
                value={bioCurrentWeight > 0 ? bioCurrentWeight : ''}
                onChange={(e) => setBioCurrentWeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-foreground focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-zinc-400 font-mono block">
                {bioCurrentWeight > 0
                  ? (isImperial ? `~${lbsToKg(bioCurrentWeight)} kg` : `~${kgToLbs(bioCurrentWeight)} lbs`)
                  : 'Enter your real starting weight'}
              </span>
            </div>

            {/* Target Goal Weight */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Target className="w-4 h-4 text-accent-cyan" />
                <span>Target Goal Weight ({isImperial ? 'lbs' : 'kg'})</span>
              </label>
              <input
                type="number"
                step={0.5}
                min={0}
                max={isImperial ? 600 : 300}
                placeholder={isImperial ? 'e.g. 165.0' : 'e.g. 75.0'}
                value={bioTargetWeight > 0 ? bioTargetWeight : ''}
                onChange={(e) => setBioTargetWeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-foreground focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-zinc-400 font-mono block">
                {bioTargetWeight > 0
                  ? (isImperial ? `~${lbsToKg(bioTargetWeight)} kg` : `~${kgToLbs(bioTargetWeight)} lbs`)
                  : 'Enter your desired target goal'}
              </span>
            </div>

            {/* Age */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-2">
              <label className="text-xs font-bold text-foreground">Age</label>
              <input
                type="number"
                min={15}
                max={100}
                value={bioAge}
                onChange={(e) => setBioAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-foreground focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Biological Sex */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-2">
              <label className="text-xs font-bold text-foreground">Biological Sex</label>
              <div className="flex rounded-xl bg-surface-300 p-1 border border-surface-border">
                <button
                  type="button"
                  onClick={() => setBioSex('male')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    bioSex === 'male' ? 'bg-brand-500 text-zinc-950 shadow-glow' : 'text-zinc-400'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setBioSex('female')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    bioSex === 'female' ? 'bg-brand-500 text-zinc-950 shadow-glow' : 'text-zinc-400'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Activity Level */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-2">
              <label className="text-xs font-bold text-foreground">Daily Activity Level</label>
              <select
                value={bioActivity}
                onChange={(e) => setBioActivity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-xs font-bold text-foreground focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="sedentary">Sedentary (Office desk work)</option>
                <option value="light">Light Activity (1-3 light sessions/wk)</option>
                <option value="moderate">Moderate Activity (3-5 sessions/wk)</option>
                <option value="very_active">Very Active (6-7 intense sessions/wk)</option>
                <option value="extra_active">Athletic (2x day training / physical labor)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowBiometricsEditor(false)}
              className="px-4 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-foreground text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 text-xs font-black shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Recalculate Targets</span>
            </button>
          </div>
        </form>
      )}

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Weight */}
        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
              <span>Current Weight</span>
              <Scale className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-3xl font-black font-mono text-foreground mt-1.5">
              {currentWeightKg > 0 ? (
                <>
                  {isImperial ? kgToLbs(currentWeightKg) : currentWeightKg}{' '}
                  <span className="text-sm font-normal text-zinc-400">{isImperial ? 'lbs' : 'kg'}</span>
                </>
              ) : (
                <span className="text-zinc-500 text-2xl font-normal">—</span>
              )}
            </div>
          </div>
          <div className="text-xs text-zinc-400 mt-2 font-mono">
            {currentWeightKg > 0 ? (
              sortedLogs.length > 0
                ? `Check-in: ${sortedLogs[sortedLogs.length - 1].logged_at}`
                : 'Base profile setting'
            ) : (
              <button
                type="button"
                onClick={() => setShowBiometricsEditor(true)}
                className="text-brand-400 font-bold hover:underline cursor-pointer"
              >
                + Set Current Weight
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Total Change */}
        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
              <span>Total Weight Change</span>
              {totalWeightDeltaKg <= 0 ? (
                <TrendingDown className="w-4 h-4 text-brand-400" />
              ) : (
                <TrendingUp className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div
              className={`text-3xl font-black font-mono mt-1.5 ${
                sortedLogs.length >= 2
                  ? totalWeightDeltaKg <= 0
                    ? 'text-brand-400'
                    : 'text-amber-400'
                  : 'text-zinc-400'
              }`}
            >
              {sortedLogs.length >= 2
                ? `${isImperial ? (totalWeightDeltaLbs > 0 ? `+${totalWeightDeltaLbs}` : totalWeightDeltaLbs) : (totalWeightDeltaKg > 0 ? `+${totalWeightDeltaKg}` : totalWeightDeltaKg)} ${isImperial ? 'lbs' : 'kg'}`
                : '—'}
            </div>
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            {sortedLogs.length >= 2
              ? totalWeightDeltaKg <= 0
                ? 'Fat loss deficit pace'
                : 'Weight increase tracked'
              : 'Log 2+ check-ins to track trend'}
          </div>
        </div>

        {/* Card 3: Target Goal Weight */}
        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
              <span>Target Goal Weight</span>
              <Target className="w-4 h-4 text-accent-cyan" />
            </div>
            <div className="text-3xl font-black font-mono text-accent-cyan mt-1.5">
              {profile.target_weight_kg > 0 ? (
                <>
                  {isImperial ? kgToLbs(profile.target_weight_kg) : profile.target_weight_kg}{' '}
                  <span className="text-sm font-normal text-zinc-400">{isImperial ? 'lbs' : 'kg'}</span>
                </>
              ) : (
                <span className="text-zinc-500 text-2xl font-normal">—</span>
              )}
            </div>
          </div>
          <div className="text-xs text-zinc-400 mt-2 font-mono">
            {profile.target_weight_kg > 0 ? (
              isImperial
                ? remainingToGoalLbs > 0
                  ? `${remainingToGoalLbs} lbs to goal`
                  : 'Goal reached! 🎉'
                : remainingToGoalKg > 0
                ? `${remainingToGoalKg} kg to goal`
                : 'Goal reached! 🎉'
            ) : (
              <button
                type="button"
                onClick={() => setShowBiometricsEditor(true)}
                className="text-accent-cyan font-bold hover:underline cursor-pointer"
              >
                + Set Goal Target
              </button>
            )}
          </div>
        </div>

        {/* Card 4: Height & Biometrics */}
        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
              <span>Height & Baseline</span>
              <Ruler className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black font-mono text-purple-400 mt-1.5">
              {profile.height_cm > 0 ? (
                formatHeight(profile.height_cm, profile.unit_preference)
              ) : (
                <span className="text-zinc-500 text-2xl font-normal">—</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mt-2">
            <span>Age {profile.age} • {profile.sex === 'male' ? 'M' : 'F'}</span>
            <button
              type="button"
              onClick={() => setShowBiometricsEditor(true)}
              className="text-[11px] text-brand-400 hover:underline font-bold cursor-pointer"
            >
              {profile.height_cm > 0 ? 'Edit' : '+ Set Height'}
            </button>
          </div>
        </div>
      </div>

      {/* Daily Hydration & Step Movement Adherence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hydration Card */}
        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Today's Hydration Adherence</span>
            </div>
            <div className="text-2xl font-black font-mono text-cyan-400">
              {todayWaterOz} <span className="text-sm font-normal text-zinc-400">/ {waterGoalOz} oz</span>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              {Math.min(200, Math.round((todayWaterOz / (waterGoalOz || 96)) * 100))}% of daily fluid goal ({((todayWaterOz * 0.0295735)).toFixed(1)}L / {((waterGoalOz * 0.0295735)).toFixed(1)}L)
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        {/* Steps Card */}
        <div className="p-5 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span>Today's Movement & Step Output</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {todaySteps.toLocaleString()} <span className="text-sm font-normal text-zinc-400">/ {stepGoal.toLocaleString()} steps</span>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              {todayStepMiles} mi distance • {todayStepCalories} kcal burned • {Math.min(100, Math.round((todaySteps / stepGoal) * 100))}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Footprints className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* SVG Interactive Line Chart Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              <span>Weight Trajectory Curve</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              High-contrast vector plot of morning weigh-ins ({isImperial ? 'Pounds / lbs' : 'Kilograms / kg'})
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-xl bg-surface-200 text-zinc-300 border border-surface-border">
            {sortedLogs.length} Data Points
          </span>
        </div>

        {/* Vector SVG Line Chart */}
        {sortedLogs.length === 0 ? (
          <div className="py-12 px-4 rounded-2xl bg-surface-200/40 border border-dashed border-surface-border flex flex-col items-center justify-center text-center space-y-3">
            <Scale className="w-10 h-10 text-zinc-500" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">No weigh-in logs recorded yet</p>
              <p className="text-xs text-zinc-400 max-w-sm">
                Tap "Log Weight Check-In" to log your first morning weigh-in and plot your trajectory curve.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Weigh-In</span>
            </button>
          </div>
        ) : (
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-56 min-w-[500px]"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid horizontal lines */}
              {[0.25, 0.5, 0.75].map((pct, i) => (
                <line
                  key={i}
                  x1={padding}
                  y1={padding + pct * (svgHeight - 2 * padding)}
                  x2={svgWidth - padding}
                  y2={padding + pct * (svgHeight - 2 * padding)}
                  stroke="#24242c"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Area Fill */}
              {areaD && <path d={areaD} fill="url(#trendGradient)" />}

              {/* Target Goal Line */}
              {profile.target_weight_kg > 0 && (
                <line
                  x1={padding}
                  y1={svgHeight - padding - ((profile.target_weight_kg - minWKg) / rangeKg) * (svgHeight - 2 * padding)}
                  x2={svgWidth - padding}
                  y2={svgHeight - padding - ((profile.target_weight_kg - minWKg) / rangeKg) * (svgHeight - 2 * padding)}
                  stroke="#06b6d4"
                  strokeDasharray="6 6"
                  strokeWidth="1.5"
                />
              )}

              {/* Main Trend Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Point Circles */}
              {points.map((p, idx) => {
                const displayVal = isImperial ? kgToLbs(p.weight_kg) : p.weight_kg;
                return (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#10b981" stroke="#090a0d" strokeWidth="2" />
                    <text
                      x={p.x}
                      y={p.y - 10}
                      fill="#34d399"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {displayVal} {isImperial ? 'lbs' : 'kg'}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mt-4 pt-4 border-t border-surface-border/60">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-500 inline-block" />
                <span>Actual Weigh-In</span>
              </span>
              {profile.target_weight_kg > 0 && (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-accent-cyan inline-block border-t border-dashed border-accent-cyan" />
                  <span>Goal Target ({isImperial ? `${kgToLbs(profile.target_weight_kg)} lbs` : `${profile.target_weight_kg} kg`})</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Historical Check-In Logs Table */}
      <div className="p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl">
        <h3 className="text-base font-bold text-foreground mb-4">Historical Check-In Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="border-b border-surface-border text-zinc-400">
                <th className="pb-3 w-1/3">Check-In Date</th>
                <th className="pb-3 w-1/3">Weight ({isImperial ? 'lbs / kg' : 'kg / lbs'})</th>
                <th className="pb-3 w-1/3">Body Fat % (Optional)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {sortedLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-zinc-500 italic">
                    No weigh-in logs recorded yet. Click "Log Weight Check-In" above.
                  </td>
                </tr>
              ) : (
                sortedLogs
                  .slice()
                  .reverse()
                  .map((log) => (
                    <tr key={log.id} className="text-zinc-200">
                      <td className="py-3 text-foreground">{log.logged_at}</td>
                      <td className="py-3 font-bold text-brand-400">
                        {isImperial ? `${kgToLbs(log.weight_kg)} lbs` : `${log.weight_kg} kg`}{' '}
                        <span className="text-zinc-500 font-normal">
                          ({isImperial ? `${log.weight_kg} kg` : `${kgToLbs(log.weight_kg)} lbs`})
                        </span>
                      </td>
                      <td className="py-3 text-purple-300">
                        {log.body_fat_percentage !== undefined ? `${log.body_fat_percentage}%` : '—'}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Mode: Inline Goal & Unit Preferences Card */}
      {isSimple && (
        <div className="p-6 md:p-8 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">My Personal Targets & Units</h3>
              <p className="text-xs text-zinc-400">Customize your daily targets and display units anytime</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Unit Preference */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-2">
              <label className="text-xs font-bold text-foreground">Unit Display</label>
              <div className="flex rounded-xl bg-surface-300 p-1 border border-surface-border">
                <button
                  type="button"
                  onClick={() => updateProfile({ unit_preference: 'imperial' })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isImperial ? 'bg-brand-500 text-zinc-950 shadow-glow' : 'text-zinc-400 hover:text-foreground'
                  }`}
                >
                  lbs (Pounds)
                </button>
                <button
                  type="button"
                  onClick={() => updateProfile({ unit_preference: 'metric' })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !isImperial ? 'bg-brand-500 text-zinc-950 shadow-glow' : 'text-zinc-400 hover:text-foreground'
                  }`}
                >
                  kg (Kilograms)
                </button>
              </div>
            </div>

            {/* Daily Calorie Target */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-2">
              <label className="text-xs font-bold text-foreground">Daily Calorie Target</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={profile.daily_calorie_target}
                  onChange={(e) => updateProfile({ daily_calorie_target: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-brand-400 focus:outline-none focus:border-brand-500"
                  step={50}
                  min={1000}
                  max={5000}
                />
                <span className="text-xs font-mono text-zinc-400">kcal</span>
              </div>
            </div>

            {/* Daily Water Target */}
            <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border space-y-2">
              <label className="text-xs font-bold text-foreground">Daily Water Target</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={waterGoalOz}
                  onChange={(e) => setWaterGoalOz(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-cyan-400 focus:outline-none focus:border-brand-500"
                  step={8}
                  min={32}
                  max={200}
                />
                <span className="text-xs font-mono text-zinc-400">oz</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log Weight */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <form
            onSubmit={handleSaveWeight}
            className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Log Biometric Check-In</h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-zinc-400 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <NumberStepper
                  label={`Current Weight (${isImperial ? 'lbs' : 'kg'})`}
                  value={newWeightInput}
                  onChange={(val) => setNewWeightInput(val)}
                  min={isImperial ? 60 : 30}
                  max={isImperial ? 600 : 300}
                  step={0.5}
                  decimals={1}
                  unit={isImperial ? 'lbs' : 'kg'}
                />
                <span className="text-[10px] text-zinc-400 font-mono block mt-1">
                  {isImperial
                    ? `~${lbsToKg(newWeightInput)} kg equivalent`
                    : `~${kgToLbs(newWeightInput)} lbs equivalent`}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Body Fat % <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  placeholder="Optional % (e.g. 16.5)"
                  step={0.1}
                  min={3}
                  max={60}
                  value={newBodyFatInput}
                  onChange={(e) => setNewBodyFatInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-300 border border-surface-border font-mono text-sm font-bold text-foreground focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="flex-1 py-2 rounded-xl bg-surface-200 text-xs font-semibold text-zinc-400 hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold text-xs shadow-glow cursor-pointer active:scale-95 transition-all"
              >
                Save Check-In
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
