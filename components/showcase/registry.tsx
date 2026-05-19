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
  {
    kind: 'docs',
    id: '08',
    slug: 'file-upload',
    name: 'File upload',
    description:
      'Drag-and-drop file upload with per-file progress, MIME filtering, and animated file cards.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },

  {
    kind: 'docs',
    id: '09',
    slug: 'magnetic-cursor',
    name: 'Magnetic cursor',
    description:
      'Wraps any element and makes it magnetically attract toward the cursor on hover with spring physics.',
    category: 'cursor',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '10',
    slug: 'spotlight-card',
    name: 'Spotlight card',
    description:
      'Card with a radial spotlight glow that follows the cursor. Zero dependencies.',
    category: 'card',
    hasOptions: true,
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '11',
    slug: 'bento-grid',
    name: 'Bento grid',
    description:
      'Responsive bento-style grid with animated cards that span multiple columns and rows.',
    category: 'layout',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '12',
    slug: 'marquee-row',
    name: 'Marquee row',
    description:
      'Infinite scrolling marquee with seamless looping. Pure CSS animation, pause on hover.',
    category: 'motion',
    hasOptions: true,
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '13',
    slug: 'floating-dock',
    name: 'Floating dock',
    description:
      'macOS-style dock that magnifies icons near the cursor with spring physics and tooltips.',
    category: 'navigation',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '14',
    slug: 'reveal-on-scroll',
    name: 'Reveal on scroll',
    description:
      'Animate elements into view on scroll. Directional slides, stagger groups, and one-shot mode.',
    category: 'motion',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '15',
    slug: 'command-palette',
    name: 'Command palette',
    description:
      'Spotlight-style command palette with fuzzy search, keyboard nav, and grouped actions.',
    category: 'overlay',
    hasOptions: true,
    dependencies: ['cmdk', 'framer-motion'],
  },
  {
    kind: 'docs',
    id: '16',
    slug: 'data-table',
    name: 'Data table',
    description:
      'Production-grade data table with sorting, filtering, pagination, row selection, virtualization, and column resizing. Built on TanStack Table.',
    category: 'data',
    hasOptions: true,
    dependencies: ['@tanstack/react-table', '@tanstack/react-virtual', 'framer-motion'],
  },
  {
    kind: 'docs',
    id: '17',
    slug: 'autocomplete',
    name: 'Autocomplete',
    description:
      'Static, async, and creatable combobox with single and multi-select, debounced search, and chip UI.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion', 'cmdk', '@radix-ui/react-popover'],
  },
  {
    kind: 'docs',
    id: '18',
    slug: 'timeline',
    name: 'Timeline',
    description:
      'Four variants: vertical, alternating, horizontal, and activity feed. Scroll-driven line animation, live updates, expandable events.',
    category: 'data',
    hasOptions: true,
    dependencies: ['framer-motion', '@radix-ui/react-avatar'],
  },
  {
    kind: 'docs',
    id: '19',
    slug: 'otp-input',
    name: 'OTP Input',
    description:
      'One-time password input with animated character boxes, paste support, auto-focus navigation, and error/success states.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '20',
    slug: 'tags-input',
    name: 'Tags Input',
    description:
      'Multi-tag text input with chip UI, auto-suggestions, validation, and animated add/remove transitions.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '21',
    slug: 'color-picker',
    name: 'Color Picker',
    description:
      'Full-featured color picker with saturation canvas, hue slider, swatches palette, format switching, and color history.',
    category: 'data',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '22',
    slug: 'image-cropper',
    name: 'Image Cropper',
    description:
      'Canvas-based image cropper with drag-to-crop, zoom, rotation, flip, aspect ratio presets, and file output.',
    category: 'data',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '23',
    slug: 'signature-pad',
    name: 'Signature Pad',
    description:
      'Canvas-based signature pad with draw and type modes, bezier smoothing, velocity-based stroke width, and export to PNG/JPEG/SVG.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '24',
    slug: 'json-editor',
    name: 'JSON Editor',
    description:
      'Interactive JSON editor with tree view, raw editing, inline value editing, type badges, and copy support.',
    category: 'data',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '25',
    slug: 'mention-input',
    name: 'Mention Input',
    description:
      'ContentEditable input with @mention support, cursor-positioned dropdown, and mention chip rendering.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '26',
    slug: 'pin-input',
    name: 'PIN Input',
    description:
      'Masked numeric PIN input with show/hide toggle, paste support, and animated digit entry.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '27',
    slug: 'currency-input',
    name: 'Currency Input',
    description:
      'Formatted currency input with Intl.NumberFormat, searchable currency selector, and 30 currencies.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '28',
    slug: 'address-input',
    name: 'Address Input',
    description:
      'Address autocomplete powered by OpenStreetMap Nominatim with split fields, map preview, and geolocation.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '29',
    slug: 'password-input',
    name: 'Password Input',
    description:
      'Password field with show/hide toggle, real-time strength meter, and configurable requirements checklist.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '30',
    slug: 'rating-input',
    name: 'Rating Input',
    description:
      'Interactive rating input with star, heart, emoji, and thumb variants, half-star precision, and labels.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '31',
    slug: 'copy-button',
    name: 'Copy Button',
    description:
      'One-click clipboard copy button with animated idle/copied/error states and tooltip feedback.',
    category: 'ui',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react', '@radix-ui/react-tooltip'],
  },
  {
    kind: 'docs',
    id: '32',
    slug: 'scroll-progress',
    name: 'Scroll Progress',
    description:
      'Fixed scroll progress bar with spring physics. Supports top, bottom, left, and right positions.',
    category: 'motion',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '33',
    slug: 'confetti',
    name: 'Confetti',
    description:
      'Canvas-based confetti particle system with configurable colors, gravity, spread, and imperative fire() API.',
    category: 'motion',
    hasOptions: true,
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '34',
    slug: 'count-up',
    name: 'Count Up',
    description:
      'Animated number counter with spring physics, in-view triggering, and Intl.NumberFormat formatting.',
    category: 'motion',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '35',
    slug: 'kbd',
    name: 'Kbd',
    description:
      'Keyboard shortcut display with automatic platform detection and Mac/Windows symbol mapping.',
    category: 'ui',
    hasOptions: false,
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '36',
    slug: 'code-editor',
    name: 'Code Editor',
    description:
      'Monaco-powered inline code editor with multi-file tabs, diff mode, custom Bahrawy theme, run button, and output panel.',
    category: 'data',
    hasOptions: true,
    dependencies: ['@monaco-editor/react', 'framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '37',
    slug: 'spreadsheet-input',
    name: 'Spreadsheet Input',
    description:
      'Mini Excel-style editable grid with cell types, formulas, virtualization, CSV import/export, and clipboard support.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '38',
    slug: 'twitter-card',
    name: 'Twitter Card',
    description:
      'Tweet-style social post card with content parsing, verified badges, metric formatting, and platform branding.',
    category: 'card',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '39',
    slug: 'shining-border',
    name: 'Shining Border',
    description:
      'Animated conic-gradient beam that travels around any element\'s border. Supports multiple color variants, multi-beam, glow, and pause on hover.',
    category: 'decoration',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'soon',
    id: '40',
    slug: 'kanban',
    name: 'Kanban',
    category: 'data',
  },
  {
    kind: 'docs',
    id: '41',
    slug: 'virtual-list',
    name: 'Virtual List',
    description:
      'High-performance virtualized list handling millions of rows. Fixed/variable height, grid, infinite scroll, grouped, table mode.',
    category: 'data',
    hasOptions: true,
    dependencies: ['@tanstack/react-virtual', 'framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '42',
    slug: 'text-reveal',
    name: 'Text Reveal',
    description: 'Words, characters, or lines reveal with a smooth clip-mask slide-up animation triggered on scroll.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '43',
    slug: 'gradient-text',
    name: 'Gradient Text',
    description: 'Text with an animated flowing gradient. Six built-in presets plus custom colors.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '44',
    slug: 'typewriter-text',
    name: 'Typewriter Text',
    description: 'Classic typewriter effect with natural typing speed variation, delete-and-retype cycling, and blinking cursor.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '45',
    slug: 'flip-text',
    name: 'Flip Text',
    description: 'Split-flap display effect where each character flips in with 3D rotation like a departures board.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '46',
    slug: 'text-scramble',
    name: 'Text Scramble',
    description: 'Characters scramble through random chars before resolving. Multiple charsets including binary, hex, and matrix.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '47',
    slug: 'blur-reveal',
    name: 'Blur Reveal',
    description: 'Content fades in from heavy blur to sharp focus with directional movement. Supports staggered children.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '48',
    slug: 'floating-elements',
    name: 'Floating Elements',
    description: 'Elements float and drift gently in random directions. Optional mouse repel physics.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '49',
    slug: 'split-reveal',
    name: 'Split Reveal',
    description: 'Two halves of content split apart to reveal hidden content underneath. Horizontal or vertical direction.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '50',
    slug: 'parallax-section',
    name: 'Parallax Section',
    description: 'Elements move at different speeds on scroll creating depth. Configurable speed and direction.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '51',
    slug: 'stagger-reveal',
    name: 'Stagger Reveal',
    description: 'Container that automatically staggers its children in on scroll. Six direction modes.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
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
  if (entry.kind === 'soon') return null
  return `/components/${entry.slug}`
}
