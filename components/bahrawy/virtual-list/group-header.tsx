'use client'

import { cn } from '@/lib/utils'

interface GroupHeaderProps {
  label: string
  className?: string
}

export function GroupHeader({ label, className }: GroupHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 bg-picks-surface/90 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-wider text-picks-fg/50 border-b border-picks-fg/[0.06]',
        className
      )}
    >
      {label}
    </div>
  )
}
