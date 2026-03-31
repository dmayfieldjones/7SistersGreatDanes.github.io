import React from 'react'
import { Metadata } from 'next'
import AnimatedContent from './components/AnimatedContent'
import HeroYoutubeBackground from './components/HeroYoutubeBackground'
import ScrollIndicator from './components/ScrollIndicator'
import ScrollActivator from './components/ScrollActivator'

const HERO_VIDEO_EMBED_SRC =
  'https://www.youtube.com/embed/M14l3BrfXhA?autoplay=1&mute=1&loop=1&playlist=M14l3BrfXhA&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&cc_load_policy=0&disablekb=1&enablejsapi=0&origin=https://7sistersgreatdanes.com'
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
          <HeroYoutubeBackground embedSrc={HERO_VIDEO_EMBED_SRC} title="Background video" />
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
      <AnimatedContent sectionClassName="home-below-hero">
        <div className="content-overlay text-center home-intro-wrap">
          <img
            src="/img/Colorlogo_nobackground.png"
            alt="7Sisters Farm"
            width={220}
            height="auto"
            className="hero-logo home-intro-logo"
            loading="lazy"
          />

          <p className="home-intro-text">
            We&apos;re <strong>Dustin and Karen Mayfield-Jones</strong>, breeders of Champion Great
            Danes at <span className="text-red-600 font-semibold">7</span>Sisters Farm in Central
            Illinois (Champaign–Urbana area). Our dogs are AKC-registered, live with us, receive health
            testing, and are raised with a focus on sound structure and temperament. Exploring a litter
            or a breeder? Start below; everything else—our farm, articles, genome tools—is in the menu.
          </p>

          <div className="home-cta-list" role="navigation" aria-label="Primary actions">
            <a href="/7Sisters" className="home-cta home-cta-primary">
              Meet our dogs
            </a>
            <a href="/BreedingPhilosophy" className="home-cta">
              Our breeding philosophy
            </a>
            <a href="/contact" className="home-cta">
              Contact us
            </a>
          </div>
        </div>
      </AnimatedContent>
    </div>
    </>
  )
}

export default MayfieldJonesProfile
