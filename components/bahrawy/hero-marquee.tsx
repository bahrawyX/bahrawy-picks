'use client'

/**
 * <HeroMarquee />
 *
 * Big centered headline + CTA sitting on top of multiple horizontal marquee
 * rows of words. The rows alternate direction and run at different speeds so
 * the background never repeats visually. Pure CSS keyframes for the scroll —
 * cheaper than a JS animation loop and pauses cleanly on hover.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface HeroMarqueeRow {
  /** Words rendered in this row. Each is repeated to create a seamless loop. */
  words: string[]
  /** Seconds per loop. Lower = faster. Default 24. */
  duration?: number
  /** Travel direction. */
  direction?: 'left' | 'right'
  /** Tailwind class for the row text color/opacity. */
  textClassName?: string
}

export interface HeroMarqueeProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  primaryCta?: { label: string; href?: string }
  secondaryCta?: { label: string; href?: string }
  rows?: HeroMarqueeRow[]
  /** Pause every row while the section is hovered. Default true. */
  pauseOnHover?: boolean
  minHeight?: string
  className?: string
}

const DEFAULT_ROWS: HeroMarqueeRow[] = [
  {
    words: ['Components', 'Motion', 'React', 'Next.js', 'Tailwind', 'Open source'],
    duration: 28,
    direction: 'left',
    textClassName: 'text-white/10',
  },
  {
    words: ['Type-safe', 'Accessible', 'Themeable', 'Composable', 'Copy & paste'],
    duration: 38,
    direction: 'right',
    textClassName: 'text-white/[0.07]',
  },
  {
    words: ['Bahrawy', 'Ship faster', 'Look great', 'No bloat', 'Yours to own'],
    duration: 32,
    direction: 'left',
    textClassName: 'text-white/[0.05]',
  },
]

export function HeroMarquee({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  rows = DEFAULT_ROWS,
  pauseOnHover = true,
  minHeight = '100vh',
  className,
}: HeroMarqueeProps) {
  return (
    <section
      style={{ minHeight }}
      className={cn(
        'group relative isolate flex w-full items-center justify-center overflow-hidden bg-black',
        className,
      )}
    >
      {/* Marquee rows — absolute, spread vertically through the section. */}
      <div aria-hidden className="absolute inset-0 flex flex-col justify-around py-12">
        {rows.map((row, i) => (
          <MarqueeLine key={i} row={row} pauseOnHover={pauseOnHover} />
        ))}
      </div>

      {/* Center vignette — keeps the headline readable over the busy rows. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.7)_60%,#000_85%)]"
      />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.05, ease: [0.2, 0, 0, 1] }}
          className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0, 0, 1] }}
            className="max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
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
// One scrolling row. Uses the `marquee` keyframe defined in tailwind.config.
// Doubles its content so the loop is seamless.
// ---------------------------------------------------------------------------

function MarqueeLine({ row, pauseOnHover }: { row: HeroMarqueeRow; pauseOnHover: boolean }) {
  const { words, duration = 24, direction = 'left', textClassName } = row
  const sign = direction === 'right' ? -1 : 1
  // The base `marquee` keyframe translates 0 → -100% (left). We flip it for
  // 'right' by using a positive starting offset and reverse animation-direction.
  // The animation lives in a class (not an inline shorthand), so the
  // group-hover play-state rule below can actually override it.
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className={cn(
          'inline-flex animate-marquee whitespace-nowrap will-change-transform motion-reduce:animate-none',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{
          ['--duration' as string]: `${duration}s`,
          animationDirection: sign === -1 ? 'reverse' : 'normal',
        }}
      >
        {[0, 1].map((dup) => (
          <span
            key={dup}
            aria-hidden={dup === 1}
            className={cn(
              'inline-flex shrink-0 items-center gap-12 pr-12 text-7xl font-black uppercase tracking-tight sm:text-8xl',
              textClassName ?? 'text-white/10',
            )}
          >
            {words.map((w, i) => (
              <span key={i} className="inline-flex items-center gap-12">
                {w}
                <span aria-hidden className="text-white/10">·</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
