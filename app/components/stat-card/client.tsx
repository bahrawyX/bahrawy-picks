'use client'

import { StatCard } from '@/components/bahrawy/stat-card'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const TREND_UP = [12, 15, 13, 17, 18, 22, 21, 26, 28, 32, 34, 38]
const TREND_DOWN = [40, 38, 36, 38, 34, 32, 30, 28, 27, 25, 24, 22]
const TREND_FLAT = [22, 20, 23, 21, 22, 24, 22, 21, 23, 22, 24, 23]

export default function StatCardDocs() {
  return (
    <DocsPage
      title="Stat Card"
      slug="stat-card"
      description="Compact dashboard card: label + spring-animated number + delta badge + inline sparkline that draws itself on mount."
      category="102 · data"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[260px] items-stretch">
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Revenue"
              value={48230}
              prefix="$"
              delta={12.4}
              trend={TREND_UP}
              accentColor="#A78BFA"
            />
            <StatCard
              label="Active users"
              value={1942}
              delta={4.6}
              trend={TREND_UP}
              accentColor="#22D3EE"
            />
            <StatCard
              label="Churn"
              value={3.2}
              suffix="%"
              delta={-1.4}
              trend={TREND_DOWN}
              accentColor="#F472B6"
            />
            <StatCard
              label="Latency"
              value={284}
              suffix="ms"
              delta={0.2}
              trend={TREND_FLAT}
              accentColor="#34D399"
            />
          </div>
        </DemoCard>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<StatCard label="Revenue" value={48230} prefix="$" delta={12.4} trend={[12, 15, 13, ...]} />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
