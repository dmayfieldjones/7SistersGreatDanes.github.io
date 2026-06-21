'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import HeroYoutubeBackground, { isMobileDevice } from './HeroYoutubeBackground'
import ScrollIndicator from './ScrollIndicator'

const MIN_SPLASH_MS = 2800
const MAX_SPLASH_MS = 4500
const CURTAIN_MS = 1100
const LOGO_FADE_MS = 550
/** After iframe mounts on mobile, wait this long for playback before revealing anyway. */
const MOBILE_PLAY_WAIT_MS = 4500

type IntroPhase = 'splash' | 'curtain' | 'revealing' | 'done'

export default function HomeVideoHero({ embedSrc }: { embedSrc: string }) {
  const [mobile] = useState(() => isMobileDevice())
  const [phase, setPhase] = useState<IntroPhase>('splash')
  const [logoVisible, setLogoVisible] = useState(true)
  const [logoHiding, setLogoHiding] = useState(false)
  const [loadVideo, setLoadVideo] = useState(!mobile)

  const splashStartRef = useRef(Date.now())
  const splashTimerRef = useRef<number | null>(null)
  const revealTimerRef = useRef<number | null>(null)
  const advancedRef = useRef(false)
  const revealStartedRef = useRef(false)
  const videoLoadStartRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (splashTimerRef.current !== null) {
      window.clearTimeout(splashTimerRef.current)
      splashTimerRef.current = null
    }
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
  }, [])

  const beginReveal = useCallback(() => {
    if (revealStartedRef.current) return
    revealStartedRef.current = true
    clearTimers()
    setPhase('revealing')
  }, [clearTimers])

  const beginCurtain = useCallback(() => {
    if (advancedRef.current) return
    advancedRef.current = true
    clearTimers()

    setLogoHiding(true)
    window.setTimeout(() => {
      setLogoVisible(false)
      setPhase('curtain')
      if (mobile) {
        setLoadVideo(true)
        videoLoadStartRef.current = Date.now()
        revealTimerRef.current = window.setTimeout(beginReveal, MOBILE_PLAY_WAIT_MS)
      } else {
        revealTimerRef.current = window.setTimeout(beginReveal, CURTAIN_MS)
      }
    }, LOGO_FADE_MS)
  }, [beginReveal, clearTimers, mobile])

  const handleVideoPlaying = useCallback(() => {
    if (!advancedRef.current) {
      const elapsed = Date.now() - splashStartRef.current
      const remaining = MIN_SPLASH_MS - elapsed

      if (remaining <= 0) {
        beginCurtain()
      } else if (splashTimerRef.current === null) {
        splashTimerRef.current = window.setTimeout(beginCurtain, remaining)
      }
      return
    }

    if (mobile && phase === 'curtain' && !revealStartedRef.current) {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current)
        revealTimerRef.current = null
      }
      const loadedAt = videoLoadStartRef.current ?? Date.now()
      const sinceLoad = Date.now() - loadedAt
      const minAfterLoad = 400
      const wait = Math.max(0, minAfterLoad - sinceLoad)
      revealTimerRef.current = window.setTimeout(beginReveal, wait)
    }
  }, [beginCurtain, mobile, phase])

  useEffect(() => {
    const maxTimer = window.setTimeout(beginCurtain, MAX_SPLASH_MS)
    return () => {
      window.clearTimeout(maxTimer)
      clearTimers()
    }
  }, [beginCurtain, clearTimers])

  useEffect(() => {
    if (phase !== 'revealing') return
    const doneTimer = window.setTimeout(() => setPhase('done'), 1300)
    return () => window.clearTimeout(doneTimer)
  }, [phase])

  return (
    <section className="video-hero-section">
      <div className="video-background">
        <HeroYoutubeBackground
          embedSrc={embedSrc}
          title="Background video"
          shouldLoad={loadVideo}
          onPlaying={handleVideoPlaying}
        />
        <div className="video-overlay" />
      </div>

      {phase !== 'done' ? (
        <div
          className={`hero-curtain${phase === 'revealing' ? ' hero-curtain--hiding' : ''}`}
          aria-hidden={phase === 'revealing'}
          onTransitionEnd={(event) => {
            if (event.propertyName === 'opacity' && phase === 'revealing') {
              setPhase('done')
            }
          }}
        >
          {logoVisible ? (
            <div className={`hero-splash-card${logoHiding ? ' hero-splash-card--hiding' : ''}`}>
              <img
                src="/img/Colorlogo_nobackground.png"
                alt="7Sisters Farm"
                width={300}
                height="auto"
                className="hero-splash-logo"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {phase === 'done' ? <ScrollIndicator /> : null}
    </section>
  )
}
