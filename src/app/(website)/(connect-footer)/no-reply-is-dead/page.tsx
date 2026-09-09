import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"
import CustomerLogos from "@/components/customer-logos"
import Cta from "@/components/pages/home/cta"
import { AciFit } from "@/components/pages/no-reply-is-dead/aci-fit"
import { Channels } from "@/components/pages/no-reply-is-dead/channels"
import { HeroVisual } from "@/components/pages/no-reply-is-dead/hero-visual"
import { HowItWorks } from "@/components/pages/no-reply-is-dead/how-it-works"
import { SeeItInAction } from "@/components/pages/no-reply-is-dead/see-it-in-action"
import { WhatIsAWorkflow } from "@/components/pages/no-reply-is-dead/what-is-a-workflow"

/* Only this route renders the command string the design sets in Geist Mono,
   so the face is declared here and preloaded on this route alone. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = getMetadata(SEO_DATA.noReplyIsDead)

export default function NoReplyIsDeadPage() {
  return (
    <div className={cn("font-inter", geistMono.variable)}>
      {/* Hero */}
      <section className="pt-24 md:pt-28 lg:pt-23">
        <div className="mx-auto max-w-304 px-5 md:px-8 2xl:px-0">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,34rem)_minmax(0,38rem)] lg:gap-16">
            {/* Below lg the hero stacks, so the copy centres over the visual
                in the same 608px column and only goes left-aligned at lg. */}
            <div className="mx-auto w-full max-w-152 text-center lg:mx-0 lg:max-w-none lg:text-left">
              <span className="flex items-center justify-center gap-3.25 lg:justify-start">
                <span className="size-2.5 shrink-0 bg-purple-3" aria-hidden />
                <span className="text-[0.8125rem] leading-none font-medium tracking-normal text-purple-1 uppercase">
                  Agent-Assigned Workflows
                </span>
              </span>

              <h1 className="mt-4.5 text-[2.5rem] leading-[1.04] font-normal tracking-plus-tight text-balance text-white md:text-[3.25rem] lg:text-[4rem]">
                Turn every notification into <br className="hidden lg:inline" />
                a conversation
              </h1>

              <p className="mx-auto mt-8 max-w-130 text-base leading-[1.5] tracking-tight text-gray-70 md:text-lg lg:mx-0">
                Your product sends a notification. The user has a question, but
                no-reply makes it a dead end. Assign an agent to the workflow,
                and every notification becomes the start of a real conversation.
              </p>

              <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Button
                  size="none"
                  variant="default"
                  className="h-11 w-full max-w-xs rounded-md px-5 text-base leading-none font-medium tracking-tight normal-case sm:w-auto"
                  asChild
                >
                  <NextLink
                    href={ROUTE.dashboardV2AgentsSignUp}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-click-location="no_reply_is_dead_hero"
                    data-click-text="sign_up_for_free"
                  >
                    Sign up for free
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

      <CustomerLogos className="mt-24 border-y-0 md:mt-28 lg:mt-16.5" />

      {/* Plain-language explainer for anyone new to Novu */}
      <WhatIsAWorkflow />

      {/* The centerpiece: how it works, 4 steps */}
      <HowItWorks />

      {/* Demo video of the whole flow */}
      <SeeItInAction />

      {/* Zoom out: name the category */}
      <AciFit />

      {/* Channels */}
      <Channels />

      {/* Closing CTA — shared with the home page */}
      <Cta
        className="lg:mt-32 xl:mt-50.75"
        title="Stop sending mail no one can answer"
        description="Assign an agent to a workflow and turn every notification into a conversation your users can actually reply to."
      />
    </div>
  )
}
