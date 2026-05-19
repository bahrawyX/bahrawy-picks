'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { Search, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Column } from './column'
import { CardOverlay } from './card-overlay'
import { ColumnOverlay } from './column-overlay'
import { CardDetail } from './card-detail'
import { FilterBar, type Priority } from './filter-bar'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KanbanCard = {
  id: string
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  labels?: { text: string; color: string }[]
  assignees?: { name: string; avatar?: string }[]
  dueDate?: Date
  attachments?: number
  comments?: number
  coverImage?: string
  metadata?: Record<string, unknown>
}

export type KanbanColumn = {
  id: string
  title: string
  color?: string
  limit?: number
  cards: KanbanCard[]
  collapsed?: boolean
}

export interface KanbanProps {
  columns: KanbanColumn[]
  onCardMove?: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex: number
  ) => void
  onCardUpdate?: (card: KanbanCard) => void
  onCardAdd?: (columnId: string, card: KanbanCard) => void
  onCardDelete?: (cardId: string, columnId: string) => void
  onColumnReorder?: (columns: KanbanColumn[]) => void
  onColumnAdd?: (column: KanbanColumn) => void
  onColumnDelete?: (columnId: string) => void
  showSearch?: boolean
  showFilters?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findColumnByCardId(
  columns: KanbanColumn[],
  cardId: string
): KanbanColumn | undefined {
  return columns.find((col) => col.cards.some((c) => c.id === cardId))
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Kanban({
  columns: externalColumns,
  onCardMove,
  onCardUpdate,
  onCardAdd,
  onCardDelete,
  onColumnReorder,
  onColumnAdd,
  onColumnDelete,
  showSearch = true,
  showFilters = true,
  className,
}: KanbanProps) {
  // Internal state if no callbacks
  const [internalColumns, setInternalColumns] =
    useState<KanbanColumn[]>(externalColumns)

  // Use external columns if callbacks are provided, otherwise internal
  const isControlled = onCardMove != null
  const columns = isControlled ? externalColumns : internalColumns

  // Keep internal state in sync when external columns change
  const [prevExternal, setPrevExternal] = useState(externalColumns)
  if (externalColumns !== prevExternal) {
    setPrevExternal(externalColumns)
    if (!isControlled) {
      setInternalColumns(externalColumns)
    }
  }

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [activePriorities, setActivePriorities] = useState<Priority[]>([])

  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'card' | 'column' | null>(null)

  // Detail dialog
  const [detailCard, setDetailCard] = useState<KanbanCard | null>(null)
  const [detailColumnId, setDetailColumnId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Drag-over tracking for column highlighting
  const [overColumnId, setOverColumnId] = useState<string | null>(null)
  const columnsRef = useRef(columns)
  columnsRef.current = columns

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Column IDs for sortable context
  const columnIds = useMemo(() => columns.map((c) => c.id), [columns])

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredColumns = useMemo(() => {
    return columns.map((col) => {
      let filtered = col.cards

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        filtered = filtered.filter((c) =>
          c.title.toLowerCase().includes(q)
        )
      }

      if (activePriorities.length > 0) {
        filtered = filtered.filter(
          (c) => c.priority && activePriorities.includes(c.priority)
        )
      }

      return { ...col, cards: filtered }
    })
  }, [columns, searchQuery, activePriorities])

  // ---------------------------------------------------------------------------
  // Drag handlers
  // ---------------------------------------------------------------------------

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const data = active.data.current
    setOverColumnId(null)
    if (data?.type === 'column') {
      setActiveId(active.id as string)
      setActiveType('column')
    } else {
      setActiveId(active.id as string)
      setActiveType('card')
    }
  }, [])

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event

      // Track which column is being dragged over (for highlighting)
      if (active.data.current?.type === 'card' && over) {
        const od = over.data.current
        if (od?.type === 'column') {
          setOverColumnId(over.id as string)
        } else if (od?.type === 'card') {
          const col = findColumnByCardId(columnsRef.current, over.id as string)
          setOverColumnId(col?.id ?? null)
        }
      } else {
        setOverColumnId(null)
      }

      if (!over || active.id === over.id) return

      const activeData = active.data.current
      const overData = over.data.current

      // Only handle card drags over columns or other cards
      if (activeData?.type !== 'card') return

      const activeCardId = active.id as string

      const updateColumns = (prev: KanbanColumn[]): KanbanColumn[] => {
        const fromCol = findColumnByCardId(prev, activeCardId)
        if (!fromCol) return prev

        let toColId: string
        if (overData?.type === 'column') {
          toColId = over.id as string
        } else if (overData?.type === 'card') {
          const overCol = findColumnByCardId(prev, over.id as string)
          if (!overCol) return prev
          toColId = overCol.id
        } else {
          return prev
        }

        if (fromCol.id === toColId) return prev

        // Move card between columns
        const card = fromCol.cards.find((c) => c.id === activeCardId)
        if (!card) return prev

        return prev.map((col) => {
          if (col.id === fromCol.id) {
            return { ...col, cards: col.cards.filter((c) => c.id !== activeCardId) }
          }
          if (col.id === toColId) {
            if (overData?.type === 'card') {
              const overIndex = col.cards.findIndex((c) => c.id === over.id)
              const newCards = [...col.cards]
              newCards.splice(overIndex, 0, card)
              return { ...col, cards: newCards }
            }
            return { ...col, cards: [...col.cards, card] }
          }
          return col
        })
      }

      if (!isControlled) {
        setInternalColumns(updateColumns)
      }
    },
    [isControlled]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      setActiveId(null)
      setActiveType(null)
      setOverColumnId(null)

      if (!over || active.id === over.id) return

      const activeData = active.data.current
      const overData = over.data.current

      // Column reorder
      if (activeData?.type === 'column' && overData?.type === 'column') {
        const oldIndex = columns.findIndex((c) => c.id === active.id)
        const newIndex = columns.findIndex((c) => c.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const reordered = arrayMove(columns, oldIndex, newIndex)
        if (isControlled) {
          onColumnReorder?.(reordered)
        } else {
          setInternalColumns(reordered)
        }
        return
      }

      // Card reorder within same column or move to another
      if (activeData?.type === 'card') {
        const activeCardId = active.id as string

        if (isControlled) {
          // For controlled mode, find the target column and index
          const fromCol = findColumnByCardId(columns, activeCardId)

          let toColId: string
          let newIndex: number

          if (overData?.type === 'column') {
            toColId = over.id as string
            const toCol = columns.find((c) => c.id === toColId)
            newIndex = toCol ? toCol.cards.length : 0
          } else if (overData?.type === 'card') {
            const toCol = findColumnByCardId(columns, over.id as string)
            if (!toCol) return
            toColId = toCol.id
            newIndex = toCol.cards.findIndex((c) => c.id === over.id)
          } else {
            return
          }

          if (fromCol) {
            onCardMove?.(activeCardId, fromCol.id, toColId, newIndex)
          }
        } else {
          // Uncontrolled: handle same-column reorder
          setInternalColumns((prev) => {
            const fromCol = findColumnByCardId(prev, activeCardId)
            if (!fromCol) return prev

            if (overData?.type === 'card') {
              const overCol = findColumnByCardId(prev, over.id as string)
              if (!overCol) return prev

              if (fromCol.id === overCol.id) {
                // Same column reorder
                const oldIdx = fromCol.cards.findIndex((c) => c.id === activeCardId)
                const newIdx = fromCol.cards.findIndex((c) => c.id === over.id)
                return prev.map((col) =>
                  col.id === fromCol.id
                    ? { ...col, cards: arrayMove(col.cards, oldIdx, newIdx) }
                    : col
                )
              }
            }

            return prev
          })
        }
      }
    },
    [columns, isControlled, onCardMove, onColumnReorder]
  )

  // ---------------------------------------------------------------------------
  // Card actions
  // ---------------------------------------------------------------------------

  const handleCardAdd = useCallback(
    (columnId: string, title: string) => {
      const newCard: KanbanCard = {
        id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
      }

      if (isControlled) {
        onCardAdd?.(columnId, newCard)
      } else {
        setInternalColumns((prev) =>
          prev.map((col) =>
            col.id === columnId
              ? { ...col, cards: [...col.cards, newCard] }
              : col
          )
        )
      }
    },
    [isControlled, onCardAdd]
  )

  const handleCardDelete = useCallback(
    (cardId: string, columnId: string) => {
      if (isControlled) {
        onCardDelete?.(cardId, columnId)
      } else {
        setInternalColumns((prev) =>
          prev.map((col) =>
            col.id === columnId
              ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
              : col
          )
        )
      }
    },
    [isControlled, onCardDelete]
  )

  const handleCardUpdate = useCallback(
    (card: KanbanCard) => {
      if (isControlled) {
        onCardUpdate?.(card)
      } else {
        setInternalColumns((prev) =>
          prev.map((col) => ({
            ...col,
            cards: col.cards.map((c) => (c.id === card.id ? card : c)),
          }))
        )
      }
    },
    [isControlled, onCardUpdate]
  )

  const handleColumnDelete = useCallback(
    (columnId: string) => {
      if (isControlled) {
        onColumnDelete?.(columnId)
      } else {
        setInternalColumns((prev) => prev.filter((c) => c.id !== columnId))
      }
    },
    [isControlled, onColumnDelete]
  )

  const handleColumnAdd = useCallback(() => {
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      cards: [],
    }
    if (isControlled) {
      onColumnAdd?.(newColumn)
    } else {
      setInternalColumns((prev) => [...prev, newColumn])
    }
  }, [isControlled, onColumnAdd])

  // ---------------------------------------------------------------------------
  // Active drag item for overlay
  // ---------------------------------------------------------------------------

  const activeCard = useMemo(() => {
    if (activeType !== 'card' || !activeId) return null
    for (const col of columns) {
      const card = col.cards.find((c) => c.id === activeId)
      if (card) return card
    }
    return null
  }, [activeId, activeType, columns])

  const activeColumn = useMemo(() => {
    if (activeType !== 'column' || !activeId) return null
    return columns.find((c) => c.id === activeId) ?? null
  }, [activeId, activeType, columns])

  // ---------------------------------------------------------------------------
  // Filter toggle
  // ---------------------------------------------------------------------------

  const togglePriority = useCallback((p: Priority) => {
    setActivePriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }, [])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search & filter bar */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col gap-3">
          {showSearch && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cards..."
                className="h-9 border-white/[0.08] bg-white/[0.04] pl-9 text-sm text-white placeholder:text-white/30 focus-visible:ring-white/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
          {showFilters && (
            <FilterBar
              activePriorities={activePriorities}
              onToggle={togglePriority}
            />
          )}
        </div>
      )}

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4">
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {filteredColumns.map((col) => (
              <Column
                key={col.id}
                column={col}
                cards={col.cards}
                isDragOver={overColumnId === col.id}
                onCardClick={(card) => {
                  setDetailCard(card)
                  setDetailColumnId(col.id)
                  setDetailOpen(true)
                }}
                onCardDelete={(cardId) => handleCardDelete(cardId, col.id)}
                onCardAdd={(title) => handleCardAdd(col.id, title)}
                onColumnDelete={() => handleColumnDelete(col.id)}
              />
            ))}
          </SortableContext>

          {/* Add column button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={springSnappy}
            onClick={handleColumnAdd}
            className="flex min-w-[160px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.06] py-8 text-sm text-white/20 hover:border-white/[0.10] hover:bg-white/[0.02] hover:text-white/40 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add column
          </motion.button>
        </div>

        {/* Drag overlay */}
        <DragOverlay dropAnimation={null}>
          {activeCard && <CardOverlay card={activeCard} />}
          {activeColumn && <ColumnOverlay column={activeColumn} />}
        </DragOverlay>
      </DndContext>

      {/* Card detail dialog */}
      <CardDetail
        card={detailCard}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSave={handleCardUpdate}
        onDelete={() => {
          if (detailCard && detailColumnId) {
            handleCardDelete(detailCard.id, detailColumnId)
          }
        }}
      />
    </div>
  )
}
