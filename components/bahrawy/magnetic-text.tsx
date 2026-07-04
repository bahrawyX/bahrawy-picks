'use client'

/**
 * <MagneticText />
 *
 * Every character of the text has a magnetic pull toward the cursor.
 * Within `radius` px the character is yanked along the cursor vector
 * with strength `(1 − dist/radius) × strength`. Lerped per-frame for a
 * spring-like feel.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface MagneticTextProps {
  children: string
  /** Max pull in px at the cursor centre. Default 18. */
  strength?: number
  /** Pull radius in px. Default 120. */
  radius?: number
  /** Lerp factor 0–1. Higher = snappier. Default 0.2. */
  lerp?: number
  /** Attract toward cursor (default) or repel away from it. */
  mode?: 'attract' | 'repel'
  className?: string
}

export function MagneticText({
  children,
  strength = 18,
  radius = 120,
  lerp = 0.2,
  mode = 'attract',
  className,
}: MagneticTextProps) {
  const containerRef = React.useRef<HTMLSpanElement>(null)
  const charRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const mouseRef = React.useRef({ x: -9999, y: -9999, active: false })
  const chars = React.useMemo(() => [...children], [children])
  const sign = mode === 'repel' ? -1 : 1
  // Reduced motion: no magnetic displacement — never start the RAF loop.
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    if (reduced) {
      // Clear any displacement left over from before the preference flipped.
      for (const el of charRefs.current) {
        if (el) el.style.transform = ''
      }
      return
    }

    const container = containerRef.current
    if (!container) return

    const onMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }
    const onLeave = () => {
      mouseRef.current.active = false
    }
    const states = chars.map(() => ({ x: 0, y: 0 }))

    // Cached resting char centers — measured once per pointer-session /
    // resize / scroll (coalesced to at most one measure pass per frame)
    // instead of one getBoundingClientRect per char per frame.
    const centers = chars.map(() => ({ x: 0, y: 0 }))
    let dirty = true
    const invalidate = () => {
      dirty = true
    }
    const measure = () => {
      for (let i = 0; i < charRefs.current.length; i++) {
        const el = charRefs.current[i]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // Subtract the current displacement so the cached value is the
        // char's resting center.
        centers[i].x = rect.left + rect.width / 2 - states[i].x
        centers[i].y = rect.top + rect.height / 2 - states[i].y
      }
      dirty = false
    }

    window.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    container.addEventListener('pointerenter', invalidate)
    window.addEventListener('resize', invalidate)
    window.addEventListener('scroll', invalidate, { passive: true, capture: true })

    let raf = 0
    const r2 = radius * radius

    const tick = () => {
      if (dirty) measure()
      const { x: mx, y: my, active } = mouseRef.current
      for (let i = 0; i < charRefs.current.length; i++) {
        const el = charRefs.current[i]
        if (!el) continue
        // Current center = resting center + the transform we last wrote.
        const cx = centers[i].x + states[i].x
        const cy = centers[i].y + states[i].y
        const dx = mx - cx
        const dy = my - cy
        const dsq = dx * dx + dy * dy
        let tx = 0
        let ty = 0
        if (active && dsq < r2) {
          const d = Math.sqrt(dsq)
          const k = 1 - d / radius
          const dn = Math.max(0.0001, d)
          tx = (dx / dn) * k * strength * sign
          ty = (dy / dn) * k * strength * sign
        }
        states[i].x += (tx - states[i].x) * lerp
        states[i].y += (ty - states[i].y) * lerp
        el.style.transform = `translate(${states[i].x}px, ${states[i].y}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
      container.removeEventListener('pointerenter', invalidate)
      window.removeEventListener('resize', invalidate)
      window.removeEventListener('scroll', invalidate, true)
    }
  }, [reduced, chars.length, radius, strength, lerp, sign])

  return (
    <span
      ref={containerRef}
      className={cn('inline-flex select-none', className)}
      aria-label={children}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          ref={(el) => {
            charRefs.current[i] = el
          }}
          className="inline-block whitespace-pre"
          style={{ willChange: 'transform' }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}
