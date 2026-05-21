'use client';

import { create } from 'zustand';
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskDifficulty,
  Column,
  ColumnAccent,
} from '../types/task';
import { DEFAULT_COLUMNS, COLUMN_ACCENTS } from '../types/task';
import {
  isTaskPriority,
  isTaskStatus,
  normalizeDueDateString,
  normalizePersistedTasks,
} from '../utils/taskBoard';
import { getStorageItem, setStorageItem } from '../lib/storage';
import { uid } from '../lib/uid';

// ── View / filter preferences ────────────────────────────────────────────────

export type TaskViewMode = 'kanban' | 'list';
export type ListSortColumn = 'title' | 'priority' | 'difficulty' | 'dueDate' | 'status';
export type ListSortDirection = 'asc' | 'desc';
export type ListGroupBy = 'status' | 'priority' | 'difficulty' | 'dueDate' | 'none';
export type DueDateFilter =
  | 'all'
  | 'overdue'
  | 'today'
  | 'this_week'
  | 'next_week'
  | 'no_date'
  | 'has_date';

const TASKS_KEY = 'kanban_tasks_v1';
const VIEW_PREFS_KEY = 'kanban_view_prefs_v1';

interface ViewPrefs {
  viewMode: TaskViewMode;
  listSortColumn: ListSortColumn;
  listSortDirection: ListSortDirection;
  listGroupBy: ListGroupBy;
  listCollapsedGroups: string[];
}

function defaultViewPrefs(): ViewPrefs {
  return {
    viewMode: 'kanban',
    listSortColumn: 'status',
    listSortDirection: 'asc',
    listGroupBy: 'status',
    listCollapsedGroups: [],
  };
}

function loadViewPrefs(): ViewPrefs {
  try {
    const raw = getStorageItem(VIEW_PREFS_KEY);
    if (!raw) return defaultViewPrefs();
    const parsed = JSON.parse(raw);
    return {
      viewMode: parsed.viewMode === 'list' ? 'list' : 'kanban',
      listSortColumn: ['title', 'priority', 'difficulty', 'dueDate', 'status'].includes(
        parsed.listSortColumn,
      )
        ? parsed.listSortColumn
        : 'status',
      listSortDirection: parsed.listSortDirection === 'desc' ? 'desc' : 'asc',
      listGroupBy: ['status', 'priority', 'difficulty', 'dueDate', 'none'].includes(
        parsed.listGroupBy,
      )
        ? parsed.listGroupBy
        : 'status',
      listCollapsedGroups: Array.isArray(parsed.listCollapsedGroups)
        ? parsed.listCollapsedGroups
        : [],
    };
  } catch {
    return defaultViewPrefs();
  }
}

function saveViewPrefs(prefs: ViewPrefs): void {
  setStorageItem(VIEW_PREFS_KEY, JSON.stringify(prefs));
}

function loadTasks(): Task[] {
  const raw = getStorageItem(TASKS_KEY);
  if (!raw) return [];
  try {
    return normalizePersistedTasks(JSON.parse(raw));
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  setStorageItem(TASKS_KEY, JSON.stringify(tasks));
}

// ── Columns persistence ──────────────────────────────────────────────────────

const COLUMNS_KEY = 'kanban_columns_v1';

function isColumnAccent(value: unknown): value is ColumnAccent {
  return typeof value === 'string' && (COLUMN_ACCENTS as readonly string[]).includes(value);
}

function loadColumns(): Column[] {
  const raw = getStorageItem(COLUMNS_KEY);
  if (!raw) return [...DEFAULT_COLUMNS];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [...DEFAULT_COLUMNS];
    const cleaned: Column[] = [];
    for (const c of parsed) {
      if (
        c &&
        typeof c.id === 'string' &&
        c.id.trim() &&
        typeof c.label === 'string' &&
        c.label.trim()
      ) {
        cleaned.push({
          id: c.id,
          label: c.label.trim(),
          accent: isColumnAccent(c.accent) ? c.accent : 'neutral',
        });
      }
    }
    return cleaned.length > 0 ? cleaned : [...DEFAULT_COLUMNS];
  } catch {
    return [...DEFAULT_COLUMNS];
  }
}

function saveColumns(columns: Column[]): void {
  setStorageItem(COLUMNS_KEY, JSON.stringify(columns));
}

// ── Store ────────────────────────────────────────────────────────────────────

interface TaskBoardState {
  tasks: Task[];
  columns: Column[];
  hydrated: boolean;

  // Column CRUD
  addColumn: (input?: { label?: string; accent?: ColumnAccent }) => Column;
  renameColumn: (id: TaskStatus, label: string) => void;
  setColumnAccent: (id: TaskStatus, accent: ColumnAccent) => void;
  deleteColumn: (id: TaskStatus) => void;
  reorderColumns: (orderedIds: TaskStatus[]) => void;

  viewMode: TaskViewMode;
  listSortColumn: ListSortColumn;
  listSortDirection: ListSortDirection;
  listGroupBy: ListGroupBy;
  listCollapsedGroups: string[];
  setViewMode: (mode: TaskViewMode) => void;
  setListSort: (column: ListSortColumn, direction?: ListSortDirection) => void;
  setListGroupBy: (groupBy: ListGroupBy) => void;
  toggleListGroupCollapse: (groupKey: string) => void;

  searchQuery: string;
  priorityFilter: TaskPriority[];
  difficultyFilter: TaskDifficulty[];
  dueDateFilter: DueDateFilter;
  setSearchQuery: (q: string) => void;
  setPriorityFilter: (p: TaskPriority[]) => void;
  setDifficultyFilter: (d: TaskDifficulty[]) => void;
  setDueDateFilter: (f: DueDateFilter) => void;
  clearAllFilters: () => void;

  hydrate: () => void;

  addTask: (input: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: TaskPriority;
    difficulty?: TaskDifficulty;
    dueDate?: string | null;
    durationMinutes?: number;
    parentTaskId?: string | null;
    depth?: number;
  }) => Task | null;

  addSubtask: (
    parentId: string,
    input: { title: string; priority?: TaskPriority; difficulty?: TaskDifficulty },
  ) => Task | null;

  duplicateTask: (taskId: string) => void;
  /** id of the most recently duplicated task — used for highlight flash */
  recentlyDuplicatedId: string | null;
  clearRecentlyDuplicated: () => void;

  updateTask: (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, toStatus: TaskStatus, toIndex?: number) => void;
  reorderColumn: (status: TaskStatus, orderedIds: string[]) => void;
}

// During development, expose the store on window for test scripts.
// Stripped out in production builds (process.env.NODE_ENV === 'production').

export const useTaskBoardStore = create<TaskBoardState>((set, get) => ({
  tasks: [],
  columns: [...DEFAULT_COLUMNS],
  hydrated: false,
  recentlyDuplicatedId: null,

  ...defaultViewPrefs(),
  searchQuery: '',
  priorityFilter: [],
  difficultyFilter: [],
  dueDateFilter: 'all',

  hydrate: () => {
    if (get().hydrated) return;
    set({ tasks: loadTasks(), columns: loadColumns(), hydrated: true, ...loadViewPrefs() });
  },

  // ── Column CRUD ────────────────────────────────────────────────────────────

  addColumn: ({ label, accent } = {}) => {
    const existing = get().columns;
    const trimmed = (label ?? `New column`).trim() || 'New column';
    const usedAccents = new Set(existing.map((c) => c.accent));
    const pickedAccent: ColumnAccent =
      accent ?? COLUMN_ACCENTS.find((a) => !usedAccents.has(a)) ?? 'neutral';
    const column: Column = { id: uid('col_'), label: trimmed, accent: pickedAccent };
    const next = [...existing, column];
    saveColumns(next);
    set({ columns: next });
    return column;
  },

  renameColumn: (id, label) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    set((state) => {
      const next = state.columns.map((c) => (c.id === id ? { ...c, label: trimmed } : c));
      saveColumns(next);
      return { columns: next };
    });
  },

  setColumnAccent: (id, accent) => {
    set((state) => {
      const next = state.columns.map((c) => (c.id === id ? { ...c, accent } : c));
      saveColumns(next);
      return { columns: next };
    });
  },

  deleteColumn: (id) => {
    const state = get();
    if (state.columns.length <= 1) return; // never delete last column
    const idx = state.columns.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const remaining = state.columns.filter((c) => c.id !== id);
    // Move tasks of the deleted column to the first remaining column
    const firstRemainingId = remaining[0]!.id;
    const now = new Date().toISOString();
    const targetExisting = state.tasks.filter((t) => t.status === firstRemainingId);
    const maxOrder = targetExisting.length > 0 ? Math.max(...targetExisting.map((t) => t.order)) : -1;
    const migrated = state.tasks.filter((t) => t.status === id);
    const migratedSorted = migrated
      .sort((a, b) => a.order - b.order)
      .map((t, i) => ({ ...t, status: firstRemainingId, order: maxOrder + 1 + i, updatedAt: now }));
    const others = state.tasks.filter((t) => t.status !== id);
    const nextTasks = [...others, ...migratedSorted];
    saveColumns(remaining);
    saveTasks(nextTasks);
    set({ columns: remaining, tasks: nextTasks });
  },

  reorderColumns: (orderedIds) => {
    set((state) => {
      const map = new Map(state.columns.map((c) => [c.id, c]));
      const next = orderedIds.map((id) => map.get(id)).filter((c): c is Column => !!c);
      // Ensure no columns were lost
      for (const c of state.columns) if (!next.find((n) => n.id === c.id)) next.push(c);
      saveColumns(next);
      return { columns: next };
    });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
    saveViewPrefs({ ...loadViewPrefs(), viewMode: mode });
  },
  setListSort: (column, direction) => {
    const current = get();
    const dir =
      direction ??
      (current.listSortColumn === column && current.listSortDirection === 'asc' ? 'desc' : 'asc');
    set({ listSortColumn: column, listSortDirection: dir });
    saveViewPrefs({ ...loadViewPrefs(), listSortColumn: column, listSortDirection: dir });
  },
  setListGroupBy: (groupBy) => {
    set({ listGroupBy: groupBy, listCollapsedGroups: [] });
    saveViewPrefs({ ...loadViewPrefs(), listGroupBy: groupBy, listCollapsedGroups: [] });
  },
  toggleListGroupCollapse: (groupKey) => {
    const current = get().listCollapsedGroups;
    const next = current.includes(groupKey)
      ? current.filter((k) => k !== groupKey)
      : [...current, groupKey];
    set({ listCollapsedGroups: next });
    saveViewPrefs({ ...loadViewPrefs(), listCollapsedGroups: next });
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setPriorityFilter: (p) => set({ priorityFilter: p }),
  setDifficultyFilter: (d) => set({ difficultyFilter: d }),
  setDueDateFilter: (f) => set({ dueDateFilter: f }),
  clearAllFilters: () =>
    set({ searchQuery: '', priorityFilter: [], difficultyFilter: [], dueDateFilter: 'all' }),

  addTask: ({
    title,
    description,
    status,
    priority = 'medium',
    difficulty = 'medium',
    dueDate,
    durationMinutes,
    parentTaskId = null,
    depth = 0,
  }) => {
    const trimmed = title.trim();
    if (!trimmed) return null;

    const nextStatus = isTaskStatus(status) ? status : 'todo';
    const nextPriority = isTaskPriority(priority) ? priority : 'medium';

    const now = new Date().toISOString();
    const columnTasks = get().tasks.filter((t) => t.status === nextStatus);
    const maxOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map((t) => t.order)) : -1;

    const task: Task = {
      id: uid(),
      title: trimmed,
      description: description?.trim() || undefined,
      status: nextStatus,
      priority: nextPriority,
      difficulty: (['easy', 'medium', 'hard'].includes(difficulty)
        ? difficulty
        : 'medium') as TaskDifficulty,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
      dueDate: normalizeDueDateString(dueDate),
      durationMinutes: durationMinutes ?? 30,
      parentTaskId: parentTaskId ?? null,
      depth: depth ?? 0,
    };

    set((state) => {
      const next = [...state.tasks, task];
      saveTasks(next);
      return { tasks: next };
    });

    return task;
  },

  addSubtask: (parentId, { title, priority = 'medium', difficulty = 'medium' }) => {
    const parent = get().tasks.find((t) => t.id === parentId);
    if (!parent) return null;
    const parentDepth = parent.depth ?? 0;
    if (parentDepth >= 2) return null;

    return get().addTask({
      title,
      status: 'todo',
      priority,
      difficulty,
      parentTaskId: parentId,
      depth: parentDepth + 1,
    });
  },

  duplicateTask: (taskId) => {
    const original = get().tasks.find((t) => t.id === taskId);
    if (!original) return;

    const now = new Date().toISOString();
    const newId = uid();

    set((state) => {
      const bumped = state.tasks.map((t) =>
        t.status === 'todo' && !t.parentTaskId ? { ...t, order: t.order + 1 } : t,
      );
      const copy: Task = {
        ...original,
        id: newId,
        title: `${original.title} (copy)`,
        status: 'todo',
        order: 0,
        createdAt: now,
        updatedAt: now,
        parentTaskId: null,
        depth: 0,
      };
      const next = [...bumped, copy];
      saveTasks(next);
      return { tasks: next, recentlyDuplicatedId: newId };
    });
  },

  clearRecentlyDuplicated: () => set({ recentlyDuplicatedId: null }),

  updateTask: (id, patch) => {
    set((state) => {
      const existing = state.tasks.find((t) => t.id === id);
      if (!existing) return state;

      const nextTitle = patch.title !== undefined ? patch.title.trim() : existing.title;
      if (!nextTitle) return state;

      const nextStatus =
        patch.status !== undefined && isTaskStatus(patch.status) ? patch.status : existing.status;
      const nextPriority =
        patch.priority !== undefined && isTaskPriority(patch.priority)
          ? patch.priority
          : existing.priority;
      const validDifficulties = ['easy', 'medium', 'hard'] as const;
      const nextDifficulty =
        patch.difficulty !== undefined &&
        validDifficulties.includes(patch.difficulty as (typeof validDifficulties)[number])
          ? patch.difficulty
          : existing.difficulty ?? 'medium';
      const nextDescription =
        patch.description !== undefined ? patch.description?.trim() || undefined : existing.description;
      const nextDueDate =
        patch.dueDate !== undefined ? normalizeDueDateString(patch.dueDate) : existing.dueDate ?? null;
      const nextDurationMinutes =
        patch.durationMinutes !== undefined
          ? typeof patch.durationMinutes === 'number' && patch.durationMinutes > 0
            ? patch.durationMinutes
            : existing.durationMinutes
          : existing.durationMinutes;
      const now = new Date().toISOString();

      if (nextStatus === existing.status) {
        const next = state.tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                title: nextTitle,
                description: nextDescription,
                priority: nextPriority,
                difficulty: nextDifficulty,
                durationMinutes: nextDurationMinutes,
                dueDate: nextDueDate,
                updatedAt: now,
              }
            : task,
        );
        saveTasks(next);
        return { tasks: next };
      }

      const remainingTasks = state.tasks.filter((task) => task.id !== id);
      const reindexedSourceTasks = remainingTasks
        .filter((task) => task.status === existing.status)
        .sort((left, right) => left.order - right.order)
        .map((task, index) => ({ ...task, order: index }));

      const nextOrder =
        remainingTasks
          .filter((task) => task.status === nextStatus)
          .reduce((highest, task) => Math.max(highest, task.order), -1) + 1;

      const updatedTask: Task = {
        ...existing,
        title: nextTitle,
        description: nextDescription,
        status: nextStatus,
        priority: nextPriority,
        difficulty: nextDifficulty,
        durationMinutes: nextDurationMinutes,
        dueDate: nextDueDate,
        order: nextOrder,
        updatedAt: now,
      };

      const otherTasks = remainingTasks.filter((task) => task.status !== existing.status);
      const next = [...otherTasks, ...reindexedSourceTasks, updatedTask];
      saveTasks(next);
      return { tasks: next };
    });
  },

  deleteTask: (id) => {
    const allTasks = get().tasks;
    const collectDescendants = (pid: string): string[] => {
      const children = allTasks.filter((t) => t.parentTaskId === pid);
      return children.flatMap((c) => [c.id, ...collectDescendants(c.id)]);
    };
    const idsToRemove = new Set([id, ...collectDescendants(id)]);

    set((state) => {
      const next = state.tasks.filter((t) => !idsToRemove.has(t.id));
      saveTasks(next);
      return { tasks: next };
    });
  },

  moveTask: (id, toStatus, toIndex) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return state;

      const destTasks = state.tasks
        .filter((t) => t.status === toStatus && t.id !== id)
        .sort((a, b) => a.order - b.order);

      const insertAt =
        toIndex !== undefined ? Math.max(0, Math.min(toIndex, destTasks.length)) : destTasks.length;

      destTasks.splice(insertAt, 0, { ...task, status: toStatus });

      const updatedDest = destTasks.map((t, i) => ({
        ...t,
        order: i,
        updatedAt: new Date().toISOString(),
      }));

      const sourceStatus = task.status;
      let finalTasks: Task[];

      if (sourceStatus === toStatus) {
        finalTasks = [...state.tasks.filter((t) => t.status !== toStatus), ...updatedDest];
      } else {
        const srcTasks = state.tasks
          .filter((t) => t.status === sourceStatus && t.id !== id)
          .sort((a, b) => a.order - b.order)
          .map((t, i) => ({ ...t, order: i }));

        finalTasks = [
          ...state.tasks.filter((t) => t.status !== toStatus && t.status !== sourceStatus && t.id !== id),
          ...srcTasks,
          ...updatedDest,
        ];
      }

      saveTasks(finalTasks);
      return { tasks: finalTasks };
    });
  },

  reorderColumn: (status, orderedIds) => {
    set((state) => {
      const idSet = new Set(orderedIds);
      const otherTasks = state.tasks.filter((t) => t.status !== status || !idSet.has(t.id));
      const taskMap = new Map(state.tasks.map((t) => [t.id, t]));
      const now = new Date().toISOString();

      const reordered = orderedIds
        .map((id) => taskMap.get(id))
        .filter(Boolean)
        .map((t, i) => ({ ...t!, status, order: i, updatedAt: now }));

      const next = [...otherTasks, ...reordered];
      saveTasks(next);
      return { tasks: next };
    });
  },
}));

// Dev-only: expose the store on `window.__kanban` for browser console testing.
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as unknown as { __kanban?: typeof useTaskBoardStore }).__kanban = useTaskBoardStore;
}
