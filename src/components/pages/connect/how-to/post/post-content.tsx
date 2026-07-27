/* eslint-disable @next/next/no-img-element */
import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { ChevronLeft } from "lucide-react"

import {
  type IHowToPost,
  type IHowToPostWithTableOfContents,
} from "@/types/how-to"
import { HOW_TO_COVER_HEIGHT, HOW_TO_COVER_WIDTH } from "@/lib/how-to/cover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Aside from "@/components/pages/aside"
import Content from "@/components/pages/content"
import TableOfContents from "@/components/pages/table-of-contents"

import AgentAuthorLine from "../../shared/agent-author-line"
import RelatedHowToPosts from "./related-posts"
import HowToSidebarActions from "./sidebar-actions"

function Badge({
  label,
  icon,
}: {
  label: string
  icon?: { url: string; alt?: string } | null
}) {
  return (
    <span className="flex min-h-8 max-w-full shrink-0 items-center gap-1 rounded border border-connect-card-border py-1.5 pr-2.5 pl-1.5">
      <span className="relative size-5 shrink-0 overflow-hidden">
        {icon?.url && (
          <img
            src={icon.url}
            alt={icon.alt ?? ""}
            aria-hidden={icon.alt ? undefined : true}
            className="block size-full object-contain"
          />
        )}
      </span>
      <span className="min-w-0 text-[0.9375rem] leading-snug font-normal tracking-normal whitespace-nowrap text-gray-10">
        {label}
      </span>
    </span>
  )
}

function BadgeRow({
  title,
  items,
}: {
  title: string
  items: { id: string; name: string; icon?: { url: string; alt?: string } }[]
}) {
  if (!items.length) {
    return null
  }

  return (
    <div className="flex w-full flex-col items-start justify-center gap-3">
      <p className="w-full overflow-visible text-[0.9375rem] leading-none font-book tracking-normal text-gray-7">
        {title}
      </p>
      <div className="flex w-full flex-wrap items-center gap-2">
        {items.map((item) => (
          <Badge key={item.id} label={item.name} icon={item.icon} />
        ))}
      </div>
    </div>
  )
}

function HowToBreadcrumbs({ post }: { post: IHowToPostWithTableOfContents }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-w-0 flex-wrap items-center gap-2.5 text-sm leading-none tracking-tighter">
        <li className="flex items-center">
          <NextLink
            href={ROUTE.connect}
            className="group flex items-center gap-1 text-gray-6 transition-colors hover:text-gray-9 focus-visible:ring-2 focus-visible:ring-lagune-3/40"
          >
            <ChevronLeft
              className="size-3.5 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={2}
              aria-hidden
            />
            Novu Connect
          </NextLink>
        </li>
        <li className="text-gray-7" aria-hidden>
          /
        </li>
        <li>
          <NextLink
            href={ROUTE.connectHowTo}
            className="text-gray-6 transition-colors hover:text-gray-9 focus-visible:ring-2 focus-visible:ring-lagune-3/40"
          >
            How-to
          </NextLink>
        </li>
        <li className="text-gray-7" aria-hidden>
          /
        </li>
        <li className="text-white" aria-current="page">
          {post.title}
        </li>
      </ol>
    </nav>
  )
}

function HowToPostHeader({
  post,
  className,
}: {
  post: IHowToPostWithTableOfContents
  className?: string
}) {
  const useTemplateUrl = post.useTemplateUrl || String(ROUTE.dashboardV2SignUp)
  const readDocsUrl = post.readDocsUrl || String(ROUTE.docsMcp)
  const isGeneratedCover =
    post.cover?.startsWith(String(ROUTE.apiConnectHowToCover)) ?? false

  return (
    <header className={cn("flex w-full max-w-168 flex-col", className)}>
      <h1 className="text-[2.25rem] leading-dense font-medium tracking-tighter text-balance text-white md:text-[2.5rem] lg:text-[2.75rem]">
        {post.title}
      </h1>
      <p className="mt-4 max-w-157.5 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
        {post.caption}
      </p>
      <div className="mt-6 flex w-full max-w-[303px] flex-row flex-wrap items-center gap-3 md:max-w-[467px] md:flex-nowrap md:gap-5">
        <Button
          size="lg"
          className="h-10 min-w-34 flex-1 px-4 text-xs md:h-12 md:w-fit md:max-w-none md:flex-none md:px-6 md:text-sm"
          asChild
        >
          <NextLink
            href={useTemplateUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-click-location="connect_how_to_post_header"
            data-click-text="use_this_template"
          >
            Use this template
          </NextLink>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-10 min-w-30 flex-1 overflow-visible px-4 text-xs md:h-12 md:w-36 md:max-w-none md:flex-none md:px-6 md:text-sm"
          asChild
        >
          <NextLink
            href={readDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-click-location="connect_how_to_post_header"
            data-click-text="read_the_docs"
          >
            Read the docs
          </NextLink>
        </Button>
      </div>

      {post.cover && (
        <Image
          className="mt-12 h-auto w-full rounded-xl"
          src={post.cover}
          alt={post.coverAlt || post.title}
          width={HOW_TO_COVER_WIDTH}
          height={HOW_TO_COVER_HEIGHT}
          quality={100}
          sizes="(min-width: 1280px) 672px, (min-width: 1024px) calc(100vw - 352px), 100vw"
          priority
          unoptimized={isGeneratedCover}
        />
      )}
    </header>
  )
}

function HowToPostSidebarInfo({
  post,
  className,
}: {
  post: IHowToPostWithTableOfContents
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-11", className)}>
      <div className="flex items-center gap-4.5">
        <span className="relative size-11 shrink-0 overflow-hidden">
          {post.author?.avatar?.darkImage?.url && (
            <img
              src={post.author.avatar.darkImage.url}
              alt={post.author.avatar.darkImage.alt ?? ""}
              aria-hidden={post.author.avatar.darkImage.alt ? undefined : true}
              className="block size-full object-contain"
            />
          )}
        </span>
        <div className="flex min-w-0 flex-col gap-2 leading-none">
          <p className="text-lg leading-none font-medium tracking-tighter text-white">
            {post.category.title}
          </p>
          <AgentAuthorLine
            name={post.author.name}
            company={post.author.company?.name}
          />
        </div>
      </div>

      <BadgeRow title="MCP connectors" items={post.mcpServerList ?? []} />
      <BadgeRow title="Channels" items={post.channels ?? []} />
    </div>
  )
}

function HowToPostSidebar({ post }: { post: IHowToPostWithTableOfContents }) {
  const useTemplateUrl = post.useTemplateUrl || String(ROUTE.dashboardV2SignUp)

  return (
    <div className="flex flex-col gap-11">
      <HowToPostSidebarInfo post={post} />

      <div className="flex flex-col gap-6">
        <TableOfContents
          className="[&_a]:text-sm [&_h2]:text-base [&_h2]:leading-tight [&_h2]:font-medium [&_h2]:tracking-tighter [&_ol]:mt-3 [&_ol]:gap-y-3"
          title="On this page"
          items={post.tableOfContents}
        />
        <HowToSidebarActions useTemplateUrl={useTemplateUrl} />
      </div>
    </div>
  )
}

function HowToPost({
  className,
  post,
  relatedPosts,
}: {
  className?: string
  post: IHowToPostWithTableOfContents
  relatedPosts: IHowToPost[]
}) {
  return (
    <div className={cn("relative", className)}>
      <section className="pt-10 md:pt-14 lg:pt-18">
        <div className="mx-auto w-full px-5 md:px-8 lg:max-w-none xl:max-w-[60rem] xl:px-0">
          <HowToBreadcrumbs post={post} />

          <article className="mt-8 grid w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-x-16 xl:grid-cols-[42rem_14rem]">
            <div className="col-start-1 max-w-none xl:max-w-168">
              <HowToPostHeader post={post} className="max-w-none" />

              <HowToPostSidebarInfo
                post={post}
                className="mt-10 max-w-none md:mt-12 lg:hidden"
              />

              <Content
                className="mt-16 md:mt-20 lg:mt-30 [&>*:first-child]:mt-0!"
                content={post.content}
              />
            </div>

            <Aside
              className="hidden w-56 shrink-0 flex-col lg:col-start-2 lg:row-start-1 lg:flex"
              sticky
            >
              <HowToPostSidebar post={post} />
            </Aside>
          </article>
        </div>
      </section>

      <RelatedHowToPosts posts={relatedPosts} />
    </div>
  )
}

export default HowToPost
