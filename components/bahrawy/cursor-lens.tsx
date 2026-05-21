'use client'

/**
 * <CursorLens />
 *
 * Two scenes layered on top of each other. The "outer" scene is what
 * the world sees. The "inner" scene is hidden behind an INVISIBLE mask
 * that follows the cursor — there is no ring, no border, no chrome.
 * The lens is felt, not seen.
 *
 * Wherever you hover, the inner scene quietly bleeds through with a
 * soft radial fade at the edge so the transition is seamless. Move
 * the cursor and the reveal moves with it; click to pin the lens at
 * that spot, click again to unpin.
 *
 * Inside the lens the inner image is gently magnified with its
 * `transform-origin` set to the cursor position, so the moment the
 * cursor settles on a detail you also see that detail enlarge —
 * exactly how a real lens behaves. The inner text is layered above
 * the magnified image but NOT scaled, so headlines read crisply
 * wherever the cursor lands.
 *
 * The whole effect is driven by one RAF loop, lerping the lens
 * position toward the cursor target — snappy by default but soft
 * enough to feel alive.
 */

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CursorLensScene {
  /** Image filling the scene. */
  image?: string
  /** Optional alt. Defaults to the title (if string). */
  alt?: string
  /** Tiny tag rendered above the title. */
  eyebrow?: React.ReactNode
  /** Headline displayed in this scene. */
  title?: React.ReactNode
  /** Sub-copy under the title. */
  subtitle?: React.ReactNode
}

export interface CursorLensCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface CursorLensProps {
  /** Always-visible scene. */
  outer: CursorLensScene
  /** Scene revealed under the cursor lens. */
  inner: CursorLensScene
  /**
   * Optional CTA rendered BELOW the lens canvas. Lives outside the
   * masked area so it's always clickable.
   */
  cta?: CursorLensCta
  /** Lens diameter in px. Default 360. */
  size?: number
  /**
   * Soft-edge fraction, 0–1. 0 = hard circle, 1 = pure radial fade.
   * Default 0.35 (~65% solid, 35% fade).
   */
  softness?: number
  /** Inner content magnification. 1 = no zoom. Default 1.1. */
  zoom?: number
  /** Click anywhere on the canvas to pin the lens. Default true. */
  clickToLock?: boolean
  /**
   * Cursor lerp factor, 0–1. Higher = snappier. Default 0.22 — feels
   * responsive but not rigid.
   */
  lerp?: number
  /**
   * Show a faint accent ring at the lens edge. Off by default — the
   * whole point is the lens feels invisible.
   */
  showRing?: boolean
  /** Ring/glow color, used by the ring + the lock dot. Default '#A78BFA'. */
  accentColor?: string
  /** CSS `aspect-ratio` for the canvas. Default '16 / 9'. */
  aspect?: string
  /** Tiny instruction shown until the user hovers. Default 'Hover to reveal'. */
  hint?: React.ReactNode
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CursorLens({
  outer,
  inner,
  cta,
  size = 360,
  softness = 0.35,
  zoom = 1.1,
  clickToLock = true,
  lerp = 0.22,
  showRing = false,
  accentColor = '#A78BFA',
  aspect = '16 / 9',
  hint = 'Hover to reveal',
  className,
}: CursorLensProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const innerLayerRef = React.useRef<HTMLDivElement>(null)
  const innerZoomRef = React.useRef<HTMLDivElement>(null)
  const ringRef = React.useRef<HTMLDivElement>(null)
  const hintRef = React.useRef<HTMLDivElement>(null)
  const lockDotRef = React.useRef<HTMLDivElement>(null)

  // Imperative state — read inside the RAF loop, written by pointer events.
  const stateRef = React.useRef({
    active: false,
    locked: false,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    opacity: 0,
  })

  // Resolve the inner radial stop from softness. softness=0 → 100% solid,
  // softness=1 → 0% solid (full fade).
  const softnessStop = `${(clamp01(1 - softness) * 100).toFixed(1)}%`

  React.useEffect(() => {
    const container = containerRef.current
    const innerLayer = innerLayerRef.current
    const innerZoom = innerZoomRef.current
    if (!container || !innerLayer) return

    // Start the lens in the middle so the first move-in animates smoothly
    // toward the cursor rather than jumping from (0,0).
    const initRect = container.getBoundingClientRect()
    const cx = initRect.width / 2
    const cy = initRect.height / 2
    stateRef.current.currentX = cx
    stateRef.current.currentY = cy
    stateRef.current.targetX = cx
    stateRef.current.targetY = cy

    // Watch the user's reduced-motion preference. Magnifier zoom + heavy
    // lerp are both eased off when it's on.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const effectiveLerp = prefersReducedMotion ? 1 : lerp
    const effectiveZoom = prefersReducedMotion ? 1 : zoom

    const setTargetFromEvent = (clientX: number, clientY: number) => {
      const r = container.getBoundingClientRect()
      stateRef.current.targetX = clientX - r.left
      stateRef.current.targetY = clientY - r.top
    }

    const onPointerMove = (e: PointerEvent) => {
      if (stateRef.current.locked) return
      setTargetFromEvent(e.clientX, e.clientY)
      stateRef.current.active = true
    }
    const onPointerEnter = (e: PointerEvent) => {
      setTargetFromEvent(e.clientX, e.clientY)
      stateRef.current.active = true
    }
    const onPointerLeave = () => {
      if (!stateRef.current.locked) stateRef.current.active = false
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!clickToLock) return
      if (stateRef.current.locked) {
        // Unlock — resume tracking from the current cursor position.
        stateRef.current.locked = false
        setTargetFromEvent(e.clientX, e.clientY)
      } else {
        // Lock at this exact spot.
        setTargetFromEvent(e.clientX, e.clientY)
        stateRef.current.locked = true
        stateRef.current.active = true
      }
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerenter', onPointerEnter)
    container.addEventListener('pointerleave', onPointerLeave)
    container.addEventListener('pointerdown', onPointerDown)

    // RAF render loop
    let raf = 0
    const draw = () => {
      const s = stateRef.current

      s.currentX = lerpN(s.currentX, s.targetX, effectiveLerp)
      s.currentY = lerpN(s.currentY, s.targetY, effectiveLerp)
      // Fade in/out of presence (opacity → 1 when active, → 0 when not)
      s.opacity = lerpN(s.opacity, s.active ? 1 : 0, 0.14)

      const x = s.currentX
      const y = s.currentY
      const r = size / 2

      // The soft mask: solid inside softnessStop% of the radius, fades
      // to transparent at the outer edge.
      const mask = `radial-gradient(circle ${r}px at ${x}px ${y}px, black 0%, black ${softnessStop}, transparent 100%)`
      innerLayer.style.maskImage = mask
      ;(innerLayer.style as unknown as { WebkitMaskImage?: string }).WebkitMaskImage = mask
      innerLayer.style.opacity = String(s.opacity)

      // Magnifier — only the image zooms, not the text.
      if (innerZoom) {
        innerZoom.style.transformOrigin = `${x}px ${y}px`
        innerZoom.style.transform = `scale(${effectiveZoom})`
      }

      // Optional visible ring follows the cursor.
      if (ringRef.current && showRing) {
        ringRef.current.style.transform = `translate3d(${x - r}px, ${y - r}px, 0)`
        ringRef.current.style.opacity = String(s.opacity)
      }

      // Hint fades out as the lens activates.
      if (hintRef.current) {
        hintRef.current.style.opacity = String(
          (1 - s.opacity) * (s.locked ? 0 : 0.85),
        )
      }

      // Lock dot — visible only when locked, drawn at the lock position.
      if (lockDotRef.current) {
        lockDotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`
        lockDotRef.current.style.opacity = s.locked ? '1' : '0'
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerenter', onPointerEnter)
      container.removeEventListener('pointerleave', onPointerLeave)
      container.removeEventListener('pointerdown', onPointerDown)
    }
  }, [size, softness, softnessStop, zoom, lerp, showRing, clickToLock])

  const outerAlt =
    outer.alt ?? (typeof outer.title === 'string' ? outer.title : '')
  const innerAlt =
    inner.alt ?? (typeof inner.title === 'string' ? inner.title : '')

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 select-none"
        style={{
          aspectRatio: aspect,
          cursor: clickToLock ? 'crosshair' : 'none',
        }}
      >
        {/* ──────────────────────────────────────────────────────────
            OUTER scene — always visible.
        ────────────────────────────────────────────────────────── */}
        {outer.image && (
          <img
            src={outer.image}
            alt={outerAlt}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 60% at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-10">
          {outer.eyebrow && (
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
              {outer.eyebrow}
            </p>
          )}
          {outer.title && (
            <h3
              className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white/90 sm:text-5xl"
              style={{ letterSpacing: '-0.025em' }}
            >
              {outer.title}
            </h3>
          )}
          {outer.subtitle && (
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
              {outer.subtitle}
            </p>
          )}
        </div>

        {/* ──────────────────────────────────────────────────────────
            INNER scene — masked with a soft cursor circle.
            Image is magnified; text is layered on top crisp.
        ────────────────────────────────────────────────────────── */}
        <div
          ref={innerLayerRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            willChange: 'mask-image, opacity',
          }}
        >
          {/* Magnified image layer */}
          <div
            ref={innerZoomRef}
            className="absolute inset-0"
            style={{ willChange: 'transform' }}
          >
            {inner.image && (
              <img
                src={inner.image}
                alt={innerAlt}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 70% at 50% 55%, transparent 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.6) 100%)',
              }}
            />
          </div>

          {/* Crisp text layer — same mask, no zoom */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-10">
            {inner.eyebrow && (
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white/90 backdrop-blur"
              >
                <span
                  aria-hidden
                  className="block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`,
                  }}
                />
                {inner.eyebrow}
              </div>
            )}
            {inner.title && (
              <h3
                className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
                style={{
                  letterSpacing: '-0.025em',
                  textShadow: `0 0 30px ${accentColor}66, 0 0 70px ${accentColor}33`,
                }}
              >
                {inner.title}
              </h3>
            )}
            {inner.subtitle && (
              <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-white/85 sm:text-base">
                {inner.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Optional faint ring */}
        {showRing && (
          <div
            ref={ringRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 rounded-full"
            style={{
              width: size,
              height: size,
              border: `1px solid ${accentColor}66`,
              boxShadow: `0 0 18px ${accentColor}55, inset 0 0 18px ${accentColor}22`,
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          />
        )}

        {/* Lock dot — appears at the locked position. */}
        <div
          ref={lockDotRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-2 w-2 rounded-full"
          style={{
            background: accentColor,
            boxShadow: `0 0 12px ${accentColor}, 0 0 24px ${accentColor}88`,
            opacity: 0,
            transition: 'opacity 180ms ease-out',
            willChange: 'transform, opacity',
          }}
        />

        {/* Hint — fades out as the lens activates. */}
        {hint && (
          <div
            ref={hintRef}
            aria-hidden
            className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 select-none text-[10px] font-medium uppercase tracking-[0.32em] text-white/75"
            style={{ opacity: 0.85 }}
          >
            <span
              className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full"
              style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
            />
            {hint}
            {clickToLock && (
              <span className="ml-3 text-white/40">· click to pin</span>
            )}
          </div>
        )}
      </div>

      {/* Optional CTA lives BELOW the canvas so it's always clickable. */}
      {cta && (
        <a
          href={cta.href ?? '#'}
          onClick={cta.onClick}
          className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
          style={{
            boxShadow: `0 0 26px ${accentColor}40, 0 0 60px ${accentColor}1f`,
          }}
        >
          {cta.label}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      )}
    </div>
  )
}
