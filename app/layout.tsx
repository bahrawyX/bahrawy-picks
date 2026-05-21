import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/navbar'
import { NavigationProgress } from '@/components/navigation-progress'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bahrawy — Beautifully crafted components for the modern web',
  description:
    'An open-source collection of React & Next.js components. Copy, paste, and ship your next idea — faster.',
  metadataBase: new URL('https://bahrawy.me'),
  openGraph: {
    title: 'Bahrawy — Beautifully crafted components',
    description:
      'An open-source collection of React & Next.js components. Copy, paste, ship.',
    url: 'https://bahrawy.me',
    siteName: 'Bahrawy',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} bg-black`}
      suppressHydrationWarning
    >
      <body className="bg-black font-sans text-white antialiased">
        <NavigationProgress />
        <Navbar />
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
