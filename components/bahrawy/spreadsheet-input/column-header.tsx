'use client'

import { useState, useCallback, useRef } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SpreadsheetColumn } from './index'

interface ColumnHeaderProps {
  column: SpreadsheetColumn
  index: number
  width: number
  sortDir: 'asc' | 'desc' | null
  isSelected: boolean
  onSort: (dir: 'asc' | 'desc') => void
  onResize: (newWidth: number) => void
  onSelect: () => void
  onContextMenu: (e: React.MouseEvent) => void
}

export function ColumnHeader({
  column,
  index,
  width,
  sortDir,
  isSelected,
  onSort,
  onResize,
  onSelect,
  onContextMenu,
}: ColumnHeaderProps) {
  const [resizing, setResizing] = useState(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setResizing(true)
      startX.current = e.clientX
      startWidth.current = width

      const handleMouseMove = (ev: MouseEvent) => {
        const diff = ev.clientX - startX.current
        const newWidth = Math.max(
          column.minWidth ?? 60,
          Math.min(column.maxWidth ?? 500, startWidth.current + diff),
        )
        onResize(newWidth)
      }

      const handleMouseUp = () => {
        setResizing(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [width, column.minWidth, column.maxWidth, onResize],
  )

  return (
    <div
      className={cn(
        'relative flex h-8 flex-shrink-0 select-none items-center border-b border-r border-white/[0.06] px-2 text-xs font-medium text-white/50',
        isSelected && 'bg-blue-500/10 text-white/70',
      )}
      style={{ width }}
      onClick={onSelect}
      onContextMenu={onContextMenu}
    >
      <span className="truncate">{column.header}</span>
      {sortDir && (
        <span className="ml-auto">
          {sortDir === 'asc' ? (
            <ArrowUp className="h-3 w-3 text-white/40" />
          ) : (
            <ArrowDown className="h-3 w-3 text-white/40" />
          )}
        </span>
      )}

      {/* Resize handle */}
      <div
        className={cn(
          'absolute -right-1 top-0 z-20 h-full w-2 cursor-col-resize',
          resizing && 'bg-blue-500/20',
        )}
        onMouseDown={handleResizeStart}
      />
    </div>
  )
}
