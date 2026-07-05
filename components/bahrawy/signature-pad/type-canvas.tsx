'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TypeCanvasHandle {
  clear: () => void
  isEmpty: () => boolean
  toBlob: (format: string, quality: number) => Promise<Blob | null>
  toDataURL: (format: string, quality: number) => string
  getText: () => string
}

interface TypeCanvasProps {
  font: string
  fontSize: number
  color: string
  onChange?: (isEmpty: boolean) => void
  className?: string
}

const SIGNATURE_FONTS = [
  { name: 'Dancing Script', value: "'Dancing Script', cursive" },
  { name: 'Great Vibes', value: "'Great Vibes', cursive" },
  { name: 'Sacramento', value: "'Sacramento', cursive" },
  { name: 'Caveat', value: "'Caveat', cursive" },
] as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TypeCanvas = forwardRef<TypeCanvasHandle, TypeCanvasProps>(
  function TypeCanvas({ font, fontSize, color, onChange, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [text, setText] = useState('')
    const [selectedFont, setSelectedFont] = useState(font || SIGNATURE_FONTS[0].value)
    const [fontsLoaded, setFontsLoaded] = useState(false)

    // Load Google Fonts
    useEffect(() => {
      const fontNames = SIGNATURE_FONTS.map((f) => f.name.replace(/ /g, '+')).join('&family=')
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${fontNames}&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      // Wait for fonts to load
      const checkFonts = setTimeout(() => setFontsLoaded(true), 1000)
      if (document.fonts) {
        document.fonts.ready.then(() => {
          clearTimeout(checkFonts)
          setFontsLoaded(true)
        })
      }

      return () => {
        clearTimeout(checkFonts)
        document.head.removeChild(link)
      }
    }, [])

    // Render text to canvas
    const renderText = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      ctx.clearRect(0, 0, rect.width, rect.height)
      if (!text) return

      ctx.font = `${fontSize}px ${selectedFont}`
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, rect.width / 2, rect.height / 2)
    }, [text, selectedFont, fontSize, color])

    useEffect(() => {
      if (fontsLoaded) renderText()
    }, [renderText, fontsLoaded])

    useImperativeHandle(
      ref,
      () => ({
        clear() {
          setText('')
          const canvas = canvasRef.current
          if (canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx) {
              const rect = canvas.getBoundingClientRect()
              ctx.clearRect(0, 0, rect.width, rect.height)
            }
          }
          onChange?.(true)
        },

        isEmpty() {
          return !text.trim()
        },

        toBlob(format: string, quality: number) {
          renderText()
          return new Promise<Blob | null>((resolve) => {
            const canvas = canvasRef.current
            if (!canvas) return resolve(null)
            canvas.toBlob((blob) => resolve(blob), `image/${format}`, quality)
          })
        },

        toDataURL(format: string, quality: number) {
          renderText()
          const canvas = canvasRef.current
          if (!canvas) return ''
          return canvas.toDataURL(`image/${format}`, quality)
        },

        getText() {
          return text
        },
      }),
      [text, renderText, onChange],
    )

    return (
      <div className={cn('flex h-full flex-col', className)}>
        {/* Font selector */}
        <div className="flex gap-1.5 border-b border-picks-fg/[0.06] p-2">
          {SIGNATURE_FONTS.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => setSelectedFont(f.value)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs transition-colors',
                selectedFont === f.value
                  ? 'bg-picks-fg/[0.1] text-picks-fg'
                  : 'text-picks-fg/40 hover:bg-picks-fg/[0.04] hover:text-picks-fg/60',
              )}
              style={{ fontFamily: f.value }}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Text input */}
        <div className="flex-1 p-4">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              onChange?.(!e.target.value.trim())
            }}
            placeholder="Type your signature..."
            className="w-full border-b border-dashed border-picks-fg/10 bg-transparent pb-2 text-center text-lg text-picks-fg outline-none placeholder:text-picks-fg/20"
            style={{ fontFamily: selectedFont, fontSize: `${Math.max(20, fontSize * 0.6)}px` }}
          />
        </div>

        {/* Hidden canvas for export */}
        <canvas
          ref={canvasRef}
          className="hidden"
          style={{ width: 600, height: 200 }}
        />
      </div>
    )
  },
)
