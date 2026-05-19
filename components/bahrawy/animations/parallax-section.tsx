'use client'

/**
 * <ParallaxSection />
 *
 * Elements move at different speeds on scroll, creating a depth effect.
 * A negative speed (default) moves the element against the scroll direction,
 * producing the classic parallax look.
 *
 * @param children  - Content to render inside the parallax container.
 * @param speed     - Parallax intensity. Negative = moves up on scroll. Default -0.3.
 * @param className - Additional classes.
 */

import * as React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ParallaxSectionProps {
  /** Content to render inside the parallax container. */
  children: React.ReactNode
  /** Parallax intensity. Negative = moves up on scroll. */
  speed?: number
  /** Additional classes. */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ParallaxSection({
  children,
  speed = -0.3,
  className,
}: ParallaxSectionProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [speed * 100, -speed * 100],
  )

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
