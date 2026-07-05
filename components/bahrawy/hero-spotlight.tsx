'use client'

/**
 * <HeroSpotlight />
 *
 * A centered hero with a radial spotlight that follows the cursor across the
 * section. Spring-smoothed so the spotlight glides instead of snapping. Tagline
 * + big headline + dual CTA. Designed to drop straight on a landing page.
 */

import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface HeroSpotlightProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  /** Tailwind classes for the spotlight color (gradient stops). Default a warm white. */
  spotlightClassName?: string
  /** Section min-height. Default '100vh'. */
  minHeight?: string
  className?: string
}

const SMOOTH = { stiffness: 220, damping: 32, mass: 0.6 }

/** Renders an `<a>` when the CTA has an href, otherwise a `<button>` with identical styling. */
function CtaAction({
  cta,
  className,
}: {
  cta: { label: string; href?: string; onClick?: () => void }
  className: string
}) {
  if (cta.href) {
    return (
      <a href={cta.href} onClick={cta.onClick} className={className}>
        {cta.label}
      </a>
    )
  }
  return (
    <button type="button" onClick={cta.onClick} className={className}>
      {cta.label}
    </button>
  )
}

export function HeroSpotlight({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  spotlightClassName,
  minHeight = '100vh',
  className,
}: HeroSpotlightProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.3)
  const sx = useSpring(mouseX, SMOOTH)
  const sy = useSpring(mouseY, SMOOTH)
  // Convert 0-1 motion values into CSS percentages for radial-gradient.
  const bgPos = useTransform([sx, sy], ([x, y]: number[]) => `${x * 100}% ${y * 100}%`)
  const spotlight = useTransform(
    bgPos,
    (pos) =>
      `radial-gradient(circle 600px at ${pos}, rgb(var(--picks-fg-rgb) / 0.16), transparent 60%)`,
  )

  const handleMove = (e: React.MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mouseX.set(0.5)
        mouseY.set(0.3)
      }}
      style={{ minHeight }}
      className={cn(
        'relative isolate flex w-full items-center justify-center overflow-hidden bg-picks-surface',
        className,
      )}
    >
      {/* Spotlight that follows the cursor */}
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className={cn('pointer-events-none absolute inset-0', spotlightClassName)}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgb(var(--picks-fg-rgb)/0.5)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--picks-fg-rgb)/0.5)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="rounded-full border border-picks-fg/15 bg-picks-fg/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-picks-fg/80 backdrop-blur"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.2, 0, 0, 1] }}
          className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-picks-fg sm:text-6xl md:text-7xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0, 0, 1] }}
            className="max-w-xl text-pretty text-base leading-relaxed text-picks-fg/65 sm:text-lg"
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
              <CtaAction
                cta={primaryCta}
                className="inline-flex items-center justify-center rounded-full bg-picks-fg px-5 py-2.5 text-sm font-semibold text-picks-surface transition-colors hover:bg-picks-fg/85"
              />
            )}
            {secondaryCta && (
              <CtaAction
                cta={secondaryCta}
                className="inline-flex items-center justify-center rounded-full border border-picks-fg/20 px-5 py-2.5 text-sm font-medium text-picks-fg/90 transition-colors hover:bg-picks-fg/10"
              />
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
