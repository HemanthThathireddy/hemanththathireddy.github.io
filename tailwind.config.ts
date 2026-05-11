// portfolio/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          deep: '#050505',
        },
        surface: {
          1: '#111111',
          2: '#1a1a1a',
          3: '#222222',
        },
        border: {
          subtle: '#222222',
          DEFAULT: '#2a2a2a',
          strong: '#383838',
        },
        text: {
          primary: '#f0f0f0',
          secondary: '#888888',
          tertiary: '#5a5a5a',
        },
        accent: {
          DEFAULT: '#6C63FF',
          hover: '#8077ff',
          muted: 'rgba(108, 99, 255, 0.12)',
        },
        teal: {
          DEFAULT: '#0FFFC1',
          muted: 'rgba(15, 255, 193, 0.12)',
        },
        amber: {
          DEFAULT: '#FFAA2C',
          muted: 'rgba(255, 170, 44, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid type scale
        'display': ['clamp(56px, 8vw, 120px)', { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '700' }],
        'h1': ['clamp(40px, 5.5vw, 72px)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'h2': ['clamp(32px, 4vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600' }],
        'h3': ['clamp(22px, 2.4vw, 32px)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'pull': ['clamp(24px, 3vw, 40px)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.75', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.7', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '500' }],
        'micro': ['11px', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '500' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        tight: '-0.015em',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.12em',
      },
      spacing: {
        section: 'clamp(80px, 12vh, 160px)',
        gutter: 'clamp(20px, 4vw, 64px)',
      },
      maxWidth: {
        prose: '68ch',
        content: '1280px',
        narrow: '720px',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      boxShadow: {
        'glow-accent': '0 0 0 1px rgba(108, 99, 255, 0.25), 0 8px 32px rgba(108, 99, 255, 0.18)',
        'glow-teal': '0 0 0 1px rgba(15, 255, 193, 0.25), 0 8px 32px rgba(15, 255, 193, 0.15)',
        'card': '0 1px 0 0 rgba(255, 255, 255, 0.03) inset, 0 12px 32px -12px rgba(0, 0, 0, 0.5)',
        'lift': '0 20px 50px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04) inset',
      },
      backdropBlur: {
        glass: '14px',
      },
      backgroundImage: {
        'mesh-violet':
          'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108, 99, 255, 0.18), transparent 60%), radial-gradient(ellipse 40% 40% at 80% 30%, rgba(15, 255, 193, 0.08), transparent 60%)',
        'grain':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 16px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(14px)', transform: 'translate3d(0, 8px, 0)' },
          '100%': { opacity: '1', filter: 'blur(0px)', transform: 'translate3d(0, 0, 0)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        caretBlink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatY: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -6px, 0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'blur-in': 'blurIn 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'draw-line': 'drawLine 1.6s cubic-bezier(0.65, 0, 0.35, 1) forwards',
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite',
        'caret-blink': 'caretBlink 1.06s steps(2, end) infinite',
        'shimmer': 'shimmer 2.4s linear infinite',
        'float-y': 'floatY 4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.65, 0, 0.35, 1)',
        snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};

export default config;
