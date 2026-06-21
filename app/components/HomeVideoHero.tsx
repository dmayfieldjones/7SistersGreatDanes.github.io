'use client'

import { useCallback, useRef } from 'react'
import HeroYoutubeBackground, { HeroYoutubeBackgroundHandle } from './HeroYoutubeBackground'
import ScrollIndicator from './ScrollIndicator'

export default function HomeVideoHero({ embedSrc }: { embedSrc: string }) {
  const videoRef = useRef<HeroYoutubeBackgroundHandle>(null)

  const nudgeVideo = useCallback(() => {
    videoRef.current?.play()
  }, [])

  return (
    <section className="video-hero-section">
      <div className="video-background">
        <HeroYoutubeBackground ref={videoRef} embedSrc={embedSrc} title="Background video" />
        <div className="video-overlay" />
      </div>
      <ScrollIndicator onInteract={nudgeVideo} />
    </section>
  )
}
