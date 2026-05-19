'use client'

import type { RefObject } from 'react'
import { Orb } from './orb'

type Variant = 'white' | 'aurora' | 'gold' | 'neon'

interface PathSVGProps {
  variant: Variant
  strokeWidth: number
  pathD: string
  showOrb: boolean
  orbRef: RefObject<SVGGElement | null>
  pathRef: RefObject<SVGPathElement | null>
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
      return '#94a3b8'
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
      return '#cbd5e1'
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
      return 'rgba(148,163,184,0.4)'
  }
}

function getCSSDropShadow(variant: Variant): string {
  switch (variant) {
    case 'aurora':
      return 'drop-shadow(0 0 6px rgba(6,182,212,0.4))'
    case 'gold':
      return 'drop-shadow(0 0 6px rgba(245,158,11,0.4))'
    case 'neon':
      return 'drop-shadow(0 0 8px rgba(34,211,238,0.5)) drop-shadow(0 0 16px rgba(34,211,238,0.2))'
    case 'white':
    default:
      return 'drop-shadow(0 0 4px rgba(148,163,184,0.3))'
  }
}

export function PathSVG({
  variant,
  strokeWidth,
  pathD,
  showOrb,
  orbRef,
  pathRef,
}: PathSVGProps) {
  if (!pathD) return null

  return (
    <svg
      width="100%"
      height="100%"
      className="absolute inset-0 pointer-events-none"
      style={{ filter: getCSSDropShadow(variant) }}
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
      </defs>

      {/* Main drawn path — GSAP controls strokeDasharray/offset */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={getStrokeColor(variant)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

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
