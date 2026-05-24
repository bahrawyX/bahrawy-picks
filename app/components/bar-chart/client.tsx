'use client'

import { BarChart } from '@/components/bahrawy/bar-chart'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { BarChart } from '@/components/bahrawy/bar-chart'

<BarChart
  data={[
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 19 },
    { label: 'Wed', value: 14 },
    { label: 'Thu', value: 24 },
    { label: 'Fri', value: 31 },
  ]}
  accent="#A78BFA"
  showGrid
/>`

const REVENUE = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5100 },
  { label: 'Mar', value: 4800 },
  { label: 'Apr', value: 6700 },
  { label: 'May', value: 7900 },
  { label: 'Jun', value: 9200 },
  { label: 'Jul', value: 11400 },
  { label: 'Aug', value: 10800 },
]

const COMMITS = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 14 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 31 },
  { label: 'Sat', value: 7 },
  { label: 'Sun', value: 4 },
]

const DOWNLOADS = [
  { label: 'queue',       value: 1820, color: '#A78BFA' },
  { label: 'env-vars',    value: 1410, color: '#22D3EE' },
  { label: 'tree',        value: 1240, color: '#34D399' },
  { label: 'ticker',      value: 1090, color: '#FBBF24' },
  { label: 'snippet',     value: 1640, color: '#F472B6' },
  { label: 'live-cursors',value:  890, color: '#FB7185' },
]

export default function BarChartDocs() {
  return (
    <DocsPage
      title="Bar Chart"
      slug="bar-chart"
      description="A single-series categorical bar chart. Each bar animates in from the baseline on mount with a staggered spring; hover any bar to lift it slightly and show a tooltip. Optional gridlines, value labels on top, per-bar color overrides, niced-up Y-axis max. Vertical or horizontal. Pure SVG — sharp at any size."
      category="68 · data"
    >
      <DocsSection title="Monthly revenue ($)">
        <DemoCard className="min-h-[340px]">
          <div className="w-full max-w-2xl">
            <BarChart
              data={REVENUE}
              accent="#A78BFA"
              height={260}
              showValues
              formatValue={(v) => `$${(v / 1000).toFixed(1)}k`}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Commits this week — cyan">
        <DemoCard className="min-h-[320px]">
          <div className="w-full max-w-xl">
            <BarChart data={COMMITS} accent="#22D3EE" height={240} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Horizontal — per-bar colors">
        <DemoCard className="min-h-[360px] items-start py-8">
          <div className="w-full max-w-xl">
            <BarChart
              data={DOWNLOADS}
              orientation="horizontal"
              formatValue={(v) => v.toLocaleString()}
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
            ['data', 'BarChartDatum[] — { label, value, color? }.'],
            ['orientation', '"vertical" (default) or "horizontal".'],
            ['height', 'Chart height in px (vertical). Default 240.'],
            ['accent', 'Default bar color. Default #A78BFA.'],
            ['showGrid', 'Horizontal gridlines + Y-axis labels. Default true.'],
            ['showValues', 'Print the value on top of each bar. Default false.'],
            ['formatValue', 'Custom value formatter (tooltip + labels).'],
            ['max', 'Override the Y-axis max. Otherwise derived + nice-ceiled.'],
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
