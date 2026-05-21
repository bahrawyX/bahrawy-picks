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
