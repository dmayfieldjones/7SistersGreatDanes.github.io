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
      aria-label="Scroll down for more about 7Sisters"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleScroll()
        }
      }}
    >
      <div className="scroll-arrow"></div>
      <span className="scroll-text">More below</span>
    </div>
  )
}

