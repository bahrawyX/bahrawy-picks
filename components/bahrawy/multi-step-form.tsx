'use client'

/**
 * <MultiStepForm />
 *
 * A multi-step wizard built on React Hook Form with per-step Zod validation.
 * Renders a <Stepper /> at the top, slides between steps using Material
 * shared-axis motion (300ms), and persists field values when navigating back.
 *
 * | Prop          | Type                                  | Default    | Description                                                |
 * | ------------- | ------------------------------------- | ---------- | ---------------------------------------------------------- |
 * | steps         | MultiStepFormStep[]                   | required   | Ordered list of { title, description?, schema, component } |
 * | onComplete    | (data) => void \| Promise<void>        | required   | Receives merged form data on final submit.                 |
 * | onStepChange  | (index: number) => void                | —          | Fires whenever the active step changes.                    |
 * | defaultValues | Partial<T>                            | —          | Seed values for any field across any step.                 |
 * | submitLabel   | string                                | 'Submit'   | Label of the final-step button.                            |
 * | className     | string                                | —          | Outer wrapper class names.                                 |
 *
 * Each `step.component` is rendered inside a <FormProvider />; use
 * `useFormContext()` from react-hook-form to register fields.
 */

import * as React from 'react'
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import * as z from 'zod'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Stepper, type StepStatus } from './stepper'

export interface MultiStepFormStep {
  title: string
  description?: string
  schema: z.ZodTypeAny
  component: React.ComponentType
}

export interface MultiStepFormProps<T extends FieldValues = FieldValues> {
  steps: MultiStepFormStep[]
  onComplete: (data: T) => void | Promise<void>
  onStepChange?: (index: number) => void
  defaultValues?: Partial<T>
  submitLabel?: string
  className?: string
}

/**
 * Walk a Zod schema (including ZodEffects from .refine/.transform, ZodOptional,
 * ZodNullable, ZodDefault) to find the underlying ZodObject and return its
 * top-level field names. Returns [] for non-object roots — the caller falls
 * back to schema-level validation in that case.
 */
function getFieldsFromSchema(schema: z.ZodTypeAny): string[] {
  const visited = new WeakSet<object>()

  function walk(s: unknown): string[] {
    if (!s || typeof s !== 'object' || visited.has(s)) return []
    visited.add(s)

    const anyS = s as {
      shape?: Record<string, unknown> | (() => Record<string, unknown>)
      _def?: {
        shape?: Record<string, unknown> | (() => Record<string, unknown>)
        schema?: unknown
        innerType?: unknown
        type?: unknown
      }
      def?: {
        shape?: Record<string, unknown> | (() => Record<string, unknown>)
        schema?: unknown
        innerType?: unknown
        type?: unknown
      }
    }

    const def = anyS._def ?? anyS.def
    const shape = anyS.shape ?? def?.shape

    if (shape) {
      const resolved = typeof shape === 'function' ? shape() : shape
      return Object.keys(resolved)
    }

    // Unwrap wrappers: ZodEffects (.schema), ZodOptional/Nullable/Default (.innerType),
    // some v4 wrappers expose the inner via (.type).
    const inner = def?.schema ?? def?.innerType ?? def?.type
    if (inner) return walk(inner)

    return []
  }

  return walk(schema)
}

export function MultiStepForm<T extends FieldValues = FieldValues>({
  steps,
  onComplete,
  onStepChange,
  defaultValues,
  submitLabel = 'Submit',
  className,
}: MultiStepFormProps<T>) {
  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState<'forward' | 'back'>(
    'forward'
  )
  const [submitting, setSubmitting] = React.useState(false)
  const [stepErrors, setStepErrors] = React.useState<Record<number, boolean>>(
    {}
  )

  const methods = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
    mode: 'onSubmit',
    shouldUnregister: false,
  })

  const goTo = (idx: number) => {
    if (idx === step || idx < 0 || idx >= steps.length) return
    setDirection(idx > step ? 'forward' : 'back')
    setStep(idx)
    onStepChange?.(idx)
  }

  const validateStep = async (idx: number): Promise<boolean> => {
    // Pass the full form values: Zod's default mode strips unlisted fields,
    // and refine() clauses get the data they need to run.
    const values = methods.getValues()
    const result = steps[idx].schema.safeParse(values)

    // Clear prior errors on this step's known fields (avoids leaving stale red).
    const fields = getFieldsFromSchema(steps[idx].schema)
    fields.forEach((f) => methods.clearErrors(f as Path<T>))

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        if (path) {
          methods.setError(path as Path<T>, {
            type: 'zod',
            message: issue.message,
          })
        }
      })
      setStepErrors((e) => ({ ...e, [idx]: true }))
      return false
    }

    setStepErrors((e) => {
      if (!e[idx]) return e
      const next = { ...e }
      delete next[idx]
      return next
    })
    return true
  }

  const isLast = step === steps.length - 1

  const handleNext = async () => {
    const ok = await validateStep(step)
    if (!ok) return
    if (isLast) {
      setSubmitting(true)
      try {
        await onComplete(methods.getValues())
      } finally {
        setSubmitting(false)
      }
    } else {
      goTo(step + 1)
    }
  }

  const handleBack = () => goTo(step - 1)

  const stepperSteps = steps.map((s, i) => ({
    title: s.title,
    description: s.description,
    status: stepErrors[i] ? ('error' as StepStatus) : undefined,
  }))

  const CurrentComponent = steps[step].component

  return (
    <FormProvider {...methods}>
      <div className={cn('flex flex-col gap-8', className)}>
        <Stepper
          steps={stepperSteps}
          currentStep={step}
          clickable
          onStepChange={goTo}
        />

        <div className="relative overflow-hidden">
          <div
            key={step}
            className={cn(
              direction === 'forward'
                ? 'animate-slide-in-right'
                : 'animate-slide-in-left'
            )}
          >
            <CurrentComponent />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 0 || submitting}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : isLast ? (
              submitLabel
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </FormProvider>
  )
}
