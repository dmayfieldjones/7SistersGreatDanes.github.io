import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Illinois Great Dane Breeders | 7Sisters Farm - Central Illinois',
  description:
    'Contact 7Sisters Farm, premier Illinois Great Dane breeders in Central Illinois. Get in touch about AKC Great Danes, health testing, and available puppies.',
  keywords: [
    'contact Illinois Great Dane breeders',
    'Illinois Great Dane breeders contact',
    '7Sisters Farm contact',
    'Central Illinois Great Dane breeders',
    'Illinois dog breeders contact',
    'Great Dane breeders Illinois contact',
    'Champaign Illinois breeders contact',
    'Urbana Illinois breeders contact'
  ],
  openGraph: {
    title: 'Contact Illinois Great Dane Breeders | 7Sisters Farm',
    description: 'Contact 7Sisters Farm, premier Illinois Great Dane breeders in Central Illinois.',
    type: 'website',
    url: 'https://dmayfieldjones.github.io/contact',
    siteName: '7Sisters Farm',
  },
  alternates: {
    canonical: 'https://dmayfieldjones.github.io/contact',
  },
}

export default function Contact() {
  return (
    <div>
      <div className="contact-page">
        <h1>Contact Us</h1>
        <p>
          You can reach us at:{' '}
          <a href="mailto:dustin@mayfieldjones.com">dustin@mayfieldjones.com</a>
        </p>
      </div>
    </div>
  )
}
