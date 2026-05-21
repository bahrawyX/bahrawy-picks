'use client'

/**
 * <SearchInput />
 *
 * Standalone search input with an animated icon, clear button, optional
 * loading spinner, and a soft focus ring. Controlled OR uncontrolled — pass
 * `value`/`onChange` for controlled, or omit them and read via `onSearch`.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Fired after `debounceMs` of no typing with the current value. */
  onSearch?: (value: string) => void
  /** ms debounce before firing onSearch. Default 200. */
  debounceMs?: number
  placeholder?: string
  /** Show loading spinner instead of the clear button. */
  loading?: boolean
  /** Size of the input. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
  autoFocus?: boolean
  disabled?: boolean
}

const SIZE_CLASSES = {
  sm: 'h-9 text-sm px-3',
  md: 'h-10 text-sm px-3.5',
  lg: 'h-12 text-base px-4',
}

export function SearchInput({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  debounceMs = 200,
  placeholder = 'Search…',
  loading = false,
  size = 'md',
  className,
  autoFocus,
  disabled,
}: SearchInputProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const v = isControlled ? value : internal

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  // Debounced onSearch
  React.useEffect(() => {
    if (!onSearch) return
    const id = window.setTimeout(() => onSearch(v), debounceMs)
    return () => window.clearTimeout(id)
  }, [v, onSearch, debounceMs])

  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <label
      className={cn(
        'group inline-flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] transition-colors focus-within:border-white/30 focus-within:bg-white/[0.06]',
        SIZE_CLASSES[size],
        disabled && 'opacity-60',
        className,
      )}
    >
      <motion.span
        animate={{
          rotate: v.length > 0 ? -10 : 0,
          scale: v.length > 0 ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className="shrink-0 text-white/50 group-focus-within:text-white/80"
      >
        <Search className="h-4 w-4" />
      </motion.span>

      <input
        ref={inputRef}
        type="search"
        value={v}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />

      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <Loader2 className="h-4 w-4 animate-spin text-white/60" />
            </motion.span>
          ) : v.length > 0 ? (
            <motion.button
              key="clear"
              type="button"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 460, damping: 28 }}
              onClick={() => {
                setValue('')
                inputRef.current?.focus()
              }}
              aria-label="Clear"
              className="rounded-full p-0.5 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </span>
    </label>
  )
}
