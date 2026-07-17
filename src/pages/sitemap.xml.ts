import { execSync } from 'node:child_process'
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

/** Real last-commit date for a source file, so lastmod reflects actual content changes rather than build time. */
function lastCommitDate(relativePath: string, fallback: Date): Date {
  try {
    const output = execSync(`git log -1 --format=%cI -- "${relativePath}"`, {
      cwd: process.cwd(),
      encoding: 'utf-8',
    }).trim()
    return output ? new Date(output) : fallback
  } catch {
    return fallback
  }
}

export const GET = () => {
  const now = new Date()

  const staticPages: SitemapEntry[] = [
    { url: BASE_URL, lastModified: lastCommitDate('src/pages/index.astro', now), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: lastCommitDate('src/pages/about.astro', now), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/7Sisters`, lastModified: lastCommitDate('src/pages/7Sisters.astro', now), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/Litters`, lastModified: lastCommitDate('src/pages/Litters.astro', now), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/Farm`, lastModified: lastCommitDate('src/pages/Farm.astro', now), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/BreedingPhilosophy`, lastModified: lastCommitDate('src/pages/BreedingPhilosophy.astro', now), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/CommonQuestions`, lastModified: lastCommitDate('src/lib/faqData.ts', now), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/archive`, lastModified: lastCommitDate('src/pages/archive.astro', now), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/GreatDaneGenomeBrowser`, lastModified: lastCommitDate('src/pages/GreatDaneGenomeBrowser.astro', now), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/PlacementProcess`, lastModified: lastCommitDate('src/pages/PlacementProcess.astro', now), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/EzraxPiper`, lastModified: lastCommitDate('src/pages/EzraxPiper.astro', now), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/contact`, lastModified: lastCommitDate('src/pages/contact.astro', now), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/SeanXPiper`, lastModified: lastCommitDate('src/pages/SeanXPiper.astro', now), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/RolexXPiper`, lastModified: lastCommitDate('src/pages/RolexXPiper.astro', now), changeFrequency: 'yearly', priority: 0.6 },
  ]

  const blogPosts: SitemapEntry[] = getAllPosts().map(post => ({
    url: `${BASE_URL}/posts/${post.id}`,
    lastModified: parsePostDateLocal(post.updated ?? post.date),
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
