import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import { ChevronRight } from "lucide-react"
import { type PortableTextBlock } from "next-sanity"

import { IChangelogPostData } from "@/types/changelog"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import { Separator } from "@/components/ui/separator"
import Content from "@/components/pages/content"

import Authors from "../authors"
import Date from "../date"
import Categories from "./categories"

const PREVIEW_PARAGRAPHS = 2

function isParagraph(block: PortableTextBlock) {
  return (
    block._type === "block" &&
    (block.style ?? "normal") === "normal" &&
    !block.listItem
  )
}

function getText(block: PortableTextBlock) {
  return block.children
    .map((child) => (typeof child.text === "string" ? child.text : ""))
    .join("")
    .trim()
}

function getContentPreview(content: PortableTextBlock[]) {
  const dividerIndex = content.findIndex(
    (block) => block._type === "dividerBlock"
  )
  if (dividerIndex !== -1) return content.slice(0, dividerIndex)

  const preview: PortableTextBlock[] = []
  for (const block of content) {
    if (!isParagraph(block)) {
      if (preview.length > 0) break
      continue
    }
    if (!getText(block)) continue
    preview.push(block)
    if (preview.length === PREVIEW_PARAGRAPHS) break
  }
  if (
    preview.length > 1 &&
    getText(preview[preview.length - 1]).endsWith(":")
  ) {
    preview.pop()
  }
  return preview
}

function PostsItem({
  title,
  slug,
  publishedAt,
  caption,
  authors,
  categories,
  cover,
  coverAlt,
  content,
}: IChangelogPostData) {
  const postHref = `${ROUTE.changelog}/${slug.current}`
  const preview = getContentPreview(content)

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
        <h2>
          <Link
            className="text-[28px] leading-[1.125] font-semibold tracking-[0.014em] !text-foreground transition-colors duration-300 select-text hover:!text-foreground/40 md:text-[30px]"
            href={postHref}
          >
            {title}
          </Link>
        </h2>
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
            <Image
              src={cover}
              alt={coverAlt || `Cover image for ${title}`}
              fill
              sizes="(max-width: 1023px) 100vw, 640px"
            />
          </div>
        )}
        {preview.length > 0 && (
          <Content
            className="prose mt-5 [&>*:first-child]:mt-0!"
            content={preview}
          />
        )}
        {preview.length < content.length && (
          <Link
            className="mt-5 text-base"
            href={postHref}
            animation="arrow-right"
          >
            Read more
            <span className="sr-only">: {title}</span>
            <ChevronRight className="translate-y-0.5" size={16} />
          </Link>
        )}
      </div>
    </article>
  )
}

export default PostsItem
