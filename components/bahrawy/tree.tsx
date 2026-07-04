'use client'

/**
 * <Tree />
 *
 * Indented file/folder tree. Folder rows show a rotating chevron and
 * a Folder/FolderOpen icon; file rows show a File icon. Click a folder
 * to expand/collapse with a spring-eased height animation. Click a
 * file to fire `onSelect`. Gutter guide lines run down the indent so
 * the hierarchy reads at a glance.
 *
 * Pass `data` recursively. Each node may be a folder (has `children`)
 * or a file (no `children`). Set `type: 'file'` explicitly if you want
 * a leaf node with the file icon even when empty.
 *
 * Rows support arrow-key navigation: Up/Down move, Right expands a
 * folder (or moves to its first child), Left collapses (or jumps to
 * the parent), Enter/Space activate the row.
 *
 * Past `virtualizeOver` visible rows (default 200) the expanded nodes
 * are flattened and windowed with @tanstack/react-virtual inside a
 * fixed-height scroller, and the expand/collapse + chevron spring
 * animations are dropped — they fight virtualization. Below the
 * threshold everything animates as before.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  ChevronRight,
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TreeNode {
  /** Node id — used to track expanded/selected state. */
  id?: string
  /** Display name. */
  name: string
  /** Override the auto-detected node type. */
  type?: 'folder' | 'file'
  /** Children — if present, this is a folder. */
  children?: TreeNode[]
  /** Optional icon override (replaces folder/file icon). */
  icon?: React.ReactNode
  /** Mark this node as selected at the top level. */
  selected?: boolean
}

export interface TreeProps {
  data: TreeNode[]
  /** Node ids that start expanded. */
  defaultExpanded?: string[]
  /** Fired when a leaf node is clicked. */
  onSelect?: (node: TreeNode, path: string[]) => void
  /** Hide the gutter guide lines. Default false. */
  hideGuides?: boolean
  /** Virtualize the flat row list once visible rows exceed this count. Default 200. */
  virtualizeOver?: number
  className?: string
}

const ROW_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 34,
  mass: 0.6,
}

/** One visible (expanded-into-view) row of the tree, flattened. */
interface FlatRow {
  node: TreeNode
  id: string
  path: string[]
  depth: number
  isFolder: boolean
  isOpen: boolean
  setSize: number
  posInSet: number
  parentId: string | null
}

/** Shared state/handlers threaded through both render paths. */
interface TreeCtx {
  expanded: Set<string>
  toggle: (id: string) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  setFocusedId: (id: string | null) => void
  focusedRowId: string | null
  registerRow: (id: string, el: HTMLButtonElement | null) => void
  onRowKeyDown: (e: React.KeyboardEvent, id: string) => void
  onSelect?: TreeProps['onSelect']
  hideGuides: boolean
}

export function Tree({
  data,
  defaultExpanded = [],
  onSelect,
  hideGuides = false,
  virtualizeOver = 200,
  className,
}: TreeProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(
    () => new Set(defaultExpanded),
  )
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [focusedId, setFocusedId] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const rowRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const pendingFocusRef = React.useRef<string | null>(null)

  const toggle = (id: string) => {
    setExpanded((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Flatten the visible (expanded) nodes into a list. Drives keyboard
  // navigation in both modes and rendering in virtualized mode.
  const visible = React.useMemo(() => {
    const rows: FlatRow[] = []
    const walk = (
      nodes: TreeNode[],
      parentPath: string[],
      depth: number,
      parentId: string | null,
    ) => {
      nodes.forEach((node, i) => {
        const path = [...parentPath, node.name]
        const id = node.id ?? path.join('/')
        const isFolder =
          node.type === 'folder' || (!!node.children && node.type !== 'file')
        const isOpen = expanded.has(id)
        rows.push({
          node,
          id,
          path,
          depth,
          isFolder,
          isOpen,
          setSize: nodes.length,
          posInSet: i + 1,
          parentId,
        })
        if (isFolder && isOpen && node.children) {
          walk(node.children, path, depth + 1, id)
        }
      })
    }
    walk(data, [], 0, null)
    return rows
  }, [data, expanded])

  const virtualized = visible.length > virtualizeOver

  const virtualizer = useVirtualizer({
    count: virtualized ? visible.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 26,
    overscan: 12,
  })

  // Roving tabindex — exactly one row is tabbable at a time.
  const focusedRowId = focusedId ?? visible[0]?.id ?? null

  const registerRow = React.useCallback(
    (id: string, el: HTMLButtonElement | null) => {
      if (el) rowRefs.current.set(id, el)
      else rowRefs.current.delete(id)
    },
    [],
  )

  const focusRow = (id: string) => {
    pendingFocusRef.current = id
    setFocusedId(id)
  }

  // Move DOM focus after render — in virtualized mode the target row
  // may only exist once the virtualizer scrolls it into range.
  React.useEffect(() => {
    const id = pendingFocusRef.current
    if (!id) return
    pendingFocusRef.current = null
    if (virtualized) {
      const index = visible.findIndex((r) => r.id === id)
      if (index !== -1) virtualizer.scrollToIndex(index)
      requestAnimationFrame(() => rowRefs.current.get(id)?.focus())
    } else {
      rowRefs.current.get(id)?.focus()
    }
  })

  const onRowKeyDown = (e: React.KeyboardEvent, id: string) => {
    const index = visible.findIndex((r) => r.id === id)
    if (index === -1) return
    const row = visible[index]

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (index < visible.length - 1) focusRow(visible[index + 1].id)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (index > 0) focusRow(visible[index - 1].id)
        break
      case 'ArrowRight':
        e.preventDefault()
        if (!row.isFolder) break
        if (!row.isOpen) toggle(row.id)
        else if (visible[index + 1]?.depth === row.depth + 1)
          focusRow(visible[index + 1].id)
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (row.isFolder && row.isOpen) toggle(row.id)
        else if (row.parentId) focusRow(row.parentId)
        break
      // Enter/Space activate via the native button click.
    }
  }

  const ctx: TreeCtx = {
    expanded,
    toggle,
    selectedId,
    setSelectedId,
    setFocusedId,
    focusedRowId,
    registerRow,
    onRowKeyDown,
    onSelect,
    hideGuides,
  }

  return (
    <div
      role="tree"
      ref={scrollRef}
      className={cn(
        'w-full rounded-2xl border border-white/[0.08] bg-white/[0.015] p-2 font-mono text-[12px]',
        virtualized ? 'overflow-y-auto' : 'overflow-hidden',
        className,
      )}
      style={virtualized ? { maxHeight: 480 } : undefined}
      data-lenis-prevent={virtualized ? true : undefined}
    >
      {virtualized ? (
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const row = visible[virtualItem.index]
            return (
              <div
                key={row.id}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: virtualItem.start,
                  left: 0,
                  width: '100%',
                }}
              >
                <TreeRowButton
                  id={row.id}
                  node={row.node}
                  path={row.path}
                  depth={row.depth}
                  isFolder={row.isFolder}
                  isOpen={row.isOpen}
                  setSize={row.setSize}
                  posInSet={row.posInSet}
                  ctx={ctx}
                  animate={false}
                />
              </div>
            )
          })}
        </div>
      ) : (
        data.map((node, i) => (
          <TreeRow
            key={node.id ?? `${node.name}-${i}`}
            node={node}
            path={[node.name]}
            depth={0}
            setSize={data.length}
            posInSet={i + 1}
            ctx={ctx}
          />
        ))
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// One row + (recursive) children — animated, sub-threshold path
// ---------------------------------------------------------------------------

function TreeRow({
  node,
  path,
  depth,
  setSize,
  posInSet,
  ctx,
}: {
  node: TreeNode
  path: string[]
  depth: number
  setSize: number
  posInSet: number
  ctx: TreeCtx
}) {
  const id = node.id ?? path.join('/')
  const isFolder =
    node.type === 'folder' || (!!node.children && node.type !== 'file')
  const isOpen = ctx.expanded.has(id)

  return (
    <div>
      <TreeRowButton
        id={id}
        node={node}
        path={path}
        depth={depth}
        isFolder={isFolder}
        isOpen={isOpen}
        setSize={setSize}
        posInSet={posInSet}
        ctx={ctx}
        animate
      />

      {/* Children */}
      {isFolder && (
        <AnimatePresence initial={false}>
          {isOpen && node.children && (
            <motion.div
              key="children"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={ROW_SPRING}
              className="overflow-hidden"
            >
              {node.children.map((child, i) => (
                <TreeRow
                  key={child.id ?? `${child.name}-${i}`}
                  node={child}
                  path={[...path, child.name]}
                  depth={depth + 1}
                  setSize={node.children!.length}
                  posInSet={i + 1}
                  ctx={ctx}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// The row button itself — shared by both render paths
// ---------------------------------------------------------------------------

function TreeRowButton({
  id,
  node,
  path,
  depth,
  isFolder,
  isOpen,
  setSize,
  posInSet,
  ctx,
  animate,
}: {
  id: string
  node: TreeNode
  path: string[]
  depth: number
  isFolder: boolean
  isOpen: boolean
  setSize: number
  posInSet: number
  ctx: TreeCtx
  /** Disabled for virtualized rows — animations fight virtualization. */
  animate: boolean
}) {
  const isSelected = ctx.selectedId === id || node.selected

  const handleClick = () => {
    ctx.setFocusedId(id)
    if (isFolder) {
      ctx.toggle(id)
    } else {
      ctx.setSelectedId(id)
      ctx.onSelect?.(node, path)
    }
  }

  return (
    <button
      type="button"
      role="treeitem"
      aria-level={depth + 1}
      aria-setsize={setSize}
      aria-posinset={posInSet}
      aria-expanded={isFolder ? isOpen : undefined}
      aria-selected={isSelected}
      tabIndex={ctx.focusedRowId === id ? 0 : -1}
      ref={(el) => ctx.registerRow(id, el)}
      onClick={handleClick}
      onKeyDown={(e) => ctx.onRowKeyDown(e, id)}
      className={cn(
        'group relative flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left transition-colors',
        'hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none',
        isSelected && 'bg-white/[0.06] text-white',
        !isSelected && 'text-white/75',
      )}
      style={{ paddingLeft: 6 + depth * 14 }}
    >
      {/* Gutter guide lines — one per ancestor depth */}
      {!ctx.hideGuides &&
        Array.from({ length: depth }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute top-0 h-full w-px bg-white/[0.05]"
            style={{ left: 6 + i * 14 + 7 }}
          />
        ))}

      {/* Chevron (folders) or spacer (files) */}
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-white/40">
        {isFolder ? (
          animate ? (
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={ROW_SPRING}
              className="inline-flex"
            >
              <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <span className={cn('inline-flex', isOpen && 'rotate-90')}>
              <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
            </span>
          )
        ) : null}
      </span>

      {/* Icon */}
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        {node.icon ? (
          node.icon
        ) : isFolder ? (
          isOpen ? (
            <FolderOpenIcon
              className="h-3.5 w-3.5 text-amber-300/75"
              strokeWidth={2}
            />
          ) : (
            <FolderIcon
              className="h-3.5 w-3.5 text-amber-300/55"
              strokeWidth={2}
            />
          )
        ) : (
          <FileIcon
            className="h-3.5 w-3.5 text-white/35"
            strokeWidth={2}
          />
        )}
      </span>

      <span className="truncate text-[12px] tracking-tight">{node.name}</span>
    </button>
  )
}
