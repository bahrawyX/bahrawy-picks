'use client'

import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeUp, springGentle, springSnappy, tweenExit } from '@/lib/motion'
import { evaluateFormula, colToLetter } from '@/lib/formula-utils'
import { toCSV, parseCSV, parseTSV, toTSV, downloadFile } from '@/lib/csv-utils'
import { Cell } from './cell'
import { ColumnHeader } from './column-header'
import { FormulaBar } from './formula-bar'
import { SpreadsheetToolbar } from './toolbar'
import { ContextMenu, type ContextMenuItem } from './context-menu'
import { SelectionOverlay } from './selection-overlay'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SpreadsheetColumn = {
  key: string
  header: string
  type?: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'readonly'
  width?: number
  minWidth?: number
  maxWidth?: number
  options?: string[]
  required?: boolean
  validate?: (value: unknown) => boolean | string
  format?: (value: unknown) => string
  editable?: boolean
  align?: 'left' | 'center' | 'right'
}

export type SpreadsheetRow = Record<string, unknown>

export interface SpreadsheetInputProps {
  columns: SpreadsheetColumn[]
  data?: SpreadsheetRow[]
  onChange?: (data: SpreadsheetRow[]) => void
  maxRows?: number
  defaultRowCount?: number
  showFormulaBar?: boolean
  enableFormulas?: boolean
  showToolbar?: boolean
  rowHeight?: number
  virtualize?: boolean
  readOnly?: boolean
  onExport?: () => void
  onImport?: (data: SpreadsheetRow[]) => void
  /** Accessible label for the grid container. Defaults to 'Spreadsheet'. */
  ariaLabel?: string
  className?: string
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

interface HistoryEntry {
  data: SpreadsheetRow[]
}

const MAX_HISTORY = 50

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROW_NUM_WIDTH = 44

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SpreadsheetInput({
  columns,
  data: controlledData,
  onChange,
  maxRows,
  defaultRowCount = 10,
  showFormulaBar = false,
  enableFormulas = false,
  showToolbar = true,
  rowHeight = 32,
  virtualize = true,
  readOnly = false,
  onExport,
  onImport,
  ariaLabel = 'Spreadsheet',
  className,
}: SpreadsheetInputProps) {
  const isControlled = controlledData !== undefined
  const [internalData, setInternalData] = useState<SpreadsheetRow[]>(() =>
    createEmptyRows(defaultRowCount, columns),
  )
  const data = isControlled ? controlledData : internalData

  // Column widths
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    const widths: Record<string, number> = {}
    columns.forEach((col) => {
      widths[col.key] = col.width ?? 120
    })
    return widths
  })

  // Selection
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{ row: number; col: number } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  // Initial editor content for type-to-edit (the typed character); null means
  // seed from the cell's current value.
  const [editSeed, setEditSeed] = useState<string | null>(null)

  // Sort
  const [sortState, setSortState] = useState<{ colKey: string; dir: 'asc' | 'desc' } | null>(null)

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([{ data: data }])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Context menu
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null)

  // Virtualization
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(400)

  // Import file ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  const colKeys = useMemo(() => columns.map((c) => c.key), [columns])

  // Formula bar value
  const formulaBarValue = useMemo(() => {
    if (!selectedCell) return ''
    const row = data[selectedCell.row]
    if (!row) return ''
    const val = row[columns[selectedCell.col]?.key]
    return val == null ? '' : String(val)
  }, [selectedCell, data, columns])

  // ---------------------------------------------------------------------------
  // Data mutation helpers
  // ---------------------------------------------------------------------------

  const updateData = useCallback(
    (newData: SpreadsheetRow[]) => {
      if (!isControlled) setInternalData(newData)
      onChange?.(newData)

      // Push to history. Compute the next buffer synchronously so the index
      // always stays in lockstep with the array — deriving the index with a
      // separate functional update let it drift once the buffer shifted at
      // MAX_HISTORY.
      const next = [...history.slice(0, historyIndex + 1), { data: newData }]
      if (next.length > MAX_HISTORY) next.shift()
      setHistory(next)
      setHistoryIndex(next.length - 1)
    },
    [isControlled, onChange, history, historyIndex],
  )

  const setCellValue = useCallback(
    (rowIdx: number, colKey: string, value: unknown) => {
      const newData = data.map((row, i) =>
        i === rowIdx ? { ...row, [colKey]: value } : row,
      )
      updateData(newData)
    },
    [data, updateData],
  )

  // ---------------------------------------------------------------------------
  // Undo / Redo
  // ---------------------------------------------------------------------------

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const undo = useCallback(() => {
    if (!canUndo) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    const entry = history[newIndex]
    if (!isControlled) setInternalData(entry.data)
    onChange?.(entry.data)
  }, [canUndo, historyIndex, history, isControlled, onChange])

  const redo = useCallback(() => {
    if (!canRedo) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    const entry = history[newIndex]
    if (!isControlled) setInternalData(entry.data)
    onChange?.(entry.data)
  }, [canRedo, historyIndex, history, isControlled, onChange])

  // ---------------------------------------------------------------------------
  // Row operations
  // ---------------------------------------------------------------------------

  const addRow = useCallback(
    (atIndex?: number) => {
      if (maxRows && data.length >= maxRows) return
      const empty = createEmptyRow(columns)
      const idx = atIndex ?? data.length
      const newData = [...data.slice(0, idx), empty, ...data.slice(idx)]
      updateData(newData)
    },
    [data, columns, maxRows, updateData],
  )

  const deleteRow = useCallback(
    (rowIdx: number) => {
      if (data.length <= 1) return
      const newData = data.filter((_, i) => i !== rowIdx)
      updateData(newData)
      if (selectedCell && selectedCell.row >= newData.length) {
        setSelectedCell({ row: newData.length - 1, col: selectedCell.col })
      }
    },
    [data, selectedCell, updateData],
  )

  // ---------------------------------------------------------------------------
  // Sort
  // ---------------------------------------------------------------------------

  const sortByColumn = useCallback(
    (colKey: string, dir: 'asc' | 'desc') => {
      setSortState({ colKey, dir })
      const sorted = [...data].sort((a, b) => {
        const av = a[colKey]
        const bv = b[colKey]
        if (av == null && bv == null) return 0
        if (av == null) return dir === 'asc' ? -1 : 1
        if (bv == null) return dir === 'asc' ? 1 : -1
        if (typeof av === 'number' && typeof bv === 'number') {
          return dir === 'asc' ? av - bv : bv - av
        }
        const sa = String(av)
        const sb = String(bv)
        return dir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
      })
      updateData(sorted)
    },
    [data, updateData],
  )

  // ---------------------------------------------------------------------------
  // Clipboard
  // ---------------------------------------------------------------------------

  const handleCopy = useCallback(() => {
    if (!selectedCell) return
    const start = selectedCell
    const end = selectionEnd ?? selectedCell
    const minR = Math.min(start.row, end.row)
    const maxR = Math.max(start.row, end.row)
    const minC = Math.min(start.col, end.col)
    const maxC = Math.max(start.col, end.col)

    const tsvData: string[][] = []
    for (let r = minR; r <= maxR; r++) {
      const row: string[] = []
      for (let c = minC; c <= maxC; c++) {
        const val = data[r]?.[columns[c]?.key]
        row.push(val == null ? '' : String(val))
      }
      tsvData.push(row)
    }

    navigator.clipboard.writeText(toTSV(tsvData)).catch(() => {})
  }, [selectedCell, selectionEnd, data, columns])

  const handlePaste = useCallback(
    async () => {
      if (!selectedCell || readOnly) return
      try {
        const text = await navigator.clipboard.readText()
        const parsed = parseTSV(text)
        if (parsed.length === 0) return

        const newData = [...data]
        for (let r = 0; r < parsed.length; r++) {
          const rowIdx = selectedCell.row + r
          if (rowIdx >= newData.length) break
          for (let c = 0; c < parsed[r].length; c++) {
            const colIdx = selectedCell.col + c
            if (colIdx >= columns.length) break
            const col = columns[colIdx]
            if (col.type === 'readonly' || col.editable === false) continue
            newData[rowIdx] = { ...newData[rowIdx], [col.key]: parsed[r][c] }
          }
        }
        updateData(newData)
      } catch {
        // clipboard access denied
      }
    },
    [selectedCell, data, columns, readOnly, updateData],
  )

  // ---------------------------------------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------------------------------------

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedCell) return

      // Ctrl+Z undo, Ctrl+Y redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
        return
      }
      // Ctrl+C copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        handleCopy()
        return
      }
      // Ctrl+V paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        handlePaste()
        return
      }
      // Ctrl+A select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        setSelectedCell({ row: 0, col: 0 })
        setSelectionEnd({ row: data.length - 1, col: columns.length - 1 })
        return
      }

      if (editingCell) return // let cell handle keys during edit

      const { row, col } = selectedCell

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (row > 0) setSelectedCell({ row: row - 1, col })
          setSelectionEnd(null)
          break
        case 'ArrowDown':
          e.preventDefault()
          if (row < data.length - 1) setSelectedCell({ row: row + 1, col })
          setSelectionEnd(null)
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (col > 0) setSelectedCell({ row, col: col - 1 })
          setSelectionEnd(null)
          break
        case 'ArrowRight':
          e.preventDefault()
          if (col < columns.length - 1) setSelectedCell({ row, col: col + 1 })
          setSelectionEnd(null)
          break
        case 'Tab':
          e.preventDefault()
          if (e.shiftKey) {
            if (col > 0) setSelectedCell({ row, col: col - 1 })
            else if (row > 0) setSelectedCell({ row: row - 1, col: columns.length - 1 })
          } else {
            if (col < columns.length - 1) setSelectedCell({ row, col: col + 1 })
            else if (row < data.length - 1) setSelectedCell({ row: row + 1, col: 0 })
          }
          setSelectionEnd(null)
          break
        case 'Enter':
          e.preventDefault()
          if (e.shiftKey) {
            if (row > 0) setSelectedCell({ row: row - 1, col })
          } else {
            // Enter edit mode
            const column = columns[col]
            if (column && column.type !== 'readonly' && column.type !== 'checkbox' && column.editable !== false && !readOnly) {
              setEditSeed(null)
              setEditingCell({ row, col })
            }
          }
          break
        case 'Delete':
        case 'Backspace':
          if (!readOnly && selectedCell) {
            const column = columns[col]
            if (column && column.type !== 'readonly' && column.editable !== false) {
              setCellValue(row, column.key, '')
            }
          }
          break
        case 'F2':
          e.preventDefault()
          {
            const column = columns[col]
            if (column && column.type !== 'readonly' && column.type !== 'checkbox' && column.editable !== false && !readOnly) {
              setEditSeed(null)
              setEditingCell({ row, col })
            }
          }
          break
        default:
          // Start typing to enter edit mode. Seed the editor with the typed
          // character instead of writing an empty value into the data, which
          // pushed a junk entry onto the undo history.
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !readOnly) {
            const column = columns[col]
            if (column && column.type !== 'readonly' && column.type !== 'checkbox' && column.editable !== false) {
              setEditSeed(e.key)
              setEditingCell({ row, col })
            }
          }
          break
      }
    },
    [selectedCell, selectionEnd, editingCell, data, columns, readOnly, setCellValue, undo, redo, handleCopy, handlePaste],
  )

  // ---------------------------------------------------------------------------
  // Context menus
  // ---------------------------------------------------------------------------

  const showRowContextMenu = useCallback(
    (e: React.MouseEvent, rowIdx: number) => {
      e.preventDefault()
      setCtxMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: 'Insert row above', onClick: () => addRow(rowIdx) },
          { label: 'Insert row below', onClick: () => addRow(rowIdx + 1) },
          { label: '', onClick: () => {}, separator: true },
          { label: 'Delete row', onClick: () => deleteRow(rowIdx), danger: true, disabled: data.length <= 1 },
        ],
      })
    },
    [addRow, deleteRow, data.length],
  )

  const showColContextMenu = useCallback(
    (e: React.MouseEvent, colIdx: number) => {
      e.preventDefault()
      const colKey = columns[colIdx].key
      setCtxMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: 'Sort A → Z', onClick: () => sortByColumn(colKey, 'asc') },
          { label: 'Sort Z → A', onClick: () => sortByColumn(colKey, 'desc') },
        ],
      })
    },
    [columns, sortByColumn],
  )

  // ---------------------------------------------------------------------------
  // Import / Export
  // ---------------------------------------------------------------------------

  const handleExport = useCallback(() => {
    const headers = columns.map((c) => c.header)
    const csv = toCSV(headers, data, colKeys)
    downloadFile(csv, 'spreadsheet-export.csv')
    onExport?.()
  }, [columns, data, colKeys, onExport])

  const handleImportFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        const parsed = parseCSV(text)
        if (parsed.length < 2) return // need header + at least 1 row

        const importedData: SpreadsheetRow[] = parsed.slice(1).map((row) => {
          const obj: SpreadsheetRow = {}
          columns.forEach((col, i) => {
            obj[col.key] = row[i] ?? ''
          })
          return obj
        })

        updateData(importedData)
        onImport?.(importedData)
      }
      reader.readAsText(file)
      // Reset input
      e.target.value = ''
    },
    [columns, updateData, onImport],
  )

  // ---------------------------------------------------------------------------
  // Virtualization
  // ---------------------------------------------------------------------------

  const totalRows = data.length
  const startRow = virtualize
    ? Math.max(0, Math.floor(scrollTop / rowHeight) - 2)
    : 0
  const endRow = virtualize
    ? Math.min(totalRows, Math.ceil((scrollTop + viewportHeight) / rowHeight) + 2)
    : totalRows

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrollTop(el.scrollTop)
    const onResize = () => setViewportHeight(el.clientHeight)
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Cell display value (with formula support)
  // ---------------------------------------------------------------------------

  const getCellDisplay = useCallback(
    (rowIdx: number, colKey: string): { display: string; isError: boolean } => {
      const raw = data[rowIdx]?.[colKey]
      if (raw == null || raw === '') return { display: '', isError: false }

      const str = String(raw)

      // Formula evaluation
      if (enableFormulas && str.startsWith('=')) {
        const result = evaluateFormula(str, data, colKeys)
        return {
          display: result.error ? '#ERR' : String(result.value),
          isError: result.error,
        }
      }

      // Column format function
      const col = columns.find((c) => c.key === colKey)
      if (col?.format) return { display: col.format(raw), isError: false }

      // Number formatting
      if (col?.type === 'number' && typeof raw === 'number') {
        return { display: new Intl.NumberFormat().format(raw), isError: false }
      }

      return { display: str, isError: false }
    },
    [data, columns, colKeys, enableFormulas],
  )

  // ---------------------------------------------------------------------------
  // Selection bounds for overlay
  // ---------------------------------------------------------------------------

  const selBounds = useMemo(() => {
    if (!selectedCell) return null
    const start = selectedCell
    const end = selectionEnd ?? selectedCell
    const minR = Math.min(start.row, end.row)
    const maxR = Math.max(start.row, end.row)
    const minC = Math.min(start.col, end.col)
    const maxC = Math.max(start.col, end.col)

    let left = ROW_NUM_WIDTH
    for (let c = 0; c < minC; c++) left += colWidths[columns[c].key] ?? 120
    let width = 0
    for (let c = minC; c <= maxC; c++) width += colWidths[columns[c].key] ?? 120

    const top = minR * rowHeight
    const height = (maxR - minR + 1) * rowHeight

    return { top, left, width, height }
  }, [selectedCell, selectionEnd, columns, colWidths, rowHeight])

  // Total width for scroll
  const totalWidth = useMemo(
    () => ROW_NUM_WIDTH + columns.reduce((sum, col) => sum + (colWidths[col.key] ?? 120), 0),
    [columns, colWidths],
  )

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={springGentle}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-black/40',
        className,
      )}
    >
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImportFile}
        className="hidden"
      />

      {/* Toolbar */}
      {showToolbar && (
        <SpreadsheetToolbar
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onExport={handleExport}
          onImportClick={() => fileInputRef.current?.click()}
        />
      )}

      {/* Formula bar */}
      {showFormulaBar && (
        <FormulaBar
          selectedCol={selectedCell?.col ?? -1}
          selectedRow={selectedCell?.row ?? -1}
          cellValue={formulaBarValue}
          onValueChange={(val) => {
            if (selectedCell) {
              setCellValue(selectedCell.row, columns[selectedCell.col].key, val)
            }
          }}
          onCommit={() => setEditingCell(null)}
        />
      )}

      {/* Grid */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-auto focus:outline-none"
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
        role="grid"
        aria-label={ariaLabel}
        style={{ maxHeight: 500 }}
      >
        {/* Inner for total scroll area */}
        <div style={{ minWidth: totalWidth }}>
          {/* Column headers */}
          <div className="sticky top-0 z-20 flex bg-neutral-950" role="row">
            {/* Corner cell */}
            <div
              className="flex h-8 flex-shrink-0 items-center justify-center border-b border-r border-white/[0.06] bg-neutral-950 text-xs text-white/30"
              style={{ width: ROW_NUM_WIDTH }}
              role="columnheader"
              aria-label="Row number"
            >
              #
            </div>
            {columns.map((col, i) => (
              <ColumnHeader
                key={col.key}
                column={col}
                index={i}
                width={colWidths[col.key] ?? 120}
                sortDir={sortState?.colKey === col.key ? sortState.dir : null}
                isSelected={selectedCell?.col === i && selectionEnd === null}
                onSort={(dir) => sortByColumn(col.key, dir)}
                onResize={(w) => setColWidths((prev) => ({ ...prev, [col.key]: w }))}
                onSelect={() => {
                  setSelectedCell({ row: 0, col: i })
                  setSelectionEnd({ row: data.length - 1, col: i })
                }}
                onContextMenu={(e) => showColContextMenu(e, i)}
              />
            ))}
          </div>

          {/* Rows area */}
          <div
            className="relative"
            style={{ height: virtualize ? totalRows * rowHeight : undefined }}
          >
            {/* Selection overlay */}
            {selBounds && (
              <SelectionOverlay
                top={selBounds.top}
                left={selBounds.left}
                width={selBounds.width}
                height={selBounds.height}
              />
            )}

            {/* Spacer for virtualization */}
            {virtualize && startRow > 0 && (
              <div style={{ height: startRow * rowHeight }} />
            )}

            {/* Visible rows */}
            <AnimatePresence>
              {data.slice(startRow, endRow).map((row, offsetIdx) => {
                const rowIdx = startRow + offsetIdx
                return (
                  <motion.div
                    key={rowIdx}
                    layout
                    initial={fadeUp.initial}
                    animate={fadeUp.animate}
                    exit={{ opacity: 0, height: 0 }}
                    transition={springSnappy}
                    className="flex"
                    style={virtualize ? { position: 'absolute', top: rowIdx * rowHeight, width: '100%' } : undefined}
                    role="row"
                  >
                    {/* Row number */}
                    <div
                      className={cn(
                        'flex flex-shrink-0 cursor-pointer items-center justify-center border-b border-r border-white/[0.04] text-[10px] text-white/25 hover:bg-white/[0.03]',
                        selectedCell?.row === rowIdx && 'bg-blue-500/10 text-white/50',
                      )}
                      style={{ width: ROW_NUM_WIDTH, height: rowHeight }}
                      onClick={() => {
                        setSelectedCell({ row: rowIdx, col: 0 })
                        setSelectionEnd({ row: rowIdx, col: columns.length - 1 })
                      }}
                      onContextMenu={(e) => showRowContextMenu(e, rowIdx)}
                    >
                      {rowIdx + 1}
                    </div>

                    {/* Cells */}
                    {columns.map((col, colIdx) => {
                      const { display, isError } = getCellDisplay(rowIdx, col.key)
                      const isSel =
                        selectedCell !== null &&
                        (() => {
                          const start = selectedCell
                          const end = selectionEnd ?? selectedCell
                          const minR = Math.min(start.row, end.row)
                          const maxR = Math.max(start.row, end.row)
                          const minC = Math.min(start.col, end.col)
                          const maxC = Math.max(start.col, end.col)
                          return rowIdx >= minR && rowIdx <= maxR && colIdx >= minC && colIdx <= maxC
                        })()
                      const isEdit =
                        editingCell?.row === rowIdx && editingCell?.col === colIdx

                      return (
                        <Cell
                          key={col.key}
                          column={col}
                          value={row[col.key]}
                          width={colWidths[col.key] ?? 120}
                          rowHeight={rowHeight}
                          isSelected={isSel}
                          isEditing={isEdit}
                          isError={isError}
                          displayValue={display}
                          editSeed={isEdit ? editSeed : null}
                          onSelect={(e) => {
                            if (e.shiftKey && selectedCell) {
                              setSelectionEnd({ row: rowIdx, col: colIdx })
                            } else {
                              setSelectedCell({ row: rowIdx, col: colIdx })
                              setSelectionEnd(null)
                            }
                            setEditingCell(null)
                          }}
                          onDoubleClick={() => {
                            if (readOnly || col.type === 'readonly' || col.editable === false) return
                            setEditSeed(null)
                            setEditingCell({ row: rowIdx, col: colIdx })
                          }}
                          onValueChange={(val) => setCellValue(rowIdx, col.key, val)}
                          onCommitEdit={() => {
                            setEditingCell(null)
                          }}
                          onCancelEdit={() => setEditingCell(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Tab') {
                              e.preventDefault()
                              setEditingCell(null)
                              if (e.shiftKey) {
                                if (colIdx > 0) setSelectedCell({ row: rowIdx, col: colIdx - 1 })
                              } else {
                                if (colIdx < columns.length - 1) setSelectedCell({ row: rowIdx, col: colIdx + 1 })
                              }
                            }
                          }}
                        />
                      )
                    })}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add row button */}
      {!readOnly && (!maxRows || data.length < maxRows) && (
        <button
          type="button"
          onClick={() => addRow()}
          className="flex h-8 items-center gap-1.5 border-t border-white/[0.06] px-3 text-xs text-white/30 transition-colors hover:bg-white/[0.03] hover:text-white/50"
        >
          <Plus className="h-3 w-3" />
          Add row
        </button>
      )}

      {/* Context menu */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          items={ctxMenu.items}
          onClose={() => setCtxMenu(null)}
        />
      )}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createEmptyRow(columns: SpreadsheetColumn[]): SpreadsheetRow {
  const row: SpreadsheetRow = {}
  columns.forEach((col) => {
    row[col.key] = col.type === 'checkbox' ? false : col.type === 'number' ? 0 : ''
  })
  return row
}

function createEmptyRows(count: number, columns: SpreadsheetColumn[]): SpreadsheetRow[] {
  return Array.from({ length: count }, () => createEmptyRow(columns))
}
