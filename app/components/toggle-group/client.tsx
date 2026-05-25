'use client'

import * as React from 'react'
import { ToggleGroup } from '@/components/bahrawy/toggle-group'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

const SNIPPET = `import { ToggleGroup } from '@/components/bahrawy/toggle-group'

const [tags, setTags] = useState<string[]>(['urgent'])

<ToggleGroup
  value={tags}
  onValueChange={setTags}
  options={[
    { value: 'urgent',  label: 'Urgent' },
    { value: 'design',  label: 'Design' },
    { value: 'backend', label: 'Backend' },
    { value: 'bug',     label: 'Bug' },
  ]}
/>`

export default function ToggleGroupDocs() {
  const [tags, setTags] = React.useState<string[]>(['design', 'frontend'])
  const [format, setFormat] = React.useState<string[]>(['bold', 'italic'])
  const [align, setAlign] = React.useState<string[]>(['left'])

  return (
    <DocsPage
      title="Toggle Group"
      slug="toggle-group"
      description="Multi-select pill row. Cousin of <SegmentedControl /> but selection is a Set, not a single value. Two visual modes: 'pills' (separate pills, breathing room) or 'segmented' (joined row, like iOS Mail filter bar). Three sizes, icons + labels, controlled or uncontrolled."
      category="172 · form"
    >
      <DocsSection title="Pills — filter tags">
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <ToggleGroup
              value={tags}
              onValueChange={setTags}
              options={[
                { value: 'design', label: 'Design' },
                { value: 'frontend', label: 'Frontend' },
                { value: 'backend', label: 'Backend' },
                { value: 'devops', label: 'DevOps' },
                { value: 'docs', label: 'Docs' },
                { value: 'bug', label: 'Bug' },
              ]}
            />
            <p className="font-mono text-[11px] tabular-nums text-white/45">
              selected = <span className="text-white/75">[{tags.join(', ')}]</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Segmented — text formatting toolbar">
        <DemoCard className="min-h-[160px]">
          <div className="flex flex-col items-center gap-3">
            <ToggleGroup
              variant="segmented"
              value={format}
              onValueChange={setFormat}
              options={[
                { value: 'bold', label: <span className="sr-only">Bold</span>, icon: <Bold strokeWidth={2.5} /> },
                { value: 'italic', label: <span className="sr-only">Italic</span>, icon: <Italic strokeWidth={2.5} /> },
                { value: 'underline', label: <span className="sr-only">Underline</span>, icon: <Underline strokeWidth={2.5} /> },
              ]}
            />
            <p className="font-mono text-[11px] tabular-nums text-white/45">
              format = <span className="text-white/75">[{format.join(', ')}]</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Segmented + sm + required (always one)">
        <DemoCard className="min-h-[160px]">
          <div className="flex flex-col items-center gap-3">
            <ToggleGroup
              variant="segmented"
              size="sm"
              required
              value={align}
              onValueChange={setAlign}
              options={[
                { value: 'left', label: <span className="sr-only">Left</span>, icon: <AlignLeft strokeWidth={2.5} /> },
                { value: 'center', label: <span className="sr-only">Center</span>, icon: <AlignCenter strokeWidth={2.5} /> },
                { value: 'right', label: <span className="sr-only">Right</span>, icon: <AlignRight strokeWidth={2.5} /> },
              ]}
            />
            <p className="font-mono text-[11px] tabular-nums text-white/45">
              align = <span className="text-white/75">[{align.join(', ')}]</span>
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
            ['options', 'ToggleGroupOption[] — { value, label, icon?, disabled? }.'],
            ['value / onValueChange', 'Controlled selection (Set of values).'],
            ['defaultValue', 'Uncontrolled initial selection.'],
            ['variant', '"pills" | "segmented". Default "pills".'],
            ['size', '"sm" | "md" | "lg". Default "md".'],
            ['required', 'Always keep at least one option selected. Default false.'],
            ['disabled', 'Disable the entire group.'],
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
