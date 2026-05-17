export const registry = [
    {
        name: 'phone-input',
        title: 'Phone Input',
        description: 'International phone number input with flag, country code dropdown, and E.164 output.',
        files: ['phone-input.tsx'],
        dependencies: ['libphonenumber-js', 'framer-motion'],
        shadcnComponents: ['input', 'popover', 'command'],
    },
    {
        name: 'stepper',
        title: 'Stepper',
        description: 'Horizontal and vertical step indicator with completed, current, error states.',
        files: ['stepper.tsx'],
        dependencies: ['framer-motion'],
        shadcnComponents: [],
    },
    {
        name: 'number-input',
        title: 'Number Input',
        description: 'Numeric input with increment/decrement, long-press, prefix/suffix, and Intl formatting.',
        files: ['number-input.tsx'],
        dependencies: ['framer-motion'],
        shadcnComponents: ['input', 'button'],
    },
    {
        name: 'multi-step-form',
        title: 'Multi Step Form',
        description: 'Zod-validated multi-step form with animated step transitions and data persistence.',
        files: ['multi-step-form.tsx'],
        dependencies: ['react-hook-form', 'zod', '@hookform/resolvers', 'framer-motion'],
        shadcnComponents: ['button'],
    },
    {
        name: 'date-range-picker',
        title: 'Date Range Picker',
        description: 'Two-month calendar with presets, range highlight, and mobile drawer fallback.',
        files: ['date-range-picker.tsx'],
        dependencies: ['react-day-picker', 'date-fns', 'framer-motion'],
        shadcnComponents: ['popover', 'button', 'calendar', 'drawer'],
    },
    {
        name: 'file-upload',
        title: 'File Upload',
        description: 'Drag and drop file upload with previews, progress bars, and type/size validation.',
        files: ['file-upload.tsx'],
        dependencies: ['framer-motion'],
        shadcnComponents: ['button'],
    },
    {
        name: 'magnetic-cursor',
        title: 'Magnetic Cursor',
        description: 'Wraps any element and makes it magnetically attract toward the cursor on hover.',
        files: ['magnetic-cursor.tsx'],
        dependencies: ['framer-motion'],
        shadcnComponents: [],
    },
    {
        name: 'spotlight-card',
        title: 'Spotlight Card',
        description: 'Card with a radial spotlight glow that follows the cursor. Zero dependencies.',
        files: ['spotlight-card.tsx'],
        dependencies: [],
        shadcnComponents: [],
    },
    {
        name: 'bento-grid',
        title: 'Bento Grid',
        description: 'Responsive bento-style grid with animated cards spanning multiple columns and rows.',
        files: ['bento-grid.tsx'],
        dependencies: ['framer-motion'],
        shadcnComponents: [],
    },
    {
        name: 'marquee-row',
        title: 'Marquee Row',
        description: 'Infinite scrolling marquee with seamless looping. Pure CSS, pause on hover.',
        files: ['marquee-row.tsx'],
        dependencies: [],
        shadcnComponents: [],
    },
    {
        name: 'floating-dock',
        title: 'Floating Dock',
        description: 'macOS-style dock that magnifies icons near the cursor with spring physics.',
        files: ['floating-dock.tsx'],
        dependencies: ['framer-motion'],
        shadcnComponents: [],
    },
    {
        name: 'reveal-on-scroll',
        title: 'Reveal on Scroll',
        description: 'Animate elements into view on scroll with directional slides and stagger groups.',
        files: ['reveal-on-scroll.tsx'],
        dependencies: ['framer-motion'],
        shadcnComponents: [],
    },
    {
        name: 'command-palette',
        title: 'Command Palette',
        description: 'Spotlight-style command palette with fuzzy search, keyboard nav, and grouped actions.',
        files: ['command-palette.tsx'],
        dependencies: ['cmdk', 'framer-motion'],
        shadcnComponents: [],
    },
];
/**
 * Shared files that every Bahrawy component depends on.
 * Copied once if they don't already exist.
 */
export const sharedFiles = [
    { src: 'lib/motion.ts', dest: 'lib/motion.ts' },
    { src: 'lib/phone-utils.ts', dest: 'lib/phone-utils.ts' },
];
/** GitHub raw URL base for fetching component source files. */
export const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/bahrawyX/bahrawy-picks/main';
export function getEntry(name) {
    return registry.find((e) => e.name === name);
}
//# sourceMappingURL=registry.js.map