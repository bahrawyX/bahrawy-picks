'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import type {
  Task,
  TaskPriority,
  TaskDifficulty,
  TaskStatus,
  ColumnAccent,
} from '../../types/task';
import { COLUMN_ACCENT_DOT, COLUMN_ACCENTS, DEFAULT_COLUMN_DOING } from '../../types/task';
import { getDoingFocusHint } from '../../utils/taskBoard';
import { TaskCard } from './TaskCard';
import { LottieAnimation, EMPTY_STATE_TASKS_LAYER_MAP } from '../ui/LottieAnimation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const MoreIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const PencilIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
  </svg>
);

interface TaskColumnProps {
  id: TaskStatus;
  label: string;
  accent: ColumnAccent;
  tasks: Task[];
  isDragOver: boolean;
  canDelete: boolean;
  onPriorityChange: (task: Task, priority: TaskPriority) => void;
  onDifficultyChange: (task: Task, difficulty: TaskDifficulty) => void;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onRenameColumn: (id: TaskStatus, label: string) => void;
  onChangeColumnAccent: (id: TaskStatus, accent: ColumnAccent) => void;
  onDeleteColumn: (id: TaskStatus) => void;
  subtaskMap?: Record<string, Task[]>;
  allTasks?: Task[];
  onAddSubtask?: (parentId: string, title: string) => void;
  onToggleSubtaskDone?: (taskId: string) => void;
  onMarkParentDone?: (taskId: string) => void;
}

export const TaskColumn = React.memo<TaskColumnProps>(
  ({
    id,
    label,
    accent,
    tasks,
    isDragOver,
    canDelete,
    onPriorityChange,
    onDifficultyChange,
    onAddTask,
    onEditTask,
    onDeleteTask,
    onRenameColumn,
    onChangeColumnAccent,
    onDeleteColumn,
    subtaskMap = {},
    allTasks = [],
    onAddSubtask,
    onToggleSubtaskDone,
    onMarkParentDone,
  }) => {
    const { setNodeRef } = useDroppable({ id });
    const { resolvedTheme } = useTheme();

    const [editing, setEditing] = useState(false);
    const [draftLabel, setDraftLabel] = useState(label);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      setDraftLabel(label);
    }, [label]);

    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [editing]);

    const commit = () => {
      const trimmed = draftLabel.trim();
      if (trimmed && trimmed !== label) onRenameColumn(id, trimmed);
      else setDraftLabel(label);
      setEditing(false);
    };

    const cancel = () => {
      setDraftLabel(label);
      setEditing(false);
    };

    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
    const doingHint = useMemo(
      () => (id === DEFAULT_COLUMN_DOING ? getDoingFocusHint(tasks.length) : null),
      [id, tasks.length],
    );

    const handleDelete = () => {
      if (!canDelete) {
        toast.error("Can't delete the last column");
        return;
      }
      if (tasks.length === 0) {
        onDeleteColumn(id);
        toast.success(`Column "${label}" deleted`);
        return;
      }
      toast(`Move ${tasks.length} task${tasks.length === 1 ? '' : 's'} and delete "${label}"?`, {
        duration: 8000,
        action: {
          label: 'Delete',
          onClick: () => onDeleteColumn(id),
        },
      });
    };

    return (
      <div className="flex flex-col w-full h-full min-w-0">
        {/* Header row — accent dot, editable label, count, menu */}
        <div className="mb-3 px-1 -mt-1 py-1 flex items-center gap-2.5 group/col-header">
          {/* Accent dot — opens accent picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Change column color"
                className={`w-2 h-2 rounded-full flex-shrink-0 ${COLUMN_ACCENT_DOT[accent]} hover:scale-150 transition-transform`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40" sideOffset={6}>
              <DropdownMenuLabel>Accent</DropdownMenuLabel>
              <div className="grid grid-cols-4 gap-1 p-1">
                {COLUMN_ACCENTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => onChangeColumnAccent(id, a)}
                    className={`h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted/60 transition-colors ${
                      accent === a ? 'ring-2 ring-offset-2 ring-offset-popover ring-primary/40' : ''
                    }`}
                    aria-label={a}
                  >
                    <span className={`w-3 h-3 rounded-full ${COLUMN_ACCENT_DOT[a]}`} />
                  </button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Label — inline-edit */}
          {editing ? (
            <input
              ref={inputRef}
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') cancel();
              }}
              maxLength={48}
              className="flex-1 min-w-0 font-display text-sm font-semibold text-foreground tracking-[-0.01em] bg-transparent border-b border-primary/50 outline-none px-0.5"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex-1 min-w-0 text-left truncate font-display text-sm font-semibold text-foreground tracking-[-0.01em] hover:text-primary transition-colors"
              aria-label={`Rename column ${label}`}
              title="Click to rename"
            >
              {label}
            </button>
          )}

          {/* Count */}
          <span className="text-[10px] font-semibold tabular-nums text-muted-foreground bg-muted rounded-full px-2 py-0.5 border border-border/50 flex-shrink-0">
            {tasks.length}
          </span>

          {/* Three-dot menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`${label} column options`}
                className="flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors flex-shrink-0"
              >
                <MoreIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40" sideOffset={6}>
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <PencilIcon />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddTask(id)}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add task
              </DropdownMenuItem>
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <TrashIcon />
                    Delete column
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add task button — always last, primary affordance */}
          <button
            type="button"
            onClick={() => onAddTask(id)}
            aria-label={`Add task to ${label}`}
            className="flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
            title={`Add task to ${label}`}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {doingHint && (
          <p className="px-1 pl-[18px] -mt-1.5 mb-2 text-[11px] font-medium text-muted-foreground/75">
            {doingHint}
          </p>
        )}

        {/* Drop zone + card list */}
        <div
          ref={setNodeRef}
          onClick={(e) => {
            if (isDragOver) return;
            if (editing) return;
            if (!(e.target as Element).closest('[data-task-card-wrapper]')) onAddTask(id);
          }}
          className={`flex-1 flex flex-col rounded-xl border p-1.5 transition-colors duration-300 cursor-pointer ${
            isDragOver
              ? 'border-primary/30 bg-primary/10'
              : 'border-border/50 bg-muted/40 hover:bg-muted/50'
          }`}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <div className={`overflow-y-auto no-scrollbar ${tasks.length > 0 ? 'h-full' : ''}`}>
              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {tasks.map((task) => (
                    <motion.div key={task.id} layout data-task-card-wrapper>
                      <TaskCard
                        task={task}
                        onPriorityChange={onPriorityChange}
                        onDifficultyChange={onDifficultyChange}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        subtasks={subtaskMap[task.id] ?? []}
                        allTasks={allTasks}
                        onAddSubtask={onAddSubtask}
                        onToggleSubtaskDone={onToggleSubtaskDone}
                        onMarkParentDone={onMarkParentDone}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </SortableContext>

          {tasks.length === 0 && (
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-2 rounded-xl pointer-events-none">
              {isDragOver ? (
                <p className="text-[11px] text-muted-foreground/50 select-none">Drop here</p>
              ) : (
                <>
                  <LottieAnimation
                    key={resolvedTheme ?? 'unknown'}
                    path="/animations/empty-state-tasks.json"
                    layerColorMap={EMPTY_STATE_TASKS_LAYER_MAP}
                    width={80}
                    height={80}
                    loop
                    autoplay
                  />
                  <p className="text-[11px] text-muted-foreground/40 select-none transition-colors">
                    No tasks yet
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
TaskColumn.displayName = 'TaskColumn';
