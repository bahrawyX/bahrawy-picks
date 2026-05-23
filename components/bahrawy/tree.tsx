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
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  className?: string
}

const ROW_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 34,
  mass: 0.6,
}

export function Tree({
  data,
  defaultExpanded = [],
  onSelect,
  hideGuides = false,
  className,
}: TreeProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(
    () => new Set(defaultExpanded),
  )
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const toggle = (id: string) => {
    setExpanded((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div
      role="tree"
      className={cn(
        'w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] p-2 font-mono text-[12px]',
        className,
      )}
    >
      {data.map((node, i) => (
        <TreeRow
          key={node.id ?? `${node.name}-${i}`}
          node={node}
          path={[node.name]}
          depth={0}
          expanded={expanded}
          toggle={toggle}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onSelect={onSelect}
          hideGuides={hideGuides}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// One row + (recursive) children
// ---------------------------------------------------------------------------

function TreeRow({
  node,
  path,
  depth,
  expanded,
  toggle,
  selectedId,
  setSelectedId,
  onSelect,
  hideGuides,
}: {
  node: TreeNode
  path: string[]
  depth: number
  expanded: Set<string>
  toggle: (id: string) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  onSelect?: TreeProps['onSelect']
  hideGuides: boolean
}) {
  const id = node.id ?? path.join('/')
  const isFolder = node.type === 'folder' || (!!node.children && node.type !== 'file')
  const isOpen = expanded.has(id)
  const isSelected = selectedId === id || node.selected

  const handleClick = () => {
    if (isFolder) {
      toggle(id)
    } else {
      setSelectedId(id)
      onSelect?.(node, path)
    }
  }

  return (
    <div>
      <button
        type="button"
        role="treeitem"
        aria-expanded={isFolder ? isOpen : undefined}
        aria-selected={isSelected}
        onClick={handleClick}
        className={cn(
          'group relative flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left transition-colors',
          'hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none',
          isSelected && 'bg-white/[0.06] text-white',
          !isSelected && 'text-white/75',
        )}
        style={{ paddingLeft: 6 + depth * 14 }}
      >
        {/* Gutter guide lines — one per ancestor depth */}
        {!hideGuides &&
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
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={ROW_SPRING}
              className="inline-flex"
            >
              <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
            </motion.span>
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
                  expanded={expanded}
                  toggle={toggle}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  onSelect={onSelect}
                  hideGuides={hideGuides}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
