import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ethical Great Dane Breeding Philosophy | 7Sisters Farm - Responsible Breeders',
  description:
    'Our ethical Great Dane breeding philosophy at 7Sisters Farm. Responsible breeding practices, health testing, and commitment to breed betterment.',
  keywords: [
    'ethical Great Dane breeding philosophy',
    'responsible Great Dane breeders',
    'Great Dane breeding philosophy',
    'ethical dog breeding',
    'responsible dog breeding',
    'Great Dane breeder mission',
    'breed betterment Great Danes',
    'ethical breeding practices'
  ],
  openGraph: {
    title: 'Ethical Great Dane Breeding Philosophy | 7Sisters Farm',
    description: 'Our ethical Great Dane breeding philosophy at 7Sisters Farm. Responsible breeding practices and commitment to breed betterment.',
    type: 'website',
    url: 'https://dmayfieldjones.github.io/BreedingPhilosophy',
    siteName: '7Sisters Farm',
  },
  alternates: {
    canonical: 'https://dmayfieldjones.github.io/BreedingPhilosophy',
  },
}

export default function BreedingPhilosophy() {
  return (
    <div className="content">
      <div className="post-title ">
        <h1>
          Breeding Philosophy
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
        {/* Mission Statement Section */}
        <section className="mission-section">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-statement">
            Our mission is to make the world a better place for dogs by
            supporting the dog loving community and to secure Great Danes as the
            most desired, aspirational dog companion.
          </p>
        </section>
        {/* Philosophy Section */}
        <section className="philosophy-section">
          <h2 className="section-title">Our Approach</h2>
          <div className="philosophy-content">
            <p>
              We advance our mission by producing the best possible Great Danes
              and placing them in environments that give them the best possible
              chance of having wonderful lives. We assume dogs belong in homes
              and deserve enriched lives sharing relationships with both humans
              and other dogs. There is a vast discrepancy between the demand for
              dogs and their supply from breeders we deem ethical, and most dog
              owners do not know from where dogs come. We strive to combat the
              deep lack of understanding of honorable dog breeding by educating
              dog owners, shelters, and those from the animal welfare community.
            </p>
          </div>
        </section>
        {/* Values Section */}
        <section className="values-section">
          <h2 className="section-title">Our Values</h2>
          <div className="values-content">
            <p>
              We believe people working to further our mission should be
              encouraged, celebrated, and awarded. We therefore endorse and
              discourage facets of dog breeding while recognizing the expression
              of opinions. Our relationship with dogs is complex, diverse, and
              subtle. Dogs mean very different things to different people. Like
              our choices in music or food, the relationships we form with dogs
              are very personal.
            </p>
            <p>
              There are many dog communities that differ in their values and
              perspectives, and we have a lot to learn from each other. Not all
              dogs are suited for all environments. No breeder can supply all
              the types of dogs for which people are seeking, and there is very
              little more important than matching people with the dog that fits
              them.
            </p>
          </div>
        </section>
      </main>
      <style
        dangerouslySetInnerHTML={{
          __html:
            ' :root { --primary-color: #bf141c; --text-color: #000000; --background-color: #ffffff; --spacing-unit: 1rem; --font-family: Arial, sans-serif; } .content-wrapper { max-width: 800px; margin: 0 auto; padding: calc(var(--spacing-unit) * 2); font-family: var(--font-family); line-height: 1.8; color: var(--text-color); background-color: var(--background-color); } .hero-section { text-align: center; margin-bottom: calc(var(--spacing-unit) * 3); } .hero-logo { max-width: 100%; height: auto; } .section-title { font-size: 1.75rem; color: var(--primary-color); margin: calc(var(--spacing-unit) * 2) 0 var(--spacing-unit); font-weight: 600; letter-spacing: 0.5px; } .mission-statement { font-size: 1.2rem; font-weight: 500; line-height: 1.6; margin-bottom: calc(var(--spacing-unit) * 2); padding: var(--spacing-unit); border-left: 4px solid var(--primary-color); background-color: rgba(191, 20, 28, 0.05); } .philosophy-section, .values-section { margin-bottom: calc(var(--spacing-unit) * 3); } .philosophy-content, .values-content { padding: 0 var(--spacing-unit); } .philosophy-content p, .values-content p { margin-bottom: var(--spacing-unit); font-size: 1rem; } @media (max-width: 768px) { .content-wrapper { padding: var(--spacing-unit); } .section-title { font-size: 1.5rem; } .mission-statement { font-size: 1.1rem; padding: calc(var(--spacing-unit) * 0.75); } } /* Print styles */ @media print { .content-wrapper { max-width: 100%; padding: 0; } .hero-logo { max-width: 200px; } .mission-statement { border-left: none; background-color: transparent; } } ',
        }}
      />
    </div>
  )
}
