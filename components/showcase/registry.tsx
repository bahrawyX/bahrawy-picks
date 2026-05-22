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
    kind: 'docs',
    id: '40',
    slug: 'kanban',
    name: 'Kanban',
    description:
      'Self-managing task board with drag-and-drop columns, subtasks, priority/difficulty pills, due dates, filters, list view, and localStorage persistence.',
    category: 'data',
    dependencies: [
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'zustand',
      'framer-motion',
      'sonner',
      'zod',
      'date-fns',
      'react-day-picker',
    ],
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
    slug: 'parallax-section',
    name: 'Parallax Section',
    description: 'Elements move at different speeds on scroll creating depth. Configurable speed and direction.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '50',
    slug: 'stagger-reveal',
    name: 'Stagger Reveal',
    description: 'Container that automatically staggers its children in on scroll. Six direction modes.',
    category: 'motion',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '51',
    slug: 'scroll-path-reveal',
    name: 'Scroll Path Reveal',
    description:
      'Organic SVG path that draws itself as you scroll. GPU-driven via framer-motion pathLength — no layout reads, buttery smooth.',
    category: 'scroll',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '52',
    slug: 'card-stack-scroll',
    name: 'Card Stack Scroll',
    description:
      'Sticky-stacked cards inspired by Olivier Larose — each card scales gently as the next slides up on top. Pure framer-motion useScroll, GPU-only transforms.',
    category: 'scroll',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '53',
    slug: 'dynamic-island',
    name: 'Dynamic Island',
    description:
      'iPhone-style notch that morphs smoothly between rich states — idle, ring, timer, record, music, maps, airdrop. Spring-physics layout animation.',
    category: 'motion',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '54',
    slug: 'accordion',
    name: 'Accordion',
    description:
      'Minimal accordion with a bouncy spring open/close. Single or multi-open mode, optional chevron, configurable bounciness.',
    category: 'ui',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '55',
    slug: 'image-hover-reveal',
    name: 'Image Hover Reveal',
    description:
      'Image card whose description and CTA slide up over the image on hover. Spring-animated text lift + gentle image zoom.',
    category: 'card',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '56',
    slug: 'image-swap-text',
    name: 'Image Swap Text',
    description:
      'Avatar row above a giant headline. Hover an avatar — the headline swaps to that avatar\'s word with letters fanning outward, while an accent disc tracks the cursor.',
    category: 'motion',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '57',
    slug: 'scroll-rail',
    name: 'Scroll Rail',
    description:
      'A pinned section whose children sit in a horizontal track and slide left as the page scrolls down. Spring-smoothed, auto-measured travel, optional progress bar.',
    category: 'scroll',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '58',
    slug: 'tabs',
    name: 'Tabs',
    description:
      'Animated tab bar with a sliding indicator under the active tab and a fade-through on the content panel.',
    category: 'navigation',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '59',
    slug: 'hover-card',
    name: 'Hover Card',
    description:
      'Preview popup that appears with a delay on hover. Spring-positioned, fades + scales in.',
    category: 'overlay',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '60',
    slug: 'avatar-group',
    name: 'Avatar Group',
    description:
      'Stacked overlapping avatars that spread apart on hover, with an overflow chip for hidden members.',
    category: 'ui',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '61',
    slug: 'progress-ring',
    name: 'Progress Ring',
    description:
      'Circular progress indicator with animated stroke + spring-driven center label.',
    category: 'ui',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '62',
    slug: 'switch',
    name: 'Switch',
    description:
      'Animated toggle switch with a spring thumb. Three sizes, controlled or uncontrolled.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '63',
    slug: 'toast',
    name: 'Toast',
    description:
      'Imperative toast notifications with useToast() hook, slide-in stack, intent variants, and auto-dismiss.',
    category: 'overlay',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '64',
    slug: 'skeleton',
    name: 'Skeleton',
    description:
      'Shimmer placeholder for loading states. Rect, circle, pill shapes plus a multi-line SkeletonText helper.',
    category: 'ui',
    hasOptions: true,
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '65',
    slug: 'hero-spotlight',
    name: 'Hero Spotlight',
    description:
      'Centered hero with a radial spotlight that follows the cursor. Spring-smoothed, tagline + headline + dual CTA.',
    category: 'hero',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '66',
    slug: 'hero-marquee',
    name: 'Hero Marquee',
    description:
      'Centered hero on top of multi-row scrolling word marquees. Rows alternate direction and speed.',
    category: 'hero',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '67',
    slug: 'hero-counter',
    name: 'Hero Counter',
    description:
      'Hero layout with a giant stat that counts up on mount, plus a column of feature blurbs.',
    category: 'hero',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '68',
    slug: 'hero-aurora',
    name: 'Hero Aurora',
    description:
      'Centered hero with drifting blurred color blobs behind the text. Soft, brand-y, configurable palette.',
    category: 'hero',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '69',
    slug: 'pricing-tier',
    name: 'Pricing Tier',
    description:
      'Three-tier card grid with a featured highlight + entrance stagger on scroll.',
    category: 'pricing',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '70',
    slug: 'pricing-toggle',
    name: 'Pricing Toggle',
    description:
      'Pricing grid with monthly/annual billing toggle. Numbers spring-swap between modes.',
    category: 'pricing',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '71',
    slug: 'pricing-compare',
    name: 'Pricing Compare',
    description:
      'Feature comparison table with plan headers, group rows, and a highlighted recommended column.',
    category: 'pricing',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '72',
    slug: 'footer-minimal',
    name: 'Footer Minimal',
    description:
      'Clean footer: logo + link columns + copyright. Light hover animations on links.',
    category: 'footer',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '73',
    slug: 'footer-newsletter',
    name: 'Footer Newsletter',
    description:
      'Footer with a prominent newsletter signup row. Submit button morphs to a Subscribed! confirmation.',
    category: 'footer',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '74',
    slug: 'footer-brand-mark',
    name: 'Footer Brand Mark',
    description:
      'Footer with a giant wordmark across the bottom that fades + drifts into place on scroll. Link columns above.',
    category: 'footer',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '75',
    slug: 'stats-grid',
    name: 'Stats Grid',
    description:
      'Section with 4 big counters that spring from 0 to their value on scroll.',
    category: 'section',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '76',
    slug: 'testimonials-slider',
    name: 'Testimonials Slider',
    description:
      'Auto-rotating testimonial section with crossfade transitions and indicator dots.',
    category: 'section',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '77',
    slug: 'cta-section',
    name: 'CTA Section',
    description:
      'Big call-to-action band with soft radial glows behind the headline.',
    category: 'section',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '78',
    slug: 'faq-section',
    name: 'FAQ Section',
    description:
      'Two-column FAQ layout: heading on the left, accordion of questions on the right.',
    category: 'section',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '79',
    slug: 'logo-cloud',
    name: 'Logo Cloud',
    description:
      '"Trusted by" section with logos in an edge-faded marquee, or a static grid.',
    category: 'section',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '80',
    slug: 'bento-features',
    name: 'Bento Features',
    description:
      'Feature bento grid section with mixed-size cards, accent gradients, scroll stagger.',
    category: 'section',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '81',
    slug: 'divider',
    name: 'Divider',
    description:
      'Animated horizontal rule with optional centered label. Solid / dashed / gradient.',
    category: 'ui',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '82',
    slug: 'banner',
    name: 'Banner',
    description:
      'Sticky announcement banner with intent variants, CTA, dismissible.',
    category: 'overlay',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '83',
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    description:
      'Animated breadcrumb. Long trails collapse to a `…` menu.',
    category: 'navigation',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '84',
    slug: 'empty-state',
    name: 'Empty State',
    description:
      'No-data pattern: icon in a glow ring, heading, body, CTAs.',
    category: 'ui',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '85',
    slug: 'loader-dots',
    name: 'Loader Dots',
    description:
      'Three-dot typing/loading indicator. Configurable size, color, speed.',
    category: 'motion',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '86',
    slug: 'status-pill',
    name: 'Status Pill',
    description:
      'Status badge with intent presets and an optional pulsing dot.',
    category: 'ui',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '87',
    slug: 'stat-card',
    name: 'Stat Card',
    description:
      'Data card with animated number, delta, and inline sparkline.',
    category: 'data',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '88',
    slug: 'drawer',
    name: 'Drawer',
    description:
      'Slide-in panel from any edge with a dim backdrop. Escape closes, spring entry.',
    category: 'overlay',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '89',
    slug: 'dropdown-menu',
    name: 'Dropdown Menu',
    description:
      'Animated dropdown with keyboard navigation, dividers, icons, shortcuts, and a danger style.',
    category: 'overlay',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '90',
    slug: 'tooltip',
    name: 'Tooltip',
    description:
      'Lightweight tooltip — for one-liners. Delay, side, smart entry direction.',
    category: 'overlay',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '91',
    slug: 'quote-card',
    name: 'Quote Card',
    description:
      'Pull-quote card with author avatar + role and a scroll-triggered staggered reveal.',
    category: 'card',
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '92',
    slug: 'search-input',
    name: 'Search Input',
    description:
      'Standalone search field with animated icon, clear button, debounced onSearch, loading spinner.',
    category: 'form',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '93',
    slug: 'sparkline',
    name: 'Sparkline',
    description:
      'Tiny SVG line chart that draws itself on mount. Optional area fill and end dot.',
    category: 'data',
    hasOptions: true,
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '94',
    slug: 'pinned-story',
    name: 'Pinned Story',
    description:
      'Heavy GSAP section: scroll-pinned cinematic feature story. Scrubbed timeline orchestrates step text crossfade, image swap + parallax pan, giant background number, accent tint, progress bar, and side guide dot.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react'],
  },
  {
    kind: 'docs',
    id: '95',
    slug: 'constellation-scroll',
    name: 'Constellation Scroll',
    description:
      'Heavy GSAP + SVG section. A network diagram constructs itself in 5 staged passes as you scroll: center pops in → satellites stagger → edges ink themselves via stroke-dashoffset → labels fade up → pulse-dots fan outward from the center.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react'],
  },
  {
    kind: 'docs',
    id: '96',
    slug: 'mega-nav',
    name: 'Mega Nav',
    description:
      'Floating top navigation bar with a frosted-glass backdrop. Hover a menu item with `sections` and a mega-menu drops down with categorized links — height + opacity animated, content fades between items, closes when the cursor leaves.',
    category: 'navigation',
    hasOptions: true,
    dependencies: ['framer-motion', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '97',
    slug: 'hero-scroll-grow',
    name: 'Hero Scroll Grow',
    description:
      'Heavy GSAP hero. Text sits over an inset image card; as the user scrolls, the image grows from 72% to full-bleed, its border-radius dissolves from 28 to 0, the hero text fades out, and an optional overlay caption fades in. One scrubbed timeline drives every layer.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '98',
    slug: 'carousel-3d',
    name: 'Carousel 3D',
    description:
      'Pinned Cover Flow-style carousel. As the user scrolls, an activeIndex advances and every card retargets its translateX / translateZ / rotateY / opacity / scale based on its offset from active. Looks like a flat row, feels like a 3D arc.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react'],
  },
  {
    kind: 'docs',
    id: '99',
    slug: 'hero-split',
    name: 'Hero Split',
    description:
      'Pinned hero with two 50/50 columns of stacked content scrolling in opposite Y directions (left up, right down). Past `reveal` (default 0.7) of the pin, a centred reveal card fades in with backdrop blur — the "meeting" moment.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '100',
    slug: 'phrase-slots',
    name: 'Phrase Slots',
    description:
      'A slot-machine for words. Each "slot" is a single-line window with a tall column of candidate words behind it; scroll spins each column through multiple cycles and lands on its target, staggered. Final state: a complete sentence reading across the row, underlined in the accent color.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '101',
    slug: 'magnetic-field',
    name: 'Magnetic Field',
    description:
      'A pinned scroll section that pairs cursor magnetism with a scroll-driven wave. A canvas dot lattice repels around your cursor with a spring while a glowing accent line sweeps top-to-bottom; each headline locks in as the wave passes it.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '102',
    slug: 'portal-scroll',
    name: 'Portal Scroll',
    description:
      "Pinned scroll section built around one image: you're outside a moody scene, a circular portal opens in the centre and grows to consume the viewport, revealing a completely different scene inside. Cursor parallax inside the portal sells the depth, the inner headline arrives letter-by-letter, and a spinning conic-gradient rim with a scan dot rides the portal edge.",
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '103',
    slug: 'cursor-lens',
    name: 'Cursor Lens',
    description:
      "An invisible cursor mask that reveals a different scene underneath as you hover. No ring, no chrome — just a soft radial fade so the boundary between the two scenes is impossible to spot. The inner image is gently magnified at the cursor focal point, the inner text is drawn crisp on top, and a click pins the lens.",
    category: 'gsap-section',
    dependencies: ['lucide-react'],
  },
  {
    kind: 'docs',
    id: '104',
    slug: 'glitch-headline',
    name: 'Glitch Headline',
    description:
      'A CRT-damaged display headline. Cyan + magenta channels drift in idle wobble; on hover a clip-path band sweeps the text and slices it horizontally. Pure CSS, no JS animation loop.',
    category: 'gsap-section',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '105',
    slug: 'type-tunnel',
    name: 'Type Tunnel',
    description:
      'Pinned scroll section that turns a list of headlines into a Z-axis tunnel. Each line lives at a different depth in 3D space; scrolling moves the camera forward through them so they arrive from the vanishing point, swell, then pass behind you.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '106',
    slug: 'paper-tear',
    name: 'Paper Tear',
    description:
      'Two sheets of paper stacked on top of each other. Scroll tears the top sheet off along a deterministic jagged SVG path, revealing the bottom sheet. Both halves carry a paper-grain texture.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '107',
    slug: 'liquid-letters',
    name: 'Liquid Letters',
    description:
      'Typography that looks like blobs of liquid. SVG goo filter (Gaussian blur + alpha-tightening colour matrix) is applied to both the text AND a cursor-following blob, so the blob bonds with letters it touches.',
    category: 'gsap-section',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '108',
    slug: 'depth-cards',
    name: 'Depth Cards',
    description:
      '3D diorama. Layered cards sit at different Z depths inside a perspective container; cursor tilts the camera so cards parallax against each other. Spring-eased tilt, per-card counter-parallax, depth-falloff glow halos.',
    category: 'gsap-section',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '109',
    slug: 'wave-text',
    name: 'Wave Text',
    description: 'A line of text where each character undulates in a sine wave with a staggered phase. Pure CSS, no JS animation loop.',
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '110',
    slug: 'disperse-text',
    name: 'Disperse Text',
    description: 'Letters explode away from their resting position on hover then settle back when the cursor leaves. Per-character offsets seeded by index for stable layout.',
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '111',
    slug: 'magnetic-text',
    name: 'Magnetic Text',
    description: 'Every character has a magnetic pull toward the cursor — yanked along the cursor vector with strength proportional to proximity, lerped per frame for a spring-like feel.',
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '112',
    slug: 'variable-font-morph',
    name: 'Variable Font Morph',
    description: "Each character animates its `font-variation-settings: 'wght'` axis between two values with a staggered phase. Works with any variable font with a weight axis.",
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '113',
    slug: 'neon-pulse',
    name: 'Neon Pulse',
    description: "Text wearing a neon sign's glow: layered text-shadows, a breathing opacity pulse, and an occasional flicker that punches brightness down.",
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '114',
    slug: 'gradient-flow',
    name: 'Gradient Flow',
    description: 'Text whose fill is a linear gradient sized 300% of the text width; animating background-position slides the colors through the glyphs in a seamless loop.',
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '115',
    slug: 'holo-text',
    name: 'Holo Text',
    description: 'Holographic text: a cyan layer and a magenta layer drift in opposite directions behind a white base layer, blending in `screen` mode.',
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '116',
    slug: 'shine-sweep',
    name: 'Shine Sweep',
    description: 'A bright shine stripe sweeps diagonally across the text. background-clip: text + animated background-position. Runs continuously or only on hover.',
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '117',
    slug: 'char-spring',
    name: 'Char Spring',
    description: 'Each character springs up from below when the element enters the viewport. overflow-hidden container + per-char delay for a typewriter-with-bounce feel.',
    category: 'text',
    dependencies: ['framer-motion'],
  },
  {
    kind: 'docs',
    id: '118',
    slug: 'stretch-text',
    name: 'Stretch Text',
    description: 'On hover, each character stretches horizontally via `transform: scaleX`. Staggered per-char delays make the stretch read as a wave through the line.',
    category: 'text',
    dependencies: [],
  },
  {
    kind: 'docs',
    id: '119',
    slug: 'time-dial',
    name: 'Time Dial',
    description: 'Pinned scroll section with a giant rotating dial. Chapters sit around the perimeter at evenly-spaced angles; scroll rotates the dial so each chapter passes under a top pointer, and the right-hand content panel crossfades to that chapter.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
  },
  {
    kind: 'docs',
    id: '120',
    slug: 'cinema-reel',
    name: 'Cinema Reel',
    description: 'Pinned scroll section that unspools a horizontal film strip from vertical scroll. Reel hubs spin at the edges, sprocket holes line the top and bottom, the centered frame pops forward, the rest dim.',
    category: 'gsap-section',
    dependencies: ['gsap', '@gsap/react', 'lucide-react'],
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
