'use client'

/**
 * <StepProgress />
 *
 * Horizontal numbered step indicator — lighter than the existing Stepper.
 * Past steps animate to "done" (check + filled), the active step pulses, and
 * future steps stay outlined.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepProgressProps {
  /** Labels for each step. Length defines the total. */
  steps: string[]
  /** Index of the active step (0-based). Steps before it render as done. */
  current: number
  /** Accent color for the active + done steps. */
  accentColor?: string
  /** Pulse the active step's ring. Default true. */
  pulse?: boolean
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 360, damping: 28 }

export function StepProgress({
  steps,
  current,
  accentColor = '#FFFFFF',
  pulse = true,
  className,
}: StepProgressProps) {
  return (
    <ol
      role="list"
      className={cn('flex w-full items-start justify-between gap-2', className)}
    >
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <React.Fragment key={i}>
            <li className="relative flex min-w-0 flex-1 flex-col items-center gap-2">
              {/* Connector to next step */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-4 z-0 h-px w-full"
                  style={{ left: '50%', background: 'rgba(255,255,255,0.12)' }}
                />
              )}
              {i < steps.length - 1 && (
                <motion.span
                  aria-hidden
                  className="absolute top-4 z-0 h-px"
                  style={{
                    left: '50%',
                    width: '100%',
                    background: accentColor,
                    transformOrigin: '0% 50%',
                  }}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ ...SPRING, duration: 0.4 }}
                />
              )}

              {/* Bubble */}
              <span
                aria-current={active ? 'step' : undefined}
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-colors"
                style={{
                  background: done
                    ? accentColor
                    : active
                      ? 'transparent'
                      : 'transparent',
                  borderColor:
                    done || active ? accentColor : 'rgba(255,255,255,0.18)',
                  color: done ? '#000' : active ? accentColor : 'rgba(255,255,255,0.55)',
                }}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                {active && pulse && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1px solid ${accentColor}` }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.55, 0, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </span>

              <span
                className={cn(
                  'text-center text-[11px] font-medium leading-tight',
                  done || active ? 'text-white' : 'text-white/45',
                )}
              >
                {label}
              </span>
            </li>
          </React.Fragment>
        )
      })}
    </ol>
  )
}
