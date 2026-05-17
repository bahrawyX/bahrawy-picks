'use client'

/**
 * <FloatingDock />
 *
 * macOS-style dock that magnifies icons near the cursor. Uses Framer Motion
 * `useMotionValue` and `useTransform` for smooth, GPU-accelerated animation.
 *
 * Icons grow in actual width/height so neighbors push apart naturally.
 * The dock bar keeps a fixed height — icons overflow upward past the top.
 *
 * @param items         — Array of dock items ({ icon, label, href?, onClick? }).
 * @param magnification — Max scale multiplier on hover. Default 1.4.
 * @param distance      — Pixel distance from cursor center to start scaling. Default 140.
 * @param className     — Additional classes for the dock bar.
 */

import * as React from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DockItem {
  /** Dock icon (ReactNode — typically an SVG or Lucide icon). */
  icon: React.ReactNode
  /** Tooltip label. */
  label: string
  /** If provided, renders as a link. */
  href?: string
  /** Click handler. */
  onClick?: () => void
}

export interface FloatingDockProps {
  items: DockItem[]
  /** Max scale on hover. */
  magnification?: number
  /** Pixel distance from cursor center to begin scaling. */
  distance?: number
  /** Additional classes for the dock bar. */
  className?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_SIZE = 40

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FloatingDock({
  items,
  magnification = 1.4,
  distance = 140,
  className,
}: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'inline-flex h-[52px] items-end gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 pb-[6px] shadow-2xl shadow-black/50 backdrop-blur-xl',
        className
      )}
      style={{ overflow: 'visible' }}
    >
      {items.map((item) => (
        <DockIcon
          key={item.label}
          mouseX={mouseX}
          magnification={magnification}
          distance={distance}
          {...item}
        />
      ))}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Dock Icon
// ---------------------------------------------------------------------------

function DockIcon({
  icon,
  label,
  href,
  onClick,
  mouseX,
  magnification,
  distance,
}: DockItem & {
  mouseX: MotionValue<number>
  magnification: number
  distance: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = React.useState(false)

  // Compute size directly from mouseX — callback form so distance &
  // magnification changes take effect immediately (no stale closure).
  const sizeRaw = useTransform(mouseX, (val) => {
    const el = ref.current
    if (!el) return BASE_SIZE
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    const d = Math.abs(val - center)
    if (d >= distance) return BASE_SIZE
    // Linear tent: base → peak → base
    const ratio = 1 - d / distance
    return BASE_SIZE + BASE_SIZE * (magnification - 1) * ratio
  })
  const size = useSpring(sizeRaw, { stiffness: 350, damping: 25, mass: 0.5 })

  const Wrapper = href ? 'a' : 'button'
  const wrapperProps = href
    ? { href, target: '_blank' as const, rel: 'noreferrer noopener' }
    : { onClick, type: 'button' as const }

  return (
    <Wrapper
      {...(wrapperProps as Record<string, unknown>)}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      {hovered && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm"
        >
          {label}
        </motion.span>
      )}

      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#1a1a1a] text-white/80 transition-colors hover:bg-[#222]"
      >
        {icon}
      </motion.div>
    </Wrapper>
  )
}
