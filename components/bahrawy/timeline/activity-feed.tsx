'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import { Badge } from '@/components/ui/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { formatRelative, formatAbsolute, formatDateGroup } from '@/lib/time-utils'
import { type TimelineEventData } from './timeline-event'
import { DateSeparator } from './date-separator'

interface ActivityFeedProps {
  events: TimelineEventData[]
  live?: boolean
  groupByDate?: boolean
  maxVisible?: number
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onEventClick?: (event: TimelineEventData) => void
  className?: string
}

// ---- Activity item ----

function ActivityItem({
  event,
  isNew,
  showTimestamps,
  timestampFormat,
  onEventClick,
}: {
  event: TimelineEventData
  isNew?: boolean
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onEventClick?: (event: TimelineEventData) => void
}) {
  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelative(event.timestamp)
  )

  useEffect(() => {
    if (timestampFormat === 'absolute') return
    const id = setInterval(() => setRelativeTime(formatRelative(event.timestamp)), 60_000)
    return () => clearInterval(id)
  }, [event.timestamp, timestampFormat])

  const absoluteTime = formatAbsolute(event.timestamp)

  const statusBorder: Record<string, string> = {
    completed: 'border-l-emerald-500/40',
    current: 'border-l-picks-fg/40',
    upcoming: 'border-l-picks-fg/10',
    error: 'border-l-red-500/40',
    warning: 'border-l-amber-500/40',
  }

  // New items get Framer Motion animation; existing items use CSS
  if (isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -40, height: 0 }}
        animate={{ opacity: 1, x: 0, height: 'auto' }}
        transition={springSnappy}
        onClick={() => onEventClick?.(event)}
        className={cn(
          'flex items-start gap-3 border-l-2 py-3 pl-4 pr-2 transition-colors hover:bg-picks-fg/[0.02]',
          statusBorder[event.status ?? 'completed'],
          onEventClick && 'cursor-pointer'
        )}
      >
        {renderContent(event, showTimestamps, timestampFormat, relativeTime, absoluteTime)}
      </motion.div>
    )
  }

  return (
    <div
      onClick={() => onEventClick?.(event)}
      className={cn(
        'flex items-start gap-3 border-l-2 py-3 pl-4 pr-2 transition-colors hover:bg-picks-fg/[0.02] animate-tl-fade-up',
        statusBorder[event.status ?? 'completed'],
        onEventClick && 'cursor-pointer'
      )}
    >
      {renderContent(event, showTimestamps, timestampFormat, relativeTime, absoluteTime)}
    </div>
  )
}

function renderContent(
  event: TimelineEventData,
  showTimestamps?: boolean,
  timestampFormat?: 'relative' | 'absolute' | 'both',
  relativeTime?: string,
  absoluteTime?: string,
) {
  return (
    <>
      {/* Avatar or icon */}
      <div className="shrink-0 pt-0.5">
        {event.avatar ? (
          <Avatar className="h-7 w-7">
            {event.avatar.src && <AvatarImage src={event.avatar.src} />}
            <AvatarFallback className="bg-picks-fg/[0.08] text-[10px] font-medium text-picks-fg/60">
              {event.avatar.fallback}
            </AvatarFallback>
          </Avatar>
        ) : event.icon ? (
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full [&_svg]:h-3.5 [&_svg]:w-3.5',
              event.iconBackground ?? event.color ?? 'bg-picks-fg/[0.06] text-picks-fg/50'
            )}
          >
            {event.icon}
          </div>
        ) : (
          <div className="h-7 w-7 rounded-full bg-picks-fg/[0.06]" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-picks-fg/80">
            {event.title}
          </span>
          {event.badge && (
            <Badge
              variant={event.badgeVariant ?? 'secondary'}
              className="shrink-0 text-[10px]"
            >
              {event.badge}
            </Badge>
          )}
        </div>
        {event.description && (
          <p className="mt-0.5 text-xs text-picks-fg/35 line-clamp-2">
            {typeof event.description === 'string'
              ? event.description
              : null}
          </p>
        )}
      </div>

      {/* Timestamp */}
      {showTimestamps !== false && (
        <span
          className="shrink-0 pt-0.5 text-[11px] tabular-nums text-picks-fg/20"
          title={absoluteTime}
          suppressHydrationWarning
        >
          {timestampFormat === 'absolute' ? absoluteTime : relativeTime}
        </span>
      )}
    </>
  )
}

// ---- Main component ----

export function ActivityFeed({
  events,
  live = false,
  groupByDate = false,
  maxVisible,
  showTimestamps,
  timestampFormat,
  onEventClick,
  className,
}: ActivityFeedProps) {
  const [showAll, setShowAll] = useState(false)
  const [prevCount, setPrevCount] = useState(events.length)

  // Track which items are "new" for live animation
  const newIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (live && events.length > prevCount) {
      const newEvents = events.slice(0, events.length - prevCount)
      for (const e of newEvents) newIdsRef.current.add(e.id)
      // Clear "new" flag after animation
      const timeout = setTimeout(() => newIdsRef.current.clear(), 800)
      return () => clearTimeout(timeout)
    }
    setPrevCount(events.length)
  }, [events, live, prevCount])

  // Group by date
  const grouped = useMemo(() => {
    if (!groupByDate) return null
    const groups: { label: string; events: TimelineEventData[] }[] = []
    let currentLabel = ''
    for (const event of events) {
      const label = formatDateGroup(event.timestamp)
      if (label !== currentLabel) {
        currentLabel = label
        groups.push({ label, events: [] })
      }
      groups[groups.length - 1].events.push(event)
    }
    return groups
  }, [events, groupByDate])

  const visibleEvents = useMemo(() => {
    if (!maxVisible || showAll) return events
    return events.slice(0, maxVisible)
  }, [events, maxVisible, showAll])

  const hiddenCount = maxVisible && !showAll ? Math.max(0, events.length - maxVisible) : 0

  return (
    <div className={cn('flex flex-col', className)}>
      {groupByDate && grouped ? (
        <>
          {grouped.map((group) => {
            const visibleInGroup = maxVisible && !showAll
              ? group.events.filter((e) => visibleEvents.includes(e))
              : group.events
            if (visibleInGroup.length === 0) return null
            return (
              <div key={group.label}>
                <DateSeparator label={group.label} />
                <AnimatePresence>
                  {visibleInGroup.map((event) => (
                    <ActivityItem
                      key={event.id}
                      event={event}
                      isNew={live && newIdsRef.current.has(event.id)}
                      showTimestamps={showTimestamps}
                      timestampFormat={timestampFormat}
                      onEventClick={onEventClick}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )
          })}
        </>
      ) : (
        <AnimatePresence>
          {visibleEvents.map((event) => (
            <ActivityItem
              key={event.id}
              event={event}
              isNew={live && newIdsRef.current.has(event.id)}
              showTimestamps={showTimestamps}
              timestampFormat={timestampFormat}
              onEventClick={onEventClick}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Show more button */}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-2 self-start border-l-2 border-l-picks-fg/[0.06] py-2 pl-4 text-xs font-medium text-picks-fg/30 transition-colors hover:text-picks-fg/60 animate-tl-fade-up"
        >
          Show {hiddenCount} more
        </button>
      )}
    </div>
  )
}
