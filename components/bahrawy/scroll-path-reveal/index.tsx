'use client'

import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { PathSVG } from './path-svg'
import { SectionCard } from './section-card'
import { usePathLength } from './use-path-length'
import type { ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScrollPathSection {
  id: string
  title?: string
  content: ReactNode
  pathPosition: number // 0–1
}

export interface ScrollPathRevealProps {
  sections: ScrollPathSection[]
  variant?: 'white' | 'aurora' | 'gold' | 'neon'
  strokeWidth?: number
  showOrb?: boolean
  backgroundColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Path generation
// ---------------------------------------------------------------------------

function generatePath(w: number, h: number): string {
  // Amplitude 0.3–0.7 keeps curves inside the container, leaving room for cards
  return `M ${w * 0.5} 0 C ${w * 0.3} ${h * 0.1} ${w * 0.3} ${h * 0.2} ${w * 0.5} ${h * 0.25} C ${w * 0.7} ${h * 0.3} ${w * 0.7} ${h * 0.4} ${w * 0.5} ${h * 0.5} C ${w * 0.3} ${h * 0.55} ${w * 0.3} ${h * 0.65} ${w * 0.5} ${h * 0.75} C ${w * 0.7} ${h * 0.8} ${w * 0.7} ${h * 0.9} ${w * 0.5} ${h}`
}

function generateMobilePath(w: number, h: number): string {
  return `M ${w * 0.5} 0 L ${w * 0.5} ${h}`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScrollPathReveal({
  sections,
  variant = 'white',
  strokeWidth = 2,
  showOrb = true,
  backgroundColor = 'bg-black',
  className,
}: ScrollPathRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<SVGGElement>(null)
  const ghostPathRef = useRef<SVGPathElement>(null)
  const { pathRef, totalLength, measure, getPoint } = usePathLength()

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [sectionPositions, setSectionPositions] = useState<
    Array<{
      x: number
      y: number
      cardX: number
      cardY: number
      side: 'left' | 'right'
    }>
  >([])

  const isMobile = dimensions.width > 0 && dimensions.width < 768

  // Generate path based on dimensions
  const pathD = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return ''
    return isMobile
      ? generateMobilePath(dimensions.width, dimensions.height)
      : generatePath(dimensions.width, dimensions.height)
  }, [dimensions, isMobile])

  // ResizeObserver for dimensions
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setDimensions({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Calculate section positions after path is rendered and measurable
  const calculatePositions = useCallback(() => {
    const len = measure()
    if (len === 0 || dimensions.width === 0) return

    const cardW = isMobile ? 200 : 220
    const gap = 24 // horizontal gap between path dot and card edge

    const positions = sections.map((section, i) => {
      const point = getPoint(section.pathPosition * len)

      // Decide side: prefer alternating, but flip if card won't fit
      let side: 'left' | 'right' = isMobile
        ? 'right'
        : i % 2 === 0
          ? 'left'
          : 'right'

      if (!isMobile) {
        const leftFits = point.x - gap - cardW >= 0
        const rightFits = point.x + gap + cardW <= dimensions.width
        if (side === 'left' && !leftFits) side = 'right'
        if (side === 'right' && !rightFits) side = 'left'
      }

      // cardX = x coordinate where the connecting line ends (card edge)
      const cardX = isMobile
        ? dimensions.width / 2
        : side === 'left'
          ? point.x - gap
          : point.x + gap

      return { x: point.x, y: point.y, cardX, cardY: point.y, side }
    })
    setSectionPositions(positions)
  }, [sections, measure, getPoint, isMobile, dimensions.width])

  // Recalculate positions when path changes
  useEffect(() => {
    if (pathD) {
      requestAnimationFrame(calculatePositions)
    }
  }, [pathD, calculatePositions])

  // GSAP ScrollTrigger setup
  useGSAP(
    () => {
      if (!pathRef.current || !containerRef.current || totalLength === 0) return

      const path = pathRef.current

      // Set initial state: fully hidden
      gsap.set(path, {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength,
      })

      if (orbRef.current) {
        gsap.set(orbRef.current, { opacity: 0 })
      }

      // Main scroll animation — draw the path
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            if (!showOrb || !orbRef.current || !pathRef.current) return
            const currentLength = totalLength * self.progress
            const point = pathRef.current.getPointAtLength(currentLength)
            gsap.set(orbRef.current, {
              x: point.x,
              y: point.y,
              opacity: self.progress > 0.001 ? 1 : 0,
            })
          },
        },
      })

      // Section card animations
      sections.forEach((section, i) => {
        const cardEl = document.getElementById(`section-card-${section.id}`)
        if (!cardEl) return

        const side: 'left' | 'right' = isMobile
          ? 'right'
          : i % 2 === 0
            ? 'left'
            : 'right'

        gsap.set(cardEl, { opacity: 0, x: side === 'left' ? -40 : 40 })

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: () =>
            `${Math.max(0, section.pathPosition - 0.05) * 100}% top`,
          end: () =>
            `${Math.min(1, section.pathPosition + 0.05) * 100}% top`,
          onEnter: () => {
            gsap.to(cardEl, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
            })
          },
          onLeaveBack: () => {
            gsap.to(cardEl, {
              opacity: 0,
              x: side === 'left' ? -40 : 40,
              duration: 0.4,
              ease: 'power2.in',
            })
          },
        })
      })
    },
    { scope: containerRef, dependencies: [totalLength, sections, showOrb, isMobile] }
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative min-h-[400vh] overflow-x-hidden',
        backgroundColor,
        className
      )}
    >
      <PathSVG
        variant={variant ?? 'white'}
        strokeWidth={strokeWidth ?? 2}
        pathD={pathD}
        showOrb={showOrb ?? true}
        orbRef={orbRef}
        pathRef={pathRef}
        ghostPathRef={ghostPathRef}
        sectionPoints={sectionPositions}
        isMobile={isMobile}
      />

      {/* Section cards as HTML divs */}
      {sectionPositions.map((pos, i) => {
        const section = sections[i]
        if (!section) return null
        return (
          <div
            key={section.id}
            className="absolute"
            style={{
              left: isMobile ? '50%' : `${pos.cardX}px`,
              top: `${pos.y}px`,
              transform: isMobile
                ? 'translate(-50%, 20px)'
                : pos.side === 'left'
                  ? 'translate(-100%, -50%)'
                  : 'translateY(-50%)',
            }}
          >
            <SectionCard
              id={section.id}
              title={section.title}
              content={section.content}
              side={pos.side}
            />
          </div>
        )
      })}
    </div>
  )
}
