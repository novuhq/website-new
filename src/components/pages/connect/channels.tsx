import Image, { StaticImageData } from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import discord from "@/svgs/pages/connect/channels/discord.svg"
import email from "@/svgs/pages/connect/channels/email.svg"
import github from "@/svgs/pages/connect/channels/github.svg"
import googleChat from "@/svgs/pages/connect/channels/google-chat.svg"
import iMessage from "@/svgs/pages/connect/channels/imessage.svg"
import linear from "@/svgs/pages/connect/channels/linear.svg"
import messenger from "@/svgs/pages/connect/channels/messenger.svg"
import slack from "@/svgs/pages/connect/channels/slack.svg"
import teams from "@/svgs/pages/connect/channels/teams.png"
import telegram from "@/svgs/pages/connect/channels/telegram.svg"
import whatsapp from "@/svgs/pages/connect/channels/whatsapp.svg"
import zoom from "@/svgs/pages/connect/channels/zoom.svg"

import { cn } from "@/lib/utils"

type ChannelState = "default" | "coming-soon"

interface IChannel {
  name: string
  description?: string
  state?: ChannelState
  icon: StaticImageData
}

const CHANNELS: IChannel[] = [
  {
    name: "Slack",
    description: "Send team alerts",
    icon: slack,
  },
  {
    name: "WhatsApp",
    description: "Reach users fast",
    icon: whatsapp,
  },
  {
    name: "Email",
    description: "Deliver clean digests",
    icon: email,
  },
  {
    name: "Telegram",
    description: "Push instant updates",
    icon: telegram,
  },
  {
    name: "Teams",
    description: "Notify team channels",
    icon: teams,
  },
  {
    name: "Google Chat",
    state: "coming-soon",
    icon: googleChat,
  },
  {
    name: "iMessage",
    state: "coming-soon",
    icon: iMessage,
  },
  {
    name: "Linear",
    state: "coming-soon",
    icon: linear,
  },
  {
    name: "Zoom",
    state: "coming-soon",
    icon: zoom,
  },
  {
    name: "Discord",
    state: "coming-soon",
    icon: discord,
  },
  {
    name: "Messenger",
    state: "coming-soon",
    icon: messenger,
  },
  {
    name: "GitHub",
    state: "coming-soon",
    icon: github,
  },
]

function ChannelIcon({ icon }: { icon: StaticImageData }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[rgba(51,51,71,0.4)]">
      <Image
        className="size-6"
        src={icon}
        alt=""
        aria-hidden
        width={24}
        height={24}
      />
    </span>
  )
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex h-5 items-center overflow-visible rounded-xl border border-[#333347] bg-[rgba(38,38,52,0.8)] px-2 pt-0.75 pb-1.25 text-xs leading-none font-normal tracking-tighter text-gray-7 opacity-50">
      Coming soon
    </span>
  )
}

function ConnectAgentLabel() {
  return (
    <span className="flex items-center gap-1.5 text-[0.9375rem] leading-snug font-book tracking-normal text-lagune-3">
      Connect agent
      <svg
        className="h-4 w-1.5 shrink-0"
        width="6"
        height="16"
        viewBox="0 0 6 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path d="M1 12L5 8L1 4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>
  )
}

function ChannelTextSwap({ description }: { description: string }) {
  return (
    <div className="relative h-[1.3125rem] w-full overflow-hidden" aria-hidden>
      <p className="absolute inset-x-0 top-0 max-w-full transform-gpu truncate text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-8 text-swap-layer group-hover:-translate-y-2.5 group-hover:opacity-0 group-focus-visible:-translate-y-2.5 group-focus-visible:opacity-0 motion-reduce:transform-none">
        {description}
      </p>
      <span className="absolute inset-x-0 top-0 flex translate-y-2.5 transform-gpu items-center opacity-0 text-swap-layer group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transform-none">
        <ConnectAgentLabel />
      </span>
    </div>
  )
}

function ChannelCard({ name, description, state = "default", icon }: IChannel) {
  const isComingSoon = state === "coming-soon"
  const cardClassName = cn(
    "group flex h-21 min-w-0 items-center gap-4 overflow-hidden rounded-xl border border-[rgba(51,51,71,0.5)] bg-[rgba(15,15,21,0.8)] p-5 transition-[background,border-color,box-shadow] duration-200 ease-[ease] motion-reduce:transition-none",
    !isComingSoon &&
      "touch-manipulation outline-none hover:border-[rgba(51,51,71,0.6)] hover:[background:var(--integration-card-hover-bg)] focus-visible:border-[rgba(51,51,71,0.6)] focus-visible:[background:var(--integration-card-hover-bg)] focus-visible:ring-2 focus-visible:ring-lagune-3/40",
    isComingSoon && "opacity-60"
  )

  const content = (
    <>
      <ChannelIcon icon={icon} />

      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <h3 className="max-w-full truncate overflow-visible text-base leading-dense font-medium tracking-tighter text-white">
          {name}
        </h3>

        {isComingSoon ? (
          <ComingSoonBadge />
        ) : description ? (
          <ChannelTextSwap description={description} />
        ) : null}
      </div>
    </>
  )

  if (isComingSoon) {
    return (
      <article className={cardClassName} aria-disabled="true">
        {content}
      </article>
    )
  }

  return (
    <NextLink
      href={ROUTE.dashboardV2SignUp}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
      aria-label={`Connect ${name} agent`}
      data-click-location="connect_channels"
      data-click-text={`connect_${name.toLowerCase().replace(/\s+/g, "_")}_agent`}
    >
      {content}
    </NextLink>
  )
}

function ChannelCardsList() {
  return (
    <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {CHANNELS.map((channel) => (
        <li key={channel.name} className="min-w-0">
          <ChannelCard {...channel} />
        </li>
      ))}
    </ul>
  )
}

function Channels() {
  return (
    <section
      id="channels"
      className="scroll-mt-16 pt-28 md:pt-36 lg:pt-44 xl:pt-50"
    >
      <div className="mx-auto flex w-full max-w-304 flex-col items-center gap-12 px-5 md:px-8 2xl:px-0">
        <div className="flex w-full max-w-163 flex-col items-center gap-4 text-center">
          <h2 className="text-[1.75rem] leading-dense font-medium tracking-tighter text-white md:text-[2.5rem]">
            Work with your agent like a teammate in any channel
          </h2>
          <p className="max-w-150 text-base leading-normal font-normal tracking-tighter text-gray-8 md:text-lg">
            Pick one. Or all of them. Your agent shows up everywhere at once.
          </p>
        </div>

        <ChannelCardsList />
      </div>
    </section>
  )
}

export default Channels
