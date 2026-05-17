'use client'

/**
 * <Stepper />
 *
 * Horizontal or vertical step indicator with M3 motion transitions.
 *
 * | Prop           | Type                                                  | Default        | Description                                              |
 * | -------------- | ----------------------------------------------------- | -------------- | -------------------------------------------------------- |
 * | steps          | StepperStep[]                                          | required       | Array of step definitions ({ title, description?, icon?, status? }) |
 * | currentStep    | number                                                | required       | Zero-based index of the active step.                     |
 * | orientation    | 'horizontal' \| 'vertical'                             | 'horizontal'   | Layout direction.                                        |
 * | clickable      | boolean                                               | false          | Allow clicking any non-upcoming step (jumps backward).   |
 * | onStepChange   | (index: number) => void                                | —              | Fires when user clicks a clickable step.                 |
 * | className      | string                                                | —              | Optional outer class names.                              |
 */

import * as React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'error'

export interface StepperStep {
  title: string
  description?: string
  icon?: React.ReactNode
  /** Override the computed status (e.g. mark a previous step as 'error'). */
  status?: StepStatus
}

export interface StepperProps {
  steps: StepperStep[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  clickable?: boolean
  onStepChange?: (index: number) => void
  className?: string
}

function computeStatus(
  index: number,
  currentStep: number,
  override?: StepStatus
): StepStatus {
  if (override) return override
  if (index < currentStep) return 'completed'
  if (index === currentStep) return 'current'
  return 'upcoming'
}

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
        className
      )}
    >
      {steps.map((step, index) => {
        const status = computeStatus(index, currentStep, step.status)
        const isLast = index === steps.length - 1
        const canJump = clickable && index < currentStep
        return (
          <li
            key={index}
            className={cn(
              'group flex',
              isHorizontal ? 'flex-1 items-start' : 'flex-row items-stretch gap-3'
            )}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            {/* Indicator column (icon + connector) */}
            <div
              className={cn(
                'flex shrink-0',
                isHorizontal ? 'flex-col items-center' : 'flex-col items-center'
              )}
            >
              <StepIndicator
                step={step}
                index={index}
                status={status}
                clickable={canJump}
                onClick={() => canJump && onStepChange?.(index)}
              />
              {!isLast && !isHorizontal && (
                <Connector status={status} orientation="vertical" />
              )}
            </div>

            {/* Label + horizontal connector (for horizontal layout, the connector
                sits beside the indicator within the same flex row above the labels) */}
            {isHorizontal ? (
              <div className="flex flex-1 flex-col items-center px-2 pb-1 text-center">
                <StepLabel step={step} status={status} compact />
              </div>
            ) : (
              <div className="flex-1 pb-6 pt-1">
                <StepLabel step={step} status={status} />
              </div>
            )}

            {/* Horizontal connector: rendered as a sibling overlay between indicators */}
            {isHorizontal && !isLast && (
              <HorizontalConnector status={status} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

interface StepIndicatorProps {
  step: StepperStep
  index: number
  status: StepStatus
  clickable: boolean
  onClick: () => void
}

function StepIndicator({
  step,
  index,
  status,
  clickable,
  onClick,
}: StepIndicatorProps) {
  const content =
    status === 'completed' ? (
      <Check className="h-4 w-4" strokeWidth={2.5} />
    ) : status === 'error' ? (
      <X className="h-4 w-4" strokeWidth={2.5} />
    ) : step.icon ? (
      <span className="inline-flex h-4 w-4 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
        {step.icon}
      </span>
    ) : (
      <span className="text-xs font-semibold tabular-nums">{index + 1}</span>
    )

  const indicatorClasses = cn(
    'relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-m3-enter ease-m3-enter',
    status === 'completed' && 'border-white bg-white text-black',
    status === 'current' &&
      'border-white bg-black text-white shadow-[0_0_0_4px_rgba(255,255,255,0.08)]',
    status === 'upcoming' && 'border-white/15 bg-white/[0.03] text-white/40',
    status === 'error' && 'border-rose-500 bg-rose-500/15 text-rose-300',
    clickable && 'cursor-pointer hover:scale-105 hover:border-white/40'
  )

  if (clickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Go back to step ${index + 1}: ${step.title}`}
        className={indicatorClasses}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={indicatorClasses} aria-hidden>
      {content}
    </div>
  )
}

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
    <div className={cn('min-w-0', compact && 'mt-2')}>
      <p
        className={cn(
          'truncate text-sm font-medium transition-colors duration-m3-enter ease-m3-enter',
          status === 'current' || status === 'completed'
            ? 'text-white'
            : status === 'error'
              ? 'text-rose-300'
              : 'text-white/40'
        )}
      >
        {step.title}
      </p>
      {step.description && (
        <p
          className={cn(
            'mt-0.5 text-xs transition-colors duration-m3-enter ease-m3-enter',
            status === 'upcoming' ? 'text-white/30' : 'text-white/55',
            compact && 'truncate'
          )}
        >
          {step.description}
        </p>
      )}
    </div>
  )
}

function Connector({
  status,
  orientation,
}: {
  status: StepStatus
  orientation: 'horizontal' | 'vertical'
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'transition-colors duration-m3-enter ease-m3-enter',
        orientation === 'vertical'
          ? 'mt-1 w-px flex-1 min-h-6 bg-white/10'
          : 'h-px flex-1 bg-white/10',
        status === 'completed' &&
          (orientation === 'vertical' ? 'bg-white/60' : 'bg-white/60')
      )}
    />
  )
}

function HorizontalConnector({ status }: { status: StepStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        '-mx-2 mt-[18px] h-px flex-1 self-start transition-colors duration-m3-enter ease-m3-enter',
        status === 'completed' ? 'bg-white/60' : 'bg-white/10'
      )}
    />
  )
}
