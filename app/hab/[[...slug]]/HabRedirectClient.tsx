'use client'

import { useEffect } from 'react'

export default function HabRedirectClient({
  destination,
}: {
  destination: string
}) {
  useEffect(() => {
    window.location.replace(destination)
  }, [destination])

  return (
    <main className="content-wrapper" style={{ padding: '2rem', textAlign: 'center' }}>
      <p>
        HAB.education has moved. If you are not redirected, open{' '}
        <a href={destination}>{destination}</a>.
      </p>
    </main>
  )
}
