import NextLink from "next/link"

import type { ISolutionPageData } from "@/types/solution"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"
import CliCommand from "@/components/pages/home/features/cli-command"

const BUTTON_CLASS_NAME =
  "h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"

function SolutionHero({ solution }: { solution: ISolutionPageData }) {
  const { hero, primaryCta, secondaryCta, command, prompt } = solution

  return (
    <section className="relative pt-18 font-inter md:pt-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-5 md:items-center md:px-8 md:text-center lg:max-w-7xl">
        <Badge
          className="mb-5 flex h-6 justify-center border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none tracking-tighter whitespace-nowrap text-purple-1"
          size="sm"
          variant="outline-muted"
        >
          {hero.eyebrow}
        </Badge>
        <h1 className="max-w-200 text-[2.5rem] leading-[1.1] font-normal tracking-[-0.04em] text-balance text-foreground md:text-5xl md:leading-[1.125] xl:text-[3.5rem]">
          {hero.heading}
        </h1>
        <p className="mt-4 max-w-176 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg xl:text-xl xl:leading-[1.5]">
          {hero.subheading}
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:w-auto md:justify-center">
          {command ? (
            <CliCommand
              command={command}
              className="w-full rounded-md border-gray-30 bg-[#05050b] text-base tracking-normal text-gray-80 sm:w-auto sm:min-w-70"
            />
          ) : null}
          {prompt ? (
            <CopyPromptButton
              className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-auto [&_svg]:!size-3.5"
              size="sm"
              value={prompt}
            />
          ) : null}
          {primaryCta ? (
            <Button
              size="none"
              variant="default"
              className={BUTTON_CLASS_NAME}
              asChild
            >
              <NextLink
                href={primaryCta.href}
                data-click-location={`solution_${solution.slug}_hero`}
                data-click-text="primary_cta"
              >
                {primaryCta.label}
              </NextLink>
            </Button>
          ) : null}
          {secondaryCta ? (
            <Button
              size="none"
              variant="outline-transparent"
              className={BUTTON_CLASS_NAME}
              asChild
            >
              <NextLink
                href={secondaryCta.href}
                data-click-location={`solution_${solution.slug}_hero`}
                data-click-text="secondary_cta"
              >
                {secondaryCta.label}
              </NextLink>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default SolutionHero
