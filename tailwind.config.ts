import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          500: '#737373',
          600: '#525252',
          900: '#171717',
        },
        indigo: {
          700: '#3730A3',
        },
        amber: {
          600: '#D97706',
        },
        rose: {
          500: '#F43F5E',
        },
        teal: {
          600: '#0D9488',
        },
        // Warisan Edition palette — exposed to Tailwind so generated Stitch
        // markup can resolve `bg-warisan-gold` etc. directly to our tokens.
        // Single source of truth still lives in src/styles/globals.css :root.
        warisan: {
          'indigo': '#1a2040',
          'indigo-deep': '#0d1228',
          'indigo-light': '#2a3460',
          'maroon': '#6b1d2e',
          'maroon-dark': '#4a1020',
          'gold': '#c9a24e',
          'gold-light': '#e8c775',
          'gold-pale': '#f0d68c',
          'gold-shadow': '#8a6d2a',
          'emerald': '#2d5a3f',
          'emerald-dark': '#1a3525',
          'ivory': '#f8f0de',
          'ivory-warm': '#f2e6c8',
          'cream': '#faf4e3',
          'rose': '#d4949a',
        },
      },
      spacing: {
        0: '0',
        px: '1px',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },
      fontSize: {
        xs: ['12px', '1.5rem'],
        sm: ['14px', '1.5rem'],
        base: ['16px', '1.6rem'],
        lg: ['18px', '1.6rem'],
        xl: ['20px', '1.5rem'],
        '2xl': ['24px', '1.4rem'],
        '3xl': ['30px', '1.3rem'],
        '4xl': ['36px', '1.3rem'],
        '5xl': ['48px', '1.2rem'],
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.3',
        normal: '1.4',
        relaxed: '1.5',
        loose: '1.6',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: [
          'Menlo',
          'Monaco',
          '"Courier New"',
          'monospace',
        ],
        // Warisan font stack — each entry lifts the corresponding next/font
        // CSS variable so `font-playfair` etc. resolve in Tailwind classes
        // emitted from Stitch generations.
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        'noto-sc': ['var(--font-noto-sc)', '"Noto Serif SC"', 'serif'],
        'tiro-hi': ['var(--font-tiro-hi)', '"Tiro Devanagari Hindi"', 'serif'],
        // Geist — taste-design recommended for tool/dashboard surfaces.
        // Applied via `font-geist` className on builder shells only.
        geist: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        // Warisan card radius — matches `.tpl-card` glass spec
        card: '14px',
        pill: '999px',
      },
      backdropBlur: {
        glass: '18px',
      },
      boxShadow: {
        none: 'none',
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        base: '0 1px 3px rgba(0,0,0,0.1)',
        md: '0 4px 12px rgba(0,0,0,0.1)',
        lg: '0 10px 30px rgba(0,0,0,0.15)',
        xl: '0 20px 50px rgba(0,0,0,0.15)',
        // Warisan glass card shadow stack from src/styles/warisan.css
        'glass': '0 1px 0 rgba(248,240,222,0.06) inset, 0 18px 50px rgba(0,0,0,0.45)',
        'glass-hover': '0 1px 0 rgba(248,240,222,0.10) inset, 0 0 0 1px rgba(201,162,78,0.15), 0 28px 70px rgba(0,0,0,0.55), 0 0 40px rgba(201,162,78,0.18)',
        'gold-glow': '0 6px 16px rgba(201,162,78,0.45)',
        'candle': '0 0 60px rgba(201,162,78,0.18)',
      },
    },
  },
  plugins: [],
}
export default config
