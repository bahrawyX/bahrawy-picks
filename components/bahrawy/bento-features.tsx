'use client'

/**
 * <BentoFeatures />
 *
 * A "bento" feature grid section with mixed-size cards arranged in a
 * landing-page-ready layout. Each card scroll-reveals with a stagger. This is
 * a section opinion (heading + grid); for raw bento composition use the
 * `BentoGrid` primitive.
 */

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface BentoFeatureItem {
  title: string
  body: string
  /** Optional eyebrow tag. */
  eyebrow?: string
  /** Optional decorative icon node. */
  icon?: React.ReactNode
  /** Visual variant for this card. Different gradients per accent. */
  accent?: 'neutral' | 'purple' | 'cyan' | 'pink' | 'amber' | 'emerald'
  /** Column span on lg screens (1–3). Default 1. */
  span?: 1 | 2 | 3
  /** Make this card extra tall on lg screens. */
  tall?: boolean
}

export interface BentoFeaturesProps {
  items: BentoFeatureItem[]
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  description?: React.ReactNode
  className?: string
}

const ACCENT_BG: Record<NonNullable<BentoFeatureItem['accent']>, string> = {
  neutral: 'bg-picks-fg/[0.02]',
  purple:
    'bg-[radial-gradient(ellipse_at_top_right,rgba(167,139,250,0.18),transparent_55%)]',
  cyan:
    'bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.18),transparent_55%)]',
  pink:
    'bg-[radial-gradient(ellipse_at_top_right,rgba(244,114,182,0.18),transparent_55%)]',
  amber:
    'bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.16),transparent_55%)]',
  emerald:
    'bg-[radial-gradient(ellipse_at_top_right,rgba(52,211,153,0.18),transparent_55%)]',
}

const SPAN_CLASS: Record<1 | 2 | 3, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
}

export function BentoFeatures({
  items,
  eyebrow,
  heading,
  description,
  className,
}: BentoFeaturesProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      ref={ref}
      className={cn('w-full bg-black px-6 py-24 sm:py-32', className)}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        {(eyebrow || heading || description) && (
          <div className="flex max-w-2xl flex-col gap-3">
            {eyebrow && (
              <span className="self-start rounded-full border border-picks-fg/15 bg-picks-fg/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-picks-fg/80">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-picks-fg sm:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-pretty text-sm leading-relaxed text-picks-fg/60 sm:text-base">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.2, 0, 0, 1],
              }}
              className={cn(
                'relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-picks-fg/10 p-6',
                ACCENT_BG[item.accent ?? 'neutral'],
                SPAN_CLASS[item.span ?? 1],
                item.tall && 'lg:row-span-2',
              )}
            >
              {item.icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-picks-fg/10 text-picks-fg">
                  {item.icon}
                </div>
              )}
              {item.eyebrow && (
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-picks-fg/55">
                  {item.eyebrow}
                </p>
              )}
              <h3 className="text-lg font-semibold tracking-tight text-picks-fg">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-picks-fg/60">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
