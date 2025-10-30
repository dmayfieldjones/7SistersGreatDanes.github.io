'use client'

import Link from 'next/link'
import { useState } from 'react'
import './index.css'

// Note: Metadata can't be exported from client components
// We'll need to add this to a layout file or convert to server component

export default function Contents() {
  const [dustinExpanded, setDustinExpanded] = useState(false)
  const [karenExpanded, setKarenExpanded] = useState(false)

  return (
    <div className="content">
      <div className="post-title">
        <h1>About Us</h1>
      </div>
      <main className="content-wrapper">
        {/* About Us Section */}
        <section className="about-section">
          {/* Hook with Photo */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '30px', 
            margin: '30px 0',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              flex: '0 0 auto', 
              textAlign: 'center',
              minWidth: '250px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img 
                src="/img/wedding.png" 
                alt="Dustin and Karen with rescue dog Kitty and their first Great Dane Aubrey" 
                style={{
                  maxWidth: '300px',
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  marginBottom: '8px'
                }}
              />
              <p style={{ 
                fontStyle: 'italic', 
                color: '#666', 
                fontSize: '12px',
                margin: '0'
              }}>
                Dustin and Karen with Kitty and Aubrey in their wedding tuxedos (2012)
              </p>
            </div>
          </div>
          
          {/* Individual Expertise */}
          <div className="expertise-section">
            <div className="expertise-grid">
              <div className="expertise-item">
                <h4 className="expertise-name">Dustin</h4>
                <p className="expertise-text">
                  My love for Great Danes started when I first hugged a harlequin male at around age 10 while growing up in Iowa. My dad, an animal pharmaceutical sales rep with Merck, nurtured that fascination by taking me to countless hours with veterinarians, watching surgeries, and touring agricultural operations. His family had bred German Shepherds, but he took me to visit Great Dane breeders and conformation shows because that was the breed I had fallen in love with.
                </p>
                
                {dustinExpanded && (
                  <>
                    <p className="expertise-text">
                      Those early experiences shaped my interest in going into science with an interest in genetics, breeding, and domestication. While I've since transitioned from active research to managing labs and supporting entrepreneurs, I leverage those scientific experiences to bring rigor and systematic thinking to breeding.
                    </p>
                    <p className="expertise-text">
                      Our Illinois farm reflects an agricultural approach to breeding—multi-generational planning, understanding bloodlines and their strengths to make informed breeding decisions, and raising animals with purpose. When families choose one of our Great Danes, they're getting the benefit of both scientific rigor and decades of hands-on experience with these magnificent dogs.
                    </p>
                  </>
                )}
                
                <button 
                  onClick={() => setDustinExpanded(!dustinExpanded)}
                  className="read-more-button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#bf141c',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '16px',
                    marginTop: '15px',
                    marginBottom: '20px',
                    display: 'block',
                    padding: '8px 0',
                    minHeight: '44px',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  {dustinExpanded ? 'Read Less' : 'Read More About Dustin'}
                </button>
                
                <a 
                  href="https://scholar.google.com/citations?user=MkPrBuoAAAAJ&hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="expertise-link"
                >
                  View Research Profile →
                </a>
              </div>
              
              <div className="expertise-item">
                <h4 className="expertise-name">Karen</h4>
                <p className="expertise-text">
                  My passion for dogs started early, growing up with parents who bred dachshunds and competing in 4-H obedience shows. Working at a veterinary clinic as a child gave me hands-on experience with animal care and health issues. While I discovered Great Danes through my husband Dustin, my legal training as a litigation attorney brings a unique perspective to our breeding program.
                </p>
                
                {karenExpanded && (
                  <>
                    <p className="expertise-text">
                      Those early experiences with dachshund breeding and veterinary work shaped my understanding of responsible breeding practices. My legal background ensures ethical, transparent practices with comprehensive contracts that protect both families and our dogs—covering health guarantees, breeding rights, and ongoing support.
                    </p>
                    <p className="expertise-text">
                      I've dedicated over 20 years to Blood Cancer United, where I learned that meaningful change comes through sustained commitment and attention to detail. This same approach drives my commitment to responsible breeding and lifelong support for the families who choose our Great Danes.
                    </p>
                  </>
                )}
                
                <button 
                  onClick={() => setKarenExpanded(!karenExpanded)}
                  className="read-more-button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#bf141c',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '16px',
                    marginTop: '15px',
                    marginBottom: '20px',
                    display: 'block',
                    padding: '8px 0',
                    minHeight: '44px',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  {karenExpanded ? 'Read Less' : 'Read More About Karen'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="read-more-section">
            <Link href="/posts/2025-06-23-more-than-show-and-go" className="read-more-link">
              Read more about our journey →
            </Link>
          </div>
        </section>

        {/* Breeding Philosophy Section */}
        <section className="philosophy-section">
          <div className="cta-section">
            <Link href="/BreedingPhilosophy" className="cta-button">
              Learn More About Our Philosophy
            </Link>
          </div>
        </section>

        {/* Farm Section */}
        <section className="farm-section">
          <div className="cta-section">
            <Link href="/Farm" className="cta-button">
              Discover Our Farm's Story
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="cta-section">
            <Link href="/contact" className="cta-button">
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
