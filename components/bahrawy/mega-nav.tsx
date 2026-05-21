'use client'

/**
 * <MegaNav />
 *
 * A floating top navigation bar with a frosted-glass backdrop. Items that
 * carry a `sections` array drop down into a mega-menu on hover — categorized
 * columns of links with optional icons + secondary copy.
 *
 * Motion details:
 *  - The mega-menu container animates `height: auto` with framer-motion, so
 *    different menus with different content heights transition smoothly
 *    between each other (not just open/close).
 *  - When the user hovers from one mega-menu item to another, the OUTER
 *    container stays open and only the inner content crossfades — the
 *    drawer reads as one continuous surface, not as flicker.
 *  - The bar itself thickens its blur when scrolled past `scrollThreshold`,
 *    so it feels lighter at the top of the page and more "anchored" once
 *    you scroll.
 *
 * Out of the box: logo on the left, menu items centered, an `actions` slot
 * on the right (search button, sign-in, cart, etc.). Mobile collapses to a
 * full-width sheet (using a single `Menu` button toggle).
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Menu as MenuIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MegaNavLink {
  label: string
  href?: string
  /** Optional small icon shown left of the label. */
  icon?: React.ReactNode
  /** Optional secondary line under the label. */
  description?: string
  /** Open in a new tab. */
  external?: boolean
}

export interface MegaNavSection {
  /** Section heading rendered above its links. */
  heading: string
  links: MegaNavLink[]
}

export interface MegaNavItem {
  label: string
  href?: string
  /** Pass sections to enable the mega-menu drop-down. Omit for a plain link. */
  sections?: MegaNavSection[]
  /** Optional CTA / promo card rendered next to the sections (right side). */
  promo?: React.ReactNode
}

export interface MegaNavProps {
  /** Brand mark on the left — wordmark or SVG. */
  logo?: React.ReactNode
  /** Top-level menu items. */
  items: MegaNavItem[]
  /** Right-side slot — sign in, search, cart, etc. */
  actions?: React.ReactNode
  /** Px scrolled before the bar deepens its backdrop. Default 24. */
  scrollThreshold?: number
  /** Make the bar position: sticky vs fixed. Default 'sticky'. */
  position?: 'sticky' | 'fixed' | 'relative'
  className?: string
}

// ---------------------------------------------------------------------------
// Springs / easings
// ---------------------------------------------------------------------------

const PANEL_SPRING = {
  type: 'spring' as const,
  stiffness: 240,
  damping: 30,
  mass: 0.9,
}
const FADE = { duration: 0.18, ease: [0.2, 0, 0, 1] as [number, number, number, number] }

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MegaNav({
  logo,
  items,
  actions,
  scrollThreshold = 24,
  position = 'sticky',
  className,
}: MegaNavProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const closeTimer = React.useRef<number | null>(null)

  // Open / close with a tiny grace so the dropdown doesn't flicker when the
  // cursor crosses a gap (e.g. between a trigger and the panel below).
  const openMenu = React.useCallback((i: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpenIndex(i)
  }, [])
  const queueClose = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), 120)
  }, [])
  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
  }, [])

  // Track scroll for the "deepen the blur" effect.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollThreshold])

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenIndex(null)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const active = openIndex !== null ? items[openIndex] : null
  const hasMega = (it: MegaNavItem | null) => !!it?.sections?.length

  return (
    <header
      onMouseLeave={queueClose}
      className={cn(
        'top-0 z-50 w-full',
        position === 'fixed' && 'fixed',
        position === 'sticky' && 'sticky',
        position === 'relative' && 'relative',
        className,
      )}
    >
      {/* The bar itself */}
      <div className="relative">
        {/* Backdrop layer — animates between two "blur depths" */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{
            backgroundColor: scrolled
              ? 'rgba(10,10,18,0.72)'
              : 'rgba(10,10,18,0.45)',
            // Both modern Safari (18+) and Chrome accept the unprefixed
            // property; framer-motion can't animate the Webkit-prefixed
            // variant via its typed `animate` map.
            backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
            borderBottomColor:
              openIndex !== null
                ? 'rgba(255,255,255,0.10)'
                : 'rgba(255,255,255,0.06)',
          }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0 border-b"
        />

        <div className="relative mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
          {/* Logo */}
          {logo && (
            <a
              href="/"
              className="shrink-0 text-sm font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
              onMouseEnter={queueClose}
            >
              {logo}
            </a>
          )}

          {/* Menu (centered, hidden on mobile) */}
          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center justify-center md:flex"
          >
            <ul className="flex items-center gap-1">
              {items.map((item, i) => {
                const isOpen = openIndex === i
                const mega = hasMega(item)
                return (
                  <li
                    key={i}
                    onMouseEnter={() => (mega ? openMenu(i) : queueClose())}
                  >
                    {item.href && !mega ? (
                      <a
                        href={item.href}
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[13px] font-medium text-white/85 transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-haspopup={mega || undefined}
                        className={cn(
                          'inline-flex items-center rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                          isOpen
                            ? 'bg-white/[0.08] text-white'
                            : 'text-white/85 hover:bg-white/[0.06] hover:text-white',
                        )}
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Right actions (desktop) */}
          {actions && (
            <div className="hidden shrink-0 items-center gap-2 md:flex">{actions}</div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/85 transition-colors hover:bg-white/[0.08] hover:text-white md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>

        {/* Mega-menu drawer (desktop) */}
        <AnimatePresence>
          {active && hasMega(active) && (
            <motion.div
              key="mega"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={PANEL_SPRING}
              onMouseEnter={cancelClose}
              onMouseLeave={queueClose}
              className="absolute inset-x-0 top-full hidden overflow-hidden md:block"
            >
              <div
                className="border-b border-white/10"
                style={{
                  background: 'rgba(10,10,18,0.92)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                }}
              >
                {/* AnimatePresence inside swaps the CONTENTS smoothly while the
                    outer container holds its open state. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={openIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={FADE}
                    className="mx-auto grid max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1fr_auto]"
                  >
                    <div
                      className={cn(
                        'grid gap-8',
                        active!.sections!.length === 1 && 'sm:grid-cols-1',
                        active!.sections!.length === 2 && 'sm:grid-cols-2',
                        active!.sections!.length >= 3 && 'sm:grid-cols-3',
                        active!.sections!.length >= 4 && 'lg:grid-cols-4',
                      )}
                    >
                      {active!.sections!.map((section, j) => (
                        <div key={j} className="flex flex-col gap-3">
                          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
                            {section.heading}
                          </p>
                          <ul className="flex flex-col gap-3">
                            {section.links.map((link, k) => (
                              <li key={k}>
                                <a
                                  href={link.href ?? '#'}
                                  target={link.external ? '_blank' : undefined}
                                  rel={link.external ? 'noopener noreferrer' : undefined}
                                  className="group flex items-start gap-2.5 rounded-md p-1.5 transition-colors hover:bg-white/[0.04]"
                                >
                                  {link.icon && (
                                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-white/85">
                                      {link.icon}
                                    </span>
                                  )}
                                  <span className="min-w-0">
                                    <span className="block text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                                      {link.label}
                                    </span>
                                    {link.description && (
                                      <span className="mt-0.5 block text-xs leading-relaxed text-white/55">
                                        {link.description}
                                      </span>
                                    )}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {active!.promo && (
                      <div className="w-full lg:w-[300px]">{active!.promo}</div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile sheet — full list of items + sections inline */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={PANEL_SPRING}
              className="overflow-hidden md:hidden"
            >
              <div
                className="border-b border-white/10"
                style={{
                  background: 'rgba(10,10,18,0.95)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                }}
              >
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6">
                  {items.map((item, i) => (
                    <details
                      key={i}
                      className="group rounded-lg border border-white/[0.06] bg-white/[0.02] open:bg-white/[0.04]"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-white/90 [&::-webkit-details-marker]:hidden">
                        {item.label}
                        {item.sections && (
                          <ChevronRight className="h-3.5 w-3.5 text-white/45 transition-transform group-open:rotate-90" />
                        )}
                      </summary>
                      {item.sections && (
                        <div className="flex flex-col gap-4 px-3 pb-3">
                          {item.sections.map((section, j) => (
                            <div key={j} className="flex flex-col gap-2">
                              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
                                {section.heading}
                              </p>
                              <ul className="flex flex-col gap-1">
                                {section.links.map((link, k) => (
                                  <li key={k}>
                                    <a
                                      href={link.href ?? '#'}
                                      target={link.external ? '_blank' : undefined}
                                      rel={link.external ? 'noopener noreferrer' : undefined}
                                      className="block rounded-md px-2 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
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
                    </details>
                  ))}

                  {actions && (
                    <div className="mt-2 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-3">
                      {actions}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
