'use client'

import { cn } from '@/lib/utils'

interface SkeletonRowsProps {
  count: number
  itemHeight: number
  className?: string
}

export function SkeletonRows({ count, itemHeight, className }: SkeletonRowsProps) {
  return (
    <div className={cn('flex flex-col gap-2 p-2', className)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-picks-fg/[0.06]"
          style={{ height: itemHeight }}
        />
      ))}
    </div>
  )
}
