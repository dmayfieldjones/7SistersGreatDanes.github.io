// Define categories based on actual article content
export const getArticleCategory = (id: string, title: string) => {
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
  
  // Fallback for any future articles
  return 'General Care'
}

// Reading time based on actual word counts (225 words per minute)
export const getReadingTime = (id: string) => {
  const readingTimes: { [key: string]: string } = {
    '2025-06-23-more-than-show-and-go': '7 min read',      // 1,457 words
    '2025-06-24-laying-the-foundation': '11 min read',     // 2,418 words  
    '2025-06-25-choosing-a-great-dane-breeder': '14 min read', // 3,101 words
    '2025-07-03-the-first-year': '12 min read',            // 2,747 words
    '2025-07-17-feeding-your-growing-great-dane': '20 min read', // 4,397 words
    '2025-09-12-breeding-for-temperament-research-tools': '8 min read', // ~1,871 words
        '2025-10-01-the-deep-history-of-dogs-ancient-dna': '12 min read' // 2,647 words
  }
  return readingTimes[id] || '5 min read'
}

