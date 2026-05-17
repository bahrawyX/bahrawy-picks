'use client'

import { type Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { scaleIn, springSnappy } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function ColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const sorted = column.getIsSorted()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            '-ml-3 h-8 gap-1.5 text-[13px] font-medium text-white/40 hover:bg-white/[0.06] hover:text-white/70 data-[state=open]:bg-white/[0.06]',
            className
          )}
        >
          {title}
          <AnimatePresence mode="wait" initial={false}>
            {sorted === 'asc' && (
              <motion.span
                key="asc"
                {...scaleIn}
                transition={springSnappy}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </motion.span>
            )}
            {sorted === 'desc' && (
              <motion.span
                key="desc"
                {...scaleIn}
                transition={springSnappy}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </motion.span>
            )}
            {!sorted && (
              <motion.span
                key="none"
                {...scaleIn}
                transition={springSnappy}
              >
                <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="border-white/10 bg-black/90 backdrop-blur-xl"
      >
        <DropdownMenuItem
          onClick={() => column.toggleSorting(false)}
          className="gap-2 text-white/70 hover:text-white focus:bg-white/[0.06]"
        >
          <ArrowUp className="h-3.5 w-3.5 text-white/40" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => column.toggleSorting(true)}
          className="gap-2 text-white/70 hover:text-white focus:bg-white/[0.06]"
        >
          <ArrowDown className="h-3.5 w-3.5 text-white/40" />
          Desc
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => column.clearSorting()}
          className="gap-2 text-white/70 hover:text-white focus:bg-white/[0.06]"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-white/40" />
          Unsort
        </DropdownMenuItem>
        {column.getCanHide() && (
          <>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={() => column.toggleVisibility(false)}
              className="gap-2 text-white/70 hover:text-white focus:bg-white/[0.06]"
            >
              <EyeOff className="h-3.5 w-3.5 text-white/40" />
              Hide
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
