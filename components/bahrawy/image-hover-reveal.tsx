'use client'

/**
 * <ImageHoverReveal />
 *
 * A card that shows an image with a quiet title; on hover, a panel of text
 * (description + optional CTA) slides up over the image while the title
 * moves up to make room. The image zooms gently. All transitions are
 * spring-driven so they feel "alive" instead of CSS-flat.
 *
 * @param src              — Image URL.
 * @param alt              — Alt text. Defaults to `title`.
 * @param title            — Always-visible headline at the bottom.
 * @param description      — Body copy revealed on hover.
 * @param cta              — Optional element (button/link) under description.
 * @param eyebrow          — Optional tiny label above title (uppercase tag).
 * @param height           — Card height in px. Default 360.
 * @param align            — Text alignment. Default 'left'.
 * @param scale            — How much the image zooms on hover. Default 1.06.
 * @param className        — Extra classes for the outer card.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageHoverRevealProps {
  src: string
  alt?: string
  title: React.ReactNode
  description?: React.ReactNode
  cta?: React.ReactNode
  eyebrow?: React.ReactNode
  height?: number
  align?: 'left' | 'center'
  scale?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Springs — separate ones for image (slower) and text (snappier)
// ---------------------------------------------------------------------------

const IMG_SPRING = { type: 'spring' as const, stiffness: 160, damping: 28, mass: 1 }
const TEXT_SPRING = { type: 'spring' as const, stiffness: 340, damping: 30, mass: 0.9 }
const FAST_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.85 }

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageHoverReveal({
  src,
  alt,
  title,
  description,
  cta,
  eyebrow,
  height = 360,
  align = 'left',
  scale = 1.06,
  className,
}: ImageHoverRevealProps) {
  // How far the title needs to lift to make room for the description block.
  // 0 if there's nothing to reveal — title stays put.
  const titleLift = description || cta ? 24 : 0

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className={cn(
        'group relative isolate overflow-hidden rounded-2xl bg-zinc-950',
        'shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
      style={{ height }}
    >
      {/* The image */}
      <motion.img
        src={src}
        alt={alt ?? (typeof title === 'string' ? title : 'image')}
        variants={{ rest: { scale: 1 }, hover: { scale } }}
        transition={IMG_SPRING}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Gradient overlay — darker on hover so revealed text reads well */}
      <motion.div
        aria-hidden
        variants={{
          rest: { opacity: 0.55 },
          hover: { opacity: 0.9 },
        }}
        transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
      />

      {/* Subtle top-right vignette that brightens on hover for a "lit" feel */}
      <motion.div
        aria-hidden
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_55%)]"
      />

      {/* Text stack — anchored to the bottom; lifts on hover */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 p-6 sm:p-7',
          align === 'center' && 'flex flex-col items-center',
        )}
      >
        {eyebrow && (
          <motion.span
            variants={{
              rest: { opacity: 0, y: 8 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={FAST_SPRING}
            className="mb-2 inline-block text-[10px] font-medium uppercase tracking-[0.22em] text-white/70"
          >
            {eyebrow}
          </motion.span>
        )}

        <motion.h3
          variants={{
            rest: { y: titleLift },
            hover: { y: 0 },
          }}
          transition={TEXT_SPRING}
          className="text-balance text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl"
        >
          {title}
        </motion.h3>

        {description && (
          <motion.p
            variants={{
              rest: { opacity: 0, y: 14 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={TEXT_SPRING}
            className="mt-3 max-w-prose text-sm leading-relaxed text-white/75"
          >
            {description}
          </motion.p>
        )}

        {cta && (
          <motion.div
            variants={{
              rest: { opacity: 0, y: 16 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ ...TEXT_SPRING, delay: 0.04 }}
            className="mt-4"
          >
            {cta}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
