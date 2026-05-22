'use client'

/**
 * <StickerPeel />
 *
 * A sticker that you can grab by its top-right corner and peel back —
 * the corner lifts off the surface as a 3D fold, casts a shadow on
 * the spot where it was, and reveals the surface underneath the
 * peeled triangle. Click + drag to peel; release to snap back (or
 * stay peeled if you drag past the threshold). Pure JS pointer
 * handling, no external deps.
 *
 * How it works:
 *  - The base sticker is one element, rendered flat.
 *  - A clip-path triangle masks the TOP-RIGHT corner of a duplicate
 *    layer ("peeled half"). As the user drags, this layer's
 *    `rotateX` + `rotateY` are driven by the drag delta — the corner
 *    flips back like real paper.
 *  - A shadow layer underneath the peeled half darkens the area the
 *    sticker used to cover.
 *  - The peel "back face" is a slightly darker colour so the back of
 *    the sticker reads differently from the front.
 *
 * State machine is just two numbers: `peelX` and `peelY` (0–1 each),
 * representing how far the corner has been pulled toward the
 * opposite corner. Both fed by a single `pointermove` listener while
 * dragging, lerped per frame for smoothness.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StickerPeelProps {
  children?: React.ReactNode
  /** Hex colour of the sticker face. Default warm yellow. */
  color?: string
  /** Back-of-sticker colour (when peeled). Default a slightly darker tint. */
  backColor?: string
  /** Sticker size in px. Default 220. */
  size?: number
  /**
   * What fraction of the sticker's diagonal must be peeled for the
   * sticker to "stick" peeled when the user releases. Default 0.55.
   */
  stickThreshold?: number
  /** Border-radius of the sticker. Default 24. */
  radius?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StickerPeel({
  children,
  color = '#FDE68A',
  backColor,
  size = 220,
  stickThreshold = 0.55,
  radius = 24,
  className,
}: StickerPeelProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const peelLayerRef = React.useRef<HTMLDivElement>(null)
  const shadowRef = React.useRef<HTMLDivElement>(null)
  // peel.x, peel.y ∈ [0, 1]. (0, 0) = fully attached. (1, 1) = fully peeled.
  const peelRef = React.useRef({ x: 0, y: 0 })
  const targetRef = React.useRef({ x: 0, y: 0 })
  const draggingRef = React.useRef(false)

  // Compute back colour automatically if not provided — slightly
  // darker version of the front colour.
  const computedBack = backColor ?? color

  React.useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const onPointerDown = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      const localX = (e.clientX - r.left) / r.width
      const localY = (e.clientY - r.top) / r.height
      // Only start peeling when grabbed near the TOP-RIGHT corner
      // (the "grab handle"): right half, top half.
      if (localX < 0.55 || localY > 0.45) return
      draggingRef.current = true
      wrap.setPointerCapture?.(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      const r = wrap.getBoundingClientRect()
      const localX = (e.clientX - r.left) / r.width
      const localY = (e.clientY - r.top) / r.height
      // Peel amount: how far the corner has been dragged toward the
      // bottom-left corner. x grows as cursor moves LEFT; y grows as
      // cursor moves DOWN.
      targetRef.current.x = clamp01(1 - localX)
      targetRef.current.y = clamp01(localY)
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!draggingRef.current) return
      draggingRef.current = false
      wrap.releasePointerCapture?.(e.pointerId)
      const diag = Math.hypot(targetRef.current.x, targetRef.current.y) / Math.SQRT2
      if (diag < stickThreshold) {
        // Snap back to attached.
        targetRef.current.x = 0
        targetRef.current.y = 0
      } else {
        // Stick fully peeled.
        targetRef.current.x = 1
        targetRef.current.y = 1
      }
    }
    wrap.addEventListener('pointerdown', onPointerDown)
    wrap.addEventListener('pointermove', onPointerMove)
    wrap.addEventListener('pointerup', onPointerUp)
    wrap.addEventListener('pointercancel', onPointerUp)

    let raf = 0
    const tick = () => {
      // Lerp current toward target.
      peelRef.current.x += (targetRef.current.x - peelRef.current.x) * 0.18
      peelRef.current.y += (targetRef.current.y - peelRef.current.y) * 0.18
      const px = peelRef.current.x
      const py = peelRef.current.y

      // Rotation amount: full peel = ~150° fold (corner flipped back).
      const rotY = px * 130
      const rotX = -py * 130
      if (peelLayerRef.current) {
        // The peel-layer's transform-origin is the diagonal opposite
        // corner (bottom-left of the triangle) so the rotation reads
        // like a fold from the top-right inward.
        peelLayerRef.current.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`
      }
      // Cast shadow grows + shifts with peel amount.
      if (shadowRef.current) {
        const amount = Math.hypot(px, py) / Math.SQRT2
        shadowRef.current.style.opacity = String(amount * 0.7)
        shadowRef.current.style.transform = `translate(${px * -8}px, ${py * 8}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener('pointerdown', onPointerDown)
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerup', onPointerUp)
      wrap.removeEventListener('pointercancel', onPointerUp)
    }
  }, [stickThreshold])

  // Build the clip-path for the peeled triangle: a right-triangle
  // with hypotenuse from top-left to bottom-right. (We cut the
  // top-right corner off — that's the peel-able area.)
  const PEEL_CLIP = 'polygon(0 0, 100% 0, 100% 100%)'

  return (
    <div
      ref={wrapRef}
      className={cn('relative select-none touch-none', className)}
      style={{
        width: size,
        height: size,
        perspective: '900px',
      }}
    >
      {/* Shadow cast on the "surface" — visible under the peeled corner */}
      <div
        ref={shadowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 70% 30%, rgba(0,0,0,0.55) 0%, transparent 60%)',
          opacity: 0,
          willChange: 'opacity, transform',
        }}
      />

      {/* Base sticker — the part that STAYS attached */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: radius,
          background: color,
          // Subtle inner ring + outer drop shadow to seat the sticker.
          boxShadow:
            '0 12px 28px -10px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(0,0,0,0.05)',
        }}
      >
        <StickerContent>{children}</StickerContent>
      </div>

      {/* PEELABLE half — clipped to the top-right triangle, sits on top
          of the base, transforms with the drag.
          - Front face: same as the base (with same content).
          - Back face: backColor, content rotated/mirrored. */}
      <div
        ref={peelLayerRef}
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          // The fold pivots around the bottom-left corner of the
          // triangle (i.e. the hypotenuse line from (0,0) to (100,100)).
          // Setting transform-origin to that diagonal gives a natural
          // paper-fold pivot.
          transformOrigin: 'top left',
          willChange: 'transform',
          clipPath: PEEL_CLIP,
          WebkitClipPath: PEEL_CLIP,
        }}
      >
        {/* Front of the peel triangle */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: radius,
            background: color,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          <StickerContent>{children}</StickerContent>
        </div>
        {/* Back of the peel triangle */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: radius,
            background: computedBack,
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Slight texture so the back doesn't look identical to front.
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 6px)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
          }}
        />
      </div>

      {/* Tiny "grab" hint at top-right */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/30 text-[9px] font-bold uppercase tracking-wider text-white/80"
      >
        ↖
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Content holder so front + back faces stay in sync
// ---------------------------------------------------------------------------

function StickerContent({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-black">
      {children}
    </div>
  )
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}
