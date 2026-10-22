import Image from "next/image"
import { WORKFLOW_DEMO } from "@/data/pages/usecase-multi-channel"

import { cn } from "@/lib/utils"

import { CONTAINER, DESCRIPTION, HEADING, TitleLines } from "./shared"

/**
 * "Nudge users who missed the message" `45929-10712`. Desktop panel is the
 * 1280x388 `subsection`; the phone panel stacks the steps over the code card.
 * Both exports include the panel's rounded corners.
 */
export function MultiChannelWorkflowDemo() {
  const { illustration } = WORKFLOW_DEMO

  return (
    <section aria-labelledby="multi-channel-workflow-demo-title">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:px-16">
          <h2
            id="multi-channel-workflow-demo-title"
            className={cn(HEADING, "lg:max-w-159")}
          >
            <TitleLines lines={WORKFLOW_DEMO.titleLines} />
          </h2>
          <p className={cn(DESCRIPTION, "lg:max-w-112 lg:pt-6")}>
            <TitleLines lines={WORKFLOW_DEMO.descriptionLines} breakFrom="xl" />
          </p>
        </div>

        <div className="relative mx-auto mt-8 aspect-[520/740] w-full max-w-104 overflow-hidden rounded-[20px] md:mt-10 lg:aspect-[1280/388] lg:max-w-none">
          <picture className="absolute inset-0 block size-full">
            <source
              media="(width < 64rem)"
              srcSet={illustration.mobile.src}
              width={illustration.mobile.width}
              height={illustration.mobile.height}
            />
            <Image
              alt={illustration.alt}
              className="object-cover"
              fill
              unoptimized
              src={illustration.desktop}
            />
          </picture>
        </div>
      </div>
    </section>
  )
}
