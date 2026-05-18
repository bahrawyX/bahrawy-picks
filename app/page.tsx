import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { Showcase } from '@/components/showcase'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <Hero />
      <Features />
      <Showcase />
      <Footer />
    </main>
  )
}
