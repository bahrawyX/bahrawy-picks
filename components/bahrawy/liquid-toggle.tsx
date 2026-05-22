'use client'

/**
 * <LiquidToggle />
 *
 * A toggle switch whose handle is a fluid blob. Tap the track and
 * the handle slides from one end to the other; while it moves it
 * stretches like syrup — that smoosh comes from the classic CSS-goo
 * SVG filter (Gaussian blur + alpha-tightening colour matrix)
 * applied to BOTH the handle and a small anchor blob fixed at each
 * end of the track. As the handle approaches an anchor, the two
 * blobs merge along a curved isoline. Release the toggle in the
 * middle and the handle snaps to the nearest end.
 *
 * Controlled or uncontrolled — pass `checked` + `onChange` for
 * controlled, or just an `defaultChecked` for uncontrolled.
 *
 * No glow, no neon — just smooth liquid motion + clean colour.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LiquidToggleProps {
  /** Controlled value. */
  checked?: boolean
  /** Uncontrolled default. */
  defaultChecked?: boolean
  /** Fired on toggle. */
  onChange?: (next: boolean) => void
  /** Width of the track in px. Default 96. */
  width?: number
  /** Height of the track in px. Default 44. */
  height?: number
  /** Colour of the blob (handle + anchors). Default '#22D3EE'. */
  color?: string
  /** Track background. Default dark zinc. */
  trackColor?: string
  /** Accessible label. */
  label?: string
  /** Optional class on the outer button. */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LiquidToggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  width = 96,
  height = 44,
  color = '#22D3EE',
  trackColor = '#1a1d24',
  label = 'Toggle',
  className,
}: LiquidToggleProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : uncontrolled

  const toggle = React.useCallback(() => {
    const next = !checked
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }, [checked, isControlled, onChange])

  // Geometry: blob radius is just under half the track height so it
  // hugs the inside; "left" + "right" anchor blobs sit a hair inside
  // the ends; the handle blob travels between them.
  const blobR = height / 2 - 4
  const handleX = checked ? width - blobR - 4 : blobR + 4
  const anchorL = blobR + 4
  const anchorR = width - blobR - 4

  // Per-instance filter id so multiple toggles on a page don't clash.
  const reactId = React.useId().replace(/:/g, '')
  const filterId = `bahrawy-liquid-toggle-${reactId}`

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={toggle}
      className={cn(
        'relative inline-flex shrink-0 select-none items-center justify-center rounded-full border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors',
        className,
      )}
      style={{
        width,
        height,
        background: trackColor,
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.5)',
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden
      >
        <defs>
          {/* The goo filter: blur the shapes together, then tighten the
              alpha so the overlapping region jumps back to fully opaque
              and the falloff goes hard transparent — gives the merge a
              smooth, curved isoline like a syrup string. */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
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

        {/* All three blobs share the goo filter so they merge as they
            approach each other. */}
        <g filter={`url(#${filterId})`}>
          {/* Small anchor blobs at each end of the track. They stay
              subtle but bond with the handle as it passes. */}
          <circle cx={anchorL} cy={height / 2} r={blobR * 0.55} fill={color} opacity={checked ? 0.45 : 1} />
          <circle cx={anchorR} cy={height / 2} r={blobR * 0.55} fill={color} opacity={checked ? 1 : 0.45} />
          {/* The travelling handle. CSS transition gives it a soft slide
              that the goo filter then smooshes through the anchors. */}
          <circle
            cx={handleX}
            cy={height / 2}
            r={blobR}
            fill={color}
            style={{ transition: 'cx 480ms cubic-bezier(0.4, 1.4, 0.4, 1)' }}
          />
        </g>
      </svg>

      {/* Subtle "ticks" inside the track — clip to opposite half of
          the handle so they always read as the unlit half. */}
      <span
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none pl-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 transition-opacity"
        style={{ opacity: checked ? 1 : 0 }}
      >
        on
      </span>
      <span
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none pr-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40 transition-opacity"
        style={{ opacity: checked ? 0 : 1 }}
      >
        off
      </span>
    </button>
  )
}
