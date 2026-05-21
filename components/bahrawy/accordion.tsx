'use client'

/**
 * <Accordion />
 *
 * A minimal, bouncy accordion. Each item is a header you click to toggle a
 * collapsible content panel below. The expand/collapse uses a spring that
 * overshoots slightly — so the panel "bounces" into place instead of just
 * easing.
 *
 * @param items         — Array of `{ id, title, content }` rows.
 * @param type          — 'single' (only one open at a time) or 'multiple'.
 * @param defaultOpen   — IDs to start open with.
 * @param chevron       — Show the rotating chevron icon. Default true.
 * @param bounciness    — 0–1. How springy the open/close motion is. Default 0.7.
 * @param className     — Extra classes for the outer wrapper.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AccordionItem {
  id: string
  title: React.ReactNode
  content: React.ReactNode
  /** Optional icon / glyph rendered before the title. */
  icon?: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  type?: 'single' | 'multiple'
  defaultOpen?: string[]
  chevron?: boolean
  bounciness?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build the spring from a 0–1 "bounciness". Lower damping = more overshoot. */
function springFor(bounciness: number) {
  const b = Math.max(0, Math.min(1, bounciness))
  // damping ranges from 28 (no bounce) down to 11 (very bouncy)
  return {
    type: 'spring' as const,
    stiffness: 380,
    damping: 28 - b * 17,
    mass: 0.9,
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Accordion({
  items,
  type = 'single',
  defaultOpen = [],
  chevron = true,
  bounciness = 0.7,
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>(defaultOpen)
  const spring = React.useMemo(() => springFor(bounciness), [bounciness])

  const toggle = React.useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const isOpen = prev.includes(id)
        if (type === 'single') return isOpen ? [] : [id]
        return isOpen ? prev.filter((x) => x !== id) : [...prev, id]
      })
    },
    [type],
  )

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          open={openIds.includes(item.id)}
          chevron={chevron}
          spring={spring}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Single row
// ---------------------------------------------------------------------------

interface AccordionRowProps {
  item: AccordionItem
  open: boolean
  chevron: boolean
  spring: ReturnType<typeof springFor>
  onToggle: () => void
}

function AccordionRow({ item, open, chevron, spring, onToggle }: AccordionRowProps) {
  const contentId = React.useId()

  return (
    <motion.div
      layout
      transition={spring}
      className={cn(
        'overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]',
        'backdrop-blur-sm transition-colors',
        open ? 'border-white/15 bg-white/[0.04]' : 'hover:bg-white/[0.035]',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        {item.icon && (
          <span className="shrink-0 text-white/70">{item.icon}</span>
        )}
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-white">
          {item.title}
        </span>
        {chevron && (
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={spring}
            className="shrink-0"
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-colors',
                open ? 'text-white' : 'text-white/40',
              )}
            />
          </motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            style={{ overflow: 'hidden' }}
          >
            {/* The inner padding lives on a child so the height anim measures
                only the natural content height — no padding-jank. */}
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={spring}
              className="px-5 pb-5 pt-1 text-sm leading-relaxed text-white/70"
            >
              {item.content}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
