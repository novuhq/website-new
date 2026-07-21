"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import checkCircleIcon from "@/svgs/pages/home/check-circle.svg"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  HOME_CHANNEL_SELECT_EVENT,
  HOME_FEATURES_SECTION_ID,
  type IHomeChannelSelectDetail,
} from "../channel-navigation"
import CopyPromptButton from "../copy-prompt-button"
import ProductBadge, { type ProductBadgeType } from "../product-badge"
import ChannelIcon from "./channel-icon"
import Preview, { type IPreviewData } from "./preview"

export interface IFeatureChannel extends IPreviewData {
  badges: readonly ProductBadgeType[]
  description: string
  features?: string[]
  key: string
  label: string
  prompt: string
  title: string
}

export interface IFeaturesProps {
  className?: string
  defaultKey?: string
  description: string
  items: IFeatureChannel[]
  title: string
}

function Features({
  className,
  title,
  description,
  items,
  defaultKey,
}: IFeaturesProps) {
  const initialKey =
    items.find(({ key }) => key === defaultKey)?.key ?? items[0]?.key ?? ""
  const [activeKey, setActiveKey] = useState(initialKey)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const tabListRef = useRef<HTMLDivElement | null>(null)
  const hasCenteredInitialTab = useRef(false)
  const tabsId = useId()

  const scrollTabToIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const tabList = tabListRef.current
      const tab = tabRefs.current[index]

      if (!tabList || !tab) return

      const left = tab.offsetLeft - (tabList.clientWidth - tab.offsetWidth) / 2

      tabList.scrollTo({
        left: Math.max(0, left),
        behavior,
      })
    },
    []
  )

  useEffect(() => {
    const selectedIndex = items.findIndex(({ key }) => key === activeKey)
    if (selectedIndex < 0) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const behavior =
      !hasCenteredInitialTab.current || prefersReducedMotion ? "auto" : "smooth"

    const frame = requestAnimationFrame(() => {
      scrollTabToIndex(selectedIndex, behavior)
      hasCenteredInitialTab.current = true
    })

    return () => cancelAnimationFrame(frame)
  }, [activeKey, items, scrollTabToIndex])

  useEffect(() => {
    const handleChannelSelect = (event: Event) => {
      const { key } = (event as CustomEvent<IHomeChannelSelectDetail>).detail
      if (!items.some((item) => item.key === key)) return

      setActiveKey(key)
    }

    window.addEventListener(HOME_CHANNEL_SELECT_EVENT, handleChannelSelect)

    return () => {
      window.removeEventListener(HOME_CHANNEL_SELECT_EVENT, handleChannelSelect)
    }
  }, [items])

  if (!items.length) return null

  const activeIndex = Math.max(
    items.findIndex(({ key }) => key === activeKey),
    0
  )
  const activeItem = items[activeIndex]

  const selectIndex = (nextIndex: number, focusTab = false) => {
    const normalizedIndex = (nextIndex + items.length) % items.length
    setActiveKey(items[normalizedIndex].key)
    if (focusTab) {
      tabRefs.current[normalizedIndex]?.focus({ preventScroll: true })
    }
  }

  const moveSelection = (direction: -1 | 1, focusTab = false) => {
    selectIndex(activeIndex + direction, focusTab)
  }

  return (
    <section
      id={HOME_FEATURES_SECTION_ID}
      className={cn(
        "features mt-24 scroll-mt-16 overflow-hidden font-inter md:mt-28 lg:mt-32 xl:mt-49",
        className
      )}
    >
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-16 xl:pr-4">
          <h2 className="grow text-[2rem] leading-[1.125] font-normal tracking-plus-tight text-foreground md:text-5xl">
            {title}
          </h2>
          <p className="w-full max-w-xl shrink-0 text-base leading-normal tracking-tight text-pretty text-[#a3a6b2] md:text-xl md:leading-normal md:tracking-tight lg:max-w-88 lg:pt-5.75">
            {description}
          </p>
        </header>

        <div className="relative mt-10 md:mt-18">
          <Button
            className="absolute top-2.5 left-0 z-10 size-8 rounded-[0.5rem] border-gray-20 p-0 before:-inset-1.5 md:top-4 [&_svg]:size-3.5"
            variant="outline-transparent"
            size="icon"
            type="button"
            onClick={() => moveSelection(-1)}
            aria-label="Select previous channel"
          >
            <ChevronLeft aria-hidden />
          </Button>

          <div
            className="scrollbar-hidden -mx-5 overflow-x-auto mask-[linear-gradient(to_right,transparent_2.5rem,black_4rem,black_calc(100%_-_4rem),transparent_calc(100%_-_2.5rem))] px-20 md:mx-0 md:mask-[linear-gradient(to_right,transparent_3rem,black_5rem,black_calc(100%_-_5rem),transparent_calc(100%_-_3rem))] md:px-18"
            ref={tabListRef}
            role="tablist"
            aria-label="Communication channels"
          >
            <div className="flex min-w-max items-start gap-4.5">
              {items.map((item, index) => {
                const isActive = item.key === activeItem.key

                return (
                  <button
                    className="group flex w-12 shrink-0 flex-col items-center gap-2 rounded-[10px] text-sm leading-[1.125] tracking-tighter text-gray-50 outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-16 lg:w-23"
                    id={`${tabsId}-tab-${item.key}`}
                    key={item.key}
                    ref={(node) => {
                      tabRefs.current[index] = node
                    }}
                    type="button"
                    role="tab"
                    tabIndex={isActive ? 0 : -1}
                    aria-controls={`${tabsId}-panel`}
                    aria-selected={isActive}
                    onClick={() => selectIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft") {
                        event.preventDefault()
                        selectIndex(index - 1, true)
                      } else if (event.key === "ArrowRight") {
                        event.preventDefault()
                        selectIndex(index + 1, true)
                      } else if (event.key === "Home") {
                        event.preventDefault()
                        selectIndex(0, true)
                      } else if (event.key === "End") {
                        event.preventDefault()
                        selectIndex(items.length - 1, true)
                      }
                    }}
                  >
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-[0.375rem] border bg-background transition-[border-color,filter] md:size-16 md:rounded-[10px]",
                        isActive
                          ? "border-gray-40"
                          : "border-gray-20 group-hover:border-gray-40"
                      )}
                    >
                      <ChannelIcon channel={item.key} isActive={isActive} />
                    </span>
                    <span
                      className={cn(
                        "w-full truncate text-center text-gray-50 transition-colors",
                        !isActive && "group-hover:text-gray-60",
                        isActive && "text-white"
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            className="absolute top-2.5 right-0 z-10 size-8 rounded-[0.5rem] border-gray-20 p-0 before:-inset-1.5 md:top-4 [&_svg]:size-3.5"
            variant="outline-transparent"
            size="icon"
            type="button"
            onClick={() => moveSelection(1)}
            aria-label="Select next channel"
          >
            <ChevronRight aria-hidden />
          </Button>
        </div>

        <div
          className="mt-10 grid overflow-hidden rounded-[10px] border border-gray-20 lg:h-128 lg:grid-cols-2"
          id={`${tabsId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-${activeItem.key}`}
        >
          <div className="flex flex-col p-6 md:p-10 lg:h-full lg:p-20">
            <div className="max-w-lg lg:max-w-112">
              <div className="flex flex-wrap gap-2">
                {activeItem.badges.map((badge, index) => (
                  <ProductBadge key={`${badge}-${index}`} type={badge} />
                ))}
              </div>
              <h3 className="mt-3 text-[1.75rem] leading-tight font-normal tracking-tighter text-balance text-foreground">
                {activeItem.title}
              </h3>
              <p className="mt-3.5 text-base font-light tracking-tighter text-pretty text-gray-60">
                {activeItem.description}
              </p>
              {activeItem.features?.length ? (
                <ul className="mt-4.5 flex flex-col gap-1.5 md:mt-6">
                  {activeItem.features.map((feature, index) => (
                    <li
                      className="flex items-center gap-2 text-base tracking-tighter text-gray-90"
                      key={`${feature}-${index}`}
                    >
                      <Image
                        className="size-4.5 shrink-0"
                        src={checkCircleIcon}
                        alt=""
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mt-10">
              <CopyPromptButton
                className="h-11 w-39 px-5 text-base leading-none font-medium tracking-tight normal-case [&_svg]:size-3.5"
                key={activeItem.key}
                size="none"
                resetInterval={2000}
                value={activeItem.prompt}
                copiedMessage={`${activeItem.label} prompt copied to clipboard`}
              />
              <Button
                className="h-11 min-w-44 px-5 text-base leading-none font-medium tracking-tight normal-case"
                variant="outline-transparent"
                size="none"
                asChild
              >
                <NextLink
                  href={ROUTE.docsProviders}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore {activeItem.label.toLowerCase()} docs
                </NextLink>
              </Button>
            </div>
          </div>

          <div className="relative aspect-10/11 overflow-hidden border-t border-gray-20 sm:aspect-5/4 lg:aspect-auto lg:h-full lg:border-t-0 lg:border-l">
            <Preview
              backgroundImage={activeItem.backgroundImage}
              channelLabel={activeItem.label}
              clientFacingImage={activeItem.clientFacingImage}
              implementationCode={activeItem.implementationCode}
              implementationHighlightedHtml={
                activeItem.implementationHighlightedHtml
              }
              key={activeItem.key}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
