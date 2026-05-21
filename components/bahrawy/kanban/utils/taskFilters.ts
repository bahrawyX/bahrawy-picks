import type { Task, TaskPriority, TaskDifficulty } from '../types/task';
import type { DueDateFilter } from '../store/useTaskBoardStore';
import {
  startOfToday,
  isToday,
  isThisWeek,
  addDays,
  isWithinInterval,
  isBefore,
} from 'date-fns';

export function filterTasks(
  tasks: Task[],
  allTasks: Task[],
  search: string,
  priorities: TaskPriority[],
  difficulties: TaskDifficulty[],
  dueDateFilter: DueDateFilter,
): Task[] {
  const query = search.trim().toLowerCase();
  const today = startOfToday();

  return tasks.filter((task) => {
    if (priorities.length > 0 && !priorities.includes(task.priority)) return false;
    if (difficulties.length > 0 && !difficulties.includes(task.difficulty ?? 'medium')) return false;

    if (dueDateFilter !== 'all') {
      const hasDate = !!task.dueDate;
      const due = hasDate ? new Date(task.dueDate!) : null;
      switch (dueDateFilter) {
        case 'no_date':
          if (hasDate) return false;
          break;
        case 'has_date':
          if (!hasDate) return false;
          break;
        case 'overdue':
          if (!due || !isBefore(due, today) || task.status === 'done') return false;
          break;
        case 'today':
          if (!due || !isToday(due)) return false;
          break;
        case 'this_week':
          if (!due || !isThisWeek(due, { weekStartsOn: 1 })) return false;
          break;
        case 'next_week': {
          if (!due) return false;
          const weekFromNow = addDays(today, 7);
          const twoWeeksFromNow = addDays(today, 14);
          if (!isWithinInterval(due, { start: weekFromNow, end: twoWeeksFromNow })) return false;
          break;
        }
      }
    }

    if (query) {
      const titleMatch = task.title.toLowerCase().includes(query);
      const descMatch = task.description ? task.description.toLowerCase().includes(query) : false;
      if (titleMatch || descMatch) return true;
      const subtaskMatch = allTasks.some(
        (t) => t.parentTaskId === task.id && t.title.toLowerCase().includes(query),
      );
      return subtaskMatch;
    }

    return true;
  });
}

export function hasActiveFilters(
  search: string,
  priorities: TaskPriority[],
  difficulties: TaskDifficulty[],
  dueDateFilter: DueDateFilter,
): boolean {
  return (
    search.trim().length > 0 ||
    priorities.length > 0 ||
    difficulties.length > 0 ||
    dueDateFilter !== 'all'
  );
}
