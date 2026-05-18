import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CountUp } from '@/components/bahrawy/count-up'

// Mock framer-motion to make testing deterministic
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    useInView: () => true, // Always in view
    useMotionValue: (initial: number) => {
      let value = initial
      const listeners: Set<(v: number) => void> = new Set()
      return {
        get: () => value,
        set: (v: number) => {
          value = v
          listeners.forEach((fn) => fn(v))
        },
        on: (_: string, fn: (v: number) => void) => {
          listeners.add(fn)
          return () => listeners.delete(fn)
        },
      }
    },
    useSpring: (mv: any) => {
      // Return a transform-compatible mock
      return mv
    },
    useTransform: (_source: any, transform: (v: number) => string) => {
      // For testing, compute the initial transform
      const initialValue = typeof _source?.get === 'function' ? _source.get() : 0
      return {
        get: () => transform(initialValue),
        on: vi.fn(() => () => {}),
      }
    },
    motion: {
      span: ({ children, ...props }: any) => {
        // Render the motion value content
        const displayVal = children?.get ? children.get() : children
        return <span {...props}>{displayVal}</span>
      },
    },
  }
})

describe('CountUp', () => {
  it('renders without crashing', () => {
    render(<CountUp to={100} />)
    // Component should be in the document
    const el = document.querySelector('.tabular-nums')
    expect(el).toBeInTheDocument()
  })

  it('renders with prefix', () => {
    render(<CountUp to={100} prefix="$" />)
    const el = document.querySelector('.tabular-nums')
    expect(el).toBeInTheDocument()
    // Initial value should include prefix
    expect(el?.textContent).toContain('$')
  })

  it('renders with suffix', () => {
    render(<CountUp to={100} suffix="%" />)
    const el = document.querySelector('.tabular-nums')
    expect(el?.textContent).toContain('%')
  })

  it('renders with custom className', () => {
    render(<CountUp to={100} className="my-class" />)
    const el = document.querySelector('.my-class')
    expect(el).toBeInTheDocument()
  })

  it('renders from initial value', () => {
    render(<CountUp to={100} from={50} />)
    const el = document.querySelector('.tabular-nums')
    expect(el).toBeInTheDocument()
    // Initially should show 50 formatted
    expect(el?.textContent).toContain('50')
  })

  it('renders with decimals', () => {
    render(<CountUp to={99.99} from={99.99} decimals={2} />)
    const el = document.querySelector('.tabular-nums')
    expect(el?.textContent).toContain('99.99')
  })

  it('renders with custom separator', () => {
    render(<CountUp to={1000} from={1000} separator="." />)
    const el = document.querySelector('.tabular-nums')
    expect(el?.textContent).toContain('1.000')
  })

  it('applies tabular-nums class by default', () => {
    render(<CountUp to={100} />)
    const el = document.querySelector('.tabular-nums')
    expect(el).toBeInTheDocument()
  })
})
