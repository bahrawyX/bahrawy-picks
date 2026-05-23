'use client'

import {
  Atom,
  Braces,
  Sparkles,
  Triangle,
  Wind,
  Zap,
  Hexagon,
  Layers,
  Boxes,
} from 'lucide-react'
import {
  ConstellationScroll,
  type ConstellationNode,
} from '@/components/bahrawy/constellation-scroll'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const NODES: ConstellationNode[] = [
  { id: 'react', icon: <Atom strokeWidth={2.2} />, label: 'React 19', accent: '#22D3EE' },
  { id: 'next', icon: <Triangle strokeWidth={2.2} />, label: 'Next.js 15', accent: '#FFFFFF' },
  { id: 'tw', icon: <Wind strokeWidth={2.2} />, label: 'Tailwind', accent: '#38BDF8' },
  { id: 'fm', icon: <Sparkles strokeWidth={2.2} />, label: 'Framer Motion', accent: '#A78BFA' },
  { id: 'gsap', icon: <Zap strokeWidth={2.2} />, label: 'GSAP', accent: '#34D399' },
  { id: 'ts', icon: <Braces strokeWidth={2.2} />, label: 'TypeScript', accent: '#60A5FA' },
  { id: 'lucide', icon: <Hexagon strokeWidth={2.2} />, label: 'Lucide', accent: '#F472B6' },
  { id: 'dnd', icon: <Layers strokeWidth={2.2} />, label: 'dnd-kit', accent: '#FBBF24' },
  { id: 'shadcn', icon: <Boxes strokeWidth={2.2} />, label: 'shadcn/ui', accent: '#A3E635' },
]

const SNIPPET = `import { ConstellationScroll } from '@/components/bahrawy/constellation-scroll'
import { Atom, Triangle, Wind, Sparkles, Zap, Braces } from 'lucide-react'

const nodes = [
  { id: 'react', icon: <Atom />,      label: 'React 19',       accent: '#22D3EE' },
  { id: 'next',  icon: <Triangle />,  label: 'Next.js 15',     accent: '#FFFFFF' },
  { id: 'tw',    icon: <Wind />,      label: 'Tailwind',       accent: '#38BDF8' },
  // … more
]

<ConstellationScroll
  eyebrow="How it fits together"
  heading="One library. Every piece in its place."
  description="Every dependency, a node — connected, but standalone."
  nodes={nodes}
  accentColor="#A78BFA"
/>`

export default function ConstellationScrollDocs() {
  return (
    <DocsPage
      title="Constellation Scroll"
      slug="constellation-scroll"
      description="A pinned scroll section that opens with every node stacked at the same point in the centre of the canvas. As you scroll, the nodes fan outward into a perfect circular constellation, then connecting lines draw in between adjacent nodes to complete the shape."
      category="104 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll in — the stack at the centre fans out into a ring, then the lines connect."
      >
        <p className="text-xs text-white/40">↓ scroll to form</p>
      </DocsSection>

      <ConstellationScroll
        eyebrow="How it fits together"
        heading="Every piece, its own place."
        description="Each dependency starts in the same spot. Scrolling separates them into a clean ring — connected, but distinct."
        nodes={NODES}
        cta={{ label: 'Browse components' }}
        scrollLength={2.6}
        accentColor="#A78BFA"
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Initial stack', 'Every node is absolutely centred at (0, 0) of the stage with scale 0.78, so the start state reads as ONE circle rather than N overlapping ones.'],
            ['Radial fan-out', "One tweened progress value (0 → 1, `power3.out`) drives every node's `translate3d(R × p × cos θ, R × p × sin θ, 0)` per frame. θ is the node's evenly-spaced slot on the ring (-π/2 starts at the top, walks clockwise)."],
            ['Adaptive radius', 'The stage measures itself on mount + resize. The ring radius scales with `min(width, height) / 2 - nodeSize/2 - 24px`, so the constellation always fits the viewport without clipping.'],
            ['Per-node scale-up', 'Nodes also scale from 0.78 → 1 as they spread, so they emerge from the centre instead of just translating.'],
            ['Lines draw in', 'Adjacent nodes are connected via SVG `<line>` elements. Each line uses `getTotalLength()` to set its dasharray; the timeline animates dashoffset to 0 once the ring has settled.'],
            ['Labels last', "Per-node labels sit just below each circle and fade up at 65% of the timeline — once nodes are mostly in place — so they don't look like a soup of text during the spread."],
            ['Scrubbed', 'Whole sequence is locked to scroll via `ScrollTrigger.scrub`. Scrolling back reverses cleanly all the way to the stack.'],
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
            ['nodes', 'ConstellationNode[] — { id, icon?, label?, accent? }. Order = the slot order around the ring (clockwise from top).'],
            ['eyebrow', 'Tiny tag above the heading.'],
            ['heading', 'Section headline at the top.'],
            ['description', 'Sub-copy beneath the heading.'],
            ['cta', '{ label, href?, onClick? } — call-to-action at the bottom, fades in after the ring settles.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 2.4.'],
            ['radius', "Ring radius as a fraction of the smaller stage dimension. Default 0.62."],
            ['nodeSize', 'Diameter of each node in px. Default 64.'],
            ['drawLinks', 'Draw connecting lines between adjacent nodes. Default true.'],
            ['accentColor', 'Default accent for nodes without their own. Default #A78BFA.'],
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
          {['gsap', '@gsap/react', 'lucide-react'].map((d) => (
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
