'use client'

/**
 * <SidebarNav />  —  Apple-style app sidebar navigation primitive.
 *
 * Distinct from <AppShell /> (which is a full layout). This is the
 * nav body you'd drop into any layout: collapsible sections,
 * grouped items, icon + label + optional badge, animated active pill
 * via layoutId, optional footer item (user / status), Apple vibrancy +
 * spring physics.
 *
 * Keep it controlled (`active` + `onActiveChange`) or uncontrolled
 * (`defaultActive`). Sections collapse independently.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarNavItem {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  /** Optional trailing badge — number or text. */
  badge?: React.ReactNode
  /** Optional href; if omitted, only the onSelect callback fires. */
  href?: string
}

export interface SidebarNavSection {
  id: string
  label?: string
  items: SidebarNavItem[]
  /** If true, the section is collapsible (default false). */
  collapsible?: boolean
  /** Initial collapsed state when collapsible. */
  defaultCollapsed?: boolean
}

export interface SidebarNavProps {
  sections: SidebarNavSection[]
  /** Optional brand mark / header (logo + product name). */
  brand?: React.ReactNode
  /** Optional sticky footer (user pill, etc). */
  footer?: React.ReactNode
  /** Controlled active item id. */
  active?: string
  /** Uncontrolled default active id. */
  defaultActive?: string
  /** Fires when an item is clicked. */
  onActiveChange?: (id: string) => void
  /** Accent for the active item pill. Default SF indigo. */
  accent?: string
  /** Width in px. Default 248. */
  width?: number
  className?: string
}

const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }
const APPLE_LAYOUT_SPRING = { type: 'spring' as const, stiffness: 480, damping: 36 }

export function SidebarNav({
  sections,
  brand,
  footer,
  active: activeProp,
  defaultActive,
  onActiveChange,
  accent = '#5E5CE6',
  width = 248,
  className,
}: SidebarNavProps) {
  const firstItem = sections.flatMap((s) => s.items)[0]?.id ?? ''
  const [activeState, setActiveState] = React.useState(defaultActive ?? firstItem)
  const active = activeProp ?? activeState

  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const s of sections) {
      if (s.collapsible && s.defaultCollapsed) init[s.id] = true
    }
    return init
  })

  const select = (id: string) => {
    if (activeProp === undefined) setActiveState(id)
    onActiveChange?.(id)
  }

  return (
    <nav
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.06]',
        className,
      )}
      style={{
        width,
        background:
          'linear-gradient(180deg, rgba(28,28,30,0.7) 0%, rgba(18,18,20,0.85) 100%)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: `
          0 1px 0 rgba(255,255,255,0.05) inset,
          0 0 0 0.5px rgba(255,255,255,0.05),
          0 18px 40px -16px rgba(0,0,0,0.45)
        `,
      }}
    >
      {brand && (
        <div className="border-b border-white/[0.06] px-4 py-3.5">{brand}</div>
      )}

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-2 py-3" data-lenis-prevent>
        {sections.map((section, si) => {
          const isCollapsed = !!collapsed[section.id]
          return (
            <div key={section.id} className={cn(si > 0 && 'mt-4')}>
              {section.label && (
                <div className="mb-1 flex items-center gap-1.5 px-3">
                  {section.collapsible ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsed((c) => ({ ...c, [section.id]: !isCollapsed }))
                      }
                      className="group inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-white/70"
                    >
                      <motion.span
                        animate={{ rotate: isCollapsed ? -90 : 0 }}
                        transition={APPLE_SPRING}
                        className="inline-flex"
                      >
                        <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
                      </motion.span>
                      {section.label}
                    </button>
                  ) : (
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                      {section.label}
                    </p>
                  )}
                </div>
              )}

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={APPLE_SPRING}
                    className="overflow-hidden"
                  >
                    {section.items.map((item) => {
                      const isActive = item.id === active
                      const Tag: React.ElementType = item.href ? 'a' : 'button'
                      return (
                        <li key={item.id}>
                          <motion.div whileTap={{ scale: 0.985 }} transition={APPLE_SPRING}>
                            <Tag
                              {...(item.href ? { href: item.href } : { type: 'button' })}
                              onClick={(e: React.MouseEvent) => {
                                if (!item.href) e.preventDefault()
                                select(item.id)
                              }}
                              className={cn(
                                'group relative flex w-full items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-left text-[13px] tracking-tight transition-colors',
                                isActive
                                  ? 'text-white'
                                  : 'text-white/65 hover:text-white',
                              )}
                            >
                              {isActive && (
                                <motion.span
                                  layoutId="sidebar-nav-active"
                                  className="absolute inset-0 rounded-[10px]"
                                  style={{
                                    background: `linear-gradient(180deg, ${accent}38 0%, ${accent}22 100%)`,
                                    border: `0.5px solid ${accent}55`,
                                    boxShadow: `0 1px 0 rgba(255,255,255,0.08) inset, 0 4px 12px -4px ${accent}55`,
                                  }}
                                  transition={APPLE_LAYOUT_SPRING}
                                />
                              )}
                              {item.icon && (
                                <span
                                  className={cn(
                                    'relative inline-flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4',
                                  )}
                                >
                                  {item.icon}
                                </span>
                              )}
                              <span className="relative min-w-0 flex-1 truncate font-medium">
                                {item.label}
                              </span>
                              {item.badge != null && (
                                <span
                                  className={cn(
                                    'relative inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full border px-1.5 font-mono text-[10px] font-semibold tabular-nums',
                                    isActive
                                      ? 'border-white/15 bg-white/[0.1] text-white'
                                      : 'border-white/[0.08] bg-white/[0.04] text-white/70',
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </Tag>
                          </motion.div>
                        </li>
                      )
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {footer && (
        <div className="border-t border-white/[0.06] px-3 py-3">{footer}</div>
      )}
    </nav>
  )
}
