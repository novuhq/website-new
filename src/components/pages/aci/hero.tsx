import Image from "next/image"
import heroIllustration from "@/images/pages/aci/hero/image-hero.svg"

import HeroActions from "./hero-actions"

function Hero() {
  return (
    <section className="relative isolate min-h-182.5 overflow-hidden bg-black text-white">
      <div className="mx-auto grid min-h-182.5 w-full max-w-344 grid-cols-1 items-center px-5 py-16 md:px-8 lg:grid-cols-[620px_1fr] lg:py-0 2xl:px-0">
        <div className="relative z-10 flex flex-col items-start lg:pt-1">
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-lagune-3" />
            <span className="text-sm leading-none font-normal tracking-tight text-lagune-1 uppercase">
              The missing agent-user layer
            </span>
          </div>

          <div className="mt-8 flex flex-col items-start">
            <h1 className="bg-[linear-gradient(105deg,#ffe6d5_2%,#ff94d7_46%,#8b4cff_100%)] bg-clip-text text-[7rem] leading-[0.9] font-medium tracking-[-0.065em] text-transparent sm:text-[8.5rem] lg:text-[9.75rem]">
              ACI
            </h1>
            <p className="mt-5 text-2xl leading-none font-medium tracking-tighter sm:text-[2rem]">
              Agent Communication Infrastructure
            </p>
            <p className="mt-5 max-w-130.75 text-base leading-normal font-book tracking-tighter text-gray-8 md:text-lg">
              Defining the missing agent-to-user communication layer, and the
              best practices that come with it. One layer between every
              customer, every channel, and every agent.
            </p>
          </div>

          <div className="mt-8">
            <HeroActions />
          </div>
        </div>

        <div className="relative -mx-5 mt-10 md:-mx-8 lg:mx-0 lg:mt-0 lg:-mr-24">
          <Image
            src={heroIllustration}
            alt=""
            width={620}
            height={505}
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
