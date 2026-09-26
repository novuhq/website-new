import Image from "next/image"
import NextLink from "next/link"
import { getChannelBySlug } from "@/data/pages/channels"

import type { ISolutionPageData, ISolutionSection } from "@/types/solution"
import { cn } from "@/lib/utils"
import BentoCardBackground from "@/components/pages/home/bento-card-background"
import ConnectMascotEyes from "@/components/pages/home/connect-mascot-eyes"
import ChannelIcon from "@/components/pages/home/features/channel-icon"
import MagicBento from "@/components/pages/home/magic-bento"

// The five approved Connect channels, in display order. The channels registry
// may hold more entries (e.g. gated ones), so solutions pages list explicitly.
const CONNECT_CHANNEL_SLUGS = [
  "slack",
  "microsoft-teams",
  "whatsapp",
  "telegram",
  "email",
] as const

// Subtle glow for cards without a graphic, so text-only cards read as
// intentional bento tiles rather than empty boxes.
const CARD_GRADIENT =
  "radial-gradient(120% 110% at 85% 100%, rgba(93,52,168,0.25) 0%, rgba(28,20,46,0.1) 45%, rgba(11,12,14,0) 72%)"

const CONTAINER_CLASS_NAME =
  "mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl"

/**
 * Text-only sections render as a two-column spread (heading left, body and
 * bullets right) so they fill the desktop width, mirroring the homepage
 * Compliance composition.
 */
function ProseSection({ section }: { section: ISolutionSection }) {
  return (
    <div
      className={cn(
        CONTAINER_CLASS_NAME,
        "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-24"
      )}
    >
      <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-3xl xl:text-4xl">
        {section.heading}
      </h2>
      <div className="lg:pt-1">
        <p className="text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg xl:leading-[1.6]">
          {section.body}
        </p>
        {section.bullets?.length ? (
          <ul className="mt-6 flex flex-col gap-3.5">
            {section.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2.5 text-base leading-normal font-normal tracking-tighter text-gray-60"
              >
                <span
                  className="mt-2.25 size-1.5 shrink-0 rounded-xs bg-purple-3"
                  aria-hidden
                />
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

/** Stacked header for sections followed by a full-width grid. */
function GridSectionHeader({ section }: { section: ISolutionSection }) {
  return (
    <header>
      <h2 className="max-w-168 text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-3xl xl:text-4xl">
        {section.heading}
      </h2>
      <p className="mt-4 max-w-161 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg">
        {section.body}
      </p>
    </header>
  )
}

function CardsGrid({ section }: { section: ISolutionSection }) {
  const cards = section.cards ?? []
  const gridClassName =
    cards.length >= 4
      ? "sm:grid-cols-2 xl:grid-cols-4"
      : cards.length === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2"

  return (
    <MagicBento
      className={cn("mt-10 grid grid-cols-1 gap-5", gridClassName)}
      particles={false}
    >
      {cards.map((card) => (
        <article
          className="magic-bento-card relative flex min-h-72 flex-col overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E] md:min-h-80"
          key={card.title}
        >
          <BentoCardBackground backgroundImage={CARD_GRADIENT} />
          <div className="relative z-10 p-5 md:p-6">
            <h3 className="text-base/tight font-medium tracking-tighter text-foreground md:text-lg/tight">
              {card.title}
            </h3>
            <p className="mt-2.5 text-sm/normal font-normal tracking-tighter text-pretty text-gray-50 md:text-base">
              {card.body}
            </p>
          </div>
          {card.image ? (
            <>
              <Image
                className={cn(
                  "pointer-events-none absolute z-[1] h-auto max-w-none",
                  card.imageClassName
                )}
                src={card.image}
                alt=""
                quality={100}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                aria-hidden="true"
              />
              {card.mascotEyes ? (
                <ConnectMascotEyes className={card.imageClassName} />
              ) : null}
            </>
          ) : null}
        </article>
      ))}
    </MagicBento>
  )
}

function StatsGrid({ section }: { section: ISolutionSection }) {
  return (
    <MagicBento
      className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4"
      particles={false}
    >
      {(section.stats ?? []).map((stat) => (
        <article
          className="magic-bento-card relative flex min-h-44 flex-col justify-between gap-6 overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E] p-5 md:min-h-52 md:p-6"
          key={stat.label}
        >
          <BentoCardBackground backgroundImage={CARD_GRADIENT} />
          <span className="relative z-10 text-3xl leading-none font-normal tracking-[-0.04em] text-foreground md:text-5xl">
            {stat.value}
          </span>
          <span className="relative z-10 text-sm leading-normal font-normal tracking-tighter text-gray-50 md:text-base">
            {stat.label}
          </span>
        </article>
      ))}
    </MagicBento>
  )
}

function ChannelsGrid({ solutionSlug }: { solutionSlug: string }) {
  const channels = CONNECT_CHANNEL_SLUGS.map((slug) =>
    getChannelBySlug(slug)
  ).filter((channel) => channel !== undefined)

  return (
    <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
      {channels.map((channel) => (
        <li className="min-w-0" key={channel.slug}>
          <NextLink
            href={`/channels/${channel.slug}`}
            className="group flex h-36 min-w-0 flex-col items-center justify-center gap-3 rounded-xl border border-gray-20 bg-[#0B0C0E] px-3 text-center outline-none hover:border-gray-30 focus-visible:border-gray-40 focus-visible:ring-2 focus-visible:ring-lagune-3/40 md:h-44"
            aria-label={`Connect your agent to ${channel.channelName}`}
            data-click-location={`solution_${solutionSlug}_channels`}
            data-click-text={`channel_${channel.cliSlug}`}
          >
            <ChannelIcon
              channel={channel.cliSlug}
              className="size-9 md:size-11"
              isActive
            />
            <span className="text-sm leading-tight font-medium tracking-tighter text-gray-70 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white md:text-base">
              {channel.channelName}
            </span>
          </NextLink>
        </li>
      ))}
    </ul>
  )
}

function SolutionSections({ solution }: { solution: ISolutionPageData }) {
  return (
    <>
      {solution.sections.map((section) => {
        const variant = section.variant ?? "prose"

        return (
          <section
            key={section.heading}
            className="mt-16 font-inter md:mt-20 lg:mt-24"
          >
            {variant === "prose" ? (
              <ProseSection section={section} />
            ) : (
              <div className={CONTAINER_CLASS_NAME}>
                <GridSectionHeader section={section} />
                {variant === "cards" ? <CardsGrid section={section} /> : null}
                {variant === "stats" ? <StatsGrid section={section} /> : null}
                {variant === "channels" ? (
                  <ChannelsGrid solutionSlug={solution.slug} />
                ) : null}
              </div>
            )}
          </section>
        )
      })}
    </>
  )
}

export default SolutionSections
