'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import HeroMobilePhoto from './HeroMobilePhoto'
import HeroYoutubeBackground, {
  HeroYoutubeBackgroundHandle,
  isMobileDevice,
} from './HeroYoutubeBackground'
import ScrollIndicator from './ScrollIndicator'

type HeroMode = 'pending' | 'mobile-photo' | 'desktop-video'

export default function HomeVideoHero({
  embedSrc,
  mobilePhotoSrc,
}: {
  embedSrc: string
  mobilePhotoSrc: string
}) {
  const videoRef = useRef<HeroYoutubeBackgroundHandle>(null)
  const [mode, setMode] = useState<HeroMode>('pending')
  const [videoStarted, setVideoStarted] = useState(false)

  useEffect(() => {
    setMode(isMobileDevice() ? 'mobile-photo' : 'desktop-video')
  }, [])

  const startVideo = useCallback(() => {
    if (videoStarted) return
    videoRef.current?.load()
    videoRef.current?.play()
    setVideoStarted(true)
  }, [videoStarted])

  const nudgeVideo = useCallback(() => {
    if (mode === 'mobile-photo' && !videoStarted) {
      startVideo()
      return
    }
    videoRef.current?.play()
  }, [mode, videoStarted, startVideo])

  const showMobileCover = mode === 'mobile-photo' && !videoStarted
  const showBottomMask = mode === 'desktop-video' || videoStarted

  return (
    <section className="video-hero-section">
      <div className="video-background">
        {mode === 'pending' && (
          <div className="video-iframe video-iframe-placeholder" aria-hidden />
        )}
        {(mode === 'mobile-photo' || mode === 'desktop-video') && (
          <HeroYoutubeBackground
            ref={videoRef}
            embedSrc={embedSrc}
            title="Background video"
            deferLoad={mode === 'mobile-photo'}
          />
        )}
        <div className="video-overlay" />
      </div>

      {showMobileCover && (
        <div className="hero-mobile-cover">
          <HeroMobilePhoto src={mobilePhotoSrc} />
          <button
            type="button"
            className="hero-tap-to-play"
            aria-label="Play background video"
            onTouchStart={(event) => {
              event.preventDefault()
              startVideo()
            }}
            onClick={startVideo}
          />
        </div>
      )}

      {showBottomMask && <div className="video-bottom-mask" aria-hidden />}
      <ScrollIndicator onInteract={nudgeVideo} />
    </section>
  )
}
