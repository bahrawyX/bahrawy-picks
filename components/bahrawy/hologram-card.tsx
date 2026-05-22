'use client'

/**
 * <HologramCard />
 *
 * A trading-card-sized panel with a holographic-foil effect on top
 * of the artwork. As the cursor moves over the card:
 *
 *  - The card tilts in 3D (`rotateX` / `rotateY`) around its centre.
 *  - An iridescent gradient overlay shifts its angle and brightness
 *    with the cursor — like real foil catching light from a moving
 *    source. Two layered gradients (rainbow + diagonal lines) blend
 *    together for that lenticular feel.
 *  - A specular highlight (radial spot) follows the cursor as if
 *    it's reflecting off polished card stock.
 *
 * No glow anywhere — every effect is colour shift, blend mode, or
 * gradient angle. Iridescence ≠ neon.
 *
 * One RAF loop drives the tilt + gradient angle from a lerp-eased
 * mouse position. Pointer-leave snaps everything back to neutral.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HologramCardProps {
  /** Card artwork (image URL). */
  image: string
  /** Optional alt text. */
  alt?: string
  /** Headline rendered on the card. */
  title?: React.ReactNode
  /** Tiny eyebrow above the title. */
  eyebrow?: React.ReactNode
  /** Bottom-row meta — left side. */
  metaLeft?: React.ReactNode
  /** Bottom-row meta — right side. */
  metaRight?: React.ReactNode
  /**
   * Maximum tilt in degrees at the card's corners. 0 disables tilt.
   * Default 16.
   */
  tilt?: number
  /**
   * Foil intensity 0–1 — how bright the iridescent overlay gets at
   * its peak. Default 0.55.
   */
  foilStrength?: number
  /** Card aspect-ratio. Default '2.5 / 3.5' (real trading-card). */
  aspect?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HologramCard({
  image,
  alt = '',
  title,
  eyebrow,
  metaLeft,
  metaRight,
  tilt = 16,
  foilStrength = 0.55,
  aspect = '2.5 / 3.5',
  className,
}: HologramCardProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const foilRef = React.useRef<HTMLDivElement>(null)
  const sheenRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const card = cardRef.current
    const foil = foilRef.current
    const sheen = sheenRef.current
    if (!wrap || !card || !foil || !sheen) return

    // Mouse position normalised to [-1, 1] across the card.
    let mx = 0
    let my = 0
    let cx = 0
    let cy = 0
    let active = false

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width) * 2 - 1
      my = ((e.clientY - r.top) / r.height) * 2 - 1
      active = true
    }
    const onLeave = () => {
      mx = 0
      my = 0
      active = false
    }
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)

    let raf = 0
    const tick = () => {
      // Smooth toward target.
      cx += (mx - cx) * 0.12
      cy += (my - cy) * 0.12

      // Card tilt.
      const rotY = cx * tilt
      const rotX = -cy * tilt
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`

      // Foil — shift the gradient angle (45° + cursor-driven) and
      // background-position so colours sweep across the surface.
      const angle = 110 + cx * 30
      const posX = 50 + cx * 50
      const posY = 50 + cy * 50
      foil.style.backgroundImage = `
        linear-gradient(${angle}deg,
          hsla(0, 100%, 70%, ${foilStrength}) 0%,
          hsla(45, 100%, 70%, ${foilStrength * 0.85}) 16%,
          hsla(120, 100%, 70%, ${foilStrength * 0.95}) 33%,
          hsla(180, 100%, 70%, ${foilStrength}) 50%,
          hsla(240, 100%, 70%, ${foilStrength * 0.95}) 66%,
          hsla(290, 100%, 70%, ${foilStrength * 0.85}) 83%,
          hsla(360, 100%, 70%, ${foilStrength}) 100%
        ),
        repeating-linear-gradient(${angle + 10}deg,
          rgba(255,255,255,0.10) 0px,
          rgba(255,255,255,0.10) 1px,
          transparent 1px,
          transparent 4px
        )`
      foil.style.backgroundSize = '200% 200%, auto'
      foil.style.backgroundPosition = `${posX}% ${posY}%, 0 0`
      foil.style.opacity = String(active ? 1 : 0.45)

      // Specular sheen — soft spotlight at the cursor.
      sheen.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255,255,255,${active ? 0.4 : 0.15}) 0%, transparent 55%)`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [tilt, foilStrength])

  return (
    <div
      ref={wrapRef}
      className={cn('relative w-full max-w-[360px]', className)}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-[18px] border border-white/15 bg-zinc-950 shadow-2xl shadow-black/60"
        style={{
          aspectRatio: aspect,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Artwork */}
        <img
          src={image}
          alt={alt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Holographic foil — colour-shifting rainbow + diagonal lines */}
        <div
          ref={foilRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            mixBlendMode: 'color-dodge',
            willChange: 'opacity, background-position',
          }}
        />

        {/* Specular sheen — small radial spotlight following the cursor */}
        <div
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ mixBlendMode: 'screen', willChange: 'background' }}
        />

        {/* Edge vignette to seat the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 50%, transparent 60%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Content — eyebrow + title at top-left, meta at bottom */}
        {(eyebrow || title) && (
          <div className="absolute inset-x-0 top-0 flex flex-col items-start gap-1 p-4 sm:p-5">
            {eyebrow && (
              <p className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/85 backdrop-blur">
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className="text-balance text-lg font-semibold leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:text-xl">
                {title}
              </h3>
            )}
          </div>
        )}
        {(metaLeft || metaRight) && (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-[11px] uppercase tracking-[0.18em] text-white/80 sm:p-5">
            <span>{metaLeft}</span>
            <span className="font-mono tabular-nums">{metaRight}</span>
          </div>
        )}
      </div>
    </div>
  )
}
