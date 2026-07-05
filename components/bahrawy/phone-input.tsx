'use client'

/**
 * PhoneInput — International phone number input with country selector.
 *
 * @prop value           — E.164 phone string (e.g. "+12025551234") or undefined (controlled)
 * @prop defaultValue    — Initial E.164 phone string (uncontrolled mode)
 * @prop onChange        — Called with the E.164 string or undefined when cleared
 * @prop defaultCountry  — ISO 3166-1 alpha-2 country code used on mount (default "US")
 * @prop disabled        — Disables both the country selector and the text input
 * @prop label           — Visible label rendered above, linked via htmlFor
 * @prop error           — `true` applies error styling; a string also renders
 *                         the message and wires aria-describedby
 * @prop placeholder     — Placeholder text for the number input
 * @prop id              — HTML id forwarded to the underlying input element
 * @prop className       — Additional classes applied to the root wrapper div
 * @prop name            — Renders a hidden input carrying the E.164 value for
 *                         native form submission
 *
 * Uses libphonenumber-js for formatting (AsYouType) and E.164 output,
 * Intl.DisplayNames for zero-cost country names, and flagcdn for flag images.
 * Integrates with React Hook Form via a value/onChange (Controller) interface,
 * or works uncontrolled with `defaultValue` + `name`.
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
  value?: string | undefined
  onChange?: (value: string | undefined) => void
  /** Initial E.164 value for uncontrolled usage. Ignored when `value` is set. */
  defaultValue?: string
  defaultCountry?: CountryCode
  disabled?: boolean
  /** Visible label rendered above the field, linked via htmlFor. */
  label?: string
  /** `true` styles the field; a string also renders the error message. */
  error?: boolean | string
  placeholder?: string
  id?: string
  className?: string
  /** When set, a hidden input submits the E.164 value under this name. */
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

/** Parse an E.164 string into its display form + country, or null. */
function parseInitial(
  e164: string | undefined,
): { country: CountryCode | undefined; display: string } | null {
  if (!e164) return null
  try {
    const parsed = parsePhoneNumber(e164)
    if (parsed) {
      return { country: parsed.country, display: parsed.formatNational() }
    }
  } catch {
    // invalid value — fall through
  }
  return null
}

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
  defaultValue,
  defaultCountry = 'US',
  disabled = false,
  label,
  error = false,
  placeholder = 'Enter phone number',
  id,
  className,
  name,
}: PhoneInputProps) {
  const initial = React.useMemo(
    () => parseInitial(value ?? defaultValue),
    // Intentionally computed once — later `value` changes flow through the
    // sync effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [country, setCountry] = React.useState<CountryCode>(
    initial?.country ?? defaultCountry,
  )
  const [display, setDisplay] = React.useState(initial?.display ?? '')
  // Current E.164 value — feeds the hidden form input in uncontrolled mode.
  const [e164, setE164] = React.useState<string | undefined>(
    value ?? defaultValue,
  )
  const [open, setOpen] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const lastEmitted = React.useRef<string | undefined>(value ?? defaultValue)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const autoId = React.useId()
  const inputId = id ?? (label || name ? `phone-input-${autoId}` : undefined)
  const errorMessage = typeof error === 'string' ? error : undefined
  const errorId = errorMessage ? `phone-input-${autoId}-error` : undefined

  const emit = React.useCallback(
    (next: string | undefined) => {
      lastEmitted.current = next
      setE164(next)
      onChange?.(next)
    },
    [onChange],
  )

  /* ---- Sync external value (controlled mode) ---- */
  React.useEffect(() => {
    if (value === lastEmitted.current) return
    lastEmitted.current = value
    setE164(value)
    if (!value) {
      setDisplay('')
      return
    }
    const parsed = parseInitial(value)
    if (parsed) {
      if (parsed.country) setCountry(parsed.country)
      setDisplay(parsed.display)
    }
  }, [value])

  /* ---- Handlers ---- */
  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      if (!raw) {
        setDisplay('')
        emit(undefined)
        return
      }
      const formatter = new AsYouType(country)
      const formatted = formatter.input(raw)
      setDisplay(formatted)

      const phone = formatter.getNumber()
      emit(phone?.number as string | undefined)
    },
    [country, emit],
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
        emit(phone?.number as string | undefined)
      }

      requestAnimationFrame(() => inputRef.current?.focus())
    },
    [display, emit],
  )

  const countries = getCountryList()
  const dialCode = getCountryCallingCode(country)
  const countryName =
    new Intl.DisplayNames(['en'], { type: 'region' }).of(country) ?? country

  return (
    <div className={cn('w-full', className)}>
      {/* ---- Label ---- */}
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-picks-fg/70"
        >
          {label}
        </label>
      )}

      <div className="relative flex gap-2">
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
                'flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800 bg-transparent px-2.5 text-sm text-picks-fg/80',
                'transition-colors',
                'hover:bg-picks-fg/[0.06]',
                'focus-visible:outline-none focus-visible:border-zinc-600 focus-visible:bg-picks-fg/[0.05]',
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
            id={inputId}
            type="tel"
            value={display}
            onChange={handleInput}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full"
          />
        </div>
      </div>

      {/* ---- Hidden form value (E.164) ---- */}
      {name && <input type="hidden" name={name} value={e164 ?? ''} />}

      {/* ---- Error message ---- */}
      {errorMessage && (
        <p id={errorId} className="mt-1.5 text-sm text-rose-400">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
