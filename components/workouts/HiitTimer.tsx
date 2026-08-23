'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';

interface HiitTimerProps {
  initialWorkSeconds?: number;
  initialRestSeconds?: number;
  initialRounds?: number;
}

export const HiitTimer: React.FC<HiitTimerProps> = ({
  initialWorkSeconds = 40,
  initialRestSeconds = 20,
  initialRounds = 8,
}) => {
  const [workSeconds, setWorkSeconds] = useState<number>(initialWorkSeconds);
  const [restSeconds, setRestSeconds] = useState<number>(initialRestSeconds);
  const [totalRounds, setTotalRounds] = useState<number>(initialRounds);

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [isWorkPhase, setIsWorkPhase] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialWorkSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = (freq = 600, duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
        gain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioContextRef.current.destination);
        osc.start();
        osc.stop(audioContextRef.current.currentTime + duration);
      }
    } catch (e) {
      // Audio context may be restricted before user gesture
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Beep at transition
            playBeep(isWorkPhase ? 440 : 880, 0.3);

            if (isWorkPhase) {
              // Switch to Rest phase
              setIsWorkPhase(false);
              return restSeconds;
            } else {
              // Rest ended, check if all rounds completed
              if (currentRound >= totalRounds) {
                setIsActive(false);
                setIsCompleted(true);
                playBeep(1200, 0.6);
                return 0;
              } else {
                setCurrentRound((r) => r + 1);
                setIsWorkPhase(true);
                return workSeconds;
              }
            }
          }

          // Countdown warning beep for last 3 seconds
          if (prev <= 4) {
            playBeep(600, 0.08);
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isCompleted, isWorkPhase, currentRound, totalRounds, workSeconds, restSeconds, soundEnabled]);

  const handleTogglePlay = () => {
    if (isCompleted) {
      handleReset();
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsCompleted(false);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setSecondsRemaining(workSeconds);
  };

  const phaseDuration = isWorkPhase ? workSeconds : restSeconds;
  const progressPercent = phaseDuration > 0 ? Math.round(((phaseDuration - secondsRemaining) / phaseDuration) * 100) : 0;

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-500 backdrop-blur-xl ${
      isCompleted
        ? 'bg-brand-950/40 border-brand-500/50'
        : isWorkPhase
        ? 'bg-emerald-950/30 border-brand-500/40 shadow-glow'
        : 'bg-cyan-950/30 border-cyan-500/40 shadow-glow-cyan'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${isWorkPhase ? 'text-brand-400' : 'text-cyan-400'}`} />
          <span className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
            HIIT Interval Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-surface-200 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={soundEnabled ? 'Mute audio beeps' : 'Enable audio beeps'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-300 text-zinc-300 font-bold">
            Round {currentRound} of {totalRounds}
          </span>
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="text-center my-6">
        <div
          className={`inline-block px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 ${
            isCompleted
              ? 'bg-brand-500 text-zinc-950'
              : isWorkPhase
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          {isCompleted ? 'HIIT Session Complete!' : isWorkPhase ? '🔥 WORK INTERVAL (MAX EFFORT)' : '❄️ REST & BREATHE'}
        </div>

        <div className="text-6xl md:text-7xl font-black font-mono tracking-tight text-white">
          {secondsRemaining.toString().padStart(2, '0')}
          <span className="text-2xl font-sans text-zinc-500 font-normal ml-1">s</span>
        </div>

        {/* Phase Progress Bar */}
        <div className="w-full max-w-md mx-auto h-3 bg-surface-300 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isWorkPhase ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-cyan-500 to-blue-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={handleTogglePlay}
          className={`px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950'
              : 'bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 text-zinc-950 shadow-glow'
          }`}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-zinc-950" />}
          <span>{isActive ? 'Pause Interval' : isCompleted ? 'Restart HIIT' : 'Start HIIT Interval'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Interval Setup Adjusters */}
      {!isActive && (
        <div className="mt-6 pt-4 border-t border-surface-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
          <div>
            <NumberStepper
              label="Work Duration"
              value={workSeconds}
              onChange={(val) => {
                setWorkSeconds(val);
                if (!isActive && isWorkPhase) setSecondsRemaining(val);
              }}
              min={10}
              max={120}
              step={5}
              unit="s"
              size="sm"
            />
          </div>
          <div>
            <NumberStepper
              label="Rest Duration"
              value={restSeconds}
              onChange={(val) => setRestSeconds(val)}
              min={5}
              max={120}
              step={5}
              unit="s"
              size="sm"
            />
          </div>
          <div>
            <NumberStepper
              label="Total Rounds"
              value={totalRounds}
              onChange={(val) => setTotalRounds(val)}
              min={1}
              max={30}
              step={1}
              unit="rds"
              size="sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
