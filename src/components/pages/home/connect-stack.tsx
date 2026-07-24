"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import aiSdkIcon from "@/images/pages/home/ai-sdk-icon.png"
import langchainIcon from "@/images/pages/home/langchain-icon.svg"
import imessageIcon from "@/svgs/pages/connect/channels/imessage.svg"
import emailIcon from "@/svgs/pages/home/stack/email.svg"
import slackIcon from "@/svgs/pages/home/stack/slack.svg"
import teamsIcon from "@/svgs/pages/home/stack/teams.svg"
import telegramIcon from "@/svgs/pages/home/stack/telegram.svg"
import whatsappIcon from "@/svgs/pages/home/stack/whatsapp.svg"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"

import CopyPromptButton from "./copy-prompt-button"

export interface IStackOption {
  cliSlug?: string
  icon?: StaticImageData | string
  label: string
  promptLabel?: string
  value: string
}

export interface IConnectStackProps {
  aiFrameworks?: IStackOption[]
  channels?: IStackOption[]
  className?: string
  defaultChannelValue?: string
  description?: string
  title: string
}

const DEFAULT_CHANNELS: IStackOption[] = [
  {
    value: "email",
    label: "Email",
    icon: emailIcon,
  },
  {
    value: "telegram",
    label: "Telegram",
    icon: telegramIcon,
  },
  {
    value: "slack",
    label: "Slack",
    icon: slackIcon,
  },
  {
    value: "teams",
    label: "MS Teams",
    icon: teamsIcon,
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: whatsappIcon,
  },
  {
    value: "sendblue",
    label: "iMessage",
    icon: imessageIcon,
  },
]

const DEFAULT_FRAMEWORKS: IStackOption[] = [
  {
    value: "ai-sdk",
    label: "Vercel AI SDK",
    icon: aiSdkIcon,
  },
  {
    value: "langchain",
    label: "LangChain",
    icon: langchainIcon,
  },
  {
    value: "custom-code",
    label: "Custom code",
  },
  {
    value: "chat-sdk",
    label: "Chat SDK",
  },
]

function OptionLabel({ option }: { option: IStackOption }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {option.icon && (
        <span className="relative size-4 shrink-0">
          <Image
            className="size-4 object-contain"
            src={option.icon}
            alt=""
            width={16}
            height={16}
            aria-hidden
          />
        </span>
      )}
      <span className="truncate">{option.label}</span>
    </span>
  )
}

interface ISelectFieldProps {
  label: string
  onValueChange: (value: string) => void
  options: IStackOption[]
  value: string
}

function SelectField({
  label,
  options,
  value,
  onValueChange,
}: ISelectFieldProps) {
  const current = options.find((option) => option.value === value) ?? options[0]

  return (
    <label className="flex min-w-0 flex-col gap-2 text-sm font-medium tracking-tighter text-gray-60">
      <span className="h-4.5 leading-tight">{label}</span>
      <SelectPrimitive.Root value={current.value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          className="group relative flex h-10 w-full min-w-0 items-center justify-between gap-1.5 rounded-[0.25rem] border border-gray-20 bg-[#040406] px-[13px] text-left text-sm font-normal tracking-tighter text-foreground transition-colors outline-none before:absolute before:inset-x-0 before:-inset-y-0.5 hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/30"
          aria-label={label}
        >
          <SelectPrimitive.Value>
            <OptionLabel option={current} />
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon asChild>
            <svg
              className="relative -mr-0.5 w-2.5 shrink-0 text-gray-60 transition-transform group-data-[state=open]:rotate-180"
              viewBox="0 0 8 5"
              fill="none"
              aria-hidden
            >
              <path
                d="M1 1L4 4L7 1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-[0.25rem] border border-gray-20 bg-black shadow-xl"
            position="popper"
            sideOffset={2}
          >
            <SelectPrimitive.Viewport className="p-1.5">
              {options.map((option) => (
                <SelectPrimitive.Item
                  className="relative flex cursor-default items-center justify-between gap-3 rounded-[0.25rem] px-[7px] py-1.5 text-sm text-foreground outline-none select-none data-[highlighted]:bg-[#191a1f] data-[state=checked]:bg-[#191a1f]"
                  key={option.value}
                  value={option.value}
                >
                  <SelectPrimitive.ItemText>
                    <OptionLabel option={option} />
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <svg
                      className="size-3.5"
                      viewBox="0 0 15 15"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2 8L6 12L14 4"
                        stroke="currentColor"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                    </svg>
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </label>
  )
}

function ConnectStack({
  className,
  title,
  description,
  channels: channelOptions,
  defaultChannelValue,
  aiFrameworks: frameworkOptions,
}: IConnectStackProps) {
  const channels = channelOptions?.length ? channelOptions : DEFAULT_CHANNELS
  const frameworks = frameworkOptions?.length
    ? frameworkOptions
    : DEFAULT_FRAMEWORKS

  const [channelValue, setChannelValue] = useState(
    channels.find((option) => option.value === defaultChannelValue)?.value ??
      channels.find((option) => option.value === "slack")?.value ??
      channels[0].value
  )
  const [frameworkValue, setFrameworkValue] = useState(
    frameworks.find((option) => option.value === "ai-sdk")?.value ??
      frameworks[0].value
  )
  const channel =
    channels.find((option) => option.value === channelValue) ?? channels[0]
  const framework =
    frameworks.find((option) => option.value === frameworkValue) ??
    frameworks[0]
  const frameworkLabel = framework.promptLabel ?? framework.label
  const channelLabel = channel.promptLabel ?? channel.label
  const command = `npx novu connect --channel ${channel.cliSlug ?? channel.value} --runtime ${framework.cliSlug ?? framework.value}`
  const prompt = `Connect this project's ${frameworkLabel} agent to ${channelLabel} with Novu Connect. Inspect the repo (agent entry point, how ${frameworkLabel} is used, package manager, model provider, env conventions). Do not modify anything yet. Then have me run from the project root:

${command}

I will complete the interactive CLI and approve dependency installs when asked. When the CLI copies a follow-up prompt, ask me to paste that here and continue. Do not invent setup steps, supervise each CLI screen, or ask for secrets in chat. Stop after giving me the command.`

  return (
    <section
      className={cn(
        "connect-stack mt-24 w-full font-inter md:mt-28 lg:mt-32 xl:mt-50",
        className
      )}
    >
      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 items-start gap-12 px-5 md:px-8 lg:max-w-336 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-16 2xl:grid-cols-[38rem_32rem] 2xl:gap-40">
        <header className="flex max-w-152 flex-col lg:pt-8">
          <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-tighter text-foreground md:text-[2.75rem] md:leading-[1.125] md:tracking-plus-tight">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-152 text-base leading-normal tracking-tight text-pretty text-[#a3a6b2] md:text-xl md:leading-normal">
              {description}
            </p>
          )}
        </header>

        <div className="w-full overflow-hidden rounded-xl border border-gray-20 lg:h-102">
          <div className="border-b border-gray-20 p-5 md:p-8 lg:h-55.5">
            <h3 className="text-xl leading-snug font-medium tracking-[-0.01em] text-foreground md:text-[1.375rem]">
              Connect your stack
            </h3>
            <p className="mt-2 text-sm leading-normal tracking-tighter text-gray-60 md:text-base md:leading-snug">
              Generate a ready-to-use integration prompt for your agent.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField
                label="Communication channel"
                options={channels}
                value={channel.value}
                onValueChange={setChannelValue}
              />
              <SelectField
                label="AI Framework"
                options={frameworks}
                value={framework.value}
                onValueChange={setFrameworkValue}
              />
            </div>
          </div>

          <div className="bg-[#0b0c0e] p-5 md:p-8 lg:h-46.5">
            <h3 className="text-xl leading-snug font-medium tracking-[-0.01em] text-foreground md:text-[1.375rem]">
              Generated prompt
            </h3>
            <p className="mt-2 text-sm leading-normal tracking-tighter text-gray-60 md:text-base md:leading-snug">
              Copy this prompt to connect your agent.
            </p>

            <div className="mt-5.5 flex h-10 min-w-0 items-center rounded-md border border-[#534b5d] bg-[#040406] p-1 focus-within:ring-2 focus-within:ring-foreground/30">
              <code className="min-w-0 flex-1 truncate px-2 font-mono text-xs text-foreground md:text-sm">
                {prompt}
              </code>
              <CopyPromptButton
                className="h-8 w-16.25 shrink-0 rounded-[0.25rem] px-0 text-sm normal-case before:-inset-y-1.5"
                size="sm"
                label="Copy"
                copiedLabel=""
                showCopyIcon={false}
                value={prompt}
                copiedMessage="Generated prompt copied to clipboard"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConnectStack
