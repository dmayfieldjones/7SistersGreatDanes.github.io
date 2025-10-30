import { Metadata } from 'next'
import Link from 'next/link'
import { Accordion } from './accordion'

import './index.css'

export const metadata: Metadata = {
  title: 'Great Dane Resources',
  description:
    'Research tools and resources for Great Dane breeding and genetics at 7Sisters Farm',
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

        {/* C-BARQ Section */}
        <section className="resource-section" aria-labelledby="cbarq-title">
          <h2 id="cbarq-title" className="section-title">
            Canine Behavioral Assessment and Research Questionnaire
          </h2>
          <div className="resource-content">
            <p className="resource-description">
              Click on image to access the C-BARQ portal:
            </p>
            <a
              href="https://vetapps.vet.upenn.edu/cbarq/login-page.cfm/"
              className="resource-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Access C-BARQ Assessment Portal"
            >
              <img
                src="/img/piper.jpg"
                alt="Baby Great Dane puppy"
                className="resource-image"
                loading="lazy"
              />
            </a>
            <p className="cbarq-info">
              The C-BARQ is designed to provide dog owners and professionals
              with standardized evaluations of canine temperament and behavior.{' '}
              <span className="accent-color">7</span>Sisters is a registered
              group. Contact Karen and Dustin for our group's access code.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
