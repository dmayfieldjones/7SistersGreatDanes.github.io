import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), '_posts')

function getPostFiles() {
  return fs.readdirSync(postsDirectory)
}

/** ISO date string YYYY-MM-DD from YAML frontmatter (Date or string). */
function frontmatterDateToIsoDay(value: unknown): string | undefined {
  if (value == null || value === '') return undefined
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const s = String(value).trim()
  if (!s) return undefined
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return s.slice(0, 10)
}

export async function getPostById(id: string) {
  const realId = id.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, `${realId}.md`)
  const { data, content } = matter(await fs.promises.readFile(fullPath, 'utf8'))
  const date = data.date as Date
  const updated = frontmatterDateToIsoDay(data.updated)

  return {
    ...data,
    title: data.title as string,
    id: realId,
    date: date.toISOString().slice(0, 10),
    ...(updated ? { updated } : {}),
    description:
      typeof data.description === 'string' ? data.description : undefined,
    content,
    tags: data.tags || [],
    categories: data.categories || [],
  }
}

export async function getPageMarkdown(string_: string) {
  const { data, content } = matter(
    fs.readFileSync(path.join('_pages', string_), 'utf8'),
  )

  return {
    ...data,
    html: content,
  }
}

export async function getAllPosts() {
  const posts = await Promise.all(getPostFiles().map(id => getPostById(id)))
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}
