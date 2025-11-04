import { getPostById, getAllPosts } from '@/lib/api'
import Container from '@/components/container'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug';
import { getArticleCategory, getReadingTime } from '@/app/archive/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { title, date, content } = await getPostById(id)
  
  // Extract description from content (first 160 characters)
  const description = content
    .replace(/[#*`\[\]()]/g, '') // Remove markdown formatting
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()
    .substring(0, 160) + '...'
  
  const category = getArticleCategory(id, title)
  const readingTime = getReadingTime(id)
  
  // Generate keywords based on content and category
  const keywords = [
    'Great Dane',
    'dog breeding',
    'dog care',
    category.toLowerCase(),
    ...title.toLowerCase().split(' ').filter(word => word.length > 3)
  ].join(', ')

  return {
    title: `${title} | 7Sisters Farm`,
    description,
    keywords,
    authors: [{ name: 'Dustin Mayfield-Jones' }],
    openGraph: {
      title: `${title} | 7Sisters Farm`,
      description,
      type: 'article',
      publishedTime: new Date(date).toISOString(),
      authors: ['Dustin Mayfield-Jones'],
      tags: [category, 'Great Dane', 'dog breeding'],
      images: [
        {
          url: 'https://mayfieldjones.com/img/logo.png',
          width: 200,
          height: 200,
          alt: '7Sisters Farm Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | 7Sisters Farm`,
      description,
      images: ['https://mayfieldjones.com/img/logo.png'],
    },
    alternates: {
      canonical: `https://mayfieldjones.com/posts/${id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { content, title, date, tags, categories } = await getPostById(id)
  
  const category = getArticleCategory(id, title)
  const isHab = (categories || []).includes('HAB.education')
  const readingTime = getReadingTime(id)
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": content.replace(/[#*`\[\]()]/g, '').replace(/\n/g, ' ').trim().substring(0, 160) + '...',
    "image": "https://mayfieldjones.com/img/logo.png",
    "author": {
      "@type": "Person",
      "name": "Dustin Mayfield-Jones",
      "url": "https://mayfieldjones.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "7Sisters Farm",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mayfieldjones.com/img/logo.png"
      }
    },
    "datePublished": new Date(date).toISOString(),
    "dateModified": new Date(date).toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://mayfieldjones.com/posts/${id}`
    },
    "articleSection": category,
    "keywords": ["Great Dane", "dog breeding", "dog care", category.toLowerCase()],
    "wordCount": content.split(' ').length,
    "timeRequired": readingTime,
    "inLanguage": "en-US"
  }
  
  // Process content to replace 7Sisters with styled version
  // But avoid replacing inside Markdown links
  let processedContent = content;
  
  // First, temporarily replace Markdown links to protect them
  const linkPlaceholders: string[] = [];
  processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    linkPlaceholders.push(match);
    return `__LINK_PLACEHOLDER_${linkPlaceholders.length - 1}__`;
  });
  
  // Now replace 7Sisters with styled version
  processedContent = processedContent.replace(
    /7Sisters/g,
    '<span style="color: #bf141c; font-weight: 600;">7</span>Sisters'
  );
  
  // Restore the original links
  linkPlaceholders.forEach((link, index) => {
    processedContent = processedContent.replace(`__LINK_PLACEHOLDER_${index}__`, link);
  });
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="content">
        <div className="post-title">
          <h1>
            {title}
          </h1>
          <div className="post-meta">
            <span className="post-date">{new Date(date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            {tags && tags.length > 0 ? (
              <div className="post-tags">
                {tags.map((tag: string, index: number) => (
                  <span key={index} className="post-tag">{tag}</span>
                ))}
              </div>
            ) : (
              <span className="post-category">{category}</span>
            )}
            <span className="post-reading-time">{readingTime}</span>
          </div>
        </div>
      
      <main className="content-wrapper">
        <article className="blog-content">
          <Markdown 
            rehypePlugins={[rehypeRaw, rehypeSlug]}
            components={{
              // Allow HTML elements to be rendered
              details: ({ children, ...props }) => <details {...props}>{children}</details>,
              summary: ({ children, ...props }) => <summary {...props}>{children}</summary>,
            }}
          >
            {processedContent}
          </Markdown>
        </article>
        {!isHab && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="/BreedingPhilosophy">
              Curious about our breeding philosophy and how we select our dogs? Visit our <strong>Breeding Philosophy</strong> page.
            </a>
          </div>
        )}
        {isHab && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="/hab/archive">
              Looking for more HAB.education content? Browse the <strong>HAB Articles & Interviews</strong>.
            </a>
          </div>
        )}
        
        {/* Related Articles Section */}
        <div className="related-articles" style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
          <h3 style={{ color: '#bf141c', marginBottom: '1rem' }}>Related Articles</h3>
          {!isHab && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="/posts/2025-06-25-choosing-a-great-dane-breeder" style={{ color: '#bf141c', textDecoration: 'none' }}>
                → The Family's Guide to Choosing a Great Dane Breeder
              </a>
              <a href="/posts/2025-07-03-the-first-year" style={{ color: '#bf141c', textDecoration: 'none' }}>
                → The First Year: A Comprehensive Guide to Great Dane Puppy Development
              </a>
              <a href="/posts/2025-06-24-laying-the-foundation" style={{ color: '#bf141c', textDecoration: 'none' }}>
                → Laying the Foundation: Our Breeding Philosophy
              </a>
            </div>
          )}
          {isHab && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="/hab/interviews" style={{ color: '#bf141c', textDecoration: 'none' }}>
                → HAB.education Interviews
              </a>
              <a href="/hab/data" style={{ color: '#bf141c', textDecoration: 'none' }}>
                → Balloon Data Visualization
              </a>
              <a href="/hab/lessons" style={{ color: '#bf141c', textDecoration: 'none' }}>
                → Educational Programs & Lessons
              </a>
            </div>
          )}
        </div>
      </main>
      
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary-color: #bf141c;
              --text-color: #000000;
              --background-color: #ffffff;
              --accent-bg-color: #f8f8f8;
              --border-color: #e0e0e0;
              --hover-color: #f0f0f0;
              --spacing-unit: 0.5rem;
              --font-family: Arial, sans-serif;
              --transition-speed: 0.3s;
            }
            
            .content {
              max-width: 800px;
              margin: 0 auto;
              padding: calc(var(--spacing-unit) * 2);
              font-family: var(--font-family);
              line-height: 1.6;
              color: var(--text-color);
              background-color: var(--background-color);
            }
            
            .post-title {
              text-align: center;
              margin-bottom: calc(var(--spacing-unit) * 3);
            }
            
            .post-title h1 {
              font-size: 2.5rem;
              color: var(--primary-color);
              margin-bottom: calc(var(--spacing-unit) * 0.5);
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            
            .post-meta {
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
              justify-content: center;
              align-items: center;
              margin-top: 0.5rem;
            }
            
            .post-date {
              font-size: 1.1rem;
              color: #666;
              font-style: italic;
            }
            
            .post-category {
              background-color: #bf141c;
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.9rem;
              font-weight: 600;
            }
            
            .post-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              justify-content: center;
            }
            
            .post-tag {
              background-color: #bf141c;
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.9rem;
              font-weight: 600;
            }
            
            .post-reading-time {
              color: #666;
              font-size: 0.9rem;
              font-style: italic;
            }
            
            .content-wrapper {
              max-width: 800px;
              margin: 0 auto;
              font-family: var(--font-family);
              line-height: 1.6;
              color: var(--text-color);
              background-color: var(--background-color);
            }
            
            .blog-content {
              font-size: 1.1rem;
              line-height: 1.8;
            }
            
            .blog-content h1,
            .blog-content h2,
            .blog-content h3,
            .blog-content h4,
            .blog-content h5,
            .blog-content h6 {
              color: var(--text-color);
              margin-top: calc(var(--spacing-unit) * 2);
              margin-bottom: var(--spacing-unit);
              font-weight: 600;
            }
            
            .blog-content h1 {
              font-size: 2rem;
              border-bottom: 2px solid var(--border-color);
              padding-bottom: calc(var(--spacing-unit) * 0.5);
            }
            
            .blog-content h2 {
              font-size: 1.75rem;
              border-left: 4px solid var(--border-color);
              padding-left: var(--spacing-unit);
            }
            
            .blog-content h3 {
              font-size: 1.5rem;
            }
            
            .blog-content h4 {
              font-size: 1.25rem;
            }
            
            .blog-content p {
              margin-bottom: calc(var(--spacing-unit) * 1.5);
              text-align: justify;
            }
            
            .blog-content strong {
              color: var(--text-color);
              font-weight: 600;
            }
            
            .blog-content em {
              font-style: italic;
              color: #666;
            }
            
            .blog-content ul,
            .blog-content ol {
              margin-bottom: calc(var(--spacing-unit) * 1.5);
              padding-left: calc(var(--spacing-unit) * 2);
            }
            
            .blog-content li {
              margin-bottom: calc(var(--spacing-unit) * 0.5);
            }
            
            .blog-content blockquote {
              border-left: 4px solid var(--border-color);
              padding-left: var(--spacing-unit);
              margin: calc(var(--spacing-unit) * 2) 0;
              font-style: italic;
              background-color: var(--accent-bg-color);
              padding: var(--spacing-unit);
              border-radius: 4px;
            }
            
            .blog-content code {
              background-color: var(--accent-bg-color);
              padding: calc(var(--spacing-unit) * 0.25) calc(var(--spacing-unit) * 0.5);
              border-radius: 3px;
              font-family: monospace;
              color: var(--text-color);
            }
            
            .blog-content pre {
              background-color: var(--accent-bg-color);
              padding: var(--spacing-unit);
              border-radius: 4px;
              overflow-x: auto;
              margin: calc(var(--spacing-unit) * 1.5) 0;
            }
            
            .blog-content pre code {
              background-color: transparent;
              padding: 0;
              color: var(--text-color);
            }
            
            .blog-content a {
              color: var(--primary-color);
              text-decoration: none;
              transition: color var(--transition-speed) ease;
            }
            
            .blog-content a:hover {
              color: #8f0f15;
              text-decoration: underline;
            }
            
            /* Accordion Styles - matching Common Questions */
            .blog-content details {
              margin: calc(var(--spacing-unit) * 1.5) 0;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              overflow: hidden;
              background-color: var(--background-color);
            }
            
            .blog-content summary {
              background-color: var(--accent-bg-color);
              padding: var(--spacing-unit);
              cursor: pointer;
              font-weight: 600;
              color: var(--text-color);
              transition: background-color var(--transition-speed) ease;
              display: flex;
              justify-content: space-between;
              align-items: center;
              user-select: none;
            }
            
            .blog-content summary:hover {
              background-color: var(--hover-color);
            }
            
            .blog-content summary::after {
              content: '+';
              font-size: 1.2rem;
              font-weight: bold;
              color: var(--primary-color);
              transition: transform var(--transition-speed) ease;
            }
            
            .blog-content details[open] summary::after {
              content: '−';
              transform: rotate(180deg);
            }
            
            .blog-content details[open] summary {
              border-bottom: 1px solid var(--border-color);
            }
            
            .blog-content details > div {
              padding: var(--spacing-unit);
            }
            
            .blog-content details > *:not(summary) {
              padding: var(--spacing-unit);
            }
            
            .accent-color {
              color: var(--primary-color);
              font-weight: 600;
            }
            
            @media (max-width: 768px) {
              .content {
                padding: var(--spacing-unit);
              }
              
              .post-title h1 {
                font-size: 2rem;
              }
              
              .blog-content {
                font-size: 1rem;
              }
              
              .blog-content h1 {
                font-size: 1.75rem;
              }
              
              .blog-content h2 {
                font-size: 1.5rem;
              }
              
              .blog-content summary {
                padding: calc(var(--spacing-unit) * 0.75);
                font-size: 0.9rem;
              }
            }
            
            @media print {
              .blog-content {
                font-size: 12pt;
                line-height: 1.6;
              }
              
              .post-title h1 {
                font-size: 18pt;
              }
              
              .blog-content details {
                border: none;
              }
              
              .blog-content summary {
                background-color: transparent;
                border-bottom: 1px solid var(--border-color);
              }
            }
          `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Replace "7Sisters" with styled version
            function replace7Sisters() {
              const content = document.querySelector('.blog-content');
              if (content) {
                // Walk through all text nodes and replace 7Sisters
                const walker = document.createTreeWalker(
                  content,
                  NodeFilter.SHOW_TEXT,
                  null,
                  false
                );
                
                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                  textNodes.push(node);
                }
                
                textNodes.forEach(textNode => {
                  const text = textNode.textContent;
                  if (text.includes('7Sisters')) {
                    const span = document.createElement('span');
                    span.innerHTML = text.replace(
                      /7Sisters/g,
                      '<span style="color: #bf141c; font-weight: 600;">7</span>Sisters'
                    );
                    textNode.parentNode.replaceChild(span, textNode);
                  }
                });
                
                console.log('7Sisters replacement completed');
              }
            }
            
            // Try multiple times to ensure content is loaded
            document.addEventListener('DOMContentLoaded', function() {
              replace7Sisters();
              
              // Also try after a short delay to ensure Markdown is processed
              setTimeout(replace7Sisters, 100);
              setTimeout(replace7Sisters, 500);
              setTimeout(replace7Sisters, 1000);
            });
            
            // Also try when the page is fully loaded
            window.addEventListener('load', function() {
              replace7Sisters();
              setTimeout(replace7Sisters, 100);
            });
            
            // Use MutationObserver to catch any dynamic content changes
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                  replace7Sisters();
                }
              });
            });
            
            // Start observing once the content is available
            setTimeout(function() {
              const content = document.querySelector('.blog-content');
              if (content) {
                observer.observe(content, { childList: true, subtree: true });
              }
            }, 1000);
              
            // Add accordion functionality
            const details = document.querySelectorAll('.blog-content details');
            details.forEach(detail => {
              const summary = detail.querySelector('summary');
              if (summary) {
                summary.addEventListener('click', function(e) {
                  // Prevent default behavior to handle manually
                  e.preventDefault();
                  
                  // Close other open details
                  details.forEach(otherDetail => {
                    if (otherDetail !== detail && otherDetail.open) {
                      otherDetail.open = false;
                    }
                  });
                  
                  // Toggle current detail
                  detail.open = !detail.open;
                });
              }
            });
          `,
        }}
      />
      </div>
    </>
  )
}

export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map(post => ({
    id: post.id,
  }))
}
