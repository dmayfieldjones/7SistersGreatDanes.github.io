'use client'

import React from 'react'
import FlightComparison from '../components/FlightComparison'
import FlightTrajectoryMap from '../components/FlightTrajectoryMap'
import '../components/hab-styles.css'

export default function DataPage() {
  // Test data loading
  React.useEffect(() => {
    const testData = async () => {
      try {
        const response = await fetch('/data/balloon5.csv')
        const text = await response.text()
        const lines = text.split('\n').slice(0, 5) // First 5 lines
        const testDiv = document.getElementById('raw-data-test')
        if (testDiv) {
          testDiv.innerHTML = `<pre>${lines.join('\n')}</pre>`
        }
      } catch (error) {
        const testDiv = document.getElementById('raw-data-test')
        if (testDiv) {
          testDiv.innerHTML = `Error: ${error}`
        }
      }
    }
    testData()
  }, [])

  return (
    <main className="content-wrapper">
      <section className="maker-section">
        <h2 className="section-title">Balloon Data Visualization</h2>
        <p className="intro-text">
          Historical data visualization tools from HAB.education (2015-2017). These tools 
          demonstrate how high altitude balloon data can be collected, processed, and 
          visualized for educational purposes using interactive D3.js charts.
        </p>
      </section>

          <section className="maker-section">
            <h2 className="section-title">Flight Data Comparison</h2>
            <p className="intro-text">
              Interactive D3.js visualizations comparing balloon flight data from different launches. 
              Click the "Animate?" buttons to see the data visualization in action, just like the 
              original HAB.education site.
            </p>
            
            <div className="flight-comparison">
              <FlightComparison />
            </div>
          </section>

      <section className="maker-section">
        <h2 className="section-title">Historical Data Tools</h2>
        <div className="maker-grid">
          <div className="maker-card">
            <h3>Flight Trajectory Analysis</h3>
            <p>Visualize balloon flight paths, altitude profiles, and landing predictions</p>
            <ul>
              <li>GPS tracking data</li>
              <li>Altitude vs. time graphs</li>
              <li>Wind pattern analysis</li>
              <li>Landing prediction models</li>
            </ul>
          </div>
          <div className="maker-card">
            <h3>Atmospheric Data Analysis</h3>
            <p>Analysis of temperature, pressure, humidity, and atmospheric composition</p>
            <ul>
              <li>Temperature profile analysis</li>
              <li>Pressure-altitude relationships</li>
              <li>Humidity variations</li>
              <li>Atmospheric layer identification</li>
            </ul>
          </div>
          <div className="maker-card">
            <h3>Sensor Data Visualization</h3>
            <p>Historical data visualization from various sensors and instruments</p>
            <ul>
              <li>Multi-sensor data overlay</li>
              <li>Customizable time ranges</li>
              <li>Data quality assessment</li>
              <li>Sensor calibration analysis</li>
            </ul>
          </div>
          <div className="maker-card">
            <h3>Data Export & Sharing</h3>
            <p>Export data in multiple formats for further analysis and research</p>
            <ul>
              <li>CSV and Excel export</li>
              <li>JSON data format</li>
              <li>PDF report generation</li>
              <li>Open data sharing</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Data Processing Workflow</h2>
        <p className="intro-text">
          The original HAB.education workflow for processing balloon data (2015-2017):
        </p>
        <ul className="maker-list">
          <li><strong>Data Collection:</strong> Import data from balloon sensors (CSV, Excel, or other formats)</li>
          <li><strong>Data Cleaning:</strong> Process and clean raw data for analysis</li>
          <li><strong>Data Transformation:</strong> Convert data to "tidy" format for visualization</li>
          <li><strong>Visualization:</strong> Create interactive charts and graphs</li>
          <li><strong>Analysis:</strong> Extract insights and patterns from the data</li>
          <li><strong>Reporting:</strong> Generate reports and share findings</li>
        </ul>
        <div className="maker-card">
          <h3>R-based Data Processing</h3>
          <p>The original workflow used R for data processing:</p>
          <ul>
            <li>Import data into R (read.xlsx, or convert to CSV)</li>
            <li>Melt the data frame using timestamp as ID variable (reshape2 package)</li>
            <li>Add dataframe$cat=HAB_### to melted data frame</li>
            <li>Append melted dataframe to existing balloon data</li>
            <li>Rename variables to match existing dataset names</li>
            <li>Recast data back to normal format</li>
          </ul>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Historical Data Tools</h2>
        <p className="intro-text">
          The original HAB.education site (2015-2017) featured interactive data processing tools that allowed users to upload their own balloon flight data in CSV format. These tools enabled students and researchers to:
        </p>
        <ul className="maker-list">
          <li><strong>Upload CSV Data:</strong> Users could upload their own balloon flight data files for analysis</li>
          <li><strong>Real-time Processing:</strong> The system would automatically parse and validate the uploaded data</li>
          <li><strong>Interactive Visualization:</strong> Generate custom charts and graphs from uploaded data</li>
          <li><strong>Data Export:</strong> Download processed data in various formats for further analysis</li>
          <li><strong>Sample Data:</strong> Access to sample CSV files showing the expected data format</li>
        </ul>
        <p className="intro-text">
          These tools were built using R for data processing and D3.js for visualization, making atmospheric science data analysis accessible to students and educators. The tools supported various sensor data including temperature, pressure, humidity, GPS coordinates, and atmospheric composition measurements.
        </p>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Educational Resources</h2>
        <div className="maker-grid">
          <div className="maker-card">
            <h3>Data Collection Methods</h3>
            <p>Learn about sensors and instruments used in high altitude balloon experiments</p>
            <ul>
              <li>Temperature and pressure sensors</li>
              <li>GPS tracking systems</li>
              <li>Camera and imaging equipment</li>
              <li>Data logging systems</li>
            </ul>
          </div>
          <div className="maker-card">
            <h3>Data Analysis Techniques</h3>
            <p>Statistical and visualization methods for atmospheric data</p>
            <ul>
              <li>Time series analysis</li>
              <li>Altitude vs. atmospheric parameters</li>
              <li>Data quality assessment</li>
              <li>Pattern recognition</li>
            </ul>
          </div>
          <div className="maker-card">
            <h3>Educational Applications</h3>
            <p>How balloon data can be used in STEAM education</p>
            <ul>
              <li>Physics and atmospheric science</li>
              <li>Data literacy and statistics</li>
              <li>Engineering and design</li>
              <li>Scientific methodology</li>
            </ul>
          </div>
          <div className="maker-card">
            <h3>Community Resources</h3>
            <p>Tools and resources for balloon data analysis</p>
            <ul>
              <li>Open source software</li>
              <li>Data sharing platforms</li>
              <li>Educational materials</li>
              <li>Community forums</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
