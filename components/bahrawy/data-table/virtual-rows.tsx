'use client'

import { useRef } from 'react'
import { type Table, type Row, flexRender } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type Density = 'compact' | 'default' | 'comfortable'

const ROW_HEIGHTS: Record<Density, number> = {
  compact: 36,
  default: 44,
  comfortable: 56,
}

interface VirtualRowsProps<TData> {
  table: Table<TData>
  density: Density
  onRowClick?: (row: Row<TData>) => void
}

export function VirtualRows<TData>({
  table,
  density,
  onRowClick,
}: VirtualRowsProps<TData>) {
  const parentRef = useRef<HTMLTableSectionElement>(null)
  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current?.closest('.dt-scroll-container') as HTMLElement | null,
    estimateSize: () => ROW_HEIGHTS[density],
    overscan: 20,
  })

  const items = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  return (
    <TableBody ref={parentRef}>
      {/* Top spacer */}
      {items.length > 0 && items[0].start > 0 && (
        <TableRow className="border-0 hover:bg-transparent">
          <TableCell
            colSpan={table.getVisibleFlatColumns().length}
            style={{ height: items[0].start, padding: 0 }}
          />
        </TableRow>
      )}

      {items.map((virtualRow) => {
        const row = rows[virtualRow.index]
        return (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() ? 'selected' : undefined}
            onClick={() => onRowClick?.(row)}
            className={cn(
              'border-picks-fg/[0.06]',
              row.getIsSelected() && 'bg-picks-fg/[0.04]'
            )}
            style={{ height: virtualRow.size }}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="text-sm text-picks-fg/70 px-4"
                style={{ width: cell.column.getSize() }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        )
      })}

      {/* Bottom spacer */}
      {items.length > 0 && (
        <TableRow className="border-0 hover:bg-transparent">
          <TableCell
            colSpan={table.getVisibleFlatColumns().length}
            style={{
              height: totalSize - (items[items.length - 1].end),
              padding: 0,
            }}
          />
        </TableRow>
      )}
    </TableBody>
  )
}
