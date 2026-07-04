'use client'

/**
 * <Ticker /> + <TickerRow />
 *
 * Inline stock ticker — logo + symbol + price + signed delta with an
 * up/down triangle. When the price changes, the row briefly flashes
 * green/red and the delta number scales up for an instant. Tabular
 * numerals throughout so digits never reflow.
 *
 * <TickerRow> wraps a list of tickers in a marquee that scrolls
 * horizontally, pausing on hover. Use it as a financial-news strip.
 */

import * as React from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TickerProps {
  symbol: string
  price: number
  /** Signed change vs. previous close. */
  delta: number
  /** Signed percent change. Computed from delta + price if omitted. */
  pct?: number
  /** Optional logo node (img / circle / initial). Rendered ~18px. */
  logo?: React.ReactNode
  /** Currency prefix. Default '$'. */
  currency?: string
  /** Number of decimal places on price. Default 2. */
  precision?: number
  className?: string
}

export function Ticker({
  symbol,
  price,
  delta,
  pct,
  logo,
  currency = '$',
  precision = 2,
  className,
}: TickerProps) {
  const isUp = delta >= 0
  const colorClass = isUp ? 'text-emerald-400' : 'text-rose-400'
  const flashBg = isUp ? 'bg-emerald-400/8' : 'bg-rose-400/8'
  const Icon = isUp ? TrendingUp : TrendingDown
  const flash = useAnimationControls()
  const prevPrice = React.useRef(price)
  const deltaControls = useAnimationControls()

  const computedPct =
    pct !== undefined ? pct : price !== 0 ? (delta / (price - delta)) * 100 : 0

  React.useEffect(() => {
    if (prevPrice.current !== price) {
      flash.start({
        opacity: [0, 1, 0],
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      })
      deltaControls.start({
        scale: [1, 1.12, 1],
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      })
      prevPrice.current = price
    }
  }, [price, flash, deltaControls])

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-1.5 pl-1.5 pr-3',
        className,
      )}
    >
      {/* Flash overlay */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={flash}
        className={cn('pointer-events-none absolute inset-0 rounded-full', flashBg)}
      />

      {logo && (
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.04]">
          {logo}
        </span>
      )}

      <span className="relative font-display text-[12px] font-semibold tracking-tight text-white/90">
        {symbol}
      </span>

      <span className="relative font-mono text-[12px] tabular-nums text-white/85">
        {currency}
        {price.toFixed(precision)}
      </span>

      <motion.span
        animate={deltaControls}
        className={cn(
          'relative inline-flex items-center gap-0.5 font-mono text-[12px] tabular-nums',
          colorClass,
        )}
      >
        <Icon className="h-3 w-3" strokeWidth={2.5} />
        <span>{isUp ? '+' : ''}{delta.toFixed(precision)}</span>
        <span className="text-[10.5px] opacity-70">
          ({isUp ? '+' : ''}{computedPct.toFixed(2)}%)
        </span>
      </motion.span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// <TickerRow /> — horizontal marquee of multiple tickers
// ---------------------------------------------------------------------------

export interface TickerRowProps {
  items: TickerProps[]
  /** Seconds per full loop. Default 32. */
  duration?: number
  /** Pause on hover. Default true. */
  pauseOnHover?: boolean
  /** Gap between tickers (px). Default 16. */
  gap?: number
  className?: string
}

export function TickerRow({
  items,
  duration = 32,
  pauseOnHover = true,
  gap = 16,
  className,
}: TickerRowProps) {
  // The marquee is a CSS keyframe (not a framer transform) so that
  // hover-pause can work — animation-play-state has no effect on
  // JS-driven transforms.
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '')
  // Duplicate the list so the loop has no visible seam.
  const doubled = [...items, ...items]
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] py-3',
        '[mask-image:linear-gradient(to_right,transparent,black_60px,black_calc(100%-60px),transparent)]',
        pauseOnHover && 'group',
        className,
      )}
    >
      <div
        className={cn(
          `bahrawy-ticker-${id} flex w-max items-center`,
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{ gap }}
      >
        {doubled.map((item, i) => (
          <Ticker key={`${item.symbol}-${i}`} {...item} />
        ))}
      </div>
      {/* The animation lives in a class (not inline style) so the
          group-hover play-state rule can actually override it. */}
      <style>{`
        .bahrawy-ticker-${id} {
          animation: bahrawy-ticker-${id}-kf ${duration}s linear infinite;
        }
        @keyframes bahrawy-ticker-${id}-kf {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bahrawy-ticker-${id} { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
