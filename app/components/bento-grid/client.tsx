'use client'

import { useState } from 'react'
import { BentoGrid, BentoCard } from '@/components/bahrawy/bento-grid'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  ControlLabel,
  ControlsRow,
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SNIPPET = `import { BentoGrid, BentoCard } from '@/components/bahrawy'

<BentoGrid columns={3} gap={16}>
  <BentoCard colSpan={2} rowSpan={2}>
    <h3>Featured</h3>
    <p>Your hero content here.</p>
  </BentoCard>
  <BentoCard>
    <h3>Stats</h3>
    <p>12.4k visitors</p>
  </BentoCard>
  <BentoCard>
    <h3>Revenue</h3>
    <p>$48.2k MRR</p>
  </BentoCard>
</BentoGrid>`

export default function BentoGridDocs() {
  const [columns, setColumns] = useState<2 | 3 | 4>(3)
  const [gap, setGap] = useState(16)

  return (
    <DocsPage
      category="35 · layout"
      title="Bento grid"
      slug="bento-grid"
      description="Responsive bento-style grid layout with animated cards that can span multiple columns and rows. Framer Motion entrance animations included."
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[420px] items-start p-6">
          <BentoGrid columns={columns} gap={gap} className="w-full">
            <BentoCard colSpan={2} rowSpan={2}>
              <p className="text-xs uppercase tracking-wider text-white/40">Featured</p>
              <h3 className="mt-2 text-xl font-bold text-white">Dashboard</h3>
              <p className="mt-1 text-sm text-white/50">
                Everything you need at a glance with real-time updates.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-2xl font-bold text-white">24.5k</p>
                  <p className="text-xs text-white/40">Users</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-2xl font-bold text-emerald-400">+12%</p>
                  <p className="text-xs text-white/40">Growth</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard>
              <p className="text-xs uppercase tracking-wider text-white/40">Revenue</p>
              <p className="mt-2 text-3xl font-bold text-white">$48.2k</p>
              <p className="text-sm text-emerald-400">+8.1% this month</p>
            </BentoCard>

            <BentoCard>
              <p className="text-xs uppercase tracking-wider text-white/40">Active now</p>
              <p className="mt-2 text-3xl font-bold text-white">1,284</p>
              <div className="mt-2 flex gap-0.5">
                {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded-sm bg-emerald-500/50"
                    style={{ height: `${h * 0.4}px` }}
                  />
                ))}
              </div>
            </BentoCard>

            <BentoCard colSpan={columns === 2 ? 2 : 3}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Performance</p>
                  <p className="mt-1 text-sm text-white/60">System uptime & response times</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  99.9% uptime
                </span>
              </div>
            </BentoCard>
          </BentoGrid>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Columns</ControlLabel>
          {([2, 3, 4] as const).map((c) => (
            <Button
              key={c}
              size="sm"
              variant={columns === c ? 'default' : 'outline'}
              onClick={() => setColumns(c)}
            >
              {c}
            </Button>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
          <ControlLabel>Gap</ControlLabel>
          {[8, 16, 24].map((g) => (
            <Button
              key={g}
              size="sm"
              variant={gap === g ? 'default' : 'outline'}
              onClick={() => setGap(g)}
            >
              {g}px
            </Button>
          ))}
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="BentoGrid Props">
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', description: 'BentoCard children.' },
            { name: 'columns', type: '2 | 3 | 4', default: '3', description: 'Number of columns at desktop.' },
            { name: 'gap', type: 'number', default: '16', description: 'Grid gap in pixels.' },
            { name: 'className', type: 'string', description: 'Additional classes for the grid.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="BentoCard Props">
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', description: 'Card content.' },
            { name: 'colSpan', type: '1 | 2 | 3 | 4', default: '1', description: 'Columns to span.' },
            { name: 'rowSpan', type: '1 | 2 | 3', default: '1', description: 'Rows to span.' },
            { name: 'className', type: 'string', description: 'Additional classes for the card.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
