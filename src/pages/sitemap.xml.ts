import { getAllPosts } from '../lib/api'
import { parsePostDateLocal } from '../lib/postDate'

const BASE_URL = 'https://7sistersgreatdanes.com'

interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'yearly' | 'monthly' | 'weekly'
  priority: number
}

function toUrlXml(entry: SitemapEntry): string {
  return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
}

export const GET = () => {
  const now = new Date()

  const staticPages: SitemapEntry[] = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/7Sisters`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/Litters`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/Farm`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/BreedingPhilosophy`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/CommonQuestions`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/archive`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/GreatDaneGenomeBrowser`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/PlacementProcess`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/EzraxPiper`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/SeanXPiper`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/RolexXPiper`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const blogPosts: SitemapEntry[] = getAllPosts().map(post => ({
    url: `${BASE_URL}/posts/${post.id}`,
    lastModified: parsePostDateLocal(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...blogPosts].map(toUrlXml).join('\n')}
</urlset>
`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
