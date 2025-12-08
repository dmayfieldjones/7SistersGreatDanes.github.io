'use client'

export default function ScrollIndicator() {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <div
      className="scroll-indicator"
      onClick={handleScroll}
      role="button"
      aria-label="Scroll down to see more"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleScroll()
        }
      }}
    >
      <div className="scroll-arrow"></div>
    </div>
  )
}

