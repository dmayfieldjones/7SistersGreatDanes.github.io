import './index.css'

import { Metadata } from 'next'
import ClientComponent from './client'
import { faqData } from './faqData'

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
    url: 'https://7sistersgreatdanes.com/CommonQuestions',
    siteName: '7Sisters Farm',
    locale: 'en_US',
    images: [
      {
        url: 'https://7sistersgreatdanes.com/img/Colorlogo_nobackground.png',
        width: 300,
        height: 300,
        alt: '7Sisters Farm — Great Dane breeder FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Great Dane Breeder FAQ: Common Questions Answered',
    description:
      'Frequently asked questions about Great Dane breeders, health testing, contracts, and guarantees.',
    images: ['https://7sistersgreatdanes.com/img/Colorlogo_nobackground.png'],
    creator: '@7sistersgreatdanes',
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com/CommonQuestions',
  },
}

export default function () {
  // Generate FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '') // Remove HTML tags for schema
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ClientComponent />
    </>
  )
}
