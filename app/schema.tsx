export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://dmayfieldjones.github.io/#business",
    "name": "7Sisters Farm",
    "alternateName": "7Sisters Great Danes",
    "description": "Premier Illinois Great Dane breeders at 7Sisters Farm in Central Illinois. AKC registered Great Danes, health tested, family raised.",
    "url": "https://dmayfieldjones.github.io",
    "telephone": "dustin@mayfieldjones.com",
    "email": "dustin@mayfieldjones.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Champaign",
      "addressRegion": "IL",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.1164",
      "longitude": "-88.2434"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "Illinois"
      },
      {
        "@type": "State", 
        "name": "Indiana"
      },
      {
        "@type": "State",
        "name": "Iowa"
      },
      {
        "@type": "State",
        "name": "Missouri"
      },
      {
        "@type": "State",
        "name": "Wisconsin"
      }
    ],
    "serviceType": "Great Dane Breeding",
    "priceRange": "$$",
    "paymentAccepted": "Cash, Check",
    "currenciesAccepted": "USD",
    "openingHours": "Mo-Su 09:00-18:00",
    "image": [
      "https://dmayfieldjones.github.io/img/wedding.png",
      "https://dmayfieldjones.github.io/img/2021_5pt_BOW_BOBOH_Waukesha_Mimi_Kim.jpg",
      "https://dmayfieldjones.github.io/img/Colorlogo_nobackground.png"
    ],
    "logo": "https://dmayfieldjones.github.io/img/Colorlogo_nobackground.png",
    "sameAs": [
      "https://www.tiktok.com/@7sistersgreatdanes"
    ],
    "founder": [
      {
        "@type": "Person",
        "name": "Dustin Mayfield-Jones",
        "jobTitle": "Great Dane Breeder"
      },
      {
        "@type": "Person", 
        "name": "Karen Mayfield-Jones",
        "jobTitle": "Great Dane Breeder"
      }
    ],
    "keywords": [
      "Illinois Great Dane breeders",
      "Illinois dogs",
      "Illinois breeders", 
      "Great Dane breeders Illinois",
      "Central Illinois Great Danes",
      "AKC Great Danes Illinois",
      "Illinois dog breeders",
      "Great Dane puppies Illinois",
      "7Sisters Farm",
      "Champaign Illinois breeders",
      "Urbana Illinois dogs",
      "Illinois Great Dane kennel"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Great Dane Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Great Dane Puppies",
            "description": "AKC registered Great Dane puppies, health tested, family raised"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Great Dane Breeding Consultation",
            "description": "Expert advice on Great Dane breeding, health testing, and care"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "1",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
