'use client'

/** Full-bleed still image for the mobile homepage hero (no YouTube autoplay issues). */
export default function HeroMobilePhoto({
  src,
  alt = '',
}: {
  src: string
  alt?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className="video-iframe hero-mobile-photo"
      decoding="async"
      fetchPriority="high"
      aria-hidden={alt === ''}
    />
  )
}
