'use client'

import { useState, useEffect } from 'react'

// March 22 at noon - use local date (month is 0-indexed: 2 = March). Update year as needed.
const EXPECTED_DATE = new Date(2026, 2, 22, 12, 0, 0)

function getCountdown(targetDate: Date) {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false,
  }
}

export default function () {
  const [countdown, setCountdown] = useState(() => getCountdown(EXPECTED_DATE))

  useEffect(() => {
    const t = setInterval(() => setCountdown(getCountdown(EXPECTED_DATE)), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="content">
      <div className="post-title">
        <h1>
          Ezra x Piper Litter at <span style={{ color: '#bf141c' }}>7</span>Sisters Farm
        </h1>
      </div>
      <main className="content-wrapper">
        <section className="hero-section">
          <img src="/img/Colorlogo_nobackground.png" alt="7Sisters Farm Logo" width={300} height="auto" className="hero-logo" loading="lazy" />
        </section>
        <section className="litter-info-section">
          <div className="litter-details">
            <h2 className="section-title">Litter Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Expected Arrival:</span>
                <span className="value">March 22nd</span>
              </div>
              <div className="info-item">
                <span className="label">Countdown to expected arrival:</span>
                <div className="countdown-display">
                  {countdown.isPast ? (
                    <p className="countdown-message">The puppies have arrived! Check back soon for updates.</p>
                  ) : (
                    <div className="countdown-grid">
                      <div className="countdown-block">
                        <span className="countdown-number">{fmt(countdown.days)}</span>
                        <span className="countdown-label">Days</span>
                      </div>
                      <div className="countdown-block">
                        <span className="countdown-number">{fmt(countdown.hours)}</span>
                        <span className="countdown-label">Hours</span>
                      </div>
                      <div className="countdown-block">
                        <span className="countdown-number">{fmt(countdown.minutes)}</span>
                        <span className="countdown-label">Minutes</span>
                      </div>
                      <div className="countdown-block">
                        <span className="countdown-number">{fmt(countdown.seconds)}</span>
                        <span className="countdown-label">Seconds</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="parents-info">
            <div className="parent-card">
              <h3 className="parent-title">Sire</h3>
              <p className="parent-name">BISS GCH Sonya Danes N Krisda Our Peace And Harmony Fontana <span className="call-name">&quot;Ezra&quot;</span></p>
              <p className="registration">
                <a href="https://ofa.org/advanced-search/?regnum=WS81479201" target="_blank" rel="noopener noreferrer" className="ofa-link">WS81479201 OFA Results</a>
              </p>
              <p className="registration">
                <a href="/img/EzraPrelimOFA.png" target="_blank" rel="noopener noreferrer" className="ofa-link">Additional Test Results</a>
              </p>
            </div>
            <div className="parent-card">
              <h3 className="parent-title">Dam</h3>
              <p className="parent-name">CH Legado N Danekraaft&apos;s How Can I Tell You? <span className="call-name">&quot;Piper&quot;</span></p>
              <p className="registration">
                <a href="https://ofa.org/advanced-search/?regnum=WS69691106" target="_blank" rel="noopener noreferrer" className="ofa-link">WS69691106 OFA Results</a>
              </p>
            </div>
          </div>
        </section>
        <section className="offspring-section">
          <h2 className="section-title">Offspring</h2>
          <p className="coming-soon-message">
            Puppies expected March 22nd. Check back after the litter arrives for individual puppy information, or <a href="/contact" className="cta-link">contact us</a> to express your interest.
          </p>
        </section>
        <section className="advertisement-section">
          <a href="/EzraxPiper" className="ad-link" aria-label="View full Ezra X Piper litter details">
            <img src="/img/EzraxPiper.jpg" alt="Ezra X Piper litter advertisement" className="ad-image" loading="lazy" />
          </a>
        </section>
      </main>
      <style dangerouslySetInnerHTML={{ __html: ' :root { --primary-color: #bf141c; --text-color: #000000; --background-color: #ffffff; --card-bg-color: #f8f8f8; --border-color: #e0e0e0; --spacing-unit: 1rem; --font-family: Arial, sans-serif; --transition-speed: 0.3s; } .content-wrapper { max-width: 800px; margin: 0 auto; padding: calc(var(--spacing-unit) * 2); font-family: var(--font-family); line-height: 1.6; color: var(--text-color); background-color: var(--background-color); } .hero-section { text-align: center; margin-bottom: calc(var(--spacing-unit) * 3); } .hero-logo { max-width: 100%; height: auto; } .section-title { font-size: 1.75rem; color: var(--primary-color); margin-bottom: calc(var(--spacing-unit) * 1.5); } .info-grid { display: grid; gap: var(--spacing-unit); margin-bottom: calc(var(--spacing-unit) * 2); } .info-item { display: flex; flex-direction: column; gap: calc(var(--spacing-unit) * 0.5); } .label { font-weight: bold; color: #666; } .countdown-display { margin: calc(var(--spacing-unit) * 1) 0; } .countdown-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-unit); max-width: 400px; } .countdown-block { background: var(--primary-color); color: white; padding: calc(var(--spacing-unit) * 1.5); border-radius: 8px; text-align: center; } .countdown-number { display: block; font-size: 1.75rem; font-weight: bold; } .countdown-label { font-size: 0.85rem; opacity: 0.9; } .countdown-message { font-size: 1.1rem; color: var(--primary-color); font-weight: bold; } .parents-info { display: grid; gap: calc(var(--spacing-unit) * 2); margin-bottom: calc(var(--spacing-unit) * 3); } .parent-card { background-color: var(--card-bg-color); padding: calc(var(--spacing-unit) * 1.5); border-radius: 8px; } .parent-title { color: var(--primary-color); margin-bottom: var(--spacing-unit); } .parent-name { font-size: 1.1rem; margin-bottom: calc(var(--spacing-unit) * 0.5); } .registration { color: #666; font-family: monospace; } .coming-soon-message { background-color: var(--card-bg-color); padding: calc(var(--spacing-unit) * 1.5); border-radius: 8px; font-size: 1.1rem; } .cta-link { color: var(--primary-color); font-weight: bold; text-decoration: none; } .cta-link:hover { text-decoration: underline; } .advertisement-section { margin-top: calc(var(--spacing-unit) * 3); text-align: center; } .ad-image { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: transform var(--transition-speed) ease; } .ad-link:hover .ad-image { transform: scale(1.02); } .value { font-size: 1.1rem; color: var(--text-color); } @media (min-width: 768px) { .info-grid { grid-template-columns: repeat(1, 1fr); } .parents-info { grid-template-columns: repeat(2, 1fr); } } @media (max-width: 768px) { .content-wrapper { padding: var(--spacing-unit); } .section-title { font-size: 1.5rem; } .countdown-grid { grid-template-columns: repeat(2, 1fr); } } @media print { .parent-card { background-color: transparent; border: 1px solid var(--border-color); } .ad-image { max-width: 400px; } } .ofa-link { color: inherit; text-decoration: underline; transition: color 0.2s ease; } .ofa-link:hover { color: var(--primary-color); } ' }} />
    </div>
  )
}
