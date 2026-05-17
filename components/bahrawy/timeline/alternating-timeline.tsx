'use client'

import { cn } from '@/lib/utils'
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
  const isLeft = index % 2 === 0

  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] gap-4">
      {/* Left cell */}
      <div className={cn('flex', isLeft ? 'justify-end' : '')}>
        {isLeft && (
          <div
            className="w-full max-w-sm pb-8 animate-slide-in-left"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <TimelineEventCard
              event={event}
              showTimestamp={showTimestamps}
              timestampFormat={timestampFormat}
              onClick={onEventClick}
            />
          </div>
        )}
      </div>

      {/* Center — dot + connector */}
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

      {/* Right cell */}
      <div className={cn('flex', !isLeft ? 'justify-start' : '')}>
        {!isLeft && (
          <div
            className="w-full max-w-sm pb-8 animate-slide-in-right"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <TimelineEventCard
              event={event}
              showTimestamp={showTimestamps}
              timestampFormat={timestampFormat}
              onClick={onEventClick}
            />
          </div>
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
