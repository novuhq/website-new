import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
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

          {/* Two buttons max, primary + secondary, with any further action
              demoted to a chevron link - the rule ui/action-group.tsx encodes
              and the mcp/copilot heroes follow. Bottom-aligned to the
              description like the featured-customers header. */}
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,40.3125rem)_auto] lg:items-end lg:justify-between lg:gap-12">
            {/* "Read docs" rides at the end of the copy instead of becoming a
                third button, leaving one primary + one secondary in the row. */}
            <p className="max-w-161 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg xl:text-xl xl:leading-[1.5]">
              {description}{" "}
              <Link
                className="gap-x-1 align-baseline"
                href={ROUTE.docsInApp as string}
                size="none"
                variant="foreground"
                animation="arrow-right"
                data-click-location="notify_inbox_section"
                data-click-text="read_docs"
              >
                Read docs
                <ChevronRight size={16} />
              </Link>
            </p>

            <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-5 lg:justify-self-end">
              <CopyPromptButton
                className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-39 [&_svg]:!size-3.5"
                size="sm"
                value={prompt}
              />
              <Button
                className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-auto"
                variant="outline"
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
            </div>
          </div>
        </header>

        <InboxCapabilities className="mt-12 md:mt-16" items={capabilities} />
      </div>
    </section>
  )
}

export default InboxSection
