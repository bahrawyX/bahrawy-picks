'use client'

import { HabitHeatmap } from '@/components/bahrawy/habit-heatmap'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { HabitHeatmap } from '@/components/bahrawy/habit-heatmap'

const data = [
  { date: '2026-04-01', value: 4 },
  { date: '2026-04-02', value: 0 },
  { date: '2026-04-03', value: 8 },
  // …
]

<HabitHeatmap
  title="Contributions"
  meta="last 6 months"
  data={data}
  accentColor="#34D399"
  onCellClick={(cell) => console.log(cell)}
/>`

export default function HabitHeatmapDocs() {
  return (
    <DocsPage
      title="Habit Heatmap"
      slug="habit-heatmap"
      description="A GitHub-style contribution grid. 7 rows (one per weekday) × N columns (one per week). Each cell's fill scales with the value through a 5-step accent ramp. Hover for a date + count tooltip; click a cell to handle the event."
      category="137 · data"
    >
      <DocsSection title="Live demo · default" description="No data provided — a stable demo grid is generated for the last 26 weeks.">
        <DemoCard>
          <div className="w-full max-w-[760px] p-2">
            <HabitHeatmap
              title="Contributions"
              meta="last 26 weeks"
              accentColor="#34D399"
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Cyan / 52 weeks">
        <DemoCard>
          <div className="w-full max-w-[760px] p-2">
            <HabitHeatmap
              title="Sessions"
              meta="last year"
              weeks={52}
              accentColor="#22D3EE"
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['data', 'HeatmapCell[] — { date: "YYYY-MM-DD", value: number }. Omit to render a stable demo dataset.'],
            ['weeks', 'Weeks rendered when no data is supplied. Default 26.'],
            ['showMonths', 'Show the month axis above the grid. Default true.'],
            ['showWeekdays', 'Show the weekday axis to the left. Default true.'],
            ['showLegend', 'Show the "Less → More" legend. Default true.'],
            ['accentColor', 'Cell fill color. Default #34D399.'],
            ['title', 'Heading rendered above the grid.'],
            ['meta', 'Sub-label next to the title.'],
            ['onCellClick', '(cell: HeatmapCell) => void — fires when a cell is clicked.'],
            ['className', 'Extra classes on the wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="text-xs text-white/55">No external runtime dependencies. Just React.</div>
      </DocsSection>
    </DocsPage>
  )
}
