import { Badge } from "@/components/ui/badge"
import { CopyCommand } from "@/components/ui/copy-command"
import AnimatedCopyCheck from "@/components/pages/home/animated-copy-check"
import type { BentoCardBackgroundImage } from "@/components/pages/home/bento-card-background"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"
import MagicBento from "@/components/pages/home/magic-bento"
import type { INotifyCodeTab } from "@/components/pages/home/notify-code-tabs"
import NotifyFeaturedCard from "@/components/pages/home/notify-featured-card"

interface INotifyHeroCard {
  backgroundImage: BentoCardBackgroundImage
  description: string
  title: string
}

interface INotifyHeroProps {
  card: INotifyHeroCard
  codeTabs: INotifyCodeTab[]
  command: string
  description: string
  label: string
  prompt: string
  title: string
}

function NotifyHero({
  card,
  codeTabs,
  command,
  description,
  label,
  prompt,
  title,
}: INotifyHeroProps) {
  return (
    <section
      id="notify"
      className="relative isolate scroll-mt-25 overflow-hidden pt-16 font-inter md:pt-24 lg:pt-33"
    >
      <div className="px-5 md:px-8">
        <div className="mx-auto flex w-full max-w-210.5 flex-col items-center text-center">
          <Badge
            className="mb-5 flex h-6 justify-center border-blue-3/40 bg-blue-3/30 px-2.5 py-1.25 text-sm leading-none tracking-tighter whitespace-nowrap text-blue-1"
            size="sm"
            variant="outline-muted"
          >
            {label}
          </Badge>

          <h1 className="w-full text-[2.5rem] leading-[1.125] font-normal tracking-plus-tight text-balance text-foreground md:text-[3.25rem] lg:text-[4rem]">
            {title}
          </h1>

          <p className="mt-4 max-w-151.5 text-base font-normal tracking-tighter text-balance text-gray-60 lg:text-xl/normal">
            {description}
          </p>

          {/* Sign-up lives in the header ("Sign up now", same ROUTE), so the
              hero keeps the homepage pair: install command + copy prompt. */}
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-5">
            <CopyCommand
              className="w-full sm:w-70.5"
              controlClassName="pl-3"
              command={command}
              variant="highlighted"
              copiedContent={<AnimatedCopyCheck />}
            />
            <CopyPromptButton
              className="h-11 w-full px-5 text-base leading-none font-medium tracking-[-0.4px] normal-case sm:w-39 [&_svg]:!size-3.5"
              variant="outline-transparent"
              size="none"
              resetInterval={2000}
              value={prompt}
            />
          </div>
        </div>
      </div>

      {/* Same container as the homepage Novu Notify section and as every
          section below, so the card lines up with the page's content grid. */}
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <MagicBento className="mt-12 md:mt-16" particles={false}>
          <NotifyFeaturedCard
            {...card}
            codeTabs={codeTabs}
            headingLevel="h2"
            liveInbox
          />
        </MagicBento>
      </div>
    </section>
  )
}

export default NotifyHero
