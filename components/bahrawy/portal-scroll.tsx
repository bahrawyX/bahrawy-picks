'use client'

/**
 * <PortalScroll />
 *
 * A pinned scroll section built around one image metaphor: you are
 * standing *outside* a scene, and a circular portal opens in the middle
 * of the viewport to reveal a completely different scene inside. Keep
 * scrolling and the portal grows until it has consumed the whole screen
 * — you have "stepped through."
 *
 * Refined Apple / Emil Kowalski taste:
 *  - No neon glow, no accent-colored shadows
 *  - The portal edge is a single white hairline at 8% opacity
 *  - The scan dot is a small plain white dot with a soft drop shadow
 *  - Everything else (parallax, letter-by-letter reveal, scroll-pinned
 *    grow) is preserved
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

export interface PortalScrollScene {
  /** Background image src. */
  image: string
  /** Optional alt text. Defaults to title. */
  alt?: string
  /** Tiny tag rendered above the headline. */
  eyebrow?: React.ReactNode
  /** The main headline shown in this scene. */
  title: React.ReactNode
  /** Sub-copy under the headline. */
  subtitle?: React.ReactNode
}

export interface PortalScrollCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface PortalScrollProps {
  /** What the viewer sees BEFORE the portal opens. */
  outer: PortalScrollScene
  /** What is revealed INSIDE the portal. The `title` is split into
   * letters and revealed staggered, so prefer a short string. */
  inner: PortalScrollScene
  /** Optional CTA shown in the inner scene at the very end. */
  cta?: PortalScrollCta
  /** Pin duration in viewport heights. Default 3.5. */
  scrollLength?: number
  /**
   * Shape of the portal mask.
   *  - 'circle'  (default) → a growing circle, classic spotlight feel
   *  - 'diamond'           → a growing diamond (rotated square),
   *    sharper and more architectural
   */
  shape?: 'circle' | 'diamond'
  /**
   * Optional accent tint (hex / css color) for the portal rim: the
   * hairline outline, the orbiting scan dot, and the small scroll-hint
   * dot in the outer scene. No glow or shadow — just a tint. Default
   * is plain white.
   */
  accentColor?: string
  /** Strength of cursor parallax inside the portal, in px. Default 28. */
  parallaxStrength?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Split a title into per-character refs. Preserves spaces. */
function titleChars(title: React.ReactNode): string[] {
  if (typeof title !== 'string') return []
  return [...title]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PortalScroll({
  outer,
  inner,
  cta,
  scrollLength = 3.5,
  shape = 'circle',
  accentColor,
  parallaxStrength = 28,
  className,
}: PortalScrollProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)

  // Outer scene
  const outerWrapRef = React.useRef<HTMLDivElement>(null)
  const outerImgRef = React.useRef<HTMLImageElement>(null)
  const outerContentRef = React.useRef<HTMLDivElement>(null)
  const outerHintRef = React.useRef<HTMLDivElement>(null)

  // Inner scene (clipped to a growing circle)
  const innerLayerRef = React.useRef<HTMLDivElement>(null)
  const innerBgRef = React.useRef<HTMLDivElement>(null) // cursor parallax
  const innerContentRef = React.useRef<HTMLDivElement>(null) // cursor parallax (opposite)
  const innerEyebrowRef = React.useRef<HTMLDivElement>(null)
  const innerLetterRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const innerSubRef = React.useRef<HTMLParagraphElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  // Rim
  const rimRef = React.useRef<HTMLDivElement>(null)

  // Imperative state
  const radiusObj = React.useRef({ value: 0 })
  const maxRRef = React.useRef(0)
  const mouseRef = React.useRef({ x: 0, y: 0 })

  const chars = React.useMemo(() => titleChars(inner.title), [inner.title])
  const reduced = usePrefersReducedMotion()
  // Faint cue color for the outer scroll hint. Default is plain white.
  const hintColor = accentColor ?? 'rgba(255,255,255,0.7)'
  // Rim tint — hairline outline stays faint, scan dot stays solid.
  const rimBorderStyle = accentColor
    ? { borderColor: `color-mix(in srgb, ${accentColor} 35%, transparent)` }
    : undefined
  const scanDotColor = accentColor ?? '#ffffff'

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // ------------------------------------------------------------------
      // Compute the max portal radius. The two shapes have different
      // requirements to fully cover the viewport:
      //  - circle:  radius = hypot(vw, vh) / 2  (reaches the corners)
      //  - diamond: |x| + |y| ≤ R  →  R = (vw + vh) / 2  (edges cover
      //                                  the corners; ~36% larger)
      // ------------------------------------------------------------------
      const computeMaxR = () => {
        if (shape === 'diamond') {
          maxRRef.current =
            (window.innerWidth + window.innerHeight) / 2 + 60
        } else {
          maxRRef.current =
            Math.hypot(window.innerWidth, window.innerHeight) / 2 + 80
        }
      }
      computeMaxR()
      window.addEventListener('resize', computeMaxR)

      // ------------------------------------------------------------------
      // Shape-aware clip-path generator. Used both for the initial
      // state and the per-frame update.
      // ------------------------------------------------------------------
      const makeClipPath = (r: number): string => {
        if (shape === 'diamond') {
          const layer = innerLayerRef.current
          // Fallback to window dims if the layer isn't measured yet.
          const lw = layer?.offsetWidth || window.innerWidth
          const lh = layer?.offsetHeight || window.innerHeight
          const cx = lw / 2
          const cy = lh / 2
          // Vertices: top, right, bottom, left.
          return `polygon(${cx}px ${cy - r}px, ${cx + r}px ${cy}px, ${cx}px ${cy + r}px, ${cx - r}px ${cy}px)`
        }
        return `circle(${r}px at 50% 50%)`
      }

      const setClipPath = (cp: string) => {
        if (!innerLayerRef.current) return
        innerLayerRef.current.style.clipPath = cp
        ;(innerLayerRef.current.style as unknown as {
          WebkitClipPath?: string
        }).WebkitClipPath = cp
      }

      // ------------------------------------------------------------------
      // Initial element states
      // ------------------------------------------------------------------
      setClipPath(makeClipPath(0))
      if (rimRef.current) {
        gsap.set(rimRef.current, { width: 0, height: 0, autoAlpha: 0 })
      }
      // When reduced motion is preferred, skip the translate offsets so the
      // scrubbed reveals become pure opacity fades.
      if (innerEyebrowRef.current)
        gsap.set(innerEyebrowRef.current, { autoAlpha: 0, y: reduced ? 0 : 14 })
      innerLetterRefs.current.forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, y: reduced ? 0 : 26 })
      })
      if (innerSubRef.current)
        gsap.set(innerSubRef.current, { autoAlpha: 0, y: reduced ? 0 : 14 })
      if (ctaRef.current)
        gsap.set(ctaRef.current, { autoAlpha: 0, y: reduced ? 0 : 14 })

      // ------------------------------------------------------------------
      // Cursor tracking → parallax loop
      // ------------------------------------------------------------------
      const onPointerMove = (e: PointerEvent) => {
        const cx = window.innerWidth / 2
        const cy = window.innerHeight / 2
        // Normalised to [-1, 1]
        mouseRef.current.x = (e.clientX - cx) / cx
        mouseRef.current.y = (e.clientY - cy) / cy
      }

      let bgX = 0,
        bgY = 0,
        contentX = 0,
        contentY = 0
      let raf = 0
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      const loop = () => {
        const tx = mouseRef.current.x
        const ty = mouseRef.current.y
        // Inner bg moves OPPOSITE the cursor (push-back parallax).
        bgX = lerp(bgX, -tx * parallaxStrength, 0.08)
        bgY = lerp(bgY, -ty * parallaxStrength, 0.08)
        // Inner content moves WITH the cursor, smaller magnitude (foreground).
        contentX = lerp(contentX, tx * parallaxStrength * 0.35, 0.1)
        contentY = lerp(contentY, ty * parallaxStrength * 0.35, 0.1)

        if (innerBgRef.current) {
          innerBgRef.current.style.transform = `translate3d(${bgX}px, ${bgY}px, 0) scale(1.08)`
        }
        if (innerContentRef.current) {
          innerContentRef.current.style.transform = `translate3d(${contentX}px, ${contentY}px, 0)`
        }
        raf = requestAnimationFrame(loop)
      }
      // Skip the pointer-parallax loop entirely when reduced motion is
      // preferred — the inner scene stays put.
      if (!reduced) {
        window.addEventListener('pointermove', onPointerMove)
        raf = requestAnimationFrame(loop)
      }

      // ------------------------------------------------------------------
      // Main timeline — pinned + scrubbed
      // ------------------------------------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          pin: pinRef.current,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1) The portal opens — one tween driving radius + rim size + clip.
      tl.to(
        radiusObj.current,
        {
          value: 1,
          duration: 1,
          ease: 'power2.inOut',
          onUpdate: () => {
            const r = radiusObj.current.value * maxRRef.current
            setClipPath(makeClipPath(r))
            if (rimRef.current) {
              const size = r * 2
              rimRef.current.style.width = `${size}px`
              rimRef.current.style.height = `${size}px`
            }
          },
        },
        0,
      )

      // 2) Rim presence — fade in just after the portal starts opening,
      //    fade out as it consumes the viewport so the rim doesn't fight
      //    the inner content at the end.
      if (rimRef.current) {
        tl.to(
          rimRef.current,
          { autoAlpha: 1, duration: 0.08, ease: 'power2.out' },
          0.04,
        )
        tl.to(
          rimRef.current,
          { autoAlpha: 0, duration: 0.18, ease: 'power2.out' },
          0.82,
        )
      }

      // 3) Outer content fades out as the portal grows past it.
      if (outerContentRef.current) {
        tl.to(
          outerContentRef.current,
          {
            autoAlpha: 0,
            y: reduced ? 0 : -28,
            scale: reduced ? 1 : 0.96,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.18,
        )
      }
      if (outerHintRef.current) {
        tl.to(
          outerHintRef.current,
          { autoAlpha: 0, duration: 0.15 },
          0.12,
        )
      }
      // Outer image pulls back slightly so the new scene feels deeper.
      if (outerImgRef.current && !reduced) {
        tl.to(
          outerImgRef.current,
          { scale: 1.05, duration: 1, ease: 'power2.out' },
          0,
        )
      }

      // 4) Inner content reveals as the portal becomes large enough.
      if (innerEyebrowRef.current) {
        tl.to(
          innerEyebrowRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.42,
        )
      }
      const lettersEls = innerLetterRefs.current.filter(
        (el): el is HTMLSpanElement => Boolean(el),
      )
      if (lettersEls.length) {
        tl.to(
          lettersEls,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.025,
            ease: 'power3.out',
          },
          0.5,
        )
      }
      if (innerSubRef.current) {
        tl.to(
          innerSubRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.82,
        )
      }
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.9,
        )
      }

      // ------------------------------------------------------------------
      // Cleanup
      // ------------------------------------------------------------------
      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('resize', computeMaxR)
      }
    },
    {
      scope: sectionRef,
      dependencies: [
        outer,
        inner,
        cta,
        scrollLength,
        shape,
        accentColor,
        parallaxStrength,
        chars.length,
        reduced,
      ],
    },
  )

  // Best-effort aria-label so screen readers get the inner sentence.
  const ariaLabel =
    typeof inner.title === 'string' ? inner.title : undefined

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-black', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
      aria-label={ariaLabel}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* ─────────────────────────────────────────────────────────
            OUTER scene — what you see before the portal opens.
        ───────────────────────────────────────────────────────── */}
        <div ref={outerWrapRef} className="absolute inset-0">
          <img
            ref={outerImgRef}
            src={outer.image}
            alt={outer.alt ?? (typeof outer.title === 'string' ? outer.title : '')}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            style={{ filter: 'saturate(0.6) blur(1px)', willChange: 'transform' }}
            draggable={false}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 60% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.9) 100%)',
            }}
          />

          <div
            ref={outerContentRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-10"
          >
            {outer.eyebrow && (
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
                {outer.eyebrow}
              </p>
            )}
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-white/80 sm:text-5xl">
              {outer.title}
            </h2>
            {outer.subtitle && (
              <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-white/55 sm:text-base">
                {outer.subtitle}
              </p>
            )}
          </div>

          <div
            ref={outerHintRef}
            aria-hidden
            className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55"
          >
            <span
              className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full"
              style={{ background: hintColor }}
            />
            Scroll to step through
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            INNER scene — visible through a growing circular clip.
        ───────────────────────────────────────────────────────── */}
        <div
          ref={innerLayerRef}
          className="absolute inset-0"
          style={{
            clipPath: 'circle(0px at 50% 50%)',
            WebkitClipPath: 'circle(0px at 50% 50%)',
            willChange: 'clip-path',
          }}
        >
          <div ref={innerBgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
            <img
              src={inner.image}
              alt={inner.alt ?? (typeof inner.title === 'string' ? inner.title : '')}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 70% at 50% 55%, transparent 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.75) 100%)',
              }}
            />
          </div>

          <div
            ref={innerContentRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-10"
            style={{ willChange: 'transform' }}
          >
            {inner.eyebrow && (
              <div
                ref={innerEyebrowRef}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-black/55 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white/85 backdrop-blur sm:mb-6"
              >
                <span
                  aria-hidden
                  className="block h-1.5 w-1.5 rounded-full bg-white/80"
                />
                {inner.eyebrow}
              </div>
            )}

            {chars.length > 0 ? (
              <h2
                className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
                style={{ letterSpacing: '-0.025em' }}
              >
                {chars.map((ch, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      innerLetterRefs.current[i] = el
                    }}
                    className="inline-block"
                    style={
                      ch === ' '
                        ? { whiteSpace: 'pre', width: '0.28em' }
                        : undefined
                    }
                  >
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </h2>
            ) : (
              <h2 className="text-balance font-display text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                {inner.title}
              </h2>
            )}

            {inner.subtitle && (
              <p
                ref={innerSubRef}
                className="mt-5 max-w-lg text-pretty text-sm leading-relaxed text-white/80 sm:text-base"
              >
                {inner.subtitle}
              </p>
            )}

            {cta && (
              <div ref={ctaRef} className="mt-7">
                <a
                  href={cta.href ?? '#'}
                  onClick={cta.onClick}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                >
                  {cta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            RIM — a single hairline white outline at the portal edge,
            plus a small white scan dot riding the perimeter. No glow,
            no accent color, no conic sweep.
        ───────────────────────────────────────────────────────── */}
        <div
          ref={rimRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 0, height: 0 }}
        >
          {shape === 'diamond' ? (
            <>
              <div
                className="absolute left-1/2 top-1/2 border border-white/[0.1]"
                style={{
                  width: '70.71%',
                  height: '70.71%',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  ...rimBorderStyle,
                }}
              />
              <div
                className="bahrawy-portal-diamond-scan absolute rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  marginLeft: -3,
                  marginTop: -3,
                  background: scanDotColor,
                  filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.35))',
                }}
              />
            </>
          ) : (
            <>
              {/* Single hairline outline. */}
              <div
                className="absolute inset-0 rounded-full border border-white/[0.1]"
                style={rimBorderStyle}
              />
              {/* Scan dot orbiting the rim via a rotating wrapper. */}
              <div className="bahrawy-portal-orbit absolute inset-0 rounded-full">
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: scanDotColor,
                    filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.35))',
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Keyframes for the rim animations */}
        <style>{`
          .bahrawy-portal-orbit {
            animation: bahrawy-portal-orbit-kf 4.5s linear infinite;
            will-change: transform;
            transform-origin: 50% 50%;
          }
          .bahrawy-portal-diamond-scan {
            animation: bahrawy-portal-diamond-scan-kf 4.8s linear infinite;
            will-change: left, top;
          }
          @keyframes bahrawy-portal-orbit-kf {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes bahrawy-portal-diamond-scan-kf {
            0%   { left: 50%; top: 0%; }
            25%  { left: 100%; top: 50%; }
            50%  { left: 50%; top: 100%; }
            75%  { left: 0%; top: 50%; }
            100% { left: 50%; top: 0%; }
          }
          @media (prefers-reduced-motion: reduce) {
            .bahrawy-portal-orbit,
            .bahrawy-portal-diamond-scan { animation: none !important; }
          }
        `}</style>
      </div>
    </div>
  )
}
