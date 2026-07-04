'use client'

import * as React from 'react'
import { LineChart } from '@/components/bahrawy/line-chart'
import { SegmentedControl } from '@/components/bahrawy/segmented-control'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { LineChart } from '@/components/bahrawy/line-chart'

<LineChart
  data={[
    { label: 'Jan', value: 1200 },
    { label: 'Feb', value: 1850 },
    { label: 'Mar', value: 2400 },
    { label: 'Apr', value: 1900 },
    { label: 'May', value: 3100 },
    { label: 'Jun', value: 4200 },
  ]}
  accent="#5E5CE6"
  fill
  smooth
  showGrid
  showAxis
/>`

const REVENUE = [
  { label: 'Jan', value: 12_400 },
  { label: 'Feb', value: 15_200 },
  { label: 'Mar', value: 14_100 },
  { label: 'Apr', value: 18_300 },
  { label: 'May', value: 21_900 },
  { label: 'Jun', value: 24_600 },
  { label: 'Jul', value: 22_800 },
  { label: 'Aug', value: 27_500 },
  { label: 'Sep', value: 31_200 },
  { label: 'Oct', value: 29_400 },
  { label: 'Nov', value: 34_800 },
  { label: 'Dec', value: 41_300 },
]

const ACTIVE_USERS = [
  { label: 'Mon', value: 4800 },
  { label: 'Tue', value: 5100 },
  { label: 'Wed', value: 4900 },
  { label: 'Thu', value: 5400 },
  { label: 'Fri', value: 5900 },
  { label: 'Sat', value: 3800 },
  { label: 'Sun', value: 3200 },
]

const LATENCY = [
  { label: '00', value: 142 },
  { label: '04', value: 138 },
  { label: '08', value: 156 },
  { label: '12', value: 198 },
  { label: '16', value: 224 },
  { label: '20', value: 178 },
  { label: '24', value: 152 },
]

export default function LineChartDocs() {
  const [range, setRange] = React.useState<'30d' | '90d' | '12m'>('12m')
  const [key, setKey] = React.useState(0)

  const data =
    range === '12m'
      ? REVENUE
      : range === '90d'
      ? REVENUE.slice(-3).flatMap((m, i) =>
          [0, 1, 2, 3].map((w) => ({
            label: `${m.label} W${w + 1}`,
            value: Math.round(m.value / 4 + (Math.sin(i * 11 + w * 3) * m.value) / 16),
          })),
        )
      : REVENUE.slice(-1).flatMap((m) =>
          Array.from({ length: 30 }, (_, i) => ({
            label: `${i + 1}`,
            value: Math.round(m.value / 30 + (Math.sin(i * 0.4) * m.value) / 40),
          })),
        )

  return (
    <DocsPage
      title="Line Chart"
      slug="line-chart"
      description="A single-series smooth line chart drawn with a Catmull-Rom-to-bezier path, an accent gradient fill underneath, an animated pathLength entrance, and a hover crosshair that pins a vibrancy tooltip to the nearest data point. Y-axis ticks are auto-niced, X-axis labels come from the data."
      category="165 · data"
    >
      <DocsSection title="Revenue — interactive range">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="w-full max-w-3xl">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  Net revenue
                </p>
                <p className="mt-1 text-[28px] font-semibold tracking-tight text-white">
                  ${REVENUE.reduce((s, d) => s + d.value, 0).toLocaleString()}
                </p>
                <p className="mt-0.5 text-[11.5px] font-medium tracking-tight text-[#30D158]">
                  +18.4% vs. previous period
                </p>
              </div>
              <SegmentedControl
                size="sm"
                value={range}
                onValueChange={(v) => {
                  setRange(v as typeof range)
                  setKey((k) => k + 1)
                }}
                options={[
                  { value: '30d', label: '30D' },
                  { value: '90d', label: '90D' },
                  { value: '12m', label: '12M' },
                ]}
              />
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
              <LineChart
                key={key}
                data={data}
                accent="#5E5CE6"
                height={260}
                fill
                smooth
                showGrid
                showAxis
                format={(v) => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : Math.round(v).toString())}
              />
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Weekly active users — emerald, with dots">
        <DemoCard className="min-h-[360px] items-start py-8">
          <div className="w-full max-w-2xl">
            <div className="mb-3">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Active users (7d)
              </p>
              <p className="mt-1 text-[22px] font-semibold tracking-tight text-white">
                33,100
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
              <LineChart
                data={ACTIVE_USERS}
                accent="#30D158"
                height={200}
                fill
                smooth
                showDots
                showGrid
                showAxis
                valueSuffix=" users"
              />
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="p99 latency — minimal, no axis, no fill">
        <DemoCard className="min-h-[260px] items-start py-8">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
              <div className="mb-1 flex items-baseline justify-between">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  p99 latency
                </p>
                <p className="font-mono text-[12px] tabular-nums text-white/75">
                  {LATENCY[LATENCY.length - 1].value}ms
                </p>
              </div>
              <LineChart
                data={LATENCY}
                accent="#FF9F0A"
                height={120}
                fill={false}
                smooth
                showGrid={false}
                showAxis={false}
                valueSuffix="ms"
              />
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
        <p className="mt-3 text-xs text-white/45">
          Hover anywhere along the chart — the nearest data point gets a pulsing accent dot, a
          vertical crosshair drops down, and a vibrancy tooltip pops above the point with the
          formatted value.
        </p>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['data', 'LineChartDatum[] — { label, value }.'],
            ['width / height', 'SVG viewBox dimensions. Chart is responsive to its container width.'],
            ['accent', 'Color for line + fill + hover dot. Default SF indigo.'],
            ['smooth', 'Catmull-Rom bezier (vs straight polyline). Default true.'],
            ['fill', 'Render gradient fill under the line. Default true.'],
            ['showGrid', 'Horizontal dashed gridlines. Default true.'],
            ['showAxis', 'Y-axis numeric labels + X-axis category labels. Default true.'],
            ['showDots', 'Always render a dot at every data point. Default false.'],
            ['format', '(value) => string for tooltip + Y-axis labels.'],
            ['valueSuffix', 'String appended to the tooltip value (e.g. " users").'],
            ['title', 'Accessible SVG <title>. Default "Line chart".'],
            ['description', 'Accessible SVG <desc>. Defaults to "label: value" pairs from the data.'],
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
