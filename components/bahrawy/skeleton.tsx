'use client'

/**
 * <Skeleton /> + <SkeletonText />
 *
 * Shimmer placeholder for loading states. Use `<Skeleton />` for arbitrary
 * shapes (rect/circle) and `<SkeletonText />` for multi-line text blocks
 * that taper on the last line — the standard "fake paragraph" pattern.
 *
 * @param width      — CSS width. Default '100%'.
 * @param height     — CSS height. Default '1rem'.
 * @param shape      — 'rect' | 'circle' | 'pill'. Default 'rect'.
 * @param className  — Extra classes.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps {
  width?: number | string
  height?: number | string
  shape?: 'rect' | 'circle' | 'pill'
  className?: string
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  shape = 'rect',
  className,
}: SkeletonProps) {
  const radius =
    shape === 'circle' ? '9999px' : shape === 'pill' ? '9999px' : '0.5rem'

  return (
    <span
      role="status"
      aria-busy="true"
      style={{ width, height, borderRadius: radius }}
      className={cn(
        // Base + shimmer overlay. The shimmer is a faint white sweep that
        // glides left→right on the `shimmer` keyframe (defined in tailwind.config).
        'block bg-picks-fg/[0.06] [background-image:linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)] [background-size:200%_100%] animate-shimmer',
        className,
      )}
    />
  )
}

// ---------------------------------------------------------------------------
// SkeletonText — quick helper for multi-line text placeholders
// ---------------------------------------------------------------------------

export interface SkeletonTextProps {
  /** Number of lines. Default 3. */
  lines?: number
  /** Line height (CSS). Default '0.85rem'. */
  lineHeight?: number | string
  /** Gap between lines (CSS). Default '0.55rem'. */
  gap?: number | string
  /** Width of the last line (0–1). Default 0.6 → 60% of normal. */
  lastLineWidth?: number
  className?: string
}

export function SkeletonText({
  lines = 3,
  lineHeight = '0.85rem',
  gap = '0.55rem',
  lastLineWidth = 0.6,
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col', className)} style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1
        const w = isLast ? `${Math.round(lastLineWidth * 100)}%` : '100%'
        return <Skeleton key={i} width={w} height={lineHeight} />
      })}
    </div>
  )
}
