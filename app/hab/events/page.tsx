import '../components/hab-styles.css'

export default function EventsPage() {
  return (
    <main className="content-wrapper">
      <section className="maker-section" itemScope itemType="https://schema.org/WebPageElement">
        <h1 className="section-title" itemProp="name">HAB.education Events & Calendar</h1>
        <p className="intro-text">
          HAB.education was an active community from 2015-2017, bringing together educators, 
          students, and balloon enthusiasts for regular meetings, workshops, and collaborative 
          high altitude balloon education projects.
        </p>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Historical Regular Events</h2>
        
        <div className="event-card">
          <h3>Community Meetings</h3>
          <div className="event-details">
            <p><strong>When:</strong> Thursdays at 8:00 PM (2015-2017) - regular meetings, then as schedules allowed</p>
            <p><strong>What:</strong> We met regularly to work on different aspects of HAB launches</p>
            <p><strong>Who:</strong> Everyone was welcome to join!</p>
            <p><strong>Status:</strong> <span className="status-inactive">Community is no longer active</span></p>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Notable Historical Events</h2>
        
        <div className="event-card featured">
          <h3>2017 Events</h3>
          <div className="event-details">
            <ul>
              <li><strong>August 21:</strong> Arch Reactor's Eclipse Launch 2017 - St Louis, MO</li>
              <li><strong>August 17:</strong> ASTRAX Launch 2017 - Trabuco Canyon, CA (assisted ASTRAX team with 3 high school students from Japan)</li>
              <li><strong>June 16:</strong> Great Plains Super Launch 2017 - Hutchinson, KS</li>
              <li><strong>May 25:</strong> International Space Developers Conference - Saint Louis, MO (co-sponsor)</li>
              <li><strong>May 4:</strong> YMCA Engineering Challenge Launch - Damiansville, IL</li>
              <li><strong>February 2:</strong> National Signing Day 2017 - Cordarrian Richardson commit in nearspace (collaborated with Launch With Us for Bleacher Report)</li>
              <li><strong>February 2:</strong> STEM Learning presentation at Progress South Elementary - O'Fallon, MO</li>
            </ul>
          </div>
        </div>

        <div className="event-card">
          <h3>2016 Events</h3>
          <div className="event-details">
            <ul>
              <li><strong>November 5:</strong> Public Launch benefiting Leukemia & Lymphoma Society - Damiansville Park, IL</li>
              <li><strong>October 8:</strong> Gateway to Space Conference - Saint Louis University's Parks College</li>
              <li><strong>September 24:</strong> Saint Louis murmuration festival - Cortex Innovation Community</li>
              <li><strong>September 10:</strong> Bonne Terre Aire Festival - Bonne Terre, Missouri</li>
              <li><strong>September 4:</strong> Introduction to HABs Night at Lab Revolution - Farmington, MO</li>
              <li><strong>August 6:</strong> Saint Louis Regional HAB Educator Summit - Arch Reactor, St. Louis, MO</li>
              <li><strong>June 16:</strong> Great Plains Super Launch - Pecan Plantations, Granbury, Texas</li>
              <li><strong>June 5:</strong> Saint Louis Public Library and Saint Louis Space Frontier Launches - Damiansville Park, IL</li>
              <li><strong>May 20:</strong> Dayton Hamvention - Dayton, OH</li>
              <li><strong>April 16:</strong> YMCA Science Gone Mad with Loyola Academy Launch</li>
              <li><strong>April 9:</strong> 2016 Robot and Technology Expo - Park Hills, MO</li>
              <li><strong>March 30:</strong> East St. Louis School District's First Annual Family STEM Night - East St. Louis, MO</li>
              <li><strong>March 12:</strong> Saint Louis Space Frontier HAB Electronics Workshop - Arch Reactor, St. Louis, MO</li>
              <li><strong>February 13:</strong> Saint Louis Public Library presentation (Julia Davis Branch) - St. Louis, MO</li>
              <li><strong>February 11:</strong> STEMpact STEM Fair</li>
            </ul>
          </div>
        </div>

        <div className="event-card">
          <h3>2015 Events</h3>
          <div className="event-details">
            <ul>
              <li><strong>November 30:</strong> Saint Louis Balloon Hack</li>
              <li><strong>October 24:</strong> Launch with Kirksville High School Maker Club - Kirksville, MO</li>
              <li><strong>October 3:</strong> Saint Louis Raspberry Pi Jam - Danforth Plant Science Center, St Louis, MO</li>
              <li><strong>June 19:</strong> Great Plains Super Launch</li>
              <li><strong>March 14:</strong> SpikeInSpace</li>
              <li><strong>January 31:</strong> Saint Louis Raspberry Pi Jam</li>
            </ul>
          </div>
        </div>

        <div className="event-card featured">
          <h3>Interview Series Launch</h3>
          <div className="event-details">
            <p><strong>Date:</strong> 2015-2016</p>
            <p><strong>Description:</strong> Published interviews with leading researchers and students in high altitude balloon science</p>
            <p><strong>Featured Interviews:</strong></p>
            <ul>
              <li>Alexa Halford - Space Physics Research (January 2016)</li>
              <li>Danny Bowman - Atmospheric Acoustics (December 2015)</li>
              <li>Stanford Space Initiative - Student Organization (November 2015)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Legacy and Impact</h2>
        <p className="intro-text">
          Although HAB.education is no longer active, the community's contributions continue to 
          influence high altitude balloon education and research today.
        </p>
        
        <div className="legacy-grid">
          <div className="legacy-card">
            <h3>Educational Resources</h3>
            <p>Documentation and methodologies developed by the community remain valuable for educators and students</p>
            <ul>
              <li>Balloon experiment protocols</li>
              <li>Safety guidelines and best practices</li>
              <li>Data collection methodologies</li>
              <li>Integration with STEAM curricula</li>
            </ul>
          </div>
          
          <div className="legacy-card">
            <h3>Research Collaborations</h3>
            <p>Connections made through HAB.education led to ongoing research partnerships</p>
            <ul>
              <li>NASA Goddard space weather research</li>
              <li>University atmospheric studies</li>
              <li>Student research projects</li>
              <li>Open source instrumentation</li>
            </ul>
          </div>
          
          <div className="legacy-card">
            <h3>Community Building</h3>
            <p>Participated in established networks that continue to support balloon education</p>
            <ul>
              <li>ARHAB (Amateur Radio High Altitude Ballooning)</li>
              <li>University space initiatives</li>
              <li>Educational maker communities</li>
              <li>Citizen science projects</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Historical Resources</h2>
        
        <div className="maker-grid">
          <div className="maker-card">
            <h3>Interview Archive</h3>
            <p>Access the original interviews with researchers and students</p>
            <a href="/hab/interviews" className="btn btn-zoom hover:text-red-600">View Interviews</a>
          </div>
          
          <div className="maker-card">
            <h3>Educational Programs</h3>
            <p>After-school program with Loyola Academy & Gateway YMCA, plus international ASTRAX collaboration</p>
            <a href="/hab/lessons" className="btn btn-zoom hover:text-red-600">View Programs</a>
          </div>
          
          <div className="maker-card">
            <h3>Data Tools</h3>
            <p>Visualization and analysis tools for balloon experiments</p>
            <a href="/hab/data" className="btn btn-zoom hover:text-red-600">Data Tools</a>
          </div>
          
          <div className="maker-card">
            <h3>Research Projects</h3>
            <p>Documentation of community research initiatives</p>
            <a href="/hab/projects" className="btn btn-zoom hover:text-red-600">View Projects</a>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Continuing the Mission</h2>
        <p className="intro-text">
          While HAB.education is no longer active, the mission of promoting high altitude balloon 
          education continues through various organizations and communities.
        </p>
        
        <div className="continuation-options">
          <div className="option-card">
            <h3>ARHAB Community</h3>
            <p>Join the Amateur Radio High Altitude Ballooning community for ongoing balloon activities</p>
            <a href="https://arhab.org" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Visit ARHAB
            </a>
          </div>
          
          <div className="option-card">
            <h3>University Programs</h3>
            <p>Look for high altitude balloon programs at universities and research institutions</p>
            <a href="https://stanfordssi.org" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Stanford SSI
            </a>
          </div>
          
          <div className="option-card">
            <h3>Educational Resources</h3>
            <p>Use the materials and methodologies developed by HAB.education in your own projects</p>
            <a href="/hab/resources" className="btn btn-zoom hover:text-red-600">
              Browse Resources
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
