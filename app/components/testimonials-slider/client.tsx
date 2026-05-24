'use client'

import { TestimonialsSlider, type Testimonial } from '@/components/bahrawy/testimonials-slider'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const ITEMS: Testimonial[] = [
  {
    quote: 'Drop-in components that actually look like someone gave a damn. Shipped our marketing site in two days.',
    name: 'Sara Chen',
    role: 'Engineering Lead, Lumen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop',
  },
  {
    quote: 'Every component has the polish I would have applied last. Bahrawy gets out of the way and lets me ship.',
    name: 'Marcus Reid',
    role: 'Indie maker',
    fallback: 'M',
  },
  {
    quote: 'Spring physics on every interaction. It just feels alive — like Apple-level care, in an open-source library.',
    name: 'Priya Rao',
    role: 'Design Engineer, Orbital',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=80&auto=format&fit=crop',
  },
]

export default function TestimonialsSliderDocs() {
  return (
    <DocsPage
      title="Testimonials Slider"
      slug="testimonials-slider"
      description="A rotating testimonial section. Hovering pauses auto-rotation, clicking a dot jumps directly to that slide. Crossfades between quotes with a subtle lift."
      category="108 · section"
    >
      <DocsSection title="Live demo" description="Auto-advances every 5.5s — hover to pause.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <TestimonialsSlider
            eyebrow="Loved by makers"
            heading="What people are saying."
            items={ITEMS}
            accentColor="#A78BFA"
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={`<TestimonialsSlider items={items} interval={5500} accentColor="#A78BFA" />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
