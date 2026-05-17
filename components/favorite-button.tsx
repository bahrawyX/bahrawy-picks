'use client'

import { useState, type CSSProperties } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/hooks/use-favorites'

interface Particle {
  dx: number
  dy: number
  size: string
  color: string
  delay: number
}

const PARTICLES: Particle[] = [
  { dx: 0, dy: -26, size: 'h-1 w-1', color: 'bg-rose-400', delay: 0 },
  { dx: 18, dy: -18, size: 'h-1.5 w-1.5', color: 'bg-rose-300', delay: 30 },
  { dx: 26, dy: 0, size: 'h-1 w-1', color: 'bg-amber-300', delay: 0 },
  { dx: 18, dy: 18, size: 'h-1 w-1', color: 'bg-rose-400', delay: 50 },
  { dx: 0, dy: 26, size: 'h-1.5 w-1.5', color: 'bg-rose-500', delay: 10 },
  { dx: -18, dy: 18, size: 'h-1 w-1', color: 'bg-rose-300', delay: 40 },
  { dx: -26, dy: 0, size: 'h-1 w-1', color: 'bg-amber-300', delay: 0 },
  { dx: -18, dy: -18, size: 'h-1.5 w-1.5', color: 'bg-rose-400', delay: 60 },
]

interface FavoriteButtonProps {
  slug: string
  className?: string
  size?: 'sm' | 'md'
}

export function FavoriteButton({
  slug,
  className,
  size = 'md',
}: FavoriteButtonProps) {
  const { isFavorited, toggle } = useFavorites()
  const fav = isFavorited(slug)
  const [popKey, setPopKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!fav) setBurstKey((k) => k + 1) // burst only when adding
    setPopKey((k) => k + 1)
    toggle(slug)
  }

  const dims = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'
  const iconDims = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={fav}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors duration-m3-enter ease-m3-enter',
        'hover:bg-white/[0.06]',
        fav
          ? 'text-rose-400 hover:text-rose-300'
          : 'text-white/60 hover:text-white',
        dims,
        className
      )}
    >
      {/* Radial burst — only renders briefly when adding (keyed so it replays) */}
      {burstKey > 0 && (
        <span
          key={`burst-${burstKey}`}
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={cn(
                'absolute left-1/2 top-1/2 animate-favorite-burst rounded-full',
                p.size,
                p.color
              )}
              style={
                {
                  animationDelay: `${p.delay}ms`,
                  '--dx': `${p.dx}px`,
                  '--dy': `${p.dy}px`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      )}

      {/* Heart — keyed by popKey so the pop animation replays on every toggle */}
      <Heart
        key={`heart-${popKey}`}
        className={cn(
          iconDims,
          popKey > 0 && 'animate-favorite-pop',
          fav && 'fill-rose-500 text-rose-500'
        )}
        strokeWidth={1.75}
      />
    </button>
  )
}
