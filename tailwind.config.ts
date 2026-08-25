import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-main)",
        foreground: "var(--text-main)",
        surface: {
          50: "var(--surface-50)",
          100: "var(--surface-100)",
          200: "var(--surface-200)",
          300: "var(--surface-300)",
          card: "var(--card-bg)",
          border: "var(--surface-border)",
        },
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981", // Vitality Emerald (Clean, crisp primary health accent)
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        accent: {
          coral: "#ff4757", // Workout / Movement Flame
          amber: "#f59e0b", // Nutrition / Calorie Energy Warmth
          emerald: "#10b981", // Fresh Vitality
          teal: "#14b8a6", // Clean Fitness Teal
          cyan: "#06b6d4", // Hydration / Telemetry
          purple: "#8b5cf6", // Fasting / Rest / Sleep
          rose: "#f43f5e",
          blue: "#3b82f6",
          indigo: "#6366f1",
        }
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(16, 185, 129, 0.35)",
        "glow-coral": "0 0 25px -5px rgba(255, 71, 87, 0.35)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.35)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.35)",
        "glow-amber": "0 0 25px -5px rgba(245, 158, 11, 0.35)",
        "glow-purple": "0 0 25px -5px rgba(139, 92, 246, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
