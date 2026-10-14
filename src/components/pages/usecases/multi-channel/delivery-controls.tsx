import Image from "next/image"
import { DELIVERY_CONTROLS } from "@/data/pages/usecase-multi-channel"

import { cn } from "@/lib/utils"

import { CONTAINER, DESCRIPTION, HEADING, TitleLines } from "./shared"

/**
 * "Control delivery from one place" `45929-10729`. Four joined cards that
 * alternate `#101114` and `#0B0C0E`; only the outer corners are rounded.
 */
export function MultiChannelDeliveryControls() {
  return (
    <section aria-labelledby="multi-channel-delivery-title">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:px-16">
          <h2
            id="multi-channel-delivery-title"
            className={cn(HEADING, "lg:max-w-152")}
          >
            <TitleLines lines={DELIVERY_CONTROLS.titleLines} />
          </h2>
          <p className={cn(DESCRIPTION, "lg:max-w-145 lg:pt-12.5")}>
            {DELIVERY_CONTROLS.description}
          </p>
        </div>

        <div className="mt-8 md:mt-12 xl:px-8">
          <ul
            className="grid overflow-hidden rounded-xl md:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {DELIVERY_CONTROLS.cards.map((card) => (
              <li
                key={card.title}
                className="flex flex-col gap-8 bg-card-surface p-6 even:bg-[#0B0C0E] lg:gap-20.5"
              >
                <Image alt="" aria-hidden className="size-8" src={card.icon} />
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl leading-[1.25] font-medium tracking-tighter text-white">
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
      </div>
    </section>
  )
}
