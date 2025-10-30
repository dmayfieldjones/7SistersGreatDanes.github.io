'use client'

import React from 'react'
import PhotoCarousel from './components/PhotoCarousel'
import './components/hab-styles.css'

export default function HABEducationPage() {
  // Real images from the original HAB.education site
  const carouselImages = [
    {
      src: 'https://raw.githubusercontent.com/habeducation/habeducation.github.io/master/images/cs_0.jpg',
      alt: 'ASTRAX Launch 2017 collaboration',
      caption: 'ASTRAX Launch 2017 - Trabuco Canyon, CA. Our core team was invited to fly out to California for our first international collaboration, working alongside 3 high school students from Japan'
    },
    {
      src: 'https://raw.githubusercontent.com/habeducation/habeducation.github.io/master/images/2_STLbelow.jpg', 
      alt: 'Balloon ascending into the atmosphere',
      caption: 'Balloon ascending to near-space altitudes over St. Louis'
    },
    {
      src: 'https://raw.githubusercontent.com/habeducation/habeducation.github.io/master/images/cs_5.jpg',
      alt: 'Loyola Academy and Gateway Region YMCA collaboration',
      caption: 'After-school program with Loyola Academy and Gateway Region YMCA - teaching students to build and code high altitude balloon sensors using Next Generation Science Standards'
    },
    {
      src: 'https://raw.githubusercontent.com/habeducation/habeducation.github.io/master/images/dustin_assisting.jpg',
      alt: 'Dustin assisting with balloon payloads',
      caption: 'Dustin assisting with student-designed payloads and experiments'
    },
    {
      src: 'https://raw.githubusercontent.com/habeducation/habeducation.github.io/master/images/huan_assisting.jpg',
      alt: 'Huan Truong assisting with balloon launch',
      caption: 'Huan Truong helping with balloon launch preparation'
    },
    {
      src: 'https://raw.githubusercontent.com/habeducation/habeducation.github.io/master/images/cs_8.jpg',
      alt: 'Community outreach and education',
      caption: 'Saint Louis Public Library presentation - one of many community outreach events at libraries, makerspaces, schools, and conferences across the region'
    },
    {
      src: '/img/commitfromspace.jpg',
      alt: 'National Signing Day 2017 - Cordarrian Richardson commit in nearspace',
      caption: 'National Signing Day 2017 - Cordarrian Richardson commits in nearspace. Collaborated with Launch With Us to provide technical assistance for Bleacher Report'
    },
    {
      src: 'https://raw.githubusercontent.com/habeducation/habeducation.github.io/master/images/cs_3.jpg',
      alt: 'Spike to Space launch',
      caption: 'Spike to Space - Collaboration with Truman State University alumni sending Flat Spike mascot to 100,000+ feet'
    },
  ]

  return (
    <main className="content-wrapper">
      {/* Mission Section */}
          <section className="maker-section" itemScope itemType="https://schema.org/WebPageElement">
            <h2 className="section-title" itemProp="name">Our STEAM Education Initiative</h2>
            <p className="intro-text">
              From 2015-2017, HAB.education was a grassroots STEAM education initiative that 
              brought together friends, educators, and researchers to create engaging, hands-on 
              learning experiences using high altitude balloon experiments. What started as a 
              collaborative project with friends became a thriving community that bridged the 
              gap between traditional education and real-world applications.
            </p>
            <p className="intro-text">
              As co-founder and organizer, I helped facilitate connections with researchers at 
              NASA Goddard, collaborated with student groups like Stanford Space Initiative, and 
              built a community that shared knowledge and resources. Together, we created 
              educational tools and methodologies that made atmospheric science accessible to 
              students and educators everywhere.
            </p>
          </section>

          {/* Photo Carousel Section */}
          <section className="maker-section">
            <h2 className="section-title">High Altitude Balloons Make STEAM Fun!</h2>
            <p className="intro-text">
              Teaching STEAM is hard. We helped make it fun, affordable, and inspiring through 
              hands-on high altitude balloon experiments that brought science to life.
            </p>
            <PhotoCarousel images={carouselImages} autoPlay={true} interval={4000} />
          </section>

      {/* Navigation Section */}
      <section className="maker-section">
        <h2 className="section-title">Explore HAB.education</h2>
        <div className="maker-grid">
          <div className="maker-card">
            <h3><a href="/hab/lessons" className="btn btn-zoom hover:text-red-600">Educational Programs</a></h3>
            <p>After-school program with Loyola Academy & Gateway YMCA, plus international ASTRAX collaboration</p>
          </div>
          <div className="maker-card">
            <h3><a href="/hab/data" className="btn btn-zoom hover:text-red-600">Data Visualization</a></h3>
            <p>Interactive tools for analyzing balloon flight data and atmospheric measurements</p>
          </div>
          <div className="maker-card">
            <h3><a href="/hab/events" className="btn btn-zoom hover:text-red-600">Events</a></h3>
            <p>Regular meetings, workshops, and special events for the HAB community</p>
          </div>
          <div className="maker-card">
            <h3><a href="/hab/interviews" className="btn btn-zoom hover:text-red-600">Interviews</a></h3>
            <p>Stories and insights from educators, students, and researchers</p>
          </div>
          <div className="maker-card">
            <h3><a href="/hab/projects" className="btn btn-zoom hover:text-red-600">Projects</a></h3>
            <p>Student projects, experiments, and hands-on learning activities</p>
          </div>
          <div className="maker-card">
            <h3><a href="/hab/archive" className="btn btn-zoom hover:text-red-600">Articles</a></h3>
            <p>Browse the HAB.education blog archive (2015–2017)</p>
          </div>
          <div className="maker-card">
            <h3><a href="/hab/resources" className="btn btn-zoom hover:text-red-600">Resources</a></h3>
            <p>Educational materials, guides, and tools for STEAM education</p>
          </div>
        </div>
      </section>

          {/* What We Accomplished Section */}
          <section className="maker-section">
            <h2 className="section-title">What We Accomplished</h2>
            <ul className="maker-list">
              <li><strong>Community Building:</strong> Established a thriving community of educators, students, and researchers from 2015-2017</li>
              <li><strong>Research Partnerships:</strong> Collaborated with NASA Goddard researchers, Stanford Space Initiative, and atmospheric scientists</li>
              <li><strong>Educational Innovation:</strong> Developed hands-on STEAM curriculum using high altitude balloon experiments</li>
              <li><strong>Knowledge Sharing:</strong> Created interview series featuring leading researchers and student organizations</li>
              <li><strong>Open Source Development:</strong> Built tools and methodologies for balloon data collection and analysis</li>
              <li><strong>Student Engagement:</strong> Provided real-world research opportunities for students and educators</li>
            </ul>
          </section>

          {/* Collaborators Section */}
          <div className="maker-card">
            <h2 className="section-title">Collaborators & Partners</h2>
            <p className="intro-text">
              HAB.education was made possible through the collaboration of friends, educators, 
              researchers, and community organizations who shared our vision for hands-on STEAM education.
            </p>
            <div>
              <h3>Core Team</h3>
              <ul className="maker-list">
                <li>Dustin Mayfield-Jones - Organizer</li>
                <li>Derek Sigler - HAB Expert, Arch Reactor</li>
                <li><a href="https://www.tnhh.net/about.html" target="_blank" rel="noopener noreferrer">Huan Truong</a> - Software Developer</li>
                <li><a href="https://dbindner.freeshell.org/" target="_blank" rel="noopener noreferrer">Don Bindner</a> - Electronics & Radio Engineer</li>
                <li><a href="https://cmdcolin.github.io/" target="_blank" rel="noopener noreferrer">Colin Diesh</a> - Software Engineer & Bioinformatician</li>
                <li>Atom - Roboticist</li>
              </ul>
              
              <h3>Regional Partners (St. Louis Area)</h3>
              <ul className="maker-list">
                <li><a href="https://archreactor.org/" target="_blank" rel="noopener noreferrer">Arch Reactor</a> - St. Louis Maker Space (and many others)</li>
                <li><a href="https://loyolaacademy.org/" target="_blank" rel="noopener noreferrer">Loyola Academy</a> - St. Louis Jesuit School</li>
                <li><a href="https://gwrymca.org/" target="_blank" rel="noopener noreferrer">Gateway Region YMCA</a></li>
                <li>Lauren Schneider - Gateway Region YMCA (former)</li>
                <li><a href="https://about.me/sosharpe" target="_blank" rel="noopener noreferrer">O.Mikhail Sharpe</a> - Educator & Community Advocate</li>
                <li>Debbie Fehr Mayfield Lintner - Southeast Regional Professional Development Center</li>
                <li>Ann Boes - St. Francois County 4-H</li>
                <li>Friends at the St. Louis Space Frontier</li>
              </ul>
              
              <h3>International Partners</h3>
              <ul className="maker-list">
                <li><a href="https://astrax-by-iss.wixsite.com/taichi" target="_blank" rel="noopener noreferrer">ASTRAX</a> - Japan-based International Space Education & Commercial Astronaut Program</li>
              </ul>
            </div>
          </div>

          {/* Legacy and Impact Section */}
          <section className="maker-section">
            <h2 className="section-title">Legacy and Impact</h2>
            <p className="intro-text">
              While HAB.education is no longer active, the initiative's impact continues through 
              the educational resources, research collaborations, and community connections we 
              established. The methodologies and tools we developed remain valuable for educators 
              and students interested in STEAM education through atmospheric science.
            </p>
            <div className="contact-info">
              <p><strong>Contact:</strong> <a href="mailto:dustin@mayfieldjones.com">dustin@mayfieldjones.com</a></p>
            </div>
          </section>
    </main>
  )
}

