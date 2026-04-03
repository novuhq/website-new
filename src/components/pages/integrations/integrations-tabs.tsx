"use client"

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
  type SVGProps,
} from "react"
import type { Route } from "next"
import { useRouter, useSearchParams } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { Search } from "lucide-react"

import type { IntegrationTabType } from "@/types/integration"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import IntegrationCategoriesNav, {
  type IIntegrationCategoryNavItem,
} from "./integration-categories-nav"

function ChannelsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.21094 14.7266C7.34055 15.0986 7.58273 15.4211 7.90389 15.6493C8.22504 15.8775 8.60925 16.0001 9.00322 16.0001C9.3972 16.0001 9.78141 15.8775 10.1026 15.6493C10.4237 15.4211 10.6659 15.0986 10.7955 14.7266"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12.1797H16.0022"
        stroke="currentColor"
        strokeWidth="1.36385"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.0022 12.1834C15.3418 12.1385 14.7201 11.8559 14.252 11.3878C13.784 10.9197 13.5013 10.298 13.4564 9.63759V6.45526C13.4564 5.27365 12.987 4.14044 12.1515 3.30491C11.3159 2.46939 10.1827 2 9.00112 2C7.81951 2 6.6863 2.46939 5.85078 3.30491C5.01525 4.14044 4.54586 5.27365 4.54586 6.45526V9.63759C4.50092 10.298 4.21827 10.9197 3.75022 11.3878C3.28216 11.8559 2.6604 12.1385 2 12.1834"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SourcesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.75 8.25C15.122 8.25 15.466 8.368 15.75 8.567V6.25C15.75 5.146 14.855 4.25 13.75 4.25H11.433C11.631 3.966 11.75 3.623 11.75 3.25C11.75 2.283 10.966 1.5 10 1.5C9.034 1.5 8.25 2.283 8.25 3.25C8.25 3.623 8.368 3.966 8.567 4.25H6.25C5.145 4.25 4.25 5.146 4.25 6.25V8.567C3.966 8.369 3.622 8.25 3.25 8.25C2.284 8.25 1.5 9.033 1.5 10C1.5 10.967 2.284 11.75 3.25 11.75C3.622 11.75 3.966 11.632 4.25 11.433V13.75C4.25 14.854 5.145 15.75 6.25 15.75H8.567C8.369 15.466 8.25 15.123 8.25 14.75C8.25 13.783 9.034 13 10 13C10.966 13 11.75 13.783 11.75 14.75C11.75 15.123 11.632 15.466 11.433 15.75H13.75C14.855 15.75 15.75 14.854 15.75 13.75V11.433C15.466 11.631 15.122 11.75 14.75 11.75C13.784 11.75 13 10.967 13 10C13 9.033 13.784 8.25 14.75 8.25Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const TABS: {
  type: IntegrationTabType
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}[] = [
  { type: "channels", label: "Channels", Icon: ChannelsIcon },
  { type: "sources", label: "Sources", Icon: SourcesIcon },
]

function IntegrationsTabs({
  activeTab,
  categoryItems,
}: {
  activeTab: IntegrationTabType
  categoryItems: IIntegrationCategoryNavItem[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()
  const currentQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(currentQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (document.activeElement === searchInputRef.current) {
      return
    }

    setQuery(currentQuery)
  }, [currentQuery])

  const queryValue = useMemo(() => query.trim(), [query])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (queryValue === currentQuery) {
        return
      }

      const params = new URLSearchParams(searchParamsString)
      if (queryValue.length > 0) {
        params.set("q", queryValue)
      } else {
        params.delete("q")
      }

      const queryString = params.toString()
      const currentTabPath = `${ROUTE.integrations}/${activeTab}`

      router.replace(
        queryString.length > 0
          ? (`${currentTabPath}?${queryString}` as Route)
          : (currentTabPath as Route),
        {
          scroll: false,
        }
      )
    }, 200)

    return () => window.clearTimeout(timeoutId)
  }, [activeTab, currentQuery, queryValue, router, searchParamsString])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <section
      id="integrations-explore"
      className="scroll-mt-28 bg-black pt-7 pb-12 md:px-8 lg:pt-28.5"
    >
      <Tabs
        value={activeTab}
        onValueChange={(type) => {
          const params = new URLSearchParams(searchParams.toString())
          params.delete("category")
          const queryString = params.toString()
          const tabPath = `${ROUTE.integrations}/${type as IntegrationTabType}`

          router.push(
            queryString.length > 0
              ? (`${tabPath}?${queryString}` as Route)
              : (tabPath as Route),
            {
              scroll: false,
            }
          )
        }}
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:px-8"
      >
        <div className="flex w-full flex-col items-center gap-4 px-5 text-center md:px-0">
          <h2
            className={cn(
              "w-full font-sans text-[2.75rem] leading-tight font-medium tracking-tight text-balance text-white",
              "max-sm:text-[2rem] max-sm:leading-tight",
              "md:text-[2rem]"
            )}
          >
            <span className="block">Connect your</span>
            <span className="block">notification stack to Novu</span>
          </h2>
          <div className="max-w-2xl text-base leading-normal font-book tracking-tight text-gray-8">
            <p className="mb-0">
              Connect 50+ providers across email, SMS, push, chat, and in-app.
              Use one API to send notifications and switch providers without
              rebuilding. Need a provider not listed here? Novu is open source,
              so you can contribute a new provider.
            </p>
          </div>
        </div>

        <nav
          aria-label="Channels and sources"
          className="flex w-full justify-center"
        >
          <TabsList
            className={cn(
              "inline-flex h-10 gap-1 rounded-md border border-gray-4 bg-transparent p-1 shadow-none",
              "text-gray-8"
            )}
          >
            {TABS.map(({ type, label, Icon }) => (
              <TabsTrigger
                key={type}
                value={type}
                className={cn(
                  "group inline-flex h-8 w-[8.5rem] shrink-0 items-center justify-center gap-1.5 rounded-sm px-6 py-0.5 text-sm font-medium tracking-tight whitespace-nowrap transition-colors",
                  "text-gray-8 hover:text-gray-8/90",
                  "data-[state=active]:bg-white/90 data-[state=active]:text-gray-1 data-[state=active]:shadow-none"
                )}
              >
                <Icon
                  className="size-[1.125rem] shrink-0 text-gray-8 group-data-[state=active]:text-gray-1"
                  aria-hidden
                />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </nav>
        <div className="flex w-full min-w-0 max-w-full flex-col gap-8 border-b border-gray-2 px-5 pb-6 md:-mx-8 md:w-[calc(100%+4rem)] md:flex-row md:items-center md:justify-between md:px-0 lg:mt-4 lg:max-w-[960px]">
          <Suspense
            fallback={
              <div
                className="categories-list h-9 min-w-0 w-full max-w-full flex-1"
                aria-hidden
              />
            }
          >
            <IntegrationCategoriesNav
              tab={activeTab}
              categories={categoryItems}
            />
          </Suspense>
          <div className="flex w-full shrink-0 items-center justify-end gap-4 md:w-auto">
            <div
              className={cn(
                "inline-flex h-9 w-full max-w-full shrink-0 items-center gap-2.5 rounded border border-gray-4 bg-background pr-2 pl-3 lg:w-[19.5rem]",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-black"
              )}
            >
              <Search
                size={16}
                className="size-4 shrink-0 text-gray-8"
                aria-hidden
              />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search..."
                aria-label="Search integrations by title or category"
                className={cn(
                  "h-[88%] w-full appearance-none border-0 bg-transparent text-base leading-normal font-normal tracking-tight text-gray-8 outline-none md:text-[0.8125rem]",
                  "focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
                  "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
                  "placeholder:text-gray-8"
                )}
              />
            </div>
          </div>
        </div>
        {/* Empty TabsContent required by Radix Tabs — actual content is rendered outside via IntegrationsSections */}
        <TabsContent value="sources" className="mt-0 hidden" />
        <TabsContent value="channels" className="mt-0 hidden" />
      </Tabs>
    </section>
  )
}

export default IntegrationsTabs
