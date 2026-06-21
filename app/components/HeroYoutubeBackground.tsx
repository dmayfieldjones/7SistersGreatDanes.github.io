'use client'

import { useEffect, useState } from 'react'

const MOBILE_MQ = '(max-width: 768px)'

/**
 * Defers mounting the YouTube iframe briefly so the first paint isn’t competing
 * with the embed on mobile. Same pattern as before today’s homepage experiments.
 */
export default function HeroYoutubeBackground({
  embedSrc,
  title,
}: {
  embedSrc: string
  title: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_MQ).matches
    const ms = mobile ? 650 : 120
    const id = window.setTimeout(() => setMounted(true), ms)
    return () => window.clearTimeout(id)
  }, [])

  if (!mounted) {
    return (
      <div
        className="video-iframe video-iframe-placeholder"
        aria-hidden
      />
    )
  }

  return (
    <iframe
      src={embedSrc}
      className="video-iframe"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      title={title}
    />
  )
}
