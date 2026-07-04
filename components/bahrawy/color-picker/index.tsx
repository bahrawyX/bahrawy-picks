'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pipette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, tweenSmooth } from '@/lib/motion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  rgbToHsl,
  isValidHex,
  formatColor,
  MATERIAL_SWATCHES,
} from '@/lib/color-utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ColorPickerProps {
  value?: string
  onChange?: (hex: string) => void
  defaultValue?: string
  format?: 'hex' | 'rgb' | 'hsl'
  showAlpha?: boolean
  swatches?: string[]
  showSwatches?: boolean
  showHistory?: boolean
  disabled?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

const HISTORY_KEY = 'bahrawy-color-history'

/** 0..100 alpha → 2-digit hex pair, e.g. 50 → "80". */
function alphaToHexPair(alpha: number): string {
  return Math.round((alpha / 100) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()
}

function useColorHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  const addToHistory = useCallback((hex: string) => {
    setHistory((prev) => {
      const cleaned = hex.toUpperCase()
      const filtered = prev.filter((c) => c !== cleaned)
      const next = [cleaned, ...filtered].slice(0, 10)
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try { localStorage.removeItem(HISTORY_KEY) } catch { /* ignore */ }
  }, [])

  return { history, addToHistory, clearHistory }
}

// ---------------------------------------------------------------------------
// Saturation Canvas
// ---------------------------------------------------------------------------

function SaturationCanvas({
  hue,
  saturation,
  brightness,
  onChangeSV,
}: {
  hue: number
  saturation: number
  brightness: number
  onChangeSV: (s: number, v: number) => void
}) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = canvasRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
      onChangeSV(Math.round(x * 100), Math.round((1 - y) * 100))
    },
    [onChangeSV],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      dragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updateFromPointer(e.clientX, e.clientY)
    },
    [updateFromPointer],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      updateFromPointer(e.clientX, e.clientY)
    },
    [updateFromPointer],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const hueColor = `hsl(${hue}, 100%, 50%)`
  const handleX = `${saturation}%`
  const handleY = `${100 - brightness}%`

  return (
    <div
      ref={canvasRef}
      className="relative h-40 w-full cursor-crosshair rounded-lg"
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Handle */}
      <motion.div
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{ left: handleX, top: handleY }}
        whileHover={{ scale: 1.2 }}
        transition={springSnappy}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hue Slider
// ---------------------------------------------------------------------------

function HueSlider({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
  return (
    <div className="relative">
      <input
        type="range"
        min={0}
        max={360}
        value={hue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="color-slider w-full"
        style={{
          background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Alpha Slider
// ---------------------------------------------------------------------------

function AlphaSlider({
  color,
  alpha,
  onChange,
}: {
  color: string
  alpha: number
  onChange: (a: number) => void
}) {
  return (
    <div className="relative">
      <input
        type="range"
        min={0}
        max={100}
        value={alpha}
        onChange={(e) => onChange(Number(e.target.value))}
        className="color-slider w-full"
        style={{
          // Transparent → color ramp over a checkerboard.
          background: `linear-gradient(to right, transparent, ${color}), repeating-conic-gradient(rgba(255,255,255,0.18) 0% 25%, transparent 0% 50%) 0 0 / 8px 8px`,
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Swatch Grid
// ---------------------------------------------------------------------------

function SwatchGrid({
  colors,
  selected,
  onSelect,
}: {
  colors: string[]
  selected?: string
  onSelect: (hex: string) => void
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {colors.map((color) => (
        <motion.button
          key={color}
          type="button"
          onClick={() => onSelect(color)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={springSnappy}
          className={cn(
            'h-7 w-7 rounded-md border transition-shadow',
            selected?.toUpperCase() === color.toUpperCase()
              ? 'border-white ring-2 ring-white/30'
              : 'border-white/10',
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ColorPicker({
  value: controlledValue,
  onChange,
  defaultValue = '#3B82F6',
  format = 'hex',
  showAlpha = false,
  swatches,
  showSwatches = true,
  showHistory = true,
  disabled = false,
  className,
}: ColorPickerProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  // Full value, possibly with an 8-digit hex alpha channel (e.g. #3B82F680).
  const rawValue = isControlled ? controlledValue : internalValue
  const hasAlphaChannel = /^#[0-9A-Fa-f]{8}$/.test(rawValue)
  const currentHex = hasAlphaChannel ? rawValue.slice(0, 7) : rawValue
  const alpha = hasAlphaChannel
    ? Math.round((parseInt(rawValue.slice(7, 9), 16) / 255) * 100)
    : 100

  // Derive HSV from hex
  const rgb = useMemo(() => hexToRgb(currentHex), [currentHex])
  const hsv = useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb])

  // Keep hue in a ref so it doesn't jump to 0 when saturation/brightness are 0
  const [hue, setHue] = useState(hsv.h)

  const { history, addToHistory, clearHistory } = useColorHistory()
  const [hexInput, setHexInput] = useState(currentHex)
  const [activeFormat, setActiveFormat] = useState(format)
  const [open, setOpen] = useState(false)

  // Sync hex input when color changes externally
  useEffect(() => {
    setHexInput(currentHex)
  }, [currentHex])

  const updateColor = useCallback(
    (hex: string, nextAlpha: number = alpha) => {
      const upper = hex.toUpperCase()
      const out =
        showAlpha && nextAlpha < 100
          ? `${upper}${alphaToHexPair(nextAlpha)}`
          : upper
      if (!isControlled) setInternalValue(out)
      onChange?.(out)
      setHexInput(upper)
    },
    [isControlled, onChange, showAlpha, alpha],
  )

  const handleAlphaChange = useCallback(
    (a: number) => updateColor(currentHex, a),
    [currentHex, updateColor],
  )

  const handleSVChange = useCallback(
    (s: number, v: number) => {
      const newRgb = hsvToRgb(hue, s, v)
      updateColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    },
    [hue, updateColor],
  )

  const handleHueChange = useCallback(
    (h: number) => {
      setHue(h)
      const newRgb = hsvToRgb(h, hsv.s, hsv.v)
      updateColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    },
    [hsv.s, hsv.v, updateColor],
  )

  const handleHexInput = useCallback(
    (val: string) => {
      setHexInput(val)
      const withHash = val.startsWith('#') ? val : `#${val}`
      if (isValidHex(withHash)) {
        updateColor(withHash)
        const newRgb = hexToRgb(withHash)
        const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b)
        if (newHsv.s > 0 || newHsv.v > 0) setHue(newHsv.h)
      }
    },
    [updateColor],
  )

  const handleSwatchSelect = useCallback(
    (hex: string) => {
      updateColor(hex)
      const newRgb = hexToRgb(hex)
      const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b)
      if (newHsv.s > 0 || newHsv.v > 0) setHue(newHsv.h)
    },
    [updateColor],
  )

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen && isValidHex(currentHex)) {
        addToHistory(currentHex)
      }
    },
    [currentHex, addToHistory],
  )

  const formattedColor = useMemo(() => {
    if (showAlpha && alpha < 100) {
      const a = (alpha / 100).toFixed(2)
      if (activeFormat === 'rgb') return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
      if (activeFormat === 'hsl') {
        const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)
        return `hsla(${h}, ${s}%, ${l}%, ${a})`
      }
    }
    return formatColor(rgb, activeFormat)
  }, [rgb, activeFormat, showAlpha, alpha])

  const swatchColors = swatches ?? MATERIAL_SWATCHES

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm transition-colors hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          <div
            className="h-5 w-5 rounded-md border border-white/10"
            style={{
              background: `linear-gradient(${rawValue}, ${rawValue}), repeating-conic-gradient(rgba(255,255,255,0.18) 0% 25%, transparent 0% 50%) 0 0 / 8px 8px`,
            }}
          />
          <span className="font-mono text-white/70">{rawValue.toUpperCase()}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 border-white/[0.08] bg-neutral-900/95 p-0 backdrop-blur-xl"
        align="start"
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springSnappy}
          className="p-3"
        >
          <Tabs defaultValue="picker" className="w-full">
            <TabsList className="mb-3 w-full bg-white/[0.04]">
              <TabsTrigger value="picker" className="flex-1 text-xs">Picker</TabsTrigger>
              {showSwatches && (
                <TabsTrigger value="swatches" className="flex-1 text-xs">Swatches</TabsTrigger>
              )}
              {showHistory && (
                <TabsTrigger value="history" className="flex-1 text-xs">History</TabsTrigger>
              )}
            </TabsList>

            {/* ---- Picker Tab ---- */}
            <TabsContent value="picker" className="mt-0 space-y-3">
              {/* Saturation canvas */}
              <SaturationCanvas
                hue={hue}
                saturation={hsv.s}
                brightness={hsv.v}
                onChangeSV={handleSVChange}
              />

              {/* Hue slider */}
              <HueSlider hue={hue} onChange={handleHueChange} />

              {/* Alpha slider */}
              {showAlpha && (
                <AlphaSlider color={currentHex} alpha={alpha} onChange={handleAlphaChange} />
              )}

              {/* Preview + inputs */}
              <div className="flex items-center gap-3">
                {/* Color preview */}
                <div
                  className="h-10 w-10 shrink-0 rounded-lg border border-white/10"
                  style={{
                    background: `linear-gradient(${rawValue}, ${rawValue}), repeating-conic-gradient(rgba(255,255,255,0.18) 0% 25%, transparent 0% 50%) 0 0 / 8px 8px`,
                  }}
                />

                {/* Input */}
                <div className="flex-1 space-y-1">
                  {/* Format tabs */}
                  <div className="flex gap-1">
                    {(['hex', 'rgb', 'hsl'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setActiveFormat(f)}
                        className={cn(
                          'rounded px-2 py-0.5 text-[10px] font-medium uppercase transition-colors',
                          activeFormat === f
                            ? 'bg-white/10 text-white'
                            : 'text-white/30 hover:text-white/50',
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Value input */}
                  {activeFormat === 'hex' ? (
                    <input
                      type="text"
                      value={hexInput}
                      onChange={(e) => handleHexInput(e.target.value)}
                      className="w-full rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 font-mono text-xs text-white outline-none focus:border-white/20"
                    />
                  ) : (
                    <div className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/60">
                      {formattedColor}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ---- Swatches Tab ---- */}
            {showSwatches && (
              <TabsContent value="swatches" className="mt-0">
                <SwatchGrid
                  colors={swatchColors}
                  selected={currentHex}
                  onSelect={handleSwatchSelect}
                />
              </TabsContent>
            )}

            {/* ---- History Tab ---- */}
            {showHistory && (
              <TabsContent value="history" className="mt-0">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Pipette className="mb-2 h-5 w-5 text-white/20" />
                    <p className="text-xs text-white/30">No colors yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <SwatchGrid
                      colors={history}
                      selected={currentHex}
                      onSelect={handleSwatchSelect}
                    />
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="text-xs text-white/30 transition-colors hover:text-white/50"
                    >
                      Clear history
                    </button>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}
