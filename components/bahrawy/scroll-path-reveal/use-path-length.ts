'use client'

import { useRef, useState, useCallback } from 'react'

interface UsePathLengthReturn {
  pathRef: React.RefObject<SVGPathElement | null>
  totalLength: number
  measure: () => number
  getPoint: (length: number) => { x: number; y: number }
}

export function usePathLength(): UsePathLengthReturn {
  const pathRef = useRef<SVGPathElement | null>(null)
  const [totalLength, setTotalLength] = useState(0)

  const measure = useCallback((): number => {
    if (!pathRef.current) return 0
    const len = pathRef.current.getTotalLength()
    setTotalLength(len)
    return len
  }, [])

  const getPoint = useCallback((length: number): { x: number; y: number } => {
    if (!pathRef.current) return { x: 0, y: 0 }
    const pt = pathRef.current.getPointAtLength(length)
    return { x: pt.x, y: pt.y }
  }, [])

  return { pathRef, totalLength, measure, getPoint }
}
