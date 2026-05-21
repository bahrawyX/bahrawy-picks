'use client'

/**
 * <HeroCounter />
 *
 * Hero layout where a giant stat counts up on mount alongside a column of
 * feature blurbs. The number uses a spring on a motion value so the digits
 * settle into place rather than tick linearly.
 */

import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface HeroCounterStat {
  value: number
  /** What the number means — e.g. "downloads", "components shipped". */
  label: string
  /** Optional suffix rendered next to the number, e.g. "K", "M", "+". */
  suffix?: string
  /** Optional prefix rendered before the number, e.g. "$". */
  prefix?: string
}

export interface HeroCounterFeature {
  title: string
  body: string
}

export interface HeroCounterProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  stat: HeroCounterStat
  features?: HeroCounterFeature[]
  primaryCta?: { label: string; href?: string }
  /** ms before the counter starts. Default 200. */
  startDelay?: number
  /** ms the counter takes to settle. Default 1800. */
  duration?: number
  minHeight?: string
  className?: string
}

export function HeroCounter({
  eyebrow,
  title,
  description,
  stat,
  features = [],
  primaryCta,
  startDelay = 200,
  duration = 1800,
  minHeight = '100vh',
  className,
}: HeroCounterProps) {
  return (
    <section
      style={{ minHeight }}
      className={cn(
        'relative isolate flex w-full items-center overflow-hidden bg-black',
        className,
      )}
    >
      {/* Soft accent glow behind the number */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,255,255,0.06),transparent_55%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* Left — the big number + label */}
        <div className="flex flex-col gap-6">
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
              className="self-start rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80"
            >
              {eyebrow}
            </motion.span>
          )}

          <CounterNumber
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            startDelay={startDelay}
            duration={duration}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: (startDelay + duration) / 1000 - 0.6, ease: [0.2, 0, 0, 1] }}
            className="text-base font-medium uppercase tracking-[0.16em] text-white/55"
          >
            {stat.label}
          </motion.p>
        </div>

        {/* Right — copy + features */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
              className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.2, 0, 0, 1] }}
                className="text-pretty text-base leading-relaxed text-white/60"
              >
                {description}
              </motion.p>
            )}
          </div>

          {features.length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.18 + i * 0.06, ease: [0.2, 0, 0, 1] }}
                  className="border-l border-white/10 pl-4"
                >
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{f.body}</p>
                </motion.li>
              ))}
            </ul>
          )}

          {primaryCta && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: [0.2, 0, 0, 1] }}
            >
              <a
                href={primaryCta.href ?? '#'}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/85"
              >
                {primaryCta.label}
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// The animated number itself
// ---------------------------------------------------------------------------

interface CounterNumberProps {
  value: number
  prefix?: string
  suffix?: string
  startDelay: number
  duration: number
}

function CounterNumber({ value, prefix, suffix, startDelay, duration }: CounterNumberProps) {
  const raw = useMotionValue(0)
  // Spring tuned to settle inside `duration` for typical 0→N steps.
  const sp = useSpring(raw, { stiffness: 60, damping: 24, mass: 1 })
  const rounded = useTransform(sp, (v) => Math.round(v).toLocaleString())

  React.useEffect(() => {
    const id = window.setTimeout(() => raw.set(value), startDelay)
    return () => window.clearTimeout(id)
  }, [value, startDelay, raw])

  // duration is used only by the consumer to know when other content can fade in
  void duration

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      className="flex items-baseline gap-1 font-semibold leading-none tracking-[-0.04em] text-white"
      style={{ fontSize: 'clamp(72px, 14vw, 180px)' }}
      aria-label={`${prefix ?? ''}${value}${suffix ?? ''}`}
    >
      {prefix && <span className="text-white/70">{prefix}</span>}
      <motion.span>{rounded}</motion.span>
      {suffix && <span className="text-white/70">{suffix}</span>}
    </motion.div>
  )
}
