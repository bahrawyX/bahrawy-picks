import { redirect } from 'next/navigation'
import { registry } from '@/components/showcase/registry'

export default function ComponentsIndex() {
  const first = registry.find((e) => e.kind === 'ready')
  if (first) redirect(`/components/${first.slug}`)
  return null
}
