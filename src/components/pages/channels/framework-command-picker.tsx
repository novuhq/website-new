"use client"

import { useState } from "react"
import type { IFrameworkCommand } from "@/data/pages/channel-frameworks"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, Copy } from "lucide-react"

import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import ChannelIcon from "@/components/pages/home/features/channel-icon"

interface IFrameworkCommandPickerProps {
  commands: IFrameworkCommand[]
  defaultChannelSlug: string
}

function getChannelIconKey(channelSlug: string) {
  return channelSlug === "microsoft-teams" ? "teams" : channelSlug
}

function ChannelLabel({ command }: { command: IFrameworkCommand }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <ChannelIcon
        channel={getChannelIconKey(command.channelSlug)}
        className="size-4 md:size-4"
        isMonochrome
      />
      <span className="truncate text-base">{command.channelName}</span>
    </span>
  )
}

function FrameworkCommandPicker({
  commands,
  defaultChannelSlug,
}: IFrameworkCommandPickerProps) {
  const initialChannelSlug =
    commands.find((command) => command.channelSlug === defaultChannelSlug)
      ?.channelSlug ??
    commands[0]?.channelSlug ??
    ""
  const [selectedChannelSlug, setSelectedChannelSlug] =
    useState(initialChannelSlug)
  const { isCopied, handleCopy, resetCopied } = useCopyToClipboard(2000)
  const current =
    commands.find((command) => command.channelSlug === selectedChannelSlug) ??
    commands[0]

  if (!current) return null

  const handleChannelChange = (channelSlug: string) => {
    setSelectedChannelSlug(channelSlug)
    resetCopied()
  }

  return (
    <div
      className="flex h-11 w-full min-w-0 items-stretch rounded-[0.25rem] border border-gray-30 bg-transparent focus-within:ring-2 focus-within:ring-foreground/30"
      data-slot="framework-command-picker"
    >
      <SelectPrimitive.Root
        value={selectedChannelSlug}
        onValueChange={handleChannelChange}
      >
        <SelectPrimitive.Trigger
          className="group relative flex w-40 shrink-0 items-center justify-between gap-1.5 rounded-tl-[0.25rem] rounded-bl-[0.25rem] bg-transparent px-[13px] text-left font-inter text-sm font-normal tracking-tighter text-gray-70 ring-0 outline-0 transition-colors outline-none before:absolute before:inset-x-0 before:-inset-y-0.5 hover:text-white focus-visible:z-10 focus-visible:text-white focus-visible:ring-2 focus-visible:ring-foreground/30 sm:w-44"
          aria-label="Select channel command"
        >
          <SelectPrimitive.Value>
            <ChannelLabel command={current} />
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
            className="z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-[0.25rem] border border-gray-20 bg-black font-inter shadow-xl outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            position="popper"
            sideOffset={2}
          >
            <SelectPrimitive.Viewport className="flex flex-col gap-0.5 p-1.5">
              {commands.map((command) => (
                <SelectPrimitive.Item
                  key={command.channelSlug}
                  value={command.channelSlug}
                  className="group relative flex cursor-default items-center justify-between gap-3 rounded-[0.25rem] px-[7px] py-1.5 text-sm text-foreground outline-none select-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[highlighted]:bg-[#191a1f] data-[state=checked]:bg-[#191a1f]"
                >
                  <SelectPrimitive.ItemText>
                    <ChannelLabel command={command} />
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

      <div className="my-auto h-5.5 w-px bg-gray-20" aria-hidden="false" />

      <div className="flex min-w-0 flex-1 items-center gap-3 pr-1.5 pl-3 font-mono text-base tracking-normal text-gray-80">
        <span className="shrink-0 text-gray-50 select-none">$</span>
        <code className="min-w-0 flex-1 truncate">{current.command}</code>
        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-sm text-gray-50 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          onClick={() => handleCopy(current.command)}
          aria-label={isCopied ? "Command copied" : "Copy selected command"}
        >
          {isCopied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}

export default FrameworkCommandPicker
