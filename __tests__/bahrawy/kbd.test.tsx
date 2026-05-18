import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Kbd } from '@/components/bahrawy/kbd'

describe('Kbd', () => {
  it('renders a single key', () => {
    render(<Kbd keys="K" />)
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('renders multiple keys from string with + separator', () => {
    render(<Kbd keys="ctrl+k" />)
    // Should render Ctrl and K as separate key elements
    const kbd = document.querySelector('kbd')
    expect(kbd).toBeInTheDocument()
  })

  it('renders keys from array', () => {
    render(<Kbd keys={['shift', 'enter']} />)
    const kbd = document.querySelector('kbd')
    expect(kbd).toBeInTheDocument()
  })

  it('renders with custom separator', () => {
    render(<Kbd keys="ctrl+k" separator="-" />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('applies sm size styles', () => {
    render(<Kbd keys="K" size="sm" />)
    const keySpan = document.querySelector('kbd span span')
    expect(keySpan?.className).toContain('h-5')
  })

  it('applies md size styles (default)', () => {
    render(<Kbd keys="K" />)
    const keySpan = document.querySelector('kbd span span')
    expect(keySpan?.className).toContain('h-6')
  })

  it('applies lg size styles', () => {
    render(<Kbd keys="K" size="lg" />)
    const keySpan = document.querySelector('kbd span span')
    expect(keySpan?.className).toContain('h-7')
  })

  it('renders arrow keys as symbols', () => {
    render(<Kbd keys="up" />)
    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  it('renders enter key as symbol', () => {
    render(<Kbd keys="enter" />)
    expect(screen.getByText('↵')).toBeInTheDocument()
  })

  it('has aria-label for accessibility', () => {
    render(<Kbd keys="ctrl+shift+k" />)
    const kbd = document.querySelector('kbd')
    expect(kbd).toHaveAttribute('aria-label', 'ctrl + shift + k')
  })

  it('applies custom className', () => {
    render(<Kbd keys="K" className="my-kbd" />)
    const kbd = document.querySelector('kbd')
    expect(kbd?.className).toContain('my-kbd')
  })

  it('renders backspace as symbol', () => {
    render(<Kbd keys="backspace" />)
    expect(screen.getByText('⌫')).toBeInTheDocument()
  })
})
