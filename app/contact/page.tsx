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
    <div className="content">
      <div className="post-title ">
        <h1>Contact Us</h1>
      </div>
      <main className="content-wrapper">
        {/* Hero Section */}
        <section className="hero-section">
          <img
            src="/img/Colorlogo_nobackground.png"
            alt="7Sisters Farm Logo"
            width={300}
            height="auto"
            className="hero-logo"
            loading="lazy"
          />
        </section>
        <section style={{ textAlign: 'center' }}>
          <p>
            You can reach us at:{' '}
            <a href="mailto:dustin@mayfieldjones.com">dustin@mayfieldjones.com</a>
          </p>
        </section>
      </main>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-section {
              text-align: center;
              margin-bottom: 2rem;
            }
            .hero-logo {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
            .content-wrapper {
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
            }
          `,
        }}
      />
    </div>
  )
}
