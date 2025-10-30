'use client'

import React, { useEffect, useState } from 'react'
import { csvParse } from 'd3-dsv'
import D3BalloonChart from './D3BalloonChart'

interface FlightData {
  altitude: number
  temperature: number
  pressure: number
  humidity: number
  time: number
  timestamp?: number
  latitude?: number
  longitude?: number
  speed?: number
  volts?: number
  temperature_external?: number
  temperature_internal?: number
  temperature_ambient?: number
  prec_gas?: number
  oxid_gas?: number
}

function toNumber(value: any): number {
  if (value === undefined || value === null) return NaN
  if (typeof value === 'number') return value
  const s = String(value).trim()
  if (!s || s === 'NA' || s === 'NaN') return NaN
  const n = Number(s)
  return isFinite(n) ? n : NaN
}

function mapRow(row: Record<string, any>): FlightData | null {
  const altitude_ft = toNumber(row.altitude_ft)
  const altitude_m = toNumber(row.altitude_m)
  const humid = toNumber(row.humid)
  const lat = toNumber(row.lat)
  const lng = toNumber(row.lng ?? row.long)
  const speed = toNumber(row.speed)
  const volt = toNumber(row.volt)
  const t_amb = toNumber(row.t_amb)
  const t_ext = toNumber(row.t_ext)
  const t_int = toNumber(row.t_int)
  const pressure_pa = toNumber(row.pressure)
  const prec_gas = toNumber(row.prec_gas)
  const oxid_gas = toNumber(row.oxid_gas)
  const tsOffset = toNumber(row.timestamp_offset)
  const tsFixed = row.timestamp_fixed ? Date.parse(row.timestamp_fixed) : NaN

  // Require minimal fields for plotting
  const altitude = isFinite(altitude_ft) ? altitude_ft : (isFinite(altitude_m) ? altitude_m / 0.3048 : NaN)
  const pressure_hpa = isFinite(pressure_pa) ? pressure_pa / 100 : NaN
  const temperature = isFinite(t_amb) ? t_amb : (isFinite(t_ext) ? t_ext : (isFinite(t_int) ? t_int : NaN))
  const time = isFinite(tsOffset) ? tsOffset : 0

  // Very lenient validation - only require altitude
  if (!isFinite(altitude)) {
    return null
  }

  return {
    altitude,
    pressure: pressure_hpa,
    humidity: isFinite(humid) ? humid : NaN,
    temperature,
    time,
    timestamp: isFinite(tsFixed) ? tsFixed : undefined,
    latitude: isFinite(lat) ? lat : undefined,
    longitude: isFinite(lng) ? lng : undefined,
    speed: isFinite(speed) ? speed : undefined,
    volts: isFinite(volt) ? volt : undefined,
    temperature_external: isFinite(t_ext) ? t_ext : undefined,
    temperature_internal: isFinite(t_int) ? t_int : undefined,
    temperature_ambient: isFinite(t_amb) ? t_amb : undefined,
    prec_gas: isFinite(prec_gas) ? prec_gas : undefined,
    oxid_gas: isFinite(oxid_gas) ? oxid_gas : undefined,
  }
}

const FlightComparison: React.FC = () => {
  const [hab0Animate, setHab0Animate] = useState(false)
  const [loyolaAnimate, setLoyolaAnimate] = useState(false)
  const [hab0Data, setHab0Data] = useState<FlightData[] | null>(null)
  const [loyolaData, setLoyolaData] = useState<FlightData[] | null>(null)
  const [sharedXAxis, setSharedXAxis] = useState<string>('oxid_gas')
  const [sharedYAxis, setSharedYAxis] = useState<string>('altitude')

  useEffect(() => {
    let aborted = false
    async function load() {
        const tryPaths = ['/data/balloon5.csv', '/hab/data/balloon5.csv']
        let text: string | null = null
        for (const p of tryPaths) {
          try {
            console.log('Trying to fetch:', p)
            const res = await fetch(p)
            console.log('Fetch result:', res.status, res.ok)
            if (res.ok) { 
              text = await res.text()
              console.log('Text length:', text.length)
              break 
            }
          } catch (e) {
            console.log('Fetch error for', p, ':', e)
          }
        }
      if (!text || aborted) return

          const rows = csvParse(text)
          console.log('Parsed CSV rows:', rows.length)
          console.log('First few rows:', rows.slice(0, 3))
          
          // Split by category field (cat)
          const rowsHab0 = rows.filter(r => (r.cat || '').trim() === 'HAB_0')
          // Prefer HAB_3 for Loyola; fallback to HAB_2
          const rowsLoyola = rows.filter(r => (r.cat || '').trim() === 'HAB_3')
          const rowsLoyolaFallback = rows.filter(r => (r.cat || '').trim() === 'HAB_2')

          console.log('Filtered rows - HAB_0:', rowsHab0.length, 'HAB_3:', rowsLoyola.length, 'HAB_2:', rowsLoyolaFallback.length)

          const toSeries = (rs: d3.DSVRowString<string>[]) => {
            const mapped = rs.map(r => mapRow(r as any)).filter(Boolean) as FlightData[]
            console.log('Mapped series length:', mapped.length)
            if (mapped.length > 0) {
              console.log('First mapped row:', mapped[0])
            }
            return mapped
          }

          const hab0 = toSeries(rowsHab0).sort((a, b) => a.time - b.time)
          const loyolaPrimary = toSeries(rowsLoyola).sort((a, b) => a.time - b.time)
          const loyolaAlt = toSeries(rowsLoyolaFallback).sort((a, b) => a.time - b.time)

          console.log('Data loading results:', {
            totalRows: rows.length,
            hab0Rows: rowsHab0.length,
            loyolaRows: rowsLoyola.length,
            loyolaFallbackRows: rowsLoyolaFallback.length,
            hab0Parsed: hab0.length,
            loyolaParsed: loyolaPrimary.length,
            loyolaAltParsed: loyolaAlt.length,
            firstRow: rows[0],
            hab0FirstRow: rowsHab0[0],
            loyolaFirstRow: rowsLoyola[0]
          })

      setHab0Data(hab0.length ? hab0 : null)
      setLoyolaData(loyolaPrimary.length ? loyolaPrimary : (loyolaAlt.length ? loyolaAlt : null))
    }
    load()
    return () => { aborted = true }
  }, [])

      return (
        <div className="flight-comparison">
          <div className="comparison-header">
            <h2>Flight Data Comparison</h2>
            <p className="comparison-description">
              Compare data from our HAB_0 and Loyola launches. 
              Both flights were launched from the same location in Damiensville, IL, 
              about one year apart (March 2015 and April 2016).
            </p>
          </div>
          
          {/* Shared Axis Controls */}
          <div className="shared-controls">
            <h3>Select Axes for Comparison</h3>
            <div className="axis-controls">
              <div className="axis-select">
                <label htmlFor="shared-x-axis">X Axis:</label>
                <select 
                  id="shared-x-axis"
                  value={sharedXAxis} 
                  onChange={(e) => setSharedXAxis(e.target.value)}
                >
                  <option value="timestamp">Timestamp</option>
                  <option value="time">Time (s)</option>
                  <option value="time_min">Time (min)</option>
                  <option value="altitude">Altitude (ft)</option>
                  <option value="altitude_m">Altitude (m)</option>
                  <option value="altitude_km">Altitude (km)</option>
                  <option value="latitude">Latitude</option>
                  <option value="longitude">Longitude</option>
                  <option value="speed">Speed</option>
                  <option value="volts">Volts</option>
                  <option value="temperature">Temperature (°C)</option>
                  <option value="temperature_f">Temperature (°F)</option>
                  <option value="temperature_external">Temperature External (°C)</option>
                  <option value="temperature_internal">Temperature Internal (°C)</option>
                  <option value="temperature_ambient">Temperature Ambient (°C)</option>
                  <option value="humidity">Humidity (%)</option>
                  <option value="pressure">Pressure (hPa)</option>
                  <option value="pressure_pa">Pressure (Pa)</option>
                  <option value="pressure_kpa">Pressure (kPa)</option>
                  <option value="pressure_log">log₁₀ Pressure (hPa)</option>
                  <option value="prec_gas">Prec. Gas</option>
                  <option value="oxid_gas">Oxidizing Gas (ozone proxy)</option>
                  <option value="ascent_rate_ft_min">Ascent rate (ft/min)</option>
                  <option value="ascent_rate_m_s">Ascent rate (m/s)</option>
                  <option value="lapse_rate_c_per_kft">Lapse rate (°C/1000ft)</option>
                  <option value="lapse_rate_c_per_km">Lapse rate (°C/km)</option>
                </select>
              </div>
              <div className="axis-select">
                <label htmlFor="shared-y-axis">Y Axis:</label>
                <select 
                  id="shared-y-axis"
                  value={sharedYAxis} 
                  onChange={(e) => setSharedYAxis(e.target.value)}
                >
                  <option value="timestamp">Timestamp</option>
                  <option value="time">Time (s)</option>
                  <option value="time_min">Time (min)</option>
                  <option value="altitude">Altitude (ft)</option>
                  <option value="altitude_m">Altitude (m)</option>
                  <option value="altitude_km">Altitude (km)</option>
                  <option value="latitude">Latitude</option>
                  <option value="longitude">Longitude</option>
                  <option value="speed">Speed</option>
                  <option value="volts">Volts</option>
                  <option value="temperature">Temperature (°C)</option>
                  <option value="temperature_f">Temperature (°F)</option>
                  <option value="temperature_external">Temperature External (°C)</option>
                  <option value="temperature_internal">Temperature Internal (°C)</option>
                  <option value="temperature_ambient">Temperature Ambient (°C)</option>
                  <option value="humidity">Humidity (%)</option>
                  <option value="pressure">Pressure (hPa)</option>
                  <option value="pressure_pa">Pressure (Pa)</option>
                  <option value="pressure_kpa">Pressure (kPa)</option>
                  <option value="pressure_log">log₁₀ Pressure (hPa)</option>
                  <option value="prec_gas">Prec. Gas</option>
                  <option value="oxid_gas">Oxidizing Gas (ozone proxy)</option>
                  <option value="ascent_rate_ft_min">Ascent rate (ft/min)</option>
                  <option value="ascent_rate_m_s">Ascent rate (m/s)</option>
                  <option value="lapse_rate_c_per_kft">Lapse rate (°C/1000ft)</option>
                  <option value="lapse_rate_c_per_km">Lapse rate (°C/km)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="charts-container">
            <div className="chart-section">
              {hab0Data && hab0Data.length > 0 ? (
                <D3BalloonChart 
                  data={hab0Data}
                  title="First launch (HAB_0)"
                  animate={hab0Animate}
                  onAnimationToggle={setHab0Animate}
                  xAxis={sharedXAxis}
                  yAxis={sharedYAxis}
                  showControls={false}
                />
              ) : (
                <div className="loading-placeholder">
                  <p>Loading HAB_0 data...</p>
                </div>
              )}
              <div className="flight-info">
                <h4>HAB_0 Launch</h4>
                <p><strong>Date:</strong> March 14, 2015</p>
                <p><strong>Location:</strong> Damiensville, IL</p>
                <p><strong>Max Altitude:</strong> 109,113 ft</p>
                <p><strong>Duration:</strong> ~123 minutes</p>
              </div>
            </div>
            
            <div className="chart-section">
              {loyolaData && loyolaData.length > 0 ? (
                <D3BalloonChart 
                  data={loyolaData}
                  title="Second launch (Loyola)"
                  animate={loyolaAnimate}
                  onAnimationToggle={setLoyolaAnimate}
                  xAxis={sharedXAxis}
                  yAxis={sharedYAxis}
                  showControls={false}
                />
              ) : (
                <div className="loading-placeholder">
                  <p>Loading Loyola data...</p>
                </div>
              )}
              <div className="flight-info">
                <h4>Loyola Launch</h4>
                <p><strong>Date:</strong> April 16, 2016</p>
                <p><strong>Location:</strong> Damiensville, IL</p>
                <p><strong>Max Altitude:</strong> 106,632 ft</p>
                <p><strong>Duration:</strong> ~101 minutes</p>
              </div>
            </div>
          </div>
      
      <div className="comparison-analysis">
        <h3>Data Analysis</h3>
        <div className="analysis-grid">
          <div className="analysis-card">
            <h4>Temperature Differences</h4>
            <p>The Loyola launch showed slightly cooler temperatures at ground level (22°C vs 25°C), 
            likely due to seasonal differences between March and April.</p>
          </div>
          <div className="analysis-card">
            <h4>Pressure Variations</h4>
            <p>Both flights show similar pressure-altitude relationships, following the standard 
            barometric formula with slight variations due to weather conditions.</p>
          </div>
          <div className="analysis-card">
            <h4>Humidity Patterns</h4>
            <p>The Loyola launch had higher humidity levels throughout the flight, indicating 
            different atmospheric moisture content between the two launch dates.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightComparison
