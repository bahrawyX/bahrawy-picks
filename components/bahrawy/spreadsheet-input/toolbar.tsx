'use client'

import { motion } from 'framer-motion'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Download,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'

interface ToolbarProps {
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onExport?: () => void
  onImportClick?: () => void
}

function ToolbarButton({
  onClick,
  disabled,
  active,
  children,
  label,
}: {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  children: React.ReactNode
  label: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.93 } : undefined}
      transition={springSnappy}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
        active
          ? 'bg-picks-fg/10 text-picks-fg'
          : 'text-picks-fg/40 hover:bg-picks-fg/[0.06] hover:text-picks-fg/70',
        disabled && 'cursor-not-allowed opacity-30',
      )}
      aria-label={label}
    >
      {children}
    </motion.button>
  )
}

export function SpreadsheetToolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onImportClick,
}: ToolbarProps) {
  return (
    <div className="flex h-9 items-center gap-0.5 border-b border-picks-fg/[0.06] bg-picks-fg/[0.02] px-2">
      {/* Undo / Redo */}
      <ToolbarButton onClick={onUndo} disabled={!canUndo} label="Undo">
        <Undo2 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={onRedo} disabled={!canRedo} label="Redo">
        <Redo2 className="h-3.5 w-3.5" />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-picks-fg/[0.06]" />

      {/* Import / Export */}
      {onImportClick && (
        <ToolbarButton onClick={onImportClick} label="Import CSV">
          <Upload className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}
      {onExport && (
        <ToolbarButton onClick={onExport} label="Export CSV">
          <Download className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}
    </div>
  )
}
