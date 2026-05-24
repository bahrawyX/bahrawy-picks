'use client'

/**
 * <AppShell />  (Aurora theme)
 *
 * The layout primitive every SaaS starts with — redesigned with an
 * Aurora vibe. The sidebar gets a soft cyan→violet ambient glow at
 * the top that fades down into the surface. Active nav items become a
 * gradient pill (cyan→violet at ~15% opacity over a thin border in
 * the same hue), with a shared `layoutId` so the pill animates
 * between rows. The topbar is glassmorphic (backdrop-blur + semi-
 * transparent surface). User chip lights up on hover.
 *
 * Same API as before — sections of items, optional brand + topbar +
 * footer slots, collapsible to icon-only, mobile drawer.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  defaultCollapsed?: boolean
  collapsible?: boolean
  sidebarWidth?: number
  collapsedWidth?: number
  /** Override the gradient stops. Default ['#22D3EE', '#A78BFA'] (cyan → violet). */
  accent?: [string, string]
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 32, mass: 0.7 }

export function AppShell({
  sidebar,
  brand,
  topbar,
  sidebarFooter,
  children,
  defaultCollapsed = false,
  collapsible = true,
  sidebarWidth = 248,
  collapsedWidth = 72,
  accent = ['#22D3EE', '#A78BFA'],
  className,
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [accentA, accentB] = accent

  return (
    <div
      className={cn(
        'relative isolate flex h-full w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#08070d]',
        className,
      )}
    >
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? collapsedWidth : sidebarWidth }}
        transition={SPRING}
        className="relative hidden h-full shrink-0 flex-col border-r border-white/[0.05] bg-gradient-to-b from-white/[0.025] to-transparent md:flex"
      >
        {/* Aurora glow at top of rail */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-56"
          style={{
            background: `radial-gradient(140% 100% at 50% 0%, ${accentB}1f 0%, transparent 60%), radial-gradient(120% 100% at 30% 0%, ${accentA}14 0%, transparent 55%)`,
          }}
        />
        <SidebarContent
          sidebar={sidebar}
          brand={brand}
          footer={sidebarFooter}
          collapsed={collapsed}
          collapsible={collapsible}
          accent={accent}
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
              className="absolute inset-0 z-30 bg-black/65 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={SPRING}
              className="absolute inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#08070d] md:hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-56"
                style={{
                  background: `radial-gradient(140% 100% at 50% 0%, ${accentB}24 0%, transparent 60%), radial-gradient(120% 100% at 30% 0%, ${accentA}17 0%, transparent 55%)`,
                }}
              />
              <SidebarContent
                sidebar={sidebar}
                brand={brand}
                footer={sidebarFooter}
                collapsed={false}
                collapsible={false}
                accent={accent}
                onCloseMobile={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-white/[0.05] bg-[#08070d]/70 px-3 py-2.5 backdrop-blur-md md:px-4">
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
  accent,
  onToggle,
  onCloseMobile,
}: {
  sidebar: AppShellSection[]
  brand?: React.ReactNode
  footer?: React.ReactNode
  collapsed: boolean
  collapsible: boolean
  accent: [string, string]
  onToggle?: () => void
  onCloseMobile?: () => void
}) {
  return (
    <div className="relative flex h-full flex-col">
      {/* Brand row */}
      <div className="flex shrink-0 items-center justify-between gap-2 px-3.5 py-4">
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
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
          </button>
        ) : null}
      </div>

      {/* Hairline under brand */}
      <div
        aria-hidden
        className="mx-3 h-px shrink-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-2 pb-3 pt-4">
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
                  className="px-3 pb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.28em] text-white/35"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {section.items.map((item, j) => (
                <li key={j}>
                  <SidebarRow item={item} collapsed={collapsed} accent={accent} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer && (
        <div
          aria-hidden
          className="mx-3 h-px shrink-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        />
      )}
      {footer && <div className="shrink-0 p-2">{footer}</div>}
    </div>
  )
}

function SidebarRow({
  item,
  collapsed,
  accent,
}: {
  item: AppShellItem
  collapsed: boolean
  accent: [string, string]
}) {
  const [accentA, accentB] = accent
  const className = cn(
    'group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
    item.active
      ? 'text-white'
      : 'text-white/65 hover:bg-white/[0.04] hover:text-white',
    collapsed && 'justify-center px-0',
  )
  const inner = (
    <>
      {item.active && (
        <motion.span
          layoutId="app-shell-active"
          aria-hidden
          className="absolute inset-0 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${accentA}22 0%, ${accentB}1e 100%)`,
            border: `1px solid ${accentB}33`,
            boxShadow: `inset 0 1px 0 ${accentB}1f, 0 4px 20px -8px ${accentB}55`,
          }}
          transition={SPRING}
        />
      )}
      {item.icon && (
        <span
          className={cn(
            'relative inline-flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4',
            item.active && 'text-white',
          )}
          style={item.active ? { color: '#fff' } : undefined}
        >
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
            className="relative min-w-0 flex-1 truncate font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && item.badge && (
        <span className="relative shrink-0">{item.badge}</span>
      )}
      {/* Tooltip when collapsed */}
      {collapsed && (
        <span
          className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-zinc-950 px-2 py-1 text-[11px] text-white shadow-xl group-hover:block"
          role="tooltip"
        >
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
