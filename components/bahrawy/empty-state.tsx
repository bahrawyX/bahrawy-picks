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

export function EmptyState({
  icon,
  title,
  description,
  primaryCta,
  secondaryCta,
  accentColor = 'rgba(255,255,255,0.08)',
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center',
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08]"
        style={{ background: accentColor }}
      >
        <div className="text-white/75">{icon ?? <Inbox className="h-6 w-6" strokeWidth={1.75} />}</div>
      </motion.div>

      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="font-display text-[17px] font-semibold tracking-tight text-white">{title}</h3>
        {description && (
          <p className="text-[13.5px] leading-relaxed tracking-tight text-white/60">{description}</p>
        )}
      </div>

      {(primaryCta || secondaryCta) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {primaryCta && (
            <a
              href={primaryCta.href ?? '#'}
              onClick={primaryCta.onClick}
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/85"
            >
              {primaryCta.label}
            </a>
          )}
          {secondaryCta && (
            <a
              href={secondaryCta.href ?? '#'}
              onClick={secondaryCta.onClick}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}
