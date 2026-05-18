'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { springGentle, springSnappy, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'
import {
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Trash2,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  cardWidth?: number
  isDragOverlay?: boolean
}

export function Column({
  column,
  cards,
  onCardClick,
  onCardDelete,
  onCardAdd,
  onColumnDelete,
  cardWidth = 280,
  isDragOverlay,
}: ColumnProps) {
  const [collapsed, setCollapsed] = useState(column.collapsed ?? false)
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
      style={{
        ...style,
        width: cardWidth + 32,
        minWidth: cardWidth + 32,
      }}
      className={cn(
        'flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.03]',
        isDragging && 'opacity-40',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Drag handle */}
        {!isDragOverlay && (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-0.5 text-white/20 hover:text-white/40 active:cursor-grabbing"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/30 hover:text-white/50"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Color dot */}
        <span
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{ backgroundColor: column.color ?? '#6b7280' }}
        />

        {/* Title */}
        <span className="flex-1 truncate text-sm font-semibold text-white">
          {column.title}
        </span>

        {/* Card count */}
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/40">
          {cards.length}
        </span>

        {/* WIP indicator */}
        {column.limit != null && (
          <WipIndicator count={cards.length} limit={column.limit} />
        )}

        {/* Menu */}
        {!isDragOverlay && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded p-1 text-white/30 hover:bg-white/[0.06] hover:text-white/50">
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

      {/* Exceeded limit warning */}
      <AnimatePresence>
        {exceedsLimit && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springGentle}
            className="overflow-hidden"
          >
            <div className="mx-3 mb-2 rounded-md bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-400">
              WIP limit exceeded ({cards.length}/{column.limit})
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards area */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springGentle}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <ScrollArea className="flex-1 px-2 pb-2">
              <SortableContext
                items={cardIds}
                strategy={verticalListSortingStrategy}
              >
                <motion.div
                  {...staggerContainer}
                  className="flex flex-col gap-2"
                >
                  {cards.length === 0 ? (
                    <EmptyColumn />
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
                </motion.div>
              </SortableContext>

              {/* Quick add */}
              {!isDragOverlay && (
                <div className="px-1">
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
                      className="mt-2 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-white/30 hover:bg-white/[0.04] hover:text-white/50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add card
                    </button>
                  )}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
