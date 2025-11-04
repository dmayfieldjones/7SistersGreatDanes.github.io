import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | HAB.education',
    default: 'HAB.education | STEAM Education with High Altitude Balloons'
  },
  description: 'Educational resources and programs focused on Science, Technology, Engineering, Arts, and Mathematics using high altitude balloon experiments.',
  keywords: [
    'STEAM education',
    'high altitude balloons',
    'STEM education',
    'balloon experiments',
    'atmospheric science',
    'data visualization',
    'educational resources',
    'science education',
    'HAB.education'
  ],
  openGraph: {
    title: 'HAB.education | STEAM Education with High Altitude Balloons',
    description: 'Educational resources and programs focused on STEAM education using high altitude balloon experiments.',
    type: 'website',
    url: 'https://mayfieldjones.com/hab',
    siteName: 'HAB.education',
    images: [
      {
        url: 'https://mayfieldjones.com/img/logo.png',
        width: 200,
        height: 200,
        alt: 'HAB.education Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAB.education | STEAM Education with High Altitude Balloons',
    description: 'Educational resources and programs focused on STEAM education using high altitude balloon experiments.',
    images: ['https://mayfieldjones.com/img/logo.png'],
  },
  alternates: {
    canonical: 'https://mayfieldjones.com/hab',
  },
}

export default function HABLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="content">
      <div className="post-title">
        <h1>HAB.<span style={{ color: '#bf141c' }}>education</span></h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontSize: '1.1rem', 
          marginTop: '0.5rem',
          fontStyle: 'italic'
        }}>
          STEAM Education with High Altitude Balloons
        </p>
      </div>
      {children}
    </div>
  )
}
