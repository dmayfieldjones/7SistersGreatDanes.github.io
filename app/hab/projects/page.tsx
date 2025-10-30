import '../components/hab-styles.css'

export default function ProjectsPage() {
  return (
    <main className="content-wrapper">
      <section className="maker-section">
        <h2 className="section-title">Student Projects</h2>
        <p className="intro-text">
          Hands-on learning activities and student projects that demonstrate 
          STEAM principles through high altitude balloon experiments. These 
          projects showcase real-world applications of science, technology, 
          engineering, arts, and mathematics.
        </p>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Project Categories</h2>
        <div className="maker-grid">
          <div className="maker-card">
            <h3>Payload Design</h3>
            <p>Design and build scientific instruments and experiments for balloon flights</p>
          </div>
          <div className="maker-card">
            <h3>Data Analysis</h3>
            <p>Analyze flight data and create scientific reports and presentations</p>
          </div>
          <div className="maker-card">
            <h3>Recovery Systems</h3>
            <p>Design and test systems for tracking and recovering balloon payloads</p>
          </div>
          <div className="maker-card">
            <h3>Art Integration</h3>
            <p>Combine artistic expression with scientific exploration and data visualization</p>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Featured Projects</h2>
        <p className="intro-text">
          Examples of student work and projects from HAB.education programs:
        </p>
        <ul className="maker-list">
          <li><strong>Atmospheric Monitoring:</strong> Students design and deploy sensors to measure temperature, pressure, and humidity at various altitudes</li>
          <li><strong>Photography Missions:</strong> Capture stunning images of Earth from near-space using balloon-mounted cameras</li>
          <li><strong>Environmental Studies:</strong> Investigate air quality, pollution levels, and atmospheric composition</li>
          <li><strong>Weather Prediction:</strong> Use balloon data to improve local weather forecasting models</li>
          <li><strong>Communication Experiments:</strong> Test radio communications and tracking systems at high altitudes</li>
          <li><strong>Art & Science Fusion:</strong> Create visual representations of scientific data through artistic expression</li>
        </ul>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Getting Started</h2>
        <p className="intro-text">
          Ready to start your own HAB.education project? Here's how to get involved:
        </p>
        <ul className="maker-list">
          <li><strong>Join a Program:</strong> Participate in existing HAB.education programs and workshops</li>
          <li><strong>Design Your Experiment:</strong> Choose a scientific question and design an experiment to answer it</li>
          <li><strong>Build Your Payload:</strong> Create the instruments and equipment needed for your experiment</li>
          <li><strong>Launch and Collect Data:</strong> Deploy your experiment and gather scientific data</li>
          <li><strong>Analyze and Share:</strong> Process your data and share your findings with the community</li>
        </ul>
      </section>
    </main>
  )
}
