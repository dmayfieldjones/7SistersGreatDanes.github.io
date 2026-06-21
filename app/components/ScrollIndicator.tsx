'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export default function ScrollIndicator() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(true)

  const handleScroll = useCallback(() => {
    const hero = document.querySelector('.video-hero-section')
    const y = hero
      ? hero.getBoundingClientRect().height + window.scrollY
      : window.innerHeight
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const el = rootRef.current?.closest('.video-hero-section')
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -32px 0px',
      },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`scroll-indicator${heroVisible ? '' : ' scroll-indicator--hero-out'}`}
      onClick={handleScroll}
      role="button"
      aria-label="Scroll down for more about 7Sisters"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleScroll()
        }
      }}
    >
      <div className="scroll-arrow"></div>
      <span className="scroll-text">More below</span>
    </div>
  )
}
