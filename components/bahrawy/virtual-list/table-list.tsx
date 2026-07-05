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

interface TableColumn {
  key: string
  header: string
  width?: number
}

interface RenderItemProps<T> {
  item: T
  index: number
  isFirst: boolean
  isLast: boolean
  style: CSSProperties
}

interface TableListProps<T> {
  data: T[]
  renderItem?: (props: RenderItemProps<T>) => ReactNode
  tableColumns: TableColumn[]
  itemHeight: number
  overscan: number
  height: number | string
  onLoadMore?: () => void
  isLoadingMore?: boolean
  hasMore?: boolean
  loadMoreThreshold: number
  scrollRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function TableList<T extends Record<string, unknown>>({
  data,
  renderItem,
  tableColumns,
  itemHeight,
  overscan,
  height,
  onLoadMore,
  isLoadingMore,
  hasMore,
  loadMoreThreshold,
  scrollRef,
  className,
}: TableListProps<T>) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const loadMoreCalledRef = useRef(false)

  // Sync parent scrollRef to point at our scrollable body
  useEffect(() => {
    const mutableRef = scrollRef as React.MutableRefObject<HTMLDivElement | null>
    mutableRef.current = bodyRef.current
  })

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => bodyRef.current,
    estimateSize: () => itemHeight,
    overscan,
  })

  const items = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  const handleScroll = useCallback(() => {
    if (!onLoadMore || !hasMore || isLoadingMore || loadMoreCalledRef.current) return
    const el = bodyRef.current
    if (!el) return

    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
    if (remaining < loadMoreThreshold) {
      loadMoreCalledRef.current = true
      onLoadMore()
    }
  }, [onLoadMore, hasMore, isLoadingMore, loadMoreThreshold])

  useEffect(() => {
    loadMoreCalledRef.current = false
  }, [data.length])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className={cn('flex flex-col', className)} style={{ height }}>
      {/* Sticky header */}
      <div className="flex shrink-0 border-b border-picks-fg/[0.08] bg-picks-fg/[0.03]">
        {tableColumns.map((col) => (
          <div
            key={col.key}
            className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-picks-fg/50"
            style={{ width: col.width ?? 150, flexShrink: 0 }}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Scrollable body */}
      <div ref={bodyRef} className="flex-1 overflow-auto">
        <div
          style={{
            height: totalSize,
            width: '100%',
            position: 'relative',
          }}
        >
          {items.map((virtualItem) => {
            const item = data[virtualItem.index]
            const itemStyle: CSSProperties = {
              position: 'absolute',
              top: virtualItem.start,
              left: 0,
              width: '100%',
              height: virtualItem.size,
            }

            if (renderItem) {
              return (
                <div key={virtualItem.index} style={itemStyle}>
                  {renderItem({
                    item,
                    index: virtualItem.index,
                    isFirst: virtualItem.index === 0,
                    isLast: virtualItem.index === data.length - 1,
                    style: itemStyle,
                  })}
                </div>
              )
            }

            return (
              <div
                key={virtualItem.index}
                className="flex items-center border-b border-picks-fg/[0.04] hover:bg-picks-fg/[0.02] transition-colors"
                style={itemStyle}
              >
                {tableColumns.map((col) => (
                  <div
                    key={col.key}
                    className="truncate px-4 text-sm text-picks-fg/70"
                    style={{ width: col.width ?? 150, flexShrink: 0 }}
                  >
                    {String(item[col.key] ?? '')}
                  </div>
                ))}
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
    </div>
  )
}
