"use client"

import { useState } from "react"
import {
  DEFAULT_CHANNELS,
  DEFAULT_FRAMEWORKS,
  type IStackOption,
} from "@/data/pages/connect-stack-options"

import { buildFrameworkChannelConnectPrompt } from "@/lib/connect-prompt"
import { cn } from "@/lib/utils"
import { SelectField } from "@/components/ui/select-field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CopyPromptButton from "./copy-prompt-button"

export interface IConnectStackProps {
  aiFrameworks?: IStackOption[]
  channels?: IStackOption[]
  className?: string
  defaultChannelValue?: string
  description?: string
  title: string
  variant?: "compact" | "default"
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
  const prompt = buildFrameworkChannelConnectPrompt({
    frameworkName: frameworkLabel,
    channelName: channelLabel,
    connectPath: framework.connectPath,
  })

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

        <div className="w-full overflow-hidden rounded-xl border border-gray-20">
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
