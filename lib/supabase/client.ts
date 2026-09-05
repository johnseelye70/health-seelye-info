import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-ref.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

const inMemoryAuthStore = new Map<string, string>();

export const purgeLegacyLocalStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    const legacyKeys = [
      'health_seelye_app_state_v7',
      'health_seelye_app_state_v6',
      'health_seelye_app_state_v5',
      'health_seelye_app_state_v4',
      'health_seelye_app_state_v3',
      'health_seelye_app_state_v2',
      'health_seelye_app_state_v1',
    ];
    legacyKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });

    // Strip legacy large default foods array from v8 if present
    const currentV8 = localStorage.getItem('health_seelye_app_state_v8');
    if (currentV8 && currentV8.length > 300000) {
      try {
        const parsed = JSON.parse(currentV8);
        if (parsed.foods && Array.isArray(parsed.foods) && parsed.foods.length > 50) {
          parsed.customFoods = parsed.foods.filter(
            (f: any) => f && typeof f.id === 'string' && f.id.startsWith('cf-')
          );
          delete parsed.foods;
          delete parsed.workoutPlan;
          localStorage.setItem('health_seelye_app_state_v8', JSON.stringify(parsed));
        }
      } catch {}
    }
  } catch {}
};

// Immediate cleanup on bundle load
if (typeof window !== 'undefined') {
  purgeLegacyLocalStorage();
}

export const safeAuthStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return inMemoryAuthStore.get(key) || null;
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key) || inMemoryAuthStore.get(key) || null;
    } catch {
      return inMemoryAuthStore.get(key) || null;
    }
  },
  setItem: (key: string, value: string): void => {
    inMemoryAuthStore.set(key, value);
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (err: any) {
      console.warn('LocalStorage quota reached during auth save, purging legacy keys...', err);
      try {
        purgeLegacyLocalStorage();
        localStorage.setItem(key, value);
      } catch (retryErr) {
        try {
          sessionStorage.setItem(key, value);
        } catch {}
      }
    }
  },
  removeItem: (key: string): void => {
    inMemoryAuthStore.delete(key);
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {}
  },
};

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'health_seelye_auth_token',
        storage: safeAuthStorage,
        lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
          return await fn();
        },
      },
    })
  : null;

