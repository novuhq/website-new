import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import BannerBg from "@/images/pages/integrations/banner-bg.jpg"
import DotSurface from "@/images/pages/integrations/dot-surface.png"
import Shine from "@/images/pages/integrations/shine.svg"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ICustomIntegrationsBannerProps {
  className?: string
}

function CustomIntegrationsBanner({
  className,
}: ICustomIntegrationsBannerProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-5xl overflow-clip px-5 md:px-8",
        className
      )}
    >
      <div className="relative rounded-xl">
        <div className="relative z-20 overflow-hidden rounded-xl px-6 py-8 md:min-h-41 md:px-10 md:py-10">
          <Image
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src={BannerBg}
            alt=""
            aria-hidden
          />
          <div className="relative z-20 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl leading-tight font-medium tracking-tight text-balance text-foreground">
                Build Custom Integrations Easily
              </h2>
              <p className="mt-2.5 max-w-[27rem] text-base leading-snug font-book tracking-tight text-gray-9">
                Connect your tools with flexible APIs and create integrations
                tailored to your workflow.
              </p>
            </div>

            <Button
              variant="default"
              size="default"
              className="w-full rounded-sm md:w-auto"
              asChild
            >
              <NextLink
                href={`${ROUTE.dashboardV2SignUp}?utm_campaign=ws_integrations_custom_banner`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Create Integration
              </NextLink>
            </Button>
          </div>
          <Image
            className="pointer-events-none absolute top-0 left-1/2 z-10 h-auto w-full -translate-x-[42%] object-cover"
            src={DotSurface}
            alt=""
            loading="eager"
            aria-hidden
          />
          <span
            className="custom-integrations-banner-border absolute inset-0 z-[11] rounded-[inherit] border-gradient"
            aria-hidden
          />
        </div>

        <Image
          className="pointer-events-none absolute -top-2 right-0 z-[20] h-auto w-66 object-contain"
          src={Shine}
          alt=""
          loading="eager"
          aria-hidden
        />
      </div>
    </section>
  )
}

export default CustomIntegrationsBanner
