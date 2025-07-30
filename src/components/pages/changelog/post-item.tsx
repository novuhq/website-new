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
          "lg:sticky lg:top-30 lg:mt-3.75 lg:h-max lg:pl-0.5",
          "after:absolute after:top-2 after:right-0 after:hidden after:size-2 after:rounded-full after:bg-purple-2 lg:after:block"
        )}
      >
        <Date publishedAt={publishedAt} />
      </p>
      <div className="pt-px lg:max-w-160 xl:pt-0">
        <Link
          className="!text-foreground hover:!text-foreground/40"
          href={`${ROUTE.changelog}/${slug.current}`}
        >
          <h1 className="text-[28px] leading-[1.125] font-semibold tracking-tighter text-current md:text-[30px]">
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
        {cover && (
          <div className="relative mt-7.75 aspect-video overflow-hidden rounded-xl bg-[#1C1D22] shadow-changelog-image">
            <Image className="" src={cover} alt="Cover" fill />
          </div>
        )}
        <Content
          className="prose mt-4.5 [&>*:first-child]:mt-0!"
          content={content}
        />
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
  )
}

export default PostsItem
