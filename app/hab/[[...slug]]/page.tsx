import type { Metadata } from 'next'
import HabRedirectClient from './HabRedirectClient'

const HAB_ORIGIN = 'https://mayfieldjones.com/hab'

/** Former `/hab/*` routes on this site — sent to the same path on mayfieldjones.com. */
const FORMER_HAB_PATHS = [
  [],
  ['archive'],
  ['data'],
  ['debug'],
  ['events'],
  ['interviews'],
  ['lessons'],
  ['projects'],
  ['resources'],
] as const

export function generateStaticParams() {
  return FORMER_HAB_PATHS.map((segments) => ({
    slug: segments.length ? [...segments] : [],
  }))
}

export const metadata: Metadata = {
  title: 'HAB.education has moved | 7Sisters Farm',
  description:
    'High-altitude balloon (HAB.education) content is hosted at mayfieldjones.com.',
  robots: { index: false, follow: true },
  alternates: { canonical: HAB_ORIGIN },
}

export default async function HabMovedPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const suffix = slug.length ? '/' + slug.join('/') : ''
  const destination = HAB_ORIGIN + suffix

  return <HabRedirectClient destination={destination} />
}
