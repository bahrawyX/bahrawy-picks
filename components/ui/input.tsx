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
          'flex h-9 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-1 text-base text-white shadow-sm transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white',
          'placeholder:text-zinc-500',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-600',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[error=true]:border-rose-500/60 data-[error=true]:ring-rose-500/30',
          'md:text-sm',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
