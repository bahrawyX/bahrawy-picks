'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  label?: string
  heading?: string
  className?: string
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  function SectionHeader({ label, heading, className }, ref) {
    return (
      <div ref={ref} className={cn(className)}>
        {label && (
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/40">
            {label}
          </p>
        )}
        {heading && (
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            {heading}
          </h2>
        )}
      </div>
    )
  }
)
