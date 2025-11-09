'use client'

import { useEffect } from 'react'

interface ImagePreloaderProps {
  images: string[]
  priorityCount?: number
}

export default function ImagePreloader({
  images,
  priorityCount = 3,
}: ImagePreloaderProps) {
  useEffect(() => {
    // Preload priority images first
    const priorityImages = images.slice(0, priorityCount)
    priorityImages.forEach((src, index) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      // Set high priority for first 2 images to ensure fast loading
      if (index < 2) {
        link.setAttribute('fetchpriority', 'high')
      }
      document.head.appendChild(link)
    })

    // Prefetch remaining images
    const remainingImages = images.slice(priorityCount)
    remainingImages.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // Also preload using Image objects for better browser support
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })

    // Cleanup function
    return () => {
      // Remove preload links on unmount
      document
        .querySelectorAll('link[rel="preload"][as="image"], link[rel="prefetch"][as="image"]')
        .forEach((link) => {
          if (images.includes(link.getAttribute('href') || '')) {
            link.remove()
          }
        })
    }
  }, [images, priorityCount])

  return null
}

