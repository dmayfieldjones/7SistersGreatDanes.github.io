import { Metadata } from 'next'
import ContactForm from './ContactForm'
import './form.css'

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
    url: 'https://7sistersgreatdanes.com/contact',
    siteName: '7Sisters Farm',
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com/contact',
  },
}

export default function Contact() {
  return (
    <div className="content">
      <div className="post-title ">
        <h1>Contact Us</h1>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          Interested in one of our Great Danes? Please complete the form below.
          New here? Read our{' '}
          <a href="/PlacementProcess" style={{ color: '#bf141c', fontWeight: 500 }}>
            placement process
          </a>{' '}
          first to see how matching works.
        </p>
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

        {/* Email Contact - Concise */}
        <section style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e5e5' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#666' }}>
            Prefer to email directly?{' '}
            <a href="mailto:dustin@mayfieldjones.com" style={{ color: '#bf141c', textDecoration: 'underline', fontWeight: '500' }}>
              dustin@mayfieldjones.com
            </a>
          </p>
        </section>

        {/* Contact Form */}
        <ContactForm />
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
              max-width: 900px;
              margin: 0 auto;
              padding: 2rem;
            }
          `,
        }}
      />
    </div>
  )
}
