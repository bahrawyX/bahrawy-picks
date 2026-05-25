'use client'

/**
 * <Pagination />  —  Apple-style page navigator.
 *
 * Numbered pills with ellipsis-collapsing for long ranges (always
 * shows first, last, and a window around current), prev / next chevron
 * buttons, layoutId-driven active pill that glides between numbers,
 * disabled at boundaries, keyboard friendly.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  /** 1-based page index. */
  page: number
  /** Total number of pages. */
  pageCount: number
  onPageChange: (next: number) => void
  /** Window of pages shown around `page`. Default 1 (so page-1, page, page+1). */
  siblings?: number
  /** Show first / last shortcut buttons. Default false. */
  showFirstLast?: boolean
  className?: string
}

const APPLE_LAYOUT = { type: 'spring' as const, stiffness: 480, damping: 36 }

function pageItems(page: number, total: number, siblings: number): (number | 'gap')[] {
  if (total <= 7 + siblings * 2) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const out: (number | 'gap')[] = []
  const left = Math.max(2, page - siblings)
  const right = Math.min(total - 1, page + siblings)
  out.push(1)
  if (left > 2) out.push('gap')
  for (let i = left; i <= right; i++) out.push(i)
  if (right < total - 1) out.push('gap')
  out.push(total)
  return out
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  showFirstLast = false,
  className,
}: PaginationProps) {
  const items = React.useMemo(
    () => pageItems(page, pageCount, siblings),
    [page, pageCount, siblings],
  )
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '')

  const goto = (p: number) => {
    const next = Math.max(1, Math.min(pageCount, p))
    if (next !== page) onPageChange(next)
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-white/[0.06] p-1 backdrop-blur-xl',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
      }}
    >
      {showFirstLast && (
        <Btn
          ariaLabel="First page"
          disabled={page === 1}
          onClick={() => goto(1)}
        >
          «
        </Btn>
      )}
      <Btn
        ariaLabel="Previous page"
        disabled={page === 1}
        onClick={() => goto(page - 1)}
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
      </Btn>

      {items.map((it, i) =>
        it === 'gap' ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className="px-1.5 text-[12px] text-white/35"
          >
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            aria-current={it === page ? 'page' : undefined}
            onClick={() => goto(it)}
            className={cn(
              'relative inline-flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 font-mono text-[12px] font-medium tabular-nums tracking-tight transition-colors',
              it === page ? 'text-white' : 'text-white/65 hover:text-white',
            )}
          >
            {it === page && (
              <motion.span
                layoutId={`pagination-active-${id}`}
                className="absolute inset-0 rounded-full bg-white/[0.1]"
                style={{
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(255,255,255,0.1)',
                }}
                transition={APPLE_LAYOUT}
              />
            )}
            <span className="relative">{it}</span>
          </button>
        ),
      )}

      <Btn
        ariaLabel="Next page"
        disabled={page === pageCount}
        onClick={() => goto(page + 1)}
      >
        <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
      </Btn>
      {showFirstLast && (
        <Btn
          ariaLabel="Last page"
          disabled={page === pageCount}
          onClick={() => goto(pageCount)}
        >
          »
        </Btn>
      )}
    </nav>
  )
}

function Btn({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/65"
    >
      {children}
    </button>
  )
}
