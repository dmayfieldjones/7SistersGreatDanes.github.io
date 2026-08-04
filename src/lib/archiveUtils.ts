/** Puppy-buyer essentials: feeding, development, choosing a breeder. */
const START_HERE_IDS = new Set([
  '2025-07-17-feeding-your-growing-great-dane',
  '2025-07-03-the-first-year',
  '2025-06-25-choosing-a-great-dane-breeder',
])

export function isStartHerePost(id: string): boolean {
  return START_HERE_IDS.has(id)
}

export function partitionArchivePosts<T extends { id: string }>(posts: T[]): {
  startHere: T[]
  deepDives: T[]
} {
  const startHere: T[] = []
  const deepDives: T[] = []
  for (const post of posts) {
    if (isStartHerePost(post.id)) startHere.push(post)
    else deepDives.push(post)
  }
  return { startHere, deepDives }
}

function sortPostsByDate<T extends { date: string }>(posts: T[], order: 'newest' | 'oldest'): T[] {
  const sorted = [...posts]
  sorted.sort((a, b) =>
    order === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
  )
  return sorted
}

export function sortArchiveSections<T extends { id: string; date: string }>(
  posts: T[],
  order: 'newest' | 'oldest',
): { startHere: T[]; deepDives: T[] } {
  const { startHere, deepDives } = partitionArchivePosts(posts)
  return {
    startHere: sortPostsByDate(startHere, order),
    deepDives: sortPostsByDate(deepDives, order),
  }
}

// Define categories based on actual article content
export const getArticleCategory = (id: string, _title: string) => {
  // Specific article mappings based on actual content
  if (id === '2025-06-23-more-than-show-and-go') {
    return 'Community & Show Experience'
  }
  if (id === '2025-06-24-laying-the-foundation') {
    return 'Breeding Philosophy'
  }
  if (id === '2025-06-25-choosing-a-great-dane-breeder') {
    return 'Breeder Selection Guide'
  }
  if (id === '2025-07-03-the-first-year') {
    return 'Puppy Development'
  }
  if (id === '2025-07-17-feeding-your-growing-great-dane') {
    return 'Nutrition & Feeding'
  }
  if (id === '2025-09-12-breeding-for-temperament-research-tools') {
    return 'Breeding Science'
  }
  if (id === '2025-10-01-the-deep-history-of-dogs-ancient-dna') {
    return 'Breeding Science'
  }
  if (id === '2026-03-28-the-deep-history-of-dogs-palaeolithic-partners') {
    return 'Breeding Science'
  }
  // Fallback for any future articles
  return 'General Care'
}

// Reading time based on actual word counts (225 words per minute)
export const getReadingTime = (id: string) => {
  const readingTimes: { [key: string]: string } = {
    '2025-06-23-more-than-show-and-go': '7 min read', // 1,457 words
    '2025-06-24-laying-the-foundation': '6 min read', // ~1,361 words
    '2025-06-25-choosing-a-great-dane-breeder': '14 min read', // 3,101 words
    '2025-07-03-the-first-year': '12 min read', // 2,747 words
    '2025-07-17-feeding-your-growing-great-dane': '20 min read', // 4,397 words
    '2025-09-12-breeding-for-temperament-research-tools': '9 min read', // ~1,930 words
    '2025-10-01-the-deep-history-of-dogs-ancient-dna': '12 min read', // 2,647 words
    '2026-03-28-the-deep-history-of-dogs-palaeolithic-partners': '14 min read',
  }
  return readingTimes[id] || '5 min read'
}
