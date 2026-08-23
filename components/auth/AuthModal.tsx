'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Smartphone,
  Laptop,
  Check,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authUser,
    signInWithPassword,
    signUpWithPassword,
    resetPassword,
    signOut,
    isSupabaseConfigured,
    syncStatus,
    syncWithCloud,
  } = useHealth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'Supabase cloud credentials are not yet configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment environment.'
      );
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signInWithPassword(email, password);
        if (error) throw error;
        setSuccessMsg('Signed in successfully! Your data is syncing across your devices.');
        setTimeout(() => setShowAuthModal(false), 1500);
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const { error } = await signUpWithPassword(email, password, fullName);
        if (error) throw error;
        setSuccessMsg('Account created successfully! Your local data has been linked to your new cloud account.');
        setTimeout(() => setShowAuthModal(false), 2000);
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setSuccessMsg('Password reset instructions have been sent to your email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
      onClick={() => setShowAuthModal(false)}
    >
      <div
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-surface-100/95 border border-surface-border shadow-2xl backdrop-blur-xl text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-surface-200/60 hover:bg-surface-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center pb-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 shadow-glow mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {authUser
              ? 'Cloud Account Connected'
              : mode === 'signin'
              ? 'Sign In & Sync'
              : mode === 'signup'
              ? 'Create Cloud Account'
              : 'Reset Your Password'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {authUser
              ? 'Your health records, meals, and workout logs are securely synced to the cloud.'
              : 'Access your nutrition targets, meal logs, and workout split seamlessly across your phone, tablet, and computer.'}
          </p>
        </div>

        {/* Logged In View */}
        {authUser ? (
          <div className="space-y-6 pt-4">
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-surface-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Account:</span>
                <span className="font-semibold text-brand-300 font-mono">{authUser.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Sync Status:</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Connected & Synced'}</span>
                </span>
              </div>
            </div>

            {/* Cross-Device Multi-Icon Badge */}
            <div className="p-4 rounded-2xl bg-surface-300/40 border border-surface-border/50 flex items-center justify-around text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-brand-400" />
                <span>iPhone / Mobile</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-accent-cyan" />
                <span>Laptop / Desktop</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={syncWithCloud}
                disabled={syncStatus === 'syncing'}
                className="flex-1 py-3 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-brand-400' : ''}`} />
                <span>Sync Now</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setShowAuthModal(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-300 transition-all active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Forms */
          <div className="space-y-5 pt-3">
            {/* Mode Switcher Tabs */}
            {mode !== 'forgot' && (
              <div className="flex p-1 rounded-2xl bg-surface-200 border border-surface-border">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Error & Success Banners */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="text-[11px] text-brand-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>Processing...</span>
                  </>
                ) : mode === 'signin' ? (
                  <>
                    <span>Sign In & Sync Device</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : mode === 'signup' ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Account & Sync Data</span>
                  </>
                ) : (
                  <span>Send Recovery Instructions</span>
                )}
              </button>
            </form>

            {mode === 'forgot' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-brand-400 hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

            {/* Offline-First Reassurance Note */}
            <div className="p-3 rounded-2xl bg-surface-200/50 border border-surface-border text-[11px] text-zinc-400 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Existing meals and workouts tracked on this device will automatically link to your cloud account.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
