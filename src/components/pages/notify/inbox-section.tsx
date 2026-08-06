import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { Button } from "@/components/ui/button"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"

import InboxCapabilities, { type IInboxCapability } from "./inbox-capabilities"

interface IInboxSectionProps {
  capabilities: IInboxCapability[]
  description: string
  prompt: string
  title: string
}

function InboxSection({
  capabilities,
  description,
  prompt,
  title,
}: IInboxSectionProps) {
  return (
    <section className="mt-24 font-inter md:mt-28 lg:mt-32">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <header>
          <h2 className="max-w-168 text-[2rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-5xl xl:text-[3.25rem]">
            {title}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,40.3125rem)_18.125rem] lg:items-start lg:justify-between lg:gap-12">
            <p className="max-w-161 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg xl:text-xl xl:leading-[1.5]">
              {description}
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:justify-self-end lg:pt-2">
              <CopyPromptButton
                className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-39 [&_svg]:!size-3.5"
                size="sm"
                value={prompt}
              />
              <Button
                className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-auto"
                variant="outline-transparent"
                size="sm"
                asChild
              >
                <NextLink
                  href={ROUTE.inbox}
                  data-click-location="notify_inbox_section"
                  data-click-text="explore_inbox"
                >
                  Explore Inbox
                </NextLink>
              </Button>
              <Button
                className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-29.5"
                variant="outline-transparent"
                size="sm"
                asChild
              >
                <NextLink
                  href={ROUTE.docsInApp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read docs
                </NextLink>
              </Button>
            </div>
          </div>
        </header>

        <InboxCapabilities className="mt-12 md:mt-16" items={capabilities} />
      </div>
    </section>
  )
}

export default InboxSection
