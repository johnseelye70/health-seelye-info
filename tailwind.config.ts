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
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Electric Cobalt Blue (Primary Theme Accent)
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        accent: {
          coral: "#ff4757", // Apple Fitness+ Movement / Workout Flame
          amber: "#f59e0b", // Apple Health Energy / Nutrition Warmth
          emerald: "#10b981", // Apple Health Vitality / Greens
          teal: "#14b8a6", // Clean Fitness Teal
          cyan: "#06b6d4", // Hydration / Precision Telemetry
          purple: "#8b5cf6", // Fasting / Sleep / Mindfulness
          rose: "#f43f5e",
          blue: "#0284c7",
          indigo: "#6366f1",
        }
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(59, 130, 246, 0.35)",
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
