import { Metadata } from 'next'

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
    url: 'https://mayfieldjones.com/Litters',
    siteName: '7Sisters Farm',
    images: [
      {
        url: 'https://mayfieldjones.com/img/SeanXPiper.jpg',
        width: 400,
        height: 300,
        alt: '7Sisters Farm Great Dane Puppies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Great Dane Puppies & Litters | Available & Previous Litters | 7Sisters Farm',
    description: 'View our Great Dane puppies and litters. Health-tested parents, ethical breeding practices, and lifetime support.',
    images: ['https://mayfieldjones.com/img/SeanXPiper.jpg'],
  },
  alternates: {
    canonical: 'https://mayfieldjones.com/Litters',
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
  return (
    <div className="content">
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
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Piper with Her Second Litter</h3>
                <p>3 fawn & 1 brindle puppies - 7Sisters Farm</p>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/piper-first-litter-5-fawn-puppies-4-boys-1-girl-breeding-female-mia.jpg"
                alt="Fawn Great Dane Piper with her first litter of 5 all fawn puppies at 7Sisters Farm Illinois - 4 boys and 1 girl breeding female Mia in pink collar"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Piper with Her First Litter</h3>
                <p>5 fawn puppies - 4 boys & 1 girl - 7Sisters Farm</p>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/dustin-pulling-cart-piper-first-litter-5-fawn-puppies.jpg"
                alt="Dustin pulling cart of Great Dane puppies from Piper's first litter at 7Sisters Farm Illinois - 5 all fawn puppies including breeding female Mia"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Puppy Transport at 7Sisters</h3>
                <p>Piper's first litter - 5 fawn puppies - 7Sisters Farm</p>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/close-up-puppy-faces-cart-illinois-corn-field-sunset.jpg"
                alt="Close-up of Great Dane puppies faces in cart at 7Sisters Farm Illinois with corn field background at sunset"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Puppy Faces Close-up</h3>
                <p>Piper's first litter - Illinois farm sunset - 7Sisters Farm</p>
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
                <h3>Puppies in Natural Setting</h3>
                <p>Two fawn puppies - Illinois farm grass - 7Sisters Farm</p>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/future-champion-pumpkin-giant-stick-piper-first-litter.jpg"
                alt="Two fawn Great Dane puppy boys from Piper's first litter at 7Sisters Farm Illinois - one holding giant stick, future champion Pumpkin"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Future Champion Pumpkin</h3>
                <p>Two fawn boys - Piper's first litter - 7Sisters Farm</p>
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
                <h3>Puppy Nursery Setup</h3>
                <p>Four fawn puppies - Piper's first litter - 7Sisters Farm</p>
              </div>
            </div>
            <div className="puppy-card">
              <img
                src="/img/piper-captain-mother-son-tiktok-star-sweetest-dog.jpg"
                alt="Fawn Great Dane Piper looking into eyes of her fawn puppy Captain in nursery at 7Sisters Farm Illinois - sweetest dog with TikTok family"
                className="puppy-image"
                loading="lazy"
              />
              <div className="puppy-overlay">
                <h3>Piper & Captain</h3>
                <p>Mother and son - perfect family match - 7Sisters Farm</p>
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
        
        {/* Litters Section */}
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
              />
            </a>
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
