'use client'

/**
 * <CardStackScroll />
 *
 * A deck of cards that physically stacks as you scroll. The classic
 * "sticky cards" pattern, done right:
 *
 *  - ALL cards live inside ONE tall container (height = N × 100vh).
 *  - Each card is `position: sticky` with progressive `top` offsets
 *    (so card 2 pins a few px below card 1, card 3 below card 2, etc.).
 *  - As you scroll, each card pins when its natural position crosses
 *    its `top` value — and because they share a containing block,
 *    every PREVIOUS card stays pinned while the new one lands ON TOP
 *    of it (later in DOM = higher paint order).
 *  - A single shared `useScroll` reads container progress 0 → 1; per
 *    card we map that to a `scale` tween. A card starts shrinking the
 *    moment the next card lands on it, so the deck reads as receding
 *    into depth.
 *
 * Critical: there is exactly ONE container. The component used to
 * give each card its own wrapper, which split the sticky containing
 * blocks and broke the stack — fixed.
 */

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardStackItem {
  /** Stable identifier for keys and a11y. */
  id: string
  /** Small tag rendered above the title — e.g. "Craft". */
  eyebrow?: string
  /** Main display title. Supports `\n` for line breaks. */
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
   * Pixels of progressive `top` offset between sticky cards. Larger
   * = more of each previous card peeks out from under the new one.
   * Default 18.
   */
  topStep?: number
  /** How much each preceding card shrinks per card layered on. Default 0.04. */
  scaleStep?: number
  /**
   * Opacity of a card after every later card has landed on it. 1
   * keeps it fully solid (default — visible only via top-offset
   * peeking); lower values dim the deck.
   */
  opacityFloor?: number
  /** Page background between/around cards. */
  backgroundClassName?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CardStackScroll({
  cards,
  topStep = 18,
  scaleStep = 0.04,
  opacityFloor = 1,
  backgroundClassName = 'bg-zinc-950',
  className,
}: CardStackScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Total scroll runway — one viewport per card so each gets ~100vh
  // of scroll to land its sticky on the deck.
  const totalHeight = cards.length * 100 // vh

  // ONE shared progress reading. `start start` = container top reaches
  // viewport top; `end end` = container bottom reaches viewport bottom.
  // Linear 0 → 1 across the entire stack.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div
      ref={containerRef}
      className={cn('relative', backgroundClassName, className)}
      style={{ height: `${totalHeight}vh` }}
    >
      {cards.map((card, i) => (
        <CardScene
          key={card.id}
          card={card}
          index={i}
          total={cards.length}
          topStep={topStep}
          scaleStep={scaleStep}
          opacityFloor={opacityFloor}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// One sticky card section
// ---------------------------------------------------------------------------

interface CardSceneProps {
  card: CardStackItem
  index: number
  total: number
  topStep: number
  scaleStep: number
  opacityFloor: number
  scrollYProgress: MotionValue<number>
}

function CardScene({
  card,
  index,
  total,
  topStep,
  scaleStep,
  opacityFloor,
  scrollYProgress,
}: CardSceneProps) {
  // A card starts shrinking the MOMENT the NEXT card lands on top of
  // it. That happens at scroll progress ≈ (index + 1) / total.
  //
  // From there to progress = 1, this card shrinks down to:
  //   1 − (total − index − 1) × scaleStep
  // — one scaleStep per later card that comes to rest on top of it.
  //
  // For the LAST card the input range collapses to [1, 1] which
  // `useTransform` handles correctly: the value never moves off 1.
  const targetScale = 1 - Math.max(0, total - index - 1) * scaleStep
  const scale = useTransform(
    scrollYProgress,
    [(index + 1) / total, 1],
    [1, targetScale],
    { clamp: true },
  )
  const opacity = useTransform(
    scrollYProgress,
    [(index + 1) / total, 1],
    [1, index === total - 1 ? 1 : opacityFloor],
    { clamp: true },
  )

  // Progressive sticky top so the deck "fans" — each card pins a few
  // px lower than the previous, leaving the top edge of older cards
  // peeking out from under newer ones.
  const stickyTop = index * topStep
  const fg = card.foreground ?? '#FFFFFF'

  return (
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
  )
}

// ---------------------------------------------------------------------------
// Card body — single column, big number watermark, footer meta row
// ---------------------------------------------------------------------------

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
      {/* Numeric watermark on the right edge */}
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
          {String(index + 1).padStart(2, '0')} ·{' '}
          {String(total).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
