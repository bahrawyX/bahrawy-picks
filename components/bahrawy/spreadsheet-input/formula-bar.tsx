'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { colToLetter } from '@/lib/formula-utils'

interface FormulaBarProps {
  selectedCol: number
  selectedRow: number
  cellValue: string
  onValueChange: (value: string) => void
  onCommit: () => void
}

export function FormulaBar({
  selectedCol,
  selectedRow,
  cellValue,
  onValueChange,
  onCommit,
}: FormulaBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const address =
    selectedCol >= 0 && selectedRow >= 0
      ? `${colToLetter(selectedCol)}${selectedRow + 1}`
      : ''

  return (
    <div className="flex h-8 items-center border-b border-picks-fg/[0.06] bg-picks-fg/[0.02]">
      {/* Cell address */}
      <div className="flex h-full w-16 flex-shrink-0 items-center justify-center border-r border-picks-fg/[0.06] text-xs font-mono text-picks-fg/50">
        {address}
      </div>
      {/* Formula / value input */}
      <input
        ref={inputRef}
        type="text"
        value={cellValue}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onCommit()
            inputRef.current?.blur()
          }
        }}
        className="h-full flex-1 bg-transparent px-2 text-xs text-picks-fg outline-none placeholder:text-picks-fg/20"
        placeholder="Enter value or formula (e.g. =SUM(A1:A5))"
      />
    </div>
  )
}
