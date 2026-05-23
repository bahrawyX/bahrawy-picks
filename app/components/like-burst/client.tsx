'use client'

import * as React from 'react'
import { LikeBurst } from '@/components/bahrawy/like-burst'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { LikeBurst } from '@/components/bahrawy/like-burst'

const [liked, setLiked] = useState(false)

<LikeBurst
  liked={liked}
  onChange={setLiked}
  count={42 + (liked ? 1 : 0)}
  color="#F472B6"
/>`

export default function LikeBurstDocs() {
  const [a, setA] = React.useState(false)
  const [b, setB] = React.useState(true)
  return (
    <DocsPage
      title="Like Burst"
      slug="like-burst"
      description="A heart button that bursts on like. Heart fills + springs, a ring of small particles shoots radially outward, and a soft shockwave fans out behind them. Click again to un-like — no burst on the un-like."
      category="138 · form"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-3">
              <LikeBurst liked={a} onChange={setA} count={42 + (a ? 1 : 0)} />
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                pink · {a ? 'liked' : 'tap to like'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <LikeBurst
                liked={b}
                onChange={setB}
                color="#FBBF24"
                count={1218 + (b ? 1 : 0)}
                particles={14}
              />
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                gold · 14 particles
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <LikeBurst defaultLiked color="#34D399" size={32} />
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                bigger
              </span>
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['liked', 'Controlled boolean.'],
            ['defaultLiked', 'Uncontrolled initial state. Default false.'],
            ['onChange', '(next: boolean) => void.'],
            ['count', 'Optional running count rendered next to the heart.'],
            ['showCount', 'Force count visibility. Default = true if count is set.'],
            ['size', 'Heart icon size in px. Default 24.'],
            ['particles', 'Number of burst particles. Default 10.'],
            ['color', 'Active colour. Default #F472B6.'],
            ['idleColor', 'Stroke colour when not liked.'],
            ['label', 'Accessible label.'],
            ['className', 'Extra classes on the button.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
