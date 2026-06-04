"use client"

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react"
import type { Route } from "next"
import NextLink from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { type IHowToPost } from "@/types/how-to"
import { temporarilyDisableSmoothScroll } from "@/lib/scroll"
import { cn } from "@/lib/utils"

import AgentAuthorLine from "../../shared/agent-author-line"

interface IRelatedImage {
  url: string
  alt?: string
}

interface IRelatedBadge {
  label: string
  icon?: IRelatedImage | null
}

interface IRelatedAgentCard {
  id: string
  title: string
  category: string
  agent: string
  agentCompany?: string | null
  quote: string
  avatar?: IRelatedImage | null
  connectors: IRelatedBadge[]
  channels: IRelatedBadge[]
  href: Route<string> | URL
}

const BUTTON_BACKGROUND =
  "linear-gradient(203.753deg, rgba(176, 166, 191, 0.06) 8.6198%, rgba(176, 166, 191, 0.03) 113.79%)"
const BUTTON_HOVER_BACKGROUND =
  "linear-gradient(203.753deg, rgba(176, 166, 191, 0.24) 8.6198%, rgba(176, 166, 191, 0.12) 113.79%)"

function toCard(post: IHowToPost): IRelatedAgentCard {
  return {
    id: post.slug.current,
    title: post.title,
    category: post.category.title,
    agent: post.author.name,
    agentCompany: post.author.company?.name,
    quote: post.summary,
    avatar: post.author?.avatar?.darkImage,
    connectors: (post.mcpServerList ?? []).map((connector) => ({
      label: connector.name,
      icon: connector.icon,
    })),
    channels: (post.channels ?? []).map((channel) => ({
      label: channel.name,
      icon: channel.icon,
    })),
    href: post.url,
  }
}

function RelatedAvatar({ image }: { image?: IRelatedImage | null }) {
  return (
    <span className="relative size-11 shrink-0 overflow-hidden">
      {image?.url && (
        <img
          src={image.url}
          alt={image.alt ?? ""}
          aria-hidden={image.alt ? undefined : true}
          className="block size-full object-contain"
        />
      )}
    </span>
  )
}

function RelatedBadge({ label, icon }: IRelatedBadge) {
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

function RelatedBadgeRow({
  title,
  items,
  className,
}: {
  title: string
  items: IRelatedBadge[]
  className?: string
}) {
  if (!items.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-start justify-center gap-3",
        className
      )}
    >
      <p className="w-full text-[0.9375rem] leading-none font-book tracking-normal text-gray-7">
        {title}
      </p>
      <div className="flex w-full flex-wrap items-center gap-2">
        {items.map((item) => (
          <RelatedBadge key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}

function RelatedAgentCard({ card }: { card: IRelatedAgentCard }) {
  return (
    <article className="flex h-full min-h-[22.25rem] flex-col gap-8 overflow-hidden rounded-xl border border-[rgba(51,51,71,0.5)] bg-[rgba(15,15,21,0.8)] p-5">
      <div className="flex w-full flex-1 flex-col gap-5">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center gap-4.5">
            <RelatedAvatar image={card.avatar} />

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
              <span className="min-w-0 text-lg leading-none font-medium tracking-tighter text-white">
                {card.category}
              </span>
              <AgentAuthorLine name={card.agent} company={card.agentCompany} />
            </div>
          </div>

          <p className="min-h-16.5 text-base leading-[1.375] font-light tracking-normal text-gray-9">
            {card.quote}
          </p>
        </div>

        <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-start">
          <RelatedBadgeRow
            title="MCP connectors"
            items={card.connectors}
            className="sm:w-50 sm:shrink-0"
          />
          <RelatedBadgeRow
            title="Channels"
            items={card.channels}
            className="sm:flex-1"
          />
        </div>
      </div>

      <NextLink
        href={card.href}
        onNavigate={() => temporarilyDisableSmoothScroll()}
        className="group/button relative flex h-10 w-full items-center justify-center overflow-hidden rounded border border-[#534b5d] px-5 py-3.5 text-center text-xs leading-none font-medium tracking-normal text-white uppercase transition-[border-color] duration-200 ease-out outline-none hover:border-[#686170] focus-visible:border-[#686170] focus-visible:ring-2 focus-visible:ring-lagune-3/40"
        style={{ backgroundImage: BUTTON_BACKGROUND }}
        aria-label={`View agent guide for ${card.title}`}
        data-click-location="connect_how_to_related"
        data-click-text={`view_agent_guide_${card.id}`}
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover/button:opacity-100 group-focus-visible/button:opacity-100"
          style={{ backgroundImage: BUTTON_HOVER_BACKGROUND }}
          aria-hidden
        />
        <span className="relative z-10">View agent guide</span>
      </NextLink>
    </article>
  )
}

function RelatedHowToPosts({ posts }: { posts: IHowToPost[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [scrollState, setScrollState] = useState({
    previous: false,
    next: false,
  })

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth
    const nextScrollState = {
      previous: scroller.scrollLeft > 1,
      next: maxScrollLeft - scroller.scrollLeft > 1,
    }

    setScrollState((current) =>
      current.previous === nextScrollState.previous &&
      current.next === nextScrollState.next
        ? current
        : nextScrollState
    )
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    updateScrollState()

    scroller.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateScrollState)

    resizeObserver?.observe(scroller)

    return () => {
      scroller.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
      resizeObserver?.disconnect()
    }
  }, [posts.length, updateScrollState])

  if (!posts.length) {
    return null
  }

  const handleScroll = (direction: "previous" | "next") => {
    const scroller = scrollerRef.current

    if (!scroller || !scrollState[direction]) {
      return
    }

    const scrollDistance = Math.max(scroller.clientWidth * 0.85, 320)

    scroller.scrollBy({
      left: direction === "next" ? scrollDistance : -scrollDistance,
      behavior: "smooth",
    })
  }

  return (
    <section className="relative pt-24 pb-4 md:pt-32 lg:pt-40">
      <div className="mx-auto flex w-full flex-col gap-12 px-5 md:px-8 lg:max-w-none xl:max-w-[60rem] xl:px-0">
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-[2rem] leading-[1.125] font-medium tracking-tighter text-white md:text-[2.5rem]">
            Related Agents
          </h2>
          <div className="hidden items-center gap-3 md:flex">
            {(["previous", "next"] as const).map((direction) => {
              const Icon = direction === "previous" ? ArrowLeft : ArrowRight
              const disabled = !scrollState[direction]

              return (
                <button
                  key={direction}
                  type="button"
                  className={cn(
                    "group/arrow relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-gray-3 bg-[rgba(15,15,21,0.8)] text-gray-8 transition-[border-color,color,opacity] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-lagune-3/40",
                    disabled
                      ? "cursor-not-allowed text-gray-6 opacity-40"
                      : "hover:border-gray-5 hover:text-white"
                  )}
                  aria-label={
                    direction === "previous"
                      ? "Previous related agents"
                      : "Next related agents"
                  }
                  disabled={disabled}
                  onClick={() => handleScroll(direction)}
                >
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br from-[#111018] via-[#302d43] to-[#464c6d] opacity-0 transition-opacity duration-200 ease-out",
                      !disabled &&
                        "group-hover/arrow:opacity-100 group-focus-visible/arrow:opacity-100"
                    )}
                    aria-hidden
                  />
                  <Icon
                    className="relative z-10 size-4"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </button>
              )
            })}
          </div>
        </div>

        <ul
          ref={scrollerRef}
          className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 [scrollbar-width:none] md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {posts.map((post) => (
            <li
              key={post.slug.current}
              className="w-[min(86vw,29.5rem)] shrink-0 snap-start md:w-[calc((100%-1rem)/2)]"
            >
              <RelatedAgentCard card={toCard(post)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default RelatedHowToPosts
