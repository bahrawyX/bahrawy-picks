'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface RawEditorProps {
  value: string
  onChange: (value: string) => void
  error: string | null
  readOnly: boolean
  className?: string
}

export function RawEditor({ value, onChange, error, readOnly, className }: RawEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [localValue, setLocalValue] = useState(value)
  const lineNumbers = localValue.split('\n').length

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback(
    (val: string) => {
      setLocalValue(val)
      onChange(val)
    },
    [onChange],
  )

  // Handle Tab for indentation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        const ta = textareaRef.current
        if (!ta) return
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const newVal = localValue.substring(0, start) + '  ' + localValue.substring(end)
        setLocalValue(newVal)
        onChange(newVal)
        // Restore cursor
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2
        })
      }
    },
    [localValue, onChange],
  )

  return (
    <div className={cn('relative flex overflow-hidden', className)}>
      {/* Line numbers */}
      <div className="flex-shrink-0 select-none border-r border-white/[0.06] bg-white/[0.02] px-3 py-3 text-right">
        {Array.from({ length: lineNumbers }).map((_, i) => (
          <div key={i} className="font-mono text-[11px] leading-[1.6] text-white/20">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        className={cn(
          'min-h-[200px] w-full resize-none bg-transparent px-3 py-3 font-mono text-[12px] leading-[1.6] text-white/85 outline-none placeholder:text-white/20',
          error && 'text-red-400',
          readOnly && 'cursor-default',
        )}
      />

      {/* Error indicator */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-red-500/30 bg-red-500/[0.05] px-3 py-1.5">
          <p className="font-mono text-[11px] text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
