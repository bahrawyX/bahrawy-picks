'use client'

import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { type Table } from '@tanstack/react-table'
import {
  AlignJustify,
  AlignCenter,
  AlignLeft,
  Columns3,
  Search,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { scaleIn, springSnappy, tweenExit } from '@/lib/motion'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FilterBadge } from './filter-badge'

type Density = 'compact' | 'default' | 'comfortable'

interface ToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  density: Density
  onDensityChange: (density: Density) => void
  toolbarActions?: ReactNode
}

const densityIcons: Record<Density, typeof AlignLeft> = {
  compact: AlignJustify,
  default: AlignCenter,
  comfortable: AlignLeft,
}
const densityCycle: Density[] = ['default', 'compact', 'comfortable']

export function Toolbar<TData>({
  table,
  globalFilter,
  onGlobalFilterChange,
  density,
  onDensityChange,
  toolbarActions,
}: ToolbarProps<TData>) {
  const columnFilters = table.getState().columnFilters
  const hasActiveFilters = columnFilters.length > 0 || !!globalFilter

  const nextDensity = useCallback(() => {
    const idx = densityCycle.indexOf(density)
    onDensityChange(densityCycle[(idx + 1) % densityCycle.length])
  }, [density, onDensityChange])

  const DensityIcon = densityIcons[density]

  // Debounced global filter
  const [localSearch, setLocalSearch] = useState(globalFilter)
  useEffect(() => {
    const t = setTimeout(() => onGlobalFilterChange(localSearch), 300)
    return () => clearTimeout(t)
  }, [localSearch, onGlobalFilterChange])

  // Sync external changes
  useEffect(() => {
    setLocalSearch(globalFilter)
  }, [globalFilter])

  return (
    <div className="flex flex-col gap-2.5">
      {/* Main toolbar row */}
      <div className="flex items-center gap-2">
        {/* Always-visible search */}
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-picks-fg/25" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search..."
            className="h-9 w-[220px] rounded-lg border border-picks-fg/[0.08] bg-picks-fg/[0.03] pl-9 pr-8 text-sm text-picks-fg/80 outline-none placeholder:text-picks-fg/25 transition-colors focus:border-picks-fg/20 focus:bg-picks-fg/[0.05]"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('')
                onGlobalFilterChange('')
              }}
              className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-sm text-picks-fg/30 transition-colors hover:text-picks-fg/60"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex-1" />

        {/* Custom toolbar actions */}
        {toolbarActions}

        {/* Density toggle */}
        <button
          type="button"
          onClick={nextDensity}
          title={`Density: ${density}`}
          className="flex h-8 w-8 items-center justify-center rounded-md text-picks-fg/35 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg/60"
        >
          <DensityIcon className="h-4 w-4" />
        </button>

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs text-picks-fg/40 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg/60"
            >
              <Columns3 className="h-3.5 w-3.5" />
              Columns
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[180px] border-picks-fg/10 bg-picks-surface/90 backdrop-blur-xl"
          >
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => {
                const meta = col.columnDef.meta as
                  | { headerLabel?: string }
                  | undefined
                return (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    className="text-xs text-picks-fg/70 focus:bg-picks-fg/[0.06]"
                  >
                    {meta?.headerLabel ?? col.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filter badges */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            {...scaleIn}
            transition={springSnappy}
            exit={{ ...scaleIn.exit, transition: tweenExit }}
            className="flex flex-wrap items-center gap-1.5"
          >
            {globalFilter && (
              <FilterBadge
                label="Search"
                value={globalFilter}
                onRemove={() => {
                  setLocalSearch('')
                  onGlobalFilterChange('')
                }}
              />
            )}

            {columnFilters.map((filter) => {
              const col = table.getColumn(filter.id)
              const meta = col?.columnDef.meta as
                | { headerLabel?: string }
                | undefined
              const displayValue = Array.isArray(filter.value)
                ? (filter.value as string[]).join(', ')
                : String(filter.value)
              return (
                <FilterBadge
                  key={filter.id}
                  label={meta?.headerLabel ?? filter.id}
                  value={displayValue}
                  onRemove={() => col?.setFilterValue(undefined)}
                />
              )
            })}

            <button
              type="button"
              onClick={() => {
                table.resetColumnFilters()
                setLocalSearch('')
                onGlobalFilterChange('')
              }}
              className={cn(
                'h-6 px-2 text-[10px] uppercase tracking-wider text-picks-fg/35 transition-colors hover:text-picks-fg/60',
                columnFilters.length === 0 && !globalFilter && 'hidden'
              )}
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
