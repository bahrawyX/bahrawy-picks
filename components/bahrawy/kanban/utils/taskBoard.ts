import {
  format,
  isToday,
  isTomorrow,
  isValid,
  parseISO,
  startOfDay,
} from 'date-fns';

import type {
  Column,
  ColumnAccent,
  KanbanCard,
  KanbanColumn,
  KanbanSubtask,
  Task,
  TaskDifficulty,
  TaskPriority,
  TaskStatus,
} from '../types/task';
import {
  COLUMN_ACCENTS,
  DEFAULT_COLUMNS,
  DEFAULT_COLUMN_TODO,
  DEFAULT_COLUMN_DONE,
} from '../types/task';
import { uid } from '../lib/uid';

const VALID_PRIORITIES = new Set<TaskPriority>(['low', 'medium', 'high']);
const VALID_DIFFICULTIES = new Set<TaskDifficulty>(['easy', 'medium', 'hard']);
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

type PersistedTaskRecord = Record<string, unknown>;

export interface DueDatePresentation {
  label: string;
  title: string;
  className: string;
}

/** Now that columns are user-defined, status is any non-empty string. */
export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === 'string' && VALID_PRIORITIES.has(value as TaskPriority);
}

export function normalizeDueDateString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!DATE_ONLY_REGEX.test(trimmed)) return null;

  const parsed = parseISO(trimmed);
  if (!isValid(parsed)) return null;

  return format(parsed, 'yyyy-MM-dd');
}

export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null;
  const normalized = normalizeDueDateString(value);
  if (!normalized) return null;

  const parsed = parseISO(normalized);
  return isValid(parsed) ? parsed : null;
}

export function formatDateOnly(value: string | null | undefined, pattern = 'MMM d, yyyy'): string | null {
  const parsed = parseDateOnly(value);
  return parsed ? format(parsed, pattern) : null;
}

export function getDueDatePresentation(
  dueDate: string | null | undefined,
  status: TaskStatus,
): DueDatePresentation | null {
  const parsed = parseDateOnly(dueDate);
  if (!parsed) return null;

  const fullDate = format(parsed, 'EEEE, MMMM d');
  const today = startOfDay(new Date()).getTime();
  const target = startOfDay(parsed).getTime();

  // The "Overdue" / "Completed" treatment uses the canonical Done id when
  // present. Custom columns won't get the muted "completed" treatment but the
  // overdue rule still hides only for the canonical Done.
  if (status !== DEFAULT_COLUMN_DONE && target < today) {
    return {
      label: 'Overdue',
      title: `Due ${fullDate}`,
      className:
        'border-rose-300/70 bg-rose-50/90 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/45 dark:text-rose-300',
    };
  }

  if (status === DEFAULT_COLUMN_DONE) {
    return {
      label: format(parsed, 'EEE, MMM d'),
      title: `Completed task due ${fullDate}`,
      className:
        'border-zinc-300/40 bg-zinc-100/60 text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-800/55 dark:text-zinc-300',
    };
  }

  if (isToday(parsed)) {
    return {
      label: 'Today',
      title: `Due today · ${fullDate}`,
      className:
        'border-primary/25 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15 dark:text-primary-foreground/90',
    };
  }

  if (isTomorrow(parsed)) {
    return {
      label: 'Tomorrow',
      title: `Due tomorrow · ${fullDate}`,
      className:
        'border-border/70 bg-muted/60 text-muted-foreground dark:border-border/80 dark:bg-muted/50 dark:text-muted-foreground',
    };
  }

  return {
    label: format(parsed, 'EEE, MMM d'),
    title: `Due ${fullDate}`,
    className:
      'border-border/70 bg-muted/60 text-muted-foreground dark:border-border/80 dark:bg-muted/50 dark:text-muted-foreground',
  };
}

export function getDoingFocusHint(count: number): string {
  if (count === 0) return 'No active tasks';
  if (count <= 3) return 'Good focus range';
  if (count <= 5) return 'Getting busy';
  return 'Consider narrowing focus';
}

function normalizePersistedTask(rawTask: PersistedTaskRecord, index: number): Task | null {
  const title = typeof rawTask.title === 'string' ? rawTask.title.trim() : '';
  if (!title) return null;

  const now = new Date().toISOString();
  const createdAt =
    typeof rawTask.createdAt === 'string' && !Number.isNaN(Date.parse(rawTask.createdAt))
      ? rawTask.createdAt
      : now;
  const updatedAt =
    typeof rawTask.updatedAt === 'string' && !Number.isNaN(Date.parse(rawTask.updatedAt))
      ? rawTask.updatedAt
      : createdAt;

  return {
    id:
      typeof rawTask.id === 'string' && rawTask.id.trim()
        ? rawTask.id
        : `task_${createdAt}_${index}`,
    title,
    description:
      typeof rawTask.description === 'string' && rawTask.description.trim()
        ? rawTask.description.trim()
        : undefined,
    status: isTaskStatus(rawTask.status) ? rawTask.status : DEFAULT_COLUMN_TODO,
    priority: isTaskPriority(rawTask.priority) ? rawTask.priority : 'medium',
    difficulty: (['easy', 'medium', 'hard'] as const).includes(
      rawTask.difficulty as 'easy' | 'medium' | 'hard',
    )
      ? (rawTask.difficulty as 'easy' | 'medium' | 'hard')
      : 'medium',
    durationMinutes:
      typeof rawTask.durationMinutes === 'number' && rawTask.durationMinutes > 0
        ? rawTask.durationMinutes
        : 30,
    order: typeof rawTask.order === 'number' && Number.isFinite(rawTask.order) ? rawTask.order : index,
    createdAt,
    updatedAt,
    dueDate: normalizeDueDateString(rawTask.dueDate),
    parentTaskId:
      typeof rawTask.parentTaskId === 'string' && rawTask.parentTaskId.trim()
        ? rawTask.parentTaskId
        : null,
    depth:
      typeof rawTask.depth === 'number' && Number.isFinite(rawTask.depth)
        ? Math.max(0, Math.min(2, rawTask.depth))
        : 0,
  };
}

export function isColumnAccent(value: unknown): value is ColumnAccent {
  return typeof value === 'string' && (COLUMN_ACCENTS as readonly string[]).includes(value);
}

// ── Public (nested) data API ↔ internal (flat) state conversion ─────────────

/** Convert the public nested column/card/subtask shape to the flat store state. */
export function kanbanColumnsToState(input: KanbanColumn[]): {
  tasks: Task[];
  columns: Column[];
} {
  const columns: Column[] = [];
  const tasks: Task[] = [];
  const now = new Date().toISOString();
  const seenColumnIds = new Set<string>();
  const seenTaskIds = new Set<string>();

  const taskId = (candidate: unknown): string => {
    const id =
      typeof candidate === 'string' && candidate.trim() && !seenTaskIds.has(candidate)
        ? candidate
        : uid();
    seenTaskIds.add(id);
    return id;
  };

  const pushSubtasks = (
    subtasks: KanbanSubtask[] | undefined,
    parentTaskId: string,
    depth: number,
  ): void => {
    if (!Array.isArray(subtasks) || depth > 2) return;
    let order = 0;
    for (const sub of subtasks) {
      if (!sub || typeof sub.title !== 'string' || !sub.title.trim()) continue;
      const id = taskId(sub.id);
      tasks.push({
        id,
        title: sub.title.trim(),
        status: sub.done ? DEFAULT_COLUMN_DONE : DEFAULT_COLUMN_TODO,
        priority: isTaskPriority(sub.priority) ? sub.priority : 'medium',
        difficulty: VALID_DIFFICULTIES.has(sub.difficulty as TaskDifficulty)
          ? (sub.difficulty as TaskDifficulty)
          : 'medium',
        order: order++,
        createdAt: now,
        updatedAt: now,
        dueDate: null,
        durationMinutes: 30,
        parentTaskId,
        depth,
      });
      pushSubtasks(sub.subtasks, id, depth + 1);
    }
  };

  for (const col of Array.isArray(input) ? input : []) {
    if (
      !col ||
      typeof col.id !== 'string' ||
      !col.id.trim() ||
      typeof col.label !== 'string' ||
      !col.label.trim() ||
      seenColumnIds.has(col.id)
    ) {
      continue;
    }
    seenColumnIds.add(col.id);
    columns.push({
      id: col.id,
      label: col.label.trim(),
      accent: isColumnAccent(col.accent) ? col.accent : 'neutral',
    });

    let order = 0;
    for (const card of Array.isArray(col.cards) ? col.cards : []) {
      if (!card || typeof card.title !== 'string' || !card.title.trim()) continue;
      const id = taskId(card.id);
      const createdAt =
        typeof card.createdAt === 'string' && !Number.isNaN(Date.parse(card.createdAt))
          ? card.createdAt
          : now;
      tasks.push({
        id,
        title: card.title.trim(),
        description:
          typeof card.description === 'string' && card.description.trim()
            ? card.description.trim()
            : undefined,
        status: col.id,
        priority: isTaskPriority(card.priority) ? card.priority : 'medium',
        difficulty: VALID_DIFFICULTIES.has(card.difficulty as TaskDifficulty)
          ? (card.difficulty as TaskDifficulty)
          : 'medium',
        order: order++,
        createdAt,
        updatedAt:
          typeof card.updatedAt === 'string' && !Number.isNaN(Date.parse(card.updatedAt))
            ? card.updatedAt
            : createdAt,
        dueDate: normalizeDueDateString(card.dueDate),
        durationMinutes:
          typeof card.durationMinutes === 'number' && card.durationMinutes > 0
            ? card.durationMinutes
            : 30,
        parentTaskId: null,
        depth: 0,
      });
      pushSubtasks(card.subtasks, id, 1);
    }
  }

  return { tasks, columns: columns.length > 0 ? columns : [...DEFAULT_COLUMNS] };
}

function buildChildrenMap(tasks: Task[]): Map<string, Task[]> {
  const childrenOf = new Map<string, Task[]>();
  for (const task of tasks) {
    if (!task.parentTaskId) continue;
    const list = childrenOf.get(task.parentTaskId) ?? [];
    list.push(task);
    childrenOf.set(task.parentTaskId, list);
  }
  for (const list of childrenOf.values()) list.sort((a, b) => a.order - b.order);
  return childrenOf;
}

function toKanbanSubtask(task: Task, childrenOf: Map<string, Task[]>): KanbanSubtask {
  const children = childrenOf.get(task.id);
  const subtask: KanbanSubtask = {
    id: task.id,
    title: task.title,
    done: task.status === DEFAULT_COLUMN_DONE,
    priority: task.priority,
    difficulty: task.difficulty,
  };
  if (children && children.length > 0) {
    subtask.subtasks = children.map((child) => toKanbanSubtask(child, childrenOf));
  }
  return subtask;
}

function toKanbanCard(task: Task, childrenOf: Map<string, Task[]>): KanbanCard {
  const children = childrenOf.get(task.id);
  const card: KanbanCard = {
    id: task.id,
    title: task.title,
    priority: task.priority,
    difficulty: task.difficulty,
    dueDate: task.dueDate ?? null,
    durationMinutes: task.durationMinutes,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
  if (task.description !== undefined) card.description = task.description;
  if (children && children.length > 0) {
    card.subtasks = children.map((child) => toKanbanSubtask(child, childrenOf));
  }
  return card;
}

/** Convert the flat store state to the public nested column/card shape. */
export function stateToKanbanColumns(tasks: Task[], columns: Column[]): KanbanColumn[] {
  const childrenOf = buildChildrenMap(tasks);
  const columnIds = new Set(columns.map((c) => c.id));
  const fallbackId = columns[0]?.id;

  const rootsByColumn = new Map<string, Task[]>();
  for (const task of tasks) {
    if (task.parentTaskId) continue;
    // Tasks whose status doesn't match a known column render in the first
    // column, so export them there as well.
    const columnId = columnIds.has(task.status) ? task.status : fallbackId;
    if (columnId === undefined) continue;
    const list = rootsByColumn.get(columnId) ?? [];
    list.push(task);
    rootsByColumn.set(columnId, list);
  }
  for (const list of rootsByColumn.values()) list.sort((a, b) => a.order - b.order);

  return columns.map((col) => ({
    id: col.id,
    label: col.label,
    accent: col.accent,
    cards: (rootsByColumn.get(col.id) ?? []).map((task) => toKanbanCard(task, childrenOf)),
  }));
}

/** Convert a single flat task (plus its subtasks) to the public card shape. */
export function taskToKanbanCard(task: Task, allTasks: Task[]): KanbanCard {
  return toKanbanCard(task, buildChildrenMap(allTasks));
}

export function normalizePersistedTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];

  // Bucket by whatever status string each task has, then sort each bucket
  // by order (with createdAt tiebreaker) and renumber 0..n-1.
  const buckets = new Map<TaskStatus, Task[]>();

  raw.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') return;
    const task = normalizePersistedTask(entry as PersistedTaskRecord, index);
    if (!task) return;
    const list = buckets.get(task.status) ?? [];
    list.push(task);
    buckets.set(task.status, list);
  });

  const result: Task[] = [];
  for (const list of buckets.values()) {
    list
      .sort((left, right) => {
        if (left.order !== right.order) return left.order - right.order;
        return left.createdAt.localeCompare(right.createdAt);
      })
      .forEach((task, index) => result.push({ ...task, order: index }));
  }
  return result;
}
