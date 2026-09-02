import type { Metadata } from "next"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"
import { HowItWorks } from "@/components/pages/no-reply-is-dead/how-it-works"
import { WhatIsAWorkflow } from "@/components/pages/no-reply-is-dead/what-is-a-workflow"
import { AciFit } from "@/components/pages/no-reply-is-dead/aci-fit"
import { HeroVisual } from "@/components/pages/no-reply-is-dead/hero-visual"

export const metadata: Metadata = getMetadata({
  title: "Turn every notification into a conversation | Novu",
  description:
    "A notification used to be a dead end. Assign an agent to a Novu workflow and the reply becomes a real conversation, with the workflow, message, and payload already in context. Slack, Microsoft Teams, WhatsApp, Telegram, iMessage, and email.",
  pathname: "/no-reply-is-dead",
})

const CHANNELS = [
  "Slack",
  "Microsoft Teams",
  "WhatsApp",
  "Telegram",
  "iMessage",
  "Email",
]

export default function NoReplyIsDeadPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 md:pt-40">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
            <span className="rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none tracking-tighter text-purple-1">
              Agent-Assigned Workflows
            </span>
            <h1 className="mt-4 font-mono text-[2.5rem] leading-[1.03] font-normal tracking-[-0.03em] text-balance text-white md:text-[4.25rem]">
              Turn every notification into a{" "}
              <span className="text-purple-1">conversation</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-normal tracking-tighter text-gray-70 md:text-xl">
              Your product sends a notification. The user has a question. Today
              it hits a wall: a no-reply address and no context behind it. Assign
              an agent to the workflow, and that same notification becomes the
              opening turn of a real conversation.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <CopyCommand
                className="w-full max-w-xs sm:w-70.5"
                controlClassName="pl-3"
                command="npx novu connect"
                variant="highlighted"
              />
              <Button
                size="none"
                variant="outline-transparent"
                className="h-11 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
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
            </div>
            <p className="mt-5 font-mono text-sm tracking-tighter text-gray-60">
              Open source, ~40K GitHub stars · bring your own agent · no
              reply-handling backend to build.
            </p>
            </div>

            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Plain-language explainer for anyone new to Novu */}
      <WhatIsAWorkflow />

      {/* The centerpiece: how it works, 3 steps */}
      <HowItWorks />

      {/* Zoom out: name the category */}
      <AciFit />

      {/* Channels */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <h2 className="max-w-2xl text-[2rem] leading-[1.1] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
            The reply lands wherever the user already is.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {CHANNELS.map((channel) => (
              <span
                key={channel}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-20 bg-white/[0.02] px-4 py-2.5 font-mono text-sm tracking-tighter text-gray-80"
              >
                <span className="size-2 rounded-full bg-purple-1" />
                {channel}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mt-24 mb-24 md:mt-40 md:mb-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <div className="flex flex-col items-center rounded-2xl border border-gray-20 bg-white/[0.02] px-6 py-16 text-center md:py-20">
            <h2 className="max-w-2xl text-[2rem] leading-[1.05] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
              Stop sending mail no one can answer.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-normal tracking-tighter text-gray-70 md:text-lg">
              Assign an agent to a workflow and turn every notification into a
              conversation your users can actually reply to.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <CopyCommand
                className="w-full max-w-xs sm:w-70.5"
                controlClassName="pl-3"
                command="npx novu connect"
                variant="highlighted"
              />
              <Button
                size="none"
                variant="default"
                className="h-11 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
                asChild
              >
                <NextLink
                  href={ROUTE.connect}
                  data-click-location="no_reply_is_dead_closing"
                  data-click-text="start_free"
                >
                  Start free
                </NextLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
