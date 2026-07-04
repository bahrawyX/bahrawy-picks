'use client'

/**
 * <HeroAurora />
 *
 * Centered hero with drifting blurred color blobs behind the text. Each blob
 * slowly orbits via Framer's keyframe array — different speeds and paths so
 * the bloom never repeats visually. Soft + brand-y, doesn't fight the type.
 *
 * The drift animates `x`/`y` transforms (compositor-only) rather than
 * `left`/`top`, which would force layout every frame under the heavy blur.
 * Percent paths are converted to px once the blob field is measured.
 * Honors `prefers-reduced-motion` by rendering the blobs statically.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface HeroAuroraBlob {
  /** Hex/RGB string. */
  color: string
  /** Diameter in px. Default 520. */
  size?: number
  /** Initial x/y as percent of section (0–100). */
  startX?: number
  startY?: number
  /** Loop duration in seconds. */
  duration?: number
  /** Opacity (default 0.55). */
  opacity?: number
}

export interface HeroAuroraProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  primaryCta?: { label: string; href?: string }
  secondaryCta?: { label: string; href?: string }
  blobs?: HeroAuroraBlob[]
  /** CSS blur. Default '120px'. */
  blur?: string
  minHeight?: string
  className?: string
}

const DEFAULT_BLOBS: HeroAuroraBlob[] = [
  { color: '#7C3AED', startX: 20, startY: 30, size: 560, duration: 18 },
  { color: '#38BDF8', startX: 70, startY: 25, size: 520, duration: 22 },
  { color: '#F472B6', startX: 55, startY: 75, size: 480, duration: 16 },
  { color: '#22D3EE', startX: 85, startY: 70, size: 440, duration: 24 },
]

export function HeroAurora({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  blobs = DEFAULT_BLOBS,
  blur = '120px',
  minHeight = '100vh',
  className,
}: HeroAuroraProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const fieldRef = React.useRef<HTMLDivElement>(null)
  const [fieldSize, setFieldSize] = React.useState<{
    width: number
    height: number
  } | null>(null)

  // Measure the blob field once (and on resize) so the percent-based drift
  // paths can run as pure px transforms instead of layout-forcing left/top.
  React.useEffect(() => {
    const el = fieldRef.current
    if (!el) return
    const measure = () =>
      setFieldSize({ width: el.clientWidth, height: el.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      style={{ minHeight }}
      className={cn(
        'relative isolate flex w-full items-center justify-center overflow-hidden bg-black',
        className,
      )}
    >
      {/* Aurora blob field */}
      <div
        ref={fieldRef}
        aria-hidden
        className="absolute inset-0"
        style={{ filter: `blur(${blur})` }}
      >
        {blobs.map((b, i) => (
          <AuroraBlob
            key={i}
            blob={b}
            fieldSize={fieldSize}
            drift={!prefersReducedMotion}
          />
        ))}
      </div>

      {/* Darken the edges for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_75%,rgba(0,0,0,0.85)_100%)]"
      />

      {/* Foreground */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/85 backdrop-blur"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.2, 0, 0, 1] }}
          className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.2, 0, 0, 1] }}
            className="max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {description}
          </motion.p>
        )}
        {(primaryCta || secondaryCta) && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.2, 0, 0, 1] }}
            className="mt-2 flex flex-wrap items-center justify-center gap-3"
          >
            {primaryCta && (
              <a
                href={primaryCta.href ?? '#'}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/85"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href ?? '#'}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/10"
              >
                {secondaryCta.label}
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// A single drifting blob
// ---------------------------------------------------------------------------

function AuroraBlob({
  blob,
  fieldSize,
  drift,
}: {
  blob: HeroAuroraBlob
  fieldSize: { width: number; height: number } | null
  drift: boolean
}) {
  const {
    color,
    size = 520,
    startX = 50,
    startY = 50,
    duration = 20,
    opacity = 0.55,
  } = blob

  // Static blob when reduced motion is preferred, or until the field has
  // been measured (SSR / first paint) — same start position, no drift.
  if (!drift || !fieldSize) {
    return (
      <div
        aria-hidden
        style={{
          left: `${startX}%`,
          top: `${startY}%`,
          width: size,
          height: size,
          background: color,
          opacity,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      />
    )
  }

  // Walk between a small set of percent offsets so the blob orbits without
  // ever traveling in a straight line. The percent path is converted to px
  // transforms (centering baked in) so the loop never touches layout.
  const toX = (pct: number) => (pct / 100) * fieldSize.width - size / 2
  const toY = (pct: number) => (pct / 100) * fieldSize.height - size / 2
  const xKeyframes = [startX, startX + 12, startX - 8, startX + 4, startX].map(toX)
  const yKeyframes = [startY, startY - 6, startY + 10, startY - 4, startY].map(toY)

  return (
    <motion.div
      aria-hidden
      animate={{ x: xKeyframes, y: yKeyframes }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        x: xKeyframes[0],
        y: yKeyframes[0],
        width: size,
        height: size,
        background: color,
        opacity,
      }}
      className="absolute left-0 top-0 rounded-full"
    />
  )
}
