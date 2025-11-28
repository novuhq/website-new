import { type IPost } from "@/types/blog"
import { cn } from "@/lib/utils"

import PostCard from "./post-card"

interface IPostsListProps {
  className?: string
  title?: string
  posts: IPost[]
  authorsPosition?: "left" | "bottom"
}

function PostsList({
  className,
  title,
  posts,
  authorsPosition = "bottom",
}: IPostsListProps) {
  return (
    <section className={cn("posts-list--column flex flex-col", className)}>
      {title && <h2 className="sr-only">{title}</h2>}
      <div className="flex flex-col gap-y-12 md:gap-y-14">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} authorsPosition={authorsPosition} />
        ))}
      </div>
    </section>
  )
}

export default PostsList
