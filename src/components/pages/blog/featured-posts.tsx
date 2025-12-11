import Image from "next/image"

import { IPost } from "@/types/blog"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import Authors from "@/components/pages/authors"
import CategoryAndDate from "@/components/pages/blog/category-and-date"

interface IFeaturedPostProps {
  className?: string
  posts: IPost[]
}

function FeaturedPost({ className, posts }: IFeaturedPostProps) {
  if (posts.length === 0) {
    return null
  }

  const [featuredPost, ...restPosts] = posts.slice(0, 4)

  return (
    <section className={cn("featured-posts", className)}>
      <h2 className="sr-only">Featured posts</h2>
      <div className="lg grid grid-cols-1 gap-x-16 gap-y-0 md:grid-cols-[22rem_auto] md:gap-y-12 lg:grid-cols-[26rem_auto] xl:grid-cols-[30rem_auto]">
        <article className="flex flex-col border-b border-border pb-6 md:border-b-0 md:pb-0">
          <Link
            className="shrink-0 overflow-hidden rounded-lg"
            variant="clean"
            size="none"
            href={featuredPost.url}
          >
            <Image
              className="w-full object-cover"
              src={featuredPost.cover}
              width={480}
              height={270}
              quality={100}
              sizes="(max-width: 768px) 100vw, 960px"
              alt=""
              priority
            />
            <span className="sr-only">Read post {featuredPost.title}</span>
          </Link>
          <CategoryAndDate
            className="mt-6 md:hidden"
            category={featuredPost.category}
            publishedAt={featuredPost.publishedAt}
          />
          <h1 className="mt-3 md:mt-4">
            <Link
              className="line-clamp-3 text-2xl/dense font-medium text-pretty hover:text-gray-9 md:text-[1.75rem] lg:line-clamp-2 lg:text-[2rem]"
              variant="white"
              href={featuredPost.url}
            >
              {featuredPost.title}
            </Link>
          </h1>
          <Authors
            className="mt-4 shrink-0 md:hidden"
            authors={featuredPost.authors}
            size="sm"
          />
        </article>
        <div className="flex flex-col gap-y-0 md:gap-y-8">
          {restPosts.map(
            ({ title, category, publishedAt, url, authors }, index) => (
              <article
                className="flex flex-col border-b border-border py-6 md:border-b-0 md:py-0"
                key={index}
              >
                <CategoryAndDate
                  className="hidden md:flex"
                  category={category}
                  publishedAt={publishedAt}
                />
                <CategoryAndDate
                  className="md:hidden"
                  category={category}
                  publishedAt={publishedAt}
                />
                <h1 className="mt-3">
                  <Link
                    className="tracking-dense line-clamp-2 text-2xl/dense font-medium text-pretty hover:text-gray-9 md:text-xl/snug"
                    variant="white"
                    href={url}
                  >
                    {title}
                  </Link>
                </h1>
                <Authors
                  className="mt-4 shrink-0 md:mt-3 md:hidden"
                  authors={authors}
                  size="sm"
                />
              </article>
            )
          )}
        </div>
      </div>
    </section>
  )
}

export default FeaturedPost
