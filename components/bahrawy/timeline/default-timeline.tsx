'use client'

import { cn } from '@/lib/utils'
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
  return (
    <div className="relative flex gap-4">
      {/* Left column — dot + connector */}
      <div className="flex flex-col items-center">
        <TimelineDot
          status={event.status}
          icon={event.icon}
          iconBackground={event.iconBackground}
          color={event.color}
          delay={index * 0.08 + 0.15}
        />
        {!isLast && (
          <div className="flex-1 py-2">
            <TimelineConnector color={event.color} delay={index * 0.08} />
          </div>
        )}
      </div>

      {/* Right column — event card */}
      <div
        className="flex-1 pb-8 animate-slide-in-right"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <TimelineEventCard
          event={event}
          showTimestamp={showTimestamps}
          timestampFormat={timestampFormat}
          onClick={onEventClick}
        />
      </div>
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
