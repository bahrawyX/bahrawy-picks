'use client'

import { cn } from '@/lib/utils'
import type { AddressData } from './nominatim-utils'

interface SplitFieldsProps {
  value: AddressData
  onChange: (data: Partial<AddressData>) => void
  disabled?: boolean
}

export function SplitFields({ value, onChange, disabled }: SplitFieldsProps) {
  const inputClass = cn(
    'w-full rounded-lg border border-picks-fg/[0.08] bg-picks-fg/[0.03] px-3 py-2.5 text-sm text-picks-fg outline-none transition-colors placeholder:text-picks-fg/25 focus:border-picks-fg/30',
    disabled && 'cursor-not-allowed opacity-50',
  )

  return (
    <div className="grid gap-3">
      {/* Street */}
      <input
        type="text"
        value={value.street}
        onChange={(e) => onChange({ street: e.target.value })}
        placeholder="Street address"
        disabled={disabled}
        className={inputClass}
      />

      {/* City + State */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={value.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="City"
          disabled={disabled}
          className={inputClass}
        />
        <input
          type="text"
          value={value.state}
          onChange={(e) => onChange({ state: e.target.value })}
          placeholder="State / Province"
          disabled={disabled}
          className={inputClass}
        />
      </div>

      {/* Zip + Country */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={value.zip}
          onChange={(e) => onChange({ zip: e.target.value })}
          placeholder="ZIP / Postal code"
          disabled={disabled}
          className={inputClass}
        />
        <input
          type="text"
          value={value.country}
          onChange={(e) => onChange({ country: e.target.value })}
          placeholder="Country"
          disabled={disabled}
          className={inputClass}
        />
      </div>
    </div>
  )
}
