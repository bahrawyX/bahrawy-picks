'use client'

import {
  Carousel3D,
  type Carousel3DCard,
} from '@/components/bahrawy/carousel-3d'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const CARDS: Carousel3DCard[] = [
  {
    id: 'one',
    eyebrow: 'Atelier · 01',
    title: 'Quiet geometry.',
    description: 'Long shadows, clean light. The kind of room that makes a quiet decision look loud.',
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'two',
    eyebrow: 'Atelier · 02',
    title: 'Spring into life.',
    description: 'Spring physics on every interaction — the difference between a UI you use and one you feel.',
    image: 'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'three',
    eyebrow: 'Atelier · 03',
    title: 'Pixel-perfect.',
    description: 'The polish you would have applied last is the polish you get on day one.',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'four',
    eyebrow: 'Atelier · 04',
    title: 'Made to ship.',
    description: 'Production-tested in dark, in light, across browsers, on devices.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'five',
    eyebrow: 'Atelier · 05',
    title: 'A way out.',
    description: 'Pack light. Leave early. Take the long road back — the one that bends through the hills.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'six',
    eyebrow: 'Atelier · 06',
    title: 'Still water.',
    description: 'A morning where the surface holds the sky perfectly. No wind. No reason to move.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=80&auto=format&fit=crop',
  },
]

const SNIPPET = `import { Carousel3D } from '@/components/bahrawy/carousel-3d'

const cards = [
  { id: 'one', title: 'Quiet geometry.', image: '/01.jpg', description: '…' },
  { id: 'two', title: 'Spring into life.', image: '/02.jpg', description: '…' },
  // … more cards
]

<Carousel3D
  cards={cards}
  scrollLength={3.5}
  spacing={320}
  depth={200}
  angle={22}
  eyebrow="Selected work"
  heading="The set, scrolled."
/>`

export default function Carousel3DDocs() {
  return (
    <DocsPage
      title="Carousel 3D"
      slug="carousel-3d"
      description="A pinned Cover Flow-style carousel. As the user scrolls, an activeIndex advances and every card retargets its translateX, translateZ, rotateY, opacity, and scale based on its offset from active. Looks like a flat row, feels like a 3D arc."
      category="125 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section — the active card stays centred while side cards fan off in 3D. Keep scrolling to walk through every card in the deck."
      >
        <p className="text-xs text-white/40">↓ scroll in</p>
      </DocsSection>

      <Carousel3D
        cards={CARDS}
        eyebrow="Selected work"
        heading="The set, scrolled."
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Pin', 'Section is `(scrollLength + 1) * 100vh` tall. Inner div pins for `scrollLength` viewports of scroll; the extra +1 is release room so the next section eases in.'],
            ['activeIndex', "ScrollTrigger's progress (0–1) is multiplied by `cards.length − 1` to get a continuous activeIndex like 2.4. Drives every card on every frame."],
            ['Per-card transform', "For card at index i and activeIndex a:\n  x = (i − a) · spacing\n  z = −|i − a| · depth\n  rotateY = −(i − a) · angle\n  opacity = max(0.18, 1 − |i − a| · 0.32)\n  scale   = max(0.78, 1 − |i − a| · 0.07)"],
            ['z-index', 'Cards closer to active get higher z-index so the active card never clips behind a side card\'s edge.'],
            ['Perspective', '`perspective: 1400px` on the stage + `transformStyle: preserve-3d` on the inner ring make rotateY genuinely 3D, not faked.'],
            ['No auto-play', 'Everything runs via `ScrollTrigger.scrub`. Stop scrolling, the carousel stops. No setInterval, no rAF battle.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 whitespace-pre-line text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['cards', 'Carousel3DCard[] — { id, title, eyebrow?, description?, image?, background?, foreground? }'],
            ['scrollLength', 'Pin duration in viewport heights. Default 3.5.'],
            ['spacing', 'Horizontal spacing between adjacent cards (px). Default 320.'],
            ['depth', 'How far back side cards sit in 3D (px). Default 200.'],
            ['angle', 'Degrees of rotateY per card distance from active. Default 22.'],
            ['eyebrow', 'Optional tag rendered above the stage.'],
            ['heading', 'Optional headline rendered above the stage.'],
            ['className', 'Extra classes on the outer section.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['gsap', '@gsap/react'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
