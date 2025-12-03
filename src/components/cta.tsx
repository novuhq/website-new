import Image from "next/image"
import bgLg from "@/svgs/shared/cta/background-lg.svg"
import bgMob from "@/svgs/shared/cta/background-mob.svg"
import bgSvg from "@/svgs/shared/cta/background.svg"

import { ICtaSection, TSectionAction } from "@/types/common"
import { cn } from "@/lib/utils"
import ActionGroup from "@/components/ui/action-group"

interface ICTAProps extends ICtaSection {
  className?: string
  containerClassName?: string
  descriptionClassName?: string
  titleClassName?: string
}

const BACKGROUND_BREAKPOINTS = [
  {
    width: 1385,
    height: 870,
    src: bgSvg,
    className: "top-[53%] left-[44%] hidden h-[870px] w-[1385px] xl:flex",
  },
  {
    width: 1064,
    height: 844,
    src: bgLg,
    className: "top-[59%] left-[50%] hidden h-[844px] w-full lg:flex xl:hidden",
  },
  {
    width: 1043,
    height: 845,
    src: bgMob,
    className:
      "top-[68%] left-[50%] w-[768px] md:top-[59%] md:flex md:h-[845px] md:w-[1043px] lg:hidden",
  },
]

function CTA({
  className,
  containerClassName,
  titleClassName,
  descriptionClassName,
  title,
  description,
  actions,
}: ICTAProps) {
  const updatedActions = actions.map((action, index) => ({
    ...action,
    kind: index === 0 ? "primary-button" : "secondary-button",
  }))

  return (
    <section
      className={cn(
        "cta relative overflow-x-clip pt-37.5 pb-36 md:pt-50.5 md:pb-46.5 lg:pb-50 xl:pt-62.5",
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
            "text-[32px] leading-1.125 font-medium tracking-tighter text-foreground md:text-[44px]",
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
            actions={updatedActions as TSectionAction[]}
          />
        )}
      </div>
      {BACKGROUND_BREAKPOINTS.map(
        ({ width, height, src, className }, index) => (
          <Image
            key={index}
            className={cn(
              "pointer-events-none absolute max-w-none -translate-1/2 select-none",
              className
            )}
            src={src}
            alt=""
            width={width}
            height={height}
            quality={90}
            loading="lazy"
            aria-hidden
          />
        )
      )}
    </section>
  )
}

export default CTA
