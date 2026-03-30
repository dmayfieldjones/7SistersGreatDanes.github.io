'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { formatPostDateEnUS } from '@/lib/postDate'
import { getArticleCategory, getReadingTime, sortArchiveSections } from './utils'

interface Post {
  id: string
  date: string
  title: string
  content: string
  tags?: string[]
  categories?: string[]
}

interface ArchiveClientProps {
  posts: Post[]
}

function splitTitle(title: string): { mainTitle: string; subtitle: string } {
  if (title.includes(': ')) {
    const parts = title.split(': ')
    return { mainTitle: parts[0], subtitle: parts.slice(1).join(': ') }
  }
  if (title.includes(' - ')) {
    const parts = title.split(' - ')
    return { mainTitle: parts[0], subtitle: parts.slice(1).join(' - ') }
  }
  return { mainTitle: title, subtitle: '' }
}

function ArticleCard({ post }: { post: Post }) {
  const { id, date, title } = post
  const category = getArticleCategory(id, title)
  const readingTime = getReadingTime(id)
  const { mainTitle, subtitle } = splitTitle(title)

  return (
    <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-3">
            {post.tags && post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 5).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 5 && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-700">
                    +{post.tags.length - 5} more
                  </span>
                )}
              </div>
            ) : (
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                {category}
              </span>
            )}
          </div>

          <Link href={`/posts/${id}`} className="block group">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
              {mainTitle}
            </h3>
            {subtitle && <p className="text-base sm:text-lg text-gray-600 mb-3">{subtitle}</p>}
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">📅 {formatPostDateEnUS(date)}</span>
            <span className="flex items-center">⏱️ {readingTime}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:ml-4">
          {id === '2025-06-25-choosing-a-great-dane-breeder' && (
            <a
              href="/breeder-evaluation-checklist.pdf"
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors text-center"
              style={{ color: 'white' }}
              download
            >
              Download Checklist
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function ArchiveClient({ posts }: ArchiveClientProps) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const { startHere, deepDives } = useMemo(
    () => sortArchiveSections(posts, sortOrder),
    [posts, sortOrder],
  )

  return (
    <div className="archive-client">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <p className="text-sm text-gray-600 max-w-2xl">
          Articles are grouped so you can jump to what matches why you&apos;re here—practical puppy and
          breeder guidance first, then longer science- and kennel-focused pieces.
        </p>
        <div className="shrink-0">
          <label htmlFor="archive-sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort each section
          </label>
          <select
            id="archive-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      <section className="mb-12" aria-labelledby="archive-start-here">
        <h2 id="archive-start-here" className="text-2xl font-bold text-gray-900 mb-1">
          Start here
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-3xl">
          New to Great Danes or still choosing a breeder? These walk through nutrition, the first year,
          and how to evaluate breeders—including a downloadable checklist.
        </p>
        <div className="space-y-6">
          {startHere.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="mb-8" aria-labelledby="archive-deep-dives">
        <h2 id="archive-deep-dives" className="text-2xl font-bold text-gray-900 mb-1">
          Deep dives &amp; more
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-3xl">
          Ancient DNA and domestication, temperament research, how we think about breeding and early
          litters—and a club story for readers who want the longer pieces.
        </p>
        <div className="space-y-6">
          {deepDives.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
