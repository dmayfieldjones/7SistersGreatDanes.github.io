import { Metadata } from 'next'
import './index.css'

export const metadata: Metadata = {
  title: '7Sisters Farm - The Story',
  description:
    'The history and story of 7Sisters Farm, a historic property with deep roots in Great Dane breeding',
}

export default function Contents() {
  return (
    <div className="content">
      <div className="post-title ">
        <h1>
          The Story of <span style={{ color: '#bf141c' }}>7</span>Sisters Farm
        </h1>
      </div>
      <main className="content-wrapper">
        {/* Hero Section */}
        <section className="hero-section">
          <img
            src="/img/Colorlogo_nobackground.png"
            alt="7Sisters Farm Logo"
            width={300}
            className="hero-logo"
            loading="lazy"
            style={{ marginBottom: '20px' }}
          />
        </section>
        <section className="puppies-begin-section" aria-labelledby="puppies-begin-heading">
          <h2 id="puppies-begin-heading" className="section-title">
            Where Our Puppies Begin
          </h2>
          <div className="puppies-begin-content">
            <p>
              When Karen and I found this property, it was the setting that stopped
              us — open fields, mature trees, outbuildings, and the kind of quiet
              that lets you hear weather coming before it arrives. We knew this was
              where we wanted to raise dogs. The land has been farmed since 1833,
              when President Andrew Jackson granted it to George Akers, and the
              brick house that sits on it has its own story — you can read it below.
            </p>
            <p>
              Our puppies are whelped in a dedicated nursery where one of us is
              always present — I sleep with the litters at night, and Karen works
              from home alongside them during the day. The adult dogs get supervised
              visits at home, but the nursery stays calm and controlled in those early
              weeks. We introduce new experiences gradually and deliberately,
              building on what the farm already provides.
            </p>
            <p>
              And the farm provides a lot. As puppies grow and build tolerance to
              new experiences, their world expands outward — nursery to yard, yard
              to pasture, pasture to the wider property. By the time they leave us
              they&apos;ve walked on grass, gravel, dirt, and concrete. They&apos;ve
              heard tractors, wind through open fields, and thunderstorms rolling
              across the prairie. They&apos;ve seen pigs and piglets, poultry,
              whatever wildlife wanders through, and occasionally the mayor of the
              neighborhood rolling by with his mules and friends. It&apos;s just life
              here.
            </p>
          </div>
        </section>
        <section
          className="seven-sisters-section"
          aria-label="Historic photograph of the seven sisters and farm name"
        >
          <img
            src="/img/7sistersgirls.jpeg"
            alt="Historic photo of the seven sisters who lived in the brick house"
            className="hero-image"
            loading="lazy"
          />
          <p className="intro-text">
            Pictured are the seven sisters that lived in the brick house. The
            farm had stayed in the same family for more than 100 years until it
            was acquired in 2007 and further restored by Cathe Capel of Seven
            Sisters. Dustin and Karen were welcomed into the home in 2023, and
            the name of the farm was modified to{' '}
            <span className="accent-color">7</span>Sisters to reflect the new
            stewards of the property.
          </p>
        </section>
        {/* History Section */}
        <section className="history-section">
          <h2 className="section-title">A Brief History of the Brick House</h2>
          <p className="author-credit">by George Clark</p>
          <div className="history-content">
            <div className="history-text">
              <p>
                The brick house was built by James Michael and Mahalia Ann West.
                It was started in 1893 and finished in 1895. James Michael West
                farmed something in excess of 240 acres. In addition he operated
                a sawmill [built in the 1830s by George Akers, remains of the
                mill were on the property owned by James Michael West after
                1854] and a brickyard. James Michael's sawmill produced the wood
                used in the house. His brickyard made the bricks. He took a
                wagon load of lumber to Decatur to be dried and milled for the
                trim work. The parlor fireplace millwork is quarter sawn
                Sycamore. Oak and Pine trim the other rooms.
              </p>
              <p>
                The home is all brick construction; both load bearing interior
                and exterior walls are multiple courses of brick, not brick
                veneer as is common today. When the house was first finished in
                1895 it had central heat, a water system, an indoor bathroom
                complete with tub and commode and gas lights. When the original
                single pane windows were replaced with insulated double pane
                windows, the stained glass windows that were original to the
                house were reinstalled in front of the replacement windows.
              </p>
              <p>
                James Michael and Mahalia Ann West, my great grandparents, lived
                in the home until their death, at which time it passed to my
                grandparents James Harvey ("Harv") and Ruby West. They lived in
                the house until James Harvey's death. Ruby West continued to
                live in the house, until she could no longer care for it and
                moved in with her mother, my mother, Mary Clark. The house was
                then occupied by one of Ruby's grandchildren until her death, at
                which time the house passed to her daughter, Mary Clark. At this
                time, Theresa Rogers, Mary's granddaughter, my daughter, and her
                family occupied the home. The home became my property after my
                mother's death and I passed it on to Theresa. Theresa and her
                family lived in the home until her death.
              </p>
            </div>
            <figure className="parlor-image">
              <img
                src="/img/parlor_room.jpeg"
                alt="Historic parlor room featuring quarter sawn Sycamore fireplace millwork"
                loading="lazy"
              />
              <figcaption>
                The historic parlor room with original millwork
              </figcaption>
            </figure>
          </div>
        </section>
      </main>
    </div>
  )
}
