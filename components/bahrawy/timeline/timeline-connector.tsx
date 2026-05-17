'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springGentle } from '@/lib/motion'

interface TimelineConnectorProps {
  color?: string
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export function TimelineConnector({
  color,
  orientation = 'vertical',
  className,
}: TimelineConnectorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const isVertical = orientation === 'vertical'

  return (
    <div
      ref={ref}
      className={cn(
        isVertical ? 'h-full w-0.5' : 'h-0.5 w-full',
        'overflow-hidden',
        className
      )}
    >
      <motion.div
        className={cn('h-full w-full', color ?? 'bg-white/[0.08]')}
        initial={isVertical ? { scaleY: 0 } : { scaleX: 0 }}
        animate={
          isInView
            ? isVertical
              ? { scaleY: 1 }
              : { scaleX: 1 }
            : undefined
        }
        style={{ transformOrigin: isVertical ? 'top' : 'left' }}
        transition={springGentle}
      />
    </div>
  )
}
