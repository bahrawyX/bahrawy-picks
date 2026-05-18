'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eraser, Pen, Redo2, Type, Undo2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, tweenSmooth } from '@/lib/motion'
import { DrawCanvas, type DrawCanvasHandle } from './draw-canvas'
import { TypeCanvas, type TypeCanvasHandle } from './type-canvas'
import { pointsToSVGPath } from './stroke-utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SignatureMode = 'draw' | 'type'
export type ExportFormat = 'png' | 'jpeg' | 'svg'

export interface SignatureResult {
  blob: Blob | null
  base64: string
  svg?: string
  isEmpty: boolean
}

export interface SignaturePadProps {
  onSignature?: (result: SignatureResult) => void
  mode?: SignatureMode
  strokeColor?: string
  strokeWidth?: number
  smoothing?: number
  exportFormat?: ExportFormat
  exportQuality?: number
  height?: number
  placeholder?: string
  disabled?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SignaturePad({
  onSignature,
  mode: defaultMode = 'draw',
  strokeColor = '#ffffff',
  strokeWidth = 3,
  smoothing = 0.5,
  exportFormat = 'png',
  exportQuality = 0.92,
  height = 200,
  placeholder = 'Sign here',
  disabled = false,
  className,
}: SignaturePadProps) {
  const [activeMode, setActiveMode] = useState<SignatureMode>(defaultMode)
  const [isEmpty, setIsEmpty] = useState(true)

  const drawRef = useRef<DrawCanvasHandle>(null)
  const typeRef = useRef<TypeCanvasHandle>(null)

  // ---- Handlers ----

  const handleClear = useCallback(() => {
    if (activeMode === 'draw') {
      drawRef.current?.clear()
    } else {
      typeRef.current?.clear()
    }
    setIsEmpty(true)
  }, [activeMode])

  const handleUndo = useCallback(() => {
    if (activeMode === 'draw') {
      drawRef.current?.undo()
      setIsEmpty(drawRef.current?.isEmpty() ?? true)
    }
  }, [activeMode])

  const handleExport = useCallback(async () => {
    let blob: Blob | null = null
    let base64 = ''
    let svg: string | undefined

    if (activeMode === 'draw') {
      const ref = drawRef.current
      if (!ref || ref.isEmpty()) return

      if (exportFormat === 'svg') {
        const strokes = ref.getStrokes()
        const canvas = ref.getCanvas()
        const w = canvas?.getBoundingClientRect().width ?? 600
        const h = canvas?.getBoundingClientRect().height ?? 200
        const pathData = pointsToSVGPath(strokes)
        svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        blob = new Blob([svg], { type: 'image/svg+xml' })
        base64 = `data:image/svg+xml;base64,${btoa(svg)}`
      } else {
        blob = await ref.toBlob(exportFormat, exportQuality)
        base64 = ref.toDataURL(exportFormat, exportQuality)
      }
    } else {
      const ref = typeRef.current
      if (!ref || ref.isEmpty()) return
      blob = await ref.toBlob(exportFormat === 'svg' ? 'png' : exportFormat, exportQuality)
      base64 = ref.toDataURL(exportFormat === 'svg' ? 'png' : exportFormat, exportQuality)
    }

    onSignature?.({ blob, base64, svg, isEmpty: false })
  }, [activeMode, exportFormat, exportQuality, strokeColor, strokeWidth, onSignature])

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-white/[0.08]',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3 py-2">
        {/* Mode toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-0.5">
          <button
            type="button"
            onClick={() => setActiveMode('draw')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              activeMode === 'draw'
                ? 'bg-white/[0.1] text-white'
                : 'text-white/40 hover:text-white/60',
            )}
          >
            <Pen className="h-3.5 w-3.5" />
            Draw
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('type')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              activeMode === 'type'
                ? 'bg-white/[0.1] text-white'
                : 'text-white/40 hover:text-white/60',
            )}
          >
            <Type className="h-3.5 w-3.5" />
            Type
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {activeMode === 'draw' && (
            <button
              type="button"
              onClick={handleUndo}
              disabled={isEmpty}
              className={cn(
                'rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70',
                isEmpty && 'opacity-30',
              )}
              aria-label="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleClear}
            disabled={isEmpty}
            className={cn(
              'rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70',
              isEmpty && 'opacity-30',
            )}
            aria-label="Clear"
          >
            <Eraser className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isEmpty}
            className={cn(
              'rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70',
              isEmpty && 'opacity-30',
            )}
            aria-label="Export signature"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative" style={{ height }}>
        {/* Placeholder */}
        <AnimatePresence>
          {isEmpty && activeMode === 'draw' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={tweenSmooth}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <p className="select-none text-sm text-white/15">{placeholder}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signature line */}
        <div className="absolute bottom-8 left-6 right-6 border-b border-dashed border-white/[0.08]" />

        {/* Draw mode */}
        <div className={cn(activeMode !== 'draw' && 'hidden', 'h-full')}>
          <DrawCanvas
            ref={drawRef}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            smoothing={smoothing}
            onChange={(empty) => setIsEmpty(empty)}
          />
        </div>

        {/* Type mode */}
        <div className={cn(activeMode !== 'type' && 'hidden', 'h-full')}>
          <TypeCanvas
            ref={typeRef}
            font="'Dancing Script', cursive"
            fontSize={40}
            color={strokeColor}
            onChange={(empty) => setIsEmpty(empty)}
          />
        </div>
      </div>
    </div>
  )
}
