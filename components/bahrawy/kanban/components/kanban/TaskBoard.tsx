'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskBoardStore } from '../../store/useTaskBoardStore';
import type { Task, TaskPriority, TaskStatus, TaskDifficulty, ColumnAccent } from '../../types/task';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ThemeToggle';
import { useIsMobile } from '../../hooks/useIsMobile';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { TaskDialog, type TaskDialogPayload } from './TaskDialog';
import { TaskFilterBar } from './TaskFilterBar';
import { TaskListView } from './TaskListView';
import { AddColumnTile } from './AddColumnTile';
import { filterTasks, hasActiveFilters } from '../../utils/taskFilters';

const PlusIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const KanbanIcon: React.FC = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="18" rx="1.5" />
    <rect x="14" y="3" width="7" height="12" rx="1.5" />
  </svg>
);

const ListIcon: React.FC = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

function findContainerForId(
  id: string,
  tasks: Task[],
  columnIds: Set<string>,
): TaskStatus | null {
  if (columnIds.has(id)) return id;
  const task = tasks.find((t) => t.id === id);
  return task ? task.status : null;
}

export const TaskBoard: React.FC = () => {
  const hydrate = useTaskBoardStore((s) => s.hydrate);
  const tasks = useTaskBoardStore((s) => s.tasks);
  const columns = useTaskBoardStore((s) => s.columns);
  const addTask = useTaskBoardStore((s) => s.addTask);
  const updateTask = useTaskBoardStore((s) => s.updateTask);
  const deleteTask = useTaskBoardStore((s) => s.deleteTask);
  const moveTask = useTaskBoardStore((s) => s.moveTask);
  const reorderColumn = useTaskBoardStore((s) => s.reorderColumn);
  const addSubtask = useTaskBoardStore((s) => s.addSubtask);
  const addColumn = useTaskBoardStore((s) => s.addColumn);
  const renameColumn = useTaskBoardStore((s) => s.renameColumn);
  const setColumnAccent = useTaskBoardStore((s) => s.setColumnAccent);
  const deleteColumn = useTaskBoardStore((s) => s.deleteColumn);

  // View mode + mobile force-list
  const storedViewMode = useTaskBoardStore((s) => s.viewMode);
  const setViewMode = useTaskBoardStore((s) => s.setViewMode);
  const isMobile = useIsMobile();
  const viewMode = isMobile ? 'list' : storedViewMode;

  // Hydrate from localStorage after mount (prevents SSR mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  // Drag state
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const optimisticRef = useRef<Map<TaskStatus, string[]>>(new Map());

  // Sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Filters
  const searchQuery = useTaskBoardStore((s) => s.searchQuery);
  const priorityFilter = useTaskBoardStore((s) => s.priorityFilter);
  const difficultyFilter = useTaskBoardStore((s) => s.difficultyFilter);
  const dueDateFilter = useTaskBoardStore((s) => s.dueDateFilter);
  const filtersActive = hasActiveFilters(searchQuery, priorityFilter, difficultyFilter, dueDateFilter);

  // Column tasks (root-only, filtered, sorted by order) — keyed by dynamic column id
  const columnTasks = useMemo<Record<TaskStatus, Task[]>>(() => {
    const map: Record<TaskStatus, Task[]> = {};
    for (const col of columns) map[col.id] = [];
    const rootTasks = tasks.filter((t) => !t.parentTaskId);
    const filtered = filtersActive
      ? filterTasks(rootTasks, tasks, searchQuery, priorityFilter, difficultyFilter, dueDateFilter)
      : rootTasks;
    filtered.forEach((t) => {
      // Tasks whose status doesn't match a known column are dropped into the first column.
      const bucket = map[t.status] ?? map[columns[0]?.id ?? ''];
      if (bucket) bucket.push(t);
    });
    for (const key of Object.keys(map)) map[key].sort((a, b) => a.order - b.order);
    return map;
  }, [tasks, columns, filtersActive, searchQuery, priorityFilter, difficultyFilter, dueDateFilter]);

  const totalRootTasks = useMemo(() => tasks.filter((t) => !t.parentTaskId).length, [tasks]);
  const totalFiltered = useMemo(
    () => Object.values(columnTasks).reduce((acc, list) => acc + list.length, 0),
    [columnTasks],
  );

  const columnIdSet = useMemo(() => new Set(columns.map((c) => c.id)), [columns]);

  const subtaskMap = useMemo<Record<string, Task[]>>(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (t.parentTaskId) (map[t.parentTaskId] ??= []).push(t);
    });
    return map;
  }, [tasks]);

  // Dialog handlers
  const openCreateDialog = useCallback(
    (status?: TaskStatus) => {
      setEditingTask(null);
      // Fall back to first column id when caller omits the status or passes
      // an id that no longer exists (e.g. user deleted the default 'todo').
      const fallback = columns[0]?.id ?? 'todo';
      const next = status && columnIdSet.has(status) ? status : fallback;
      setDefaultStatus(next);
      setDialogOpen(true);
    },
    [columns, columnIdSet],
  );

  const openEditDialog = useCallback((task: Task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingTask(null);
  }, []);

  const handleSave = useCallback(
    (payload: TaskDialogPayload) => {
      if (editingTask) updateTask(editingTask.id, payload);
      else addTask(payload);
      closeDialog();
    },
    [editingTask, addTask, updateTask, closeDialog],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteTask(id);
    },
    [deleteTask],
  );

  const handleAddSubtask = useCallback(
    (parentId: string, title: string) => {
      addSubtask(parentId, { title });
    },
    [addSubtask],
  );

  const handleToggleSubtaskDone = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      updateTask(taskId, { status: task.status === 'done' ? 'todo' : 'done' });
    },
    [tasks, updateTask],
  );

  const handleMarkParentDone = useCallback(
    (taskId: string) => {
      updateTask(taskId, { status: 'done' });
    },
    [updateTask],
  );

  const handlePriorityChange = useCallback(
    (task: Task, priority: TaskPriority) => {
      if (task.priority === priority) return;
      updateTask(task.id, { priority });
    },
    [updateTask],
  );

  const handleDifficultyChange = useCallback(
    (task: Task, difficulty: TaskDifficulty) => {
      if (task.difficulty === difficulty) return;
      updateTask(task.id, { difficulty });
    },
    [updateTask],
  );

  // Drag handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      if (task) {
        setActiveTask(task);
        columns.forEach((col) => {
          optimisticRef.current.set(
            col.id,
            (columnTasks[col.id] ?? []).map((t) => t.id),
          );
        });
      }
    },
    [tasks, columns, columnTasks],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setOverId(String(over.id));

      const activeContainer = findContainerForId(String(active.id), tasks, columnIdSet);
      const overContainer = findContainerForId(String(over.id), tasks, columnIdSet);

      if (!activeContainer || !overContainer) return;

      if (activeContainer !== overContainer) {
        const srcIds = [...(optimisticRef.current.get(activeContainer) ?? [])];
        const destIds = [...(optimisticRef.current.get(overContainer) ?? [])];

        const activeIdx = srcIds.indexOf(String(active.id));
        if (activeIdx === -1) return;

        const overIdx = destIds.indexOf(String(over.id));
        const insertAt = overIdx === -1 ? destIds.length : overIdx;

        srcIds.splice(activeIdx, 1);
        destIds.splice(insertAt, 0, String(active.id));

        optimisticRef.current.set(activeContainer, srcIds);
        optimisticRef.current.set(overContainer, destIds);
      } else {
        const ids = [...(optimisticRef.current.get(activeContainer) ?? [])];
        const oldIdx = ids.indexOf(String(active.id));
        const newIdx = ids.indexOf(String(over.id));
        if (oldIdx === -1 || newIdx === -1) return;
        const reordered = arrayMove(ids, oldIdx, newIdx);
        optimisticRef.current.set(activeContainer, reordered);
      }
    },
    [tasks, columnIdSet],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);
      setOverId(null);

      if (!over) {
        optimisticRef.current.clear();
        return;
      }

      const activeContainer = findContainerForId(String(active.id), tasks, columnIdSet);
      const overContainer = findContainerForId(String(over.id), tasks, columnIdSet);

      if (!activeContainer || !overContainer) {
        optimisticRef.current.clear();
        return;
      }

      if (activeContainer === overContainer) {
        const currentIds: string[] = (columnTasks[activeContainer] ?? []).map((t) => t.id);
        const oldIdx = currentIds.indexOf(String(active.id));
        const overTask = tasks.find((t) => t.id === over.id);
        const newIdx = overTask
          ? (columnTasks[activeContainer] ?? []).findIndex((t) => t.id === over.id)
          : currentIds.length - 1;

        if (oldIdx !== newIdx && newIdx !== -1) {
          const reordered: string[] = arrayMove(currentIds, oldIdx, newIdx);
          reorderColumn(activeContainer, reordered);
        }
      } else {
        const destIds = optimisticRef.current.get(overContainer) ?? [];
        const insertIdx = destIds.indexOf(String(active.id));
        moveTask(String(active.id), overContainer, insertIdx === -1 ? undefined : insertIdx);
      }

      optimisticRef.current.clear();
    },
    [tasks, columnTasks, columnIdSet, reorderColumn, moveTask],
  );

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
    setOverId(null);
    optimisticRef.current.clear();
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Board header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4 md:mb-5 pb-4 md:pb-5 border-b border-border/60 flex-shrink-0">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5">
            Workspace · {viewMode === 'kanban' ? 'Board' : 'List'}
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground tracking-[-0.035em] leading-none">
            {viewMode === 'kanban' ? 'Task Board' : 'Tasks'}
          </h1>
          <p className="text-[11px] md:text-xs text-muted-foreground/80 mt-2 hidden sm:block tabular-nums">
            {tasks.length === 0
              ? 'No tasks yet'
              : `${totalRootTasks} task${totalRootTasks !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center rounded-lg border border-border/50 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Kanban view"
              title="Board view"
            >
              <KanbanIcon />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="List view"
              title="List view"
            >
              <ListIcon />
            </button>
          </div>

          <ThemeToggle />

          <Button
            size="sm"
            onClick={() => openCreateDialog()}
            className="gap-1.5 rounded-xl h-9 md:h-8 text-xs whitespace-nowrap"
            aria-label="Create new task"
          >
            <PlusIcon />
            New Task
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <TaskFilterBar />

      {/* Results count */}
      <AnimatePresence initial={false}>
        {filtersActive && (
          <motion.div
            key="results-count"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="overflow-hidden flex-shrink-0"
          >
            <p className="text-xs text-muted-foreground mb-3">
              Showing {totalFiltered} of {totalRootTasks} task{totalRootTasks === 1 ? '' : 's'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board content */}
      <AnimatePresence mode="wait" initial={false}>
      {viewMode === 'kanban' ? (
      <motion.div
        key="kanban"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="flex-1 flex flex-col min-h-0"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex gap-3 flex-1 min-h-0 overflow-x-auto overflow-y-hidden pb-2 items-stretch thin-scrollbar snap-x snap-mandatory md:snap-none px-1 md:px-0">
            {columns.map((col) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                className="w-[85vw] snap-center shrink-0 md:w-[280px] md:snap-none md:shrink-0 flex flex-col h-full"
              >
                  <TaskColumn
                    id={col.id}
                    label={col.label}
                    accent={col.accent}
                    tasks={columnTasks[col.id] ?? []}
                    canDelete={columns.length > 1}
                    isDragOver={
                      overId !== null &&
                      findContainerForId(overId, tasks, columnIdSet) === col.id &&
                      activeTask?.status !== col.id
                    }
                    onPriorityChange={handlePriorityChange}
                    onDifficultyChange={handleDifficultyChange}
                    onAddTask={openCreateDialog}
                    onEditTask={openEditDialog}
                    onDeleteTask={handleDelete}
                    onRenameColumn={renameColumn}
                    onChangeColumnAccent={(id: TaskStatus, a: ColumnAccent) => setColumnAccent(id, a)}
                    onDeleteColumn={deleteColumn}
                    subtaskMap={subtaskMap}
                    allTasks={tasks}
                    onAddSubtask={handleAddSubtask}
                    onToggleSubtaskDone={handleToggleSubtaskDone}
                    onMarkParentDone={handleMarkParentDone}
                  />
                </motion.div>
              ))}
            <AddColumnTile onAdd={(label) => addColumn({ label })} />
          </div>

          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                onPriorityChange={handlePriorityChange}
                onDifficultyChange={handleDifficultyChange}
                onEdit={() => {}}
                onDelete={() => {}}
                isDragOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <TaskListView
            tasks={tasks}
            subtaskMap={subtaskMap}
            onEdit={openEditDialog}
            onDelete={handleDelete}
            onStatusChange={(taskId, status) => updateTask(taskId, { status })}
            onAddTask={openCreateDialog}
          />
        </motion.div>
      )}
      </AnimatePresence>

      {/* Dialog */}
      <TaskDialog
        open={dialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSave={handleSave}
        onClose={closeDialog}
        subtasks={editingTask ? subtaskMap[editingTask.id] ?? [] : []}
        onAddSubtask={handleAddSubtask}
        onToggleSubtaskDone={handleToggleSubtaskDone}
        onDeleteSubtask={handleDelete}
        onOpenSubtask={(sub) => {
          closeDialog();
          setTimeout(() => openEditDialog(sub), 150);
        }}
      />
    </div>
  );
};
