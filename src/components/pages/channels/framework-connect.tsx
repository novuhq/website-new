import NextLink from "next/link"
import type { IChannelFrameworkCombo } from "@/data/pages/channel-frameworks"
import {
  fillTemplate,
  getConnectCommand,
  getFrameworkCommands,
} from "@/data/pages/channel-frameworks"

import CliCommand from "@/components/pages/home/features/cli-command"

const DOCS_URL = "https://docs.novu.co"

function FrameworkConnect({ combo }: { combo: IChannelFrameworkCombo }) {
  const { channel, framework } = combo
  const docsUrl = `${DOCS_URL}${framework.docsPath}`
  const allCommands = getFrameworkCommands(framework.slug)

  return (
    <section className="safe-paddings mt-18">
      <div className="container mx-auto max-w-176 px-5 md:px-8 lg:px-0">
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-white md:text-[2rem]">
            How to connect {framework.name} to {channel.channelName}
          </h2>
        </div>

        <ol className="mt-8 flex flex-col gap-6">
          {framework.steps.map((step, index) => (
            <li key={step.title} className="flex items-start gap-4">
              <span
                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-purple-3/40 bg-purple-3/20 text-sm leading-none font-medium text-purple-1"
                aria-hidden
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg leading-[1.2] font-normal tracking-[-0.03em] text-white">
                  {step.title}
                </h3>
                <p className="text-base leading-normal font-normal tracking-tighter text-gray-80">
                  {fillTemplate(step.body, combo)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <CliCommand
          command={getConnectCommand(combo)}
          className="mt-8 w-full rounded-md border-[#25262c] bg-[#05050b] text-base tracking-normal text-gray-80 sm:w-auto sm:max-w-full"
        />

        {allCommands.length > 1 && (
          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-gray-20 bg-[#05050b]/60 p-5 md:p-6">
            <h3 className="text-sm leading-none font-medium tracking-tighter text-gray-60">
              Every {framework.name} connect command
            </h3>
            <ul className="flex flex-col gap-2.5">
              {allCommands.map((item) => (
                <li
                  key={item.channelSlug}
                  className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="w-28 shrink-0 text-sm leading-none font-normal tracking-tighter text-gray-80">
                    {item.channelName}
                  </span>
                  <CliCommand
                    command={item.command}
                    className="w-full rounded-md border-[#25262c] bg-black text-sm tracking-normal text-gray-80"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 rounded-xl border border-gray-20 bg-[#05050b] p-5 md:p-6">
          <h3 className="text-sm leading-none font-medium tracking-tighter text-gray-60">
            Prompt for your coding agent
          </h3>
          <p className="text-base leading-normal font-normal tracking-tighter text-gray-90">
            {fillTemplate(framework.promptTemplate, combo)}
          </p>
        </div>

        <p className="mt-6 text-base leading-normal font-normal tracking-tighter text-gray-70">
          Full setup for {framework.name} lives in the{" "}
          <NextLink
            href={docsUrl}
            className="text-purple-1 underline underline-offset-4 transition-colors hover:text-white"
            data-click-location="framework_connect"
            data-click-text="framework_docs"
          >
            {framework.name} connect guide
          </NextLink>
          .
        </p>
      </div>
    </section>
  )
}

export default FrameworkConnect
