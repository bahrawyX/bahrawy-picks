import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ScrollProgress } from '@/components/bahrawy/scroll-progress'

// Mock framer-motion hooks to avoid animation complexity in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: vi.fn(),
      on: vi.fn(() => () => {}),
    }),
    useSpring: (mv: any) => mv,
  }
})

describe('ScrollProgress', () => {
  beforeEach(() => {
    // Mock scroll dimensions
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    })
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 800,
      configurable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
      configurable: true,
    })
  })

  it('renders the progress bar', () => {
    render(<ScrollProgress />)
    expect(screen.getByTestId('scroll-progress')).toBeInTheDocument()
  })

  it('renders at top position by default', () => {
    render(<ScrollProgress />)
    const bar = screen.getByTestId('scroll-progress')
    expect(bar.className).toContain('top-0')
  })

  it('renders at bottom position', () => {
    render(<ScrollProgress position="bottom" />)
    const bar = screen.getByTestId('scroll-progress')
    expect(bar.className).toContain('bottom-0')
  })

  it('renders at left position', () => {
    render(<ScrollProgress position="left" />)
    const bar = screen.getByTestId('scroll-progress')
    expect(bar.className).toContain('left-0')
  })

  it('renders at right position', () => {
    render(<ScrollProgress position="right" />)
    const bar = screen.getByTestId('scroll-progress')
    expect(bar.className).toContain('right-0')
  })

  it('applies custom color class', () => {
    render(<ScrollProgress color="bg-blue-500" />)
    const bar = screen.getByTestId('scroll-progress')
    const inner = bar.querySelector('div')
    expect(inner?.className).toContain('bg-blue-500')
  })

  it('shows percentage when showPercentage=true', () => {
    render(<ScrollProgress showPercentage />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ScrollProgress className="my-custom-class" />)
    const bar = screen.getByTestId('scroll-progress')
    expect(bar.className).toContain('my-custom-class')
  })

  it('has fixed positioning', () => {
    render(<ScrollProgress />)
    const bar = screen.getByTestId('scroll-progress')
    expect(bar.className).toContain('fixed')
  })
})
