import Image from "next/image"
import {
  OWNERSHIP_CARDS,
  OWNERSHIP_TAGLINE_WORDS,
  type OwnershipCardCopy,
} from "@/data/pages/web-chat-ownership"
import bringAnyAgentIcon from "@/svgs/pages/channels/web-chat/ownership-bring-any-agent.svg"
import changeRuntimeIcon from "@/svgs/pages/channels/web-chat/ownership-change-runtime.svg"
import keepLogicIcon from "@/svgs/pages/channels/web-chat/ownership-keep-logic.svg"

/**
 * "We never run your brain." Figma `section` node `45487-81961`, desktop
 * only. Not personalized — no `HueLayer`, no `var(--wc-accent*)`.
 *
 * The tagline renders statically at full opacity, one span per word, so the
 * grey accent run (`text-gray-50`) starts exactly where Figma's does. A
 * scroll-triggered word reveal would dim that already-muted grey run to
 * near-invisible before it animates in.
 */
function OwnershipTagline() {
  return (
    <h2 className="max-w-[1120px] text-[28px] leading-[1.25] font-normal tracking-[-0.04em] text-balance md:text-[40px] xl:text-wrap">
      {OWNERSHIP_TAGLINE_WORDS.map((word, i) => (
        <span key={i} className={word.accent ? "text-gray-50" : "text-white"}>
          {word.text}
          {i < OWNERSHIP_TAGLINE_WORDS.length - 1 ? " " : ""}
          {word.text === "web" && <br className="hidden xl:block" />}
        </span>
      ))}
    </h2>
  )
}

const CARD_ICONS: Record<OwnershipCardCopy["id"], typeof bringAnyAgentIcon> = {
  "bring-any-agent": bringAnyAgentIcon,
  "change-runtime": changeRuntimeIcon,
  "keep-logic": keepLogicIcon,
}

function OwnershipCard({ id, title, body }: OwnershipCardCopy) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg bg-[#101114] px-5 py-5 md:px-6 lg:min-w-0 lg:flex-1">
      <div className="flex items-center gap-2.5">
        <Image
          alt=""
          aria-hidden
          className="size-6 shrink-0"
          src={CARD_ICONS[id]}
        />
        <span className="text-xl leading-none font-medium tracking-[-0.02em] text-white">
          {title}
        </span>
      </div>
      <p className="text-lg leading-[1.5] tracking-[-0.02em] text-gray-60">
        {body}
      </p>
    </div>
  )
}

function Ownership() {
  return (
    <section>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 md:gap-[72px] md:px-8 lg:max-w-336 xl:relative xl:left-8">
        <OwnershipTagline />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-6">
          {OWNERSHIP_CARDS.map((card) => (
            <OwnershipCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Ownership }
