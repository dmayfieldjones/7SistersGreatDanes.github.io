'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

export function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
}

export type HeroYoutubeBackgroundHandle = {
  play: () => void
}

function controlYoutubeIframe(iframe: HTMLIFrameElement, func: string, args: string | number = '') {
  iframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
}

function tryPlay(iframe: HTMLIFrameElement) {
  controlYoutubeIframe(iframe, 'mute')
  controlYoutubeIframe(iframe, 'playVideo')
}

function buildEmbedSrc(embedSrc: string) {
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
  { embedSrc: string; title: string }
>(function HeroYoutubeBackground({ embedSrc, title }, ref) {
  const [src, setSrc] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const mobileRef = useRef(false)

  useImperativeHandle(ref, () => ({
    play: () => {
      if (iframeRef.current) tryPlay(iframeRef.current)
    },
  }))

  useEffect(() => {
    mobileRef.current = isMobileDevice()
    const delay = mobileRef.current ? 0 : 120
    const id = window.setTimeout(() => setSrc(buildEmbedSrc(embedSrc)), delay)
    return () => window.clearTimeout(id)
  }, [embedSrc])

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

    const onInteraction = () => {
      if (iframeRef.current) tryPlay(iframeRef.current)
    }

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

    document.addEventListener('touchstart', onInteraction, { passive: true })
    document.addEventListener('scroll', onInteraction, { passive: true })
    document.addEventListener('click', onInteraction)
    document.addEventListener('visibilitychange', onInteraction)
    window.addEventListener('pageshow', onInteraction)

    const readyFallback = window.setTimeout(() => {
      if (iframeRef.current) {
        cleanupBurst?.()
        cleanupBurst = schedulePlayBurst(iframeRef.current, mobileRef.current)
      }
    }, 800)

    return () => {
      window.removeEventListener('message', onMessage)
      iframe?.removeEventListener('load', onLoad)
      document.removeEventListener('touchstart', onInteraction)
      document.removeEventListener('scroll', onInteraction)
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('visibilitychange', onInteraction)
      window.removeEventListener('pageshow', onInteraction)
      cleanupBurst?.()
      window.clearTimeout(readyFallback)
    }
  }, [src])

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
