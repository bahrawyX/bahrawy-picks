import type { Config } from 'tailwindcss'

const config: Config = {
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
    },
  },
  plugins: [],
}

export default config
