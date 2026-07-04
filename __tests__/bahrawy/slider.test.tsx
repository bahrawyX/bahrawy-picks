import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Slider } from '@/components/bahrawy/slider'

describe('Slider keyboard support', () => {
  it('exposes slider semantics', () => {
    render(<Slider defaultValue={50} label="Volume" />)
    const thumb = screen.getByRole('slider')
    expect(thumb).toHaveAttribute('aria-valuemin', '0')
    expect(thumb).toHaveAttribute('aria-valuemax', '100')
    expect(thumb).toHaveAttribute('aria-valuenow', '50')
    expect(thumb).toHaveAttribute('tabindex', '0')
  })

  it('ArrowRight/ArrowLeft step the value', () => {
    const onValueChange = vi.fn()
    render(<Slider defaultValue={50} onValueChange={onValueChange} />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(onValueChange).toHaveBeenLastCalledWith(51)
    expect(thumb).toHaveAttribute('aria-valuenow', '51')
    fireEvent.keyDown(thumb, { key: 'ArrowLeft' })
    fireEvent.keyDown(thumb, { key: 'ArrowLeft' })
    expect(onValueChange).toHaveBeenLastCalledWith(49)
  })

  it('Home/End jump to min/max, PageUp steps by a tenth of the range', () => {
    render(<Slider defaultValue={50} min={0} max={200} />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'End' })
    expect(thumb).toHaveAttribute('aria-valuenow', '200')
    fireEvent.keyDown(thumb, { key: 'Home' })
    expect(thumb).toHaveAttribute('aria-valuenow', '0')
    fireEvent.keyDown(thumb, { key: 'PageUp' })
    expect(thumb).toHaveAttribute('aria-valuenow', '20')
  })

  it('works controlled: keyboard emits onValueChange with the next value', () => {
    const onValueChange = vi.fn()
    render(<Slider value={10} onValueChange={onValueChange} />)
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowUp' })
    expect(onValueChange).toHaveBeenCalledWith(11)
  })

  it('range thumbs clamp against each other', () => {
    const onValueChange = vi.fn()
    render(
      <Slider range defaultValue={[40, 42]} onValueChange={onValueChange} />,
    )
    const [lo, hi] = screen.getAllByRole('slider')
    expect(lo).toHaveAttribute('aria-label', 'Slider minimum')
    expect(hi).toHaveAttribute('aria-label', 'Slider maximum')
    // Push the low thumb past the high thumb — it must clamp to hi.
    fireEvent.keyDown(lo, { key: 'PageUp' })
    expect(onValueChange).toHaveBeenLastCalledWith([42, 42])
    // High thumb End goes to max.
    fireEvent.keyDown(hi, { key: 'End' })
    expect(onValueChange).toHaveBeenLastCalledWith([42, 100])
  })

  it('ignores keys when disabled', () => {
    const onValueChange = vi.fn()
    render(<Slider defaultValue={50} disabled onValueChange={onValueChange} />)
    const thumb = screen.getByRole('slider')
    expect(thumb).toHaveAttribute('tabindex', '-1')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
