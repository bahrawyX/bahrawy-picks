'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import type { NominatimResult } from './nominatim-utils'

interface AddressDropdownProps {
  /** DOM id for the listbox, referenced by the combobox's aria-controls. */
  id: string
  /** Builds the DOM id for the option at a given index. */
  getOptionId: (index: number) => string
  results: NominatimResult[]
  loading: boolean
  selectedIndex: number
  onSelect: (result: NominatimResult) => void
}

export function AddressDropdown({
  id,
  getOptionId,
  results,
  loading,
  selectedIndex,
  onSelect,
}: AddressDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={springSnappy}
      className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-picks-fg/[0.08] bg-picks-panel/95 shadow-xl backdrop-blur-md"
    >
      <div
        id={id}
        role="listbox"
        aria-label="Address suggestions"
        className="max-h-60 overflow-y-auto p-1 scrollbar-hide"
      >
        {loading && results.length === 0 ? (
          <div className="flex items-center justify-center px-3 py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-picks-fg/20 border-t-picks-fg/60" />
          </div>
        ) : results.length === 0 ? (
          <p className="px-3 py-3 text-center text-xs text-picks-fg/30">
            No addresses found
          </p>
        ) : (
          results.map((result, i) => (
            <button
              key={result.place_id}
              id={getOptionId(i)}
              role="option"
              aria-selected={i === selectedIndex}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                onSelect(result)
              }}
              className={cn(
                'flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors',
                i === selectedIndex
                  ? 'bg-picks-fg/[0.08] text-picks-fg'
                  : 'text-picks-fg/70 hover:bg-picks-fg/[0.04]',
              )}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-picks-fg/30" />
              <span className="text-sm leading-snug">{result.display_name}</span>
            </button>
          ))
        )}
      </div>

      {/* Attribution */}
      <div className="border-t border-picks-fg/[0.06] px-3 py-1.5">
        <p className="text-[10px] text-picks-fg/20">
          Data by OpenStreetMap contributors
        </p>
      </div>
    </motion.div>
  )
}
