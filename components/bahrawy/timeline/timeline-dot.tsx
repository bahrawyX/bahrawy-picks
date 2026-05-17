'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
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
      {/* Pulse ring for current */}
      {status === 'current' && (
        <motion.div
          className={cn('absolute h-8 w-8 rounded-full', color ?? 'bg-white/40')}
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Dot */}
      <motion.div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full ring-4',
          isUpcoming ? 'border-2 border-white/20 bg-transparent ring-white/[0.04]' : bgClass,
          !isUpcoming && config.ring
        )}
        // Error shake on mount
        {...(status === 'error' && {
          animate: { x: [0, -3, 3, -3, 3, 0] },
          transition: { type: 'tween', duration: 0.4, ease: 'easeInOut', delay: delay + 0.1 },
        })}
      >
        {icon ?? config.icon}
      </motion.div>
    </div>
  )
}
