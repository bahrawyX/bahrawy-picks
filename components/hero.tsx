'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LineWaves from '@/components/line-waves'
import { cn } from '@/lib/utils'

/**
 * Hero with fade-through entrance staggered across child elements.
 * Each child uses the same M3 enter motion with increasing transition-delay.
 */
export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const enter = 'transition-[opacity,transform] duration-m3-enter ease-m3-enter'
  const hidden = 'opacity-0 translate-y-3'
  const shown = 'opacity-100 translate-y-0'

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
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

      {/* Top + bottom gradient veils for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div
          className={cn(enter, mounted ? shown : hidden)}
          style={{ transitionDelay: mounted ? '0ms' : '0ms' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            v1.0 — now open source
          </span>
        </div>

        <h1
          className={cn(
            'mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl',
            enter,
            mounted ? shown : hidden
          )}
          style={{ transitionDelay: mounted ? '80ms' : '0ms' }}
        >
          Beautifully crafted
          <br className="hidden sm:block" /> components for the modern web.
        </h1>

        <p
          className={cn(
            'mt-6 max-w-xl text-pretty text-base text-white/60 sm:text-lg',
            enter,
            mounted ? shown : hidden
          )}
          style={{ transitionDelay: mounted ? '160ms' : '0ms' }}
        >
          An open-source collection of React & Next.js components. Copy, paste,
          and ship your next idea — faster.
        </p>

        <div
          className={cn(
            'mt-10 flex flex-wrap items-center justify-center gap-3',
            enter,
            mounted ? shown : hidden
          )}
          style={{ transitionDelay: mounted ? '240ms' : '0ms' }}
        >
          <Button size="lg" asChild className="group gap-2">
            <Link href="/components">
              Browse components
              <ArrowRight className="h-4 w-4 transition-transform duration-m3-enter ease-m3-enter group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <a href="https://github.com" target="_blank" rel="noreferrer noopener">
              <Github className="h-4 w-4" />
              Star on GitHub
            </a>
          </Button>
        </div>

        <div
          className={cn(
            'pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2',
            enter,
            mounted ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: mounted ? '420ms' : '0ms' }}
        >
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Scroll
          </span>
        </div>
      </div>
    </section>
  )
}
