import './index.css'

import { Metadata } from 'next'
import ClientComponent from './client'
import { SITE_FLAT_PUPPY_PRICING } from '@/lib/site'

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
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com/CommonQuestions',
  },
}

// FAQ data for schema
const faqData = [
  {
    question: 'When can we take our puppy home?',
    answer: 'You may receive your dog 8 weeks after their birth with an understanding that they are transitioning through a critical stage of development in which exposure to fear can have longer lasting effects on behavior. Interestingly, this impact/fear period is well recognized among breeders but appears absent from scientific literature. Consideration for potential traumatic events should be considered at this time, i.g. cropping, unsympathetic discipline, and even challenging transport.'
  },
  {
    question: 'What value does our purchase include?',
    answer: 'Lifetime breeder support and education on the litter (i.g. health testing, pedigree, and our reasoning for parental selection), modified Puppy Culture socialization and training, age-appropriate vaccines, deworming, vet exams, health guarantee, microchipping and importantly microchip registration (greater than 40% of microchipped dogs have been found to not be registered), AKC registration (to ensure it is done correctly and timely), introduction to crate-leash-potty training, and ear cropping if desired.'
  },
  {
    question: 'Do show puppies cost more than companions?',
    answer: SITE_FLAT_PUPPY_PRICING,
  },
  {
    question: 'Why are your contracts customized?',
    answer: 'We believe our customized contracts initiate important conversation with our clients and help ensure the safety and health of the dogs we whelp. We expect potential owners to feel welcome to ask questions and be a participant in actively negotiating contracts.'
  },
  {
    question: 'What feed and how much?',
    answer: 'We value healthy, affordable, safe, and convenient feed for your dog. We argue there is no feed specific to a particular breed. However, Great Dane puppies should not be fed many feeds labeled for puppies because they contain excessively high concentrations of protein and fat. Rehydrating a quality dry kibble and supporting your dog with a variety of additional healthy foods (less than 10% by weight of their diet) will meet the needs of most dogs and satisfy dog lovers. A fresh, or raw, diet can also provide exceptional nutrition for your dog. The amount your Dane will eat depends on age, sex, type of food, and level of activity. Generally, our 8-12 week old puppies will eat 1.5 cups for each of their 3 daily meals. Adults will eat 6-10 cups daily divided roughly between two meals.'
  },
  {
    question: 'Why and how do you crop?',
    answer: 'It is the choice of the puppy owner whether or not to crop. We believe the minimally invasive surgery on, and following months of maintenance for, dogs that are cropped is a benign custom that appeals to aesthetic and traditional values shared by many dog lovers. Ear cropping continues to be a largely aesthetic choice. We find arguments in favor of cropping because of health and/or the natural upright ears of undomesticated canids unconvincing. Equally unconvincing are arguments discouraging cropping due to a suggested reduced ability to communicate, comparisons to amputation or mutilation, and veterinary professionals claiming the procedure non-medically necessary or lacking a scientific justification.'
  },
  {
    question: 'Do you breed Euro-lines of Great Danes?',
    answer: 'We follow the current standard as approved by the Great Dane Club of America and the American Kennel Club. How this standard has evolved and how previous conformation points were awarded is fascinating and telling of our breed. The traits associated with Euro-lines, sometimes called hyper-exaggerated features, are outside our standard, and others: UKC, KC, and FCI. We are happy to discuss individual features with curious potential clients.'
  }
]

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
