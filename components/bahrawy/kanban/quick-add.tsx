'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { springGentle } from '@/lib/motion'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface QuickAddProps {
  onAdd: (title: string) => void
  onCancel: () => void
  isOpen: boolean
}

export function QuickAdd({ onAdd, onCancel, isOpen }: QuickAddProps) {
  const [title, setTitle] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (trimmed) {
      onAdd(trimmed)
      setTitle('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      onCancel()
      setTitle('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={springGentle}
          className="overflow-hidden"
        >
          <div className="space-y-2 pt-2">
            <Textarea
              ref={textareaRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter card title..."
              className="min-h-[60px] resize-none border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus-visible:ring-white/20"
              rows={2}
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!title.trim()}
                className="h-7 gap-1 bg-white/10 px-3 text-xs text-white hover:bg-white/20"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onCancel()
                  setTitle('')
                }}
                className="h-7 px-2 text-xs text-white/50 hover:bg-white/[0.06] hover:text-white/70"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
