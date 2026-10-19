import Image from "next/image"
import { WHY } from "@/data/pages/usecase-multi-channel"

import { cn } from "@/lib/utils"

import { CONTAINER, DESCRIPTION, HEADING, TitleLines } from "./shared"

/**
 * "Stop building a new integration" `45929-8060`. The 1216px card row sits
 * 32px inside the content box; the heading row sits 32px further in.
 */
export function MultiChannelWhy() {
  return (
    <section aria-labelledby="multi-channel-why-title">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:px-16">
          <h2
            id="multi-channel-why-title"
            className={cn(HEADING, "lg:max-w-152")}
          >
            {WHY.title}
          </h2>
          <p className={cn(DESCRIPTION, "lg:max-w-112 lg:pt-6")}>
            <TitleLines lines={WHY.descriptionLines} breakFrom="xl" />
          </p>
        </div>

        <ul
          className="mt-8 grid gap-4 md:mt-9 lg:grid-cols-3 xl:px-8"
          role="list"
        >
          {WHY.cards.map((card) => (
            <li
              key={card.title}
              className="flex flex-col gap-8 rounded-xl bg-card-surface p-6 lg:gap-20"
            >
              <Image alt="" aria-hidden className="size-8" src={card.icon} />
              <div className="flex flex-col gap-2">
                <h3 className="text-xl leading-none font-medium tracking-tighter text-white">
                  {card.title}
                </h3>
                <p className="text-base leading-normal tracking-tighter text-gray-60">
                  {card.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
