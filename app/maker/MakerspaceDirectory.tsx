'use client'

import { useState, useMemo } from 'react'
import makerspaceData from './makerspace-data.json'

interface Makerspace {
  id: string
  name: string
  category: string
  type: string
  address: string
  description: string
  facilities?: string[]
  services?: string[]
  target_audience: string
  access_model: string
  mission?: string
  website?: string
  hours?: string
  specialties: string[]
  contact?: {
    phone?: string
    email?: string
    email2?: string
    supervisor?: string
    staff?: Array<{
      name: string
      title: string
      email?: string
      phone?: string
    }>
  }
  [key: string]: any
}

export default function MakerspaceDirectory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  // Combine all resource types
  const allResources: Makerspace[] = [
    ...makerspaceData.makerspaces,
    ...makerspaceData.student_organizations,
    ...makerspaceData.library_makerspaces,
    ...makerspaceData.machine_shops,
    ...makerspaceData.campus_machine_shops,
    ...(makerspaceData.regional_makerspaces || [])
  ]

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(allResources.map(resource => resource.category))]
    return cats
  }, [allResources])

  // Filter resources based on search and category
  const filteredResources = useMemo(() => {
    return allResources.filter(resource => {
      const matchesSearch = 
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (resource.facilities && resource.facilities.some(facility => 
          facility.toLowerCase().includes(searchTerm.toLowerCase())
        ))

      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [allResources, searchTerm, selectedCategory])

  const toggleExpanded = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  const formatContact = (contact: any) => {
    if (!contact) return null
    
    const contactItems = []
    if (contact.phone) contactItems.push(`📞 ${contact.phone}`)
    if (contact.email) contactItems.push(`✉️ ${contact.email}`)
    if (contact.email2) contactItems.push(`✉️ ${contact.email2}`)
    if (contact.supervisor) contactItems.push(`👤 ${contact.supervisor}`)
    
    return contactItems.length > 0 ? contactItems.join(' • ') : null
  }

  return (
    <div className="makerspace-directory">
      {/* Search and Filter Controls */}
      <div className="directory-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search makerspaces, facilities, or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredResources.length} of {allResources.length} resources
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Resource Cards */}
      <div className="resource-grid">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="resource-header">
              <h3 className="resource-name">{resource.name}</h3>
              <div className="resource-badges">
                <span className="category-badge">{resource.category}</span>
                <span className="type-badge">{resource.type}</span>
              </div>
            </div>

            <div className="resource-content">
              <p className="resource-description">{resource.description}</p>
              
              <div className="resource-details">
                <div className="detail-item">
                  <strong>📍 Address:</strong> {resource.address}
                </div>
                
                <div className="detail-item">
                  <strong>🎯 Target Audience:</strong> {resource.target_audience}
                </div>
                
                <div className="detail-item">
                  <strong>🔓 Access:</strong> {resource.access_model}
                </div>

                {resource.hours && (
                  <div className="detail-item">
                    <strong>🕒 Hours:</strong> {resource.hours}
                  </div>
                )}

                {resource.contact && formatContact(resource.contact) && (
                  <div className="detail-item">
                    <strong>📞 Contact:</strong> {formatContact(resource.contact)}
                  </div>
                )}
              </div>

              {/* Expandable Details */}
              <button
                className="expand-button"
                onClick={() => toggleExpanded(resource.id)}
              >
                {expandedCard === resource.id ? 'Show Less' : 'Show More'}
              </button>

              {expandedCard === resource.id && (
                <div className="expanded-details">
                  {resource.mission && (
                    <div className="mission-section">
                      <h4>Mission</h4>
                      <p>{resource.mission}</p>
                    </div>
                  )}

                  {resource.facilities && resource.facilities.length > 0 && (
                    <div className="facilities-section">
                      <h4>Facilities & Equipment</h4>
                      <ul className="facilities-list">
                        {resource.facilities.map((facility, index) => (
                          <li key={index}>{facility}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resource.services && resource.services.length > 0 && (
                    <div className="services-section">
                      <h4>Services</h4>
                      <ul className="services-list">
                        {resource.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="specialties-section">
                    <h4>Specialties</h4>
                    <div className="specialties-tags">
                      {resource.specialties.map((specialty, index) => (
                        <span key={index} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {resource.website && (
                    <div className="website-section">
                      <a 
                        href={resource.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        🌐 Visit Website
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="no-results">
          <p>No resources found matching your search criteria.</p>
          <p>Try adjusting your search terms or selecting a different category.</p>
        </div>
      )}
    </div>
  )
}
