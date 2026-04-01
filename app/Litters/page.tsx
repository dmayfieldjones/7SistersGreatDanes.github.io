import { Metadata } from 'next'
import ImagePreloader from './ImagePreloader'

export const metadata: Metadata = {
  title: 'Great Dane Puppies & Litters | Available & Previous Litters | 7Sisters Farm',
  description:
    'View our Great Dane puppies and litters. Health-tested parents, ethical breeding practices, and lifetime support. Located in Central Illinois.',
  keywords: [
    'Great Dane puppies',
    'Great Dane litters',
    'Great Dane puppies for sale',
    'Illinois Great Dane puppies',
    'available Great Dane puppies',
    'Great Dane puppies Illinois',
    'ethical Great Dane breeders',
    'health tested Great Dane puppies',
    'Central Illinois Great Dane puppies',
    'Champaign Great Dane puppies',
    'Urbana Great Dane puppies'
  ],
  openGraph: {
    title: 'Great Dane Puppies & Litters | Available & Previous Litters | 7Sisters Farm',
    description: 'View our Great Dane puppies and litters. Health-tested parents, ethical breeding practices, and lifetime support.',
    type: 'website',
    url: 'https://7sistersgreatdanes.com/Litters',
    siteName: '7Sisters Farm',
    images: [
      {
        url: 'https://7sistersgreatdanes.com/img/EzraxPiper.jpg',
        width: 400,
        height: 300,
        alt: 'Ezra X Piper - 7Sisters Farm Current Litter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Great Dane Puppies & Litters | Available & Previous Litters | 7Sisters Farm',
    description: 'View our Great Dane puppies and litters. Health-tested parents, ethical breeding practices, and lifetime support.',
    images: ['https://7sistersgreatdanes.com/img/EzraxPiper.jpg'],
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com/Litters',
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
}

export default function () {
  // Define all images in the exact order they appear on the page for preloading
  // First 4 are prioritized (visible above the fold)
  const allImages = [
    // Litter images (at top of page)
    '/img/EzraxPiper.jpg',                                                             // 1st visible
    '/img/SeanXPiper.jpg',                                                             // 2nd visible
    '/img/RolexPiper.jpg',                                                             // 3rd visible
    // Puppy gallery images (in order of appearance)
    '/img/piper-second-litter-3-fawn-1-brindle-puppies-with-breeding-female-cora.jpg',  // 4th visible
    '/img/piper-first-litter-5-fawn-puppies-4-boys-1-girl-breeding-female-mia.jpg',
    '/img/dustin-pulling-cart-piper-first-litter-5-fawn-puppies.jpg',
    '/img/close-up-puppy-faces-cart-illinois-corn-field-sunset.jpg',
    '/img/two-fawn-puppies-tall-grass-clover-sunset.jpg',
    '/img/future-champion-pumpkin-giant-stick-piper-first-litter.jpg',
    '/img/four-fawn-puppies-nursery-soft-mat-stuffed-toy.jpg',
    '/img/piper-captain-mother-son-tiktok-star-sweetest-dog.jpg',
  ]

  return (
    <div className="content">
      {/* Preload puppy images - prioritize first 4 visible images */}
      <ImagePreloader
        images={allImages}
        priorityCount={4}
      />
      <div className="post-title ">
        <h1>
          Great Dane Litters
        </h1>
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
        {/* Club Memberships Section */}
        <section className="memberships-section">
          <p className="membership-text">
            We are members of the Illini Great Dane Club and the{' '}
            <a
              href="https://gdca.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Great Dane Club of America
            </a>
            .
          </p>
        </section>
        
        {/* Current Litters Section */}
        <section className="litters-section">
          <h2 className="section-title">
            <span className="accent-color">7</span>Sisters Current Litters
          </h2>
          <p className="section-description">Click on images for details</p>
          <div className="litter-gallery">
            <a
              href="/EzraxPiper"
              className="litter-link"
              aria-label="View Ezra X Piper litter details"
            >
              <img
                src="/img/EzraxPiper.jpg"
                alt="Ezra X Piper litter — six puppies, two girls and four boys"
                className="litter-image"
                loading="lazy"
                fetchPriority="auto"
              />
            </a>
          </div>
        </section>
        
        {/* Previous Litters Section */}
        <section className="litters-section">
          <h2 className="section-title">
            <span className="accent-color">7</span>Sisters Previous Litters
          </h2>
          <p className="section-description">Click on images for details</p>
          <div className="litter-gallery">
            <a
              href="/SeanXPiper"
              className="litter-link"
              aria-label="View Sean X Piper litter details"
            >
              <img
                src="/img/SeanXPiper.jpg"
                alt="Sean X Piper litter advertisement"
                className="litter-image"
                loading="lazy"
                fetchPriority="auto"
              />
            </a>
            <a
              href="/RolexXPiper"
              className="litter-link"
              aria-label="View Rolex X Piper litter details"
            >
              <img
                src="/img/RolexPiper.jpg"
                alt="Rolex X Piper litter advertisement"
                className="litter-image"
                loading="lazy"
                fetchPriority="auto"
              />
            </a>
          </div>
        </section>
        
        {/* Puppy Gallery Section */}
        <section className="puppy-gallery-section">
          <h2 className="section-title">
            Our <span className="accent-color">7</span>Sisters Puppies
          </h2>
          <p className="section-description">
            Celebrating our breeding program's success and the exceptional Great Danes we produce
          </p>
          <div className="puppy-gallery">
            <div className="puppy-card">
              <img
                src="/img/piper-second-litter-3-fawn-1-brindle-puppies-with-breeding-female-cora.jpg"
                alt="Fawn Great Dane Piper with her four puppies from second litter at 7Sisters Farm Illinois - 3 fawn and 1 brindle including breeding female Cora"
                className="puppy-image"
                loading="eager"
                fetchPriority="high"
              />
              <div className="puppy-overlay">
                <h3>Piper with her second litter</h3>
                <p>Three fawn, one brindle</p>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/piper-first-litter-5-fawn-puppies-4-boys-1-girl-breeding-female-mia.jpg"
                alt="Fawn Great Dane Piper with her first litter of 5 all fawn puppies at 7Sisters Farm Illinois - 4 boys and 1 girl Mia in pink collar"
                className="puppy-image"
                loading="eager"
                fetchPriority="high"
              />
              <div className="puppy-overlay">
                <h3>Piper&apos;s first litter</h3>
                <p>Five fawn puppies, Mia in the pink collar</p>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/dustin-pulling-cart-piper-first-litter-5-fawn-puppies.jpg"
                alt="Dustin pulling cart of Great Dane puppies from Piper's first litter at 7Sisters Farm Illinois - 5 all fawn puppies including breeding female Mia"
                className="puppy-image"
                loading="eager"
                fetchPriority="auto"
              />
              <div className="puppy-overlay">
                <h3>Evening rounds</h3>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/close-up-puppy-faces-cart-illinois-corn-field-sunset.jpg"
                alt="Close-up of Great Dane puppy faces in cart at 7Sisters Farm Illinois with corn field background at sunset"
                className="puppy-image"
                loading="eager"
                fetchPriority="auto"
              />
              <div className="puppy-overlay">
                <h3>The passengers</h3>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/two-fawn-puppies-tall-grass-clover-sunset.jpg"
                alt="Two fawn Great Dane puppies sitting in tall grass with clover at 7Sisters Farm Illinois near sunset"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Getting into the clover</h3>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/future-champion-pumpkin-giant-stick-piper-first-litter.jpg"
                alt="Two fawn Great Dane puppy boys from Piper's first litter at 7Sisters Farm Illinois - one holding giant stick future champion Pumpkin"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Pumpkin found a stick.</h3>
                <p>Pumpkin is not sharing the stick.</p>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/four-fawn-puppies-nursery-soft-mat-stuffed-toy.jpg"
                alt="Four fawn Great Dane puppies sitting patiently on soft mat in puppy nursery at 7Sisters Farm Illinois with stuffed toy and blanket"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Four of five, pretending to be patient</h3>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/piper-captain-mother-son-tiktok-star-sweetest-dog.jpg"
                alt="Fawn Great Dane Piper looking into eyes of her fawn puppy Captain in nursery at 7Sisters Farm Illinois"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Piper and her boy Captain</h3>
              </div>
            </div>
          </div>
          <div className="gallery-cta">
            <p>
              Interested in one of our puppies?{' '}
              <a href="/contact" className="cta-link">
                Contact us today
              </a>{' '}
              to learn more about our upcoming litters and placement process.
            </p>
            <p className="tiktok-note">
              Follow our puppy success stories on{' '}
              <a 
                href="https://www.tiktok.com/@7sistersgreatdanes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="tiktok-link"
              >
                TikTok
              </a>{' '}
              - see how our puppies like Captain are thriving in their forever homes!
            </p>
          </div>
        </section>
      </main>
      <style
        dangerouslySetInnerHTML={{
          __html:
            ' :root { --primary-color: #bf141c; --text-color: #000000; --background-color: #ffffff; --hover-color: #f8f8f8; --border-color: #e0e0e0; --spacing-unit: 1rem; --font-family: Arial, sans-serif; --transition-speed: 0.3s; } .content-wrapper { max-width: 800px; margin: 0 auto; padding: calc(var(--spacing-unit) * 2); font-family: var(--font-family); line-height: 1.6; color: var(--text-color); background-color: var(--background-color); } .hero-section { text-align: center; margin-bottom: calc(var(--spacing-unit) * 3); } .hero-logo { max-width: 100%; height: auto; } .memberships-section { text-align: center; margin-bottom: calc(var(--spacing-unit) * 3); } .membership-text { font-size: 1.1rem; line-height: 1.6; } .section-title { font-size: 1.75rem; margin-bottom: var(--spacing-unit); text-align: center; } .section-description { text-align: center; margin-bottom: calc(var(--spacing-unit) * 2); font-size: 1.1rem; color: #666; } .litter-gallery { display: grid; gap: calc(var(--spacing-unit) * 2); margin-top: calc(var(--spacing-unit) * 2); } .litter-link { display: block; transition: transform var(--transition-speed) ease; } .litter-link:hover { transform: scale(1.02); } .litter-image { width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); } .puppy-gallery-section { margin-bottom: calc(var(--spacing-unit) * 4); } .puppy-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: calc(var(--spacing-unit) * 2); margin: calc(var(--spacing-unit) * 2) 0; } .puppy-card { position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: all var(--transition-speed) ease; background: white; } .puppy-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(191, 20, 28, 0.2); } .puppy-image { width: 100%; height: 250px; object-fit: cover; transition: transform var(--transition-speed) ease; } .puppy-card:hover .puppy-image { transform: scale(1.05); } .puppy-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0, 0, 0, 0.8)); color: white; padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 1); transform: translateY(100%); transition: transform var(--transition-speed) ease; } .puppy-card:hover .puppy-overlay { transform: translateY(0); } .puppy-overlay h3 { margin: 0 0 calc(var(--spacing-unit) * 0.5) 0; font-size: 1.1rem; font-weight: bold; } .puppy-overlay p { margin: 0; font-size: 0.9rem; opacity: 0.9; } .gallery-cta { text-align: center; margin-top: calc(var(--spacing-unit) * 3); padding: calc(var(--spacing-unit) * 2); background: var(--hover-color); border-radius: 8px; border-left: 4px solid var(--primary-color); } .gallery-cta p { margin: 0; font-size: 1.1rem; line-height: 1.6; } .cta-link { font-weight: bold; text-decoration: none; color: var(--primary-color); transition: color var(--transition-speed) ease; } .cta-link:hover { color: #8f0f15; text-decoration: underline; } .tiktok-note { margin-top: calc(var(--spacing-unit) * 1.5); font-size: 0.95rem; color: #666; font-style: italic; } .tiktok-link { color: var(--primary-color); text-decoration: none; font-weight: 500; transition: color var(--transition-speed) ease; } .tiktok-link:hover { color: #8f0f15; text-decoration: underline; } .accent-color { color: var(--primary-color); } a { color: var(--primary-color); text-decoration: none; transition: color var(--transition-speed) ease; } a:hover { color: #8f0f15; text-decoration: underline; } @media (max-width: 768px) { .content-wrapper { padding: var(--spacing-unit); } .section-title { font-size: 1.5rem; } .puppy-gallery { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-unit); } .puppy-card { min-height: 280px; } .puppy-image { height: 200px; } .puppy-overlay { transform: translateY(0); background: rgba(0, 0, 0, 0.8); position: absolute; bottom: 0; left: 0; right: 0; padding: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 0.75); } .puppy-overlay h3 { font-size: 1rem; margin-bottom: calc(var(--spacing-unit) * 0.25); } .puppy-overlay p { font-size: 0.85rem; } } @media print { .litter-gallery { gap: var(--spacing-unit); } .litter-image { max-width: 400px; margin: 0 auto; } } ',
        }}
      />
    </div>
  )
}
