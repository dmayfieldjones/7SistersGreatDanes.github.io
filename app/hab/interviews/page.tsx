'use client'

import React from 'react'
import '../components/hab-styles.css'

export default function InterviewsPage() {
  return (
    <main className="content-wrapper">
      <section className="maker-section" itemScope itemType="https://schema.org/WebPageElement">
        <h1 className="section-title" itemProp="name">HAB.education Interviews</h1>
        <p className="intro-text">
          Discover the stories, insights, and experiences of researchers, scientists, and students 
          who are using high altitude balloons to advance our understanding of space physics, 
          atmospheric science, and aerospace technology.
        </p>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Featured Interviews</h2>
        
        <div className="interview-card featured">
          <h3>Interview with Alexa Halford: Space Physics</h3>
          <div className="interview-meta">
            <span className="date">January 8, 2016</span>
            <span className="category">Space Physics Research</span>
          </div>
          <div className="interview-image">
            <img src="/img/alexa-halford-interview.jpg" alt="Alexa Halford" className="interview-photo" />
            <p className="image-caption">Image courtesy of Alexa Halford</p>
          </div>
          <p className="interview-excerpt">
            "Alexa Halford uses HABs to study space weather. In particular, she is interested in what happens 
            when high energy particles emitted from the sun come into contact with earth's magnetosphere, or 
            the region of space dominated by earth's magnetic field. Sometimes, these powerful particles lead 
            to electronic anomalies or hardware damage, causing problems for satellites, radio communications, 
            and devices on earth's surface. Storms can even be unsafe for astronauts. The effects of a solar 
            storm could have devastating results, yet the ability to accurately predict the magnitude of the 
            storm is still a major challenge."
          </p>
          
          <div className="interview-content">
            <p>One <a href="http://science.nasa.gov/science-news/science-at-nasa/2008/06may_carringtonflare/" target="_blank" rel="noopener noreferrer">extreme event</a> in 1859 caused telegraph systems all over the world to fail. A similar event today would cause major power blackouts, communication losses, and be very expensive. It has been estimated that a similar storm would cost over a trillion dollars in losses!</p>
            
            <p>Sometimes we worry too much; satellites and spacecraft are unnecessarily shut down to protect them from damage. With a better understanding of the space environment which will lead to more accurate modeling and predictions, scientists could give more accurate forecasts. Scientists are also currently working to understand the daily, less catastrophic effects of space weather on our technology. Even small perturbations of our magnetosphere end up affecting power grids. Understanding this will allow us to potentially take advantage of these blips in the power grid.</p>
            
            <p>The storms don't just affect earth. For example, Mars has a weak magnetic field, and just like how a thin comb-over blows away in the wind, it appears much of Mar's atmosphere got blown away earlier in the history of our solar system. It is thought that without a strong magnetic field to help hold it in place, the Martian atmosphere was blown away by solar winds. Without the atmosphere to hold in heat, the water that may have made life possible on Mars long ago froze. Liquid water is thought to be essential for life, and we all should take a moment to thank our magnetic field for protecting us.</p>
            
            <p>Ok, so what can balloons tell us about the state of our magnetosphere? Alexa explains that X-rays are created when electrons in earth's magnetic field are pushed into uncharged particles in the atmosphere. Instruments aboard her group's balloons measure X-rays, and they can thus infer when electrons are lost from the magnetosphere. They compare what they see from their balloons with other ground based sensors to get an idea of not only what is happening to electrons during storms, but also protons. To get these measurements, the BARREL team, which stands for the <a href="http://www.nasa.gov/mission-pages/rbsp/barrel" target="_blank" rel="noopener noreferrer">Balloon Array for Radiation-belt Relativistic Electron Losses</a>, has traveled to some pretty cool places like Antarctica and Sweden. It is led by Robyn Millan at Dartmouth College, where Alexa is currently a joint post-doc with NASA Goddard.</p>
            
            <p>Alexa tells us the balloons in Antarctica got some great data, but there were not as many ground sensors as there are in Sweden. The combination of balloons and other ground based measurements in Sweden allows them to look at lower energy precipitation as well as allow for more direct comparisons to learn about lost protons. Importantly, the balloons allow for better time and location resolution than ground sensors alone. Together, this will help inform us about the dynamics of the magnetosphere due to a geomagnetic storm.</p>
            
            <p>In addition to ground sensors, some satellites have specific high-resolution equipment to study similar conditions from space, and their data can also be combined with those from the balloons. The BARREL team initially got funding to work with some of these satellites, the Van Allan probes, and they are now also working with CubeSats in low earth orbit.</p>
            
            <p>How could the amateur HAB community get involved? Wouldn't it be cool to have a space weather station in your backyard?! Alexa told us that X-ray scintillation kits, or a miniaturization of their group's payload, costs ~$5,000 USD, which leaves many clubs and high schools out of this type of research. However, the cost is reasonable for many universities. We discussed with Alexa possible avenues for funding such as the National Science Foundation's EPSCoRE program or a National Geographic grant. For now, adding an extra X-ray sensor to your balloon is probably not a practical choice, but following the cutting edge research in this area can be rewarding.</p>
            
            <p>One area of promising research is atmospheric chemistry. Ultimately, these raining particles affect the sky's chemistry, and may lead to the formation of compounds such as nitric oxide. These reactions have in the past been a bit of a black box to the atmospheric community. Quantifying how much energy is precipitating and what storm components contribute to atmospheric chemistry (high versus low energy particles or electron versus proton precipitation) should continue to be a hot area of research in the future.</p>
            
            <p>You can read about <a href="https://theconversation.com/scientists-at-work-space-balloons-and-charged-particles-above-the-arctic-circle-46240" target="_blank" rel="noopener noreferrer">Alexa's story in her own words here</a> or from her <a href="http://alexahalford.weebly.com" target="_blank" rel="noopener noreferrer">website</a>. Her curiosity is infectious, and you can see it in this video where she tells us more about her <a href="https://www.youtube.com/watch?v=tTJ4rjMBwQM" target="_blank" rel="noopener noreferrer">path to space physics</a>. Follow her on <a href="https://twitter.com/PlasmaNerd" target="_blank" rel="noopener noreferrer">Twitter @PlasmaNerd</a>.</p>
            
            <p>Both HAB amateurs and professionals can avoid interference of their radio communication systems by following the <a href="http://www.swpc.noaa.gov" target="_blank" rel="noopener noreferrer">National Oceanic and Atmospheric Administration's Space Weather Prediction Center</a>.</p>
          </div>
          <div className="interview-highlights">
            <h4>Key Research Areas:</h4>
            <ul>
              <li>Space weather prediction and modeling using X-ray measurements from balloon platforms</li>
              <li>BARREL (Balloon Array for Radiation-belt Relativistic Electron Losses) project</li>
              <li>Atmospheric chemistry effects of space weather</li>
              <li>Combining balloon data with ground sensors and satellite measurements</li>
            </ul>
          </div>
          <div className="interview-links">
            <a href="https://twitter.com/PlasmaNerd" target="_blank" rel="noopener noreferrer" className="btn btn-zoom hover:text-red-600">
              Follow @PlasmaNerd
            </a>
            <a href="https://www.nasa.gov/goddard" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              NASA Goddard
            </a>
          </div>
        </div>

        <div className="interview-card">
          <h3>Interview with Danny Bowman: Atmospheric Low Frequency Sound</h3>
          <div className="interview-meta">
            <span className="date">December 30, 2015</span>
            <span className="category">Atmospheric Acoustics</span>
          </div>
          <div className="interview-image">
            <img src="/img/danny-bowman-interview.jpg" alt="Danny Bowman" className="interview-photo" />
            <p className="image-caption">Image courtesy of Daniel Bowman</p>
          </div>
          <p className="interview-excerpt">
            "Not very long ago, Danny Bowman was launching and testing his first balloons in the New Mexico desert. 
            Now, he uses high altitude balloons to study sounds in the middle of the stratosphere. Little is known 
            about what exactly those sounds mean, but he is hearing something similar to what was heard the last 
            time someone listened in the '60s! His message to those new to HABs is about their wonder and accessibility."
          </p>
          
          <div className="interview-content">
            <p>Danny launched his first <a href="https://www.youtube.com/watch?v=4_QkU34HXMw" target="_blank" rel="noopener noreferrer">candle balloon</a> by a golf course with some of his friends when he was only 15. He tells us there are probably 100 bags in the desert from those early launches. After his friends failed to recover their HAB with a GPS spot tracker and camera, Danny was inspired to model flights in order to better predict their behavior. Finally, on the next try, they were successful and got some awesome pictures of snow. Today, he still uses these beautiful shots of the snow-covered landscape in scientific presentations.</p>
            
            <p>Together with some of his co-workers, Danny tried something new in 2012 with a solar balloon. Amazingly, one flight went over the Atlantic Ocean. They attached 9 bottles with their contact information, and 7/9 were recovered in about a month.</p>
            
            <p>Soon, Danny started graduate school, and one day while checking email he discovered a NASA solicitation for the <a href="http://laspace.lsu.edu/hasp/" target="_blank" rel="noopener noreferrer">high altitude student platform (HASP).</a> This is when he had the idea to combine his graduate research with HABs. Engineering near-space craft was still marked by difficulties. For example, his first balloon was released by accident. The second experiment was launched without a balloon, sort of. Instead of ordering a latex balloon, he filled garbage bags with helium, and it worked. In fact, the results of that experiment were so interesting, they were later <a href="https://www.researchgate.net/publication/260604744_The_acoustic_signatures_of_ground_acceleration_gas_expansion_and_spall_fallback_in_experimental_volcanic_explosions" target="_blank" rel="noopener noreferrer">published.</a></p>
            
            <p>On the HASP, Danny planned with his team to fly an infrasound microphone and just record whatever was up there. Already, a host of natural and anthropogenic sounds have been identified from recordings on or near the ground. <a href="http://link.springer.com/chapter/10.1007%2F978-1-4020-9508-5_6" target="_blank" rel="noopener noreferrer">These include sounds from lightning, earthquakes, volcanoes, forest fires, nuclear/chemical/mining explosions, space- and air-craft flight, and even industrial exhaust.</a> Would these show up in the stratosphere?</p>
            
            <p><a href="https://www.researchgate.net/publication/283558498_Infrasound_in_the_middle_stratosphere_measured_with_a_free_flying_acoustic_array" target="_blank" rel="noopener noreferrer">Unexpectedly, not only did they see typical sound spectra, but the spectrogram showed interesting, unknown signals.</a> Importantly, the signals were different from those recorded on earth's surface. The really cool thing was that they saw the same mysterious signals from work done in the '60s with a completely different approach and different sensors. This fact, that two different methods were showing similar things, suggested what they were hearing was real and not just artifacts from their method. In fact, this year Danny will continuing tests to ensure what he is hearing is not due to the HASP craft but real acoustics from the stratosphere.</p>
            
            <p>Now, what Danny needs most is more data. However, there are several obstacles to overcome. Basically, if there was an easy way to build and fly the specialized microphones, more people could collect a lot more data. Currently, Danny's group has data from the accent to 93k ft over one area during one flight. Even the descent of this one was too noisy to make much sense.</p>
            
            <p>More data would first help confirm what can be heard from a free flying balloon in the stratosphere. Then, further questions could begin to be answered. How do the sounds change over different terrain? Do they change with changing weather conditions and to what degree? How do they change over seasons or even during the day/night cycle? How many of those mysterious spectra can we tease apart and understand what causes them?</p>
            
            <p>The ability to design and construct infrasound microphones is limited. While the mics are not proprietary, there is little documentation and they are not mass produced and thus not for sale. Ideally, the units could fly on cheaper solar balloons that would provide longer flight times. For this to work, they would need to be light. Currently, because the study of infrasound grew out of seismology, the data loggers were designed for use on the ground and are too heavy for most amateur balloons (700 grams).</p>
            
            <p>Danny is excited by the possibilities of solar balloons. He says there are many records to break within reach of amateur HAB engineers. A more vibrant solar balloon community could help drive the innovation necessary for creating cheaper, more robust solar balloons. And this would allow for the increased sampling he needs for collecting more data. Danny specifically wants to challenge the HAB community to launch a camera and GPS on a solar balloon to break his record of 72k ft. We need to be going bigger and higher with cheaper balloons. Amateurs could really contribute to cutting edge research by improving solar balloons.</p>
            
            <p>Danny's work has been featured <a href="https://vimeo.com/141007279" target="_blank" rel="noopener noreferrer">here</a> and on his <a href="https://bovineaerospace.wordpress.com" target="_blank" rel="noopener noreferrer">blog/website</a>. You can see many videos of his flights and sound spectra on his <a href="https://www.youtube.com/channel/UCrpsGLqviSRSJrqcTB_7-Ow" target="_blank" rel="noopener noreferrer">youtube channel</a> and you can follow him on <a href="https://twitter.com/dannycbowman" target="_blank" rel="noopener noreferrer">Twitter!</a></p>
          </div>
          <div className="interview-highlights">
            <h4>Research Focus:</h4>
            <ul>
              <li>Infrasound microphones in the stratosphere</li>
              <li>Solar balloon technology development</li>
              <li>Mysterious acoustic signals at high altitude</li>
              <li>HASP (High Altitude Student Platform) experiments</li>
            </ul>
          </div>
          <div className="interview-links">
            <a href="https://twitter.com/dannycbowman" target="_blank" rel="noopener noreferrer" className="btn btn-zoom hover:text-red-600">
              Follow @dannycbowman
            </a>
            <a href="https://www.youtube.com/user/dannycbowman" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              YouTube Channel
            </a>
          </div>
        </div>

        <div className="interview-card">
          <h3>Talking with the Stanford Space Initiative</h3>
          <div className="interview-meta">
            <span className="date">November 5, 2015</span>
            <span className="category">Student Organization</span>
          </div>
          <div className="interview-image">
            <img src="/img/ssi-interview.jpg" alt="Stanford Space Initiative" className="interview-photo" />
            <p className="image-caption">High altitude balloon preparation and launch</p>
          </div>
          <p className="interview-excerpt">
            "Despite its youth, the Stanford Space Initiative is propelling aerospace technology and leadership. 
            It has quickly become the largest project-based group on campus and continues to set remarkable goals. 
            Here, several SSI leaders share some of what they have learned."
          </p>
          
          <div className="interview-content">
            <p>On June 2nd 2015, Huan and Dustin from HAB.education got a chance to speak with leaders of the fastest growing organization at Stanford, the Stanford Space Initiative (SSI). Founded in 2013, SSI has grown to become the largest project-based group on campus. Shortly after starting our conversation, it was readily apparent how they are serious about developing the future leaders of our space industry.</p>
            
            <p>We think they will do it.</p>
            
            <p>Within just a few years, they have already accomplished so much by building CubeSats, rockets, and HABs–all while inspiring others in those communities. Now, their members are getting internships and jobs at top aerospace companies.</p>
            
            <p>Quickly into our interview, SSI's Media Manager pulled in the reins on the conversation. "We can talk tech all day, but what is it you really want to accomplish here?" he said. We quickly caught on; this group is not simply about geeking out to the coolest, newest spacecraft and high altitude equipment.</p>
            
            <p>What followed was a discussion of the pros and cons of hosting a group like SSI through a student-led organization. They reported that dealing with the bureaucracy of a collegiate institution was challenging, but they are hopeful that this "legitimization" and backing from their university helps with future growth. We talked about the Saint Louis region and possible interested parties, such as Boeing, the Saint Louis Science Center, and some of our local universities and K-12 schools. Here at HAB.education, we are focused on education, and our region looks fertile for exploration.</p>
            
            <p>SSI has multiple technology development groups that have produced impressive results. We are particularly intrigued by their long distance high altitude balloon flights using latex. Typically, a launch consists of a flight time between 1 and 3 hours, climaxing with the burst of the latex balloon. This occurs when its internal pressure overcomes the reducing external pressure during assent. At the time of our interview, SSI had recently launched SSI-21, the first full-systems test of their valve and ballast system used to regulate altitude, thus preventing a burst or premature landing. They were referring to it with the portmanteau ValBal.</p>
            
            <p>"With longer distance flights and more expensive payloads, there is a greater need and difficulty for recovery after the flight," Dustin said. It would be helpful if the HAB community had a way of leveraging the national network of scientists and hobbyists to recover these payloads. For example, SSI could launch their balloon in California and terminate the flight over one of many possible recovery zones. There, a group or local individual from the community could recover and return the expensive payload.</p>
            
            <p>To appreciate the HAB community, check out <a href="http://www.arhab.org" target="_blank" rel="noopener noreferrer">ARHAB's (Amateur Radio High Altitude Balloon website)</a> that collects and posts mission information such as launch location and time, tracking frequencies, and other mission owner data. Also, <a href="http://tracker.habhub.org/" target="_blank" rel="noopener noreferrer">habhub</a> has awesome tools for flight prediction, tracking, and communication with other HAB enthusiasts. Despite these terrific resources, as of yet, we at HAB.education know of no recovery network within the community. As our members geographically stretch from Southern Iowa, through central Missouri, to Southeastern Illinois, we capture at least a portion of the Midwest. Additionally, friends in Minnesota to Texas allow for a more or less contiguous band of help in the middle of the country. We hope we can be of service and look forward to learning more about SSI's efforts.</p>
          </div>
          <div className="interview-highlights">
            <h4>SSI Achievements:</h4>
            <ul>
              <li>Largest project-based group on Stanford campus</li>
              <li>Long distance high altitude balloon flights using latex</li>
              <li>ValBal (Valve and Ballast) system for altitude regulation</li>
              <li>CubeSat and rocket development projects</li>
            </ul>
          </div>
          <div className="interview-links">
            <a href="https://stanfordssi.org" target="_blank" rel="noopener noreferrer" className="btn btn-zoom hover:text-red-600">
              Visit SSI Website
            </a>
            <a href="https://arhab.org" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              ARHAB Community
            </a>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Research Applications</h2>
        <div className="research-grid">
          <div className="research-card">
            <h3>Space Weather Research</h3>
            <p>Using balloons to study the effects of solar particles on Earth's magnetosphere and technology infrastructure.</p>
            <div className="research-details">
              <strong>Key Findings:</strong>
              <ul>
                <li>X-ray measurements reveal electron loss from magnetosphere</li>
                <li>Space weather affects power grids and satellite communications</li>
                <li>Better prediction models could prevent costly shutdowns</li>
              </ul>
            </div>
          </div>
          <div className="research-card">
            <h3>Atmospheric Acoustics</h3>
            <p>Recording and analyzing mysterious sounds in the stratosphere using specialized infrasound microphones.</p>
            <div className="research-details">
              <strong>Key Findings:</strong>
              <ul>
                <li>Unknown acoustic signals detected at high altitude</li>
                <li>Signals differ from ground-based recordings</li>
                <li>Similar patterns observed in 1960s research</li>
              </ul>
            </div>
          </div>
          <div className="research-card">
            <h3>Student Innovation</h3>
            <p>University students developing advanced balloon systems and aerospace technology through hands-on projects.</p>
            <div className="research-details">
              <strong>Key Achievements:</strong>
              <ul>
                <li>Altitude regulation systems preventing balloon bursts</li>
                <li>Long-distance flight capabilities</li>
                <li>Integration with CubeSat and rocket programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Community Impact</h2>
        <p className="intro-text">These interviews demonstrate how high altitude balloon research connects amateur enthusiasts with cutting-edge science and technology development.</p>
        <div className="impact-stats">
          <div className="stat-item">
            <h3>Research Collaboration</h3>
            <p>Professional scientists working with amateur balloon communities to advance space weather research</p>
          </div>
          <div className="stat-item">
            <h3>Student Development</h3>
            <p>University programs preparing the next generation of aerospace engineers and researchers</p>
          </div>
          <div className="stat-item">
            <h3>Technology Innovation</h3>
            <p>Open-source development of balloon systems and instrumentation for scientific research</p>
          </div>
        </div>
      </section>

      <section className="maker-section">
        <h2 className="section-title">Get Involved</h2>
        <p className="intro-text">Inspired by these researchers? Learn how you can contribute to high altitude balloon research and join the community of scientists, students, and enthusiasts.</p>
        <div className="involvement-options">
          <div className="option-card">
            <h3>Follow the Research</h3>
            <p>Stay updated on the latest developments in space weather and atmospheric research</p>
            <ul>
              <li>Follow researchers on Twitter (@PlasmaNerd, @dannycbowman)</li>
              <li>Subscribe to NASA and NOAA space weather alerts</li>
              <li>Read published papers and research findings</li>
            </ul>
          </div>
          <div className="option-card">
            <h3>Join Student Programs</h3>
            <p>Participate in university-based balloon research and aerospace development</p>
            <ul>
              <li>Look for HASP (High Altitude Student Platform) opportunities</li>
              <li>Join or start a university space initiative</li>
              <li>Participate in CubeSat and balloon competitions</li>
            </ul>
          </div>
          <div className="option-card">
            <h3>Contribute to Community</h3>
            <p>Help build the infrastructure and tools that enable balloon research</p>
            <ul>
              <li>Develop recovery networks for balloon payloads</li>
              <li>Create open-source instrumentation designs</li>
              <li>Share data and collaborate on research projects</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}