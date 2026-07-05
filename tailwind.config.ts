import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme-adaptive surface tokens (see globals.css :root /
        // [data-picks-theme='light']). Alpha modifiers compose:
        // text-picks-fg/60 === text-white/60 under dark defaults.
        'picks-fg': 'rgb(var(--picks-fg-rgb) / <alpha-value>)',
        'picks-surface': 'rgb(var(--picks-surface-rgb) / <alpha-value>)',
        'picks-panel': 'rgb(var(--picks-panel-rgb) / <alpha-value>)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'm3-enter': 'cubic-bezier(0.2, 0, 0, 1)',
        'm3-exit': 'cubic-bezier(0.3, 0, 1, 1)',
      },
      transitionDuration: {
        'm3-enter': '300ms',
        'm3-exit': '200ms',
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'favorite-pop': {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.35)' },
          '60%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        'favorite-burst': {
          '0%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform:
              'translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) scale(0)',
            opacity: '0',
          },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'tl-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'tl-scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'tl-grow-y': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        'tl-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-3px)' },
          '40%': { transform: 'translateX(3px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
        'tl-pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.45' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'favorite-pop': 'favorite-pop 460ms cubic-bezier(0.2, 0, 0, 1)',
        'favorite-burst':
          'favorite-burst 620ms cubic-bezier(0.2, 0, 0, 1) forwards',
        'slide-in-right': 'slide-in-right 300ms cubic-bezier(0.2, 0, 0, 1) both',
        'slide-in-left': 'slide-in-left 300ms cubic-bezier(0.2, 0, 0, 1) both',
        'marquee': 'marquee var(--duration, 30s) linear infinite',
        'tl-fade-up': 'tl-fade-up 400ms cubic-bezier(0.2, 0, 0, 1) both',
        'tl-scale-in': 'tl-scale-in 350ms cubic-bezier(0.2, 0, 0, 1) both',
        'tl-grow-y': 'tl-grow-y 500ms cubic-bezier(0.2, 0, 0, 1) both',
        'tl-shake': 'tl-shake 400ms ease-in-out both',
        'tl-pulse-ring': 'tl-pulse-ring 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
