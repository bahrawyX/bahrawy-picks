'use client'

import * as React from 'react'
import { FlipCounter } from '@/components/bahrawy/flip-counter'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { FlipCounter } from '@/components/bahrawy/flip-counter'

const [n, setN] = useState(1234)

<FlipCounter value={n} pad={6} />
<button onClick={() => setN(n + 1)}>+1</button>`

export default function FlipCounterDocs() {
  const [n, setN] = React.useState(1234)
  React.useEffect(() => {
    const t = window.setInterval(() => {
      setN((prev) => prev + Math.floor(Math.random() * 9) + 1)
    }, 2400)
    return () => window.clearInterval(t)
  }, [])
  return (
    <DocsPage
      title="Flip Counter"
      slug="flip-counter"
      description="A mechanical split-flap (Solari-board) display. Each digit is a horizontally split card; when the value changes, the top half flips down to reveal a fresh digit beneath. Per-digit cascade so multi-digit changes read as a wave across the display."
      category="127 · data"
    >
      <DocsSection
        title="Live demo · auto-incrementing"
        description="The counter increments by a random 1–10 every 2.4s. Notice the per-digit cascade — the rightmost (changing-fastest) digits flip first."
      >
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-col items-center gap-5 py-4">
            <FlipCounter value={n} pad={6} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setN((v) => v + 1)}
                className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/[0.08]"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => setN((v) => v + 1000)}
                className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/[0.08]"
              >
                +1000
              </button>
              <button
                type="button"
                onClick={() => setN(0)}
                className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/[0.08]"
              >
                reset
              </button>
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Letters too">
        <DemoCard className="min-h-[200px]">
          <FlipCounter value="DEPART" cellWidth={48} cellHeight={68} />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['value', 'Number or string. Numbers are padded by `pad`.'],
            ['pad', 'Pad-start length for numeric values. Default 0.'],
            ['cellWidth / cellHeight', 'Card dimensions in px. Defaults 56 × 80.'],
            ['cardColor', 'Card colour. Default a dark navy.'],
            ['glyphColor', 'Glyph colour. Default warm white.'],
            ['cascade', 'Delay between digit flips in ms — the wave. Default 60.'],
            ['duration', 'Single flip duration in ms. Default 600.'],
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
        <div className="text-xs text-white/55">No external runtime dependencies — just React + CSS 3D.</div>
      </DocsSection>
    </DocsPage>
  )
}
