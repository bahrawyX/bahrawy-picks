'use client'

/**
 * <RollingText /> + <RollingButton />
 *
 * RollingText stacks two copies of the label in an overflow-hidden
 * viewport exactly one line tall; on parent `group` hover the stack
 * slides up by 50% so the second copy rolls into place — the classic
 * agency-site button label roll.
 *
 * RollingButton is the ready-made pill: rolling label + a contrasting
 * icon disc whose arrow un-rotates from -45° to 0° on hover.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

export interface RollingTextProps {
  /** The label. Rendered twice, stacked. */
  text: string
  /** Roll duration in seconds. Default 0.5. */
  duration?: number
  /** Line height of the visible window. Default '1.5em'. */
  lineHeight?: string
  className?: string
}

export function RollingText({
  text,
  duration = 0.5,
  lineHeight = '1.5em',
  className,
}: RollingTextProps) {
  return (
    <span
      className={cn('block overflow-hidden', className)}
      style={{ height: lineHeight }}
    >
      <span
        className="flex flex-col transition-transform group-hover:-translate-y-1/2"
        style={{ transitionDuration: `${duration}s`, transitionTimingFunction: EASE }}
      >
        <span
          className="flex items-center whitespace-nowrap"
          style={{ height: lineHeight }}
        >
          {text}
        </span>
        <span
          className="flex items-center whitespace-nowrap"
          aria-hidden
          style={{ height: lineHeight }}
        >
          {text}
        </span>
      </span>
    </span>
  )
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export interface RollingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label — rolls on hover. */
  label: string
  /** Icon inside the disc. Default arrow-right. */
  icon?: React.ReactNode
  /** Color style. Default 'dark'. */
  variant?: 'dark' | 'light' | 'accent'
  /** Accent background when variant='accent'. Default '#F26522'. */
  accentColor?: string
  /** Roll duration in seconds. Default 0.5. */
  duration?: number
}

export function RollingButton({
  label,
  icon,
  variant = 'dark',
  accentColor = '#F26522',
  duration = 0.5,
  className,
  style,
  ...rest
}: RollingButtonProps) {
  const isAccent = variant === 'accent'
  return (
    <button
      className={cn(
        'group flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-[13px] font-medium',
        variant === 'dark' && 'bg-picks-panel text-picks-fg',
        variant === 'light' && 'bg-picks-fg text-picks-surface',
        isAccent && 'text-picks-fg',
        className,
      )}
      style={isAccent ? { backgroundColor: accentColor, ...style } : style}
      {...rest}
    >
      <RollingText text={label} duration={duration} />
      <span
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full',
          variant === 'dark' && 'bg-picks-fg text-picks-surface',
          variant === 'light' && 'bg-picks-panel text-picks-fg',
          isAccent && 'bg-picks-fg',
        )}
        style={isAccent ? { color: accentColor } : undefined}
      >
        <span
          className="transition-transform group-hover:-rotate-45"
          style={{ transitionDuration: `${duration}s`, transitionTimingFunction: EASE }}
        >
          {icon ?? <ArrowIcon />}
        </span>
      </span>
    </button>
  )
}
