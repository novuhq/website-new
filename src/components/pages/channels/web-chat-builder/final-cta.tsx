import type { IWebChatBuilderFinalCta } from "@/data/pages/web-chat-builders"

import { CopyCommand } from "@/components/ui/copy-command"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"

function WebChatBuilderFinalCta({ cta }: { cta: IWebChatBuilderFinalCta }) {
  return (
    <section
      aria-labelledby="web-chat-builder-cta-title"
      className="mt-24 px-5 pb-24 md:mt-32 md:px-8 md:pb-32 xl:mt-52"
    >
      <div className="mx-auto flex max-w-210.5 flex-col items-center gap-8 text-center">
        <div className="flex w-full flex-col items-center gap-4">
          <h2
            id="web-chat-builder-cta-title"
            className="max-w-160 text-4xl leading-dense font-normal tracking-plus-tight text-balance text-white md:text-5xl lg:text-[4rem]"
          >
            {cta.title}
          </h2>
          <p className="max-w-184 text-base leading-normal tracking-tighter text-balance text-gray-60 lg:text-xl">
            {cta.description}
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5 sm:flex-row">
          <CopyCommand
            command={cta.command}
            variant="highlighted"
            className="w-full sm:w-111.5"
            controlClassName="gap-3 pl-3 max-sm:h-auto max-sm:min-h-11 max-sm:py-1"
            commandClassName="font-geist-mono max-sm:overflow-visible max-sm:text-sm max-sm:whitespace-normal"
          />
          <CopyPromptButton
            value={cta.prompt}
            label={cta.promptLabel}
            showCopyIcon={false}
            size="none"
            className="h-11 w-full shrink-0 px-5 text-base leading-none font-medium tracking-tight motion-reduce:transition-none sm:w-34"
          />
        </div>
      </div>
    </section>
  )
}

export default WebChatBuilderFinalCta
