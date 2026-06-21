'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

export function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
}

export type HeroYoutubeBackgroundHandle = {
  /** Set iframe src inside a user-gesture handler (required for iOS autoplay). */
  load: () => void
  play: () => void
}

function controlYoutubeIframe(iframe: HTMLIFrameElement, func: string, args: string | number = '') {
  iframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
}

function tryPlay(iframe: HTMLIFrameElement) {
  controlYoutubeIframe(iframe, 'mute')
  controlYoutubeIframe(iframe, 'playVideo')
}

export function buildEmbedSrc(embedSrc: string) {
  const url = new URL(embedSrc)
  url.searchParams.set('autoplay', '1')
  url.searchParams.set('mute', '1')
  url.searchParams.set('playsinline', '1')
  url.searchParams.set('enablejsapi', '1')
  url.searchParams.set('origin', window.location.origin)
  return url.toString()
}

function schedulePlayBurst(iframe: HTMLIFrameElement, mobile: boolean) {
  const play = () => tryPlay(iframe)
  play()

  const delays = mobile
    ? [150, 350, 700, 1200, 2000, 3500]
    : [100, 400, 1000]

  const timers = delays.map((delay) => window.setTimeout(play, delay))
  const interval = window.setInterval(play, mobile ? 2500 : 5000)
  const stop = window.setTimeout(() => window.clearInterval(interval), mobile ? 12000 : 8000)

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer))
    window.clearInterval(interval)
    window.clearTimeout(stop)
  }
}

const HeroYoutubeBackground = forwardRef<
  HeroYoutubeBackgroundHandle,
  { embedSrc: string; title: string; deferLoad?: boolean }
>(function HeroYoutubeBackground({ embedSrc, title, deferLoad = false }, ref) {
  const [src, setSrc] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const mobileRef = useRef(false)
  const loadedRef = useRef(false)

  useImperativeHandle(ref, () => ({
    load: () => {
      if (loadedRef.current) return
      loadedRef.current = true
      const url = buildEmbedSrc(embedSrc)
      if (iframeRef.current) {
        iframeRef.current.src = url
      }
      setSrc(url)
    },
    play: () => {
      if (iframeRef.current) tryPlay(iframeRef.current)
    },
  }))

  useEffect(() => {
    mobileRef.current = isMobileDevice()
    if (deferLoad) return
    const delay = mobileRef.current ? 0 : 120
    const id = window.setTimeout(() => {
      loadedRef.current = true
      setSrc(buildEmbedSrc(embedSrc))
    }, delay)
    return () => window.clearTimeout(id)
  }, [embedSrc, deferLoad])

  useEffect(() => {
    if (!src) return

    let cleanupBurst: (() => void) | undefined

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://www.youtube.com' &&
        event.origin !== 'https://www.youtube-nocookie.com'
      ) {
        return
      }

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data.event === 'onReady' && iframeRef.current) {
          cleanupBurst?.()
          cleanupBurst = schedulePlayBurst(iframeRef.current, mobileRef.current)
        }
      } catch {
        /* ignore non-JSON postMessages */
      }
    }

    window.addEventListener('message', onMessage)

    const iframe = iframeRef.current
    const onLoad = () => {
      window.setTimeout(() => {
        if (iframeRef.current) {
          cleanupBurst?.()
          cleanupBurst = schedulePlayBurst(iframeRef.current, mobileRef.current)
        }
      }, 100)
    }
    iframe?.addEventListener('load', onLoad)

    const readyFallback = window.setTimeout(() => {
      if (iframeRef.current) {
        cleanupBurst?.()
        cleanupBurst = schedulePlayBurst(iframeRef.current, mobileRef.current)
      }
    }, 800)

    return () => {
      window.removeEventListener('message', onMessage)
      iframe?.removeEventListener('load', onLoad)
      cleanupBurst?.()
      window.clearTimeout(readyFallback)
    }
  }, [src])

  if (deferLoad && !src) {
    return (
      <iframe
        ref={iframeRef}
        className="video-iframe"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        title={title}
      />
    )
  }

  if (!src) {
    return <div className="video-iframe video-iframe-placeholder" aria-hidden />
  }

  return (
    <iframe
      ref={iframeRef}
      src={src}
      className="video-iframe"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      title={title}
    />
  )
})

export default HeroYoutubeBackground
