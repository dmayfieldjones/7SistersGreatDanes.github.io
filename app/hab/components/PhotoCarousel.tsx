'use client'

import React, { useState, useEffect } from 'react'
import PlaceholderImage from './PlaceholderImage'

interface CarouselImage {
  src: string
  alt: string
  caption?: string
}

interface PhotoCarouselProps {
  images: CarouselImage[]
  autoPlay?: boolean
  interval?: number
}

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallbackText: string
  className?: string
  loading?: 'eager' | 'lazy'
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackText,
  className,
  loading
}) => {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className={className} style={{ width: '100%', height: '100%' }}>
        <PlaceholderImage
          width={800}
          height={500}
          text={fallbackText}
          backgroundColor="#bf141c"
          textColor="white"
        />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setImageError(true)}
    />
  )
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ 
  images, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  if (!images || images.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-placeholder">
          <p>No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="carousel-slides">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitioning ? 'transform 0.3s ease-in-out' : 'none'
              }}
            >
              <ImageWithFallback
                src={image.src}
                alt={image.alt}
                fallbackText={image.alt}
                className="carousel-image"
                loading={index === currentIndex ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
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
        {images.length > 1 && (
          <div className="carousel-dots">
            {images.map((_, index) => (
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
      
      {/* Caption Carousel */}
      {images.some(img => img.caption) && (
        <div className="caption-carousel">
          <div className="caption-slides">
            {images.map((image, index) => (
              <div
                key={index}
                className={`caption-slide ${index === currentIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: isTransitioning ? 'transform 0.3s ease-in-out' : 'none'
                }}
              >
                {image.caption && (
                  <p className="caption-text">{image.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoCarousel
