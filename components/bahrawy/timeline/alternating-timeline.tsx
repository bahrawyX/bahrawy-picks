'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springGentle } from '@/lib/motion'
import { type TimelineEventData, TimelineEventCard } from './timeline-event'
import { TimelineDot } from './timeline-dot'
import { TimelineConnector } from './timeline-connector'

interface AlternatingTimelineProps {
  events: TimelineEventData[]
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onEventClick?: (event: TimelineEventData) => void
  className?: string
}

function AlternatingRow({
  event,
  index,
  isLast,
  showTimestamps,
  timestampFormat,
  onEventClick,
}: {
  event: TimelineEventData
  index: number
  isLast: boolean
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  onEventClick?: (event: TimelineEventData) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_auto_1fr] gap-4">
      {/* Left cell */}
      <div className={cn('flex', isLeft ? 'justify-end' : '')}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={springGentle}
            className="w-full max-w-sm pb-8"
          >
            <TimelineEventCard
              event={event}
              showTimestamp={showTimestamps}
              timestampFormat={timestampFormat}
              onClick={onEventClick}
            />
          </motion.div>
        )}
      </div>

      {/* Center — dot + connector */}
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

      {/* Right cell */}
      <div className={cn('flex', !isLeft ? 'justify-start' : '')}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={springGentle}
            className="w-full max-w-sm pb-8"
          >
            <TimelineEventCard
              event={event}
              showTimestamp={showTimestamps}
              timestampFormat={timestampFormat}
              onClick={onEventClick}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function AlternatingTimeline({
  events,
  showTimestamps,
  timestampFormat,
  onEventClick,
  className,
}: AlternatingTimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {events.map((event, i) => (
        <AlternatingRow
          key={event.id}
          event={event}
          index={i}
          isLast={i === events.length - 1}
          showTimestamps={showTimestamps}
          timestampFormat={timestampFormat}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  )
}
