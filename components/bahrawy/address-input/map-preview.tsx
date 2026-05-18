'use client'

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
  // Using OpenStreetMap tile embed
  const bbox = getBBox(lat, lon, zoom)

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-white/[0.08]',
        className,
      )}
      style={{ height }}
    >
      <iframe
        title="Map preview"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`}
        className="h-full w-full border-0"
        loading="lazy"
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
