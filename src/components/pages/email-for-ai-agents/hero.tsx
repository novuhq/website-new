import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { CornerUpLeft, Mail, ShieldCheck } from "lucide-react"

import type { IChannelPageData } from "@/types/channel"
import { Button } from "@/components/ui/button"
import CliCommand from "@/components/pages/home/features/cli-command"

// A bespoke hero for the /email-for-ai-agents master page. It keeps the channel
// hero's text + CTA structure but adds an email-client mockup that visualizes
// the product story: an AI agent writing a real, two-way email thread that Novu
// delivers, complete with a customer reply and a secure action.
function EmailAgentsHero({ channel }: { channel: IChannelPageData }) {
  const agentLine = channel.useCase.transcript.find(
    (line) => line.role === "agent"
  )
  const customerReply = channel.useCase.transcript.find(
    (line) => line.role === "customer" && /approve/i.test(line.text)
  )

  return (
    <section className="relative overflow-hidden pt-20 md:pt-24 lg:pt-32">
      <div
        className="pointer-events-none absolute top-10 -right-20 -z-10 hidden size-125 rounded-full bg-purple-3/20 blur-3xl lg:block"
        aria-hidden
      />
      <div className="container mx-auto grid max-w-304 grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 lg:px-0">
        <div className="flex flex-col items-start">
          <span className="rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none font-normal tracking-tighter text-purple-1">
            {channel.hero.eyebrow}
          </span>
          <h1 className="mt-3.5 max-w-full text-[2.25rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
            {channel.hero.heading}
          </h1>
          <p className="mt-4 max-w-168.5 text-base leading-normal font-normal tracking-tighter text-gray-70 md:text-xl md:leading-normal">
            {channel.hero.subheading}
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button
              size="none"
              variant="default"
              className="h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
              asChild
            >
              <NextLink
                href={ROUTE.connect}
                data-click-location="email_agents_hero"
                data-click-text="explore_connect"
              >
                Explore Novu Connect
              </NextLink>
            </Button>
            <CliCommand
              command={`npx novu connect --channel ${channel.cliSlug}`}
              className="w-full rounded-md border-[#25262c] bg-[#05050b] text-base tracking-normal text-gray-80 sm:w-97.5"
            />
          </div>
        </div>

        <EmailThreadPreview
          agentText={agentLine?.text}
          customerReplyText={customerReply?.text}
        />
      </div>
    </section>
  )
}

function EmailThreadPreview({
  agentText,
  customerReplyText,
}: {
  agentText?: string
  customerReplyText?: string
}) {
  return (
    <div className="relative w-full max-w-120 justify-self-center lg:justify-self-end">
      <div className="overflow-hidden rounded-xl border border-gray-20 bg-[#0b0c0e] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 border-b border-gray-20 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#2a2b31]" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#2a2b31]" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#2a2b31]" aria-hidden />
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs tracking-tighter text-gray-50">
            <Mail className="size-3.5" aria-hidden />
            Inbox
          </span>
        </div>

        <div className="px-5 py-5">
          <div className="flex items-center gap-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-3/25 text-sm font-medium text-purple-1"
              aria-hidden
            >
              BA
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium tracking-tighter text-white">
                  Brightledger Agent
                </p>
                <span className="inline-flex shrink-0 items-center rounded-full border border-purple-3/40 bg-purple-3/20 px-1.5 py-0.5 text-[0.6875rem] leading-none font-normal tracking-tighter text-purple-1">
                  via Novu
                </span>
              </div>
              <p className="truncate text-xs tracking-tighter text-gray-50">
                to you · now
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-tight font-normal tracking-tighter text-gray-40">
            Re: This month&apos;s platform fee
          </p>
          <p className="mt-2 text-sm leading-normal font-normal tracking-tighter text-gray-80">
            {agentText}
          </p>

          <div className="mt-5 rounded-lg border border-gray-20 bg-black/40 px-4 py-3">
            <div className="flex items-center gap-2 text-xs tracking-tighter text-gray-50">
              <CornerUpLeft className="size-3.5" aria-hidden />
              Tomás replied
            </div>
            <p className="mt-1.5 text-sm font-normal tracking-tighter text-gray-90">
              {customerReplyText}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-3/20 px-3 py-2 text-sm font-medium tracking-tighter text-purple-1">
              <ShieldCheck className="size-4" aria-hidden />
              Issue credit
            </span>
            <span className="text-xs tracking-tighter text-gray-50">
              secure action link
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailAgentsHero
