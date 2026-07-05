'use client'

/**
 * <Divider />
 *
 * A thin horizontal rule that animates its width in on mount/in-view. Optional
 * centered label (text or any node) cuts a notch into the line. Three styles:
 * 'solid', 'dashed', 'gradient'.
 */

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface DividerProps {
  label?: React.ReactNode
  style?: 'solid' | 'dashed' | 'gradient'
  /** Line color (used for solid + dashed). Default rgb(var(--picks-fg-rgb) / 0.12). */
  color?: string
  /** Animate from 0 → full width on scroll into view. Default true. */
  animateIn?: boolean
  className?: string
}

export function Divider({
  label,
  style = 'solid',
  color = 'rgb(var(--picks-fg-rgb) / 0.12)',
  animateIn = true,
  className,
}: DividerProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })

  const lineStyle: React.CSSProperties =
    style === 'gradient'
      ? {
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
        }
      : style === 'dashed'
        ? {
            height: 1,
            backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 6px, transparent 6px 12px)`,
          }
        : { height: 1, background: color }

  return (
    <div
      ref={ref}
      role="separator"
      className={cn('flex w-full items-center gap-4', className)}
    >
      <motion.span
        aria-hidden
        initial={animateIn ? { scaleX: 0 } : false}
        animate={animateIn ? (inView ? { scaleX: 1 } : { scaleX: 0 }) : { scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
        style={{ ...lineStyle, transformOrigin: '0% 50%' }}
        className="block flex-1"
      />
      {label && (
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-picks-fg/45">
          {label}
        </span>
      )}
      {label && (
        <motion.span
          aria-hidden
          initial={animateIn ? { scaleX: 0 } : false}
          animate={animateIn ? (inView ? { scaleX: 1 } : { scaleX: 0 }) : { scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          style={{ ...lineStyle, transformOrigin: '100% 50%' }}
          className="block flex-1"
        />
      )}
    </div>
  )
}
