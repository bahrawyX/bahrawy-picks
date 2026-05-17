'use client'

/**
 * <CommandPalette />
 *
 * Spotlight-style command palette with fuzzy search, keyboard navigation,
 * grouped actions, and Framer Motion transitions. Built on cmdk.
 *
 * @param open        — Controlled open state.
 * @param onOpenChange — Callback when open state changes.
 * @param groups      — Array of command groups ({ heading, items }).
 * @param placeholder — Search input placeholder. Default "Type a command or search…".
 * @param shortcut    — Keyboard shortcut to toggle (default: "k" — triggers on Cmd/Ctrl+K).
 * @param className   — Additional classes for the dialog.
 */

import * as React from 'react'
import { Command as Cmdk } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { scaleIn, springSnappy } from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommandItem {
  /** Unique identifier. */
  id: string
  /** Display label. */
  label: string
  /** Optional icon. */
  icon?: React.ReactNode
  /** Optional shortcut hint (e.g. "⌘N"). */
  shortcut?: string
  /** Callback when selected. */
  onSelect: () => void
  /** Whether this item is disabled. */
  disabled?: boolean
}

export interface CommandGroup {
  /** Group heading. */
  heading: string
  /** Items within the group. */
  items: CommandItem[]
}

export interface CommandPaletteProps {
  /** Controlled open state. */
  open: boolean
  /** Callback when open state changes. */
  onOpenChange: (open: boolean) => void
  /** Command groups. */
  groups: CommandGroup[]
  /** Search placeholder. */
  placeholder?: string
  /** Key for the keyboard shortcut (used with Cmd/Ctrl). Default "k". */
  shortcut?: string
  /** Additional classes for the dialog panel. */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = 'Type a command or search…',
  shortcut = 'k',
  className,
}: CommandPaletteProps) {
  // ── Keyboard shortcut ─────────────────────────────────────────
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === shortcut && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange, shortcut])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            <motion.div
              key="panel"
              {...scaleIn}
              transition={springSnappy}
              className={cn(
                'w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50',
                className
              )}
            >
              <Cmdk
                label="Command palette"
                className="flex flex-col"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') onOpenChange(false)
                }}
              >
                {/* Search */}
                <div className="flex items-center gap-2 border-b border-white/10 px-4">
                  <Search className="h-4 w-4 shrink-0 text-white/40" />
                  <Cmdk.Input
                    placeholder={placeholder}
                    className="h-12 w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                    autoFocus
                  />
                  <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40 sm:inline">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <Cmdk.List className="max-h-72 overflow-y-auto overscroll-contain p-2">
                  <Cmdk.Empty className="py-8 text-center text-sm text-white/30">
                    No results found.
                  </Cmdk.Empty>

                  {groups.map((group) => (
                    <Cmdk.Group
                      key={group.heading}
                      heading={group.heading}
                      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-white/30"
                    >
                      {group.items.map((item) => (
                        <Cmdk.Item
                          key={item.id}
                          value={item.label}
                          disabled={item.disabled}
                          onSelect={() => {
                            item.onSelect()
                            onOpenChange(false)
                          }}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40"
                        >
                          {item.icon && (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-white/50">
                              {item.icon}
                            </span>
                          )}
                          <span className="flex-1">{item.label}</span>
                          {item.shortcut && (
                            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
                              {item.shortcut}
                            </kbd>
                          )}
                        </Cmdk.Item>
                      ))}
                    </Cmdk.Group>
                  ))}
                </Cmdk.List>
              </Cmdk>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
