import type { Metadata } from 'next'
import { Inter, Bricolage_Grotesque } from 'next/font/google'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/navbar'
import { NavigationProgress } from '@/components/navigation-progress'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const SITE_URL = 'https://bahrawy-picks.vercel.app'
const SITE_NAME = 'Picks'
const SITE_TITLE = 'Picks — Beautifully crafted React components'
const SITE_DESCRIPTION =
  'An open-source collection of 130+ React & Next.js components. Animated, accessible, copy-paste-ready. Built with Tailwind, Framer Motion, GSAP, and Radix.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s — Bahrawy',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'Abdelrahman el-Bahrawy', url: SITE_URL }],
  creator: 'Abdelrahman el-Bahrawy',
  publisher: 'Abdelrahman el-Bahrawy',
  generator: 'Next.js',
  category: 'technology',
  keywords: [
    'React components',
    'Next.js components',
    'Tailwind components',
    'Framer Motion',
    'GSAP',
    'animation library',
    'UI library',
    'component library',
    'copy paste components',
    'shadcn alternative',
    'React UI kit',
    'scroll animations',
    'Bahrawy',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Picks — Beautifully crafted React components',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@bahrawydev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#0A0A0A' },
  ],
  colorScheme: 'dark' as const,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${bricolage.variable} bg-black`}
      suppressHydrationWarning
    >
      <body className="bg-black font-sans text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  description: SITE_DESCRIPTION,
                  inLanguage: 'en-US',
                  publisher: { '@id': `${SITE_URL}/#person` },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${SITE_URL}/components?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Person',
                  '@id': `${SITE_URL}/#person`,
                  name: 'Abdelrahman el-Bahrawy',
                  url: SITE_URL,
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': `${SITE_URL}/#app`,
                  name: SITE_NAME,
                  description: SITE_DESCRIPTION,
                  url: SITE_URL,
                  applicationCategory: 'DeveloperApplication',
                  operatingSystem: 'Any',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  author: { '@id': `${SITE_URL}/#person` },
                },
              ],
            }),
          }}
        />
        <NavigationProgress />
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
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
