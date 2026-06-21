'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import HeroYoutubeBackground from './HeroYoutubeBackground'
import ScrollIndicator from './ScrollIndicator'

const MIN_SPLASH_MS = 2800
const MAX_SPLASH_MS = 4500
/** Black hold after logo — video keeps playing hidden so YouTube chrome never flashes. */
const CURTAIN_MS = 1100
const LOGO_FADE_MS = 550

type IntroPhase = 'splash' | 'curtain' | 'revealing' | 'done'

export default function HomeVideoHero({ embedSrc }: { embedSrc: string }) {
  const [phase, setPhase] = useState<IntroPhase>('splash')
  const [logoVisible, setLogoVisible] = useState(true)
  const [logoHiding, setLogoHiding] = useState(false)
  const [videoRevealed, setVideoRevealed] = useState(false)

  const splashStartRef = useRef(Date.now())
  const splashTimerRef = useRef<number | null>(null)
  const curtainTimerRef = useRef<number | null>(null)
  const advancedRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (splashTimerRef.current !== null) {
      window.clearTimeout(splashTimerRef.current)
      splashTimerRef.current = null
    }
    if (curtainTimerRef.current !== null) {
      window.clearTimeout(curtainTimerRef.current)
      curtainTimerRef.current = null
    }
  }, [])

  const beginCurtain = useCallback(() => {
    if (advancedRef.current) return
    advancedRef.current = true
    clearTimers()

    setLogoHiding(true)
    window.setTimeout(() => {
      setLogoVisible(false)
      setPhase('curtain')
    }, LOGO_FADE_MS)

    curtainTimerRef.current = window.setTimeout(() => {
      setPhase('revealing')
      setVideoRevealed(true)
    }, LOGO_FADE_MS + CURTAIN_MS)
  }, [clearTimers])

  const handleVideoPlaying = useCallback(() => {
    if (advancedRef.current) return

    const elapsed = Date.now() - splashStartRef.current
    const remaining = MIN_SPLASH_MS - elapsed

    if (remaining <= 0) {
      beginCurtain()
      return
    }

    if (splashTimerRef.current === null) {
      splashTimerRef.current = window.setTimeout(beginCurtain, remaining)
    }
  }, [beginCurtain])

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
          revealed={videoRevealed}
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
