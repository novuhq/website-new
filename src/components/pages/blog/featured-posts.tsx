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
  const hasAdditionalPosts = restPosts.length > 0
  const isSinglePost = !hasAdditionalPosts

  return (
    <section className={cn("featured-posts", className)}>
      <h2 className="sr-only">Featured posts</h2>
      <div
        className={cn(
          "lg grid grid-cols-1 gap-x-16 gap-y-0",
          hasAdditionalPosts &&
            "md:grid-cols-[22rem_auto] md:gap-y-12 lg:grid-cols-[26rem_auto] xl:grid-cols-[30rem_auto]"
        )}
      >
        <article
          className={cn(
            "flex flex-col border-b border-border pb-6 md:border-b-0 md:pb-0",
            isSinglePost &&
              "md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] md:gap-x-8 lg:gap-x-10"
          )}
        >
          <Link
            className={cn(
              "shrink-0 overflow-hidden rounded-lg",
              isSinglePost && "md:block md:min-w-0"
            )}
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
              sizes={
                isSinglePost
                  ? "(max-width: 767px) 100vw, (max-width: 1023px) 62vw, 520px"
                  : "(max-width: 768px) 100vw, 960px"
              }
              alt={featuredPost.coverAlt || featuredPost.title}
              priority
            />
          </Link>
          <div
            className={cn(
              "flex flex-col",
              isSinglePost && "md:h-full md:min-w-0 md:overflow-hidden"
            )}
          >
            <CategoryAndDate
              className={isSinglePost ? "mt-6 md:mt-0" : "mt-6 md:hidden"}
              category={featuredPost.category}
              publishedAt={featuredPost.publishedAt}
            />
            <h3 className="mt-3 md:mt-4">
              <Link
                className={cn(
                  "line-clamp-3 text-2xl/dense font-medium text-pretty hover:text-gray-9",
                  isSinglePost
                    ? "md:text-2xl/tight"
                    : "md:text-[1.75rem] lg:line-clamp-2 lg:text-[2rem]"
                )}
                variant="white"
                href={featuredPost.url}
              >
                {featuredPost.title}
              </Link>
            </h3>
            {isSinglePost && featuredPost.caption && (
              <p className="mt-3 line-clamp-3 text-base/snug font-book tracking-tighter text-pretty text-gray-8 md:line-clamp-2 lg:line-clamp-3">
                {featuredPost.caption}
              </p>
            )}
            <Authors
              className={
                isSinglePost
                  ? "mt-4 shrink-0 md:mt-auto"
                  : "mt-4 shrink-0 md:hidden"
              }
              authors={featuredPost.authors}
              size="sm"
            />
          </div>
        </article>
        {hasAdditionalPosts && (
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
                  <h3 className="mt-3">
                    <Link
                      className="tracking-dense line-clamp-2 text-2xl/dense font-medium text-pretty hover:text-gray-9 md:text-xl/snug"
                      variant="white"
                      href={url}
                    >
                      {title}
                    </Link>
                  </h3>
                  <Authors
                    className="mt-4 shrink-0 md:mt-3 md:hidden"
                    authors={authors}
                    size="sm"
                  />
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedPost
