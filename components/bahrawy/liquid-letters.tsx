'use client'

/**
 * <LiquidLetters />
 *
 * A typography effect that makes letters look like blobs of liquid.
 * They bond and merge with their neighbours, and a "cursor blob" you
 * push around the canvas bonds with whichever letters it touches —
 * pulling them into a single fluid shape.
 *
 * How the goo works:
 *  - Everything (the letters + the cursor blob) is rendered inside
 *    an SVG layer that has a single filter applied at the root:
 *
 *        <filter>
 *          <feGaussianBlur stdDeviation="X" />
 *          <feColorMatrix matrix="…tighten alpha…" />
 *        </filter>
 *
 *    The blur smears the shapes into each other; the colour matrix
 *    re-sharpens the alpha so anywhere the blurred shapes overlap
 *    becomes opaque again and anywhere they don't becomes empty.
 *    Two close shapes appear to merge along a curved isoline — the
 *    classic CSS-goo trick.
 *
 *  - The cursor blob position lerps toward the pointer in a single
 *    RAF loop. Touch / pen / mouse all use Pointer Events.
 *
 *  - The letters themselves are SVG `<text>` so they participate in
 *    the same filter as the cursor blob — they pick up the same
 *    rounded blob silhouette, and "bond" with the cursor blob when
 *    it's near.
 *
 * The component still renders accessible plain text underneath (via
 * an off-screen span with the same content) so the headline is read
 * by screen readers and indexed by search.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LiquidLettersProps {
  /** Text to render in goo. */
  children: string
  /** Color of the liquid. Default white. */
  color?: string
  /** Background color of the canvas. Default '#06070a'. */
  background?: string
  /** Gaussian blur radius in px. Higher = thicker bond. Default 8. */
  blur?: number
  /** Cursor blob radius in px. Default 36. */
  blobRadius?: number
  /** Font size in px. Defaults to a responsive clamp. */
  fontSize?: number | string
  /** Cursor follow lerp factor 0–1. Default 0.18. */
  lerp?: number
  /** Aspect ratio of the canvas. Default '21 / 9'. */
  aspect?: string
  /** Show subtle hint at the bottom. Default true. */
  showHint?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LiquidLetters({
  children,
  color = '#ffffff',
  background = '#06070a',
  blur = 8,
  blobRadius = 36,
  fontSize,
  lerp = 0.18,
  aspect = '21 / 9',
  showHint = true,
  className,
}: LiquidLettersProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const blobRef = React.useRef<SVGCircleElement>(null)

  // Each instance gets its own filter id so multiple LiquidLetters on
  // a single page don't reference one another's filter by accident.
  const reactId = React.useId().replace(/:/g, '')
  const filterId = `bahrawy-liquid-${reactId}`

  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    const container = containerRef.current
    const blob = blobRef.current
    if (!container || !blob) return

    // Reduced motion: static gooey text only — no cursor blob, no RAF.
    if (reduced) return

    // Start with the blob parked just below the canvas centre so the
    // first hover-in feels intentional.
    const rect = container.getBoundingClientRect()
    let targetX = rect.width / 2
    let targetY = rect.height + blobRadius
    let curX = targetX
    let curY = targetY
    let active = false

    const onPointerMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect()
      targetX = e.clientX - r.left
      targetY = e.clientY - r.top
      active = true
    }
    const onPointerLeave = () => {
      // Park back below the canvas so the blob "drips out the bottom".
      const r = container.getBoundingClientRect()
      targetX = r.width / 2
      targetY = r.height + blobRadius * 1.5
      active = false
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)

    let raf = 0
    const loop = () => {
      curX += (targetX - curX) * lerp
      curY += (targetY - curY) * lerp
      blob.setAttribute('cx', String(curX))
      blob.setAttribute('cy', String(curY))
      // Slightly larger blob when active — feels alive.
      const r = active ? blobRadius * 1.05 : blobRadius
      blob.setAttribute('r', String(r))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [blobRadius, lerp, reduced])

  // Fontsize: number → "Npx", string → as-is, undefined → responsive clamp.
  const fs =
    typeof fontSize === 'number'
      ? `${fontSize}px`
      : fontSize ?? 'clamp(72px, 14vw, 220px)'

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-white/10',
        'select-none touch-none',
        className,
      )}
      style={{
        aspectRatio: aspect,
        background,
        cursor: reduced ? undefined : 'none',
      }}
    >
      {/* Accessible plain-text version, off-screen but in the a11y tree. */}
      <span className="sr-only">{children}</span>

      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          {/* The goo filter — blur then sharpen alpha. */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* Everything inside this group participates in the same filter
            so the letters and the cursor blob bond with each other. */}
        <g filter={`url(#${filterId})`}>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            style={{
              fontSize: fs,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            }}
          >
            {children}
          </text>

          {/* The cursor blob — its position is animated each frame. */}
          <circle
            ref={blobRef}
            cx="0"
            cy="-9999"
            r={blobRadius}
            fill={color}
          />
        </g>
      </svg>

      {/* Hint */}
      {showHint && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55"
        >
          <span
            className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-white/85"
            style={{ boxShadow: '0 0 8px rgba(255,255,255,0.7)' }}
          />
          Move the goo
        </div>
      )}
    </div>
  )
}
