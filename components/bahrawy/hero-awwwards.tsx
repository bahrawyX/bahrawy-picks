'use client'

/**
 * <HeroAwwwards />
 *
 * A restrained, type-first landing hero.
 *
 *  - The headline is the whole hero. One GSAP timeline reveals every line by
 *    sliding a `clipPath` mask up from the baseline — letters appear in place
 *    rather than flying around. Calmer, more confident than a rotate-cascade.
 *  - Color: mostly white, with a single soft duotone (warm → cool) brushed
 *    diagonally across the type. No rainbow.
 *  - Background: one large accent glow in the top-right + a spring-smoothed
 *    spotlight that follows the cursor. Everything else removed.
 *  - Bottom: a tiny scroll indicator — a thin line that "breathes" up and
 *    down on a 2 s loop.
 *
 * Designed to be the first paint on a landing page and stay out of the way
 * of the rest of the page.
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
  /** Small uppercase tag rendered above the headline. */
  eyebrow?: React.ReactNode
  /**
   * Headline. Pass an array to render multiple lines; each line reveals as
   * its own mask sweep (so a 3-line headline gives you three "scenes").
   */
  title: string | string[]
  /** Sub-copy below the headline. */
  description?: React.ReactNode
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  /** Single accent color — appears in the corner glow + duotone on the type. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroAwwwards({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  accentColor = '#A78BFA',
  className,
}: HeroAwwwardsProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const lineRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const sublineRef = React.useRef<HTMLParagraphElement>(null)
  const ctasRef = React.useRef<HTMLDivElement>(null)
  const ruleRef = React.useRef<HTMLDivElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Mouse-tracked spotlight, spring-smoothed.
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.4)
  const sx = useSpring(mouseX, { stiffness: 160, damping: 28, mass: 0.7 })
  const sy = useSpring(mouseY, { stiffness: 160, damping: 28, mass: 0.7 })
  const xPct = useTransform(sx, (v) => `${v * 100}%`)
  const yPct = useTransform(sy, (v) => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${xPct} ${yPct}, rgba(255,255,255,0.08), transparent 65%)`

  const handleMove = (e: React.MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }

  const lines = React.useMemo(
    () => (Array.isArray(title) ? title : [title]),
    [title],
  )

  // ── load timeline ────────────────────────────────────────────────
  useGSAP(
    () => {
      const linesEls = lineRefs.current.filter(Boolean) as HTMLSpanElement[]
      if (!linesEls.length) return

      // Initial: each line is fully masked out from the top — like a
      // theatre curtain that hasn't risen yet.
      gsap.set(linesEls, {
        clipPath: 'inset(0% 0% 100% 0%)',
        y: 18,
      })
      gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      gsap.set(sublineRef.current, { autoAlpha: 0, y: 14 })
      gsap.set(ctasRef.current, { autoAlpha: 0, y: 14 })
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: '0% 50%' })
      gsap.set(scrollRef.current, { autoAlpha: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 0)

      // Each line gets a 0.95s reveal with overlap into the next.
      linesEls.forEach((el, i) => {
        tl.to(
          el,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            duration: 0.95,
            ease: 'power4.out',
          },
          0.18 + i * 0.32,
        )
      })

      const last = 0.18 + (linesEls.length - 1) * 0.32 + 0.55

      tl.to(
        ruleRef.current,
        { scaleX: 1, duration: 0.7, ease: 'power2.out' },
        last - 0.2,
      )
      tl.to(
        sublineRef.current,
        { autoAlpha: 1, y: 0, duration: 0.55 },
        last - 0.1,
      )
      tl.to(ctasRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, last + 0.05)
      tl.to(scrollRef.current, { autoAlpha: 1, duration: 0.5 }, last + 0.25)
    },
    { scope: sectionRef, dependencies: [lines.length] },
  )

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      className={cn(
        'relative isolate flex min-h-screen w-full flex-col items-start justify-center overflow-hidden bg-black px-6 py-24 sm:px-10 lg:px-20',
        className,
      )}
    >
      {/* Corner accent glow — one large soft circle in the top-right.
          Restrained: no four-blob disco. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full opacity-55"
        style={{
          background: `radial-gradient(closest-side, ${accentColor}, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* Mouse-follow spotlight — adds warmth without competing with the glow */}
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0"
      />

      {/* A faint top-edge highlight — gives the section a "lit from above" feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Content ---------------------------------------------------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-8">
        {/* Eyebrow — text-only, no pill */}
        {eyebrow && (
          <div
            ref={eyebrowRef}
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/55"
          >
            <span
              aria-hidden
              className="block h-px w-8"
              style={{ background: accentColor }}
            />
            {eyebrow}
          </div>
        )}

        {/* Headline — clipPath mask reveal, line by line */}
        <h1
          aria-label={lines.join(' ')}
          className={cn(
            'select-none uppercase leading-[0.86] tracking-tight',
            'bahrawy-hero-duotone',
            displayFont.className,
          )}
          style={{
            fontSize: 'clamp(72px, 13vw, 220px)',
            letterSpacing: '-0.02em',
            ['--bahrawy-accent' as string]: accentColor,
          }}
        >
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                ref={(el) => {
                  lineRefs.current[i] = el
                }}
                className="block"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* A thin rule that draws under the headline as a "landing line" */}
        <div
          ref={ruleRef}
          className="h-px w-40 origin-left"
          style={{ background: accentColor }}
        />

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
            className="mt-2 flex flex-wrap items-center gap-5"
          >
            {primaryCta && (
              <a
                href={primaryCta.href ?? '#'}
                onClick={primaryCta.onClick}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
              >
                {primaryCta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href ?? '#'}
                onClick={secondaryCta.onClick}
                className="inline-flex items-center text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator — tiny "Scroll" label + a vertical line where a
          short accent bar slides up & down on a 1.8 s loop. */}
      <div
        ref={scrollRef}
        aria-hidden
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 block h-3"
            style={{ background: accentColor }}
            animate={{ y: [-12, 40, 40] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.6, 1],
            }}
          />
        </span>
      </div>

      {/* Duotone gradient on the headline — a single warm-to-cool brush
          across the type, instead of a 6-stop rainbow. Tasteful. */}
      <style>{`
        .bahrawy-hero-duotone {
          color: transparent;
          background-image: linear-gradient(
            115deg,
            #ffffff 0%,
            #ffffff 45%,
            var(--bahrawy-accent) 75%,
            #ffffff 100%
          );
          background-size: 200% 100%;
          background-position: 0% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: bahrawy-hero-brush 9s ease-in-out infinite;
        }
        @keyframes bahrawy-hero-brush {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  )
}
