'use client'

import { useState } from 'react'
import { CurrencyInput } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { CurrencyInput } from '@/components/bahrawy'

<CurrencyInput
  onChange={(value, currency) => {
    console.log(value, currency)
  }}
/>`

const FIXED_SNIPPET = `<CurrencyInput
  currency="EUR"
  showCurrencySelector={false}
  placeholder="0,00"
/>`

const LIMITED_SNIPPET = `<CurrencyInput
  defaultCurrency="GBP"
  allowedCurrencies={['USD', 'EUR', 'GBP', 'JPY']}
/>`

export default function CurrencyInputDocs() {
  const [value, setValue] = useState(0)
  const [currency, setCurrency] = useState('USD')

  return (
    <DocsPage
      title="Currency Input"
      slug="currency-input"
      description="Formatted currency input with Intl.NumberFormat, searchable currency selector, and 30 top currencies."
      category="07 · FORM"
    >
      {/* Basic */}
      <DocsSection title="Basic">
        <DemoCard>
          <div className="w-full max-w-sm">
            <CurrencyInput
              value={value}
              onChange={(v, c) => { setValue(v); setCurrency(c) }}
              onCurrencyChange={setCurrency}
            />
            {value > 0 && (
              <p className="mt-2 text-xs text-white/30">
                Value: {value} {currency}
              </p>
            )}
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Fixed currency */}
      <DocsSection title="Fixed currency (EUR)">
        <DemoCard>
          <div className="w-full max-w-sm">
            <CurrencyInput
              currency="EUR"
              showCurrencySelector={false}
              placeholder="0,00"
            />
          </div>
        </DemoCard>
        <CodeBlock code={FIXED_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Limited currencies */}
      <DocsSection title="Limited currencies">
        <DemoCard>
          <div className="w-full max-w-sm">
            <CurrencyInput
              defaultCurrency="GBP"
              allowedCurrencies={['USD', 'EUR', 'GBP', 'JPY']}
            />
          </div>
        </DemoCard>
        <CodeBlock code={LIMITED_SNIPPET} language="tsx" />
      </DocsSection>

      {/* With min/max */}
      <DocsSection title="With min/max constraints">
        <DemoCard>
          <div className="w-full max-w-sm">
            <CurrencyInput
              min={0}
              max={10000}
              defaultCurrency="USD"
              placeholder="0.00 (max $10,000)"
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Error */}
      <DocsSection title="Error state">
        <DemoCard>
          <div className="w-full max-w-sm">
            <CurrencyInput error="Amount is required" />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Disabled */}
      <DocsSection title="Disabled">
        <DemoCard>
          <div className="w-full max-w-sm">
            <CurrencyInput disabled defaultValue={1250.50} />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'number', default: '—', description: 'Controlled numeric value' },
            { name: 'onChange', type: '(value: number, currency: string) => void', default: '—', description: 'Called on value or currency change' },
            { name: 'defaultValue', type: 'number', default: '—', description: 'Default numeric value' },
            { name: 'currency', type: 'string', default: '—', description: 'Controlled currency code (e.g. "USD")' },
            { name: 'defaultCurrency', type: 'string', default: "'USD'", description: 'Default currency code' },
            { name: 'onCurrencyChange', type: '(currency: string) => void', default: '—', description: 'Called when currency changes' },
            { name: 'allowedCurrencies', type: 'string[]', default: '—', description: 'Limit available currencies by code' },
            { name: 'showCurrencySelector', type: 'boolean', default: 'true', description: 'Show the currency dropdown' },
            { name: 'locale', type: 'string', default: '—', description: 'Locale for number formatting (e.g. "de-DE")' },
            { name: 'min', type: 'number', default: '—', description: 'Minimum allowed value' },
            { name: 'max', type: 'number', default: '—', description: 'Maximum allowed value' },
            { name: 'placeholder', type: 'string', default: "'0.00'", description: 'Input placeholder text' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
            { name: 'error', type: 'string', default: '—', description: 'Error message' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
