import { Metadata } from 'next'
import { Accordion } from './accordion'

import './index.css'

export const metadata: Metadata = {
  title: 'Canine Genome Explorer | Great Dane Resources',
  description:
    'Explore the Great Dane genome with our interactive Canine Genome Browser. Research tools for Great Dane breeding and genetics at 7Sisters Farm',
}

export default async function ClientComponent() {
  return (
    <div className="content">
      <div className="post-title ">
        <h1>Great Dane Resources</h1>
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
        {/* Genome Browser Section */}
        <section className="resource-section" aria-labelledby="genome-title">
          <h2 id="genome-title" className="section-title">
            Canine Genome Browser
          </h2>
          <div className="resource-content">
            <p className="resource-description">
              Click on image to access the genome browser:
            </p>
            <a
              href="/GreatDaneGenomeBrowser"
              className="resource-link"
              aria-label="Access Great Dane Genome Browser"
            >
              <img
                src="/img/246Karyotype_of_Dog.png"
                alt="Dog karyotype showing 39 chromosomes (2n = 78) with telomere signals in red"
                className="resource-image"
                loading="lazy"
              />
            </a>
            <p className="image-caption">
              Dog karyotype: 39 chromosomes, 2n = 78.
            </p>
            <Accordion />
          </div>
        </section>
      </main>
    </div>
  )
}
