import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import IntegrationsHeroTrustedBy from "./integrations-hero-trusted-by"

const HERO_ILLUSTRATION = "/images/header/integrations-hero.png"

interface IntegrationsHeroProps {
  className?: string
}

function IntegrationsHero({ className }: IntegrationsHeroProps) {
  return (
    <section
      className={cn(
        "integrations-hero safe-paddings overflow-x-clip bg-black pt-14 pb-16 text-white md:pt-16 md:pb-12 lg:pt-18.5 lg:pb-14 xl:pt-22.5",
        className
      )}
    >
      <div className="mx-auto w-full max-w-336 px-8 sm:px-4 md:px-7 2xl:px-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-24">
          <div className="relative z-10 flex w-full flex-col md:pt-3">
            <div className="flex flex-col gap-12 lg:gap-[11.25rem]">
              <div className="flex flex-col gap-3">
                <h1
                  className={cn(
                    "text-left font-medium text-balance text-white",
                    "text-[2rem] leading-[1.125] tracking-tight sm:text-[2.5rem] sm:tracking-tight",
                    "md:text-[2.5rem] md:tracking-tight lg:text-[2.75rem]"
                  )}
                >
                  <span className="block">Novu Integrations for</span>
                  <span className="block">Unified Notification Delivery</span>
                </h1>

                <div className="flex flex-col gap-7">
                  <p className="max-w-[35.25rem] text-left text-lg leading-normal font-book tracking-tight text-gray-8 md:text-base [&_span]:font-normal [&_span]:text-white">
                    Connect the providers and tools you use with Novu across{" "}
                    <span>email</span>, <span>SMS</span>, <span>push</span>,{" "}
                    <span>chat</span>, <span>in-app</span>, and{" "}
                    <span>workflow integrations.</span>
                  </p>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start sm:gap-7">
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <NextLink
                        href={`${ROUTE.dashboardV2SignUp}?utm_campaign=ws_integrations_hero`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Try now
                      </NextLink>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <NextLink
                        href={`${ROUTE.integrations}/channels#integrations-explore`}
                      >
                        Browse integrations
                      </NextLink>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="hidden w-full lg:block">
                <IntegrationsHeroTrustedBy />
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none relative flex h-108 w-full justify-center overflow-visible md:h-152 lg:max-w-[min(100%,38rem)]"
            aria-hidden
          >
            <div className="absolute top-1/2 left-1/2 h-250 w-250 -translate-x-[50%] -translate-y-1/2 md:h-304 md:w-304 lg:-translate-x-[49%]">
              <Image
                src={HERO_ILLUSTRATION}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="w-full lg:hidden">
            <IntegrationsHeroTrustedBy />
          </div>
        </div>
      </div>
    </section>
  )
}

export default IntegrationsHero
