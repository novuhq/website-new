import Image from "next/image"
import { OBSERVABILITY } from "@/data/pages/usecase-multi-channel"

import { cn } from "@/lib/utils"

import { CONTAINER, DESCRIPTION, HEADING, TitleLines } from "./shared"

/**
 * "Know what happened to every notification" `45950-646`. The export is the
 * Activity Feed card with its glow (805x890 at 1x); the card sits at x63 y197
 * inside it. On desktop the card lands at x633 of the 1280px content box, top
 * aligned with the section, so the glow bleeds past the section on all sides.
 * On phones and tablets the card spans the content width under the copy.
 */
export function MultiChannelObservability() {
  return (
    <section aria-labelledby="multi-channel-observability-title">
      {/* At lg the box is 1344px including its 32px padding; the plate's
          offsets are measured against that padding box. */}
      <div className={cn(CONTAINER, "relative lg:aspect-[1344/480]")}>
        <div className="relative z-10 flex flex-col gap-5 lg:max-w-134 lg:pt-[6.33%] xl:pl-16">
          <h2 id="multi-channel-observability-title" className={HEADING}>
            <TitleLines lines={OBSERVABILITY.titleLines} />
          </h2>
          <p className={cn(DESCRIPTION, "lg:max-w-96")}>
            <TitleLines lines={OBSERVABILITY.descriptionLines} breakFrom="xl" />
          </p>
        </div>

        <div className="pointer-events-none relative -mt-[22%] -mb-[28%] -ml-[10.66%] w-[136.2%] lg:absolute lg:top-0 lg:left-[44.79%] lg:my-0 lg:ml-0 lg:w-[59.9%] lg:-translate-y-[22.13%]">
          <Image
            alt={OBSERVABILITY.illustrationAlt}
            className="h-auto w-full"
            unoptimized
            src={OBSERVABILITY.illustration}
          />
        </div>
      </div>
    </section>
  )
}
