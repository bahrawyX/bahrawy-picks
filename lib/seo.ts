import type { Metadata } from 'next'
import { registry, type RegistryEntry } from '@/components/showcase/registry'

export const SITE_URL = 'https://bahrawy-picks.vercel.app'
export const SITE_NAME = 'Bahrawy'

const CATEGORY_LABEL: Record<string, string> = {
  form: 'Form & Input',
  overlay: 'Overlay',
  card: 'Cards',
  data: 'Data',
  layout: 'Layout',
  navigation: 'Navigation',
  hero: 'Hero',
  section: 'Sections',
  pricing: 'Pricing',
  footer: 'Footers',
  text: 'Text Effects',
  motion: 'Motion',
  scroll: 'Scroll',
  cursor: 'Cursor',
  'gsap-section': 'GSAP Sections',
  background: 'Backgrounds',
  decoration: 'Decoration',
  ui: 'UI Primitives',
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABEL[category] ?? category
}

function entryFromSlug(slug: string): Exclude<RegistryEntry, { kind: 'soon' }> | null {
  const entry = registry.find((e) => e.slug === slug)
  if (!entry || entry.kind === 'soon') return null
  return entry
}

/**
 * Returns full Metadata for a component page, including:
 *   - title using the layout's "%s — Bahrawy" template
 *   - SEO-optimised description (component description + library tagline)
 *   - canonical URL
 *   - Open Graph + Twitter card with a per-component dynamic OG image
 */
export function metadataForSlug(slug: string): Metadata {
  const entry = entryFromSlug(slug)
  if (!entry) {
    return {
      title: 'Component',
      description: 'A component in the Bahrawy library.',
    }
  }

  const url = `${SITE_URL}/components/${entry.slug}`
  const categoryLabel = getCategoryLabel(entry.category)
  const seoTitle = `${entry.name} — React ${categoryLabel} component`
  const seoDescription = `${entry.description} Free, open-source React + Next.js component from the Bahrawy library.`
  const ogImage = `/og?slug=${encodeURIComponent(entry.slug)}`

  return {
    title: entry.name,
    description: seoDescription,
    alternates: {
      canonical: `/components/${entry.slug}`,
    },
    keywords: [
      entry.name,
      `${entry.name} React component`,
      `React ${entry.name.toLowerCase()}`,
      `Next.js ${entry.name.toLowerCase()}`,
      `Tailwind ${entry.name.toLowerCase()}`,
      `${categoryLabel} component`,
      ...entry.dependencies,
      'Bahrawy',
    ],
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: seoTitle,
      description: entry.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${entry.name} — ${categoryLabel} component`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: entry.description,
      images: [ogImage],
    },
  }
}

/**
 * Returns BreadcrumbList JSON-LD for a component page.
 * Inject inside the page via a <script type="application/ld+json"> tag.
 */
export function breadcrumbJsonLdForSlug(slug: string): string | null {
  const entry = entryFromSlug(slug)
  if (!entry) return null

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Components',
        item: `${SITE_URL}/components`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: entry.name,
        item: `${SITE_URL}/components/${entry.slug}`,
      },
    ],
  })
}

/**
 * Returns SoftwareSourceCode JSON-LD for a component page.
 * Helps Google show the page as a developer resource.
 */
export function componentJsonLdForSlug(slug: string): string | null {
  const entry = entryFromSlug(slug)
  if (!entry) return null

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: entry.name,
    description: entry.description,
    url: `${SITE_URL}/components/${entry.slug}`,
    programmingLanguage: 'TypeScript',
    codeRepository: `${SITE_URL}/components/${entry.slug}`,
    runtimePlatform: ['React', 'Next.js'],
    author: {
      '@type': 'Person',
      name: 'Abdelrahman el-Bahrawy',
      url: SITE_URL,
    },
    isPartOf: {
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      url: SITE_URL,
    },
  })
}
