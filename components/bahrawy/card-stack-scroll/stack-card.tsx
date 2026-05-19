'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { CardStackItem } from './index'

export interface StackCardProps {
  card: CardStackItem
  className?: string
}

export const StackCard = forwardRef<HTMLDivElement, StackCardProps>(
  function StackCard({ card, className }, ref) {
    const { accentColor, content, number, icon, title, description, image } = card

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur',
          className
        )}
      >
        {/* Accent gradient overlay */}
        {accentColor && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-2xl"
            style={{
              background: `linear-gradient(to bottom, ${accentColor}15, transparent)`,
            }}
          />
        )}

        {content ? (
          <div className="relative h-full w-full">{content}</div>
        ) : (
          <div className="relative flex h-full w-full items-start p-8 md:p-12">
            {/* Left content */}
            <div className="flex min-w-0 flex-1 flex-col">
              {number && (
                <span className="text-6xl font-bold text-white/10">{number}</span>
              )}
              {icon && <div className="mt-4">{icon}</div>}
              {title && (
                <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
              )}
              {description && (
                <p className="mt-2 max-w-md text-base text-white/50">
                  {description}
                </p>
              )}
            </div>

            {/* Right image */}
            {image && (
              <div className="ml-8 hidden shrink-0 md:block">
                <img
                  src={image}
                  alt=""
                  className="h-full max-h-[350px] w-auto rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
