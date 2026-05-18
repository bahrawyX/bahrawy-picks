'use client'

import { useEffect, useRef } from 'react'
import {
  useMotionValue,
  useSpring,
  useInView,
  useTransform,
  motion,
} from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CountUpProps {
  to: number
  from?: number
  duration?: number
  delay?: number
  decimals?: number
  separator?: string
  prefix?: string
  suffix?: string
  onComplete?: () => void
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CountUp({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  separator = ',',
  prefix = '',
  suffix = '',
  onComplete,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    mass: 1,
    duration: duration * 1000,
  })
  const isInView = useInView(ref, { once: true, margin: '0px' })
  const hasAnimated = useRef(false)

  // Format the spring value as display text
  const displayValue = useTransform(springValue, (latest) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(latest)

    // Replace default comma with custom separator
    const withSeparator =
      separator !== ',' ? formatted.replace(/,/g, separator) : formatted

    return `${prefix}${withSeparator}${suffix}`
  })

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      const timer = setTimeout(() => {
        motionValue.set(to)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, motionValue, to, delay])

  // onComplete when spring settles
  useEffect(() => {
    if (!onComplete) return
    const unsub = springValue.on('change', (v) => {
      if (Math.abs(v - to) < 0.01 * Math.pow(10, -decimals)) {
        onComplete()
      }
    })
    return unsub
  }, [springValue, to, decimals, onComplete])

  return (
    <motion.span ref={ref} className={cn('tabular-nums', className)}>
      {displayValue}
    </motion.span>
  )
}
