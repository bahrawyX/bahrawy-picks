'use client'

import LineWaves from '@/components/line-waves'

export default function LineWavesPreview() {
  return (
    <div className="relative h-[420px] w-full">
      <LineWaves
        speed={0.3}
        innerLineCount={32}
        outerLineCount={36}
        warpIntensity={1.0}
        rotation={-45}
        edgeFadeWidth={0.0}
        colorCycleSpeed={1.0}
        brightness={0.2}
        color1="#ffffff"
        color2="#ffffff"
        color3="#ffffff"
        enableMouseInteraction={true}
        mouseInfluence={2.0}
      />
    </div>
  )
}
