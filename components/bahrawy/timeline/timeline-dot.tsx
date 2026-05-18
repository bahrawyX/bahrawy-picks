'use client'

import { type ReactNode } from 'react'
import { Check, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type EventStatus = 'completed' | 'current' | 'upcoming' | 'error' | 'warning'

interface TimelineDotProps {
  status?: EventStatus
  icon?: ReactNode
  iconBackground?: string
  color?: string
  delay?: number
}

const statusConfig: Record<EventStatus, {
  bg: string
  ring: string
  icon: ReactNode
}> = {
  completed: {
    bg: 'bg-emerald-500',
    ring: 'ring-emerald-500/20',
    icon: <Check className="h-3 w-3 text-white" strokeWidth={3} />,
  },
  current: {
    bg: 'bg-white',
    ring: 'ring-white/20',
    icon: null,
  },
  upcoming: {
    bg: 'bg-transparent',
    ring: 'ring-white/10',
    icon: null,
  },
  error: {
    bg: 'bg-red-500',
    ring: 'ring-red-500/20',
    icon: <X className="h-3 w-3 text-white" strokeWidth={3} />,
  },
  warning: {
    bg: 'bg-amber-500',
    ring: 'ring-amber-500/20',
    icon: <AlertTriangle className="h-3 w-3 text-white" strokeWidth={2.5} />,
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
  const bgClass = iconBackground ?? color ?? config.bg
  const isUpcoming = status === 'upcoming'

  return (
    <div
      className="relative z-10 flex items-center justify-center animate-tl-scale-in"
      style={{ animationDelay: `${Math.round(delay * 1000)}ms` }}
    >
      {/* Pulse ring for current — pure CSS for smooth infinite loop */}
      {status === 'current' && (
        <div
          className={cn(
            'absolute h-7 w-7 rounded-full animate-tl-pulse-ring',
            color ?? 'bg-white/40',
          )}
        />
      )}

      {/* Dot */}
      <div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full ring-4',
          isUpcoming
            ? 'border-2 border-white/[0.15] bg-white/[0.06] ring-white/[0.04]'
            : bgClass,
          !isUpcoming && config.ring,
          status === 'error' && 'animate-tl-shake'
        )}
        style={status === 'error' && delay > 0 ? { animationDelay: `${Math.round((delay + 0.1) * 1000)}ms` } : undefined}
      >
        {icon ?? config.icon}
      </div>
    </div>
  )
}
