import Image from "next/image"
import heroIllustrationMobile from "@/images/pages/aci/hero/image-mobile.png"
import heroIllustration from "@/images/pages/aci/hero/image.png"

import { cn } from "@/lib/utils"

import HeroActions from "./hero-actions"

function Hero() {
  return (
    <section
      className={cn(
        "integrations-hero safe-paddings overflow-x-clip bg-black pt-14 pb-49 text-white md:pt-16 lg:pt-18.5 lg:pb-31.5 xl:pt-52"
      )}
    >
      <div className="mx-auto w-full max-w-304 px-5 md:px-8 2xl:px-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-24">
          <div className="relative z-10 flex flex-col items-center gap-8 xl:gap-7 lg:items-start">
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-2">
                <span className="size-1.5 bg-lagune-3" />
                <span className="text-sm leading-none font-normal text-lagune-1 uppercase">
                  The missing agent-user layer
                </span>
              </div>
              <h1 className="mt-6 bg-[linear-gradient(75deg,#FFFDFF_1.28%,#FFDDBA_13.96%,#FCAE9C_25.25%,#EB47E0_48.76%,#B028EC_70.43%,#4F32F0_97.17%)] bg-clip-text text-[6rem] leading-dense font-medium tracking-tighter text-transparent md:text-[7rem] lg:text-[10.5rem]">
                ACI
              </h1>
              <p className="text-center text-[1.75rem] leading-dense font-medium tracking-tighter md:mt-1 lg:text-start">
                Agent Communication Infrastructure
              </p>
              <p className="mt-4 max-w-none text-center text-base leading-normal font-book tracking-tighter text-gray-8 md:max-w-[480px] md:text-lg lg:max-w-131 lg:text-start">
                Defining the missing agent-to-user communication layer — and the
                best-practices that come with it. One layer between every app,
                every channel, and every smart agent.
              </p>
            </div>
            <HeroActions />
          </div>
          <div
            className="pointer-events-none relative flex w-full justify-center"
            aria-hidden
          >
            <div className="absolute top-1/2 left-1/2 hidden aspect-[1073/1021] w-250 -translate-x-[calc(50%+94px)] -translate-y-[calc(50%-280px)] lg:block lg:w-228.5 lg:-translate-x-[calc(50%+6rem)] lg:-translate-y-1/2 xl:w-268.25">
              <Image
                src={heroIllustration}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="absolute top-1/2 left-1/2 aspect-[768/787] w-[140%] max-w-[800px] -translate-x-1/2 -translate-y-[calc(50%-60px)] sm:w-[109%] sm:-translate-y-[calc(50%-100px)] lg:hidden lg:w-228.5">
              <Image
                src={heroIllustrationMobile}
                alt=""
                fill
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
