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

const HeroYoutubeBackground = forwardRef<
  HeroYoutubeBackgroundHandle,
  { embedSrc: string; title: string; onPlaying?: () => void }
>(function HeroYoutubeBackground({ embedSrc, title, onPlaying }, ref) {
  const [src, setSrc] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const onPlayingRef = useRef(onPlaying)
  const playingRef = useRef(false)
  const mobile = useRef(isMobileDevice())

  onPlayingRef.current = onPlaying

  useImperativeHandle(ref, () => ({
    play: () => {
      if (iframeRef.current) tryPlay(iframeRef.current)
    },
  }))

  useEffect(() => {
    setSrc(buildEmbedSrc(embedSrc))
  }, [embedSrc])

  useEffect(() => {
    if (!src) return

    const markPlaying = () => {
      if (playingRef.current) return
      playingRef.current = true
      onPlayingRef.current?.()
    }

    const play = () => {
      if (iframeRef.current) tryPlay(iframeRef.current)
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
        if (data.event === 'onReady') play()
        if (data.event === 'onStateChange' && data.info === 1) markPlaying()
      } catch {
        /* ignore */
      }
    }

    window.addEventListener('message', onMessage)

    const iframe = iframeRef.current
    const onLoad = () => {
      play()
      window.setTimeout(play, 250)
      window.setTimeout(play, 800)
    }
    iframe?.addEventListener('load', onLoad)

    const onGesture = () => play()
    document.addEventListener('touchstart', onGesture, { passive: true })
    document.addEventListener('click', onGesture)

    const stopGestures = mobile.current
      ? undefined
      : window.setTimeout(() => {
          document.removeEventListener('touchstart', onGesture)
          document.removeEventListener('click', onGesture)
        }, 12000)

    return () => {
      window.removeEventListener('message', onMessage)
      iframe?.removeEventListener('load', onLoad)
      document.removeEventListener('touchstart', onGesture)
      document.removeEventListener('click', onGesture)
      if (stopGestures) window.clearTimeout(stopGestures)
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
