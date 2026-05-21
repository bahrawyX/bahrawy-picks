'use client'

/**
 * <StatsGrid />
 *
 * A row of big stat counters that animate in on scroll. Numbers spring from
 * 0 to their target value when the section enters the viewport. Each tile
 * can hint a color so the grid gets a hint of brand without going loud.
 */

import * as React from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface StatsGridItem {
  value: number
  label: string
  prefix?: string
  suffix?: string
  /** Color tint for the number (CSS color). */
  tint?: string
}

export interface StatsGridProps {
  items: StatsGridItem[]
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  description?: React.ReactNode
  className?: string
}

export function StatsGrid({
  items,
  eyebrow,
  heading,
  description,
  className,
}: StatsGridProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <section
      ref={ref}
      className={cn('w-full bg-black px-6 py-24 sm:py-32', className)}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        {(eyebrow || heading || description) && (
          <div className="flex max-w-2xl flex-col gap-3">
            {eyebrow && (
              <span className="self-start rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <StatTile key={i} item={item} active={inView} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatTile({
  item,
  active,
  delay,
}: {
  item: StatsGridItem
  active: boolean
  delay: number
}) {
  const target = useMotionValue(0)
  const sp = useSpring(target, { stiffness: 80, damping: 28, mass: 1 })
  const text = useTransform(sp, (v) => Math.round(v).toLocaleString())

  React.useEffect(() => {
    if (!active) return
    const id = window.setTimeout(() => target.set(item.value), delay * 1000)
    return () => window.clearTimeout(id)
  }, [active, item.value, delay, target])

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.2, 0, 0, 1] }}
      // overflow-hidden keeps wide numbers (e.g. "97%") inside their tile.
      className="overflow-hidden bg-black p-6 sm:p-8"
    >
      <div
        className="flex items-baseline whitespace-nowrap font-semibold leading-none tracking-[-0.04em]"
        // Clamp scales with viewport but caps at 72px so 3-char numbers like
        // "97%" never push past the column. tracking-[-0.04em] tightens the
        // gap between the digits and the suffix without needing a gap class.
        style={{
          color: item.tint ?? '#FFFFFF',
          fontSize: 'clamp(40px, 5vw, 72px)',
        }}
      >
        {item.prefix && <span>{item.prefix}</span>}
        <motion.span>{text}</motion.span>
        {item.suffix && <span>{item.suffix}</span>}
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-white/55">
        {item.label}
      </p>
    </motion.div>
  )
}
