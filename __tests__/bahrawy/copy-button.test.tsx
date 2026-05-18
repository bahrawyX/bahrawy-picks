import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { CopyButton } from '@/components/bahrawy/copy-button'

// Create a mock copy function we inject via copyFn prop
const mockCopy = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)

afterEach(() => {
  mockCopy.mockReset()
  mockCopy.mockResolvedValue(undefined)
  vi.restoreAllMocks()
})

describe('CopyButton', () => {
  it('renders with copy icon', () => {
    render(<CopyButton text="hello" copyFn={mockCopy} />)
    expect(screen.getByLabelText('Copy')).toBeInTheDocument()
  })

  it('copies text to clipboard on click', async () => {
    const user = userEvent.setup()
    render(<CopyButton text="hello world" copyFn={mockCopy} />)
    await user.click(screen.getByLabelText('Copy'))
    await waitFor(() => {
      expect(mockCopy).toHaveBeenCalledWith('hello world')
    })
  })

  it('shows copied state after click', async () => {
    const user = userEvent.setup()
    render(<CopyButton text="test" copyFn={mockCopy} />)
    await user.click(screen.getByLabelText('Copy'))
    await waitFor(() => {
      expect(screen.getByLabelText('Copied!')).toBeInTheDocument()
    })
  })

  it('calls onCopy callback', async () => {
    const onCopy = vi.fn()
    const user = userEvent.setup()
    render(<CopyButton text="test" onCopy={onCopy} copyFn={mockCopy} />)
    await user.click(screen.getByLabelText('Copy'))
    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledOnce()
    })
  })

  it('resets to idle after duration', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CopyButton text="test" duration={1000} copyFn={mockCopy} />)
    await user.click(screen.getByLabelText('Copy'))

    await waitFor(() => {
      expect(screen.getByLabelText('Copied!')).toBeInTheDocument()
    })

    act(() => {
      vi.advanceTimersByTime(1100)
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Copy')).toBeInTheDocument()
    })

    vi.useRealTimers()
  })

  it('shows error state when clipboard fails', async () => {
    mockCopy.mockRejectedValueOnce(new Error('Denied'))
    const onError = vi.fn()
    const user = userEvent.setup()
    render(<CopyButton text="test" onError={onError} copyFn={mockCopy} />)
    await user.click(screen.getByLabelText('Copy'))
    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(screen.getByLabelText('Failed to copy')).toBeInTheDocument()
    })
  })

  it('renders with label text', () => {
    render(<CopyButton text="test" label="Copy code" copyFn={mockCopy} />)
    expect(screen.getByText('Copy code')).toBeInTheDocument()
  })

  it('renders different variants', () => {
    const { rerender } = render(<CopyButton text="test" variant="outline" copyFn={mockCopy} />)
    expect(screen.getByLabelText('Copy')).toBeInTheDocument()
    rerender(<CopyButton text="test" variant="ghost" copyFn={mockCopy} />)
    expect(screen.getByLabelText('Copy')).toBeInTheDocument()
  })

  it('renders different sizes', () => {
    const { rerender } = render(<CopyButton text="test" size="sm" copyFn={mockCopy} />)
    expect(screen.getByLabelText('Copy')).toBeInTheDocument()
    rerender(<CopyButton text="test" size="lg" copyFn={mockCopy} />)
    expect(screen.getByLabelText('Copy')).toBeInTheDocument()
  })
})
