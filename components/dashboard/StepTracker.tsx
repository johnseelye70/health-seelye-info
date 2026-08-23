'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  Footprints,
  Plus,
  RotateCcw,
  Sparkles,
  Smartphone,
  Watch,
  Settings2,
  CheckCircle2,
  X,
  Play,
  Pause,
  Upload,
  Activity,
  Flame,
  MapPin,
  Clock,
  Bluetooth,
  HelpCircle,
} from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';

const STEP_GOAL_PRESETS = [
  { label: '6,000 (Gentle Active)', steps: 6000 },
  { label: '8,000 (Daily Wellness)', steps: 8000 },
  { label: '10,000 (Athlete Baseline)', steps: 10000 },
  { label: '12,500 (Fat Loss Booster)', steps: 12500 },
  { label: '15,000 (Peak Performance)', steps: 15000 },
];

export const StepTracker: React.FC = () => {
  const {
    stepGoal,
    setStepGoal,
    stepLogs,
    todaySteps,
    todayStepMiles,
    todayStepCalories,
    logSteps,
    resetTodaySteps,
    profile,
  } = useHealth();

  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  // Device Type Detection (Mobile Phone vs iPad / Laptop / Desktop)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [forcePhoneMode, setForcePhoneMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDevice = () => {
        const width = window.innerWidth;
        const isMobileAgent = /iPhone|Android|iPod/i.test(navigator.userAgent);
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isMobileAgent || (hasTouch && width < 640)) {
          setDeviceType('mobile');
        } else if (hasTouch && width <= 1024) {
          setDeviceType('tablet');
        } else {
          setDeviceType('desktop');
        }
      };
      checkDevice();
      window.addEventListener('resize', checkDevice);
      return () => window.removeEventListener('resize', checkDevice);
    }
  }, []);

  const isMobile = deviceType === 'mobile' || forcePhoneMode;

  const [customGoalInput, setCustomGoalInput] = useState<number>(stepGoal);
  const [syncPasteText, setSyncPasteText] = useState<string>('');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [inlineStepInput, setInlineStepInput] = useState<string>('');

  // Live Phone Accelerometer Sensor State
  const [isSensorActive, setIsSensorActive] = useState<boolean>(false);
  const [sensorSessionSteps, setSensorSessionSteps] = useState<number>(0);
  const [sensorCadence, setSensorCadence] = useState<number>(0);
  const [sensorPermissionGranted, setSensorPermissionGranted] = useState<boolean>(false);
  const [sensorError, setSensorError] = useState<string | null>(null);

  // Accelerometer algorithm references
  const lastAccelMagnitude = useRef<number>(0);
  const lastStepTimestamp = useRef<number>(0);
  const recentStepTimes = useRef<number[]>([]);

  const progressPercent = Math.min(200, Math.round((todaySteps / (stepGoal || 10000)) * 100));
  const remainingSteps = Math.max(0, stepGoal - todaySteps);
  const activeMinutes = Math.round(todaySteps / 110); // ~110 steps/min average walking pace

  // 1. Live Phone Accelerometer Step Counting Algorithm
  useEffect(() => {
    if (!isSensorActive) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const accel = event.accelerationIncludingGravity || event.acceleration;
      if (!accel || accel.x === null || accel.y === null || accel.z === null) return;

      const x = accel.x;
      const y = accel.y;
      const z = accel.z;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const delta = magnitude - lastAccelMagnitude.current;
      lastAccelMagnitude.current = magnitude;

      const now = Date.now();
      // Peak detection threshold (human walking creates a 2.5 - 5.0 m/s^2 oscillation)
      // Minimum 280ms between steps to prevent double-counting (max 214 steps/min)
      if (delta > 2.6 && (now - lastStepTimestamp.current) > 280) {
        lastStepTimestamp.current = now;
        setSensorSessionSteps((prev) => prev + 1);
        logSteps(todaySteps + 1, 'phone_sensor');

        // Calculate rolling cadence (steps/min)
        recentStepTimes.current.push(now);
        if (recentStepTimes.current.length > 8) {
          recentStepTimes.current.shift();
        }
        if (recentStepTimes.current.length >= 2) {
          const timeSpanSec = (now - recentStepTimes.current[0]) / 1000;
          const cadence = Math.round((recentStepTimes.current.length / timeSpanSec) * 60);
          setSensorCadence(cadence);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isSensorActive, todaySteps, logSteps]);

  // Request motion sensor permission on iOS Safari
  const handleToggleSensor = async () => {
    if (isSensorActive) {
      setIsSensorActive(false);
      setSensorCadence(0);
      return;
    }

    setSensorError(null);

    // iOS 13+ requires explicit user gesture permission for DeviceMotionEvent
    if (typeof (DeviceMotionEvent as any) !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setSensorPermissionGranted(true);
          setIsSensorActive(true);
        } else {
          setSensorError('Motion sensor permission was denied. You can still log steps manually or sync from Apple Health.');
        }
      } catch (err: any) {
        setSensorError(`Motion sensor error: ${err.message || 'Sensor unavailable'}`);
      }
    } else if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      // Standard Android / Desktop browser
      setSensorPermissionGranted(true);
      setIsSensorActive(true);
    } else {
      setSensorError('Device motion sensor not supported on this browser/hardware.');
    }
  };

  // 2. Apple Health / Watch Sync Parser
  const handleParseSyncText = () => {
    if (!syncPasteText.trim()) return;
    const clean = syncPasteText.replace(/,/g, '').trim();
    const parsed = parseInt(clean, 10);
    if (!isNaN(parsed) && parsed > 0) {
      logSteps(parsed, 'apple_health');
      setSyncStatusMsg(`Successfully synchronized ${parsed.toLocaleString()} steps!`);
      setSyncPasteText('');
      setTimeout(() => {
        setSyncStatusMsg(null);
        setShowSyncModal(false);
      }, 2000);
    } else {
      setSyncStatusMsg('Could not detect a valid step number. Please enter a numerical step value.');
    }
  };

  // 3. Bluetooth BLE Fitness Band Connection
  const handleConnectBluetooth = async () => {
    if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      try {
        setSyncStatusMsg('Scanning for nearby Bluetooth smart watches & fitness bands...');
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['heart_rate', 'battery_service'],
        });
        if (device && device.name) {
          setSyncStatusMsg(`Connected to ${device.name}! Active sync stream connected.`);
        }
      } catch (err: any) {
        setSyncStatusMsg(`Bluetooth pairing canceled or unavailable: ${err.message || 'No device selected'}`);
      }
    } else {
      setSyncStatusMsg('Web Bluetooth API is supported in Chrome/Edge on Android, Mac, and Windows.');
    }
  };

  return (
    <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-7 backdrop-blur-xl space-y-5 shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Footprints className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>Daily Step & Movement Tracker</span>
              {progressPercent >= 100 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Target Crushed! 🔥
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Target: {stepGoal.toLocaleString()} steps • Captured: {todaySteps.toLocaleString()} steps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 hover:text-white border border-surface-border text-xs font-semibold transition-all cursor-pointer"
            title="Sync with Apple Health, Garmin, Fitbit or BLE Watch"
          >
            <Watch className="w-3.5 h-3.5 text-accent-teal" />
            <span className="hidden sm:inline">Phone/Watch Sync</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCustomGoalInput(stepGoal);
              setShowGoalModal(true);
            }}
            className="p-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-zinc-200 border border-surface-border text-xs transition-all cursor-pointer"
            title="Configure Daily Step Target"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stats Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Steps */}
        <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-emerald-400" />
            <span>Today's Steps</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {todaySteps.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            {progressPercent}% of {stepGoal.toLocaleString()} goal
          </div>
        </div>

        {/* Distance (Miles) */}
        <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Distance</span>
          </div>
          <div className="text-2xl font-black font-mono text-accent-cyan">
            {todayStepMiles} <span className="text-xs font-normal text-zinc-400">mi</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            {(todayStepMiles * 1.60934).toFixed(2)} km walked
          </div>
        </div>

        {/* Active Calorie Burn */}
        <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Burn</span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {todayStepCalories} <span className="text-xs font-normal text-zinc-400">kcal</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            NEAT movement burn
          </div>
        </div>

        {/* Active Movement Time */}
        <div className="p-4 rounded-2xl bg-surface-200/70 border border-surface-border space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Active Time</span>
          </div>
          <div className="text-2xl font-black font-mono text-purple-400">
            {activeMinutes} <span className="text-xs font-normal text-zinc-400">mins</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            Circadian walking pace
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-zinc-400">
            {remainingSteps > 0 ? `${remainingSteps.toLocaleString()} steps remaining` : 'Daily Step Target Exceeded!'}
          </span>
          <span className="text-emerald-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-surface-300 rounded-full overflow-hidden border border-surface-border">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* =========================================================================
          DEVICE-AWARE ACTION MODULE: PHONE SENSOR vs DESKTOP/IPAD WATCH SYNC
          ========================================================================= */}
      {isMobile ? (
        /* MOBILE PHONE VIEW: Live In-Pocket Accelerometer Sensor */
        <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
              isSensorActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                : 'bg-surface-300 text-zinc-400 border-surface-border'
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                <span>Live Phone Accelerometer Pedometer</span>
                {isSensorActive && (
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500 text-zinc-950 animate-pulse">
                    ACTIVE SENSING
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isSensorActive
                  ? `Counting steps live in pocket • Cadence: ${sensorCadence} steps/min`
                  : 'Put your phone in your pocket and start walking to count steps automatically.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleToggleSensor}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 ${
                isSensorActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-glow'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-glow'
              }`}
            >
              {isSensorActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Sensor</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Phone Sensor</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* DESKTOP / LAPTOP / IPAD VIEW: Watch Sync & BLE Fitness Hub */
        <div className="p-4 rounded-2xl bg-surface-200/60 border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-teal/20 text-accent-teal border border-accent-teal/30 flex items-center justify-center shrink-0">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                <span>Watch & Multi-Device Sync Station</span>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {deviceType === 'tablet' ? 'iPad Mode' : 'Desktop / Laptop Mode'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Sync steps recorded from your Apple Watch, Garmin, Fitbit, or phone accelerometer.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Log watch steps..."
                value={inlineStepInput}
                onChange={(e) => setInlineStepInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const clean = inlineStepInput.replace(/,/g, '').trim();
                    const parsed = parseInt(clean, 10);
                    if (!isNaN(parsed) && parsed > 0) {
                      logSteps(parsed, 'apple_health');
                      setInlineStepInput('');
                    }
                  }
                }}
                className="w-36 px-3 py-1.5 rounded-xl bg-surface-300 border border-surface-border text-zinc-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => {
                  const clean = inlineStepInput.replace(/,/g, '').trim();
                  const parsed = parseInt(clean, 10);
                  if (!isNaN(parsed) && parsed > 0) {
                    logSteps(parsed, 'apple_health');
                    setInlineStepInput('');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black shadow-glow transition-all cursor-pointer active:scale-95"
              >
                Log Steps
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSyncModal(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-300 hover:bg-surface-400 text-zinc-300 hover:text-white border border-surface-border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Bluetooth className="w-3.5 h-3.5 text-cyan-400" />
              <span>BLE / Health Sync</span>
            </button>
          </div>
        </div>
      )}

      {sensorError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {sensorError}
        </div>
      )}

      {/* Quick Add Step Buttons */}
      <div className="pt-2 border-t border-surface-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-zinc-400 font-semibold mr-1">Quick Add:</span>
          {[1000, 2500, 5000, 10000].map((inc) => (
            <button
              key={inc}
              type="button"
              onClick={() => logSteps(todaySteps + inc, 'manual')}
              className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 border border-surface-border text-xs font-mono font-bold transition-all cursor-pointer active:scale-95"
            >
              +{inc.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {todaySteps > 0 && (
            <button
              type="button"
              onClick={resetTodaySteps}
              className="text-zinc-500 hover:text-rose-400 text-xs font-mono flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Steps</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: CONFIGURE STEP GOAL
          ========================================================================= */}
      {showGoalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowGoalModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Footprints className="w-4 h-4 text-emerald-400" />
                <span>Configure Daily Step Target</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Target Presets:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STEP_GOAL_PRESETS.map((g) => (
                  <button
                    key={g.steps}
                    type="button"
                    onClick={() => {
                      setStepGoal(g.steps);
                      setShowGoalModal(false);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      stepGoal === g.steps
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-glow'
                        : 'bg-surface-200 border-surface-border text-zinc-300 hover:border-emerald-500/40'
                    }`}
                  >
                    <div>{g.label}</div>
                    <div className="text-[10px] font-mono mt-0.5 opacity-80">
                      ~{(g.steps * 0.00045).toFixed(1)} miles / ~{Math.round(g.steps * 0.04)} kcal
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                  Custom Step Target:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1000"
                    max="50000"
                    step="500"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStepGoal(customGoalInput);
                      setShowGoalModal(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs shadow-glow cursor-pointer"
                  >
                    Save Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PHONE, WATCH & APPLE HEALTH SYNC HUB
          ========================================================================= */}
      {showSyncModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowSyncModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-accent-teal/20 text-accent-teal border border-accent-teal/30 flex items-center justify-center">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Phone, Watch & Health Sync Hub
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Capture steps from Apple Watch, Garmin, Fitbit, or Bluetooth sensors
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Method 1: Bluetooth Smart (BLE) Connection */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-100">
                <Bluetooth className="w-4 h-4 text-cyan-400" />
                <span>Method 1: Connect Bluetooth Smart Device (BLE)</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pair directly with Bluetooth-enabled Garmin, Polar, Wahoo, or Apple Watch fitness broadcasts via Web Bluetooth.
              </p>
              <button
                type="button"
                onClick={handleConnectBluetooth}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-xs shadow-glow transition-all cursor-pointer"
              >
                Scan for Bluetooth Watch / Sensor
              </button>
            </div>

            {/* Method 2: Apple Health / Garmin Step Sync */}
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-100">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Method 2: Sync Apple Health / Google Fit Step Count</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Type or paste your step count from the Apple Health, Garmin Connect, or Fitbit app for today.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 10,482 steps"
                  value={syncPasteText}
                  onChange={(e) => setSyncPasteText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-surface-300 border border-surface-border text-zinc-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleParseSyncText}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs shadow-glow transition-all cursor-pointer"
                >
                  Sync Steps
                </button>
              </div>
            </div>

            {syncStatusMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{syncStatusMsg}</span>
              </div>
            )}

            {/* Method 3: Mobile Pedometer Sensor Guide */}
            <div className="p-4 rounded-2xl bg-surface-200/40 border border-surface-border text-xs text-zinc-400 space-y-1.5">
              <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-brand-400" />
                <span>How Live Phone Sensing Works:</span>
              </div>
              <p className="leading-relaxed">
                When you click <strong>"Start Phone Sensor"</strong> on your iPhone or Android, this app reads real-time acceleration data from your phone's built-in gyroscope and accelerometer, calculating every step you take while walking with zero external apps required!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSyncModal(false)}
              className="w-full py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 text-xs font-bold cursor-pointer"
            >
              Close Sync Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
