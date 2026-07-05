'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import type { MentionSuggestion } from './index'

interface MentionDropdownProps {
  suggestions: MentionSuggestion[]
  loading?: boolean
  position: { top: number; left: number }
  selectedIndex: number
  onSelect: (suggestion: MentionSuggestion) => void
}

export function MentionDropdown({
  suggestions,
  loading,
  position,
  selectedIndex,
  onSelect,
}: MentionDropdownProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.children[selectedIndex] as HTMLElement | undefined
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={springSnappy}
      className="fixed z-[100] overflow-hidden rounded-lg border border-picks-fg/[0.08] bg-picks-panel/95 shadow-xl backdrop-blur-md"
      style={{
        top: position.top,
        left: position.left,
        minWidth: 200,
        maxWidth: 300,
      }}
    >
      <div ref={listRef} className="max-h-48 overflow-y-auto p-1 scrollbar-hide">
        {loading && suggestions.length === 0 ? (
          <div className="flex items-center justify-center px-3 py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-picks-fg/20 border-t-picks-fg/60" />
          </div>
        ) : suggestions.length === 0 ? (
          <p className="px-3 py-3 text-center text-xs text-picks-fg/30">
            No results
          </p>
        ) : (
          suggestions.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                onSelect(s)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                i === selectedIndex
                  ? 'bg-picks-fg/[0.08] text-picks-fg'
                  : 'text-picks-fg/70 hover:bg-picks-fg/[0.04]',
              )}
            >
              {s.avatar && (
                <img
                  src={s.avatar}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{s.name}</p>
                {s.description && (
                  <p className="truncate text-xs text-picks-fg/40">{s.description}</p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </motion.div>
  )
}
