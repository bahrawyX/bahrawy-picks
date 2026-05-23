'use client'

import { CopyButton } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { CopyButton } from '@/components/bahrawy'

<CopyButton text="npm install bahrawy" />`

const WITH_LABEL_SNIPPET = `<CopyButton
  text="npm install bahrawy"
  label="Copy"
/>`

export default function CopyButtonDocs() {
  return (
    <DocsPage
      title="Copy Button"
      slug="copy-button"
      description="One-click clipboard copy button with animated idle/copied/error states and tooltip feedback."
      category="31 · UI"
    >
      {/* Basic */}
      <DocsSection title="Basic">
        <DemoCard>
          <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
            <code className="flex-1 text-sm text-white/70">npm install bahrawy</code>
            <CopyButton text="npm install bahrawy" />
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* With label */}
      <DocsSection title="With label">
        <DemoCard>
          <CopyButton text="npm install bahrawy" label="Copy" />
        </DemoCard>
        <CodeBlock code={WITH_LABEL_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Variants */}
      <DocsSection title="Variants">
        <DemoCard>
          <div className="flex items-center gap-3">
            <CopyButton text="default" variant="default" />
            <CopyButton text="outline" variant="outline" />
            <CopyButton text="ghost" variant="ghost" />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Sizes */}
      <DocsSection title="Sizes">
        <DemoCard>
          <div className="flex items-center gap-3">
            <CopyButton text="sm" size="sm" />
            <CopyButton text="md" size="md" />
            <CopyButton text="lg" size="lg" />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'text', type: 'string', default: '—', description: 'Text to copy to clipboard' },
            { name: 'onCopy', type: '() => void', default: '—', description: 'Called on successful copy' },
            { name: 'onError', type: '(error: Error) => void', default: '—', description: 'Called on copy failure' },
            { name: 'duration', type: 'number', default: '2000', description: 'Reset delay in ms' },
            { name: 'variant', type: "'default' | 'outline' | 'ghost'", default: "'default'", description: 'Button style' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
            { name: 'label', type: 'string', default: '—', description: 'Optional text label next to icon' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
