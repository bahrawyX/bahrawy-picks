'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Braces, Code2, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import { TreeNode } from './tree-node'
import { RawEditor } from './raw-editor'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type JsonViewMode = 'tree' | 'raw'

export interface JsonEditorProps {
  value?: Record<string, unknown> | unknown[]
  onChange?: (value: Record<string, unknown> | unknown[]) => void
  defaultValue?: Record<string, unknown> | unknown[]
  readOnly?: boolean
  defaultMode?: JsonViewMode
  defaultExpanded?: boolean
  maxDepth?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function setNestedValue(
  obj: Record<string, unknown> | unknown[],
  path: string[],
  value: unknown,
): Record<string, unknown> | unknown[] {
  const clone = deepClone(obj)
  let current: unknown = clone
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (Array.isArray(current)) {
      current = (current as unknown[])[Number(key)]
    } else {
      current = (current as Record<string, unknown>)[key]
    }
  }
  const lastKey = path[path.length - 1]
  if (Array.isArray(current)) {
    (current as unknown[])[Number(lastKey)] = value
  } else {
    (current as Record<string, unknown>)[lastKey] = value
  }
  return clone
}

function deleteNestedValue(
  obj: Record<string, unknown> | unknown[],
  path: string[],
): Record<string, unknown> | unknown[] {
  const clone = deepClone(obj)
  let current: unknown = clone
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (Array.isArray(current)) {
      current = (current as unknown[])[Number(key)]
    } else {
      current = (current as Record<string, unknown>)[key]
    }
  }
  const lastKey = path[path.length - 1]
  if (Array.isArray(current)) {
    (current as unknown[]).splice(Number(lastKey), 1)
  } else {
    delete (current as Record<string, unknown>)[lastKey]
  }
  return clone
}

function addNestedValue(
  obj: Record<string, unknown> | unknown[],
  path: string[],
  key: string,
  value: unknown,
): Record<string, unknown> | unknown[] {
  const clone = deepClone(obj)
  let current: unknown = clone
  for (const p of path) {
    if (Array.isArray(current)) {
      current = (current as unknown[])[Number(p)]
    } else {
      current = (current as Record<string, unknown>)[p]
    }
  }
  if (Array.isArray(current)) {
    (current as unknown[]).push(value)
  } else {
    (current as Record<string, unknown>)[key] = value
  }
  return clone
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function JsonEditor({
  value: controlledValue,
  onChange,
  defaultValue,
  readOnly = false,
  defaultMode = 'tree',
  defaultExpanded = true,
  maxDepth = 10,
  className,
}: JsonEditorProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<Record<string, unknown> | unknown[]>(
    defaultValue ?? {},
  )
  const [mode, setMode] = useState<JsonViewMode>(defaultMode)
  const [rawString, setRawString] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const currentValue = isControlled ? controlledValue : internalValue

  // Sync raw string when switching modes or value changes
  useEffect(() => {
    setRawString(JSON.stringify(currentValue, null, 2))
    setParseError(null)
  }, [currentValue])

  // ---- Mutations ----

  const updateValue = useCallback(
    (newVal: Record<string, unknown> | unknown[]) => {
      if (!isControlled) setInternalValue(newVal)
      onChange?.(newVal)
    },
    [isControlled, onChange],
  )

  const handleUpdate = useCallback(
    (path: string[], value: unknown) => {
      const newVal = setNestedValue(currentValue, path, value)
      updateValue(newVal)
    },
    [currentValue, updateValue],
  )

  const handleDelete = useCallback(
    (path: string[]) => {
      const newVal = deleteNestedValue(currentValue, path)
      updateValue(newVal)
    },
    [currentValue, updateValue],
  )

  const handleAdd = useCallback(
    (path: string[], key: string, value: unknown) => {
      const newVal = addNestedValue(currentValue, path, key, value)
      updateValue(newVal)
    },
    [currentValue, updateValue],
  )

  const handleRawChange = useCallback(
    (raw: string) => {
      setRawString(raw)
      try {
        const parsed = JSON.parse(raw)
        if (typeof parsed === 'object' && parsed !== null) {
          setParseError(null)
          updateValue(parsed)
        } else {
          setParseError('Root must be an object or array')
        }
      } catch (e) {
        setParseError(e instanceof Error ? e.message : 'Invalid JSON')
      }
    },
    [updateValue],
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentValue, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // noop
    }
  }, [currentValue])

  // Tree entries
  const rootType = Array.isArray(currentValue) ? 'array' : 'object'
  const rootEntries = rootType === 'array'
    ? (currentValue as unknown[]).map((v, i) => [i, v] as const)
    : Object.entries(currentValue as Record<string, unknown>)

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-white/[0.08]',
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3 py-2">
        {/* Mode toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-0.5">
          <button
            type="button"
            onClick={() => setMode('tree')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              mode === 'tree'
                ? 'bg-white/[0.1] text-white'
                : 'text-white/40 hover:text-white/60',
            )}
          >
            <Braces className="h-3.5 w-3.5" />
            Tree
          </button>
          <button
            type="button"
            onClick={() => setMode('raw')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              mode === 'raw'
                ? 'bg-white/[0.1] text-white'
                : 'text-white/40 hover:text-white/60',
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            Raw
          </button>
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors',
            copied ? 'text-white' : 'text-white/40 hover:bg-white/[0.04] hover:text-white/60',
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[500px] overflow-auto bg-black/40 scrollbar-hide">
        {mode === 'tree' ? (
          <div className="py-2">
            {rootEntries.map(([k, v], i) => (
              <TreeNode
                key={`${k}-${i}`}
                keyName={k}
                value={v}
                path={[String(k)]}
                depth={0}
                isLast={i === rootEntries.length - 1}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAdd={handleAdd}
                readOnly={readOnly}
                defaultExpanded={defaultExpanded}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        ) : (
          <RawEditor
            value={rawString}
            onChange={handleRawChange}
            error={parseError}
            readOnly={readOnly}
          />
        )}
      </div>
    </div>
  )
}
