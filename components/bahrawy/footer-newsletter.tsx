'use client'

/**
 * <FooterNewsletter />
 *
 * Footer with a prominent newsletter signup row at the top: heading + email
 * input + subscribe button. On successful submit the button morphs into a
 * "Subscribed!" confirmation for a beat, then resets. Below the signup row
 * sit the standard link columns + a copyright bar.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FooterNewsletterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterNewsletterColumn {
  heading: string
  links: FooterNewsletterLink[]
}

export interface FooterNewsletterProps {
  logo: React.ReactNode
  tagline?: React.ReactNode
  /** Headline above the email input. */
  newsletterHeading?: React.ReactNode
  /** Sub-copy below the heading. */
  newsletterCopy?: React.ReactNode
  /** Input placeholder. Default "your@email.com". */
  placeholder?: string
  /** Called on submit with the typed email. Throw to surface an error toast-ish state. */
  onSubmit?: (email: string) => Promise<void> | void
  /** Display label of the subscribe button. Default "Subscribe". */
  ctaLabel?: string
  columns?: FooterNewsletterColumn[]
  copyright?: React.ReactNode
  bottomRight?: React.ReactNode
  className?: string
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

const SPRING = { type: 'spring' as const, stiffness: 360, damping: 28 }

export function FooterNewsletter({
  logo,
  tagline,
  newsletterHeading = 'Get one short email a month.',
  newsletterCopy = 'New components, behind-the-scenes builds, and the occasional rant. No spam.',
  placeholder = 'your@email.com',
  onSubmit,
  ctaLabel = 'Subscribe',
  columns = [],
  copyright,
  bottomRight,
  className,
}: FooterNewsletterProps) {
  const [email, setEmail] = React.useState('')
  const [state, setState] = React.useState<SubmitState>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === 'loading') return
    setState('loading')
    try {
      await onSubmit?.(email)
      setState('success')
      setEmail('')
      window.setTimeout(() => setState('idle'), 2200)
    } catch {
      setState('error')
      window.setTimeout(() => setState('idle'), 2500)
    }
  }

  return (
    <footer
      className={cn(
        'w-full border-t border-picks-fg/10 bg-picks-surface px-6 py-16',
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        {/* Newsletter row */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="flex flex-col gap-3">
            <h3 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-picks-fg sm:text-4xl">
              {newsletterHeading}
            </h3>
            {newsletterCopy && (
              <p className="max-w-md text-sm leading-relaxed text-picks-fg/55">{newsletterCopy}</p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md items-stretch gap-2 rounded-full border border-picks-fg/10 bg-picks-fg/[0.03] p-1.5 lg:ml-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={state === 'loading'}
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-picks-fg placeholder:text-picks-fg/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className={cn(
                'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                state === 'success'
                  ? 'bg-emerald-400 text-picks-surface'
                  : 'bg-picks-fg text-picks-surface hover:bg-picks-fg/90',
                state === 'loading' && 'opacity-70',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={state}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={SPRING}
                  className="inline-flex items-center gap-1.5"
                >
                  {state === 'success' ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2.8} />
                      Subscribed!
                    </>
                  ) : state === 'loading' ? (
                    'Sending…'
                  ) : state === 'error' ? (
                    'Try again'
                  ) : (
                    <>
                      {ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Announce submit status changes to screen readers. */}
            <span aria-live="polite" role="status" className="sr-only">
              {state === 'success'
                ? 'Subscribed!'
                : state === 'error'
                  ? 'Something went wrong. Try again.'
                  : state === 'loading'
                    ? 'Sending'
                    : ''}
            </span>
          </form>
        </div>

        {/* Brand + columns */}
        <div className="grid gap-12 border-t border-picks-fg/[0.06] pt-10 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-3">
            <div className="text-lg font-semibold text-picks-fg">{logo}</div>
            {tagline && (
              <p className="max-w-xs text-sm leading-relaxed text-picks-fg/55">{tagline}</p>
            )}
          </div>

          {columns.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-3">
              {columns.map((col) => (
                <div key={col.heading} className="flex flex-col gap-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-picks-fg/40">
                    {col.heading}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className="text-sm text-picks-fg/70 transition-colors hover:text-picks-fg"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        {(copyright || bottomRight) && (
          <div className="flex flex-col gap-2 border-t border-picks-fg/[0.06] pt-6 text-xs text-picks-fg/40 sm:flex-row sm:items-center sm:justify-between">
            {copyright && <p>{copyright}</p>}
            {bottomRight && <div className="flex items-center gap-3">{bottomRight}</div>}
          </div>
        )}
      </div>
    </footer>
  )
}
