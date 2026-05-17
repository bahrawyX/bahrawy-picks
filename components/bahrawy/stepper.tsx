'use client'

/**
 * <Stepper />
 *
 * A multi-step progress indicator with Framer Motion animations.
 * Supports horizontal and vertical orientations, clickable completed steps,
 * and per-step error overrides.
 *
 * @param steps - Array of step definitions ({ title, description?, icon?, status? }).
 * @param currentStep - Zero-based index of the active step.
 * @param orientation - Layout direction: `'horizontal'` (default) or `'vertical'`.
 * @param clickable - When `true`, completed steps become clickable to jump back.
 * @param onStepChange - Callback fired with the step index when a clickable step is clicked.
 * @param className - Optional additional class names for the outer `<ol>` element.
 */

import * as React from 'react'
import { Check, X, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  springSnappy,
  tweenSmooth,
  fadeUp,
  scaleIn,
} from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StepperStep {
  title: string
  description?: string
  icon?: React.ReactNode
  /** Force error styling on this step regardless of its computed position. */
  status?: 'error'
}

export interface StepperProps {
  steps: StepperStep[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  clickable?: boolean
  onStepChange?: (index: number) => void
  className?: string
}

type StepStatus = 'completed' | 'current' | 'upcoming' | 'error'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeStatus(
  index: number,
  currentStep: number,
  override?: 'error',
): StepStatus {
  if (override === 'error') return 'error'
  if (index < currentStep) return 'completed'
  if (index === currentStep) return 'current'
  return 'upcoming'
}

/** Background color mapped to each status — used by Framer Motion `animate`. */
const statusBg: Record<StepStatus, string> = {
  completed: 'rgb(16 185 129)',   // emerald-500
  current: 'rgb(0 0 0)',          // black
  upcoming: 'rgb(39 39 42)',      // zinc-800
  error: 'rgba(244 63 94 / 0.15)', // rose-500/15
}

/** Border color mapped to each status. */
const statusBorder: Record<StepStatus, string> = {
  completed: 'rgb(16 185 129)',   // emerald-500
  current: 'rgb(255 255 255)',    // white
  upcoming: 'rgb(63 63 70)',      // zinc-700
  error: 'rgb(244 63 94)',        // rose-500
}

// ---------------------------------------------------------------------------
// Stepper (root)
// ---------------------------------------------------------------------------

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  clickable = false,
  onStepChange,
  className,
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <ol
      aria-label="Progress"
      className={cn(
        'flex',
        isHorizontal ? 'w-full items-start' : 'flex-col gap-1',
        className,
      )}
    >
      {steps.map((step, index) => {
        const status = computeStatus(index, currentStep, step.status)
        const isLast = index === steps.length - 1
        const canJump = clickable && status === 'completed'

        return (
          <li
            key={index}
            className={cn(
              'group flex',
              isHorizontal
                ? 'flex-1 items-start'
                : 'flex-row items-stretch gap-3',
            )}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            {/* ---- Indicator column (circle + vertical connector) ---- */}
            <div className="flex shrink-0 flex-col items-center">
              <StepCircle
                step={step}
                index={index}
                status={status}
                clickable={canJump}
                onClick={() => canJump && onStepChange?.(index)}
              />

              {!isLast && !isHorizontal && (
                <VerticalConnector status={status} />
              )}
            </div>

            {/* ---- Label (+ horizontal connector for horizontal layout) ---- */}
            {isHorizontal ? (
              <div className="flex flex-1 flex-col items-center px-2 pb-1 text-center">
                <StepLabel step={step} status={status} compact />
              </div>
            ) : (
              <div className="flex-1 pb-6 pt-1">
                <StepLabel step={step} status={status} />
              </div>
            )}

            {isHorizontal && !isLast && (
              <HorizontalConnector status={status} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ---------------------------------------------------------------------------
// StepCircle
// ---------------------------------------------------------------------------

interface StepCircleProps {
  step: StepperStep
  index: number
  status: StepStatus
  clickable: boolean
  onClick: () => void
}

function StepCircle({ step, index, status, clickable, onClick }: StepCircleProps) {
  const content = (
    <AnimatePresence mode="wait">
      {status === 'completed' ? (
        <motion.span
          key="check"
          {...scaleIn}
          transition={springSnappy}
          className="inline-flex items-center justify-center text-white"
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </motion.span>
      ) : status === 'error' ? (
        <motion.span
          key="error"
          {...scaleIn}
          transition={springSnappy}
          className="inline-flex items-center justify-center text-rose-400"
        >
          <AlertCircle className="h-4 w-4" strokeWidth={2.5} />
        </motion.span>
      ) : step.icon ? (
        <motion.span
          key="icon"
          {...scaleIn}
          transition={springSnappy}
          className="inline-flex h-4 w-4 items-center justify-center [&>svg]:h-4 [&>svg]:w-4"
        >
          {step.icon}
        </motion.span>
      ) : (
        <motion.span
          key="number"
          {...scaleIn}
          transition={springSnappy}
          className="text-xs font-semibold tabular-nums"
        >
          {index + 1}
        </motion.span>
      )}
    </AnimatePresence>
  )

  const sharedClasses =
    'relative inline-flex h-9 w-9 items-center justify-center rounded-full border'

  if (clickable) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={`Go back to step ${index + 1}: ${step.title}`}
        className={cn(sharedClasses, 'cursor-pointer')}
        animate={{
          backgroundColor: statusBg[status],
          borderColor: statusBorder[status],
          scale: 1,
        }}
        whileHover={{ scale: 1.05 }}
        transition={springSnappy}
      >
        {content}
      </motion.button>
    )
  }

  return (
    <motion.div
      aria-hidden
      className={sharedClasses}
      initial={status === 'current' ? { scale: 0.8 } : { scale: 1 }}
      animate={{
        backgroundColor: statusBg[status],
        borderColor: statusBorder[status],
        scale: 1,
      }}
      transition={springSnappy}
    >
      {content}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// StepLabel
// ---------------------------------------------------------------------------

function StepLabel({
  step,
  status,
  compact = false,
}: {
  step: StepperStep
  status: StepStatus
  compact?: boolean
}) {
  return (
    <motion.div
      className={cn('min-w-0', compact && 'mt-2')}
      {...(status === 'current' ? fadeUp : {})}
      transition={tweenSmooth}
    >
      <p
        className={cn(
          'truncate text-sm font-medium',
          status === 'completed' && 'text-white',
          status === 'current' && 'text-white',
          status === 'upcoming' && 'text-zinc-500',
          status === 'error' && 'text-rose-400',
        )}
      >
        {step.title}
      </p>

      {step.description && (
        <p
          className={cn(
            'mt-0.5 text-xs',
            status === 'upcoming' ? 'text-zinc-600' : 'text-zinc-400',
            compact && 'truncate',
          )}
        >
          {step.description}
        </p>
      )}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Connectors
// ---------------------------------------------------------------------------

function HorizontalConnector({ status }: { status: StepStatus }) {
  const filled = status === 'completed'

  return (
    <div
      aria-hidden
      className="-mx-2 mt-[18px] h-px flex-1 self-start overflow-hidden bg-zinc-800"
    >
      <motion.div
        className="h-full bg-emerald-500"
        initial={{ width: '0%' }}
        animate={{ width: filled ? '100%' : '0%' }}
        transition={tweenSmooth}
      />
    </div>
  )
}

function VerticalConnector({ status }: { status: StepStatus }) {
  const filled = status === 'completed'

  return (
    <div
      aria-hidden
      className="mt-1 min-h-6 w-px flex-1 overflow-hidden bg-zinc-800"
    >
      <motion.div
        className="w-full bg-emerald-500"
        initial={{ height: '0%' }}
        animate={{ height: filled ? '100%' : '0%' }}
        transition={tweenSmooth}
      />
    </div>
  )
}
