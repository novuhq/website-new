import Image from "next/image"

import { highlightEchoCode } from "@/lib/shiki"
import { cn } from "@/lib/utils"

import { LandingButtonLink } from "./action-link"
import type { CodeSectionData } from "./types"

interface CodeShowcaseProps extends CodeSectionData {
  className?: string
  codeBlockSize?: "large" | "medium"
  codeDotsSrc: string
  primaryAction?: boolean
}

export async function CodeShowcase({
  action,
  className,
  code,
  codeBlockSize = "medium",
  codeDotsSrc,
  description,
  primaryAction = false,
  title,
}: CodeShowcaseProps) {
  const highlightedCode = await highlightEchoCode(code)
  const isLarge = codeBlockSize === "large"

  return (
    <section className={className ?? "mt-20 md:mt-25 lg:mt-30 xl:mt-60"}>
      <div
        className={cn(
          "mx-auto flex w-full max-w-304 flex-col items-center gap-y-12 px-5 md:px-8 lg:flex-row lg:gap-x-16",
          isLarge && "xl:max-w-368 xl:gap-x-30.5"
        )}
      >
        <div
          className={cn(
            "relative order-2 w-full max-w-130 rounded-[20px] bg-[linear-gradient(145deg,hsl(var(--gray-5)),hsl(var(--gray-2)))] p-px md:max-w-168 lg:order-1 lg:max-w-133 xl:max-w-168",
            isLarge && "2xl:max-w-201.5"
          )}
        >
          <div className="relative z-10 h-full w-full [transform:translateZ(0)] overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#16222e,#080c1a_54%,hsl(var(--background)))] p-4 md:p-5">
            <div
              className="pointer-events-none absolute inset-4 rounded-xl bg-[radial-gradient(circle_at_15%_0%,rgba(103,219,255,0.18),transparent_42%)] md:inset-5"
              aria-hidden
            />
            <div
              className="echo-code numbered-lines scrollbar-hidden relative z-10 max-h-[38rem] overflow-auto rounded-xl bg-[linear-gradient(150deg,rgba(22,34,46,0.92),rgba(5,5,11,0.96))] [mask-image:linear-gradient(270deg,transparent_1%,#fff_15%)] p-4 text-[10px] leading-relaxed font-normal shadow-2xl md:p-5 md:text-xs lg:text-[13px] xl:text-sm [&_.shiki]:!bg-transparent [&_pre]:m-0 [&_pre]:!bg-transparent"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/4 bg-gradient-to-b from-transparent to-background"
              aria-hidden
            />
          </div>
          <Image
            className="pointer-events-none absolute top-[-102px] left-0 max-w-none select-none"
            src={codeDotsSrc}
            alt=""
            width={482}
            height={206}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-[-52px] left-[-125px] h-87 w-122.5 rounded-full bg-[radial-gradient(circle,#3bdcff_0%,#4759ff_100%)] opacity-20 blur-[100px]"
            aria-hidden
          />
        </div>

        <div
          className={cn(
            "relative z-10 order-1 max-w-lg text-center lg:order-2 lg:text-left",
            isLarge ? "xl:max-w-104" : "xl:max-w-120"
          )}
        >
          <h2 className="text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:text-[32px] lg:text-[40px] xl:text-[48px]">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-normal tracking-tighter text-pretty text-gray-8 lg:text-lg">
            {description}
          </p>
          {action ? (
            <LandingButtonLink
              className="mt-8"
              action={action}
              secondary={!primaryAction}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
