import Image from "next/image"
import claudeLogo from "@/svgs/pages/connect/hero/claude-logo.svg"

import ConnectHeroActions from "./hero-actions"
import ConnectHeroVideo from "./hero-video"

function Hero() {
  return (
    <section
      id="connect"
      className="relative isolate scroll-mt-16 overflow-hidden pt-12 pb-20 md:pt-24 md:pb-26 lg:pt-44 lg:pb-34"
    >
      <div className="relative mx-auto w-full max-w-304 px-5 md:px-8 2xl:px-0">
        <div className="relative z-10 mx-auto flex w-full max-w-154.5 flex-col items-center gap-4 text-center lg:mx-0 lg:max-w-128 lg:items-start lg:text-left xl:max-w-140">
          <div className="flex w-full flex-col items-center gap-8 lg:items-start">
            <div className="flex flex-col items-center gap-5 lg:items-start">
              <div className="flex items-center gap-2">
                <span className="size-1.5 bg-lagune-3" />
                <span className="overflow-visible text-sm leading-none font-normal tracking-normal text-lagune-1 uppercase">
                  Novu connect
                </span>
              </div>

              <div className="flex w-full flex-col items-center gap-4 lg:items-start">
                <h1
                  className="w-full text-4xl leading-dense font-medium tracking-tighter text-foreground md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]"
                  aria-label="Connect your Claude agent where your team actually works"
                >
                  Connect{" "}
                  <span className="whitespace-nowrap">
                    <span aria-hidden>your</span>
                    <Image
                      className="mx-2 inline-block size-[0.923em] align-[-0.12em]"
                      src={claudeLogo}
                      alt=""
                      width={48}
                      height={48}
                      priority
                      aria-hidden
                    />
                    <span aria-hidden>Claude</span>
                  </span>{" "}
                  agent where your team actually works
                </h1>

                <p className="max-w-[523.4609375px] text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
                  Novu Connect plugs any Claude Managed Agent into Slack, Teams,
                  WhatsApp, email, and more. Two minutes from template to live
                  agent. No infrastructure to babysit.
                </p>
              </div>
            </div>

            <ConnectHeroActions />
          </div>

          <p className="text-[0.9375rem] leading-normal font-normal tracking-tighter text-gray-9">
            No credit card required
          </p>
        </div>

        <ConnectHeroVideo />
      </div>
    </section>
  )
}

export default Hero
