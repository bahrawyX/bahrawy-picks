'use client'

import { TypeTunnel, type TypeTunnelLine } from '@/components/bahrawy/type-tunnel'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const LINES: TypeTunnelLine[] = [
  { eyebrow: '01', text: 'Design' },
  { eyebrow: '02', text: 'Ship' },
  { eyebrow: '03', text: 'Iterate' },
  { eyebrow: '04', text: 'Repeat' },
]

const SNIPPET = `import { TypeTunnel } from '@/components/bahrawy/type-tunnel'

const lines = [
  { eyebrow: '01', text: 'Design'  },
  { eyebrow: '02', text: 'Ship'    },
  { eyebrow: '03', text: 'Iterate' },
  { eyebrow: '04', text: 'Repeat'  },
]

<TypeTunnel
  lines={lines}
  finalLine={{ eyebrow: 'and again', text: 'Until it lands.' }}
  cta={{ label: 'Get started' }}
  scrollLength={4}
  accentColor="#A78BFA"
/>`

export default function TypeTunnelDocs() {
  return (
    <DocsPage
      title="Type Tunnel"
      slug="type-tunnel"
      description="A pinned scroll section that turns a list of headlines into a Z-axis tunnel. Each line lives at a different depth in 3D space; scrolling moves the camera forward through them so they arrive from the vanishing point, swell to fill the viewport, then keep going and exit behind you. One final standing headline lands at the end."
      category="106 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section. Each headline flies in from the back of the tunnel, peaks at the camera, then passes through."
      >
        <p className="text-xs text-white/40">↓ scroll forward</p>
      </DocsSection>

      <TypeTunnel
        lines={LINES}
        finalLine={{ eyebrow: 'and again', text: 'Until it lands.' }}
        cta={{ label: 'Get started' }}
        scrollLength={4}
        accentColor="#A78BFA"
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Perspective container', "The pinned area has `perspective: 1200px`. Inside it, a wrapper has `transform-style: preserve-3d` so each line's `translateZ` actually pushes it back in space."],
            ['Per-line base Z', "Line `i` starts at `z = -i × spacing` (default spacing 600px). The first line is just behind the camera; subsequent lines stack further back."],
            ['Scrubbed progress', "`ScrollTrigger.onUpdate` writes `progress` (0–1) into a ref. A single RAF loop reads it and shifts every line's Z by `progress × travel` (default 2400px)."],
            ['Opacity envelope', "We compute opacity per-line per-frame: fade in as the line enters `nearLimit` from behind, full at z ≈ 0, fade out as it passes `closeLimit` in front. Off-screen lines are skipped entirely so the browser isn't compositing 50 invisible spans."],
            ['Final landing', "A non-3D headline + CTA sit OUTSIDE the perspective scene. They fade in via separate ScrollTriggers timed to the last 15% of the pin so the user has something to read at the end."],
            ['Dot grid + vignette', "A radially-masked dot grid behind the scene sells the perspective — gives the eye something to register the depth against. Subtle accent vignette tints the tunnel."],
            ['Reduced motion', "The pin + scroll work regardless; per-frame computations are minimal (transform + opacity writes). No CSS keyframes to gate."],
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
            ['lines', 'TypeTunnelLine[] — each `{ text, eyebrow? }`. Order = traversal order.'],
            ['finalLine', 'TypeTunnelLine — the standing headline that lands at the end. Fades in at 85–97% of progress.'],
            ['cta', '{ label, href?, onClick? } — final call-to-action below the final line.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 4.'],
            ['travel', 'Total Z-axis travel in px. Default 2400.'],
            ['spacing', 'Initial gap between lines along Z. Default 600.'],
            ['accentColor', 'Vignette tint + final-line text shadow. Default #A78BFA.'],
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
