'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

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

interface D3BalloonChartProps {
  data: FlightData[]
  title: string
  animate?: boolean
  onAnimationToggle?: (animate: boolean) => void
  xAxis?: string
  yAxis?: string
  showControls?: boolean
}

type AxisVariable =
  | 'timestamp' | 'time' | 'time_min'
  | 'altitude' | 'altitude_m' | 'altitude_km'
  | 'latitude' | 'longitude' | 'speed'
  | 'volts'
  | 'temperature' | 'temperature_f' | 'temperature_external' | 'temperature_internal' | 'temperature_ambient'
  | 'humidity'
  | 'pressure' | 'pressure_pa' | 'pressure_kpa' | 'pressure_log'
  | 'prec_gas' | 'oxid_gas'
  | 'ascent_rate_ft_min' | 'ascent_rate_m_s'
  | 'lapse_rate_c_per_kft' | 'lapse_rate_c_per_km'

const D3BalloonChart: React.FC<D3BalloonChartProps> = ({ 
  data, 
  title, 
  animate = false, 
  onAnimationToggle,
  xAxis: externalXAxis,
  yAxis: externalYAxis,
  showControls = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isAnimating, setIsAnimating] = useState(animate)
  const [xAxis, setXAxis] = useState<AxisVariable>(externalXAxis as AxisVariable || 'oxid_gas')
  const [yAxis, setYAxis] = useState<AxisVariable>(externalYAxis as AxisVariable || 'altitude')

  // Update axis values when external props change
  useEffect(() => {
    if (externalXAxis) setXAxis(externalXAxis as AxisVariable)
    if (externalYAxis) setYAxis(externalYAxis as AxisVariable)
  }, [externalXAxis, externalYAxis])

  const axisOptions = [
    { value: 'timestamp', label: 'Timestamp' },
    { value: 'time', label: 'Time (s)' },
    { value: 'time_min', label: 'Time (min)' },
    { value: 'altitude', label: 'Altitude (ft)' },
    { value: 'altitude_m', label: 'Altitude (m)' },
    { value: 'altitude_km', label: 'Altitude (km)' },
    { value: 'latitude', label: 'Latitude' },
    { value: 'longitude', label: 'Longitude' },
    { value: 'speed', label: 'Speed' },
    { value: 'volts', label: 'Volts' },
    { value: 'temperature', label: 'Temperature (°C)' },
    { value: 'temperature_f', label: 'Temperature (°F)' },
    { value: 'temperature_external', label: 'Temperature External (°C)' },
    { value: 'temperature_internal', label: 'Temperature Internal (°C)' },
    { value: 'temperature_ambient', label: 'Temperature Ambient (°C)' },
    { value: 'humidity', label: 'Humidity (%)' },
    { value: 'pressure', label: 'Pressure (hPa)' },
    { value: 'pressure_pa', label: 'Pressure (Pa)' },
    { value: 'pressure_kpa', label: 'Pressure (kPa)' },
    { value: 'pressure_log', label: 'log₁₀ Pressure (hPa)' },
    { value: 'prec_gas', label: 'Prec. Gas' },
    { value: 'oxid_gas', label: 'Oxidizing Gas (ozone proxy)' },
    { value: 'ascent_rate_ft_min', label: 'Ascent rate (ft/min)' },
    { value: 'ascent_rate_m_s', label: 'Ascent rate (m/s)' },
    { value: 'lapse_rate_c_per_kft', label: 'Lapse rate (°C/1000ft)' },
    { value: 'lapse_rate_c_per_km', label: 'Lapse rate (°C/km)' },
  ]

  // Build a derived dataset with computed variables for flexible plotting
  const derivedData = React.useMemo(() => {
    if (!data || data.length === 0) return [] as Array<Record<string, number>>
    const rows: Array<Record<string, number>> = []
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      const prev = i > 0 ? data[i - 1] : null
      const dt_s = prev ? (d.time - prev.time) : 0
      const dAlt_ft = prev ? (d.altitude - prev.altitude) : 0
      const dTemp_c = prev ? (d.temperature - prev.temperature) : 0

      const altitude_m = d.altitude * 0.3048
      const altitude_km = altitude_m / 1000
      const temperature_f = d.temperature * 9/5 + 32
      const pressure_pa = d.pressure * 100
      const pressure_kpa = pressure_pa / 1000
      const pressure_log = d.pressure > 0 ? Math.log10(d.pressure) : NaN
      const time_min = d.time / 60
      const ascent_rate_ft_min = dt_s > 0 ? (dAlt_ft / dt_s) * 60 : 0
      const ascent_rate_m_s = dt_s > 0 ? (dAlt_ft * 0.3048) / dt_s : 0
      const lapse_rate_c_per_kft = dAlt_ft !== 0 ? (dTemp_c / (dAlt_ft / 1000)) : 0
      const lapse_rate_c_per_km = altitude_m !== (prev ? prev.altitude * 0.3048 : altitude_m) && dt_s !== 0
        ? (dTemp_c / ((dAlt_ft * 0.3048) / 1000))
        : 0

      rows.push({
        timestamp: d.timestamp || d.time,
        time: d.time,
        time_min,
        altitude: d.altitude,
        altitude_m,
        altitude_km,
        latitude: d.latitude || 0,
        longitude: d.longitude || 0,
        speed: d.speed || 0,
        volts: d.volts || 0,
        temperature: d.temperature,
        temperature_f,
        temperature_external: d.temperature_external || d.temperature,
        temperature_internal: d.temperature_internal || d.temperature,
        temperature_ambient: d.temperature_ambient || d.temperature,
        humidity: d.humidity,
        pressure: d.pressure,
        pressure_pa,
        pressure_kpa,
        pressure_log,
        prec_gas: d.prec_gas || 0,
        oxid_gas: d.oxid_gas || 0,
        ascent_rate_ft_min,
        ascent_rate_m_s,
        lapse_rate_c_per_kft,
        lapse_rate_c_per_km,
      })
    }
    return rows
  }, [data])

  useEffect(() => {
    if (!svgRef.current || !derivedData.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // Clear previous content

    const margin = { top: 20, right: 80, bottom: 80, left: 80 }
    const width = 400 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Dynamic scales based on selected axes over derived dataset
    const xScale = d3.scaleLinear()
      .domain(d3.extent(derivedData, d => d[xAxis]) as [number, number])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain(d3.extent(derivedData, d => d[yAxis]) as [number, number])
      .range([height, 0])

    // Line generator
    const line = d3.line<Record<string, number>>()
      .x(d => xScale(d[xAxis]))
      .y(d => yScale(d[yAxis]))
      .curve(d3.curveMonotoneX)

    // Dynamic axes
    const xAxisGenerator = d3.axisBottom(xScale)
    const yAxisGenerator = d3.axisLeft(yScale)

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxisGenerator)
      .selectAll('text')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')

    g.append('g')
      .call(yAxisGenerator)
      .selectAll('text')
      .style('font-size', '12px')

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat(() => '')
      )
      .style('opacity', 0.3)

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => '')
      )
      .style('opacity', 0.3)

    // Data line
    const dataLine = g.append('path')
      .datum(derivedData)
      .attr('fill', 'none')
      .attr('stroke', '#bf141c')
      .attr('stroke-width', 2)
      .attr('d', line)

    // Animation
    if (isAnimating) {
      const totalLength = dataLine.node()?.getTotalLength() || 0

      dataLine
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
    }

    // Dynamic labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#bf141c')
      .text(axisOptions.find(opt => opt.value === yAxis)?.label || '')

    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#bf141c')
      .text(axisOptions.find(opt => opt.value === xAxis)?.label || '')

  }, [derivedData, isAnimating, xAxis, yAxis])

  const handleAnimationToggle = () => {
    const newState = !isAnimating
    setIsAnimating(newState)
    onAnimationToggle?.(newState)
  }

  return (
    <div className="d3-chart-container">
      <h3>{title}</h3>
      {showControls && (
        <div className="chart-controls">
          <div className="axis-controls">
            <div className="axis-select">
              <label htmlFor={`x-axis-${title}`}>X Axis:</label>
              <select 
                id={`x-axis-${title}`}
                value={xAxis} 
                onChange={(e) => setXAxis(e.target.value as AxisVariable)}
              >
                {axisOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="axis-select">
              <label htmlFor={`y-axis-${title}`}>Y Axis:</label>
              <select 
                id={`y-axis-${title}`}
                value={yAxis} 
                onChange={(e) => setYAxis(e.target.value as AxisVariable)}
              >
                {axisOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button 
            className={`animate-btn ${isAnimating ? 'active' : ''}`}
            onClick={handleAnimationToggle}
          >
            Animate?
          </button>
        </div>
      )}
      <svg ref={svgRef} className="d3-chart"></svg>
    </div>
  )
}

export default D3BalloonChart
