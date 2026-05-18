'use client'

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
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

interface GridListProps<T> {
  data: T[]
  renderItem: (props: RenderItemProps<T>) => ReactNode
  itemHeight: number
  overscan: number
  height: number | string
  columns: number | 'auto'
  minItemWidth: number
  onLoadMore?: () => void
  isLoadingMore?: boolean
  hasMore?: boolean
  loadMoreThreshold: number
  scrollRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function GridList<T>({
  data,
  renderItem,
  itemHeight,
  overscan,
  height,
  columns: columnsProp,
  minItemWidth,
  onLoadMore,
  isLoadingMore,
  hasMore,
  loadMoreThreshold,
  scrollRef,
  className,
}: GridListProps<T>) {
  const loadMoreCalledRef = useRef(false)
  const [autoColumns, setAutoColumns] = useState(
    columnsProp === 'auto' ? 4 : columnsProp
  )

  const cols = columnsProp === 'auto' ? autoColumns : columnsProp

  // Auto-compute columns from container width
  useEffect(() => {
    if (columnsProp !== 'auto') return
    const el = scrollRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        const computed = Math.max(1, Math.floor(width / minItemWidth))
        setAutoColumns(computed)
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [columnsProp, minItemWidth, scrollRef])

  const rowCount = Math.ceil(data.length / cols)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => itemHeight,
    overscan,
  })

  const items = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  // Infinite scroll
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
        {items.map((virtualRow) => {
          const rowStart = virtualRow.index * cols
          const rowItems = data.slice(rowStart, rowStart + cols)

          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: virtualRow.start,
                left: 0,
                width: '100%',
                height: virtualRow.size,
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: '8px',
                padding: '0 8px',
              }}
            >
              {rowItems.map((item, colIndex) => {
                const dataIndex = rowStart + colIndex
                const itemStyle: CSSProperties = {
                  height: '100%',
                }
                return (
                  <div key={dataIndex} style={itemStyle}>
                    {renderItem({
                      item,
                      index: dataIndex,
                      isFirst: dataIndex === 0,
                      isLast: dataIndex === data.length - 1,
                      style: itemStyle,
                    })}
                  </div>
                )
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
