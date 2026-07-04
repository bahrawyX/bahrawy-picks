'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScrollProgressPosition = 'top' | 'bottom' | 'left' | 'right'

export interface ScrollProgressProps {
  position?: ScrollProgressPosition
  color?: string
  height?: number
  showPercentage?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScrollProgress({
  position = 'top',
  color = 'bg-white',
  height = 3,
  showPercentage = false,
  className,
}: ScrollProgressProps) {
  const progress = useMotionValue(0)
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30, mass: 0.5 })
  const reduced = usePrefersReducedMotion()
  // Reduced motion: keep the (scroll-linked, user-driven) bar but drop the
  // spring smoothing so it tracks the scroll position directly.
  const barProgress = reduced ? progress : smoothProgress
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      const p = scrollHeight > 0 ? scrollTop / scrollHeight : 0
      progress.set(p)
      if (showPercentage) setPercent(Math.round(p * 100))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [progress, showPercentage])

  const isHorizontal = position === 'top' || position === 'bottom'

  return (
    <>
      <motion.div
        data-testid="scroll-progress"
        aria-hidden="true"
        className={cn(
          'fixed z-50',
          position === 'top' && 'left-0 right-0 top-0',
          position === 'bottom' && 'bottom-0 left-0 right-0',
          position === 'left' && 'bottom-0 left-0 top-0',
          position === 'right' && 'bottom-0 right-0 top-0',
          className,
        )}
        style={
          isHorizontal
            ? { height }
            : { width: height }
        }
      >
        <motion.div
          className={cn('rounded-full', color)}
          style={
            isHorizontal
              ? {
                  height: '100%',
                  scaleX: barProgress,
                  transformOrigin: position === 'top' || position === 'bottom' ? 'left' : 'right',
                }
              : {
                  width: '100%',
                  height: '100%',
                  scaleY: barProgress,
                  transformOrigin: position === 'left' ? 'bottom' : 'top',
                }
          }
        />
      </motion.div>

      {showPercentage && (
        <div
          className={cn(
            'fixed z-50 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm',
            position === 'top' && 'right-4 top-4',
            position === 'bottom' && 'bottom-4 right-4',
            position === 'left' && 'bottom-4 left-4',
            position === 'right' && 'bottom-4 right-4',
          )}
          style={{ width: 40, height: 40 }}
        >
          <span className="text-xs font-medium text-white">{percent}%</span>
        </div>
      )}
    </>
  )
}
