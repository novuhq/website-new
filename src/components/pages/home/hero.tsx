"use client"

import Image, { type StaticImageData } from "next/image"
import gangverkLogo from "@/images/pages/home/gangverk.svg"
import checkpointLogo from "@/images/pages/pricing/logos/checkpoint.svg"
import cloudSoftwareLogo from "@/images/pages/pricing/logos/cloud-software-group.svg"
import eburyLogo from "@/images/pages/pricing/logos/ebury.svg"
import elProffenLogo from "@/images/pages/pricing/logos/el-proffen.svg"
import medvolLogo from "@/images/pages/pricing/logos/medvol.svg"
import mongodbLogo from "@/images/pages/pricing/logos/mongodb.svg"
import trustflightLogo from "@/images/pages/pricing/logos/trustflight.svg"
import emailIcon from "@/svgs/pages/connect/channels/email.svg"
import imessageIcon from "@/svgs/pages/connect/channels/imessage.svg"
import slackIcon from "@/svgs/pages/connect/channels/slack.svg"
import teamsIcon from "@/svgs/pages/connect/channels/teams.png"
import telegramIcon from "@/svgs/pages/connect/channels/telegram.svg"
import whatsappIcon from "@/svgs/pages/connect/channels/whatsapp.svg"

import { cn } from "@/lib/utils"
import { CopyCommand } from "@/components/ui/copy-command"
import Logos from "@/components/ui/logos"

import AnimatedCopyCheck from "./animated-copy-check"
import {
  HOME_CHANNEL_SELECT_EVENT,
  HOME_FEATURES_SECTION_ID,
  type IHomeChannelSelectDetail,
} from "./channel-navigation"
import CopyPromptButton from "./copy-prompt-button"
import HeroGlobe from "./hero-globe"

const DEFAULT_PROMPT =
  "Connect my AI agent to customers across their preferred channels with Novu using instructions from https://novu.co/agents.md"

const CHANNEL_HOVER_STYLES = {
  telegram: {
    glow: "bg-[radial-gradient(49.9437%_49.9437%_at_80.7327%_8.6316%,rgba(44,163,219,0.2)_0%,rgba(44,163,219,0)_100%),radial-gradient(65.2802%_65.2802%_at_4.4785%_107.1865%,rgba(44,163,219,0.2)_0%,rgba(44,163,219,0)_100%)]",
    border:
      "bg-[linear-gradient(220deg,rgba(44,163,219,0.17)_0%,rgba(44,163,219,0.17)_100%),linear-gradient(213deg,rgba(44,163,219,0.3)_0%,rgba(44,163,219,0)_28.082%,rgba(44,163,219,0)_79.624%,rgba(44,163,219,0.3)_100%)]",
  },
  green: {
    glow: "bg-[radial-gradient(49.9437%_49.9437%_at_80.7327%_8.6316%,rgba(84,207,96,0.2)_0%,rgba(84,207,96,0)_100%),radial-gradient(65.2802%_65.2802%_at_4.4785%_107.1865%,rgba(43,182,64,0.2)_0%,rgba(43,182,64,0)_100%)]",
    border:
      "bg-[linear-gradient(220deg,rgba(84,207,96,0.17)_2.25014%,rgba(42,182,64,0.17)_100%),linear-gradient(213deg,rgba(85,207,97,0.3)_0%,rgba(85,207,97,0)_28.082%,rgba(42,182,64,0)_79.624%,rgba(42,182,64,0.3)_100%)]",
  },
  slack: {
    glow: "bg-[radial-gradient(49.9437%_49.9437%_at_80.7327%_8.6316%,rgba(46,182,125,0.2)_0%,rgba(46,182,125,0)_100%),radial-gradient(65.2802%_65.2802%_at_4.4785%_107.1865%,rgba(224,30,90,0.2)_0%,rgba(224,30,90,0)_100%)]",
    border:
      "bg-[linear-gradient(220deg,rgba(46,182,125,0.17)_0%,rgba(224,30,90,0.17)_100%),linear-gradient(213deg,rgba(46,182,125,0.3)_0%,rgba(46,182,125,0)_28.082%,rgba(224,30,90,0)_79.624%,rgba(224,30,90,0.3)_100%)]",
  },
  teams: {
    glow: "bg-[radial-gradient(49.9437%_49.9437%_at_80.7327%_8.6316%,rgba(98,100,167,0.25)_0%,rgba(98,100,167,0)_100%),radial-gradient(65.2802%_65.2802%_at_4.4785%_107.1865%,rgba(98,100,167,0.25)_0%,rgba(98,100,167,0)_100%)]",
    border:
      "bg-[linear-gradient(220deg,rgba(98,100,167,0.2)_0%,rgba(98,100,167,0.2)_100%),linear-gradient(213deg,rgba(98,100,167,0.35)_0%,rgba(98,100,167,0)_28.082%,rgba(98,100,167,0)_79.624%,rgba(98,100,167,0.35)_100%)]",
  },
  monochrome: {
    glow: "bg-[radial-gradient(49.9437%_49.9437%_at_80.7327%_8.6316%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),radial-gradient(65.2802%_65.2802%_at_4.4785%_107.1865%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]",
    border:
      "bg-[linear-gradient(220deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.17)_100%),linear-gradient(213deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_28.082%,rgba(255,255,255,0)_79.624%,rgba(255,255,255,0.3)_100%)]",
  },
} as const

const CHANNEL_Z_INDEX_CLASSES = [
  "z-[6]",
  "z-[5]",
  "z-[4]",
  "z-[3]",
  "z-[2]",
  "z-[1]",
]

const CHANNELS: Array<{
  key: string
  name: string
  icon: StaticImageData | string
  hover: (typeof CHANNEL_HOVER_STYLES)[keyof typeof CHANNEL_HOVER_STYLES]
}> = [
  {
    key: "slack",
    name: "Slack",
    icon: slackIcon,
    hover: CHANNEL_HOVER_STYLES.slack,
  },
  {
    key: "teams",
    name: "Microsoft Teams",
    icon: teamsIcon,
    hover: CHANNEL_HOVER_STYLES.teams,
  },
  {
    key: "imessage",
    name: "iMessage",
    icon: imessageIcon,
    hover: CHANNEL_HOVER_STYLES.green,
  },
  {
    key: "email",
    name: "Email",
    icon: emailIcon,
    hover: CHANNEL_HOVER_STYLES.monochrome,
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    icon: whatsappIcon,
    hover: CHANNEL_HOVER_STYLES.green,
  },
  {
    key: "telegram",
    name: "Telegram",
    icon: telegramIcon,
    hover: CHANNEL_HOVER_STYLES.telegram,
  },
]

const CUSTOMER_LOGOS = [
  { name: "El Proffen", image: elProffenLogo },
  { name: "TrustFlight", image: trustflightLogo },
  { name: "MedVol", image: medvolLogo },
  { name: "Check Point", image: checkpointLogo },
  { name: "MongoDB", image: mongodbLogo },
  { name: "Cloud Software Group", image: cloudSoftwareLogo },
  { name: "Gangverk", image: gangverkLogo },
  { name: "Ebury", image: eburyLogo },
].map(({ name, image }) => ({
  src: image,
  alt: name,
  width: image.width,
  height: image.height,
  wrapperClassName: "flex h-6 w-36 items-center justify-center md:h-8",
  imageClassName: "h-auto max-h-6 w-auto max-w-full object-contain md:max-h-8",
}))

export interface IHeroProps {
  className?: string
  command?: string
  description: string
  prompt?: string
  title: string
}

function ChannelIcons() {
  const selectChannel = (key: string) => {
    const detail: IHomeChannelSelectDetail = { key }

    window.dispatchEvent(
      new CustomEvent<IHomeChannelSelectDetail>(HOME_CHANNEL_SELECT_EVENT, {
        detail,
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

  return (
    <span
      className="mt-3 flex w-fit translate-y-px align-baseline md:mt-0 md:ml-3 md:inline-flex lg:ml-3"
      role="group"
      aria-label="Explore communication channels"
    >
      {CHANNELS.map(({ key, name, icon, hover }, index) => (
        <a
          className={cn(
            "group relative flex size-12 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:outline-none lg:size-15",
            index > 0 && "-ml-2.5 lg:-ml-5",
            CHANNEL_Z_INDEX_CLASSES[index]
          )}
          href={`#${HOME_FEATURES_SECTION_ID}`}
          key={name}
          onClick={(event) => {
            event.preventDefault()
            selectChannel(key)
          }}
          aria-label={`Open the ${name} channel example`}
        >
          <span className="pointer-events-none relative flex size-full items-center justify-center rounded-full border-[1.5px] border-gray-20 bg-[#05050B] shadow-[0_2px_5px_rgba(13,0,28,0.65)] transition-[border-color,translate] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-transparent">
            <span
              className={cn(
                "pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100",
                hover.glow
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "pointer-events-none absolute -inset-px rounded-full border-gradient border-[1.5px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100",
                hover.border
              )}
              aria-hidden="true"
            />
            <Image
              className="relative z-10 size-6 object-contain lg:size-8"
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

function Hero({
  title,
  description,
  command = "npx novu connect",
  prompt = DEFAULT_PROMPT,
  className,
}: IHeroProps) {
  return (
    <section
      className={cn(
        "hero relative overflow-hidden bg-black font-inter",
        className
      )}
    >
      <HeroGlobe />
      <div className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="mx-auto grid w-full max-w-352 gap-4 px-5 pt-10 md:px-8 md:pt-14 lg:grid-cols-[minmax(0,46rem)_minmax(0,30.1875rem)] lg:justify-between lg:gap-12 lg:pt-[71px]">
          <h1 className="w-full max-w-184 shrink-0 text-[2.25rem] leading-[1.05] font-normal tracking-plus-tight text-balance text-foreground md:text-[3.375rem] lg:text-[3.25rem] lg:leading-[1.125] xl:text-[3.75rem]">
            {title}
            <ChannelIcons />
          </h1>

          <div className="flex max-w-121 flex-col lg:justify-end lg:justify-self-end lg:pb-2.5 xl:pb-3.5">
            <p className="pointer-events-auto text-base leading-normal tracking-tight text-pretty text-[#a3a6b2] select-text md:text-lg md:leading-normal">
              {description}
            </p>
            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 lg:mt-7">
              <CopyCommand
                command={command}
                variant="highlighted"
                commandClassName="pointer-events-auto select-text"
                copiedContent={<AnimatedCopyCheck />}
              />
              <CopyPromptButton
                className="h-11 w-full px-5 text-base leading-none font-medium tracking-tight normal-case hover:border-[#867A94] hover:bg-white/7 sm:w-39 [&_svg]:size-3.5"
                variant="outline-transparent"
                size="none"
                resetInterval={2000}
                value={prompt}
              />
            </div>
          </div>
        </div>

        <div
          className="mt-[70vw] border-y border-gray-3 bg-black md:mt-[65vw] lg:mt-147"
          role="region"
          aria-label="Trusted by teams worldwide"
        >
          <div className="scrollbar-hidden mx-auto w-full max-w-384 overflow-hidden px-5 motion-reduce:overflow-x-auto md:px-8">
            <Logos
              logos={CUSTOMER_LOGOS}
              className="mx-0 p-0 lg:mx-0 lg:p-0"
              animationClassName="animate-logos will-change-transform motion-reduce:animate-none"
              trackClassName="h-18 md:h-21 lg:w-max"
              listClassName="gap-7 pr-7 lg:w-max lg:justify-start lg:gap-7 lg:pr-7"
              duplicateListClassName="gap-7 pr-7 motion-reduce:hidden lg:flex lg:gap-7 lg:pr-7"
              useMask
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
