import type { ReactNode } from "react"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import videoPoster from "@/images/pages/connect/final-cta/video-poster.jpg"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const VIDEO_WEBM_SRC = "/videos/pages/connect/cta.webm"
const VIDEO_MP4_SRC = "/videos/pages/connect/cta.hevc.mp4"

function ConnectFinalCtaVideo({ className }: { className?: string }) {
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

type FinalCtaProps = {
  actionSlot?: ReactNode
  containerClassName?: string
  description?: ReactNode
  descriptionClassName?: string
  sectionClassName?: string
  title?: ReactNode
  titleClassName?: string
  videoClassName?: string
}

function FinalCta({
  actionSlot,
  containerClassName,
  description = "Take the Novu Connect challenge: go live in under 2 minutes and get one month of Pro.",
  descriptionClassName,
  sectionClassName,
  title,
  titleClassName,
  videoClassName,
}: FinalCtaProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pt-20 pb-56 md:pt-36 md:pb-72 lg:pt-44 lg:pb-92 xl:pt-50 xl:pb-112",
        sectionClassName
      )}
      data-connect-section="final-cta"
    >
      <ConnectFinalCtaVideo className={videoClassName} />

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
            {title || (
              <>
                <span>Two minutes. One live</span>
                <br className="hidden sm:block" aria-hidden />
                <span className="sm:hidden"> </span>
                <span>agent. One month of Pro.</span>
              </>
            )}
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

        {actionSlot || (
          <Button
            variant="default"
            size="lg"
            className="h-12 overflow-visible px-5"
            asChild
          >
            <NextLink
              href={ROUTE.connectApp}
              target="_blank"
              rel="noopener noreferrer"
              data-click-location="connect_final_cta"
              data-click-text="connect_an_agent"
            >
              Connect an agent
            </NextLink>
          </Button>
        )}
      </div>
    </section>
  )
}

export default FinalCta
