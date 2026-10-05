import Image from "next/image"

import { Link } from "@/components/ui/link"
import { LinkInlineArrow } from "@/components/ui/link-inline-arrow"

import type { IndexGoal } from "./types"

interface GoalCardsProps {
  cards: readonly IndexGoal[]
  description: string
  title: string
}

function GoalCards({ cards, description, title }: GoalCardsProps) {
  return (
    <section className="relative mt-20 md:mt-25 lg:mt-30 xl:mt-40">
      <Image
        className="pointer-events-none absolute top-1/2 left-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
        src="/images/pages/usecases/index/shared/goals-background.svg"
        alt=""
        width={1652}
        height={928}
        sizes="1652px"
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-304 px-4 md:px-7 lg:px-10 2xl:px-0">
        <h2 className="mx-auto max-w-[700px] text-center text-3xl leading-[1.125] font-medium tracking-tighter text-white md:text-[32px] lg:text-5xl xl:text-[44px]">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-[710px] text-center text-base leading-normal font-[350] tracking-tighter text-gray-8 lg:mt-4 lg:text-lg">
          {description}
        </p>
        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-7 xl:grid-cols-3 xl:gap-8">
          {cards.map((card) => (
            <li
              key={card.title}
              className="min-h-60 rounded-xl bg-[linear-gradient(215.33deg,rgba(51,51,71,0.6)_20.1%,rgba(43,43,59,0.4)_75.75%)]"
            >
              <Link
                className="group m-px flex h-[calc(100%-2px)] w-[calc(100%-2px)] flex-col items-start rounded-xl bg-[#0F0F15] p-6 xl:p-7"
                href={card.action.href}
                variant="clean"
                size="none"
                data-click-location="usecases_goals"
                data-click-text={card.title.toLowerCase().replaceAll(" ", "_")}
              >
                <h3 className="text-xl leading-[1.125] font-medium tracking-tighter text-white xl:text-3xl">
                  {card.title}
                </h3>
                <p className="mt-2 text-left leading-snug font-light tracking-tighter text-gray-8 md:mt-2.5">
                  {card.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] leading-snug tracking-normal text-primary md:mt-4 lg:mt-auto">
                  {card.action.label}
                  <LinkInlineArrow lineClassName="bg-primary-muted" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default GoalCards
