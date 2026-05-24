'use client'

/**
 * <Schema />
 *
 * Mini database ER diagram with optional admin mode.
 *
 *  - View mode (default): tables render at their `x` / `y`, columns
 *    list their type, bezier FK lines draw between every column that
 *    references another column.
 *
 *  - Admin mode: pass `onTablesChange` to make the diagram editable.
 *    Drag any table by its header to reposition it. Rename tables +
 *    columns inline (double-click). Add or remove tables / columns.
 *    Cycle column types. Toggle primary keys. Manage foreign keys
 *    through a popover on each column. The schema mutates through
 *    `onTablesChange` so the consumer owns the state and can save /
 *    undo / persist however they like.
 */

import * as React from 'react'
import { motion, useMotionValue, useDragControls, AnimatePresence } from 'framer-motion'
import {
  Key,
  Table as TableIcon,
  Plus,
  X,
  Trash2,
  Link2,
  Link2Off,
  Download,
  GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SchemaColumn {
  name: string
  type: string
  primary?: boolean
  nullable?: boolean
  references?: { table: string; column: string }
}

export interface SchemaTable {
  name: string
  x: number
  y: number
  columns: SchemaColumn[]
  accent?: string
}

export interface SchemaProps {
  tables: SchemaTable[]
  /** When provided, the diagram becomes fully editable. */
  onTablesChange?: (next: SchemaTable[]) => void
  /** Force admin mode on/off. Defaults to true when onTablesChange is provided. */
  admin?: boolean
  /** Canvas width in px. Default 760. */
  width?: number
  /** Canvas height in px. Default 460. */
  height?: number
  /** Show row types. Default true. */
  showTypes?: boolean
  className?: string
}

interface MeasuredRow {
  table: string
  column: string
  left: number
  right: number
  centerY: number
}

interface Connection {
  from: MeasuredRow
  to: MeasuredRow
  key: string
}

// Common SQL types users will reach for.
const COMMON_TYPES = [
  'uuid',
  'text',
  'varchar',
  'int',
  'bigint',
  'float',
  'numeric',
  'bool',
  'timestamp',
  'date',
  'json',
  'enum',
]

const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

export function Schema({
  tables,
  onTablesChange,
  admin: adminProp,
  width = 760,
  height = 460,
  showTypes = true,
  className,
}: SchemaProps) {
  const admin = adminProp ?? !!onTablesChange
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const rowRefs = React.useRef<Map<string, HTMLLIElement | null>>(new Map())
  const [connections, setConnections] = React.useState<Connection[]>([])
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [dragTick, setDragTick] = React.useState(0)

  // ---- state mutation helpers (all gated on onTablesChange) -----------------
  const commit = React.useCallback(
    (next: SchemaTable[]) => onTablesChange?.(next),
    [onTablesChange],
  )

  const updateTable = (i: number, patch: Partial<SchemaTable>) => {
    const next = tables.slice()
    next[i] = { ...next[i], ...patch }
    commit(next)
  }
  const removeTable = (i: number) => {
    const goneName = tables[i]?.name
    // Cascade-clean: drop any FK that pointed at this table.
    const next = tables
      .filter((_, idx) => idx !== i)
      .map((t) => ({
        ...t,
        columns: t.columns.map((c) =>
          c.references?.table === goneName ? { ...c, references: undefined } : c,
        ),
      }))
    commit(next)
  }
  const addTable = () => {
    const baseName = 'table'
    let n = tables.length + 1
    while (tables.find((t) => t.name === `${baseName}_${n}`)) n++
    const next: SchemaTable[] = [
      ...tables,
      {
        name: `${baseName}_${n}`,
        x: 32 + ((tables.length * 24) % Math.max(60, width - 240)),
        y: 32 + ((tables.length * 24) % Math.max(60, height - 200)),
        columns: [{ name: 'id', type: 'uuid', primary: true }],
      },
    ]
    commit(next)
  }
  const updateColumn = (
    tIdx: number,
    cIdx: number,
    patch: Partial<SchemaColumn>,
  ) => {
    const next = tables.slice()
    const cols = next[tIdx].columns.slice()
    cols[cIdx] = { ...cols[cIdx], ...patch }
    next[tIdx] = { ...next[tIdx], columns: cols }
    commit(next)
  }
  const removeColumn = (tIdx: number, cIdx: number) => {
    const goneCol = tables[tIdx].columns[cIdx]
    const goneName = goneCol?.name
    const goneTable = tables[tIdx]?.name
    const next = tables.map((t, i) => {
      if (i === tIdx) {
        return { ...t, columns: t.columns.filter((_, k) => k !== cIdx) }
      }
      // Cascade-clean FKs pointing at this column.
      return {
        ...t,
        columns: t.columns.map((c) =>
          c.references?.table === goneTable && c.references.column === goneName
            ? { ...c, references: undefined }
            : c,
        ),
      }
    })
    commit(next)
  }
  const addColumn = (tIdx: number) => {
    let n = tables[tIdx].columns.length + 1
    while (tables[tIdx].columns.find((c) => c.name === `column_${n}`)) n++
    updateTable(tIdx, {
      columns: [...tables[tIdx].columns, { name: `column_${n}`, type: 'text' }],
    })
  }

  // ---- foreign-key candidates (everything except the column itself) ---------
  const fkCandidates = React.useMemo(
    () =>
      tables.flatMap((t) =>
        t.columns.map((c) => ({
          table: t.name,
          column: c.name,
          primary: c.primary,
        })),
      ),
    [tables],
  )

  // ---- FK lines ------------------------------------------------------------
  const fks = React.useMemo(() => {
    const out: { from: { table: string; column: string }; to: { table: string; column: string } }[] = []
    for (const t of tables) {
      for (const c of t.columns) {
        if (c.references) {
          out.push({ from: { table: t.name, column: c.name }, to: c.references })
        }
      }
    }
    return out
  }, [tables])

  // Measure row positions; re-runs on layout / drag / table-data change.
  React.useEffect(() => {
    const measure = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const cRect = canvas.getBoundingClientRect()
      const next: Connection[] = []
      for (const f of fks) {
        const fromEl = rowRefs.current.get(`${f.from.table}.${f.from.column}`)
        const toEl = rowRefs.current.get(`${f.to.table}.${f.to.column}`)
        if (!fromEl || !toEl) continue
        const fr = fromEl.getBoundingClientRect()
        const tr = toEl.getBoundingClientRect()
        next.push({
          key: `${f.from.table}.${f.from.column}->${f.to.table}.${f.to.column}`,
          from: {
            table: f.from.table,
            column: f.from.column,
            left: fr.left - cRect.left,
            right: fr.right - cRect.left,
            centerY: fr.top - cRect.top + fr.height / 2,
          },
          to: {
            table: f.to.table,
            column: f.to.column,
            left: tr.left - cRect.left,
            right: tr.right - cRect.left,
            centerY: tr.top - cRect.top + tr.height / 2,
          },
        })
      }
      setConnections(next)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (canvasRef.current) ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [fks, tables, dragTick])

  // ---- export schema as JSON -----------------------------------------------
  const exportJson = () => {
    if (typeof document === 'undefined') return
    const data = JSON.stringify(tables, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schema.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      ref={canvasRef}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0c]',
        className,
      )}
      style={{ width, height }}
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Admin toolbar */}
      {admin && (
        <div className="absolute right-3 top-3 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={addTable}
            className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 text-[11.5px] font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-white/[0.12] hover:text-white"
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
            Table
          </button>
          <button
            type="button"
            onClick={exportJson}
            aria-label="Export schema as JSON"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] text-white/85 backdrop-blur-md transition-colors hover:bg-white/[0.12] hover:text-white"
          >
            <Download className="h-3 w-3" strokeWidth={2.25} />
          </button>
        </div>
      )}

      {/* SVG FK layer */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0"
        width={width}
        height={height}
      >
        {connections.map((c) => {
          const involved =
            hovered === `${c.from.table}.${c.from.column}` ||
            hovered === `${c.to.table}.${c.to.column}`
          const fromIsLeft = c.from.left < c.to.left
          const x1 = fromIsLeft ? c.from.right : c.from.left
          const x2 = fromIsLeft ? c.to.left : c.to.right
          const y1 = c.from.centerY
          const y2 = c.to.centerY
          const mid = (x1 + x2) / 2
          const d = `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
          return (
            <g key={c.key}>
              <motion.path
                d={d}
                fill="none"
                stroke={involved ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.18)'}
                strokeWidth={involved ? 1.5 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              <circle
                cx={x1}
                cy={y1}
                r={involved ? 3 : 2}
                fill={involved ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)'}
              />
              <circle
                cx={x2}
                cy={y2}
                r={involved ? 3 : 2}
                fill={involved ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)'}
              />
            </g>
          )
        })}
      </svg>

      {/* Table cards */}
      {tables.map((table, idx) => (
        <TableCard
          key={table.name + '-' + idx}
          table={table}
          tableIdx={idx}
          admin={admin}
          showTypes={showTypes}
          rowRefs={rowRefs}
          hovered={hovered}
          setHovered={setHovered}
          onMoveEnd={(x, y) => updateTable(idx, { x, y })}
          onRename={(name) => updateTable(idx, { name })}
          onDelete={() => removeTable(idx)}
          onAddColumn={() => addColumn(idx)}
          onUpdateColumn={(cIdx, patch) => updateColumn(idx, cIdx, patch)}
          onRemoveColumn={(cIdx) => removeColumn(idx, cIdx)}
          onDragMove={() => setDragTick((t) => t + 1)}
          fkCandidates={fkCandidates}
        />
      ))}

      {/* Empty state in admin mode */}
      {admin && tables.length === 0 && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p className="font-display text-[13px] tracking-tight text-white/40">
            Click <span className="text-white/65">+ Table</span> to start.
          </p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// TableCard
// ---------------------------------------------------------------------------

function TableCard({
  table,
  tableIdx,
  admin,
  showTypes,
  rowRefs,
  hovered,
  setHovered,
  onMoveEnd,
  onRename,
  onDelete,
  onAddColumn,
  onUpdateColumn,
  onRemoveColumn,
  onDragMove,
  fkCandidates,
}: {
  table: SchemaTable
  tableIdx: number
  admin: boolean
  showTypes: boolean
  rowRefs: React.RefObject<Map<string, HTMLLIElement | null>>
  hovered: string | null
  setHovered: (k: string | null) => void
  onMoveEnd: (x: number, y: number) => void
  onRename: (name: string) => void
  onDelete: () => void
  onAddColumn: () => void
  onUpdateColumn: (cIdx: number, patch: Partial<SchemaColumn>) => void
  onRemoveColumn: (cIdx: number) => void
  onDragMove: () => void
  fkCandidates: { table: string; column: string; primary?: boolean }[]
}) {
  const accent = table.accent ?? 'rgba(255,255,255,0.55)'
  const [editingName, setEditingName] = React.useState(false)
  // Motion values mirror the committed (table.x / .y) position. Drag
  // updates the values, drag-end commits them up through onMoveEnd, and
  // we re-sync from props whenever they change so external updates flow
  // back into the card position too.
  const x = useMotionValue(table.x)
  const y = useMotionValue(table.y)
  const dragControls = useDragControls()

  React.useEffect(() => {
    x.set(table.x)
    y.set(table.y)
  }, [table.x, table.y, x, y])

  return (
    <motion.div
      drag={admin}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDrag={() => onDragMove()}
      onDragEnd={() => {
        onMoveEnd(Math.round(x.get()), Math.round(y.get()))
      }}
      style={{ x, y, position: 'absolute', top: 0, left: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={APPLE_SPRING}
      className="min-w-[200px] select-none overflow-visible"
    >
      <div
        className={cn(
          'overflow-hidden rounded-xl border border-white/[0.08] backdrop-blur-md',
          'bg-[linear-gradient(180deg,rgba(28,28,30,0.94)_0%,rgba(20,20,22,0.96)_100%)]',
        )}
        style={{
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 24px -8px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.04)',
        }}
      >
        {/* Header — drag handle in admin mode */}
        <header
          onPointerDown={(e) => {
            if (!admin) return
            // Don't initiate drag when starting on an interactive control.
            const target = e.target as HTMLElement
            if (target.closest('button, input')) return
            dragControls.start(e)
          }}
          className={cn(
            'group/header relative flex items-center gap-2 border-b border-white/[0.06] px-3 py-2',
            admin && 'cursor-grab active:cursor-grabbing',
          )}
        >
          {admin && (
            <GripVertical className="h-3 w-3 shrink-0 text-white/30" strokeWidth={2} />
          )}
          {!admin && (
            <TableIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} style={{ color: accent }} />
          )}
          {admin && editingName ? (
            <input
              autoFocus
              defaultValue={table.name}
              onBlur={(e) => {
                if (e.target.value.trim()) onRename(e.target.value.trim())
                setEditingName(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v) onRename(v)
                  setEditingName(false)
                }
                if (e.key === 'Escape') setEditingName(false)
              }}
              className="min-w-0 flex-1 bg-transparent font-mono text-[12px] font-semibold tracking-tight text-white outline-none"
            />
          ) : (
            <span
              onDoubleClick={() => admin && setEditingName(true)}
              className="font-mono text-[12px] font-semibold tracking-tight text-white/90"
              title={admin ? 'Double-click to rename' : undefined}
            >
              {table.name}
            </span>
          )}
          <span
            aria-hidden
            className="ml-auto block h-1 w-6 rounded-full"
            style={{ background: accent }}
          />
          {admin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              aria-label="Delete table"
              className="ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white/35 opacity-0 transition-all hover:bg-white/[0.08] hover:text-white group-hover/header:opacity-100"
            >
              <Trash2 className="h-3 w-3" strokeWidth={2.25} />
            </button>
          )}
        </header>

        {/* Columns */}
        <ul className="divide-y divide-white/[0.04]">
          {table.columns.map((col, cIdx) => (
            <ColumnRow
              key={col.name + '-' + cIdx}
              table={table}
              col={col}
              cIdx={cIdx}
              tableIdx={tableIdx}
              admin={admin}
              showTypes={showTypes}
              rowRefs={rowRefs}
              hovered={hovered}
              setHovered={setHovered}
              onUpdate={(patch) => onUpdateColumn(cIdx, patch)}
              onRemove={() => onRemoveColumn(cIdx)}
              fkCandidates={fkCandidates}
            />
          ))}
        </ul>

        {admin && (
          <button
            type="button"
            onClick={onAddColumn}
            className="flex w-full items-center justify-center gap-1.5 border-t border-white/[0.04] bg-white/[0.015] py-1.5 text-[10.5px] font-medium tracking-tight text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/85"
          >
            <Plus className="h-3 w-3" strokeWidth={2.25} />
            Add column
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// ColumnRow
// ---------------------------------------------------------------------------

function ColumnRow({
  table,
  col,
  cIdx,
  tableIdx,
  admin,
  showTypes,
  rowRefs,
  hovered,
  setHovered,
  onUpdate,
  onRemove,
  fkCandidates,
}: {
  table: SchemaTable
  col: SchemaColumn
  cIdx: number
  tableIdx: number
  admin: boolean
  showTypes: boolean
  rowRefs: React.RefObject<Map<string, HTMLLIElement | null>>
  hovered: string | null
  setHovered: (k: string | null) => void
  onUpdate: (patch: Partial<SchemaColumn>) => void
  onRemove: () => void
  fkCandidates: { table: string; column: string; primary?: boolean }[]
}) {
  const key = `${table.name}.${col.name}`
  const isHovered = hovered === key
  const [editingName, setEditingName] = React.useState(false)
  const [editingType, setEditingType] = React.useState(false)
  const [fkOpen, setFkOpen] = React.useState(false)

  void tableIdx // exposed for future column-level uniqueness checks

  // Candidates exclude this column itself.
  const fkOptions = fkCandidates.filter(
    (c) => !(c.table === table.name && c.column === col.name),
  )

  return (
    <li
      ref={(el) => {
        rowRefs.current.set(key, el)
      }}
      onMouseEnter={() => setHovered(key)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'group/col relative flex items-center gap-2 px-3 py-1.5 transition-colors',
        isHovered ? 'bg-white/[0.06]' : 'bg-transparent hover:bg-white/[0.03]',
      )}
    >
      {/* Primary-key toggle / FK dot / plain bullet */}
      <button
        type="button"
        onClick={() => admin && onUpdate({ primary: !col.primary })}
        disabled={!admin}
        aria-label={col.primary ? 'Remove primary key' : 'Set as primary key'}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm',
          admin && 'cursor-pointer hover:bg-white/[0.06]',
          !admin && 'cursor-default',
        )}
      >
        {col.primary ? (
          <Key className="h-2.5 w-2.5 text-amber-300" strokeWidth={2.5} />
        ) : col.references ? (
          <span
            aria-hidden
            className="block h-1.5 w-1.5 rounded-full bg-white/55"
          />
        ) : (
          <span aria-hidden className="block h-1 w-1 rounded-full bg-white/20" />
        )}
      </button>

      {/* Column name */}
      {admin && editingName ? (
        <input
          autoFocus
          defaultValue={col.name}
          onBlur={(e) => {
            const v = e.target.value.trim()
            if (v) onUpdate({ name: v })
            setEditingName(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const v = (e.target as HTMLInputElement).value.trim()
              if (v) onUpdate({ name: v })
              setEditingName(false)
            }
            if (e.key === 'Escape') setEditingName(false)
          }}
          className="min-w-0 flex-1 bg-transparent font-mono text-[11.5px] font-medium text-white outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => admin && setEditingName(true)}
          className="font-mono text-[11.5px] font-medium text-white/85"
          title={admin ? 'Double-click to rename' : undefined}
        >
          {col.name}
        </span>
      )}

      {/* Type label (right side) */}
      {showTypes && (
        <span className="ml-auto inline-flex items-center gap-1">
          {admin && editingType ? (
            <select
              autoFocus
              defaultValue={col.type}
              onChange={(e) => {
                onUpdate({ type: e.target.value })
                setEditingType(false)
              }}
              onBlur={() => setEditingType(false)}
              className="bg-transparent font-mono text-[10.5px] text-white outline-none"
            >
              {COMMON_TYPES.map((t) => (
                <option key={t} value={t} className="bg-zinc-900">
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <button
              type="button"
              onClick={() => admin && setEditingType(true)}
              className={cn(
                'font-mono text-[10.5px] tracking-tight text-white/40',
                admin && 'rounded px-1 transition-colors hover:bg-white/[0.06] hover:text-white/70',
              )}
              title={admin ? 'Click to change type' : undefined}
            >
              {col.type}
              {col.nullable && '?'}
            </button>
          )}
        </span>
      )}

      {/* Admin row controls — appear on hover */}
      {admin && (
        <span className="ml-1 inline-flex items-center gap-0.5 opacity-0 transition-opacity group-hover/col:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setFkOpen((o) => !o)
            }}
            aria-label={col.references ? 'Edit foreign key' : 'Add foreign key'}
            className={cn(
              'inline-flex h-5 w-5 items-center justify-center rounded text-white/45 transition-colors hover:bg-white/[0.08] hover:text-white',
              col.references && 'text-[#9CDCFE]',
            )}
            title={
              col.references
                ? `→ ${col.references.table}.${col.references.column}`
                : 'Add foreign key'
            }
          >
            {col.references ? (
              <Link2 className="h-3 w-3" strokeWidth={2.25} />
            ) : (
              <Link2Off className="h-3 w-3" strokeWidth={2.25} />
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            aria-label="Delete column"
            className="inline-flex h-5 w-5 items-center justify-center rounded text-white/45 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-3 w-3" strokeWidth={2.25} />
          </button>
        </span>
      )}

      {/* FK popover */}
      <AnimatePresence>
        {admin && fkOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={APPLE_SPRING}
            className="absolute right-0 top-full z-20 mt-1 w-[200px] overflow-hidden rounded-[10px] border border-white/[0.08] backdrop-blur-xl"
            style={{
              background:
                'linear-gradient(180deg, rgba(40,40,46,0.95), rgba(24,24,28,0.97))',
              boxShadow: '0 12px 28px -8px rgba(0,0,0,0.6)',
            }}
          >
            <div className="border-b border-white/[0.06] px-2.5 py-1.5">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Foreign key
              </p>
            </div>
            <div
              data-lenis-prevent
              className="max-h-[160px] overflow-y-auto p-1"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.18) transparent',
              }}
            >
              {col.references && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdate({ references: undefined })
                    setFkOpen(false)
                  }}
                  className="flex w-full items-center gap-1.5 rounded-[6px] px-2 py-1 text-left text-[11px] text-rose-300 transition-colors hover:bg-white/[0.06]"
                >
                  <Link2Off className="h-3 w-3" strokeWidth={2.25} />
                  Remove FK
                </button>
              )}
              {fkOptions.length === 0 ? (
                <p className="px-2 py-1.5 text-[10.5px] text-white/35">
                  No other columns to link.
                </p>
              ) : (
                fkOptions.map((opt) => {
                  const isCurrent =
                    col.references?.table === opt.table &&
                    col.references?.column === opt.column
                  return (
                    <button
                      key={`${opt.table}.${opt.column}`}
                      type="button"
                      onClick={() => {
                        onUpdate({ references: { table: opt.table, column: opt.column } })
                        setFkOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-[6px] px-2 py-1 text-left text-[11px] transition-colors',
                        isCurrent
                          ? 'bg-white/[0.08] text-white'
                          : 'text-white/75 hover:bg-white/[0.05] hover:text-white',
                      )}
                    >
                      <span className="font-mono">
                        {opt.table}
                        <span className="text-white/40">.{opt.column}</span>
                      </span>
                      {opt.primary && (
                        <Key className="h-2.5 w-2.5 shrink-0 text-amber-300" strokeWidth={2.5} />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
