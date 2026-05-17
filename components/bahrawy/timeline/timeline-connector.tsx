'use client'

import { cn } from '@/lib/utils'

interface TimelineConnectorProps {
  color?: string
  orientation?: 'vertical' | 'horizontal'
  delay?: number
  className?: string
}

export function TimelineConnector({
  color,
  orientation = 'vertical',
  delay = 0,
  className,
}: TimelineConnectorProps) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={cn(
        isVertical ? 'h-full w-0.5' : 'h-0.5 w-full',
        'overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'h-full w-full',
          color ?? 'bg-white/[0.08]',
          isVertical ? 'origin-top animate-tl-grow-y' : 'origin-left animate-tl-grow-y'
        )}
        style={{ animationDelay: `${Math.round(delay * 1000)}ms` }}
      />
    </div>
  )
}
