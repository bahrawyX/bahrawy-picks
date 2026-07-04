'use client'

/**
 * useFocusTrap(ref, active, options)
 *
 * The focus behavior every modal surface needs, extracted from
 * <Dialog />: on activation it remembers the previously-focused
 * element and moves focus to the first focusable inside `ref` (or the
 * container itself), Tab/Shift+Tab cycle within the container, and on
 * deactivation focus is restored to where it was.
 *
 * The container should have `tabIndex={-1}` so it can receive focus
 * when it contains no focusable children.
 */

import * as React from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// checkVisibility covers display:none/visibility:hidden ancestors and,
// unlike offsetParent, works for position:fixed subtrees. Environments
// without it (jsdom) fall back to the `hidden` attribute.
function isVisible(el: HTMLElement): boolean {
  if (typeof el.checkVisibility === 'function') return el.checkVisibility()
  return !el.hidden
}

export interface FocusTrapOptions {
  /** Move focus into the container on activation. Default true. */
  autoFocus?: boolean
  /** Restore focus to the previously-active element on deactivation. Default true. */
  restoreFocus?: boolean
  /**
   * Delay (ms) before the initial focus — lets entrance animations
   * mount the tree first. Default 30.
   */
  initialFocusDelay?: number
}

export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  { autoFocus = true, restoreFocus = true, initialFocusDelay = 30 }: FocusTrapOptions = {},
) {
  // Initial focus + restore.
  React.useEffect(() => {
    if (!active) return
    const previouslyFocused = document.activeElement as HTMLElement | null

    let t: number | undefined
    if (autoFocus) {
      t = window.setTimeout(() => {
        const first =
          ref.current?.querySelector<HTMLElement>(FOCUSABLE) ?? ref.current
        first?.focus()
      }, initialFocusDelay)
    }

    return () => {
      if (t !== undefined) window.clearTimeout(t)
      if (restoreFocus) previouslyFocused?.focus?.()
    }
  }, [active, autoFocus, restoreFocus, initialFocusDelay, ref])

  // Tab cycling.
  React.useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const container = ref.current
      if (!container) return
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute('disabled') && isVisible(el))
      if (focusable.length === 0) {
        e.preventDefault()
        container.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement
      // If focus escaped the container entirely, pull it back in.
      if (!container.contains(current)) {
        e.preventDefault()
        first.focus()
        return
      }
      if (e.shiftKey && current === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && current === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, ref])
}
