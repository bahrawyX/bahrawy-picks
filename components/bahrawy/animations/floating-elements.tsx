'use client'

/**
 * <FloatingElements />
 *
 * Renders a set of elements that float and drift in random directions.
 * Ideal for hero section backgrounds or decorative particle fields.
 *
 * @param count          - Number of floating items. Default 20.
 * @param children       - Custom element to render instead of default circles.
 * @param size           - Fixed size or [min, max] range in px. Default 8.
 * @param speed          - Speed multiplier. Default 1.
 * @param opacity        - Fixed opacity or [min, max] range. Default [0.1, 0.4].
 * @param color          - CSS color for default circles. Default "white".
 * @param mouseRepel     - Enable mouse repel effect. Default false.
 * @param repelStrength  - Repel distance multiplier. Default 0.3.
 * @param className      - Additional classes for the container.
 */

import * as React from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  type MotionStyle,
} from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FloatingItem {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  driftX: number[]
  driftY: number[]
  driftDuration: number
}

export interface FloatingElementsProps {
  /** Number of floating items. */
  count?: number
  /** Custom element to render instead of default circles. */
  children?: React.ReactNode
  /** Fixed size or [min, max] range in px. */
  size?: number | [number, number]
  /** Speed multiplier. */
  speed?: number
  /** Fixed opacity or [min, max] range. */
  opacity?: number | [number, number]
  /** CSS color for default circles. */
  color?: string
  /** Enable mouse repel effect. */
  mouseRepel?: boolean
  /** Repel distance multiplier. */
  repelStrength?: number
  /** Additional classes for the container. */
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveRange(value: number | [number, number], rand: number): number {
  if (Array.isArray(value)) {
    const [min, max] = value
    return min + rand * (max - min)
  }
  return value
}

/** Deterministic-ish pseudo-random from a seed. Good enough for layout. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function generateItems(
  count: number,
  size: number | [number, number],
  opacity: number | [number, number],
  speed: number,
): FloatingItem[] {
  const items: FloatingItem[] = []

  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i + 1)
    const r2 = seededRandom(i + 100)
    const r3 = seededRandom(i + 200)
    const r4 = seededRandom(i + 300)
    const r5 = seededRandom(i + 400)
    const r6 = seededRandom(i + 500)
    const r7 = seededRandom(i + 600)

    const offsetRange = 20 + r5 * 40 // 20-60px drift range
    const driftX = [0, offsetRange * (r6 > 0.5 ? 1 : -1), -offsetRange * (r6 > 0.5 ? 1 : -1), 0]
    const driftY = [0, -offsetRange * (r7 > 0.5 ? 1 : -1), offsetRange * (r7 > 0.5 ? 1 : -1), 0]

    items.push({
      id: i,
      x: r1 * 100,
      y: r2 * 100,
      size: resolveRange(size, r3),
      opacity: resolveRange(opacity, r4),
      delay: r5 * 5,
      driftX,
      driftY,
      driftDuration: 5 / speed + r6 * 3,
    })
  }

  return items
}

// ---------------------------------------------------------------------------
// Floating Item Component
// ---------------------------------------------------------------------------

interface FloatingItemRendererProps {
  item: FloatingItem
  color: string
  customChild: React.ReactNode | undefined
  mouseRepel: boolean
  repelStrength: number
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  containerRef: React.RefObject<HTMLDivElement | null>
}

function FloatingItemRenderer({
  item,
  color,
  customChild,
  mouseRepel,
  repelStrength,
  mouseX,
  mouseY,
  containerRef,
}: FloatingItemRendererProps) {
  const repelX = useMotionValue(0)
  const repelY = useMotionValue(0)
  const springX = useSpring(repelX, { stiffness: 100, damping: 20 })
  const springY = useSpring(repelY, { stiffness: 100, damping: 20 })

  React.useEffect(() => {
    if (!mouseRepel) return

    const unsubX = mouseX.on('change', () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const mx = mouseX.get()
      const my = mouseY.get()

      // Element center in px
      const elX = (item.x / 100) * rect.width
      const elY = (item.y / 100) * rect.height

      const dx = elX - mx
      const dy = elY - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      const repelRadius = repelStrength * 200

      if (dist < repelRadius && dist > 0) {
        const force = (1 - dist / repelRadius) * repelRadius * 0.5
        repelX.set((dx / dist) * force)
        repelY.set((dy / dist) * force)
      } else {
        repelX.set(0)
        repelY.set(0)
      }
    })

    return unsubX
  }, [mouseRepel, mouseX, mouseY, repelX, repelY, item.x, item.y, repelStrength, containerRef])

  const style: MotionStyle = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: item.size,
    height: item.size,
    opacity: item.opacity,
    ...(mouseRepel ? { x: springX, y: springY } : {}),
  }

  return (
    <motion.div
      style={style}
      animate={{
        x: item.driftX,
        y: item.driftY,
      }}
      transition={{
        duration: item.driftDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: item.delay,
      }}
    >
      {customChild ?? (
        <div
          className="h-full w-full rounded-full"
          style={{
            backgroundColor: color === 'white'
              ? 'rgba(255, 255, 255, 0.2)'
              : color,
          }}
        />
      )}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FloatingElements({
  count = 20,
  children,
  size = 8,
  speed = 1,
  opacity = [0.1, 0.4],
  color = 'white',
  mouseRepel = false,
  repelStrength = 0.3,
  className,
}: FloatingElementsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)

  const items = React.useMemo(
    () => generateItems(count, size, opacity, speed),
    [count, size, opacity, speed],
  )

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY],
  )

  const handleMouseLeave = React.useCallback(() => {
    mouseX.set(-9999)
    mouseY.set(-9999)
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={mouseRepel ? handleMouseMove : undefined}
      onMouseLeave={mouseRepel ? handleMouseLeave : undefined}
    >
      {items.map((item) => (
        <FloatingItemRenderer
          key={item.id}
          item={item}
          color={color}
          customChild={children}
          mouseRepel={mouseRepel}
          repelStrength={repelStrength}
          mouseX={mouseX}
          mouseY={mouseY}
          containerRef={containerRef}
        />
      ))}
    </div>
  )
}
