/** A column id is just a string — columns are now user-creatable. */
export type TaskStatus = string;
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';

/** Built-in column ids retained for migration + sensible defaults. */
export const DEFAULT_COLUMN_TODO = 'todo';
export const DEFAULT_COLUMN_DOING = 'doing';
export const DEFAULT_COLUMN_DONE = 'done';

/** Accents drive the dot color in the column header. */
export type ColumnAccent =
  | 'neutral'
  | 'primary'
  | 'emerald'
  | 'sky'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'pink';

export const COLUMN_ACCENT_DOT: Record<ColumnAccent, string> = {
  neutral: 'bg-muted-foreground',
  primary: 'bg-primary',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  pink: 'bg-pink-500',
};

export const COLUMN_ACCENTS: ColumnAccent[] = [
  'neutral',
  'primary',
  'emerald',
  'sky',
  'amber',
  'rose',
  'violet',
  'pink',
];

export interface Column {
  id: TaskStatus;
  label: string;
  accent: ColumnAccent;
}

/** Default columns used when the user hasn't customized. */
export const DEFAULT_COLUMNS: Column[] = [
  { id: DEFAULT_COLUMN_TODO, label: 'To Do', accent: 'neutral' },
  { id: DEFAULT_COLUMN_DOING, label: 'Doing', accent: 'primary' },
  { id: DEFAULT_COLUMN_DONE, label: 'Done', accent: 'emerald' },
];

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  order: number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string | null;
  durationMinutes?: number;
  parentTaskId?: string | null;
  depth?: number;
}

// ── Public (nested) data API ─────────────────────────────────────────────────
// The store keeps a flat task list internally; consumers exchange data with the
// component through this nested column → card → subtask shape instead.

/** A subtask nested under a card. Up to two levels of nesting are supported. */
export interface KanbanSubtask {
  id: string;
  title: string;
  done?: boolean;
  priority?: TaskPriority;
  difficulty?: TaskDifficulty;
  subtasks?: KanbanSubtask[];
}

/** A card (task) in the public data API. */
export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  difficulty?: TaskDifficulty;
  dueDate?: string | null;
  durationMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
  subtasks?: KanbanSubtask[];
}

/** A column with its cards in the public data API. */
export interface KanbanColumn {
  id: string;
  label: string;
  accent?: ColumnAccent;
  cards: KanbanCard[];
}

/** Emitted when a card is dropped in a new position (same or other column). */
export interface KanbanCardMoveEvent {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex: number;
}
