'use client'

import { useState } from 'react'

interface FlightPoint {
  lat: number
  lng: number
  altitude: number
  timestamp: string
}

export default function FlightTrajectoryMap() {
  const [flightData, setFlightData] = useState<FlightPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Sample flight trajectory data
  const sampleTrajectory: FlightPoint[] = [
    { lat: 40.1164, lng: -88.2434, altitude: 0, timestamp: '2024-01-01T00:00:00Z' },
    { lat: 40.1200, lng: -88.2400, altitude: 1000, timestamp: '2024-01-01T00:05:00Z' },
    { lat: 40.1250, lng: -88.2350, altitude: 2000, timestamp: '2024-01-01T00:10:00Z' },
    { lat: 40.1300, lng: -88.2300, altitude: 3000, timestamp: '2024-01-01T00:15:00Z' },
    { lat: 40.1350, lng: -88.2250, altitude: 4000, timestamp: '2024-01-01T00:20:00Z' },
    { lat: 40.1400, lng: -88.2200, altitude: 5000, timestamp: '2024-01-01T00:25:00Z' },
    { lat: 40.1450, lng: -88.2150, altitude: 6000, timestamp: '2024-01-01T00:30:00Z' },
    { lat: 40.1500, lng: -88.2100, altitude: 7000, timestamp: '2024-01-01T00:35:00Z' },
    { lat: 40.1550, lng: -88.2050, altitude: 8000, timestamp: '2024-01-01T00:40:00Z' },
    { lat: 40.1600, lng: -88.2000, altitude: 9000, timestamp: '2024-01-01T00:45:00Z' },
    { lat: 40.1650, lng: -88.1950, altitude: 10000, timestamp: '2024-01-01T00:50:00Z' },
    { lat: 40.1700, lng: -88.1900, altitude: 9500, timestamp: '2024-01-01T00:55:00Z' },
    { lat: 40.1750, lng: -88.1850, altitude: 8000, timestamp: '2024-01-01T01:00:00Z' },
    { lat: 40.1800, lng: -88.1800, altitude: 6000, timestamp: '2024-01-01T01:05:00Z' },
    { lat: 40.1850, lng: -88.1750, altitude: 4000, timestamp: '2024-01-01T01:10:00Z' },
    { lat: 40.1900, lng: -88.1700, altitude: 2000, timestamp: '2024-01-01T01:15:00Z' },
    { lat: 40.1950, lng: -88.1650, altitude: 0, timestamp: '2024-01-01T01:20:00Z' },
  ]

  const loadSampleData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setFlightData(sampleTrajectory)
      setIsLoading(false)
    }, 1000)
  }

  const calculateDistance = (point1: FlightPoint, point2: FlightPoint) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const calculateTotalDistance = () => {
    if (flightData.length < 2) return 0
    let total = 0
    for (let i = 1; i < flightData.length; i++) {
      total += calculateDistance(flightData[i-1], flightData[i])
    }
    return total
  }

  const getMaxAltitude = () => {
    return Math.max(...flightData.map(point => point.altitude))
  }

  return (
    <div className="flight-trajectory">
      <h3>Flight Trajectory Visualization</h3>
      <p>Track balloon flight paths, altitude profiles, and landing predictions.</p>
      
      <div className="controls">
        <button 
          onClick={loadSampleData}
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Loading...' : 'Load Sample Flight Data'}
        </button>
      </div>

      {flightData.length > 0 && (
        <div className="trajectory-content">
          <div className="flight-stats">
            <h4>Flight Statistics</h4>
            <div className="stats-grid">
              <div className="stat-card">
                <h5>Max Altitude</h5>
                <p>{getMaxAltitude().toLocaleString()} ft</p>
              </div>
              <div className="stat-card">
                <h5>Total Distance</h5>
                <p>{calculateTotalDistance().toFixed(2)} km</p>
              </div>
              <div className="stat-card">
                <h5>Flight Duration</h5>
                <p>{flightData.length * 5} minutes</p>
              </div>
              <div className="stat-card">
                <h5>Data Points</h5>
                <p>{flightData.length}</p>
              </div>
            </div>
          </div>

          <div className="trajectory-map">
            <h4>Flight Path</h4>
            <div className="map-container">
              <div className="map-placeholder">
                <p>🗺️ Interactive Map Placeholder</p>
                <p>This would integrate with Google Maps or OpenStreetMap to show the actual flight trajectory</p>
                <div className="flight-path-preview">
                  {flightData.map((point, index) => (
                    <div 
                      key={index}
                      className="flight-point"
                      style={{
                        left: `${(index / (flightData.length - 1)) * 100}%`,
                        bottom: `${(point.altitude / getMaxAltitude()) * 100}%`
                      }}
                      title={`Alt: ${point.altitude}ft, Time: ${point.timestamp}`}
                    >
                      <div className="point-marker"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="altitude-profile">
            <h4>Altitude Profile</h4>
            <div className="altitude-chart">
              {flightData.map((point, index) => (
                <div 
                  key={index}
                  className="altitude-bar"
                  style={{
                    height: `${(point.altitude / getMaxAltitude()) * 200}px`,
                    width: `${100 / flightData.length}%`
                  }}
                  title={`${point.altitude} ft`}
                >
                  <div className="altitude-label">{point.altitude}</div>
                </div>
              ))}
            </div>
            <div className="altitude-axis">
              <span>0 ft</span>
              <span>{getMaxAltitude().toLocaleString()} ft</span>
            </div>
          </div>

          <div className="landing-prediction">
            <h4>Landing Prediction</h4>
            <div className="prediction-info">
              <p><strong>Predicted Landing Location:</strong> {flightData[flightData.length - 1]?.lat.toFixed(4)}°N, {flightData[flightData.length - 1]?.lng.toFixed(4)}°W</p>
              <p><strong>Estimated Landing Time:</strong> {flightData[flightData.length - 1]?.timestamp}</p>
              <p><strong>Distance from Launch:</strong> {calculateTotalDistance().toFixed(2)} km</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
