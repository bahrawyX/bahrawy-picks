'use client'

/**
 * <ExpandButton />
 *
 * A round icon button that expands sideways on hover to reveal its
 * label — the "Learn more" chip that sits on portfolio project cards.
 * The label lives in a CSS grid column animating 0fr → 1fr, so any
 * label length works with no width measurement. The icon un-rotates
 * from -45° to 0° as it opens.
 *
 * Set `expandOn="group"` and place it inside a `group` element (e.g.
 * an image card) to open when the whole card is hovered.
 *
 * Keyboard focus expands it too — focus-visible on the button itself
 * (or focus-within on the parent `group`) mirrors the hover reveal.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export interface ExpandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text revealed on hover. */
  label: string
  /** Icon shown in the collapsed circle. Default link icon. */
  icon?: React.ReactNode
  /** Color style. Default 'light' (white chip, dark content). */
  tone?: 'light' | 'dark'
  /** 'self' opens on its own hover; 'group' opens when a parent `group` is hovered. Default 'self'. */
  expandOn?: 'self' | 'group'
  className?: string
}

export const ExpandButton = React.forwardRef<HTMLButtonElement, ExpandButtonProps>(
  ({ label, icon, tone = 'light', expandOn = 'self', className, ...rest }, ref) => {
    const groupTrigger = expandOn === 'group'
    return (
      <button
        ref={ref}
        className={cn(
          'flex h-9 min-w-9 items-center justify-center rounded-full px-[11px]',
          tone === 'light' ? 'bg-picks-fg text-picks-surface' : 'bg-picks-panel text-picks-fg',
          !groupTrigger && 'group/eb',
          className,
        )}
        {...rest}
      >
        <span
          className={cn(
            'grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-in-out',
            groupTrigger
              ? 'group-hover:grid-cols-[1fr] group-focus-within:grid-cols-[1fr]'
              : 'group-hover/eb:grid-cols-[1fr] group-focus-visible/eb:grid-cols-[1fr]',
          )}
        >
          <span
            className={cn(
              'min-w-0 overflow-hidden whitespace-nowrap text-[13px] font-medium opacity-0 transition-opacity duration-300',
              groupTrigger
                ? 'group-hover:opacity-100 group-hover:delay-100 group-focus-within:opacity-100 group-focus-within:delay-100'
                : 'group-hover/eb:opacity-100 group-hover/eb:delay-100 group-focus-visible/eb:opacity-100 group-focus-visible/eb:delay-100',
            )}
          >
            <span className="pr-1.5">{label}</span>
          </span>
        </span>
        <span
          className={cn(
            'shrink-0 -rotate-45 transition-transform duration-300 ease-in-out',
            groupTrigger
              ? 'group-hover:rotate-0 group-focus-within:rotate-0'
              : 'group-hover/eb:rotate-0 group-focus-visible/eb:rotate-0',
          )}
        >
          {icon ?? <LinkIcon />}
        </span>
      </button>
    )
  }
)
ExpandButton.displayName = 'ExpandButton'
