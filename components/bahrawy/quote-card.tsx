'use client'

/**
 * <QuoteCard />
 *
 * A pull-quote card: optional large quotation glyph, the quote itself, author
 * avatar + name + role. Animated reveal: the glyph and quote fade up with a
 * small stagger.
 */

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuoteCardProps {
  quote: React.ReactNode
  author: {
    name: string
    role?: string
    avatar?: string
    /** Initial fallback when no avatar. */
    fallback?: string
  }
  /** Show the decorative quote glyph. Default true. */
  showGlyph?: boolean
  /** Accent color for the glyph. Default rgba(255,255,255,0.25). */
  accentColor?: string
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 220, damping: 26, mass: 0.9 }

export function QuoteCard({
  quote,
  author,
  showGlyph = true,
  accentColor = 'rgb(var(--picks-fg-rgb) / 0.25)',
  className,
}: QuoteCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={SPRING}
      className={cn(
        'relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-picks-fg/10 bg-picks-fg/[0.02] p-5 sm:p-6',
        className,
      )}
    >
      {showGlyph && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ ...SPRING, delay: 0.06 }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: `${accentColor}33` }}
        >
          <Quote className="h-4 w-4" style={{ color: accentColor }} strokeWidth={2} />
        </motion.span>
      )}

      <motion.blockquote
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...SPRING, delay: 0.12 }}
        className="text-balance text-lg leading-snug text-picks-fg sm:text-xl"
      >
        "{quote}"
      </motion.blockquote>

      <motion.figcaption
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...SPRING, delay: 0.18 }}
        className="flex items-center gap-3"
      >
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="h-9 w-9 rounded-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-picks-fg/10 text-sm font-semibold text-picks-fg">
            {author.fallback ?? author.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-picks-fg">{author.name}</span>
          {author.role && (
            <span className="text-xs text-picks-fg/55">{author.role}</span>
          )}
        </div>
      </motion.figcaption>
    </motion.figure>
  )
}
