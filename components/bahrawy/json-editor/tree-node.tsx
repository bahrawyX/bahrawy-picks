'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Pencil, Plus, Trash2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, tweenSmooth } from '@/lib/motion'
import { TypeBadge, getJsonType, type JsonType } from './type-badge'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TreeNodeProps {
  keyName: string | number
  value: unknown
  path: string[]
  depth: number
  isLast: boolean
  onUpdate: (path: string[], value: unknown) => void
  onDelete: (path: string[]) => void
  onAdd: (path: string[], key: string, value: unknown) => void
  readOnly: boolean
  /** Expansion state is owned by the editor so the flat (virtualized) path shares it. */
  getExpanded: (path: string[], depth: number) => boolean
  onToggleExpanded: (path: string[], depth: number) => void
}

export interface TreeNodeRowProps {
  keyName: string | number
  value: unknown
  path: string[]
  depth: number
  type: JsonType
  isExpandable: boolean
  expanded: boolean
  childCount: number
  onToggle: () => void
  onUpdate: (path: string[], value: unknown) => void
  onDelete: (path: string[]) => void
  onAdd: (path: string[], key: string, value: unknown) => void
  readOnly: boolean
  /** Disabled for virtualized rows — animations fight windowing. */
  animate: boolean
}

// ---------------------------------------------------------------------------
// Recursive node — animated, sub-threshold path
// ---------------------------------------------------------------------------

export function TreeNode({
  keyName,
  value,
  path,
  depth,
  isLast,
  onUpdate,
  onDelete,
  onAdd,
  readOnly,
  getExpanded,
  onToggleExpanded,
}: TreeNodeProps) {
  const type = getJsonType(value)
  const isExpandable = type === 'object' || type === 'array'
  const entries = isExpandable
    ? type === 'array'
      ? (value as unknown[]).map((v, i) => [i, v] as const)
      : Object.entries(value as Record<string, unknown>)
    : []
  const expanded = isExpandable && getExpanded(path, depth)
  void isLast

  return (
    <div className="select-none">
      <TreeNodeRow
        keyName={keyName}
        value={value}
        path={path}
        depth={depth}
        type={type}
        isExpandable={isExpandable}
        expanded={expanded}
        childCount={entries.length}
        onToggle={() => onToggleExpanded(path, depth)}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAdd={onAdd}
        readOnly={readOnly}
        animate
      />

      {/* Children */}
      <AnimatePresence initial={false}>
        {isExpandable && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={tweenSmooth}
            className="overflow-hidden"
          >
            {entries.map(([k, v], i) => (
              <TreeNode
                key={`${k}-${i}`}
                keyName={k}
                value={v}
                path={[...path, String(k)]}
                depth={depth + 1}
                isLast={i === entries.length - 1}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAdd={onAdd}
                readOnly={readOnly}
                getExpanded={getExpanded}
                onToggleExpanded={onToggleExpanded}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// One node row — shared by the recursive and virtualized render paths.
// Owns its transient edit / add / hover state; everything durable flows
// through the path-based onUpdate / onDelete / onAdd callbacks.
// ---------------------------------------------------------------------------

export function TreeNodeRow({
  keyName,
  value,
  path,
  depth,
  type,
  isExpandable,
  expanded,
  childCount,
  onToggle,
  onUpdate,
  onDelete,
  onAdd,
  readOnly,
  animate,
}: TreeNodeRowProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [adding, setAdding] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [hovered, setHovered] = useState(false)

  // ---- Editing ----

  const startEdit = useCallback(() => {
    if (readOnly) return
    setEditValue(type === 'string' ? String(value) : JSON.stringify(value))
    setEditing(true)
  }, [value, type, readOnly])

  const commitEdit = useCallback(() => {
    let parsed: unknown
    if (type === 'string') {
      parsed = editValue
    } else {
      try {
        parsed = JSON.parse(editValue)
      } catch {
        // Keep as string if JSON parse fails
        parsed = editValue
      }
    }
    onUpdate(path, parsed)
    setEditing(false)
  }, [editValue, type, path, onUpdate])

  const cancelEdit = useCallback(() => {
    setEditing(false)
  }, [])

  // ---- Adding ----

  const startAdd = useCallback(() => {
    setNewKey(type === 'array' ? String(childCount) : '')
    setNewValue('')
    setAdding(true)
  }, [type, childCount])

  const commitAdd = useCallback(() => {
    if (!newKey && type !== 'array') return
    let parsed: unknown
    try {
      parsed = JSON.parse(newValue || '""')
    } catch {
      parsed = newValue
    }
    const key = type === 'array' ? String(childCount) : newKey
    onAdd(path, key, parsed)
    setAdding(false)
    if (!expanded) onToggle()
  }, [newKey, newValue, type, childCount, path, onAdd, expanded, onToggle])

  // ---- Render value ----

  const renderValue = () => {
    if (editing) {
      return (
        <div className="inline-flex items-center gap-1">
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            className="min-w-[80px] rounded-md border border-white/20 bg-white/[0.06] px-2 py-0.5 text-xs text-white outline-none focus:border-white/40"
          />
          <button type="button" onClick={commitEdit} className="rounded-md p-0.5 text-green-400 hover:bg-green-500/10">
            <Check className="h-3 w-3" />
          </button>
          <button type="button" onClick={cancelEdit} className="rounded-md p-0.5 text-red-400 hover:bg-red-500/10">
            <X className="h-3 w-3" />
          </button>
        </div>
      )
    }

    if (isExpandable) {
      return (
        <span className="text-xs text-white/30">
          {type === 'array' ? `[${childCount}]` : `{${childCount}}`}
        </span>
      )
    }

    const displayValue = type === 'string'
      ? `"${String(value)}"`
      : type === 'null'
        ? 'null'
        : String(value)

    const valueColor = type === 'string'
      ? 'text-green-400'
      : type === 'number'
        ? 'text-blue-400'
        : type === 'boolean'
          ? 'text-amber-400'
          : 'text-red-400'

    return (
      <span
        className={cn('cursor-pointer text-xs', valueColor)}
        onDoubleClick={startEdit}
      >
        {displayValue}
      </span>
    )
  }

  return (
    <div className="select-none">
      {/* Node row */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'group flex items-center gap-1 rounded-md py-0.5 pr-2 transition-colors hover:bg-white/[0.03]',
        )}
        style={{ paddingLeft: depth * 16 + 4 }}
      >
        {/* Expand toggle */}
        {isExpandable ? (
          <button
            type="button"
            onClick={onToggle}
            className="flex h-4 w-4 items-center justify-center rounded-sm text-white/30 transition-colors hover:text-white/60"
          >
            {animate ? (
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={springSnappy}
              >
                <ChevronRight className="h-3 w-3" />
              </motion.div>
            ) : (
              <div className={cn(expanded && 'rotate-90')}>
                <ChevronRight className="h-3 w-3" />
              </div>
            )}
          </button>
        ) : (
          <span className="h-4 w-4" />
        )}

        {/* Key */}
        <span className="text-xs font-medium text-white/70">
          {typeof keyName === 'number' ? keyName : `"${keyName}"`}
        </span>
        <span className="text-xs text-white/20">:</span>

        {/* Value */}
        <span className="ml-1">{renderValue()}</span>

        {/* Type badge */}
        <span className="ml-2">
          <TypeBadge type={type} />
        </span>

        {/* Actions */}
        {!readOnly && hovered && !editing && (
          <div className="ml-auto flex items-center gap-0.5">
            {!isExpandable && (
              <button
                type="button"
                onClick={startEdit}
                className="rounded-md p-1 text-white/20 transition-colors hover:bg-white/[0.06] hover:text-white/50"
                aria-label="Edit"
              >
                <Pencil className="h-3 w-3" />
              </button>
            )}
            {isExpandable && (
              <button
                type="button"
                onClick={startAdd}
                className="rounded-md p-1 text-white/20 transition-colors hover:bg-white/[0.06] hover:text-white/50"
                aria-label="Add"
              >
                <Plus className="h-3 w-3" />
              </button>
            )}
            {depth > 0 && (
              <button
                type="button"
                onClick={() => onDelete(path)}
                className="rounded-md p-1 text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add new entry — rendered directly under this node's row */}
      {adding && (
        <motion.div
          initial={animate ? { opacity: 0, y: -4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={springSnappy}
          className="flex items-center gap-1.5 py-1"
          style={{ paddingLeft: (depth + 1) * 16 + 4 }}
        >
          <span className="h-4 w-4" />
          {type !== 'array' && (
            <input
              autoFocus
              placeholder="key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-20 rounded-md border border-white/20 bg-white/[0.06] px-2 py-0.5 text-xs text-white outline-none"
            />
          )}
          <span className="text-xs text-white/20">:</span>
          <input
            autoFocus={type === 'array'}
            placeholder="value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitAdd()
              if (e.key === 'Escape') setAdding(false)
            }}
            className="min-w-[80px] rounded-md border border-white/20 bg-white/[0.06] px-2 py-0.5 text-xs text-white outline-none"
          />
          <button type="button" onClick={commitAdd} className="rounded-md p-0.5 text-green-400 hover:bg-green-500/10">
            <Check className="h-3 w-3" />
          </button>
          <button type="button" onClick={() => setAdding(false)} className="rounded-md p-0.5 text-red-400 hover:bg-red-500/10">
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
