'use client'

import { Globe, type GlobePoint, type GlobeArc } from '@/components/bahrawy/globe'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const POINTS: GlobePoint[] = [
  { id: 'sfo', lat: 37.77, lng: -122.42, hub: true,  label: 'SFO' },
  { id: 'jfk', lat: 40.71, lng: -74.0,   hub: true,  label: 'JFK' },
  { id: 'lhr', lat: 51.51, lng: -0.13,   hub: true,  label: 'LHR' },
  { id: 'fra', lat: 50.11, lng: 8.68 },
  { id: 'cai', lat: 30.04, lng: 31.23 },
  { id: 'dxb', lat: 25.27, lng: 55.30,             label: 'DXB' },
  { id: 'sin', lat: 1.35,  lng: 103.82, hub: true, label: 'SIN' },
  { id: 'hnd', lat: 35.55, lng: 139.78,            label: 'HND' },
  { id: 'syd', lat: -33.87,lng: 151.21, hub: true, label: 'SYD' },
  { id: 'gru', lat: -23.55,lng: -46.63,            label: 'GRU' },
  { id: 'jnb', lat: -26.20,lng: 28.05 },
  { id: 'cdg', lat: 49.01, lng: 2.55 },
]

const ARCS: GlobeArc[] = [
  { from: 'sfo', to: 'jfk' },
  { from: 'sfo', to: 'sin' },
  { from: 'sfo', to: 'hnd' },
  { from: 'jfk', to: 'lhr' },
  { from: 'jfk', to: 'gru' },
  { from: 'lhr', to: 'cai' },
  { from: 'lhr', to: 'fra' },
  { from: 'dxb', to: 'cai' },
  { from: 'dxb', to: 'sin' },
  { from: 'sin', to: 'syd' },
  { from: 'sin', to: 'hnd' },
  { from: 'syd', to: 'jnb' },
  { from: 'cdg', to: 'lhr' },
]

const SNIPPET = `import { Globe } from '@/components/bahrawy/globe'

<Globe
  size={420}
  rotationSpeed={6}
  points={[
    { id: 'sfo', lat: 37.77, lng: -122.42, hub: true,  label: 'SFO' },
    { id: 'jfk', lat: 40.71, lng: -74.00,  hub: true,  label: 'JFK' },
    { id: 'lhr', lat: 51.51, lng: -0.13,   hub: true,  label: 'LHR' },
    // …
  ]}
  arcs={[
    { from: 'sfo', to: 'jfk' },
    { from: 'jfk', to: 'lhr' },
    { from: 'lhr', to: 'cai' },
  ]}
/>`

export default function GlobeDocs() {
  return (
    <DocsPage
      title="Globe"
      slug="globe"
      description="A pure-SVG rotating 3D sphere with great-circle arc lines between geographic points. Each frame, every point's (lat, lng) is mapped to a unit sphere, rotated by the current spin angle plus a small tilt, and orthographically projected — points on the far side fade out; arcs sample along the great-circle and break when they cross the horizon. Hubs pulse softly."
      category="53 · data"
    >
      <DocsSection title="Edge network">
        <DemoCard className="min-h-[520px]">
          <div className="flex w-full flex-col items-center gap-3">
            <Globe points={POINTS} arcs={ARCS} size={440} rotationSpeed={5} accent="#A78BFA" />
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
              13 nodes · 13 arcs · scroll-stable rAF rotation
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Paused (interactive-ready)">
        <DemoCard className="min-h-[400px]">
          <Globe points={POINTS} arcs={ARCS.slice(0, 6)} size={340} paused accent="#22D3EE" />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['points', 'GlobePoint[] — { id, lat, lng, hub?, color?, label? }.'],
            ['arcs', 'GlobeArc[] — { from: pointId, to: pointId, color? }.'],
            ['size', 'Diameter in px. Default 360.'],
            ['rotationSpeed', 'Degrees per second of spin. Default 6.'],
            ['paused', 'Freeze rotation. Default false.'],
            ['accent', 'Default color for hubs + arcs. Default violet.'],
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
          {['framer-motion'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
