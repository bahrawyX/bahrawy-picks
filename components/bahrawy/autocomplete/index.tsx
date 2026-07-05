'use client'

/**
 * <Autocomplete />
 *
 * Full-featured combobox supporting static, async, and creatable modes with
 * single or multi-select. Built headless on shadcn primitives (Popover +
 * Command). Framer Motion for all animations.
 *
 * @param options         — Static option array (Mode 1).
 * @param onSearch        — Async search callback (Mode 2).
 * @param creatable       — Allow creating new options (Mode 3).
 * @param multiple        — Enable multi-select with badge chips.
 */

import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  fadeUp,
  scaleIn,
  springGentle,
  springSnappy,
  tweenExit,
} from '@/lib/motion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandGroup,
  CommandList,
} from '@/components/ui/command'
import { Chip } from './chip'
import { OptionItem } from './option-item'
import { Loading } from './loading'
import { Empty } from './empty'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Option {
  label: string
  value: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
  group?: string
}

export interface AutocompleteProps {
  // data
  options?: Option[]
  onSearch?: (query: string) => Promise<Option[]>
  // mode
  multiple?: boolean
  creatable?: boolean
  onCreate?: (value: string) => void
  // selection
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  defaultValue?: string | string[]
  // behavior
  debounceMs?: number
  minChars?: number
  maxItems?: number
  clearable?: boolean
  // display
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  loadingMessage?: string
  // form
  disabled?: boolean
  error?: string
  name?: string
  // style
  className?: string
  popoverWidth?: 'trigger' | 'auto'
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalise(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

function groupOptions(opts: Option[]) {
  const ungrouped: Option[] = []
  const groups: Record<string, Option[]> = {}
  for (const o of opts) {
    if (o.group) {
      ;(groups[o.group] ??= []).push(o)
    } else {
      ungrouped.push(o)
    }
  }
  const sortedKeys = Object.keys(groups).sort()
  return { ungrouped, groups, sortedKeys }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Autocomplete({
  options: staticOptions,
  onSearch,
  multiple = false,
  creatable = false,
  onCreate,
  value: controlledValue,
  onChange,
  defaultValue,
  debounceMs = 300,
  minChars = 1,
  maxItems,
  clearable = false,
  placeholder = 'Select...',
  searchPlaceholder,
  emptyMessage = 'No results found',
  loadingMessage = 'Searching...',
  disabled = false,
  error,
  name,
  className,
  popoverWidth = 'trigger',
}: AutocompleteProps) {
  const instanceId = useId()
  const triggerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  // IME guard — Enter during a composition session confirms the
  // composition, not a selection (same pattern as mention-input).
  const composingRef = useRef(false)

  // ---- State ----
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [asyncResults, setAsyncResults] = useState<Option[]>([])
  // cmdk's highlighted option value (controlled so we can expose it as
  // aria-activedescendant).
  const [highlighted, setHighlighted] = useState('')
  const [activeDescendant, setActiveDescendant] = useState<string>()
  const [listboxId, setListboxId] = useState<string>()
  const [internalValue, setInternalValue] = useState<string[]>(
    normalise(defaultValue)
  )

  // Controlled vs uncontrolled
  const selected = controlledValue !== undefined
    ? normalise(controlledValue)
    : internalValue

  const setSelected = useCallback(
    (next: string[]) => {
      if (controlledValue === undefined) setInternalValue(next)
      if (onChange) {
        onChange(multiple ? next : (next[0] ?? ''))
      }
    },
    [controlledValue, onChange, multiple]
  )

  // ---- Debounced async search ----
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!onSearch) return
    if (search.length < minChars) {
      setAsyncResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await onSearch(search)
        setAsyncResults(results)
      } catch {
        setAsyncResults([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search, onSearch, debounceMs, minChars])

  // ---- Resolve display options ----
  const displayOptions = useMemo(() => {
    if (onSearch) return asyncResults

    if (!staticOptions) return []

    if (!search) return staticOptions

    const q = search.toLowerCase()
    return staticOptions.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q)
    )
  }, [staticOptions, onSearch, asyncResults, search])

  // ---- Creatable ----
  const showCreate = useMemo(() => {
    if (!creatable || !search.trim()) return false
    const q = search.trim().toLowerCase()
    return !displayOptions.some(
      (o) => o.label.toLowerCase() === q || o.value.toLowerCase() === q
    )
  }, [creatable, search, displayOptions])

  // ---- Grouped options ----
  const { ungrouped, groups, sortedKeys } = useMemo(
    () => groupOptions(displayOptions),
    [displayOptions]
  )
  const hasGroups = sortedKeys.length > 0

  // ---- Selection logic ----
  const isSelected = useCallback(
    (v: string) => selected.includes(v),
    [selected]
  )

  const atLimit = maxItems !== undefined && selected.length >= maxItems

  const handleSelect = useCallback(
    (value: string) => {
      if (multiple) {
        if (isSelected(value)) {
          setSelected(selected.filter((v) => v !== value))
        } else if (!atLimit) {
          setSelected([...selected, value])
        }
      } else {
        setSelected([value])
        setOpen(false)
        setSearch('')
      }
    },
    [multiple, isSelected, selected, setSelected, atLimit]
  )

  const handleCreate = useCallback(() => {
    const val = search.trim()
    if (!val) return
    onCreate?.(val)
    if (multiple) {
      if (!atLimit) {
        setSelected([...selected, val])
      }
    } else {
      setSelected([val])
      setOpen(false)
    }
    setSearch('')
  }, [search, onCreate, multiple, atLimit, selected, setSelected])

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelected([])
      setSearch('')
    },
    [setSelected]
  )

  const removeChip = useCallback(
    (value: string) => {
      setSelected(selected.filter((v) => v !== value))
    },
    [selected, setSelected]
  )

  // ---- ARIA plumbing ----
  // cmdk generates its own ids for the listbox and the highlighted
  // option, so read them from the DOM after each highlight change.
  useEffect(() => {
    if (!open) {
      setActiveDescendant(undefined)
      setListboxId(undefined)
      return
    }
    const list = listRef.current
    setListboxId(list?.id || `${instanceId}-list`)
    const active = list?.querySelector('[cmdk-item][aria-selected="true"]')
    setActiveDescendant(active?.id || undefined)
  }, [open, highlighted, displayOptions, showCreate, instanceId])

  // ---- Input keydown ----
  // ArrowUp / ArrowDown / Enter bubble up to the cmdk root (the whole
  // widget is wrapped in <Command>), which moves the highlight and
  // selects the highlighted option — including the inline multi input.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (composingRef.current || e.nativeEvent.isComposing) {
        e.stopPropagation()
        return
      }
      if (
        e.key === 'Backspace' &&
        !search &&
        multiple &&
        selected.length > 0
      ) {
        setSelected(selected.slice(0, -1))
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
        e.preventDefault()
        e.stopPropagation()
        setOpen(true)
        return
      }
      // Keep Home / End editing the text instead of jumping the list.
      if ((e.key === 'Home' || e.key === 'End') && search) {
        e.stopPropagation()
      }
    },
    [search, multiple, selected, setSelected, open]
  )

  // ---- Popover open/close ----
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen && !multiple) {
        setSearch('')
      }
      if (nextOpen) {
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    },
    [multiple]
  )

  // ---- Trigger keydown (single-select trigger is a div, not a button) ----
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget || open) return
      if (
        e.key === 'Enter' ||
        e.key === ' ' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp'
      ) {
        e.preventDefault()
        e.stopPropagation()
        handleOpenChange(true)
      }
    },
    [open, handleOpenChange]
  )

  // ---- Resolve selected labels ----
  const allOptions = staticOptions ?? asyncResults
  const selectedLabels = useMemo(() => {
    const map = new Map<string, Option>()
    for (const o of allOptions) map.set(o.value, o)
    return selected.map((v) => map.get(v) ?? { label: v, value: v })
  }, [allOptions, selected])

  const hasSelection = selected.length > 0
  const triggerLabel =
    !multiple && hasSelection ? selectedLabels[0]?.label : undefined

  // ---- Render options list ----
  const renderOptions = (opts: Option[]) =>
    opts.map((option) => (
      <motion.div key={option.value} {...fadeUp} transition={springGentle}>
        <OptionItem
          {...option}
          selected={isSelected(option.value)}
          onSelect={handleSelect}
        />
      </motion.div>
    ))

  return (
    <div className={cn('relative', className)}>
      {/* The cmdk root wraps the whole widget so keydown events from the
          inline multi-select input also reach cmdk's list navigation. */}
      <Command
        shouldFilter={!onSearch}
        value={highlighted}
        onValueChange={setHighlighted}
        className="overflow-visible bg-transparent"
      >
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild disabled={disabled}>
          <div
            ref={triggerRef}
            role={multiple ? undefined : 'combobox'}
            tabIndex={multiple ? -1 : 0}
            aria-expanded={multiple ? undefined : open}
            aria-controls={multiple ? undefined : (listboxId ?? `${instanceId}-list`)}
            aria-haspopup={multiple ? undefined : 'listbox'}
            aria-activedescendant={multiple ? undefined : activeDescendant}
            onKeyDown={multiple ? undefined : handleTriggerKeyDown}
            className={cn(
              'flex w-full min-h-[40px] cursor-pointer items-center rounded-lg border bg-picks-fg/[0.03] px-3 text-sm text-picks-fg/80 outline-none transition-colors',
              'hover:bg-picks-fg/[0.05] focus:border-picks-fg/20 focus:bg-picks-fg/[0.05]',
              error
                ? 'border-red-500/60 focus:border-red-500/80'
                : 'border-picks-fg/[0.08]',
              disabled && 'pointer-events-none opacity-50',
              multiple && 'flex-wrap gap-1.5 py-1.5'
            )}
          >
            {/* Multi-select chips */}
            {multiple && (
              <AnimatePresence mode="popLayout">
                {selectedLabels.map((opt) => (
                  <Chip
                    key={opt.value}
                    label={opt.label}
                    icon={opt.icon}
                    disabled={disabled}
                    onRemove={() => removeChip(opt.value)}
                  />
                ))}
              </AnimatePresence>
            )}

            {/* Input for multi / display for single */}
            {multiple ? (
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded={open}
                aria-controls={listboxId ?? `${instanceId}-list`}
                aria-haspopup="listbox"
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  if (!open) setOpen(true)
                }}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => {
                  composingRef.current = true
                }}
                onCompositionEnd={() => {
                  composingRef.current = false
                }}
                placeholder={hasSelection ? '' : placeholder}
                disabled={disabled}
                className="min-w-[60px] flex-1 bg-transparent text-sm text-picks-fg/80 outline-none placeholder:text-picks-fg/25"
              />
            ) : (
              <span
                className={cn(
                  'flex-1 truncate text-left',
                  !triggerLabel && 'text-picks-fg/25'
                )}
              >
                {triggerLabel ?? placeholder}
              </span>
            )}

            {/* Right icons */}
            <div className="ml-auto flex shrink-0 items-center gap-1 pl-2">
              <AnimatePresence>
                {clearable && hasSelection && !disabled && (
                  <motion.button
                    type="button"
                    {...scaleIn}
                    exit={{ ...scaleIn.exit, transition: tweenExit }}
                    transition={springSnappy}
                    onClick={handleClear}
                    className="flex h-5 w-5 items-center justify-center rounded-sm text-picks-fg/30 transition-colors hover:text-picks-fg/60"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-picks-fg/25 transition-transform',
                  open && 'rotate-180'
                )}
              />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          id={`${instanceId}-list`}
          className="p-0 border-picks-fg/[0.08]"
          align="start"
          style={
            popoverWidth === 'trigger'
              ? { width: triggerRef.current?.offsetWidth ?? 'auto' }
              : undefined
          }
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            inputRef.current?.focus()
          }}
        >
          {/* Search input — single select shows it in popover, multi shows inline */}
          {!multiple && (
            <div className="flex items-center border-b border-picks-fg/[0.06] px-3">
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded={open}
                aria-controls={listboxId ?? `${instanceId}-list`}
                aria-haspopup="listbox"
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => {
                  composingRef.current = true
                }}
                onCompositionEnd={() => {
                  composingRef.current = false
                }}
                placeholder={searchPlaceholder ?? 'Search...'}
                className="flex h-10 w-full bg-transparent py-3 text-sm text-picks-fg/80 outline-none placeholder:text-picks-fg/25"
              />
            </div>
          )}

          <CommandList ref={listRef}>
              {/* Max items message */}
              {atLimit && (
                <div className="py-3 text-center text-xs text-picks-fg/35">
                  Max {maxItems} items selected
                </div>
              )}

              {/* Loading */}
              {isLoading && <Loading message={loadingMessage} />}

              {/* Async idle — prompt to type */}
              {!isLoading &&
                onSearch &&
                search.length < minChars &&
                displayOptions.length === 0 && (
                <div className="py-6 text-center text-sm text-picks-fg/25">
                  Type to search...
                </div>
              )}

              {/* Empty — hide in async mode when user hasn't typed yet */}
              {!isLoading &&
                displayOptions.length === 0 &&
                !showCreate &&
                !(onSearch && search.length < minChars) && (
                <Empty message={emptyMessage} />
              )}

              {/* Creatable */}
              <AnimatePresence>
                {showCreate && (
                  <motion.div {...fadeUp} transition={springSnappy}>
                    <button
                      type="button"
                      onClick={handleCreate}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-picks-fg/70 transition-colors hover:bg-picks-fg/[0.06]"
                    >
                      <Plus className="h-4 w-4 text-picks-fg/40" />
                      Create &ldquo;{search.trim()}&rdquo;
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options */}
              {!isLoading && (
                <>
                  {hasGroups ? (
                    <>
                      {ungrouped.length > 0 && (
                        <CommandGroup>{renderOptions(ungrouped)}</CommandGroup>
                      )}
                      {sortedKeys.map((key) => (
                        <CommandGroup key={key} heading={key}>
                          {renderOptions(groups[key])}
                        </CommandGroup>
                      ))}
                    </>
                  ) : (
                    <CommandGroup>{renderOptions(displayOptions)}</CommandGroup>
                  )}
                </>
              )}
            </CommandList>
        </PopoverContent>
      </Popover>
      </Command>

      {/* Hidden input for forms */}
      {name && (
        <>
          {selected.map((v) => (
            <input key={v} type="hidden" name={name} value={v} />
          ))}
        </>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            {...fadeUp}
            transition={springSnappy}
            className="mt-1.5 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
