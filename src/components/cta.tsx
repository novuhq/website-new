import Image from "next/image"
import bgLg from "@/images/shared/cta/background-lg.svg"
import bgMob from "@/images/shared/cta/background-mob.svg"
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
        className="pointer-events-none absolute top-[53%] left-[44%] hidden h-[870px] w-[1385px] max-w-none -translate-1/2 xl:flex"
        src={bgSvg}
        width={1385}
        height={870}
        alt=""
        loading="lazy"
        aria-hidden
        quality={90}
      />
      <Image
        className="pointer-events-none absolute top-[59%] left-[50%] hidden h-[844px] w-full max-w-none -translate-1/2 lg:flex xl:hidden"
        src={bgLg}
        width={1064}
        height={844}
        alt=""
        loading="lazy"
        aria-hidden
        quality={90}
      />
      <Image
        className="pointer-events-none absolute top-[68%] left-[50%] w-[768px] max-w-none -translate-1/2 md:top-[59%] md:flex md:h-[845px] md:w-[1043px] lg:hidden"
        src={bgMob}
        width={1043}
        height={845}
        alt=""
        loading="lazy"
        aria-hidden
        quality={90}
      />
    </section>
  )
}

export default CTA
