import Image from "next/image"
import { ROUTE } from "@/constants/routes"

import { IChangelogPostData } from "@/types/changelog"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import { Separator } from "@/components/ui/separator"
import Content from "@/components/pages/content"

import Date from "../date"
import Authors from "./authors"
import Categories from "./categories"

interface PostsListProps {
  className?: string
  posts: IChangelogPostData[]
}

function PostsList({ posts, className }: PostsListProps) {
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
          {posts.map(
            (
              {
                title,
                slug,
                publishedAt,
                caption,
                authors,
                categories,
                cover,
                content,
              },
              index
            ) => (
              <li key={index}>
                <article className="relative grid grid-cols-1 gap-3.25 md:gap-5 lg:grid-cols-[112px_1fr] lg:gap-15">
                  <p
                    className={cn(
                      "lg:sticky lg:top-30 lg:mt-3.75 lg:h-max lg:pl-0.5",
                      "after:absolute after:top-2 after:right-0 after:hidden after:size-2 after:rounded-full after:bg-purple-2 lg:after:block"
                    )}
                  >
                    <Date publishedAt={publishedAt} />
                  </p>
                  <div className="pt-px lg:max-w-160 xl:pt-0">
                    <Link
                      href={`${ROUTE.changelog}/${slug.current}`}
                      variant="foreground"
                    >
                      <h1 className="text-[28px] leading-[1.125] font-semibold tracking-tighter md:text-[32px]">
                        {title}
                      </h1>
                    </Link>
                    {caption && (
                      <p
                        className="mt-5 text-gray-9 md:mt-4.5 xl:pt-px"
                        dangerouslySetInnerHTML={{
                          __html: caption.replace(/\n/g, "<br />"),
                        }}
                      />
                    )}
                    <Content
                      className="prose mt-4.5 [&>*:first-child]:mt-0!"
                      content={content}
                    />
                    {cover && (
                      <div className="relative mt-7.75 aspect-video overflow-hidden rounded-xl bg-[#1C1D22] shadow-changelog-image">
                        <Image className="" src={cover} alt="Cover" fill />
                      </div>
                    )}
                    <div className="md:mt-7.5 md:flex md:items-center md:gap-3 xl:mt-8">
                      <Authors
                        className="mt-7.75 md:mt-0 md:shrink-0"
                        authors={authors}
                        size="xs"
                      />
                      {categories && categories.length > 0 && (
                        <>
                          <Separator
                            className="hidden h-4.5 md:block"
                            orientation="vertical"
                          />
                          <Categories
                            className="mt-3.25 md:mt-0 xl:-mt-0.5"
                            categories={categories}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  )
}

export default PostsList
