import Image, { type StaticImageData } from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import BentoCardBackground, {
  type BentoCardBackgroundImage,
} from "./bento-card-background"
import InboxComponent from "./code-with-inbox/inbox/inbox-component"
import CopyPromptButton from "./copy-prompt-button"
import MagicBento from "./magic-bento"
import NotifyCodeTabs, { type INotifyCodeTab } from "./notify-code-tabs"

export interface INovuNotifyItem {
  backgroundImage?: BentoCardBackgroundImage
  description: string
  image?: StaticImageData
  imageClassName?: string
  imageContainerClassName?: string
  imageSizes?: string
  label?: string
  /** render the live, interactive Inbox instead of a static screenshot */
  liveInbox?: boolean
  title: string
}

export interface INovuNotifyProps {
  className?: string
  codeTabs: INotifyCodeTab[]
  description: string
  items: INovuNotifyItem[]
  label?: string
  prompt?: string
  title: string
}

const DEFAULT_PROMPT =
  "Add Novu Notify to my application. Configure an in-app notification inbox, multi-channel delivery, and user-controlled notification preferences."

function NovuNotify({
  className,
  codeTabs,
  label,
  title,
  description,
  items,
  prompt = DEFAULT_PROMPT,
}: INovuNotifyProps) {
  if (!items || items.length === 0) {
    return null
  }

  const featuredItem = items[0]
  const supportingItems = items.slice(1, 4)

  return (
    <section
      className={cn(
        "novu-notify mt-24 font-inter md:mt-28 lg:mt-32 xl:mt-55",
        className
      )}
    >
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <header>
          {label && (
            <Badge
              className="mb-5 flex h-6 w-24 justify-center border-blue-3/40 bg-blue-3/30 px-2.5 py-1.25 text-sm leading-none tracking-tighter whitespace-nowrap text-blue-1"
              size="sm"
              variant="outline-muted"
            >
              {label}
            </Badge>
          )}

          <h2 className="max-w-168 text-[2rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-5xl xl:text-[3.25rem]">
            {title}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,40.3125rem)_18.125rem] lg:items-start lg:justify-between lg:gap-12">
            <p className="max-w-161 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg xl:text-xl xl:leading-[1.5]">
              {description}
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:justify-self-end lg:pt-2">
              <CopyPromptButton
                className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-39 [&_svg]:!size-3.5"
                size="sm"
                value={prompt}
              />
              <Button
                className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-29.5"
                variant="outline-transparent"
                size="sm"
                asChild
              >
                <NextLink
                  href={ROUTE.docsQuickStart}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read docs
                </NextLink>
              </Button>
            </div>
          </div>
        </header>

        <MagicBento className="mt-12 md:mt-16" particles={false}>
          <article className="magic-bento-card relative flex w-full flex-col overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E] p-5 pb-0 md:block md:h-118 md:p-0">
            {featuredItem.backgroundImage && (
              <BentoCardBackground
                backgroundClassName="opacity-80"
                backgroundImage={featuredItem.backgroundImage}
              />
            )}
            <div className="relative flex min-w-0 flex-col md:contents">
              <div className="relative z-30 max-w-[26.5625rem] md:absolute md:top-[27px] md:left-[27px]">
                <h3 className="text-lg leading-tight font-normal tracking-tighter text-foreground md:text-xl md:leading-none">
                  {featuredItem.title}
                </h3>
                <p className="mt-2.5 text-sm leading-normal font-normal tracking-tighter text-pretty text-gray-50 md:w-80 md:text-base xl:w-114">
                  {featuredItem.description}
                </p>
              </div>

              <NotifyCodeTabs
                className="relative z-10 mt-8 h-61 md:absolute md:bottom-0 md:left-7 md:mt-0 md:h-67 md:w-110 lg:w-124 xl:w-134"
                tabs={codeTabs}
              />
            </div>

            {featuredItem.liveInbox ? (
              <InboxComponent
                animateEntrance={false}
                className="notify-live-inbox zoom-[0.965] md:zoom-[0.9] lg:zoom-[1.111] xl:zoom-[0.98] absolute top-13 left-104 m-0 hidden md:block lg:right-14 lg:left-auto lg:max-[68rem]:left-112 xl:left-137"
                themeTabsClassName="absolute top-13 left-104 m-0 hidden md:flex lg:right-14 lg:left-auto lg:max-[68rem]:left-112 xl:left-137"
                variant="home"
              />
            ) : featuredItem.image ? (
              <div
                className={cn(
                  "pointer-events-none hidden md:absolute md:inset-0 md:z-20 md:block",
                  featuredItem.imageContainerClassName
                )}
                aria-hidden="true"
              >
                <Image
                  className={cn(
                    "absolute h-auto max-w-none active:cursor-grabbing",
                    featuredItem.imageClassName
                  )}
                  src={featuredItem.image}
                  alt=""
                  quality={100}
                  sizes={featuredItem.imageSizes}
                  aria-hidden="true"
                />
              </div>
            ) : null}
          </article>

          {supportingItems.length > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {supportingItems.map((item, index) => (
                <article
                  className="magic-bento-card relative flex min-h-112 flex-col justify-end overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E] px-5 pb-5 lg:h-auto lg:min-h-96 lg:px-6 lg:pb-6 xl:aspect-392/472 xl:min-h-0"
                  key={`${item.title}-${index}`}
                >
                  {item.backgroundImage && (
                    <BentoCardBackground
                      backgroundClassName="opacity-80"
                      backgroundImage={item.backgroundImage}
                    />
                  )}

                  {item.image && item.imageContainerClassName ? (
                    <div
                      className={cn(
                        "absolute overflow-hidden",
                        item.imageContainerClassName
                      )}
                    >
                      <Image
                        className={cn(
                          "pointer-events-none absolute h-auto max-w-none",
                          item.imageClassName
                        )}
                        src={item.image}
                        alt=""
                        sizes={item.imageSizes}
                        quality={100}
                        aria-hidden="true"
                      />
                    </div>
                  ) : item.image ? (
                    <Image
                      className={cn(
                        "pointer-events-none absolute h-auto max-w-none",
                        item.imageClassName
                      )}
                      src={item.image}
                      alt=""
                      sizes={item.imageSizes}
                      quality={100}
                      aria-hidden="true"
                    />
                  ) : null}

                  <div className="relative z-10">
                    <h3 className="w-fit text-lg leading-none font-medium tracking-tighter text-foreground lg:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-base font-normal tracking-tighter text-pretty text-gray-50">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </MagicBento>
      </div>
    </section>
  )
}

export default NovuNotify
