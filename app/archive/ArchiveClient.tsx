'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { getArticleCategory, getReadingTime } from './utils'

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

export default function ArchiveClient({ posts }: ArchiveClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(posts.map(post => getArticleCategory(post.id, post.title)))]
    return cats
  }, [posts])
  
  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => getArticleCategory(post.id, post.title) === selectedCategory)
    }
    
    // Sort by date
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
    })
    
    return sorted
  }, [posts, selectedCategory, sortOrder])

  return (
    <main className="content-wrapper">
      {/* Filter Controls */}
      <div className="filter-controls mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Category Filter */}
          <div className="flex-1">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Topic:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Topics' : category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort Order */}
          <div className="flex-1">
            <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-2">
              Sort by Date:
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSortedPosts.length} of {posts.length} articles
        </div>
      </div>

      {/* Articles Grid */}
      <section className="space-y-6">
        {filteredAndSortedPosts.map(post => {
          const { id, date, title } = post
          const category = getArticleCategory(id, title)
          const readingTime = getReadingTime(id)
          
          // Split title into main title and subtitle
          let mainTitle = title
          let subtitle = ""
          
          // Check for common subtitle patterns
          if (title.includes(": ")) {
            const parts = title.split(": ")
            mainTitle = parts[0]
            subtitle = parts.slice(1).join(": ")
          } else if (title.includes(" - ")) {
            const parts = title.split(" - ")
            mainTitle = parts[0]
            subtitle = parts.slice(1).join(" - ")
          }
          
          return (
            <article key={id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-white">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Tags */}
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
                  
                  {/* Article Link */}
                  <Link href={`/posts/${id}`} className="block group">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                      {mainTitle}
                    </h2>
                    {subtitle && (
                      <p className="text-lg text-gray-600 mb-3">
                        {subtitle}
                      </p>
                    )}
                  </Link>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      📅 {new Date(date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center">
                      ⏱️ {readingTime}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 lg:ml-4">
                  {/* Checklist download button for the breeder guide */}
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
        })}
      </section>
      
      {/* No Results Message */}
      {filteredAndSortedPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found for the selected filters.</p>
          <button 
            onClick={() => {
              setSelectedCategory('all')
              setSortOrder('newest')
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  )
}
