'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Task, TaskPriority, TaskDifficulty, TaskStatus, Column } from '../../types/task';
import { COLUMN_ACCENT_DOT } from '../../types/task';

import {
  useTaskBoardStore,
  type ListSortColumn,
  type ListGroupBy,
} from '../../store/useTaskBoardStore';
import { filterTasks, hasActiveFilters } from '../../utils/taskFilters';
import { highlightText } from '../../utils/highlightText';
import { Button } from '../ui/button';
import {
  PRIORITY_META,
  DIFFICULTY_META,
  PRIORITY_ORDER,
  DIFFICULTY_ORDER,
  STATUS_ORDER,
} from '../../utils/taskBadges';
import { DifficultyBadge } from './DifficultyBadge';
import { getDueDatePresentation } from '../../utils/taskBoard';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// ── Icons ───────────────────────────────────────────────────────────────────

const ChevronRightIcon: React.FC<{ open?: boolean }> = ({ open }) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const SortArrowIcon: React.FC<{ direction: 'asc' | 'desc' }> = ({ direction }) => (
  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    {direction === 'asc' ? <path d="m18 15-6-6-6 6" /> : <path d="m6 9 6 6 6-6" />}
  </svg>
);

const MoreIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const GroupChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// ── Types ───────────────────────────────────────────────────────────────────

export interface TaskListViewProps {
  tasks: Task[];
  subtaskMap: Record<string, Task[]>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildStatusLabels(columns: Column[]): Record<TaskStatus, string> {
  const map: Record<TaskStatus, string> = {};
  for (const c of columns) map[c.id] = c.label;
  return map;
}

function buildStatusDot(columns: Column[]): Record<TaskStatus, string> {
  const map: Record<TaskStatus, string> = {};
  for (const c of columns) map[c.id] = COLUMN_ACCENT_DOT[c.accent];
  return map;
}

const GROUP_LABELS: Record<ListGroupBy, string> = {
  status: 'Status',
  priority: 'Priority',
  difficulty: 'Difficulty',
  dueDate: 'Due Date',
  none: 'None',
};

function getGroupKey(task: Task, groupBy: ListGroupBy): string {
  switch (groupBy) {
    case 'status':
      return task.status;
    case 'priority':
      return task.priority;
    case 'difficulty':
      return task.difficulty ?? 'medium';
    case 'dueDate': {
      if (!task.dueDate) return 'no-date';
      const d = new Date(task.dueDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      if (d <= today) return 'today';
      if (d <= endOfWeek) return 'this-week';
      return 'later';
    }
    default:
      return 'all';
  }
}

function getGroupLabel(key: string, groupBy: ListGroupBy, statusLabels: Record<string, string>): string {
  if (groupBy === 'status') return statusLabels[key] ?? key;
  if (groupBy === 'priority') return PRIORITY_META[key as TaskPriority]?.label ?? key;
  if (groupBy === 'difficulty') return DIFFICULTY_META[key as TaskDifficulty]?.label ?? key;
  if (groupBy === 'dueDate') {
    const map: Record<string, string> = {
      today: 'Today & Overdue',
      'this-week': 'This Week',
      later: 'Later',
      'no-date': 'No Date',
    };
    return map[key] ?? key;
  }
  return 'All Tasks';
}

function getGroupOrder(groupBy: ListGroupBy, statusOrder: string[]): string[] {
  if (groupBy === 'status') return statusOrder;
  if (groupBy === 'priority') return ['high', 'medium', 'low'];
  if (groupBy === 'difficulty') return ['hard', 'medium', 'easy'];
  if (groupBy === 'dueDate') return ['today', 'this-week', 'later', 'no-date'];
  return ['all'];
}

function sortTasks(tasks: Task[], column: ListSortColumn, direction: 'asc' | 'desc'): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    let cmp = 0;
    switch (column) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'priority':
        cmp = (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
        break;
      case 'difficulty':
        cmp = (DIFFICULTY_ORDER[a.difficulty ?? 'medium'] ?? 1) - (DIFFICULTY_ORDER[b.difficulty ?? 'medium'] ?? 1);
        break;
      case 'dueDate': {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        cmp = da - db;
        break;
      }
      case 'status':
        cmp = (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0);
        break;
    }
    return direction === 'desc' ? -cmp : cmp;
  });
  return sorted;
}

// ── Column definitions ──────────────────────────────────────────────────────

interface ColumnDef {
  key: ListSortColumn | 'expand' | 'checkbox' | 'actions';
  label: string;
  width: string;
  sortable: boolean;
  hideOnMobile?: boolean;
}

const COLUMNS: ColumnDef[] = [
  { key: 'expand', label: '', width: 'w-8', sortable: false },
  { key: 'checkbox', label: '', width: 'w-8', sortable: false },
  { key: 'title', label: 'Title', width: 'flex-1 min-w-0', sortable: true },
  { key: 'priority', label: 'Priority', width: 'w-20', sortable: true },
  { key: 'difficulty', label: 'Difficulty', width: 'w-20', sortable: true, hideOnMobile: true },
  { key: 'dueDate', label: 'Due', width: 'w-24', sortable: true },
  { key: 'status', label: 'Status', width: 'w-24', sortable: true },
  { key: 'actions', label: '', width: 'w-10', sortable: false },
];

// ── StatusPopover ───────────────────────────────────────────────────────────

const StatusPopover: React.FC<{
  status: TaskStatus;
  columns: Column[];
  statusLabels: Record<string, string>;
  statusDots: Record<string, string>;
  onStatusChange: (status: TaskStatus) => void;
}> = React.memo(({ status, columns, statusLabels, statusDots, onStatusChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
          }}
          className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md border border-border/50 bg-muted/40 text-foreground hover:bg-muted transition-colors"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status] ?? 'bg-muted-foreground'}`} />
          {statusLabels[status] ?? status}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={4} className="w-36 p-1">
        {columns.map((col) => (
          <button
            key={col.id}
            type="button"
            onClick={() => {
              onStatusChange(col.id);
              setOpen(false);
            }}
            className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              col.id === status
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDots[col.id] ?? 'bg-muted-foreground'}`} />
            {col.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
});
StatusPopover.displayName = 'StatusPopover';

// ── TaskListRow ─────────────────────────────────────────────────────────────

const TaskListRow: React.FC<{
  task: Task;
  subtasks: Task[];
  isSubtask?: boolean;
  searchQuery?: string;
  columns: Column[];
  statusLabels: Record<string, string>;
  statusDots: Record<string, string>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}> = React.memo(
  ({ task, subtasks, isSubtask = false, searchQuery = '', columns, statusLabels, statusDots, onEdit, onDelete, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  const hasSubtasks = subtasks.length > 0 && !isSubtask;
  const isDone = task.status === 'done';
  const recentlyDuplicatedId = useTaskBoardStore((s) => s.recentlyDuplicatedId);
  const justDuplicated = recentlyDuplicatedId === task.id;
  const dueDate = useMemo(() => getDueDatePresentation(task.dueDate, task.status), [task.dueDate, task.status]);

  const handleToggleDone = useCallback(() => {
    onStatusChange(task.id, isDone ? 'todo' : 'done');
  }, [task.id, isDone, onStatusChange]);

  return (
    <>
      <div
        className={`flex items-center gap-0 border-b border-border/50 transition-colors group/row cursor-pointer ${
          isSubtask ? 'h-10 pl-8' : 'h-11'
        } ${isDone ? 'opacity-60' : ''} ${
          justDuplicated ? 'bg-primary/10 transition-[background-color] duration-[600ms]' : ''
        } hover:bg-muted/50`}
        onClick={(e) => {
          if (e.target !== e.currentTarget) {
            const target = e.target as HTMLElement;
            if (target.closest('button,[role="menu"],[role="menuitem"],input,a')) return;
          }
          onEdit(task);
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          if (e.target !== e.currentTarget) return;
          onEdit(task);
        }}
        tabIndex={0}
        role="row"
        aria-label={`Task: ${task.title}`}
      >
        <div className="w-8 flex items-center justify-center flex-shrink-0">
          {hasSubtasks && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => !prev);
              }}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRightIcon open={expanded} />
            </button>
          )}
        </div>

        <div className="w-8 flex items-center justify-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleToggleDone}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              isDone ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:border-primary/50'
            }`}
          >
            {isDone && (
              <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0 px-2">
          <span
            className={`text-sm truncate block ${
              isDone
                ? 'line-through text-muted-foreground'
                : isSubtask
                  ? 'text-muted-foreground'
                  : 'text-foreground'
            }`}
          >
            {searchQuery ? highlightText(task.title, searchQuery) : task.title}
          </span>
        </div>

        <div className="w-20 flex-shrink-0 px-1">
          <span
            className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${PRIORITY_META[task.priority].className}`}
          >
            {PRIORITY_META[task.priority].label}
          </span>
        </div>

        <div className="w-20 flex-shrink-0 px-1 hidden md:flex">
          <DifficultyBadge difficulty={task.difficulty} size="sm" />
        </div>

        <div className="w-24 flex-shrink-0 px-1">
          {dueDate ? (
            <span className={`text-[11px] font-medium ${dueDate.className}`} title={dueDate.title}>
              {dueDate.label}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/40">—</span>
          )}
        </div>

        <div className="w-24 flex-shrink-0 px-1" onClick={(e) => e.stopPropagation()}>
          <StatusPopover
            status={task.status}
            columns={columns}
            statusLabels={statusLabels}
            statusDots={statusDots}
            onStatusChange={(status) => onStatusChange(task.id, status)}
          />
        </div>

        <div className="w-10 flex-shrink-0 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center opacity-0 group-hover/row:opacity-100"
              >
                <MoreIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  useTaskBoardStore.getState().duplicateTask(task.id);
                  toast.success('Task duplicated', { duration: 2500 });
                }}
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && hasSubtasks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {subtasks.map((sub) => (
              <TaskListRow
                key={sub.id}
                task={sub}
                subtasks={[]}
                isSubtask
                searchQuery={searchQuery}
                columns={columns}
                statusLabels={statusLabels}
                statusDots={statusDots}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
TaskListRow.displayName = 'TaskListRow';

// ── Main TaskListView ───────────────────────────────────────────────────────

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  subtaskMap,
  onEdit,
  onDelete,
  onStatusChange,
  onAddTask,
}) => {
  const sortColumn = useTaskBoardStore((s) => s.listSortColumn);
  const sortDirection = useTaskBoardStore((s) => s.listSortDirection);
  const groupBy = useTaskBoardStore((s) => s.listGroupBy);
  const collapsedGroups = useTaskBoardStore((s) => s.listCollapsedGroups);
  const setListSort = useTaskBoardStore((s) => s.setListSort);
  const setListGroupBy = useTaskBoardStore((s) => s.setListGroupBy);
  const toggleGroupCollapse = useTaskBoardStore((s) => s.toggleListGroupCollapse);
  const columns = useTaskBoardStore((s) => s.columns);

  const statusLabels = useMemo(() => buildStatusLabels(columns), [columns]);
  const statusDots = useMemo(() => buildStatusDot(columns), [columns]);
  const statusOrder = useMemo(() => columns.map((c) => c.id), [columns]);

  const searchQuery = useTaskBoardStore((s) => s.searchQuery);
  const priorityFilter = useTaskBoardStore((s) => s.priorityFilter);
  const difficultyFilter = useTaskBoardStore((s) => s.difficultyFilter);
  const dueDateFilter = useTaskBoardStore((s) => s.dueDateFilter);
  const clearAllFilters = useTaskBoardStore((s) => s.clearAllFilters);
  const filtersActive = hasActiveFilters(searchQuery, priorityFilter, difficultyFilter, dueDateFilter);

  const rootTasks = useMemo(() => tasks.filter((t) => !t.parentTaskId), [tasks]);

  const filteredRoot = useMemo(
    () =>
      filtersActive
        ? filterTasks(rootTasks, tasks, searchQuery, priorityFilter, difficultyFilter, dueDateFilter)
        : rootTasks,
    [rootTasks, tasks, filtersActive, searchQuery, priorityFilter, difficultyFilter, dueDateFilter],
  );

  const sorted = useMemo(
    () => sortTasks(filteredRoot, sortColumn, sortDirection),
    [filteredRoot, sortColumn, sortDirection],
  );

  const groups = useMemo(() => {
    if (groupBy === 'none') return [{ key: 'all', label: 'All Tasks', tasks: sorted }];
    const map = new Map<string, Task[]>();
    sorted.forEach((t) => {
      const key = getGroupKey(t, groupBy);
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    });
    return getGroupOrder(groupBy, statusOrder)
      .filter((key) => map.has(key))
      .map((key) => ({
        key,
        label: getGroupLabel(key, groupBy, statusLabels),
        tasks: map.get(key)!,
      }));
  }, [sorted, groupBy, statusOrder, statusLabels]);

  const handleSort = useCallback(
    (col: ListSortColumn) => {
      setListSort(col);
    },
    [setListSort],
  );

  if (rootTasks.length > 0 && filteredRoot.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
        <div className="text-4xl">🔍</div>
        <p className="text-sm text-muted-foreground">No tasks match your filters</p>
        <p className="text-xs text-muted-foreground/60">Try adjusting or clearing your filters</p>
        <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-1">
          Clear all filters
        </Button>
      </div>
    );
  }

  if (rootTasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
        <p className="text-sm text-muted-foreground">No tasks yet</p>
        <button
          type="button"
          onClick={() => onAddTask(columns[0]?.id ?? 'todo')}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          + Add your first task
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <span className="text-[11px] text-muted-foreground font-medium">Group by</span>
        <Select value={groupBy} onValueChange={(v) => setListGroupBy(v as ListGroupBy)}>
          <SelectTrigger className="h-7 w-28 text-xs rounded-lg border-border/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['status', 'priority', 'difficulty', 'dueDate', 'none'] as ListGroupBy[]).map((g) => (
              <SelectItem key={g} value={g} className="text-xs">
                {GROUP_LABELS[g]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar rounded-xl border border-border/50">
        <div className="flex items-center h-8 bg-background border-b border-border sticky top-0 z-10">
          {COLUMNS.map((col) => (
            <div
              key={col.key}
              className={`${col.width} flex-shrink-0 px-1 flex items-center gap-1 ${
                col.hideOnMobile ? 'hidden md:flex' : ''
              }`}
            >
              {col.sortable && (
                <button
                  type="button"
                  onClick={() => handleSort(col.key as ListSortColumn)}
                  aria-sort={
                    sortColumn === col.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  className="flex items-center gap-0.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors rounded"
                >
                  {col.label}
                  {sortColumn === col.key && <SortArrowIcon direction={sortDirection} />}
                </button>
              )}
            </div>
          ))}
        </div>

        {groups.map((group) => {
          const isCollapsed = collapsedGroups.includes(group.key);
          const showGroupHeader = groupBy !== 'none';

          return (
            <div key={group.key}>
              {showGroupHeader && (
                <button
                  type="button"
                  onClick={() => toggleGroupCollapse(group.key)}
                  className="flex items-center gap-2 w-full px-3 h-9 bg-muted/30 border-b border-border/50 sticky top-8 z-[5] hover:bg-muted/50 transition-colors"
                >
                  <GroupChevronIcon open={!isCollapsed} />
                  <span className="text-xs font-semibold text-foreground">{group.label}</span>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">
                    {group.tasks.length}
                  </span>
                </button>
              )}

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    {group.tasks.map((task) => (
                      <TaskListRow
                        key={task.id}
                        task={task}
                        subtasks={subtaskMap[task.id] ?? []}
                        searchQuery={searchQuery}
                        columns={columns}
                        statusLabels={statusLabels}
                        statusDots={statusDots}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
