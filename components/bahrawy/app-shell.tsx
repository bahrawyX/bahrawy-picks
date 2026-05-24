'use client'

/**
 * <AppShell />
 *
 * The layout primitive every SaaS starts with. A left rail (brand at
 * top, navigation sections below, a footer slot at the bottom), an
 * optional topbar, and the main content area. Spring-animated collapse
 * to icon-only mode — labels fade out as the rail shrinks; active
 * highlight + tooltips when collapsed. Mobile: rail slides in as a
 * drawer when you tap the hamburger.
 *
 * Pass sections of items (each item has icon + label + optional badge
 * + href/onClick); mark the active one explicitly or let the consumer
 * compute it from `usePathname()`.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AppShellItem {
  /** href makes this an anchor; otherwise onClick fires on click. */
  href?: string
  label: string
  icon?: React.ReactNode
  /** Optional trailing badge / count. */
  badge?: React.ReactNode
  /** Marks the row as the active route. */
  active?: boolean
  onClick?: () => void
}

export interface AppShellSection {
  /** Optional section heading. Hidden when collapsed. */
  label?: string
  items: AppShellItem[]
}

export interface AppShellProps {
  sidebar: AppShellSection[]
  /** Logo + product name slot, top of the rail. */
  brand?: React.ReactNode
  /** Topbar contents. Hidden if omitted. */
  topbar?: React.ReactNode
  /** Footer slot at the bottom of the rail (e.g. account chip). */
  sidebarFooter?: React.ReactNode
  /** Main content area. */
  children: React.ReactNode
  defaultCollapsed?: boolean
  collapsible?: boolean
  sidebarWidth?: number
  collapsedWidth?: number
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.7 }

export function AppShell({
  sidebar,
  brand,
  topbar,
  sidebarFooter,
  children,
  defaultCollapsed = false,
  collapsible = true,
  sidebarWidth = 240,
  collapsedWidth = 68,
  className,
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div
      className={cn(
        'relative flex h-full w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60',
        className,
      )}
    >
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? collapsedWidth : sidebarWidth }}
        transition={SPRING}
        className="hidden h-full shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.015] md:flex"
      >
        <SidebarContent
          sidebar={sidebar}
          brand={brand}
          footer={sidebarFooter}
          collapsed={collapsed}
          collapsible={collapsible}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={SPRING}
              className="absolute inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-zinc-950 md:hidden"
            >
              <SidebarContent
                sidebar={sidebar}
                brand={brand}
                footer={sidebarFooter}
                collapsed={false}
                collapsible={false}
                onCloseMobile={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {(topbar || true) && (
          <header className="flex shrink-0 items-center gap-2 border-b border-white/[0.06] bg-white/[0.015] px-3 py-2.5 md:px-4">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
            >
              <Menu className="h-4 w-4" strokeWidth={2.5} />
            </button>
            {topbar && <div className="min-w-0 flex-1">{topbar}</div>}
          </header>
        )}
        <main className="min-h-0 flex-1 overflow-auto" data-lenis-prevent>
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
  collapsed,
  collapsible,
  onToggle,
  onCloseMobile,
}: {
  sidebar: AppShellSection[]
  brand?: React.ReactNode
  footer?: React.ReactNode
  collapsed: boolean
  collapsible: boolean
  onToggle?: () => void
  onCloseMobile?: () => void
}) {
  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-3">
        <AnimatePresence mode="wait" initial={false}>
          {!collapsed && brand && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="min-w-0 flex-1"
            >
              {brand}
            </motion.div>
          )}
        </AnimatePresence>
        {onCloseMobile ? (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        ) : collapsible ? (
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggle}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
          </button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 pb-3">
        {sidebar.map((section, i) => (
          <div key={i}>
            <AnimatePresence mode="wait" initial={false}>
              {section.label && !collapsed && (
                <motion.p
                  key="label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-2.5 pb-1.5 pt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/35"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {section.items.map((item, j) => (
                <li key={j}>
                  <SidebarRow item={item} collapsed={collapsed} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer && (
        <div className="shrink-0 border-t border-white/[0.05] p-2">
          {footer}
        </div>
      )}
    </>
  )
}

function SidebarRow({ item, collapsed }: { item: AppShellItem; collapsed: boolean }) {
  const className = cn(
    'group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors',
    item.active
      ? 'bg-white/[0.08] text-white'
      : 'text-white/65 hover:bg-white/[0.04] hover:text-white',
    collapsed && 'justify-center px-0',
  )
  const inner = (
    <>
      {item.active && (
        <motion.span
          layoutId="app-shell-active"
          aria-hidden
          className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-violet-400"
          transition={SPRING}
        />
      )}
      {item.icon && (
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
          {item.icon}
        </span>
      )}
      <AnimatePresence mode="wait" initial={false}>
        {!collapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.16 }}
            className="min-w-0 flex-1 truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && item.badge && <span className="shrink-0">{item.badge}</span>}
      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg group-hover:block group-hover:opacity-100">
          {item.label}
        </span>
      )}
    </>
  )

  if (item.href) {
    return (
      <a
        href={item.href}
        onClick={item.onClick}
        title={collapsed ? item.label : undefined}
        className={className}
      >
        {inner}
      </a>
    )
  }
  return (
    <button
      type="button"
      onClick={item.onClick}
      title={collapsed ? item.label : undefined}
      className={className}
    >
      {inner}
    </button>
  )
}
