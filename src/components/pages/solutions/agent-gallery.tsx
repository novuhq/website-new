import {
  AGENT_GALLERY_CARDS,
  AGENT_GALLERY_DESCRIPTION,
  AGENT_GALLERY_TITLE,
} from "@/data/pages/solutions/ai-agents-gallery"

import BentoCardBackground from "@/components/pages/home/bento-card-background"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"
import ChannelIcon from "@/components/pages/home/features/channel-icon"
import CliCommand from "@/components/pages/home/features/cli-command"
import MagicBento from "@/components/pages/home/magic-bento"

const CARD_GRADIENT =
  "radial-gradient(120% 110% at 85% 100%, rgba(93,52,168,0.22) 0%, rgba(28,20,46,0.1) 45%, rgba(11,12,14,0) 72%)"

function AgentGallery() {
  return (
    <section className="mt-20 font-inter md:mt-24 lg:mt-28">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <header>
          <h2 className="max-w-168 text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-3xl xl:text-4xl">
            {AGENT_GALLERY_TITLE}
          </h2>
          <p className="mt-4 max-w-161 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg">
            {AGENT_GALLERY_DESCRIPTION}
          </p>
        </header>

        <MagicBento
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          particles={false}
        >
          {AGENT_GALLERY_CARDS.map((card) => (
            <article
              className="magic-bento-card relative flex flex-col overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E] p-5 md:p-6"
              key={`${card.scenario}-${card.channel}`}
            >
              <BentoCardBackground backgroundImage={CARD_GRADIENT} />
              <div className="relative z-10 flex grow flex-col">
                <div className="flex items-center gap-2.5">
                  <ChannelIcon
                    channel={card.channel}
                    className="size-6"
                    isActive
                  />
                  <span className="text-sm leading-none font-medium tracking-tighter text-gray-50">
                    {card.channelLabel}
                  </span>
                </div>
                <h3 className="mt-4 text-lg/tight font-medium tracking-tighter text-foreground">
                  {card.scenario}
                </h3>
                <p className="mt-2.5 grow text-sm/normal font-normal tracking-tighter text-pretty text-gray-50 md:text-base">
                  {card.description}
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <CliCommand
                    command={card.command}
                    className="w-full rounded-md border-gray-30 bg-[#05050b] text-sm tracking-normal text-gray-80"
                  />
                  <CopyPromptButton
                    className="h-10 w-full px-4 text-sm leading-none font-medium tracking-tight normal-case [&_svg]:size-3.5"
                    variant="outline-transparent"
                    size="none"
                    value={card.prompt}
                  />
                </div>
              </div>
            </article>
          ))}
        </MagicBento>
      </div>
    </section>
  )
}

export default AgentGallery
