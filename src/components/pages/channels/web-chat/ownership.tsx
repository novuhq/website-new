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
 * §9 "We never run your brain." (Task 16). Figma `section` node
 * `45487-81961`, desktop only. Not personalized — no `HueLayer`, no
 * `var(--wc-accent*)`.
 *
 * Not mounted by this task: the integration pass wires it into
 * `page.tsx`.
 *
 * Deliberately NOT using `TaglineReveal` here (see that component's export
 * for the generalized `words` prop this task added). Verified against a
 * rendered, un-hydrated snapshot: `TaglineReveal` SSRs every word's
 * `initial={{opacity: 0.22}}` inline (confirmed in the served HTML —
 * `style="opacity:0.22"` on every span, accent and non-accent alike) and,
 * since `useInView` never fires without hydration, that initial value is
 * the permanent, only state real visitors see. For the *white* run that
 * composites to ~rgb(56,56,56) on black — dim but readable, the behaviour
 * the component was designed around. For this section's *grey* run the
 * base colour is already muted (`#707280`/`text-gray-50`, itself a
 * body-text grey, not nearly as bright as the old copy's purple accent);
 * compounding another ×0.22 on top composites to ~rgb(25,25,28) on black,
 * which in the actual screenshot is indistinguishable from the background —
 * i.e. invisible, not "faint." That is exactly the `Reveal` failure mode
 * this task warned about, just short of literal 0. So the whole line is
 * rendered statically, at full opacity, matching Figma exactly at all
 * times instead of only after a hydration that this app confirms doesn't
 * happen. `OWNERSHIP_TAGLINE_WORDS` still carries the per-word split the
 * brief asked for (useful documentation of exactly where the accent begins)
 * even though this render collapses it into two runs.
 */
function OwnershipTagline() {
  return (
    <h2 className="max-w-[1120px] text-[28px] leading-[1.25] font-normal tracking-[-0.04em] text-balance md:text-[40px]">
      {OWNERSHIP_TAGLINE_WORDS.map((word, i) => (
        <span key={i} className={word.accent ? "text-gray-50" : "text-white"}>
          {word.text}
          {i < OWNERSHIP_TAGLINE_WORDS.length - 1 ? " " : ""}
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
    <div className="flex flex-col gap-2.5 rounded-lg bg-[#101114] px-5 py-5 md:flex-1 md:px-6">
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
    <section className="mt-24 md:mt-32">
      <div className="container mx-auto flex max-w-[1280px] flex-col gap-10 px-5 md:gap-[72px] md:px-8">
        <OwnershipTagline />

        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
          {OWNERSHIP_CARDS.map((card) => (
            <OwnershipCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Ownership }
