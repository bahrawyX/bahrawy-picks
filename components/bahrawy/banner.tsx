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
import { X, Info, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
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

const INTENT_ICON: Record<BannerIntent, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  promo: Sparkles,
}

const INTENT_STYLES: Record<BannerIntent, string> = {
  info: 'bg-sky-500/10 text-sky-200 border-sky-400/20',
  success: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/20',
  warning: 'bg-amber-500/10 text-amber-200 border-amber-400/20',
  promo:
    'bg-[linear-gradient(90deg,rgba(167,139,250,0.15),rgba(34,211,238,0.15))] text-white border-white/10',
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
            'flex w-full items-center gap-3 border-b px-4 py-2.5 text-sm backdrop-blur',
            INTENT_STYLES[intent],
            className,
          )}
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span className="min-w-0 flex-1 truncate">{children}</span>
          {cta && (
            <a
              href={cta.href ?? '#'}
              onClick={cta.onClick}
              className="shrink-0 rounded-full border border-white/20 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              {cta.label}
            </a>
          )}
          {dismissible && (
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="shrink-0 rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
