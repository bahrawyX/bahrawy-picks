'use client'

import { usePathname } from 'next/navigation'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: ReactNode
  /**
   * 'pathname' replays the animation on every URL change.
   * 'segment' replays only when the first path segment changes
   * (so /components/foo → /components/bar does NOT trigger).
   */
  scope?: 'pathname' | 'segment'
  /** Skip the initial mount animation. */
  skipFirst?: boolean
  className?: string
}

export function PageTransition({
  children,
  scope = 'pathname',
  skipFirst = false,
  className,
}: PageTransitionProps) {
  const pathname = usePathname()
  const key =
    scope === 'segment' ? pathname.split('/')[1] || '_root' : pathname

  const firstRef = useRef(true)
  const isFirst = firstRef.current
  firstRef.current = false

  const animate = !(skipFirst && isFirst)

  return (
    <div
      key={key}
      className={cn(animate && 'animate-page-in', className)}
    >
      {children}
    </div>
  )
}
