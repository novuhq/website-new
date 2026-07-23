import type { ReactNode } from "react"
import { ROUTE } from "@/constants/routes"
import videoPoster from "@/images/pages/connect/final-cta/video-poster.jpg"

import type { TSectionAction } from "@/types/common"
import { cn } from "@/lib/utils"
import ActionGroup from "@/components/ui/action-group"

const VIDEO_WEBM_SRC = "/videos/pages/connect/cta.webm"
const VIDEO_MP4_SRC = "/videos/pages/connect/cta.hevc.mp4"

type FinalCtaAction = Extract<
  TSectionAction,
  { kind: "primary-button" | "secondary-button" | "scheduling-button" }
>

export interface FinalCtaProps {
  actionSlot?: ReactNode
  actions?: FinalCtaAction[]
  className?: string
  containerClassName?: string
  dataConnectSection?: string | null
  description?: ReactNode
  descriptionClassName?: string
  title?: ReactNode
  titleClassName?: string
  videoClassName?: string
}

const DEFAULT_FINAL_CTA_ACTIONS: FinalCtaAction[] = [
  {
    kind: "primary-button",
    label: "Connect an agent",
    href: ROUTE.connectApp,
    clickLocation: "connect_final_cta",
    clickText: "connect_an_agent",
    openInNewTab: true,
  },
]

const DEFAULT_FINAL_CTA_TITLE = (
  <>
    <span>Two minutes. One live</span>
    <br className="hidden sm:block" aria-hidden />
    <span className="sm:hidden"> </span>
    <span>agent. One month of Pro.</span>
  </>
)

function FinalCtaVideo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-0 left-1/2 z-0 aspect-1920/742 h-auto w-[150%] max-w-480 -translate-x-1/2 overflow-hidden md:w-[120%] xl:w-full",
        className
      )}
      aria-hidden
    >
      <video
        className="size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={videoPoster.src}
        preload="auto"
      >
        <source src={VIDEO_MP4_SRC} type='video/mp4; codecs="hvc1"' />
        <source src={VIDEO_WEBM_SRC} type="video/webm" />
      </video>
    </div>
  )
}

function FinalCta({
  actionSlot,
  actions = DEFAULT_FINAL_CTA_ACTIONS,
  className,
  containerClassName,
  dataConnectSection = "final-cta",
  description = "Take the Novu Connect challenge: go live in under 2 minutes and get one month of Pro.",
  descriptionClassName,
  title = DEFAULT_FINAL_CTA_TITLE,
  titleClassName,
  videoClassName,
}: FinalCtaProps) {
  const renderedActions = actions.slice(0, 2)

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pt-20 pb-56 md:pt-36 md:pb-72 lg:pt-44 lg:pb-92 xl:pt-50 xl:pb-112",
        className
      )}
      data-connect-section={dataConnectSection ?? undefined}
    >
      <FinalCtaVideo className={videoClassName} />

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-210.5 flex-col items-center gap-8 px-5 text-center md:px-8",
          containerClassName
        )}
      >
        <div className="flex w-full flex-col items-center gap-4">
          <h2
            className={cn(
              "w-full text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-balance text-white md:text-5xl xl:text-[4rem] xl:tracking-[-1.28px]",
              titleClassName
            )}
          >
            {title}
          </h2>

          <p
            className={cn(
              "max-w-104.5 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg",
              descriptionClassName
            )}
          >
            {description}
          </p>
        </div>

        {actionSlot ||
          (renderedActions.length > 0 && (
            <ActionGroup
              className="gap-4 max-2xs:w-full max-2xs:flex-col md:gap-7"
              actions={renderedActions}
            />
          ))}
      </div>
    </section>
  )
}

export default FinalCta
