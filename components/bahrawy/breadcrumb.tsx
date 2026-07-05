'use client'

/**
 * <Breadcrumb />
 *
 * Animated breadcrumb with chevron separators. Long trails collapse to a `…`
 * menu in the middle so the line never overflows. Hovering a crumb fades the
 * trailing ones for emphasis.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: React.ReactNode
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** Max visible crumbs (first + last + …). Default 4. */
  maxVisible?: number
  /** Separator node. Default ChevronRight. */
  separator?: React.ReactNode
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 30 }

export function Breadcrumb({
  items,
  maxVisible = 4,
  separator = <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />,
  className,
}: BreadcrumbProps) {
  const [expanded, setExpanded] = React.useState(false)
  const total = items.length
  const collapse = !expanded && total > maxVisible

  // Show first 1 + … + last (maxVisible - 2)
  let shown: Array<BreadcrumbItem | 'gap'> = items
  if (collapse) {
    const lastCount = Math.max(1, maxVisible - 2)
    shown = [items[0], 'gap', ...items.slice(total - lastCount)]
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex w-full', className)}>
      <ol className="flex min-w-0 items-center gap-1.5 text-sm text-picks-fg/70">
        {shown.map((entry, i) => {
          const isLast = i === shown.length - 1
          return (
            <React.Fragment key={i}>
              <li className="min-w-0 truncate">
                {entry === 'gap' ? (
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    aria-label="Show full path"
                    className="rounded-md px-1.5 py-1 text-picks-fg/50 transition-colors hover:bg-picks-fg/5 hover:text-picks-fg"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <BreadcrumbCrumb item={entry} isLast={isLast} />
                )}
              </li>
              {!isLast && (
                <li aria-hidden className="shrink-0 text-picks-fg/30">
                  {separator}
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

function BreadcrumbCrumb({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) {
  const className = cn(
    'inline-block truncate transition-colors',
    isLast ? 'font-medium text-picks-fg' : 'text-picks-fg/65 hover:text-picks-fg',
  )
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={String(item.label)}
        layout
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -6 }}
        transition={SPRING}
      >
        {item.href && !isLast ? (
          <a href={item.href} className={className}>
            {item.label}
          </a>
        ) : (
          <span aria-current={isLast ? 'page' : undefined} className={className}>
            {item.label}
          </span>
        )}
      </motion.span>
    </AnimatePresence>
  )
}
