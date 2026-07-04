'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Task, TaskPriority, TaskDifficulty } from '../../types/task';
import { useTaskBoardStore } from '../../store/useTaskBoardStore';
import { highlightText } from '../../utils/highlightText';
import { getDueDatePresentation } from '../../utils/taskBoard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  PRIORITY_META,
  PRIORITY_OPTIONS,
  DIFFICULTY_META,
  DIFFICULTY_OPTIONS,
} from '../../utils/taskBadges';
import { DifficultyBadge, SignalBarsIcon, FILLED_BARS } from './DifficultyBadge';

// ── Icons ───────────────────────────────────────────────────────────────────

const MoreIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const EditIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

const CopyIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width={12}
    height={12}
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

// ── Types ───────────────────────────────────────────────────────────────────

export interface TaskCardProps {
  task: Task;
  onPriorityChange: (task: Task, priority: TaskPriority) => void;
  onDifficultyChange: (task: Task, difficulty: TaskDifficulty) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
  subtasks?: Task[];
  allTasks?: Task[];
  onAddSubtask?: (parentId: string, title: string) => void;
  onToggleSubtaskDone?: (taskId: string) => void;
  onMarkParentDone?: (taskId: string) => void;
}

// ── Subtask row ─────────────────────────────────────────────────────────────

const SubtaskRow: React.FC<{
  task: Task;
  depth: number;
  children?: Task[];
  allTasks?: Task[];
  onToggleDone?: (id: string) => void;
  onMarkParentDone?: (id: string) => void;
}> = ({ task, depth, children = [], allTasks = [], onToggleDone, onMarkParentDone }) => {
  const isDone = task.status === 'done';
  const indent = depth === 1 ? 'ml-4' : 'ml-8';
  const showPriority = depth < 2;
  const subChildren = allTasks.filter((t) => t.parentTaskId === task.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleDone?.(task.id);

    if (!isDone && children.length > 0) {
      const allSiblingsDone = children.every((c) => (c.id === task.id ? true : c.status === 'done'));
      if (allSiblingsDone && onMarkParentDone) {
        const parentId = task.parentTaskId;
        if (parentId) {
          toast('All subtasks done — mark parent complete?', {
            duration: 8000,
            action: { label: 'Complete', onClick: () => onMarkParentDone(parentId) },
          });
        }
      }
    }
  };

  return (
    <>
      <div
        className={`${indent} flex items-center gap-2 py-1.5 min-h-[32px]`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleToggle}
          className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            isDone
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-border hover:border-primary/50'
          }`}
        >
          {isDone && (
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </button>

        <span
          className={`flex-1 text-xs leading-snug min-w-0 truncate ${
            isDone ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}
        >
          {task.title}
        </span>

        {showPriority && (
          <span
            className={`flex-shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded border ${PRIORITY_META[task.priority].className}`}
          >
            {task.priority[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {subChildren.length > 0 &&
        subChildren.map((sub) => (
          <SubtaskRow
            key={sub.id}
            task={sub}
            depth={sub.depth ?? 0}
            allTasks={allTasks}
            onToggleDone={onToggleDone}
            onMarkParentDone={onMarkParentDone}
          />
        ))}
    </>
  );
};

const InlineAddSubtask: React.FC<{ onAdd: (title: string) => void }> = ({ onAdd }) => {
  const [value, setValue] = useState('');
  const [active, setActive] = useState(false);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed.length <= 255) {
      onAdd(trimmed);
      setValue('');
    }
  };

  if (!active) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActive(true);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="ml-4 text-[11px] text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        + Add subtask
      </button>
    );
  }

  return (
    <div
      className="ml-4 flex items-center gap-1.5 py-1"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <input
        autoFocus
        type="text"
        maxLength={255}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') {
            setActive(false);
            setValue('');
          }
        }}
        onBlur={() => {
          if (!value.trim()) setActive(false);
        }}
        placeholder="Subtask title..."
        className="flex-1 text-xs bg-transparent border-b border-border focus:border-primary outline-none py-0.5 text-foreground placeholder:text-muted-foreground/60"
      />
    </div>
  );
};

// ── TaskCard ────────────────────────────────────────────────────────────────

export const TaskCard = React.memo<TaskCardProps>(
  ({
    task,
    onPriorityChange,
    onDifficultyChange,
    onEdit,
    onDelete,
    isDragOverlay = false,
    subtasks = [],
    allTasks = [],
    onAddSubtask,
    onToggleSubtaskDone,
    onMarkParentDone,
  }) => {
    const searchQuery = useTaskBoardStore((s) => s.searchQuery);
    const recentlyDuplicatedId = useTaskBoardStore((s) => s.recentlyDuplicatedId);
    const clearRecentlyDuplicated = useTaskBoardStore((s) => s.clearRecentlyDuplicated);
    const duplicateTask = useTaskBoardStore((s) => s.duplicateTask);
    const justDuplicated = recentlyDuplicatedId === task.id;

    React.useEffect(() => {
      if (!justDuplicated) return;
      const t = setTimeout(() => clearRecentlyDuplicated(), 700);
      return () => clearTimeout(t);
    }, [justDuplicated, clearRecentlyDuplicated]);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: task.id,
      data: { task },
    });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0 : 1,
      willChange: isDragging ? 'transform' : undefined,
    };

    const [subtasksExpanded, setSubtasksExpanded] = useState(false);
    const subtasksDone = useMemo(() => subtasks.filter((s) => s.status === 'done').length, [subtasks]);
    const subtasksTotal = subtasks.length;
    const hasSubtasks = subtasksTotal > 0;

    const handleAddSubtask = useCallback(
      (title: string) => {
        onAddSubtask?.(task.id, title);
      },
      [onAddSubtask, task.id],
    );

    const dueDate = useMemo(
      () => getDueDatePresentation(task.dueDate, task.status),
      [task.dueDate, task.status],
    );

    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <motion.div
          layout="position"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0, scale: isDragOverlay ? 1.03 : 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className={`
            group relative rounded-xl border bg-card text-card-foreground
            select-none cursor-grab active:cursor-grabbing
            ${isDragOverlay ? 'shadow-lg ring-1 ring-primary/20 border-border' : 'card-lift border-border/70'}
            ${justDuplicated ? 'bg-primary/10 transition-[background-color] duration-[600ms]' : ''}
          `}
          {...listeners}
        >
          <div className="p-3">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-[3px] pt-[3px] opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0">
                <div className="flex gap-[3px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground" />
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground" />
                </div>
                <div className="flex gap-[3px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground" />
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground" />
                </div>
              </div>

              <p className="flex-1 text-sm font-medium leading-snug text-foreground min-w-0 break-words">
                {searchQuery ? highlightText(task.title, searchQuery) : task.title}
              </p>

              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity -mt-0.5 -mr-0.5"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="h-8 w-8 md:h-7 md:w-7 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center"
                      aria-label="Task options"
                    >
                      <MoreIcon />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44" sideOffset={4}>
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <EditIcon />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        duplicateTask(task.id);
                        toast.success('Task duplicated', { duration: 2500 });
                      }}
                    >
                      <CopyIcon />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(task.id)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <TrashIcon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {hasSubtasks && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSubtasksExpanded((prev) => !prev);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={subtasksExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
                aria-expanded={subtasksExpanded}
                className="flex items-center gap-1 pl-[14px] mt-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors rounded"
              >
                <ChevronIcon open={subtasksExpanded} />
                <span className="font-medium">
                  {subtasksDone}/{subtasksTotal} subtasks
                </span>
              </button>
            )}

            {task.description && (
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed line-clamp-2 pl-[14px]">
                {task.description}
              </p>
            )}

            <AnimatePresence initial={false}>
              {subtasksExpanded && hasSubtasks && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden pl-[14px] border-l-2 border-border/50 ml-[14px] mt-1"
                >
                  {subtasks.map((sub) => (
                    <SubtaskRow
                      key={sub.id}
                      task={sub}
                      depth={sub.depth ?? 1}
                      children={subtasks}
                      allTasks={allTasks}
                      onToggleDone={onToggleSubtaskDone}
                      onMarkParentDone={onMarkParentDone}
                    />
                  ))}
                  {(task.depth ?? 0) < 2 && <InlineAddSubtask onAdd={handleAddSubtask} />}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-1.5 pl-[14px] mt-2">
              {isDragOverlay ? (
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${PRIORITY_META[task.priority].className}`}
                >
                  {PRIORITY_META[task.priority].label}
                </span>
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={`inline-flex items-center min-h-11 rounded-xl border px-3 py-1 text-[11px] font-medium transition-colors md:min-h-0 md:rounded-md md:px-2 md:py-0.5 ${PRIORITY_META[task.priority].className}`}
                        aria-label={`${PRIORITY_META[task.priority].label} priority. Click to change`}
                      >
                        {PRIORITY_META[task.priority].label}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={6}
                      className="w-36 border-border bg-popover/95"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      {PRIORITY_OPTIONS.map((priority) => {
                        const selected = task.priority === priority;
                        return (
                          <DropdownMenuItem
                            key={priority}
                            onClick={() => onPriorityChange(task, priority)}
                            className={`text-xs font-medium ${PRIORITY_META[priority].itemClassName}`}
                          >
                            <span className="mr-1.5 inline-block w-2 h-2 rounded-full bg-current/70" />
                            {PRIORITY_META[priority].label}
                            {selected && <span className="ml-auto text-[10px] opacity-80">Current</span>}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {isDragOverlay ? (
                <DifficultyBadge difficulty={task.difficulty} />
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-1 min-h-11 rounded-xl border px-3 py-1 text-[11px] font-medium transition-colors md:min-h-0 md:rounded-md md:px-2 md:py-0.5 ${DIFFICULTY_META[task.difficulty ?? 'medium'].className}`}
                        aria-label={`${DIFFICULTY_META[task.difficulty ?? 'medium'].label} difficulty. Click to change`}
                      >
                        <SignalBarsIcon filled={FILLED_BARS[task.difficulty ?? 'medium']} />
                        {DIFFICULTY_META[task.difficulty ?? 'medium'].label}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={6}
                      className="w-36 border-border bg-popover/95"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      {DIFFICULTY_OPTIONS.map((difficulty) => {
                        const selected = task.difficulty === difficulty;
                        return (
                          <DropdownMenuItem
                            key={difficulty}
                            onClick={() => onDifficultyChange(task, difficulty)}
                            className={`text-xs font-medium ${DIFFICULTY_META[difficulty].itemClassName}`}
                          >
                            <SignalBarsIcon filled={FILLED_BARS[difficulty]} />
                            <span className="ml-1">{DIFFICULTY_META[difficulty].label}</span>
                            {selected && <span className="ml-auto text-[10px] opacity-80">Current</span>}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {dueDate && (
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${dueDate.className}`}
                  title={dueDate.title}
                >
                  {dueDate.label}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  },
);
TaskCard.displayName = 'TaskCard';
