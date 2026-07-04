'use client'

import { useState } from 'react'
import { JsonEditor } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SAMPLE_DATA = {
  name: 'Bahrawy',
  version: '1.0.0',
  description: 'React component library',
  features: ['TypeScript', 'Tailwind', 'Framer Motion'],
  config: {
    theme: 'dark',
    animations: true,
    maxItems: 100,
  },
  author: {
    name: 'Ahmed',
    role: 'Developer',
    links: {
      github: 'github.com/bahrawy',
      website: null,
    },
  },
}

const ARRAY_DATA = [
  { id: 1, name: 'Alpha', active: true },
  { id: 2, name: 'Beta', active: false },
  { id: 3, name: 'Gamma', active: true },
]

const BASIC_SNIPPET = `import { JsonEditor } from '@/components/bahrawy'

<JsonEditor
  defaultValue={{
    name: 'Bahrawy',
    version: '1.0.0',
    features: ['TypeScript', 'Tailwind'],
  }}
  onChange={(value) => console.log(value)}
/>`

const READONLY_SNIPPET = `<JsonEditor
  value={data}
  readOnly
  defaultExpanded
/>`

export default function JsonEditorDocs() {
  const [data, setData] = useState<Record<string, unknown>>(SAMPLE_DATA)

  return (
    <DocsPage
      title="JSON Editor"
      slug="json-editor"
      description="Interactive JSON editor with tree view, raw editing, inline value editing, type badges, and copy support."
      category="47 · DATA"
    >
      {/* Basic */}
      <DocsSection title="Basic (editable)">
        <DemoCard className="items-start">
          <div className="w-full max-w-2xl">
            <JsonEditor
              value={data}
              onChange={(v) => setData(v as Record<string, unknown>)}
            />
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Array data */}
      <DocsSection title="Array data">
        <DemoCard className="items-start">
          <div className="w-full max-w-2xl">
            <JsonEditor defaultValue={ARRAY_DATA} />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Read only */}
      <DocsSection title="Read only">
        <DemoCard className="items-start">
          <div className="w-full max-w-2xl">
            <JsonEditor value={SAMPLE_DATA} readOnly defaultExpanded />
          </div>
        </DemoCard>
        <CodeBlock code={READONLY_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Raw mode default */}
      <DocsSection title="Raw mode default">
        <DemoCard className="items-start">
          <div className="w-full max-w-2xl">
            <JsonEditor defaultValue={SAMPLE_DATA} defaultMode="raw" />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'Record<string, unknown> | unknown[]', default: '—', description: 'Controlled JSON value' },
            { name: 'onChange', type: '(value: Record<string, unknown> | unknown[]) => void', default: '—', description: 'Called on value change' },
            { name: 'defaultValue', type: 'Record<string, unknown> | unknown[]', default: '{}', description: 'Default JSON value' },
            { name: 'readOnly', type: 'boolean', default: 'false', description: 'Disable editing' },
            { name: 'defaultMode', type: "'tree' | 'raw'", default: "'tree'", description: 'Default view mode' },
            { name: 'defaultExpanded', type: 'boolean', default: 'true', description: 'Expand all nodes by default' },
            { name: 'maxDepth', type: 'number', default: '10', description: 'Maximum tree depth to auto-expand' },
            { name: 'virtualizeOver', type: 'number', default: '300', description: 'Virtualize the tree view once visible rows exceed this count' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
