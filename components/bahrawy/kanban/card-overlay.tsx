'use client'

import type { KanbanCard } from './index'
import { KanbanCardComponent } from './card'

interface CardOverlayProps {
  card: KanbanCard
}

export function CardOverlay({ card }: CardOverlayProps) {
  return <KanbanCardComponent card={card} isDragOverlay />
}
