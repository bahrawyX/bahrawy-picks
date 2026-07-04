'use client'

/**
 * <DepthCards />
 *
 * A 3D diorama. A stack of cards is laid out at different Z depths
 * inside a `perspective` container; moving your cursor over the
 * scene tilts the camera so the cards parallax against each other.
 * Look-around at depth, no scroll required.
 *
 * Each card declares its own `depth` (0 = front, larger = further
 * back). The component spaces them along the Z axis automatically
 * and scales the back cards slightly smaller so the perspective
 * reads correctly even on flat-ish viewports. Tilt is spring-eased
 * so the diorama settles when you stop moving.
 *
 * Notes:
 *  - All tilt math runs in one RAF loop. We never call setState
 *    inside the loop — we write transforms directly to the refs.
 *  - The `transform-style: preserve-3d` chain is intentional. The
 *    outer wrapper has perspective; the inner pivot has preserve-3d
 *    so each card's `translateZ` actually does something.
 *  - Floating hover-glow on each card is a sibling `<div>` with the
 *    card's accent color and a radial gradient that fades the
 *    deeper cards into the background.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import { useOnScreen } from '@/lib/use-on-screen'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DepthCardItem {
  /** Required id (used for React keys). */
  id: string
  /** Depth layer — 0 is the closest, larger numbers sit further back. */
  depth: number
  /** Optional eyebrow above the title. */
  eyebrow?: React.ReactNode
  /** Card title. */
  title: React.ReactNode
  /** Card body / subtitle. */
  body?: React.ReactNode
  /** Optional image rendered behind the text. */
  image?: string
  /** Accent color used for the glow + dot. Default '#A78BFA'. */
  accent?: string
  /** Horizontal anchor as % of container width. Default 50. */
  x?: number
  /** Vertical anchor as % of container height. Default 50. */
  y?: number
  /** Width in % of container. Default 36. */
  width?: number
}

export interface DepthCardsProps {
  /** Cards rendered into the diorama. */
  items: DepthCardItem[]
  /** Strength of the camera tilt in degrees at the corner. Default 8. */
  tiltStrength?: number
  /** Spacing along Z between adjacent depth layers, in px. Default 240. */
  zSpacing?: number
  /** Perspective distance in px. Default 1400. */
  perspective?: number
  /** Lerp factor for the tilt smoothing. Default 0.06 (slower = softer). */
  lerp?: number
  /** Max background blur in px applied to the deepest card. Default 3. */
  depthBlur?: number
  /** Aspect ratio for the diorama canvas. Default '16 / 9'. */
  aspect?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DepthCards({
  items,
  tiltStrength = 8,
  zSpacing = 240,
  perspective = 1400,
  lerp = 0.06,
  depthBlur = 3,
  aspect = '16 / 9',
  className,
}: DepthCardsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const pivotRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])

  // Tilt state — target updated by pointer events, current eased toward.
  const stateRef = React.useRef({
    targetX: 0,
    targetY: 0,
    curX: 0,
    curY: 0,
    active: false,
  })

  const reduced = usePrefersReducedMotion()
  const onScreen = useOnScreen(containerRef)

  React.useEffect(() => {
    const container = containerRef.current
    const pivot = pivotRef.current
    if (!container || !pivot) return

    // Reduced motion: no tilt RAF — lay the cards out at their static
    // depth positions once and skip pointer tracking entirely.
    if (reduced) {
      pivot.style.transform = 'rotateX(0deg) rotateY(0deg)'
      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        const depth = Number(el.dataset.depth ?? 0)
        const z = -depth * zSpacing
        const scale = 1 - depth * 0.045
        el.style.transform = `translate3d(0px, 0px, ${z}px) scale(${scale})`
      }
      return
    }

    // Offscreen or hidden tab: hold the current pose — no listeners, no RAF.
    if (!onScreen) return

    const onPointerMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect()
      // Normalise to [-1, 1].
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1
      stateRef.current.targetX = nx
      stateRef.current.targetY = ny
      stateRef.current.active = true
    }
    const onPointerLeave = () => {
      stateRef.current.targetX = 0
      stateRef.current.targetY = 0
      stateRef.current.active = false
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)

    let raf = 0
    const tick = () => {
      const s = stateRef.current
      s.curX += (s.targetX - s.curX) * lerp
      s.curY += (s.targetY - s.curY) * lerp

      const rotY = s.curX * tiltStrength // tilt around Y based on X
      const rotX = -s.curY * tiltStrength * 0.65
      pivot.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`

      // Subtle counter-parallax on each card: deeper cards drift more
      // with the cursor than the front. Reinforces the 3D illusion.
      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        const depth = Number(el.dataset.depth ?? 0)
        const tx = s.curX * depth * 9
        const ty = s.curY * depth * 7
        const z = -depth * zSpacing
        const scale = 1 - depth * 0.045
        el.style.transform = `translate3d(${tx}px, ${ty}px, ${z}px) scale(${scale})`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [tiltStrength, zSpacing, lerp, reduced, onScreen])

  // Sort items so the deepest are painted first; front cards land on top
  // and aren't fighting deeper cards for z-index (though preserve-3d
  // mostly handles this, painting order is a nice safety net).
  const ordered = React.useMemo(
    () => [...items].sort((a, b) => b.depth - a.depth),
    [items],
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#06070a]',
        className,
      )}
      style={{
        aspectRatio: aspect,
        perspective: `${perspective}px`,
      }}
    >
      {/* Soft background mood */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%), radial-gradient(120% 90% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 60%)',
        }}
      />

      {/* The 3D pivot that gets rotated by the cursor. */}
      <div
        ref={pivotRef}
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          willChange: 'transform',
        }}
      >
        {ordered.map((item, idx) => {
          const w = item.width ?? 36
          const x = item.x ?? 50
          const y = item.y ?? 50
          const accent = item.accent ?? '#A78BFA'
          return (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[idx] = el
              }}
              data-depth={item.depth}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                marginLeft: `-${w / 2}%`,
                // Compensating margin so card centre sits at (x, y).
                marginTop: `-12%`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {/* Glow halo behind the card — falls off with depth. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 rounded-3xl"
                style={{
                  background: `radial-gradient(closest-side, ${accent}38 0%, transparent 72%)`,
                  filter: 'blur(28px)',
                  opacity: Math.max(0.18, 1 - item.depth * 0.22),
                }}
              />
              <div
                className="relative overflow-hidden rounded-2xl border bg-zinc-950/85 p-5 shadow-2xl backdrop-blur-md sm:p-6"
                style={{
                  borderColor: `${accent}38`,
                  boxShadow: `0 40px 80px -28px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04), 0 0 30px ${accent}26`,
                  // Deeper cards pick up a subtle haze — feels atmospheric.
                  filter:
                    item.depth > 0
                      ? `blur(${Math.min(depthBlur, item.depth * 0.7)}px)`
                      : undefined,
                }}
              >
                {/* Top highlight line — a 1px accent gradient that
                    catches the eye as the camera tilts. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${accent}aa, transparent)`,
                  }}
                />
                {/* Soft inner gradient — adds depth without an image. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(120% 80% at 10% 0%, ${accent}1a 0%, transparent 60%)`,
                  }}
                />
                {item.image && (
                  <>
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover opacity-50"
                      draggable={false}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)',
                      }}
                    />
                  </>
                )}
                <div className="relative">
                  {item.eyebrow && (
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/80">
                      <span
                        aria-hidden
                        className="block h-1.5 w-1.5 rounded-full"
                        style={{
                          background: accent,
                          boxShadow: `0 0 6px ${accent}`,
                        }}
                      />
                      {item.eyebrow}
                    </div>
                  )}
                  <h3 className="text-balance text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
                    {item.title}
                  </h3>
                  {item.body && (
                    <p className="mt-2 text-pretty text-xs leading-relaxed text-white/65 sm:text-sm">
                      {item.body}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hint */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55"
      >
        <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-white/85" />
        Move your cursor
      </div>
    </div>
  )
}
