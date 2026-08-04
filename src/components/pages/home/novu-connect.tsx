import Image, { type StaticImageData } from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import ConnectChannelArc from "./connect-channel-arc"
import ConnectMascotEyes from "./connect-mascot-eyes"
import CopyPromptButton from "./copy-prompt-button"
import MagicBento from "./magic-bento"

export interface INovuConnectItem {
  /** render the interactive channel arc instead of a static image */
  channelRing?: boolean
  description: string
  image?: StaticImageData
  imageClassName?: string
  imageSizes?: string
  label?: string
  /** overlay cursor-following eyes on the mascot in the image */
  mascotEyes?: boolean
  title: string
}

export interface INovuConnectProps {
  className?: string
  description: string
  items: INovuConnectItem[]
  label?: string
  prompt?: string
  title: string
}

const DEFAULT_PROMPT = `Connect this project's AI agent to customer channels (Slack, Microsoft Teams, WhatsApp, Telegram, Email, or iMessage) with Novu Connect.

Follow https://novu.co/agents.md end to end. Default to the non-interactive CLI (\`npx novu@latest connect … --ci\`).

Inspect the repo first. Ask me which channel to connect if it is not clear. Detect the framework/runtime from the project, or ask once. Then run one connect command per agents.md (bridge vs managed, keyless vs dashboard OAuth).

Prefer the secure setup links the CLI prints. Do not invent setup steps or ask for secrets in chat unless agents.md says that channel requires it (e.g. iMessage/Sendblue).`

function NovuConnect({
  className,
  label,
  title,
  description,
  items,
  prompt = DEFAULT_PROMPT,
}: INovuConnectProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section
      className={cn(
        "novu-connect mt-24 font-inter md:mt-28 lg:mt-32 xl:mt-50",
        className
      )}
    >
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <header className="grid grid-cols-1 lg:grid-cols-[48rem_minmax(0,1fr)] lg:items-start lg:gap-0">
          <div>
            {label && (
              <Badge
                className="mb-5 flex h-6 w-28 justify-center border-purple-3/40 bg-purple-3/30 px-2.5 py-1 text-sm leading-none tracking-tighter whitespace-nowrap text-purple-1"
                size="sm"
                variant="outline-muted"
              >
                {label}
              </Badge>
            )}
            <h2 className="max-w-168 text-[2rem] leading-[1.04] font-normal tracking-plus-tight text-balance text-foreground md:text-5xl xl:text-[3.25rem] xl:leading-[1.125]">
              {title}
            </h2>

            <p className="mt-4 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg lg:max-w-md xl:text-xl xl:leading-[1.875rem]">
              {description}
            </p>
          </div>

          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:mt-0 lg:items-end lg:justify-end lg:self-end lg:pb-2">
            <CopyPromptButton
              className="h-11 w-full rounded-md px-5 text-base leading-none font-medium tracking-tight normal-case sm:w-39 [&_svg]:size-3.5"
              size="sm"
              value={prompt}
            />
            <Button
              className="h-11 w-full rounded-md px-5 text-base leading-none font-medium tracking-tight normal-case sm:w-[7.8125rem]"
              variant="outline-transparent"
              size="sm"
              asChild
            >
              <NextLink href={ROUTE.aci}>What is ACI</NextLink>
            </Button>
          </div>
        </header>

        <MagicBento>
          <ul className="mt-12 flex flex-col flex-wrap gap-5 md:mt-16 lg:flex-row">
            {items.map((item, index) => {
              const isWide = index % 3 === 0

              return (
                <li
                  className={cn(
                    "magic-bento-card relative flex h-96 w-full min-w-0 grow flex-col overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E] p-5 md:p-7 lg:h-auto lg:w-auto lg:min-w-0 lg:grow-0",
                    isWide
                      ? "lg:aspect-[744/472] lg:basis-[calc(62.2074%_-_13px)]"
                      : "lg:aspect-[452/472] lg:basis-[calc(37.7926%_-_8px)]"
                  )}
                  key={`${item.title}-${index}`}
                >
                  <div className={cn("relative z-10", isWide && "max-w-152")}>
                    {item.label && (
                      <Badge className="mb-4" size="sm" variant="outline-muted">
                        {item.label}
                      </Badge>
                    )}
                    <h3 className="w-fit text-base leading-tight font-medium tracking-tighter text-foreground md:text-lg/tight xl:text-xl/tight">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-normal font-normal tracking-tighter text-gray-50 md:text-base">
                      {item.description}
                    </p>
                  </div>

                  {item.channelRing ? (
                    <ConnectChannelArc
                      className={item.imageClassName}
                      backgroundImage={item.image}
                      backgroundSizes={item.imageSizes}
                    />
                  ) : item.image ? (
                    <>
                      <Image
                        className={cn(
                          "pointer-events-none absolute h-auto",
                          item.imageClassName
                        )}
                        src={item.image}
                        alt=""
                        sizes={item.imageSizes}
                        quality={100}
                        aria-hidden="true"
                      />
                      {item.mascotEyes && (
                        <ConnectMascotEyes className={item.imageClassName} />
                      )}
                    </>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </MagicBento>
      </div>
    </section>
  )
}

export default NovuConnect
