import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        // Sahayak custom colors
        sahayak: {
          navy: "oklch(var(--sahayak-navy))",
          "navy-dark": "oklch(var(--sahayak-navy-dark))",
          "navy-light": "oklch(var(--sahayak-navy-light))",
          yellow: "oklch(var(--sahayak-yellow))",
          "yellow-dark": "oklch(var(--sahayak-yellow-dark))",
          red: "oklch(var(--sahayak-red))",
          "red-dark": "oklch(var(--sahayak-red-dark))",
          green: "oklch(var(--sahayak-green))",
          white: "oklch(var(--sahayak-white))",
        },
      },
      fontFamily: {
        display: ["'Baloo 2'", "sans-serif"],
        body: ["Inter", "'Noto Sans Devanagari'", "sans-serif"],
      },
      fontSize: {
        "elderly-sm": ["1.25rem", { lineHeight: "1.6" }],   // 20px
        "elderly-base": ["1.5rem", { lineHeight: "1.6" }],  // 24px
        "elderly-lg": ["1.75rem", { lineHeight: "1.5" }],   // 28px
        "elderly-xl": ["2rem", { lineHeight: "1.4" }],      // 32px
        "elderly-2xl": ["2.5rem", { lineHeight: "1.3" }],   // 40px
        "elderly-3xl": ["3rem", { lineHeight: "1.2" }],     // 48px
      },
      spacing: {
        "btn-height": "72px",
        "tab-height": "64px",
        "input-height": "56px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "xl-custom": "1.25rem",
        "2xl-custom": "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        "sahayak": "0 8px 32px rgba(0,0,0,0.4)",
        "panic": "0 0 40px rgba(200, 50, 50, 0.6)",
        "yellow": "0 8px 24px rgba(255, 214, 0, 0.3)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
