'use client'

import { useEffect, useRef, useState } from 'react'

function playYoutubeIframe(iframe: HTMLIFrameElement) {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
    '*'
  )
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

export default function HeroYoutubeBackground({
  embedSrc,
  title,
  revealed = false,
  onPlaying,
}: {
  embedSrc: string
  title: string
  revealed?: boolean
  onPlaying?: () => void
}) {
  const [src, setSrc] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const onPlayingRef = useRef(onPlaying)

  onPlayingRef.current = onPlaying

  useEffect(() => {
    const id = window.setTimeout(() => setSrc(buildEmbedSrc(embedSrc)), 120)
    return () => window.clearTimeout(id)
  }, [embedSrc])

  useEffect(() => {
    if (!src) return

    const iframe = iframeRef.current
    if (!iframe) return

    const tryPlay = () => {
      if (iframeRef.current) playYoutubeIframe(iframeRef.current)
    }

    const onLoad = () => {
      tryPlay()
      window.setTimeout(tryPlay, 300)
      window.setTimeout(tryPlay, 1200)
    }

    iframe.addEventListener('load', onLoad)

    const onInteraction = () => tryPlay()
    document.addEventListener('touchstart', onInteraction, { once: true, passive: true })
    document.addEventListener('scroll', onInteraction, { once: true, passive: true })

    return () => {
      iframe.removeEventListener('load', onLoad)
      document.removeEventListener('touchstart', onInteraction)
      document.removeEventListener('scroll', onInteraction)
    }
  }, [src])

  useEffect(() => {
    if (!src) return

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://www.youtube.com' &&
        event.origin !== 'https://www.youtube-nocookie.com'
      ) {
        return
      }

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data.event === 'onStateChange' && data.info === 1) {
          onPlayingRef.current?.()
        }
      } catch {
        /* ignore non-JSON postMessages */
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [src])

  if (!src) {
    return <div className="video-iframe video-iframe-placeholder" aria-hidden />
  }

  return (
    <iframe
      ref={iframeRef}
      src={src}
      className={`video-iframe${revealed ? ' video-iframe--revealed' : ''}`}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      title={title}
    />
  )
}
