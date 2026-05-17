'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import { type TimelineEventData, TimelineEventCard } from './timeline-event'
import { TimelineDot } from './timeline-dot'

interface CenteredTimelineProps {
  events: TimelineEventData[]
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onEventClick?: (event: TimelineEventData) => void
  className?: string
}

function CenteredItem({
  event,
  index,
  isActive,
  showTimestamps,
  timestampFormat,
  onEventClick,
}: {
  event: TimelineEventData
  index: number
  isActive: boolean
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onEventClick?: (event: TimelineEventData) => void
}) {
  return (
    <div
      className="flex w-[280px] shrink-0 snap-center flex-col items-center gap-3 animate-tl-scale-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Dot */}
      <motion.div
        animate={isActive ? { scale: 1.15 } : { scale: 1 }}
        transition={springSnappy}
      >
        <TimelineDot
          status={event.status}
          icon={event.icon}
          iconBackground={event.iconBackground}
          color={event.color}
        />
      </motion.div>

      {/* Card */}
      <motion.div
        animate={
          isActive
            ? { scale: 1.03, boxShadow: '0 0 24px rgba(255,255,255,0.06)' }
            : { scale: 1, boxShadow: '0 0 0px rgba(255,255,255,0)' }
        }
        transition={springSnappy}
        className="w-full rounded-xl"
      >
        <TimelineEventCard
          event={event}
          showTimestamp={showTimestamps}
          timestampFormat={timestampFormat}
          onClick={onEventClick}
        />
      </motion.div>
    </div>
  )
}

export function CenteredTimeline({
  events,
  showTimestamps,
  timestampFormat,
  onEventClick,
  className,
}: CenteredTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // First 'current' event, fallback to index 0
  const activeIndex = events.findIndex((e) => e.status === 'current')

  return (
    <div className={cn('relative', className)}>
      {/* Horizontal connector */}
      <div className="absolute left-0 right-0 top-3 z-0 h-0.5 bg-white/[0.06]" />

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="relative z-[1] flex gap-6 overflow-x-auto pb-4 pt-0 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {events.map((event, i) => (
          <CenteredItem
            key={event.id}
            event={event}
            index={i}
            isActive={i === activeIndex}
            showTimestamps={showTimestamps}
            timestampFormat={timestampFormat}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  )
}
