'use client'

/**
 * <FooterMinimal />
 *
 * A clean text footer: logo on the left, link columns on the right, copyright
 * row at the bottom. Light hover animations on links — they reveal a small
 * underline and shift right slightly. No clutter.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterColumn {
  heading: string
  links: FooterLink[]
}

export interface FooterMinimalProps {
  /** Logo node — a wordmark, an SVG, anything. */
  logo: React.ReactNode
  /** Short tagline below the logo. */
  tagline?: React.ReactNode
  columns: FooterColumn[]
  /** Bottom-row copyright text. */
  copyright?: React.ReactNode
  /** Right-aligned bottom-row items, e.g. social icons. */
  bottomRight?: React.ReactNode
  className?: string
}

export function FooterMinimal({
  logo,
  tagline,
  columns,
  copyright,
  bottomRight,
  className,
}: FooterMinimalProps) {
  return (
    <footer className={cn('w-full border-t border-picks-fg/10 bg-picks-surface px-6 py-16', className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Brand block */}
          <div className="flex flex-col gap-3">
            <div className="text-lg font-semibold text-picks-fg">{logo}</div>
            {tagline && (
              <p className="max-w-xs text-sm leading-relaxed text-picks-fg/55">{tagline}</p>
            )}
          </div>

          {/* Link columns */}
          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-picks-fg/40">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {(copyright || bottomRight) && (
          <div className="flex flex-col gap-2 border-t border-picks-fg/[0.06] pt-6 text-xs text-picks-fg/40 sm:flex-row sm:items-center sm:justify-between">
            {copyright && <p>{copyright}</p>}
            {bottomRight && <div className="flex items-center gap-3">{bottomRight}</div>}
          </div>
        )}
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// Animated link
// ---------------------------------------------------------------------------

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center gap-2 text-sm text-picks-fg/70 transition-colors hover:text-picks-fg"
    >
      <motion.span
        initial={false}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
        className="inline-flex items-center gap-2"
      >
        {link.label}
        <span
          aria-hidden
          className="block h-px w-0 bg-picks-fg transition-all duration-300 ease-out group-hover:w-6"
        />
      </motion.span>
    </a>
  )
}
