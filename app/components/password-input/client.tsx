'use client'

import { useState } from 'react'
import { PasswordInput } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { PasswordInput } from '@/components/bahrawy'

<PasswordInput
  onChange={(val) => console.log(val)}
/>`

const CUSTOM_REQS_SNIPPET = `<PasswordInput
  requirements={[
    { label: 'At least 12 characters', test: (pw) => pw.length >= 12 },
    { label: 'Has a number', test: (pw) => /\\d/.test(pw) },
  ]}
/>`

export default function PasswordInputDocs() {
  const [val, setVal] = useState('')

  return (
    <DocsPage
      title="Password Input"
      slug="password-input"
      description="Password field with show/hide toggle, real-time strength meter, and configurable requirements checklist."
      category="52 · FORM"
    >
      {/* Basic */}
      <DocsSection title="Basic">
        <DemoCard>
          <PasswordInput value={val} onChange={setVal} />
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* No strength meter */}
      <DocsSection title="Without strength meter">
        <DemoCard>
          <PasswordInput showStrength={false} />
        </DemoCard>
      </DocsSection>

      {/* Custom requirements */}
      <DocsSection title="Custom requirements">
        <DemoCard>
          <PasswordInput
            requirements={[
              { label: 'At least 12 characters', test: (pw) => pw.length >= 12 },
              { label: 'Has a number', test: (pw) => /\d/.test(pw) },
            ]}
          />
        </DemoCard>
        <CodeBlock code={CUSTOM_REQS_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Disabled */}
      <DocsSection title="Disabled">
        <DemoCard>
          <PasswordInput disabled value="secret123" />
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'string', default: '—', description: 'Controlled password value' },
            { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Called on input change' },
            { name: 'placeholder', type: 'string', default: '"Enter password"', description: 'Input placeholder text' },
            { name: 'showStrength', type: 'boolean', default: 'true', description: 'Show strength meter' },
            { name: 'requirements', type: 'PasswordRequirement[]', default: '5 defaults', description: 'Custom requirements array' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable input' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
