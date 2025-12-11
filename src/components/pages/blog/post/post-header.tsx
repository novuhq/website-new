import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import { ArrowLeft } from "lucide-react"

import { IPostWithTableOfContents } from "@/types/blog"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import { Separator } from "@/components/ui/separator"
import Authors from "@/components/pages/authors"

import Date from "../../date"

interface IPostHeaderProps {
  className?: string
  post: IPostWithTableOfContents
  backLink: {
    label: string
    href: string | URL
  }
}

function PostHeader({ className, post, backLink }: IPostHeaderProps) {
  const { title, authors, category, publishedAt, caption, cover } = post

  return (
    <header className={cn("post-header", className)}>
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex min-w-0 items-center" role="list">
          <li className="flex items-center">
            <Link
              className="group gap-x-0.5 leading-none whitespace-nowrap text-muted-foreground hover:text-foreground"
              variant="muted"
              size="sm"
              href={backLink.href}
            >
              <ArrowLeft
                className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
                size={14}
                strokeWidth={2.5}
                aria-hidden
              />
              <span>{backLink.label}</span>
            </Link>
          </li>
          <li className="flex items-center">
            <span
              className="mx-2.5 text-sm leading-none font-medium tracking-tight text-muted-foreground"
              aria-hidden
            >
              /
            </span>
            <Link
              className="leading-none whitespace-nowrap hover:text-foreground"
              href={`${ROUTE.blogCategory}/${category.slug.current}`}
              size="sm"
              variant="muted"
            >
              {category.title}
            </Link>
          </li>
        </ol>
      </nav>
      <h1 className="mt-5 text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight lg:font-medium">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-normal font-book tracking-tighter text-balance text-gray-8">
        {caption}
      </p>
      <Image
        className="mt-7 h-auto w-full rounded-xl"
        src={cover}
        alt=""
        width={704}
        height={396}
        quality={100}
        sizes="(max-width: 768px) 100vw, 1408px"
        priority
      />
      <Separator className="mt-7 mb-5" />
      <div className="flex items-center justify-between gap-3">
        <Authors authors={authors} size="sm" hideNamesOn={["sm"]} />
        <Date
          className="md:text-sm md:leading-none"
          variant="blog"
          size="sm"
          publishedAt={publishedAt}
        />
      </div>
    </header>
  )
}

export default PostHeader
