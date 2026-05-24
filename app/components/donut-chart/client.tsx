'use client'

import * as React from 'react'
import { DonutChart } from '@/components/bahrawy/donut-chart'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { DonutChart } from '@/components/bahrawy/donut-chart'

<DonutChart
  centerLabel="$1,000"
  centerSubLabel="May spend"
  data={[
    { label: 'Food',          value: 480, color: '#FF375F' },
    { label: 'Transport',     value: 220, color: '#5E5CE6' },
    { label: 'Shopping',      value: 180, color: '#30D158' },
    { label: 'Entertainment', value: 120, color: '#FF9F0A' },
  ]}
/>`

export default function DonutChartDocs() {
  return (
    <DocsPage
      title="Donut Chart"
      slug="donut-chart"
      description="An animated SVG donut chart. Each slice is a full-circumference circle stroke with a fixed dashoffset positioning it at the right angle, and a dasharray that animates from 0 to its arc length so the slice draws in clockwise. Hover lifts the slice outward along its midpoint vector. Vibrancy tooltip with value + %. Optional center label, interactive legend."
      category="169 · data"
    >
      <DocsSection title="May spend breakdown">
        <DemoCard className="min-h-[480px]">
          <DonutChart
            size={260}
            thickness={32}
            centerLabel="$1,000"
            centerSubLabel="May spend"
            format={(v) => '$' + v.toLocaleString()}
            data={[
              { label: 'Food', value: 480, color: '#FF375F' },
              { label: 'Transport', value: 220, color: '#5E5CE6' },
              { label: 'Shopping', value: 180, color: '#30D158' },
              { label: 'Entertainment', value: 120, color: '#FF9F0A' },
            ]}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Traffic sources">
        <DemoCard className="min-h-[480px]">
          <DonutChart
            size={240}
            thickness={28}
            centerLabel="42.8k"
            centerSubLabel="Visits"
            format={(v) =>
              v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toLocaleString()
            }
            data={[
              { label: 'Direct', value: 18400, color: '#5E5CE6' },
              { label: 'Search', value: 12100, color: '#0A84FF' },
              { label: 'Social', value: 6900, color: '#BF5AF2' },
              { label: 'Referral', value: 3200, color: '#30D158' },
              { label: 'Email', value: 2200, color: '#FF9F0A' },
            ]}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Storage — minimal, no legend">
        <DemoCard className="min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <DonutChart
              size={180}
              thickness={20}
              showLegend={false}
              centerLabel="74%"
              centerSubLabel="Used"
              data={[
                { label: 'Photos', value: 24, color: '#FF9F0A' },
                { label: 'Apps', value: 18, color: '#5E5CE6' },
                { label: 'System', value: 12, color: '#8E8E93' },
                { label: 'Other', value: 20, color: '#30D158' },
                { label: 'Free', value: 26, color: 'rgba(255,255,255,0.08)' },
              ]}
            />
            <p className="text-[11px] tracking-tight text-white/45">
              74 GB of 100 GB used
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Two slices — donut as a percentage gauge">
        <DemoCard className="min-h-[300px]">
          <DonutChart
            size={180}
            thickness={18}
            showLegend={false}
            centerLabel="68%"
            centerSubLabel="Complete"
            data={[
              { label: 'Done', value: 68, color: '#30D158' },
              { label: 'Remaining', value: 32, color: 'rgba(255,255,255,0.08)' },
            ]}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
        <p className="mt-3 text-xs text-white/45">
          Hover any slice (or any legend row) — the slice translates outward along its midpoint
          vector and a vibrancy tooltip pops above the donut with the label, formatted value,
          and percentage of the total.
        </p>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['data', 'DonutChartDatum[] — { label, value, color? }. Colors fall back to an SF palette.'],
            ['size', 'Outer size in px. Default 240.'],
            ['thickness', 'Ring stroke width. Default 28.'],
            ['centerLabel / centerSubLabel', 'Center text slots.'],
            ['showLegend', 'Show interactive legend below. Default true.'],
            ['showTooltip', 'Show vibrancy tooltip on hover. Default true.'],
            ['format', '(value) => string for tooltip + legend.'],
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
