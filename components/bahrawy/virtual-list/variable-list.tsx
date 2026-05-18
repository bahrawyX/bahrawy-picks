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

interface VariableListProps<T> {
  data: T[]
  renderItem: (props: RenderItemProps<T>) => ReactNode
  estimatedItemHeight: number
  overscan: number
  height: number | string
  onLoadMore?: () => void
  isLoadingMore?: boolean
  hasMore?: boolean
  loadMoreThreshold: number
  initialScrollIndex?: number
  scrollRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function VariableList<T>({
  data,
  renderItem,
  estimatedItemHeight,
  overscan,
  height,
  onLoadMore,
  isLoadingMore,
  hasMore,
  loadMoreThreshold,
  initialScrollIndex,
  scrollRef,
  className,
}: VariableListProps<T>) {
  const loadMoreCalledRef = useRef(false)

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimatedItemHeight,
    overscan,
    ...(initialScrollIndex != null && {
      initialOffset: initialScrollIndex * estimatedItemHeight,
    }),
  })

  const items = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  // Infinite scroll detection
  const handleScroll = useCallback(() => {
    if (!onLoadMore || !hasMore || isLoadingMore || loadMoreCalledRef.current) return
    const el = scrollRef.current
    if (!el) return

    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
    if (remaining < loadMoreThreshold) {
      loadMoreCalledRef.current = true
      onLoadMore()
    }
  }, [onLoadMore, hasMore, isLoadingMore, loadMoreThreshold, scrollRef])

  useEffect(() => {
    loadMoreCalledRef.current = false
  }, [data.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll, scrollRef])

  return (
    <div
      ref={scrollRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
    >
      <div
        style={{
          height: totalSize,
          width: '100%',
          position: 'relative',
        }}
      >
        {items.map((virtualItem) => {
          const itemStyle: CSSProperties = {
            position: 'absolute',
            top: virtualItem.start,
            left: 0,
            width: '100%',
          }

          return (
            <div
              key={virtualItem.index}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={itemStyle}
            >
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
          <Loader2 className="h-5 w-5 animate-spin text-white/40" />
        </div>
      )}
    </div>
  )
}
