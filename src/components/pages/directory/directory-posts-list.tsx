import type { DirectoryPost } from "@/lib/directory"
import { cn } from "@/lib/utils"

import DirectoryCard from "./directory-card"

interface DirectoryPostsListProps {
  className?: string
  headingLevel?: 2 | 3
  posts: DirectoryPost[]
  priorityFirst?: boolean
}

export default function DirectoryPostsList({
  className,
  headingLevel = 2,
  posts,
  priorityFirst = false,
}: DirectoryPostsListProps) {
  return (
    <ul
      className={cn(
        "mx-auto grid max-w-110 grid-cols-1 gap-y-4.5 sm:max-w-176 sm:grid-cols-2 sm:gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-5",
        className
      )}
    >
      {posts.map((post, index) => (
        <DirectoryCard
          key={post.slug}
          headingLevel={headingLevel}
          post={post}
          priority={priorityFirst && index === 0}
        />
      ))}
    </ul>
  )
}
