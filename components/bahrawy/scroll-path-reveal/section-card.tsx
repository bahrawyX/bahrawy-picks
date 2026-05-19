'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  id: string
  title?: string
  content: ReactNode
  side: 'left' | 'right'
  className?: string
}

export function SectionCard({ id, title, content, side, className }: SectionCardProps) {
  return (
    <div
      id={`section-card-${id}`}
      className={cn(
        'w-[200px] md:w-[220px] rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 shadow-lg shadow-black/20',
        side === 'left' ? 'text-right' : 'text-left',
        className
      )}
    >
      {title && (
        <h3 className="mb-2 text-sm font-semibold tracking-wide text-white/90">
          {title}
        </h3>
      )}
      <div className="text-xs leading-relaxed text-white/60">{content}</div>
    </div>
  )
}
