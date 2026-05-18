'use client'

import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, tweenExit, tweenSmooth } from '@/lib/motion'
import { Badge } from '@/components/ui/badge'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TagsInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  defaultValue?: string[]
  placeholder?: string
  maxTags?: number
  allowDuplicates?: boolean
  delimiter?: string | string[]
  suggestions?: string[]
  validate?: (tag: string) => boolean | string
  disabled?: boolean
  error?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TagsInput({
  value: controlledValue,
  onChange,
  defaultValue,
  placeholder = 'Add a tag…',
  maxTags,
  allowDuplicates = false,
  delimiter = [',', 'Enter'],
  suggestions,
  validate,
  disabled = false,
  error,
  className,
}: TagsInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue ?? [])
  const tags = isControlled ? controlledValue : internalTags

  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [highlightLast, setHighlightLast] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const delimiters = useMemo(
    () => (Array.isArray(delimiter) ? delimiter : [delimiter]),
    [delimiter],
  )

  const reachedMax = maxTags !== undefined && tags.length >= maxTags

  // ---- Tag management ----

  const updateTags = useCallback(
    (newTags: string[]) => {
      if (!isControlled) setInternalTags(newTags)
      onChange?.(newTags)
    },
    [isControlled, onChange],
  )

  const addTag = useCallback(
    (raw: string) => {
      const tag = raw.trim()
      if (!tag) return

      // Max check
      if (reachedMax) {
        setShaking(true)
        setTimeout(() => setShaking(false), 500)
        return
      }

      // Duplicate check
      if (!allowDuplicates && tags.includes(tag)) {
        setShaking(true)
        setTimeout(() => setShaking(false), 500)
        return
      }

      // Validation
      if (validate) {
        const result = validate(tag)
        if (result !== true) {
          setValidationError(typeof result === 'string' ? result : 'Invalid tag')
          setShaking(true)
          setTimeout(() => {
            setShaking(false)
            setValidationError(null)
          }, 1500)
          return
        }
      }

      updateTags([...tags, tag])
      setInputValue('')
      setValidationError(null)
    },
    [tags, reachedMax, allowDuplicates, validate, updateTags],
  )

  const removeTag = useCallback(
    (index: number) => {
      if (disabled) return
      updateTags(tags.filter((_, i) => i !== index))
    },
    [tags, disabled, updateTags],
  )

  // ---- Input handlers ----

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Check delimiter keys
    if (delimiters.includes(e.key)) {
      e.preventDefault()
      if (showSuggestions && filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[selectedSuggestion])
        setShowSuggestions(false)
      } else {
        addTag(inputValue)
      }
      return
    }

    // Backspace on empty removes last tag
    if (e.key === 'Backspace' && !inputValue) {
      e.preventDefault()
      if (highlightLast) {
        removeTag(tags.length - 1)
        setHighlightLast(false)
      } else if (tags.length > 0) {
        setHighlightLast(true)
      }
      return
    }

    // Arrow navigation for suggestions
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestion((p) => Math.min(p + 1, filteredSuggestions.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestion((p) => Math.max(p - 1, 0))
        return
      }
    }

    // Escape closes suggestions
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }

    // Any other key clears highlight
    setHighlightLast(false)
  }

  const handleInputChange = (val: string) => {
    // Check for delimiter characters in pasted/typed text
    let remaining = val
    for (const d of delimiters) {
      if (d !== 'Enter' && remaining.includes(d)) {
        const parts = remaining.split(d)
        for (let i = 0; i < parts.length - 1; i++) {
          addTag(parts[i])
        }
        remaining = parts[parts.length - 1]
      }
    }
    setInputValue(remaining)
    setHighlightLast(false)

    // Show suggestions
    if (suggestions && remaining.trim()) {
      setShowSuggestions(true)
      setSelectedSuggestion(0)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleContainerClick = (e: MouseEvent) => {
    if (disabled) return
    // Focus input when clicking the container background
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('[data-tags-wrapper]')) {
      inputRef.current?.focus()
    }
  }

  // ---- Suggestions ----

  const filteredSuggestions = useMemo(() => {
    if (!suggestions || !inputValue.trim()) return []
    const lower = inputValue.toLowerCase()
    return suggestions
      .filter((s) => s.toLowerCase().includes(lower))
      .filter((s) => allowDuplicates || !tags.includes(s))
      .slice(0, 8)
  }, [suggestions, inputValue, tags, allowDuplicates])

  // Close suggestions on blur
  useEffect(() => {
    if (!focused) {
      // Delay to allow click on suggestion
      const t = setTimeout(() => setShowSuggestions(false), 150)
      return () => clearTimeout(t)
    }
  }, [focused])

  const displayError = validationError ?? error

  return (
    <div className={cn('w-full', className)}>
      {/* Container */}
      <motion.div
        ref={containerRef}
        onClick={handleContainerClick}
        animate={shaking ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
        transition={
          shaking
            ? { type: 'tween' as const, duration: 0.4, ease: 'easeInOut' }
            : springSnappy
        }
        className={cn(
          'relative flex min-h-[42px] cursor-text flex-wrap items-center gap-1.5 rounded-lg border bg-white/[0.03] px-3 py-1.5 transition-colors',
          focused && !displayError ? 'border-white/30' : 'border-white/[0.08]',
          displayError && 'border-red-500/60',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5" data-tags-wrapper>
          <AnimatePresence mode="popLayout">
            {tags.map((tag, index) => (
              <motion.div
                key={`${tag}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: highlightLast && index === tags.length - 1 ? 1.08 : 1,
                }}
                exit={{ opacity: 0, scale: 0, width: 0 }}
                transition={springSnappy}
                className="origin-center"
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    'flex items-center gap-1 whitespace-nowrap text-xs',
                    highlightLast && index === tags.length - 1 && 'ring-2 ring-white/20',
                  )}
                >
                  {tag}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTag(index)
                      }}
                      className="ml-0.5 rounded-sm outline-none transition-colors hover:text-white"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Input */}
          {!reachedMax && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={disabled}
              placeholder={tags.length === 0 ? placeholder : ''}
              className="min-w-[140px] flex-1 border-none bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/25"
            />
          )}

          {reachedMax && (
            <span className="py-1 text-xs text-white/25">
              Max {maxTags} tags
            </span>
          )}
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={springSnappy}
              className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/[0.08] bg-neutral-900/95 p-1 shadow-xl backdrop-blur-md"
            >
              {filteredSuggestions.map((suggestion, i) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    addTag(suggestion)
                    setShowSuggestions(false)
                    inputRef.current?.focus()
                  }}
                  className={cn(
                    'flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm text-white/70 transition-colors',
                    i === selectedSuggestion
                      ? 'bg-white/[0.08] text-white'
                      : 'hover:bg-white/[0.04]',
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {displayError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={tweenSmooth}
            className="mt-1.5 text-sm text-red-400"
          >
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
