'use client'

/**
 * <LogoCloud />
 *
 * "Trusted by" section — a horizontal marquee of partner logos with a soft
 * fade on both edges. Logos sit at low opacity by default and brighten on
 * individual hover. Set `marquee={false}` for a static grid instead.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LogoCloudItem {
  name: string
  /** Optional image URL (preferred); otherwise the name is rendered as text. */
  src?: string
  href?: string
}

export interface LogoCloudProps {
  items: LogoCloudItem[]
  eyebrow?: React.ReactNode
  /** Slide the row continuously left. Default true. */
  marquee?: boolean
  /** Seconds per loop when marquee. Default 28. */
  duration?: number
  className?: string
}

export function LogoCloud({
  items,
  eyebrow = 'Trusted by teams at',
  marquee = true,
  duration = 28,
  className,
}: LogoCloudProps) {
  return (
    <section className={cn('w-full bg-black px-6 py-16', className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-picks-fg/45">
            {eyebrow}
          </p>
        )}

        {marquee ? (
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div
              className="inline-flex w-max animate-marquee whitespace-nowrap motion-reduce:animate-none"
              style={{ ['--duration' as string]: `${duration}s` }}
            >
              {[0, 1].map((dup) => (
                <div
                  key={dup}
                  aria-hidden={dup === 1}
                  className="inline-flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
                >
                  {items.map((item, i) => (
                    <LogoItem key={`${dup}-${i}`} item={item} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid w-full grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((item, i) => (
              <LogoItem key={i} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function LogoItem({ item }: { item: LogoCloudItem }) {
  const inner = item.src ? (
    <img
      src={item.src}
      alt={item.name}
      className="h-7 w-auto opacity-50 transition-opacity duration-300 hover:opacity-100 sm:h-8"
      draggable={false}
    />
  ) : (
    <span className="text-lg font-semibold tracking-tight text-picks-fg/45 transition-colors duration-300 hover:text-picks-fg sm:text-xl">
      {item.name}
    </span>
  )

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name}>
        {inner}
      </a>
    )
  }
  return <span aria-label={item.name}>{inner}</span>
}
