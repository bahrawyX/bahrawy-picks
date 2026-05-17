'use client'

import { useState } from 'react'
import { CreditCard, User, Truck } from 'lucide-react'
import { Stepper, type StepperStep } from '@/components/bahrawy/stepper'
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

const ICON_STEPS: StepperStep[] = [
  { title: 'Account', description: 'Login details', icon: <User /> },
  { title: 'Payment', description: 'Billing info', icon: <CreditCard /> },
  { title: 'Shipping', description: 'Delivery address', icon: <Truck /> },
]

const NUMBER_STEPS: StepperStep[] = [
  { title: 'Cart', description: '3 items' },
  { title: 'Address' },
  { title: 'Payment' },
  { title: 'Review' },
  { title: 'Done' },
]

const SNIPPET = `import { Stepper } from '@/components/bahrawy'

<Stepper
  orientation="horizontal"
  currentStep={2}
  clickable
  onStepChange={(i) => setStep(i)}
  steps={[
    { title: 'Account', description: 'Login details' },
    { title: 'Payment', description: 'Billing info' },
    { title: 'Shipping', description: 'Delivery address' },
  ]}
/>`

export default function StepperDocs() {
  const [horizontalStep, setHorizontalStep] = useState(1)
  const [verticalStep, setVerticalStep] = useState(2)
  const [clickable, setClickable] = useState(true)
  const [errorAt, setErrorAt] = useState<number | null>(null)

  const stepsWithError = ICON_STEPS.map((s, i) =>
    errorAt === i ? { ...s, status: 'error' as const } : s
  )

  return (
    <DocsPage
      category="04 · navigation"
      title="Stepper"
      description="Multi-step progress indicator. Horizontal or vertical, with completed / current / upcoming / error states. Each step can be clickable to jump backwards."
    >
      <DocsSection title="Horizontal">
        <DemoCard className="min-h-[180px]">
          <div className="w-full">
            <Stepper
              steps={stepsWithError}
              currentStep={horizontalStep}
              clickable={clickable}
              onStepChange={setHorizontalStep}
            />
          </div>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Step</ControlLabel>
          {ICON_STEPS.map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={horizontalStep === i ? 'default' : 'outline'}
              onClick={() => setHorizontalStep(i)}
            >
              {i + 1}
            </Button>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
          <Button
            size="sm"
            variant={clickable ? 'default' : 'outline'}
            onClick={() => setClickable((v) => !v)}
          >
            Clickable
          </Button>
          <span className="mx-1 h-5 w-px bg-white/10" />
          <ControlLabel>Error at</ControlLabel>
          <Button
            size="sm"
            variant={errorAt === null ? 'default' : 'outline'}
            onClick={() => setErrorAt(null)}
          >
            None
          </Button>
          {ICON_STEPS.map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={errorAt === i ? 'default' : 'outline'}
              onClick={() => setErrorAt(i)}
            >
              {i + 1}
            </Button>
          ))}
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Vertical">
        <DemoCard>
          <div className="w-full max-w-sm">
            <Stepper
              orientation="vertical"
              steps={NUMBER_STEPS}
              currentStep={verticalStep}
              clickable
              onStepChange={setVerticalStep}
            />
          </div>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Step</ControlLabel>
          {NUMBER_STEPS.map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={verticalStep === i ? 'default' : 'outline'}
              onClick={() => setVerticalStep(i)}
            >
              {i + 1}
            </Button>
          ))}
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'steps', type: 'StepperStep[]', description: 'Array of step definitions.' },
            { name: 'currentStep', type: 'number', description: 'Zero-based index of the active step.' },
            { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout direction.' },
            { name: 'clickable', type: 'boolean', default: 'false', description: 'Allow clicking previous steps to jump back.' },
            { name: 'onStepChange', type: '(index: number) => void', description: 'Fires when user clicks a clickable step.' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
