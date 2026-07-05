'use client'

import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springGentle, springSnappy } from '@/lib/motion'
import { Badge } from '@/components/ui/badge'
import { formatRelative, formatAbsolute } from '@/lib/time-utils'

export interface TimelineEventData {
  id: string
  title: string
  description?: string | ReactNode
  timestamp: Date | string
  icon?: ReactNode
  iconBackground?: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  avatar?: { src?: string; fallback: string }
  status?: 'completed' | 'current' | 'upcoming' | 'error' | 'warning'
  expandable?: boolean
  metadata?: Record<string, string>
  color?: string
}

interface TimelineEventCardProps {
  event: TimelineEventData
  showTimestamp?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onClick?: (event: TimelineEventData) => void
  className?: string
}

export function TimelineEventCard({
  event,
  showTimestamp = true,
  timestampFormat = 'relative',
  onClick,
  className,
}: TimelineEventCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelative(event.timestamp)
  )

  // Refresh relative time every 60s
  useEffect(() => {
    if (timestampFormat === 'absolute') return
    const id = setInterval(() => {
      setRelativeTime(formatRelative(event.timestamp))
    }, 60_000)
    return () => clearInterval(id)
  }, [event.timestamp, timestampFormat])

  const handleClick = useCallback(() => {
    if (event.expandable) {
      setExpanded((v) => !v)
    }
    onClick?.(event)
  }, [event, onClick])

  const absoluteTime = formatAbsolute(event.timestamp)

  const isClickable = !!onClick || event.expandable

  return (
    <motion.div
      whileHover={isClickable ? { scale: 1.01 } : undefined}
      whileTap={isClickable ? { scale: 0.99 } : undefined}
      transition={springSnappy}
      onClick={handleClick}
      className={cn(
        'group rounded-xl border border-picks-fg/[0.06] bg-picks-fg/[0.02] p-4',
        isClickable && 'cursor-pointer transition-colors hover:bg-picks-fg/[0.04]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-medium text-picks-fg/90">
              {event.title}
            </h4>
            {event.badge && (
              <Badge
                variant={event.badgeVariant ?? 'secondary'}
                className="shrink-0 text-[10px]"
              >
                {event.badge}
              </Badge>
            )}
          </div>

          {/* Timestamp */}
          {showTimestamp && (
            <p className="mt-0.5 text-xs text-picks-fg/30" title={absoluteTime} suppressHydrationWarning>
              {timestampFormat === 'absolute'
                ? absoluteTime
                : relativeTime}
              {timestampFormat === 'both' && (
                <span className="ml-1.5 text-picks-fg/15" suppressHydrationWarning>· {absoluteTime}</span>
              )}
            </p>
          )}
        </div>

        {/* Expand toggle */}
        {event.expandable && (
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={springSnappy}
          >
            <ChevronDown className="h-4 w-4 text-picks-fg/25" />
          </motion.div>
        )}
      </div>

      {/* Description — always visible if not expandable */}
      {event.description && !event.expandable && (
        <div className="mt-2 text-sm text-picks-fg/50">
          {event.description}
        </div>
      )}

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {event.expandable && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springGentle}
            className="overflow-hidden"
          >
            {event.description && (
              <div className="mt-3 text-sm text-picks-fg/50">
                {event.description}
              </div>
            )}

            {/* Metadata grid */}
            {event.metadata && (
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 rounded-lg bg-picks-fg/[0.02] p-3">
                {Object.entries(event.metadata).map(([key, val]) => (
                  <div key={key} className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-picks-fg/25">{key}</span>
                    <span className="text-xs font-medium text-picks-fg/60">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
