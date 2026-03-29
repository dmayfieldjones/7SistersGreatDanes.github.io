import React from 'react'
import { Mail, Github } from 'lucide-react'
import { Metadata } from 'next'
import AnimatedContent from './components/AnimatedContent'
import ScrollIndicator from './components/ScrollIndicator'
import ScrollActivator from './components/ScrollActivator'
// Force rebuild - September 6, 2025 - Attempt 2

export const metadata: Metadata = {
  title: 'Illinois Great Dane Breeders | 7Sisters Farm - Central Illinois',
  description:
    'Premier Illinois Great Dane breeders at 7Sisters Farm in Central Illinois. AKC registered Great Danes, health tested, family raised. Serving Illinois and surrounding states.',
  keywords: [
    'Illinois Great Dane breeders',
    'Illinois dogs',
    'Illinois breeders',
    'Great Dane breeders Illinois',
    'Central Illinois Great Danes',
    'AKC Great Danes Illinois',
    'Illinois dog breeders',
    'Great Dane puppies Illinois',
    '7Sisters Farm',
    'Champaign Illinois breeders',
    'Urbana Illinois dogs',
    'Illinois Great Dane kennel'
  ],
  authors: [{ name: 'Dustin and Karen Mayfield-Jones' }],
  creator: '7Sisters Farm',
  publisher: '7Sisters Farm',
  openGraph: {
    title: 'Illinois Great Dane Breeders | 7Sisters Farm',
    description: 'Premier Illinois Great Dane breeders in Central Illinois. AKC registered, health tested, family raised Great Danes.',
    type: 'website',
    url: 'https://7sistersgreatdanes.com',
    siteName: '7Sisters Farm',
    locale: 'en_US',
    images: [
      {
        url: 'https://7sistersgreatdanes.com/img/wedding.png',
        width: 1200,
        height: 630,
        alt: 'Dustin and Karen - Illinois Great Dane Breeders at 7Sisters Farm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Illinois Great Dane Breeders | 7Sisters Farm',
    description: 'Premier Illinois Great Dane breeders in Central Illinois. AKC registered, health tested, family raised.',
    images: ['https://7sistersgreatdanes.com/img/wedding.png'],
    creator: '@7sistersgreatdanes',
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://7sistersgreatdanes.com'),
}

const MayfieldJonesProfile = () => {
  return (
    <>
      <ScrollActivator />
      <div className="homepage-container" style={{ overflowY: 'visible', touchAction: 'pan-y' }}>
      {/* Full-screen video section */}
      <section className="video-hero-section">
        <div className="video-background">
          <iframe
            src="https://www.youtube.com/embed/M14l3BrfXhA?autoplay=1&mute=1&loop=1&playlist=M14l3BrfXhA&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&cc_load_policy=0&disablekb=1&enablejsapi=0&origin=https://7sistersgreatdanes.com"
            className="video-iframe"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Background Video"
          />
          <div className="video-overlay"></div>
        </div>
        <div className="litter-spotlight-hero-wrap">
          <a href="/EzraxPiper" className="litter-spotlight litter-spotlight-hero">
            <img src="/img/EzraxPiper.jpg" alt="Ezra × Piper litter — six puppies" className="litter-spotlight-img" />
            <div className="litter-spotlight-content">
              <span className="litter-spotlight-badge">Puppies Here</span>
              <h2 className="litter-spotlight-title">Ezra × Piper</h2>
              <p className="litter-spotlight-date">Six puppies · two girls, four boys</p>
              <span className="litter-spotlight-cta">Litter details &amp; pedigree</span>
            </div>
          </a>
          <p className="litter-spotlight-tiktok">
            <a
              href="https://www.tiktok.com/@7sistersgreatdanes"
              target="_blank"
              rel="noopener noreferrer"
              className="litter-spotlight-tiktok-link"
            >
              Watch updates on TikTok →
            </a>
          </p>
        </div>
        {/* Scroll indicator */}
        <ScrollIndicator />
      </section>
      
      {/* Content section - appears after scrolling with animation */}
      <AnimatedContent>
        <div className="content-overlay text-center">
        <div className="mb-4">
          <img
            src="/img/Colorlogo_nobackground.png"
            alt="7Sisters Farm Logo"
            width={300}
            height="auto"
            className="hero-logo"
            loading="lazy"
            style={{ margin: '0 auto' }}
          />
        </div>

        <div className="mb-4">
          <p className="text-lg">Dustin and Karen Mayfield-Jones</p>
          <hr className="my-2 border-gray-100" />
          <p className="text-base">Great Dane Breeders at <span className="text-red-600">7</span>Sisters</p>
          <p className="text-sm text-gray-600">Central Illinois • Champaign-Urbana Area</p>
          <hr className="my-2 border-gray-100" />
        </div>

        <div className="space-y-2 mb-4">
          <h3>
            <a href="/Litters" className="btn btn-zoom hover:text-red-600">
              Puppies & Litters
            </a>
          </h3>
          <h3>
            <a href="/about" className="btn btn-zoom hover:text-red-600">
              About Us
            </a>
          </h3>
          <h3>
            <a href="/Farm" className="btn btn-zoom hover:text-red-600">
              Our Farm
            </a>
          </h3>
          <h3>
            <a href="/7Sisters" className="btn btn-zoom hover:text-red-600">
              Great Danes
            </a>
          </h3>
          <h3>
            <a href="/CommonQuestions" className="btn btn-zoom hover:text-red-600">
              Common Questions
            </a>
          </h3>
          <h3>
            <a href="/BreedingPhilosophy" className="btn btn-zoom hover:text-red-600">
              Breeding Philosophy
            </a>
          </h3>
          <h3>
            <a href="/archive" className="btn btn-zoom hover:text-red-600">
              <span className="text-red-600">7</span>Sisters Articles
            </a>
          </h3>
          <h3>
            <a href="/Resources" className="btn btn-zoom hover:text-red-600">
              Canine Genome Explorer
            </a>
          </h3>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <a
            href="mailto:dustin@mayfieldjones.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
          >
            <Mail className="w-6 h-6" />
          </a>
          <a
            href="http://github.com/dmayfieldjones"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="text-center">
          <p>
            <span className="text-red-600">7</span>Sisters Social Media
          </p>
          <iframe
            src="https://www.tiktok.com/embed/@7sistersgreatdanes"
            className="w-full max-w-md mx-auto"
            height="458"
            title="7 Sisters Great Danes TikTok"
          />
        </div>
      </div>
      </AnimatedContent>
    </div>
    </>
  )
}

export default MayfieldJonesProfile
