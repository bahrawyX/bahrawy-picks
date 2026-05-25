'use client'

import * as React from 'react'
import { Slider } from '@/components/bahrawy/slider'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Slider } from '@/components/bahrawy/slider'

const [v, setV] = useState(50)

<Slider value={v} onValueChange={setV} min={0} max={100} step={1} />

// Range
const [r, setR] = useState<[number, number]>([20, 80])
<Slider range value={r} onValueChange={setR} min={0} max={100} />`

export default function SliderDocs() {
  const [single, setSingle] = React.useState(64)
  const [range, setRange] = React.useState<[number, number]>([24, 72])
  const [vol, setVol] = React.useState(0.65)

  return (
    <DocsPage
      title="Slider"
      slug="slider"
      description="An Apple-style range slider. Supports a single value or a [low, high] range, ticks, value tooltip on hover/drag, and keyboard nav. Clean white disc handle with Apple spring on hover/drag scale."
      category="170 · form"
    >
      <DocsSection title="Single value">
        <DemoCard className="min-h-[180px]">
          <div className="flex w-full max-w-[460px] flex-col items-center gap-4">
            <Slider value={single} onValueChange={setSingle} />
            <p className="font-mono text-[12px] tabular-nums text-white/55">
              value = <span className="text-white/85">{single}</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Range">
        <DemoCard className="min-h-[180px]">
          <div className="flex w-full max-w-[460px] flex-col items-center gap-4">
            <Slider range value={range} onValueChange={setRange} />
            <p className="font-mono text-[12px] tabular-nums text-white/55">
              range = <span className="text-white/85">[{range[0]}, {range[1]}]</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Ticks + custom format">
        <DemoCard className="min-h-[180px]">
          <div className="w-full max-w-[460px]">
            <Slider
              value={vol}
              onValueChange={setVol}
              min={0}
              max={1}
              step={0.05}
              ticks
              accent="#30D158"
              format={(v) => `${Math.round(v * 100)}%`}
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
            ['value / defaultValue', 'number — or [number, number] when range={true}.'],
            ['range', 'Enable two-thumb range mode. Default false.'],
            ['min / max / step', 'Numeric bounds + step. Default 0 / 100 / 1.'],
            ['ticks', 'Tick marks under the track at every step. Default false.'],
            ['showValueTooltip', 'Pill above the active thumb on hover/drag. Default true.'],
            ['format', '(value) => string for tooltip.'],
            ['accent', 'Color for the filled range + tooltip. Default SF indigo.'],
            ['disabled', 'Disable interaction + dim the slider.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
