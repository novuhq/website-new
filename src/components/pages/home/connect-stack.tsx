"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import imessageIcon from "@/svgs/pages/connect/channels/imessage.svg"
import awsIcon from "@/svgs/pages/home/stack/aws.svg"
import chatSdkIcon from "@/svgs/pages/home/stack/chat-sdk.svg"
import claudeIcon from "@/svgs/pages/home/stack/claude.svg"
import customCodeIcon from "@/svgs/pages/home/stack/custom-code.svg"
import emailIcon from "@/svgs/pages/home/stack/email.svg"
import langChainIcon from "@/svgs/pages/home/stack/lang-chain.svg"
import slackIcon from "@/svgs/pages/home/stack/slack.svg"
import teamsIcon from "@/svgs/pages/home/stack/teams.svg"
import telegramIcon from "@/svgs/pages/home/stack/telegram.svg"
import whatsappIcon from "@/svgs/pages/home/stack/whatsapp.svg"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CopyPromptButton from "./copy-prompt-button"

export interface IStackOption {
  cliSlug?: string
  icon?: StaticImageData | string
  label: string
  promptLabel?: string
  promptTemplate?: string
  value: string
}

export interface IConnectStackProps {
  aiFrameworks?: IStackOption[]
  channels?: IStackOption[]
  className?: string
  defaultChannelValue?: string
  description?: string
  title: string
  variant?: "compact" | "default"
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
    icon: chatSdkIcon,
  },
  {
    value: "langchain",
    label: "LangChain",
    icon: langChainIcon,
  },
  {
    value: "custom-code",
    label: "Custom code",
    icon: customCodeIcon,
  },
  {
    value: "chat-sdk",
    label: "Chat SDK",
    icon: chatSdkIcon,
  },
  {
    value: "claude-managed-agent",
    label: "Claude Managed Agent",
    icon: claudeIcon,
    cliSlug: "claude",
    promptTemplate: `Create a Claude Managed Agent with Novu and connect it to [SELECTED_CHANNEL].

Run this command:

npx novu connect --channel [CHANNEL_SLUG] --runtime claude

The Novu CLI will guide you through the complete setup. Follow the prompts to connect your Anthropic credentials, describe the agent you want to create, review the skills and tools Novu adds, preview the agent, create it, and connect [SELECTED_CHANNEL].

You do not need to scaffold a project or modify application code for this setup.`,
  },
  {
    value: "aws-claude-managed-agent",
    label: "AWS Claude Managed Agent",
    icon: awsIcon,
    cliSlug: "claude-aws",
    promptTemplate: `Create a Claude Managed Agent on AWS with Novu and connect it to [SELECTED_CHANNEL].

Run this command:

npx novu connect --channel [CHANNEL_SLUG] --runtime claude-aws

The Novu CLI will guide you through the complete setup. Follow the prompts to complete the required credential flow, describe the agent you want to create, review the skills and tools Novu adds, preview the agent, create it, and connect [SELECTED_CHANNEL].

You do not need to scaffold a project or modify application code for this setup.`,
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
    <label className="flex min-w-0 flex-col gap-2">
      <span className="h-4.5 text-sm leading-tight font-medium tracking-tighter text-gray-60">
        {label}
      </span>
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
            className="z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-[0.25rem] border border-gray-20 bg-black font-inter shadow-xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            position="popper"
            sideOffset={2}
          >
            <SelectPrimitive.Viewport className="flex flex-col gap-0.5 p-1.5">
              {options.map((option) => (
                <SelectPrimitive.Item
                  className="relative flex cursor-pointer items-center justify-between gap-3 rounded-[0.25rem] px-[7px] py-1.5 text-sm text-foreground outline-none select-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[highlighted]:bg-[#191a1f] data-[state=checked]:bg-[#191a1f]"
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
  variant = "default",
}: IConnectStackProps) {
  const isCompact = variant === "compact"
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
  const [activeMethod, setActiveMethod] = useState("prompt")
  const channel =
    channels.find((option) => option.value === channelValue) ?? channels[0]
  const framework =
    frameworks.find((option) => option.value === frameworkValue) ??
    frameworks[0]
  const frameworkLabel = framework.promptLabel ?? framework.label
  const channelLabel = channel.promptLabel ?? channel.label
  const channelSlug = channel.cliSlug ?? channel.value
  const command = `npx novu connect --channel ${channelSlug} --runtime ${framework.cliSlug ?? framework.value}`
  const defaultPrompt = `Connect this project's ${frameworkLabel} agent to ${channelLabel} with Novu Connect. Inspect the repo (agent entry point, how ${frameworkLabel} is used, package manager, model provider, env conventions). Do not modify anything yet. Then have me run from the project root:

${command}

I will complete the interactive CLI and approve dependency installs when asked. When the CLI copies a follow-up prompt, ask me to paste that here and continue. Do not invent setup steps, supervise each CLI screen, or ask for secrets in chat. Stop after giving me the command.`
  const prompt = framework.promptTemplate
    ? framework.promptTemplate
        .replaceAll("[SELECTED_CHANNEL]", channelLabel)
        .replaceAll("[CHANNEL_SLUG]", channelSlug)
    : defaultPrompt

  return (
    <section
      className={cn(
        "connect-stack mt-24 w-full font-inter md:mt-28 lg:mt-32 xl:mt-50",
        isCompact && "mt-18 md:mt-18 lg:mt-18 xl:mt-18",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-3xl grid-cols-1 items-start gap-12 px-5 md:px-8 lg:max-w-336 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] lg:gap-16",
          isCompact &&
            "max-w-176 gap-8 lg:max-w-176 lg:grid-cols-1 lg:gap-8 lg:px-0 2xl:grid-cols-1 2xl:gap-8"
        )}
      >
        <header
          className={cn(
            "flex max-w-160 flex-col lg:pt-8",
            isCompact && "max-w-full lg:pt-0"
          )}
        >
          <h2
            className={cn(
              "text-[1.75rem] leading-[1.125] font-normal tracking-tighter text-foreground md:text-[2.5rem] md:leading-[1.125] md:tracking-plus-tight",
              isCompact &&
                "md:text-[2rem] md:leading-[1.125] md:tracking-[-0.04em]"
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mt-4 max-w-160 text-base leading-snug tracking-tight text-pretty text-gray-70 md:text-xl md:leading-normal md:tracking-tighter",
                isCompact &&
                  "max-w-151.5 tracking-tighter text-gray-80 md:text-base md:leading-snug"
              )}
            >
              {description}
            </p>
          )}
        </header>

        <div className="w-full overflow-hidden rounded-xl border border-gray-20 lg:min-h-124">
          <div className="border-b border-gray-20 p-5 md:p-8">
            <h3 className="text-xl leading-snug font-medium tracking-[-0.01em] text-foreground">
              1. Choose your setup
            </h3>
            <p className="mt-1 text-base/snug tracking-tighter text-gray-60">
              Select the channel and framework your agent uses.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
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

          <div className="p-5 md:p-8">
            <h3 className="text-xl leading-snug font-medium tracking-[-0.01em] text-foreground">
              2. Connect your agent
            </h3>
            <p className="mt-1 text-base/snug tracking-tighter text-gray-60">
              Copy the prompt or run the CLI command to connect your agent.
              <br />
              Generated for {channelLabel} and {frameworkLabel}.
            </p>

            <Tabs
              className="mt-7 w-full overflow-hidden rounded-sm border border-gray-20 bg-[#0B0C0E]"
              value={activeMethod}
              onValueChange={setActiveMethod}
            >
              <TabsList className="grid h-10 w-full grid-cols-2 rounded-none border-b border-gray-20 bg-black p-0">
                <TabsTrigger
                  className="h-full rounded-none border-r border-gray-20 bg-[#0B0C0E] px-3 text-[.8125rem] font-normal tracking-tighter text-gray-60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none focus-visible:ring-inset data-[state=active]:bg-gray-12 data-[state=active]:text-foreground"
                  tabIndex={0}
                  value="prompt"
                >
                  AI prompt
                </TabsTrigger>
                <TabsTrigger
                  className="h-full rounded-none bg-[#0B0C0E] px-3 text-[.8125rem] font-normal tracking-tighter text-gray-60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none focus-visible:ring-inset data-[state=active]:bg-gray-12 data-[state=active]:text-foreground"
                  tabIndex={0}
                  value="cli"
                >
                  CLI command
                </TabsTrigger>
              </TabsList>

              <TabsContent className="mt-0 h-14" value="prompt">
                <div className="flex h-full min-w-0 items-center gap-3 px-3">
                  <code className="min-w-0 flex-1 truncate px-1 font-mono text-sm text-foreground">
                    {prompt}
                  </code>
                  <CopyPromptButton
                    className="size-8 shrink-0 rounded-[0.25rem] border border-gray-20 p-0 text-gray-60 before:hidden hover:border-gray-50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none"
                    variant="none"
                    size="none"
                    label="Copy AI prompt"
                    copiedLabel="Copied AI prompt"
                    showLabel={false}
                    value={prompt}
                    copiedMessage="Generated prompt copied to clipboard"
                  />
                </div>
              </TabsContent>

              <TabsContent className="mt-0 h-14" value="cli">
                <div className="flex h-full min-w-0 items-center gap-3 px-3">
                  <code className="min-w-0 flex-1 truncate px-1 font-mono text-sm text-foreground">
                    {command}
                  </code>
                  <CopyPromptButton
                    className="size-8 shrink-0 rounded-[0.25rem] border border-gray-20 p-0 text-gray-60 before:hidden hover:border-gray-50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none"
                    variant="none"
                    size="none"
                    label="Copy CLI command"
                    copiedLabel="Copied CLI command"
                    showLabel={false}
                    value={command}
                    copiedMessage="npx command copied to clipboard"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConnectStack
