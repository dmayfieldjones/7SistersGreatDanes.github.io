import { Metadata } from 'next'
import './index.css'
import MakerspaceDirectory from './MakerspaceDirectory'

export const metadata: Metadata = {
  title: 'Central Illinois Maker Network | Makerspaces, Machine Shops & Innovation Resources',
  description:
    'Comprehensive directory of 20+ makerspaces, machine shops, and innovation resources in Central Illinois. Find 3D printing, CNC machining, laser cutting, and fabrication facilities for entrepreneurs, students, and makers at UIUC and surrounding areas.',
  keywords: [
    'makerspace',
    'machine shop',
    '3D printing',
    'CNC machining',
    'laser cutting',
    'fabrication',
    'Central Illinois',
    'UIUC',
    'University of Illinois',
    'Champaign Urbana',
    'entrepreneurship',
    'innovation',
    'prototyping',
    'manufacturing',
    'makerspace directory',
    'machine shop directory',
    'Illinois makerspace',
    'Champaign makerspace',
    'Urbana makerspace',
    'Bloomington makerspace',
    'Illinois Wesleyan',
    'Petrick Idea Center',
    'Siebel Center for Design',
    'Grainger IDEA Lab',
    'EnterpriseWorks',
    'Research Park'
  ],
  openGraph: {
    title: 'Central Illinois Maker Network | 20+ Makerspaces & Machine Shops',
    description: 'Find makerspaces, machine shops, and innovation resources across Central Illinois. Comprehensive directory for entrepreneurs, students, and makers.',
    type: 'website',
    url: 'https://mayfieldjones.com/maker',
    siteName: '7Sisters Farm',
    images: [
      {
        url: 'https://mayfieldjones.com/img/logo.png',
        width: 200,
        height: 200,
        alt: '7Sisters Farm Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Central Illinois Maker Network | 20+ Makerspaces & Machine Shops',
    description: 'Comprehensive directory of makerspaces, machine shops, and innovation resources in Central Illinois.',
    images: ['https://mayfieldjones.com/img/logo.png'],
  },
  alternates: {
    canonical: 'https://mayfieldjones.com/maker',
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

export default function MakerPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Central Illinois Maker Network",
    "description": "Comprehensive directory of makerspaces, machine shops, and innovation resources in Central Illinois",
    "url": "https://mayfieldjones.com/maker",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Central Illinois Maker Resources",
      "description": "Directory of makerspaces, machine shops, and innovation facilities",
      "numberOfItems": 20,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Place",
            "name": "Siebel Center for Design - The Shop",
            "description": "Multi-disciplinary makerspace with comprehensive fabrication facilities",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Urbana",
              "addressRegion": "IL",
              "addressCountry": "US"
            }
          }
        }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mayfieldjones.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Maker Network",
          "item": "https://mayfieldjones.com/maker"
        }
      ]
    },
    "author": {
      "@type": "Person",
      "name": "Dustin Mayfield-Jones",
      "url": "https://mayfieldjones.com/about"
    },
    "dateModified": "2025-10-15",
    "inLanguage": "en-US"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="content">
      <div className="post-title">
        <h1>The Central Illinois <span style={{ color: '#bf141c' }}>Maker</span> Network</h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontSize: '1.1rem', 
          marginTop: '0.5rem',
          fontStyle: 'italic'
        }}>
          Connecting Entrepreneurs, Makers, and Innovators
        </p>
        <p style={{ 
          textAlign: 'center', 
          fontSize: '0.9rem', 
          color: '#888', 
          marginTop: '0.5rem',
          fontStyle: 'italic'
        }}>
          Last updated: October 2025
        </p>
      </div>
      
      <main className="content-wrapper">
        {/* Mission Section */}
        <section className="maker-section" itemScope itemType="https://schema.org/WebPageElement">
          <h2 className="section-title" itemProp="name">About This Resource</h2>
          <p className="intro-text">
            I've created this comprehensive directory to help entrepreneurs, makers, and 
            innovators find the resources they need to bring their ideas to life. This curated collection 
            of makerspaces, machine shops, and maker organizations represents the rich ecosystem of 
            fabrication and innovation resources available in our region.
          </p>
          <p className="intro-text">
            Whether you're a startup founder, a student, or an entrepreneur anywhere in Central Illinois, 
            this resource is designed to connect you with the tools, facilities, and expertise you need 
            to prototype, build, and scale your innovations.
          </p>
        </section>

        {/* Value Proposition Section */}
        <section className="maker-section">
          <h2 className="section-title">Why This Matters</h2>
          <div className="maker-grid">
            <div className="maker-card">
              <h3>Discover</h3>
              <p>Find the right makerspace, machine shop, or facility for your specific project needs</p>
            </div>
            <div className="maker-card">
              <h3>Accelerate</h3>
              <p>Skip the research phase and get straight to building with verified, up-to-date information</p>
            </div>
            <div className="maker-card">
              <h3>Connect</h3>
              <p>Access the full spectrum of Central Illinois maker resources in one comprehensive directory</p>
            </div>
            <div className="maker-card">
              <h3>Scale</h3>
              <p>From prototyping to production, find resources that grow with your project's needs</p>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="maker-section">
          <h2 className="section-title">How to Use This Resource</h2>
          <ul className="maker-list">
            <li><strong>Search by Need:</strong> Use the search function to find facilities with specific equipment or capabilities</li>
            <li><strong>Filter by Category:</strong> Browse university makerspaces, community labs, commercial machine shops, or campus facilities</li>
            <li><strong>Check Access Requirements:</strong> Each resource lists target audiences and access models to help you find the right fit</li>
            <li><strong>Contact Directly:</strong> Use the provided contact information to reach out to facilities about your specific needs</li>
            <li><strong>Plan Your Project:</strong> Review hours, specialties, and equipment lists to plan your prototyping or production timeline</li>
            <li><strong>Stay Updated:</strong> This directory is regularly updated with new information and resources</li>
          </ul>
        </section>


               {/* Resource Directory Section */}
               <section className="maker-section">
                 <h2 className="section-title">Central Illinois Maker Resources Directory</h2>
                 <p className="intro-text">
                   Discover the comprehensive network of <strong>20+ makerspaces, machine shops, and maker organizations</strong> available to entrepreneurs and makers in Central Illinois. From university labs to community
                   spaces, find the resources you need to bring your ideas to life. This directory includes:
                 </p>
                 <ul className="maker-list">
                   <li><strong>University Makerspaces:</strong> UIUC facilities including Siebel Center for Design, Grainger IDEA Lab, Illinois MakerLab, and the EnterpriseWorks Makerspace</li>
                   <li><strong>Community Makerspaces:</strong> Champaign-Urbana Community Fab Lab and Makerspace Urbana</li>
                   <li><strong>Machine Shops:</strong> Commercial and campus machine shops with CNC machining, waterjet cutting, and precision fabrication</li>
                   <li><strong>Regional Resources:</strong> The Petrick Idea Center at Illinois Wesleyan University</li>
                   <li><strong>Library Makerspaces:</strong> Public access facilities at Champaign and Urbana libraries</li>
                 </ul>
                 <MakerspaceDirectory />
               </section>

        {/* Background Section */}
        <section className="maker-section">
          <h2 className="section-title">My Background</h2>
          <p className="intro-text">
            With over 15 years of experience in scientific research and having worked for a startup,
            I understand the challenges entrepreneurs face when trying to find the right resources for
            their projects. My background includes active participation in the Saint Louis maker and
            tech startup communities, including The Maker Group, Arch Reactor, and co-founding
            HAB.education, a STEAM education organization.
          </p>
          <p className="intro-text">
            Now working to support entrepreneurship at a deep-tech business incubator, I'm passionate
            about helping startup founders with their resource needs during critical periods of the
            incubation phase. This resource directory is my way of extending that support to the broader
            Central Illinois innovation community.             I bring the same commitment to research, community 
            building, and excellence to all my work, including my involvement in 
            <a href="/BreedingPhilosophy" style={{ textDecoration: 'none', color: 'inherit' }}> ethical Great Dane breeding</a> and <a href="/about" style={{ textDecoration: 'none', color: 'inherit' }}> responsible stewardship of the breed</a>.
          </p>
        </section>


        {/* Contact Section */}
        <section className="maker-section">
          <h2 className="section-title">Get In Touch</h2>
          <p className="intro-text">
            Have questions about these maker resources or need guidance on finding the right facility 
            for your project? I'm here to help entrepreneurs and makers navigate Central Illinois's 
            innovation ecosystem.             I'm also happy to discuss <a href="/CommonQuestions" style={{ textDecoration: 'none', color: 'inherit' }}> Great Dane breeding questions</a> or share insights about <a href="/7Sisters" style={{ textDecoration: 'none', color: 'inherit' }}> our breeding program</a>.
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> <a href="mailto:dustin@mayfieldjones.com">dustin@mayfieldjones.com</a></p>
            <p><strong>Location:</strong> Central Illinois</p>
            <p><strong>Focus:</strong> Supporting entrepreneurship and maker communities</p>
          </div>
        </section>
      </main>
    </div>
    </>
  )
}
