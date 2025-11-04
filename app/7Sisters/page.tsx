import './index.css'
import { Metadata } from 'next'

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
    url: 'https://dmayfieldjones.github.io/7Sisters',
    siteName: '7Sisters Farm',
    images: [
      {
        url: 'https://dmayfieldjones.github.io/img/2021_5pt_BOW_BOBOH_Waukesha_Mimi_Kim.jpg',
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
    images: ['https://dmayfieldjones.github.io/img/2021_5pt_BOW_BOBOH_Waukesha_Mimi_Kim.jpg'],
  },
  alternates: {
    canonical: 'https://dmayfieldjones.github.io/7Sisters',
  },
}

export default function () {
  return (
    <div className="content">
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

        {/* Featured Image */}
        <section className="featured-image">
          <img
            src="/img/2021_5pt_BOW_BOBOH_Waukesha_Mimi_Kim.jpg"
            alt="2021 Lake Shore GDC Best of Winners and Best of Breed Owner Handled"
            className="full-width-image"
            loading="lazy"
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
            Sisters in your family, you are invited to be part of ours. We
            expect to hear from you long after you bring your dog home. We love
            updates and look forward to seeing our family grow: birthdays,
            anniversaries, achievements, and losses. We hope you consider a
            Great Dane from <span className="accent-color">7</span>Sisters as
            your family member.
          </p>
          <p>
            Feel free to contact either of us, Karen or Dustin, if you are
            interested in our dogs. Living with your new family member helps
            continue a line of Great Danes that can be traced over 35
            generations to the 1870s. Thank you for your interest in preserving
            our breed.
          </p>
        </section>
        {/* History Section */}
        <section className="history-section">
          <h2 className="section-title">
            <span className="accent-color">Our Ancient Bond</span>
          </h2>
          <p>
            One reason we love dogs is because they tell us something profound
            about ourselves. Dogs are by far the oldest and most widespread
            species domesticated by humans. Darwin used dogs, among pigeons and
            Brassicas, to bridge the gap between artificial selection and
            natural selection in his 1859 publication
            <cite>The Origin of Species</cite>.
          </p>
          <p>
            Early scientists focused more on artificial selection of livestock
            and crops, but it was in fact our beloved dog companions that were
            <a href="/posts/2025-10-01-the-deep-history-of-dogs-ancient-dna" style={{ 
              color: '#bf141c', 
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}> domesticated millennia before any other known species</a>. Unlike these
            others, dogs reside in our homes and live up to the name
            domesticate, coming from the Latin domicile, meaning home. Also,
            unlike other domesticates, dogs chose us. The bond between dogs and
            humans is unique.
          </p>
          <p>
            Both highly social species, humans and dogs began to co-evolve during
            the Last Glacial Maximum around 23,000 years ago, when both species
            were pushed into isolated refugia by extreme climate conditions. While
            there are no anatomical markers to differentiate dogs from wolves,
            dogs' definitive trait is behavioral: loyalty. Wolves and dogs
            descended from a wolf-like common ancestor, with dogs emerging as a
            distinct lineage that spread across the world with human agricultural
            expansion. The earliest archaeological evidence suggests dogs had a
            special place in our hearts by ~14,000 years ago when a Nautifian
            woman was buried alongside a dog. Our relationship is ancient and deep.
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
