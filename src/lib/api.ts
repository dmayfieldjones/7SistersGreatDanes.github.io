// Post API for Astro (import.meta.glob over src/_posts/*.md)
import { normalizeValidIsoCalendarDay } from './postDate'

interface Frontmatter {
  title: string
  date: string | Date
  updated?: string | Date
  description?: string
  tags?: string[]
  categories?: string[]
  featured?: boolean
}

interface PostModule {
  frontmatter: Frontmatter
  default: unknown
}

const postModules = import.meta.glob<PostModule>('/src/_posts/*.md', {
  eager: true,
})

/** ISO date string YYYY-MM-DD from frontmatter (Date or string). Invalid → undefined. */
function toIsoDay(value: string | Date | undefined): string | undefined {
  if (value == null || value === '') {
    return undefined
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? undefined
      : value.toISOString().slice(0, 10)
  }
  const s = String(value).trim()
  if (!s) {
    return undefined
  }
  const strict = normalizeValidIsoCalendarDay(s)
  if (strict !== undefined) {
    return strict
  }
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10)
}

function toId(path: string) {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

export interface Post {
  id: string
  title: string
  date: string
  updated?: string
  description?: string
  tags: string[]
  categories: string[]
  featured?: boolean
}

function toMeta(path: string, frontmatter: Frontmatter): Post {
  return {
    id: toId(path),
    title: frontmatter.title,
    date: toIsoDay(frontmatter.date) ?? '',
    updated: toIsoDay(frontmatter.updated),
    description:
      typeof frontmatter.description === 'string'
        ? frontmatter.description
        : undefined,
    tags: frontmatter.tags ?? [],
    categories: frontmatter.categories ?? [],
    featured: frontmatter.featured,
  }
}

export function getAllPosts(): Post[] {
  return Object.entries(postModules)
    .map(([path, module]) => toMeta(path, module.frontmatter))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostById(id: string) {
  const module = postModules[`/src/_posts/${id}.md`]
  if (!module) {
    throw new Error(`Post not found: ${id}`)
  }
  return {
    ...toMeta(`/src/_posts/${id}.md`, module.frontmatter),
    Content: module.default,
  }
}
