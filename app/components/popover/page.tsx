import type { Metadata } from 'next'
import { metadataForSlug, breadcrumbJsonLdForSlug, componentJsonLdForSlug } from '@/lib/seo'
import Client from './client'
export const metadata: Metadata = metadataForSlug('popover')
const breadcrumb = breadcrumbJsonLdForSlug('popover')
const component = componentJsonLdForSlug('popover')
export default function Page() {
  return (
    <>
      {breadcrumb && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />}
      {component && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: component }} />}
      <Client />
    </>
  )
}
