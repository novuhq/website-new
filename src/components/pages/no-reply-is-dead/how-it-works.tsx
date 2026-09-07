import type { ReactNode } from "react"
import Image, { type StaticImageData } from "next/image"
import step01 from "@/images/pages/no-reply-is-dead/step-01.jpg"
import step02 from "@/images/pages/no-reply-is-dead/step-02.jpg"
import step03 from "@/images/pages/no-reply-is-dead/step-03.jpg"
import step04 from "@/images/pages/no-reply-is-dead/step-04.jpg"

import { cn } from "@/lib/utils"

const STEPS: {
  idx: string
  title: ReactNode
  body: string
  image: StaticImageData
  alt: string
}[] = [
  {
    idx: "01",
    title: "Assign an agent to the workflow",
    body: "In the workflow editor, flip Send & reply via agent and pick the agent. Its messages now go out on the agent’s own connected channels, and replies route straight back to it.",
    image: step01,
    alt: "A workflow notification step with “Send & reply via agent” switched on and Ada · Support chosen as the agent.",
  },
  {
    idx: "02",
    title: "The user just replies",
    body: "On the channel they are already on: Slack, WhatsApp, iMessage, Telegram, Microsoft Teams, or email. Novu matches the reply back by reply-to token, thread, or quoted message. No app, no portal, no “click here to respond”.",
    image: step02,
    alt: "An agent thread where the user asks to change the delivery address and the agent answers with the order already in context, above the channel icons the reply can arrive on.",
  },
  {
    idx: "03",
    title: "Your agent already has the context",
    body: "The conversation is hydrated once with the original notification. Custom Code agents read a typed ctx.notification. Managed Agents get the same context injected for them. No re-fetch, no “please provide your order number”.",
    image: step03,
    alt: "An agent.ts file reading ctx.notification, with the workflow payload typed and available.",
  },
  {
    idx: "04",
    title: (
      <>
        And the conversation <br className="hidden lg:inline" />
        keeps going
      </>
    ),
    body: "The reply is not a one-off. The user keeps talking, the agent keeps answering on the same thread, with the whole history in hand. It stays a live conversation for as long as they need, not a ticket that closes.",
    image: step04,
    alt: "The same thread continuing, with the agent confirming a new delivery address and offering a heads-up when it ships.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="mt-24 scroll-mt-24 md:mt-32 lg:mt-44.75">
      <div className="mx-auto max-w-320 px-5 md:px-8 2xl:px-0">
        <div className="mx-auto max-w-184 text-center">
          <h2 className="text-[2rem] leading-[1.13] font-normal tracking-plus-tight text-balance text-white md:text-[2.75rem] lg:text-[3.5rem]">
            One toggle on the workflow. <br className="hidden lg:inline" />
            The reply does the rest.
          </h2>
          <p className="mt-5 text-base leading-[1.5] tracking-tighter text-gray-60 md:text-xl lg:mt-7">
            No inbound webhook, reply parser, or context store needed. Novu
            matches <br className="hidden lg:inline" />
            the reply, loads the original payload, and passes it to your agent.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-20 lg:mt-18 lg:gap-26">
          {STEPS.map((step, i) => (
            <div
              key={step.idx}
              className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16"
            >
              <Image
                src={step.image}
                alt={step.alt}
                width={608}
                height={532}
                className={cn(
                  "w-full rounded-2xl border border-illustration-border lg:w-152 lg:shrink-0",
                  i % 2 === 1 && "lg:order-2"
                )}
                sizes="(min-width: 1280px) 608px, (min-width: 768px) calc(50vw - 4rem), 100vw"
              />
              <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                <div className="text-[0.8125rem] leading-none font-medium tracking-normal text-purple-1 uppercase">
                  Step {step.idx}
                </div>
                <h3 className="mt-4 max-w-136 text-[1.75rem] leading-[1.13] font-normal tracking-plus-tight text-white md:text-[2rem] lg:text-[2.5rem]">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-136 text-base leading-[1.5] tracking-tight text-gray-70 md:text-lg">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
