import { getAllPosts } from '@/lib/api'
import ArchiveClient from '@/app/archive/ArchiveClient'

export const metadata = {
  title: 'HAB.education Articles & Interviews',
  description: 'Historical interviews, lessons, and data posts from the HAB.education project (2015-2017).',
}

export default async function Page() {
  const allPosts = await getAllPosts()
  const habPosts = allPosts.filter(p => p.categories?.includes('HAB.education'))

  return (
    <div className="content">
      <div className="post-title">
        <h1>HAB.education Articles & Interviews</h1>
        <p className="text-center text-gray-600 mt-2 text-sm">
          Historical content from the HAB.education project (2015-2017).
        </p>
      </div>
      <ArchiveClient posts={habPosts} />
    </div>
  )
}


