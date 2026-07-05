'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import { type CurrencyInfo, currencies } from '@/lib/currency-data'

interface CurrencySelectorProps {
  value: string
  onChange: (code: string) => void
  allowedCurrencies?: string[]
  disabled?: boolean
}

export function CurrencySelector({
  value,
  onChange,
  allowedCurrencies,
  disabled,
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const currencyList = useMemo(() => {
    let list = currencies
    if (allowedCurrencies?.length) {
      list = currencies.filter((c) => allowedCurrencies.includes(c.code))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.symbol.includes(q),
      )
    }
    return list
  }, [allowedCurrencies, search])

  const selected = currencies.find((c) => c.code === value)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setOpen((o) => !o)
            setSearch('')
          }
        }}
        disabled={disabled}
        className={cn(
          'flex items-center gap-1.5 border-r border-picks-fg/[0.08] bg-transparent px-3 py-2.5 text-sm transition-colors hover:bg-picks-fg/[0.06]',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {selected && (
          <span className="text-base leading-none">{selected.flag}</span>
        )}
        <span className="font-medium text-picks-fg">{value}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-picks-fg/40 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={springSnappy}
            className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-lg border border-picks-fg/[0.08] bg-picks-panel/95 shadow-xl backdrop-blur-md"
          >
            {/* Search */}
            <div className="border-b border-picks-fg/[0.08] p-2">
              <div className="flex items-center gap-2 rounded-md bg-picks-fg/[0.04] px-2.5 py-1.5">
                <Search className="h-3.5 w-3.5 text-picks-fg/30" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search currencies..."
                  className="w-full bg-transparent text-sm text-picks-fg outline-none placeholder:text-picks-fg/25"
                />
              </div>
            </div>

            {/* List — overscroll-contain stops the parent page scroll;
                data-lenis-prevent stops the Lenis smooth-scroll provider
                from swallowing the wheel events inside the dropdown. */}
            <div
              data-lenis-prevent
              className="max-h-60 overflow-y-auto overscroll-contain p-1"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(var(--picks-fg-rgb) / 0.18) transparent',
              }}
            >
              {currencyList.length === 0 ? (
                <p className="px-3 py-4 text-center text-sm text-picks-fg/30">
                  No currencies found
                </p>
              ) : (
                currencyList.map((c) => (
                  <CurrencyOption
                    key={c.code}
                    currency={c}
                    isSelected={c.code === value}
                    onSelect={() => {
                      onChange(c.code)
                      setOpen(false)
                      setSearch('')
                    }}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CurrencyOption({
  currency,
  isSelected,
  onSelect,
}: {
  currency: CurrencyInfo
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
        isSelected
          ? 'bg-picks-fg/[0.08] text-picks-fg'
          : 'text-picks-fg/70 hover:bg-picks-fg/[0.04] hover:text-picks-fg',
      )}
    >
      <span className="text-base leading-none">{currency.flag}</span>
      <span className="font-medium">{currency.code}</span>
      <span className="truncate text-picks-fg/40">{currency.name}</span>
      <span className="ml-auto text-picks-fg/30">{currency.symbol}</span>
    </button>
  )
}
