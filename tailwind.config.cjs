// tailwind.config.cjs
// Design system tokens — OpenClaw CRM
// "Arctic Indigo" — midnight slate surfaces, indigo brand, cyan accents

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        // Brand — Indigo
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Primary Indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Accent — Cyan
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Primary Accent
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Neutrals — Midnight Slate
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Card background
          950: '#0f1117', // Page background
        },
      },
      backgroundImage: {
        'gradient-page': 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.06) 0, transparent 50%), radial-gradient(at 100% 80%, rgba(6, 182, 212, 0.04) 0, transparent 50%)',
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      },
      boxShadow: {
        card: '0 4px 20px rgba(15, 17, 23, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.05)',
        'card-hover': '0 8px 32px rgba(15, 17, 23, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.1)',
        'glow-brand': '0 0 20px rgba(99, 102, 241, 0.15), 0 0 6px rgba(99, 102, 241, 0.1)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.15), 0 0 6px rgba(6, 182, 212, 0.1)',
        'glow-emerald': '0 0 12px rgba(16, 185, 129, 0.1)',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '10px',
        md: '10px',
        lg: '12px',
        xl: '14px',
        '2xl': '16px',
        '3xl': '20px',
        full: '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-out-right': 'slideOutRight 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in-left': 'slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 2.5s linear infinite',
        'tooltip-in': 'tooltipIn 0.15s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0.5' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(100%)', opacity: '0' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)', opacity: '0.5' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        tooltipIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
