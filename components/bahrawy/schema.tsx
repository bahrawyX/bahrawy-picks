'use client'

/**
 * <Schema />
 *
 * A mini database ER diagram. Tables render as cards laid out at the
 * positions you provide; columns inside each card list their name +
 * type with a small primary-key glyph for PKs. Wherever a column
 * declares `references: { table, column }`, an SVG bezier line is
 * drawn from that column row to the referenced column row in the
 * other card — measured after mount, redrawn on resize.
 *
 * Hover a column to lift it and highlight its incoming/outgoing FK
 * line.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Key, Table as TableIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SchemaColumn {
  name: string
  type: string
  primary?: boolean
  nullable?: boolean
  /** Foreign-key reference: which (table, column) this points to. */
  references?: { table: string; column: string }
}

export interface SchemaTable {
  name: string
  /** Position in pixels relative to the canvas's top-left. */
  x: number
  y: number
  columns: SchemaColumn[]
  /** Optional accent for the table header underline. */
  accent?: string
}

export interface SchemaProps {
  tables: SchemaTable[]
  /** Canvas width in px. Default 760. */
  width?: number
  /** Canvas height in px. Default 460. */
  height?: number
  /** Show row types in the column list. Default true. */
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

export function Schema({
  tables,
  width = 760,
  height = 460,
  showTypes = true,
  className,
}: SchemaProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const rowRefs = React.useRef<Map<string, HTMLLIElement | null>>(new Map())
  const [connections, setConnections] = React.useState<Connection[]>([])
  const [hovered, setHovered] = React.useState<string | null>(null)

  // Build a list of FK references first so we know which rows we need to measure.
  const fks = React.useMemo(() => {
    const out: { from: { table: string; column: string }; to: { table: string; column: string } }[] = []
    for (const t of tables) {
      for (const c of t.columns) {
        if (c.references) {
          out.push({
            from: { table: t.name, column: c.name },
            to: c.references,
          })
        }
      }
    }
    return out
  }, [tables])

  // Measure row positions after layout and compute connection coordinates.
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
        const fromRow: MeasuredRow = {
          table: f.from.table,
          column: f.from.column,
          left: fr.left - cRect.left,
          right: fr.right - cRect.left,
          centerY: fr.top - cRect.top + fr.height / 2,
        }
        const toRow: MeasuredRow = {
          table: f.to.table,
          column: f.to.column,
          left: tr.left - cRect.left,
          right: tr.right - cRect.left,
          centerY: tr.top - cRect.top + tr.height / 2,
        }
        next.push({ from: fromRow, to: toRow, key: `${f.from.table}.${f.from.column}->${f.to.table}.${f.to.column}` })
      }
      setConnections(next)
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (canvasRef.current) ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [fks, tables])

  return (
    <div
      ref={canvasRef}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_25%_15%,rgba(167,139,250,0.06),transparent_60%),radial-gradient(circle_at_85%_85%,rgba(96,165,250,0.06),transparent_60%),#0a0a0c]',
        className,
      )}
      style={{ width, height }}
    >
      {/* Dot grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* SVG layer for FK lines */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0"
        width={width}
        height={height}
      >
        {connections.map((c) => {
          const fromTable = c.from.table
          const toTable = c.to.table
          const involved =
            hovered === `${fromTable}.${c.from.column}` ||
            hovered === `${toTable}.${c.to.column}`

          // Pick which side of each card to exit/enter from based on relative x
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
                stroke={involved ? '#A78BFA' : 'rgba(255,255,255,0.18)'}
                strokeWidth={involved ? 1.75 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ filter: involved ? 'drop-shadow(0 0 4px #A78BFA66)' : undefined }}
              />
              {/* End-cap dots */}
              <circle
                cx={x1}
                cy={y1}
                r={involved ? 3 : 2}
                fill={involved ? '#A78BFA' : 'rgba(255,255,255,0.3)'}
              />
              <circle
                cx={x2}
                cy={y2}
                r={involved ? 3 : 2}
                fill={involved ? '#A78BFA' : 'rgba(255,255,255,0.3)'}
              />
            </g>
          )
        })}
      </svg>

      {/* Table cards */}
      {tables.map((table) => (
        <TableCard
          key={table.name}
          table={table}
          showTypes={showTypes}
          rowRefs={rowRefs}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------

function TableCard({
  table,
  showTypes,
  rowRefs,
  hovered,
  setHovered,
}: {
  table: SchemaTable
  showTypes: boolean
  rowRefs: React.RefObject<Map<string, HTMLLIElement | null>>
  hovered: string | null
  setHovered: (k: string | null) => void
}) {
  const accent = table.accent ?? '#A78BFA'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute min-w-[180px] overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/85 shadow-xl shadow-black/40 backdrop-blur"
      style={{ left: table.x, top: table.y }}
    >
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3 py-2">
        <TableIcon className="h-3.5 w-3.5" strokeWidth={2} style={{ color: accent }} />
        <span className="font-mono text-[12px] font-semibold tracking-tight text-white/90">
          {table.name}
        </span>
        <span
          aria-hidden
          className="ml-auto block h-1 w-6 rounded-full"
          style={{ background: accent }}
        />
      </header>

      {/* Columns */}
      <ul className="divide-y divide-white/[0.04]">
        {table.columns.map((col) => {
          const key = `${table.name}.${col.name}`
          const isHovered = hovered === key
          return (
            <li
              key={col.name}
              ref={(el) => {
                rowRefs.current.set(key, el)
              }}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 transition-colors',
                isHovered ? 'bg-white/[0.06]' : 'bg-transparent hover:bg-white/[0.03]',
              )}
            >
              <span className="flex h-3 w-3 shrink-0 items-center justify-center">
                {col.primary ? (
                  <Key className="h-2.5 w-2.5 text-amber-300" strokeWidth={2.5} />
                ) : col.references ? (
                  <span
                    aria-hidden
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: '#A78BFA' }}
                  />
                ) : (
                  <span aria-hidden className="block h-1 w-1 rounded-full bg-white/20" />
                )}
              </span>
              <span className="font-mono text-[11.5px] font-medium text-white/85">
                {col.name}
              </span>
              {showTypes && (
                <span className="ml-auto font-mono text-[10.5px] text-white/40">
                  {col.type}
                  {col.nullable && '?'}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
