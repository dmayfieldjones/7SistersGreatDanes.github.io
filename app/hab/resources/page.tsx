import '../components/hab-styles.css'

export default function ResourcesPage() {
  return (
    <main className="content-wrapper">
      <section className="maker-section">
        <h2 className="section-title">Historical Educational Resources</h2>
        <p className="intro-text">
          During our active period (2015-2017), HAB.education helped develop comprehensive 
          educational materials, guides, and tools for STEAM education through high altitude 
          balloon experiments. These resources supported educators and students in implementing 
          hands-on atmospheric science activities.
        </p>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Resource Categories</h2>
        <div className="maker-grid">
          <div className="maker-card">
            <h3>Curriculum Guides</h3>
            <p>Complete lesson plans and curriculum materials for balloon-based education</p>
          </div>
          <div className="maker-card">
            <h3>Technical Documentation</h3>
            <p>Guides for building payloads, sensors, and tracking systems</p>
          </div>
          <div className="maker-card">
            <h3>Safety Protocols</h3>
            <p>Safety guidelines and procedures for balloon launches and experiments</p>
          </div>
          <div className="maker-card">
            <h3>Data Analysis Tools</h3>
            <p>Software and tools for processing and visualizing balloon flight data</p>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Resources We Helped Develop</h2>
        <ul className="maker-list">
          <li><strong>Getting Started Guide:</strong> Step-by-step instructions for beginning balloon education programs</li>
          <li><strong>Payload Design Templates:</strong> CAD files and templates for common payload designs</li>
          <li><strong>Sensor Calibration Procedures:</strong> How to calibrate and validate scientific instruments</li>
          <li><strong>Launch Planning Checklist:</strong> Comprehensive checklist for planning and executing balloon launches</li>
          <li><strong>Data Processing Workflows:</strong> R and Python scripts for analyzing balloon flight data</li>
          <li><strong>Safety Training Materials:</strong> Videos and documents for safety training and certification</li>
          <li><strong>Assessment Rubrics:</strong> Tools for evaluating student learning and project outcomes</li>
          <li><strong>Community Forums:</strong> Online spaces for sharing experiences and asking questions</li>
        </ul>
      </section>

      <section className="maker-section">
        <h2 className="section-title">For Educators</h2>
        <p className="intro-text">
          Special resources we helped develop specifically for teachers and educational administrators:
        </p>
        <ul className="maker-list">
          <li><strong>Professional Development:</strong> Workshops and training sessions for educators</li>
          <li><strong>Curriculum Alignment:</strong> How HAB.education activities align with educational standards</li>
          <li><strong>Grant Writing Support:</strong> Templates and guidance for securing funding for balloon programs</li>
          <li><strong>Equipment Recommendations:</strong> Suggested tools and materials for different budget levels</li>
          <li><strong>Student Assessment Tools:</strong> Methods for evaluating student learning and engagement</li>
          <li><strong>Community Connections:</strong> How to connect with other educators and balloon enthusiasts</li>
        </ul>
      </section>

      <section className="maker-section">
        <h2 className="section-title">For Students</h2>
        <p className="intro-text">
          Resources we helped develop specifically for student learners and researchers:
        </p>
        <ul className="maker-list">
          <li><strong>Project Ideas:</strong> Inspiration for science fair projects and independent research</li>
          <li><strong>Technical Tutorials:</strong> Step-by-step guides for building and programming sensors</li>
          <li><strong>Data Analysis Examples:</strong> Sample datasets and analysis workflows to learn from</li>
          <li><strong>Career Pathways:</strong> Information about careers in atmospheric science and related fields</li>
          <li><strong>Mentorship Programs:</strong> Opportunities to connect with professionals and researchers</li>
          <li><strong>Competition Opportunities:</strong> Science fairs and competitions featuring balloon projects</li>
        </ul>
      </section>
    </main>
  )
}
