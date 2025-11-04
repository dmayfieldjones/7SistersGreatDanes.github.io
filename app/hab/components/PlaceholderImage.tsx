'use client'

import React from 'react'

interface PlaceholderImageProps {
  width: number
  height: number
  text: string
  backgroundColor?: string
  textColor?: string
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width,
  height,
  text,
  backgroundColor = '#bf141c',
  textColor = 'white'
}) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`
      }}
    >
      {text}
    </div>
  )
}

export default PlaceholderImage
