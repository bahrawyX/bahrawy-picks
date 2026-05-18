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

export interface ConfettiCanvasRef {
  fire: (overrides?: Partial<ConfettiConfig>) => void
}

interface ConfettiCanvasProps {
  className?: string
}

export const ConfettiCanvas = forwardRef<ConfettiCanvasRef, ConfettiCanvasProps>(
  function ConfettiCanvas({ className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animFrameRef = useRef<number>(0)
    const isRunning = useRef(false)

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
      [animate],
    )

    useImperativeHandle(ref, () => ({ fire }), [fire])

    // Resize canvas
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const resize = () => {
        const parent = canvas.parentElement
        if (parent) {
          canvas.width = parent.clientWidth
          canvas.height = parent.clientHeight
        }
      }

      resize()
      window.addEventListener('resize', resize)
      return () => {
        window.removeEventListener('resize', resize)
        cancelAnimationFrame(animFrameRef.current)
      }
    }, [])

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        data-testid="confetti-canvas"
      />
    )
  },
)
