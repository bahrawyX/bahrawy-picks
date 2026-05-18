import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createParticles,
  updateParticle,
  drawParticle,
  defaultConfig,
  type Particle,
} from '@/lib/confetti-utils'

// Mock canvas context
function mockCanvas(width = 800, height = 600) {
  return {
    width,
    height,
  } as unknown as HTMLCanvasElement
}

function mockCtx(): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    globalAlpha: 1,
    fillStyle: '',
  } as unknown as CanvasRenderingContext2D
}

describe('confetti-utils', () => {
  describe('createParticles', () => {
    it('creates the specified number of particles', () => {
      const canvas = mockCanvas()
      const particles = createParticles(canvas, { ...defaultConfig, count: 50 })
      expect(particles).toHaveLength(50)
    })

    it('assigns colors from config', () => {
      const canvas = mockCanvas()
      const config = { ...defaultConfig, colors: ['#ff0000'], count: 10 }
      const particles = createParticles(canvas, config)
      particles.forEach((p) => expect(p.color).toBe('#ff0000'))
    })

    it('creates particles at origin position', () => {
      const canvas = mockCanvas(400, 300)
      const config = { ...defaultConfig, origin: { x: 0.5, y: 0.5 }, count: 5 }
      const particles = createParticles(canvas, config)
      particles.forEach((p) => {
        expect(p.x).toBe(200)
        expect(p.y).toBe(150)
      })
    })

    it('each particle has required properties', () => {
      const canvas = mockCanvas()
      const particles = createParticles(canvas, defaultConfig)
      const p = particles[0]
      expect(p).toHaveProperty('x')
      expect(p).toHaveProperty('y')
      expect(p).toHaveProperty('vx')
      expect(p).toHaveProperty('vy')
      expect(p).toHaveProperty('rotation')
      expect(p).toHaveProperty('size')
      expect(p).toHaveProperty('color')
      expect(p).toHaveProperty('opacity')
      expect(p).toHaveProperty('shape')
      expect(p).toHaveProperty('life')
      expect(p).toHaveProperty('maxLife')
    })
  })

  describe('updateParticle', () => {
    it('moves particle based on velocity', () => {
      const p: Particle = {
        x: 100, y: 100, vx: 5, vy: -10,
        rotation: 0, rotationSpeed: 0,
        size: 5, color: '#fff', opacity: 1,
        shape: 'square', life: 0, maxLife: 200,
      }
      const oldX = p.x
      const oldY = p.y
      updateParticle(p, 0.15, 0.02)
      expect(p.x).not.toBe(oldX)
      expect(p.y).not.toBe(oldY)
    })

    it('applies gravity to vy', () => {
      const p: Particle = {
        x: 0, y: 0, vx: 0, vy: 0,
        rotation: 0, rotationSpeed: 0,
        size: 5, color: '#fff', opacity: 1,
        shape: 'square', life: 0, maxLife: 200,
      }
      updateParticle(p, 0.15, 0)
      expect(p.vy).toBeGreaterThan(0)
    })

    it('returns false when life exceeds maxLife', () => {
      const p: Particle = {
        x: 0, y: 0, vx: 0, vy: 0,
        rotation: 0, rotationSpeed: 0,
        size: 5, color: '#fff', opacity: 1,
        shape: 'square', life: 199, maxLife: 200,
      }
      const alive = updateParticle(p, 0, 0)
      expect(alive).toBe(false)
    })

    it('fades opacity in last 25% of life', () => {
      const p: Particle = {
        x: 0, y: 0, vx: 0, vy: 0,
        rotation: 0, rotationSpeed: 0,
        size: 5, color: '#fff', opacity: 1,
        shape: 'square', life: 159, maxLife: 200,
      }
      updateParticle(p, 0, 0)
      expect(p.opacity).toBeLessThan(1)
    })
  })

  describe('drawParticle', () => {
    it('draws a square particle', () => {
      const ctx = mockCtx()
      const p: Particle = {
        x: 50, y: 50, vx: 0, vy: 0,
        rotation: 45, rotationSpeed: 0,
        size: 8, color: '#ff0000', opacity: 0.8,
        shape: 'square', life: 0, maxLife: 200,
      }
      drawParticle(ctx, p)
      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalledWith(50, 50)
      expect(ctx.fillRect).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('draws a circle particle', () => {
      const ctx = mockCtx()
      const p: Particle = {
        x: 50, y: 50, vx: 0, vy: 0,
        rotation: 0, rotationSpeed: 0,
        size: 8, color: '#00ff00', opacity: 1,
        shape: 'circle', life: 0, maxLife: 200,
      }
      drawParticle(ctx, p)
      expect(ctx.beginPath).toHaveBeenCalled()
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
    })

    it('draws a strip particle', () => {
      const ctx = mockCtx()
      const p: Particle = {
        x: 50, y: 50, vx: 0, vy: 0,
        rotation: 0, rotationSpeed: 0,
        size: 8, color: '#0000ff', opacity: 1,
        shape: 'strip', life: 0, maxLife: 200,
      }
      drawParticle(ctx, p)
      expect(ctx.fillRect).toHaveBeenCalled()
    })
  })
})
