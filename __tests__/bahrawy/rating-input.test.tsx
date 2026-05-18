import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RatingInput } from '@/components/bahrawy/rating-input'

describe('RatingInput', () => {
  it('renders 5 stars by default', () => {
    render(<RatingInput />)
    const buttons = screen.getAllByRole('radio')
    expect(buttons).toHaveLength(5)
  })

  it('renders custom max count', () => {
    render(<RatingInput max={10} />)
    const buttons = screen.getAllByRole('radio')
    expect(buttons).toHaveLength(10)
  })

  it('calls onChange when star clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<RatingInput onChange={onChange} />)
    const stars = screen.getAllByRole('radio')
    await user.click(stars[2])
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('toggles value off when clicking same star', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<RatingInput value={3} onChange={onChange} />)
    const stars = screen.getAllByRole('radio')
    await user.click(stars[2])
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('shows labels when provided', async () => {
    const user = userEvent.setup()
    const labels = ['Bad', 'Poor', 'OK', 'Good', 'Great']
    render(<RatingInput labels={labels} />)
    const stars = screen.getAllByRole('radio')
    await user.click(stars[4])
    expect(screen.getByText('Great')).toBeInTheDocument()
  })

  it('renders emoji variant', () => {
    render(<RatingInput variant="emoji" />)
    expect(screen.getByText('😡')).toBeInTheDocument()
    expect(screen.getByText('😍')).toBeInTheDocument()
  })

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<RatingInput onChange={onChange} disabled />)
    const stars = screen.getAllByRole('radio')
    await user.click(stars[0])
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not call onChange when readOnly', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<RatingInput onChange={onChange} readOnly value={3} />)
    const stars = screen.getAllByRole('radio')
    await user.click(stars[0])
    expect(onChange).not.toHaveBeenCalled()
  })

  it('supports controlled value', () => {
    render(<RatingInput value={4} />)
    const stars = screen.getAllByRole('radio')
    expect(stars[3]).toHaveAttribute('aria-checked', 'true')
  })

  it('renders heart variant', () => {
    const { container } = render(<RatingInput variant="heart" />)
    // Heart icons should render (SVG elements)
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('renders with half-star support', () => {
    render(<RatingInput allowHalf max={5} />)
    // With allowHalf, each star has 2 buttons (half + full)
    const buttons = screen.getAllByRole('radio')
    expect(buttons.length).toBe(10) // 5 stars × 2 halves
  })
})
