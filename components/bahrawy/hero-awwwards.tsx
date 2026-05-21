'use client'

/**
 * <HeroAwwwards />
 *
 * The biggest hero in the library. On mount, a GSAP timeline cascades every
 * letter of the headline into place — `rotateX` 55° → 0°, scale 0.7 → 1,
 * y 70 → 0, blur 12 → 0, opacity 0 → 1, stagger 30 ms. After landing, a
 * slow CSS gradient flows through the headline color so it's never static.
 *
 * Background runs three layers, low and soft, so the type can carry it:
 *   1. fixed dot grid that fades at the edges
 *   2. 4 drifting blurred accent blobs (purple / cyan / amber / pink)
 *   3. a soft spotlight that follows the cursor, spring-smoothed
 *
 * Eye-friendly palette by design: cool-leaning pastels at ~50% luminance,
 * never over saturated. Designed to live as the first paint on a landing
 * page and still feel adorable, not loud.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Anton } from 'next/font/google'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Font
// ---------------------------------------------------------------------------

const displayFont = Anton({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HeroAwwwardsProps {
  /** Tiny tag above the headline. */
  eyebrow?: React.ReactNode
  /** Headline — split on spaces, each word stays grouped, each letter
   *  animates individually. */
  title: string
  /** Sub-copy under the headline. */
  description?: React.ReactNode
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  /** Words scrolling along the bottom strip. */
  marquee?: string[]
  /** Two hex colors blended around the cursor. Default purple → cyan. */
  spotlightColors?: [string, string]
  className?: string
}

const DEFAULT_MARQUEE = [
  'React 19',
  'Next.js 15',
  'Tailwind',
  'Framer Motion',
  'GSAP',
  'TypeScript',
  'Open source',
  'MIT',
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroAwwwards({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  marquee = DEFAULT_MARQUEE,
  spotlightColors = ['#A78BFA', '#22D3EE'],
  className,
}: HeroAwwwardsProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const headlineRef = React.useRef<HTMLHeadingElement>(null)
  const sublineRef = React.useRef<HTMLParagraphElement>(null)
  const ctasRef = React.useRef<HTMLDivElement>(null)
  const marqueeRef = React.useRef<HTMLDivElement>(null)

  // Mouse position for the spotlight, spring-smoothed.
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.35)
  const sx = useSpring(mouseX, { stiffness: 180, damping: 28, mass: 0.6 })
  const sy = useSpring(mouseY, { stiffness: 180, damping: 28, mass: 0.6 })
  // Map 0..1 motion values into CSS percent strings (one per axis for each
  // of the two spotlight layers — the second one is offset slightly so the
  // two lobes don't perfectly overlap).
  const xPct = useTransform(sx, (v) => `${v * 100}%`)
  const yPct = useTransform(sy, (v) => `${v * 100}%`)
  const xPct2 = useTransform(sx, (v) => `${(v - 0.15) * 100}%`)
  const yPct2 = useTransform(sy, (v) => `${(v - 0.12) * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(circle 520px at ${xPct} ${yPct}, ${spotlightColors[0]}22, transparent 60%), radial-gradient(circle 380px at ${xPct2} ${yPct2}, ${spotlightColors[1]}1f, transparent 60%)`

  const handleMove = (e: React.MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }

  // Split title into words → words into letters, with stable keys.
  const words = React.useMemo(
    () =>
      title.split(' ').map((word, wi) => ({
        word,
        wi,
        letters: Array.from(word).map((char, li) => ({ char, li })),
      })),
    [title],
  )

  // ── load timeline ────────────────────────────────────────────────
  useGSAP(
    () => {
      const letters = headlineRef.current?.querySelectorAll<HTMLElement>(
        '[data-letter]',
      )
      if (!letters) return

      gsap.set(letters, {
        autoAlpha: 0,
        y: 70,
        scale: 0.7,
        rotateX: 55,
        filter: 'blur(12px)',
        transformOrigin: '50% 100%',
      })
      gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 12 })
      gsap.set(sublineRef.current, { autoAlpha: 0, y: 14 })
      gsap.set(ctasRef.current, { autoAlpha: 0, y: 14 })
      gsap.set(marqueeRef.current, { autoAlpha: 0, y: 20 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 0)
      tl.to(
        letters,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.95,
          stagger: 0.03,
          ease: 'power4.out',
        },
        0.18,
      )
      tl.to(
        sublineRef.current,
        { autoAlpha: 1, y: 0, duration: 0.55 },
        '>-0.35',
      )
      tl.to(
        ctasRef.current,
        { autoAlpha: 1, y: 0, duration: 0.5 },
        '>-0.3',
      )
      tl.to(
        marqueeRef.current,
        { autoAlpha: 1, y: 0, duration: 0.6 },
        '>-0.25',
      )
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      className={cn(
        'relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0A0A12] px-6 py-24 text-center sm:px-10',
        className,
      )}
    >
      {/* L1 — fixed dot grid, fades at the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      {/* L2 — drifting accent blobs (soft, low opacity) */}
      <DriftingBlobs />

      {/* L3 — mouse-follow spotlight */}
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-7">
        {/* Eyebrow pill */}
        {eyebrow && (
          <div
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/85">
              {eyebrow}
            </span>
          </div>
        )}

        {/* Headline */}
        <h1
          ref={headlineRef}
          aria-label={title}
          className={cn(
            'select-none uppercase leading-[0.86] tracking-tight',
            'bahrawy-hero-grad',
            displayFont.className,
          )}
          style={{
            fontSize: 'clamp(72px, 13vw, 200px)',
            letterSpacing: '-0.02em',
          }}
        >
          {words.map(({ word, wi, letters }, ix) => (
            <span
              key={wi}
              className="inline-flex"
              // Add a real space after each word except the last
              style={{ marginRight: ix < words.length - 1 ? '0.22em' : 0 }}
            >
              {letters.map(({ char, li }) => (
                <span
                  key={li}
                  data-letter
                  className="inline-block"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subline */}
        {description && (
          <p
            ref={sublineRef}
            className="max-w-xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg"
          >
            {description}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div
            ref={ctasRef}
            className="mt-2 flex flex-wrap items-center justify-center gap-3"
          >
            {primaryCta && (
              <a
                href={primaryCta.href ?? '#'}
                onClick={primaryCta.onClick}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
              >
                {primaryCta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href ?? '#'}
                onClick={secondaryCta.onClick}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/10"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Bottom marquee strip */}
      {marquee.length > 0 && (
        <div
          ref={marqueeRef}
          className="absolute inset-x-0 bottom-6 z-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <div
            className="inline-flex w-max animate-marquee whitespace-nowrap"
            style={{ ['--duration' as string]: '36s' }}
          >
            {[0, 1].map((dup) => (
              <span
                key={dup}
                aria-hidden={dup === 1}
                className="inline-flex items-center gap-8 pr-8"
              >
                {marquee.map((w, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.22em] text-white/30"
                  >
                    {w}
                    <span aria-hidden className="h-1 w-1 rounded-full bg-white/20" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* The flowing gradient is a scoped style — easier than wiring keyframes
          into tailwind.config for a one-off component. Inline keyframes only
          fire on the elements that opt in via `.bahrawy-hero-grad`. */}
      <style>{`
        .bahrawy-hero-grad {
          color: transparent;
          background-image: linear-gradient(
            115deg,
            #F8FAFC 0%,
            #C4B5FD 20%,
            #67E8F9 40%,
            #FCD34D 60%,
            #F472B6 80%,
            #F8FAFC 100%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: bahrawy-hero-flow 12s linear infinite;
        }
        @keyframes bahrawy-hero-flow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 220% 50%; }
        }
      `}</style>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Drifting blobs
// ---------------------------------------------------------------------------

interface Blob {
  color: string
  size: number
  startX: number
  startY: number
  duration: number
}

const BLOBS: Blob[] = [
  { color: '#A78BFA', size: 520, startX: 22, startY: 30, duration: 18 },
  { color: '#22D3EE', size: 460, startX: 78, startY: 28, duration: 22 },
  { color: '#FBBF24', size: 380, startX: 58, startY: 78, duration: 16 },
  { color: '#F472B6', size: 440, startX: 12, startY: 72, duration: 24 },
]

function DriftingBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ filter: 'blur(110px)' }}>
      {BLOBS.map((b, i) => (
        <DriftBlob key={i} blob={b} />
      ))}
    </div>
  )
}

function DriftBlob({ blob }: { blob: Blob }) {
  const { color, size, startX, startY, duration } = blob
  const xKeyframes = [startX, startX + 10, startX - 6, startX + 4, startX]
  const yKeyframes = [startY, startY - 6, startY + 8, startY - 4, startY]

  return (
    <motion.div
      animate={{
        left: xKeyframes.map((x) => `${x}%`),
        top: yKeyframes.map((y) => `${y}%`),
      }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, background: color, opacity: 0.45 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
    />
  )
}
