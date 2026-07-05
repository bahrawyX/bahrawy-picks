'use client'

import { type ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, springGentle } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

interface EmptyStateProps {
  columnCount: number
  hasActiveFilters: boolean
  onClearFilters: () => void
  children?: ReactNode
}

export function EmptyState({
  columnCount,
  hasActiveFilters,
  onClearFilters,
  children,
}: EmptyStateProps) {
  return (
    <TableBody>
      <TableRow className="border-picks-fg/[0.04] hover:bg-transparent">
        <TableCell colSpan={columnCount} className="h-60">
          {children ?? (
            <motion.div
              {...fadeUp}
              transition={springGentle}
              className="flex flex-col items-center justify-center gap-3 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-picks-fg/10 bg-picks-fg/[0.03]">
                <Inbox className="h-6 w-6 text-picks-fg/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-picks-fg/60">
                  No results found
                </p>
                {hasActiveFilters && (
                  <p className="mt-1 text-xs text-picks-fg/40">
                    Try adjusting your filters
                  </p>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClearFilters}
                  className="mt-1 border-picks-fg/10 bg-picks-fg/[0.04] text-picks-fg/70 hover:bg-picks-fg/[0.08]"
                >
                  Clear all filters
                </Button>
              )}
            </motion.div>
          )}
        </TableCell>
      </TableRow>
    </TableBody>
  )
}
