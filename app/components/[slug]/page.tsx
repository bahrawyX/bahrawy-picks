import fs from 'node:fs/promises'
import path from 'node:path'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FavoriteButton } from '@/components/favorite-button'
import { InstallCommand } from '@/components/showcase/install-command'
import { PreviewTabs } from '@/components/showcase/preview-tabs'
import { PropsTable } from '@/components/showcase/props-table'
import { getEntry, registry } from '@/components/showcase/registry'
import {
  metadataForSlug,
  breadcrumbJsonLdForSlug,
  componentJsonLdForSlug,
} from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return registry
    .filter((e) => e.kind === 'ready')
    .map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return metadataForSlug(slug)
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getEntry(slug)
  if (!entry || entry.kind !== 'ready') notFound()

  const code = await fs.readFile(
    path.join(process.cwd(), entry.sourcePath),
    'utf-8'
  )

  const language = entry.sourcePath.endsWith('.jsx')
    ? 'jsx'
    : entry.sourcePath.endsWith('.tsx')
      ? 'tsx'
      : 'ts'

  const Preview = entry.Preview
  const breadcrumb = breadcrumbJsonLdForSlug(slug)
  const component = componentJsonLdForSlug(slug)

  return (
    <article className="flex flex-col gap-10">
      {breadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumb }}
        />
      )}
      {component && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: component }}
        />
      )}
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          {entry.id} · {entry.category}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {entry.name}
          </h1>
          <FavoriteButton slug={entry.slug} />
        </div>
        <p className="mt-3 max-w-2xl text-pretty text-sm text-white/60">
          {entry.description}
        </p>
        <div className="mt-4">
          <InstallCommand componentName={entry.slug} />
        </div>
      </header>

      <PreviewTabs preview={<Preview />} code={code} language={language} />

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">
          Props
        </h2>
        <PropsTable props={entry.props} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">
          Dependencies
        </h2>
        <div className="flex flex-wrap gap-2">
          {entry.dependencies.length === 0 ? (
            <span className="text-sm text-white/40">No external dependencies.</span>
          ) : (
            entry.dependencies.map((dep) => (
              <code
                key={dep}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
              >
                {dep}
              </code>
            ))
          )}
        </div>
      </section>
    </article>
  )
}
