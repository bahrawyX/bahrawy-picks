'use client'

/**
 * <BentoGrid /> & <BentoCard />
 *
 * Responsive bento-style grid layout with animated cards. Cards can span
 * multiple columns/rows and include Framer Motion entrance animations.
 *
 * @param columns    — Number of columns at desktop (default 3).
 * @param gap        — Grid gap in pixels (default 16).
 * @param className  — Additional classes for the grid.
 *
 * BentoCard:
 * @param colSpan    — Number of columns to span (default 1).
 * @param rowSpan    — Number of rows to span (default 1).
 * @param className  — Additional classes for the card.
 */

import * as React from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springGentle, fadeUp } from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BentoGridProps {
  children: React.ReactNode
  /** Number of columns at desktop breakpoint. */
  columns?: 2 | 3 | 4
  /** Grid gap in pixels. */
  gap?: number
  /** Additional classes for the grid container. */
  className?: string
}

export interface BentoCardProps {
  children: React.ReactNode
  /** Number of columns to span. */
  colSpan?: 1 | 2 | 3 | 4
  /** Number of rows to span. */
  rowSpan?: 1 | 2 | 3
  /** Additional classes for the card. */
  className?: string
}

// ---------------------------------------------------------------------------
// Grid column class maps
// ---------------------------------------------------------------------------

const gridColsMap: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

const colSpanMap: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
}

const rowSpanMap: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

export function BentoGrid({
  children,
  columns = 3,
  gap = 16,
  className,
}: BentoGridProps) {
  return (
    <LayoutGroup>
      <div
        className={cn('grid grid-cols-1', gridColsMap[columns], className)}
        style={{ gap }}
      >
        {children}
      </div>
    </LayoutGroup>
  )
}

export function BentoCard({
  children,
  colSpan = 1,
  rowSpan = 1,
  className,
}: BentoCardProps) {
  return (
    <motion.div
      layout
      {...fadeUp}
      transition={springGentle}
      className={cn(
        'overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6',
        colSpanMap[colSpan],
        rowSpanMap[rowSpan],
        className
      )}
    >
      {children}
    </motion.div>
  )
}
