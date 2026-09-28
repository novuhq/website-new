import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { IndexCtaData } from "./types"

interface IndexCtaProps {
  data: IndexCtaData
  variant: "echo" | "requirements"
}

function IndexCta({ data, variant }: IndexCtaProps) {
  return (
    <section
      className={cn(
        "relative z-10",
        variant === "echo"
          ? "mt-31 lg:mt-51 xl:mt-[275px]"
          : "mt-[164px] mb-52 min-[501px]:mt-56 md:mt-31 lg:mt-51 xl:mt-60"
      )}
    >
      <div className="relative mx-auto w-full max-w-[800px] px-4 md:px-7 lg:px-0">
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="max-w-4xl text-center text-[32px] leading-[1.125] font-medium tracking-tighter text-white lg:text-4xl xl:text-[44px]">
            {data.title}
          </h2>
          <p className="mt-3 max-w-sm text-center text-base font-book tracking-tighter text-gray-8 lg:max-w-[464px] lg:text-lg">
            {data.description}
          </p>
          <div className="mt-7 flex justify-center gap-x-5 min-[360px]:gap-x-7 lg:mt-8">
            <Button
              className="!h-10 !px-4 !text-xs uppercase min-[360px]:!h-12 min-[360px]:!px-5 min-[360px]:!text-sm"
              variant="default"
              size="none"
              asChild
            >
              <a
                href={data.primaryAction.href}
                data-click-location={`usecases_${variant}_cta`}
                data-click-text="try_novu"
              >
                {data.primaryAction.label}
              </a>
            </Button>
            <Button
              className="!h-10 !px-4 !text-xs uppercase min-[360px]:!h-12 min-[360px]:!px-5 min-[360px]:!text-sm"
              variant="outline"
              size="none"
              asChild
            >
              <a
                href={data.secondaryAction.href}
                data-click-location={`usecases_${variant}_cta`}
                data-click-text="contact_us"
              >
                {data.secondaryAction.label}
              </a>
            </Button>
          </div>
        </div>
        <Image
          className="pointer-events-none absolute bottom-[-607px] left-1/2 z-0 h-auto max-w-none -translate-x-1/2 select-none lg:left-[-561px] lg:translate-x-0"
          src="/images/pages/usecases/index/shared/cta-background.svg"
          alt=""
          width={1722}
          height={1193}
          sizes="1722px"
          aria-hidden
        />
      </div>
    </section>
  )
}

export default IndexCta
