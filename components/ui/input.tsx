import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-error={error || undefined}
        className={cn(
          'flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30',
          'transition-colors duration-m3-enter ease-m3-enter',
          'focus-visible:outline-none focus-visible:border-white/40 focus-visible:bg-white/[0.05]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[error=true]:border-rose-500/60 data-[error=true]:bg-rose-500/[0.04] data-[error=true]:focus-visible:border-rose-400',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
