'use client'

/**
 * PhoneInput — International phone number input with country selector.
 *
 * @prop value           — E.164 phone string (e.g. "+12025551234") or undefined
 * @prop onChange        — Called with the E.164 string or undefined when cleared
 * @prop defaultCountry  — ISO 3166-1 alpha-2 country code used on mount (default "US")
 * @prop disabled        — Disables both the country selector and the text input
 * @prop error           — Applies error styling (rose border / ring)
 * @prop placeholder     — Placeholder text for the number input
 * @prop id              — HTML id forwarded to the underlying input element
 * @prop className       — Additional classes applied to the root wrapper div
 * @prop name            — HTML name forwarded to the underlying input element
 *
 * Uses libphonenumber-js for formatting (AsYouType) and E.164 output,
 * Intl.DisplayNames for zero-cost country names, and flagcdn for flag images.
 * Integrates with React Hook Form via a value/onChange (Controller) interface.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
} from 'libphonenumber-js/min'
import type { CountryCode } from 'libphonenumber-js/min'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFlagUrl } from '@/lib/phone-utils'
import {
  springSnappy,
  springGentle,
  fadeUp,
  staggerContainer,
} from '@/lib/motion'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PhoneInputProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  defaultCountry?: CountryCode
  disabled?: boolean
  error?: boolean
  placeholder?: string
  id?: string
  className?: string
  name?: string
}

interface CountryEntry {
  code: CountryCode
  name: string
  dialCode: string
}

/* ------------------------------------------------------------------ */
/*  Country list (lazy-built, cached)                                  */
/* ------------------------------------------------------------------ */

let _countries: CountryEntry[] | null = null

function getCountryList(): CountryEntry[] {
  if (_countries) return _countries
  const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
  _countries = getCountries()
    .map((code) => ({
      code,
      name: displayNames.of(code) ?? code,
      dialCode: getCountryCallingCode(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
  return _countries
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PhoneInput({
  value,
  onChange,
  defaultCountry = 'US',
  disabled = false,
  error = false,
  placeholder = 'Enter phone number',
  id,
  className,
  name,
}: PhoneInputProps) {
  const [country, setCountry] = React.useState<CountryCode>(defaultCountry)
  const [display, setDisplay] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const lastEmitted = React.useRef<string | undefined>(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  /* ---- Sync external value ---- */
  React.useEffect(() => {
    if (value === lastEmitted.current) return
    lastEmitted.current = value
    if (!value) {
      setDisplay('')
      return
    }
    try {
      const parsed = parsePhoneNumber(value)
      if (parsed) {
        if (parsed.country) setCountry(parsed.country)
        setDisplay(parsed.formatNational())
      }
    } catch {
      // invalid value — leave display as-is
    }
  }, [value])

  /* ---- Handlers ---- */
  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      if (!raw) {
        setDisplay('')
        lastEmitted.current = undefined
        onChange(undefined)
        return
      }
      const formatter = new AsYouType(country)
      const formatted = formatter.input(raw)
      setDisplay(formatted)

      const phone = formatter.getNumber()
      const e164 = phone?.number as string | undefined
      lastEmitted.current = e164
      onChange(e164)
    },
    [country, onChange],
  )

  const handleCountrySelect = React.useCallback(
    (newCountry: CountryCode) => {
      setCountry(newCountry)
      setOpen(false)

      if (display) {
        const digits = display.replace(/\D/g, '')
        const formatter = new AsYouType(newCountry)
        const formatted = formatter.input(digits)
        setDisplay(formatted)

        const phone = formatter.getNumber()
        const e164 = phone?.number as string | undefined
        lastEmitted.current = e164
        onChange(e164)
      }

      requestAnimationFrame(() => inputRef.current?.focus())
    },
    [display, onChange],
  )

  const countries = getCountryList()
  const dialCode = getCountryCallingCode(country)
  const countryName =
    new Intl.DisplayNames(['en'], { type: 'region' }).of(country) ?? country

  return (
    <div className={cn('relative flex gap-2', className)}>
      {/* ---- Country selector ---- */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label="Select country"
            disabled={disabled}
            className={cn(
              'flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800 bg-transparent px-2.5 text-sm text-white/80',
              'transition-colors',
              'hover:bg-white/[0.06]',
              'focus-visible:outline-none focus-visible:border-zinc-600 focus-visible:bg-white/[0.05]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error &&
                'border-rose-500/60 bg-rose-500/[0.04] focus-visible:border-rose-400',
            )}
          >
            <motion.img
              src={getFlagUrl(country)}
              alt={countryName}
              width={24}
              height={18}
              className="rounded-[2px]"
              whileHover={{ scale: 1.1 }}
              transition={springSnappy}
            />
            <span className="text-zinc-500">+{dialCode}</span>
            <ChevronsUpDown className="ml-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <AnimatePresence>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {countries.map((c) => (
                      <motion.div
                        key={c.code}
                        variants={fadeUp}
                        transition={springGentle}
                      >
                        <CommandItem
                          value={`${c.name} ${c.code} +${c.dialCode}`}
                          onSelect={() => handleCountrySelect(c.code)}
                        >
                          <img
                            src={getFlagUrl(c.code)}
                            alt={c.name}
                            width={24}
                            height={18}
                            className="rounded-[2px]"
                          />
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="text-xs text-zinc-500">
                            +{c.dialCode}
                          </span>
                          {country === c.code && (
                            <Check className="ml-1 h-3.5 w-3.5 text-zinc-400" />
                          )}
                        </CommandItem>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* ---- Number input with animated focus ring ---- */}
      <div className="relative flex-1">
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className={cn(
                'pointer-events-none absolute -inset-px rounded-md border',
                error ? 'border-rose-500/60' : 'border-zinc-600',
              )}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={springGentle}
            />
          )}
        </AnimatePresence>

        <Input
          ref={inputRef}
          id={id}
          name={name}
          type="tel"
          value={display}
          onChange={handleInput}
          disabled={disabled}
          error={error}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full"
        />
      </div>
    </div>
  )
}
