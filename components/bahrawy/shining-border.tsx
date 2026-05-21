'use client'

/**
 * <ShiningBorder />
 *
 * A wrapper that draws a thin static border around its children and runs a
 * small bright "meteor" continuously around the perimeter. The meteor follows
 * the rounded-rect path via CSS `offset-path`, dragging a short tail and
 * a soft ambient glow.
 *
 * @param children         — Content to wrap.
 * @param variant          — Preset color scheme. Default "default".
 * @param colors           — Custom color array (used with variant="custom").
 *                           Order: [headColor, tailColor, glowColor].
 * @param borderWidth      — Static border thickness in px. Default 1.
 * @param borderRadius     — Corner radius in px. Default 14.
 * @param duration         — Time for one full orbit in seconds. Default 4.
 * @param beamCount        — Number of meteors (1-3, evenly spaced). Default 1.
 * @param meteorSize       — Meteor head size in px. Default 60.
 * @param glowIntensity    — Ambient glow strength 0-1. Default 0.35.
 * @param pauseOnHover     — Pause the orbit on hover. Default false.
 * @param innerBackground  — Tailwind class for inner bg. Default "bg-black".
 * @param className        — Additional classes for the outer wrapper.
 * @param innerClassName   — Additional classes for the inner content wrapper.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShiningBorderProps {
  children: React.ReactNode
  variant?: 'default' | 'rainbow' | 'aurora' | 'fire' | 'neon' | 'custom'
  colors?: [string, string, string?]
  borderWidth?: number
  borderRadius?: number
  duration?: number
  beamCount?: number
  meteorSize?: number
  glowIntensity?: number
  pauseOnHover?: boolean
  innerBackground?: string
  className?: string
  innerClassName?: string
}

// ---------------------------------------------------------------------------
// Variants — [headColor, tailColor, glowColor?]
// ---------------------------------------------------------------------------

const VARIANTS: Record<
  Exclude<ShiningBorderProps['variant'] & string, 'custom'>,
  [string, string, string]
> = {
  default: ['#ffffff', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.5)'],
  rainbow: ['#a78bfa', 'rgba(56,189,248,0.5)', 'rgba(167,139,250,0.55)'],
  aurora: ['#22d3ee', 'rgba(52,211,153,0.5)', 'rgba(34,211,238,0.55)'],
  fire: ['#fbbf24', 'rgba(239,68,68,0.5)', 'rgba(251,191,36,0.6)'],
  neon: ['#ec4899', 'rgba(59,130,246,0.55)', 'rgba(236,72,153,0.55)'],
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ShiningBorder({
  children,
  variant = 'default',
  colors,
  borderWidth = 1,
  borderRadius = 14,
  duration = 4,
  beamCount = 1,
  meteorSize = 60,
  glowIntensity = 0.35,
  pauseOnHover = false,
  innerBackground = 'bg-black',
  className,
  innerClassName,
}: ShiningBorderProps) {
  const [head, tail, glow] =
    variant === 'custom' && colors
      ? [colors[0], colors[1], colors[2] ?? colors[0]]
      : VARIANTS[variant]

  const clampedBeams = Math.max(1, Math.min(3, beamCount))
  const instanceId = React.useId().replace(/:/g, '')

  // Each meteor is offset in its orbit by an equal fraction of the duration,
  // so 2 → opposite sides, 3 → triangle.
  const meteors = Array.from({ length: clampedBeams }, (_, i) => ({
    delay: (-duration / clampedBeams) * i,
    key: `${instanceId}-${i}`,
  }))

  const hoverPauseClass = pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''

  return (
    <div
      className={cn('group relative isolate', className)}
      style={{
        borderRadius,
        // CSS custom props consumed by the keyframes below.
        ['--sb-radius' as string]: `${borderRadius}px`,
      }}
    >
      {/* The static border line — what you see when nothing is animating. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          border: `${borderWidth}px solid rgba(255,255,255,0.10)`,
        }}
      />

      {/* The meteor track — absolutely positioned wrapper inside the border. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        {meteors.map((m) => (
          <React.Fragment key={m.key}>
            {/* Soft ambient glow trailing the meteor */}
            <span
              className={cn('bahrawy-shining-meteor-glow', hoverPauseClass)}
              style={{
                width: meteorSize * 2.6,
                height: meteorSize * 2.6,
                background: `radial-gradient(circle, ${glow} 0%, transparent 60%)`,
                opacity: glowIntensity,
                animationDuration: `${duration}s`,
                animationDelay: `${m.delay}s`,
              }}
            />

            {/* Meteor head with a short fading tail */}
            <span
              className={cn('bahrawy-shining-meteor', hoverPauseClass)}
              style={{
                width: meteorSize,
                height: 2,
                background: `linear-gradient(90deg, transparent 0%, ${tail} 50%, ${head} 100%)`,
                boxShadow: `0 0 12px 1px ${head}`,
                animationDuration: `${duration}s`,
                animationDelay: `${m.delay}s`,
              }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Inner content — sits above the border layer but stays clipped. */}
      <div
        className={cn('relative z-10', innerBackground, innerClassName)}
        style={{
          borderRadius,
          margin: borderWidth,
        }}
      >
        {children}
      </div>

      {/* Keyframes + offset-path are scoped via a tagged style block. The
          `inset(0 round var(--sb-radius))` traces the rounded perimeter. */}
      <style>{`
        .bahrawy-shining-meteor,
        .bahrawy-shining-meteor-glow {
          position: absolute;
          top: 0;
          left: 0;
          offset-path: inset(0 round var(--sb-radius));
          offset-rotate: auto;
          animation-name: bahrawy-shining-orbit;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: offset-distance;
        }
        .bahrawy-shining-meteor-glow {
          border-radius: 9999px;
          filter: blur(14px);
          transform: translate(-50%, -50%);
        }
        .bahrawy-shining-meteor {
          border-radius: 9999px;
        }
        @keyframes bahrawy-shining-orbit {
          from { offset-distance: 0%; }
          to   { offset-distance: 100%; }
        }
      `}</style>
    </div>
  )
}
