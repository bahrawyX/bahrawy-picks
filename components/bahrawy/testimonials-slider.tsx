'use client'

/**
 * <TestimonialsSlider />
 *
 * A section that rotates between testimonials on a timer (or manually via
 * the indicator dots). Each slide is a quote + author block; the AnimatePresence
 * crossfades between them with a tiny lift.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

export interface Testimonial {
  quote: string
  name: string
  role: string
  avatar?: string
  fallback?: string
}

export interface TestimonialsSliderProps {
  items: Testimonial[]
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  /** ms between auto-rotations. Set 0 to disable. Default 5500. */
  interval?: number
  /** Accent color for the quote glyph + dots. */
  accentColor?: string
  className?: string
}

export function TestimonialsSlider({
  items,
  eyebrow,
  heading,
  interval = 5500,
  accentColor = '#FFFFFF',
  className,
}: TestimonialsSliderProps) {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (interval <= 0 || paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [interval, paused, items.length])

  const current = items[index]
  const go = (next: number) => {
    const n = ((next % items.length) + items.length) % items.length
    setIndex(n)
  }

  return (
    <section
      className={cn('relative w-full bg-black px-6 py-24 sm:py-32', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        {(eyebrow || heading) && (
          <div className="flex flex-col items-center gap-3">
            {eyebrow && (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="font-display text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {heading}
              </h2>
            )}
          </div>
        )}

        <Quote className="h-8 w-8" style={{ color: accentColor }} strokeWidth={1.5} />

        <div className="relative min-h-[180px] w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className="absolute inset-0 flex flex-col items-center gap-6"
            >
              <blockquote className="text-pretty text-xl font-medium leading-snug text-white sm:text-2xl">
                "{current.quote}"
              </blockquote>
              <figcaption className="flex flex-col items-center gap-2">
                <Avatar item={current} />
                <p className="text-sm font-medium text-white">{current.name}</p>
                <p className="text-xs text-white/55">{current.role}</p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Indicator dots */}
        <div role="tablist" className="flex items-center gap-2">
          {items.map((_, i) => {
            const active = i === index
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className="group rounded-full p-1"
              >
                <span
                  className="block h-1.5 rounded-full transition-all"
                  style={{
                    width: active ? 28 : 6,
                    background: active ? accentColor : 'rgba(255,255,255,0.25)',
                  }}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Prev / Next arrows — iOS-style vibrancy chevrons */}
      <ArrowButton
        side="left"
        ariaLabel="Previous testimonial"
        onClick={() => go(index - 1)}
      />
      <ArrowButton
        side="right"
        ariaLabel="Next testimonial"
        onClick={() => go(index + 1)}
      />
    </section>
  )
}

function ArrowButton({
  side,
  onClick,
  ariaLabel,
}: {
  side: 'left' | 'right'
  onClick: () => void
  ariaLabel: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      transition={APPLE_SPRING}
      className={cn(
        'absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/80 backdrop-blur-2xl transition-colors hover:bg-white/[0.08] hover:text-white',
        side === 'left' ? 'left-4 sm:left-8' : 'right-4 sm:right-8',
      )}
      style={{
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 18px -8px rgba(0,0,0,0.6)',
      }}
    >
      {side === 'left' ? (
        <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
      ) : (
        <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
      )}
    </motion.button>
  )
}

function Avatar({ item }: { item: Testimonial }) {
  if (item.avatar) {
    return (
      <img
        src={item.avatar}
        alt={item.name}
        className="h-10 w-10 rounded-full object-cover"
        draggable={false}
      />
    )
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
      {item.fallback ?? item.name.slice(0, 1).toUpperCase()}
    </div>
  )
}
