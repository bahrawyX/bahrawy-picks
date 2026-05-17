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
]
