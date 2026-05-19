'use client'

import { cn } from '@/lib/utils'
import type { KanbanColumn } from './index'

interface ColumnOverlayProps {
  column: KanbanColumn
}

export function ColumnOverlay({ column }: ColumnOverlayProps) {
  return (
    <div
      className={cn(
        'min-w-[240px] max-w-[340px] rounded-xl border border-white/[0.08] bg-white/[0.04] opacity-80 shadow-2xl shadow-black/40'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: column.color ?? '#6b7280' }}
        />
        <span className="flex-1 text-sm font-semibold text-white">{column.title}</span>
        <span className="text-[10px] font-semibold tabular-nums text-white/40 bg-white/[0.06] rounded-full px-2 py-0.5 border border-white/[0.06]">
          {column.cards.length}
        </span>
      </div>
      {/* Preview cards */}
      <div className="space-y-1.5 p-1.5">
        {column.cards.slice(0, 3).map((card) => (
          <div
            key={card.id}
            className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2"
          >
            <p className="text-xs text-white/60 line-clamp-1">{card.title}</p>
          </div>
        ))}
        {column.cards.length > 3 && (
          <p className="text-center text-[10px] text-white/30 py-1">
            +{column.cards.length - 3} more
          </p>
        )}
      </div>
    </div>
  )
}
