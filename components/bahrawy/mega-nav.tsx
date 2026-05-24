'use client'

/**
 * <MegaNav />  —  Apple.com–style mega navigation.
 *
 * Top bar:  small text links (Mac · iPad · iPhone · …) on a vibrancy
 *           pill backdrop; subtle blur deepens once you scroll.
 * Dropdown: a generous panel that opens below the bar with section
 *           groups — small uppercase eyebrow ("Explore TV") above a
 *           stack of big bold links ("Apple TV 4K", "Apple TV
 *           Support"). No icons, no descriptions — Apple keeps the
 *           drop-down ruthlessly typographic.
 *
 * Animations: panel scales + fades in on hover; switching between
 * categories crossfades the inner content while the panel itself
 * holds its open state, so it reads as one continuous surface
 * (no flicker). Apple spring physics (stiffness 380 / damping 32).
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
  /** Open in a new tab. */
  external?: boolean
}

export interface MegaNavSection {
  /** Small uppercase eyebrow above the link stack. */
  heading: string
  links: MegaNavLink[]
}

export interface MegaNavItem {
  label: string
  href?: string
  /** Pass sections to enable the drop-down. Omit for a plain link. */
  sections?: MegaNavSection[]
}

export interface MegaNavProps {
  /** Brand mark on the left — wordmark or SVG. */
  logo?: React.ReactNode
  /** Top-level menu items. */
  items: MegaNavItem[]
  /** Right-side slot — search button, sign-in, cart, etc. */
  actions?: React.ReactNode
  /** Px scrolled before the bar deepens its backdrop. Default 24. */
  scrollThreshold?: number
  /** Bar position. Default 'sticky'. */
  position?: 'sticky' | 'fixed' | 'relative'
  className?: string
}

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

const PANEL_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 32,
  mass: 0.7,
}
const CROSSFADE = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }

// ---------------------------------------------------------------------------
// Component
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

  const openMenu = React.useCallback((i: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpenIndex(i)
  }, [])
  const queueClose = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), 140)
  }, [])
  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
  }, [])

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollThreshold])

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
      <div className="relative">
        {/* Vibrancy backdrop — deepens on scroll */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{
            backgroundColor: scrolled
              ? 'rgba(12,12,14,0.78)'
              : 'rgba(12,12,14,0.5)',
            backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(160%)',
            borderBottomColor:
              openIndex !== null
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.05)',
          }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0 border-b"
        />

        <div className="relative mx-auto flex h-12 max-w-[1024px] items-center gap-2 px-6">
          {/* Logo */}
          {logo && (
            <a
              href="/"
              className="shrink-0 text-white transition-opacity hover:opacity-80"
              onMouseEnter={queueClose}
              aria-label="Home"
            >
              {logo}
            </a>
          )}

          {/* Menu (hidden on mobile) */}
          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center justify-center md:flex"
          >
            <ul className="flex items-center">
              {items.map((item, i) => {
                const isOpen = openIndex === i
                const mega = hasMega(item)
                const cls =
                  'inline-flex items-center px-4 py-1.5 text-[12px] font-normal tracking-tight transition-colors'
                return (
                  <li
                    key={i}
                    onMouseEnter={() => (mega ? openMenu(i) : queueClose())}
                  >
                    {item.href && !mega ? (
                      <a
                        href={item.href}
                        className={cn(cls, 'text-white/85 hover:text-white')}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-haspopup={mega || undefined}
                        className={cn(
                          cls,
                          isOpen ? 'text-white' : 'text-white/85 hover:text-white',
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

        {/* Mega-menu drawer (desktop) — Apple.com style: all-text, big bold links */}
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
                className="border-b border-white/[0.06]"
                style={{
                  background: 'rgba(12,12,14,0.92)',
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={openIndex}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={CROSSFADE}
                    className="mx-auto grid max-w-[1024px] grid-cols-1 gap-x-12 gap-y-10 px-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  >
                    {active!.sections!.map((section, j) => (
                      <div key={j} className="flex flex-col gap-3">
                        <p className="text-[11px] font-normal tracking-tight text-white/40">
                          {section.heading}
                        </p>
                        <ul className="flex flex-col gap-2">
                          {section.links.map((link, k) => (
                            <li key={k}>
                              <a
                                href={link.href ?? '#'}
                                target={link.external ? '_blank' : undefined}
                                rel={link.external ? 'noopener noreferrer' : undefined}
                                className="block text-[22px] font-semibold tracking-tight text-white/95 transition-opacity hover:opacity-70 sm:text-[24px]"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile sheet */}
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
                className="border-b border-white/[0.06]"
                style={{
                  background: 'rgba(12,12,14,0.95)',
                  backdropFilter: 'blur(28px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                }}
              >
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6">
                  {items.map((item, i) => (
                    <details
                      key={i}
                      className="group rounded-lg border border-white/[0.06] bg-white/[0.02] open:bg-white/[0.04]"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-[13px] font-medium tracking-tight text-white/90 [&::-webkit-details-marker]:hidden">
                        {item.label}
                        {item.sections && (
                          <ChevronRight className="h-3.5 w-3.5 text-white/45 transition-transform group-open:rotate-90" />
                        )}
                      </summary>
                      {item.sections && (
                        <div className="flex flex-col gap-4 px-3 pb-3">
                          {item.sections.map((section, j) => (
                            <div key={j} className="flex flex-col gap-2">
                              <p className="text-[10.5px] font-normal tracking-tight text-white/40">
                                {section.heading}
                              </p>
                              <ul className="flex flex-col gap-1.5">
                                {section.links.map((link, k) => (
                                  <li key={k}>
                                    <a
                                      href={link.href ?? '#'}
                                      target={link.external ? '_blank' : undefined}
                                      rel={link.external ? 'noopener noreferrer' : undefined}
                                      className="block rounded-md px-2 py-1.5 text-[15px] font-semibold tracking-tight text-white/85 transition-colors hover:bg-white/[0.06] hover:text-white"
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
