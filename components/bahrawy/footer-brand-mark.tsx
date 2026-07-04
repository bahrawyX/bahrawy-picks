'use client'

/**
 * <FooterBrandMark />
 *
 * A bold footer with a giant wordmark stretched across the bottom. The
 * wordmark starts dim and far below, then drifts up + brightens as the
 * section scrolls into view (useScroll on the footer's own ref). Above it
 * sit compact link columns + a copyright row.
 */

import * as React from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface FooterBrandLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterBrandColumn {
  heading: string
  links: FooterBrandLink[]
}

export interface FooterBrandMarkProps {
  /** The giant text drawn across the bottom — e.g. your brand name. */
  brandMark: string
  /** Small tagline shown above the brandmark. */
  tagline?: React.ReactNode
  columns?: FooterBrandColumn[]
  copyright?: React.ReactNode
  bottomRight?: React.ReactNode
  /** Color of the brandmark text. Default white. */
  markColor?: string
  /**
   * Class applied to the brandmark text — pass a display-font class
   * (e.g. from `next/font`) for the poster look. Defaults to the
   * inherited font.
   */
  fontClassName?: string
  className?: string
}

export function FooterBrandMark({
  brandMark,
  tagline,
  columns = [],
  copyright,
  bottomRight,
  markColor = '#FFFFFF',
  fontClassName = '',
  className,
}: FooterBrandMarkProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  })
  // Spring-smooth for a nicer feel than raw progress
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.7,
  })

  // Mark animates from below + dim → settled + bright as you scroll into the footer.
  const yPercent = useTransform(smooth, [0, 1], ['18%', '0%'])
  const opacity = useTransform(smooth, [0, 1], [0.12, 1])
  const blur = useTransform(smooth, [0, 1], ['8px', '0px'])

  return (
    <footer
      ref={sectionRef}
      className={cn(
        'relative w-full overflow-hidden border-t border-white/10 bg-black px-6 pt-16',
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        {/* Tagline + columns row */}
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {tagline ? (
            <p className="max-w-sm text-sm leading-relaxed text-white/65">
              {tagline}
            </p>
          ) : (
            <div />
          )}

          {columns.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-3">
              {columns.map((col) => (
                <div key={col.heading} className="flex flex-col gap-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                    {col.heading}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className="text-sm text-white/70 transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Copyright bar */}
        {(copyright || bottomRight) && (
          <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            {copyright && <p>{copyright}</p>}
            {bottomRight && <div className="flex items-center gap-3">{bottomRight}</div>}
          </div>
        )}
      </div>

      {/* The giant wordmark — uses an SVG so the text always fits the
          footer's width regardless of how long the brand string is.
          The viewBox ratio (1000×200) gives us a tall display-face feel;
          preserveAspectRatio="xMidYMid meet" + textLength keep it flush. */}
      <motion.div
        aria-hidden
        style={{
          y: yPercent,
          opacity,
          filter: useTransform(blur, (b) => `blur(${b})`),
        }}
        className="relative mt-8 overflow-hidden"
      >
        <svg
          viewBox="0 0 1000 220"
          className="block w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={brandMark}
        >
          <text
            x="500"
            y="190"
            textAnchor="middle"
            fontSize="220"
            letterSpacing="-3"
            className={fontClassName}
            fill={markColor}
            // Force the text to span the full viewBox width so long brand
            // names compress and short ones still feel huge.
            textLength="980"
            lengthAdjust="spacingAndGlyphs"
          >
            {brandMark.toUpperCase()}
          </text>
        </svg>
      </motion.div>
    </footer>
  )
}
