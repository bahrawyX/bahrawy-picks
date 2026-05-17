'use client'

/**
 * <MagneticCursor />
 *
 * Wraps any child element and makes it magnetically attract toward the
 * cursor when hovering nearby. Uses Framer Motion spring physics for
 * smooth, elastic snapping.
 *
 * @param children   — The element to apply the magnetic effect to.
 * @param strength   — Multiplier for how far the element moves toward the cursor (0–1). Default 0.35.
 * @param radius     — Hover activation radius in pixels. Default 150.
 * @param spring     — Framer Motion spring config for the attraction animation.
 * @param disabled   — Disable the magnetic effect entirely.
 * @param className  — Additional classes for the wrapper.
 */

import * as React from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MagneticCursorProps {
  children: React.ReactNode
  /** How strongly the element follows the cursor (0 = none, 1 = follows exactly). */
  strength?: number
  /** Activation radius in pixels from element center. */
  radius?: number
  /** Framer Motion spring transition override. */
  spring?: { stiffness?: number; damping?: number; mass?: number }
  /** Disable the magnetic effect. */
  disabled?: boolean
  /** Additional classes for the wrapper `<div>`. */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MagneticCursor({
  children,
  strength = 0.35,
  radius = 150,
  spring,
  disabled = false,
  className,
}: MagneticCursorProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = {
    stiffness: spring?.stiffness ?? springSnappy.stiffness,
    damping: spring?.damping ?? springSnappy.damping,
    mass: spring?.mass ?? springSnappy.mass,
  }

  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.sqrt(distX * distX + distY * distY)

      if (distance < radius) {
        x.set(distX * strength)
        y.set(distY * strength)
      }
    },
    [disabled, radius, strength, x, y]
  )

  const handleMouseLeave = React.useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}
