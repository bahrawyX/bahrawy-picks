'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { springGentle } from '@/lib/motion'
import { cn } from '@/lib/utils'
import {
  Plus,
  MoreHorizontal,
  GripVertical,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { KanbanCardComponent } from './card'
import { QuickAdd } from './quick-add'
import { EmptyColumn } from './empty-column'
import { WipIndicator } from './wip-indicator'
import type { KanbanCard, KanbanColumn } from './index'

interface ColumnProps {
  column: KanbanColumn
  cards: KanbanCard[]
  onCardClick?: (card: KanbanCard) => void
  onCardDelete?: (cardId: string) => void
  onCardAdd?: (title: string) => void
  onColumnDelete?: () => void
  isDragOver?: boolean
  isDragOverlay?: boolean
}

export function Column({
  column,
  cards,
  onCardClick,
  onCardDelete,
  onCardAdd,
  onColumnDelete,
  isDragOver,
  isDragOverlay,
}: ColumnProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: 'column', column },
    disabled: isDragOverlay,
  })

  const style = isDragOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      }

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards])
  const exceedsLimit = column.limit != null && cards.length > column.limit

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      className={cn(
        'flex flex-col flex-1 min-w-[160px] h-full',
        isDragging && 'opacity-40',
      )}
    >
      {/* Column header — Lumina-style: sits above the body container */}
      <div className="mb-2.5 px-1 w-full group/col-header relative">
        {/* Drag handle — absolutely positioned so it doesn't eat title space */}
        {!isDragOverlay && (
          <button
            {...attributes}
            {...listeners}
            className="absolute -left-3 top-0 cursor-grab rounded p-0.5 text-transparent group-hover/col-header:text-white/20 hover:!text-white/40 active:cursor-grabbing transition-colors z-10"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          {/* Color dot */}
          <span
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ backgroundColor: column.color ?? '#6b7280' }}
          />

          {/* Title */}
          <h3 className="flex-1 truncate text-sm font-semibold text-white tracking-[-0.01em]">
            {column.title}
          </h3>

          {/* Card count badge */}
          <span className="flex-shrink-0 text-[10px] font-semibold tabular-nums text-white/40 bg-white/[0.06] rounded-full px-1.5 py-0.5 border border-white/[0.06]">
            {cards.length}
          </span>

          {/* WIP indicator */}
          {column.limit != null && (
            <WipIndicator count={cards.length} limit={column.limit} />
          )}

          {/* Menu — invisible until column hover */}
          {!isDragOverlay && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-shrink-0 rounded p-0.5 text-transparent group-hover/col-header:text-white/30 hover:!bg-white/[0.06] hover:!text-white/50 transition-colors">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-white/10 bg-zinc-900"
              >
                <DropdownMenuItem
                  onClick={() => onColumnDelete?.()}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* WIP exceeded warning */}
      <AnimatePresence>
        {exceedsLimit && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springGentle}
            className="overflow-hidden"
          >
            <div className="mx-1 mb-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-400 border border-amber-500/20">
              WIP limit exceeded ({cards.length}/{column.limit})
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Column body — Lumina-style rounded container with drag-over highlight */}
      <div
        className={cn(
          'flex-1 flex flex-col rounded-xl border p-1.5 transition-colors duration-200',
          isDragOver
            ? 'border-blue-500/30 bg-blue-500/[0.08]'
            : 'border-white/[0.06] bg-white/[0.03]',
        )}
      >
        <SortableContext
          items={cardIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {cards.length === 0 ? (
              <EmptyColumn isDragOver={isDragOver} />
            ) : (
              cards.map((card) => (
                <KanbanCardComponent
                  key={card.id}
                  card={card}
                  onClick={() => onCardClick?.(card)}
                  onDelete={() => onCardDelete?.(card.id)}
                />
              ))
            )}
          </div>
        </SortableContext>

        {/* Quick add */}
        {!isDragOverlay && (
          <div className="mt-1">
            <QuickAdd
              isOpen={quickAddOpen}
              onAdd={(title) => {
                onCardAdd?.(title)
                setQuickAddOpen(false)
              }}
              onCancel={() => setQuickAddOpen(false)}
            />

            {!quickAddOpen && (
              <button
                onClick={() => setQuickAddOpen(true)}
                className="mt-1 flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-white/25 hover:bg-white/[0.04] hover:text-white/50 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add card
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
