'use client'

import { useRef, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { StackCard } from './stack-card'
import { ProgressBar } from './progress-bar'
import { DotIndicators } from './dot-indicators'
import { CardNumber } from './card-number'
import { SectionHeader } from './section-header'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CardStackItem {
  id: string
  accentColor?: string
  content?: ReactNode
  number?: string
  icon?: ReactNode
  title?: string
  description?: string
  image?: string
}

export interface CardStackScrollProps {
  cards: CardStackItem[]
  sectionLabel?: string
  heading?: string
  showProgress?: boolean
  showDots?: boolean
  showCardNumber?: boolean
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CardStackScroll({
  cards,
  sectionLabel,
  heading,
  showProgress = true,
  showDots = true,
  showCardNumber = true,
  className,
}: CardStackScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const setCardRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      cardRefs.current[index] = el
    },
    []
  )

  useGSAP(
    () => {
      if (!containerRef.current) return
      const totalCards = cards.length
      if (totalCards === 0) return

      // Initialize card positions
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        if (i === 0) {
          gsap.set(card, { scale: 1, opacity: 1, y: 0, zIndex: totalCards - i })
        } else {
          gsap.set(card, {
            y: window.innerHeight,
            opacity: 0,
            scale: 1,
            zIndex: totalCards - i,
          })
        }
      })

      // Header parallax — fades out as first card starts animating
      if (headerRef.current) {
        gsap.to(headerRef.current, {
          y: -80,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: `${(1 / totalCards) * 50}% top`,
            scrub: 1,
          },
        })
      }

      // One ScrollTrigger per card transition
      for (let i = 0; i < totalCards; i++) {
        const startPct = (i / totalCards) * 100
        const endPct = ((i + 1) / totalCards) * 100

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: `${startPct}% top`,
          end: `${endPct}% top`,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress

            // Overall progress
            const overallProgress = (i + p) / totalCards
            setProgress(overallProgress)

            // Active index
            if (p < 0.5) {
              setActiveIndex(i)
            } else if (i < totalCards - 1) {
              setActiveIndex(i + 1)
            }

            // Current card: scale down, shift up, fade
            const currentCard = cardRefs.current[i]
            if (currentCard && i < totalCards - 1) {
              gsap.set(currentCard, {
                scale: 1 - p * 0.15,
                opacity: 1 - p * 0.5,
                y: -(p * 60),
                zIndex: totalCards - i,
              })
            }

            // Next card: slide up from below viewport
            const nextCard = cardRefs.current[i + 1]
            if (nextCard) {
              gsap.set(nextCard, {
                y: window.innerHeight * (1 - p),
                opacity: p,
                scale: 1,
                zIndex: totalCards - (i + 1) + totalCards, // Above current
              })
            }

            // Stack depth: previous cards get progressively smaller
            for (let j = 0; j < i; j++) {
              const stackCard = cardRefs.current[j]
              if (!stackCard) continue
              const depth = i - j
              gsap.set(stackCard, {
                scale: Math.max(0.5, 0.85 - depth * 0.08),
                y: -(depth * 16),
                opacity: Math.max(0.1, 0.5 - depth * 0.15),
                zIndex: totalCards - j,
              })
            }
          },
        })
      }

      // Background color transition
      if (stickyRef.current) {
        cards.forEach((card, i) => {
          if (!card.accentColor) return
          const startPct = (i / totalCards) * 100
          const endPct = ((i + 1) / totalCards) * 100

          ScrollTrigger.create({
            trigger: containerRef.current,
            start: `${startPct}% top`,
            end: `${endPct}% top`,
            scrub: 1,
            onEnter: () => {
              if (stickyRef.current) {
                gsap.to(stickyRef.current, {
                  backgroundColor: `${card.accentColor}10`,
                  duration: 0.5,
                  ease: 'power1.out',
                })
              }
            },
            onEnterBack: () => {
              const prevColor =
                i > 0 && cards[i - 1].accentColor
                  ? `${cards[i - 1].accentColor}10`
                  : 'transparent'
              if (stickyRef.current) {
                gsap.to(stickyRef.current, {
                  backgroundColor: prevColor,
                  duration: 0.5,
                  ease: 'power1.out',
                })
              }
            },
          })
        })
      }
    },
    { scope: containerRef, dependencies: [cards] }
  )

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ height: `${cards.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden transition-colors"
      >
        {/* Progress bar */}
        {showProgress && (
          <div className="absolute left-6 right-6 top-6 z-50">
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* Card number */}
        {showCardNumber && (
          <div className="absolute right-8 top-10 z-50">
            <CardNumber current={activeIndex + 1} total={cards.length} />
          </div>
        )}

        {/* Section header — z-10 so cards (z-20) render on top */}
        {(sectionLabel || heading) && (
          <SectionHeader
            ref={headerRef}
            label={sectionLabel}
            heading={heading}
            className="absolute z-10 text-center"
          />
        )}

        {/* Card stack — z-20 above header */}
        <div
          className="relative z-20 w-full max-w-4xl px-4 md:px-8"
          style={{ height: '500px' }}
        >
          {cards.map((card, i) => (
            <StackCard
              key={card.id}
              ref={(el) => setCardRef(el, i)}
              card={card}
              className="absolute inset-0"
            />
          ))}
        </div>

        {/* Dot indicators */}
        {showDots && (
          <div className="absolute bottom-8 z-50">
            <DotIndicators total={cards.length} active={activeIndex} />
          </div>
        )}
      </div>
    </div>
  )
}
