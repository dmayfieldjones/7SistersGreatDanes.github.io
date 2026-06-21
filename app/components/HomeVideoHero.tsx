'use client'

import { useEffect, useState } from 'react'
import HeroMobilePhoto from './HeroMobilePhoto'
import HeroYoutubeBackground, { isMobileDevice } from './HeroYoutubeBackground'
import ScrollIndicator from './ScrollIndicator'

/**
 * Mobile: static photo only (reliable, no YouTube autoplay fights).
 * Desktop: autoplaying YouTube background with bottom chrome mask.
 */
export default function HomeVideoHero({
  embedSrc,
  mobilePhotoSrc,
}: {
  embedSrc: string
  mobilePhotoSrc: string
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  return (
    <section className="video-hero-section">
      <div className="video-background">
        {isMobile === null && (
          <div className="video-iframe video-iframe-placeholder" aria-hidden />
        )}
        {isMobile && <HeroMobilePhoto src={mobilePhotoSrc} />}
        {isMobile === false && (
          <HeroYoutubeBackground embedSrc={embedSrc} title="Background video" />
        )}
        <div className="video-overlay" />
      </div>
      {isMobile === false && <div className="video-bottom-mask" aria-hidden />}
      <ScrollIndicator />
    </section>
  )
}
