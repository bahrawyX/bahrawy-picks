'use client'

import { CometTrail, type CometWaypoint } from '@/components/bahrawy/comet-trail'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const WAYPOINTS: CometWaypoint[] = [
  { id: 'w1', at: 0.18, x: 22, y: 60, eyebrow: 'first',  title: 'A flicker.',     body: 'Cold, far. Not yet beautiful.',      accent: '#22D3EE' },
  { id: 'w2', at: 0.40, x: 42, y: 38, eyebrow: 'second', title: 'It starts to draw.', body: 'A line behind it begins to glow.', accent: '#A78BFA' },
  { id: 'w3', at: 0.62, x: 60, y: 56, eyebrow: 'third',  title: 'Now it is doing the thing.', body: 'A complete arc through nothing.', accent: '#F472B6' },
  { id: 'w4', at: 0.84, x: 84, y: 22, eyebrow: 'fourth', title: 'And then it is gone.', body: 'Only the path remains, faint, slow to dim.', accent: '#FBBF24' },
]

const SNIPPET = `import { CometTrail } from '@/components/bahrawy/comet-trail'

const waypoints = [
  { id: 'w1', at: 0.18, x: 22, y: 60, title: 'A flicker.', body: '…' },
  { id: 'w2', at: 0.40, x: 42, y: 38, title: 'It starts to draw.' },
  { id: 'w3', at: 0.62, x: 60, y: 56, title: 'Now it is doing the thing.' },
  { id: 'w4', at: 0.84, x: 84, y: 22, title: 'And then it is gone.' },
]

<CometTrail
  eyebrow="Trajectory"
  waypoints={waypoints}
  cta={{ label: 'Trace it' }}
  accentColor="#22D3EE"
/>`

export default function CometTrailDocs() {
  return (
    <DocsPage
      title="Comet Trail"
      slug="comet-trail"
      description="A comet flies across a starfield along an SVG path as you scroll. A glowing trail draws in behind it; waypoint stars light up and surface content cards as the comet passes."
      category="125 · gsap-section"
    >
      <DocsSection title="Live demo" description="Scroll into the section — the comet flies, the trail draws in behind it, content cards surface at each waypoint.">
        <p className="text-xs text-white/40">↓ scroll · let it fly</p>
      </DocsSection>

      <CometTrail
        eyebrow="Trajectory"
        waypoints={WAYPOINTS}
        cta={{ label: 'Trace it' }}
        accentColor="#22D3EE"
      />

      <div className="h-32" aria-hidden />

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['waypoints', 'CometWaypoint[] — each { id, at, x, y, title, eyebrow?, body?, accent? }. `at` is 0–1 along the path; x/y are percentages of the canvas.'],
            ['eyebrow', 'Tiny tag at the top of the section.'],
            ['cta', '{ label, href?, onClick? }'],
            ['scrollLength', 'Pin length in viewport heights. Default 3.8.'],
            ['accentColor', "Trail color. Default '#22D3EE'."],
            ['pathD', "Custom SVG path `d` in the 100×60 canvas space. Default sweeps from bottom-left up + out the top-right with two S-curves."],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
