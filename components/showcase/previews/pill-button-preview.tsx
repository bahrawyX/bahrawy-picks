'use client'

import { ArrowRight, Github, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PillButtonPreview() {
  return (
    <div className="flex h-[420px] w-full flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Star">
          <Star className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" className="group gap-2">
          Browse components
          <ArrowRight className="h-4 w-4 transition-transform duration-m3-enter ease-m3-enter group-hover:translate-x-0.5" />
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Github className="h-4 w-4" />
          Star on GitHub
        </Button>
      </div>
    </div>
  )
}
