import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand — neutral slate ramp (text, borders, light surfaces)
        brand: {
          50: '#f6f7f8',
          100: '#eceef0',
          200: '#dde0e4',
          300: '#c2c7ce',
          400: '#9aa1ab',
          500: '#6b727c',
          600: '#4b5159',
          700: '#3a3f46',
          800: '#26292e',
          900: '#1a1c1f',
          950: '#111316'
        },
        // Primary action — Hikvision red (CTA, price, accents)
        accent: {
          DEFAULT: '#e2231a',
          hover: '#c01910',
          soft: '#fde7e6',
          contrast: '#ffffff'
        },
        // Highlight — same red family for eyebrows, dots, badges
        glow: {
          DEFAULT: '#e2231a',
          soft: '#fde7e6'
        },
        ink: '#1a1c1f',
        muted: '#5b6068',
        faint: '#8b919a',
        line: '#e6e8ec',
        surface: '#ffffff',
        ok: '#15803d',
        warn: '#b45309'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-sans-serif', 'sans-serif']
      },
      borderRadius: {
        // Sharpened corners — crisp, angular surfaces for an industrial look.
        // (rounded-full is left untouched for true circles: dots, avatars, cart badge)
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '3px',
        '2xl': '4px',
        '3xl': '5px'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17, 19, 22, 0.04), 0 8px 24px -14px rgba(17, 19, 22, 0.16)',
        card: '0 1px 3px rgba(17, 19, 22, 0.05), 0 18px 40px -26px rgba(17, 19, 22, 0.28)',
        lift: '0 8px 16px -8px rgba(226, 35, 26, 0.18), 0 30px 60px -32px rgba(17, 19, 22, 0.30)',
        glow: '0 0 0 1px rgba(226, 35, 26, 0.30), 0 12px 40px -10px rgba(226, 35, 26, 0.40)'
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(17,19,22,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,19,22,0.05) 1px, transparent 1px)',
        'radial-accent':
          'radial-gradient(60% 60% at 50% 0%, rgba(226,35,26,0.12) 0%, rgba(226,35,26,0) 70%)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' }
        },
        // Ambient light blobs
        'float-a': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(40px, -30px, 0) scale(1.08)' }
        },
        'float-b': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-50px, 25px, 0) scale(1.12)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-glow': 'pulse-glow 3.5s ease-in-out infinite',
        'float-a': 'float-a 14s ease-in-out infinite',
        'float-b': 'float-b 18s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
