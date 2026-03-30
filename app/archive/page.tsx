import { getAllPosts } from '@/lib/api'
import ArchiveClient from './ArchiveClient'

export const metadata = {
  title: 'Great Dane Articles and Insights',
  description: 'Comprehensive guides and practical knowledge on Great Dane breeding, care, development, and ownership.',
}

export default async function Page() {
  const allPosts = await getAllPosts()

  return (
    <div className="content">
      <div className="post-title">
        <h1>Great Dane Articles and Insights</h1>
        <p className="text-center text-gray-600 mt-2 text-sm max-w-2xl mx-auto">
          Practical guides for puppy buyers sit up front; longer science- and kennel-focused pieces follow.
        </p>
      </div>
      <main className="content-wrapper">
        {/* Hero Section */}
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
        <ArchiveClient posts={allPosts} />
      </main>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-section {
              text-align: center;
              margin-bottom: 2rem;
            }
            .hero-logo {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
          `,
        }}
      />
    </div>
  )
}
