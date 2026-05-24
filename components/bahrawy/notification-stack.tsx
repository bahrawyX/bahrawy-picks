'use client'

/**
 * <NotificationStack />
 *
 * iOS-style stacked notification cards. Collapsed by default — only
 * the top card is fully visible, with the next 1–2 peeking out behind
 * it at a slight scale-down. Hover (or focus) fans them all out into
 * a vertical list with spring physics; leave the area and they
 * re-stack. Click the X on any card to dismiss it with a slide-out.
 *
 * Optional `clearAll` button appears once expanded.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Notification {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  timestamp?: string
  /** Optional small icon node rendered in the leading slot. */
  icon?: React.ReactNode
  /** Tints the leading icon background. Default accent. */
  accent?: string
  /** Marks as unread (subtle dot indicator). */
  unread?: boolean
}

export interface NotificationStackProps {
  notifications: Notification[]
  /** Number of cards visible behind the top one when collapsed. Default 2. */
  peek?: number
  /** Fires after a card is dismissed. */
  onDismiss?: (id: string) => void
  /** Fires when "Clear all" is clicked. */
  onClearAll?: () => void
  /** Default accent for unstyled cards. Default violet. */
  accent?: string
  className?: string
}

const SPRING = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 32,
  mass: 0.6,
}

export function NotificationStack({
  notifications: initial,
  peek = 2,
  onDismiss,
  onClearAll,
  accent = '#A78BFA',
  className,
}: NotificationStackProps) {
  const [items, setItems] = React.useState(initial)
  React.useEffect(() => setItems(initial), [initial])
  const [expanded, setExpanded] = React.useState(false)

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id))
    onDismiss?.(id)
  }

  const clearAll = () => {
    setItems([])
    onClearAll?.()
  }

  const visible = expanded ? items : items.slice(0, peek + 1)
  const hiddenBehind = expanded ? 0 : Math.max(0, items.length - (peek + 1))

  return (
    <div className={cn('w-full max-w-sm', className)}>
      <div
        className="relative"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        tabIndex={0}
      >
        {/* Stack area */}
        <div className="relative">
          <AnimatePresence initial={false}>
            {visible.map((n, i) => {
              const isTop = i === 0
              const collapsedOffset = i * 6 // px
              const collapsedScale = 1 - i * 0.04
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={
                    expanded
                      ? { opacity: 1, y: i * 88, scale: 1, zIndex: 100 - i }
                      : {
                          opacity: i === 0 ? 1 : 0.85 - i * 0.18,
                          y: collapsedOffset,
                          scale: collapsedScale,
                          zIndex: 100 - i,
                        }
                  }
                  exit={{ opacity: 0, x: 60, scale: 0.92, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
                  transition={SPRING}
                  className={cn(
                    'absolute left-0 right-0 top-0 origin-top',
                    isTop ? '' : 'pointer-events-none',
                    expanded && 'pointer-events-auto',
                  )}
                  style={{ zIndex: 100 - i }}
                >
                  <NotificationCard
                    notification={n}
                    onDismiss={() => dismiss(n.id)}
                    accent={n.accent ?? accent}
                    showDismiss={expanded || isTop}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Reserve space — height grows with expansion */}
          <div
            aria-hidden
            style={{
              height: expanded
                ? items.length * 88 + 4
                : items.length === 0
                  ? 0
                  : 76 + Math.min(peek, items.length - 1) * 6,
              transition: 'height 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />

          {/* Empty state */}
          {items.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Bell className="h-4 w-4 text-white/30" strokeWidth={2} />
              <p className="text-[12px] text-white/40">No notifications</p>
            </div>
          )}

          {/* Hidden-behind peek count, collapsed only */}
          {!expanded && hiddenBehind > 0 && (
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] tabular-nums text-white/45"
            >
              +{hiddenBehind} more
            </div>
          )}
        </div>

        {/* Clear all — only when expanded with items */}
        <AnimatePresence>
          {expanded && items.length > 1 && (
            <motion.div
              key="clear"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-4 flex justify-end"
            >
              <button
                type="button"
                onClick={clearAll}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/65 transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function NotificationCard({
  notification,
  onDismiss,
  accent,
  showDismiss,
}: {
  notification: Notification
  onDismiss: () => void
  accent: string
  showDismiss: boolean
}) {
  return (
    <div className="relative flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 px-3.5 py-3 shadow-2xl shadow-black/40 backdrop-blur">
      {/* Leading icon */}
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1"
        style={{
          background: `${accent}1a`,
          color: accent,
          borderColor: `${accent}33`,
          boxShadow: `inset 0 0 0 1px ${accent}33`,
        }}
      >
        {notification.icon ?? <Bell className="h-4 w-4" strokeWidth={2.5} />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="truncate font-display text-[12.5px] font-semibold tracking-tight text-white/90">
            {notification.title}
          </p>
          {notification.unread && (
            <span
              aria-label="Unread"
              className="block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: accent }}
            />
          )}
        </div>
        {notification.description && (
          <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-white/55">
            {notification.description}
          </p>
        )}
        {notification.timestamp && (
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/30">
            {notification.timestamp}
          </p>
        )}
      </div>

      {showDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <X className="h-3 w-3" strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
