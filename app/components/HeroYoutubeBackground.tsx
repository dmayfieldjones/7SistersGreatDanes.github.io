'use client'

import { useEffect, useRef, useState } from 'react'

export function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
}

function controlYoutubeIframe(iframe: HTMLIFrameElement, func: string, args: string | number = '') {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args }),
    '*'
  )
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

export default function HeroYoutubeBackground({
  embedSrc,
  title,
  shouldLoad = true,
  onPlaying,
}: {
  embedSrc: string
  title: string
  shouldLoad?: boolean
  onPlaying?: () => void
}) {
  const [src, setSrc] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const onPlayingRef = useRef(onPlaying)
  const playerReadyRef = useRef(false)
  const playingNotifiedRef = useRef(false)

  onPlayingRef.current = onPlaying

  useEffect(() => {
    if (!shouldLoad) return
    const id = window.setTimeout(() => setSrc(buildEmbedSrc(embedSrc)), isMobileDevice() ? 0 : 120)
    return () => window.clearTimeout(id)
  }, [embedSrc, shouldLoad])

  useEffect(() => {
    if (!shouldLoad) {
      setSrc(null)
      playerReadyRef.current = false
      playingNotifiedRef.current = false
    }
  }, [shouldLoad])

  useEffect(() => {
    if (!src) return

    const notifyPlaying = () => {
      if (playingNotifiedRef.current) return
      playingNotifiedRef.current = true
      onPlayingRef.current?.()
    }

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://www.youtube.com' &&
        event.origin !== 'https://www.youtube-nocookie.com'
      ) {
        return
      }

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data.event === 'onReady') {
          playerReadyRef.current = true
          const iframe = iframeRef.current
          if (iframe) schedulePlayBurst(iframe, isMobileDevice())
        }
        if (data.event === 'onStateChange' && data.info === 1) {
          notifyPlaying()
        }
      } catch {
        /* ignore non-JSON postMessages */
      }
    }

    window.addEventListener('message', onMessage)

    let cleanupBurst: (() => void) | undefined

    const bindIframe = () => {
      const iframe = iframeRef.current
      if (!iframe) return false

      const onLoad = () => {
        window.setTimeout(() => {
          if (iframeRef.current) schedulePlayBurst(iframeRef.current, isMobileDevice())
        }, 100)
      }

      iframe.addEventListener('load', onLoad)

      const onInteraction = () => {
        if (iframeRef.current) tryPlay(iframeRef.current)
      }

      document.addEventListener('touchstart', onInteraction, { passive: true })
      document.addEventListener('scroll', onInteraction, { passive: true })

      const stopInteraction = window.setTimeout(() => {
        document.removeEventListener('touchstart', onInteraction)
        document.removeEventListener('scroll', onInteraction)
      }, 15000)

      return () => {
        iframe.removeEventListener('load', onLoad)
        document.removeEventListener('touchstart', onInteraction)
        document.removeEventListener('scroll', onInteraction)
        window.clearTimeout(stopInteraction)
      }
    }

    let cleanupIframe: (() => void) | undefined
    const bound = bindIframe()
    if (bound) {
      cleanupIframe = bound
    } else {
      const raf = window.requestAnimationFrame(() => {
        const retry = bindIframe()
        if (retry) cleanupIframe = retry
      })
      cleanupIframe = () => window.cancelAnimationFrame(raf)
    }

    const readyFallback = window.setTimeout(() => {
      const iframe = iframeRef.current
      if (iframe) cleanupBurst = schedulePlayBurst(iframe, isMobileDevice())
    }, 800)

    const playingFallback = window.setTimeout(notifyPlaying, isMobileDevice() ? 5000 : 3500)

    return () => {
      window.removeEventListener('message', onMessage)
      cleanupIframe?.()
      cleanupBurst?.()
      window.clearTimeout(readyFallback)
      window.clearTimeout(playingFallback)
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
}
