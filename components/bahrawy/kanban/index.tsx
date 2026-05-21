'use client'

import { ThemeProvider } from './components/ThemeProvider'
import { TaskBoard } from './components/kanban/TaskBoard'

export function Kanban() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TaskBoard />
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
} from './types/task'
