'use client'

/**
 * <Banner />
 *
 * Sticky announcement banner. Slides in from the top, optional dismiss button,
 * intent variants for context. Stays dismissed for the rest of the session by
 * default (via `id` + sessionStorage); pass `persistDismiss={false}` to
 * disable.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Info,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type BannerIntent = 'info' | 'success' | 'warning' | 'promo'

export interface BannerProps {
  /** Stable id used to remember dismissal in sessionStorage. */
  id?: string
  intent?: BannerIntent
  children: React.ReactNode
  /** Optional CTA rendered to the right of the message. */
  cta?: { label: string; href?: string; onClick?: () => void }
  /** Whether the banner is dismissible. Default true. */
  dismissible?: boolean
  /** Remember dismissal across reloads (this tab). Default true. */
  persistDismiss?: boolean
  className?: string
}

const INTENT_ICON: Record<BannerIntent, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  promo: Sparkles,
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

const INTENT_STYLES: Record<BannerIntent, string> = {
  info: 'bg-white/[0.04] text-white/90 border-white/[0.08] [&_svg]:text-[#0A84FF]',
  success: 'bg-white/[0.04] text-white/90 border-white/[0.08] [&_svg]:text-[#30D158]',
  warning: 'bg-white/[0.04] text-white/90 border-white/[0.08] [&_svg]:text-[#FF9F0A]',
  promo: 'bg-white/[0.04] text-white/90 border-white/[0.08] [&_svg]:text-[#5E5CE6]',
}

export function Banner({
  id,
  intent = 'info',
  children,
  cta,
  dismissible = true,
  persistDismiss = true,
  className,
}: BannerProps) {
  const storageKey = id ? `bahrawy-banner-${id}` : null
  const [open, setOpen] = React.useState(true)

  // Restore dismissal state on mount (after first paint to avoid hydration mismatch).
  React.useEffect(() => {
    if (!storageKey || !persistDismiss) return
    if (typeof sessionStorage === 'undefined') return
    if (sessionStorage.getItem(storageKey) === '1') setOpen(false)
  }, [storageKey, persistDismiss])

  const dismiss = () => {
    setOpen(false)
    if (storageKey && persistDismiss && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(storageKey, '1')
    }
  }

  const Icon = INTENT_ICON[intent]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className={cn(
            'flex w-full items-center gap-3 border-b px-4 py-2.5 text-[13px] tracking-tight backdrop-blur-xl',
            INTENT_STYLES[intent],
            className,
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
          <span className="min-w-0 flex-1 truncate font-medium">{children}</span>
          {cta && (
            <CtaAction
              cta={cta}
              className="shrink-0 rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[11.5px] font-semibold tracking-tight text-white transition-colors hover:bg-white/[0.1]"
            />
          )}
          {dismissible && (
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="shrink-0 rounded-md p-1 text-white/55 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.25} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
