'use client'

/**
 * <ImageLightbox />  —  Apple-style click-to-zoom gallery.
 *
 * A grid of thumbnails. Click any → fullscreen lightbox with the
 * image centered on a vibrancy scrim. Arrow keys / on-screen
 * arrows / swipe to navigate. Optional caption + counter chip in
 * the chrome. Esc closes. Open state can be controlled externally
 * or driven by the built-in thumbnail grid (default).
 *
 * Animation: Apple spring on enter/exit, image cross-fade + slight
 * scale-up on nav, backdrop fades in with blur.
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFocusTrap } from '@/lib/use-focus-trap'

export interface LightboxImage {
  src: string
  /** Caption shown in the bottom chrome. */
  caption?: React.ReactNode
  /** Alt text. Defaults to caption. */
  alt?: string
  /** Optional thumbnail src (defaults to `src`). */
  thumb?: string
}

export interface ImageLightboxProps {
  images: LightboxImage[]
  /** Render the built-in thumbnail grid. Default true. */
  showGrid?: boolean
  /** Square thumbnail size in px. Default 110. */
  thumbSize?: number
  /** Grid gap in px. Default 6. */
  gap?: number
  /** Controlled open state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Controlled active index. */
  index?: number
  onIndexChange?: (i: number) => void
  className?: string
}

const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

export function ImageLightbox({
  images,
  showGrid = true,
  thumbSize = 110,
  gap = 6,
  open: openProp,
  onOpenChange,
  index: indexProp,
  onIndexChange,
  className,
}: ImageLightboxProps) {
  const [openState, setOpenState] = React.useState(false)
  const [indexState, setIndexState] = React.useState(0)
  const open = openProp ?? openState
  const index = indexProp ?? indexState
  const overlayRef = React.useRef<HTMLDivElement>(null)

  // Focus: move into the overlay on open, Tab cycling, restore on close.
  useFocusTrap(overlayRef, open)

  const setOpen = (v: boolean) => {
    if (openProp === undefined) setOpenState(v)
    onOpenChange?.(v)
  }
  const setIndex = (i: number) => {
    const safe = ((i % images.length) + images.length) % images.length
    if (indexProp === undefined) setIndexState(safe)
    onIndexChange?.(safe)
  }

  const openAt = (i: number) => {
    setIndex(i)
    setOpen(true)
  }
  const close = () => setOpen(false)
  const next = React.useCallback(() => setIndex(index + 1), [index, images.length])
  const prev = React.useCallback(() => setIndex(index - 1), [index, images.length])

  // Lock scroll + keyboard nav
  React.useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, next, prev])

  const current = images[index]

  return (
    <div className={className}>
      {showGrid && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${thumbSize}px, 1fr))`,
            gap,
          }}
        >
          {images.map((img, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => openAt(i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={APPLE_SPRING}
              className="group relative overflow-hidden rounded-[14px] border border-picks-fg/[0.06]"
              style={{
                aspectRatio: '1 / 1',
                boxShadow:
                  '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 10px -4px rgba(0,0,0,0.4)',
              }}
              aria-label={`Open image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumb ?? img.src}
                alt={img.alt ?? `Image ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                draggable={false}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
                }}
              />
            </motion.button>
          ))}
        </div>
      )}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && current && (
              <motion.div
                key="lightbox"
                ref={overlayRef}
                tabIndex={-1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[180] flex items-center justify-center outline-none"
              >
                {/* Vibrancy scrim */}
                <button
                  type="button"
                  aria-label="Close"
                  tabIndex={-1}
                  onClick={close}
                  className="absolute inset-0 backdrop-blur-2xl"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.92) 100%)',
                  }}
                />

                {/* Close button (top right) */}
                <motion.button
                  type="button"
                  onClick={close}
                  whileTap={{ scale: 0.9 }}
                  transition={APPLE_SPRING}
                  aria-label="Close"
                  className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-picks-fg/[0.1] text-picks-fg/85 backdrop-blur-xl transition-colors hover:bg-picks-fg/10"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                  }}
                >
                  <X className="h-4 w-4" strokeWidth={2.25} />
                </motion.button>

                {/* Counter (top left) */}
                {images.length > 1 && (
                  <span
                    className="absolute left-4 top-4 z-10 rounded-full border border-picks-fg/[0.1] px-3 py-1.5 font-mono text-[11px] font-medium tabular-nums text-picks-fg/85 backdrop-blur-xl"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                    }}
                  >
                    {index + 1} <span className="text-picks-fg/40">/</span>{' '}
                    {images.length}
                  </span>
                )}

                {/* Prev / next */}
                {images.length > 1 && (
                  <>
                    <motion.button
                      type="button"
                      onClick={prev}
                      whileTap={{ scale: 0.9 }}
                      transition={APPLE_SPRING}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-picks-fg/[0.1] text-picks-fg/85 backdrop-blur-xl transition-colors hover:bg-picks-fg/10 sm:left-8"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={next}
                      whileTap={{ scale: 0.9 }}
                      transition={APPLE_SPRING}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-picks-fg/[0.1] text-picks-fg/85 backdrop-blur-xl transition-colors hover:bg-picks-fg/10 sm:right-8"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                      }}
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
                    </motion.button>
                  </>
                )}

                {/* Image (swipe to nav) */}
                <motion.div
                  className="relative z-[5] flex h-full w-full items-center justify-center px-4 sm:px-20"
                  drag={images.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80 || info.velocity.x < -400) next()
                    else if (info.offset.x > 80 || info.velocity.x > 400) prev()
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={current.src}
                      src={current.src}
                      alt={current.alt ?? (typeof current.caption === 'string' ? current.caption : '')}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={APPLE_SPRING}
                      draggable={false}
                      className="max-h-[80vh] max-w-full select-none rounded-[18px] object-contain"
                      style={{
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.08) inset, 0 28px 80px -20px rgba(0,0,0,0.75)',
                      }}
                    />
                  </AnimatePresence>
                </motion.div>

                {/* Caption */}
                {current.caption && (
                  <motion.div
                    key={`caption-${index}`}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={APPLE_SPRING}
                    className={cn(
                      'absolute bottom-5 left-1/2 z-10 max-w-[90vw] -translate-x-1/2 rounded-full border border-picks-fg/[0.1] px-4 py-2 text-[12.5px] tracking-tight text-picks-fg/90 backdrop-blur-xl',
                    )}
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                    }}
                  >
                    {current.caption}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
