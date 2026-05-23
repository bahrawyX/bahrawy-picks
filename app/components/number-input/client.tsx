'use client'

import { useState } from 'react'
import { NumberInput } from '@/components/bahrawy/number-input'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  ControlLabel,
  ControlsRow,
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SNIPPET = `import { NumberInput } from '@/components/bahrawy'

const [amount, setAmount] = useState<number | null>(120)

<NumberInput
  value={amount}
  onChange={setAmount}
  min={0}
  max={10_000}
  step={5}
  precision={2}
  prefix="$"
  placeholder="0.00"
/>`

export default function NumberInputDocs() {
  const [amount, setAmount] = useState<number | null>(120)
  const [weight, setWeight] = useState<number | null>(2.5)
  const [qty, setQty] = useState<number | null>(1)
  const [error, setError] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <DocsPage
      category="05 · form"
      title="Number input"
      slug="number-input"
      description="Stepper-flanked numeric input with +/- buttons, long-press to spin, arrow-key support (shift x 10), and Intl.NumberFormat blur formatting."
    >
      <DocsSection title="Live demo">
        <DemoCard>
          <div className="grid w-full max-w-md gap-6">
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40"
              >
                Amount (currency, precision 2)
              </label>
              <NumberInput
                id="amount"
                value={amount}
                onChange={setAmount}
                min={0}
                max={10_000}
                step={5}
                precision={2}
                prefix="$"
                disabled={disabled}
                error={error}
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="weight"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40"
              >
                Weight (suffix, step 0.1)
              </label>
              <NumberInput
                id="weight"
                value={weight}
                onChange={setWeight}
                min={0}
                max={500}
                step={0.1}
                precision={1}
                suffix="kg"
                disabled={disabled}
                error={error}
              />
            </div>
            <div>
              <label
                htmlFor="qty"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40"
              >
                Quantity (integers only)
              </label>
              <NumberInput
                id="qty"
                value={qty}
                onChange={setQty}
                min={1}
                max={99}
                step={1}
                disabled={disabled}
                error={error}
              />
            </div>
          </div>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>State</ControlLabel>
          <Button
            size="sm"
            variant={error ? 'default' : 'outline'}
            onClick={() => setError((v) => !v)}
          >
            Error
          </Button>
          <Button
            size="sm"
            variant={disabled ? 'default' : 'outline'}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </Button>
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Keyboard">
        <ul className="space-y-1.5 text-sm text-white/70">
          <li>
            <kbd className="mr-2 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px]">
              Up
            </kbd>
            Increment by step
          </li>
          <li>
            <kbd className="mr-2 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px]">
              Down
            </kbd>
            Decrement by step
          </li>
          <li>
            <kbd className="mr-2 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px]">
              Shift + Up/Down
            </kbd>
            Step x 10
          </li>
          <li>Hold + / - for long-press auto-repeat.</li>
        </ul>
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'number | null', description: 'Controlled value (null = empty).' },
            { name: 'onChange', type: '(next) => void', description: 'Fires on any value change.' },
            { name: 'min', type: 'number', default: '-Infinity', description: 'Minimum allowed value.' },
            { name: 'max', type: 'number', default: '+Infinity', description: 'Maximum allowed value.' },
            { name: 'step', type: 'number', default: '1', description: 'Increment for buttons + arrow keys.' },
            { name: 'precision', type: 'number', default: '0', description: 'Decimal places to clamp to.' },
            { name: 'prefix', type: 'string', description: 'Leading symbol (e.g. "$").' },
            { name: 'suffix', type: 'string', description: 'Trailing symbol (e.g. "kg").' },
            { name: 'locale', type: 'string', default: '"en-US"', description: 'Intl.NumberFormat locale for blur formatting.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all interaction.' },
            { name: 'error', type: 'boolean', default: 'false', description: 'Render error styling.' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
