'use client'

import * as React from 'react'
import { SegmentedControl } from '@/components/bahrawy/segmented-control'
import { List, Grid3x3, LayoutGrid, Globe, Lock, Users, Sun, Moon, Monitor } from 'lucide-react'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { SegmentedControl } from '@/components/bahrawy/segmented-control'

const [view, setView] = useState<'day' | 'week' | 'month'>('week')

<SegmentedControl
  value={view}
  onValueChange={setView}
  options={[
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>`

export default function SegmentedControlDocs() {
  const [view, setView] = React.useState<'day' | 'week' | 'month' | 'year'>('week')
  const [layout, setLayout] = React.useState<'list' | 'grid' | 'wall'>('grid')
  const [scope, setScope] = React.useState<'private' | 'team' | 'public'>('team')
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'auto'>('dark')

  return (
    <DocsPage
      title="Segmented Control"
      slug="segmented-control"
      description="iOS-style segmented picker. A pill of 2–N options with a sliding white indicator that glides between segments via Framer's layoutId. Supports icons + labels, three sizes (sm/md/lg), controlled / uncontrolled, and optional full-width. Apple spring physics on the slide."
      category="164 · form"
    >
      <DocsSection title="Sizes — sm · md · lg">
        <DemoCard className="min-h-[260px]">
          <div className="flex flex-col items-center gap-5">
            <SegmentedControl
              size="sm"
              value={view}
              onValueChange={setView}
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
            <SegmentedControl
              size="md"
              value={view}
              onValueChange={setView}
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
            <SegmentedControl
              size="lg"
              value={view}
              onValueChange={setView}
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Icons + labels — view selector">
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <SegmentedControl
              value={layout}
              onValueChange={setLayout}
              options={[
                { value: 'list', label: 'List', icon: <List strokeWidth={2.25} /> },
                { value: 'grid', label: 'Grid', icon: <Grid3x3 strokeWidth={2.25} /> },
                { value: 'wall', label: 'Wall', icon: <LayoutGrid strokeWidth={2.25} /> },
              ]}
            />
            <p className="font-mono text-[11px] tracking-tight text-white/45">
              layout = <span className="text-white/75">{layout}</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Icon-only — theme picker">
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <SegmentedControl
              size="md"
              value={theme}
              onValueChange={setTheme}
              options={[
                { value: 'light', label: <span className="sr-only">Light</span>, icon: <Sun strokeWidth={2.25} /> },
                { value: 'dark', label: <span className="sr-only">Dark</span>, icon: <Moon strokeWidth={2.25} /> },
                { value: 'auto', label: <span className="sr-only">Auto</span>, icon: <Monitor strokeWidth={2.25} /> },
              ]}
            />
            <p className="font-mono text-[11px] tracking-tight text-white/45">
              theme = <span className="text-white/75">{theme}</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Full-width, inside a form row">
        <DemoCard className="min-h-[260px]">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur">
            <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Who can view this doc?
            </p>
            <SegmentedControl
              fullWidth
              value={scope}
              onValueChange={setScope}
              options={[
                { value: 'private', label: 'Private', icon: <Lock strokeWidth={2.25} /> },
                { value: 'team', label: 'Team', icon: <Users strokeWidth={2.25} /> },
                { value: 'public', label: 'Public', icon: <Globe strokeWidth={2.25} /> },
              ]}
            />
            <p className="mt-3 text-[11.5px] tracking-tight text-white/55">
              {scope === 'private'
                ? 'Only you can open this doc.'
                : scope === 'team'
                ? 'Anyone on your workspace can open this doc.'
                : 'Anyone with the link can view this doc.'}
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['options', 'SegmentedControlOption[] — { value, label, icon?, disabled? }.'],
            ['value / onValueChange', 'Controlled value.'],
            ['defaultValue', 'Uncontrolled initial value.'],
            ['size', '"sm" | "md" | "lg". Default "md".'],
            ['fullWidth', 'Stretch to fill the container width.'],
            ['disabled', 'Disable the whole control.'],
            ['layoutId', 'Optional shared layoutId for the indicator (use when several controls share a page).'],
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
