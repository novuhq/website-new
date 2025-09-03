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

function PostsItem({
  title,
  slug,
  publishedAt,
  caption,
  authors,
  categories,
  cover,
  content,
}: IChangelogPostData) {
  return (
    <article className="relative grid grid-cols-1 gap-3.25 md:gap-5 lg:grid-cols-[112px_1fr] lg:gap-15">
      <p
        className={cn(
          "lg:sticky lg:top-30 lg:mt-3 lg:h-max lg:pl-0.5",
          "after:absolute after:top-1.75 after:right-0 after:hidden after:size-2 after:rounded-full after:bg-purple-2 lg:after:block"
        )}
      >
        <Date publishedAt={publishedAt} />
      </p>
      <div className="pt-px lg:max-w-160 xl:pt-0">
        <h1>
          <Link
            className="text-[28px] leading-[1.125] font-semibold tracking-[0.014em] !text-foreground transition-colors duration-300 select-text hover:!text-foreground/40 md:text-[30px]"
            href={`${ROUTE.changelog}/${slug.current}`}
          >
            {title}
          </Link>
        </h1>
        {caption && (
          <p
            className="mt-3 text-gray-9 xl:pt-px"
            dangerouslySetInnerHTML={{
              __html: caption.replace(/\n/g, "<br />"),
            }}
          />
        )}
        <div className="mt-4.5 md:flex md:items-center md:gap-3">
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
        {cover && (
          <div className="relative mt-7.75 aspect-video overflow-hidden rounded-xl bg-[#1C1D22] shadow-changelog-image">
            <Image className="" src={cover} alt="Cover" sizes="100vw" fill />
          </div>
        )}
        <Content
          className="prose-with-hidden-part prose mt-5 [&>*:first-child]:mt-0!"
          content={content}
          readMoreSlug={`${ROUTE.changelog}/${slug.current}`}
        />
      </div>
    </article>
  )
}

export default PostsItem
