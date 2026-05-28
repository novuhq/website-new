/* eslint-disable @next/next/no-img-element */
import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { ArrowLeft } from "lucide-react"

import {
  type IHowToPost,
  type IHowToPostWithTableOfContents,
} from "@/types/how-to"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Aside from "@/components/pages/aside"
import Content from "@/components/pages/content"
import TableOfContents from "@/components/pages/table-of-contents"

import HowToSidebarActions from "./how-to-sidebar-actions"
import RelatedHowToPosts from "./related-how-to-posts"

function Badge({
  label,
  icon,
}: {
  label: string
  icon?: { url: string; alt?: string } | null
}) {
  return (
    <span className="flex min-h-8 max-w-full shrink-0 items-center gap-1 rounded border border-[rgba(51,51,71,0.5)] py-1.5 pr-2.5 pl-1.5">
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
            <ArrowLeft
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
  return (
    <header className={cn("flex w-full max-w-168 flex-col", className)}>
      <h1 className="text-[2.5rem] leading-[1.125] font-medium tracking-tighter text-balance text-white md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 max-w-157.5 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
        {post.caption}
      </p>
      <div className="mt-6 flex flex-col gap-4 xs:flex-row">
        <Button size="lg" className="h-12 px-5" asChild>
          <NextLink
            href={ROUTE.dashboardV2SignUp}
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
          className="h-12 overflow-visible px-6"
          asChild
        >
          <NextLink
            href={ROUTE.docsMcp}
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
          width={1344}
          height={792}
          quality={100}
          sizes="(min-width: 1280px) 672px, (min-width: 1024px) calc(100vw - 352px), 100vw"
          priority
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
          {post.avatar?.darkImage?.url && (
            <img
              src={post.avatar.darkImage.url}
              alt={post.avatar.darkImage.alt ?? ""}
              aria-hidden={post.avatar.darkImage.alt ? undefined : true}
              className="block size-full object-contain"
            />
          )}
        </span>
        <div className="flex min-w-0 flex-col gap-2 leading-none">
          <p className="text-lg leading-none font-medium tracking-tighter text-white">
            {post.category.title}
          </p>
          <p className="text-base leading-none font-book text-gray-7">
            {post.agentName}
          </p>
        </div>
      </div>

      <BadgeRow title="MCP connectors" items={post.mcpServerList ?? []} />
      <BadgeRow title="Channels" items={post.channels ?? []} />
    </div>
  )
}

function HowToPostSidebar({ post }: { post: IHowToPostWithTableOfContents }) {
  return (
    <div className="flex flex-col gap-11">
      <HowToPostSidebarInfo post={post} />

      <div className="flex flex-col gap-6">
        <TableOfContents
          className="[&_a]:text-sm [&_h2]:text-base [&_h2]:leading-tight [&_h2]:font-medium [&_h2]:tracking-tighter [&_ol]:mt-3 [&_ol]:gap-y-3"
          title="On this page"
          items={post.tableOfContents}
        />
        <HowToSidebarActions />
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
                className="mt-12 max-w-none rounded-xl border border-[rgba(51,51,71,0.5)] bg-[rgba(15,15,21,0.55)] p-5 md:p-6 lg:hidden"
              />

              <Content
                className="mt-12 [&>*:first-child]:mt-0!"
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
