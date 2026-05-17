'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springGentle } from '@/lib/motion'
import { type TimelineEventData, TimelineEventCard } from './timeline-event'
import { TimelineDot } from './timeline-dot'
import { TimelineConnector } from './timeline-connector'

interface DefaultTimelineProps {
  events: TimelineEventData[]
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onEventClick?: (event: TimelineEventData) => void
  className?: string
}

function EventRow({
  event,
  isLast,
  showTimestamps,
  timestampFormat,
  onEventClick,
}: {
  event: TimelineEventData
  isLast: boolean
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onEventClick?: (event: TimelineEventData) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="relative flex gap-4">
      {/* Left column — dot + connector */}
      <div className="flex flex-col items-center">
        <TimelineDot
          status={event.status}
          icon={event.icon}
          iconBackground={event.iconBackground}
          color={event.color}
          delay={0.15}
        />
        {!isLast && (
          <div className="flex-1 py-2">
            <TimelineConnector color={event.color} />
          </div>
        )}
      </div>

      {/* Right column — event card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        transition={springGentle}
        className="flex-1 pb-8"
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

export function DefaultTimeline({
  events,
  showTimestamps,
  timestampFormat,
  onEventClick,
  className,
}: DefaultTimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {events.map((event, i) => (
        <EventRow
          key={event.id}
          event={event}
          isLast={i === events.length - 1}
          showTimestamps={showTimestamps}
          timestampFormat={timestampFormat}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  )
}
