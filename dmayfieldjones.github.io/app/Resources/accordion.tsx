'use client'
import { useState } from 'react'

export function Accordion() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="accordion-wrapper">
      <button
        className={`accordion ${isOpen ? 'active' : ''}`}
        aria-expanded={isOpen}
        aria-controls="image-source-panel"
        onClick={toggleAccordion}
      >
        <span className="accent-color">Image Source</span>
      </button>
      <div
        className={`panel ${isOpen ? 'panel-open' : ''}`}
        id="image-source-panel"
      >
        <p className="citation">
          Maeda J, Yurkon CR, Fujisawa H, Kaneko M, Genet SC, Roybal EJ, et al.
          (2012) Genomic Instability and Telomere Fusion of Canine Osteosarcoma
          Cells. PLoS ONE 7(8): e43355.
        </p>
      </div>
    </div>
  )
}
