'use client'

/**
 * <TextReveal />
 *
 * Words, characters, or lines appear with a clip-mask reveal effect.
 * Each text unit is wrapped in an overflow-hidden container and slides
 * up from y:100% to y:0%, triggered when the element enters the viewport.
 *
 * @param text      - The text string to reveal.
 * @param variant   - Split mode: "words" | "chars" | "lines". Default "words".
 * @param duration  - Animation duration per unit in seconds. Default 0.6.
 * @param stagger   - Stagger delay between units in seconds. Default 0.05.
 * @param delay     - Initial delay before animation starts. Default 0.
 * @param once      - Only animate the first time it enters viewport. Default true.
 * @param as        - HTML element to render as. Default "p".
 * @param className - Additional classes.
 */

import * as React from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

export interface TextRevealProps {
  /** The text string to reveal. */
  text: string
  /** Split mode: "words" | "chars" | "lines". */
  variant?: 'words' | 'chars' | 'lines'
  /** Animation duration per unit in seconds. */
  duration?: number
  /** Stagger delay between units in seconds. */
  stagger?: number
  /** Initial delay before animation starts in seconds. */
  delay?: number
  /** Only animate the first time it enters the viewport. */
  once?: boolean
  /** HTML element to render as. */
  as?: TextElement
  /** Additional classes. */
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function splitText(text: string, variant: 'words' | 'chars' | 'lines'): string[] {
  switch (variant) {
    case 'words':
      return text.split(' ')
    case 'chars':
      // Replace spaces with non-breaking spaces so inline-block doesn't collapse them
      return text.split('').map((c) => (c === ' ' ? ' ' : c))
    case 'lines':
      return text.split('\n')
  }
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

function getContainerVariants(stagger: number, delay: number): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }
}

function getUnitVariants(duration: number): Variants {
  return {
    hidden: {
      y: '100%',
    },
    visible: {
      y: '0%',
      transition: {
        type: 'spring',
        duration,
        bounce: 0,
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Motion element map
// ---------------------------------------------------------------------------

const motionElements: Record<TextElement, React.ElementType> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TextReveal({
  text,
  variant = 'words',
  duration = 0.6,
  stagger = 0.05,
  delay = 0,
  once = true,
  as = 'p',
  className,
}: TextRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once, margin: '-60px' })

  const units = splitText(text, variant)
  const containerVariants = getContainerVariants(stagger, delay)
  const unitVariants = getUnitVariants(duration)

  const MotionTag = motionElements[as]

  return (
    <MotionTag
      ref={containerRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={cn(className)}
    >
      {units.map((unit, i) => (
        <span
          key={`${i}-${unit}`}
          style={{
            overflow: 'hidden',
            display: 'inline-block',
            verticalAlign: 'top',
          }}
        >
          <motion.span
            variants={unitVariants}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {unit}
            {/* Add space after words, except for the last one */}
            {variant === 'words' && i < units.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
