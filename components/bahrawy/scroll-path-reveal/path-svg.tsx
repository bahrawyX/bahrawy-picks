'use client'

import type { RefObject } from 'react'
import { Orb } from './orb'

type Variant = 'white' | 'aurora' | 'gold' | 'neon'

interface SectionPoint {
  x: number
  y: number
  cardX: number
  cardY: number
  side: 'left' | 'right'
}

interface PathSVGProps {
  variant: Variant
  strokeWidth: number
  pathD: string
  showOrb: boolean
  orbRef: RefObject<SVGGElement | null>
  pathRef: RefObject<SVGPathElement | null>
  ghostPathRef: RefObject<SVGPathElement | null>
  sectionPoints: SectionPoint[]
  isMobile: boolean
}

function getStrokeColor(variant: Variant): string {
  switch (variant) {
    case 'aurora':
      return 'url(#aurora-grad)'
    case 'gold':
      return 'url(#gold-grad)'
    case 'neon':
      return '#22d3ee'
    case 'white':
    default:
      return 'white'
  }
}

function getOrbColor(variant: Variant): string {
  switch (variant) {
    case 'aurora':
      return '#06b6d4'
    case 'gold':
      return '#f59e0b'
    case 'neon':
      return '#22d3ee'
    case 'white':
    default:
      return 'white'
  }
}

function getOrbGlowColor(variant: Variant): string {
  switch (variant) {
    case 'aurora':
      return 'rgba(6,182,212,0.5)'
    case 'gold':
      return 'rgba(245,158,11,0.5)'
    case 'neon':
      return 'rgba(34,211,238,0.6)'
    case 'white':
    default:
      return 'rgba(255,255,255,0.5)'
  }
}

function getGlowStdDev(variant: Variant): number {
  return variant === 'neon' ? 10 : 6
}

export function PathSVG({
  variant,
  strokeWidth,
  pathD,
  showOrb,
  orbRef,
  pathRef,
  ghostPathRef,
  sectionPoints,
}: PathSVGProps) {
  if (!pathD) return null

  return (
    <svg
      width="100%"
      height="100%"
      className="absolute inset-0 pointer-events-none"
    >
      <defs>
        {/* Aurora gradient */}
        <linearGradient
          id="aurora-grad"
          gradientUnits="objectBoundingBox"
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="1"
        >
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Gold gradient */}
        <linearGradient
          id="gold-grad"
          gradientUnits="objectBoundingBox"
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="1"
        >
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="path-glow">
          <feGaussianBlur stdDeviation={getGlowStdDev(variant)} />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ghost path — fully visible at low opacity, no dash animation */}
      <path
        ref={ghostPathRef}
        d={pathD}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        opacity={0.08}
        strokeLinecap="round"
      />

      {/* Main drawn path — GSAP controls strokeDasharray/offset */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={getStrokeColor(variant)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        filter="url(#path-glow)"
      />

      {/* Connecting lines and dots for each section */}
      {sectionPoints.map((pt, i) => (
        <g key={i}>
          <line
            x1={pt.x}
            y1={pt.y}
            x2={pt.cardX}
            y2={pt.y}
            stroke="white"
            strokeWidth={1}
            opacity={0.15}
            strokeDasharray="4 4"
          />
          <circle
            cx={pt.x}
            cy={pt.y}
            r={4}
            fill="white"
            opacity={0.2}
          />
        </g>
      ))}

      {/* Orb */}
      {showOrb && (
        <Orb
          ref={orbRef}
          color={getOrbColor(variant)}
          glowColor={getOrbGlowColor(variant)}
        />
      )}
    </svg>
  )
}
