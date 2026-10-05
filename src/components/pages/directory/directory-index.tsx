import { directoryIndexContent } from "@/content/directory"

import type { DirectoryPost } from "@/lib/directory"

import DirectoryPostsList from "./directory-posts-list"

interface DirectoryIndexProps {
  posts: DirectoryPost[]
}

export default function DirectoryIndex({ posts }: DirectoryIndexProps) {
  return (
    <section
      className="-mt-16 px-4 pt-28 pb-24 md:px-7 md:pt-[130px] md:pb-[136px] lg:pt-[138px] lg:pb-[152px] xl:pt-[154px] xl:pb-44"
      aria-labelledby="directory-heading"
    >
      <div className="mx-auto max-w-240">
        <h1
          className="mx-auto text-center text-[32px] leading-[1.125] font-medium tracking-tighter md:text-5xl lg:text-[52px] xl:text-[56px]"
          id="directory-heading"
        >
          {directoryIndexContent.title}
        </h1>
        <p className="mx-auto mt-3 max-w-98 text-center text-sm leading-normal font-book tracking-tighter text-gray-8 md:mt-3.5 md:text-base xl:mt-4 xl:text-lg">
          {directoryIndexContent.description}
        </p>
        {posts.length > 0 ? (
          <DirectoryPostsList
            className="mt-8 md:mt-10 lg:mt-[54px] xl:mt-[62px]"
            posts={posts}
            priorityFirst
          />
        ) : (
          <p className="mt-10 text-center text-lg leading-normal tracking-tighter text-gray-8">
            No templates found
          </p>
        )}
      </div>
    </section>
  )
}
