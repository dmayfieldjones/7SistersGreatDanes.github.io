'use client'

import { useEffect, useRef } from 'react'

/**
 * Component to activate scroll recognition on first wheel event.
 * Uses passive listener so it doesn't block scrolling.
 */
export default function ScrollActivator() {
  const hasScrolled = useRef(false)

  useEffect(() => {
    // Passive wheel listener - just detects first scroll to activate
    const handleWheel = () => {
      if (!hasScrolled.current && window.scrollY === 0) {
        // Page is scrollable, just need to activate it
        // Don't prevent default - let the scroll happen naturally
        // Just mark that we've detected scroll
        hasScrolled.current = true
        
        // Try to help by ensuring scroll is recognized
        // Use a tiny programmatic scroll that won't be visible
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY
          if (currentScroll === 0) {
            // Force a tiny scroll to activate
            window.scrollTo({ top: 0.5, behavior: 'auto' })
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, behavior: 'auto' })
            })
          }
        })
      }
    }

    // Add passive listener - won't block scrolling
    window.addEventListener('wheel', handleWheel, { passive: true, once: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return null
}

