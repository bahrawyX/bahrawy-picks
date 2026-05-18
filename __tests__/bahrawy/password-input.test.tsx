import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PasswordInput } from '@/components/bahrawy/password-input'

describe('PasswordInput', () => {
  it('renders with placeholder', () => {
    render(<PasswordInput placeholder="Enter password" />)
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<PasswordInput />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')

    await user.click(screen.getByLabelText('Show password'))
    expect(input).toHaveAttribute('type', 'text')

    await user.click(screen.getByLabelText('Hide password'))
    expect(input).toHaveAttribute('type', 'password')
  })

  it('calls onChange when typing', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<PasswordInput onChange={onChange} />)
    await user.type(screen.getByLabelText('Password'), 'abc')
    expect(onChange).toHaveBeenCalledTimes(3)
    expect(onChange).toHaveBeenLastCalledWith('abc')
  })

  it('shows strength meter when showStrength=true and password entered', async () => {
    const user = userEvent.setup()
    render(<PasswordInput showStrength />)
    const input = screen.getByLabelText('Password')
    await user.type(input, 'a')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Weak')
  })

  it('shows "Strong" when all requirements met', async () => {
    const user = userEvent.setup()
    render(<PasswordInput showStrength />)
    const input = screen.getByLabelText('Password')
    await user.type(input, 'Abcdef1!')
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Strong')
  })

  it('renders requirements checklist', async () => {
    const user = userEvent.setup()
    render(<PasswordInput />)
    await user.type(screen.getByLabelText('Password'), 'Test')
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
    expect(screen.getByText('One uppercase letter')).toBeInTheDocument()
  })

  it('supports controlled value', () => {
    render(<PasswordInput value="secret" onChange={() => {}} />)
    expect(screen.getByLabelText('Password')).toHaveValue('secret')
  })

  it('disables input when disabled', () => {
    render(<PasswordInput disabled />)
    expect(screen.getByLabelText('Password')).toBeDisabled()
  })

  it('hides strength meter when showStrength=false', async () => {
    const user = userEvent.setup()
    render(<PasswordInput showStrength={false} />)
    await user.type(screen.getByLabelText('Password'), 'test')
    expect(screen.queryByTestId('strength-label')).not.toBeInTheDocument()
  })

  it('supports custom requirements', async () => {
    const user = userEvent.setup()
    const reqs = [
      { label: 'Must have X', test: (pw: string) => pw.includes('X') },
    ]
    render(<PasswordInput requirements={reqs} />)
    await user.type(screen.getByLabelText('Password'), 'hello')
    expect(screen.getByText('Must have X')).toBeInTheDocument()
  })
})
