import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bahrawy — Beautifully crafted React components',
    short_name: 'Bahrawy',
    description:
      'An open-source collection of React & Next.js components. Copy, paste, ship.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    orientation: 'portrait',
    categories: ['developer', 'productivity', 'design'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon-package/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-package/android-chrome-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-package/android-chrome-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon-package/favicon-maskable.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
