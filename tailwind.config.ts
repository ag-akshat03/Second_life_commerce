import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        amazon: {
          navy: "#131921",
          blue: "#232f3e",
          light: "#37475a",
          gold: "#febd69",
          orange: "#ff9900",
          teal: "#007185",
          green: "#067d62",
          red: "#b12704",
          page: "#eaeded"
        }
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 70px rgba(0, 0, 0, 0.14)",
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        card: "0 2px 5px rgba(15,17,17,0.15)",
        cardHover: "0 4px 12px rgba(15,17,17,0.2)",
        dropdown: "0 4px 14px rgba(15,17,17,0.25)",
        sticky: "0 2px 4px rgba(0,0,0,0.25)"
      },
      maxWidth: {
        amazon: "1500px"
      },
      animation: {
        "fade-in": "fadeIn 0.55s ease-out both",
        shimmer: "shimmer 1.35s linear infinite"
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
