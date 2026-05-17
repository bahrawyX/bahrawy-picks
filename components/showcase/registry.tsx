import type { ComponentType } from 'react'
import LineWavesPreview from './previews/line-waves-preview'
import LineWavesThumb from './previews/line-waves-thumb'
import PillButtonPreview from './previews/pill-button-preview'
import PillButtonThumb from './previews/pill-button-thumb'

export interface PropEntry {
  name: string
  type: string
  default?: string
  description: string
}

export type RegistryEntry =
  | {
      kind: 'ready'
      id: string
      slug: string
      name: string
      description: string
      category: string
      hasOptions?: boolean
      dependencies: string[]
      props: PropEntry[]
      sourcePath: string
      Preview: ComponentType
      Thumbnail?: ComponentType
    }
  | {
      kind: 'docs'
      id: string
      slug: string
      name: string
      description: string
      category: string
      hasOptions?: boolean
      dependencies: string[]
    }
  | {
      kind: 'soon'
      id: string
      slug: string
      name: string
      category: string
    }

export const registry: RegistryEntry[] = [
  {
    kind: 'ready',
    id: '01',
    slug: 'line-waves',
    name: 'Line waves',
    description:
      'Mouse-interactive WebGL line waves rendered with OGL. Tunable speed, line density, color cycling, and rotation. Drops in as a full-bleed background.',
    category: 'background',
    hasOptions: true,
    dependencies: ['ogl'],
    sourcePath: 'components/line-waves.jsx',
    Preview: LineWavesPreview,
    Thumbnail: LineWavesThumb,
    props: [
      { name: 'speed', type: 'number', default: '0.3', description: 'Overall animation speed multiplier.' },
      { name: 'innerLineCount', type: 'number', default: '32', description: 'Number of lines in the inner (center) wave region.' },
      { name: 'outerLineCount', type: 'number', default: '36', description: 'Number of lines in the outer (edge) wave region.' },
      { name: 'warpIntensity', type: 'number', default: '1.0', description: 'Intensity of the wave distortion effect.' },
      { name: 'rotation', type: 'number', default: '-45', description: 'Rotation of the wave pattern in degrees.' },
      { name: 'edgeFadeWidth', type: 'number', default: '0.0', description: 'Width of the edge fade between inner and outer regions.' },
      { name: 'colorCycleSpeed', type: 'number', default: '1.0', description: 'Speed of color cycling animation.' },
      { name: 'brightness', type: 'number', default: '0.2', description: 'Overall brightness multiplier.' },
      { name: 'color1', type: 'string', default: '"#ffffff"', description: 'First color channel in HEX format.' },
      { name: 'color2', type: 'string', default: '"#ffffff"', description: 'Second color channel in HEX format.' },
      { name: 'color3', type: 'string', default: '"#ffffff"', description: 'Third color channel in HEX format.' },
      { name: 'enableMouseInteraction', type: 'boolean', default: 'true', description: 'Enable cursor-reactive wave distortion.' },
      { name: 'mouseInfluence', type: 'number', default: '2.0', description: 'Strength of mouse influence on the wave pattern.' },
    ],
  },
  {
    kind: 'ready',
    id: '02',
    slug: 'pill-button',
    name: 'Pill button',
    description:
      'A shadcn-style pill-shaped button with default, outline, and ghost variants. Built on Radix Slot for asChild composition.',
    category: 'ui',
    hasOptions: false,
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority', 'tailwind-merge'],
    sourcePath: 'components/ui/button.tsx',
    Preview: PillButtonPreview,
    Thumbnail: PillButtonThumb,
    props: [
      { name: 'variant', type: '"default" | "outline" | "ghost"', default: '"default"', description: 'Visual style of the button.' },
      { name: 'size', type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: 'Size preset for height and padding.' },
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Render as the immediate child element instead of a button (Radix Slot).' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes merged with the variant styles.' },
    ],
  },

  {
    kind: 'docs',
    id: '03',
    slug: 'phone-input',
    name: 'Phone input',
    description:
      'International phone input with searchable country selector, as-you-type formatting, and E.164 output.',
    category: 'form',
    hasOptions: true,
    dependencies: ['libphonenumber-js', 'framer-motion', 'cmdk'],
  },
  {
    kind: 'docs',
    id: '04',
    slug: 'stepper',
    name: 'Stepper',
    description:
      'Multi-step progress indicator with spring-animated state transitions and clickable navigation.',
    category: 'navigation',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '05',
    slug: 'number-input',
    name: 'Number input',
    description:
      'Stepper-flanked numeric input with animated value transitions, long-press, and Intl formatting.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '06',
    slug: 'multi-step-form',
    name: 'Multi-step form',
    description:
      'React Hook Form wizard with per-step Zod validation and Framer Motion slide transitions.',
    category: 'form',
    hasOptions: true,
    dependencies: ['react-hook-form', 'zod', '@hookform/resolvers', 'framer-motion'],
  },
  {
    kind: 'docs',
    id: '07',
    slug: 'date-range-picker',
    name: 'Date range picker',
    description:
      'Two-month range picker with animated preset shortcuts. Popover on desktop, drawer on mobile.',
    category: 'form',
    hasOptions: true,
    dependencies: ['react-day-picker', 'date-fns', 'framer-motion'],
  },

  { kind: 'soon', id: '08', slug: 'magnetic-cursor', name: 'Magnetic cursor', category: 'cursor' },
  { kind: 'soon', id: '09', slug: 'spotlight-card', name: 'Spotlight card', category: 'card' },
  { kind: 'soon', id: '10', slug: 'bento-grid', name: 'Bento grid', category: 'layout' },
  { kind: 'soon', id: '11', slug: 'marquee-row', name: 'Marquee row', category: 'motion' },
  { kind: 'soon', id: '12', slug: 'floating-dock', name: 'Floating dock', category: 'navigation' },
  { kind: 'soon', id: '13', slug: 'reveal-on-scroll', name: 'Reveal on scroll', category: 'motion' },
  { kind: 'soon', id: '14', slug: 'command-palette', name: 'Command palette', category: 'overlay' },
]

export function getEntry(slug: string): RegistryEntry | undefined {
  return registry.find((e) => e.slug === slug)
}

/**
 * Returns the URL where the entry is rendered, or null if it's not yet built.
 * - 'ready'  → /components/{slug}
 * - 'docs'   → /docs/{slug}
 * - 'soon'   → null
 */
export function getEntryHref(entry: RegistryEntry): string | null {
  if (entry.kind === 'ready') return `/components/${entry.slug}`
  if (entry.kind === 'docs') return `/docs/${entry.slug}`
  return null
}
