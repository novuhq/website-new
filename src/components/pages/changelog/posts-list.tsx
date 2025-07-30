import { IChangelogPostData } from "@/types/changelog"
import { cn } from "@/lib/utils"

import LoadMore from "./load-more"
import PostsItem from "./post-item"

interface PostsListProps {
  className?: string
  posts: IChangelogPostData[]
  hasMore?: boolean
}

function PostsList({ posts, className, hasMore }: PostsListProps) {
  return (
    <section
      className={cn("posts-list -mt-0.5 pt-10 lg:pt-11 xl:pt-13", className)}
    >
      <div className="w-full px-5">
        <h2 className="sr-only">All changelog posts</h2>
        <ul
          className={cn(
            "relative mx-auto flex max-w-160 flex-col gap-22 lg:max-w-214 xl:max-w-246",
            "before:absolute before:-top-16 before:bottom-16 before:left-27 before:hidden before:w-px before:border-r before:border-dashed before:border-r-[#6f6077]/80 lg:before:block"
          )}
        >
          {posts.map((post, index) => (
            <li key={index}>
              <PostsItem {...post} />
            </li>
          ))}
        </ul>
        {hasMore ? (
          <LoadMore className="mx-auto mt-8 !flex md:mt-12 lg:translate-x-16 xl:translate-x-0" />
        ) : null}
      </div>
    </section>
  )
}

export default PostsList
