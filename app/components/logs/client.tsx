'use client'

import * as React from 'react'
import { Logs, type LogEntry, type LogLevel } from '@/components/bahrawy/logs'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Logs } from '@/components/bahrawy/logs'

<Logs
  entries={[
    { id: '1', timestamp: new Date(), level: 'info',    source: 'api',  message: 'GET /users 200 (12ms)' },
    { id: '2', timestamp: new Date(), level: 'warn',    source: 'auth', message: 'Token expires in 60s' },
    { id: '3', timestamp: new Date(), level: 'error',   source: 'db',   message: 'Pool exhausted — retrying' },
    { id: '4', timestamp: new Date(), level: 'success', source: 'api',  message: 'Migration applied' },
  ]}
  autoScroll
/>`

const SEED: Omit<LogEntry, 'id' | 'timestamp'>[] = [
  { level: 'info',    source: 'api',     message: 'GET /users 200 (12ms)' },
  { level: 'info',    source: 'api',     message: 'GET /posts/42 200 (8ms)' },
  { level: 'debug',   source: 'cache',   message: 'HIT user:1287 (TTL 240s remaining)' },
  { level: 'warn',    source: 'auth',    message: 'Token expires in 60s for user 1287' },
  { level: 'info',    source: 'queue',   message: 'job:reindex enqueued (priority=normal)' },
  { level: 'error',   source: 'db',      message: 'Connection pool exhausted — retrying in 200ms' },
  { level: 'success', source: 'db',      message: 'Connection re-established (pool=8/10)' },
  { level: 'info',    source: 'queue',   message: 'job:reindex started — 4127 documents' },
  { level: 'debug',   source: 'queue',   message: 'job:reindex progress 25% (1031/4127)' },
  { level: 'debug',   source: 'queue',   message: 'job:reindex progress 50% (2063/4127)' },
  { level: 'warn',    source: 'rate',    message: 'IP 51.20.84.7 exceeded 100 req/m — soft-throttling' },
  { level: 'debug',   source: 'queue',   message: 'job:reindex progress 75% (3094/4127)' },
  { level: 'success', source: 'queue',   message: 'job:reindex completed in 1.84s' },
  { level: 'info',    source: 'api',     message: 'POST /webhooks 202 (4ms)' },
  { level: 'error',   source: 'webhook', message: 'Delivery failed to https://example.com/hooks — 503' },
  { level: 'info',    source: 'webhook', message: 'Retrying delivery in 30s (attempt 1/5)' },
]

export default function LogsDocs() {
  const [live, setLive] = React.useState<LogEntry[]>(() =>
    SEED.slice(0, 6).map((s, i) => ({
      ...s,
      id: `seed-${i}`,
      timestamp: new Date(Date.now() - (6 - i) * 1200),
    })),
  )

  // Append a new fake entry every couple seconds so the auto-scroll +
  // enter animation are visible in the demo.
  React.useEffect(() => {
    let idx = 6
    const id = setInterval(() => {
      setLive((prev) => {
        const next: LogEntry = {
          ...SEED[idx % SEED.length],
          id: `live-${idx}`,
          timestamp: new Date(),
        }
        idx++
        return [...prev.slice(-60), next]
      })
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <DocsPage
      title="Logs"
      slug="logs"
      description="A terminal-style log stream. Each entry is a monospace row with a faint timestamp, a colored level pill, an optional [source] tag, and the message body. Filter chips at the top toggle which levels are visible; auto-scroll keeps the most recent line in view as new entries arrive."
      category="70 · data"
    >
      <DocsSection title="Live (entries stream in)">
        <DemoCard className="min-h-[480px] items-start py-8">
          <div className="w-full max-w-2xl">
            <Logs entries={live} autoScroll height="380px" />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Static (no filter bar)">
        <DemoCard className="min-h-[300px] items-start py-8">
          <div className="w-full max-w-2xl">
            <Logs
              showFilters={false}
              entries={SEED.slice(0, 7).map((s, i) => ({
                ...s,
                id: `static-${i}`,
                timestamp: '14:22:0' + i,
              }))}
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
            ['entries', 'LogEntry[] — { id, timestamp?, level, message, source? }.'],
            ['showFilters', 'Show level filter chips above the stream. Default true.'],
            ['autoScroll', 'Auto-scroll to the bottom on new entries. Default true.'],
            ['height', 'Max height of the scrolling region. Default "380px".'],
            ['className', 'Extra classes on the outer container.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          Levels: <code className="font-mono">info · success · warn · error · debug</code>
        </p>
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
