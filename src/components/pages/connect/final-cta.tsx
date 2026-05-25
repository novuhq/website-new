import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import videoPoster from "@/images/pages/connect/final-cta/video-poster.jpg"

import { Button } from "@/components/ui/button"

const VIDEO_WEBM_SRC = "/videos/pages/connect/cta.webm"
const VIDEO_MP4_SRC = "/videos/pages/connect/cta.hevc.mp4"

function ConnectFinalCtaVideo() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 z-0 aspect-1920/742 h-auto w-full max-w-480 -translate-x-1/2 overflow-hidden"
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

function FinalCta() {
  return (
    <section
      className="relative isolate overflow-hidden pt-28 pb-56 md:pt-36 md:pb-72 lg:pt-44 lg:pb-92 xl:pt-50 xl:pb-112"
      data-connect-section="final-cta"
    >
      <ConnectFinalCtaVideo />

      <div className="relative z-10 mx-auto flex w-full max-w-210.5 flex-col items-center gap-8 px-5 text-center md:px-8">
        <div className="flex w-full flex-col items-center gap-4">
          <h2 className="w-full text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-balance text-white md:text-5xl xl:text-[4rem] xl:tracking-[-1.28px]">
            <span>Two minutes. One live</span>
            <br className="hidden sm:block" aria-hidden />
            <span className="sm:hidden"> </span>
            <span>agent. One month of Pro.</span>
          </h2>

          <p className="max-w-104.5 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
            Take the Novu Connect challenge: go live in under 2 minutes and get
            one month of Pro.
          </p>
        </div>

        <Button
          variant="default"
          size="lg"
          className="h-12 overflow-visible px-5"
          asChild
        >
          <NextLink
            href={ROUTE.dashboardV2SignUp}
            target="_blank"
            rel="noopener noreferrer"
            data-click-location="connect_final_cta"
            data-click-text="connect_an_agent"
          >
            Connect an agent
          </NextLink>
        </Button>
      </div>
    </section>
  )
}

export default FinalCta
