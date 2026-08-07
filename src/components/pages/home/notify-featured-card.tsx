import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

import BentoCardBackground, {
  type BentoCardBackgroundImage,
} from "./bento-card-background"
import InboxComponent from "./code-with-inbox/inbox/inbox-component"
import NotifyCodeTabs, { type INotifyCodeTab } from "./notify-code-tabs"

// The "Fits perfectly into your app" bento card. Shared by the homepage
// Novu Notify section and the /notify hero so the two cannot drift: the card
// clips the Inbox and the code tabs to its own bounds, which is what keeps the
// composition intact at every breakpoint.
export interface INotifyFeaturedCardProps {
  backgroundImage?: BentoCardBackgroundImage
  className?: string
  codeTabs: INotifyCodeTab[]
  description: string
  /** heading level for the card title, matched to the surrounding outline */
  headingLevel?: "h2" | "h3"
  image?: StaticImageData
  imageClassName?: string
  imageContainerClassName?: string
  imageSizes?: string
  /** render the live, interactive Inbox instead of a static screenshot */
  liveInbox?: boolean
  title: string
}

function NotifyFeaturedCard({
  backgroundImage,
  className,
  codeTabs,
  description,
  headingLevel = "h3",
  image,
  imageClassName,
  imageContainerClassName,
  imageSizes,
  liveInbox,
  title,
}: INotifyFeaturedCardProps) {
  const Heading = headingLevel

  return (
    <article
      className={cn(
        "magic-bento-card relative flex w-full flex-col overflow-clip rounded-xl border border-gray-20 bg-[#0B0C0E] p-5 pb-0 md:block md:h-118 md:p-0",
        className
      )}
    >
      {backgroundImage && (
        <BentoCardBackground
          backgroundClassName="opacity-80"
          backgroundImage={backgroundImage}
        />
      )}
      <div className="relative flex min-w-0 flex-col md:contents">
        <div className="relative z-30 max-w-[26.5625rem] md:absolute md:top-[27px] md:left-[27px]">
          <Heading className="text-base leading-tight font-normal tracking-tighter text-foreground md:text-xl md:leading-none">
            {title}
          </Heading>
          <p className="mt-2.5 text-sm leading-normal font-normal tracking-tighter text-pretty text-gray-50 md:w-80 md:text-base xl:w-114">
            {description}
          </p>
        </div>

        <NotifyCodeTabs
          className="relative z-10 mt-8 h-61 md:absolute md:bottom-0 md:left-7 md:mt-0 md:h-67 md:w-110 lg:w-124 xl:w-134"
          tabs={codeTabs}
        />
      </div>

      {liveInbox ? (
        <InboxComponent
          animateEntrance={false}
          className="notify-live-inbox absolute top-13 left-104 m-0 hidden md:block lg:right-14 lg:left-auto lg:max-[68rem]:left-112 xl:left-137"
          themeTabsClassName="absolute top-13 left-104 m-0 hidden md:flex lg:right-14 lg:left-auto lg:max-[68rem]:left-112 xl:right-14 xl:left-auto"
          variant="home"
        />
      ) : image ? (
        <div
          className={cn(
            "pointer-events-none hidden md:absolute md:inset-0 md:z-20 md:block",
            imageContainerClassName
          )}
          aria-hidden="true"
        >
          <Image
            className={cn(
              "absolute h-auto max-w-none active:cursor-grabbing",
              imageClassName
            )}
            src={image}
            alt=""
            quality={100}
            sizes={imageSizes}
            aria-hidden="true"
          />
        </div>
      ) : null}
    </article>
  )
}

export default NotifyFeaturedCard
