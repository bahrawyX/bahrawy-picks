'use client'

/**
 * <GlitchHeadline />
 *
 * A type display that wears CRT-monitor damage as a feature. Three
 * layered copies of the same text are painted on top of each other:
 *
 *   – cyan channel, offset slightly left + up (::before pseudo-element)
 *   – magenta/red channel, offset slightly right + down (::after)
 *   – white base layer in the middle
 *
 * The two color channels live in `::before`/`::after` pseudo-elements
 * fed by `content: attr(data-text)` on the wrapper, so only one real
 * DOM copy of the text exists besides the base layer + slice band.
 *
 * The two color channels drift in a perpetual idle wobble. On hover
 * (or always, if `mode="always"`), the wobble amplifies and a
 * `clip-path` band sweeps through the text, slicing it horizontally
 * so chunks slip a couple of pixels out of register — the classic
 * RGB-glitch look without an image.
 *
 * Optional scan-lines and a vignetted screen tint complete the
 * "broken signal" feel. Everything is CSS — no JS animation loop —
 * so it costs almost nothing.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GlitchHeadlineProps {
  /** Text to display. Required. */
  children: string
  /**
   * When the glitch should be active.
   *  - 'hover'  (default) → calm at rest, intense on hover
   *  - 'always'           → intense all the time (use sparingly)
   *  - 'idle'             → very subtle even at rest, no hover boost
   */
  mode?: 'hover' | 'always' | 'idle'
  /** Color of the left/up offset layer. Default cyan. */
  channelA?: string
  /** Color of the right/down offset layer. Default magenta-ish red. */
  channelB?: string
  /** Base text color. Default white. */
  baseColor?: string
  /** Render horizontal scan-lines over the text. Default true. */
  scanlines?: boolean
  /** Speed multiplier — 1 is the default cadence. Higher = faster glitch. */
  speed?: number
  /** Maximum channel offset in px at peak. Default 6. */
  intensity?: number
  className?: string
  /** Optional unique id — if multiple instances share the same `children`
   *  text and `intensity`/`speed`, you'll want this. Otherwise auto. */
  instanceId?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GlitchHeadline({
  children,
  mode = 'hover',
  channelA = '#22D3EE',
  channelB = '#F472B6',
  baseColor = '#ffffff',
  scanlines = true,
  speed = 1,
  intensity = 6,
  className,
  instanceId,
}: GlitchHeadlineProps) {
  // Each instance gets a stable id so its keyframes don't collide with
  // another instance using a different intensity/speed.
  const reactId = React.useId().replace(/:/g, '')
  const id = instanceId ?? reactId

  // Duration scales inversely with `speed` so 2 = twice as fast.
  const baseDur = (3.4 / speed).toFixed(2)
  const sliceDur = (2.6 / speed).toFixed(2)

  // The maximum displacement during the SHIFT keyframes — half goes to
  // each channel, in opposite directions.
  const i = Math.max(0, intensity)
  const half = (i / 2).toFixed(2)

  // When `mode === 'always'` we apply the boosted animation on the
  // wrapper directly; otherwise it only activates on `.group:hover`.
  const wrapperClass =
    mode === 'always'
      ? `bahrawy-glitch-${id}-active group`
      : 'group'

  // For `idle` we keep the idle wobble but disable the slice/boost.
  const idleOnly = mode === 'idle'

  return (
    <>
      <span
        className={cn(
          `bahrawy-glitch bahrawy-glitch-${id} relative inline-block select-none align-baseline`,
          wrapperClass,
          className,
        )}
        data-text={children}
        style={
          {
            color: baseColor,
            // CSS custom properties consumed by the keyframes
            ['--gh-a' as string]: channelA,
            ['--gh-b' as string]: channelB,
            ['--gh-half' as string]: `${half}px`,
            ['--gh-dur' as string]: `${baseDur}s`,
            ['--gh-slice' as string]: `${sliceDur}s`,
          } as React.CSSProperties
        }
        aria-label={children}
      >
        {/* Base text — readable copy. Channels A + B render as ::before /
            ::after pseudo-elements from data-text (see scoped <style>). */}
        <span className="relative z-10">{children}</span>

        {/* Slice band — clipped horizontal band that slides through the
            text and shifts the copy inside it. Layered on top. */}
        {!idleOnly && (
          <span
            aria-hidden
            className={cn(
              `bahrawy-glitch-${id}-slice absolute inset-0 pointer-events-none`,
            )}
            style={{
              color: baseColor,
              textShadow: `2px 0 ${channelB}, -2px 0 ${channelA}`,
            }}
          >
            {children}
          </span>
        )}

        {/* Scan-lines overlay */}
        {scanlines && (
          <span
            aria-hidden
            className="bahrawy-glitch-scanlines pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px)',
              mixBlendMode: 'overlay',
              // Above the slice band + channel pseudos, below the z-10 base.
              zIndex: 2,
            }}
          />
        )}
      </span>

      {/* Scoped keyframes per instance. */}
      <style>{`
        .bahrawy-glitch-${id}::before,
        .bahrawy-glitch-${id}::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
          will-change: transform, clip-path;
          mix-blend-mode: screen;
        }
        .bahrawy-glitch-${id}::before {
          color: var(--gh-a);
          animation: bahrawy-glitch-${id}-a-kf var(--gh-dur) steps(2, jump-end) infinite;
        }
        .bahrawy-glitch-${id}::after {
          color: var(--gh-b);
          animation: bahrawy-glitch-${id}-b-kf var(--gh-dur) steps(2, jump-end) infinite;
        }
        @keyframes bahrawy-glitch-${id}-a-kf {
          0%, 100% { transform: translate(calc(var(--gh-half) * -0.2), 0); opacity: 0.85; }
          20%      { transform: translate(calc(var(--gh-half) * -0.45), -0.5px); opacity: 0.95; }
          40%      { transform: translate(calc(var(--gh-half) * -0.3), 0.2px); }
          60%      { transform: translate(calc(var(--gh-half) * -0.5), -0.2px); }
          80%      { transform: translate(calc(var(--gh-half) * -0.25), 0.3px); }
        }
        @keyframes bahrawy-glitch-${id}-b-kf {
          0%, 100% { transform: translate(calc(var(--gh-half) * 0.2), 0); opacity: 0.85; }
          20%      { transform: translate(calc(var(--gh-half) * 0.45), 0.5px); opacity: 0.95; }
          40%      { transform: translate(calc(var(--gh-half) * 0.3), -0.2px); }
          60%      { transform: translate(calc(var(--gh-half) * 0.5), 0.2px); }
          80%      { transform: translate(calc(var(--gh-half) * 0.25), -0.3px); }
        }

        /* Slice band — clipped to a moving horizontal strip and shifted.
           z-index keeps it above the ::before/::after channel pseudos. */
        .bahrawy-glitch-${id}-slice {
          z-index: 1;
          clip-path: inset(45% 0 50% 0);
          -webkit-clip-path: inset(45% 0 50% 0);
          transform: translate(0, 0);
          opacity: 0;
        }
        .bahrawy-glitch.group:hover .bahrawy-glitch-${id}-slice,
        .bahrawy-glitch-${id}-active .bahrawy-glitch-${id}-slice {
          animation: bahrawy-glitch-${id}-slice-kf var(--gh-slice) steps(1, jump-end) infinite;
        }
        @keyframes bahrawy-glitch-${id}-slice-kf {
          0%   { clip-path: inset(85% 0 4% 0);  -webkit-clip-path: inset(85% 0 4% 0);  transform: translate(calc(var(--gh-half) * 2), 0); opacity: 1; }
          10%  { clip-path: inset(40% 0 55% 0); -webkit-clip-path: inset(40% 0 55% 0); transform: translate(calc(var(--gh-half) * -1.5), 0); opacity: 1; }
          18%  { clip-path: inset(15% 0 75% 0); -webkit-clip-path: inset(15% 0 75% 0); transform: translate(calc(var(--gh-half) * 2.2), 0); opacity: 0.9; }
          26%  { clip-path: inset(60% 0 30% 0); -webkit-clip-path: inset(60% 0 30% 0); transform: translate(calc(var(--gh-half) * -2), 0); opacity: 1; }
          34%  { clip-path: inset(0 0 90% 0);   -webkit-clip-path: inset(0 0 90% 0);   transform: translate(calc(var(--gh-half) * 1.2), 0); opacity: 1; }
          42%  { clip-path: inset(72% 0 12% 0); -webkit-clip-path: inset(72% 0 12% 0); transform: translate(calc(var(--gh-half) * -1), 0); opacity: 1; }
          50%  { opacity: 0; }
          100% { opacity: 0; }
        }

        /* Hover boost — bigger displacement on the color channels. */
        .bahrawy-glitch-${id}.group:hover::before,
        .bahrawy-glitch-${id}-active::before {
          animation-duration: calc(var(--gh-dur) * 0.55);
          animation-timing-function: steps(3, jump-end);
        }
        .bahrawy-glitch-${id}.group:hover::after,
        .bahrawy-glitch-${id}-active::after {
          animation-duration: calc(var(--gh-dur) * 0.55);
          animation-timing-function: steps(3, jump-end);
        }

        @media (prefers-reduced-motion: reduce) {
          .bahrawy-glitch-${id}::before,
          .bahrawy-glitch-${id}::after,
          .bahrawy-glitch-${id}-slice {
            animation: none !important;
            transform: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </>
  )
}
