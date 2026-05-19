'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface OrbProps {
  color: string
  glowColor: string
}

export const Orb = forwardRef<SVGGElement, OrbProps>(function Orb(
  { color, glowColor },
  ref
) {
  return (
    <g ref={ref} style={{ opacity: 0 }}>
      {/* Outer pulsing ring */}
      <motion.circle
        cx={0}
        cy={0}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        animate={{ r: [16, 24, 16], opacity: [0.4, 0.1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Glow fill */}
      <circle cx={0} cy={0} r={12} fill={glowColor} opacity={0.15} />
      {/* Main orb */}
      <circle cx={0} cy={0} r={8} fill={color} />
      {/* Bright center */}
      <circle cx={0} cy={0} r={3} fill="white" opacity={0.9} />
    </g>
  )
})
