'use client'

import {
  Atom,
  Braces,
  Sparkles,
  Triangle,
  Wind,
  Zap,
  Hexagon,
} from 'lucide-react'
import {
  ConstellationScroll,
  type ConstellationNode,
} from '@/components/bahrawy/constellation-scroll'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

// Hexagon positions around center (50, 50) with radius 32 (in viewBox %).
//   0deg   →  (82.0, 50.0)
//  60deg   →  (66.0, 77.7)
// 120deg   →  (34.0, 77.7)
// 180deg   →  (18.0, 50.0)
// 240deg   →  (34.0, 22.3)
// 300deg   →  (66.0, 22.3)
const NODES: ConstellationNode[] = [
  {
    id: 'core',
    label: 'Bahrawy',
    icon: <Hexagon strokeWidth={2.5} />,
    x: 50,
    y: 50,
    variant: 'center',
    color: '#FFFFFF',
  },
  {
    id: 'react',
    label: 'React 19',
    icon: <Atom strokeWidth={2.2} />,
    x: 82,
    y: 50,
    color: '#22D3EE',
  },
  {
    id: 'next',
    label: 'Next.js 15',
    icon: <Triangle strokeWidth={2.2} />,
    x: 66,
    y: 77.7,
    color: '#FFFFFF',
  },
  {
    id: 'tw',
    label: 'Tailwind',
    icon: <Wind strokeWidth={2.2} />,
    x: 34,
    y: 77.7,
    color: '#38BDF8',
  },
  {
    id: 'fm',
    label: 'Framer Motion',
    icon: <Sparkles strokeWidth={2.2} />,
    x: 18,
    y: 50,
    color: '#A78BFA',
  },
  {
    id: 'gsap',
    label: 'GSAP',
    icon: <Zap strokeWidth={2.2} />,
    x: 34,
    y: 22.3,
    color: '#34D399',
  },
  {
    id: 'ts',
    label: 'TypeScript',
    icon: <Braces strokeWidth={2.2} />,
    x: 66,
    y: 22.3,
    color: '#60A5FA',
  },
]

const SNIPPET = `import { ConstellationScroll } from '@/components/bahrawy/constellation-scroll'

const nodes = [
  { id: 'core',  label: 'Bahrawy',       x: 50, y: 50,   variant: 'center' },
  { id: 'react', label: 'React 19',      x: 82, y: 50 },
  { id: 'next',  label: 'Next.js 15',    x: 66, y: 77.7 },
  // … more satellites
]

<ConstellationScroll
  eyebrow="How it fits together"
  title="One library. Every piece in its place."
  description="A small core, a wide surface."
  nodes={nodes}
  accentColor="#A78BFA"
/>`

export default function ConstellationScrollDocs() {
  return (
    <DocsPage
      title="Constellation Scroll"
      slug="constellation-scroll"
      description="A pinned scroll section where a network diagram constructs itself in 5 staged passes as you scroll. Pure GSAP + SVG — no extra plugins beyond ScrollTrigger. The whole sequence is one scrubbed timeline so the diagram is locked to scroll position."
      category="97 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section — it pins and the constellation builds. Keep scrolling to release."
      >
        <p className="text-xs text-white/40">↓ scroll in</p>
      </DocsSection>

      <ConstellationScroll
        eyebrow="How it fits together"
        title="One library. Every piece in its place."
        description="A small core, a wide surface. Every component is a node — connected, but standalone."
        nodes={NODES}
        accentColor="#A78BFA"
        scrollLength={4}
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Stages">
        <ol className="grid gap-2 sm:grid-cols-2">
          {[
            ['Stage 1 · Center pop', 'Center node scales 0.3 → 1 with a back-ease overshoot. autoAlpha 0 → 1.'],
            ['Stage 2 · Satellites', 'Each satellite scales + fades in, staggered 25ms apart.'],
            ['Stage 3 · Edges ink', 'Each line uses `getTotalLength()` to set its own dasharray, then animates dashoffset from full → 0. True SVG path-draw.'],
            ['Stage 4 · Labels', 'HTML pills next to every node fade up. Positioned by computing the radial vector outward from the center.'],
            ['Stage 5 · Pulses', 'Pulse-dots fan out from the center along every edge, fade in, travel via `cx`/`cy` tweens, fade out as they arrive.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ol>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['nodes', 'ConstellationNode[] — { id, label, x (0-100), y (0-100), variant?, color? }'],
            ['edges', 'Pairs of node IDs to draw. Defaults to every satellite connected to the first center.'],
            ['eyebrow', 'Small tag above the title.'],
            ['title', 'Section headline above the diagram.'],
            ['description', 'Sub-copy below the diagram.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 4.'],
            ['accentColor', 'Color for edges + pulses. Default #A78BFA.'],
            ['className', 'Extra classes on the section.'],
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
