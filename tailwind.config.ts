import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        platinum: {
          50: "#fafafa",
          100: "#f0f0f0",
          200: "#e0e0e0",
          300: "#c0c0c0",
          400: "#a0a0a0",
          500: "#808080",
          600: "#606060",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        luxury: {
          gold: "#c9a96e",
          silver: "#c0c0c0",
          bronze: "#cd7f32",
          emerald: "#2ecc71",
          sapphire: "#2563eb",
          ruby: "#dc2626",
          amethyst: "#8b5cf6",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-luxury":
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(201,169,110,0.1) 0%, rgba(192,192,192,0.05) 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(201,169,110,0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(201,169,110,0.4)" },
        },
      },
      boxShadow: {
        luxury: "0 0 15px rgba(201,169,110,0.1)",
        "luxury-lg": "0 0 30px rgba(201,169,110,0.15)",
        glass: "0 8px 32px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
