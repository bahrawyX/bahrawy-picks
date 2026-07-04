'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnHeader } from '@/components/bahrawy/data-table/column-header'
import { RowActions, type RowAction } from '@/components/bahrawy/data-table/row-actions'

// ---------------------------------------------------------------------------
// Shared option type
// ---------------------------------------------------------------------------

interface BaseColumnOptions {
  enableSorting?: boolean
  enableHiding?: boolean
  size?: number
  minSize?: number
  maxSize?: number
}

// ---------------------------------------------------------------------------
// Text column
// ---------------------------------------------------------------------------

export function createTextColumn<TData>(
  key: keyof TData & string,
  header: string,
  options?: BaseColumnOptions
): ColumnDef<TData, unknown> {
  return {
    accessorKey: key,
    header: ({ column }) => <ColumnHeader column={column} title={header} />,
    cell: ({ getValue }) => (
      <span className="truncate">{getValue() as string}</span>
    ),
    enableSorting: options?.enableSorting ?? true,
    enableHiding: options?.enableHiding ?? true,
    size: options?.size,
    minSize: options?.minSize ?? 80,
    maxSize: options?.maxSize,
    meta: { filterType: 'text' as const, headerLabel: header },
  }
}

// ---------------------------------------------------------------------------
// Number column
// ---------------------------------------------------------------------------

export function createNumberColumn<TData>(
  key: keyof TData & string,
  header: string,
  options?: BaseColumnOptions & { format?: Intl.NumberFormatOptions }
): ColumnDef<TData, unknown> {
  const fmt = options?.format
    ? new Intl.NumberFormat(undefined, options.format)
    : null
  return {
    accessorKey: key,
    header: ({ column }) => <ColumnHeader column={column} title={header} />,
    cell: ({ getValue }) => {
      const val = getValue() as number
      return (
        <span className="tabular-nums">
          {fmt ? fmt.format(val) : val}
        </span>
      )
    },
    enableSorting: options?.enableSorting ?? true,
    enableHiding: options?.enableHiding ?? true,
    size: options?.size,
    minSize: options?.minSize ?? 60,
    maxSize: options?.maxSize,
    meta: { filterType: 'number' as const, headerLabel: header },
  }
}

// ---------------------------------------------------------------------------
// Date column
// ---------------------------------------------------------------------------

export function createDateColumn<TData>(
  key: keyof TData & string,
  header: string,
  options?: BaseColumnOptions & { dateStyle?: Intl.DateTimeFormatOptions['dateStyle'] }
): ColumnDef<TData, unknown> {
  const dateStyle = options?.dateStyle ?? 'medium'
  return {
    accessorKey: key,
    header: ({ column }) => <ColumnHeader column={column} title={header} />,
    cell: ({ getValue }) => {
      const raw = getValue() as string
      if (!raw) return <span className="text-white/30">—</span>
      const d = new Date(raw)
      return (
        <span className="tabular-nums whitespace-nowrap">
          {d.toLocaleDateString(undefined, { dateStyle })}
        </span>
      )
    },
    sortingFn: (a, b, id) => {
      const da = new Date(a.getValue(id) as string).getTime()
      const db = new Date(b.getValue(id) as string).getTime()
      return da - db
    },
    enableSorting: options?.enableSorting ?? true,
    enableHiding: options?.enableHiding ?? true,
    size: options?.size,
    minSize: options?.minSize ?? 100,
    maxSize: options?.maxSize,
    meta: { filterType: 'date' as const, headerLabel: header },
  }
}

// ---------------------------------------------------------------------------
// Badge column
// ---------------------------------------------------------------------------

export function createBadgeColumn<TData>(
  key: keyof TData & string,
  header: string,
  colorMap: Record<string, string>,
  options?: BaseColumnOptions
): ColumnDef<TData, unknown> {
  return {
    accessorKey: key,
    header: ({ column }) => <ColumnHeader column={column} title={header} />,
    cell: ({ getValue }) => {
      const val = getValue() as string
      const color = colorMap[val] ?? 'bg-white/10 text-white/70'
      return (
        <Badge
          variant="outline"
          className={`border-transparent text-xs font-medium ${color}`}
        >
          {val}
        </Badge>
      )
    },
    filterFn: (row, id, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true
      return filterValue.includes(row.getValue(id) as string)
    },
    enableSorting: options?.enableSorting ?? true,
    enableHiding: options?.enableHiding ?? true,
    size: options?.size,
    minSize: options?.minSize ?? 80,
    maxSize: options?.maxSize,
    meta: {
      filterType: 'select' as const,
      filterOptions: Object.keys(colorMap),
      headerLabel: header,
    },
  }
}

// ---------------------------------------------------------------------------
// Boolean column
// ---------------------------------------------------------------------------

export function createBooleanColumn<TData>(
  key: keyof TData & string,
  header: string,
  options?: BaseColumnOptions & { trueLabel?: string; falseLabel?: string }
): ColumnDef<TData, unknown> {
  const tLabel = options?.trueLabel ?? 'Yes'
  const fLabel = options?.falseLabel ?? 'No'
  return {
    accessorKey: key,
    header: ({ column }) => <ColumnHeader column={column} title={header} />,
    cell: ({ getValue }) => {
      const val = getValue() as boolean
      return (
        <span className={val ? 'text-emerald-400' : 'text-white/40'}>
          {val ? tLabel : fLabel}
        </span>
      )
    },
    enableSorting: options?.enableSorting ?? true,
    enableHiding: options?.enableHiding ?? true,
    size: options?.size,
    minSize: options?.minSize ?? 60,
    maxSize: options?.maxSize,
    meta: { filterType: 'boolean' as const, headerLabel: header },
  }
}

// ---------------------------------------------------------------------------
// Actions column
// ---------------------------------------------------------------------------

export function createActionsColumn<TData>(
  actions: RowAction<TData>[]
): ColumnDef<TData, unknown> {
  return {
    id: '_actions',
    header: () => null,
    cell: ({ row }) => <RowActions row={row.original} actions={actions} />,
    enableSorting: false,
    enableHiding: false,
    size: 48,
    minSize: 48,
    maxSize: 48,
  }
}

// ---------------------------------------------------------------------------
// Selection column (internal)
// ---------------------------------------------------------------------------

export function createSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: '_select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
    minSize: 40,
    maxSize: 40,
  }
}
