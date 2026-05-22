'use client'

/**
 * <OrbitalMenu />
 *
 * A central toggle button that, when activated, fans its menu items
 * outward along an arc — like a radial speed-dial or a FAB with
 * options. Each item springs into position with a per-item delay so
 * the menu unfurls rather than popping all at once.
 *
 * The geometry:
 *  - All items are positioned at the SAME (0, 0) when closed (under
 *    the trigger).
 *  - When open, item `i` is translated by
 *      (radius × cos θᵢ, radius × sin θᵢ)
 *    where θᵢ is its evenly-spaced angle along the chosen arc.
 *  - Arc direction is configurable: 'top', 'right', 'bottom', 'left',
 *    or a full 'circle'. Top is a half-circle going up; right goes
 *    right; etc.
 *
 * Pointer events: click trigger toggles, click outside closes, Escape
 * closes. Tabbable items inside follow the same flow.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrbitalMenuItem {
  id: string
  /** Icon — usually a Lucide component instance. */
  icon: React.ReactNode
  /** Visible label shown next to the item when hovered/focused. */
  label?: string
  /** Click handler. */
  onClick?: () => void
  /** Optional accent color (defaults to the menu's accent). */
  accent?: string
}

export interface OrbitalMenuProps {
  items: OrbitalMenuItem[]
  /**
   * Direction the menu fans out:
   *  - 'top'    → 180° arc going up (default)
   *  - 'right'  → 180° arc going right
   *  - 'bottom' → 180° arc going down
   *  - 'left'   → 180° arc going left
   *  - 'circle' → full 360°
   */
  direction?: 'top' | 'right' | 'bottom' | 'left' | 'circle'
  /** Radius of the arc in px. Default 110. */
  radius?: number
  /** Icon shown on the trigger button. Default `<Plus />`. */
  triggerIcon?: React.ReactNode
  /** ARIA label for the trigger. */
  triggerLabel?: string
  /** Accent color used for the trigger + item rings. Default '#A78BFA'. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 22,
  mass: 0.55,
}

export function OrbitalMenu({
  items,
  direction = 'top',
  radius = 110,
  triggerIcon = <Plus className="h-5 w-5" strokeWidth={2.25} />,
  triggerLabel = 'Open menu',
  accentColor = '#A78BFA',
  className,
}: OrbitalMenuProps) {
  const [open, setOpen] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  // Close on outside-click + Escape.
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
  }, [open])

  // ---- Geometry -----------------------------------------------------
  // Per-item angle along the chosen arc, in radians, with 0 = "to the
  // right" (standard math convention). Y in CSS grows downward, so we
  // negate sin for the offset calc later.
  const N = items.length
  const arcByDir: Record<NonNullable<OrbitalMenuProps['direction']>, [number, number]> = {
    top:    [Math.PI, 0],              // 180° → 0° (sweeping over the top)
    right:  [Math.PI * 1.5, Math.PI / 2], // -90° → 90° (sweeping over the right)
    bottom: [0, Math.PI],              // 0° → 180° (sweeping under)
    left:   [Math.PI * 0.5, Math.PI * 1.5], // 90° → 270° (sweeping over the left)
    circle: [0, Math.PI * 2],          // full ring
  }
  const [start, end] = arcByDir[direction]
  const angleFor = (i: number) => {
    if (direction === 'circle') {
      return (i / N) * Math.PI * 2
    }
    if (N === 1) return (start + end) / 2
    return start + ((end - start) * i) / (N - 1)
  }

  return (
    <div
      ref={wrapperRef}
      className={cn('relative inline-flex items-center justify-center', className)}
    >
      {/* Items */}
      <AnimatePresence>
        {open &&
          items.map((item, i) => {
            const θ = angleFor(i)
            // Subtract sin because CSS Y goes down.
            const dx = Math.cos(θ) * radius
            const dy = -Math.sin(θ) * radius
            const accent = item.accent ?? accentColor
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
                aria-label={item.label}
                title={item.label}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                animate={{ x: dx, y: dy, opacity: 1, scale: 1 }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                transition={{ ...SPRING, delay: i * 0.035 }}
                className="group/oi pointer-events-auto absolute inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-zinc-900/90 text-white/85 shadow-lg shadow-black/40 backdrop-blur-md transition-colors hover:border-white/25 hover:bg-zinc-800 hover:text-white"
              >
                {/* Optional accent dot in the corner — sets the item
                    apart by colour without painting a neon halo. */}
                <span
                  aria-hidden
                  className="absolute right-1 top-1 h-1 w-1 rounded-full"
                  style={{ background: accent }}
                />
                {item.icon}
                {/* Floating label */}
                {item.label && (
                  <span
                    className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/75 opacity-0 backdrop-blur transition-opacity group-hover/oi:opacity-100"
                  >
                    {item.label}
                  </span>
                )}
              </motion.button>
            )
          })}
      </AnimatePresence>

      {/* Trigger — solid accent, soft polished sheen, no glow */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={triggerLabel}
        aria-expanded={open}
        className={cn(
          'relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 text-white shadow-lg shadow-black/40 transition-transform active:scale-95',
        )}
        style={{
          // Solid fill with a subtle radial highlight at the top-left
          // so it reads as polished rather than flat — no outer glow.
          background: `radial-gradient(circle at 30% 28%, ${accentColor}, ${accentColor}d9 70%)`,
        }}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={SPRING}
          className="inline-flex items-center justify-center"
        >
          {triggerIcon}
        </motion.span>
      </button>
    </div>
  )
}
