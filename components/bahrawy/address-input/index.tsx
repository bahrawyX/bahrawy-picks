'use client'

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Navigation, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, tweenSmooth } from '@/lib/motion'
import {
  type AddressData,
  type NominatimResult,
  searchAddress,
  reverseGeocode,
  toAddressData,
} from './nominatim-utils'
import { AddressDropdown } from './address-dropdown'
import { SplitFields } from './split-fields'
import { MapPreview } from './map-preview'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AddressMode = 'full' | 'split'

export interface AddressInputProps {
  value?: AddressData
  onChange?: (data: AddressData) => void
  defaultValue?: AddressData
  mode?: AddressMode
  showMap?: boolean
  enableGeolocation?: boolean
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

const EMPTY_ADDRESS: AddressData = {
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AddressInput({
  value: controlledValue,
  onChange,
  defaultValue,
  mode = 'full',
  showMap = false,
  enableGeolocation = true,
  placeholder = 'Search for an address...',
  disabled = false,
  error,
  className,
}: AddressInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<AddressData>(
    defaultValue ?? EMPTY_ADDRESS,
  )
  const addressData = isControlled ? controlledValue : internalValue

  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [focused, setFocused] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // ---- Value management ----

  const updateValue = useCallback(
    (newVal: AddressData) => {
      if (!isControlled) setInternalValue(newVal)
      onChange?.(newVal)
    },
    [isControlled, onChange],
  )

  // ---- Search ----

  const doSearch = useCallback(async (query: string) => {
    // Cancel previous
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      const results = await searchAddress(query, controller.signal)
      setResults(results)
      setSelectedIndex(0)
      setShowDropdown(true)
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        setResults([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchQuery(val)
      clearTimeout(debounceRef.current)
      if (val.length >= 3) {
        debounceRef.current = setTimeout(() => doSearch(val), 400)
      } else {
        setResults([])
        setShowDropdown(false)
      }
    },
    [doSearch],
  )

  const handleSelect = useCallback(
    (result: NominatimResult) => {
      const data = toAddressData(result)
      updateValue(data)
      setSearchQuery(result.display_name)
      setShowDropdown(false)
    },
    [updateValue],
  )

  // ---- Geolocation ----

  const handleGeolocate = useCallback(async () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          )
          if (result) {
            const data = toAddressData(result)
            updateValue(data)
            setSearchQuery(result.display_name)
          }
        } catch {
          // noop
        } finally {
          setGeoLoading(false)
        }
      },
      () => {
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [updateValue])

  // ---- Keyboard ----

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || results.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelect(results[selectedIndex])
      } else if (e.key === 'Escape') {
        setShowDropdown(false)
      }
    },
    [showDropdown, results, selectedIndex, handleSelect],
  )

  // ---- Split fields change ----

  const handleSplitChange = useCallback(
    (partial: Partial<AddressData>) => {
      updateValue({ ...addressData, ...partial })
    },
    [addressData, updateValue],
  )

  // Close on outside click
  useEffect(() => {
    if (!showDropdown) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showDropdown])

  // Cleanup
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      clearTimeout(debounceRef.current)
    }
  }, [])

  const hasCoordinates = addressData.lat != null && addressData.lon != null

  return (
    <div ref={containerRef} className={cn('w-full space-y-3', className)}>
      {/* Search bar */}
      <div className="relative">
        <div
          className={cn(
            'flex items-center overflow-hidden rounded-lg border transition-colors',
            focused && !error ? 'border-white/30' : 'border-white/[0.08]',
            error && 'border-red-500/60',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <div className="flex items-center pl-3 text-white/30">
            <Search className="h-4 w-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25"
          />

          {/* Geolocation button */}
          {enableGeolocation && (
            <button
              type="button"
              onClick={handleGeolocate}
              disabled={disabled || geoLoading}
              className={cn(
                'mr-1.5 rounded-md p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60',
                geoLoading && 'animate-pulse',
              )}
              aria-label="Use current location"
            >
              <Navigation className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && (results.length > 0 || loading) && (
            <AddressDropdown
              results={results}
              loading={loading}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Split fields */}
      {mode === 'split' && (
        <SplitFields
          value={addressData}
          onChange={handleSplitChange}
          disabled={disabled}
        />
      )}

      {/* Map preview */}
      {showMap && hasCoordinates && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={tweenSmooth}
        >
          <MapPreview lat={addressData.lat!} lon={addressData.lon!} />
        </motion.div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={tweenSmooth}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
