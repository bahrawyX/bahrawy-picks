'use client'

/**
 * <SpotlightTour />
 *
 * The interactive onboarding overlay every SaaS uses but very few
 * libraries do well. Dim the whole page, cut a soft-cornered glowing
 * hole around the active target, anchor a tooltip beside it with
 * prev/next/skip controls and a step indicator. The signature moment
 * is the cutout itself animating between targets — a single CSS
 * transition on width/height/top/left makes it slide across the page
 * smoothly.
 *
 * Implementation note: the "hole" is just one absolutely-positioned
 * div sized to the target rect with a huge box-shadow that dims
 * everything outside it (`box-shadow: 0 0 0 9999px rgba(0,0,0,.78)`).
 * Cheap, scales to any viewport, and animates beautifully.
 *
 * Targets are referenced by either a React ref or a CSS selector
 * string — pick whichever fits the parent component.
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFocusTrap } from '@/lib/use-focus-trap'

export interface SpotlightTourStep {
  /** Element to highlight. Pass a ref OR a CSS selector string. */
  target: React.RefObject<HTMLElement | null> | string
  /** Headline shown in the tooltip. */
  title: string
  /** Optional body copy under the title. */
  description?: React.ReactNode
  /** Preferred tooltip placement relative to the target. Auto-flips if off-screen. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export interface SpotlightTourProps {
  steps: SpotlightTourStep[]
  /** Open/close the tour. */
  open: boolean
  /** Setter (controlled). Defaults to internal state if omitted. */
  onOpenChange?: (open: boolean) => void
  /** Active step index (controlled). */
  step?: number
  /** Step change handler. */
  onStepChange?: (step: number) => void
  /** Fires after the user clicks Done on the last step. */
  onComplete?: () => void
  /** Fires when the user clicks Skip or presses Escape. */
  onSkip?: () => void
  /** Extra px around the target's bounding rect for the cutout. Default 8. */
  spotlightPadding?: number
  /** Corner radius of the cutout. Default 12. */
  spotlightRadius?: number
  /** Overlay opacity 0..1. Default 0.78. */
  overlayOpacity?: number
  /** Accent color used on the focus ring + step dots. Default '#A78BFA'. */
  accent?: string
  /** Skip-button label. Default 'Skip'. */
  skipLabel?: string
  /** Done-button label (shown on last step). Default 'Done'. */
  doneLabel?: string
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const ZERO_RECT: Rect = { top: 0, left: 0, width: 0, height: 0 }

const SPRING = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 32,
  mass: 0.7,
}

export function SpotlightTour({
  steps,
  open,
  onOpenChange,
  step: controlledStep,
  onStepChange,
  onComplete,
  onSkip,
  spotlightPadding = 8,
  spotlightRadius = 12,
  overlayOpacity = 0.78,
  accent = '#A78BFA',
  skipLabel = 'Skip',
  doneLabel = 'Done',
}: SpotlightTourProps) {
  const [internalStep, setInternalStep] = React.useState(0)
  const isControlledStep = controlledStep !== undefined
  const step = isControlledStep ? controlledStep : internalStep

  const tooltipRef = React.useRef<HTMLDivElement>(null)

  // Keyboard users land on the tour controls; focus returns to where it
  // was once the tour closes.
  useFocusTrap(tooltipRef, open, { restoreFocus: true })

  const [rect, setRect] = React.useState<Rect>(ZERO_RECT)
  const [tooltipPos, setTooltipPos] = React.useState<{ top: number; left: number; placement: 'top' | 'bottom' | 'left' | 'right' }>(
    { top: 0, left: 0, placement: 'bottom' },
  )

  const setStep = React.useCallback(
    (n: number) => {
      if (!isControlledStep) setInternalStep(n)
      onStepChange?.(n)
    },
    [isControlledStep, onStepChange],
  )

  const close = React.useCallback(
    (reason: 'complete' | 'skip') => {
      onOpenChange?.(false)
      if (reason === 'complete') onComplete?.()
      else onSkip?.()
    },
    [onOpenChange, onComplete, onSkip],
  )

  const next = React.useCallback(() => {
    if (step >= steps.length - 1) close('complete')
    else setStep(step + 1)
  }, [step, steps.length, setStep, close])

  const prev = React.useCallback(() => {
    if (step > 0) setStep(step - 1)
  }, [step, setStep])

  // Measure the active target on every step change and on resize/scroll.
  React.useEffect(() => {
    if (!open) return
    const current = steps[step]
    if (!current) return

    const measure = () => {
      let el: HTMLElement | null = null
      if (typeof current.target === 'string') {
        el = document.querySelector(current.target) as HTMLElement | null
      } else {
        el = current.target.current
      }
      if (!el) {
        setRect(ZERO_RECT)
        return
      }

      // Scroll the element into view if it's outside the viewport.
      const r = el.getBoundingClientRect()
      if (r.top < 0 || r.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Re-measure after the scroll settles.
        window.setTimeout(measure, 400)
        return
      }

      const padded: Rect = {
        top: r.top - spotlightPadding,
        left: r.left - spotlightPadding,
        width: r.width + spotlightPadding * 2,
        height: r.height + spotlightPadding * 2,
      }
      setRect(padded)

      // Auto-place the tooltip — pick the side with the most room.
      const TIP_W = 320
      const TIP_H = 130
      const GAP = 12
      const room = {
        bottom: window.innerHeight - r.bottom,
        top: r.top,
        right: window.innerWidth - r.right,
        left: r.left,
      }
      const preferred = current.placement
      const order = preferred
        ? ([preferred, 'bottom', 'top', 'right', 'left'].filter(
            (v, i, a) => a.indexOf(v) === i,
          ) as Array<'top' | 'bottom' | 'left' | 'right'>)
        : (['bottom', 'top', 'right', 'left'] as const)
      let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
      for (const side of order) {
        const needed = side === 'bottom' || side === 'top' ? TIP_H : TIP_W
        if (room[side] > needed + GAP) {
          placement = side
          break
        }
      }

      let top = 0,
        left = 0
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      if (placement === 'bottom') {
        top = r.bottom + GAP + spotlightPadding
        left = Math.max(12, Math.min(cx - TIP_W / 2, window.innerWidth - TIP_W - 12))
      } else if (placement === 'top') {
        top = r.top - GAP - spotlightPadding - TIP_H
        left = Math.max(12, Math.min(cx - TIP_W / 2, window.innerWidth - TIP_W - 12))
      } else if (placement === 'right') {
        top = Math.max(12, Math.min(cy - TIP_H / 2, window.innerHeight - TIP_H - 12))
        left = r.right + GAP + spotlightPadding
      } else {
        top = Math.max(12, Math.min(cy - TIP_H / 2, window.innerHeight - TIP_H - 12))
        left = r.left - GAP - spotlightPadding - TIP_W
      }
      setTooltipPos({ top, left, placement })
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [open, step, steps, spotlightPadding])

  // Keyboard nav while open.
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close('skip')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, next, prev, close])

  if (typeof document === 'undefined') return null
  const current = steps[step]
  const isLast = step === steps.length - 1

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          key="tour-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none fixed inset-0 z-[200]"
        >
          {/* The cutout — one positioned div whose box-shadow dims everything
              outside its rect. Animating top/left/width/height with a CSS
              transition makes the spotlight slide between targets. */}
          <div
            aria-hidden
            className="pointer-events-auto absolute transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: spotlightRadius,
              boxShadow: `0 0 0 9999px rgba(0,0,0,${overlayOpacity})`,
              outline: `2px solid ${accent}55`,
              outlineOffset: 0,
            }}
            onClick={() => close('skip')}
          />

          {/* Soft accent ring + glow around the cutout */}
          <div
            aria-hidden
            className="pointer-events-none absolute transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: spotlightRadius,
              boxShadow: `0 0 0 1px ${accent}, 0 0 40px 4px ${accent}55`,
            }}
          />

          {/* Tooltip card */}
          <motion.div
            ref={tooltipRef}
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={SPRING}
            className={cn(
              'pointer-events-auto absolute w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl shadow-black/60 outline-none backdrop-blur',
            )}
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transition: 'top 350ms cubic-bezier(0.22,1,0.36,1), left 350ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                  Step {step + 1} / {steps.length}
                </p>
                <h3 className="mt-1 font-display text-[14px] font-semibold tracking-tight text-white">
                  {current.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => close('skip')}
                aria-label="Close tour"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
            {current.description && (
              <p className="mt-2 text-[12.5px] leading-snug text-white/65">
                {current.description}
              </p>
            )}

            {/* Step dots */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="block h-1 rounded-full transition-all"
                    style={{
                      width: i === step ? 16 : 5,
                      background:
                        i === step
                          ? accent
                          : i < step
                            ? `${accent}66`
                            : 'rgba(255,255,255,0.12)',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => close('skip')}
                  className="rounded-md px-2 py-1 text-[11px] font-medium text-white/45 transition-colors hover:text-white/85"
                >
                  {skipLabel}
                </button>
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 0}
                  aria-label="Previous step"
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-white/65 transition-colors',
                    'hover:border-white/25 hover:bg-white/[0.08] hover:text-white',
                    'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-white/[0.04] disabled:hover:text-white/65',
                  )}
                >
                  <ArrowLeft className="h-3 w-3" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[11.5px] font-semibold tracking-tight text-black transition-transform hover:scale-[1.03]"
                  style={{ background: accent }}
                >
                  {isLast ? doneLabel : 'Next'}
                  {!isLast && <ArrowRight className="h-3 w-3" strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
