'use client'

/**
 * <PricingCompare />
 *
 * Tall feature comparison table. Plan headers across the top, feature groups
 * down the side. The recommended column gets a subtle accent panel behind it.
 * Rows fade up as they enter the viewport.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PricingComparePlan {
  id: string
  name: string
  price: string
  priceSuffix?: string
  cta: { label: string; href?: string }
  featured?: boolean
}

/**
 * One feature row. `values` aligns to `plans` by index — a `true` shows a
 * check, a string shows that string, a `false` shows a dash.
 */
export interface PricingCompareFeature {
  label: string
  values: Array<boolean | string>
}

export interface PricingCompareGroup {
  label: string
  features: PricingCompareFeature[]
}

export interface PricingCompareProps {
  plans: PricingComparePlan[]
  groups: PricingCompareGroup[]
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  description?: React.ReactNode
  accentColor?: string
  className?: string
}

export function PricingCompare({
  plans,
  groups,
  eyebrow,
  heading = 'Compare every feature.',
  description,
  accentColor = '#FFFFFF',
  className,
}: PricingCompareProps) {
  const featuredIndex = plans.findIndex((p) => p.featured)

  // Measure the featured column's real position/width so the accent
  // highlight aligns with it at every breakpoint (table columns are
  // auto-laid-out, so percentage math would drift).
  const featuredThRef = React.useRef<HTMLTableCellElement>(null)
  const [highlight, setHighlight] = React.useState<{
    left: number
    width: number
  } | null>(null)

  React.useEffect(() => {
    const th = featuredThRef.current
    if (!th) return
    const update = () => {
      // offsetLeft is relative to the positioned scroll container the
      // overlay lives in, so the highlight tracks the column exactly.
      setHighlight({ left: th.offsetLeft + 2, width: th.offsetWidth - 4 })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(th)
    if (th.offsetParent) ro.observe(th.offsetParent)
    return () => ro.disconnect()
  }, [featuredIndex, plans.length])

  return (
    <section className={cn('w-full bg-black px-6 py-24 sm:py-32', className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          {eyebrow && (
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
              {eyebrow}
            </span>
          )}
          <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {heading}
          </h2>
          {description && (
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {/* The table */}
        <div className="relative overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
          {/* Accent column highlight (lives behind everything) */}
          {featuredIndex >= 0 && highlight && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0"
              style={{
                left: highlight.left,
                width: highlight.width,
                background: `linear-gradient(180deg, ${accentColor}1a, transparent 40%)`,
                borderLeft: `1px solid ${accentColor}33`,
                borderRight: `1px solid ${accentColor}33`,
              }}
            />
          )}

          <table className="relative w-full min-w-[640px] border-collapse text-left">
            {/* Plan headers — meta row, everything centered */}
            <thead>
              <tr className="border-b border-white/10">
                <th className="w-1/3 p-5 text-left align-bottom text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                  Features
                </th>
                {plans.map((plan, pi) => (
                  <th
                    key={plan.id}
                    ref={pi === featuredIndex ? featuredThRef : undefined}
                    className="p-5 text-center align-top"
                  >
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/60">
                        {plan.name}
                      </p>
                      <div className="mt-2 flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-semibold text-white">{plan.price}</span>
                        {plan.priceSuffix && (
                          <span className="text-xs text-white/50">{plan.priceSuffix}</span>
                        )}
                      </div>
                      <a
                        href={plan.cta.href ?? '#'}
                        className={cn(
                          'mt-3 inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                          plan.featured
                            ? 'text-black'
                            : 'border border-white/15 bg-white/[0.04] text-white hover:bg-white/10',
                        )}
                        style={plan.featured ? { background: accentColor } : undefined}
                      >
                        {plan.cta.label}
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {groups.map((group, gi) => {
                const isLastGroup = gi === groups.length - 1
                return (
                  <React.Fragment key={group.label}>
                    {/* Group label row */}
                    <tr>
                      <th
                        colSpan={plans.length + 1}
                        className="border-t border-white/10 bg-white/[0.015] p-4 text-left text-xs font-medium uppercase tracking-[0.16em] text-white/45"
                      >
                        {group.label}
                      </th>
                    </tr>
                    {group.features.map((feat, i) => {
                      const isLastInGroup = i === group.features.length - 1
                      return (
                        <CompareRow
                          key={feat.label}
                          feature={feat}
                          plans={plans}
                          accentColor={accentColor}
                          stagger={i * 0.04}
                          // Thicker hairline between feature groups (not after the last group).
                          isGroupBoundary={isLastInGroup && !isLastGroup}
                        />
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// One row that fades up when scrolled into view
// ---------------------------------------------------------------------------

interface CompareRowProps {
  feature: PricingCompareFeature
  plans: PricingComparePlan[]
  accentColor: string
  stagger: number
  /** If true, draw a stronger hairline below this row (group boundary). */
  isGroupBoundary?: boolean
}

function CompareRow({
  feature,
  plans,
  accentColor,
  stagger,
  isGroupBoundary,
}: CompareRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: stagger, ease: [0.2, 0, 0, 1] }}
      className={cn(
        'border-t border-white/[0.06]',
        isGroupBoundary && 'border-b border-b-white/[0.08]',
      )}
    >
      <td className="p-4 text-sm text-white/80">{feature.label}</td>
      {plans.map((plan, i) => {
        const v = feature.values[i]
        return (
          <td key={plan.id} className="p-4 text-center text-sm text-white/70">
            {typeof v === 'boolean' ? (
              <span className="inline-flex items-center justify-center">
                {v ? (
                  <Check
                    className="h-4 w-4"
                    style={{ color: plan.featured ? accentColor : 'rgba(255,255,255,0.85)' }}
                    strokeWidth={2.5}
                  />
                ) : (
                  <Minus className="h-4 w-4 text-white/25" />
                )}
              </span>
            ) : (
              <span>{v}</span>
            )}
          </td>
        )
      })}
    </motion.tr>
  )
}
