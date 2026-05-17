'use client'

import * as React from 'react'
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
} from 'libphonenumber-js/min'
import type { CountryCode } from 'libphonenumber-js/min'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFlagEmoji } from '@/lib/phone-utils'
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
  flag: string
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
      flag: getFlagEmoji(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
  return _countries
}

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
  const lastEmitted = React.useRef<string | undefined>(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

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
    [country, onChange]
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
    [display, onChange]
  )

  const countries = getCountryList()
  const dialCode = getCountryCallingCode(country)

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label="Select country"
            disabled={disabled}
            className={cn(
              'flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-sm text-white/80',
              'transition-colors duration-m3-enter ease-m3-enter',
              'hover:bg-white/[0.06]',
              'focus-visible:outline-none focus-visible:border-white/40 focus-visible:bg-white/[0.05]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error &&
                'border-rose-500/60 bg-rose-500/[0.04] focus-visible:border-rose-400'
            )}
          >
            <span className="text-base leading-none">
              {getFlagEmoji(country)}
            </span>
            <span className="text-white/50">+{dialCode}</span>
            <ChevronsUpDown className="ml-0.5 h-3.5 w-3.5 shrink-0 text-white/30" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((c) => (
                  <CommandItem
                    key={c.code}
                    value={`${c.name} ${c.code} +${c.dialCode}`}
                    onSelect={() => handleCountrySelect(c.code)}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-xs text-white/40">+{c.dialCode}</span>
                    {country === c.code && (
                      <Check className="ml-1 h-3.5 w-3.5 text-white/60" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

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
        className="flex-1"
      />
    </div>
  )
}
