import './index.css'
import { Metadata } from 'next'
import WinPhotosCarousel from './WinPhotosCarousel'
import ImagePreloader from './ImagePreloader'

export const metadata: Metadata = {
  title: 'Illinois Great Danes | 7Sisters Farm - AKC Registered Great Danes',
  description:
    'Illinois Great Danes at 7Sisters Farm. AKC registered, health tested Great Danes in Central Illinois. 35+ generation bloodlines, family raised, serving Illinois and surrounding states.',
  keywords: [
    'Illinois Great Danes',
    'Great Danes Illinois',
    'Illinois Great Dane breeders',
    'Central Illinois Great Danes',
    'AKC Great Danes Illinois',
    'Great Dane puppies Illinois',
    '7Sisters Farm Great Danes',
    'Illinois dog breeders',
    'Champaign Illinois Great Danes',
    'Urbana Illinois Great Danes'
  ],
  openGraph: {
    title: 'Illinois Great Danes | 7Sisters Farm',
    description: 'Illinois Great Danes at 7Sisters Farm. AKC registered, health tested Great Danes in Central Illinois.',
    type: 'website',
    url: 'https://7sistersgreatdanes.com/7Sisters',
    siteName: '7Sisters Farm',
    images: [
      {
        url: 'https://7sistersgreatdanes.com/img/2021_5pt_BOW_BOBOH_Waukesha_Mimi_Kim.jpg',
        width: 800,
        height: 600,
        alt: 'Illinois Great Dane - 7Sisters Farm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Illinois Great Danes | 7Sisters Farm',
    description: 'Illinois Great Danes at 7Sisters Farm. AKC registered, health tested Great Danes in Central Illinois.',
    images: ['https://7sistersgreatdanes.com/img/2021_5pt_BOW_BOBOH_Waukesha_Mimi_Kim.jpg'],
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com/7Sisters',
  },
}

const postLinkStyle = {
  color: '#bf141c',
  textDecoration: 'underline',
  fontWeight: 'bold' as const,
}

export default function () {
  const carouselPhotos = [
    {
      src: '/img/2025_4pt_WB_IlliniGDC_Mimi_Kim.jpg',
      alt: '2025 4pt Winner\'s Bitch - Illini GDC',
      caption:
        'Mia — 4 points, judge Mimi Kim, Illini Great Dane Club 2025',
    },
    {
      src: '/img/2025_2pt_BOW_HoosierGDC_Butch_Schulman.jpg',
      alt: '2025 2pt Best of Winners - Hoosier GDC - Karen\'s First Time in the Ring',
      caption:
        'Mia — Best of Winners, judge Butch Schulman, Hoosier GDC 2025 — Karen\'s first time showing',
    },
    {
      src: '/img/2025_2pt_WB_MidTNGDC_Terry_DePietro.jpg',
      alt: '2025 2pt Winner\'s Bitch - MidTN GDC',
      caption:
        'Cora — Winner\'s Bitch, judge Terry DePietro, Mid-Tennessee GDC 2025',
    },
    {
      src: '/img/2025_2pt_WB_MidTNGDC_Nancy_SmithHafner.jpg',
      alt: '2025 2pt Winner\'s Bitch - MidTN GDC',
      caption:
        'Mia — Winner\'s Bitch, judge Nancy Smith-Hafner, Mid-Tennessee GDC 2025',
    },
    {
      src: '/img/2025_2pt_WB_MidTNGDC_Robert_Hutton.jpg',
      alt: '2025 2pt Best of Opposite Sex, Best of Winners, Winner\'s Bitch - MidTN GDC',
      caption:
        'Mia — Best of Opposite Sex, Best of Winners, Winner\'s Bitch, judge Robert Hutton, Mid-Tennessee GDC 2025',
    },
    {
      src: '/img/2024_2pt_BOS_EdwardsvilleILKC_Butch_Schulman.JPG',
      alt: '2024 2pt Best of Opposite Sex - Edwardsville IL KC',
      caption:
        'Mia — Best of Opposite Sex, judge Butch Schulman, Edwardsville IL KC 2024',
    },
    {
      src: '/img/2021_5pt_BOW_BOBOH_Waukesha_Mimi_Kim.jpg',
      alt: '2021 5pt Best of Winners and Best of Breed Owner Handled - Waukesha',
      caption:
        'Piper — 5 points, Best of Winners, Best of Breed Owner Handled, judge Mimi Kim, Waukesha 2021',
    },
    {
      src: '/img/2021_Sweepstakes_Ohio_Corrine_Witt.jpg',
      alt: '2021 Sweepstakes Winner - Ohio',
      caption:
        'Piper — Sweepstakes Winner, judge Corrine Witt, Ohio 2021',
    },
    {
      src: '/img/2021_RB_Hoosier_Lance_Deloria.jpg',
      alt: '2021 Reserve Best - Hoosier - First Show',
      caption:
        'Piper — Reserve Best, judge Lance Deloria, Hoosier GDC 2021 — first show',
    },
    {
      src: '/img/2021_1pt_BOW_PurinaSTL.JPG',
      alt: '2021 1pt Best of Winners - Purina St. Louis - First BOW',
      caption:
        'Piper — 1 point, Best of Winners, Purina St. Louis 2021',
    },
  ]

  return (
    <div className="content">
      {/* Preload carousel images - prioritize first 3, then preload rest */}
      <ImagePreloader
        images={carouselPhotos.map((photo) => photo.src)}
        priorityCount={3}
      />
      <div className="post-title ">
        <h1>Great Danes at <span style={{ color: '#bf141c' }}>7</span>Sisters Farm</h1>
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

        {/* Win Photos Carousel */}
        <section className="win-photos-section">
          <WinPhotosCarousel
            photos={carouselPhotos}
            autoPlay={true}
            interval={5000}
          />
        </section>
        {/* Introduction Section */}
        <section className="intro-section">
          <p className="emphasis">
            Our Great Danes are family members. They are sacred. Great Danes are
            not for everyone. Choosing a breeder you can trust is critical.
          </p>
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/posts/2025-06-25-choosing-a-great-dane-breeder" style={{ 
              color: '#bf141c', 
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}>
              Read our Complete Guide to Choosing a Great Dane Breeder →
            </a>
          </p>
        </section>
        {/* Family Section */}
        <section className="family-section">
          <h2 className="section-title">
            <span className="accent-color">Family</span>
          </h2>
          <p>
            With a Great Dane from <span className="accent-color">7</span>
            Sisters in your family, you are invited to be part of ours. We want
            to hear from you long after you bring your dog home — birthdays,
            milestones, the hard days too. Our dogs carry lines that trace back
            over 35 generations to the 1870s. Your home becomes part of that
            story.
          </p>
          <p>
            Feel free to contact either of us, Karen or Dustin, if you are
            interested in our dogs.
          </p>
        </section>
        {/* History Section */}
        <section className="history-section">
          <h2 className="section-title">
            <span className="accent-color">Our Ancient Bond</span>
          </h2>
          <p>
            One reason we love dogs is because they tell us something about
            ourselves. Dogs are the oldest species humans ever domesticated — by a
            wide margin. Before cattle, before wheat, before any of it, there
            were dogs. The bond stretches back at least 15,000 years: the oldest
            genetically confirmed dog is a female puppy from central Türkiye,
            roughly 15,800 years old, buried alongside hunter-gatherers who were
            feeding their dogs fish from the local streams. More than 12,000
            years ago in what is now northern Israel, a woman was buried with her
            hand cradling the head of a puppy.
          </p>
          <p>
            Dogs and humans didn&apos;t just live together — they shaped each
            other. As human diets shifted, dogs evolved to digest the same foods.
            As humans migrated, dogs moved with them. Wolves were drawn to human
            camps and gradually diverged from their ancestors into something new
            — a mutual integration rather than a one-sided taming. When farming
            arrived in Europe roughly 8,000 years ago and replaced the vast
            majority of the existing human population, the dogs were kept. They
            crossed cultural boundaries that humans themselves maintained.
          </p>
          <p>
            Darwin used dogs — along with pigeons and domestic cabbages — to build
            his argument for natural selection in{' '}
            <cite>The Origin of Species</cite>. He understood that the variation
            we see in dogs, shaped by thousands of years of human choices, was a
            window into how nature works on a much larger scale. That&apos;s the
            thread that runs from Darwin&apos;s notebooks to our nursery.
          </p>
          <p>
            Read more:{' '}
            <a
              href="/posts/2026-03-28-the-deep-history-of-dogs-palaeolithic-partners"
              style={postLinkStyle}
            >
              The Deep History of Dogs, Part 2: Palaeolithic Partners
            </a>
          </p>
        </section>
        {/* Social Media Section */}
        <section className="social-media-section">
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
        </section>
      </main>
    </div>
  )
}
