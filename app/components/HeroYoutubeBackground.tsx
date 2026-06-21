'use client'

import { useEffect, useState } from 'react'

const MOBILE_MQ = '(max-width: 768px)'

export function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`${MOBILE_MQ}, (pointer: coarse)`).matches
}

/** Desktop-only YouTube hero background. */
export default function HeroYoutubeBackground({
  embedSrc,
  title,
}: {
  embedSrc: string
  title: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 120)
    return () => window.clearTimeout(id)
  }, [])

  if (!mounted) {
    return <div className="video-iframe video-iframe-placeholder" aria-hidden />
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
