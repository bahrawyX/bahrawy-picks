'use client'

import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import {
  type Particle,
  type ConfettiConfig,
  defaultConfig,
  createParticles,
  updateParticle,
  drawParticle,
} from '@/lib/confetti-utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface ConfettiCanvasRef {
  fire: (overrides?: Partial<ConfettiConfig>) => void
}

interface ConfettiCanvasProps {
  className?: string
  /** Render as a fixed full-viewport overlay (default: true) */
  fullscreen?: boolean
}

export const ConfettiCanvas = forwardRef<ConfettiCanvasRef, ConfettiCanvasProps>(
  function ConfettiCanvas({ className, fullscreen = true }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animFrameRef = useRef<number>(0)
    const isRunning = useRef(false)
    // Device-pixel-ratio the backing store is scaled by (capped at 2).
    const dprRef = useRef(1)
    const reduced = usePrefersReducedMotion()

    const animate = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = dprRef.current
      // Draw in CSS-pixel coordinates; the transform maps to device pixels.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      particlesRef.current = particlesRef.current.filter((p) => {
        const alive = updateParticle(p, defaultConfig.gravity, defaultConfig.drag)
        if (alive) drawParticle(ctx, p)
        return alive
      })

      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        isRunning.current = false
      }
    }, [])

    const fire = useCallback(
      (overrides?: Partial<ConfettiConfig>) => {
        // Reduced motion: firing is a no-op — no particles are spawned.
        if (reduced) return
        const canvas = canvasRef.current
        if (!canvas) return

        const config = { ...defaultConfig, ...overrides }
        // createParticles positions from the backing-store size (device
        // pixels) — convert back to the CSS-pixel space we draw in.
        const dpr = dprRef.current
        const newParticles = createParticles(canvas, config)
        newParticles.forEach((p) => {
          p.x /= dpr
          p.y /= dpr
        })
        particlesRef.current = [...particlesRef.current, ...newParticles]

        if (!isRunning.current) {
          isRunning.current = true
          animFrameRef.current = requestAnimationFrame(animate)
        }
      },
      [animate, reduced],
    )

    useImperativeHandle(ref, () => ({ fire }), [fire])

    // Resize canvas
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const resize = () => {
        // Scale the backing store by devicePixelRatio (capped at 2) so
        // particles render crisply on retina displays.
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        dprRef.current = dpr
        let w = 0
        let h = 0
        if (fullscreen) {
          w = window.innerWidth
          h = window.innerHeight
        } else {
          const parent = canvas.parentElement
          if (!parent) return
          w = parent.clientWidth
          h = parent.clientHeight
        }
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
      }

      resize()
      window.addEventListener('resize', resize)
      return () => {
        window.removeEventListener('resize', resize)
        cancelAnimationFrame(animFrameRef.current)
      }
    }, [fullscreen])

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={
          fullscreen
            ? { position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }
            : { position: 'absolute', inset: 0, pointerEvents: 'none' }
        }
        data-testid="confetti-canvas"
      />
    )
  },
)
