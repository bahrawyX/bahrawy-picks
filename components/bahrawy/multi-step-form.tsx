'use client'

/**
 * <MultiStepForm />
 *
 * A multi-step wizard built on React Hook Form with per-step Zod validation
 * and Framer Motion animations.
 *
 * Renders a `<Stepper />` at the top to show progress, slides between steps
 * with directional animations (forward = slideLeft, backward = slideRight),
 * and persists all field values when navigating back (`shouldUnregister: false`).
 *
 * Steps render inside a real `<form>`, so pressing Enter in a field advances
 * to the next step (or submits on the last step) through the same validation
 * path as the Next button.
 *
 * @param steps - Ordered array of step definitions. Each step has a `title`,
 *   optional `description`, a `schema` (Zod) for per-step validation, a
 *   `component` that renders form fields via `useFormContext()`, and an
 *   optional explicit `fields` list naming the fields the step owns.
 * @param onComplete - Async callback receiving the merged, fully-validated
 *   form data when the user submits the final step.
 * @param onStepChange - Optional callback fired with the new zero-based step
 *   index whenever the active step changes.
 * @param submitLabel - Label for the final-step submit button. Defaults to
 *   `'Submit'`.
 * @param defaultValues - Seed values for any field across any step.
 * @param className - Additional class names for the outer wrapper.
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
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/bahrawy/stepper'
import { cn } from '@/lib/utils'
import {
  springSnappy,
  springGentle,
  tweenSmooth,
  tweenExit,
  fadeUp,
  slideLeft,
  slideRight,
  scaleIn,
  staggerContainer,
} from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface MultiStepFormStep {
  title: string
  description?: string
  schema: z.ZodType
  component: React.ComponentType
  /**
   * Explicit list of field names this step owns. Used to clear stale
   * validation errors before re-validating the step. When omitted, only
   * errors previously set by this component are cleared.
   */
  fields?: string[]
}

export interface MultiStepFormProps<T extends FieldValues> {
  steps: MultiStepFormStep[]
  onComplete: (data: T) => Promise<void>
  onStepChange?: (index: number) => void
  submitLabel?: string
  defaultValues?: DefaultValues<T>
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function MultiStepForm<T extends FieldValues>({
  steps,
  onComplete,
  onStepChange,
  submitLabel = 'Submit',
  defaultValues,
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

  const shakeControls = useAnimation()

  // Error paths set by validateStep, per step index — tracked so they can be
  // cleared on re-validation without introspecting Zod internals.
  const setErrorPathsRef = React.useRef<Record<number, string[]>>({})

  const methods = useForm<T>({
    defaultValues,
    mode: 'onSubmit',
    shouldUnregister: false,
  })

  const goTo = React.useCallback(
    (idx: number) => {
      if (idx === step || idx < 0 || idx >= steps.length) return
      setDirection(idx > step ? 'forward' : 'back')
      setStep(idx)
      onStepChange?.(idx)
    },
    [step, steps.length, onStepChange]
  )

  const validateStep = React.useCallback(
    async (idx: number): Promise<boolean> => {
      const values = methods.getValues()
      const result = steps[idx].schema.safeParse(values)

      // Clear prior errors on this step: the explicit field list when
      // provided, plus any paths set by a previous validation pass.
      const known = new Set([
        ...(steps[idx].fields ?? []),
        ...(setErrorPathsRef.current[idx] ?? []),
      ])
      known.forEach((f) => methods.clearErrors(f as Path<T>))

      if (!result.success) {
        const setPaths: string[] = []
        result.error.issues.forEach((issue) => {
          const path = issue.path.join('.')
          if (path) {
            setPaths.push(path)
            methods.setError(path as Path<T>, {
              type: 'zod',
              message: issue.message,
            })
          }
        })
        setErrorPathsRef.current[idx] = setPaths
        setStepErrors((prev) => ({ ...prev, [idx]: true }))
        return false
      }

      setErrorPathsRef.current[idx] = []

      setStepErrors((prev) => {
        if (!prev[idx]) return prev
        const next = { ...prev }
        delete next[idx]
        return next
      })
      return true
    },
    [methods, steps]
  )

  const isLast = step === steps.length - 1

  const handleNext = React.useCallback(async () => {
    const ok = await validateStep(step)
    if (!ok) {
      // Shake the step content to signal validation error.
      shakeControls.start({
        x: [0, -4, 4, -4, 0],
        transition: { duration: 0.3 },
      })
      return
    }

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
  }, [validateStep, step, isLast, shakeControls, onComplete, methods, goTo])

  const handleBack = React.useCallback(() => {
    goTo(step - 1)
  }, [goTo, step])

  // Native form submission (Enter in a field, or the submit button) advances
  // through the same validation path as the Next button.
  const handleFormSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (submitting) return
      void handleNext()
    },
    [handleNext, submitting]
  )

  // Build stepper steps with error status overlay.
  const stepperSteps = React.useMemo(
    () =>
      steps.map((s, i) => ({
        title: s.title,
        description: s.description,
        status: stepErrors[i] ? ('error' as const) : undefined,
      })),
    [steps, stepErrors]
  )

  // Determine the slide animation based on navigation direction.
  const slideVariants = React.useMemo(
    () => (direction === 'forward' ? slideLeft : slideRight),
    [direction]
  )

  const CurrentComponent = steps[step].component

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={handleFormSubmit}
        className={cn('flex flex-col gap-8', className)}
      >
        {/* Progress stepper */}
        <Stepper
          steps={stepperSteps}
          currentStep={step}
          clickable
          onStepChange={goTo}
        />

        {/* Step content with slide animation */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={slideVariants.initial}
              animate={slideVariants.animate}
              exit={slideVariants.exit}
              transition={tweenSmooth}
            >
              <motion.div animate={shakeControls}>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <StepContent component={CurrentComponent} />
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 border-t border-picks-fg/10 pt-6">
          <motion.div whileTap={{ scale: 0.97 }} transition={springSnappy}>
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
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
            layout
          >
            <motion.div layout transition={springGentle}>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? (
                  <>
                    <motion.span
                      key="loader"
                      initial={scaleIn.initial}
                      animate={scaleIn.animate}
                      exit={scaleIn.exit}
                      transition={tweenSmooth}
                      className="inline-flex"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </motion.span>
                    Submitting&hellip;
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
            </motion.div>
          </motion.div>
        </div>
      </form>
    </FormProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*  Step content wrapper                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Wraps each step's component in a motion container that participates in the
 * stagger animation. Using a separate component avoids re-creating the step
 * component on every parent render.
 */
function StepContent({
  component: Component,
}: {
  component: React.ComponentType
}) {
  return (
    <motion.div variants={fadeUp} transition={tweenSmooth}>
      <Component />
    </motion.div>
  )
}
