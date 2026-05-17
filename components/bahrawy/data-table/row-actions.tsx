'use client'

import { type ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface RowAction<TData> {
  label: string
  icon?: ReactNode
  onClick: (row: TData) => void
  variant?: 'default' | 'destructive'
}

interface RowActionsProps<TData> {
  row: TData
  actions: RowAction<TData>[]
}

export function RowActions<TData>({ row, actions }: RowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white/40 hover:bg-white/[0.06] hover:text-white/80"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-white/10 bg-black/90 backdrop-blur-xl"
      >
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={() => action.onClick(row)}
            className={
              action.variant === 'destructive'
                ? 'gap-2 text-red-400 hover:text-red-300 focus:bg-red-500/10'
                : 'gap-2 text-white/70 hover:text-white focus:bg-white/[0.06]'
            }
          >
            {action.icon && (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                {action.icon}
              </span>
            )}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
