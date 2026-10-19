import Image from "next/image"
import { AGENT_REPLIES } from "@/data/pages/usecase-multi-channel"

import { cn } from "@/lib/utils"

import {
  ActionButton,
  CONTAINER,
  DESCRIPTION,
  HEADING,
  TitleLines,
} from "./shared"

/**
 * "Your agent stays yours" and "Let users reply" `45942-11455`. The statement
 * is 1120px, 80px inside the content box. In the card, the dialog plate is a
 * flattened export (desktop 1280x540, phone 560x690) and the heading stays
 * live text: over the plate at x715 y80 on desktop, above it on phones.
 */
export function MultiChannelAgentReplies() {
  const { illustration } = AGENT_REPLIES

  return (
    <section aria-labelledby="multi-channel-agent-title">
      <div className={CONTAINER}>
        <p className="text-[28px] leading-[1.25] font-normal tracking-plus-tight text-gray-50 md:text-4xl xl:px-20 xl:text-[44px]">
          <span className="text-white">{AGENT_REPLIES.statementLead}</span>{" "}
          {AGENT_REPLIES.statement}
        </p>

        <div className="mt-12 overflow-hidden rounded-[20px] bg-[#0B0C0E] md:mt-20 xl:mt-28">
          <div className="relative">
            <div className="px-5 pt-6 pb-8 md:px-8 lg:absolute lg:top-[14.8%] lg:left-[55.86%] lg:z-10 lg:w-[30.86%] lg:p-0">
              <h2
                id="multi-channel-agent-title"
                className={cn(HEADING, "md:text-4xl xl:text-[44px]")}
              >
                <TitleLines lines={AGENT_REPLIES.titleLines} />
              </h2>
              <p
                className={cn(
                  DESCRIPTION,
                  "mt-4 lg:mt-6 lg:text-base xl:mt-8 xl:text-lg"
                )}
              >
                {AGENT_REPLIES.description}
              </p>
            </div>

            <div className="relative aspect-[560/690] w-full lg:aspect-[1280/540]">
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

          <div className="flex flex-col gap-6 p-5 md:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12 lg:pt-10 lg:pb-14">
            <p className="text-lg leading-[1.25] font-medium tracking-tighter text-white md:text-2xl lg:max-w-183">
              <TitleLines lines={AGENT_REPLIES.ctaTextLines} breakFrom="xl" />
            </p>
            <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
              <ActionButton
                action={AGENT_REPLIES.primaryAction}
                section="agent_replies"
                variant="primary"
              />
              <ActionButton
                action={AGENT_REPLIES.secondaryAction}
                section="agent_replies"
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
