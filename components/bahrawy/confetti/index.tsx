'use client'

import { useRef, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ConfettiCanvas, type ConfettiCanvasRef } from './canvas'
import type { ConfettiConfig } from '@/lib/confetti-utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type { ConfettiConfig } from '@/lib/confetti-utils'
export type { ConfettiCanvasRef } from './canvas'

export interface ConfettiProps {
  children?: ReactNode
  className?: string
}

export interface UseConfettiReturn {
  ref: React.RefObject<ConfettiCanvasRef | null>
  fire: (overrides?: Partial<ConfettiConfig>) => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useConfetti(): UseConfettiReturn {
  const ref = useRef<ConfettiCanvasRef>(null)

  const fire = useCallback((overrides?: Partial<ConfettiConfig>) => {
    ref.current?.fire(overrides)
  }, [])

  return { ref, fire }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Confetti({ children, className }: ConfettiProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      <ConfettiCanvas />
    </div>
  )
}
