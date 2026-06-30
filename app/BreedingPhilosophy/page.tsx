import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Responsible Great Dane Breeding Philosophy | 7Sisters Farm',
  description:
    'Our responsible Great Dane breeding philosophy at 7Sisters Farm. Health testing, thoughtful placement, and commitment to breed betterment.',
  keywords: [
    'responsible Great Dane breeding philosophy',
    'responsible Great Dane breeders',
    'Great Dane breeding philosophy',
    'responsible dog breeding',
    'Great Dane breeder mission',
    'breed betterment Great Danes',
    'responsible breeding practices'
  ],
  openGraph: {
    title: 'Responsible Great Dane Breeding Philosophy | 7Sisters Farm',
    description: 'Our responsible Great Dane breeding philosophy at 7Sisters Farm. Health testing, thoughtful placement, and commitment to breed betterment.',
    type: 'website',
    url: 'https://7sistersgreatdanes.com/BreedingPhilosophy',
    siteName: '7Sisters Farm',
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com/BreedingPhilosophy',
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
            To make the world a better place for dogs by supporting the
            dog-loving community and securing Great Danes as the most desired,
            aspirational dog companion.
          </p>
        </section>
        {/* Philosophy Section */}
        <section className="philosophy-section">
          <h2 className="section-title">Our Approach</h2>
          <div className="philosophy-content">
            <p>
              We advance our mission by producing the best possible Great Danes
              and placing them in homes that give them the best possible lives.
              Dogs thrive in homes where they can live full, enriched lives with
              their people and canine companions.
            </p>
            <p>
              Demand for dogs far outpaces the supply from breeders most of us
              would consider responsible, and a lot of dog owners simply
              aren&apos;t aware of their dog&apos;s origins. We work to close that gap through
              education: reaching dog owners, shelters, and the broader animal
              welfare community with a clearer picture of what honorable breeding
              looks like.
            </p>
          </div>
        </section>
        {/* Values Section */}
        <section className="values-section">
          <h2 className="section-title">Our Values</h2>
          <div className="values-content">
            <p>
              Our relationship with dogs is complex, personal, and subtle — as
              individual as our tastes in music or food. Dogs mean different
              things to different people, and not every dog is suited for every
              home. We believe there is very little more important than matching
              people with the dog that fits them.
            </p>
            <p>
              Many dog communities differ in their values and perspectives, and
              we have a great deal to learn from one another. We endorse and
              discourage specific practices in breeding, but we do so while
              respecting that thoughtful people can disagree. Those working to
              further the welfare of dogs should be encouraged, celebrated, and
              supported.
            </p>
          </div>
        </section>

        <section className="practice-section" aria-labelledby="practice-heading">
          <h2 id="practice-heading" className="section-title">
            Our Philosophy in Practice
          </h2>
          <p className="practice-intro">
            Curious what this looks like in practice? Here&apos;s where our
            philosophy meets pedigrees, genomics, and documented reasoning.
          </p>
          <ul className="practice-card-list">
            <li>
              <a
                className="practice-card"
                href="/posts/2025-06-24-laying-the-foundation"
              >
                <span className="practice-card-title">Laying the Foundation</span>
                <span className="practice-card-desc">
                  Our first 7Sisters litters: how we chose sires using pedigree
                  analysis and health data, what we weighed, what we risked, and
                  what our mentors taught us along the way.
                </span>
              </a>
            </li>
            <li>
              <a className="practice-card" href="/EzraxPiper">
                <span className="practice-card-title">Ezra × Piper litter</span>
                <span className="practice-card-desc">
                  A current breeding presented with pedigree detail and
                  visualization—an example of how we connect type, health, and
                  numbers on the page.
                </span>
              </a>
            </li>
            <li className="practice-card-item-multi">
              <div className="practice-card practice-card-static">
                <span className="practice-card-title">
                  The Deep History of Dogs
                </span>
                <p className="practice-card-desc">
                  A two-part series tracing dog ancestry from Ice Age wolves to
                  the modern breeds we know. This is the kind of science literacy
                  that shapes how we read evidence and avoid folklore in our
                  breeding decisions.
                </p>
                <p className="practice-card-link-row">
                  <a href="/posts/2025-10-01-the-deep-history-of-dogs-ancient-dna">
                    Part 1: Ancient DNA →
                  </a>
                  <a href="/posts/2026-03-28-the-deep-history-of-dogs-palaeolithic-partners">
                    Part 2: Palaeolithic Partners →
                  </a>
                </p>
              </div>
            </li>
            <li className="practice-card-item-multi">
              <div className="practice-card practice-card-static">
                <span className="practice-card-title">Canine Genome Explorer</span>
                <p className="practice-card-desc">
                  The dog genome is 2.4 billion base pairs long. We built a tool
                  that lets you explore it. Browse genes linked to health,
                  disease, and the traits breeders care about — mapped to
                  chromosomes with plain-language descriptions and links to
                  current research. Then open the{' '}
                  <a
                    href="https://jbrowse.org/jb2/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    JBrowse 2
                  </a>{' '}
                  genome browser tracks that{' '}
                  <a
                    href="https://scholar.google.com/citations?user=--FwzsgAAAAJ&hl=en&oi=ao"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Colin Diesh
                  </a>{' '}
                  and I have assembled with a focus on dogs: scroll across whole
                  chromosomes, zoom into individual exons, compare sequence data
                  from multiple projects, and download what you find.
                </p>
                <p className="practice-card-link-row">
                  <a href="/Resources">Open Canine Genome Explorer →</a>
                </p>
              </div>
            </li>
          </ul>
        </section>
      </main>
      <style
        dangerouslySetInnerHTML={{
          __html:
            ' :root { --primary-color: #bf141c; --text-color: #000000; --background-color: #ffffff; --spacing-unit: 1rem; --font-family: Arial, sans-serif; } .content-wrapper { max-width: 800px; margin: 0 auto; padding: calc(var(--spacing-unit) * 2); font-family: var(--font-family); line-height: 1.8; color: var(--text-color); background-color: var(--background-color); } .hero-section { text-align: center; margin-bottom: calc(var(--spacing-unit) * 3); } .hero-logo { max-width: 100%; height: auto; } .section-title { font-size: 1.75rem; color: var(--primary-color); margin: calc(var(--spacing-unit) * 2) 0 var(--spacing-unit); font-weight: 600; letter-spacing: 0.5px; } .mission-statement { font-size: 1.2rem; font-weight: 500; line-height: 1.6; margin-bottom: calc(var(--spacing-unit) * 2); padding: var(--spacing-unit); border-left: 4px solid var(--primary-color); background-color: rgba(191, 20, 28, 0.05); } .philosophy-section, .values-section { margin-bottom: calc(var(--spacing-unit) * 3); } .philosophy-content, .values-content { padding: 0 var(--spacing-unit); } .philosophy-content p, .values-content p { margin-bottom: var(--spacing-unit); font-size: 1rem; } .practice-section { margin-bottom: calc(var(--spacing-unit) * 3); padding: 0 var(--spacing-unit); } .practice-intro { font-size: 1rem; margin: 0 0 calc(var(--spacing-unit) * 1.5); color: #444; line-height: 1.65; } .practice-card-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--spacing-unit); } .practice-card-list > li { margin: 0; } a.practice-card { display: block; text-decoration: none; color: inherit; padding: calc(var(--spacing-unit) * 1.25); border: 1px solid rgba(0, 0, 0, 0.12); border-radius: 8px; background: #fafafa; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease; } a.practice-card:hover { border-color: var(--primary-color); box-shadow: 0 4px 12px rgba(191, 20, 28, 0.12); background: #fff; } .practice-card-title { display: block; font-size: 1.15rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.5rem; line-height: 1.3; } a.practice-card:hover .practice-card-title { text-decoration: underline; text-underline-offset: 3px; } .practice-card-desc { display: block; font-size: 0.98rem; line-height: 1.65; color: var(--text-color); } .practice-card-static { padding: calc(var(--spacing-unit) * 1.25); border: 1px solid rgba(0, 0, 0, 0.12); border-radius: 8px; background: #fafafa; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); } .practice-card-static .practice-card-title { color: var(--primary-color); } .practice-card-static .practice-card-desc { margin: 0 0 var(--spacing-unit); } .practice-card-static .practice-card-desc a { color: var(--primary-color); text-decoration: underline; text-underline-offset: 2px; } .practice-card-link-row { display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; margin: 0; font-size: 0.95rem; font-weight: 600; } .practice-card-link-row a { color: var(--primary-color); text-decoration: none; } .practice-card-link-row a:hover { text-decoration: underline; text-underline-offset: 3px; } @media (max-width: 768px) { .content-wrapper { padding: var(--spacing-unit); } .section-title { font-size: 1.5rem; } .mission-statement { font-size: 1.1rem; padding: calc(var(--spacing-unit) * 0.75); } .practice-section { padding: 0; } } /* Print styles */ @media print { .content-wrapper { max-width: 100%; padding: 0; } .hero-logo { max-width: 200px; } .mission-statement { border-left: none; background-color: transparent; } a.practice-card, .practice-card-static { break-inside: avoid; box-shadow: none; } } ',
        }}
      />
    </div>
  )
}
