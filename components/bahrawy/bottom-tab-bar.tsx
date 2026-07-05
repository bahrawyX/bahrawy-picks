'use client'

/**
 * <BottomTabBar />  —  iOS-style mobile bottom navigation.
 *
 * Floating vibrancy pill at the bottom of the viewport (or its
 * parent), 3–5 tabs with icon + label, active tab gets a soft
 * white pill that glides between tabs via layoutId, optional
 * trailing badge on each tab.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRovingTabindex } from '@/lib/use-roving-tabindex'

export interface BottomTabBarItem<V extends string = string> {
  value: V
  label: string
  icon: React.ReactNode
  badge?: React.ReactNode
}

export interface BottomTabBarProps<V extends string = string> {
  items: BottomTabBarItem<V>[]
  value?: V
  defaultValue?: V
  onValueChange?: (next: V) => void
  /** Show the label under each icon. Default true. */
  showLabels?: boolean
  /** Stick to the bottom of the viewport with `position: fixed`. Default false. */
  floating?: boolean
  /** Optional id for the active-pill layoutId. */
  layoutId?: string
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 480, damping: 36, mass: 0.55 }

export function BottomTabBar<V extends string = string>({
  items,
  value: controlled,
  defaultValue,
  onValueChange,
  showLabels = true,
  floating = false,
  layoutId,
  className,
}: BottomTabBarProps<V>) {
  const [internal, setInternal] = React.useState<V>(
    defaultValue ?? items[0]?.value ?? ('' as V),
  )
  const value = controlled ?? internal
  const idRef = React.useRef(layoutId ?? `tab-bar-${Math.random().toString(36).slice(2, 9)}`)

  const select = (v: V) => {
    if (controlled === undefined) setInternal(v)
    onValueChange?.(v)
  }

  const selectedIndex = Math.max(0, items.findIndex((i) => i.value === value))

  const roving = useRovingTabindex({
    count: items.length,
    focusIndex: selectedIndex,
    onNavigate: (index) => {
      const item = items[index]
      if (item) select(item.value)
    },
  })

  return (
    <nav
      className={cn(
        'flex items-center gap-1 rounded-full border border-picks-fg/[0.08] p-1 backdrop-blur-2xl',
        floating && 'fixed bottom-4 left-1/2 z-50 -translate-x-1/2',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, rgba(28,28,32,0.85) 0%, rgba(18,18,22,0.92) 100%)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 0.5px rgba(255,255,255,0.05), 0 18px 40px -12px rgba(0,0,0,0.55)',
      }}
    >
      {items.map((item, index) => {
        const selected = item.value === value
        const badgeText =
          typeof item.badge === 'string' || typeof item.badge === 'number'
            ? `${item.label}, ${item.badge} new`
            : undefined
        return (
          <motion.button
            key={item.value}
            type="button"
            aria-current={selected ? 'page' : undefined}
            aria-label={badgeText}
            onClick={() => select(item.value)}
            {...roving.getItemProps(index)}
            whileTap={{ scale: 0.94 }}
            transition={SPRING}
            className={cn(
              'group relative inline-flex flex-col items-center justify-center gap-0.5 rounded-full px-3.5 py-2 text-[10.5px] font-medium tracking-tight transition-colors',
              selected ? 'text-picks-fg' : 'text-picks-fg/55 hover:text-picks-fg/85',
            )}
          >
            {selected && (
              <motion.span
                layoutId={idRef.current}
                className="absolute inset-0 rounded-full bg-picks-fg/[0.1]"
                style={{
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(255,255,255,0.08)',
                }}
                transition={SPRING}
              />
            )}
            <span
              className={cn(
                'relative inline-flex items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]',
              )}
            >
              {item.icon}
              {item.badge != null && (
                <span
                  className="absolute -right-1.5 -top-1 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#FF453A] px-1 text-[9px] font-bold tabular-nums text-picks-fg"
                  aria-hidden
                >
                  {item.badge}
                </span>
              )}
            </span>
            {showLabels && (
              <span className="relative leading-none">{item.label}</span>
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
