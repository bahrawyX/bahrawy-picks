'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import { Checkbox } from '@/components/ui/checkbox'
import type { SpreadsheetColumn } from './index'

interface CellProps {
  column: SpreadsheetColumn
  value: unknown
  width: number
  rowHeight: number
  isSelected: boolean
  isEditing: boolean
  isError: boolean
  displayValue: string
  onSelect: (e: React.MouseEvent) => void
  onDoubleClick: () => void
  onValueChange: (value: unknown) => void
  onCommitEdit: () => void
  onCancelEdit: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function Cell({
  column,
  value,
  width,
  rowHeight,
  isSelected,
  isEditing,
  isError,
  displayValue,
  onSelect,
  onDoubleClick,
  onValueChange,
  onCommitEdit,
  onCancelEdit,
  onKeyDown,
}: CellProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    if (isEditing) {
      setEditValue(value == null ? '' : String(value))
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isEditing, value])

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onValueChange(column.type === 'number' ? Number(editValue) || 0 : editValue)
        onCommitEdit()
      } else if (e.key === 'Escape') {
        onCancelEdit()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        onValueChange(column.type === 'number' ? Number(editValue) || 0 : editValue)
        onCommitEdit()
        // Tab handling is done by parent
        onKeyDown(e)
      }
    },
    [editValue, column.type, onValueChange, onCommitEdit, onCancelEdit, onKeyDown],
  )

  const align = column.align ?? (column.type === 'number' ? 'right' : 'left')

  // Checkbox type
  if (column.type === 'checkbox') {
    return (
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center border-b border-r border-white/[0.04] transition-colors',
          isSelected && 'bg-blue-500/10',
        )}
        style={{ width, height: rowHeight }}
        onClick={onSelect}
        role="gridcell"
      >
        <Checkbox
          checked={!!value}
          onCheckedChange={(checked) => onValueChange(!!checked)}
          aria-label={column.header}
          className="h-3.5 w-3.5 cursor-pointer"
        />
      </div>
    )
  }

  // Select type in edit mode
  if (isEditing && column.type === 'select' && column.options) {
    return (
      <div
        className={cn(
          'flex flex-shrink-0 items-center border-b border-r border-blue-500/30 bg-blue-500/5',
        )}
        style={{ width, height: rowHeight }}
        role="gridcell"
      >
        <motion.select
          initial={{ scale: 1.02 }}
          animate={{ scale: 1 }}
          transition={springSnappy}
          ref={inputRef as unknown as React.Ref<HTMLSelectElement>}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value)
            onValueChange(e.target.value)
            onCommitEdit()
          }}
          onKeyDown={handleEditKeyDown}
          onBlur={onCommitEdit}
          className="h-full w-full bg-transparent px-2 text-xs text-white outline-none"
          autoFocus
        >
          <option value="" className="bg-neutral-900">—</option>
          {column.options.map((opt) => (
            <option key={opt} value={opt} className="bg-neutral-900">
              {opt}
            </option>
          ))}
        </motion.select>
      </div>
    )
  }

  // Editing text/number
  if (isEditing) {
    return (
      <div
        className="flex flex-shrink-0 items-center border-b border-r border-blue-500/30 bg-blue-500/5"
        style={{ width, height: rowHeight }}
        role="gridcell"
      >
        <motion.input
          ref={inputRef}
          initial={{ scale: 1.02 }}
          animate={{ scale: 1 }}
          transition={springSnappy}
          type={column.type === 'number' ? 'number' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={() => {
            onValueChange(column.type === 'number' ? Number(editValue) || 0 : editValue)
            onCommitEdit()
          }}
          className={cn(
            'h-full w-full bg-transparent px-2 text-xs text-white outline-none',
            align === 'right' && 'text-right',
            align === 'center' && 'text-center',
          )}
        />
      </div>
    )
  }

  // Display mode
  return (
    <div
      className={cn(
        'flex flex-shrink-0 cursor-default items-center overflow-hidden border-b border-r border-white/[0.04] px-2 text-xs transition-colors',
        isSelected ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]',
        isError && 'text-red-400',
        column.type === 'readonly' && 'text-white/30',
        !isError && !column.type?.includes('readonly') && 'text-white/70',
      )}
      style={{
        width,
        height: rowHeight,
        textAlign: align,
        justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
      }}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      role="gridcell"
    >
      <span className="truncate">{displayValue}</span>
    </div>
  )
}
