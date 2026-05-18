'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Trash2, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { KanbanCard } from './index'

const PRIORITIES = [
  { value: 'low' as const, label: 'Low', className: 'border-gray-500 text-gray-400 bg-gray-500/10' },
  { value: 'medium' as const, label: 'Medium', className: 'border-blue-500 text-blue-400 bg-blue-500/10' },
  { value: 'high' as const, label: 'High', className: 'border-amber-500 text-amber-400 bg-amber-500/10' },
  { value: 'urgent' as const, label: 'Urgent', className: 'border-red-500 text-red-400 bg-red-500/10' },
]

interface CardDetailProps {
  card: KanbanCard | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (card: KanbanCard) => void
  onDelete?: () => void
}

export function CardDetail({
  card,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: CardDetailProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<KanbanCard['priority']>(undefined)

  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setDescription(card.description ?? '')
      setPriority(card.priority)
    }
  }, [card])

  const handleSave = () => {
    if (!card) return
    onSave?.({
      ...card,
      title: title.trim() || card.title,
      description: description.trim() || undefined,
      priority,
    })
    onOpenChange(false)
  }

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-zinc-900 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white/90">Edit Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus-visible:ring-white/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus-visible:ring-white/20"
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() =>
                    setPriority(priority === p.value ? undefined : p.value)
                  }
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                    priority === p.value
                      ? p.className
                      : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.06]'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Labels display */}
          {card.labels && card.labels.length > 0 && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Labels
              </label>
              <div className="flex flex-wrap gap-1">
                {card.labels.map((label, i) => (
                  <span
                    key={i}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${label.color}20`,
                      color: label.color,
                    }}
                  >
                    {label.text}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Due date display */}
          {card.dueDate && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Due Date
              </label>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar className="h-4 w-4" />
                {new Date(card.dueDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDelete?.()
                onOpenChange(false)
              }}
              className="gap-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-white/50 hover:bg-white/[0.06] hover:text-white/70"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
