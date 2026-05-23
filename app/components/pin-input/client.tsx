'use client'

import { useState } from 'react'
import { PinInput } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { PinInput } from '@/components/bahrawy'

<PinInput
  onComplete={(pin) => console.log('PIN:', pin)}
/>`

const SIX_DIGIT_SNIPPET = `<PinInput
  length={6}
  mask={false}
  onComplete={(pin) => console.log(pin)}
/>`

const CIRCLE_SNIPPET = `<PinInput
  shape="circle"
  size="lg"
  onComplete={(pin) => console.log(pin)}
/>`

export default function PinInputDocs() {
  const [basicValue, setBasicValue] = useState('')
  const [sixValue, setSixValue] = useState('')

  return (
    <DocsPage
      title="PIN Input"
      slug="pin-input"
      description="Masked numeric PIN input with show/hide toggle, paste support, auto-focus navigation, and animated digit entry."
      category="26 · FORM"
    >
      {/* Basic */}
      <DocsSection title="Basic (4-digit)">
        <DemoCard>
          <div className="flex flex-col items-center gap-4">
            <PinInput
              value={basicValue}
              onChange={setBasicValue}
              onComplete={(pin) => console.log('PIN:', pin)}
              autoFocus
            />
            {basicValue.length === 4 && (
              <p className="text-xs text-white/40">PIN: {basicValue}</p>
            )}
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 6-digit unmasked */}
      <DocsSection title="6-digit (unmasked)">
        <DemoCard>
          <PinInput
            length={6}
            mask={false}
            value={sixValue}
            onChange={setSixValue}
          />
        </DemoCard>
        <CodeBlock code={SIX_DIGIT_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Circle shape */}
      <DocsSection title="Circle shape (large)">
        <DemoCard>
          <PinInput shape="circle" size="lg" />
        </DemoCard>
        <CodeBlock code={CIRCLE_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Error state */}
      <DocsSection title="Error state">
        <DemoCard>
          <PinInput error="Invalid PIN. Try again." />
        </DemoCard>
      </DocsSection>

      {/* Small size */}
      <DocsSection title="Small size">
        <DemoCard>
          <PinInput size="sm" length={5} />
        </DemoCard>
      </DocsSection>

      {/* Disabled */}
      <DocsSection title="Disabled">
        <DemoCard>
          <PinInput disabled value="1234" />
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'length', type: 'number', default: '4', description: 'Number of PIN digits' },
            { name: 'value', type: 'string', default: '—', description: 'Controlled value' },
            { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Called on each digit change' },
            { name: 'onComplete', type: '(value: string) => void', default: '—', description: 'Called when all digits are entered' },
            { name: 'mask', type: 'boolean', default: 'true', description: 'Mask digits with a dot character' },
            { name: 'maskChar', type: 'string', default: '"•"', description: 'Character used to mask digits' },
            { name: 'shape', type: "'square' | 'circle'", default: "'square'", description: 'Shape of digit boxes' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of digit boxes' },
            { name: 'error', type: 'boolean | string', default: 'false', description: 'Error state or error message' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable input' },
            { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Auto-focus first input on mount' },
            { name: 'placeholder', type: 'string', default: '—', description: 'Placeholder for empty boxes' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
