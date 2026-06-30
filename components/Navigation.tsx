'use client'

import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSubmenu = (submenuName: string) => {
    setOpenSubmenu(openSubmenu === submenuName ? null : submenuName)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button
          type="button"
          className="hamburger-icon"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span
            className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}
            aria-hidden="true"
          />
          <span
            className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}
            aria-hidden="true"
          />
          <span
            className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}
            aria-hidden="true"
          />
        </button>
        <a href="/" className="navbar-logo" aria-label="7Sisters Farm home">
          <span className="navbar-logo-flip">
            <span className="navbar-logo-face navbar-logo-front">
              <img
                src="/img/Colorlogo_nobackground.png"
                alt=""
                className="navbar-logo-img"
                width={160}
                height={48}
              />
            </span>
            <span className="navbar-logo-face navbar-logo-back" aria-hidden="true">
              Home
            </span>
          </span>
        </a>
      </div>
      <ul className={`navbar-menu ${isMenuOpen ? 'show' : ''}`}>
        <li className="nav-item-with-submenu">
          <button
            className={`nav-button ${openSubmenu === 'about' ? 'expanded' : ''}`}
            onClick={() => toggleSubmenu('about')}
          >
            About
          </button>
          <ul className={`submenu ${openSubmenu === 'about' ? 'show' : ''}`}>
            <li><a href="/about">About Us</a></li>
            <li><a href="/Farm">Our Farm</a></li>
          </ul>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
        <li className="nav-item-with-submenu">
          <button
            className={`nav-button ${openSubmenu === 'great-danes' ? 'expanded' : ''}`}
            onClick={() => toggleSubmenu('great-danes')}
          >
            Great Danes
          </button>
          <ul className={`submenu ${openSubmenu === 'great-danes' ? 'show' : ''}`}>
            <li><a href="/7Sisters">Our Great Danes</a></li>
            <li><a href="/Litters">Puppies & Litters</a></li>
            <li><a href="/PlacementProcess">Placement Process</a></li>
            <li><a href="/BreedingPhilosophy">Breeding Philosophy</a></li>
          </ul>
        </li>
        <li className="nav-item-with-submenu">
          <button
            className={`nav-button ${openSubmenu === 'resources' ? 'expanded' : ''}`}
            onClick={() => toggleSubmenu('resources')}
          >
            Resources
          </button>
          <ul className={`submenu ${openSubmenu === 'resources' ? 'show' : ''}`}>
            <li><a href="/archive">7Sisters Articles</a></li>
            <li><a href="/CommonQuestions">Common Questions</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}
