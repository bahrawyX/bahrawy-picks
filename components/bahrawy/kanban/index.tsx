'use client'

import { useEffect, useRef, useState } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { TaskBoard } from './components/kanban/TaskBoard'
import {
  createTaskBoardStore,
  applyExternalData,
  TaskBoardStoreProvider,
  type TaskBoardCallbacks,
  type TaskBoardStore,
} from './store/useTaskBoardStore'
import { kanbanColumnsToState, stateToKanbanColumns } from './utils/taskBoard'
import { DEFAULT_COLUMNS } from './types/task'
import type { KanbanCard, KanbanCardMoveEvent, KanbanColumn } from './types/task'

export interface KanbanProps {
  /**
   * Controlled column data (columns with their cards). Pair with `onChange`
   * to receive every board mutation and feed the data back in.
   */
  columns?: KanbanColumn[]
  /** Fired with the full board data after any change (controlled or not). */
  onChange?: (columns: KanbanColumn[]) => void
  /** Initial data for uncontrolled usage. Defaults to empty To Do/Doing/Done columns. */
  defaultColumns?: KanbanColumn[]
  /**
   * Opt-in persistence: when set, the board (and its view preferences) are
   * persisted to localStorage under keys namespaced by this value. Omit it
   * for a fully in-memory board.
   */
  storageKey?: string
  /** Fired when a card is dropped in a new position (same or other column). */
  onCardMove?: (event: KanbanCardMoveEvent) => void
  /** Fired when a card is opened (click / edit). */
  onCardClick?: (card: KanbanCard) => void
}

export function Kanban({
  columns,
  onChange,
  defaultColumns,
  storageKey,
  onCardMove,
  onCardClick,
}: KanbanProps) {
  const controlled = columns !== undefined

  // Keep the latest onChange without recreating the per-instance store.
  const callbacksRef = useRef<TaskBoardCallbacks>({})
  // JSON snapshot of the data we last emitted or applied — used to skip
  // re-applying the exact data the consumer echoed back through `columns`.
  const lastSyncedRef = useRef<string | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  callbacksRef.current.onDataChange = (tasks, cols) => {
    const nested = stateToKanbanColumns(tasks, cols)
    lastSyncedRef.current = JSON.stringify(nested)
    onChangeRef.current?.(nested)
  }

  const [store] = useState<TaskBoardStore>(() => {
    const initial = columns ?? defaultColumns
    const { tasks, columns: initialColumns } = initial
      ? kanbanColumnsToState(initial)
      : { tasks: [], columns: [...DEFAULT_COLUMNS] }
    if (initial) lastSyncedRef.current = JSON.stringify(initial)
    return createTaskBoardStore({
      storageKey,
      controlled,
      initialTasks: tasks,
      initialColumns,
      callbacks: callbacksRef,
    })
  })

  // Controlled mode: apply new `columns` data coming from the consumer.
  useEffect(() => {
    if (!controlled || !columns) return
    const snapshot = JSON.stringify(columns)
    if (snapshot === lastSyncedRef.current) return
    lastSyncedRef.current = snapshot
    const { tasks, columns: nextColumns } = kanbanColumnsToState(columns)
    applyExternalData(store, tasks, nextColumns)
  }, [controlled, columns, store])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TaskBoardStoreProvider value={store}>
        <TaskBoard onCardMove={onCardMove} onCardClick={onCardClick} />
      </TaskBoardStoreProvider>
    </ThemeProvider>
  )
}

export type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskDifficulty,
  Column,
  ColumnAccent,
  KanbanColumn,
  KanbanCard,
  KanbanSubtask,
  KanbanCardMoveEvent,
} from './types/task'
