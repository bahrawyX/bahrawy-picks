'use client'

/**
 * <Tabs />
 *
 * Animated tab bar with a sliding indicator under the active tab and a fade-
 * through on the content panel. Uses `layoutId` so the indicator springs to
 * its new tab — no manual math.
 *
 * @param items        — Array of `{ id, label, content }`.
 * @param defaultId    — Tab to start active. Defaults to the first.
 * @param value        — Controlled active id. Provide with `onValueChange`.
 * @param onValueChange — Called with the new active id when the user clicks.
 * @param accentColor  — Color for the indicator + active label.
 * @param className    — Extra classes for the outer wrapper.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: React.ReactNode
  content: React.ReactNode
}

export interface TabsProps {
  items: TabItem[]
  defaultId?: string
  value?: string
  onValueChange?: (id: string) => void
  accentColor?: string
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 380, damping: 30, mass: 0.8 }

export function Tabs({
  items,
  defaultId,
  value,
  onValueChange,
  accentColor = '#FFFFFF',
  className,
}: TabsProps) {
  const [internal, setInternal] = React.useState<string>(
    defaultId ?? items[0]?.id,
  )
  const active = value ?? internal
  const indicatorId = React.useId()

  const select = (id: string) => {
    if (value === undefined) setInternal(id)
    onValueChange?.(id)
  }

  const activeItem = items.find((i) => i.id === active) ?? items[0]

  return (
    <div className={cn('w-full', className)}>
      <div
        role="tablist"
        className="relative flex items-center gap-1 border-b border-white/10"
      >
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => select(item.id)}
              className="relative px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              style={{ color: isActive ? accentColor : undefined }}
            >
              {item.label}
              {isActive && (
                <motion.span
                  layoutId={indicatorId}
                  className="absolute inset-x-2 -bottom-px h-px"
                  style={{ background: accentColor }}
                  transition={SPRING}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="relative mt-4 min-h-[80px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="text-sm leading-relaxed text-white/80"
          >
            {activeItem?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
