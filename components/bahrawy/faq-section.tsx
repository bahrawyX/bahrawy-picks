'use client'

/**
 * <FaqSection />
 *
 * A section-styled FAQ that reuses the Accordion's open/close behavior but
 * presents it as a centered two-column section: heading on the left, the
 * accordion list on the right.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FaqItem {
  id: string
  question: React.ReactNode
  answer: React.ReactNode
}

export interface FaqSectionProps {
  items: FaqItem[]
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  description?: React.ReactNode
  /** Open this id by default. */
  defaultOpen?: string
  /** Accent color for the active row + plus icon when open. */
  accentColor?: string
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 320, damping: 28, mass: 0.9 }

export function FaqSection({
  items,
  eyebrow,
  heading = 'Frequently asked.',
  description,
  defaultOpen,
  accentColor = '#FFFFFF',
  className,
}: FaqSectionProps) {
  const [openId, setOpenId] = React.useState<string | null>(
    defaultOpen ?? items[0]?.id ?? null,
  )

  return (
    <section className={cn('w-full bg-black px-6 py-24 sm:py-32', className)}>
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.5fr]">
        {/* Left — heading */}
        <div className="flex flex-col gap-3">
          {eyebrow && (
            <span className="self-start rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
              {eyebrow}
            </span>
          )}
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="max-w-xs text-sm leading-relaxed text-white/55">{description}</p>
          )}
        </div>

        {/* Right — questions */}
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const open = item.id === openId
            return (
              <FaqRow
                key={item.id}
                item={item}
                open={open}
                accentColor={accentColor}
                onToggle={() => setOpenId(open ? null : item.id)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FaqRow({
  item,
  open,
  onToggle,
  accentColor,
}: {
  item: FaqItem
  open: boolean
  onToggle: () => void
  accentColor: string
}) {
  const id = React.useId()
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-white/[0.02] transition-colors',
        open ? 'border-white/20' : 'border-white/10 hover:bg-white/[0.04]',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className="min-w-0 flex-1 text-base font-medium text-white">
          {item.question}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={SPRING}
          style={{ color: open ? accentColor : 'rgba(255,255,255,0.5)' }}
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-white/70">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
