'use client'

import { type ReactNode } from 'react'
import { Check, X, AlertTriangle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type EventStatus = 'completed' | 'current' | 'upcoming' | 'error' | 'warning'

interface TimelineDotProps {
  status?: EventStatus
  icon?: ReactNode
  iconBackground?: string
  color?: string
  delay?: number
}

// Per-status: hairline border tint + icon color + the default icon node.
// Background stays a vibrancy white/[0.04] for all variants so the colored
// border + icon do the differentiation work (no fully filled bg pills).
const statusConfig: Record<EventStatus, {
  border: string
  iconColor: string
  icon: ReactNode
}> = {
  completed: {
    border: 'border-emerald-400/30',
    iconColor: 'text-emerald-300',
    icon: <Check className="h-3.5 w-3.5" strokeWidth={2.25} />,
  },
  current: {
    border: 'border-picks-fg/[0.18]',
    iconColor: 'text-picks-fg/85',
    icon: <Circle className="h-2 w-2 fill-current" strokeWidth={0} />,
  },
  upcoming: {
    border: 'border-picks-fg/[0.08]',
    iconColor: 'text-picks-fg/40',
    icon: null,
  },
  error: {
    border: 'border-rose-400/30',
    iconColor: 'text-rose-300',
    icon: <X className="h-3.5 w-3.5" strokeWidth={2.25} />,
  },
  warning: {
    border: 'border-amber-400/30',
    iconColor: 'text-amber-300',
    icon: <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.25} />,
  },
}

export function TimelineDot({
  status = 'completed',
  icon,
  iconBackground,
  color,
  delay = 0,
}: TimelineDotProps) {
  const config = statusConfig[status]
  // Caller-provided color overrides the per-status icon color (border stays).
  const iconColorStyle = color ? { color } : undefined

  return (
    <div
      className="relative z-10 flex items-center justify-center animate-tl-scale-in"
      style={{ animationDelay: `${Math.round(delay * 1000)}ms` }}
    >
      {/* Pulse ring for current — hairline, no color flash */}
      {status === 'current' && (
        <div
          className="absolute h-8 w-8 rounded-full border border-picks-fg/[0.12] animate-tl-pulse-ring"
        />
      )}

      {/* Icon container — 32px perfect circle, vibrancy fill, hairline border,
          subtle depth shadow. Variant tint lives on the border + the icon. */}
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md',
          'bg-picks-fg/[0.04]',
          config.border,
          config.iconColor,
          status === 'error' && 'animate-tl-shake',
        )}
        style={{
          boxShadow: '0 4px 12px -4px rgba(0,0,0,0.4)',
          background: iconBackground,
          ...(status === 'error' && delay > 0
            ? { animationDelay: `${Math.round((delay + 0.1) * 1000)}ms` }
            : {}),
        }}
      >
        <span className="inline-flex items-center justify-center" style={iconColorStyle}>
          {icon ?? config.icon}
        </span>
      </div>
    </div>
  )
}
