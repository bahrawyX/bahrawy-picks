'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  delay?: number
  axis?: 'x' | 'y'
  className?: string
}

/**
 * Shared-axis scroll reveal. Element fades + translates along the chosen axis
 * once it enters the viewport. Uses M3 enter motion (300ms, standard easing).
 */
export function Reveal({
  children,
  delay = 0,
  axis = 'y',
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-[opacity,transform] duration-m3-enter ease-m3-enter will-change-[opacity,transform]',
        visible
          ? 'opacity-100 translate-x-0 translate-y-0'
          : axis === 'y'
            ? 'opacity-0 translate-y-6'
            : 'opacity-0 translate-x-6',
        className
      )}
    >
      {children}
    </div>
  )
}
