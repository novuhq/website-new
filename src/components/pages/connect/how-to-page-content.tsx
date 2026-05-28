"use client"

import { useMemo, useState, type ReactNode } from "react"
import Image from "next/image"
import searchIcon from "@/svgs/icons/search.svg"
import { Check, ChevronDown, X } from "lucide-react"

import { type IHowToIndexData, type IHowToPost } from "@/types/how-to"
import { type ITemplateMcpServerData } from "@/types/templates"
import { cn } from "@/lib/utils"

import AgentGuideCard, { type IAgentGuideCardData } from "./agent-guide-card"

const INITIAL_POSTS_PER_CATEGORY = 6
const FILTER_OPTIONS_SCROLL_THRESHOLD = 10

type FilterGroupId = "category" | "connector"

interface IFilterOption {
  id: string
  label: string
}

function toCard(post: IHowToPost): IAgentGuideCardData {
  return {
    id: post.slug.current,
    title: post.title,
    agent: post.agentName,
    category: post.category.title,
    quote: post.summary,
    avatar: post.avatar?.darkImage,
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

function getConnectorOptions(
  connectors: ITemplateMcpServerData[],
  posts: IHowToPost[]
): IFilterOption[] {
  const connectorMap = new Map<string, IFilterOption>()

  connectors.forEach((connector) => {
    connectorMap.set(connector.id, {
      id: connector.id,
      label: connector.name,
    })
  })

  posts.forEach((post) => {
    post.mcpServerList?.forEach((connector) => {
      if (!connectorMap.has(connector.id)) {
        connectorMap.set(connector.id, {
          id: connector.id,
          label: connector.name,
        })
      }
    })
  })

  return [...connectorMap.values()]
}

function FilterCount({ count }: { count: number }) {
  if (!count) {
    return null
  }

  return (
    <span className="flex h-4 w-[17px] shrink-0 items-center justify-center rounded-[24px] border border-white/50 bg-gradient-to-b from-[#ffdf66] to-[#ffb433] text-xs leading-none font-normal text-black">
      {count}
    </span>
  )
}

function FilterOption({
  option,
  checked,
  groupId,
  onToggle,
}: {
  option: IFilterOption
  checked: boolean
  groupId: FilterGroupId
  onToggle: (groupId: FilterGroupId, id: string) => void
}) {
  return (
    <label className="flex w-full cursor-pointer items-center gap-2 rounded-full text-[0.8125rem] leading-snug font-normal tracking-tighter text-gray-9 transition-colors hover:text-white">
      <input
        className="peer sr-only"
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(groupId, option.id)}
      />
      <span
        className="relative flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-gray-5 bg-transparent transition-shadow duration-150 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-lagune-3/40"
        aria-hidden
      >
        <span
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-[#ffdf66] to-[#ffb433] transition-opacity duration-150 ease-out",
            checked ? "opacity-100" : "opacity-0"
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[3px] border border-[#ffb433] transition-opacity duration-150 ease-out",
            checked ? "opacity-100" : "opacity-0"
          )}
        />
        <Check
          className={cn(
            "relative z-10 size-3 text-black transition-opacity duration-150 ease-out",
            checked ? "opacity-100" : "opacity-0"
          )}
          strokeWidth={2.5}
        />
      </span>
      <span>{option.label}</span>
    </label>
  )
}

function FilterGroup({
  title,
  groupId,
  options,
  selected,
  onToggle,
}: {
  title: string
  groupId: FilterGroupId
  options: IFilterOption[]
  selected: string[]
  onToggle: (groupId: FilterGroupId, id: string) => void
}) {
  if (!options.length) {
    return null
  }

  const shouldScroll = options.length > FILTER_OPTIONS_SCROLL_THRESHOLD

  return (
    <details className="group flex flex-col" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-lagune-3/40 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2 text-sm leading-none font-medium tracking-tighter text-white">
          <ChevronDown
            className="size-4 shrink-0 text-gray-8 transition-transform group-open:rotate-180"
            strokeWidth={1.75}
            aria-hidden
          />
          {title}
        </span>
        <FilterCount count={selected.length} />
      </summary>
      <div
        className={cn(
          "relative mt-4",
          shouldScroll && "h-[16.125rem] overflow-hidden"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3",
            shouldScroll &&
              "[&::-webkit-scrollbar-thumb]:rounded-px h-full overflow-x-hidden overflow-y-auto overscroll-x-none overscroll-y-contain pr-3 pb-27 [scrollbar-color:#262626_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-3 [&::-webkit-scrollbar-track]:bg-transparent"
          )}
        >
          {options.map((option) => (
            <FilterOption
              key={option.id}
              option={option}
              checked={selected.includes(option.id)}
              groupId={groupId}
              onToggle={onToggle}
            />
          ))}
        </div>

        {shouldScroll && (
          <div className="pointer-events-none absolute right-3 bottom-0 left-0 h-27 bg-gradient-to-b from-transparent to-background" />
        )}
      </div>
    </details>
  )
}

function FiltersPanel({
  categoryOptions,
  connectorOptions,
  selectedCategories,
  selectedConnectors,
  selectedCount,
  onToggle,
  onClear,
  className,
}: {
  categoryOptions: IFilterOption[]
  connectorOptions: IFilterOption[]
  selectedCategories: string[]
  selectedConnectors: string[]
  selectedCount: number
  onToggle: (groupId: FilterGroupId, id: string) => void
  onClear: () => void
  className?: string
}) {
  const hasCategoryOptions = categoryOptions.length > 0
  const hasConnectorOptions = connectorOptions.length > 0

  return (
    <div className={cn("flex w-full flex-col gap-7", className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.9375rem] leading-none font-medium tracking-tighter text-white">
          Filter agents
        </p>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full text-sm leading-snug tracking-tighter text-gray-6 transition-colors hover:text-gray-9 focus-visible:ring-2 focus-visible:ring-lagune-3/40 disabled:pointer-events-none disabled:opacity-50"
          disabled={selectedCount === 0}
          onClick={onClear}
        >
          <span className="flex size-3.5 items-center justify-center rounded-full border border-current">
            <X className="size-2" strokeWidth={2} aria-hidden />
          </span>
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <FilterGroup
          title="Category"
          groupId="category"
          options={categoryOptions}
          selected={selectedCategories}
          onToggle={onToggle}
        />
        {hasCategoryOptions && hasConnectorOptions && (
          <div className="h-px w-full bg-gray-3" />
        )}
        <FilterGroup
          title="MCP Connectors"
          groupId="connector"
          options={connectorOptions}
          selected={selectedConnectors}
          onToggle={onToggle}
        />
      </div>
    </div>
  )
}

function MobileFilters({
  selectedCount,
  children,
}: {
  selectedCount: number
  children: ReactNode
}) {
  return (
    <details className="group rounded-lg border border-gray-3 bg-[rgba(15,15,21,0.8)] p-4 md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.9375rem] leading-none font-medium tracking-tighter text-white outline-none focus-visible:ring-2 focus-visible:ring-lagune-3/40 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          Filter agents
          <FilterCount count={selectedCount} />
        </span>
        <ChevronDown
          className="size-4 text-gray-8 transition-transform group-open:rotate-180"
          strokeWidth={1.75}
          aria-hidden
        />
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  )
}

function CategorySection({
  categoryId,
  title,
  description,
  posts,
  isExpanded,
  onToggle,
}: {
  categoryId: string
  title: string
  description?: string
  posts: IHowToPost[]
  isExpanded: boolean
  onToggle: (categoryId: string) => void
}) {
  const hasExtraPosts = posts.length > INITIAL_POSTS_PER_CATEGORY
  const visiblePosts =
    isExpanded || !hasExtraPosts
      ? posts
      : posts.slice(0, INITIAL_POSTS_PER_CATEGORY)

  return (
    <section id={categoryId} className="scroll-mt-30">
      <div className="flex flex-col gap-8">
        <div className="flex max-w-87 flex-col gap-2.5">
          <h2 className="text-2xl leading-[1.125] font-medium tracking-tighter text-white">
            {title}
          </h2>
          {description && (
            <p className="text-[0.9375rem] leading-snug font-normal tracking-tighter text-gray-8">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-7">
          <ul className="grid w-full auto-rows-fr grid-cols-1 items-stretch gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {visiblePosts.map((post) => (
              <li key={post.slug.current} className="h-full min-w-0">
                <AgentGuideCard
                  card={toCard(post)}
                  buttonLabel="View agent guide"
                  clickLocation="connect_how_to"
                  showCategory={false}
                />
              </li>
            ))}
          </ul>

          {hasExtraPosts && (
            <button
              type="button"
              className="group flex min-h-11 items-center gap-1 overflow-visible text-[0.9375rem] leading-snug font-book tracking-normal text-lagune-3 transition-colors duration-200 ease-out outline-none hover:text-lagune-1 focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none"
              aria-expanded={isExpanded}
              onClick={() => onToggle(categoryId)}
            >
              {isExpanded ? "Show less" : "Show more"}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5 motion-reduce:transition-none",
                  isExpanded && "rotate-180 group-hover:-translate-y-0.5"
                )}
                strokeWidth={1.5}
                aria-hidden
              />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto flex w-full max-w-[19.875rem] flex-col items-center gap-6 text-center md:mt-28">
      <Image
        src={searchIcon}
        alt=""
        width={48}
        height={48}
        aria-hidden
        unoptimized
      />
      <div className="flex w-full flex-col items-center gap-5">
        <p className="w-full text-[2.5rem] leading-[1.125] font-medium tracking-normal text-white">
          No agents found
        </p>
        <p className="w-full text-lg leading-[1.375] font-light tracking-normal text-gray-7">
          Try removing a few filters or selecting fewer MCP connectors.
        </p>
      </div>
    </div>
  )
}

function HowToPageContent({ data }: { data: IHowToIndexData }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const categoryOptions = useMemo<IFilterOption[]>(
    () =>
      data.categories.map((category) => ({
        id: category.id,
        label: category.title,
      })),
    [data.categories]
  )
  const connectorOptions = useMemo(
    () => getConnectorOptions(data.connectors, data.posts),
    [data.connectors, data.posts]
  )
  const visiblePosts = useMemo(
    () =>
      data.posts.filter((post) => {
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(post.category.id)
        const matchesConnector =
          selectedConnectors.length === 0 ||
          post.mcpServerList?.some((connector) =>
            selectedConnectors.includes(connector.id)
          )

        return matchesCategory && matchesConnector
      }),
    [data.posts, selectedCategories, selectedConnectors]
  )
  const visiblePostsByCategory = useMemo(() => {
    const postsByCategory = new Map<string, IHowToPost[]>()

    visiblePosts.forEach((post) => {
      const currentPosts = postsByCategory.get(post.category.id) ?? []

      postsByCategory.set(post.category.id, [...currentPosts, post])
    })

    return postsByCategory
  }, [visiblePosts])
  const selectedCount = selectedCategories.length + selectedConnectors.length

  const handleToggleFilter = (groupId: FilterGroupId, id: string) => {
    const update = (values: string[]) =>
      values.includes(id)
        ? values.filter((value) => value !== id)
        : [...values, id]

    if (groupId === "category") {
      setSelectedCategories(update)
    } else {
      setSelectedConnectors(update)
    }
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedConnectors([])
  }

  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    )
  }

  const filtersPanel = (
    <FiltersPanel
      categoryOptions={categoryOptions}
      connectorOptions={connectorOptions}
      selectedCategories={selectedCategories}
      selectedConnectors={selectedConnectors}
      selectedCount={selectedCount}
      onToggle={handleToggleFilter}
      onClear={handleClearFilters}
    />
  )

  return (
    <section className="pt-20 pb-24 md:pt-24 md:pb-32 lg:pt-28 xl:pt-32">
      <div className="mx-auto flex w-full max-w-[89.5rem] flex-col gap-8 px-5 md:px-8 2xl:px-0">
        <MobileFilters selectedCount={selectedCount}>
          {filtersPanel}
        </MobileFilters>

        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-10 xl:gap-16">
          <aside className="hidden h-fit md:sticky md:top-28 md:mt-28 md:block">
            {filtersPanel}
          </aside>

          <div className="flex min-w-0 flex-col gap-16 lg:gap-20">
            {data.categories.map((category) => {
              const posts = visiblePostsByCategory.get(category.id) ?? []

              if (!posts.length) {
                return null
              }

              return (
                <CategorySection
                  key={category.id}
                  categoryId={category.id}
                  title={category.title}
                  description={category.description}
                  posts={posts}
                  isExpanded={expandedCategories.includes(category.id)}
                  onToggle={handleToggleCategory}
                />
              )
            })}

            {visiblePosts.length === 0 && <EmptyState />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowToPageContent
