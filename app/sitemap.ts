import type { MetadataRoute } from 'next'
import { registry } from '@/components/showcase/registry'

const SITE_URL = 'https://bahrawy.me'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/components`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const componentRoutes: MetadataRoute.Sitemap = registry
    .filter((e) => e.kind !== 'soon')
    .map((e) => ({
      url: `${SITE_URL}/components/${e.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  return [...staticRoutes, ...componentRoutes]
}
