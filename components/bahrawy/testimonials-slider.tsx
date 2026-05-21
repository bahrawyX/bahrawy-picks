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
import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  return (
    <section
      className={cn('w-full bg-black px-6 py-24 sm:py-32', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        {(eyebrow || heading) && (
          <div className="flex flex-col items-center gap-3">
            {eyebrow && (
              <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
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
    </section>
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
