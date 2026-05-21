'use client'

/**
 * <PricingTier />
 *
 * Three-column pricing grid. One tier can be `featured` — gets a glow ring,
 * a tiny "Recommended" pill, and lifts slightly above its neighbors. The
 * three cards stagger in on scroll.
 */

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PricingPlan {
  id: string
  name: string
  /** Display price string — already formatted with currency, e.g. "$12". */
  price: string
  /** Suffix like "/mo" or "per seat". */
  priceSuffix?: string
  description: string
  features: string[]
  cta: { label: string; href?: string; onClick?: () => void }
  /** Highlight this plan as the recommended one. */
  featured?: boolean
}

export interface PricingTierProps {
  plans: PricingPlan[]
  /** Eyebrow above the section heading. */
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  description?: React.ReactNode
  /** Accent used for the featured plan's ring + CTA. Default #FFFFFF. */
  accentColor?: string
  className?: string
}

const ITEM_SPRING = { type: 'spring' as const, stiffness: 220, damping: 28, mass: 0.8 }

export function PricingTier({
  plans,
  eyebrow,
  heading = 'Simple, honest pricing.',
  description,
  accentColor = '#FFFFFF',
  className,
}: PricingTierProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const inView = useInView(wrapperRef, { once: true, amount: 0.25 })

  return (
    <section
      ref={wrapperRef}
      className={cn(
        'relative w-full bg-black px-6 py-24 sm:py-32',
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        {/* Section header */}
        <div className="flex flex-col items-center gap-4 text-center">
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80"
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
          >
            {heading}
          </motion.h2>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.06, ease: [0.2, 0, 0, 1] }}
              className="max-w-xl text-pretty text-sm leading-relaxed text-white/60 sm:text-base"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Plan grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...ITEM_SPRING, delay: 0.1 + i * 0.08 }}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-white/[0.02] p-6',
                plan.featured
                  ? '-translate-y-2 border-white/40 shadow-[0_30px_80px_-30px_rgba(255,255,255,0.18)]'
                  : 'border-white/10',
              )}
              style={
                plan.featured
                  ? { boxShadow: `0 0 0 1px ${accentColor}33, 0 24px 64px -24px ${accentColor}33` }
                  : undefined
              }
            >
              {plan.featured && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black"
                  style={{ background: accentColor }}
                >
                  Recommended
                </span>
              )}

              <header className="mb-6">
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-white/60">
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-5xl font-semibold tabular-nums text-white">
                    {plan.price}
                  </span>
                  {plan.priceSuffix && (
                    <span className="text-sm text-white/50">{plan.priceSuffix}</span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {plan.description}
                </p>
              </header>

              <ul className="mb-6 flex flex-col gap-2.5 text-sm text-white/80">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      style={{ color: plan.featured ? accentColor : 'rgba(255,255,255,0.7)' }}
                      strokeWidth={2.5}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <a
                  href={plan.cta.href ?? '#'}
                  onClick={plan.cta.onClick}
                  className={cn(
                    'inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors',
                    plan.featured
                      ? 'text-black'
                      : 'border border-white/15 bg-white/[0.04] text-white hover:bg-white/10',
                  )}
                  style={plan.featured ? { background: accentColor } : undefined}
                >
                  {plan.cta.label}
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
