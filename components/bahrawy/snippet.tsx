'use client'

/**
 * <Snippet />
 *
 * A copy-and-go code snippet. A small tab bar (npm / pnpm / yarn / bun
 * — or any tabs you pass) sits at the top with a sliding indicator
 * pill. The code body underneath crossfades when the active tab
 * changes. A copy button on the right swaps to a checkmark on success.
 *
 * Single-line by default (great for install commands), but `multiline`
 * lets you display blocks of code.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRovingTabindex } from '@/lib/use-roving-tabindex'

export interface SnippetTab {
  /** Tab label, e.g. 'npm'. */
  label: string
  /** Code to display when this tab is active. */
  code: string
  /** Optional icon shown next to the label. */
  icon?: React.ReactNode
}

export interface SnippetProps {
  /** Tabs to show in the header. If only one tab, the bar is hidden. */
  tabs: SnippetTab[]
  /** Initially active tab label. Default = first tab. */
  defaultTab?: string
  /** Render code as a multi-line block instead of one truncating line. */
  multiline?: boolean
  /** Optional prefix to prepend to the code (e.g. '$ '). */
  prefix?: string
  /** Hide the copy button. Default false. */
  hideCopy?: boolean
  /** Fires after a successful copy. */
  onCopy?: (tab: SnippetTab) => void
  className?: string
}

const SPRING = {
  type: 'spring' as const,
  stiffness: 460,
  damping: 36,
  mass: 0.6,
}

export function Snippet({
  tabs,
  defaultTab,
  multiline = false,
  prefix,
  hideCopy = false,
  onCopy,
  className,
}: SnippetProps) {
  const [activeLabel, setActiveLabel] = React.useState(
    defaultTab ?? tabs[0]?.label,
  )
  const active = tabs.find((t) => t.label === activeLabel) ?? tabs[0]
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.label === active?.label),
  )
  // Links the tab row to the code panel (aria-controls / aria-labelledby).
  const uid = React.useId()
  const [copied, setCopied] = React.useState(false)
  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  // Clear any pending copy-feedback reset on unmount.
  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const handleCopy = async () => {
    if (!active) return
    try {
      await navigator.clipboard.writeText(active.code)
      onCopy?.(active)
      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 1100)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div
      className={cn(
        'inline-flex w-full max-w-full flex-col overflow-hidden rounded-xl border border-picks-fg/[0.08] bg-picks-fg/[0.02]',
        className,
      )}
    >
      {tabs.length > 1 && (
        <TabBar
          tabs={tabs}
          activeLabel={active?.label}
          onChange={setActiveLabel}
          uid={uid}
        />
      )}

      <div
        id={`${uid}-panel`}
        role={tabs.length > 1 ? 'tabpanel' : undefined}
        aria-labelledby={
          tabs.length > 1 ? `${uid}-tab-${activeIndex}` : undefined
        }
        className="relative flex items-center gap-2 overflow-hidden px-3 py-2.5"
      >
        <div className="min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.code
              key={active?.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'block font-mono text-[12.5px] tracking-tight text-picks-fg/85',
                multiline
                  ? 'whitespace-pre-wrap break-words'
                  : 'truncate whitespace-pre',
              )}
            >
              {prefix && (
                <span className="select-none text-picks-fg/35">{prefix}</span>
              )}
              {active?.code}
            </motion.code>
          </AnimatePresence>
        </div>

        {!hideCopy && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy snippet"
            className={cn(
              'relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-picks-fg/40 transition-colors',
              'hover:bg-picks-fg/[0.06] hover:text-picks-fg/85',
              'outline-none focus-visible:ring-2 focus-visible:ring-picks-fg/30',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="text-emerald-300"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab bar with a spring-animated active-pill background
// ---------------------------------------------------------------------------

function TabBar({
  tabs,
  activeLabel,
  onChange,
  uid,
}: {
  tabs: SnippetTab[]
  activeLabel?: string
  onChange: (label: string) => void
  uid: string
}) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.label === activeLabel),
  )
  // Arrow-key navigation; selection follows focus (the common tabs pattern).
  const roving = useRovingTabindex({
    count: tabs.length,
    focusIndex: activeIndex,
    onNavigate: (i) => {
      const tab = tabs[i]
      if (tab) onChange(tab.label)
    },
  })
  return (
    <div
      role="tablist"
      className="flex items-center gap-0.5 border-b border-picks-fg/[0.05] bg-picks-fg/[0.015] px-1.5 py-1.5"
    >
      {tabs.map((tab, i) => {
        const isActive = tab.label === activeLabel
        return (
          <button
            key={tab.label}
            {...roving.getItemProps(i)}
            id={`${uid}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${uid}-panel`}
            onClick={() => onChange(tab.label)}
            className={cn(
              'relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] font-medium tracking-tight transition-colors',
              isActive ? 'text-picks-fg' : 'text-picks-fg/55 hover:text-picks-fg/80',
            )}
          >
            {isActive && (
              <motion.span
                // Scoped per instance so multiple Snippets don't collide.
                layoutId={`snippet-tab-pill-${uid}`}
                className="absolute inset-0 rounded-md bg-picks-fg/[0.08]"
                transition={SPRING}
              />
            )}
            {tab.icon && <span className="relative">{tab.icon}</span>}
            <span className="relative">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
