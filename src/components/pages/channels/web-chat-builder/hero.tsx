import Image, { type StaticImageData } from "next/image"
import type { IWebChatBuilderHero } from "@/data/pages/web-chat-builders"

import { CopyCommand } from "@/components/ui/copy-command"
import CustomerLogos from "@/components/customer-logos"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"
import WebChatBuilderLogo from "@/components/web-chat-builder-logo"

function WebChatBuilderHero({
  hero,
  image,
}: {
  hero: IWebChatBuilderHero
  image: StaticImageData
}) {
  return (
    <section
      aria-labelledby="web-chat-builder-title"
      className="pt-12 md:pt-16 lg:pt-20"
    >
      <div className="mx-auto grid max-w-320 items-center gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,544fr)_minmax(0,608fr)] lg:gap-16">
        <div className="min-w-0 lg:-translate-y-5">
          <div className="flex max-w-120 flex-col gap-4.5 md:mx-auto md:items-center md:text-center lg:mx-0 lg:items-start lg:text-left">
            <p className="flex items-center gap-3 text-[0.8125rem] leading-none font-medium text-purple-1 uppercase md:justify-center lg:justify-start">
              <span aria-hidden className="size-2.5 shrink-0 bg-purple-3" />
              {hero.eyebrow}
            </p>
            <h1
              id="web-chat-builder-title"
              className="text-4xl leading-[1.04] font-normal tracking-plus-tight text-white md:text-5xl xl:text-[3.5rem]"
            >
              {hero.title}
            </h1>
          </div>
          <p className="mt-6 text-base leading-normal tracking-tight text-gray-70 md:mx-auto md:mt-8 md:text-center md:text-lg md:leading-normal md:text-balance lg:mx-0 lg:max-w-115.5 lg:text-left">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center md:justify-center lg:mt-12 lg:flex-col lg:items-start lg:justify-start xl:flex-row xl:items-center">
            <CopyPromptButton
              value={hero.prompt}
              label={hero.promptLabel}
              showCopyIcon={false}
              size="none"
              className="h-11 w-full shrink-0 px-5 text-base leading-none font-medium tracking-tight sm:w-34"
            />
            <CopyCommand
              command={hero.command}
              className="min-w-0 sm:max-w-97"
              controlClassName="h-11 gap-0 border-gray-30 bg-black pl-3.5"
              commandClassName="font-geist-mono text-sm leading-none tracking-tighter text-white sm:text-base"
              copyButtonClassName="size-11 rounded-sm text-gray-70 [&_svg]:size-4"
            />
          </div>
        </div>
        <div className="@container relative mx-auto w-full max-w-152">
          <Image
            src={image}
            alt=""
            className="h-auto w-full"
            sizes="(min-width: 1280px) 608px, (min-width: 1024px) calc((100vw - 128px) * 0.528), (min-width: 648px) 608px, calc(100vw - 40px)"
            loading="eager"
          />
          {/* The artwork is shared between builders, so the badge that names
              this one is drawn over it, sized against the artwork itself. */}
          <span className="absolute top-[21.875cqw] left-[4.03cqw] flex items-center gap-[1.316cqw] rounded-[7.895cqw] bg-black/50 py-[0.658cqw] pr-[3.947cqw] pl-[1.316cqw] text-[3.289cqw] leading-none font-medium tracking-[-0.02em] text-white backdrop-blur-[20px]">
            <span className="flex size-[7.895cqw] shrink-0 items-center justify-center">
              <WebChatBuilderLogo
                className="size-[4.77cqw]"
                slug={hero.badge.logo}
              />
            </span>
            {hero.badge.label}
          </span>
        </div>
      </div>
      <CustomerLogos className="mt-10 border-transparent" />
    </section>
  )
}

export default WebChatBuilderHero
