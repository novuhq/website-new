import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import HeroBgBlur from "@/images/pages/mcp/hero-bg-blur.svg"

import { Button } from "@/components/ui/button"

import HeroVideo from "./hero-video"

function Hero() {
  return (
    <section className="relative section-container flex flex-col items-center gap-14">
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-lagune-3" />
            <span className="text-sm leading-none font-normal tracking-tight text-lagune-1 uppercase">
              Novu copilot
            </span>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="max-w-[53.75rem] text-4xl leading-dense font-medium tracking-tighter text-balance text-foreground md:text-5xl lg:text-[3.25rem]">
              Describe the notification journey.
              <br />
              Ship it the same day.
            </h1>
            <p className="max-w-[42.5rem] text-base leading-normal font-book tracking-tighter text-pretty text-muted-foreground md:text-lg">
              <span className="text-lagune-2">Built for product managers.</span>{" "}
              Tell Novu Copilot what you want in plain English, and it builds
              the workflow, following industry best practices.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-7">
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
            asChild
          >
            <NextLink
              href="#how-it-works"
              data-click-location="copilot_hero"
              data-click-text="start_building_for_free"
            >
              start building for free
            </NextLink>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            asChild
          >
            <NextLink
              href={ROUTE.githubSkills as string}
              target="_blank"
              rel="noopener noreferrer"
              data-click-location="copilot_hero"
              data-click-text="see_how_it_works"
            >
              See how it works
            </NextLink>
          </Button>
        </div>
      </div>

      <div className="relative isolate w-full">
        <div
          className="pointer-events-none absolute top-[20%] left-[10%] z-0 h-86 w-122 [transform:translate3d(-50%,-50%,0)] rounded-full opacity-25 blur-[11.25rem] will-change-transform [contain:paint] [backface-visibility:hidden] [background:radial-gradient(92.52%_89.86%_at_62.86%_11.06%,var(--color-lagune-3)_27.2%,var(--color-blue-1)_80.5%,var(--color-blue-3)_100%)]"
          aria-hidden
        />
        <Image
          src={HeroBgBlur}
          alt=""
          aria-hidden
          className="absolute right-0 bottom-0 translate-x-[40%] translate-y-[42%]"
        />
        <HeroVideo />
      </div>
    </section>
  )
}

export default Hero
