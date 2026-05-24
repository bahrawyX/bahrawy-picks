'use client'

import * as React from 'react'
import { ActivityRings } from '@/components/bahrawy/activity-rings'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { ActivityRings } from '@/components/bahrawy/activity-rings'

<ActivityRings
  size={240}
  centerLabel="Today"
  centerSubLabel="Wed · May 24"
  rings={[
    { label: 'Move',     value: 412, goal: 600, color: '#FF375F', unit: ' cal' },
    { label: 'Exercise', value: 28,  goal: 30,  color: '#A0E92F', unit: ' min' },
    { label: 'Stand',    value: 9,   goal: 12,  color: '#5DD8FF', unit: ' hr'  },
  ]}
/>`

export default function ActivityRingsDocs() {
  const [key, setKey] = React.useState(0)

  return (
    <DocsPage
      title="Activity Rings"
      slug="activity-rings"
      description="Apple Watch-style concentric fitness rings. Each ring is a stroked SVG circle with its own SF color + soft glow filter, laid over a faded trail of the same color. Visible arc animates in via Framer's pathLength so we never measure circumference manually. When a ring overshoots its goal, a brighter second pass draws on top — that's how the Watch shows overachievers."
      category="168 · data"
    >
      <DocsSection title="Today's activity">
        <DemoCard className="min-h-[440px]">
          <div className="flex flex-col items-center gap-3">
            <ActivityRings
              key={key}
              size={240}
              centerLabel="Today"
              centerSubLabel="Wed · May 24"
              rings={[
                { label: 'Move', value: 412, goal: 600, color: '#FF375F', unit: ' cal' },
                { label: 'Exercise', value: 28, goal: 30, color: '#A0E92F', unit: ' min' },
                { label: 'Stand', value: 9, goal: 12, color: '#5DD8FF', unit: ' hr' },
              ]}
            />
            <button
              type="button"
              onClick={() => setKey((k) => k + 1)}
              className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[11.5px] font-semibold tracking-tight text-white/85 backdrop-blur transition-colors hover:bg-white/[0.08]"
            >
              ↻ Replay animation
            </button>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Goal-crusher — every ring overshoots">
        <DemoCard className="min-h-[440px]">
          <ActivityRings
            size={240}
            centerLabel="🔥"
            centerSubLabel="On fire"
            rings={[
              { label: 'Move', value: 920, goal: 600, color: '#FF375F', unit: ' cal' },
              { label: 'Exercise', value: 52, goal: 30, color: '#A0E92F', unit: ' min' },
              { label: 'Stand', value: 14, goal: 12, color: '#5DD8FF', unit: ' hr' },
            ]}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Custom — sleep stages, 4 rings">
        <DemoCard className="min-h-[460px]">
          <ActivityRings
            size={260}
            thickness={18}
            gap={3}
            centerLabel="7h 42m"
            centerSubLabel="Last night"
            rings={[
              { label: 'Deep', value: 84, goal: 90, color: '#0A84FF', unit: ' min' },
              { label: 'REM', value: 102, goal: 110, color: '#BF5AF2', unit: ' min' },
              { label: 'Core', value: 240, goal: 240, color: '#5E5CE6', unit: ' min' },
              { label: 'Awake', value: 36, goal: 30, color: '#FF9F0A', unit: ' min' },
            ]}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Compact, no legend, no center">
        <DemoCard className="min-h-[240px]">
          <ActivityRings
            size={160}
            thickness={14}
            gap={2}
            showLegend={false}
            rings={[
              { label: 'Move', value: 480, goal: 600, color: '#FF375F' },
              { label: 'Exercise', value: 30, goal: 30, color: '#A0E92F' },
              { label: 'Stand', value: 11, goal: 12, color: '#5DD8FF' },
            ]}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['rings', 'ActivityRing[] — { label, value, goal, color, unit? }.'],
            ['size', 'Outer size in px. Default 240.'],
            ['thickness', 'Stroke thickness per ring. Default 20.'],
            ['gap', 'Gap (px) between rings. Default 3.'],
            ['centerLabel / centerSubLabel', 'Optional center text slots.'],
            ['showLegend', 'Show per-ring legend below. Default true.'],
            ['className', 'Extra classes on the outer wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          Default Apple Watch palette: Move{' '}
          <code className="font-mono">#FF375F</code>, Exercise{' '}
          <code className="font-mono">#A0E92F</code>, Stand{' '}
          <code className="font-mono">#5DD8FF</code>.
        </p>
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
