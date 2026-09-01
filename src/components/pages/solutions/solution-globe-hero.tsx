"use client"

import Image, { type StaticImageData } from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { AGENT_GLOBE_CARD_EVENTS } from "@/data/pages/solutions/ai-agents-globe-events"
import emailIcon from "@/svgs/pages/connect/channels/email.svg"
import slackIcon from "@/svgs/pages/connect/channels/slack.svg"
import teamsIcon from "@/svgs/pages/connect/channels/teams.png"
import telegramIcon from "@/svgs/pages/connect/channels/telegram.svg"
import whatsappIcon from "@/svgs/pages/connect/channels/whatsapp.svg"

import type { ISolutionPageData } from "@/types/solution"
import { cn } from "@/lib/utils"
import { CopyCommand } from "@/components/ui/copy-command"
import AnimatedCopyCheck from "@/components/pages/home/animated-copy-check"
import {
  HOME_CHANNEL_SELECT_EVENT,
  HOME_FEATURES_SECTION_ID,
  type IHomeChannelSelectDetail,
} from "@/components/pages/home/channel-navigation"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"
import HeroGlobe from "@/components/pages/home/hero-globe"

const CHANNEL_Z_INDEX_CLASSES = ["z-[5]", "z-[4]", "z-[3]", "z-[2]", "z-[1]"]

// The five approved Connect channels. Clicking one drives the Features section
// below (same event the homepage uses), so the hero and the section are one flow.
const CHANNELS: Array<{
  key: string
  name: string
  icon: StaticImageData | string
}> = [
  { key: "slack", name: "Slack", icon: slackIcon },
  { key: "teams", name: "Microsoft Teams", icon: teamsIcon },
  { key: "whatsapp", name: "WhatsApp", icon: whatsappIcon },
  { key: "telegram", name: "Telegram", icon: telegramIcon },
  { key: "email", name: "Email", icon: emailIcon },
]

function selectChannel(key: string) {
  window.dispatchEvent(
    new CustomEvent<IHomeChannelSelectDetail>(HOME_CHANNEL_SELECT_EVENT, {
      detail: { key },
    })
  )

  const target = document.getElementById(HOME_FEATURES_SECTION_ID)
  if (!target) return

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  })
}

function ChannelLinks() {
  return (
    <span
      className="flex w-fit items-center"
      role="group"
      aria-label="See your agent on each channel"
    >
      {CHANNELS.map(({ key, name, icon }, index) => (
        <a
          className={cn(
            "group relative flex size-12 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:outline-none lg:size-14",
            index > 0 && "-ml-2.5 lg:-ml-4",
            CHANNEL_Z_INDEX_CLASSES[index]
          )}
          href={`#${HOME_FEATURES_SECTION_ID}`}
          key={name}
          onClick={(event) => {
            event.preventDefault()
            selectChannel(key)
          }}
          aria-label={`See your agent on ${name}`}
        >
          <span className="pointer-events-none relative flex size-full items-center justify-center rounded-full border-[1.5px] border-gray-20 bg-[#05050B] shadow-[0_2px_5px_rgba(13,0,28,0.65)] transition-[border-color,translate] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-gray-40">
            <Image
              className="relative z-10 size-6 object-contain lg:size-7"
              src={icon}
              alt=""
              width={22}
              height={22}
              loading="eager"
              aria-hidden="true"
            />
          </span>
        </a>
      ))}
    </span>
  )
}

function SolutionGlobeHero({ solution }: { solution: ISolutionPageData }) {
  const { hero, command, prompt } = solution

  return (
    <section className="hero relative overflow-hidden bg-black font-inter">
      <HeroGlobe cardEvents={AGENT_GLOBE_CARD_EVENTS} />
      <div className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pt-14 text-center md:px-8 md:pt-20 lg:pt-24">
          <h1 className="max-w-3xl text-[2.5rem] leading-[1.05] font-normal tracking-plus-tight text-balance text-foreground md:text-[3.5rem] lg:text-[4rem] lg:leading-[1.05]">
            {hero.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-normal tracking-tight text-pretty text-[#a3a6b2] select-text md:text-lg md:leading-normal">
            {hero.subheading}
          </p>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            {command ? (
              <CopyCommand
                command={command}
                variant="highlighted"
                commandClassName="pointer-events-auto select-text"
                copiedContent={<AnimatedCopyCheck />}
              />
            ) : null}
            {prompt ? (
              <CopyPromptButton
                className="h-11 w-full px-5 text-base leading-none font-medium tracking-tight normal-case sm:w-39 [&_svg]:size-3.5"
                variant="outline-transparent"
                size="none"
                resetInterval={2000}
                value={prompt}
              />
            ) : null}
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 rounded-full border border-gray-20 bg-[#0B0C0E]/80 px-4 py-2 text-sm leading-none font-normal tracking-tight text-gray-60 backdrop-blur-sm">
            <span>First 5 replies run free. No account, no API key.</span>
            <NextLink
              className="text-gray-80 underline decoration-gray-40 underline-offset-2 transition-colors hover:text-white"
              href={ROUTE.bookADemo}
              data-click-location="solution_ai-agents_hero"
              data-click-text="book_a_call"
            >
              Or talk to us
            </NextLink>
          </p>
          <div className="mt-7">
            <ChannelLinks />
          </div>
        </div>

        {/* Reserve the globe's vertical space (the homepage fills this with a
            customer-logos band; we keep it clean so the globe reads centered). */}
        <div className="mt-[62vw] md:mt-[52vw] lg:mt-124" aria-hidden="true" />
      </div>
    </section>
  )
}

export default SolutionGlobeHero
