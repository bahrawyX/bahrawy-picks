'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { KanbanColumn } from './index'

interface ColumnOverlayProps {
  column: KanbanColumn
}

export function ColumnOverlay({ column }: ColumnOverlayProps) {
  return (
    <div
      className={cn(
        'w-[300px] rounded-xl border border-white/[0.06] bg-white/[0.03] opacity-80 shadow-2xl shadow-black/40'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: column.color ?? '#6b7280' }}
        />
        <span className="text-sm font-semibold text-white">{column.title}</span>
        <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/40">
          {column.cards.length}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-white/30" />
      </div>
      {/* Show a few preview cards as blocks */}
      <div className="space-y-1.5 p-2">
        {column.cards.slice(0, 3).map((card) => (
          <div
            key={card.id}
            className="rounded-md bg-white/[0.04] px-3 py-2"
          >
            <p className="text-xs text-white/60 line-clamp-1">{card.title}</p>
          </div>
        ))}
        {column.cards.length > 3 && (
          <p className="text-center text-[10px] text-white/30">
            +{column.cards.length - 3} more
          </p>
        )}
      </div>
    </div>
  )
}
