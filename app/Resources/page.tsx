'use client'

import { useEffect } from 'react'

const DESTINATION = '/GreatDaneGenomeBrowser'

export default function ResourcesRedirect() {
  useEffect(() => {
    window.location.replace(DESTINATION)
  }, [])

  return (
    <main className="content-wrapper" style={{ padding: '2rem', textAlign: 'center' }}>
      <p>
        The Genome Explorer has moved. If you are not redirected, open{' '}
        <a href={DESTINATION}>{DESTINATION}</a>.
      </p>
    </main>
  )
}
