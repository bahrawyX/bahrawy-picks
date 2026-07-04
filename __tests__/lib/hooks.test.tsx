import { describe, expect, it, vi } from 'vitest'
import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useFocusTrap } from '@/lib/use-focus-trap'
import { useRovingTabindex } from '@/lib/use-roving-tabindex'

function TrapDemo({ active }: { active: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null)
  useFocusTrap(ref, active, { initialFocusDelay: 0 })
  return (
    <div>
      <button>outside</button>
      <div ref={ref} tabIndex={-1} data-testid="trap">
        <button>first</button>
        <button>middle</button>
        <button>last</button>
      </div>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('moves focus in on activation and restores on deactivation', () => {
    vi.useFakeTimers()
    const { rerender } = render(<TrapDemo active={false} />)
    const outside = screen.getByText('outside')
    outside.focus()

    rerender(<TrapDemo active />)
    act(() => {
      vi.runAllTimers()
    })
    expect(document.activeElement).toBe(screen.getByText('first'))

    rerender(<TrapDemo active={false} />)
    expect(document.activeElement).toBe(outside)
    vi.useRealTimers()
  })

  it('cycles Tab from last to first and Shift+Tab from first to last', () => {
    vi.useFakeTimers()
    render(<TrapDemo active />)
    act(() => {
      vi.runAllTimers()
    })
    const first = screen.getByText('first')
    const last = screen.getByText('last')

    last.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBe(first)

    first.focus()
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
    vi.useRealTimers()
  })
})

function RovingDemo({
  onNavigate,
  disabled = [],
}: {
  onNavigate?: (i: number) => void
  disabled?: number[]
}) {
  const roving = useRovingTabindex({
    count: 3,
    onNavigate,
    isDisabled: (i) => disabled.includes(i),
  })
  return (
    <div role="toolbar">
      {['a', 'b', 'c'].map((label, i) => (
        <button key={label} {...roving.getItemProps(i)}>
          {label}
        </button>
      ))}
    </div>
  )
}

describe('useRovingTabindex', () => {
  it('makes exactly one item tabbable', () => {
    render(<RovingDemo />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.map((b) => b.tabIndex)).toEqual([0, -1, -1])
  })

  it('ArrowRight moves focus and fires onNavigate; wraps at the end', () => {
    const onNavigate = vi.fn()
    render(<RovingDemo onNavigate={onNavigate} />)
    const [a, b, c] = screen.getAllByRole('button')

    a.focus()
    fireEvent.keyDown(a, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(b)
    expect(onNavigate).toHaveBeenLastCalledWith(1)

    fireEvent.keyDown(b, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(c)

    fireEvent.keyDown(c, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(a)
  })

  it('Home/End jump to the ends and skip disabled items', () => {
    render(<RovingDemo disabled={[2]} />)
    const [a, b] = screen.getAllByRole('button')
    a.focus()
    fireEvent.keyDown(a, { key: 'End' })
    // index 2 is disabled → End lands on 1
    expect(document.activeElement).toBe(b)
    fireEvent.keyDown(b, { key: 'Home' })
    expect(document.activeElement).toBe(a)
  })
})
