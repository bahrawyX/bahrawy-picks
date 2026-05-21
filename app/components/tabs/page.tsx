'use client'

import { useState } from 'react'
import { Tabs, type TabItem } from '@/components/bahrawy/tabs'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { ControlPanel, SelectControl } from '@/components/showcase/control-panel'

const ITEMS: TabItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    content:
      'A high-level look at the project. Built with React 19, Next.js 15, Tailwind, and Framer Motion. Drop a Bahrawy component into any modern stack and ship it.',
  },
  {
    id: 'features',
    label: 'Features',
    content:
      'Drag-drop boards, scroll-driven motion, type-safe forms, monaco code editor, virtual lists, dynamic islands — and a lot more. Every component is a single file you can read end-to-end.',
  },
  {
    id: 'install',
    label: 'Install',
    content:
      'Use the CLI to drop a component into your project: `npx bahrawy add <component>`. No npm install per component. The source becomes yours.',
  },
  {
    id: 'license',
    label: 'License',
    content:
      'MIT. Use it commercially, modify it freely, attribute if you want. Nothing in this library is locked behind a paywall.',
  },
]

const ACCENTS = {
  white: '#FFFFFF',
  red: '#EF2B2D',
  emerald: '#10B981',
  sky: '#38BDF8',
  amber: '#F59E0B',
}

export default function TabsDocs() {
  const [accent, setAccent] = useState<keyof typeof ACCENTS>('white')

  const snippet = `import { Tabs } from '@/components/bahrawy/tabs'

const items = [
  { id: 'overview', label: 'Overview', content: '...' },
  { id: 'features', label: 'Features', content: '...' },
]

<Tabs items={items} accentColor="${ACCENTS[accent]}" />`

  return (
    <DocsPage
      title="Tabs"
      slug="tabs"
      description="An animated tab bar with a sliding indicator under the active tab and a fade-through on the content panel. Powered by Framer Motion's layout animations — no math required."
      category="59 · navigation"
    >
      <DocsSection title="Live demo" description="Click a tab. The indicator springs between positions.">
        <DemoCard className="min-h-[280px] items-start">
          <div className="w-full max-w-2xl">
            <Tabs items={ITEMS} accentColor={ACCENTS[accent]} />
          </div>
        </DemoCard>
        <ControlPanel>
          <SelectControl
            label="Accent"
            value={accent}
            onChange={(v) => setAccent(v as keyof typeof ACCENTS)}
            options={Object.keys(ACCENTS).map((k) => ({ label: k, value: k }))}
          />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['items', 'TabItem[] — { id, label, content }'],
            ['defaultId', 'Start tab id (uncontrolled).'],
            ['value', 'Active id (controlled with onValueChange).'],
            ['onValueChange', '(id) => void. Fires on tab click.'],
            ['accentColor', 'Color for the indicator + active label. Default #FFFFFF.'],
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
          <code className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">framer-motion</code>
        </div>
      </DocsSection>
    </DocsPage>
  )
}
