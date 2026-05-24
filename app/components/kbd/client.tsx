'use client'

import { Kbd } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { Kbd } from '@/components/bahrawy'

<Kbd keys="mod+k" />`

const ARRAY_SNIPPET = `<Kbd keys={['shift', 'enter']} />`

export default function KbdDocs() {
  return (
    <DocsPage
      title="Kbd"
      slug="kbd"
      description="Keyboard shortcut display with automatic platform detection and Mac/Windows symbol mapping."
      category="58 · UI"
    >
      {/* Basic */}
      <DocsSection title="Basic shortcuts">
        <DemoCard>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Search</span>
              <Kbd keys="mod+k" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Save</span>
              <Kbd keys="mod+s" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Undo</span>
              <Kbd keys="mod+z" />
            </div>
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Array keys */}
      <DocsSection title="Array keys">
        <DemoCard>
          <div className="flex flex-wrap items-center gap-6">
            <Kbd keys={['shift', 'enter']} />
            <Kbd keys={['ctrl', 'alt', 'delete']} />
          </div>
        </DemoCard>
        <CodeBlock code={ARRAY_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Sizes */}
      <DocsSection title="Sizes">
        <DemoCard>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">sm</span>
              <Kbd keys="mod+k" size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">md</span>
              <Kbd keys="mod+k" size="md" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">lg</span>
              <Kbd keys="mod+k" size="lg" />
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      {/* Special keys */}
      <DocsSection title="Special keys">
        <DemoCard>
          <div className="flex flex-wrap items-center gap-4">
            <Kbd keys="enter" />
            <Kbd keys="backspace" />
            <Kbd keys="tab" />
            <Kbd keys="escape" />
            <Kbd keys="up" />
            <Kbd keys="down" />
            <Kbd keys="left" />
            <Kbd keys="right" />
            <Kbd keys="space" />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Single keys */}
      <DocsSection title="Single keys">
        <DemoCard>
          <div className="flex flex-wrap items-center gap-3">
            {['A', 'B', 'C', '1', '2', '3', 'F1', 'F12'].map((k) => (
              <Kbd key={k} keys={k} />
            ))}
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'keys', type: 'string | string[]', default: '—', description: 'Key(s) to display. String is split by "+".' },
            { name: 'separator', type: 'string', default: '"+"', description: 'Visual separator between keys' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Key badge size' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
