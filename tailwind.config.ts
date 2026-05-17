import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
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
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'favorite-pop': 'favorite-pop 460ms cubic-bezier(0.2, 0, 0, 1)',
        'favorite-burst':
          'favorite-burst 620ms cubic-bezier(0.2, 0, 0, 1) forwards',
        'slide-in-right': 'slide-in-right 300ms cubic-bezier(0.2, 0, 0, 1) both',
        'slide-in-left': 'slide-in-left 300ms cubic-bezier(0.2, 0, 0, 1) both',
        'marquee': 'marquee var(--duration, 30s) linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
