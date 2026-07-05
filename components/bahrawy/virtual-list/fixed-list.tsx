'use client'

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RenderItemProps<T> {
  item: T
  index: number
  isFirst: boolean
  isLast: boolean
  style: CSSProperties
}

interface FixedListProps<T> {
  data: T[]
  renderItem: (props: RenderItemProps<T>) => ReactNode
  itemHeight: number
  overscan: number
  height: number | string
  direction: 'vertical' | 'horizontal'
  onLoadMore?: () => void
  isLoadingMore?: boolean
  hasMore?: boolean
  loadMoreThreshold: number
  initialScrollIndex?: number
  groups?: { label: string; startIndex: number }[]
  groupHeaderRenderer?: (label: string) => ReactNode
  scrollRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function FixedList<T>({
  data,
  renderItem,
  itemHeight,
  overscan,
  height,
  direction,
  onLoadMore,
  isLoadingMore,
  hasMore,
  loadMoreThreshold,
  initialScrollIndex,
  groups,
  groupHeaderRenderer,
  scrollRef,
  className,
}: FixedListProps<T>) {
  const isHorizontal = direction === 'horizontal'
  const loadMoreCalledRef = useRef(false)

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => itemHeight,
    overscan,
    horizontal: isHorizontal,
    ...(initialScrollIndex != null && { initialOffset: initialScrollIndex * itemHeight }),
  })

  const items = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  // Infinite scroll detection
  const handleScroll = useCallback(() => {
    if (!onLoadMore || !hasMore || isLoadingMore || loadMoreCalledRef.current) return
    const el = scrollRef.current
    if (!el) return

    const remaining = isHorizontal
      ? el.scrollWidth - el.scrollLeft - el.clientWidth
      : el.scrollHeight - el.scrollTop - el.clientHeight

    if (remaining < loadMoreThreshold) {
      loadMoreCalledRef.current = true
      onLoadMore()
    }
  }, [onLoadMore, hasMore, isLoadingMore, loadMoreThreshold, scrollRef, isHorizontal])

  // Reset loadMore guard when data changes
  useEffect(() => {
    loadMoreCalledRef.current = false
  }, [data.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll, scrollRef])

  // Build a map of group start indices for O(1) lookup
  const groupMap = groups
    ? new Map(groups.map((g) => [g.startIndex, g.label]))
    : null

  return (
    <div
      ref={scrollRef}
      className={cn('overflow-auto', className)}
      style={{ height, ...(isHorizontal && { overflowX: 'auto', overflowY: 'hidden' }) }}
    >
      <div
        style={{
          [isHorizontal ? 'width' : 'height']: totalSize,
          [isHorizontal ? 'height' : 'width']: '100%',
          position: 'relative',
        }}
      >
        {items.map((virtualItem) => {
          const groupLabel = groupMap?.get(virtualItem.index)
          const itemStyle: CSSProperties = isHorizontal
            ? {
                position: 'absolute',
                top: 0,
                left: virtualItem.start,
                width: virtualItem.size,
                height: '100%',
              }
            : {
                position: 'absolute',
                top: virtualItem.start,
                left: 0,
                width: '100%',
                height: virtualItem.size,
              }

          return (
            <div key={virtualItem.index} style={itemStyle}>
              {groupLabel && groupHeaderRenderer
                ? groupHeaderRenderer(groupLabel)
                : null}
              {renderItem({
                item: data[virtualItem.index],
                index: virtualItem.index,
                isFirst: virtualItem.index === 0,
                isLast: virtualItem.index === data.length - 1,
                style: itemStyle,
              })}
            </div>
          )
        })}
      </div>

      {isLoadingMore && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-picks-fg/40" />
        </div>
      )}
    </div>
  )
}
