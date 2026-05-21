'use client'

/**
 * <PricingToggle />
 *
 * Pricing card grid with a monthly/annual billing toggle at the top. Switching
 * the toggle springs the number to its new value (each digit flips into
 * place), and adds a "Save X%" badge when annual is active.
 */

import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PricingTogglePlan {
  id: string
  name: string
  /** Monthly price as a plain number. */
  monthly: number
  /** Annual-billed monthly equivalent as a plain number. */
  annual: number
  description: string
  features: string[]
  cta: { label: string; href?: string; onClick?: () => void }
  featured?: boolean
}

export interface PricingToggleProps {
  plans: PricingTogglePlan[]
  /** Currency prefix. Default "$". */
  currency?: string
  /** "Save X%" label shown next to the annual option. */
  annualSavingLabel?: string
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  description?: React.ReactNode
  accentColor?: string
  className?: string
}

export function PricingToggle({
  plans,
  currency = '$',
  annualSavingLabel = 'Save 20%',
  eyebrow,
  heading = 'Pick a plan. Change it any time.',
  description,
  accentColor = '#FFFFFF',
  className,
}: PricingToggleProps) {
  const [annual, setAnnual] = React.useState(false)

  return (
    <section className={cn('w-full bg-black px-6 py-24 sm:py-32', className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
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

          {/* Billing toggle */}
          <div
            role="tablist"
            className="relative mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1"
          >
            {(['monthly', 'annual'] as const).map((mode) => {
              const isActive = (mode === 'annual') === annual
              return (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setAnnual(mode === 'annual')}
                  className="relative z-10 rounded-full px-4 py-1.5 text-xs font-medium capitalize text-white/70 transition-colors data-[active=true]:text-black"
                  data-active={isActive}
                >
                  {isActive && (
                    <motion.span
                      layoutId="pricing-toggle-thumb"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{mode}</span>
                </button>
              )
            })}
            <span
              className={cn(
                'ml-1 self-center rounded-full bg-white/[0.06] px-2 py-1 text-[10px] font-semibold tracking-wide text-emerald-300 transition-opacity',
                annual ? 'opacity-100' : 'opacity-50',
              )}
            >
              {annualSavingLabel}
            </span>
          </div>
        </div>

        {/* Plan grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-white/[0.02] p-6',
                plan.featured
                  ? '-translate-y-2 border-white/40'
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
                  <span className="text-2xl font-semibold text-white/60">{currency}</span>
                  <AnimatedNumber value={annual ? plan.annual : plan.monthly} />
                  <span className="text-sm text-white/50">/mo</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{plan.description}</p>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Spring-animated number — same idea as in hero-counter but exported inline.
// ---------------------------------------------------------------------------

function AnimatedNumber({ value }: { value: number }) {
  const raw = useMotionValue(value)
  const sp = useSpring(raw, { stiffness: 200, damping: 26, mass: 0.6 })
  const text = useTransform(sp, (v) => Math.round(v).toLocaleString())

  React.useEffect(() => {
    raw.set(value)
  }, [value, raw])

  return (
    <motion.span className="text-5xl font-semibold tabular-nums text-white">
      {text}
    </motion.span>
  )
}
