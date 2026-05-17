'use client'

import LineWaves from '@/components/line-waves'

export default function LineWavesThumb() {
  return (
    <div className="absolute inset-0">
      <LineWaves
        speed={0.4}
        innerLineCount={18}
        outerLineCount={22}
        warpIntensity={1.0}
        rotation={-45}
        edgeFadeWidth={0.0}
        colorCycleSpeed={1.2}
        brightness={0.32}
        color1="#ffffff"
        color2="#ffffff"
        color3="#ffffff"
        enableMouseInteraction={false}
        mouseInfluence={0}
      />
    </div>
  )
}
