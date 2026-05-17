'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { springGentle } from '@/lib/motion'
import { Button } from '@/components/ui/button'

export interface BulkAction<TData> {
  label: string
  icon?: ReactNode
  onClick: (rows: TData[]) => void
  variant?: 'default' | 'destructive'
}

interface BulkActionBarProps<TData> {
  selectedCount: number
  selectedRows: TData[]
  actions: BulkAction<TData>[]
  onClearSelection: () => void
}

export function BulkActionBar<TData>({
  selectedCount,
  selectedRows,
  actions,
  onClearSelection,
}: BulkActionBarProps<TData>) {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={springGentle}
      className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-black/90 px-4 py-2.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
    >
      <span className="text-sm font-medium text-white/70">
        {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
      </span>

      <span className="h-4 w-px bg-white/10" />

      {actions.map((action) => (
        <Button
          key={action.label}
          size="sm"
          variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
          onClick={() => action.onClick(selectedRows)}
          className={
            action.variant === 'destructive'
              ? 'gap-1.5 border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
              : 'gap-1.5 border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]'
          }
        >
          {action.icon && (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
              {action.icon}
            </span>
          )}
          {action.label}
        </Button>
      ))}

      <Button
        size="sm"
        variant="ghost"
        onClick={onClearSelection}
        className="text-white/40 hover:bg-white/[0.06] hover:text-white/70"
      >
        Clear
      </Button>
    </motion.div>
  )
}
