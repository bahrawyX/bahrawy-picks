'use client'

/**
 * <HeroShaderBg />
 *
 * Full-bleed animated shader background for hero sections. Stacks four
 * GPU layers from the `shaders` package: a slow two-color Swirl base,
 * a ChromaFlow accent that blooms toward the cursor, a FlutedGlass
 * refraction pass that ribs the whole image like reeded glass, and a
 * FilmGrain finish. Ships with light and dark presets; every knob is
 * overridable per prop.
 */

import * as React from 'react'
import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from 'shaders/react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface HeroShaderBgProps {
  /** Palette preset. Default 'dark'. */
  scheme?: 'light' | 'dark'
  /** Accent color the ChromaFlow layer blooms with. Default '#ff5f03'. */
  accentColor?: string
  /** First swirl color. Defaults per scheme. */
  colorA?: string
  /** Second swirl color. Defaults per scheme. */
  colorB?: string
  /** ChromaFlow base color. Defaults per scheme. */
  baseColor?: string
  /** Swirl detail. Default 1.7. */
  detail?: number
  /** ChromaFlow momentum. Default 13. */
  momentum?: number
  /** ChromaFlow radius. Default 3.5. */
  radius?: number
  /** Fluted glass ridge count. Default 8. */
  frequency?: number
  /** Fluted glass ridge angle in degrees. Default 31. */
  angle?: number
  /** Fluted glass refraction strength. Default 4. */
  refraction?: number
  /** Fluted glass highlight intensity. Defaults per scheme. */
  highlight?: number
  /** Fluted glass drift speed. Default 0.15. */
  speed?: number
  /** Film grain strength. Defaults per scheme. */
  grain?: number
  className?: string
}

const SCHEMES = {
  light: {
    colorA: '#ffffff',
    colorB: '#f0f0f0',
    baseColor: '#ffffff',
    grain: 0.05,
    highlight: 0.12,
  },
  dark: {
    colorA: '#1c1c1f',
    colorB: '#0b0b0c',
    baseColor: '#0b0b0c',
    grain: 0.08,
    highlight: 0.18,
  },
} as const

export function HeroShaderBg({
  scheme = 'dark',
  accentColor = '#ff5f03',
  colorA,
  colorB,
  baseColor,
  detail = 1.7,
  momentum = 13,
  radius = 3.5,
  frequency = 8,
  angle = 31,
  refraction = 4,
  highlight,
  speed = 0.15,
  grain,
  className,
}: HeroShaderBgProps) {
  // WebGL canvas — render on the client only to keep SSR markup stable.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const reduced = usePrefersReducedMotion()

  const preset = SCHEMES[scheme]
  const a = colorA ?? preset.colorA
  const b = colorB ?? preset.colorB
  const base = baseColor ?? preset.baseColor
  const grainStrength = grain ?? preset.grain
  const highlightStrength = highlight ?? preset.highlight

  // Reduced motion: keep the static fallback instead of the live shader.
  if (!mounted || reduced) {
    return (
      <div
        aria-hidden
        className={cn('pointer-events-none absolute inset-0', className)}
        style={{ backgroundColor: b }}
      />
    )
  }

  return (
    <div
      aria-hidden
      // Key forces the shader stack to re-initialize when the palette changes
      key={`${scheme}-${a}-${b}-${base}-${accentColor}`}
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      <Shader style={{ width: '100%', height: '100%' }}>
        <Swirl colorA={a} colorB={b} detail={detail} />
        <ChromaFlow
          baseColor={base}
          downColor={accentColor}
          leftColor={accentColor}
          rightColor={accentColor}
          upColor={accentColor}
          momentum={momentum}
          radius={radius}
        />
        <FlutedGlass
          aberration={0.61}
          angle={angle}
          frequency={frequency}
          highlight={highlightStrength}
          highlightSoftness={0}
          lightAngle={-90}
          refraction={refraction}
          shape="rounded"
          softness={1}
          speed={speed}
        />
        <FilmGrain strength={grainStrength} />
      </Shader>
    </div>
  )
}
