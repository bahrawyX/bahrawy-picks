'use client'

/**
 * <EmptyState />
 *
 * The standard "no data yet" pattern: an icon/illustration in a circle, a
 * heading, body copy, and a CTA. Used to fill empty tables/lists with
 * something helpful instead of a blank screen.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  /** Decorative icon. Defaults to an inbox. */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  /** Optional muted color for the icon ring. */
  accentColor?: string
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 320, damping: 26 }

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

export function EmptyState({
  icon,
  title,
  description,
  primaryCta,
  secondaryCta,
  accentColor = 'rgb(var(--picks-fg-rgb) / 0.08)',
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-picks-fg/10 bg-picks-fg/[0.02] p-10 text-center',
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-picks-fg/[0.08]"
        style={{ background: accentColor }}
      >
        <div className="text-picks-fg/75">{icon ?? <Inbox className="h-6 w-6" strokeWidth={1.75} />}</div>
      </motion.div>

      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="font-display text-[17px] font-semibold tracking-tight text-picks-fg">{title}</h3>
        {description && (
          <p className="text-[13.5px] leading-relaxed tracking-tight text-picks-fg/60">{description}</p>
        )}
      </div>

      {(primaryCta || secondaryCta) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {primaryCta && (
            <CtaAction
              cta={primaryCta}
              className="inline-flex items-center justify-center rounded-full bg-picks-fg px-4 py-2 text-sm font-semibold text-picks-surface transition-colors hover:bg-picks-fg/85"
            />
          )}
          {secondaryCta && (
            <CtaAction
              cta={secondaryCta}
              className="inline-flex items-center justify-center rounded-full border border-picks-fg/20 px-4 py-2 text-sm font-medium text-picks-fg/85 transition-colors hover:bg-picks-fg/10"
            />
          )}
        </div>
      )}
    </motion.div>
  )
}
