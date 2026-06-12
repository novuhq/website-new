import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { Button } from "@/components/ui/button"

function HowItWorksIntro() {
  return (
    <section className="bg-black px-5 pb-16 text-white md:px-8">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="max-w-192">
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-lagune-3" />
            <span className="text-sm leading-none font-normal tracking-tight text-lagune-1 uppercase">
              How it works
            </span>
          </div>
          <h2 className="mt-5.5 text-4xl leading-dense font-medium tracking-tighter sm:text-[2.625rem] md:text-5xl lg:text-[3.5rem]">
            You own the brain. ACI owns the communication.
          </h2>
          <p className="mt-4 max-w-192 text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 sm:text-lg md:text-xl lg:text-[1.4375rem]">
            Three columns, one seam. Channels feed ACI, ACI hands a single
            conversation to your agent, your agent replies on the thread of
            origin.
          </p>
        </div>

        <div className="mb-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-5">
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-41.25"
            asChild
          >
            <NextLink
              href={ROUTE.dashboardV2SignUp}
              target="_blank"
              rel="noopener noreferrer"
              data-click-location="aci_how_it_works"
              data-click-text="start_building"
            >
              Start building
            </NextLink>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-45.25"
            asChild
          >
            <NextLink
              href={ROUTE.contactUs}
              data-click-location="aci_how_it_works"
              data-click-text="talk_to_the_team"
            >
              Talk to the team
            </NextLink>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksIntro
