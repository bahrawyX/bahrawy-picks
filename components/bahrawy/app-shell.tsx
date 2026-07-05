'use client'

/**
 * <AppShell />
 *
 * The layout primitive every SaaS starts with — rebuilt in an Apple /
 * Emil-Kowalski taste. Fixed 256px vibrancy sidebar, 52px topbar that
 * spans the content column, and a generous main area on `#0a0a0c`.
 *
 * No neon glow, no accent-colored shadows. Active items become a
 * neutral pill with a shared `layoutId` that springs between rows.
 * Mobile sidebar slides in as a drawer behind a blurred scrim.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFocusTrap } from '@/lib/use-focus-trap'

export interface AppShellItem {
  href?: string
  label: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export interface AppShellSection {
  label?: string
  items: AppShellItem[]
}

export interface AppShellProps {
  sidebar: AppShellSection[]
  brand?: React.ReactNode
  topbar?: React.ReactNode
  sidebarFooter?: React.ReactNode
  children: React.ReactNode
  /** Sidebar width in px. Default 256. */
  sidebarWidth?: number
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

export function AppShell({
  sidebar,
  brand,
  topbar,
  sidebarFooter,
  children,
  sidebarWidth = 256,
  className,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const drawerRef = React.useRef<HTMLElement>(null)

  // Focus: move into the mobile drawer while open, restore on close.
  useFocusTrap(drawerRef, mobileOpen)

  // Close the mobile drawer on Escape.
  React.useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <div
      className={cn(
        'relative isolate flex h-full w-full overflow-hidden rounded-2xl border border-picks-fg/[0.06] bg-[#0a0a0c]',
        className,
      )}
    >
      {/* Desktop sidebar */}
      <aside
        style={{ width: sidebarWidth }}
        className="relative hidden h-full shrink-0 flex-col border-r border-picks-fg/[0.06] backdrop-blur-2xl md:flex"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,20,22,0.95) 0%, rgba(14,14,16,0.98) 100%)',
          }}
        />
        <SidebarContent
          sidebar={sidebar}
          brand={brand}
          footer={sidebarFooter}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 z-30 bg-black/60 backdrop-blur-2xl md:hidden"
            />
            <motion.aside
              key="drawer"
              ref={drawerRef}
              tabIndex={-1}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={SPRING}
              style={{ width: 288 }}
              className="absolute inset-y-0 left-0 z-40 flex flex-col border-r border-picks-fg/[0.06] outline-none backdrop-blur-2xl md:hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(20,20,22,0.95) 0%, rgba(14,14,16,0.98) 100%)',
                }}
              />
              <SidebarContent
                sidebar={sidebar}
                brand={brand}
                footer={sidebarFooter}
                onCloseMobile={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="relative z-10 flex h-[52px] shrink-0 items-center gap-3 border-b border-picks-fg/[0.06] px-4 backdrop-blur-xl md:px-6"
          style={{
            background:
              'linear-gradient(180deg, rgba(28,28,30,0.85), rgba(22,22,24,0.92))',
          }}
        >
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-picks-fg/65 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg md:hidden"
          >
            <Menu className="h-4 w-4" strokeWidth={2.25} />
          </button>
          {topbar && <div className="min-w-0 flex-1">{topbar}</div>}
        </header>
        <main className="min-h-0 flex-1 overflow-auto px-8 py-6" data-lenis-prevent>
          {children}
        </main>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function SidebarContent({
  sidebar,
  brand,
  footer,
  onCloseMobile,
}: {
  sidebar: AppShellSection[]
  brand?: React.ReactNode
  footer?: React.ReactNode
  onCloseMobile?: () => void
}) {
  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Brand area — height matches the topbar so the divider stays one
          continuous horizontal line across the whole shell. */}
      <div className="flex h-[52px] shrink-0 items-center justify-between gap-2 border-b border-picks-fg/[0.06] px-4">
        <div className="min-w-0 flex-1">{brand}</div>
        {onCloseMobile && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-picks-fg/55 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>
        )}
      </div>

      {/* Sections */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {sidebar.map((section, i) => (
          <div key={i}>
            {section.label && (
              <p className="px-3 pb-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-picks-fg/40">
                {section.label}
              </p>
            )}
            <ul className="space-y-px">
              {section.items.map((item, j) => (
                <li key={j}>
                  <SidebarRow item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="shrink-0 border-t border-picks-fg/[0.06] p-3">
          {footer}
        </div>
      )}
    </div>
  )
}

function SidebarRow({ item }: { item: AppShellItem }) {
  const className = cn(
    'group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium tracking-tight transition-colors',
    item.active
      ? 'text-picks-fg'
      : 'text-picks-fg/65 hover:bg-picks-fg/[0.04] hover:text-picks-fg',
  )

  const inner = (
    <>
      {item.active && (
        <motion.span
          layoutId="app-shell-active"
          aria-hidden
          className="absolute inset-0 rounded-lg border border-picks-fg/[0.1] bg-picks-fg/[0.08]"
          transition={SPRING}
        />
      )}
      {item.icon && (
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
          {item.icon}
        </span>
      )}
      <span className="relative min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && <span className="relative shrink-0">{item.badge}</span>}
    </>
  )

  if (item.href) {
    return (
      <a href={item.href} onClick={item.onClick} className={className}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" onClick={item.onClick} className={className}>
      {inner}
    </button>
  )
}
