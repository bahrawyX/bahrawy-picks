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
        // Hairline rail — 1px line, no gradient. Matches the refined dot border.
        isVertical ? 'h-full w-px' : 'h-px w-full',
        'overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'h-full w-full',
          color ?? 'bg-picks-fg/[0.06]',
          isVertical ? 'origin-top animate-tl-grow-y' : 'origin-left animate-tl-grow-y'
        )}
        style={{ animationDelay: `${Math.round(delay * 1000)}ms` }}
      />
    </div>
  )
}
