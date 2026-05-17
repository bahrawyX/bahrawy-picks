'use client'

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { motion } from 'framer-motion'
import {
  FlipHorizontal,
  FlipVertical,
  ImageIcon,
  RotateCcw,
  Upload,
  ZoomIn,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, springGentle, tweenSmooth } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CropResult {
  blob: Blob
  base64: string
  width: number
  height: number
}

export interface ImageCropperProps {
  src?: string
  onCrop: (result: CropResult) => void
  aspectRatio?: number
  minWidth?: number
  minHeight?: number
  outputFormat?: 'jpeg' | 'png' | 'webp'
  outputQuality?: number
  showGrid?: boolean
  allowRotation?: boolean
  allowFlip?: boolean
  maxZoom?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Aspect ratio presets
// ---------------------------------------------------------------------------

const ASPECT_PRESETS = [
  { label: 'Free', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:4', value: 3 / 4 },
  { label: '9:16', value: 9 / 16 },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageCropper({
  src: initialSrc,
  onCrop,
  aspectRatio: initialAspect,
  minWidth = 50,
  minHeight = 50,
  outputFormat = 'jpeg',
  outputQuality = 0.92,
  showGrid = true,
  allowRotation = true,
  allowFlip = true,
  maxZoom = 3,
  className,
}: ImageCropperProps) {
  const [open, setOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState(initialSrc ?? '')
  const [previewSrc, setPreviewSrc] = useState(initialSrc ?? '')
  const [processing, setProcessing] = useState(false)

  // Transform state
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [aspect, setAspect] = useState(initialAspect ?? 0)

  // Canvas/image refs
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Crop box state (percentages 0-100)
  const [crop, setCrop] = useState({ x: 10, y: 10, w: 80, h: 80 })

  // Drag state
  const dragRef = useRef<{
    type: 'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
    startX: number
    startY: number
    startCrop: typeof crop
  } | null>(null)

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panRef = useRef<{ startX: number; startY: number; startPan: typeof pan } | null>(null)

  // Load image
  useEffect(() => {
    if (!imageSrc) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgRef.current = img
      // Reset transforms
      setZoom(1)
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
      setPan({ x: 0, y: 0 })

      // Set initial crop based on aspect
      if (aspect > 0) {
        applyCropAspect(aspect)
      } else {
        setCrop({ x: 10, y: 10, w: 80, h: 80 })
      }
    }
    img.src = imageSrc
  }, [imageSrc]) // eslint-disable-line react-hooks/exhaustive-deps

  const applyCropAspect = useCallback((ratio: number) => {
    if (ratio <= 0) {
      setCrop({ x: 10, y: 10, w: 80, h: 80 })
      return
    }
    const container = containerRef.current
    // Need container dimensions to convert pixel aspect ratio to percentage space
    const cW = container ? container.getBoundingClientRect().width : 100
    const cH = container ? container.getBoundingClientRect().height : 100
    const containerAspect = cW / cH

    // We want (w% * cW) / (h% * cH) = ratio  →  h% = w% * containerAspect / ratio
    let w = 80
    let h = (w * containerAspect) / ratio
    if (h > 80) {
      h = 80
      w = (h * ratio) / containerAspect
    }
    setCrop({
      x: (100 - w) / 2,
      y: (100 - h) / 2,
      w,
      h,
    })
  }, [])

  // File upload
  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImageSrc(dataUrl)
      setPreviewSrc('')
      setOpen(true)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleUploadClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFileSelect(file)
    }
    input.click()
  }, [handleFileSelect])

  // ---- Crop box drag handlers ----

  const handleCropPointerDown = useCallback(
    (type: typeof dragRef.current extends null ? never : NonNullable<typeof dragRef.current>['type'], e: ReactPointerEvent) => {
      e.stopPropagation()
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      dragRef.current = {
        type,
        startX: e.clientX,
        startY: e.clientY,
        startCrop: { ...crop },
      }
    },
    [crop],
  )

  const handleCropPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!dragRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100
      const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100
      const s = dragRef.current.startCrop
      const t = dragRef.current.type

      let newCrop = { ...s }

      if (t === 'move') {
        newCrop.x = Math.max(0, Math.min(100 - s.w, s.x + dx))
        newCrop.y = Math.max(0, Math.min(100 - s.h, s.y + dy))
      } else {
        // Resize handles
        if (t.includes('w')) {
          const newX = Math.max(0, s.x + dx)
          newCrop.w = s.w - (newX - s.x)
          newCrop.x = newX
        }
        if (t.includes('e')) {
          newCrop.w = Math.min(100 - s.x, s.w + dx)
        }
        if (t.includes('n')) {
          const newY = Math.max(0, s.y + dy)
          newCrop.h = s.h - (newY - s.y)
          newCrop.y = newY
        }
        if (t.includes('s')) {
          newCrop.h = Math.min(100 - s.y, s.h + dy)
        }

        // Enforce minimum
        const minWPct = (minWidth / rect.width) * 100
        const minHPct = (minHeight / rect.height) * 100
        if (newCrop.w < minWPct) newCrop.w = minWPct
        if (newCrop.h < minHPct) newCrop.h = minHPct

        // Enforce aspect ratio (accounting for container dimensions)
        if (aspect > 0) {
          const containerAspect = rect.width / rect.height
          if (t.includes('e') || t.includes('w')) {
            newCrop.h = (newCrop.w * containerAspect) / aspect
          } else {
            newCrop.w = (newCrop.h * aspect) / containerAspect
          }
        }
      }

      setCrop(newCrop)
    },
    [aspect, minWidth, minHeight],
  )

  const handleCropPointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  // ---- Pan (background image drag) ----
  const handleBgPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPan: { ...pan },
      }
    },
    [pan],
  )

  const handleBgPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!panRef.current) return
      const dx = e.clientX - panRef.current.startX
      const dy = e.clientY - panRef.current.startY
      setPan({
        x: panRef.current.startPan.x + dx,
        y: panRef.current.startPan.y + dy,
      })
    },
    [],
  )

  const handleBgPointerUp = useCallback(() => {
    panRef.current = null
  }, [])

  // ---- Zoom via wheel ----
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      setZoom((z) => Math.max(1, Math.min(maxZoom, z - e.deltaY * 0.002)))
    },
    [maxZoom],
  )

  // ---- Double-click reset ----
  const handleDoubleClick = useCallback(() => {
    setZoom(1)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
    setPan({ x: 0, y: 0 })
    applyCropAspect(aspect)
  }, [aspect, applyCropAspect])

  // ---- Crop output ----
  const handleCrop = useCallback(async () => {
    if (!imgRef.current) return
    setProcessing(true)

    try {
      const img = imgRef.current
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Calculate crop area in image pixels
      // The displayed image is scaled by zoom and offset by pan
      // We need to map crop percentages back to image pixels
      const containerEl = containerRef.current
      if (!containerEl) return
      const rect = containerEl.getBoundingClientRect()

      // Image natural size
      const natW = img.naturalWidth
      const natH = img.naturalHeight

      // How the image is displayed (object-contain)
      const displayRatio = Math.min(rect.width / natW, rect.height / natH) * zoom
      const displayW = natW * displayRatio
      const displayH = natH * displayRatio

      // Image offset (centered + pan)
      const imgOffX = (rect.width - displayW) / 2 + pan.x
      const imgOffY = (rect.height - displayH) / 2 + pan.y

      // Crop box in pixels
      const cropPxX = (crop.x / 100) * rect.width
      const cropPxY = (crop.y / 100) * rect.height
      const cropPxW = (crop.w / 100) * rect.width
      const cropPxH = (crop.h / 100) * rect.height

      // Map crop to image coordinates
      const srcX = (cropPxX - imgOffX) / displayRatio
      const srcY = (cropPxY - imgOffY) / displayRatio
      const srcW = cropPxW / displayRatio
      const srcH = cropPxH / displayRatio

      const outW = Math.round(Math.max(1, srcW))
      const outH = Math.round(Math.max(1, srcH))
      canvas.width = outW
      canvas.height = outH

      // Apply transforms
      ctx.save()
      ctx.translate(outW / 2, outH / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      ctx.translate(-outW / 2, -outH / 2)
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH)
      ctx.restore()

      const mimeType = `image/${outputFormat}`
      const base64 = canvas.toDataURL(mimeType, outputQuality)

      const response = await fetch(base64)
      const blob = await response.blob()

      onCrop({ blob, base64, width: outW, height: outH })
      setPreviewSrc(base64)
      setOpen(false)
    } finally {
      setProcessing(false)
    }
  }, [crop, zoom, rotation, flipH, flipV, pan, outputFormat, outputQuality, onCrop])

  // ---- Aspect change ----
  const handleAspectChange = useCallback(
    (ratio: number) => {
      setAspect(ratio)
      applyCropAspect(ratio)
    },
    [applyCropAspect],
  )

  const imageTransform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`

  return (
    <>
      {/* Trigger area */}
      {previewSrc || initialSrc ? (
        <div className={cn('group relative inline-block', className)}>
          <img
            src={previewSrc || initialSrc}
            alt="Cropped preview"
            className="h-40 w-40 rounded-lg border border-white/10 object-cover"
          />
          <motion.button
            type="button"
            onClick={() => {
              setImageSrc(previewSrc || initialSrc || '')
              setOpen(true)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <span className="text-sm font-medium text-white">Edit</span>
          </motion.button>
        </div>
      ) : (
        <motion.button
          type="button"
          onClick={handleUploadClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={springSnappy}
          className={cn(
            'flex h-40 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] transition-colors hover:border-white/20 hover:bg-white/[0.04]',
            className,
          )}
        >
          <Upload className="h-6 w-6 text-white/30" />
          <span className="text-sm text-white/40">Upload image</span>
        </motion.button>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden border-white/[0.08] bg-neutral-950 p-0">
          <DialogHeader className="border-b border-white/[0.06] px-4 py-3">
            <DialogTitle className="text-sm font-medium text-white/80">
              Crop Image
            </DialogTitle>
          </DialogHeader>

          {/* Canvas area */}
          <div
            ref={containerRef}
            className="relative h-[400px] w-full select-none overflow-hidden bg-neutral-900"
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            onPointerDown={handleBgPointerDown}
            onPointerMove={(e) => {
              handleBgPointerMove(e)
              handleCropPointerMove(e)
            }}
            onPointerUp={(e) => {
              handleBgPointerUp()
              handleCropPointerUp()
            }}
          >
            {/* Image */}
            {imageSrc && (
              <motion.img
                src={imageSrc}
                alt="Crop source"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                style={{ transform: imageTransform }}
                animate={{ transform: imageTransform }}
                transition={tweenSmooth}
              />
            )}

            {/* Dark overlay outside crop */}
            <div className="pointer-events-none absolute inset-0">
              {/* Top */}
              <div
                className="absolute left-0 right-0 top-0 bg-black/60"
                style={{ height: `${crop.y}%` }}
              />
              {/* Bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-black/60"
                style={{ height: `${100 - crop.y - crop.h}%` }}
              />
              {/* Left */}
              <div
                className="absolute left-0 bg-black/60"
                style={{
                  top: `${crop.y}%`,
                  height: `${crop.h}%`,
                  width: `${crop.x}%`,
                }}
              />
              {/* Right */}
              <div
                className="absolute right-0 bg-black/60"
                style={{
                  top: `${crop.y}%`,
                  height: `${crop.h}%`,
                  width: `${100 - crop.x - crop.w}%`,
                }}
              />
            </div>

            {/* Crop box */}
            <div
              className="absolute border-2 border-white"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.w}%`,
                height: `${crop.h}%`,
              }}
            >
              {/* Grid lines */}
              {showGrid && (
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-1/3 top-0 h-full w-px bg-white/20" />
                  <div className="absolute left-2/3 top-0 h-full w-px bg-white/20" />
                  <div className="absolute left-0 top-1/3 h-px w-full bg-white/20" />
                  <div className="absolute left-0 top-2/3 h-px w-full bg-white/20" />
                </div>
              )}

              {/* Move handle (center area) */}
              <div
                className="absolute inset-2 cursor-move"
                onPointerDown={(e) => handleCropPointerDown('move', e)}
              />

              {/* Corner handles */}
              {(['nw', 'ne', 'sw', 'se'] as const).map((pos) => (
                <motion.div
                  key={pos}
                  whileHover={{ scale: 1.3 }}
                  transition={springSnappy}
                  className={cn(
                    'absolute z-10 h-3 w-3 rounded-sm bg-white shadow-md',
                    pos.includes('n') ? '-top-1.5' : '-bottom-1.5',
                    pos.includes('w') ? '-left-1.5' : '-right-1.5',
                    pos === 'nw' && 'cursor-nw-resize',
                    pos === 'ne' && 'cursor-ne-resize',
                    pos === 'sw' && 'cursor-sw-resize',
                    pos === 'se' && 'cursor-se-resize',
                  )}
                  onPointerDown={(e) => handleCropPointerDown(pos, e)}
                />
              ))}

              {/* Edge handles */}
              <div
                className="absolute -top-1 left-4 right-4 h-2 cursor-n-resize"
                onPointerDown={(e) => handleCropPointerDown('n', e)}
              />
              <div
                className="absolute -bottom-1 left-4 right-4 h-2 cursor-s-resize"
                onPointerDown={(e) => handleCropPointerDown('s', e)}
              />
              <div
                className="absolute -left-1 bottom-4 top-4 w-2 cursor-w-resize"
                onPointerDown={(e) => handleCropPointerDown('w', e)}
              />
              <div
                className="absolute -right-1 bottom-4 top-4 w-2 cursor-e-resize"
                onPointerDown={(e) => handleCropPointerDown('e', e)}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3 border-t border-white/[0.06] px-4 py-3">
            {/* Aspect presets */}
            <div className="flex items-center gap-1">
              <ImageIcon className="mr-2 h-3.5 w-3.5 text-white/30" />
              {ASPECT_PRESETS.map((preset) => (
                <motion.button
                  key={preset.label}
                  type="button"
                  onClick={() => handleAspectChange(preset.value)}
                  whileTap={{ scale: 0.95 }}
                  transition={springSnappy}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    aspect === preset.value
                      ? 'bg-white/10 text-white'
                      : 'text-white/30 hover:text-white/50',
                  )}
                >
                  {preset.label}
                </motion.button>
              ))}
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-3">
              <ZoomIn className="h-3.5 w-3.5 shrink-0 text-white/30" />
              <Slider
                value={[zoom]}
                min={1}
                max={maxZoom}
                step={0.01}
                onValueChange={([v]) => setZoom(v)}
                className="flex-1"
              />
              <span className="w-10 text-right font-mono text-xs text-white/30">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Rotation */}
            {allowRotation && (
              <div className="flex items-center gap-3">
                <RotateCcw className="h-3.5 w-3.5 shrink-0 text-white/30" />
                <Slider
                  value={[rotation]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={([v]) => setRotation(v)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setRotation(0)}
                  className="w-10 text-right font-mono text-xs text-white/30 hover:text-white/50"
                >
                  {rotation}°
                </button>
              </div>
            )}

            {/* Flip buttons */}
            {allowFlip && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFlipH((f) => !f)}
                  className={cn('gap-1.5 text-xs', flipH && 'bg-white/10')}
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  Flip H
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFlipV((f) => !f)}
                  className={cn('gap-1.5 text-xs', flipV && 'bg-white/10')}
                >
                  <FlipVertical className="h-3.5 w-3.5" />
                  Flip V
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-white/[0.06] px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <motion.div whileTap={{ scale: 0.97 }} transition={springSnappy}>
              <Button
                size="sm"
                onClick={handleCrop}
                disabled={processing}
                className="gap-1.5 text-xs"
              >
                {processing ? 'Processing…' : 'Crop & Apply'}
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
