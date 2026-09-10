"use client"

import { useState } from "react"
import { Geist_Mono } from "next/font/google"
import Image from "next/image"
import {
  DEFAULT_CHANNELS,
  DEFAULT_FRAMEWORKS,
  WEB_CHAT_CHANNEL,
  type IStackOption,
} from "@/data/pages/connect-stack-options"
import {
  CONFIGURATOR_BLOB_IMAGE,
  CONFIGURATOR_BUILDER_LOGOS,
  CONFIGURATOR_CARD_SUBTITLE,
  CONFIGURATOR_CARD_TITLE,
  CONFIGURATOR_CHANNEL_SELECT_LABEL,
  CONFIGURATOR_CLI_RESULT_LABEL,
  CONFIGURATOR_CLI_TAB_LABEL,
  CONFIGURATOR_COPY_CLI_LABEL,
  CONFIGURATOR_COPY_PROMPT_LABEL,
  CONFIGURATOR_DESCRIPTION,
  CONFIGURATOR_FRAME_IMAGE,
  CONFIGURATOR_FRAMEWORK_SELECT_LABEL,
  CONFIGURATOR_HEADING,
  CONFIGURATOR_PROMPT_RESULT_LABEL,
  CONFIGURATOR_PROMPT_TAB_LABEL,
} from "@/data/pages/web-chat-configurator"
import ConfiguratorCheckboxIcon from "@/svgs/pages/channels/web-chat/configurator-checkbox.inline.svg"
import ConfiguratorChevronIcon from "@/svgs/pages/channels/web-chat/configurator-chevron.inline.svg"
import configuratorEmailIcon from "@/svgs/pages/channels/web-chat/configurator-email.svg"
import configuratorSlackIcon from "@/svgs/pages/channels/web-chat/configurator-slack.svg"
import configuratorTeamsIcon from "@/svgs/pages/channels/web-chat/configurator-teams.svg"
import configuratorTelegramIcon from "@/svgs/pages/channels/web-chat/configurator-telegram.svg"
import configuratorVercelIcon from "@/svgs/pages/channels/web-chat/configurator-vercel.svg"
import configuratorWebChatIcon from "@/svgs/pages/channels/web-chat/configurator-web-chat.svg"
import configuratorWhatsappIcon from "@/svgs/pages/channels/web-chat/configurator-whatsapp.svg"
import { preload } from "react-dom"

import {
  buildConnectCommand,
  buildFrameworkChannelConnectPrompt,
} from "@/lib/connect-prompt"
import { cn } from "@/lib/utils"
import { SelectField } from "@/components/ui/select-field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"

/**
 * §8 "Build your connection. Ship it from any builder." (Task 15). Figma
 * section `45440-69446` (open-selector UI `45497-148452`, CLI-tab UI
 * `45501-148837`). Not personalized: no `HueLayer`, no `--wc-accent*`.
 *
 * `SelectField` and the option lists come from `@/components/ui/select-field`
 * and `@/data/pages/connect-stack-options` — see that data module's file
 * header for background on why those files were originally created here as
 * a net-new extraction. `connect-stack.tsx` now imports from both modules
 * too, so this configurator and the homepage share one implementation.
 *
 * The supplied design only includes this section at desktop width. The
 * two-column layout starts at `xl`; narrower screens stack the form below
 * the copy and retain its corner radii and control spacing.
 */

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const CHANNEL_ICONS: Record<string, IStackOption["icon"]> = {
  email: configuratorEmailIcon,
  telegram: configuratorTelegramIcon,
  slack: configuratorSlackIcon,
  teams: configuratorTeamsIcon,
  whatsapp: configuratorWhatsappIcon,
}

const CHANNEL_OPTIONS: IStackOption[] = [
  { ...WEB_CHAT_CHANNEL, icon: configuratorWebChatIcon },
  ...DEFAULT_CHANNELS.map((option) => ({
    ...option,
    icon: CHANNEL_ICONS[option.value] ?? option.icon,
  })),
]
const FRAMEWORK_OPTIONS = DEFAULT_FRAMEWORKS.map((option) =>
  option.value === "ai-sdk"
    ? { ...option, icon: configuratorVercelIcon }
    : option
)

const SELECT_TRIGGER_CLASS_NAME =
  "h-10.5 rounded-md border-[#313349] bg-transparent px-3 text-base leading-none tracking-tighter focus-visible:bg-white/5 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:border-white [&>span:first-child]:min-w-0 [&>span:first-child>span]:gap-2"

const SELECT_CONTENT_CLASS_NAME =
  "origin-(--radix-select-content-transform-origin) duration-150 motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 motion-reduce:animate-none"

const SELECT_INDICATOR = (
  <ConfiguratorChevronIcon
    className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
    aria-hidden="true"
    focusable="false"
  />
)

type ConfiguratorTab = "prompt" | "cli"

function renderOptionCheckbox(selected: boolean) {
  return selected ? (
    <ConfiguratorCheckboxIcon
      className="size-4 shrink-0"
      aria-hidden="true"
      focusable="false"
    />
  ) : (
    <span
      className="size-4 shrink-0 rounded-xs border border-white"
      aria-hidden="true"
    />
  )
}

function BuilderLogoRow() {
  return (
    <div
      className="flex w-full items-center gap-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent_3%,rgba(0,0,0,.5)_20%,#000_30%,#000_70%,rgba(0,0,0,.5)_80%,transparent_97%)]"
      role="presentation"
    >
      {[false, true].map((ariaHidden, listIndex) => (
        <ul
          className="flex shrink-0 items-center gap-14 motion-safe:animate-logos-forward"
          aria-hidden={ariaHidden}
          key={listIndex}
        >
          {CONFIGURATOR_BUILDER_LOGOS.map((logo, index) => (
            <li
              className="flex shrink-0 items-center"
              key={`${listIndex}-${index}`}
            >
              <Image
                alt={ariaHidden ? "" : logo.name}
                className="h-8 w-auto object-contain"
                unoptimized
                height={logo.height}
                src={logo.src}
                width={logo.width}
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

function ConfiguratorResult({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="h-4.5 text-sm leading-tight font-medium tracking-tighter text-gray-60">
        {label}
      </span>
      {/* Figma truncates this preview to one line. The full generated value
          remains selectable and is used by the copy button. */}
      <div className="rounded-md bg-black/30 px-3.5 py-3 outline outline-[#313349]">
        <code
          className={cn(
            "block truncate text-sm leading-normal text-white",
            geistMono.className
          )}
        >
          {value}
        </code>
      </div>
    </div>
  )
}

export function WebChatConfigurator() {
  const [channelValue, setChannelValue] = useState(WEB_CHAT_CHANNEL.value)
  const [frameworkValue, setFrameworkValue] = useState("ai-sdk")
  const [activeTab, setActiveTab] = useState<ConfiguratorTab>("prompt")

  for (const { icon } of [...CHANNEL_OPTIONS, ...FRAMEWORK_OPTIONS]) {
    if (icon) {
      preload(typeof icon === "string" ? icon : icon.src, { as: "image" })
    }
  }

  const channel =
    CHANNEL_OPTIONS.find((option) => option.value === channelValue) ??
    CHANNEL_OPTIONS[0]
  const framework =
    FRAMEWORK_OPTIONS.find((option) => option.value === frameworkValue) ??
    FRAMEWORK_OPTIONS[0]

  const channelSlug = channel.cliSlug ?? channel.value
  const frameworkSlug = framework.cliSlug ?? framework.value
  const command = buildConnectCommand({ channelSlug, frameworkSlug })
  const prompt = buildFrameworkChannelConnectPrompt({
    frameworkName: framework.promptLabel ?? framework.label,
    channelName: channel.promptLabel ?? channel.label,
    connectPath: framework.connectPath,
  })

  const isPromptTab = activeTab === "prompt"

  return (
    <section className="font-inter" data-testid="web-chat-configurator">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336">
        <div className="flex flex-col gap-14 xl:flex-row xl:items-start xl:justify-between">
          <div className="relative z-10 flex w-full flex-col xl:ml-8 xl:max-w-[532px] xl:shrink-0 xl:pt-37">
            <h2 className="max-w-[420px] text-[32px] leading-[1.25] tracking-[-0.04em] text-white md:max-w-[532px] md:text-[48px] md:leading-[1.04]">
              {CONFIGURATOR_HEADING}
            </h2>
            <p className="mt-4 max-w-[420px] text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:mt-[18px] md:max-w-[483px] md:text-gray-70">
              {CONFIGURATOR_DESCRIPTION}
            </p>
            <div className="mt-10 min-w-0 xl:mt-[132px]">
              <BuilderLogoRow />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-160 xl:mx-0 xl:w-160 xl:shrink-0">
            {/* Figma's form does not clip its glow. These percentages map the
                full export's render bounds into the authored 640 × 680 frame;
                its 80% group opacity is already included in the asset.
                Screen removes the export's black canvas without covering
                content in adjacent sections as the artwork overflows. */}
            <Image
              alt=""
              aria-hidden
              className="pointer-events-none absolute top-[-61.2104%] left-[-62.0935%] h-[229.267%] w-[212.0935%] max-w-none mix-blend-screen"
              unoptimized
              src={CONFIGURATOR_BLOB_IMAGE}
            />

            <div className="relative flex items-center justify-center py-14 sm:h-170 sm:px-13 sm:py-0">
              <div className="relative w-full max-w-107.5 rounded-[32px] border border-transparent p-2.5 shadow-[0_12px_23px_-10px_rgba(0,0,0,0.3)]">
                {/* Figma's glass frame, including its blurred color and stroke,
                    is baked into this decorative asset. Nine-slice scaling
                    preserves the 32px corners on narrow screens without live
                    backdrop filters, which caused repaint flicker. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-px border-[32px] border-transparent"
                  style={{
                    borderImageSource: `url(${CONFIGURATOR_FRAME_IMAGE.src})`,
                    borderImageSlice: 32,
                    borderImageRepeat: "stretch",
                  }}
                />
                <div
                  className="relative flex w-full flex-col gap-6 rounded-[20px] p-6"
                  style={{
                    backgroundImage:
                      "linear-gradient(152.826deg, rgba(63, 14, 167, 0.14) 2.9963%, rgba(63, 14, 167, 0) 72.647%), linear-gradient(-26.589deg, rgba(5, 15, 196, 0.1) 12.214%, rgba(142, 146, 226, 0) 83.219%), radial-gradient(ellipse 107.18% 50% at 50% 50%, rgba(9, 10, 11, 1) 0%, rgba(11, 12, 14, 0.9) 80.147%)",
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-[20px] border border-white/10 mix-blend-soft-light"
                  />
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl leading-none font-medium tracking-[-0.01em] text-white">
                      {CONFIGURATOR_CARD_TITLE}
                    </h3>
                    <p className="text-base leading-snug tracking-[-0.02em] text-gray-60">
                      {CONFIGURATOR_CARD_SUBTITLE}
                    </p>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(value as ConfiguratorTab)
                    }
                  >
                    <TabsList className="grid h-11 w-full grid-cols-2 gap-0 overflow-hidden rounded-md bg-black/50 p-0 ring-1 ring-[#313349]">
                      <TabsTrigger
                        className="h-full rounded-none px-2 py-3.5 text-sm leading-none font-normal tracking-tighter text-gray-60 data-[state=active]:bg-[#211F37] data-[state=active]:text-white sm:px-6 sm:text-base"
                        value="prompt"
                      >
                        {CONFIGURATOR_PROMPT_TAB_LABEL}
                      </TabsTrigger>
                      <TabsTrigger
                        className="h-full rounded-none px-2 py-3.5 text-sm leading-none font-normal tracking-tighter text-gray-60 data-[state=active]:bg-[#211F37] data-[state=active]:text-white sm:px-6 sm:text-base"
                        value="cli"
                      >
                        {CONFIGURATOR_CLI_TAB_LABEL}
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-4.5 flex flex-col gap-4.5">
                      <SelectField
                        className="gap-2.5"
                        contentClassName={SELECT_CONTENT_CLASS_NAME}
                        indicator={SELECT_INDICATOR}
                        label={CONFIGURATOR_CHANNEL_SELECT_LABEL}
                        onValueChange={setChannelValue}
                        options={CHANNEL_OPTIONS}
                        renderOptionIndicator={renderOptionCheckbox}
                        triggerClassName={SELECT_TRIGGER_CLASS_NAME}
                        value={channel.value}
                      />
                      <SelectField
                        className="gap-2.5"
                        contentClassName={SELECT_CONTENT_CLASS_NAME}
                        indicator={SELECT_INDICATOR}
                        label={CONFIGURATOR_FRAMEWORK_SELECT_LABEL}
                        onValueChange={setFrameworkValue}
                        options={FRAMEWORK_OPTIONS}
                        renderOptionIndicator={renderOptionCheckbox}
                        triggerClassName={SELECT_TRIGGER_CLASS_NAME}
                        value={framework.value}
                      />

                      <TabsContent className="mt-0" value="prompt">
                        <ConfiguratorResult
                          label={CONFIGURATOR_PROMPT_RESULT_LABEL}
                          value={prompt}
                        />
                      </TabsContent>
                      <TabsContent className="mt-0" value="cli">
                        <ConfiguratorResult
                          label={CONFIGURATOR_CLI_RESULT_LABEL}
                          value={command}
                        />
                      </TabsContent>
                    </div>
                  </Tabs>

                  {isPromptTab ? (
                    <CopyPromptButton
                      className="flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#E0E1E5] px-5 py-3.5 text-base leading-none font-medium tracking-[-0.025em] text-black before:hidden hover:bg-white"
                      copiedMessage="Generated prompt copied to clipboard"
                      key="copy-prompt"
                      label={CONFIGURATOR_COPY_PROMPT_LABEL}
                      showCopyIcon={false}
                      size="none"
                      textClassName="gap-1.5"
                      value={prompt}
                      variant="none"
                    />
                  ) : (
                    <CopyPromptButton
                      className="flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#E0E1E5] px-5 py-3.5 text-base leading-none font-medium tracking-[-0.025em] text-black before:hidden hover:bg-white"
                      copiedMessage="npx command copied to clipboard"
                      key="copy-cli"
                      label={CONFIGURATOR_COPY_CLI_LABEL}
                      showCopyIcon={false}
                      size="none"
                      textClassName="gap-1.5"
                      value={command}
                      variant="none"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
