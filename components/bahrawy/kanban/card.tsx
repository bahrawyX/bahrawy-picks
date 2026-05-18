'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { springGentle, fadeUp, springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Paperclip,
  MessageCircle,
  MoreHorizontal,
  Trash2,
  GripVertical,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { KanbanCard } from './index'

const PRIORITY_COLORS: Record<string, string> = {
  low: 'border-l-gray-500',
  medium: 'border-l-blue-500',
  high: 'border-l-amber-500',
  urgent: 'border-l-red-500',
}

interface KanbanCardComponentProps {
  card: KanbanCard
  onDelete?: () => void
  onClick?: () => void
  isDragOverlay?: boolean
}

export function KanbanCardComponent({
  card,
  onDelete,
  onClick,
  isDragOverlay,
}: KanbanCardComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', card },
    disabled: isDragOverlay,
  })

  const style = isDragOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      }

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date()

  return (
    <motion.div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      layout={!isDragOverlay}
      {...(isDragOverlay ? {} : fadeUp)}
      transition={springGentle}
      className={cn(
        'group relative cursor-pointer rounded-lg border border-l-2 border-white/[0.06] bg-white/[0.04] p-3 hover:bg-white/[0.06]',
        card.priority && PRIORITY_COLORS[card.priority],
        isDragging && 'opacity-40',
        isDragOverlay && 'rotate-3 scale-105 shadow-2xl shadow-black/40'
      )}
      onClick={(e) => {
        if (menuOpen) return
        onClick?.()
      }}
    >
      {/* Drag handle */}
      {!isDragOverlay && (
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-0.5 top-3 cursor-grab rounded p-0.5 text-white/20 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Cover image */}
      {card.coverImage && (
        <div className="-mx-3 -mt-3 mb-3 overflow-hidden rounded-t-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.coverImage}
            alt=""
            className="h-28 w-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-white pr-6">{card.title}</p>

      {/* Description */}
      {card.description && (
        <p className="mt-1 text-xs text-white/40 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.labels.map((label, i) => (
            <span
              key={i}
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
              }}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Due date */}
          {card.dueDate && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[10px]',
                isOverdue ? 'text-red-400' : 'text-white/40'
              )}
            >
              <Calendar className="h-3 w-3" />
              {new Date(card.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}

          {/* Attachments */}
          {card.attachments != null && card.attachments > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-white/40">
              <Paperclip className="h-3 w-3" />
              {card.attachments}
            </span>
          )}

          {/* Comments */}
          {card.comments != null && card.comments > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-white/40">
              <MessageCircle className="h-3 w-3" />
              {card.comments}
            </span>
          )}
        </div>

        {/* Assignees */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex -space-x-1.5">
            {card.assignees.slice(0, 3).map((a, i) => (
              <Avatar key={i} className="h-5 w-5 border border-white/10">
                <AvatarFallback className="bg-white/10 text-[8px] text-white/70">
                  {a.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {card.assignees.length > 3 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[8px] text-white/60">
                +{card.assignees.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Menu */}
      {!isDragOverlay && (
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100">
          <DropdownMenu onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded p-1 text-white/40 hover:bg-white/[0.08] hover:text-white/60"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-white/10 bg-zinc-900"
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.()
                }}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </motion.div>
  )
}
