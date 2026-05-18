'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import type { NominatimResult } from './nominatim-utils'

interface AddressDropdownProps {
  results: NominatimResult[]
  loading: boolean
  selectedIndex: number
  onSelect: (result: NominatimResult) => void
}

export function AddressDropdown({
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
      className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/[0.08] bg-neutral-900/95 shadow-xl backdrop-blur-md"
    >
      <div className="max-h-60 overflow-y-auto p-1 scrollbar-hide">
        {loading && results.length === 0 ? (
          <div className="flex items-center justify-center px-3 py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          </div>
        ) : results.length === 0 ? (
          <p className="px-3 py-3 text-center text-xs text-white/30">
            No addresses found
          </p>
        ) : (
          results.map((result, i) => (
            <button
              key={result.place_id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                onSelect(result)
              }}
              className={cn(
                'flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors',
                i === selectedIndex
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/70 hover:bg-white/[0.04]',
              )}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-white/30" />
              <span className="text-sm leading-snug">{result.display_name}</span>
            </button>
          ))
        )}
      </div>

      {/* Attribution */}
      <div className="border-t border-white/[0.06] px-3 py-1.5">
        <p className="text-[10px] text-white/20">
          Data by OpenStreetMap contributors
        </p>
      </div>
    </motion.div>
  )
}
