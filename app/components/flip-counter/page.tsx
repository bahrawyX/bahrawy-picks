'use client'

import * as React from 'react'
import { Cloud, Moon, Snowflake, Sun, Zap } from 'lucide-react'
import { FlipCounter } from '@/components/bahrawy/flip-counter'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { FlipCounter } from '@/components/bahrawy/flip-counter'

// 1. A number — padded + split
<FlipCounter value={1234} pad={6} />

// 2. A string — split into characters
<FlipCounter value="DUBAI" />

// 3. An array of anything — each entry is one cell
<FlipCounter
  value={[<Sun />, <Moon />, <Cloud />]}
  cellWidth={72}
  cellHeight={72}
/>`

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

      <DocsSection
        title="Or anything you want"
        description="Each cell accepts any React node — emoji, icons, even short text labels. Click the buttons to flip."
      >
        <IconFlipDemo />
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['value', 'number | string | (string | ReactNode)[]. Number → padded + split into digits; string → split into chars; array → used directly (one cell per entry, so each flap can hold any content).'],
            ['pad', 'Pad-start length for numeric values. Default 0.'],
            ['cellWidth / cellHeight', 'Card dimensions in px. Defaults 56 × 80.'],
            ['cardColor', 'Card colour. Default a dark navy.'],
            ['glyphColor', 'Text/icon colour. Default warm white.'],
            ['cascade', 'Delay between cell flips in ms — the wave. Default 60.'],
            ['duration', 'Single flip duration in ms. Default 600.'],
            ['gap', 'Gap between cells in px. Default 4.'],
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

// ---------------------------------------------------------------------------
// Sub-demo: any-content cells — flips between lucide icons + emoji
// ---------------------------------------------------------------------------

const WEATHER_ICONS = [
  <Sun key="sun" className="h-10 w-10 text-amber-300" />,
  <Cloud key="cloud" className="h-10 w-10 text-sky-300" />,
  <Snowflake key="snow" className="h-10 w-10 text-cyan-200" />,
  <Zap key="zap" className="h-10 w-10 text-yellow-300" />,
  <Moon key="moon" className="h-10 w-10 text-indigo-200" />,
]

function IconFlipDemo() {
  const [step, setStep] = React.useState(0)
  React.useEffect(() => {
    const t = window.setInterval(() => setStep((s) => s + 1), 1800)
    return () => window.clearInterval(t)
  }, [])
  // Rotate each cell through the icon set, offset per cell.
  const cells = [0, 1, 2].map(
    (i) => WEATHER_ICONS[(step + i) % WEATHER_ICONS.length],
  )
  return (
    <DemoCard className="min-h-[200px]">
      <div className="flex flex-col items-center gap-5 py-4">
        <FlipCounter value={cells} cellWidth={72} cellHeight={72} />
        <button
          type="button"
          onClick={() => setStep((s) => s + 1)}
          className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/[0.08]"
        >
          flip
        </button>
      </div>
    </DemoCard>
  )
}
