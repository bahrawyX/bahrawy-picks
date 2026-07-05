'use client'

import {
  type CSSProperties,
  type ReactNode,
  type Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, springGentle } from '@/lib/motion'
import { SearchBar } from './search-bar'
import { SkeletonRows } from './skeleton-rows'
import { ScrollToTop } from './scroll-to-top'
import { GroupHeader } from './group-header'
import { FixedList } from './fixed-list'
import { VariableList } from './variable-list'
import { GridList } from './grid-list'
import { TableList } from './table-list'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RenderItemProps<T> {
  item: T
  index: number
  isFirst: boolean
  isLast: boolean
  style: CSSProperties
}

export interface VirtualListHandle {
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void
  scrollToTop: () => void
  scrollToBottom: () => void
}

export interface VirtualListProps<T> {
  data: T[]
  renderItem: (props: RenderItemProps<T>) => ReactNode
  itemHeight?: number
  variableHeight?: boolean
  estimatedItemHeight?: number
  overscan?: number
  columns?: number | 'auto'
  minItemWidth?: number
  onLoadMore?: () => void
  isLoadingMore?: boolean
  hasMore?: boolean
  loadMoreThreshold?: number
  ref?: Ref<VirtualListHandle>
  initialScrollIndex?: number
  searchable?: boolean
  onSearch?: (query: string) => void
  filterFn?: (item: T, query: string) => boolean
  searchPlaceholder?: string
  isLoading?: boolean
  emptyState?: ReactNode
  emptySearchState?: ReactNode
  stickyIndices?: number[]
  groups?: { label: string; startIndex: number }[]
  tableMode?: boolean
  tableColumns?: { key: string; header: string; width?: number }[]
  direction?: 'vertical' | 'horizontal'
  height?: number | string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function VirtualListInner<T>(
  {
    data,
    renderItem,
    itemHeight = 60,
    variableHeight = false,
    estimatedItemHeight = 60,
    overscan = 5,
    columns,
    minItemWidth = 200,
    onLoadMore,
    isLoadingMore,
    hasMore,
    loadMoreThreshold = 200,
    initialScrollIndex,
    searchable = false,
    onSearch,
    filterFn,
    searchPlaceholder,
    isLoading = false,
    emptyState,
    emptySearchState,
    groups,
    tableMode = false,
    tableColumns,
    direction = 'vertical',
    height = 400,
    className,
  }: VirtualListProps<T>,
  ref: Ref<VirtualListHandle>
) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  // Search handler
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      onSearch?.(query)
    },
    [onSearch]
  )

  // Filtered data
  const filteredData = useMemo(() => {
    if (!searchQuery || !filterFn) return data
    return data.filter((item) => filterFn(item, searchQuery))
  }, [data, searchQuery, filterFn])

  // Scroll tracking for scroll-to-top button. The active sub-component
  // attaches `scrollRef` to its scroll container during the same commit,
  // so the element is guaranteed to be populated by the time this effect
  // runs — no polling needed. Deps cover every branch swap that remounts
  // the container (loading/empty states and list-mode changes).
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => setShowScrollToTop(el.scrollTop > 500)
    check()
    el.addEventListener('scroll', check, { passive: true })
    return () => el.removeEventListener('scroll', check)
  }, [filteredData.length, isLoading, variableHeight, tableMode, columns])

  // Imperative handle
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number, behavior: ScrollBehavior = 'smooth') => {
      const el = scrollRef.current
      if (!el) return
      const offset = index * (variableHeight ? estimatedItemHeight : itemHeight)
      el.scrollTo({ top: offset, behavior })
    },
    scrollToTop: () => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    },
    scrollToBottom: () => {
      const el = scrollRef.current
      if (!el) return
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    },
  }))

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Group header renderer
  const groupHeaderRenderer = useCallback(
    (label: string) => <GroupHeader label={label} />,
    []
  )

  // Determine which mode to render
  const isGridMode = columns != null
  const isTableMode = tableMode && tableColumns != null

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={springGentle}
      className={cn(
        'relative rounded-xl border border-picks-fg/[0.06] bg-picks-fg/[0.02] overflow-hidden',
        className
      )}
    >
      {/* Search bar */}
      {searchable && (
        <SearchBar
          placeholder={searchPlaceholder}
          onChange={handleSearch}
        />
      )}

      {/* Loading skeleton */}
      {isLoading ? (
        <SkeletonRows
          count={Math.ceil(
            (typeof height === 'number' ? height : 400) / itemHeight
          )}
          itemHeight={itemHeight - 8}
        />
      ) : filteredData.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={springGentle}
          className="flex items-center justify-center text-sm text-picks-fg/40"
          style={{
            height: typeof height === 'number' ? height : 400,
          }}
        >
          {searchQuery
            ? emptySearchState ?? 'No results found.'
            : emptyState ?? 'No items.'}
        </motion.div>
      ) : isTableMode ? (
        /* Table mode */
        <TableList
          data={filteredData as (T & Record<string, unknown>)[]}
          tableColumns={tableColumns!}
          itemHeight={itemHeight}
          overscan={overscan}
          height={height}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          loadMoreThreshold={loadMoreThreshold}
          scrollRef={scrollRef}
        />
      ) : isGridMode ? (
        /* Grid mode */
        <GridList
          data={filteredData}
          renderItem={renderItem}
          itemHeight={itemHeight}
          overscan={overscan}
          height={height}
          columns={columns!}
          minItemWidth={minItemWidth}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          loadMoreThreshold={loadMoreThreshold}
          scrollRef={scrollRef}
        />
      ) : variableHeight ? (
        /* Variable height mode */
        <VariableList
          data={filteredData}
          renderItem={renderItem}
          estimatedItemHeight={estimatedItemHeight}
          overscan={overscan}
          height={height}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          loadMoreThreshold={loadMoreThreshold}
          initialScrollIndex={initialScrollIndex}
          scrollRef={scrollRef}
        />
      ) : (
        /* Fixed height mode (default) */
        <FixedList
          data={filteredData}
          renderItem={renderItem}
          itemHeight={itemHeight}
          overscan={overscan}
          height={height}
          direction={direction}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          loadMoreThreshold={loadMoreThreshold}
          initialScrollIndex={initialScrollIndex}
          groups={groups}
          groupHeaderRenderer={groupHeaderRenderer}
          scrollRef={scrollRef}
        />
      )}

      {/* Scroll to top button */}
      <ScrollToTop visible={showScrollToTop} onClick={scrollToTop} />
    </motion.div>
  )
}

export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: Ref<VirtualListHandle> }
) => ReactNode
