'use client'

import {
  type PointerEvent as ReactPointerEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import {
  type Point,
  type StrokeOptions,
  drawStrokeSegment,
  smoothPoint,
} from './stroke-utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DrawCanvasHandle {
  clear: () => void
  undo: () => void
  isEmpty: () => boolean
  toBlob: (format: string, quality: number) => Promise<Blob | null>
  toDataURL: (format: string, quality: number) => string
  getStrokes: () => Point[][]
  getCanvas: () => HTMLCanvasElement | null
}

interface DrawCanvasProps {
  strokeColor: string
  strokeWidth: number
  smoothing: number
  onStrokeStart?: () => void
  onStrokeEnd?: () => void
  onChange?: (isEmpty: boolean) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DrawCanvas = forwardRef<DrawCanvasHandle, DrawCanvasProps>(
  function DrawCanvas(
    {
      strokeColor,
      strokeWidth,
      smoothing,
      onStrokeStart,
      onStrokeEnd,
      onChange,
      className,
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const strokesRef = useRef<Point[][]>([])
    const currentStrokeRef = useRef<Point[]>([])
    const isDrawingRef = useRef(false)
    const lastPointRef = useRef<Point | null>(null)
    const [, forceUpdate] = useState(0)

    const strokeOpts: StrokeOptions = {
      minWidth: Math.max(1, strokeWidth * 0.4),
      maxWidth: strokeWidth,
      smoothing,
    }

    // ---- Canvas setup ----

    const setupCanvas = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
    }, [])

    useEffect(() => {
      setupCanvas()
      const handleResize = () => {
        // Save strokes, resize, redraw
        const strokes = [...strokesRef.current]
        setupCanvas()
        redrawAll(strokes)
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [setupCanvas])

    // ---- Drawing helpers ----

    const redrawAll = useCallback(
      (strokes: Point[][]) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const rect = canvas.getBoundingClientRect()
        ctx.clearRect(0, 0, rect.width, rect.height)
        for (const stroke of strokes) {
          drawStrokeSegment(ctx, stroke, strokeOpts, strokeColor)
        }
      },
      [strokeColor, strokeOpts],
    )

    const getPoint = useCallback(
      (e: ReactPointerEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current!
        const rect = canvas.getBoundingClientRect()
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          pressure: e.pressure || 0.5,
          timestamp: Date.now(),
        }
      },
      [],
    )

    // ---- Pointer handlers ----

    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLCanvasElement>) => {
        e.preventDefault()
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.setPointerCapture(e.pointerId)
        isDrawingRef.current = true
        const point = getPoint(e)
        currentStrokeRef.current = [point]
        lastPointRef.current = point
        onStrokeStart?.()
      },
      [getPoint, onStrokeStart],
    )

    const handlePointerMove = useCallback(
      (e: ReactPointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) return
        e.preventDefault()

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let point = getPoint(e)

        // Apply smoothing
        if (lastPointRef.current && smoothing > 0) {
          point = smoothPoint(point, lastPointRef.current, 1 - smoothing * 0.5)
        }

        currentStrokeRef.current.push(point)
        lastPointRef.current = point

        // Draw incremental segment
        const pts = currentStrokeRef.current
        if (pts.length >= 2) {
          const segment = pts.slice(-3)
          drawStrokeSegment(ctx, segment, strokeOpts, strokeColor)
        }
      },
      [getPoint, smoothing, strokeColor, strokeOpts],
    )

    const handlePointerUp = useCallback(
      (e: ReactPointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) return
        const canvas = canvasRef.current
        if (canvas) canvas.releasePointerCapture(e.pointerId)
        isDrawingRef.current = false

        if (currentStrokeRef.current.length > 0) {
          strokesRef.current.push([...currentStrokeRef.current])
          currentStrokeRef.current = []
          onChange?.(false)
          forceUpdate((n) => n + 1)
        }
        lastPointRef.current = null
        onStrokeEnd?.()
      },
      [onChange, onStrokeEnd],
    )

    // ---- Imperative API ----

    useImperativeHandle(
      ref,
      () => ({
        clear() {
          strokesRef.current = []
          currentStrokeRef.current = []
          const canvas = canvasRef.current
          if (canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx) {
              const rect = canvas.getBoundingClientRect()
              ctx.clearRect(0, 0, rect.width, rect.height)
            }
          }
          onChange?.(true)
          forceUpdate((n) => n + 1)
        },

        undo() {
          strokesRef.current.pop()
          redrawAll(strokesRef.current)
          onChange?.(strokesRef.current.length === 0)
          forceUpdate((n) => n + 1)
        },

        isEmpty() {
          return strokesRef.current.length === 0
        },

        toBlob(format: string, quality: number) {
          return new Promise<Blob | null>((resolve) => {
            const canvas = canvasRef.current
            if (!canvas) return resolve(null)
            canvas.toBlob(
              (blob) => resolve(blob),
              `image/${format}`,
              quality,
            )
          })
        },

        toDataURL(format: string, quality: number) {
          const canvas = canvasRef.current
          if (!canvas) return ''
          return canvas.toDataURL(`image/${format}`, quality)
        },

        getStrokes() {
          return [...strokesRef.current]
        },

        getCanvas() {
          return canvasRef.current
        },
      }),
      [redrawAll, onChange],
    )

    return (
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          'h-full w-full cursor-crosshair touch-none',
          className,
        )}
        style={{ touchAction: 'none' }}
      />
    )
  },
)
