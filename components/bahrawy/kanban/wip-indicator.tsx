'use client'

import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface WipIndicatorProps {
  count: number
  limit: number
  className?: string
}

export function WipIndicator({ count, limit, className }: WipIndicatorProps) {
  const exceeded = count > limit

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        exceeded
          ? 'bg-amber-500/15 text-amber-400'
          : 'bg-white/[0.06] text-white/50',
        className
      )}
    >
      {exceeded && <AlertCircle className="h-3 w-3" />}
      {count}/{limit}
    </span>
  )
}
