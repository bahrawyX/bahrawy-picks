'use client'

import {
  MagneticField,
  type MagneticFieldLine,
} from '@/components/bahrawy/magnetic-field'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const LINES: MagneticFieldLine[] = [
  { eyebrow: 'one', text: 'Move the field.' },
  { eyebrow: 'two', text: 'Scroll the wave.' },
  { eyebrow: 'three', text: 'Watch it land.' },
]

const SNIPPET = `import { MagneticField } from '@/components/bahrawy/magnetic-field'

const lines = [
  { eyebrow: 'one',   text: 'Move the field.'  },
  { eyebrow: 'two',   text: 'Scroll the wave.' },
  { eyebrow: 'three', text: 'Watch it land.'   },
]

<MagneticField
  eyebrow="v1.0 — interactive"
  lines={lines}
  description="A dot field that bends around your cursor and lights up under a scroll-driven wave."
  cta={{ label: 'Get started', href: '/docs' }}
  accentColor="#22D3EE"
  scrollLength={3}
/>`

export default function MagneticFieldDocs() {
  return (
    <DocsPage
      title="Magnetic Field"
      slug="magnetic-field"
      description="A pinned scroll section that pairs cursor magnetism with a scroll-driven wave. A canvas dot lattice repels around your cursor with a spring while a glowing accent line sweeps top-to-bottom; each headline locks in as the wave passes it, then a description and CTA fade in."
      category="120 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section to drive the wave. Move your mouse around to deform the dot lattice in real time."
      >
        <p className="text-xs text-white/40">↓ scroll in, then move your cursor</p>
      </DocsSection>

      <MagneticField
        eyebrow="v1.0 — interactive"
        lines={LINES}
        description="The dot field is canvas-driven and DPR-aware; the wave is locked to scroll progress. Cursor magnetism runs in a single RAF loop so it stays smooth even at high grid density."
        cta={{ label: 'Get started' }}
        accentColor="#22D3EE"
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Cursor magnetism', "Every dot has a base position and a spring-eased current position. When the cursor is within `magnetRadius` (default 150px), the dot is pushed away with strength `(1 − dist/radius)² × magnetStrength`. Spring step is semi-implicit Euler with 0.18 stiffness and 0.78 damping."],
            ['Scroll wave', "ScrollTrigger.onUpdate writes `progress` (0–1) into a ref. Each frame, `waveY = −8% + progress × 116%` of the viewport height — so the wave enters from above and exits below, touching every row."],
            ['Wave glow', "Dots within `12% × viewportHeight` of the wave get scaled up by up to 2.2× and tinted toward the accent color with a `shadowBlur` proportional to proximity. A faint horizontal band gradient sits behind them for ambient bloom."],
            ['Line lock-in', "Headlines are stacked vertically and tied to scroll progress in even fractions. As the wave's progress crosses each line's `stageProgress`, that line fades + lifts + scales to 1 — locked in. Reverse on scroll-up."],
            ['Canvas + DPR', "Canvas is sized to `viewport × devicePixelRatio` and the context is scaled via `setTransform(dpr,0,0,dpr,0,0)`. Stays crisp on retina without doubling the CPU cost of the dot loop."],
            ['Reduced motion', "If the user has `prefers-reduced-motion`, the cursor still works but the wave is gentler. (You can also gate the section entirely if desired.)"],
            ['Composition', "Description + CTA each get their own ScrollTrigger with `toggleActions: 'play none none reverse'` so scrolling back up unwinds the reveal cleanly."],
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
            ['lines', 'MagneticFieldLine[] — each `{ text, eyebrow? }`. Stacked vertically; lock in left-to-top in scroll order.'],
            ['eyebrow', 'Tiny tag above the stack. Renders with a glowing accent dot.'],
            ['description', 'Sub-copy that fades in once every line has landed.'],
            ['cta', '{ label, href?, onClick? } — final call-to-action with a soft accent glow.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 3.'],
            ['accentColor', 'Wave + dot glow color. Default #22D3EE (cyan).'],
            ['gridDensity', 'Number of dot columns; rows derive from viewport ratio. Default 26.'],
            ['magnetRadius', 'Cursor-influence radius in px. Default 150.'],
            ['magnetStrength', 'Max pixel displacement at the cursor centre. Default 32.'],
            ['className', 'Extra classes on the outer wrapper.'],
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
