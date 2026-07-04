'use client'

/**
 * useRovingTabindex()
 *
 * Arrow-key navigation for composite widgets (tabs, toolbars,
 * segmented controls, menus): exactly one item is tabbable at a time,
 * arrows move focus between items, Home/End jump to the ends.
 *
 * Usage:
 *   const roving = useRovingTabindex({ count: items.length })
 *   items.map((item, i) => <button {...roving.getItemProps(i)} …/>)
 *
 * Pass `onNavigate` to make navigation also select (the common tabs
 * pattern); leave it out for focus-only roving (menus, toolbars).
 */

import * as React from 'react'

export interface RovingTabindexOptions {
  /** Number of items. */
  count: number
  /** Arrow axis. Default 'horizontal'. */
  orientation?: 'horizontal' | 'vertical' | 'both'
  /** Wrap from last to first. Default true. */
  loop?: boolean
  /** Skip items (e.g. disabled). Return true to skip index i. */
  isDisabled?: (index: number) => boolean
  /** Called when arrows/Home/End move to a new index. */
  onNavigate?: (index: number) => void
  /** Controlled focus index — pass the selected index for tabs-like widgets. */
  focusIndex?: number
}

export interface RovingItemProps {
  ref: (el: HTMLElement | null) => void
  tabIndex: number
  onKeyDown: (e: React.KeyboardEvent) => void
  onFocus: () => void
}

export function useRovingTabindex({
  count,
  orientation = 'horizontal',
  loop = true,
  isDisabled,
  onNavigate,
  focusIndex: controlledIndex,
}: RovingTabindexOptions) {
  const itemRefs = React.useRef<(HTMLElement | null)[]>([])
  const [internalIndex, setInternalIndex] = React.useState(0)
  const focusIndex = controlledIndex ?? internalIndex

  const move = React.useCallback(
    (from: number, delta: 1 | -1): number => {
      let next = from
      for (let step = 0; step < count; step++) {
        next = next + delta
        if (next < 0) next = loop ? count - 1 : 0
        if (next >= count) next = loop ? 0 : count - 1
        if (!isDisabled?.(next)) return next
        if (!loop && (next === 0 || next === count - 1)) break
      }
      return from
    },
    [count, loop, isDisabled],
  )

  const focusItem = React.useCallback(
    (index: number) => {
      setInternalIndex(index)
      itemRefs.current[index]?.focus()
      onNavigate?.(index)
    },
    [onNavigate],
  )

  const getItemProps = React.useCallback(
    (index: number): RovingItemProps => ({
      ref: (el) => {
        itemRefs.current[index] = el
      },
      tabIndex: index === focusIndex ? 0 : -1,
      onFocus: () => setInternalIndex(index),
      onKeyDown: (e) => {
        const horizontal = orientation !== 'vertical'
        const vertical = orientation !== 'horizontal'
        let next: number | null = null
        if (horizontal && e.key === 'ArrowRight') next = move(index, 1)
        else if (horizontal && e.key === 'ArrowLeft') next = move(index, -1)
        else if (vertical && e.key === 'ArrowDown') next = move(index, 1)
        else if (vertical && e.key === 'ArrowUp') next = move(index, -1)
        else if (e.key === 'Home') next = move(-1, 1)
        else if (e.key === 'End') next = move(count, -1)
        if (next !== null && next !== index) {
          e.preventDefault()
          focusItem(next)
        } else if (next !== null) {
          e.preventDefault()
        }
      },
    }),
    [count, focusIndex, move, focusItem, orientation],
  )

  return { getItemProps, focusIndex, focusItem }
}
