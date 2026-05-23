'use client'

/**
 * <Queue />
 *
 * Linear/Things-style collapsible task groups. Each group has a title
 * with a live count; click toggles the section open/closed with a
 * spring-eased height animation. Items have a soft round checkbox,
 * a label, optional one-line description, and an optional avatar.
 * Checking an item fades + strikes through its label.
 *
 * Controlled or uncontrolled: pass `checked` on items + `onToggle` to
 * fully control state, or just give items without `checked` and let
 * the component manage it internally.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QueueItem {
  id: string
  label: string
  description?: string
  avatar?: React.ReactNode
  checked?: boolean
  disabled?: boolean
}

export interface QueueGroup {
  id: string
  title: string
  items: QueueItem[]
  defaultOpen?: boolean
}

export interface QueueProps {
  groups: QueueGroup[]
  onToggle?: (groupId: string, itemId: string, checked: boolean) => void
  /** Show the un-checked count next to the section title. Default true. */
  showCount?: boolean
  className?: string
}

const SECTION_SPRING = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 32,
  mass: 0.7,
}

export function Queue({
  groups,
  onToggle,
  showCount = true,
  className,
}: QueueProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-1.5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] p-1.5',
        className,
      )}
    >
      {groups.map((g) => (
        <QueueGroupBlock
          key={g.id}
          group={g}
          showCount={showCount}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// One group
// ---------------------------------------------------------------------------

function QueueGroupBlock({
  group,
  showCount,
  onToggle,
}: {
  group: QueueGroup
  showCount: boolean
  onToggle?: QueueProps['onToggle']
}) {
  const [open, setOpen] = React.useState(group.defaultOpen ?? true)
  const [localChecked, setLocalChecked] = React.useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        group.items.map((i) => [i.id, i.checked ?? false]),
      ),
  )

  const isItemChecked = (i: QueueItem) =>
    i.checked !== undefined ? i.checked : !!localChecked[i.id]

  const unchecked = group.items.filter((i) => !isItemChecked(i)).length

  return (
    <section className="overflow-hidden rounded-xl bg-white/[0.025]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center gap-2 px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
      >
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={SECTION_SPRING}
          className="text-white/45"
        >
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
        </motion.span>
        <span className="text-[13px] font-medium tracking-tight text-white/90">
          {showCount ? `${unchecked} ` : ''}
          {group.title}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SECTION_SPRING}
            className="overflow-hidden"
          >
            <ul className="flex flex-col px-1.5 pb-1.5">
              {group.items.map((item) => (
                <QueueRow
                  key={item.id}
                  item={item}
                  checked={isItemChecked(item)}
                  onToggle={(next) => {
                    if (item.checked === undefined) {
                      setLocalChecked((s) => ({ ...s, [item.id]: next }))
                    }
                    onToggle?.(group.id, item.id, next)
                  }}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ---------------------------------------------------------------------------
// One row
// ---------------------------------------------------------------------------

function QueueRow({
  item,
  checked,
  onToggle,
}: {
  item: QueueItem
  checked: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <li>
      <button
        type="button"
        disabled={item.disabled}
        onClick={() => onToggle(!checked)}
        className={cn(
          'group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
          'hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none',
          item.disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <Checkbox checked={checked} />

        <div className="min-w-0 flex-1">
          <motion.div
            animate={{
              opacity: checked ? 0.4 : 1,
              x: checked ? 1 : 0,
            }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'text-[13px] leading-snug text-white/85 transition-all duration-200',
              checked && 'line-through decoration-white/30 decoration-1',
            )}
          >
            {item.label}
          </motion.div>
          {item.description && (
            <motion.div
              animate={{ opacity: checked ? 0.3 : 0.55 }}
              className={cn(
                'mt-0.5 text-[11.5px] leading-snug text-white/55',
                checked && 'line-through decoration-white/20',
              )}
            >
              {item.description}
            </motion.div>
          )}
        </div>

        {item.avatar && (
          <div className="shrink-0 self-center">{item.avatar}</div>
        )}
      </button>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Checkbox — soft circle with a quick check-stroke animation
// ---------------------------------------------------------------------------

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
        checked
          ? 'border-white/70 bg-white/85'
          : 'border-white/25 bg-transparent group-hover:border-white/45',
      )}
    >
      <AnimatePresence>
        {checked && (
          <motion.span
            key="check"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center text-black"
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
