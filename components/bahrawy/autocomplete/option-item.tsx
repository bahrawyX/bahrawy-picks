'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { scaleIn, springSnappy } from '@/lib/motion'
import { CommandItem } from '@/components/ui/command'

interface OptionItemProps {
  label: string
  value: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
  selected?: boolean
  onSelect: (value: string) => void
}

export function OptionItem({
  label,
  value,
  description,
  icon,
  disabled,
  selected,
  onSelect,
}: OptionItemProps) {
  return (
    <CommandItem
      value={value}
      keywords={[label]}
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5',
        selected && 'bg-picks-fg/[0.04]'
      )}
    >
      {/* Icon */}
      {icon && (
        <span className="flex shrink-0 text-picks-fg/50 [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
      )}

      {/* Label + description */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm text-picks-fg/80">{label}</span>
        {description && (
          <span className="truncate text-xs text-picks-fg/35">{description}</span>
        )}
      </div>

      {/* Checkmark */}
      {selected && (
        <motion.span
          {...scaleIn}
          transition={springSnappy}
          className="flex shrink-0"
        >
          <Check className="h-4 w-4 text-picks-fg/60" />
        </motion.span>
      )}
    </CommandItem>
  )
}
