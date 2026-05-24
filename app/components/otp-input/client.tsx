'use client'

import { useCallback, useState } from 'react'
import { OTPInput } from '@/components/bahrawy'
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

// ---------------------------------------------------------------------------
// Snippets
// ---------------------------------------------------------------------------

const BASIC_SNIPPET = `import { OTPInput } from '@/components/bahrawy'

<OTPInput onComplete={(code) => console.log(code)} />`

const ALPHA_SNIPPET = `<OTPInput
  inputType="alphanumeric"
  length={4}
  onComplete={(v) => console.log(v)}
/>`

const SEP_SNIPPET = `<OTPInput
  separator
  groupSize={3}
  onComplete={(v) => console.log(v)}
/>`

const STATUS_SNIPPET = `const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')

<OTPInput
  status={status}
  errorMessage={status === 'error' ? 'Invalid code' : undefined}
  onComplete={(code) => {
    if (code === '123456') setStatus('success')
    else setStatus('error')
  }}
/>`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OTPInputDocs() {
  const [basic, setBasic] = useState('')
  const [alpha, setAlpha] = useState('')
  const [sepValue, setSepValue] = useState('')
  const [statusDemo, setStatusDemo] = useState<'idle' | 'error' | 'success'>('idle')
  const [statusValue, setStatusValue] = useState('')
  const [autoValue, setAutoValue] = useState('')
  const [autoStatus, setAutoStatus] = useState<'idle' | 'error' | 'success'>('idle')

  const handleAutoComplete = useCallback((code: string) => {
    setAutoValue(code)
    if (code === '123456') {
      setAutoStatus('success')
    } else {
      setAutoStatus('error')
      setTimeout(() => setAutoStatus('idle'), 1500)
    }
  }, [])

  const resetStatus = () => {
    setStatusDemo('idle')
    setStatusValue('')
  }

  return (
    <DocsPage
      title="OTP Input"
      slug="otp-input"
      description="One-time password input with animated character boxes, paste support, auto-focus navigation, and error/success states."
      category="42 · DATA"
    >
      {/* ---- Basic 6-digit ---- */}
      <DocsSection title="Basic 6-digit">
        <DemoCard>
          <div className="flex flex-col items-center gap-3">
            <OTPInput
              value={basic}
              onChange={setBasic}
              autoFocus
              onComplete={(v) => console.log('Complete:', v)}
            />
            <p className="text-xs text-white/30">Value: {basic || '–'}</p>
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Alphanumeric ---- */}
      <DocsSection title="Alphanumeric (4-digit)">
        <DemoCard>
          <div className="flex flex-col items-center gap-3">
            <OTPInput
              inputType="alphanumeric"
              length={4}
              value={alpha}
              onChange={setAlpha}
              onComplete={(v) => console.log('Alpha complete:', v)}
            />
            <p className="text-xs text-white/30">Value: {alpha || '–'}</p>
          </div>
        </DemoCard>
        <CodeBlock code={ALPHA_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- With separator ---- */}
      <DocsSection title="With separator">
        <DemoCard>
          <div className="flex flex-col items-center gap-3">
            <OTPInput
              separator
              groupSize={3}
              value={sepValue}
              onChange={setSepValue}
              onComplete={(v) => console.log('Sep complete:', v)}
            />
            <p className="text-xs text-white/30">Value: {sepValue || '–'}</p>
          </div>
        </DemoCard>
        <CodeBlock code={SEP_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Error & Success states ---- */}
      <DocsSection title="Error & Success states">
        <DemoCard>
          <div className="flex flex-col items-center gap-4">
            <OTPInput
              value={statusValue}
              onChange={(v) => {
                setStatusValue(v)
                if (statusDemo !== 'idle') setStatusDemo('idle')
              }}
              status={statusDemo}
              errorMessage={statusDemo === 'error' ? 'Invalid verification code' : undefined}
            />
            <ControlsRow>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStatusDemo('error')}
                className="text-xs"
              >
                Trigger Error
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStatusDemo('success')}
                className="text-xs"
              >
                Trigger Success
              </Button>
              <Button size="sm" variant="ghost" onClick={resetStatus} className="text-xs">
                Reset
              </Button>
            </ControlsRow>
          </div>
        </DemoCard>
        <CodeBlock code={STATUS_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Auto-submit on complete ---- */}
      <DocsSection title="Auto-submit on complete">
        <DemoCard>
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-white/40 mb-2">
              Type <span className="font-mono text-white/60">123456</span> for success, anything else for error
            </p>
            <OTPInput
              value={autoValue}
              onChange={(v) => {
                setAutoValue(v)
                if (autoStatus !== 'idle') setAutoStatus('idle')
              }}
              status={autoStatus}
              errorMessage={autoStatus === 'error' ? 'Wrong code — try 123456' : undefined}
              onComplete={handleAutoComplete}
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- Disabled ---- */}
      <DocsSection title="Disabled">
        <DemoCard>
          <OTPInput value="38" disabled />
        </DemoCard>
      </DocsSection>

      {/* ---- Props ---- */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'length', type: 'number', default: '6', description: 'Number of input boxes' },
            { name: 'inputType', type: "'numeric' | 'alphanumeric'", default: "'numeric'", description: 'Allowed character types' },
            { name: 'value', type: 'string', default: '—', description: 'Controlled value' },
            { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Called on every change' },
            { name: 'onComplete', type: '(value: string) => void', default: '—', description: 'Called when all boxes are filled' },
            { name: 'separator', type: 'ReactNode | boolean', default: 'false', description: 'true = dash, ReactNode = custom separator between groups' },
            { name: 'groupSize', type: 'number', default: '3', description: 'Boxes per group for separator placement' },
            { name: 'status', type: "'idle' | 'error' | 'success'", default: "'idle'", description: 'Visual status state' },
            { name: 'errorMessage', type: 'string', default: '—', description: 'Error text shown below boxes' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all inputs' },
            { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focus first box on mount' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
