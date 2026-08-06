import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { Bell } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"
import AnimatedCopyCheck from "@/components/pages/home/animated-copy-check"
import BentoCardBackground, {
  type BentoCardBackgroundImage,
} from "@/components/pages/home/bento-card-background"
import InboxComponent from "@/components/pages/home/code-with-inbox/inbox/inbox-component"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"
import MagicBento from "@/components/pages/home/magic-bento"
import NotifyCodeTabs, {
  type INotifyCodeTab,
} from "@/components/pages/home/notify-code-tabs"

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
      className="relative isolate scroll-mt-25 overflow-hidden px-5 pt-16 font-inter md:px-8 md:pt-24 lg:pt-33"
    >
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

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-5">
          <Button
            className="h-11 w-full max-w-xs px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case sm:w-auto"
            size="none"
            asChild
          >
            <NextLink
              href={ROUTE.dashboardV2SignUp}
              target="_blank"
              rel="noopener noreferrer"
              data-click-location="notify_hero"
              data-click-text="start_for_free"
            >
              Start for free
            </NextLink>
          </Button>
          <CopyCommand
            className="w-full max-w-xs sm:w-70.5"
            controlClassName="pl-3"
            command={command}
            variant="highlighted"
            copiedContent={<AnimatedCopyCheck />}
          />
          <CopyPromptButton
            className="h-11 w-full max-w-xs px-5 text-base leading-none font-medium tracking-[-0.4px] normal-case sm:w-39 [&_svg]:!size-3.5"
            variant="outline-transparent"
            size="none"
            resetInterval={2000}
            value={prompt}
          />
        </div>
      </div>

      <MagicBento
        className="relative mx-auto mt-12 w-full max-w-3xl md:mt-16 lg:max-w-7xl lg:mb-24 xl:mb-48"
        particles={false}
      >
        <article className="magic-bento-card relative flex w-full flex-col overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E] p-5 pb-0 md:block md:h-118 md:p-0">
          <BentoCardBackground
            backgroundClassName="opacity-80"
            backgroundImage={card.backgroundImage}
          />
          <div className="relative flex min-w-0 flex-col md:contents">
            <div className="relative z-30 max-w-[26.5625rem] md:absolute md:top-[27px] md:left-[27px]">
              <h2 className="text-base leading-tight font-normal tracking-tighter text-foreground md:text-xl md:leading-none">
                {card.title}
              </h2>
              <p className="mt-2.5 text-sm leading-normal font-normal tracking-tighter text-pretty text-gray-50 md:w-80 md:text-base xl:w-114">
                {card.description}
              </p>
            </div>

            <NotifyCodeTabs
              className="relative z-10 mt-8 h-61 md:absolute md:bottom-0 md:left-7 md:mt-0 md:h-67 md:w-110 lg:w-124 xl:w-134"
              tabs={codeTabs}
            />
          </div>
        </article>

        {/* The bell breaks out of the card's top edge; the open Inbox hangs
            below its bottom edge, like a notification popover in a real app. */}
        <span
          className="notify-hero-bell absolute -top-5 right-8 z-20 hidden size-11 items-center justify-center rounded-full border border-gray-20 bg-[#101114] shadow-[0_8px_24px_rgba(0,0,0,0.6)] md:flex xl:right-14"
          aria-hidden="true"
        >
          <Bell className="size-5 text-foreground" />
          <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-[#FB3748] text-[10px] leading-none font-medium text-white">
            6
          </span>
        </span>

        <InboxComponent
          animateEntrance={false}
          className="notify-live-inbox zoom-[0.85] xl:zoom-[0.98] absolute top-10 right-8 m-0 hidden lg:block xl:right-14"
          themeTabsClassName="absolute top-40 left-7 m-0 hidden lg:flex"
          variant="home"
        />
      </MagicBento>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes notify-hero-bell-ring {
            0%, 82%, 100% { transform: rotate(0deg); }
            85% { transform: rotate(12deg); }
            88% { transform: rotate(-10deg); }
            91% { transform: rotate(7deg); }
            94% { transform: rotate(-4deg); }
            97% { transform: rotate(2deg); }
          }
          .notify-hero-bell svg {
            animation: notify-hero-bell-ring 6s ease-in-out infinite;
            transform-origin: 50% 0%;
          }
        }
      `}</style>
    </section>
  )
}

export default NotifyHero
