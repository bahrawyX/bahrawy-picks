'use client'

import { useState } from 'react'
import type { CountryCode } from 'libphonenumber-js/min'
import { PhoneInput } from '@/components/bahrawy/phone-input'
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

const COUNTRIES: { code: CountryCode; label: string }[] = [
  { code: 'US', label: 'US' },
  { code: 'GB', label: 'UK' },
  { code: 'EG', label: 'EG' },
  { code: 'IN', label: 'IN' },
  { code: 'JP', label: 'JP' },
]

const SNIPPET = `import { PhoneInput } from '@/components/bahrawy'
import { Controller, useForm } from 'react-hook-form'
import { isValidPhoneNumber } from 'libphonenumber-js/min'

const { control } = useForm<{ phone: string }>()

<Controller
  name="phone"
  control={control}
  rules={{
    validate: (v) => isValidPhoneNumber(v ?? '') || 'Invalid phone number',
  }}
  render={({ field, fieldState }) => (
    <PhoneInput
      {...field}
      defaultCountry="US"
      error={!!fieldState.error}
      placeholder="Phone number"
    />
  )}
/>`

const UNCONTROLLED_SNIPPET = `// Uncontrolled — no state needed. The hidden input named "phone"
// submits the E.164 value with the surrounding <form>.
<form action="/api/contact" method="post">
  <PhoneInput
    name="phone"
    defaultValue="+12025551234"
    label="Phone number"
    error={submitted && !valid ? 'Enter a valid phone number' : undefined}
  />
</form>`

export default function PhoneInputDocs() {
  const [value, setValue] = useState<string | undefined>()
  const [country, setCountry] = useState<CountryCode>('US')
  const [error, setError] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <DocsPage
      category="27 · form"
      title="Phone input"
      slug="phone-input"
      description="International phone input with searchable country selector, as-you-type formatting, and E.164 output. Built on libphonenumber-js + shadcn Command."
    >
      <DocsSection title="Live demo">
        <DemoCard>
          <div className="w-full max-w-sm space-y-4">
            <PhoneInput
              value={value}
              onChange={setValue}
              defaultCountry={country}
              disabled={disabled}
              error={error}
              placeholder="Phone number"
            />
            <p className="text-center font-mono text-xs text-white/40">
              {value ? `value = ${value}` : 'value = undefined'}
            </p>
          </div>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Default country</ControlLabel>
          {COUNTRIES.map((c) => (
            <Button
              key={c.code}
              size="sm"
              variant={country === c.code ? 'default' : 'outline'}
              onClick={() => {
                setCountry(c.code)
                setValue(undefined)
              }}
            >
              {c.label}
            </Button>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
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

      <DocsSection title="Uncontrolled with label & form name">
        <DemoCard>
          <div className="w-full max-w-sm">
            <PhoneInput
              name="phone"
              defaultValue="+12025551234"
              label="Phone number"
            />
          </div>
        </DemoCard>
        <CodeBlock code={UNCONTROLLED_SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="React Hook Form">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'string | undefined', description: 'E.164-formatted phone number (controlled).' },
            { name: 'onChange', type: '(value) => void', description: 'Fires when the parsed value changes.' },
            { name: 'defaultValue', type: 'string', description: 'Initial E.164 value (uncontrolled).' },
            { name: 'defaultCountry', type: 'CountryCode', default: '"US"', description: 'Initial country (ISO-3166 alpha-2).' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable input and country select.' },
            { name: 'label', type: 'string', description: 'Label above the field, linked via htmlFor.' },
            { name: 'error', type: 'boolean | string', default: 'false', description: 'Error styling; a string also renders the message (aria-describedby / aria-invalid).' },
            { name: 'placeholder', type: 'string', description: 'Number input placeholder.' },
            { name: 'name', type: 'string', description: 'Hidden input submits the E.164 value under this name.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['libphonenumber-js', 'cmdk', '@radix-ui/react-popover'].map(
            (d) => (
              <code
                key={d}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
              >
                {d}
              </code>
            )
          )}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
