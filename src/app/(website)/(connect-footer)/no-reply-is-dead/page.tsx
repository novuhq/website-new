import type { Metadata } from "next"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"
import CustomerLogos from "@/components/customer-logos"
import Cta from "@/components/pages/home/cta"
import { AciFit } from "@/components/pages/no-reply-is-dead/aci-fit"
import { Channels } from "@/components/pages/no-reply-is-dead/channels"
import { HeroVisual } from "@/components/pages/no-reply-is-dead/hero-visual"
import { HowItWorks } from "@/components/pages/no-reply-is-dead/how-it-works"
import { WhatIsAWorkflow } from "@/components/pages/no-reply-is-dead/what-is-a-workflow"

export const metadata: Metadata = getMetadata({
  title: "Turn every notification into a conversation | Novu",
  description:
    "A notification used to be a dead end. Assign an agent to a Novu workflow and the reply becomes a real conversation, with the workflow, message, and payload already in context. Slack, Microsoft Teams, WhatsApp, Telegram, iMessage, and email.",
  pathname: "/no-reply-is-dead",
})

export default function NoReplyIsDeadPage() {
  return (
    <div className="font-inter">
      {/* Hero */}
      <section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-304 px-5 md:px-8 2xl:px-0">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,34rem)_minmax(0,38rem)] lg:gap-16">
            <div>
              <span className="flex items-center gap-3.25">
                <span className="size-2.5 shrink-0 bg-purple-3" aria-hidden />
                <span className="text-[0.8125rem] leading-none font-medium tracking-normal text-purple-1 uppercase">
                  Agent-Assigned Workflows
                </span>
              </span>

              <h1 className="mt-4.5 text-[2.5rem] leading-[1.04] font-normal tracking-plus-tight text-balance text-white md:text-[3.25rem] lg:text-[4rem]">
                Turn every notification into <br className="hidden lg:inline" />
                a conversation
              </h1>

              <p className="mt-8 max-w-130 text-base leading-[1.5] tracking-tight text-gray-70 md:text-lg">
                Your product sends a notification. The user has a question, but
                no-reply makes it a dead end. Assign an agent to the workflow,
                and every notification becomes the start of a real conversation.
              </p>

              <div className="mt-12 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <Button
                  size="none"
                  variant="default"
                  className="h-11 rounded-md px-5 text-base leading-none font-medium tracking-tight normal-case"
                  asChild
                >
                  <NextLink
                    href={ROUTE.connect}
                    data-click-location="no_reply_is_dead_hero"
                    data-click-text="add_an_agent"
                  >
                    Add an agent
                  </NextLink>
                </Button>
                <CopyCommand
                  className="w-full max-w-xs sm:w-70.5"
                  controlClassName="pl-3"
                  commandClassName="font-geist-mono"
                  command="npx novu connect"
                  variant="highlighted"
                />
              </div>
            </div>

            <HeroVisual />
          </div>
        </div>
      </section>

      <CustomerLogos className="mt-24 border-y-0 md:mt-32 lg:mt-40" />

      {/* Plain-language explainer for anyone new to Novu */}
      <WhatIsAWorkflow />

      {/* The centerpiece: how it works, 4 steps */}
      <HowItWorks />

      {/* Zoom out: name the category */}
      <AciFit />

      {/* Channels */}
      <Channels />

      {/* Closing CTA — shared with the home page */}
      <Cta
        title="Stop sending mail no one can answer"
        description="Assign an agent to a workflow and turn every notification into a conversation your users can actually reply to."
      />
    </div>
  )
}
