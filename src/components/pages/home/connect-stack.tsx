"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import aiSdkIcon from "@/images/pages/home/ai-sdk-icon.png"
import claudeIcon from "@/images/pages/home/claude-agent.svg"
import langchainIcon from "@/images/pages/home/langchain-icon.svg"
import emailIcon from "@/svgs/pages/home/stack/email.svg"
import googleChatIcon from "@/svgs/pages/home/stack/google-chat.svg"
import slackIcon from "@/svgs/pages/home/stack/slack.svg"
import teamsIcon from "@/svgs/pages/home/stack/teams.svg"
import telegramIcon from "@/svgs/pages/home/stack/telegram.svg"
import whatsappIcon from "@/svgs/pages/home/stack/whatsapp.svg"
import * as SelectPrimitive from "@radix-ui/react-select"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

import CopyPromptButton from "./copy-prompt-button"

export interface IStackOption {
  icon?: StaticImageData | string
  label: string
  promptLabel?: string
  value: string
}

export interface IConnectStackProps {
  aiFrameworks?: IStackOption[]
  channels?: IStackOption[]
  className?: string
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
    value: "google-chat",
    label: "Google Chat",
    icon: googleChatIcon,
  },
]

const DEFAULT_FRAMEWORKS: IStackOption[] = [
  {
    value: "vercel-ai-sdk",
    label: "Vercel AI SDK",
    icon: aiSdkIcon,
  },
  {
    value: "claude-agent",
    label: "Claude Agent",
    promptLabel: "Claude agent",
    icon: claudeIcon,
  },
  {
    value: "langchain",
    label: "LangChain",
    icon: langchainIcon,
  },
]

function OptionLabel({ option }: { option: IStackOption }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {option.icon && (
        <span className="relative size-4 shrink-0">
          <Image
            className={cn(
              "size-4 object-contain",
              option.value === "claude-agent" &&
                "absolute -inset-[6.666px] size-[29.333px] max-w-none"
            )}
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

interface IMultiSelectFieldProps {
  label: string
  onValueChange: (value: string[]) => void
  options: IStackOption[]
  value: string[]
}

function MultiSelectField({
  label,
  options,
  value,
  onValueChange,
}: IMultiSelectFieldProps) {
  const selectedOptions = value
    .map((selectedValue) =>
      options.find((option) => option.value === selectedValue)
    )
    .filter((option): option is IStackOption => Boolean(option))
  const current = selectedOptions[0] ?? options[0]

  const handleCheckedChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      if (!value.includes(optionValue)) {
        onValueChange([...value, optionValue])
      }
      return
    }

    if (value.length > 1) {
      onValueChange(
        value.filter((selectedValue) => selectedValue !== optionValue)
      )
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-2 text-sm font-medium tracking-tighter text-gray-60">
      <span className="h-4.5 leading-tight">{label}</span>
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger
          className="group relative flex h-10 w-full min-w-0 items-center justify-between gap-1.5 rounded-[0.25rem] border border-gray-20 bg-[#040406] px-[13px] text-left text-sm font-normal tracking-tighter text-foreground transition-colors outline-none before:absolute before:inset-x-0 before:-inset-y-0.5 hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/30"
          aria-label={label}
        >
          <OptionLabel option={current} />
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
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            className="z-50 min-w-(--radix-dropdown-menu-trigger-width) rounded-[0.25rem] border border-gray-20 bg-black p-1.5 shadow-xl ring-0 ring-transparent outline-none"
            align="start"
            sideOffset={2}
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value)

              return (
                <DropdownMenuPrimitive.CheckboxItem
                  className="relative flex cursor-default items-center gap-1.5 rounded-[0.25rem] px-[7px] py-1.5 text-sm text-foreground outline-none select-none data-[highlighted]:bg-[#191a1f] data-[highlighted]:ring-0 data-[highlighted]:ring-transparent data-[state=checked]:bg-[#191a1f]"
                  key={option.value}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(option.value, checked === true)
                  }
                  onSelect={(event) => event.preventDefault()}
                >
                  <OptionLabel option={option} />
                  <span
                    className={cn(
                      "ml-auto flex size-4 shrink-0 items-center justify-center rounded-[2px] border",
                      isSelected
                        ? "border-white bg-white text-black"
                        : "border-gray-20 bg-transparent"
                    )}
                    aria-hidden
                  >
                    {isSelected && (
                      <svg className="size-3" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3.5 8L6.5 11L12.5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="square"
                        />
                      </svg>
                    )}
                  </span>
                </DropdownMenuPrimitive.CheckboxItem>
              )
            })}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </div>
  )
}

function formatChannelList(labels: string[]) {
  if (labels.length < 2) return labels[0] ?? "your selected channel"
  if (labels.length === 2) return labels.join(" and ")

  return `${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}`
}

function ConnectStack({
  className,
  title,
  description,
  channels: channelOptions,
  aiFrameworks: frameworkOptions,
}: IConnectStackProps) {
  const channels = channelOptions?.length ? channelOptions : DEFAULT_CHANNELS
  const frameworks = frameworkOptions?.length
    ? frameworkOptions
    : DEFAULT_FRAMEWORKS

  const [channelValues, setChannelValues] = useState<string[]>([
    channels.find((option) => option.value === "slack")?.value ??
      channels[0].value,
  ])
  const [frameworkValue, setFrameworkValue] = useState(
    frameworks.find((option) => option.value === "vercel-ai-sdk")?.value ??
      frameworks[0].value
  )
  const selectedChannels = channelValues
    .map((selectedValue) =>
      channels.find((option) => option.value === selectedValue)
    )
    .filter((option): option is IStackOption => Boolean(option))
  const framework =
    frameworks.find((option) => option.value === frameworkValue) ??
    frameworks[0]
  const channelList = formatChannelList(
    selectedChannels.map((channel) => channel.label)
  )
  const prompt = `Prompt example: Connect this ${framework.promptLabel ?? framework.label} to ${channelList} with Novu Connect. Configure secure two-way messaging, identify each user, and route agent replies back to ${selectedChannels.length === 1 ? `the same ${channelList} conversation` : "their originating channel conversations"}.`

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
              <MultiSelectField
                label="Communication channel"
                options={channels}
                value={channelValues}
                onValueChange={setChannelValues}
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
