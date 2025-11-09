'use client'

import React, { useState, useEffect, useRef } from 'react'

interface WinPhoto {
  src: string
  alt: string
  caption: string
}

interface WinPhotosCarouselProps {
  photos: WinPhoto[]
  autoPlay?: boolean
  interval?: number
}

export default function WinPhotosCarousel({
  photos,
  autoPlay = true,
  interval = 5000,
}: WinPhotosCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Preload all images when component mounts
  useEffect(() => {
    photos.forEach((photo) => {
      const img = new Image()
      img.src = photo.src
    })
  }, [photos])

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Start timer if auto-play is enabled
    if (autoPlay && photos.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
      }, interval)
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [autoPlay, interval, photos.length])

  const resetTimer = () => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Restart timer if auto-play is enabled
    if (autoPlay && photos.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
      }, interval)
    }
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    resetTimer() // Reset timer when user manually navigates
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    )
    resetTimer() // Reset timer when user manually navigates
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
    resetTimer() // Reset timer when user manually navigates
    setTimeout(() => setIsTransitioning(false), 300)
  }

  if (!photos || photos.length === 0) {
    return null
  }

  return (
    <div className="win-photos-carousel">
      <div className="carousel-image-container">
        <div className="carousel-wrapper">
          <div className="carousel-slides">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: isTransitioning
                    ? 'transform 0.5s ease-in-out'
                    : 'none',
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="carousel-image"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : index === 1 ? 'high' : 'auto'}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                className="carousel-arrow carousel-arrow-left"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button
                className="carousel-arrow carousel-arrow-right"
                onClick={goToNext}
                aria-label="Next image"
              >
                &#8250;
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {photos.length > 1 && (
            <div className="carousel-dots">
              {photos.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      {photos[currentIndex]?.caption && (
        <div className="carousel-caption">
          <p>{photos[currentIndex].caption}</p>
        </div>
      )}
    </div>
  )
}

