import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ezra × Piper Litter | 7Sisters Farm — Great Dane Puppies Born',
  description:
    'Ezra × Piper litter at 7Sisters Farm: six puppies (two girls, four boys), whelped March 2026. Health-tested parents, pedigree explorer. Follow us on TikTok for wins, litters, and life with our dogs. Central Illinois Great Dane breeders.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
