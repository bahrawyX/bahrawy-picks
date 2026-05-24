'use client'

import * as React from 'react'
import { Deploy, type DeployStatus } from '@/components/bahrawy/deploy'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Deploy } from '@/components/bahrawy/deploy'

<Deploy
  status="ready"
  environment="production"
  branch="main"
  commit={{
    sha: 'a7f3c2b',
    message: 'Add SEO scaffolding — sitemap, OG images, JSON-LD',
    author: { name: 'Abdelrahman el-Bahrawy' },
  }}
  duration={47}
  href="https://bahrawy-picks.vercel.app"
/>`

export default function DeployDocs() {
  // Auto-cycling status so the "Building → Ready" transition is visible
  // in the demo without a user click.
  const [status, setStatus] = React.useState<DeployStatus>('building')
  const [elapsed, setElapsed] = React.useState(0)
  React.useEffect(() => {
    const phases: { s: DeployStatus; dur: number }[] = [
      { s: 'queued',   dur: 1500 },
      { s: 'building', dur: 8000 },
      { s: 'ready',    dur: 5000 },
    ]
    let i = 0
    let cancelled = false
    const start = () => {
      if (cancelled) return
      setStatus(phases[i].s)
      setElapsed(phases[i].s === 'building' ? 0 : 0)
      const t = setTimeout(() => {
        i = (i + 1) % phases.length
        start()
      }, phases[i].dur)
      return () => clearTimeout(t)
    }
    const cleanup = start()
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])
  // Tick elapsed seconds for the demo card (passed as duration when ready)
  React.useEffect(() => {
    if (status !== 'building') return
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [status])

  return (
    <DocsPage
      title="Deploy"
      slug="deploy"
      description="A Vercel-style deployment card. Status drives the whole visual — Queued is idle, Building shows a shimmering scanline across the top with a live elapsed counter, Ready pulses softly with a check, Failed gives the card a brief shake. Inside: branch chip, commit message, short SHA, author avatar, environment chip."
      category="16 · data"
    >
      <DocsSection title="Live cycle (queued → building → ready)">
        <DemoCard className="min-h-[200px]">
          <div className="w-full max-w-xl">
            <Deploy
              status={status}
              environment="production"
              branch="main"
              commit={{
                sha: 'a7f3c2b',
                message: 'Add SEO scaffolding — sitemap, OG images, JSON-LD',
                author: { name: 'Abdelrahman el-Bahrawy' },
              }}
              duration={status === 'ready' ? 47 : elapsed}
              href="https://bahrawy-picks.vercel.app"
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="All states">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="flex w-full max-w-xl flex-col gap-3">
            <Deploy
              status="queued"
              environment="preview"
              branch="feat/queue-component"
              commit={{
                sha: 'b8e1f0c',
                message: 'Add Queue component + demo',
                author: { name: 'Hayden Bleasel' },
              }}
            />
            <Deploy
              status="building"
              environment="preview"
              branch="feat/live-cursors"
              commit={{
                sha: 'c1d4a92',
                message: 'Multiplayer cursors with chat bubbles',
                author: { name: 'Lee Robinson' },
              }}
              duration={32}
              liveElapsed
            />
            <Deploy
              status="ready"
              environment="production"
              branch="main"
              commit={{
                sha: 'd5e7b18',
                message: 'Reorder registry — new batch to IDs 40-45',
                author: { name: 'Abdelrahman el-Bahrawy' },
              }}
              duration={47}
              href="https://bahrawy-picks.vercel.app"
            />
            <Deploy
              status="failed"
              environment="preview"
              branch="fix/auth-token"
              commit={{
                sha: 'e3f9c44',
                message: 'Reject expired tokens',
                author: { name: 'shadcn' },
              }}
              duration={12}
            />
            <Deploy
              status="cancelled"
              environment="development"
              branch="experiment/3d-cards"
              commit={{
                sha: 'f2a8b07',
                message: 'WIP: prototype 3d card flip',
                author: { name: 'Bahrawy' },
              }}
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
            ['status', '"queued" | "building" | "ready" | "failed" | "cancelled".'],
            ['branch', 'Branch name shown as a chip.'],
            ['commit', '{ sha, message, author? { name, avatarUrl? } }.'],
            ['environment', '"production" | "preview" | "development". Default "preview".'],
            ['duration', 'Duration in seconds. For "building" with liveElapsed, the starting count.'],
            ['liveElapsed', 'Tick the duration up every second while status is "building".'],
            ['href', 'Optional "Visit" link (shown only for status="ready").'],
            ['className', 'Extra classes on the card.'],
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
