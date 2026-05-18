'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MapPreviewProps {
  lat: number
  lon: number
  zoom?: number
  height?: number
  className?: string
}

export function MapPreview({
  lat,
  lon,
  zoom = 15,
  height = 200,
  className,
}: MapPreviewProps) {
  const [loaded, setLoaded] = useState(false)
  const bbox = getBBox(lat, lon, zoom)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-white/[0.08] bg-neutral-200',
        className,
      )}
      style={{ height }}
    >
      {/* Loading spinner */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-200">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-600" />
        </div>
      )}
      <iframe
        title="Map preview"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`}
        className="h-full w-full border-0"
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

/**
 * Calculate bounding box for OSM embed
 */
function getBBox(lat: number, lon: number, zoom: number): string {
  const offset = 0.01 * Math.pow(2, 15 - zoom)
  return `${lon - offset},${lat - offset},${lon + offset},${lat + offset}`
}
