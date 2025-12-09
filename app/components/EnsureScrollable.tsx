'use client'

import { useEffect } from 'react'

/**
 * Component to ensure the page is immediately scrollable on load.
 * This fixes the issue where the first scroll gesture on Mac trackpads
 * doesn't register because the browser hasn't recognized the page as scrollable yet.
 */
export default function EnsureScrollable() {
  useEffect(() => {
    // Simple approach: just try to activate scroll recognition
    // Don't intercept wheel events - let them work normally
    const activateScroll = () => {
      if (window.scrollY === 0) {
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight
        
        if (scrollHeight > clientHeight) {
          // Force scroll activation by briefly scrolling
          window.scrollTo(0, 0.1)
          requestAnimationFrame(() => {
            window.scrollTo(0, 0)
          })
        }
      }
    }

    // Try multiple times
    activateScroll()
    const timeout1 = setTimeout(activateScroll, 50)
    const timeout2 = setTimeout(activateScroll, 200)
    const timeout3 = setTimeout(activateScroll, 500)

    window.addEventListener('load', activateScroll, { once: true })

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      window.removeEventListener('load', activateScroll)
    }
  }, [])

  return null
}

