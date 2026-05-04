import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import bgLights from "@/svgs/pages/copilot/lights.svg"
import logosImage from "@/svgs/pages/copilot/logos/logos.svg"

import { Button } from "@/components/ui/button"

function TrustedWorkflows() {
  return (
    <section
      className="section-container mt-26 scroll-mt-[calc(var(--sticky-header-height)+5rem)] md:mt-48 lg:mt-60 lg:mb-59"
      id="trusted-workflows"
    >
      <div className="relative isolate flex min-h-[17.4375rem] py-12 lg:items-center lg:py-0">
        <Image
          className="pointer-events-none absolute max-w-none -translate-x-[22%] -translate-y-[21%] select-none lg:translate-y-0"
          src={bgLights}
          alt=""
          width={1056}
          height={693}
          quality={90}
          loading="lazy"
          aria-hidden
        />

        <div className="relative z-10 grid w-full gap-12 lg:grid-cols-[minmax(0,36rem)_minmax(20rem,28rem)] lg:items-center lg:justify-between">
          <div className="flex max-w-[36rem] flex-col items-start gap-12 lg:gap-22">
            <h2 className="text-[2rem] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[2.5rem] lg:text-[2.75rem]">
              Workflows you can actually trust with your users.
            </h2>

            <Button
              variant="default"
              size="lg"
              className="w-full max-w-[18.9375rem] sm:w-fit sm:max-w-none"
              textClassName="whitespace-normal text-center leading-tight sm:whitespace-nowrap"
              asChild
            >
              <NextLink
                href={ROUTE.workflows as string}
                target="_blank"
                rel="noopener noreferrer"
                data-click-location="copilot_trusted_workflows"
                data-click-text="ship_a_workflow_you_can_trust"
              >
                Ship a workflow you can trust
              </NextLink>
            </Button>
          </div>

          <div className="flex h-full max-w-[80%] flex-col items-start gap-12 pt-2 lg:h-auto lg:max-w-[28rem] lg:gap-[3.875rem]">
            <p className="text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 md:text-lg md:leading-normal">
              Copilot generates workflows shaped by patterns{" "}
              <span className="text-foreground">
                Novu has seen work across thousands of production setups
              </span>
              . The output is closer to what a senior notifications engineer
              would build than to a first draft.
            </p>

            <div className="relative h-14 w-full max-w-[22.25rem]">
              <Image
                src={logosImage}
                alt="AICPA SOC 2, healthcare, ISO, and GDPR compliance logos"
                className="absolute top-[-24%] left-[-4.2%] h-auto w-[108.4%] max-w-none select-none"
                sizes="386px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustedWorkflows
