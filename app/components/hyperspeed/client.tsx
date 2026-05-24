'use client'

import { Hyperspeed } from '@/components/bahrawy/hyperspeed'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Hyperspeed } from '@/components/bahrawy/hyperspeed'

<div className="h-screen w-full">
  <Hyperspeed
    speed={1}
    density={1}
    color="#A78BFA"
    intensity={1}
  />
</div>`

export default function HyperspeedDocs() {
  return (
    <DocsPage
      title="Hyperspeed"
      slug="hyperspeed"
      description="A fullscreen OGL fragment shader that simulates Star-Wars-style warp-speed star streaks. Each pixel marches outward from a central focal point through layered seeded star fields, accumulating light proportional to inverse distance from the streak axis. Pure shader — no geometry. The whole thing runs in a single triangle."
      category="06 · background"
    >
      <DocsSection title="Warp 1">
        <DemoCard className="min-h-[480px] overflow-hidden p-0">
          <div className="h-[480px] w-full">
            <Hyperspeed speed={1} density={1} color="#A78BFA" intensity={1} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Cyan tint, denser, faster">
        <DemoCard className="min-h-[420px] overflow-hidden p-0">
          <div className="h-[420px] w-full">
            <Hyperspeed speed={1.8} density={1.6} color="#22D3EE" intensity={1.3} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Slow, sparse, amber">
        <DemoCard className="min-h-[360px] overflow-hidden p-0">
          <div className="h-[360px] w-full">
            <Hyperspeed speed={0.4} density={0.7} color="#FBBF24" intensity={0.9} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['speed', 'Forward warp speed. Default 1.'],
            ['density', 'Streak density (more = more spokes). Default 1.'],
            ['color', 'Tint applied to streaks. Default violet.'],
            ['intensity', 'Overall brightness multiplier. Default 1.'],
            ['className', 'Extra classes on the container.'],
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
          {['ogl'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
