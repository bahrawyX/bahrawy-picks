'use client'

/**
 * <Timeline />
 *
 * Four distinct visual variants — default (vertical), alternating (left-right),
 * centered (horizontal scroll), and activity (compact feed). Scroll-driven
 * connector line animation, per-event status dots with pulse rings, expandable
 * content, and live feed support.
 */

import { cn } from '@/lib/utils'
import { type TimelineEventData } from './timeline-event'
import { DefaultTimeline } from './default-timeline'
import { AlternatingTimeline } from './alternating-timeline'
import { CenteredTimeline } from './centered-timeline'
import { ActivityFeed } from './activity-feed'

export type { TimelineEventData }
export type TimelineVariant = 'default' | 'alternating' | 'centered' | 'activity'

export interface TimelineProps {
  events: TimelineEventData[]
  variant?: TimelineVariant
  // activity variant
  live?: boolean
  groupByDate?: boolean
  maxVisible?: number
  // display
  showTimestamps?: boolean
  timestampFormat?: 'relative' | 'absolute' | 'both'
  // interaction
  onEventClick?: (event: TimelineEventData) => void
  // style
  className?: string
}

export function Timeline({
  events,
  variant = 'default',
  live,
  groupByDate,
  maxVisible,
  showTimestamps = true,
  timestampFormat = 'relative',
  onEventClick,
  className,
}: TimelineProps) {
  const shared = {
    events,
    showTimestamps,
    timestampFormat,
    onEventClick,
  }

  return (
    <div className={cn(className)}>
      {variant === 'default' && <DefaultTimeline {...shared} />}
      {variant === 'alternating' && <AlternatingTimeline {...shared} />}
      {variant === 'centered' && <CenteredTimeline {...shared} />}
      {variant === 'activity' && (
        <ActivityFeed
          {...shared}
          live={live}
          groupByDate={groupByDate}
          maxVisible={maxVisible}
        />
      )}
    </div>
  )
}
