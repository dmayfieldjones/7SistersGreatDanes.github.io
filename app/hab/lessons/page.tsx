import '../components/hab-styles.css'

export default function LessonsPage() {
  return (
    <main className="content-wrapper">
      <section className="maker-section" itemScope itemType="https://schema.org/WebPageElement">
        <h1 className="section-title" itemProp="name">Educational Programs</h1>
        <p className="intro-text">
          During our active period (2015-2017), HAB.education developed hands-on educational 
          programs that brought high altitude balloon science directly to students. Our work 
          focused on creating meaningful partnerships with local schools and organizations 
          to make atmospheric science accessible and engaging.
        </p>
      </section>

      <section className="maker-section">
        <h2 className="section-title">After-School Program with Loyola Academy & Gateway YMCA</h2>
        <p className="intro-text">
          We partnered with <a href="https://loyolaacademy.org/" target="_blank" rel="noopener noreferrer">Loyola Academy</a> 
          and <a href="https://gwrymca.org/" target="_blank" rel="noopener noreferrer">Gateway Region YMCA</a> to create 
          an after-school program where students learned to assemble and code temperature and humidity sensor payloads 
          for high altitude balloons.
        </p>
        
        <div className="maker-grid">
          <div className="maker-card">
            <h3>Program Components</h3>
            <ul className="maker-list">
              <li><strong>Hardware Assembly:</strong> Students learned to solder and assemble sensor circuits</li>
              <li><strong>Programming:</strong> Coded Arduino microcontrollers to read temperature and humidity data</li>
              <li><strong>Data Logging:</strong> Implemented SD card data storage for flight recording</li>
              <li><strong>Payload Integration:</strong> Designed protective housings for high-altitude conditions</li>
              <li><strong>Launch Preparation:</strong> Participated in pre-flight testing and safety protocols</li>
            </ul>
          </div>
          
          <div className="maker-card">
            <h3>Educational Impact</h3>
            <ul className="maker-list">
              <li>Hands-on experience with electronics and programming</li>
              <li>Real-world application of atmospheric science concepts</li>
              <li>Collaborative problem-solving and teamwork</li>
              <li>Connection between classroom learning and actual research</li>
              <li>Exposure to engineering design processes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">International Collaboration</h2>
        <p className="intro-text">
          <strong>August 17, 2017:</strong> We had the opportunity to assist the ASTRAX team with their 
          2017 American high altitude balloon launch, working alongside 3 high school students from Japan. 
          This international collaboration demonstrated the global reach of amateur balloon science and 
          the power of cross-cultural educational partnerships.
        </p>
        
        <div className="maker-grid">
          <div className="maker-card">
            <h3>Collaboration Highlights</h3>
            <ul className="maker-list">
              <li>International student exchange and cultural learning</li>
              <li>Shared technical knowledge and launch procedures</li>
              <li>Cross-cultural problem-solving approaches</li>
              <li>Global perspective on atmospheric research</li>
              <li>Building international networks in amateur science</li>
            </ul>
          </div>
          
          <div className="maker-card">
            <h3>Launch Details</h3>
            <ul className="maker-list">
              <li><strong>Location:</strong> Trabuco Canyon, California</li>
              <li><strong>Participants:</strong> ASTRAX team, 3 Japanese high school students, HAB.education team</li>
              <li><strong>Mission:</strong> Educational high altitude balloon launch</li>
              <li><strong>Photos:</strong> <a href="https://photos.app.goo.gl/lxxt6yXdalzRFbRn1" target="_blank" rel="noopener noreferrer">View launch photos</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Program Legacy</h2>
        <div className="maker-grid">
          <div className="maker-card">
            <h3>Community Impact</h3>
            <p>Our programs demonstrated how hands-on science education could engage students who might not otherwise connect with atmospheric science</p>
          </div>
          
          <div className="maker-card">
            <h3>Partnership Model</h3>
            <p>The collaboration between schools, community organizations, and amateur scientists created a sustainable approach to STEAM education</p>
          </div>
          
          <div className="maker-card">
            <h3>Student Outcomes</h3>
            <p>Participants gained practical skills in electronics, programming, and scientific methodology while contributing to real research</p>
          </div>
          
          <div className="maker-card">
            <h3>International Reach</h3>
            <p>The ASTRAX collaboration showed how amateur science communities could connect globally to advance education and research</p>
          </div>
        </div>
      </section>
    </main>
  )
}
