'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Braces, Code2, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TreeNode, TreeNodeRow } from './tree-node'
import { RawEditor } from './raw-editor'
import { getJsonType, type JsonType } from './type-badge'

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
  /** Virtualize the tree view once visible (expanded) rows exceed this count. Default 300. */
  virtualizeOver?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deepClone<T>(obj: T): T {
  return structuredClone(obj)
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

// Path-keyed expansion state. The control-char separator keeps keys
// unambiguous even when a JSON key itself contains dots or slashes.
function pathKey(path: string[]): string {
  return path.join('\u0001')
}

/** One visible (expanded-into-view) node of the tree, flattened. */
interface FlatNode {
  keyName: string | number
  value: unknown
  path: string[]
  depth: number
  type: JsonType
  isExpandable: boolean
  expanded: boolean
  childCount: number
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
  virtualizeOver = 300,
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
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentValue = isControlled ? controlledValue : internalValue

  // ---- Expansion state ----
  // Hoisted out of the nodes so the flat (virtualized) path can share
  // it with the recursive path. Only user toggles are stored; anything
  // untouched falls back to the defaultExpanded / maxDepth rule the
  // nodes used before.
  const [expandedOverrides, setExpandedOverrides] = useState<ReadonlyMap<string, boolean>>(
    () => new Map(),
  )

  const isExpanded = useCallback(
    (path: string[], depth: number) =>
      expandedOverrides.get(pathKey(path)) ??
      depth < (defaultExpanded ? maxDepth : 1),
    [expandedOverrides, defaultExpanded, maxDepth],
  )

  const toggleExpanded = useCallback(
    (path: string[], depth: number) => {
      setExpandedOverrides((prev) => {
        const key = pathKey(path)
        const current =
          prev.get(key) ?? depth < (defaultExpanded ? maxDepth : 1)
        const next = new Map(prev)
        next.set(key, !current)
        return next
      })
    },
    [defaultExpanded, maxDepth],
  )

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
  const rootEntries = useMemo(
    () =>
      Array.isArray(currentValue)
        ? (currentValue as unknown[]).map((v, i) => [i, v] as const)
        : Object.entries(currentValue as Record<string, unknown>),
    [currentValue],
  )

  // Flatten the visible (expanded) nodes into a list — same approach as
  // <Tree />. Drives the virtualized render path; also how we know how
  // many rows are actually on screen.
  const flatNodes = useMemo(() => {
    const rows: FlatNode[] = []
    const walk = (
      entries: (readonly [string | number, unknown])[],
      parentPath: string[],
      depth: number,
    ) => {
      for (const [k, v] of entries) {
        const path = [...parentPath, String(k)]
        const type = getJsonType(v)
        const isExpandable = type === 'object' || type === 'array'
        const childEntries = isExpandable
          ? type === 'array'
            ? (v as unknown[]).map((cv, i) => [i, cv] as const)
            : Object.entries(v as Record<string, unknown>)
          : []
        const expanded = isExpandable && isExpanded(path, depth)
        rows.push({
          keyName: k,
          value: v,
          path,
          depth,
          type,
          isExpandable,
          expanded,
          childCount: childEntries.length,
        })
        if (expanded) walk(childEntries, path, depth + 1)
      }
    }
    walk(rootEntries, [], 0)
    return rows
  }, [rootEntries, isExpanded])

  const virtualized = mode === 'tree' && flatNodes.length > virtualizeOver

  const virtualizer = useVirtualizer({
    count: virtualized ? flatNodes.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 24,
    overscan: 12,
  })

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

      {/* Content — past `virtualizeOver` visible rows the expanded nodes
          are flattened and windowed with @tanstack/react-virtual, and the
          expand/collapse + chevron animations are dropped (they fight
          virtualization). Below the threshold everything animates. */}
      <div
        ref={scrollRef}
        className="max-h-[500px] overflow-auto bg-black/40 scrollbar-hide"
        data-lenis-prevent={virtualized ? true : undefined}
      >
        {mode === 'tree' ? (
          virtualized ? (
            <div className="py-2">
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const row = flatNodes[virtualItem.index]
                  return (
                    <div
                      key={pathKey(row.path)}
                      data-index={virtualItem.index}
                      ref={virtualizer.measureElement}
                      style={{
                        position: 'absolute',
                        top: virtualItem.start,
                        left: 0,
                        width: '100%',
                      }}
                    >
                      <TreeNodeRow
                        keyName={row.keyName}
                        value={row.value}
                        path={row.path}
                        depth={row.depth}
                        type={row.type}
                        isExpandable={row.isExpandable}
                        expanded={row.expanded}
                        childCount={row.childCount}
                        onToggle={() => toggleExpanded(row.path, row.depth)}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onAdd={handleAdd}
                        readOnly={readOnly}
                        animate={false}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
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
                  getExpanded={isExpanded}
                  onToggleExpanded={toggleExpanded}
                />
              ))}
            </div>
          )
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
