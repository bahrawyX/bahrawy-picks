'use client'

import { type Table } from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 25, 50, 100],
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  // Use getRowCount() which respects manualPagination + rowCount prop
  const totalRows = table.getRowCount()
  const start = pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalRows)
  const pageCount = table.getPageCount()

  return (
    <div className="flex items-center justify-between py-1">
      {/* Left — showing X–Y of Z */}
      <p className="text-[13px] tabular-nums text-picks-fg/35">
        Showing{' '}
        <span className="text-picks-fg/55">
          {totalRows > 0 ? start : 0}–{end}
        </span>{' '}
        of{' '}
        <span className="text-picks-fg/55">{totalRows}</span> results
      </p>

      {/* Right — controls */}
      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-picks-fg/35">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[68px] border-picks-fg/[0.08] bg-picks-fg/[0.03] text-xs text-picks-fg/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-picks-fg/10 bg-picks-surface/90 backdrop-blur-xl">
              {pageSizeOptions.map((size) => (
                <SelectItem
                  key={size}
                  value={String(size)}
                  className="text-xs text-picks-fg/70 focus:bg-picks-fg/[0.06]"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <span className="text-[13px] tabular-nums text-picks-fg/35">
          Page <span className="text-picks-fg/55">{pageIndex + 1}</span> of{' '}
          <span className="text-picks-fg/55">{pageCount || 1}</span>
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-md text-picks-fg/40 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg/70 disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-md text-picks-fg/40 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg/70 disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-md text-picks-fg/40 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg/70 disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-md text-picks-fg/40 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg/70 disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
