'use client'

import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type PaginationState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springGentle } from '@/lib/motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createSelectionColumn } from '@/lib/column-helpers'
import { Toolbar } from './toolbar'
import { DataTablePagination } from './pagination'
import { SkeletonRows } from './skeleton'
import { EmptyState } from './empty-state'
import { type BulkAction, BulkActionBar } from './bulk-action-bar'
import { VirtualRows } from './virtual-rows'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Density = 'compact' | 'default' | 'comfortable'

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  emptyState?: ReactNode
  onRowSelectionChange?: (rows: TData[]) => void
  bulkActions?: BulkAction<TData>[]
  defaultSort?: SortingState
  defaultHiddenColumns?: string[]
  density?: Density
  renderSubComponent?: (row: Row<TData>) => ReactNode
  toolbarActions?: ReactNode
  // pagination
  manualPagination?: boolean
  pageCount?: number
  rowCount?: number
  onPaginationChange?: (pagination: PaginationState) => void
  // server-side
  manualSorting?: boolean
  manualFiltering?: boolean
  onSortingChange?: (sorting: SortingState) => void
  onFilteringChange?: (filters: ColumnFiltersState) => void
  // virtualization
  virtualize?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Density config
// ---------------------------------------------------------------------------

const densityPadding: Record<Density, string> = {
  compact: 'py-2 px-4',
  default: 'py-3 px-4',
  comfortable: 'py-3.5 px-4',
}

const densityRowHeight: Record<Density, number> = {
  compact: 36,
  default: 48,
  comfortable: 52,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataTable<TData, TValue = unknown>({
  columns: userColumns,
  data,
  isLoading = false,
  emptyState,
  onRowSelectionChange,
  bulkActions,
  defaultSort,
  defaultHiddenColumns,
  density: controlledDensity,
  renderSubComponent,
  toolbarActions,
  manualPagination = false,
  pageCount: manualPageCount,
  rowCount: manualRowCount,
  onPaginationChange,
  manualSorting = false,
  manualFiltering = false,
  onSortingChange: onSortingChangeProp,
  onFilteringChange,
  virtualize = false,
  className,
}: DataTableProps<TData, TValue>) {
  // ---- State ----
  const [sorting, setSorting] = useState<SortingState>(defaultSort ?? [])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (!defaultHiddenColumns) return {}
      return Object.fromEntries(defaultHiddenColumns.map((id) => [id, false]))
    }
  )
  const [rowSelection, setRowSelection] = useState({})
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [density, setDensity] = useState<Density>(controlledDensity ?? 'default')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Sync controlled density
  useEffect(() => {
    if (controlledDensity) setDensity(controlledDensity)
  }, [controlledDensity])

  // ---- Columns with selection + expansion ----
  const columns = useMemo(() => {
    const cols: ColumnDef<TData, unknown>[] = []

    // Selection column
    if (bulkActions && bulkActions.length > 0) {
      cols.push(createSelectionColumn<TData>())
    }

    // Expansion column
    if (renderSubComponent) {
      cols.push({
        id: '_expand',
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                row.toggleExpanded()
              }}
              className="flex h-6 w-6 items-center justify-center rounded text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : null,
        enableSorting: false,
        enableHiding: false,
        size: 36,
      })
    }

    cols.push(...(userColumns as ColumnDef<TData, unknown>[]))
    return cols
  }, [userColumns, bulkActions, renderSubComponent])

  // ---- External callbacks via effects (avoids setState-during-render) ----
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  useEffect(() => {
    if (mounted.current) onSortingChangeProp?.(sorting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  useEffect(() => {
    if (mounted.current) onFilteringChange?.(columnFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters])

  useEffect(() => {
    if (mounted.current) onPaginationChange?.(pagination)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination])

  // ---- Table instance ----
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      expanded,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: renderSubComponent ? () => true : undefined,
    manualSorting,
    manualFiltering,
    manualPagination,
    pageCount: manualPageCount,
    rowCount: manualRowCount,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  })

  // ---- Row selection callback ----
  useEffect(() => {
    if (!onRowSelectionChange) return
    const selected = table
      .getFilteredSelectedRowModel()
      .rows.map((r) => r.original)
    onRowSelectionChange(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection])

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original)
  const selectedCount = selectedRows.length

  const clearFilters = useCallback(() => {
    table.resetColumnFilters()
    setGlobalFilter('')
  }, [table])

  const visibleColumnCount = table.getVisibleFlatColumns().length
  const rows = table.getRowModel().rows
  const hasRows = rows.length > 0

  // Stable min-height prevents table jumping during page changes
  const tableMinHeight = useMemo(
    () => pagination.pageSize * densityRowHeight[density],
    [pagination.pageSize, density]
  )

  // ---- Column resize handle ----
  const renderResizeHandle = useCallback(
    (header: { column: { getIsResizing: () => boolean; getCanResize: () => boolean }; getResizeHandler: () => (e: unknown) => void }) => {
      if (!header.column.getCanResize()) return null
      return (
        <motion.div
          onMouseDown={header.getResizeHandler() as React.MouseEventHandler}
          onTouchStart={header.getResizeHandler() as React.TouchEventHandler}
          whileHover={{ scaleX: 1.5 }}
          className={cn(
            'absolute right-0 top-0 h-full w-0.5 cursor-col-resize select-none touch-none bg-white/0 transition-colors hover:bg-white/15',
            header.column.getIsResizing() && 'bg-white/25'
          )}
        />
      )
    },
    []
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar */}
      <Toolbar
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        density={density}
        onDensityChange={setDensity}
        toolbarActions={toolbarActions}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.08]">
        {virtualize && hasRows && !isLoading ? (
          <div className="dt-scroll-container max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="border-white/[0.08] hover:bg-transparent">
                    {hg.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={cn('relative text-[13px] font-medium text-white/40', densityPadding[density])}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {renderResizeHandle(header)}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <VirtualRows table={table} density={density} />
            </Table>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white/[0.02]">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-white/[0.08] hover:bg-transparent">
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn('relative text-[13px] font-medium text-white/40', densityPadding[density])}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {renderResizeHandle(header)}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {isLoading ? (
              <SkeletonRows columnCount={visibleColumnCount} rowCount={pagination.pageSize} />
            ) : !hasRows ? (
              <EmptyState
                columnCount={visibleColumnCount}
                hasActiveFilters={columnFilters.length > 0 || !!globalFilter}
                onClearFilters={clearFilters}
              >
                {emptyState}
              </EmptyState>
            ) : (
              <TableBody style={{ minHeight: tableMinHeight }}>
                {rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                      className={cn(
                        'border-white/[0.06] transition-colors hover:bg-white/[0.02]',
                        row.getIsSelected() && 'bg-white/[0.04]'
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'text-sm text-white/70',
                            densityPadding[density]
                          )}
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Expanded sub-row — rendered directly after its parent */}
                    {renderSubComponent && row.getIsExpanded() && (
                      <tr>
                        <td colSpan={visibleColumnCount}>
                          <AnimatePresence initial={false}>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={springGentle}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-white/[0.06] bg-white/[0.015] px-5 py-4">
                                {renderSubComponent(row)}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            )}
          </Table>
        )}
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />

      {/* Bulk action bar */}
      <AnimatePresence>
        {bulkActions && selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            selectedRows={selectedRows}
            actions={bulkActions}
            onClearSelection={() => table.resetRowSelection()}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
