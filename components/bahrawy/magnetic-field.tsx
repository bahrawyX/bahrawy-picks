'use client'

/**
 * <MagneticField />
 *
 * A pinned scroll section that combines two motion sources rarely used
 * together:
 *
 *  1. Cursor magnetism — every dot in a dense grid is gently pushed away
 *     from your cursor with a spring. Move the mouse and the field
 *     deforms around it.
 *
 *  2. Scroll wave — a horizontal accent line sweeps from the top of the
 *     viewport to the bottom as you scroll the section. Dots within its
 *     vertical neighbourhood scale up and glow in the accent color,
 *     creating a travelling band of energy.
 *
 * On top of the field, a stack of large headlines is positioned at
 * evenly-spaced vertical points. As the wave reaches each one, the line
 * locks in (fade + lift + scale). Once the wave has passed every line,
 * a description and CTA fade in to close the section.
 *
 * The dot field is canvas-driven (devicePixelRatio-aware) so a 26×N grid
 * stays smooth even on lower-end laptops. Text is plain DOM so it's
 * fully accessible and selectable.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MagneticFieldLine {
  /** The headline text (or any node). */
  text: React.ReactNode
  /** Optional tiny eyebrow above this specific line. */
  eyebrow?: React.ReactNode
}

export interface MagneticFieldCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface MagneticFieldProps {
  /** Vertical stack of headlines the wave reveals in order. */
  lines: MagneticFieldLine[]
  /** Tiny tag above the whole stack. */
  eyebrow?: React.ReactNode
  /** Sub-copy that fades in once every line has locked in. */
  description?: React.ReactNode
  /** Final CTA. */
  cta?: MagneticFieldCta
  /** Pin duration in viewport heights. Default 3. */
  scrollLength?: number
  /** Accent color — wave + dot glow + eyebrow dot. Default #22D3EE. */
  accentColor?: string
  /** Dot grid columns. Default 26. Rows derive from viewport ratio. */
  gridDensity?: number
  /** Cursor magnet radius in px. Default 150. */
  magnetRadius?: number
  /** Cursor repulsion strength in px. Default 32. */
  magnetStrength?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Hex → [r, g, b]. Accepts #RGB or #RRGGBB. */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  if (Number.isNaN(n)) return [255, 255, 255]
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

interface Dot {
  /** Base (resting) position. */
  bx: number
  by: number
  /** Current rendered position. */
  x: number
  y: number
  /** Velocity (for the magnetic spring). */
  vx: number
  vy: number
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MagneticField({
  lines,
  eyebrow,
  description,
  cta,
  scrollLength = 3,
  accentColor = '#22D3EE',
  gridDensity = 26,
  magnetRadius = 150,
  magnetStrength = 32,
  className,
}: MagneticFieldProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const lineRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const descRef = React.useRef<HTMLParagraphElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  // Mutable state read by the canvas render loop.
  const progressRef = React.useRef(0)
  const mouseRef = React.useRef({ x: -9999, y: -9999, active: false })
  const dotsRef = React.useRef<Dot[]>([])
  const dimsRef = React.useRef({ w: 0, h: 0, cols: 0, rows: 0, spacing: 0 })
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current || !canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const [ar, ag, ab] = hexToRgb(accentColor)

      // ----------------------------------------------------------------
      // Initial element states
      // ----------------------------------------------------------------
      // Reduced motion: reveals become pure opacity fades (no lift/scale).
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: reduced ? 0 : 10 })
      lineRefs.current.forEach((el) => {
        if (el)
          gsap.set(el, {
            autoAlpha: 0.06,
            y: reduced ? 0 : 22,
            scale: reduced ? 1 : 0.94,
          })
      })
      if (descRef.current)
        gsap.set(descRef.current, { autoAlpha: 0, y: reduced ? 0 : 12 })
      if (ctaRef.current)
        gsap.set(ctaRef.current, { autoAlpha: 0, y: reduced ? 0 : 12 })

      // ----------------------------------------------------------------
      // Canvas sizing + dot lattice (recomputed on resize)
      // ----------------------------------------------------------------
      const resize = () => {
        if (!pinRef.current) return
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        const rect = pinRef.current.getBoundingClientRect()
        const w = rect.width
        const h = rect.height
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const cols = gridDensity
        const spacing = w / cols
        const rows = Math.ceil(h / spacing) + 1
        dimsRef.current = { w, h, cols, rows, spacing }

        const dots: Dot[] = []
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Stagger every other row by half a column so it doesn't read
            // as a flat grid — feels more like a field.
            const offset = r % 2 === 0 ? 0 : spacing / 2
            const bx = c * spacing + spacing / 2 + offset
            const by = r * spacing + spacing / 2
            dots.push({ bx, by, x: bx, y: by, vx: 0, vy: 0 })
          }
        }
        dotsRef.current = dots
      }
      resize()
      window.addEventListener('resize', resize)

      // ----------------------------------------------------------------
      // Pointer tracking
      // ----------------------------------------------------------------
      const onMove = (e: PointerEvent) => {
        if (!pinRef.current) return
        const rect = pinRef.current.getBoundingClientRect()
        mouseRef.current.x = e.clientX - rect.left
        mouseRef.current.y = e.clientY - rect.top
        mouseRef.current.active = true
      }
      const onLeave = () => {
        mouseRef.current.active = false
      }
      // No cursor magnetism when reduced motion is preferred.
      if (!reduced) {
        pinRef.current.addEventListener('pointermove', onMove)
        pinRef.current.addEventListener('pointerleave', onLeave)
      }

      // ----------------------------------------------------------------
      // Pin + drive progress
      // ----------------------------------------------------------------
      // Assigned below once the draw loop exists — lets the reduced-motion
      // path redraw a single static frame on scroll updates.
      let drawFrame: (() => void) | null = null
      const pinST = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${scrollLength * window.innerHeight}`,
        pin: pinRef.current,
        scrub: 0.3,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
          if (reduced) drawFrame?.()
        },
      })

      // ----------------------------------------------------------------
      // Content stage triggers — each line lights up when the wave passes
      // ----------------------------------------------------------------
      const N = lines.length
      // The wave is at viewport-Y = progress * viewportHeight. The lines
      // are stacked centrally and bunched, so we trigger them at evenly
      // spaced scroll progress instead of trying to read DOM positions.
      const stagesST: ScrollTrigger[] = []
      lines.forEach((_, i) => {
        const stageProgress = N === 1 ? 0.5 : 0.18 + (i / (N - 1)) * 0.55
        const startPx = Math.max(0, stageProgress * scrollLength - 0.15) // viewports
        const endPx = stageProgress * scrollLength
        const tween = gsap.to(lineRefs.current[i], {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${startPx * window.innerHeight} top`,
            end: () => `top+=${endPx * window.innerHeight} top`,
            toggleActions: 'play none none reverse',
          },
        })
        if (tween.scrollTrigger) stagesST.push(tween.scrollTrigger)
      })

      // Eyebrow lands very early.
      let eyebrowST: ScrollTrigger | undefined
      if (eyebrowRef.current) {
        const t = gsap.to(eyebrowRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `top+=${0.4 * window.innerHeight} top`,
            toggleActions: 'play none none reverse',
          },
        })
        eyebrowST = t.scrollTrigger
      }

      // Description + CTA right at the end.
      let descST: ScrollTrigger | undefined
      if (descRef.current) {
        const t = gsap.to(descRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${0.88 * scrollLength * window.innerHeight} top`,
            end: () => `top+=${0.96 * scrollLength * window.innerHeight} top`,
            toggleActions: 'play none none reverse',
          },
        })
        descST = t.scrollTrigger
      }
      let ctaST: ScrollTrigger | undefined
      if (ctaRef.current) {
        const t = gsap.to(ctaRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${0.92 * scrollLength * window.innerHeight} top`,
            end: () => `top+=${scrollLength * window.innerHeight} top`,
            toggleActions: 'play none none reverse',
          },
        })
        ctaST = t.scrollTrigger
      }

      // ----------------------------------------------------------------
      // RAF draw loop — runs every frame. With reduced motion there is
      // no loop: a single static frame is drawn (dots at rest, no spring
      // physics), redrawn only when scroll moves the wave.
      // ----------------------------------------------------------------
      let raf = 0
      const draw = () => {
        const { w, h } = dimsRef.current
        if (w === 0 || h === 0) {
          if (!reduced) raf = requestAnimationFrame(draw)
          return
        }

        const progress = progressRef.current
        // The wave dips into the viewport from above and exits below so
        // every dot row gets touched.
        const waveY = -h * 0.08 + progress * (h * 1.16)

        ctx.clearRect(0, 0, w, h)

        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const active = mouseRef.current.active

        // Soft horizontal accent band — drawn first so dots sit on top.
        const bandHalf = h * 0.18
        const bandGrad = ctx.createLinearGradient(0, waveY - bandHalf, 0, waveY + bandHalf)
        bandGrad.addColorStop(0, `rgba(${ar},${ag},${ab},0)`)
        bandGrad.addColorStop(0.5, `rgba(${ar},${ag},${ab},0.14)`)
        bandGrad.addColorStop(1, `rgba(${ar},${ag},${ab},0)`)
        ctx.fillStyle = bandGrad
        ctx.fillRect(0, waveY - bandHalf, w, bandHalf * 2)

        // The wave line itself.
        ctx.save()
        ctx.shadowBlur = 20
        ctx.shadowColor = accentColor
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.85)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, waveY)
        ctx.lineTo(w, waveY)
        ctx.stroke()
        ctx.restore()

        // Dots
        const dots = dotsRef.current
        const len = dots.length
        const waveBand = h * 0.12 // dots within this Y-distance of the wave light up
        const radiusSq = magnetRadius * magnetRadius
        for (let i = 0; i < len; i++) {
          const d = dots[i]
          let tx = d.bx
          let ty = d.by
          if (active) {
            const dx = d.bx - mx
            const dy = d.by - my
            const distSq = dx * dx + dy * dy
            if (distSq < radiusSq && distSq > 0.0001) {
              const dist = Math.sqrt(distSq)
              const t = 1 - dist / magnetRadius
              const k = t * t // ease-in repulsion
              tx += (dx / dist) * k * magnetStrength
              ty += (dy / dist) * k * magnetStrength
            }
          }
          if (reduced) {
            // Static frame — dots sit at their resting positions.
            d.x = tx
            d.y = ty
            d.vx = 0
            d.vy = 0
          } else {
            // Spring step (semi-implicit Euler with damping).
            d.vx += (tx - d.x) * 0.18
            d.vy += (ty - d.y) * 0.18
            d.vx *= 0.78
            d.vy *= 0.78
            d.x += d.vx
            d.y += d.vy
          }

          // Wave proximity → boost
          const waveDist = Math.abs(d.y - waveY)
          const wave = Math.max(0, 1 - waveDist / waveBand)

          const r = 1.05 + wave * 2.2
          if (wave > 0.02) {
            const alpha = 0.4 + wave * 0.55
            ctx.shadowBlur = wave * 12
            ctx.shadowColor = accentColor
            ctx.fillStyle = `rgba(${ar},${ag},${ab},${alpha})`
          } else {
            ctx.shadowBlur = 0
            ctx.fillStyle = 'rgba(255,255,255,0.22)'
          }
          ctx.beginPath()
          ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
          ctx.fill()
        }
        // Reset shadow so the next frame's gradient isn't tainted.
        ctx.shadowBlur = 0

        if (!reduced) raf = requestAnimationFrame(draw)
      }
      drawFrame = draw
      if (reduced) {
        draw()
      } else {
        raf = requestAnimationFrame(draw)
      }

      // ----------------------------------------------------------------
      // Cleanup
      // ----------------------------------------------------------------
      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
        pinRef.current?.removeEventListener('pointermove', onMove)
        pinRef.current?.removeEventListener('pointerleave', onLeave)
        pinST.kill()
        stagesST.forEach((s) => s.kill())
        eyebrowST?.kill()
        descST?.kill()
        ctaST?.kill()
      }
    },
    {
      scope: sectionRef,
      dependencies: [
        lines,
        scrollLength,
        accentColor,
        gridDensity,
        magnetRadius,
        magnetStrength,
        reduced,
      ],
    },
  )

  // For SR + crawlers, the sentence formed by the lines is the meaningful
  // content.
  const ariaLabel = lines
    .map((l) => (typeof l.text === 'string' ? l.text : ''))
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-[#06070a]', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Canvas dot field */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        {/* Edge vignette so the dots fall off into the corners */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 80% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 90%)',
          }}
        />

        {/* Content layer */}
        <div
          className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-7 px-6 text-center sm:px-10"
          role="region"
          aria-label={ariaLabel || undefined}
        >
          {eyebrow && (
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/85 backdrop-blur"
            >
              <span
                aria-hidden
                className="block h-1.5 w-1.5 rounded-full"
                style={{
                  background: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
              />
              {eyebrow}
            </div>
          )}

          {/* Stacked lines */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            {lines.map((line, i) => (
              <div
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el
                }}
                className="text-balance font-semibold leading-[0.95] tracking-tight text-white"
                style={{
                  fontSize: 'clamp(38px, 7.4vw, 100px)',
                  letterSpacing: '-0.035em',
                  textShadow: `0 0 32px ${accentColor}55, 0 0 80px ${accentColor}22`,
                }}
              >
                {line.eyebrow && (
                  <span
                    className="mb-1 block text-[10px] font-medium uppercase tracking-[0.32em] text-white/55"
                    style={{ textShadow: 'none' }}
                  >
                    {line.eyebrow}
                  </span>
                )}
                {line.text}
              </div>
            ))}
          </div>

          {description && (
            <p
              ref={descRef}
              className="max-w-lg text-pretty text-sm leading-relaxed text-white/65 sm:text-base"
            >
              {description}
            </p>
          )}

          {cta && (
            <div ref={ctaRef}>
              <a
                href={cta.href ?? '#'}
                onClick={cta.onClick}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                style={{
                  boxShadow: `0 0 30px ${accentColor}40, 0 0 60px ${accentColor}22`,
                }}
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          )}
        </div>

        {/* Tiny hint */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/45"
        >
          Move + scroll
        </div>
      </div>
    </div>
  )
}
