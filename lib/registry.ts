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
      'Self-managing task board with drag-and-drop columns, subtasks, priority/difficulty pills, due dates, filters, list view, and localStorage persistence.',
  },
  {
    title: 'Virtual List',
    slug: 'virtual-list',
    description:
      'High-performance virtualized list handling millions of rows. Fixed/variable height, grid, infinite scroll, grouped, table mode.',
  },
  {
    title: 'Text Reveal',
    slug: 'text-reveal',
    description:
      'Words, characters, or lines reveal with a smooth clip-mask slide-up animation triggered on scroll.',
  },
  {
    title: 'Gradient Text',
    slug: 'gradient-text',
    description:
      'Text with an animated flowing gradient. Six built-in presets (aurora, fire, ocean, candy, gold, rainbow) plus custom colors.',
  },
  {
    title: 'Typewriter Text',
    slug: 'typewriter-text',
    description:
      'Classic typewriter effect with natural typing speed variation, delete-and-retype cycling, and blinking cursor.',
  },
  {
    title: 'Blur Reveal',
    slug: 'blur-reveal',
    description:
      'Content fades in from heavy blur to sharp focus with directional movement. Supports staggered children.',
  },
  {
    title: 'Parallax Section',
    slug: 'parallax-section',
    description:
      'Elements move at different speeds on scroll creating depth. Configurable speed and direction.',
  },
  {
    title: 'Stagger Reveal',
    slug: 'stagger-reveal',
    description:
      'Container that automatically staggers its children in on scroll. Six direction modes.',
  },
  {
    title: 'Flip Text',
    slug: 'flip-text',
    description:
      'Split-flap display effect where each character flips in with 3D rotation like a departures board.',
  },
  {
    title: 'Text Scramble',
    slug: 'text-scramble',
    description:
      'Characters scramble through random chars before resolving. Multiple charsets including binary, hex, and matrix.',
  },
  {
    title: 'Floating Elements',
    slug: 'floating-elements',
    description:
      'Elements float and drift gently in random directions. Optional mouse repel physics.',
  },
  {
    title: 'Scroll Path Reveal',
    slug: 'scroll-path-reveal',
    description:
      'Organic SVG path that draws itself as you scroll. GPU-driven via framer-motion pathLength — no layout reads, buttery smooth.',
  },
  {
    title: 'Card Stack Scroll',
    slug: 'card-stack-scroll',
    description:
      'Sticky-stacked cards inspired by Olivier Larose — each card scales gently as the next slides up on top. Pure framer-motion useScroll, GPU-only transforms.',
  },
  {
    title: 'Dynamic Island',
    slug: 'dynamic-island',
    description:
      'iPhone-style notch that morphs smoothly between rich states — idle, ring, timer, record, music, maps, airdrop. Spring-physics layout animation.',
  },
  {
    title: 'Queue',
    slug: 'queue',
    description:
      'Linear-style collapsible task groups. Spring-animated section toggles, soft round checkboxes with strikethrough on complete, optional avatars and sub-text per item.',
  },
  {
    title: 'Env Vars',
    slug: 'env-vars',
    description:
      'Vercel-style environment-variable list. Monospace name, Required pill, masked dot values, per-row copy with checkmark, header eye-toggle reveals everything at once.',
  },
  {
    title: 'Tree',
    slug: 'tree',
    description:
      'File-tree with rotating chevrons, folder/file lucide icons, gutter guide lines down the indent, hover row highlight, controlled or uncontrolled expanded state.',
  },
  {
    title: 'Ticker',
    slug: 'ticker',
    description:
      'Inline stock ticker — logo, symbol, price, signed delta with up/down triangle. Flashes green/red on price change. Marquee row variant scrolls multiple tickers, pauses on hover.',
  },
  {
    title: 'Snippet',
    slug: 'snippet',
    description:
      'Install-command snippet with a tab bar (npm/pnpm/yarn/bun, or any tabs), spring-animated active pill, crossfaded code body, one-click copy with checkmark.',
  },
  {
    title: 'Live Cursors',
    slug: 'live-cursors',
    description:
      'Figma/Vercel-style multiplayer cursors with colored chat bubbles. Spring-driven movement, optional typing dots, white bubbles that pop on a dark canvas.',
  },
  {
    title: 'Status',
    slug: 'status',
    description:
      'Vercel-style service status display. Overall banner derives state from worst service (operational/degraded/outage/maintenance), per-service rows with 90-day uptime ribbons.',
  },
  {
    title: 'Diff',
    slug: 'diff',
    description:
      'GitHub-style unified code diff. File header with filename and +N/-N stats, monospace body with old + new line numbers, ± gutter glyph, tinted row backgrounds.',
  },
  {
    title: 'Logs',
    slug: 'logs',
    description:
      'Terminal-style log stream. Timestamp + colored level pill + optional [source] tag + message. Filter chips toggle visible levels, auto-scroll follows new entries.',
  },
  {
    title: 'Terminal',
    slug: 'terminal',
    description:
      'Live-looking terminal that auto-types a scripted sequence of commands + outputs. Mac-style header, blinking cursor, pause-on-hover, play/pause/replay controls, optional looping.',
  },
  {
    title: 'Schema',
    slug: 'schema',
    description:
      'Mini database ER diagram. Tables render as cards with column rows; SVG bezier lines draw between every foreign-key column and the row it references.',
  },
  {
    title: 'Deploy',
    slug: 'deploy',
    description:
      'Vercel-style deployment card. Status drives the visual: queued / building (shimmer + live elapsed counter) / ready (soft pulse) / failed (shake) / cancelled.',
  },
  {
    title: 'AI Chat',
    slug: 'ai-chat',
    description:
      'Claude/ChatGPT-style chat view with streaming text (char-by-char with a blinking caret), a thinking 3-dot indicator, and user + assistant avatars.',
  },
  {
    title: 'Globe',
    slug: 'globe',
    description:
      'GitHub-style WebGL globe (Three.js). Dotted sphere via InstancedMesh, arcs that arch ABOVE the surface, fresnel atmospheric glow, pulsing hub rings.',
  },
  {
    title: 'Notification Stack',
    slug: 'notification-stack',
    description:
      'iOS-style stacked notifications. Cards peek behind the top one when collapsed; hover fans them out with spring physics; click ✕ to dismiss with a slide-out.',
  },
  {
    title: 'Particle Field',
    slug: 'particle-field',
    description:
      'WebGL particle field (Three.js). 8000 GL points in a grid; cursor raycasts onto a plane and pushes nearby particles outward with quadratic falloff. Single draw call, custom point shader.',
  },
  {
    title: 'Hyperspeed',
    slug: 'hyperspeed',
    description:
      'Fullscreen OGL fragment shader. Warp-speed star streaks: each pixel marches outward through layered seeded star fields. Single triangle, pure GLSL.',
  },
  {
    title: 'Aurora',
    slug: 'aurora',
    description:
      'Fullscreen OGL fragment shader. Four-octave value noise warped with curl-ish offsets, mapped through a 3-color gradient to paint living aurora bands.',
  },
  {
    title: 'Mesh Gradient',
    slug: 'mesh-gradient',
    description:
      'Stripe-homepage-style fluid mesh gradient (OGL shader). Five colored blobs drift around the canvas; soft falloff + chained mix() melt adjacent colors into each other.',
  },
  {
    title: 'Nebula',
    slug: 'nebula',
    description:
      'Cosmic dust cloud with stars (OGL shader). Two parallax layers of 4-octave fbm noise generate cloud density with depth; star field overlay twinkles via sin-based brightness variation.',
  },
  {
    title: 'Accordion',
    slug: 'accordion',
    description:
      'Minimal accordion with a bouncy spring open/close. Single or multi-open, optional chevron, configurable bounciness.',
  },
  {
    title: 'Image Hover Reveal',
    slug: 'image-hover-reveal',
    description:
      'Image card whose description and CTA slide up over the image on hover. Spring-animated text lift + gentle image zoom.',
  },
  {
    title: 'Image Swap Text',
    slug: 'image-swap-text',
    description:
      'Row of avatar thumbnails over a giant headline. Hovering an avatar swaps the headline to that avatar\'s word — old letters fan outward while new letters pop in, with a tracker disc that follows the hover.',
  },
  {
    title: 'Scroll Rail',
    slug: 'scroll-rail',
    description:
      'A pinned section whose children sit in a horizontal track and slide left as the page scrolls down. Spring-smoothed, auto-measured travel distance, optional progress bar.',
  },
  {
    title: 'Tabs',
    slug: 'tabs',
    description:
      'Animated tab bar with a sliding indicator under the active tab and a fade-through on the content panel.',
  },
  {
    title: 'Hover Card',
    slug: 'hover-card',
    description:
      'Preview popup that appears with a delay on hover. Spring-positioned, fades + scales in.',
  },
  {
    title: 'Avatar Group',
    slug: 'avatar-group',
    description:
      'Stacked overlapping avatars that spread apart on hover, with an overflow chip for hidden members.',
  },
  {
    title: 'Progress Ring',
    slug: 'progress-ring',
    description:
      'Circular progress indicator with animated stroke + spring-driven center label.',
  },
  {
    title: 'Switch',
    slug: 'switch',
    description:
      'Animated toggle switch with a spring thumb. Three sizes, controlled or uncontrolled.',
  },
  {
    title: 'Toast',
    slug: 'toast',
    description:
      'Imperative toast notifications with useToast() hook, slide-in stack, intent variants (success/error/info), and auto-dismiss.',
  },
  {
    title: 'Skeleton',
    slug: 'skeleton',
    description:
      'Shimmer placeholder for loading states. Rect, circle, pill shapes plus a multi-line SkeletonText helper.',
  },
  {
    title: 'Hero Spotlight',
    slug: 'hero-spotlight',
    description:
      'Centered hero with a radial spotlight that follows the cursor. Spring-smoothed, tagline + headline + dual CTA.',
  },
  {
    title: 'Hero Marquee',
    slug: 'hero-marquee',
    description:
      'Centered hero on top of multi-row scrolling word marquees. Rows alternate direction and speed. Pauses on hover.',
  },
  {
    title: 'Hero Counter',
    slug: 'hero-counter',
    description:
      'Hero layout with a giant stat that counts up on mount, plus a column of feature blurbs.',
  },
  {
    title: 'Hero Aurora',
    slug: 'hero-aurora',
    description:
      'Centered hero with drifting blurred color blobs behind the text. Soft, brand-y, configurable palette.',
  },
  {
    title: 'Pricing Tier',
    slug: 'pricing-tier',
    description:
      'Three-tier card grid with a featured highlight + entrance stagger on scroll.',
  },
  {
    title: 'Pricing Toggle',
    slug: 'pricing-toggle',
    description:
      'Pricing grid with monthly/annual billing toggle. Numbers spring-swap between modes.',
  },
  {
    title: 'Pricing Compare',
    slug: 'pricing-compare',
    description:
      'Feature comparison table with plan headers, group rows, and a highlighted recommended column.',
  },
  {
    title: 'Footer Minimal',
    slug: 'footer-minimal',
    description:
      'Clean footer: logo + link columns + copyright. Light hover animations on links.',
  },
  {
    title: 'Footer Newsletter',
    slug: 'footer-newsletter',
    description:
      'Footer with a prominent newsletter signup row. Submit button morphs to a Subscribed! confirmation.',
  },
  {
    title: 'Footer Brand Mark',
    slug: 'footer-brand-mark',
    description:
      'Footer with a giant wordmark across the bottom that fades + drifts into place on scroll, link columns above.',
  },
  {
    title: 'Stats Grid',
    slug: 'stats-grid',
    description:
      'Section with 4 big counters that spring from 0 to their value on scroll. Optional per-tile color tint.',
  },
  {
    title: 'Testimonials Slider',
    slug: 'testimonials-slider',
    description:
      'Auto-rotating testimonial section with crossfade transitions and clickable indicator dots.',
  },
  {
    title: 'CTA Section',
    slug: 'cta-section',
    description:
      'Big call-to-action band with soft radial glows behind the headline. Customizable accent colors.',
  },
  {
    title: 'FAQ Section',
    slug: 'faq-section',
    description:
      'Two-column FAQ layout: heading on the left, accordion of questions on the right.',
  },
  {
    title: 'Logo Cloud',
    slug: 'logo-cloud',
    description:
      '"Trusted by" section with partner logos in an edge-faded marquee, or a static grid.',
  },
  {
    title: 'Bento Features',
    slug: 'bento-features',
    description:
      'Feature bento grid section with mixed-size cards, accent gradients, scroll stagger.',
  },
  {
    title: 'Divider',
    slug: 'divider',
    description:
      'Animated horizontal rule. Solid, dashed, or gradient. Optional centered label.',
  },
  {
    title: 'Banner',
    slug: 'banner',
    description:
      'Sticky announcement banner with intent variants (info/success/warning/promo), CTA, dismissible.',
  },
  {
    title: 'Breadcrumb',
    slug: 'breadcrumb',
    description:
      'Animated breadcrumb with chevron separators. Long trails collapse to a `…` menu.',
  },
  {
    title: 'Empty State',
    slug: 'empty-state',
    description:
      'No-data pattern: icon in a glow ring, heading, body, and CTAs. Animated entry.',
  },
  {
    title: 'Loader Dots',
    slug: 'loader-dots',
    description:
      'Classic three-dot typing/loading indicator. Configurable size, color, speed.',
  },
  {
    title: 'Status Pill',
    slug: 'status-pill',
    description:
      'Status badge with intent presets (online/away/busy/offline/error) and an optional pulsing dot.',
  },
  {
    title: 'Stat Card',
    slug: 'stat-card',
    description:
      'Compact data card with animated number, delta badge, and inline sparkline.',
  },
  {
    title: 'Drawer',
    slug: 'drawer',
    description:
      'Slide-in panel from any edge with a dim backdrop. Escape closes, spring entry.',
  },
  {
    title: 'Dropdown Menu',
    slug: 'dropdown-menu',
    description:
      'Animated dropdown with keyboard navigation, dividers, icons, shortcut hints, and a danger style.',
  },
  {
    title: 'Tooltip',
    slug: 'tooltip',
    description:
      'Lightweight tooltip primitive — for one-liners. Delay, side, smart entry direction.',
  },
  {
    title: 'Quote Card',
    slug: 'quote-card',
    description:
      'Pull-quote card with author avatar + role and a scroll-triggered staggered reveal.',
  },
  {
    title: 'Search Input',
    slug: 'search-input',
    description:
      'Standalone search field with an animated icon, clear button, debounced onSearch, and a loading spinner.',
  },
  {
    title: 'Sparkline',
    slug: 'sparkline',
    description:
      'Tiny SVG line chart that draws itself on mount. Optional area fill and end-point dot.',
  },
  {
    title: 'Pinned Story',
    slug: 'pinned-story',
    description:
      'A cinema-style pinned narrative section. As the user scrolls, a GSAP timeline crossfades story steps, swaps images with parallax pan, switches the giant background number, shifts an accent tint, and drives a progress bar + side dot — all locked to scroll position.',
  },
  {
    title: 'Constellation Scroll',
    slug: 'constellation-scroll',
    description:
      'GSAP + SVG section. A network/constellation diagram constructs itself stage-by-stage as the user scrolls — center node pops in, satellites stagger in, edges ink themselves, labels fade up, then pulse-dots fan outward from the center along every edge.',
  },
  {
    title: 'Mega Nav',
    slug: 'mega-nav',
    description:
      'Floating top navigation bar with a frosted-glass backdrop. Hover a menu item with `sections` and a mega-menu drops down with categorized links — height + opacity animated, content fades between items, closes when the cursor leaves.',
  },
  {
    title: 'Hero Scroll Grow',
    slug: 'hero-scroll-grow',
    description:
      'Pinned hero. Text sits over an inset image card; as the user scrolls, a GSAP timeline grows the image from 72% to full-bleed, dissolves its border-radius, fades the hero text out, and (optionally) brings in an overlay caption.',
  },
  {
    title: 'Carousel 3D',
    slug: 'carousel-3d',
    description:
      'Pinned 3D card carousel. Cards arc off to either side of an active centre card; scrubbed GSAP timeline advances `activeIndex` as the user scrolls, smoothly retargeting every card\'s translateX / translateZ / rotateY / opacity / scale.',
  },
  {
    title: 'Hero Split',
    slug: 'hero-split',
    description:
      'Pinned hero with two 50/50 columns of stacked content that scroll in opposite Y directions (left up, right down). Past `reveal` (default 0.7) of the pin, a centred card fades in over both halves with a backdrop blur — the "meeting" moment.',
  },
  {
    title: 'Phrase Slots',
    slug: 'phrase-slots',
    description:
      'A slot-machine for words. Each "slot" is a single-line window with a tall column of candidate words behind it; scroll spins each column through multiple cycles, lands on the target with a staggered ending. Final state: a complete sentence reading across the row, underlined in the accent color.',
  },
  {
    title: 'Magnetic Field',
    slug: 'magnetic-field',
    description:
      'A pinned scroll section that pairs cursor magnetism with a scroll-driven wave. A canvas dot lattice repels around your cursor with a spring while a glowing accent line sweeps top-to-bottom; each headline locks in as the wave passes it, then a description and CTA fade in.',
  },
  {
    title: 'Portal Scroll',
    slug: 'portal-scroll',
    description:
      "Pinned scroll section built around one image: you're outside a moody scene, a circular portal opens in the centre and grows to consume the viewport, revealing a completely different scene inside. Cursor parallax inside the portal sells the depth, the inner headline arrives letter-by-letter, and a spinning conic-gradient rim with a scan dot rides the portal edge until it fills the screen.",
  },
  {
    title: 'Cursor Lens',
    slug: 'cursor-lens',
    description:
      "An invisible cursor mask that reveals a different scene underneath as you hover. No ring, no chrome — just a soft radial fade so the boundary between the two scenes is impossible to spot. The inner image is gently magnified at the cursor focal point, the inner text is drawn crisp on top, and a click pins the lens at that spot so you can step back and look.",
  },
  {
    title: 'Glitch Headline',
    slug: 'glitch-headline',
    description:
      'A CRT-damaged display headline. Cyan + magenta channels drift in idle wobble; on hover a clip-path band sweeps the text and slices it horizontally, shifting chunks a few pixels out of register. Pure CSS, no animation loop, no JS runtime cost.',
  },
  {
    title: 'Type Tunnel',
    slug: 'type-tunnel',
    description:
      'A pinned scroll section that turns a list of headlines into a Z-axis tunnel. Each line lives at a different depth in 3D space; scrolling moves the camera forward through them so they arrive from the vanishing point, swell to fill the viewport, then pass behind you. One final standing headline lands at the end.',
  },
  {
    title: 'Paper Tear',
    slug: 'paper-tear',
    description:
      'Two sheets of paper stacked on top of each other. As you scroll into the section, the top sheet tears off along a deterministic jagged SVG path and lifts away with a subtle tilt + fade, revealing the bottom sheet. Both halves carry a paper-grain texture so the tear reads physical.',
  },
  {
    title: 'Liquid Letters',
    slug: 'liquid-letters',
    description:
      'A typography effect that makes letters look like blobs of liquid. The classic CSS-goo SVG filter (Gaussian blur + alpha-tightening colour matrix) is applied to both the SVG text AND a cursor-following blob — so the blob bonds with whichever letters it touches and pulls them into a single fluid shape.',
  },
  {
    title: 'Depth Cards',
    slug: 'depth-cards',
    description:
      'A 3D diorama. Layered cards sit at different Z depths inside a perspective container; moving your cursor tilts the camera so the cards parallax against each other. Spring-eased tilt, per-card counter-parallax, depth-falloff glow halos — look-around at depth, no scroll required.',
  },
  {
    title: 'Wave Text',
    slug: 'wave-text',
    description: 'A line of text where each character undulates in a sine wave with a staggered phase. Pure CSS — no JS animation loop.',
  },
  {
    title: 'Disperse Text',
    slug: 'disperse-text',
    description: 'Letters explode away from their resting position on hover then settle back when the cursor leaves. Per-character offsets seeded by index for stable layout.',
  },
  {
    title: 'Magnetic Text',
    slug: 'magnetic-text',
    description: 'Every character has a magnetic pull toward the cursor — yanked along the cursor vector with strength proportional to proximity, lerped per frame for a spring-like feel.',
  },
  {
    title: 'Variable Font Morph',
    slug: 'variable-font-morph',
    description: "Each character animates its `font-variation-settings: 'wght'` axis between two values with a staggered phase. Works with any variable font that exposes a weight axis.",
  },
  {
    title: 'Neon Pulse',
    slug: 'neon-pulse',
    description: "Text wearing a neon sign's glow: layered text-shadows at increasing radii, a breathing opacity pulse, and an occasional flicker that punches brightness down — like a real broken sign.",
  },
  {
    title: 'Gradient Flow',
    slug: 'gradient-flow',
    description: 'Text whose fill is a linear gradient sized 300% of the text width; animating background-position slides the colors through the glyphs in a seamless loop.',
  },
  {
    title: 'Holo Text',
    slug: 'holo-text',
    description: 'Holographic text: a cyan layer and a magenta layer drift in opposite directions behind a white base layer, blending in `screen` mode so the overlap reads white but the fringes glow.',
  },
  {
    title: 'Shine Sweep',
    slug: 'shine-sweep',
    description: 'A bright "shine" stripe sweeps diagonally across the text. Background-clip: text + animated background-position. Runs continuously or only on hover.',
  },
  {
    title: 'Char Spring',
    slug: 'char-spring',
    description: 'Each character springs up from below when the element enters the viewport. Container overflow-hidden + per-char delay for a typewriter-with-bounce feel.',
  },
  {
    title: 'Stretch Text',
    slug: 'stretch-text',
    description: 'On hover, each character stretches horizontally via `transform: scaleX`. Staggered per-char delays make the stretch read as a wave through the line.',
  },
  {
    title: 'Time Dial',
    slug: 'time-dial',
    description: 'A pinned scroll section built around a giant rotating dial. Chapters sit around the perimeter at evenly-spaced angles; scroll rotates the dial clockwise so each chapter passes under a top pointer, and the content panel on the right crossfades to that chapter.',
  },
  {
    title: 'Cinema Reel',
    slug: 'cinema-reel',
    description: 'A pinned scroll section that unspools a horizontal film strip from vertical scroll. Reel hubs spin at the edges, sprocket holes line the top and bottom, the centered frame pops forward, and the rest dim — like a real projector.',
  },
  {
    title: 'Vinyl Player',
    slug: 'vinyl-player',
    description: 'A turntable with a spinning vinyl record + tonearm that rotates to drop into each track. Per-track info panel + a live waveform highlights the active track. Pure scroll-driven motion.',
  },
  {
    title: 'Receipt Unroll',
    slug: 'receipt-unroll',
    description: "A paper receipt unrolls from a printer slot at the top as you scroll. Header, line items type in one at a time, subtotal/total animate at the bottom, scalloped edges + barcode at the very bottom.",
  },
  {
    title: 'Orbital Menu',
    slug: 'orbital-menu',
    description: 'A FAB-style trigger button that fans its menu items outward along an arc on click. Per-item spring stagger, configurable direction (top / right / bottom / left / circle), click outside or Escape to close.',
  },
  {
    title: 'Habit Heatmap',
    slug: 'habit-heatmap',
    description: 'GitHub-style contribution grid. 7 rows × N weeks, cell intensity scales with value through a 5-step accent ramp. Weekday axis, month markers, "Less → More" legend, hover tooltips. Drop in data — or fall back to a stable demo grid.',
  },
  {
    title: 'Cassette Tape',
    slug: 'cassette-tape',
    description: 'Vintage audio cassette with rotating reels, tape line between them, label with side/title/duration, play/pause button, and a 3D flip to switch between A-side and B-side.',
  },
  {
    title: 'Liquid Toggle',
    slug: 'liquid-toggle',
    description: 'Toggle switch with a goo-filter handle that morphs between off and on positions like a fluid blob, bonding with small anchor dots at each end as it passes through.',
  },
  {
    title: 'Like Burst',
    slug: 'like-burst',
    description: 'Heart button that fills + scales + emits a radial particle burst on click. Click again to un-like (no burst). Controlled or uncontrolled, optional running count.',
  },
  {
    title: 'Mood Slider',
    slug: 'mood-slider',
    description: 'A slider whose handle is an SVG smiley that morphs through expressions as you drag — eyes, brows, mouth, cheeks all interpolate. Track gradient shifts through a hue range in step.',
  },
  {
    title: 'Spotlight Tour',
    slug: 'spotlight-tour',
    description:
      'Interactive onboarding overlay. Dim the page, cut a soft-cornered glowing hole around the active target via the box-shadow technique, anchor a tooltip with prev/next/skip and step dots. Auto-measure, auto-scroll, auto-flip placement, keyboard nav.',
  },
]
