import Image from "next/image"
import bgSvg from "@/images/shared/cta/background.svg"

import { ICtaSection } from "@/types/common"
import { cn } from "@/lib/utils"
import ActionGroup from "@/components/ui/action-group"

interface ICTAProps extends ICtaSection {
  className?: string
  containerClassName?: string
  descriptionClassName?: string
  titleClassName?: string
}

function CTA({
  className,
  containerClassName,
  titleClassName,
  descriptionClassName,
  title,
  description,
  actions,
}: ICTAProps) {
  return (
    <section
      className={cn(
        "cta relative [overflow-x:clip] pt-37.5 pb-36 md:pt-50.5 md:pb-46.5 lg:pb-50 xl:pt-62.5",
        className
      )}
    >
      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-176 flex-col items-center px-5 text-center md:px-8 lg:-translate-x-2.5 xl:-translate-x-3.5",
          containerClassName
        )}
      >
        <h2
          className={cn(
            "text-[32px] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[44px]",
            titleClassName
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-3 text-base leading-normal font-light tracking-tighter text-muted-foreground xs:text-balance md:text-lg [&>strong]:font-light [&>strong]:text-foreground",
            descriptionClassName
          )}
        >
          {description}
        </p>
        {actions && actions.length > 0 && (
          <ActionGroup
            className="mt-6.5 2xs:justify-center md:mt-7.75"
            actions={actions}
          />
        )}
      </div>
      <Image
        className="pointer-events-none absolute top-[60%] left-[40%] z-0 max-w-none -translate-1/2 md:top-1/2 xl:left-1/2"
        src={bgSvg}
        width={1722}
        height={1193}
        alt=""
        loading="lazy"
        aria-hidden
        quality={100}
      />
      <span className="absolute -bottom-[65px] hidden h-[394px] w-[553px] rounded-[553px] bg-[radial-gradient(92.52%_89.86%_at_62.86%_11.06%,#6789FF_27.2%,#69B7FF_80.5%,#4786FF_100%)] opacity-2 blur-[32px] md:-left-[345px] md:flex xl:left-[133px]"></span>
    </section>
  )
}

export default CTA
