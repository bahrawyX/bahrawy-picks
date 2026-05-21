'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CardStackItem {
  /** Stable identifier for keys and a11y. */
  id: string
  /** Small tag rendered above the title — e.g. "Craft". */
  eyebrow?: string
  /** The main display title for the card. Supports `\n` for line breaks. */
  title: string
  /** Optional body copy. */
  body?: string
  /** CSS background string (gradient, solid, etc.) for the card. */
  background?: string
  /** Foreground text color. Defaults to white. */
  foreground?: string
  /** Free-form footer / tag row content. */
  meta?: ReactNode
  /** Free-form CTA — e.g. a link or button. */
  cta?: ReactNode
}

export interface CardStackScrollProps {
  cards: CardStackItem[]
  /**
   * Each card's sticky `top` offset grows by this many pixels per card index
   * to create a "fanned deck" reveal. Default 0 → cards fully cover each other.
   */
  topStep?: number
  /** How much each preceding card shrinks per card layered on top of it. */
  scaleStep?: number
  /**
   * How dim each preceding card gets while it's covered.
   * Default 1 → no dimming, so cards stay fully solid behind each other.
   */
  opacityFloor?: number
  /** Page background color — what shows between/around cards. */
  backgroundClassName?: string
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CardStackScroll({
  cards,
  topStep = 0,
  scaleStep = 0.04,
  opacityFloor = 1,
  backgroundClassName = 'bg-zinc-950',
  className,
}: CardStackScrollProps) {
  return (
    <div className={cn('relative', backgroundClassName, className)}>
      {cards.map((card, i) => (
        <CardScene
          key={card.id}
          card={card}
          index={i}
          total={cards.length}
          topStep={topStep}
          scaleStep={scaleStep}
          opacityFloor={opacityFloor}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Single sticky card section                                         */
/* ------------------------------------------------------------------ */

interface CardSceneProps {
  card: CardStackItem
  index: number
  total: number
  topStep: number
  scaleStep: number
  opacityFloor: number
}

function CardScene({
  card,
  index,
  total,
  topStep,
  scaleStep,
  opacityFloor,
}: CardSceneProps) {
  const sectionRef = useRef<HTMLElement>(null)

  // 'start start' = section top reaches viewport top  (this card just pinned)
  // 'end start'   = section bottom reaches viewport top  (next card fully covers)
  // While this progress runs 0 → 1, the *next* card is sliding over the
  // current one — so this is exactly the range to shrink + dim by.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const targetScale = 1 - (total - index - 1) * scaleStep
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  // Last card never gets covered, so it never fades.
  const isLast = index === total - 1
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    [1, isLast ? 1 : opacityFloor]
  )

  // The fan offset — each card pins slightly lower than the previous, so the
  // top edges of the older cards peek out behind the new one.
  const stickyTop = index * topStep
  const fg = card.foreground ?? '#FFFFFF'

  return (
    <div ref={sectionRef} className="relative">
      <section
        className="sticky flex h-screen items-start justify-center px-4 sm:px-6 md:px-10"
        style={{ top: `${stickyTop}px` }}
      >
        <motion.article
          style={{ scale, opacity, background: card.background, color: fg }}
          className={cn(
            'relative mx-auto mt-12 w-full max-w-5xl overflow-hidden',
            'rounded-[28px] border border-white/10',
            'shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]',
            'origin-top',
          )}
        >
          <CardContent card={card} index={index} total={total} />
        </motion.article>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Card content — single column, big number, no decorative panel      */
/* ------------------------------------------------------------------ */

function CardContent({
  card,
  index,
  total,
}: {
  card: CardStackItem
  index: number
  total: number
}) {
  return (
    <div className="relative flex min-h-[68vh] flex-col justify-between gap-12 p-8 sm:p-12 md:p-16 lg:p-20">
      {/* Numeric watermark — anchored to the right edge, vertically centered.
          Made huge so it carries the whole right side of the card now that the
          decorative panel is gone. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-semibold leading-none tracking-[-0.06em] opacity-[0.10] sm:right-0 md:right-4"
        style={{
          fontSize: 'clamp(280px, 42vw, 620px)',
          color: 'currentColor',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Copy block */}
      <div className="relative z-10 max-w-3xl">
        {card.eyebrow && (
          <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] opacity-70">
            <span
              aria-hidden
              className="inline-block h-[2px] w-7 rounded-full"
              style={{ backgroundColor: 'currentColor', opacity: 0.55 }}
            />
            {card.eyebrow}
          </p>
        )}

        <h3 className="whitespace-pre-line text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-7xl">
          {card.title}
        </h3>

        {card.body && (
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed opacity-75 sm:text-lg">
            {card.body}
          </p>
        )}
      </div>

      {/* Footer row */}
      <div className="relative z-10 flex flex-wrap items-center gap-4">
        {card.meta && (
          <div className="text-[11px] uppercase tracking-[0.22em] opacity-60">
            {card.meta}
          </div>
        )}
        {card.cta && <div>{card.cta}</div>}
        <span
          className="ml-auto font-mono text-[11px] tracking-widest opacity-50"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')} · {String(total).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
