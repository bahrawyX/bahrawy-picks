'use client'

/**
 * <StatCard />
 *
 * Compact data card: label + animated number + delta badge + optional inline
 * sparkline. Suitable for dashboards. The number springs from 0 → target,
 * the sparkline draws itself on mount.
 */

import * as React from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Sparkline } from '@/components/bahrawy/sparkline'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface StatCardProps {
  label: React.ReactNode
  value: number
  prefix?: string
  suffix?: string
  /** Optional delta % shown as a small badge. Sign-aware. */
  delta?: number
  /** Sparkline points — y values only, evenly spaced. */
  trend?: number[]
  /** Accent color for the spark + positive delta. Default #FFFFFF. */
  accentColor?: string
  className?: string
}

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  delta,
  trend,
  accentColor = '#FFFFFF',
  className,
}: StatCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = usePrefersReducedMotion()

  const raw = useMotionValue(0)
  const sp = useSpring(raw, { stiffness: 80, damping: 26, mass: 0.9 })
  const text = useTransform(sp, (v) => Math.round(v).toLocaleString())

  React.useEffect(() => {
    if (!inView) return
    // Reduced motion: jump straight to the final value — no spring.
    if (reduced) {
      raw.jump(value)
      sp.jump(value)
      return
    }
    raw.set(value)
  }, [inView, value, raw, sp, reduced])

  const positive = (delta ?? 0) >= 0

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-2 rounded-2xl border border-picks-fg/10 bg-picks-fg/[0.02] p-5',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-picks-fg/55">
        {label}
      </p>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1 text-3xl font-semibold tabular-nums tracking-tight text-picks-fg">
          {prefix && <span className="text-picks-fg/60">{prefix}</span>}
          <motion.span>{text}</motion.span>
          {suffix && <span className="text-picks-fg/60">{suffix}</span>}
        </div>

        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              positive
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-rose-500/15 text-rose-300',
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
            ) : (
              <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>

      {trend && trend.length > 1 && (
        <Sparkline
          points={trend}
          color={accentColor}
          width={120}
          height={32}
          showEndDot={false}
          responsive
          className="mt-1 h-8"
        />
      )}
    </div>
  )
}
