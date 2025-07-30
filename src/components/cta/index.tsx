import Image from "next/image"
import background from "@/images/shared/cta/background.png"

import { ICtaSection } from "@/types/common"
import { cn } from "@/lib/utils"
import ActionGroup from "@/components/ui/action-group"

interface ICTAProps extends ICtaSection {
  className?: string
}

function CTA({ className, title, description, actions }: ICTAProps) {
  return (
    <section
      className={cn(
        "cta relative overflow-hidden pt-37.5 pb-36 md:pt-50.5 md:pb-46.5 lg:pb-50 xl:pt-62.5",
        className
      )}
    >
      <div className="relative z-10 mx-auto flex max-w-176 flex-col px-5 text-center md:px-8 lg:-translate-x-2.5 xl:-translate-x-3.5">
        <h2 className="text-[32px] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[44px]">
          {title}
        </h2>
        <p className="mt-3 text-base leading-normal font-light tracking-tighter text-muted-foreground xs:text-balance md:text-lg [&>strong]:font-light [&>strong]:text-foreground">
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
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-[1043/861] w-190 max-w-none -translate-1/2 md:w-261 xl:top-0 xl:-translate-y-14"
        src={background}
        width={1043}
        height={861}
        alt=""
        loading="lazy"
        aria-hidden
      />
    </section>
  )
}

export default CTA
