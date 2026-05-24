'use client'

import { Status, type StatusState } from '@/components/bahrawy/status'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Status } from '@/components/bahrawy/status'

<Status
  services={[
    { name: 'API',       state: 'operational', history: generateHistory(90) },
    { name: 'Dashboard', state: 'operational', history: generateHistory(90) },
    { name: 'Auth',      state: 'degraded',    history: generateHistory(90) },
    { name: 'CDN',       state: 'operational', history: generateHistory(90) },
  ]}
/>`

// Stable-seeded fake history: ~95% operational, occasional degradation
function makeHistory(seed: number, weight: 'good' | 'bad' = 'good'): StatusState[] {
  const out: StatusState[] = []
  let s = seed
  for (let i = 0; i < 90; i++) {
    s = (s * 9301 + 49297) % 233280
    const r = s / 233280
    let v: StatusState = 'operational'
    if (weight === 'bad') {
      if (r > 0.93) v = 'outage'
      else if (r > 0.82) v = 'degraded'
    } else {
      if (r > 0.985) v = 'outage'
      else if (r > 0.96) v = 'degraded'
    }
    out.push(v)
  }
  return out
}

export default function StatusDocs() {
  return (
    <DocsPage
      title="Status"
      slug="status"
      description="A Vercel/Atlassian Statuspage-style service status display. A big banner up top derives its state from the worst-off service (outage > maintenance > degraded > operational), and each service row shows its individual state plus an optional 90-day uptime ribbon."
      category="68 · data"
    >
      <DocsSection title="All operational">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="w-full max-w-xl">
            <Status
              services={[
                { name: 'API',         description: 'REST + GraphQL', state: 'operational', history: makeHistory(1) },
                { name: 'Dashboard',   description: 'Web app',         state: 'operational', history: makeHistory(2) },
                { name: 'Auth',        description: 'Sessions + OAuth',state: 'operational', history: makeHistory(3) },
                { name: 'CDN',         description: 'Static assets',   state: 'operational', history: makeHistory(4) },
                { name: 'Webhooks',    description: 'Outbound delivery',state: 'operational', history: makeHistory(5) },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Degraded performance">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="w-full max-w-xl">
            <Status
              services={[
                { name: 'API',       state: 'operational', history: makeHistory(11) },
                { name: 'Dashboard', state: 'operational', history: makeHistory(12) },
                {
                  name: 'Auth',
                  description: 'Elevated p99 latency on session refresh',
                  state: 'degraded',
                  history: makeHistory(13, 'bad'),
                },
                { name: 'CDN', state: 'operational', history: makeHistory(14) },
                {
                  name: 'Webhooks',
                  description: 'Queue backlog clearing',
                  state: 'degraded',
                  history: makeHistory(15, 'bad'),
                },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Active incident">
        <DemoCard className="min-h-[260px] items-start py-8">
          <div className="w-full max-w-xl">
            <Status
              showHistory={false}
              services={[
                { name: 'API',       state: 'outage', description: '5xx on most endpoints — investigating' },
                { name: 'Dashboard', state: 'operational' },
                { name: 'Auth',      state: 'operational' },
                { name: 'CDN',       state: 'operational' },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['services', 'Array of { name, state, description?, history? }.'],
            ['overall', 'Override the auto-derived overall state.'],
            ['title', 'Header eyebrow. Default "System status".'],
            ['showHistory', 'Show 90-day uptime ribbons. Default true.'],
            ['className', 'Extra classes on the outer container.'],
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
          {['framer-motion', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
