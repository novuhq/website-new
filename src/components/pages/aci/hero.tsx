import Image from "next/image"
import heroIllustration from "@/images/pages/aci/hero/image.png"

import { cn } from "@/lib/utils"

import HeroActions from "./hero-actions"

function Hero() {
  return (
    <section
      className={cn(
        "integrations-hero safe-paddings overflow-x-clip bg-black pt-14 pb-16 text-white md:pt-16 md:pb-12 lg:pt-18.5 lg:pb-31.5 xl:pt-22.5"
      )}
    >
      <div className="mx-auto w-full max-w-304 px-8 sm:px-4 md:px-7 2xl:px-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-24">
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="size-1.5 bg-lagune-3" />
                <span className="text-sm leading-none font-normal text-lagune-1 uppercase">
                  The missing agent-user layer
                </span>
              </div>
              <h1 className="mt-6 bg-[linear-gradient(75deg,#FFFDFF_1.28%,#FFDDBA_13.96%,#FCAE9C_25.25%,#EB47E0_48.76%,#B028EC_70.43%,#4F32F0_97.17%)] bg-clip-text text-[7rem] leading-dense font-medium tracking-tighter text-transparent sm:text-[8.5rem] lg:text-[10.5rem]">
                ACI
              </h1>
              <p className="mt-1 text-2xl leading-none font-medium tracking-tighter sm:text-[1.75rem]">
                Agent Communication Infrastructure
              </p>
              <p className="mt-4 max-w-131 text-base leading-normal font-book tracking-tighter text-gray-8 md:text-lg">
                Defining the missing agent-to-user communication layer, and the
                best practices that come with it. One layer between every
                customer, every channel, and every agent.
              </p>
            </div>
            <HeroActions />
          </div>
          <div
            className="pointer-events-none relative flex w-full justify-center lg:max-w-[min(100%,68rem)]"
            aria-hidden
          >
            <div className="absolute top-1/2 left-1/2 aspect-[1073/1021] w-250 -translate-x-[50%] -translate-y-1/2 md:w-268.25 lg:-translate-x-[calc(50%+6rem)]">
              <Image
                src={heroIllustration}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
