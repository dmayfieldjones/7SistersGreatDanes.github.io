import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ezra × Piper Litter | 7Sisters Farm — Great Dane Puppies Born',
  description:
    'Ezra × Piper litter at 7Sisters Farm: six puppies (two girls, four boys), whelped March 2026. Health-tested parents, pedigree explorer. Follow us on TikTok for wins, litters, and life with our dogs. Central Illinois Great Dane breeders.',
  keywords: [
    'Ezra Piper Great Dane litter',
    '7Sisters Farm litter',
    'Great Dane puppies Illinois',
    'Central Illinois Great Dane puppies',
    'health tested Great Dane puppies',
    'Great Dane pedigree',
  ],
  openGraph: {
    title: 'Ezra × Piper Litter | 7Sisters Farm',
    description:
      'Six Great Dane puppies whelped March 2026. Health-tested parents, pedigree explorer, Central Illinois.',
    type: 'website',
    url: 'https://7sistersgreatdanes.com/EzraxPiper',
    siteName: '7Sisters Farm',
    images: [
      {
        url: 'https://7sistersgreatdanes.com/img/EzraxPiper.jpg',
        width: 1999,
        height: 1500,
        alt: 'Ezra × Piper litter — 7Sisters Farm Great Danes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ezra × Piper Litter | 7Sisters Farm',
    description:
      'Six Great Dane puppies whelped March 2026. Health-tested parents and pedigree explorer.',
    images: ['https://7sistersgreatdanes.com/img/EzraxPiper.jpg'],
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com/EzraxPiper',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
