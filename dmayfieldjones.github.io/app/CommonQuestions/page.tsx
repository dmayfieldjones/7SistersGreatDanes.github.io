import './index.css'

import { Metadata } from 'next'
import ClientComponent from './client'

export const metadata: Metadata = {
  title: 'Great Dane Breeder FAQ: Common Questions About Health Testing, Contracts & More',
  description:
    'Frequently asked questions about Great Dane breeders, health testing, contracts, guarantees, and what to expect when buying a Great Dane puppy from responsible breeders.',
  keywords: [
    'Great Dane breeder FAQ',
    'Great Dane breeder questions',
    'Great Dane health testing FAQ',
    'Great Dane breeder contracts',
    'Great Dane breeder guarantees',
    'Great Dane puppy questions',
    'Great Dane breeder support',
    'Great Dane breeder policies'
  ],
  openGraph: {
    title: 'Great Dane Breeder FAQ: Common Questions Answered',
    description: 'Frequently asked questions about Great Dane breeders, health testing, contracts, and guarantees.',
    type: 'website',
    url: 'https://dmayfieldjones.github.io/CommonQuestions',
    siteName: '7Sisters Farm',
  },
  alternates: {
    canonical: 'https://dmayfieldjones.github.io/CommonQuestions',
  },
}

export default function () {
  return <ClientComponent />
}
