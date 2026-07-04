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
    const reduced = usePrefersReducedMotion()

    const animate = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

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
        const newParticles = createParticles(canvas, config)
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
        if (fullscreen) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
        } else {
          const parent = canvas.parentElement
          if (parent) {
            canvas.width = parent.clientWidth
            canvas.height = parent.clientHeight
          }
        }
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
