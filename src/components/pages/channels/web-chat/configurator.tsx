"use client"

import { useState } from "react"
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
  CONFIGURATOR_FRAMEWORK_SELECT_LABEL,
  CONFIGURATOR_HEADING,
  CONFIGURATOR_PROMPT_RESULT_LABEL,
  CONFIGURATOR_PROMPT_TAB_LABEL,
} from "@/data/pages/web-chat-configurator"

import { buildFrameworkChannelConnectPrompt } from "@/lib/connect-prompt"
import { SelectField } from "@/components/ui/select-field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"

/**
 * §8 "Build your connection. Ship it from any builder." (Task 15). Figma
 * section `45487-81721` (open-dropdown state `45497-147645`, CLI-tab state
 * `45501-148681`). Not personalized: no `HueLayer`, no `--wc-accent*`.
 *
 * `SelectField` and the option lists come from `@/components/ui/select-field`
 * and `@/data/pages/connect-stack-options` — see that data module's file
 * header for why those files were created here rather than by the Task 3 this
 * plan expected to have shipped them (it's still BLOCKED; see its report).
 *
 * Layout: no Figma frame authors this section below desktop (the mobile page
 * `45487-98982` jumps from §6 straight to its end, three separate fetches
 * confirmed — the same gap `product-bento.tsx` already documents for §3). The
 * two-column split only activates at `xl` (1280px+, where the section's own
 * 1248px content width plus padding actually fits); narrower viewports stack
 * the card under the copy, a reasoned fallback rather than an invented frame.
 */

const CHANNEL_OPTIONS: IStackOption[] = [WEB_CHAT_CHANNEL, ...DEFAULT_CHANNELS]
const FRAMEWORK_OPTIONS = DEFAULT_FRAMEWORKS

type ConfiguratorTab = "prompt" | "cli"

function BuilderLogoRow() {
  return (
    <div
      className="group flex w-full items-center gap-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent_3%,rgba(0,0,0,.5)_20%,#000_30%,#000_70%,rgba(0,0,0,.5)_80%,transparent_97%)]"
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
      <span className="text-sm font-medium tracking-[-0.02em] text-gray-60">
        {label}
      </span>
      <div className="rounded-[6px] border border-[#313349] bg-black/30 px-3.5 py-3">
        <code className="block font-mono text-sm leading-normal break-words text-white">
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

  const channel =
    CHANNEL_OPTIONS.find((option) => option.value === channelValue) ??
    CHANNEL_OPTIONS[0]
  const framework =
    FRAMEWORK_OPTIONS.find((option) => option.value === frameworkValue) ??
    FRAMEWORK_OPTIONS[0]

  const channelSlug = channel.cliSlug ?? channel.value
  const frameworkSlug = framework.cliSlug ?? framework.value
  const command = `npx novu connect --channel ${channelSlug} --runtime ${frameworkSlug}`
  const prompt = buildFrameworkChannelConnectPrompt({
    frameworkName: framework.promptLabel ?? framework.label,
    channelName: channel.promptLabel ?? channel.label,
    connectPath: framework.connectPath,
  })

  const isPromptTab = activeTab === "prompt"

  return (
    <section className="mt-24 md:mt-32">
      <div className="container mx-auto max-w-[1312px] px-5 md:px-8">
        <div className="flex flex-col gap-14 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex w-full flex-col xl:max-w-[532px] xl:shrink-0">
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

          <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-[28px] xl:mx-0 xl:w-[640px] xl:shrink-0">
            <Image
              alt=""
              aria-hidden
              className="object-cover opacity-80"
              fill
              src={CONFIGURATOR_BLOB_IMAGE}
            />
            <div
              className="absolute inset-0 wc-noise-overlay opacity-30"
              aria-hidden
            />

            <div className="relative flex items-center justify-center px-5 py-14 sm:px-13 sm:py-20">
              <div
                className="w-full max-w-[428px] rounded-[32px] border border-white p-2.5 shadow-[0_12px_23px_-10px_rgba(0,0,0,0.3)] backdrop-blur-[90px]"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <div
                  className="flex w-full flex-col gap-6 rounded-[20px] border border-white/10 p-6 shadow-[0_12px_39px_-10px_rgba(0,0,0,0.9)] backdrop-blur-[64px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(146deg, rgba(63, 14, 167, 0.14) 0%, rgba(63, 14, 167, 0) 75%), linear-gradient(-34deg, rgba(5, 15, 196, 0.1) 0%, rgba(142, 146, 226, 0) 98%), radial-gradient(circle at 50% 50%, rgba(9, 10, 11, 1) 0%, rgba(11, 12, 14, 0.9) 80%)",
                  }}
                >
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl font-medium tracking-[-0.01em] text-white">
                      {CONFIGURATOR_CARD_TITLE}
                    </h3>
                    <p className="text-base tracking-[-0.02em] text-gray-60">
                      {CONFIGURATOR_CARD_SUBTITLE}
                    </p>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(value as ConfiguratorTab)
                    }
                  >
                    <TabsList className="grid h-auto w-full grid-cols-2 gap-0 rounded-[6px] border border-[#313349] bg-black/50 p-0">
                      <TabsTrigger
                        className="h-full rounded-[6px] px-6 py-3.5 text-base tracking-[-0.02em] text-gray-60 data-[state=active]:bg-[#211F37] data-[state=active]:text-white"
                        value="prompt"
                      >
                        {CONFIGURATOR_PROMPT_TAB_LABEL}
                      </TabsTrigger>
                      <TabsTrigger
                        className="h-full rounded-[6px] px-6 py-3.5 text-base tracking-[-0.02em] text-gray-60 data-[state=active]:bg-[#211F37] data-[state=active]:text-white"
                        value="cli"
                      >
                        {CONFIGURATOR_CLI_TAB_LABEL}
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-[18px] flex flex-col gap-[18px]">
                      <SelectField
                        label={CONFIGURATOR_CHANNEL_SELECT_LABEL}
                        onValueChange={setChannelValue}
                        options={CHANNEL_OPTIONS}
                        value={channel.value}
                      />
                      <SelectField
                        label={CONFIGURATOR_FRAMEWORK_SELECT_LABEL}
                        onValueChange={setFrameworkValue}
                        options={FRAMEWORK_OPTIONS}
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
                      className="flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#E0E1E5] px-5 py-3.5 text-base font-medium tracking-[-0.025em] text-black before:hidden hover:bg-white"
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
                      className="flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#E0E1E5] px-5 py-3.5 text-base font-medium tracking-[-0.025em] text-black before:hidden hover:bg-white"
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
