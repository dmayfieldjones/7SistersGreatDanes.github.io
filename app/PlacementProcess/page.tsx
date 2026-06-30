import { Metadata } from 'next'
import { SITE_MOTTO } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Great Dane Puppy Placement Process | 7Sisters Farm',
  description:
    'How puppy placement works at 7Sisters Farm: inquiry, conversation, thoughtful matching, and lifetime support.',
  keywords: [
    'Great Dane puppy placement',
    'Great Dane breeder process',
    'responsible Great Dane breeder',
    '7Sisters Farm puppies',
    'Great Dane waitlist',
    'Illinois Great Dane breeder',
  ],
  openGraph: {
    title: 'Great Dane Puppy Placement Process | 7Sisters Farm',
    description:
      'How puppy placement works at 7Sisters Farm — thoughtful matching and lifetime support.',
    type: 'website',
    url: 'https://7sistersgreatdanes.com/PlacementProcess',
    siteName: '7Sisters Farm',
  },
  alternates: {
    canonical: 'https://7sistersgreatdanes.com/PlacementProcess',
  },
}

const steps = [
  {
    title: 'Start with an inquiry',
    body: (
      <>
        Reach out through our{' '}
        <a href="/contact">contact form</a> or by email — a brief introduction
        about your experience, timeline, and what you are looking for. If you
        are still researching, our{' '}
        <a href="/CommonQuestions">Common Questions</a> and{' '}
        <a href="/posts/2025-06-25-choosing-a-great-dane-breeder">
          guide to finding a responsible breeder
        </a>{' '}
        are a good place to begin before you write.
      </>
    ),
  },
  {
    title: 'Detailed application & review',
    body: (
      <>
        If your inquiry looks like a potential fit, we follow up by email with a
        longer application about your household, lifestyle, and plans for a
        Great Dane. Once we receive it, we review your answers and get back to
        you to continue the conversation.
      </>
    ),
  },
  {
    title: 'Getting acquainted',
    body: (
      <>
        We follow up by phone, video call, or email — and when geography
        allows, we encourage a visit to meet our dogs. This is a chance to ask
        questions and make sure a Great Dane is the right fit for your home.
      </>
    ),
  },
  {
    title: 'Matching & timing',
    body: (
      <>
        We breed as part of an ongoing, carefully planned program, so you may
        be waiting for the right litter rather than a puppy available today.
        When puppies are on the ground, we match around 6–8 weeks based on
        temperament, structure, and fit — not the order inquiries arrived.
      </>
    ),
  },
  {
    title: 'Agreement & go-home',
    body: (
      <>
        When we agree on a match, we work through a customized contract
        covering health, spay/neuter expectations for pet homes, return policy,
        and responsibilities on both sides. Puppies usually go home between
        8–12 weeks. See{' '}
        <a href="/CommonQuestions">Common Questions</a> for what your purchase
        includes and go-home timing.
      </>
    ),
  },
  {
    title: 'Lifetime support',
    body: (
      <>
        Placement does not end at go-home. We offer lifetime breeder support,
        welcome updates on your dog, and our dogs always have a place with us
        if life circumstances change.
      </>
    ),
  },
]

export default function PlacementProcess() {
  return (
    <div className="content">
      <div className="post-title">
        <h1>Puppy Placement Process</h1>
      </div>
      <main className="content-wrapper">
        <section className="hero-section">
          <img
            src="/img/Colorlogo_nobackground.png"
            alt="7Sisters Farm Logo"
            width={300}
            height="auto"
            className="hero-logo"
            loading="lazy"
          />
        </section>
        <section className="intro-section">
          <p className="intro-motto">{SITE_MOTTO}</p>
          <p className="intro-lead">
            That is the goal behind every placement at{' '}
            <span className="brand-number">7</span>Sisters Farm. Here is how it
            works, from first contact through go-home and beyond.
          </p>
        </section>

        <section className="steps-section" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="section-title">
            Step by step
          </h2>
          <ol className="process-steps">
            {steps.map((step, index) => (
              <li key={step.title} className="process-step">
                <span className="step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="step-body">
                  <h3 className="step-title">{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="expect-section" aria-labelledby="expect-heading">
          <h2 id="expect-heading" className="section-title">
            What we look for in a home
          </h2>
          <ul className="expect-list">
            <li>Honest communication about your experience and expectations</li>
            <li>Patience — good matching takes time</li>
            <li>Commitment to staying in touch and honoring terms that protect the dog</li>
          </ul>
        </section>

        <section className="related-section" aria-labelledby="related-heading">
          <h2 id="related-heading" className="section-title">
            Related reading
          </h2>
          <ul className="related-links">
            <li>
              <a href="/CommonQuestions">Common Questions</a> — detailed FAQs
              on purchase details and breeder policies
            </li>
            <li>
              <a href="/Litters">Puppies &amp; Litters</a> — current and previous
              litters with parent health and pedigree detail
            </li>
            <li>
              <a href="/BreedingPhilosophy">Breeding Philosophy</a> — why we
              prioritize fit and breed betterment
            </li>
          </ul>
        </section>

        <section className="cta-section">
          <p>
            Ready to start a conversation?{' '}
            <a href="/contact" className="cta-button">
              Contact us
            </a>
          </p>
        </section>
      </main>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary-color: #bf141c;
              --text-color: #000;
              --spacing-unit: 1rem;
              --font-family: Arial, sans-serif;
            }
            .content-wrapper {
              max-width: 800px;
              margin: 0 auto;
              padding: calc(var(--spacing-unit) * 2);
              font-family: var(--font-family);
              line-height: 1.75;
              color: var(--text-color);
            }
            .hero-section {
              text-align: center;
              margin-bottom: calc(var(--spacing-unit) * 3);
            }
            .hero-logo {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
            .intro-motto {
              font-size: 1.2rem;
              font-weight: 600;
              font-style: italic;
              text-align: center;
              color: var(--primary-color);
              margin: 0 0 calc(var(--spacing-unit) * 1.25);
              letter-spacing: 0.01em;
            }
            .intro-lead {
              font-size: 1.12rem;
              margin: 0 0 calc(var(--spacing-unit) * 2);
              padding: var(--spacing-unit);
              border-left: 4px solid var(--primary-color);
              background: rgba(191, 20, 28, 0.05);
            }
            .brand-number { color: var(--primary-color); font-weight: 600; }
            .section-title {
              font-size: 1.75rem;
              color: var(--primary-color);
              margin: calc(var(--spacing-unit) * 2) 0 var(--spacing-unit);
              font-weight: 600;
            }
            .process-steps {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              gap: calc(var(--spacing-unit) * 1.25);
            }
            .process-step {
              display: flex;
              gap: calc(var(--spacing-unit) * 1.25);
              align-items: flex-start;
              padding: calc(var(--spacing-unit) * 1.25);
              border: 1px solid rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              background: #fafafa;
            }
            .step-number {
              flex-shrink: 0;
              width: 2rem;
              height: 2rem;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              background: var(--primary-color);
              color: #fff;
              font-weight: 700;
              font-size: 0.95rem;
            }
            .step-body { min-width: 0; }
            .step-title {
              margin: 0 0 0.5rem;
              font-size: 1.1rem;
              color: var(--primary-color);
            }
            .step-body p { margin: 0; font-size: 1rem; }
            .step-body a, .related-links a, .cta-section a {
              color: var(--primary-color);
              font-weight: 600;
            }
            .step-body a:hover, .related-links a:hover { text-decoration: underline; }
            .expect-list, .related-links {
              margin: 0;
              padding-left: 1.25rem;
            }
            .expect-list li, .related-links li {
              margin-bottom: 0.65rem;
            }
            .cta-section {
              margin-top: calc(var(--spacing-unit) * 3);
              text-align: center;
              padding: calc(var(--spacing-unit) * 1.5);
              background: rgba(191, 20, 28, 0.05);
              border-radius: 8px;
            }
            .cta-section p { margin: 0; font-size: 1.1rem; }
            .cta-button {
              display: inline-block;
              margin-left: 0.35rem;
              padding: 0.5rem 1.25rem;
              background: var(--primary-color);
              color: #fff !important;
              border-radius: 6px;
              text-decoration: none;
            }
            .cta-button:hover {
              background: #8f0f15;
              text-decoration: none;
            }
            @media (max-width: 768px) {
              .content-wrapper { padding: var(--spacing-unit); }
              .section-title { font-size: 1.5rem; }
              .process-step { flex-direction: column; gap: 0.75rem; }
            }
          `,
        }}
      />
    </div>
  )
}
