export interface RegistryItem {
  title: string
  slug: string
  description: string
}

export const componentRegistry: RegistryItem[] = [
  {
    title: 'Phone Input',
    slug: 'phone-input',
    description:
      'International phone input with searchable country selector, as-you-type formatting, and E.164 output.',
  },
  {
    title: 'Stepper',
    slug: 'stepper',
    description:
      'Multi-step progress indicator with horizontal/vertical layout, clickable navigation, and error states.',
  },
  {
    title: 'Number Input',
    slug: 'number-input',
    description:
      'Stepper-flanked numeric input with long-press, keyboard nav, and Intl number formatting.',
  },
  {
    title: 'Multi-Step Form',
    slug: 'multi-step-form',
    description:
      'Wizard built on React Hook Form with per-step Zod validation and animated transitions.',
  },
  {
    title: 'Date Range Picker',
    slug: 'date-range-picker',
    description:
      'Two-month range picker with preset shortcuts, popover on desktop, and drawer on mobile.',
  },
  {
    title: 'Autocomplete',
    slug: 'autocomplete',
    description:
      'Static, async, and creatable combobox with single and multi-select, debounced search, and chip UI.',
  },
  {
    title: 'Timeline',
    slug: 'timeline',
    description:
      'Four variants: vertical, alternating, horizontal, and activity feed. Scroll-driven line animation, live updates, expandable events.',
  },
  {
    title: 'OTP Input',
    slug: 'otp-input',
    description:
      'One-time password input with animated character boxes, paste support, auto-focus navigation, and error/success states.',
  },
  {
    title: 'Tags Input',
    slug: 'tags-input',
    description:
      'Multi-tag text input with chip UI, auto-suggestions, validation, and animated add/remove transitions.',
  },
  {
    title: 'Color Picker',
    slug: 'color-picker',
    description:
      'Full-featured color picker with saturation canvas, hue slider, swatches palette, format switching, and color history.',
  },
  {
    title: 'Image Cropper',
    slug: 'image-cropper',
    description:
      'Canvas-based image cropper with drag-to-crop, zoom, rotation, flip, aspect ratio presets, and file output.',
  },
  {
    title: 'Signature Pad',
    slug: 'signature-pad',
    description:
      'Canvas-based signature pad with draw and type modes, bezier smoothing, velocity-based stroke width, and export to PNG/JPEG/SVG.',
  },
  {
    title: 'JSON Editor',
    slug: 'json-editor',
    description:
      'Interactive JSON editor with tree view, raw editing, inline value editing, type badges, and copy support.',
  },
  {
    title: 'Mention Input',
    slug: 'mention-input',
    description:
      'ContentEditable input with @mention support, cursor-positioned dropdown, and mention chip rendering.',
  },
  {
    title: 'PIN Input',
    slug: 'pin-input',
    description:
      'Masked numeric PIN input with show/hide toggle, paste support, and animated digit entry.',
  },
  {
    title: 'Currency Input',
    slug: 'currency-input',
    description:
      'Formatted currency input with Intl.NumberFormat, searchable currency selector, and 30 currencies.',
  },
  {
    title: 'Address Input',
    slug: 'address-input',
    description:
      'Address autocomplete powered by OpenStreetMap Nominatim with split fields, map preview, and geolocation.',
  },
  {
    title: 'Password Input',
    slug: 'password-input',
    description:
      'Password field with show/hide toggle, real-time strength meter, and configurable requirements checklist.',
  },
  {
    title: 'Rating Input',
    slug: 'rating-input',
    description:
      'Interactive rating input with star, heart, emoji, and thumb variants, half-star precision, and labels.',
  },
  {
    title: 'Copy Button',
    slug: 'copy-button',
    description:
      'One-click clipboard copy button with animated idle/copied/error states and tooltip feedback.',
  },
  {
    title: 'Scroll Progress',
    slug: 'scroll-progress',
    description:
      'Fixed scroll progress bar with spring physics. Supports top, bottom, left, and right positions.',
  },
  {
    title: 'Confetti',
    slug: 'confetti',
    description:
      'Canvas-based confetti particle system with configurable colors, gravity, spread, and an imperative fire() API.',
  },
  {
    title: 'Count Up',
    slug: 'count-up',
    description:
      'Animated number counter with spring physics, in-view triggering, and Intl.NumberFormat formatting.',
  },
  {
    title: 'Kbd',
    slug: 'kbd',
    description:
      'Keyboard shortcut display with automatic platform detection and Mac/Windows symbol mapping.',
  },
  {
    title: 'Code Editor',
    slug: 'code-editor',
    description:
      'Monaco-powered inline code editor with multi-file tabs, diff mode, custom Bahrawy theme, run button, and output panel.',
  },
  {
    title: 'Spreadsheet Input',
    slug: 'spreadsheet-input',
    description:
      'Mini Excel-style editable grid with cell types, formulas, virtualization, CSV import/export, and clipboard support.',
  },
  {
    title: 'Kanban',
    slug: 'kanban',
    description:
      'Full-featured drag and drop Kanban board with columns, cards, WIP limits, search, filters, and detail dialogs.',
  },
  {
    title: 'Virtual List',
    slug: 'virtual-list',
    description:
      'High-performance virtualized list handling millions of rows. Fixed/variable height, grid, infinite scroll, grouped, table mode.',
  },
]
