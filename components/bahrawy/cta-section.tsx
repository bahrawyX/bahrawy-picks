'use client'

/**
 * <CtaSection />
 *
 * A big call-to-action band: eyebrow + headline + sub-copy + dual buttons
 * sitting on top of a soft radial gradient. Reveals on scroll with a gentle
 * lift and stagger.
 */

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CtaSectionProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  /** Two CSS colors used in the background radial gradient. */
  glowColors?: [string, string]
  className?: string
}

/** Renders an `<a>` when the CTA has an href, otherwise a `<button>` with identical styling. */
function CtaAction({
  cta,
  className,
}: {
  cta: { label: string; href?: string; onClick?: () => void }
  className: string
}) {
  if (cta.href) {
    return (
      <a href={cta.href} onClick={cta.onClick} className={className}>
        {cta.label}
      </a>
    )
  }
  return (
    <button type="button" onClick={cta.onClick} className={className}>
      {cta.label}
    </button>
  )
}

export function CtaSection({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  glowColors = ['#7C3AED', '#22D3EE'],
  className,
}: CtaSectionProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <section
      ref={ref}
      className={cn(
        'relative isolate w-full overflow-hidden bg-picks-surface px-6 py-24 sm:py-32',
        className,
      )}
    >
      {/* Soft accent glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(40% 60% at 20% 30%, ${glowColors[0]}33, transparent 70%), radial-gradient(40% 60% at 80% 70%, ${glowColors[1]}33, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="rounded-full border border-picks-fg/15 bg-picks-fg/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-picks-fg/80 backdrop-blur"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="text-balance text-4xl font-semibold leading-tight tracking-tight text-picks-fg sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.2, 0, 0, 1] }}
            className="max-w-xl text-pretty text-base leading-relaxed text-picks-fg/65 sm:text-lg"
          >
            {description}
          </motion.p>
        )}
        {(primaryCta || secondaryCta) && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.14, ease: [0.2, 0, 0, 1] }}
            className="mt-2 flex flex-wrap items-center justify-center gap-3"
          >
            {primaryCta && (
              <CtaAction
                cta={primaryCta}
                className="inline-flex items-center justify-center rounded-full bg-picks-fg px-5 py-2.5 text-sm font-semibold text-picks-surface transition-colors hover:bg-picks-fg/85"
              />
            )}
            {secondaryCta && (
              <CtaAction
                cta={secondaryCta}
                className="inline-flex items-center justify-center rounded-full border border-picks-fg/20 px-5 py-2.5 text-sm font-medium text-picks-fg/90 transition-colors hover:bg-picks-fg/10"
              />
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
