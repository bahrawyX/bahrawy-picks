'use client'

/**
 * <FaqSection />
 *
 * Apple-style FAQ section. Heading on the left, single-column FAQ list on
 * the right. Each row: bold display question + chevron, expanding cleanly
 * to reveal the answer. Hairline dividers between items, faint hover tint,
 * no accent colors or glows.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
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
  /** Accent color (kept for API compatibility — not used in the Apple-styled look). */
  accentColor?: string
  className?: string
}

const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

export function FaqSection({
  items,
  eyebrow,
  heading = 'Frequently asked.',
  description,
  defaultOpen,
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
            <span className="self-start rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="max-w-xs text-[14px] leading-relaxed text-white/55">{description}</p>
          )}
        </div>

        {/* Right — questions */}
        <div className="flex flex-col border-t border-white/[0.06]">
          {items.map((item) => {
            const open = item.id === openId
            return (
              <FaqRow
                key={item.id}
                item={item}
                open={open}
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
}: {
  item: FaqItem
  open: boolean
  onToggle: () => void
}) {
  const id = React.useId()
  return (
    <div className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.02]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center gap-4 px-1 py-5 text-left"
      >
        <span className="font-display min-w-0 flex-1 text-[17px] font-semibold leading-snug tracking-tight text-white sm:text-[18px]">
          {item.question}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={APPLE_SPRING}
          className="shrink-0 text-white/45"
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={APPLE_SPRING}
            style={{ overflow: 'hidden' }}
          >
            <div className="max-w-[52ch] px-1 pb-6 pr-8 text-[14px] leading-relaxed text-white/65">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
