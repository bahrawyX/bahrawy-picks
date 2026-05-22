'use client'

import {
  DepthCards,
  type DepthCardItem,
} from '@/components/bahrawy/depth-cards'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

// Deliberate composition — front card anchors lower-left, middle pair
// fans to the upper-right, back cards drift toward the corners. Reads
// as a planned diorama, not a scatter.
const ITEMS: DepthCardItem[] = [
  {
    id: 'front',
    depth: 0,
    eyebrow: 'foreground',
    title: 'In your face.',
    body: 'The closest card. Reads first, moves least.',
    accent: '#F472B6',
    x: 32,
    y: 58,
    width: 30,
    image:
      'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'mid-a',
    depth: 1,
    eyebrow: 'one back',
    title: 'A step behind.',
    body: 'Picks up a bit of camera parallax.',
    accent: '#A78BFA',
    x: 66,
    y: 42,
    width: 28,
  },
  {
    id: 'mid-b',
    depth: 1.6,
    eyebrow: 'one back',
    title: 'Another layer.',
    body: 'Same depth band, balances the composition.',
    accent: '#22D3EE',
    x: 72,
    y: 72,
    width: 24,
  },
  {
    id: 'back-a',
    depth: 2.4,
    eyebrow: 'far',
    title: 'Way back there.',
    body: 'Drifts more, scales smaller — sells the depth.',
    accent: '#FBBF24',
    x: 20,
    y: 26,
    width: 22,
  },
  {
    id: 'back-b',
    depth: 3.2,
    eyebrow: 'horizon',
    title: 'On the horizon.',
    body: 'Almost background. Soft. Atmospheric.',
    accent: '#34D399',
    x: 52,
    y: 18,
    width: 20,
  },
]

const SNIPPET = `import { DepthCards } from '@/components/bahrawy/depth-cards'

const items = [
  { id: 'front',  depth: 0,   x: 30, y: 55, width: 28,
    title: 'In your face.',  body: 'The closest card.',
    accent: '#F472B6', image: '/photo.jpg' },
  { id: 'mid-a',  depth: 1,   x: 62, y: 38, width: 32,
    title: 'A step behind.',  accent: '#A78BFA' },
  { id: 'back',   depth: 2.2, x: 18, y: 28, width: 26,
    title: 'Way back there.', accent: '#FBBF24' },
  // …
]

<DepthCards items={items} tiltStrength={10} zSpacing={220} />`

export default function DepthCardsDocs() {
  return (
    <DocsPage
      title="Depth Cards"
      slug="depth-cards"
      description="A 3D diorama. Layered cards sit at different Z depths inside a perspective container; moving your cursor over the scene tilts the camera so the cards parallax against each other. Spring-eased tilt, per-card counter-parallax, depth-falloff glow halos — look-around at depth, no scroll required."
      category="109 · interactive"
    >
      <DocsSection
        title="Live demo"
        description="Move your cursor around the canvas. The camera tilts in response and the cards drift apart at different rates based on their depth."
      >
        <p className="text-xs text-white/40">↓ move your cursor</p>
      </DocsSection>

      <DepthCards items={ITEMS} />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the depth works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Perspective + preserve-3d', "The canvas has `perspective: 1200px`. Inside it, a pivot div has `transform-style: preserve-3d` so children's `translateZ` actually goes into 3D space."],
            ['Per-card depth → Z', "Each card declares a `depth` number (0 = closest). The RAF loop writes `transform: translate3d(tx, ty, -depth × zSpacing) scale(1 − depth × 0.04)`. Scaling cards down with depth compensates for narrow perspective so the diorama reads on flat screens too."],
            ['Camera tilt', "Pointer position is normalised to [-1, 1] across the canvas. The pivot's `rotateY` follows the X axis, `rotateX` follows the Y (inverted) — at `tiltStrength` (default 10°) at the corners. Eased via a 0.08 lerp so it settles."],
            ['Counter-parallax', "Each card additionally translates by `cursorX × depth × 8` on X and `cursorY × depth × 6` on Y. Deeper cards drift further, near cards drift less — emphasises the depth illusion in the same direction as parallax in the real world."],
            ['Depth-falloff glow', "Behind each card sits a radial gradient halo in the card's accent color. Opacity falls off with depth (`1 − depth × 0.18`, min 0.25) so far cards atmospherically dim."],
            ['Paint order', "Items are sorted by depth (deepest first) for the actual paint so front cards sit on top. `preserve-3d` handles this for real Z, but sorting is a safety net for any browser quirks."],
            ['No scroll needed', "This is an interactive component — works on hover/cursor input alone. Drop it anywhere on a page as a hero panel or feature spotlight."],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['items', 'DepthCardItem[] — each card declares its own depth, x/y anchor, width, accent, content, and optional image.'],
            ['tiltStrength', 'Maximum camera tilt at the corner, in degrees. Default 10.'],
            ['zSpacing', 'Pixels of Z separation per unit of depth. Default 220.'],
            ['perspective', 'CSS perspective distance in px. Default 1200.'],
            ['lerp', 'Tilt smoothing lerp factor. Default 0.08.'],
            ['aspect', 'CSS aspect-ratio for the canvas. Default "16 / 9".'],
            ['className', 'Extra classes on the canvas.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="text-xs text-white/55">No external runtime dependencies. Just React + CSS 3D transforms.</div>
      </DocsSection>
    </DocsPage>
  )
}
