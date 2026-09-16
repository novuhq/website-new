import Image, { type StaticImageData } from "next/image"
import type {
  IWebChatBuilderTertiarySection,
  WebChatBuilderChannel,
} from "@/data/pages/web-chat-builders"
import email from "@/images/pages/channels/web-chat-builder/webflow/channel-email.svg"
import imessage from "@/images/pages/channels/web-chat-builder/webflow/channel-imessage.svg"
import more from "@/images/pages/channels/web-chat-builder/webflow/channel-more.svg"
import slack from "@/images/pages/channels/web-chat-builder/webflow/channel-slack.svg"
import teams from "@/images/pages/channels/web-chat-builder/webflow/channel-teams.svg"
import telegram from "@/images/pages/channels/web-chat-builder/webflow/channel-telegram.svg"
import tooltipArrow from "@/images/pages/channels/web-chat-builder/webflow/channel-tooltip-arrow.svg"
import webChat from "@/images/pages/channels/web-chat-builder/webflow/channel-web-chat.svg"
import whatsapp from "@/images/pages/channels/web-chat-builder/webflow/channel-whatsapp.svg"

import { cn } from "@/lib/utils"
import { CopyCommand } from "@/components/ui/copy-command"
import { TooltipContent } from "@/components/ui/tooltip"

import WebChatBuilderChannelHint from "./channel-hint"

const CHANNEL_ICONS: Record<
  WebChatBuilderChannel,
  { src: StaticImageData; className: string; crop?: boolean }
> = {
  telegram: { src: telegram, className: "size-13" },
  teams: { src: teams, className: "size-13" },
  email: { src: email, className: "size-13" },
  "web-chat": {
    src: webChat,
    className: "absolute -top-1 -left-2 size-17 max-w-none",
  },
  whatsapp: { src: whatsapp, className: "size-13" },
  slack: { src: slack, className: "size-13" },
  // Preserve the original Figma SVG's offset viewBox and crop to its 52px mark.
  imessage: {
    src: imessage,
    crop: true,
    className:
      "absolute top-[-94.2188px] left-[-106.188px] size-[216.667px] max-w-none",
  },
}

function WebChatBuilderTertiarySection({
  section,
  image,
}: {
  section: IWebChatBuilderTertiarySection
  image: StaticImageData
}) {
  return (
    <section
      aria-labelledby={section.id}
      className="mx-auto mt-24 max-w-320 px-5 md:mt-32 md:px-8 xl:mt-52"
    >
      <div className="flex flex-col gap-6 md:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="min-w-0 lg:max-w-168">
          <h2
            id={section.id}
            className="text-[2rem] leading-dense font-normal tracking-plus-tight text-white md:text-5xl"
          >
            {section.title}
          </h2>
          <p className="mt-6 text-lg leading-normal tracking-tight text-gray-70">
            {section.description}
          </p>
        </div>
        <CopyCommand
          command={section.command}
          className="min-w-0 sm:max-w-97.5 lg:mb-0.75 lg:shrink-0"
          controlClassName="h-11 gap-0 border-gray-30 bg-black pl-3.5"
          commandClassName="font-geist-mono text-sm leading-none tracking-tighter text-white sm:text-base"
          copyButtonClassName="size-11 rounded-sm text-gray-70 [&_svg]:size-4"
        />
      </div>
      <div className="mt-9 grid gap-6 rounded-3xl bg-card-surface/70 p-4 md:p-8 lg:grid-cols-[minmax(0,648fr)_minmax(0,480fr)]">
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:grid-cols-4 md:gap-6">
          {section.channels.map((channel) => (
            <li
              key={channel.icon}
              className="relative flex aspect-square min-w-0 items-center justify-center rounded-2xl bg-gray-20/60"
            >
              <span
                className={cn(
                  "relative flex size-13 -translate-y-1 items-center justify-center",
                  CHANNEL_ICONS[channel.icon].crop && "overflow-hidden"
                )}
              >
                <Image
                  src={CHANNEL_ICONS[channel.icon].src}
                  alt=""
                  width={52}
                  height={52}
                  className={CHANNEL_ICONS[channel.icon].className}
                />
              </span>
              <span className="absolute inset-x-2 bottom-3 text-center text-sm leading-dense tracking-tighter text-gray-60">
                {channel.name}
              </span>
            </li>
          ))}
          <li className="aspect-square min-w-0">
            <WebChatBuilderChannelHint
              content={
                <TooltipContent
                  side="top"
                  sideOffset={-19}
                  className="rounded-md border-gray-20 bg-card-surface px-2.75 py-2 font-inter font-normal tracking-tight text-gray-80 before:hidden after:hidden motion-reduce:animate-none motion-reduce:data-[state=closed]:animate-none"
                >
                  {section.moreChannelsHint}
                  <Image
                    src={tooltipArrow}
                    alt=""
                    width={30}
                    height={8}
                    className="absolute -bottom-4 left-1/2 h-2 w-7.5 -translate-x-1/2"
                  />
                </TooltipContent>
              }
            >
              <button
                type="button"
                aria-label={section.moreChannelsLabel}
                className="flex size-full cursor-pointer items-center justify-center rounded-2xl bg-white/2 focus-visible:ring-purple-2"
              >
                <Image
                  src={more}
                  alt=""
                  width={20}
                  height={20}
                  className="size-5"
                />
              </button>
            </WebChatBuilderChannelHint>
          </li>
        </ul>
        <div className="@container relative self-center overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt={section.imageAlt}
            className="h-auto w-full"
            sizes="(min-width: 1280px) 480px, (min-width: 1024px) 40vw, (min-width: 768px) calc(100vw - 128px), calc(100vw - 72px)"
          />
          <span
            aria-hidden="true"
            className="absolute top-[23.125cqw] right-[57.292cqw] w-[38.75cqw] rounded-t-[3.024cqw] rounded-br-[0.756cqw] rounded-bl-[3.024cqw] border border-white/20 bg-black [padding:1.667cqw_4.167cqw_1.875cqw_2.5cqw] text-[3.333cqw] leading-[1.2] font-normal tracking-[-0.01em] text-white shadow-[0_1.25cqw_1.458cqw_rgba(0,0,0,0.4)]"
          >
            {section.imageAlt}
          </span>
        </div>
      </div>
    </section>
  )
}

export default WebChatBuilderTertiarySection
