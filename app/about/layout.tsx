import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Illinois Great Dane Breeders | 7Sisters Farm - Central Illinois',
  description:
    'Meet Dustin and Karen, Illinois Great Dane breeders at 7Sisters Farm. 12+ years experience breeding AKC Great Danes in Central Illinois. Health tested, family raised.',
  keywords: [
    'Illinois Great Dane breeders',
    'about Illinois breeders',
    'Central Illinois Great Dane breeders',
    '7Sisters Farm breeders',
    'Illinois dog breeders',
    'Great Dane breeders Illinois',
    'Champaign Illinois breeders',
    'Urbana Illinois breeders'
  ],
  openGraph: {
    title: 'About Illinois Great Dane Breeders | 7Sisters Farm',
    description: 'Meet Dustin and Karen, experienced Illinois Great Dane breeders at 7Sisters Farm in Central Illinois.',
    type: 'website',
    url: 'https://dmayfieldjones.github.io/about',
    siteName: '7Sisters Farm',
    images: [
      {
        url: 'https://dmayfieldjones.github.io/img/wedding.png',
        width: 300,
        height: 300,
        alt: 'Dustin and Karen - Illinois Great Dane Breeders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Illinois Great Dane Breeders | 7Sisters Farm',
    description: 'Meet Dustin and Karen, experienced Illinois Great Dane breeders at 7Sisters Farm in Central Illinois.',
    images: ['https://dmayfieldjones.github.io/img/wedding.png'],
  },
  alternates: {
    canonical: 'https://dmayfieldjones.github.io/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
